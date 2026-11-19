import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.email import _mask, send_newsletter_notification, send_newsletter_welcome
from app.core.rate_limit import FORM_LIMIT, client_ip, limiter
from app.db.session import get_db
from app.models import NewsletterSubscriber

logger = logging.getLogger(__name__)
router = APIRouter(tags=["newsletter"])


class NewsletterIn(BaseModel):
    email: EmailStr
    # Honeypot: hidden from people, filled in by spam bots.
    website: str | None = Field(default=None, max_length=200)


@router.post("/newsletter", status_code=201)
@limiter.limit(FORM_LIMIT)
async def subscribe(request: Request, payload: NewsletterIn, db: AsyncSession = Depends(get_db)):
    # The form is public, so a bot could use it to send our welcome email to
    # any address. Answer bots as if it worked, but store and send nothing.
    if payload.website:
        logger.info("[newsletter] Honeypot triggered from %s - dropped", client_ip(request))
        return {"status": "subscribed"}

    email = payload.email.lower()
    existing = await db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == email))

    if existing and existing.unsubscribed_at is None:
        return {"status": "already_subscribed"}

    if existing:
        existing.unsubscribed_at = None
        await db.commit()
        await send_newsletter_welcome(email, existing.unsubscribe_token)
        return {"status": "resubscribed"}

    row = NewsletterSubscriber(email=email)
    db.add(row)
    await db.commit()
    await db.refresh(row)

    await send_newsletter_welcome(email, row.unsubscribe_token)
    await send_newsletter_notification(email)
    return {"status": "subscribed"}


async def _by_token(db: AsyncSession, token: str) -> NewsletterSubscriber:
    row = await db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.unsubscribe_token == token))
    if not row:
        raise HTTPException(404, "This unsubscribe link is not valid")
    return row


@router.get("/newsletter/unsubscribe")
@limiter.limit(FORM_LIMIT)
async def unsubscribe_status(request: Request, token: str = Query(min_length=20, max_length=64), db: AsyncSession = Depends(get_db)):
    """Used by the unsubscribe page to show which address the link is for.

    Reading a link never unsubscribes (mail scanners open links); only POST does.
    """
    row = await _by_token(db, token)
    return {"email": _mask(row.email), "subscribed": row.unsubscribed_at is None}


@router.post("/newsletter/unsubscribe")
@limiter.limit(FORM_LIMIT)
async def unsubscribe(request: Request, token: str = Query(min_length=20, max_length=64), db: AsyncSession = Depends(get_db)):
    """Unsubscribe. Also the RFC 8058 one-click target of the List-Unsubscribe header."""
    row = await _by_token(db, token)
    if row.unsubscribed_at is None:
        row.unsubscribed_at = datetime.now(timezone.utc)
        await db.commit()
    return {"status": "unsubscribed"}
