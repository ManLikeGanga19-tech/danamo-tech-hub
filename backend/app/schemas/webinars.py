from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

# --- NEW SCHEMAS FOR DYNAMIC WEBINARS ---

class WebinarOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    description: str
    date: str
    time: str
    host: str
    image_url: str
    status: str
    join_url: str | None = None
    replay_url: str | None = None


class WebinarRegisterIn(BaseModel):
    webinar_id: UUID
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr


class ReplayUnlockIn(BaseModel):
    webinar_id: UUID
    email: EmailStr


# --- OLD SCHEMAS (Kept for backwards compatibility) ---

class WebinarRegistrationIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    webinar_title: str = Field(min_length=1, max_length=255)


class WebinarRegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    webinar_title: str