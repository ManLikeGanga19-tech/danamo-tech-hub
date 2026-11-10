from uuid import UUID
from pydantic import BaseModel, ConfigDict


class PartnerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    logo_url: str
    website_url: str | None = None
    display_order: int
    is_active: bool


class PartnerCreate(BaseModel):
    name: str
    logo_url: str
    website_url: str | None = None
    display_order: int = 0
    is_active: bool = True


class PartnerUpdate(PartnerCreate):
    pass
