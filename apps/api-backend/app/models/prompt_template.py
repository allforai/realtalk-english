# Source: design.md entity: PromptTemplate
"""PromptTemplate model for AI conversation prompts."""

import uuid
from typing import Any, Dict, Optional

from sqlalchemy import Boolean, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class PromptTemplate(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "prompt_templates"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    user_prompt_template: Mapped[str] = mapped_column(Text, nullable=False)
    variables: Mapped[Dict[str, Any]] = mapped_column(JSONB, server_default="'[]'", nullable=False)
    version: Mapped[int] = mapped_column(Integer, server_default="1", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
    author_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )

    __table_args__ = (
        Index("idx_prompt_active", "is_active"),
    )
