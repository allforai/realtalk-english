# Source: design.md entity: ReviewCard -- TASK-B2-009
"""ReviewCard repository with due-card queries."""

from datetime import date
from typing import Any, Dict, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review_card import ReviewCard
from app.repositories.base import GenericRepository


class ReviewCardRepository(GenericRepository[ReviewCard]):
    model = ReviewCard

    async def get_due_cards(self, user_id: UUID, as_of: date) -> List[ReviewCard]:
        """Get cards due for review on or before the given date."""
        # TODO: implement get_due_cards -- WHERE user_id = :user_id AND due <= :as_of ORDER BY due ASC
        pass

    async def count_reviewed_today(self, user_id: UUID, today: date) -> int:
        """Count how many cards were reviewed today."""
        # TODO: implement count_reviewed_today
        pass
