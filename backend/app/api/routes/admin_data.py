from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from pathlib import Path
import uuid
import json

from app.db.session import get_db
from app.models import (
    User, ContactMessage, CareerApplication, CvFile, Webinar,
    WebinarRegistration, NewsletterSubscriber, NewsletterAnnouncement, Project, Partner
)
from app.api.deps import get_current_admin
from app.services.newsletter import queue_announcement
from app.core.files import EXTENSIONS, IMAGE_TYPES, read_validated_upload
from app.core.rate_limit import ADMIN_UPLOAD_LIMIT, limiter
from app.schemas.projects import ProjectOut, ProjectCreate
from app.schemas.partners import PartnerOut, PartnerCreate, PartnerUpdate

router = APIRouter(prefix="/admin/data", tags=["admin_data"])

# --- SCHEMAS ---
class ProjectUpdate(ProjectCreate):
    pass


class NewsletterAddIn(BaseModel):
    email: EmailStr


# --- CONTACT MESSAGES ---
@router.get("/messages")
async def get_messages(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(ContactMessage).order_by(desc(ContactMessage.created_at))
    rows = await db.scalars(stmt)
    return rows.all()


# --- CAREER APPLICATIONS (list/update/delete live in admin_jobs.py) ---
@router.get("/cv/{cv_id}")
async def download_cv(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    cv = await db.get(CvFile, cv_id)
    if not cv:
        raise HTTPException(404, "CV not found")
    file_path = Path("storage/cvs") / cv.storage_key
    if not file_path.exists():
        raise HTTPException(404, "File missing from disk")
    return FileResponse(path=file_path, filename=cv.original_filename, media_type=cv.mime_type)


# --- WEBINARS ---
WEBINAR_IMAGES_DIR = Path("storage/webinars")
WEBINAR_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

MAX_IMAGE_BYTES = 5 * 1024 * 1024


@router.post("/webinars/upload-image")
@limiter.limit(ADMIN_UPLOAD_LIMIT)
async def upload_webinar_image(request: Request, file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    contents, mime = await read_validated_upload(file, IMAGE_TYPES, MAX_IMAGE_BYTES, "Image", "a JPG, PNG, or WebP image")
    ext = EXTENSIONS[mime]
    filename = f"{uuid.uuid4()}{ext}"
    (WEBINAR_IMAGES_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/webinars/{filename}"}


# --- DASHBOARD ---
@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    return {
        "messages": await db.scalar(select(func.count(ContactMessage.id))) or 0,
        "applications": await db.scalar(select(func.count(CareerApplication.id))) or 0,
        "webinars": await db.scalar(select(func.count(WebinarRegistration.id))) or 0,
        "newsletter": await db.scalar(select(func.count(NewsletterSubscriber.id))) or 0,
    }


@router.get("/chart")
async def get_dashboard_chart(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    today = datetime.now(timezone.utc).date()
    start_date = today - timedelta(days=6)

    msgs = await db.scalars(select(ContactMessage.created_at).where(func.date(ContactMessage.created_at) >= start_date))
    msg_dates = [row.date() for row in msgs]

    apps = await db.scalars(select(CareerApplication.created_at).where(func.date(CareerApplication.created_at) >= start_date))
    app_dates = [row.date() for row in apps]

    chart_data = []
    for i in range(7):
        d = start_date + timedelta(days=i)
        chart_data.append({
            "name": d.strftime("%a"),
            "messages": msg_dates.count(d),
            "applications": app_dates.count(d),
        })
    return chart_data


# --- PROJECTS ---
PROJECT_IMAGES_DIR = Path("storage/projects")
PROJECT_IMAGES_DIR.mkdir(parents=True, exist_ok=True)


async def _announce_project(db: AsyncSession, row: Project) -> None:
    if row.status == "published":
        await queue_announcement(
            db, kind="project", ref_id=row.id, title=row.title, summary=row.description,
            path=f"/projects/{row.slug}", image_url=row.image_url,
        )


@router.get("/projects", response_model=list[ProjectOut])
async def admin_list_projects(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(Project).order_by(desc(Project.created_at))
    rows = await db.scalars(stmt)
    return [ProjectOut.from_model(r) for r in rows.all()]


@router.post("/projects", response_model=ProjectOut)
async def admin_create_project(payload: ProjectCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    existing = await db.scalar(select(Project).where(Project.slug == payload.slug))
    if existing:
        raise HTTPException(400, "A project with that slug already exists")
    data = payload.model_dump()
    data["gallery"] = json.dumps(data.pop("gallery", []))
    data["technologies"] = json.dumps(data.pop("technologies", []))
    row = Project(**data)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    await _announce_project(db, row)
    return ProjectOut.from_model(row)


@router.patch("/projects/{project_id}", response_model=ProjectOut)
async def admin_update_project(project_id: str, payload: ProjectUpdate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Project, project_id)
    if not row:
        raise HTTPException(404, "Project not found")
    # Check slug uniqueness if it changed
    if row.slug != payload.slug:
        existing = await db.scalar(select(Project).where(Project.slug == payload.slug))
        if existing:
            raise HTTPException(400, "A project with that slug already exists")
    was_published = row.status == "published"
    data = payload.model_dump()
    data["gallery"] = json.dumps(data.pop("gallery", []))
    data["technologies"] = json.dumps(data.pop("technologies", []))
    for k, v in data.items():
        setattr(row, k, v)
    await db.commit()
    await db.refresh(row)
    if not was_published:  # first publish only; edits never re-announce
        await _announce_project(db, row)
    return ProjectOut.from_model(row)


@router.delete("/projects/{project_id}")
async def admin_delete_project(project_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Project, project_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}


@router.post("/projects/upload-image")
@limiter.limit(ADMIN_UPLOAD_LIMIT)
async def upload_project_image(request: Request, file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    contents, mime = await read_validated_upload(file, IMAGE_TYPES, MAX_IMAGE_BYTES, "Image", "a JPG, PNG, or WebP image")
    ext = EXTENSIONS[mime]
    filename = f"{uuid.uuid4()}{ext}"
    (PROJECT_IMAGES_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/projects/{filename}"}


# --- NEWSLETTER ---
SUBSCRIBER_FIELDS = ("id", "email", "confirmed", "created_at", "unsubscribed_at")  # never the unsubscribe token


@router.get("/newsletter")
async def admin_list_newsletter(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(NewsletterSubscriber).order_by(desc(NewsletterSubscriber.created_at))
    rows = await db.scalars(stmt)
    return [{f: getattr(r, f) for f in SUBSCRIBER_FIELDS} for r in rows.all()]


@router.get("/newsletter/announcements")
async def admin_list_announcements(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    rows = await db.scalars(select(NewsletterAnnouncement).order_by(desc(NewsletterAnnouncement.created_at)).limit(100))
    return [
        {
            "id": r.id, "kind": r.kind, "title": r.title, "path": r.path, "status": r.status,
            "send_after": r.send_after, "sent_at": r.sent_at, "sent_count": r.sent_count, "note": r.note,
        }
        for r in rows.all()
    ]


@router.post("/newsletter/announcements/{announcement_id}/retry")
async def admin_retry_announcement(announcement_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Resume a failed update; subscribers already emailed are skipped."""
    row = await db.get(NewsletterAnnouncement, announcement_id)
    if not row:
        raise HTTPException(404, "Update not found")
    if row.status != "failed":
        raise HTTPException(409, f"Only failed updates can be retried (this one is {row.status})")
    row.status, row.note = "queued", None
    await db.commit()
    return {"status": "queued"}


@router.post("/newsletter/announcements/{announcement_id}/cancel")
async def admin_cancel_announcement(announcement_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Stop an update email that has not started sending yet."""
    row = await db.get(NewsletterAnnouncement, announcement_id)
    if not row:
        raise HTTPException(404, "Update not found")
    if row.status != "queued":
        raise HTTPException(409, f"This update is already {row.status} and can't be cancelled")
    row.status, row.note = "cancelled", "Cancelled from the admin console"
    await db.commit()
    return {"status": "cancelled"}


@router.post("/newsletter")
async def admin_add_newsletter(payload: NewsletterAddIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    existing = await db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email.lower()))
    if existing:
        raise HTTPException(400, "This email is already subscribed")
    row = NewsletterSubscriber(email=payload.email.lower(), confirmed=True)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return {f: getattr(row, f) for f in SUBSCRIBER_FIELDS}


@router.delete("/newsletter/{sub_id}")
async def admin_delete_newsletter(sub_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(NewsletterSubscriber, sub_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}

# --- PARTNERS ---
PARTNER_LOGOS_DIR = Path("storage/partners")
PARTNER_LOGOS_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/partners", response_model=list[PartnerOut])
async def admin_list_partners(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(Partner).order_by(Partner.display_order.asc(), Partner.created_at.asc())
    rows = await db.scalars(stmt)
    return rows.all()


@router.post("/partners", response_model=PartnerOut)
async def admin_create_partner(payload: PartnerCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = Partner(**payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.patch("/partners/{partner_id}", response_model=PartnerOut)
async def admin_update_partner(partner_id: str, payload: PartnerUpdate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Partner, partner_id)
    if not row:
        raise HTTPException(404, "Partner not found")
    for k, v in payload.model_dump().items():
        setattr(row, k, v)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/partners/{partner_id}")
async def admin_delete_partner(partner_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Partner, partner_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}


@router.post("/partners/upload-logo")
@limiter.limit(ADMIN_UPLOAD_LIMIT)
async def upload_partner_logo(request: Request, file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    contents, mime = await read_validated_upload(file, IMAGE_TYPES, MAX_IMAGE_BYTES, "Logo", "a JPG, PNG, or WebP image")
    ext = EXTENSIONS[mime]
    filename = f"{uuid.uuid4()}{ext}"
    (PARTNER_LOGOS_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/partners/{filename}"}