# Source: design.md entity: Conversation
"""Conversation model with ConversationStatus enum."""

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDMixin

if TYPE_CHECKING:
    from app.models.conversation_message import ConversationMessage
    from app.models.user import User


class ConversationStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    abandoned = "abandoned"


class Conversation(Base, UUIDMixin):
    __tablename__ = "conversations"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    scenario_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=True,
    )
    status: Mapped[ConversationStatus] = mapped_column(
        server_default=ConversationStatus.active.value,
        nullable=False,
    )
    overall_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    grammar_errors: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    expression_suggestions: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    duration_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    message_count: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    word_count: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="conversations")
    scenario: Mapped[Optional["Scenario"]] = relationship(back_populates="conversations")  # type: ignore[name-defined]
    messages: Mapped[List["ConversationMessage"]] = relationship(
        back_populates="conversation", lazy="selectin", order_by="ConversationMessage.sequence",
    )

    __table_args__ = (
        Index("idx_conv_user", "user_id"),
        Index("idx_conv_user_date", "user_id", "created_at"),
        Index("idx_conv_scenario", "scenario_id"),
        Index("idx_conv_status", "status"),
    )
