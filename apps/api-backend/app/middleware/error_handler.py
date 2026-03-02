# Source: design.md Section 5 -- [3] ErrorHandlerMiddleware
"""Global error handler: catch AppError and unhandled exceptions, return unified ApiResponse."""

import logging
import traceback

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.common.exceptions import AppError

logger = logging.getLogger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        try:
            return await call_next(request)
        except AppError as exc:
            return JSONResponse(
                status_code=exc.http_status,
                content={"code": exc.http_status, "message": exc.message, "data": exc.data},
            )
        except Exception as exc:
            logger.error("Unhandled exception: %s\n%s", exc, traceback.format_exc())
            return JSONResponse(
                status_code=500,
                content={"code": 500, "message": "Internal server error", "data": None},
            )
