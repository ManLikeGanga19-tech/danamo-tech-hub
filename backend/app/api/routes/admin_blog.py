"""Admin blog management (create/edit/publish/delete, cover uploads)."""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin
from app.core.files import EXTENSIONS, IMAGE_TYPES, read_validated_upload
from app.core.rate_limit import ADMIN_UPLOAD_LIMIT, limiter
from app.db.session import get_db
from app.models import BlogPost, User
from app.schemas.blog import BlogPostIn, BlogPostOut, estimate_read_minutes

router = APIRouter(prefix="/admin/data/blog", tags=["admin_blog"])

BLOG_IMAGES_DIR = Path("storage/blog")
BLOG_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def _apply(row: BlogPost, payload: BlogPostIn) -> None:
    data = payload.model_dump()
    data["tags"] = json.dumps(data["tags"])
    for k, v in data.items():
        setattr(row, k, v)
    row.read_minutes = estimate_read_minutes(payload.content)
    if payload.status == "published" and row.published_at is None:
        row.published_at = datetime.now(timezone.utc)


async def _commit(db: AsyncSession) -> None:
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Another article already uses this URL slug")


@router.get("", response_model=list[BlogPostOut])
async def admin_list_posts(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    rows = await db.scalars(select(BlogPost).order_by(BlogPost.created_at.desc()))
    return [BlogPostOut.from_model(r) for r in rows.all()]


@router.post("", response_model=BlogPostOut, status_code=201)
async def admin_create_post(payload: BlogPostIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = BlogPost()
    _apply(row, payload)
    db.add(row)
    await _commit(db)
    await db.refresh(row)
    return BlogPostOut.from_model(row)


@router.patch("/{post_id}", response_model=BlogPostOut)
async def admin_update_post(post_id: uuid.UUID, payload: BlogPostIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(BlogPost, post_id)
    if not row:
        raise HTTPException(404, "Article not found")
    _apply(row, payload)
    await _commit(db)
    await db.refresh(row)
    return BlogPostOut.from_model(row)


@router.delete("/{post_id}")
async def admin_delete_post(post_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(BlogPost, post_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}


@router.post("/upload-image")
@limiter.limit(ADMIN_UPLOAD_LIMIT)
async def upload_blog_image(request: Request, file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    contents, mime = await read_validated_upload(file, IMAGE_TYPES, MAX_IMAGE_BYTES, "Image", "a JPG, PNG, or WebP image")
    filename = f"{uuid.uuid4()}{EXTENSIONS[mime]}"
    (BLOG_IMAGES_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/blog/{filename}"}
