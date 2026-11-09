from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import hash_password, verify_password, hash_session_token, needs_rehash
from app.core.session import create_session, set_session_cookie, clear_session_cookie, get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models import User, Session
from app.schemas.auth import SignupIn, LoginIn, UserOut, ProfileUpdateIn

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserOut, status_code=201)
async def signup(payload: SignupIn, request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    existing = await db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    user = User(email=payload.email.lower(), hashed_password=hash_password(payload.password), full_name=payload.full_name)
    db.add(user)
    await db.flush()
    token = await create_session(db, user, request.headers.get("user-agent"))
    set_session_cookie(response, token)
    return user

@router.post("/login", response_model=UserOut)
async def login(payload: LoginIn, request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account disabled")
    if needs_rehash(user.hashed_password):
        user.hashed_password = hash_password(payload.password)
    token = await create_session(db, user, request.headers.get("user-agent"))
    set_session_cookie(response, token)
    return user

@router.post("/logout", status_code=204)
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    raw = request.cookies.get(settings.session_cookie_name)
    if raw:
        row = await db.scalar(select(Session).where(Session.token_hash == hash_session_token(raw)))
        if row:
            await db.delete(row)
            await db.commit()
    clear_session_cookie(response)

@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserOut)
async def update_me(payload: ProfileUpdateIn, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user
