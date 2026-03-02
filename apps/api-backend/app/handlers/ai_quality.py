# Source: design.md Section 4.7 -- AI Quality handler (operator)
"""AI quality monitoring endpoints: overview, low-score conversations."""

from typing import Any, Dict

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import require_roles

router = APIRouter()


@router.get("/overview")
async def get_overview(
    date_from: str | None = None,
    date_to: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Get AI quality score overview and trends. Source: T029."""
    # TODO: implement -- delegate to AIQualityService.get_overview()
    return success(data={"message": "TODO: implement"})


@router.get("/low-score")
async def get_low_score_conversations(
    threshold: float = Query(default=3.0),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """List low-score conversations. Source: T029."""
    # TODO: implement -- delegate to AIQualityService.get_low_score_conversations()
    return success(data={"message": "TODO: implement"})
