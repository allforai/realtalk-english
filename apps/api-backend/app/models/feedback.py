# Source: design.md entity: Feedback
"""Feedback model with FeedbackType and FeedbackStatus enums."""

import enum
import uuid
from typing import Any, Dict, Optional

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class FeedbackType(str, enum.Enum):
    bug = "bug"
    feature = "feature"
    complaint = "complaint"
    other = "other"


class FeedbackStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class Feedback(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "feedbacks"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    type: Mapped[FeedbackType] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    screenshot_urls: Mapped[Dict[str, Any]] = mapped_column(JSONB, server_default="'[]'", nullable=False)
    status: Mapped[FeedbackStatus] = mapped_column(
        server_default=FeedbackStatus.pending.value,
        nullable=False,
    )
    admin_reply: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resolved_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True,
    )

    __table_args__ = (
        Index("idx_feedback_user", "user_id"),
        Index("idx_feedback_status", "status"),
    )
