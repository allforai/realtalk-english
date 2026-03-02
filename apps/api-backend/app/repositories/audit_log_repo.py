# Source: design.md entity: AuditLog -- CN005, CN008
"""AuditLog repository -- append-only, no update/delete."""

from typing import Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog
from app.repositories.base import GenericRepository


class AuditLogRepository(GenericRepository[AuditLog]):
    model = AuditLog

    async def create_log(
        self,
        operator_id: UUID | None,
        action: str,
        target_entity: str,
        target_id: UUID,
        payload: Dict[str, Any] | None = None,
        idempotency_key: str | None = None,
        ip_address: str | None = None,
    ) -> AuditLog:
        """Create an audit log entry (append-only)."""
        # TODO: implement create_log
        pass

    async def check_idempotency(self, key: str) -> bool:
        """Check if an idempotency key already exists."""
        # TODO: implement check_idempotency
        pass
