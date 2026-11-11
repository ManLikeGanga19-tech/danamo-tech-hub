from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import ContactMessage, ServiceInquiry
from app.schemas.forms import ContactIn, ServiceInquiryIn, SubmissionOut
from app.core.email import send_contact_notification

router = APIRouter(tags=["forms"])


@router.post("/contact", response_model=SubmissionOut, status_code=201)
async def create_contact(payload: ContactIn, db: AsyncSession = Depends(get_db)):
    row = ContactMessage(**payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)

    # Fire email AFTER commit — if email fails, the message is still saved
    await send_contact_notification(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    return row


@router.post("/service-inquiries", response_model=SubmissionOut, status_code=201)
async def create_service_inquiry(payload: ServiceInquiryIn, db: AsyncSession = Depends(get_db)):
    row = ServiceInquiry(**payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row
