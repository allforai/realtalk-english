# Source: design.md entity: Subscription
"""Subscription model with SubscriptionPlan and SubscriptionStatus enums."""

import enum
import uuid
from datetime import datetime
from typing import Any, Dict, Optional

from sqlalchemy import DateTime, ForeignKey, Index, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class SubscriptionPlan(str, enum.Enum):
    free = "free"
    monthly = "monthly"
    yearly = "yearly"


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    cancelled = "cancelled"
    trial = "trial"


class Subscription(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "subscriptions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    revenuecat_id: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, nullable=True,
    )
    plan: Mapped[SubscriptionPlan] = mapped_column(
        server_default=SubscriptionPlan.free.value,
        nullable=False,
    )
    status: Mapped[SubscriptionStatus] = mapped_column(
        server_default=SubscriptionStatus.active.value,
        nullable=False,
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    raw_webhook_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        Index("idx_sub_user", "user_id"),
        UniqueConstraint("revenuecat_id", name="idx_sub_rc"),
    )
