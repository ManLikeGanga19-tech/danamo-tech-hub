"""'New on Danamo Tech' emails to newsletter subscribers.

Publishing a blog post, announcing a webinar, opening a job or publishing a
case study queues ONE announcement (unique per item, so republishing never
re-sends). After a short grace period the background loop emails every active
subscriber, in batches, recording progress after each batch so a restart
resumes where it stopped instead of emailing anyone twice.
"""

import asyncio
import logging
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import or_, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.email import newsletter_update_message, send_batch
from app.db.session import SessionLocal
from app.models import BlogPost, JobOpening, NewsletterAnnouncement, NewsletterSubscriber, Project, Webinar
from app.schemas.webinars import is_finished

logger = logging.getLogger(__name__)

BATCH_SIZE = 50  # Resend allows up to 100 per batch call
PAUSE_BETWEEN_BATCHES = 1.0  # seconds; stays well inside Resend's rate limit
STALE_AFTER = timedelta(minutes=15)  # a "sending" job with no progress for this long is resumed


async def queue_announcement(
    db: AsyncSession, *, kind: str, ref_id: uuid.UUID, title: str, summary: str, path: str, image_url: str | None = None
) -> None:
    """Queue the email for a newly published item. Does nothing if it was queued before."""
    if not settings.newsletter_updates_on:
        return
    stmt = (
        insert(NewsletterAnnouncement)
        .values(
            id=uuid.uuid4(),
            kind=kind,
            ref_id=ref_id,
            title=title[:255],
            summary=summary[:2000],
            path=path,
            image_url=image_url,
            status="queued",
            send_after=datetime.now(timezone.utc) + timedelta(minutes=settings.newsletter_send_delay_minutes),
        )
        .on_conflict_do_nothing(constraint="uq_newsletter_announcements_kind_ref")
    )
    await db.execute(stmt)
    await db.commit()


async def _still_live(db: AsyncSession, ann: NewsletterAnnouncement) -> bool:
    """Only email about items that are still public when the grace period ends."""
    if ann.kind == "blog":
        row = await db.get(BlogPost, ann.ref_id)
        return bool(row and row.status == "published")
    if ann.kind == "job":
        row = await db.get(JobOpening, ann.ref_id)
        return bool(row and row.status == "open")
    if ann.kind == "project":
        row = await db.get(Project, ann.ref_id)
        return bool(row and row.status == "published")
    if ann.kind == "webinar":
        row = await db.get(Webinar, ann.ref_id)
        return bool(row and not is_finished(row))
    return False


async def _claim(db: AsyncSession) -> NewsletterAnnouncement | None:
    """Atomically take one due announcement (or a stalled one) for this worker."""
    now = datetime.now(timezone.utc)
    ann_id = await db.scalar(
        update(NewsletterAnnouncement)
        .where(
            NewsletterAnnouncement.id.in_(
                select(NewsletterAnnouncement.id)
                .where(
                    or_(
                        (NewsletterAnnouncement.status == "queued") & (NewsletterAnnouncement.send_after <= now),
                        (NewsletterAnnouncement.status == "sending") & (NewsletterAnnouncement.updated_at < now - STALE_AFTER),
                    )
                )
                .order_by(NewsletterAnnouncement.send_after)
                .limit(1)
                .with_for_update(skip_locked=True)
            )
        )
        .values(status="sending", updated_at=now)
        .returning(NewsletterAnnouncement.id)
    )
    await db.commit()
    return await db.get(NewsletterAnnouncement, ann_id) if ann_id else None


async def _deliver(db: AsyncSession, ann: NewsletterAnnouncement) -> None:
    if not await _still_live(db, ann):
        ann.status, ann.note = "cancelled", "Item was unpublished or removed before sending"
        await db.commit()
        return

    while True:
        query = (
            select(NewsletterSubscriber.id, NewsletterSubscriber.email, NewsletterSubscriber.unsubscribe_token)
            .where(NewsletterSubscriber.unsubscribed_at.is_(None))
            .order_by(NewsletterSubscriber.id)
            .limit(BATCH_SIZE)
        )
        if ann.cursor is not None:
            query = query.where(NewsletterSubscriber.id > ann.cursor)
        batch = (await db.execute(query)).all()
        if not batch:
            break
        messages = [
            newsletter_update_message(
                to=email, token=token, kind=ann.kind, title=ann.title, summary=ann.summary, path=ann.path, image_url=ann.image_url
            )
            for _, email, token in batch
        ]
        if not await send_batch(messages):
            ann.status, ann.note = "failed", "Email provider rejected the batch or email is not configured"
            await db.commit()
            return
        ann.cursor = batch[-1][0]
        ann.sent_count = (ann.sent_count or 0) + len(batch)
        ann.updated_at = datetime.now(timezone.utc)  # heartbeat: not stale
        await db.commit()
        await asyncio.sleep(PAUSE_BETWEEN_BATCHES)

    ann.status, ann.sent_at = "sent", datetime.now(timezone.utc)
    await db.commit()
    logger.info("[newsletter] %s %r sent to %d subscriber(s)", ann.kind, ann.title, ann.sent_count)


async def process_due() -> None:
    async with SessionLocal() as db:
        while ann := await _claim(db):
            await _deliver(db, ann)


async def newsletter_loop() -> None:
    while True:
        try:
            await process_due()
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("[newsletter] Run failed")
        await asyncio.sleep(60)
