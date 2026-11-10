from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
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
    WebinarRegistration, NewsletterSubscriber, Project, Partner
)
from app.api.deps import get_current_admin
from app.schemas.webinars import WebinarOut
from app.schemas.projects import ProjectOut, ProjectCreate
from app.schemas.partners import PartnerOut, PartnerCreate, PartnerUpdate

router = APIRouter(prefix="/admin/data", tags=["admin_data"])

# --- SCHEMAS ---
class WebinarCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    host: str
    image_url: str
    join_url: str | None = None
    replay_url: str | None = None
    status: str = "upcoming"


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


# --- CAREER APPLICATIONS ---
@router.get("/applications")
async def get_applications(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(CareerApplication).order_by(desc(CareerApplication.created_at))
    rows = await db.scalars(stmt)
    return rows.all()


@router.get("/cv/{cv_id}")
async def download_cv(cv_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    cv = await db.get(CvFile, cv_id)
    if not cv:
        raise HTTPException(404, "CV not found")
    file_path = Path("storage/cvs") / cv.storage_key
    if not file_path.exists():
        raise HTTPException(404, "File missing from disk")
    return FileResponse(path=file_path, filename=cv.original_filename, media_type=cv.mime_type)


# --- WEBINARS ---
@router.get("/webinars", response_model=list[WebinarOut])
async def admin_get_webinars(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(Webinar).order_by(desc(Webinar.created_at))
    rows = await db.scalars(stmt)
    return rows.all()


@router.post("/webinars", response_model=WebinarOut)
async def admin_create_webinar(payload: WebinarCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = Webinar(**payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/webinars/{webinar_id}")
async def admin_delete_webinar(webinar_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Webinar, webinar_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}


WEBINAR_IMAGES_DIR = Path("storage/webinars")
WEBINAR_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

MAX_IMAGE_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


@router.post("/webinars/upload-image")
async def upload_webinar_image(file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "Image must be JPG, PNG, or WebP")
    contents = await file.read()
    if not contents:
        raise HTTPException(400, "Image file is empty")
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "Image must be under 5 MB")
    ext = ALLOWED_IMAGE_TYPES[file.content_type]
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
    data = payload.model_dump()
    data["gallery"] = json.dumps(data.pop("gallery", []))
    data["technologies"] = json.dumps(data.pop("technologies", []))
    for k, v in data.items():
        setattr(row, k, v)
    await db.commit()
    await db.refresh(row)
    return ProjectOut.from_model(row)


@router.delete("/projects/{project_id}")
async def admin_delete_project(project_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Project, project_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}


@router.post("/projects/upload-image")
async def upload_project_image(file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "Image must be JPG, PNG, or WebP")
    contents = await file.read()
    if not contents:
        raise HTTPException(400, "Image file is empty")
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "Image must be under 5 MB")
    ext = ALLOWED_IMAGE_TYPES[file.content_type]
    filename = f"{uuid.uuid4()}{ext}"
    (PROJECT_IMAGES_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/projects/{filename}"}


# --- NEWSLETTER ---
@router.get("/newsletter")
async def admin_list_newsletter(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    stmt = select(NewsletterSubscriber).order_by(desc(NewsletterSubscriber.created_at))
    rows = await db.scalars(stmt)
    return rows.all()


@router.post("/newsletter")
async def admin_add_newsletter(payload: NewsletterAddIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    existing = await db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email.lower()))
    if existing:
        raise HTTPException(400, "This email is already subscribed")
    row = NewsletterSubscriber(email=payload.email.lower(), confirmed=True)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


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
async def upload_partner_logo(file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "Logo must be JPG, PNG, or WebP")
    contents = await file.read()
    if not contents:
        raise HTTPException(400, "File is empty")
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "File must be under 5 MB")
    ext = ALLOWED_IMAGE_TYPES[file.content_type]
    filename = f"{uuid.uuid4()}{ext}"
    (PARTNER_LOGOS_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/partners/{filename}"}