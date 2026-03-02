# Source: design.md Section 4.6 -- Recommendation DTOs
"""Recommendation response schemas."""

from pydantic import BaseModel

from app.schemas.scenario import ScenarioListItem


class RecommendationDTO(BaseModel):
    scenario: ScenarioListItem
    reason: str
    score: float
