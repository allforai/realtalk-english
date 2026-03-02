# Source: design.md Section 5 -- [4] AuthMiddleware
"""Validate JWT from Authorization header, set request.state.user_id and request.state.roles.

Skips public paths: /api/v1/auth/*, /health, /docs, /openapi.json, /redoc, /api/v1/webhooks/*.
"""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.security import decode_token

# Paths that do not require authentication
PUBLIC_PATH_PREFIXES = (
    "/api/v1/auth/",
    "/health",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/api/v1/webhooks/",
)


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Skip authentication for public paths
        path = request.url.path
        if any(path.startswith(prefix) for prefix in PUBLIC_PATH_PREFIXES):
            request.state.user_id = None
            request.state.roles = []
            return await call_next(request)

        # Extract token
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"code": 401, "message": "Missing or invalid Authorization header", "data": None},
            )

        token = auth_header.removeprefix("Bearer ")
        payload = decode_token(token)
        if payload is None:
            return JSONResponse(
                status_code=401,
                content={"code": 401, "message": "Invalid or expired token", "data": None},
            )

        # Set user context on request state
        request.state.user_id = payload.get("sub")
        request.state.roles = payload.get("roles", [])

        return await call_next(request)
