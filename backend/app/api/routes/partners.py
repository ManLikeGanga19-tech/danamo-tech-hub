from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import Partner
from app.schemas.partners import PartnerOut

router = APIRouter(prefix="/partners", tags=["partners"])


@router.get("", response_model=list[PartnerOut])
async def list_partners(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Partner)
        .where(Partner.is_active == True)
        .order_by(Partner.display_order.asc(), Partner.created_at.asc())
    )
    rows = await db.scalars(stmt)
    return rows.all()
