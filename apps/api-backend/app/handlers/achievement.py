# Source: design.md Section 4.5 -- Achievement handler
"""Achievement endpoint: list all achievements with earned status."""

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import get_current_user

router = APIRouter()


@router.get("")
async def list_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """List all achievements with earned/locked status. Source: T013."""
    # TODO: implement -- delegate to AchievementService.list_achievements()
    return success(data={"message": "TODO: implement"})
