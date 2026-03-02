# Source: design.md entity: DailyConversationCount -- CN001
"""DailyConversationCount repository with atomic upsert."""

from datetime import date
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.daily_conversation_count import DailyConversationCount
from app.repositories.base import GenericRepository


class DailyCountRepository(GenericRepository[DailyConversationCount]):
    model = DailyConversationCount

    async def increment(self, user_id: UUID, today: date) -> int:
        """Atomic upsert: INSERT ... ON CONFLICT UPDATE count = count + 1. Returns new count."""
        # TODO: implement increment with INSERT ON CONFLICT
        pass

    async def get_count(self, user_id: UUID, today: date) -> int:
        """Get today's conversation count for a user."""
        # TODO: implement get_count
        pass
