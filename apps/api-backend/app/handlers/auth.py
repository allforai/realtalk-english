# Source: design.md Section 4.1 -- Auth handler
"""Auth endpoints: register, login, refresh, logout. All public (no auth required)."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.schemas.auth import LoginRequest, RefreshTokenRequest, RegisterRequest, TokenResponse

router = APIRouter()


@router.post("/register", status_code=201)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account. Source: T039."""
    # TODO: implement register -- delegate to AuthService.register()
    return success(data={"message": "TODO: implement"})


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email/password, return JWT pair. Source: T039."""
    # TODO: implement login -- delegate to AuthService.login()
    return success(data={"message": "TODO: implement"})


@router.post("/refresh")
async def refresh(body: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token. Source: T039."""
    # TODO: implement refresh -- delegate to AuthService.refresh()
    return success(data={"message": "TODO: implement"})


@router.post("/logout")
async def logout(body: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Invalidate refresh token. Source: T039."""
    # TODO: implement logout -- delegate to AuthService.logout()
    return success(data={"message": "TODO: implement"})
