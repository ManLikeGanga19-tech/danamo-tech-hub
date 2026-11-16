import json
import math
import re
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

SLUG_RE = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"


def estimate_read_minutes(markdown: str) -> int:
    words = len(re.findall(r"\w+", markdown))
    return max(1, math.ceil(words / 200))


class BlogPostIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200, pattern=SLUG_RE)
    excerpt: str = Field(min_length=1, max_length=500)
    content: str = Field(min_length=1, max_length=100_000)  # Markdown
    cover_image_url: str | None = Field(default=None, max_length=500)
    tags: list[str] = Field(default_factory=list, max_length=10)
    author_name: str = Field(default="Daniel Oganga", min_length=1, max_length=120)
    status: Literal["draft", "published"] = "draft"

    @field_validator("tags")
    @classmethod
    def clean_tags(cls, v: list[str]) -> list[str]:
        out: list[str] = []
        for t in v:
            t = " ".join(str(t).split())[:40]
            if t and t.lower() not in {x.lower() for x in out}:
                out.append(t)
        return out

    @field_validator("cover_image_url")
    @classmethod
    def safe_image_url(cls, v: str | None) -> str | None:
        if v and not (v.startswith("/uploads/") or v.startswith("https://")):
            raise ValueError("Cover image must be an uploaded file or an https:// URL")
        return v or None


class BlogPostOut(BaseModel):
    id: UUID
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image_url: str | None
    tags: list[str]
    author_name: str
    read_minutes: int
    status: str
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_model(cls, row) -> "BlogPostOut":
        try:
            tags = json.loads(row.tags) if row.tags else []
        except (TypeError, json.JSONDecodeError):
            tags = []
        return cls(
            id=row.id, title=row.title, slug=row.slug, excerpt=row.excerpt, content=row.content,
            cover_image_url=row.cover_image_url, tags=tags, author_name=row.author_name,
            read_minutes=row.read_minutes, status=row.status, published_at=row.published_at,
            created_at=row.created_at, updated_at=row.updated_at,
        )


class BlogPostSummary(BaseModel):
    """List view for the public blog index (no full content)."""

    title: str
    slug: str
    excerpt: str
    cover_image_url: str | None
    tags: list[str]
    author_name: str
    read_minutes: int
    published_at: datetime | None

    @classmethod
    def from_model(cls, row) -> "BlogPostSummary":
        full = BlogPostOut.from_model(row)
        return cls(**full.model_dump(include=set(cls.model_fields)))
