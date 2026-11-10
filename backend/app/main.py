from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from pathlib import Path

from app.core.config import settings
from app.api.routes import (
    health, newsletter, auth, forms, careers, webinars,
    admin_auth, admin_data, projects, partners
)


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Danamo Tech Hub API", version="0.1.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, settings.allowed_admin_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

app.add_middleware(SlowAPIMiddleware)

# Create storage folders on startup
Path("storage/cvs").mkdir(parents=True, exist_ok=True)
Path("storage/webinars").mkdir(parents=True, exist_ok=True)

# Serve uploaded files at /uploads/*
app.mount("/uploads", StaticFiles(directory="storage"), name="uploads")

# Routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(newsletter.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(forms.router, prefix="/api/v1")
app.include_router(careers.router, prefix="/api/v1")
app.include_router(webinars.router, prefix="/api/v1")
app.include_router(admin_auth.router, prefix="/api/v1")
app.include_router(admin_data.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(partners.router, prefix="/api/v1")