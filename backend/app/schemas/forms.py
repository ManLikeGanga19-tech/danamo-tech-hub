from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)

class ServiceInquiryIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    company: str | None = Field(default=None, max_length=120)
    service_slug: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=1, max_length=5000)

class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    status: str
