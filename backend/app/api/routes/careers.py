import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import CareerApplication, CvFile, JobOpening
from app.schemas.forms import SubmissionOut
from app.core.email import send_application_received, send_application_notification
from email_validator import EmailNotValidError, validate_email

from app.core.files import CV_TYPES, EXTENSIONS, read_validated_upload
from app.core.rate_limit import UPLOAD_LIMIT, limiter

router = APIRouter(prefix="/careers", tags=["careers"])
STORAGE_DIR = Path("storage/cvs")
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
MAX_CV_BYTES = 5 * 1024 * 1024

MIN_COVER_LETTER = 50


async def _validate_document(upload: UploadFile, label: str) -> tuple[bytes, str]:
    """Check magic bytes and size of a PDF/DOC/DOCX upload."""
    return await read_validated_upload(upload, CV_TYPES, MAX_CV_BYTES, label, "a PDF, DOC, or DOCX file")


async def _store_document(db: AsyncSession, upload: UploadFile, contents: bytes, mime: str, label: str) -> CvFile:
    storage_key = f"{uuid.uuid4()}{EXTENSIONS[mime]}"
    (STORAGE_DIR / storage_key).write_bytes(contents)
    row = CvFile(original_filename=(upload.filename or label.lower())[:255], storage_key=storage_key, mime_type=mime, size_bytes=len(contents))
    db.add(row)
    await db.flush()
    return row


@router.post("/apply", response_model=SubmissionOut, status_code=201)
@limiter.limit(UPLOAD_LIMIT)
async def apply(
    request: Request,
    job_slug: str = Form(..., min_length=1, max_length=120),
    full_name: str = Form(..., min_length=1, max_length=120),
    email: str = Form(..., min_length=3, max_length=320),
    phone: str | None = Form(None, max_length=40),
    cover_letter: str | None = Form(None, max_length=5000),
    cv: UploadFile = File(...),
    cover_letter_file: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
):
    job = await db.scalar(select(JobOpening).where(JobOpening.slug == job_slug, JobOpening.status == "open"))
    if not job:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This role is no longer accepting applications")

    # Validate before storing anything: the confirmation email goes to this address.
    try:
        email = validate_email(email, check_deliverability=False).normalized.lower()
    except EmailNotValidError:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Please enter a valid email address")

    cover_letter = (cover_letter or "").strip() or None
    has_letter_file = cover_letter_file is not None and bool(cover_letter_file.filename)
    if not has_letter_file and (not cover_letter or len(cover_letter) < MIN_COVER_LETTER):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"Please write a cover letter (at least {MIN_COVER_LETTER} characters) or upload one",
        )

    # Validate every file before writing any of them to disk.
    cv_data = await _validate_document(cv, "CV")
    letter_data = await _validate_document(cover_letter_file, "Cover letter") if has_letter_file else None

    cv_row = await _store_document(db, cv, *cv_data, "CV")
    letter_row = await _store_document(db, cover_letter_file, *letter_data, "Cover letter") if letter_data else None

    app_row = CareerApplication(
        full_name=full_name.strip(),
        email=email,
        phone=(phone or "").strip() or None,
        role_slug=job.title[:80],
        job_id=job.id,
        cover_letter=cover_letter,
        cv_file_id=cv_row.id,
        cover_letter_file_id=letter_row.id if letter_row else None,
        status="received",
    )
    db.add(app_row)
    await db.commit()
    await db.refresh(app_row)

    await send_application_received(name=full_name, email=email, role=job.title)
    await send_application_notification(name=full_name, email=email, role=job.title, phone=phone)
    return app_row
