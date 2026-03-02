# Source: design.md entity: Subscription -- TASK-B2-016
"""Subscription repository."""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.subscription import Subscription
from app.repositories.base import GenericRepository


class SubscriptionRepository(GenericRepository[Subscription]):
    model = Subscription

    async def get_by_user(self, user_id: UUID) -> Optional[Subscription]:
        """Get active subscription for a user."""
        # TODO: implement get_by_user
        pass

    async def get_by_revenuecat_id(self, revenuecat_id: str) -> Optional[Subscription]:
        """Find subscription by RevenueCat ID."""
        # TODO: implement get_by_revenuecat_id
        pass
