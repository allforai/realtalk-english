# Source: design.md Section 6 -- core/deps.py
"""FastAPI dependency injection: database session, current user, role checking."""

from typing import Any, Dict, List
from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_token


async def get_current_user(request: Request) -> Dict[str, Any]:
    """Extract the current authenticated user from request state (set by AuthMiddleware).

    Returns a dict with at least ``user_id`` (UUID str) and ``roles`` (list[str]).
    """
    user_id: str | None = getattr(request.state, "user_id", None)
    roles: List[str] = getattr(request.state, "roles", [])

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return {"user_id": UUID(user_id), "roles": roles}


def require_roles(*allowed_roles: str):
    """Return a dependency that checks the current user has at least one of the allowed roles."""

    async def _check(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_roles = current_user.get("roles", [])
        if not any(role in allowed_roles for role in user_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return _check
