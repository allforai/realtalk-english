# Source: design.md entity: SystemConfig
"""SystemConfig repository for runtime configuration."""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.system_config import SystemConfig
from app.repositories.base import GenericRepository


class SystemConfigRepository(GenericRepository[SystemConfig]):
    model = SystemConfig

    async def get_by_key(self, key: str) -> Optional[SystemConfig]:
        """Fetch a config entry by key."""
        # TODO: implement get_by_key
        stmt = select(SystemConfig).where(SystemConfig.key == key)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_int(self, key: str, default: int = 0) -> int:
        """Get config value as int."""
        # TODO: implement get_int
        pass
