# Source: design.md TASK-B2-014 -- User management service
"""User management service: search, detail, ban/unban."""

from typing import Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repo import UserRepository


class UserMgmtService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)

    async def search_users(self, query: str = "", page: int = 1, size: int = 20) -> Dict[str, Any]:
        """Search users by name/email/phone using ILIKE. Source: T033."""
        # TODO: implement search_users from T033
        pass

    async def get_user_detail(self, user_id: UUID) -> Dict[str, Any]:
        """Get user profile + subscription + learning summary. Source: T033."""
        # TODO: implement get_user_detail from T033
        pass

    async def ban_user(self, user_id: UUID, reason: str, confirm: bool, operator_id: UUID) -> None:
        """Ban a user account.

        - Require confirm=True (USER_001 if false)
        - Set is_banned=True, ban_reason
        - Invalidate sessions
        - Write AuditLog (CN008)
        Source: T033, CN008
        """
        # TODO: implement ban_user from T033
        pass

    async def unban_user(self, user_id: UUID, operator_id: UUID) -> None:
        """Unban a user account.

        - Set is_banned=False, clear ban_reason
        - Write AuditLog (CN008)
        Source: T033, CN008
        """
        # TODO: implement unban_user from T033
        pass
