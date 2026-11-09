import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import CareerApplication, CvFile
from app.schemas.forms import SubmissionOut

router = APIRouter(prefix="/careers", tags=["careers"])
STORAGE_DIR = Path("storage/cvs")
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
MAX_CV_BYTES = 5 * 1024 * 1024
ALLOWED_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
EXT_BY_MIME = {"application/pdf": ".pdf", "application/msword": ".doc", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"}

@router.post("/apply", response_model=SubmissionOut, status_code=201)
async def apply(
    full_name: str = Form(..., min_length=1, max_length=120),
    email: str = Form(..., min_length=3, max_length=320),
    phone: str | None = Form(None, max_length=40),
    role_slug: str = Form(..., min_length=1, max_length=80),
    cover_letter: str | None = Form(None, max_length=5000),
    cv: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if cv.content_type not in ALLOWED_TYPES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "CV must be PDF, DOC, or DOCX")
    contents = await cv.read()
    if not contents: raise HTTPException(status.HTTP_400_BAD_REQUEST, "CV file is empty")
    if len(contents) > MAX_CV_BYTES: raise HTTPException(status.HTTP_400_BAD_REQUEST, "CV must be under 5 MB")

    storage_key = f"{uuid.uuid4()}{EXT_BY_MIME[cv.content_type]}"
    (STORAGE_DIR / storage_key).write_bytes(contents)

    cv_row = CvFile(original_filename=(cv.filename or "cv")[:255], storage_key=storage_key, mime_type=cv.content_type, size_bytes=len(contents))
    db.add(cv_row)
    await db.flush()

    app_row = CareerApplication(full_name=full_name, email=email.lower(), phone=phone, role_slug=role_slug, cover_letter=cover_letter, cv_file_id=cv_row.id, status="received")
    db.add(app_row)
    await db.commit()
    await db.refresh(app_row)
    return app_row
