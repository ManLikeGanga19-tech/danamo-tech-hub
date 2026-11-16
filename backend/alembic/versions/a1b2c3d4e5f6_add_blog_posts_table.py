"""add blog posts table

Revision ID: a1b2c3d4e5f6
Revises: 328cf47000f9
Create Date: 2026-11-15 17:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "328cf47000f9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "blog_posts",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=200), nullable=False),
        sa.Column("excerpt", sa.String(length=500), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("cover_image_url", sa.String(length=500), nullable=True),
        sa.Column("tags", sa.Text(), nullable=True),
        sa.Column("author_name", sa.String(length=120), server_default="Daniel Oganga", nullable=False),
        sa.Column("read_minutes", sa.BigInteger(), server_default="1", nullable=False),
        sa.Column("status", sa.String(length=20), server_default="draft", nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_blog_posts_slug", "blog_posts", ["slug"], unique=True)
    op.create_index("ix_blog_posts_status", "blog_posts", ["status"])
    op.create_index("ix_blog_posts_published_at", "blog_posts", ["published_at"])


def downgrade() -> None:
    op.drop_index("ix_blog_posts_published_at", table_name="blog_posts")
    op.drop_index("ix_blog_posts_status", table_name="blog_posts")
    op.drop_index("ix_blog_posts_slug", table_name="blog_posts")
    op.drop_table("blog_posts")
