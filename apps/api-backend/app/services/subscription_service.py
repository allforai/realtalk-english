# Source: design.md TASK-B2-016 -- Subscription service (TS003)
"""Subscription service: RevenueCat webhook processing."""

from typing import Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.subscription_repo import SubscriptionRepository


class SubscriptionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = SubscriptionRepository(session)

    async def process_webhook(self, event: Dict[str, Any]) -> None:
        """Process RevenueCat webhook event.

        - Parse event types: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION
        - Upsert Subscription record
        - Update User.subscription_tier cache
        - Write AuditLog (CN005)
        - Idempotency via event_id
        Source: TS003, CN005
        """
        # TODO: implement process_webhook from TS003
        pass

    async def verify_webhook_signature(self, body: bytes, signature: str) -> bool:
        """Verify RevenueCat webhook HMAC signature."""
        # TODO: implement verify_webhook_signature
        pass
