"""Admin careers management: job openings CRUD and application review."""

import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models import CareerApplication, CvFile, JobOpening, User
from app.schemas.jobs import (
    AdminJobOpeningOut,
    ApplicationOut,
    ApplicationStatusIn,
    JobOpeningIn,
)

router = APIRouter(prefix="/admin/data", tags=["admin_jobs"])

CV_DIR = Path("storage/cvs")


async def _commit(db: AsyncSession) -> None:
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Another role already uses this URL slug")


def _apply(row: JobOpening, payload: JobOpeningIn) -> None:
    for key, value in payload.to_columns().items():
        setattr(row, key, value)
    # The posted date is when the role first went live.
    if payload.status == "open" and row.posted_at is None:
        row.posted_at = datetime.now(timezone.utc)


async def _out(db: AsyncSession, row: JobOpening) -> AdminJobOpeningOut:
    count = await db.scalar(select(func.count(CareerApplication.id)).where(CareerApplication.job_id == row.id))
    return AdminJobOpeningOut.with_count(row, count or 0)


# --- JOB OPENINGS ---
@router.get("/jobs", response_model=list[AdminJobOpeningOut])
async def admin_list_jobs(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    counts = dict(
        (await db.execute(select(CareerApplication.job_id, func.count(CareerApplication.id)).group_by(CareerApplication.job_id))).all()
    )
    rows = await db.scalars(select(JobOpening).order_by(JobOpening.display_order, JobOpening.created_at.desc()))
    return [AdminJobOpeningOut.with_count(r, counts.get(r.id, 0)) for r in rows.all()]


@router.post("/jobs", response_model=AdminJobOpeningOut, status_code=201)
async def admin_create_job(payload: JobOpeningIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = JobOpening()
    _apply(row, payload)
    db.add(row)
    await _commit(db)
    await db.refresh(row)
    return await _out(db, row)


@router.patch("/jobs/{job_id}", response_model=AdminJobOpeningOut)
async def admin_update_job(job_id: uuid.UUID, payload: JobOpeningIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(JobOpening, job_id)
    if not row:
        raise HTTPException(404, "Role not found")
    _apply(row, payload)
    await _commit(db)
    await db.refresh(row)
    return await _out(db, row)


@router.delete("/jobs/{job_id}")
async def admin_delete_job(job_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Delete a role. Its applications are kept (they still show the role title)."""
    row = await db.get(JobOpening, job_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}


# --- APPLICATIONS ---
@router.get("/applications", response_model=list[ApplicationOut])
async def admin_list_applications(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    rows = await db.scalars(select(CareerApplication).order_by(desc(CareerApplication.created_at)))
    return rows.all()


@router.patch("/applications/{application_id}", response_model=ApplicationOut)
async def admin_update_application(
    application_id: uuid.UUID, payload: ApplicationStatusIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)
):
    row = await db.get(CareerApplication, application_id)
    if not row:
        raise HTTPException(404, "Application not found")
    row.status = payload.status
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/applications/{application_id}")
async def admin_delete_application(application_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Delete an application together with its CV and cover letter files."""
    row = await db.get(CareerApplication, application_id)
    if not row:
        return {"status": "deleted"}
    file_ids = [fid for fid in (row.cv_file_id, row.cover_letter_file_id) if fid]
    files = [await db.get(CvFile, fid) for fid in file_ids]
    await db.delete(row)
    for f in files:
        if f:
            (CV_DIR / f.storage_key).unlink(missing_ok=True)
            await db.delete(f)
    await db.commit()
    return {"status": "deleted"}
