# Source: design.md Section 4.4 -- Review handler
"""Review (spaced repetition) endpoints: today's cards, rate card, summary."""

from typing import Any, Dict
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.review import RateCardReq

router = APIRouter()


@router.get("/today")
async def get_today_cards(
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get today's due review cards. Source: T007."""
    # TODO: implement -- delegate to ReviewService.get_today_cards()
    return success(data={"message": "TODO: implement"})


@router.post("/{card_id}/rate")
async def rate_card(
    card_id: UUID,
    body: RateCardReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Submit rating for a review card, FSRS recalculates. Source: T007, TS004."""
    # TODO: implement -- delegate to ReviewService.rate_card()
    return success(data={"message": "TODO: implement"})


@router.get("/summary")
async def get_summary(
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get review session summary. Source: T007."""
    # TODO: implement -- delegate to ReviewService.get_summary()
    return success(data={"message": "TODO: implement"})
