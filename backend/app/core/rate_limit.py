"""Rate limiting for the whole API — two layers, one shared store.

1. ``GlobalRateLimitMiddleware`` — applies ``GLOBAL_LIMITS`` per client IP to
   EVERY request (including unknown URLs, so scanners and floods are throttled),
   except ``EXEMPT_PATHS``. Implemented directly on ``limits`` because slowapi's
   own middleware cannot resolve routes under current FastAPI router internals
   and silently skips them.
2. ``limiter`` (slowapi) — stricter per-route limits applied with
   ``@limiter.limit(...)`` on abuse targets: auth, public forms, uploads.

Client IP: uvicorn runs with ``--proxy-headers`` behind Caddy, so the ASGI
``client`` is the real visitor IP taken from X-Forwarded-For. Caddy overwrites
any client-supplied X-Forwarded-For, so it cannot be spoofed as long as the
backend port stays bound to 127.0.0.1 / the private Docker network.

Counters live in Redis in production (shared by all workers, survive restarts);
``memory://`` is only for local development.
"""

import logging
import math
import time

from fastapi import Request
from limits import parse_many
from limits.storage import storage_from_string
from limits.strategies import MovingWindowRateLimiter
from slowapi import Limiter
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

from app.core.config import settings

log = logging.getLogger(__name__)

GLOBAL_LIMITS = "120/minute;2000/hour"
EXEMPT_PATHS = frozenset({"/api/v1/health"})

# Stricter per-route limits (stack on top of the global limit)
AUTH_LIMIT = "5/minute;20/hour"  # login / signup — brute-force protection
FORM_LIMIT = "5/minute;30/hour"  # contact, inquiries, newsletter, webinar forms
UPLOAD_LIMIT = "3/minute;10/hour"  # public CV upload
ADMIN_UPLOAD_LIMIT = "30/minute"  # authenticated admin image uploads


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


limiter = Limiter(
    key_func=client_ip,
    storage_uri=settings.rate_limit_storage_uri,
    strategy="moving-window",
    key_prefix="danamo-route",
)


class GlobalRateLimitMiddleware:
    """Pure ASGI middleware: per-IP limit on every HTTP request."""

    def __init__(self, app: ASGIApp, limits: str = GLOBAL_LIMITS) -> None:
        self.app = app
        self.items = parse_many(limits)
        self.window = MovingWindowRateLimiter(storage_from_string(settings.rate_limit_storage_uri))

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or scope["path"] in EXEMPT_PATHS or scope["method"] == "OPTIONS":
            await self.app(scope, receive, send)
            return

        client = scope.get("client")
        key = client[0] if client else "unknown"

        try:
            for item in self.items:
                if not self.window.hit(item, "danamo-global", key):
                    reset_at, _ = self.window.get_window_stats(item, "danamo-global", key)
                    retry_after = max(1, math.ceil(reset_at - time.time()))
                    response = JSONResponse(
                        {"detail": "Too many requests. Please slow down."},
                        status_code=429,
                        headers={"Retry-After": str(retry_after)},
                    )
                    await response(scope, receive, send)
                    return
        except Exception:  # storage outage must not take the site down
            log.exception("Global rate limiter storage error; allowing request")

        await self.app(scope, receive, send)
