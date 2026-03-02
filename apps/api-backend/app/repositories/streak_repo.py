# Source: design.md entity: UserStreak -- TASK-B2-010
"""UserStreak repository."""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_streak import UserStreak
from app.repositories.base import GenericRepository


class StreakRepository(GenericRepository[UserStreak]):
    model = UserStreak

    async def get_by_user(self, user_id: UUID) -> Optional[UserStreak]:
        """Get the active streak record for a user."""
        # TODO: implement get_by_user
        stmt = select(UserStreak).where(UserStreak.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
