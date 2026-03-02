# Source: design.md Section 4.10 -- Notification handler
"""Notification endpoints: list, mark read, update settings."""

from typing import Any, Dict
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.notification import NotificationSettingsReq

router = APIRouter()


@router.get("")
async def list_notifications(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """List notifications for current user. Source: T044."""
    # TODO: implement -- delegate to NotificationService.list_notifications()
    return success(data={"message": "TODO: implement"})


@router.patch("/{notification_id}/read")
async def mark_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Mark a notification as read. Source: T044."""
    # TODO: implement -- delegate to NotificationService.mark_read()
    return success(data={"message": "TODO: implement"})


@router.put("/settings")
async def update_settings(
    body: NotificationSettingsReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update push/email notification preferences. Source: T044."""
    # TODO: implement -- delegate to NotificationService.update_settings()
    return success(data={"message": "TODO: implement"})
