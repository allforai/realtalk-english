# Source: design.md Section 4.2 -- Scenario handler
"""Scenario endpoints: list, detail, create, update, submit-review, review, review-queue."""

from typing import Any, Dict
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.schemas.scenario import ReviewRequest, ScenarioCreateReq

router = APIRouter()


@router.get("")
async def list_scenarios(
    difficulty: str | None = None,
    tag_id: UUID | None = None,
    role: str | None = None,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """List published scenarios with filters. Source: T001."""
    # TODO: implement -- delegate to ScenarioService.list_scenarios()
    return success(data={"message": "TODO: implement"})


@router.get("/review-queue")
async def review_queue(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """List pending review scenarios. Source: T010."""
    # TODO: implement -- delegate to ScenarioService.get_review_queue()
    return success(data={"message": "TODO: implement"})


@router.get("/{scenario_id}")
async def get_scenario(
    scenario_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get scenario detail with user progress. Source: T001."""
    # TODO: implement -- delegate to ScenarioService.get_scenario()
    return success(data={"message": "TODO: implement"})


@router.post("", status_code=201)
async def create_scenario(
    body: ScenarioCreateReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Create a new draft scenario. Source: T009."""
    # TODO: implement -- delegate to ScenarioService.create_scenario()
    return success(data={"message": "TODO: implement"})


@router.put("/{scenario_id}")
async def update_scenario(
    scenario_id: UUID,
    body: ScenarioCreateReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Update a draft scenario. Source: T009."""
    # TODO: implement -- delegate to ScenarioService.update_scenario()
    return success(data={"message": "TODO: implement"})


@router.post("/{scenario_id}/submit-review")
async def submit_review(
    scenario_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Submit scenario for review (draft -> review). Source: T009, CN006."""
    # TODO: implement -- delegate to ScenarioService.submit_for_review()
    return success(data={"message": "TODO: implement"})


@router.post("/{scenario_id}/review")
async def review_scenario(
    scenario_id: UUID,
    body: ReviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("operator", "admin")),
):
    """Approve or reject a scenario. Source: T010, CN006."""
    # TODO: implement -- delegate to ScenarioService.review_scenario()
    return success(data={"message": "TODO: implement"})
