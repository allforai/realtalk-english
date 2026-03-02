# Source: design.md entity: Achievement -- TASK-B2-010
"""Achievement and UserAchievement repositories."""

from typing import Any, Dict, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.achievement import Achievement, UserAchievement
from app.repositories.base import GenericRepository


class AchievementRepository(GenericRepository[Achievement]):
    model = Achievement

    async def list_with_earned_status(self, user_id: UUID) -> List[Dict[str, Any]]:
        """List all achievements with earned_at for the given user (null if not earned)."""
        # TODO: implement list_with_earned_status -- LEFT JOIN user_achievements
        pass
