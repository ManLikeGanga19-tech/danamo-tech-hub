from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import Webinar, WebinarRegistration
from app.schemas.webinars import WebinarOut, WebinarRegisterIn, ReplayUnlockIn
from app.core.email import send_webinar_registration

router = APIRouter(prefix="/webinars", tags=["webinars"])


@router.get("", response_model=list[WebinarOut])
async def get_webinars(db: AsyncSession = Depends(get_db)):
    """Public list of all webinars."""
    stmt = select(Webinar).order_by(Webinar.created_at.desc())
    rows = await db.scalars(stmt)
    return rows.all()


@router.post("/register")
async def register_for_webinar(payload: WebinarRegisterIn, db: AsyncSession = Depends(get_db)):
    webinar = await db.get(Webinar, payload.webinar_id)
    if not webinar:
        raise HTTPException(404, "Webinar not found")

    row = WebinarRegistration(
        webinar_id=webinar.id,
        name=payload.name,
        email=payload.email,
        webinar_title=webinar.title,
    )
    db.add(row)
    await db.commit()

    # Send confirmation email with join link.
    # Wrapped in try/except so a mail failure never breaks the user's registration.
    try:
        await send_webinar_registration(
            name=payload.name,
            email=payload.email,
            webinar_title=webinar.title,
            date=webinar.date,
            time=webinar.time,
            join_url=webinar.join_url,
        )
    except Exception as e:
        # Registration already succeeded — log but do not fail the request
        import logging
        logging.getLogger(__name__).error(f"[webinar] Email send failed: {e}")

    return {"status": "success", "message": "Registered successfully. Check your email."}


@router.post("/unlock-replay")
async def unlock_replay(payload: ReplayUnlockIn, db: AsyncSession = Depends(get_db)):
    webinar = await db.get(Webinar, payload.webinar_id)
    if not webinar or not webinar.replay_url:
        raise HTTPException(404, "Replay not available")

    # Optional: log the lead capture for analytics
    import logging
    logging.getLogger(__name__).info(f"[webinar] Replay unlocked for {payload.email}")

    return {"status": "success", "replay_url": webinar.replay_url}