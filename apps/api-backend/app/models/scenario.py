# Source: design.md entity: Scenario
"""Scenario model with ScenarioStatus and Difficulty enums."""

import enum
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class ScenarioStatus(str, enum.Enum):
    draft = "draft"
    review = "review"
    published = "published"
    rejected = "rejected"
    archived = "archived"


class Difficulty(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Scenario(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scenarios"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    difficulty: Mapped[Difficulty] = mapped_column(nullable=False)
    target_roles: Mapped[Dict[str, Any]] = mapped_column(JSONB, server_default="'[]'", nullable=False)
    dialogue_nodes: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    status: Mapped[ScenarioStatus] = mapped_column(
        server_default=ScenarioStatus.draft.value,
        nullable=False,
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    prompt_template_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("prompt_templates.id"), nullable=True,
    )
    pack_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scenario_packs.id"), nullable=True,
    )
    author_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    reviewer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True,
    )
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    conversations: Mapped[List["Conversation"]] = relationship(back_populates="scenario", lazy="selectin")  # type: ignore[name-defined]

    __table_args__ = (
        Index("idx_scenario_status", "status"),
        Index("idx_scenario_difficulty", "difficulty"),
        Index("idx_scenario_author", "author_id"),
        Index("idx_scenario_pack", "pack_id"),
    )
