# Source: design.md Section 4.8 -- Metrics Dashboard handler (operator)
"""Metrics dashboard endpoints: dashboard view, alert configuration."""

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import require_roles
from app.schemas.metrics import AlertRequest

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(
    date_from: str | None = None,
    date_to: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Get DAU/MAU/retention/revenue metrics dashboard. Source: T025."""
    # TODO: implement -- delegate to MetricsService.get_dashboard()
    return success(data={"message": "TODO: implement"})


@router.post("/alerts")
async def create_alert(
    body: AlertRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Set metric alert threshold. Source: T025."""
    # TODO: implement -- delegate to MetricsService.create_alert()
    return success(data={"message": "TODO: implement"})
