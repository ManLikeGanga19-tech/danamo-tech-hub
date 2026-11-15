from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import NewsletterSubscriber
from app.core.email import send_newsletter_welcome, send_newsletter_notification
from app.core.rate_limit import FORM_LIMIT, limiter

router = APIRouter(tags=["newsletter"])


class NewsletterIn(BaseModel):
    email: EmailStr


@router.post("/newsletter", status_code=201)
@limiter.limit(FORM_LIMIT)
async def subscribe(request: Request, payload: NewsletterIn, db: AsyncSession = Depends(get_db)):
    email = payload.email.lower()
    existing = await db.scalar(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == email)
    )

    if existing and existing.unsubscribed_at is None:
        return {"status": "already_subscribed"}

    if existing:
        existing.unsubscribed_at = None
        await db.commit()
        await send_newsletter_welcome(email)
        return {"status": "resubscribed"}

    db.add(NewsletterSubscriber(email=email))
    await db.commit()

    await send_newsletter_welcome(email)
    await send_newsletter_notification(email)

    return {"status": "subscribed"}
