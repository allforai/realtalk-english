# Source: design.md entity: DailyConversationCount (CN001 enforcement)
"""DailyConversationCount model for tracking free-tier daily conversation limits."""

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class DailyConversationCount(Base, UUIDMixin):
    __tablename__ = "daily_conversation_counts"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    date: Mapped[date] = mapped_column(Date, nullable=False)
    count: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="idx_daily_conv_user_date"),
    )
