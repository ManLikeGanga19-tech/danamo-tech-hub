from datetime import datetime, timedelta, timezone
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

# Kenya does not use daylight saving, so a fixed offset is exact.
EAT = timezone(timedelta(hours=3), "EAT")


def display_date(starts_at: datetime) -> str:
    local = starts_at.astimezone(EAT)
    return f"{local:%A}, {local.day} {local:%B %Y}"


def display_time(starts_at: datetime) -> str:
    local = starts_at.astimezone(EAT)
    return f"{local.hour % 12 or 12}:{local:%M} {'AM' if local.hour < 12 else 'PM'} EAT"


def is_finished(row) -> bool:
    """A webinar is over when the admin marked it past or its end time has passed."""
    if row.status == "past":
        return True
    if row.starts_at is None:
        return False
    return datetime.now(timezone.utc) > row.starts_at + timedelta(minutes=row.duration_minutes or 60)


def _safe_url(v: str | None) -> str | None:
    v = (v or "").strip()
    if not v:
        return None
    if not v.startswith("https://"):
        raise ValueError("Links must start with https://")
    return v


class WebinarIn(BaseModel):
    """Create/update payload from the admin console."""

    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=5000)
    starts_at: datetime
    duration_minutes: int = Field(default=60, ge=15, le=600)
    host: str = Field(min_length=1, max_length=120)
    image_url: str = Field(min_length=1, max_length=500)
    join_url: str | None = Field(default=None, max_length=500)
    replay_url: str | None = Field(default=None, max_length=500)
    status: Literal["upcoming", "past"] = "upcoming"

    @field_validator("starts_at")
    @classmethod
    def aware(cls, v: datetime) -> datetime:
        # Times without a zone are East Africa Time (what the admin types).
        return v.replace(tzinfo=EAT) if v.tzinfo is None else v

    @field_validator("join_url", "replay_url")
    @classmethod
    def https_only(cls, v: str | None) -> str | None:
        return _safe_url(v)

    @field_validator("image_url")
    @classmethod
    def image(cls, v: str) -> str:
        if not (v.startswith("/uploads/") or v.startswith("https://")):
            raise ValueError("Cover image must be an uploaded file or an https:// URL")
        return v


class WebinarOut(BaseModel):
    """Public view: never includes the join or replay links."""

    id: UUID
    title: str
    description: str
    date: str
    time: str
    starts_at: datetime | None
    duration_minutes: int
    host: str
    image_url: str
    status: Literal["upcoming", "past"]
    has_replay: bool

    @classmethod
    def from_model(cls, row) -> "WebinarOut":
        return cls(
            id=row.id, title=row.title, description=row.description, date=row.date, time=row.time,
            starts_at=row.starts_at, duration_minutes=row.duration_minutes or 60, host=row.host,
            image_url=row.image_url, status="past" if is_finished(row) else "upcoming",
            has_replay=bool(row.replay_url),
        )


class AdminWebinarOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str
    date: str
    time: str
    starts_at: datetime | None
    duration_minutes: int
    host: str
    image_url: str
    status: str
    join_url: str | None
    replay_url: str | None
    created_at: datetime
    registration_count: int = 0
    replay_count: int = 0
    finished: bool = False


class RegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: str
    kind: str
    join_link_sent_at: datetime | None
    reminder_sent_at: datetime | None
    created_at: datetime


class WebinarRegisterIn(BaseModel):
    webinar_id: UUID
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr


class ReplayUnlockIn(BaseModel):
    webinar_id: UUID
    email: EmailStr
