# Source: design.md entity: Permission
"""Permission model (role_id, resource, action)."""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Index, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDMixin

if TYPE_CHECKING:
    from app.models.role import Role


class Permission(Base, UUIDMixin):
    __tablename__ = "permissions"

    role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    resource: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relationships
    role: Mapped["Role"] = relationship(back_populates="permissions")

    __table_args__ = (
        Index("idx_perm_role", "role_id"),
        UniqueConstraint("role_id", "resource", "action", name="uq_perm_role_resource_action"),
    )
