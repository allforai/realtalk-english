# Source: design.md Section 4.10 -- Notification DTOs
"""Notification request/response schemas."""

from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel


class NotificationDTO(BaseModel):
    id: UUID
    type: str
    title: str
    body: str
    is_read: bool = False
    data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None


class NotificationSettingsReq(BaseModel):
    push_enabled: bool = True
    email_enabled: bool = True
    quiet_hours_start: Optional[str] = None  # e.g. "22:00"
    quiet_hours_end: Optional[str] = None    # e.g. "08:00"
