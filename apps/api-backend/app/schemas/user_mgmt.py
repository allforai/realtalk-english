# Source: design.md Section 4.9 -- User Management DTOs
"""User management request/response schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class UserListItem(BaseModel):
    id: UUID
    email: str
    display_name: str
    is_active: bool = True
    is_banned: bool = False
    subscription_tier: str = "free"
    created_at: Optional[datetime] = None


class UserDetail(BaseModel):
    id: UUID
    email: str
    phone: Optional[str] = None
    display_name: str
    avatar_url: Optional[str] = None
    english_level: str = "beginner"
    is_active: bool = True
    is_banned: bool = False
    ban_reason: Optional[str] = None
    subscription_tier: str = "free"
    created_at: Optional[datetime] = None
    learning_summary: Dict[str, Any] = {}


class BanUserReq(BaseModel):
    reason: str = Field(..., min_length=1)
    confirm: bool = False  # Must be True to proceed, else 400 USER_001
