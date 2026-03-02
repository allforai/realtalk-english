# Source: design.md entity: PronunciationScore
"""PronunciationScore model with CHECK constraints for score ranges."""

import uuid
from datetime import datetime
from typing import Any, Dict, Optional

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Index, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class PronunciationScore(Base, UUIDMixin):
    __tablename__ = "pronunciation_scores"

    message_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("conversation_messages.id"), nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    accuracy_score: Mapped[float] = mapped_column(Float, nullable=False)
    fluency_score: Mapped[float] = mapped_column(Float, nullable=False)
    completeness_score: Mapped[float] = mapped_column(Float, nullable=False)
    prosody_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # en-US only. Source: TS002
    phoneme_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    reference_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )

    __table_args__ = (
        CheckConstraint("accuracy_score >= 0.0 AND accuracy_score <= 1.0", name="chk_accuracy_range"),
        CheckConstraint("fluency_score >= 0.0 AND fluency_score <= 1.0", name="chk_fluency_range"),
        CheckConstraint("completeness_score >= 0.0 AND completeness_score <= 1.0", name="chk_completeness_range"),
        CheckConstraint(
            "prosody_score IS NULL OR (prosody_score >= 0.0 AND prosody_score <= 1.0)",
            name="chk_prosody_range",
        ),
        Index("idx_pron_user", "user_id"),
        Index("idx_pron_message", "message_id"),
    )
