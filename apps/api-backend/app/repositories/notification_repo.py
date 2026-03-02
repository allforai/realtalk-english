# Source: design.md entity: Notification -- TASK-B2-015
"""Notification repository."""

from typing import Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.repositories.base import GenericRepository


class NotificationRepository(GenericRepository[Notification]):
    model = Notification

    async def list_by_user(self, user_id: UUID, page: int = 1, size: int = 20) -> Dict[str, Any]:
        """List notifications for a user, newest first."""
        # TODO: implement list_by_user -- ORDER BY created_at DESC
        pass

    async def count_unread(self, user_id: UUID) -> int:
        """Count unread notifications for a user."""
        # TODO: implement count_unread
        pass

    async def mark_read(self, notification_id: UUID, user_id: UUID) -> bool:
        """Mark a notification as read (ownership check)."""
        # TODO: implement mark_read
        pass
