# Source: design.md entity: ScenarioPack
"""ScenarioPack model."""

from typing import Optional

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class ScenarioPack(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scenario_packs"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    price_cents: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
