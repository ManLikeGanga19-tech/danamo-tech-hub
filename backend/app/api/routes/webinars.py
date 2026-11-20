"""Public webinar API. Join and replay links are never listed publicly:
join links go out by email, replay links only after an email is given."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.email import send_webinar_registration
from app.core.rate_limit import FORM_LIMIT, client_ip, limiter
from app.db.session import get_db
from app.models import Webinar, WebinarRegistration
from app.schemas.webinars import ReplayUnlockIn, WebinarOut, WebinarRegisterIn, is_finished
from app.services.webinars import in_reminder_window

router = APIRouter(prefix="/webinars", tags=["webinars"])
logger = logging.getLogger(__name__)


@router.get("", response_model=list[WebinarOut])
async def get_webinars(db: AsyncSession = Depends(get_db)):
    rows = await db.scalars(select(Webinar).order_by(Webinar.starts_at.asc().nulls_last(), Webinar.created_at.desc()))
    return [WebinarOut.from_model(r) for r in rows.all()]


async def _find(db: AsyncSession, webinar_id, kind: str, email: str) -> WebinarRegistration | None:
    return await db.scalar(
        select(WebinarRegistration).where(
            WebinarRegistration.webinar_id == webinar_id,
            WebinarRegistration.kind == kind,
            WebinarRegistration.email == email,
        )
    )


@router.post("/register")
@limiter.limit(FORM_LIMIT)
async def register_for_webinar(request: Request, payload: WebinarRegisterIn, db: AsyncSession = Depends(get_db)):
    # The form is public, so a bot could use it to send our confirmation email
    # to any address. Bots fill the hidden honeypot field; answer them as if it
    # worked, but store and send nothing.
    if payload.website:
        logger.info("[webinar] Honeypot triggered from %s - dropped", client_ip(request))
        return {"status": "success", "message": "You're registered. Check your email."}

    webinar = await db.get(Webinar, payload.webinar_id)
    if not webinar:
        raise HTTPException(404, "Webinar not found")
    if is_finished(webinar):
        raise HTTPException(409, "This webinar has already taken place. Registration is closed.")

    email = payload.email.lower()
    name = " ".join(payload.name.split())
    now = datetime.now(timezone.utc)
    has_link = bool(webinar.join_url)

    row = await _find(db, webinar.id, "live", email)
    already = row is not None
    if not already:
        row = WebinarRegistration(
            webinar_id=webinar.id, name=name, email=email, webinar_title=webinar.title, kind="live",
            join_link_sent_at=now if has_link else None,
            # Registering inside the last 24 hours: this email is the reminder.
            reminder_sent_at=now if has_link and in_reminder_window(webinar, now) else None,
        )
        db.add(row)
        try:
            await db.commit()
        except IntegrityError:  # same email submitted twice at once
            await db.rollback()
            already = True

    # Registering again simply re-sends the confirmation (with the link if set).
    await send_webinar_registration(
        name=name, email=email, webinar_title=webinar.title, date=webinar.date, time=webinar.time,
        join_url=webinar.join_url,
    )
    if already:
        return {"status": "success", "message": "You're already registered. We've re-sent your confirmation email."}
    if has_link:
        return {"status": "success", "message": "You're registered. Check your email for the joining link."}
    return {"status": "success", "message": "You're registered. We'll email you the joining link before the event."}


@router.post("/unlock-replay")
@limiter.limit(FORM_LIMIT)
async def unlock_replay(request: Request, payload: ReplayUnlockIn, db: AsyncSession = Depends(get_db)):
    webinar = await db.get(Webinar, payload.webinar_id)
    if not webinar or not webinar.replay_url:
        raise HTTPException(404, "Replay not available")

    email = payload.email.lower()
    if not await _find(db, webinar.id, "replay", email):
        db.add(WebinarRegistration(webinar_id=webinar.id, name="", email=email, webinar_title=webinar.title, kind="replay"))
        try:
            await db.commit()
        except IntegrityError:
            await db.rollback()
    return {"status": "success", "replay_url": webinar.replay_url}
