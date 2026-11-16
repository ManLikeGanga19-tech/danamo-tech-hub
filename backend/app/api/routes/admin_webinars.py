"""Admin webinar management: events, attendees, join-link emails."""

import csv
import io
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models import User, Webinar, WebinarRegistration
from app.schemas.webinars import (
    AdminWebinarOut,
    RegistrationOut,
    WebinarIn,
    display_date,
    display_time,
    is_finished,
)
from app.services.newsletter import queue_announcement
from app.services.webinars import email_join_link_to_attendees

router = APIRouter(prefix="/admin/data/webinars", tags=["admin_webinars"])


def _apply(row: Webinar, payload: WebinarIn) -> None:
    for key, value in payload.model_dump().items():
        setattr(row, key, value)
    row.date = display_date(payload.starts_at)
    row.time = display_time(payload.starts_at)


async def _announce(db: AsyncSession, row: Webinar) -> None:
    if not is_finished(row):
        await queue_announcement(
            db, kind="webinar", ref_id=row.id, title=row.title,
            summary=f"{row.date} at {row.time}, hosted by {row.host}. {row.description}",
            path="/webinars", image_url=row.image_url,
        )


async def _counts(db: AsyncSession) -> dict[tuple[uuid.UUID, str], int]:
    rows = await db.execute(
        select(WebinarRegistration.webinar_id, WebinarRegistration.kind, func.count(WebinarRegistration.id)).group_by(
            WebinarRegistration.webinar_id, WebinarRegistration.kind
        )
    )
    return {(wid, kind): n for wid, kind, n in rows.all()}


def _out(row: Webinar, counts: dict) -> AdminWebinarOut:
    out = AdminWebinarOut.model_validate(row)
    out.registration_count = counts.get((row.id, "live"), 0)
    out.replay_count = counts.get((row.id, "replay"), 0)
    out.finished = is_finished(row)
    return out


async def _get(db: AsyncSession, webinar_id: uuid.UUID) -> Webinar:
    row = await db.get(Webinar, webinar_id)
    if not row:
        raise HTTPException(404, "Webinar not found")
    return row


@router.get("", response_model=list[AdminWebinarOut])
async def admin_list_webinars(db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    counts = await _counts(db)
    rows = await db.scalars(select(Webinar).order_by(Webinar.starts_at.desc().nulls_last(), Webinar.created_at.desc()))
    return [_out(r, counts) for r in rows.all()]


@router.post("", response_model=AdminWebinarOut, status_code=201)
async def admin_create_webinar(payload: WebinarIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = Webinar()
    _apply(row, payload)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    await _announce(db, row)
    return _out(row, {})


@router.patch("/{webinar_id}", response_model=AdminWebinarOut)
async def admin_update_webinar(
    webinar_id: uuid.UUID, payload: WebinarIn, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)
):
    row = await _get(db, webinar_id)
    old_link = row.join_url
    _apply(row, payload)
    await db.commit()
    await db.refresh(row)

    # A join link was added or changed: tell everyone already registered.
    if row.join_url and row.join_url != old_link and not is_finished(row):
        await email_join_link_to_attendees(db, row, updated=bool(old_link))
    return _out(row, await _counts(db))


@router.delete("/{webinar_id}")
async def admin_delete_webinar(webinar_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(Webinar, webinar_id)
    if row:
        await db.delete(row)  # registrations are removed by ON DELETE CASCADE
        await db.commit()
    return {"status": "deleted"}


@router.post("/{webinar_id}/send-link")
async def admin_send_join_link(webinar_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Manually (re)send the join link to every registered attendee."""
    row = await _get(db, webinar_id)
    if not row.join_url:
        raise HTTPException(400, "Add a join link to this webinar first")
    if is_finished(row):
        raise HTTPException(400, "This webinar has already ended")
    sent = await email_join_link_to_attendees(db, row)
    return {"status": "sent", "count": sent}


@router.get("/{webinar_id}/registrations", response_model=list[RegistrationOut])
async def admin_list_registrations(webinar_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    await _get(db, webinar_id)
    rows = await db.scalars(
        select(WebinarRegistration)
        .where(WebinarRegistration.webinar_id == webinar_id)
        .order_by(WebinarRegistration.kind, WebinarRegistration.created_at.desc())
    )
    return rows.all()


def _csv_cell(value: object) -> str:
    """Stop spreadsheet apps from running a cell as a formula."""
    text = "" if value is None else str(value)
    return "'" + text if text[:1] in ("=", "+", "-", "@", "\t", "\r") else text


@router.get("/{webinar_id}/registrations.csv")
async def admin_export_registrations(webinar_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    webinar = await _get(db, webinar_id)
    rows = (
        await db.scalars(
            select(WebinarRegistration).where(WebinarRegistration.webinar_id == webinar_id).order_by(WebinarRegistration.created_at)
        )
    ).all()
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Name", "Email", "Type", "Registered at", "Join link sent", "Reminder sent"])
    for r in rows:
        writer.writerow(
            [_csv_cell(v) for v in (
                r.name, r.email, "Live" if r.kind == "live" else "Replay", r.created_at.isoformat(timespec="minutes"),
                r.join_link_sent_at.isoformat(timespec="minutes") if r.join_link_sent_at else "",
                r.reminder_sent_at.isoformat(timespec="minutes") if r.reminder_sent_at else "",
            )]
        )
    safe = "".join(c if c.isalnum() else "-" for c in webinar.title.lower()).strip("-")[:60] or "webinar"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{safe}-attendees.csv"'},
    )


@router.delete("/registrations/{registration_id}")
async def admin_delete_registration(registration_id: uuid.UUID, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    row = await db.get(WebinarRegistration, registration_id)
    if row:
        await db.delete(row)
        await db.commit()
    return {"status": "deleted"}
