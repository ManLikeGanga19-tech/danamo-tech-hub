from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=120)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    role: str = "user"
    email: str
    full_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    title: str | None = None
    company: str | None = None
    phone: str | None = None
    has_seen_welcome: bool = False
    has_seen_greeting: bool = False


class ProfileUpdateIn(BaseModel):
    full_name: str | None = Field(default=None, max_length=120)
    bio: str | None = Field(default=None, max_length=2000)
    title: str | None = Field(default=None, max_length=120)
    company: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)
    avatar_url: str | None = Field(default=None, max_length=500)
    has_seen_welcome: bool | None = None
    has_seen_greeting: bool | None = None
