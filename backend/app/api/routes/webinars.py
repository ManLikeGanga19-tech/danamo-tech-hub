from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import Webinar, WebinarRegistration
from app.schemas.webinars import WebinarOut, WebinarRegisterIn, ReplayUnlockIn

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

    print(f"--- EMAIL SENT TO {payload.email} ---")
    print(f"Subject: You are registered for {webinar.title}")
    print(f"Join Link: {webinar.join_url or 'Link will be sent soon'}")
    print("----------------------------------------")

    return {"status": "success", "message": "Registered successfully."}


@router.post("/unlock-replay")
async def unlock_replay(payload: ReplayUnlockIn, db: AsyncSession = Depends(get_db)):
    webinar = await db.get(Webinar, payload.webinar_id)
    if not webinar or not webinar.replay_url:
        raise HTTPException(404, "Replay not available")

    print(f"--- LEAD CAPTURED FOR REPLAY: {payload.email} ---")
    return {"status": "success", "replay_url": webinar.replay_url}
