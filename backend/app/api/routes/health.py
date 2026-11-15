from fastapi import APIRouter, Request

from app.core.rate_limit import limiter
router = APIRouter(tags=["health"])

@router.get("/health")
@limiter.exempt
async def health(request: Request):
    return {"status": "ok"}
