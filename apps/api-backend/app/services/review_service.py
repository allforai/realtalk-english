# Source: design.md TASK-B2-009 -- Review (spaced repetition) service
"""Review service: today's cards, rate card, summary."""

from typing import Any, Dict, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.review_card_repo import ReviewCardRepository


class ReviewService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ReviewCardRepository(session)

    async def get_today_cards(self, user_id: UUID) -> List[Dict[str, Any]]:
        """Get today's due review cards with vocabulary details. Source: T007."""
        # TODO: implement get_today_cards from T007
        pass

    async def rate_card(self, card_id: UUID, rating: int, user_id: UUID) -> Dict[str, Any]:
        """Submit rating for a review card.

        - Validate ownership
        - Validate rating 1-4 (REVIEW_002 on failure)
        - Call srs_service.schedule_card()
        - Persist updated card
        - Update VocabularyItem mastery_level if graduated
        Source: T007, TS004
        """
        # TODO: implement rate_card from T007
        pass

    async def get_summary(self, user_id: UUID) -> Dict[str, Any]:
        """Get review session summary: total due, reviewed, retention rate. Source: T007."""
        # TODO: implement get_summary from T007
        pass
