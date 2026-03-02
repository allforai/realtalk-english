# Source: design.md Section 5 (Middleware Chain) + Section 6 (Service Architecture)
"""
RealTalk English API Backend
FastAPI application entry point with lifespan, middleware, and router registration.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine
from app.handlers import (
    achievement,
    ai_quality,
    auth,
    conversation,
    metrics,
    notification,
    recommendation,
    review,
    scenario,
    streak,
    system,
    user_mgmt,
    webhook,
)
from app.middleware.audit_log import AuditLogMiddleware
from app.middleware.auth import AuthMiddleware
from app.middleware.error_handler import ErrorHandlerMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_id import RequestIdMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown: database pool lifecycle."""
    # Startup: engine is created lazily by SQLAlchemy; nothing extra needed here.
    yield
    # Shutdown: dispose of the async engine connection pool.
    await engine.dispose()


app = FastAPI(
    title="RealTalk English API",
    description="AI-powered English conversation practice platform",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# Middleware chain (outermost first -> innermost last)
# Order matches design.md Section 5:
#   [1] CORS -> [2] RequestId -> [3] ErrorHandler -> [4] Auth -> [5] RateLimit -> [6] AuditLog
# FastAPI adds middleware in reverse order, so we register innermost first.
# ---------------------------------------------------------------------------

app.add_middleware(AuditLogMiddleware)          # [6]
app.add_middleware(RateLimitMiddleware)          # [5]
app.add_middleware(AuthMiddleware)               # [4]
app.add_middleware(ErrorHandlerMiddleware)       # [3]
app.add_middleware(RequestIdMiddleware)          # [2]
app.add_middleware(                              # [1]
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Router registration
# ---------------------------------------------------------------------------

API_V1 = "/api/v1"

app.include_router(auth.router,           prefix=f"{API_V1}/auth",                tags=["Auth"])
app.include_router(scenario.router,       prefix=f"{API_V1}/scenarios",            tags=["Scenarios"])
app.include_router(conversation.router,   prefix=f"{API_V1}/conversations",        tags=["Conversations"])
app.include_router(review.router,         prefix=f"{API_V1}/reviews",              tags=["Reviews"])
app.include_router(streak.router,         prefix=f"{API_V1}/streaks",              tags=["Streaks"])
app.include_router(achievement.router,    prefix=f"{API_V1}/achievements",         tags=["Achievements"])
app.include_router(recommendation.router, prefix=f"{API_V1}/recommendations",      tags=["Recommendations"])
app.include_router(ai_quality.router,     prefix=f"{API_V1}/admin/ai-quality",     tags=["AI Quality"])
app.include_router(metrics.router,        prefix=f"{API_V1}/admin/metrics",        tags=["Metrics"])
app.include_router(user_mgmt.router,      prefix=f"{API_V1}/admin/users",          tags=["User Management"])
app.include_router(notification.router,   prefix=f"{API_V1}/notifications",        tags=["Notifications"])
app.include_router(webhook.router,        prefix=f"{API_V1}/webhooks",             tags=["Webhooks"])
app.include_router(system.router,         prefix="",                               tags=["System"])
