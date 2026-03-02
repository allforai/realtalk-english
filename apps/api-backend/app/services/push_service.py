# Source: TS006 -- Expo Push API service wrapper
# Principle U4: Business layer never imports SDK directly.
"""Push notification service via Expo Push API."""

from typing import Any, Dict, List, Optional

from app.core.config import settings


class SendResult:
    """Result of a single push notification send."""

    def __init__(self, success: bool = False, ticket_id: str = "", error: str = ""):
        self.success = success
        self.ticket_id = ticket_id
        self.error = error


class PushService:
    """Wraps Expo Push HTTP API. All push operations go through this service."""

    def __init__(self):
        # TODO: initialize httpx.AsyncClient with settings.expo_push_url
        pass

    async def send_notification(
        self, push_token: str, title: str, body: str, data: Dict[str, Any] | None = None
    ) -> bool:
        """Send a single push notification. Source: TS006.

        Retry: tenacity, 2 retries.
        Handle expired push tokens gracefully.
        """
        # TODO: implement send_notification from TS006
        pass

    async def send_bulk(self, notifications: List[Dict[str, Any]]) -> List[SendResult]:
        """Batch send notifications (up to 100 per request). Source: TS006."""
        # TODO: implement send_bulk from TS006
        pass

    async def schedule_review_reminder(self, user_id: str, push_token: str) -> None:
        """Check due cards and send reminder if any due today. Source: T007."""
        # TODO: implement schedule_review_reminder from T007
        pass
