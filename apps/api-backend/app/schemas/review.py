# Source: design.md Section 4.4 -- Review DTOs
"""Review (spaced repetition) request/response schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class VocabularyInfo(BaseModel):
    word: str
    definition: Optional[str] = None
    example: Optional[str] = None


class ReviewCardDTO(BaseModel):
    id: UUID
    vocabulary: VocabularyInfo
    due: datetime
    state: str


class RateCardReq(BaseModel):
    rating: int = Field(..., ge=1, le=4)  # 1=again, 2=hard, 3=good, 4=easy


class ReviewSummary(BaseModel):
    total_due: int = 0
    reviewed: int = 0
    retention_rate: float = 0.0
    next_due_at: Optional[datetime] = None
