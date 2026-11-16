import asyncio
import logging
from contextlib import asynccontextmanager, suppress
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import InterfaceError, OperationalError

from app.api.routes import (
    admin_auth,
    admin_blog,
    admin_jobs,
    admin_webinars,
    admin_data,
    auth,
    blog,
    careers,
    forms,
    health,
    jobs,
    newsletter,
    partners,
    projects,
    webinars,
)
from app.core.config import settings
from app.core.rate_limit import GlobalRateLimitMiddleware, limiter

# Application logs (e.g. "[email] Sent ...") at INFO on stderr -> docker logs.
# uvicorn configures only its own loggers, so app.* needs a root handler.
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

# Largest legitimate request is a 5 MB upload; leave headroom for multipart overhead.
MAX_REQUEST_BYTES = 6 * 1024 * 1024

# Upload folders that are safe to serve publicly. CVs are deliberately NOT here:
# they are personal data and only reachable through the admin download endpoint.
PUBLIC_UPLOAD_DIRS = ("webinars", "projects", "partners", "blog")

@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Imported here so the email/database modules load after logging is set up.
    from app.services.newsletter import newsletter_loop
    from app.services.webinars import reminder_loop

    tasks = []
    if settings.webinar_reminders_enabled:
        tasks.append(asyncio.create_task(reminder_loop()))
    if settings.newsletter_updates_on:
        tasks.append(asyncio.create_task(newsletter_loop()))
    yield
    for task in tasks:
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task


app = FastAPI(
    lifespan=lifespan,
    title="Danamo Tech Hub API",
    version="0.1.0",
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

db_log = logging.getLogger("app.db")


async def database_unavailable(request: Request, exc: Exception) -> JSONResponse:
    """The database is unreachable (down, restarting, refusing connections).

    Answer 503 with one log line instead of a 500 and a full traceback per
    request; clients and the health check can tell "try again" from a bug.
    """
    db_log.error("Database unavailable on %s %s: %s", request.method, request.url.path, exc.__class__.__name__)
    return JSONResponse(
        status_code=503,
        content={"detail": "Service temporarily unavailable. Please try again shortly."},
        headers={"Retry-After": "10"},
    )


# asyncpg raises ConnectionRefusedError (a ConnectionError) unwrapped when the
# server is not listening; SQLAlchemy wraps other connection failures.
for _exc in (ConnectionError, OperationalError, InterfaceError):
    app.add_exception_handler(_exc, database_unavailable)


@app.middleware("http")
async def security_headers_and_size_limit(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > MAX_REQUEST_BYTES:
        return JSONResponse({"detail": "Request body too large"}, status_code=413)

    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-site"
    return response


# Order matters: the last middleware added runs first. CORS must wrap everything
# so 429 responses still carry CORS headers and the browser can read them.
app.add_middleware(GlobalRateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    # Only the public site calls the API cross-origin. The admin console goes
    # through its own same-origin proxy and needs no CORS access.
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

# Uploaded public assets are served at /uploads/<dir>/*
for sub in PUBLIC_UPLOAD_DIRS:
    path = Path("storage") / sub
    path.mkdir(parents=True, exist_ok=True)
    app.mount(f"/uploads/{sub}", StaticFiles(directory=path), name=f"uploads-{sub}")
Path("storage/cvs").mkdir(parents=True, exist_ok=True)

for module in (
    health,
    newsletter,
    auth,
    forms,
    careers,
    webinars,
    admin_auth,
    admin_data,
    admin_blog,
    admin_jobs,
    admin_webinars,
    projects,
    partners,
    blog,
    jobs,
):
    app.include_router(module.router, prefix="/api/v1")
