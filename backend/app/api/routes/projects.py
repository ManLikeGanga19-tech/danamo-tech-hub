from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import Project
from app.schemas.projects import ProjectOut

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """Public list — only published projects."""
    stmt = (
        select(Project)
        .where(Project.status == "published")
        .order_by(Project.featured.desc(), Project.created_at.desc())
    )
    rows = await db.scalars(stmt)
    return [ProjectOut.from_model(r) for r in rows.all()]


@router.get("/{slug}", response_model=ProjectOut)
async def get_project(slug: str, db: AsyncSession = Depends(get_db)):
    project = await db.scalar(
        select(Project).where(Project.slug == slug, Project.status == "published")
    )
    if not project:
        raise HTTPException(404, "Project not found")
    return ProjectOut.from_model(project)
