import logging
from uuid import uuid4

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models import ContactMessage, ServiceInquiry
from app.schemas.forms import ContactIn, ServiceInquiryIn, SubmissionOut
from app.core.email import (
    send_contact_notification,
    send_contact_received,
    send_service_inquiry_notification,
    send_service_inquiry_received,
)
from app.core.rate_limit import FORM_LIMIT, client_ip, limiter

logger = logging.getLogger(__name__)
router = APIRouter(tags=["forms"])


@router.post("/contact", response_model=SubmissionOut, status_code=201)
@limiter.limit(FORM_LIMIT)
async def create_contact(request: Request, payload: ContactIn, db: AsyncSession = Depends(get_db)):
    # The form is public, so a bot could use it to send our confirmation email
    # to any address. Bots fill the hidden honeypot field; answer them as if it
    # worked, but store and send nothing.
    if payload.website:
        logger.info("[contact] Honeypot triggered from %s - dropped", client_ip(request))
        return SubmissionOut(id=uuid4(), status="new")

    row = ContactMessage(**payload.model_dump(exclude={"website"}))
    db.add(row)
    await db.commit()
    await db.refresh(row)

    # Emails are queued after the commit, so the message is saved even if
    # sending fails.
    await send_contact_notification(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    await send_contact_received(name=payload.name, email=payload.email, subject=payload.subject)
    return row


@router.post("/service-inquiries", response_model=SubmissionOut, status_code=201)
@limiter.limit(FORM_LIMIT)
async def create_service_inquiry(request: Request, payload: ServiceInquiryIn, db: AsyncSession = Depends(get_db)):
    row = ServiceInquiry(**payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)

    await send_service_inquiry_notification(
        name=payload.name,
        email=payload.email,
        company=payload.company,
        service=payload.service_slug,
        message=payload.message,
    )
    await send_service_inquiry_received(name=payload.name, email=payload.email, service=payload.service_slug)
    return row
