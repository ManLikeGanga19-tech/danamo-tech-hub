"""Public blog API: published posts only."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models import BlogPost
from app.schemas.blog import BlogPostOut, BlogPostSummary

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=list[BlogPostSummary])
async def list_posts(db: AsyncSession = Depends(get_db)):
    rows = await db.scalars(
        select(BlogPost)
        .where(BlogPost.status == "published")
        .order_by(BlogPost.published_at.desc().nulls_last(), BlogPost.created_at.desc())
    )
    return [BlogPostSummary.from_model(r) for r in rows.all()]


@router.get("/{slug}", response_model=BlogPostOut)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    row = await db.scalar(select(BlogPost).where(BlogPost.slug == slug, BlogPost.status == "published"))
    if not row:
        raise HTTPException(404, "Article not found")
    return BlogPostOut.from_model(row)
