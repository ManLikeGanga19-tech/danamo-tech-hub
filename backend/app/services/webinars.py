"""Webinar emails that go to many attendees: join links and 24-hour reminders.

The API runs several worker processes, and each runs the reminder loop. Every
send is "claimed" first with an UPDATE ... WHERE <not sent yet> RETURNING, so
exactly one worker emails each attendee.
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import and_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.email import send_webinar_join_link, send_webinar_reminder
from app.db.session import SessionLocal
from app.models import Webinar, WebinarRegistration

logger = logging.getLogger(__name__)

REMINDER_WINDOW = timedelta(hours=24)


def in_reminder_window(webinar: Webinar, now: datetime | None = None) -> bool:
    """True from 24 hours before the start until the start."""
    if webinar.starts_at is None:
        return False
    now = now or datetime.now(timezone.utc)
    return webinar.starts_at - REMINDER_WINDOW <= now < webinar.starts_at


async def email_join_link_to_attendees(db: AsyncSession, webinar: Webinar, updated: bool = False) -> int:
    """Send the current join link to everyone registered for the live session.

    Inside the 24-hour window this email doubles as the reminder, so nobody
    gets two emails with the same link minutes apart.
    """
    if not webinar.join_url:
        return 0
    now = datetime.now(timezone.utc)
    values: dict = {"join_link_sent_at": now}
    if in_reminder_window(webinar, now):
        values["reminder_sent_at"] = now
    rows = (
        await db.execute(
            update(WebinarRegistration)
            .where(WebinarRegistration.webinar_id == webinar.id, WebinarRegistration.kind == "live")
            .values(**values)
            .returning(WebinarRegistration.name, WebinarRegistration.email)
        )
    ).all()
    await db.commit()
    for name, email in rows:
        await send_webinar_join_link(
            name=name, email=email, webinar_title=webinar.title, date=webinar.date, time=webinar.time,
            join_url=webinar.join_url, updated=updated,
        )
    logger.info("[webinar] Join link emailed to %d attendee(s) of %s", len(rows), webinar.id)
    return len(rows)


async def send_due_reminders() -> int:
    """Email the join link to attendees of webinars starting within 24 hours."""
    now = datetime.now(timezone.utc)
    sent = 0
    async with SessionLocal() as db:
        webinars = (
            await db.scalars(
                select(Webinar).where(
                    Webinar.status == "upcoming",
                    Webinar.join_url.is_not(None),
                    Webinar.starts_at.is_not(None),
                    Webinar.starts_at > now,
                    Webinar.starts_at <= now + REMINDER_WINDOW,
                )
            )
        ).all()
        for webinar in webinars:
            claimed = (
                await db.execute(
                    update(WebinarRegistration)
                    .where(
                        and_(
                            WebinarRegistration.webinar_id == webinar.id,
                            WebinarRegistration.kind == "live",
                            WebinarRegistration.reminder_sent_at.is_(None),
                        )
                    )
                    .values(reminder_sent_at=now, join_link_sent_at=now)
                    .returning(WebinarRegistration.id, WebinarRegistration.name, WebinarRegistration.email)
                )
            ).all()
            await db.commit()
            failed = []
            for reg_id, name, email in claimed:
                ok = await send_webinar_reminder(
                    name=name, email=email, webinar_title=webinar.title, date=webinar.date, time=webinar.time,
                    join_url=webinar.join_url,
                )
                if ok:
                    sent += 1
                else:
                    failed.append(reg_id)
            if failed:  # email disabled: release the claim so a later run retries
                await db.execute(
                    update(WebinarRegistration).where(WebinarRegistration.id.in_(failed)).values(reminder_sent_at=None)
                )
                await db.commit()
    if sent:
        logger.info("[webinar] Sent %d reminder(s)", sent)
    return sent


async def reminder_loop() -> None:
    interval = max(60, settings.webinar_reminder_interval_seconds)
    while True:
        try:
            await send_due_reminders()
        except asyncio.CancelledError:
            raise
        except Exception:  # never let the loop die (e.g. database restarting)
            logger.exception("[webinar] Reminder run failed")
        await asyncio.sleep(interval)
