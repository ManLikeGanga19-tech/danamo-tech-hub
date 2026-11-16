import json
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

SLUG_RE = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"
LIST_FIELDS = ("responsibilities", "requirements", "nice_to_have", "offer")

EmploymentType = Literal["Full-time", "Part-time", "Contract", "Internship"]
Workplace = Literal["Remote", "Hybrid", "On-site"]
JobStatus = Literal["draft", "open", "closed"]
ApplicationStatus = Literal["received", "reviewing", "shortlisted", "interview", "offered", "hired", "rejected"]


def _load_list(raw: str | None) -> list[str]:
    try:
        value = json.loads(raw) if raw else []
    except (TypeError, json.JSONDecodeError):
        return []
    return [str(v) for v in value] if isinstance(value, list) else []


class JobOpeningIn(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    slug: str = Field(min_length=1, max_length=120, pattern=SLUG_RE)
    employment_type: EmploymentType
    location: str = Field(min_length=1, max_length=120)
    workplace: Workplace
    summary: str = Field(min_length=1, max_length=300)
    about: str = Field(min_length=1, max_length=10_000)
    responsibilities: list[str] = Field(default_factory=list, max_length=30)
    requirements: list[str] = Field(default_factory=list, max_length=30)
    nice_to_have: list[str] = Field(default_factory=list, max_length=30)
    offer: list[str] = Field(default_factory=list, max_length=30)
    status: JobStatus = "draft"
    display_order: int = Field(default=0, ge=0, le=10_000)

    @field_validator(*LIST_FIELDS)
    @classmethod
    def clean_items(cls, v: list[str]) -> list[str]:
        out = []
        for item in v:
            item = " ".join(str(item).split())[:500]
            if item:
                out.append(item)
        return out

    def to_columns(self) -> dict:
        data = self.model_dump()
        for key in LIST_FIELDS:
            data[key] = json.dumps(data[key])
        return data


class JobOpeningOut(BaseModel):
    id: UUID
    title: str
    slug: str
    employment_type: str
    location: str
    workplace: str
    summary: str
    about: str
    responsibilities: list[str]
    requirements: list[str]
    nice_to_have: list[str]
    offer: list[str]
    status: str
    display_order: int
    posted_at: datetime | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_model(cls, row) -> "JobOpeningOut":
        data = {name: getattr(row, name) for name in JobOpeningOut.model_fields if name not in LIST_FIELDS}
        for key in LIST_FIELDS:
            data[key] = _load_list(getattr(row, key))
        return cls(**data)


class AdminJobOpeningOut(JobOpeningOut):
    application_count: int = 0

    @classmethod
    def with_count(cls, row, count: int) -> "AdminJobOpeningOut":
        return cls(**JobOpeningOut.from_model(row).model_dump(), application_count=count)


class PublicJobOpening(BaseModel):
    """What the public site sees (no internal status/ordering fields)."""

    title: str
    slug: str
    employment_type: str
    location: str
    workplace: str
    summary: str
    about: str
    responsibilities: list[str]
    requirements: list[str]
    nice_to_have: list[str]
    offer: list[str]
    posted_at: datetime | None

    @classmethod
    def from_model(cls, row) -> "PublicJobOpening":
        full = JobOpeningOut.from_model(row)
        return cls(**full.model_dump(include=set(cls.model_fields)))


class ApplicationOut(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str | None
    role_slug: str
    job_id: UUID | None
    cover_letter: str | None
    cv_file_id: UUID | None
    cover_letter_file_id: UUID | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ApplicationStatusIn(BaseModel):
    status: ApplicationStatus
