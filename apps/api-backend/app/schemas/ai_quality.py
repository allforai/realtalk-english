# Source: design.md Section 4.7 -- AI Quality DTOs
"""AI quality monitoring response schemas."""

from typing import Any, Dict, List

from pydantic import BaseModel


class QualityTrend(BaseModel):
    date: str
    avg_score: float


class QualityOverview(BaseModel):
    avg_score: float = 0.0
    score_distribution: Dict[str, int] = {}
    trend: List[QualityTrend] = []
