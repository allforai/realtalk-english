# Source: design.md entity: UserStreak
"""UserStreak model -- one active streak record per user."""

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class UserStreak(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_streaks"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False,
    )
    current_streak: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    last_active_date: Mapped[date] = mapped_column(Date, nullable=False)
    restorations_this_month: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    restoration_month: Mapped[date] = mapped_column(Date, nullable=False)

    __table_args__ = (
        Index("idx_streak_user", "user_id", unique=True),
    )
