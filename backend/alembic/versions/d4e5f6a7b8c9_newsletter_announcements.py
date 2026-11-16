"""newsletter announcements and unsubscribe tokens

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-11-16 18:00:00.000000

"""
import secrets
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("newsletter_subscribers", sa.Column("unsubscribe_token", sa.String(length=64), nullable=True))
    conn = op.get_bind()
    for (sub_id,) in conn.execute(sa.text("SELECT id FROM newsletter_subscribers")).all():
        conn.execute(
            sa.text("UPDATE newsletter_subscribers SET unsubscribe_token = :t WHERE id = :id"),
            {"t": secrets.token_urlsafe(32), "id": sub_id},
        )
    op.alter_column("newsletter_subscribers", "unsubscribe_token", nullable=False)
    op.create_index("ix_newsletter_subscribers_unsubscribe_token", "newsletter_subscribers", ["unsubscribe_token"], unique=True)

    op.create_table(
        "newsletter_announcements",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("kind", sa.String(length=20), nullable=False),
        sa.Column("ref_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("path", sa.String(length=300), nullable=False),
        sa.Column("image_url", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=20), server_default="queued", nullable=False),
        sa.Column("send_after", sa.DateTime(timezone=True), nullable=False),
        sa.Column("cursor", sa.UUID(), nullable=True),
        sa.Column("sent_count", sa.BigInteger(), server_default="0", nullable=False),
        sa.Column("note", sa.String(length=300), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("kind", "ref_id", name="uq_newsletter_announcements_kind_ref"),
    )
    op.create_index("ix_newsletter_announcements_status", "newsletter_announcements", ["status"])
    op.create_index("ix_newsletter_announcements_send_after", "newsletter_announcements", ["send_after"])


def downgrade() -> None:
    op.drop_index("ix_newsletter_announcements_send_after", table_name="newsletter_announcements")
    op.drop_index("ix_newsletter_announcements_status", table_name="newsletter_announcements")
    op.drop_table("newsletter_announcements")
    op.drop_index("ix_newsletter_subscribers_unsubscribe_token", table_name="newsletter_subscribers")
    op.drop_column("newsletter_subscribers", "unsubscribe_token")
