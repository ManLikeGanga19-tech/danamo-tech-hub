from datetime import datetime, timedelta, timezone
from fastapi import Cookie, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import new_session_token, hash_session_token
from app.db.session import get_db
from app.models import Session, User

async def create_session(db: AsyncSession, user: User, user_agent: str | None) -> str:
    raw = new_session_token()
    db.add(Session(
        user_id=user.id,
        token_hash=hash_session_token(raw),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=settings.session_ttl_hours),
        user_agent=(user_agent or "")[:255] or None,
    ))
    await db.commit()
    return raw

def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.session_ttl_hours * 3600,
        path="/",
    )

def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(settings.session_cookie_name, path="/")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    cookie_token: str | None = Cookie(default=None, alias=settings.session_cookie_name),
) -> User:
    if not cookie_token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    row = await db.scalar(
        select(Session).where(Session.token_hash == hash_session_token(cookie_token))
    )
    if not row or row.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired")
    user = await db.get(User, row.user_id)
    if not user or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User inactive")
    return user
