# Source: design.md entity: ReviewCard
"""ReviewCard model with FSRS parameters and CardState enum."""

import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class CardState(str, enum.Enum):
    new = "new"
    learning = "learning"
    review = "review"
    relearning = "relearning"


class ReviewCard(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "review_cards"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    vocabulary_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("vocabulary_items.id"), nullable=False,
    )
    stability: Mapped[float] = mapped_column(Float, nullable=False)
    difficulty: Mapped[float] = mapped_column(Float, nullable=False)
    elapsed_days: Mapped[int] = mapped_column(Integer, nullable=False)
    scheduled_days: Mapped[int] = mapped_column(Integer, nullable=False)
    reps: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    lapses: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    state: Mapped[CardState] = mapped_column(
        server_default=CardState.new.value,
        nullable=False,
    )
    due: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_review: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("idx_review_user_due", "user_id", "due"),
        Index("idx_review_vocab", "vocabulary_id"),
    )
