from uuid import UUID

from app.core.html import clean_html
from pydantic import BaseModel, ConfigDict, Field, field_validator
import json


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    category: str
    description: str
    content: str
    client_name: str | None = None
    client_industry: str | None = None
    image_url: str
    gallery: list[str] = []
    technologies: list[str] = []
    live_url: str | None = None
    featured: bool
    status: str
    created_at: str | None = None

    @classmethod
    def from_model(cls, project):
        gallery = []
        technologies = []
        try:
            gallery = json.loads(project.gallery) if project.gallery else []
        except (json.JSONDecodeError, TypeError):
            gallery = []
        try:
            technologies = json.loads(project.technologies) if project.technologies else []
        except (json.JSONDecodeError, TypeError):
            technologies = []

        return cls(
            id=project.id,
            title=project.title,
            slug=project.slug,
            category=project.category,
            description=project.description,
            content=clean_html(project.content),
            client_name=project.client_name,
            client_industry=project.client_industry,
            image_url=project.image_url,
            gallery=gallery,
            technologies=technologies,
            live_url=project.live_url,
            featured=project.featured,
            status=project.status,
            created_at=project.created_at.isoformat() if project.created_at else None,
        )


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=80)
    description: str = Field(min_length=1, max_length=500)
    content: str
    client_name: str | None = None
    client_industry: str | None = None
    image_url: str
    gallery: list[str] = []
    technologies: list[str] = []
    live_url: str | None = None
    featured: bool = False
    status: str = "draft"

    @field_validator("content")
    @classmethod
    def safe_content(cls, v: str) -> str:
        return clean_html(v)

    @field_validator("live_url")
    @classmethod
    def https_link(cls, v: str | None) -> str | None:
        v = (v or "").strip()
        if v and not v.startswith("https://"):
            raise ValueError("The live link must start with https://")
        return v or None

    @field_validator("image_url")
    @classmethod
    def safe_image(cls, v: str) -> str:
        if not (v.startswith("/uploads/") or v.startswith("https://")):
            raise ValueError("Image must be an uploaded file or an https:// URL")
        return v

    @field_validator("gallery")
    @classmethod
    def safe_gallery(cls, v: list[str]) -> list[str]:
        for url in v:
            if not (url.startswith("/uploads/") or url.startswith("https://")):
                raise ValueError("Gallery images must be uploaded files or https:// URLs")
        return v
