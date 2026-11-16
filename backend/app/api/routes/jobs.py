"""Public job openings API: open roles only."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models import JobOpening
from app.schemas.jobs import PublicJobOpening

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[PublicJobOpening])
async def list_open_jobs(db: AsyncSession = Depends(get_db)):
    rows = await db.scalars(
        select(JobOpening)
        .where(JobOpening.status == "open")
        .order_by(JobOpening.display_order, JobOpening.posted_at.desc().nulls_last())
    )
    return [PublicJobOpening.from_model(r) for r in rows.all()]


@router.get("/{slug}", response_model=PublicJobOpening)
async def get_open_job(slug: str, db: AsyncSession = Depends(get_db)):
    row = await db.scalar(select(JobOpening).where(JobOpening.slug == slug, JobOpening.status == "open"))
    if not row:
        raise HTTPException(404, "This role is not open")
    return PublicJobOpening.from_model(row)
