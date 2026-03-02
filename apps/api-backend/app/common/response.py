# Source: design.md NFR-009 -- Unified API response envelope
"""Unified API response model: { code, message, data }."""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response envelope used by all endpoints."""

    code: int = 0
    message: str = "ok"
    data: Optional[T] = None


def success(data: Any = None, message: str = "ok") -> dict:
    """Helper to build a success response dict."""
    return {"code": 0, "message": message, "data": data}


def error(code: int, message: str, data: Any = None) -> dict:
    """Helper to build an error response dict."""
    return {"code": code, "message": message, "data": data}
