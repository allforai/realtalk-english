# Source: design.md Section 5 -- [6] AuditLogMiddleware (CN005, CN008)
"""Audit log middleware: capture request/response for sensitive operations.

Configured paths: /webhooks/revenuecat, /admin/users/*/ban, /admin/users/*/unban.
Writes AuditLog record after handler completes.
"""

import re

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

# Patterns for paths that require audit logging
AUDIT_PATTERNS = [
    re.compile(r"^/api/v1/webhooks/revenuecat$"),
    re.compile(r"^/api/v1/admin/users/[^/]+/ban$"),
    re.compile(r"^/api/v1/admin/users/[^/]+/unban$"),
]


class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path
        should_audit = any(pattern.match(path) for pattern in AUDIT_PATTERNS)

        response = await call_next(request)

        if should_audit:
            # TODO: implement audit log write (CN005, CN008)
            # 1. Read operator_id from request.state.user_id
            # 2. Capture request body (cache bytes on request)
            # 3. Capture response status code
            # 4. Write AuditLog record as background task
            pass

        return response
