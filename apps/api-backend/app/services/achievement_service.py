# Source: design.md TASK-B2-010 -- Achievement service
"""Achievement service: list achievements, check and award."""

from typing import Any, Dict, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.achievement_repo import AchievementRepository


class AchievementService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = AchievementRepository(session)

    async def list_achievements(self, user_id: UUID) -> List[Dict[str, Any]]:
        """List all achievements with earned_at (null if not earned). Source: T013."""
        # TODO: implement list_achievements from T013
        pass

    async def check_and_award(self, user_id: UUID) -> List[Dict[str, Any]]:
        """Evaluate criteria for unearned achievements and award matching ones.

        - Check each achievement's criteria against user stats
        - Award new achievements
        - Send push notification for new awards
        """
        # TODO: implement check_and_award from T013
        pass
