# Source: design.md -- shared pagination utilities
"""Pagination request params and paginated response model."""

from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Common pagination query parameters."""

    page: int = Field(default=1, ge=1, description="Page number (1-based)")
    size: int = Field(default=20, ge=1, le=100, description="Items per page")


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated list wrapper."""

    items: List[T] = []
    total: int = 0
    page: int = 1
    size: int = 20
    pages: int = 0
