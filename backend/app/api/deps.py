from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import hash_session_token
from app.db.session import get_db
from app.models import User, Session

async def get_current_admin(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    token = request.cookies.get(settings.admin_cookie_name)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Admin session missing")
    
    row = await db.scalar(select(Session).where(Session.token_hash == hash_session_token(token)))
    if not row:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid session")
        
    user = await db.get(User, row.user_id)
    if not user or user.role not in ["admin", "superadmin"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required")
        
    return user