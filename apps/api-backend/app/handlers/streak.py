# Source: design.md Section 4.5 -- Streak handler
"""Streak endpoints: get current streak, restore broken streak."""

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import get_current_user

router = APIRouter()


@router.get("/me")
async def get_current_streak(
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get current streak info. Source: T013."""
    # TODO: implement -- delegate to StreakService.get_streak()
    return success(data={"message": "TODO: implement"})


@router.post("/restore")
async def restore_streak(
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Restore a broken streak (max 1 per calendar month). Source: T013, CN004."""
    # TODO: implement -- delegate to StreakService.restore_streak()
    return success(data={"message": "TODO: implement"})
