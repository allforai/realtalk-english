# Source: design.md Section 4.9 -- User Management handler (admin)
"""User management endpoints: search, detail, ban, unban."""

from typing import Any, Dict
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import require_roles
from app.schemas.user_mgmt import BanUserReq

router = APIRouter()


@router.get("")
async def search_users(
    q: str = Query(default="", description="Search by name/email/phone"),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("admin")),
):
    """Search users. Source: T033."""
    # TODO: implement -- delegate to UserMgmtService.search_users()
    return success(data={"message": "TODO: implement"})


@router.get("/{user_id}")
async def get_user_detail(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("admin")),
):
    """Get user detail with learning summary. Source: T033."""
    # TODO: implement -- delegate to UserMgmtService.get_user_detail()
    return success(data={"message": "TODO: implement"})


@router.post("/{user_id}/ban")
async def ban_user(
    user_id: UUID,
    body: BanUserReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("admin")),
):
    """Ban a user (requires confirmation). Source: T033, CN008."""
    # TODO: implement -- delegate to UserMgmtService.ban_user()
    return success(data={"message": "TODO: implement"})


@router.post("/{user_id}/unban")
async def unban_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_roles("admin")),
):
    """Unban a user. Source: T033, CN008."""
    # TODO: implement -- delegate to UserMgmtService.unban_user()
    return success(data={"message": "TODO: implement"})
