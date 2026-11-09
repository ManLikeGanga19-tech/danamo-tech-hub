from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import WebinarRegistration
from app.schemas.webinars import WebinarRegistrationIn, WebinarRegistrationOut

router = APIRouter(prefix="/webinars", tags=["webinars"])

@router.post("/register", response_model=WebinarRegistrationOut, status_code=201)
async def register_for_webinar(payload: WebinarRegistrationIn, db: AsyncSession = Depends(get_db)):
    # We allow guests to register (user_id is null), but you can change this if you want to force login
    row = WebinarRegistration(
        name=payload.name,
        email=payload.email,
        webinar_title=payload.webinar_title
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row