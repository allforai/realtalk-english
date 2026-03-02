# Source: design.md TASK-B2-010 -- Streak service
"""Streak service: get, update, restore."""

from typing import Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.streak_repo import StreakRepository


class StreakService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = StreakRepository(session)

    async def get_streak(self, user_id: UUID) -> Dict[str, Any]:
        """Get current streak info including can_restore flag. Source: T013."""
        # TODO: implement get_streak from T013
        pass

    async def update_streak(self, user_id: UUID) -> None:
        """Update streak after conversation completion.

        - If last_active_date == yesterday: increment current_streak
        - If last_active_date == today: no-op
        - Else: streak broken (reset to 1)
        - Update longest_streak if exceeded
        """
        # TODO: implement update_streak from T013
        pass

    async def restore_streak(self, user_id: UUID) -> Dict[str, Any]:
        """Restore a broken streak (1 per calendar month).

        - Check restorations_this_month < 1 (reset if month changed)
        - Restore streak
        - Increment counter
        - Return STREAK_001 if limit reached
        Source: T013, CN004
        """
        # TODO: implement restore_streak from T013, CN004
        pass
