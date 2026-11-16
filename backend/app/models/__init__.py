import secrets
import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, BigInteger, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role: Mapped[str] = mapped_column(String(20), default="user", server_default="user")
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str | None] = mapped_column(String(120))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    bio: Mapped[str | None] = mapped_column(Text)
    title: Mapped[str | None] = mapped_column(String(120))
    company: Mapped[str | None] = mapped_column(String(120))
    phone: Mapped[str | None] = mapped_column(String(40))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    has_seen_welcome: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    has_seen_greeting: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
class Session(Base):
    __tablename__ = "sessions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    user_agent: Mapped[str | None] = mapped_column(String(255))

class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(32))
    provider_user_id: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("provider", "provider_user_id", name="uq_oauth_provider_user"),)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(320))
    subject: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class ServiceInquiry(Base):
    __tablename__ = "service_inquiries"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(320))
    company: Mapped[str | None] = mapped_column(String(120))
    service_slug: Mapped[str] = mapped_column(String(80), index=True)
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    unsubscribed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # Secret per subscriber for the one-click unsubscribe link in every email.
    unsubscribe_token: Mapped[str] = mapped_column(String(64), unique=True, default=lambda: secrets.token_urlsafe(32))

class CvFile(Base):
    __tablename__ = "cv_files"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    original_filename: Mapped[str] = mapped_column(String(255))
    storage_key: Mapped[str] = mapped_column(String(500), unique=True)
    mime_type: Mapped[str] = mapped_column(String(120))
    size_bytes: Mapped[int] = mapped_column(BigInteger)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class CareerApplication(Base):
    __tablename__ = "career_applications"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(320))
    phone: Mapped[str | None] = mapped_column(String(40))
    role_slug: Mapped[str] = mapped_column(String(80), index=True)
    cover_letter: Mapped[str | None] = mapped_column(Text)
    cv_file_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("cv_files.id", ondelete="SET NULL"))
    # Optional uploaded cover letter (stored like CVs); the typed one is cover_letter.
    cover_letter_file_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("cv_files.id", ondelete="SET NULL"), nullable=True)
    job_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("job_openings.id", ondelete="SET NULL"), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(20), default="received")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class WebinarRegistration(Base):
    __tablename__ = "webinar_registrations"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    webinar_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("webinars.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(320))
    webinar_title: Mapped[str] = mapped_column(String(255)) # Keep this for easy reading
    # "live" = registered for the session, "replay" = unlocked the recording.
    kind: Mapped[str] = mapped_column(String(10), default="live", server_default="live")
    # When the join link was last emailed, and when the 24-hour reminder went out.
    join_link_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reminder_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Webinar(Base):
    __tablename__ = "webinars"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    # Display text derived from starts_at (East Africa Time), e.g. "Tuesday, 24 November 2026" / "3:00 PM EAT".
    date: Mapped[str] = mapped_column(String(100))
    time: Mapped[str] = mapped_column(String(100))
    # Real start time: drives reminders and when a webinar counts as past.
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    duration_minutes: Mapped[int] = mapped_column(BigInteger, default=60, server_default="60")
    host: Mapped[str] = mapped_column(String(120))
    image_url: Mapped[str] = mapped_column(String(500))
    
    # Links
    join_url: Mapped[str | None] = mapped_column(String(500), nullable=True) # For live upcoming
    replay_url: Mapped[str | None] = mapped_column(String(500), nullable=True) # For past
    
    # Status: 'upcoming' or 'past'
    status: Mapped[str] = mapped_column(String(20), default="upcoming")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(80), index=True)
    description: Mapped[str] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text)
    
    client_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    client_industry: Mapped[str | None] = mapped_column(String(120), nullable=True)
    
    image_url: Mapped[str] = mapped_column(String(500))
    gallery: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string array
    technologies: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string array
    
    live_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    status: Mapped[str] = mapped_column(String(20), default="draft", server_default="draft")
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Partner(Base):
    __tablename__ = "partners"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120))
    logo_url: Mapped[str] = mapped_column(String(500))
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    display_order: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class BlogPost(Base):
    """Blog article written in Markdown from the admin console."""

    __tablename__ = "blog_posts"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    excerpt: Mapped[str] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text)  # Markdown
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tags: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON list of strings
    author_name: Mapped[str] = mapped_column(String(120), default="Daniel Oganga", server_default="Daniel Oganga")
    read_minutes: Mapped[int] = mapped_column(BigInteger, default=1, server_default="1")
    status: Mapped[str] = mapped_column(String(20), default="draft", server_default="draft", index=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class JobOpening(Base):
    """Open role listed on /careers, managed from the admin console."""

    __tablename__ = "job_openings"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(120))
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    employment_type: Mapped[str] = mapped_column(String(20))  # Full-time | Part-time | Contract | Internship
    location: Mapped[str] = mapped_column(String(120))
    workplace: Mapped[str] = mapped_column(String(20))  # Remote | Hybrid | On-site
    summary: Mapped[str] = mapped_column(String(300))
    about: Mapped[str] = mapped_column(Text)  # paragraphs separated by blank lines
    # JSON lists of strings
    responsibilities: Mapped[str] = mapped_column(Text, default="[]", server_default="[]")
    requirements: Mapped[str] = mapped_column(Text, default="[]", server_default="[]")
    nice_to_have: Mapped[str] = mapped_column(Text, default="[]", server_default="[]")
    offer: Mapped[str] = mapped_column(Text, default="[]", server_default="[]")
    status: Mapped[str] = mapped_column(String(20), default="draft", server_default="draft", index=True)  # draft | open | closed
    display_order: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class NewsletterAnnouncement(Base):
    """One "new on Danamo Tech" email to all subscribers, queued when something is published.

    Unique per (kind, ref_id) so republishing never emails subscribers twice.
    """

    __tablename__ = "newsletter_announcements"
    __table_args__ = (UniqueConstraint("kind", "ref_id", name="uq_newsletter_announcements_kind_ref"),)
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kind: Mapped[str] = mapped_column(String(20))  # blog | webinar | job | project
    ref_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str] = mapped_column(Text)
    path: Mapped[str] = mapped_column(String(300))  # site path, e.g. /blog/my-post
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="queued", server_default="queued", index=True)  # queued | sending | sent | cancelled | failed
    send_after: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    # Resume point: subscribers are emailed in id order; the last one done is kept here.
    cursor: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    sent_count: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
