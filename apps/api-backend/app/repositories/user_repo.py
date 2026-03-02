# Source: design.md entity: User -- TASK-B2-002
"""User repository with auth-specific queries."""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import GenericRepository


class UserRepository(GenericRepository[User]):
    model = User

    async def get_by_email(self, email: str) -> Optional[User]:
        """Find a user by email address."""
        # TODO: implement get_by_email
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_phone(self, phone: str) -> Optional[User]:
        """Find a user by phone number."""
        # TODO: implement get_by_phone
        stmt = select(User).where(User.phone == phone)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
