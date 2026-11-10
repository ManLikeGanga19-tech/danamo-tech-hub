from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import verify_password, hash_session_token
from app.core.session import create_session
from app.db.session import get_db
from app.models import User, Session
from app.schemas.auth import LoginIn, UserOut
from app.api.deps import get_current_admin

router = APIRouter(prefix="/admin/auth", tags=["admin_auth"])
limiter = Limiter(key_func=get_remote_address)

@router.post("/login", response_model=UserOut)
@limiter.limit("5/minute")
async def admin_login(
    request: Request, 
    response: Response,
    payload: LoginIn, 
    db: AsyncSession = Depends(get_db)
):
    user = await db.scalar(select(User).where(User.email == payload.email.lower()))
    
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    
    if user.role not in ["admin", "superadmin"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Access denied. Admin privileges required.")
        
    raw_token = await create_session(db, user, request.headers.get("user-agent"), custom_ttl=settings.admin_session_ttl_hours)
    
    # HARDCODED FOR LOCAL DEVELOPMENT
    response.set_cookie(
        key=settings.admin_cookie_name,
        value=raw_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.admin_session_ttl_hours * 3600,
        path="/",
    )
    return user

@router.get("/me", response_model=UserOut)
async def admin_me(current_admin: User = Depends(get_current_admin)):
    return current_admin

@router.post("/logout", status_code=204)
async def admin_logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    raw = request.cookies.get(settings.admin_cookie_name)
    if raw:
        row = await db.scalar(select(Session).where(Session.token_hash == hash_session_token(raw)))
        if row:
            await db.delete(row)
            await db.commit()
    
    response.delete_cookie(settings.admin_cookie_name, path="/", samesite="lax", secure=False)