from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class WebinarRegistrationIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    webinar_title: str = Field(min_length=1, max_length=255)

class WebinarRegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    webinar_title: str