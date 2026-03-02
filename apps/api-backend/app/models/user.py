# Source: design.md entity: User
"""User model with EnglishLevel and SubscriptionTier enums."""

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, Index, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.conversation import Conversation
    from app.models.role import Role


class EnglishLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class SubscriptionTier(str, enum.Enum):
    free = "free"
    premium = "premium"
    pro = "pro"


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    native_language: Mapped[str] = mapped_column(String(10), server_default="zh-CN", nullable=False)
    english_level: Mapped[EnglishLevel] = mapped_column(
        server_default=EnglishLevel.beginner.value,
        nullable=False,
    )
    learning_goal: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="true", nullable=False)
    is_banned: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
    ban_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    deactivated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    subscription_tier: Mapped[SubscriptionTier] = mapped_column(
        server_default=SubscriptionTier.free.value,
        nullable=False,
    )
    expo_push_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    conversations: Mapped[List["Conversation"]] = relationship(back_populates="user", lazy="selectin")

    __table_args__ = (
        Index("idx_user_email", "email", unique=True),
        Index("idx_user_phone", "phone", unique=True),
        Index("idx_user_active", "is_active", "is_banned"),
    )
