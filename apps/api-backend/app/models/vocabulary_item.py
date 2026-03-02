# Source: design.md entity: VocabularyItem
"""VocabularyItem model with SourceType and MasteryLevel enums."""

import enum
import uuid
from typing import Optional

from sqlalchemy import ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class SourceType(str, enum.Enum):
    auto_collected = "auto_collected"
    manual = "manual"


class MasteryLevel(str, enum.Enum):
    new = "new"
    learning = "learning"
    mastered = "mastered"


class VocabularyItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "vocabulary_items"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    word: Mapped[str] = mapped_column(String(200), nullable=False)
    definition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    example_sentence: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_conversation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=True,
    )
    source_type: Mapped[SourceType] = mapped_column(
        server_default=SourceType.auto_collected.value,
        nullable=False,
    )
    mastery_level: Mapped[MasteryLevel] = mapped_column(
        server_default=MasteryLevel.new.value,
        nullable=False,
    )

    __table_args__ = (
        Index("idx_vocab_user", "user_id"),
        UniqueConstraint("user_id", "word", name="idx_vocab_user_word"),
    )
