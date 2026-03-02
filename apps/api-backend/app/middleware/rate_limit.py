# Source: design.md Section 5 -- [5] RateLimitMiddleware (CN001)
"""Rate limit middleware: free-tier users limited to 3 conversations/day.

Only applies to POST /api/v1/conversations. Queries DailyConversationCount
to enforce the limit. Premium users bypass.
"""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Only check rate limit on conversation creation
        if request.method == "POST" and request.url.path == "/api/v1/conversations":
            # TODO: implement CN001 check
            # 1. Get user_id from request.state (set by AuthMiddleware)
            # 2. Query DailyConversationCount for (user_id, today)
            # 3. If count >= SystemConfig['free_daily_limit'] AND user.subscription_tier == 'free':
            #    return JSONResponse(status_code=429, content={...})
            pass

        return await call_next(request)
