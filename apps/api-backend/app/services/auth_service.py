# Source: design.md TASK-B2-002 -- Auth service
"""Authentication service: register, login, refresh, logout."""

from typing import Any, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repo import UserRepository


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)

    async def register(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new user account.

        - Validate unique email/phone
        - Hash password
        - Create User + assign 'consumer' role
        - Return JWT pair
        """
        # TODO: implement register from T039
        pass

    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user and return JWT pair.

        - Verify credentials (AUTH_001 on failure)
        - Check is_banned (AUTH_003 if banned)
        - Check is_active
        - Return access_token + refresh_token
        """
        # TODO: implement login from T039
        pass

    async def refresh(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh an access token using a valid refresh token."""
        # TODO: implement refresh from T039
        pass

    async def logout(self, refresh_token: str) -> None:
        """Invalidate a refresh token."""
        # TODO: implement logout from T039
        pass
