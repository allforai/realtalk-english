# Source: design.md TASK-B2-015 -- Notification service
"""Notification service: list, mark read, update settings, create."""

from typing import Any, Dict, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.notification_repo import NotificationRepository


class NotificationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = NotificationRepository(session)

    async def list_notifications(self, user_id: UUID, page: int = 1, size: int = 20) -> Dict[str, Any]:
        """List notifications for a user, newest first, with unread count. Source: T044."""
        # TODO: implement list_notifications from T044
        pass

    async def mark_read(self, notification_id: UUID, user_id: UUID) -> None:
        """Mark a notification as read (with ownership check). Source: T044."""
        # TODO: implement mark_read from T044
        pass

    async def update_settings(self, user_id: UUID, preferences: Dict[str, Any]) -> None:
        """Update user notification preferences. Source: T044."""
        # TODO: implement update_settings from T044
        pass

    async def create_notification(
        self,
        user_id: UUID,
        type_: str,
        title: str,
        body: str,
        data: Dict[str, Any] | None = None,
    ) -> None:
        """Create a notification and trigger push if user has token. Source: T044, TS006."""
        # TODO: implement create_notification from T044
        pass
