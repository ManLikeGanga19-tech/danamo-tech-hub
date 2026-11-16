"""add job openings, link applications to jobs, cover letter files

Revision ID: b7c8d9e0f1a2
Revises: a1b2c3d4e5f6
Create Date: 2026-11-16 12:00:00.000000

"""
import json
import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "b7c8d9e0f1a2"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Starting roles, inserted as DRAFTS: review and open them from the admin console.
SEED_JOBS = json.loads('[{"title": "Frontend Developer", "slug": "frontend-developer", "employment_type": "Full-time", "location": "Remote (Kenya)", "workplace": "Remote", "summary": "Build responsive, enterprise-grade web apps with React, Next.js, and Tailwind CSS.", "about": "Danamo Tech builds software that businesses and schools across Kenya rely on every day, including our own products ShuleHQ, WIFI.OS and VendaPOS, plus custom systems for clients.\\n\\nAs a Frontend Developer you will turn designs into fast, accessible interfaces and work closely with the backend team on the APIs behind them.", "responsibilities": ["Build and maintain web applications with React, Next.js and TypeScript", "Turn Figma designs into responsive, accessible, pixel-accurate UI", "Integrate REST APIs and handle loading, error and empty states properly", "Keep pages fast: code splitting, image optimisation and good Core Web Vitals", "Review pull requests and help keep the codebase clean and consistent"], "requirements": ["2+ years of professional experience with React", "Strong TypeScript, HTML and CSS (Tailwind CSS is a plus)", "Experience with Next.js (App Router) or a similar framework", "Comfortable with Git, pull requests and code review", "Good written English and clear communication when working remotely"], "nice_to_have": ["Experience with Framer Motion or other animation libraries", "Familiarity with accessibility standards (WCAG)", "Some backend experience (Python/FastAPI or Node.js)"], "offer": ["Remote-first work with flexible hours", "Real products used by real customers in Kenya", "Mentorship and time for learning", "Competitive pay based on experience"], "display_order": 0}, {"title": "Backend Engineer", "slug": "backend-engineer", "employment_type": "Full-time", "location": "Mombasa, Kenya", "workplace": "Hybrid", "summary": "Design scalable APIs, manage databases, and build robust infrastructure using Python or Node.js.", "about": "Our systems handle school records, billing and payments, so they need to be correct, secure and always available.\\n\\nAs a Backend Engineer you will design APIs, model data and run the services behind our products, working from our Mombasa office and remotely.", "responsibilities": ["Design and build REST APIs with Python (FastAPI) or Node.js", "Model data and write efficient queries and migrations for PostgreSQL", "Integrate third-party services such as M-Pesa, SMS and email providers", "Write automated tests and keep services observable with good logging", "Deploy and maintain services with Docker on Linux servers"], "requirements": ["3+ years building backend services in production", "Strong Python or Node.js, and solid SQL (PostgreSQL preferred)", "Understanding of authentication, security and data protection basics", "Experience with Docker and Linux", "Able to work from Mombasa at least part of the week"], "nice_to_have": ["M-Pesa Daraja API integration experience", "Redis, background jobs and caching", "CI/CD with GitHub Actions"], "offer": ["Hybrid work between our Mombasa office and home", "Ownership of systems that matter to our customers", "Mentorship and time for learning", "Competitive pay based on experience"], "display_order": 1}, {"title": "UI/UX Designer", "slug": "ui-ux-designer", "employment_type": "Part-time", "location": "Remote (Kenya)", "workplace": "Remote", "summary": "Craft intuitive, accessible, and visually stunning user experiences for our clients.", "about": "Good software starts with understanding the people who use it, from school bursars to shop owners.\\n\\nAs a part-time UI/UX Designer you will research, design and test the experiences for our products and client projects.", "responsibilities": ["Design user flows, wireframes and high-fidelity UI in Figma", "Maintain and extend our design system and components", "Run quick user interviews and usability tests, then act on what you learn", "Work with developers to make sure designs are built as intended"], "requirements": ["A portfolio showing web or mobile product design work", "Strong Figma skills, including components and auto layout", "Understanding of accessibility, typography and visual hierarchy", "Able to explain design decisions clearly"], "nice_to_have": ["Experience designing dashboards or admin tools", "Basic HTML/CSS knowledge", "Motion or illustration skills"], "offer": ["Flexible part-time schedule, fully remote", "Variety: our own products plus client projects", "Competitive pay based on experience"], "display_order": 2}]')


def upgrade() -> None:
    jobs = op.create_table(
        "job_openings",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("employment_type", sa.String(length=20), nullable=False),
        sa.Column("location", sa.String(length=120), nullable=False),
        sa.Column("workplace", sa.String(length=20), nullable=False),
        sa.Column("summary", sa.String(length=300), nullable=False),
        sa.Column("about", sa.Text(), nullable=False),
        sa.Column("responsibilities", sa.Text(), server_default="[]", nullable=False),
        sa.Column("requirements", sa.Text(), server_default="[]", nullable=False),
        sa.Column("nice_to_have", sa.Text(), server_default="[]", nullable=False),
        sa.Column("offer", sa.Text(), server_default="[]", nullable=False),
        sa.Column("status", sa.String(length=20), server_default="draft", nullable=False),
        sa.Column("display_order", sa.BigInteger(), server_default="0", nullable=False),
        sa.Column("posted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_job_openings_slug", "job_openings", ["slug"], unique=True)
    op.create_index("ix_job_openings_status", "job_openings", ["status"])

    op.add_column("career_applications", sa.Column("job_id", sa.UUID(), nullable=True))
    op.add_column("career_applications", sa.Column("cover_letter_file_id", sa.UUID(), nullable=True))
    op.create_index("ix_career_applications_job_id", "career_applications", ["job_id"])
    op.create_foreign_key("fk_career_applications_job_id", "career_applications", "job_openings", ["job_id"], ["id"], ondelete="SET NULL")
    op.create_foreign_key("fk_career_applications_cover_letter_file_id", "career_applications", "cv_files", ["cover_letter_file_id"], ["id"], ondelete="SET NULL")

    rows = []
    for job in SEED_JOBS:
        row = dict(job, id=uuid.uuid4(), status="draft")
        for key in ("responsibilities", "requirements", "nice_to_have", "offer"):
            row[key] = json.dumps(job[key])
        rows.append(row)
    op.bulk_insert(jobs, rows)


def downgrade() -> None:
    op.drop_constraint("fk_career_applications_cover_letter_file_id", "career_applications", type_="foreignkey")
    op.drop_constraint("fk_career_applications_job_id", "career_applications", type_="foreignkey")
    op.drop_index("ix_career_applications_job_id", table_name="career_applications")
    op.drop_column("career_applications", "cover_letter_file_id")
    op.drop_column("career_applications", "job_id")
    op.drop_index("ix_job_openings_status", table_name="job_openings")
    op.drop_index("ix_job_openings_slug", table_name="job_openings")
    op.drop_table("job_openings")
