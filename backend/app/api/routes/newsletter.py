from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import NewsletterSubscriber

router = APIRouter(tags=["newsletter"])

class NewsletterIn(BaseModel):
    email: EmailStr

@router.post("/newsletter", status_code=201)
async def subscribe(payload: NewsletterIn, db: AsyncSession = Depends(get_db)):
    existing = await db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email))
    if existing and existing.unsubscribed_at is None:
        return {"status": "already_subscribed"}
    if existing:
        existing.unsubscribed_at = None
        await db.commit()
        return {"status": "resubscribed"}
    db.add(NewsletterSubscriber(email=payload.email))
    await db.commit()
    return {"status": "subscribed"}
