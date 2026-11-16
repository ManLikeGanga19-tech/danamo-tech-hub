"""webinar start times, reminders, replay leads, one registration per email

Revision ID: c3d4e5f6a7b8
Revises: b7c8d9e0f1a2
Create Date: 2026-11-16 15:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, None] = "b7c8d9e0f1a2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("webinars", sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("webinars", sa.Column("duration_minutes", sa.BigInteger(), server_default="60", nullable=False))
    op.add_column("webinars", sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True))
    op.create_index("ix_webinars_starts_at", "webinars", ["starts_at"])

    op.add_column("webinar_registrations", sa.Column("kind", sa.String(length=10), server_default="live", nullable=False))
    op.add_column("webinar_registrations", sa.Column("join_link_sent_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("webinar_registrations", sa.Column("reminder_sent_at", sa.DateTime(timezone=True), nullable=True))

    # One registration per email per webinar: keep the earliest of any duplicates.
    op.execute(
        """
        DELETE FROM webinar_registrations r
        USING webinar_registrations keep
        WHERE r.webinar_id = keep.webinar_id
          AND r.kind = keep.kind
          AND lower(r.email) = lower(keep.email)
          AND (r.created_at, r.id::text) > (keep.created_at, keep.id::text)
        """
    )
    op.execute("UPDATE webinar_registrations SET email = lower(email)")
    op.create_index(
        "uq_webinar_registrations_webinar_kind_email",
        "webinar_registrations",
        ["webinar_id", "kind", "email"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index("uq_webinar_registrations_webinar_kind_email", table_name="webinar_registrations")
    op.drop_column("webinar_registrations", "reminder_sent_at")
    op.drop_column("webinar_registrations", "join_link_sent_at")
    op.drop_column("webinar_registrations", "kind")
    op.drop_index("ix_webinars_starts_at", table_name="webinars")
    op.drop_column("webinars", "updated_at")
    op.drop_column("webinars", "duration_minutes")
    op.drop_column("webinars", "starts_at")
