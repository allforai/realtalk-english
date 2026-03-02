# Source: design.md Section 4.2 -- Scenario DTOs
"""Scenario request/response schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ScenarioListQuery(BaseModel):
    difficulty: Optional[str] = None
    tag_id: Optional[UUID] = None
    role: Optional[str] = None
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)


class ScenarioListItem(BaseModel):
    id: UUID
    title: str
    difficulty: str
    tags: List[str] = []
    progress: Optional[str] = None  # "not_started" | "in_progress" | "completed"
    cover_image_url: Optional[str] = None
    avg_score: Optional[float] = None


class ScenarioDetail(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    difficulty: str
    target_roles: List[str] = []
    dialogue_nodes: List[Dict[str, Any]] = []
    tags: List[str] = []
    status: str
    author_id: Optional[UUID] = None
    reviewer_id: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ScenarioCreateReq(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    difficulty: str
    target_roles: List[str] = []
    dialogue_nodes: List[Dict[str, Any]] = []
    tag_ids: List[UUID] = []
    prompt_template_id: Optional[UUID] = None


class ReviewRequest(BaseModel):
    action: str = Field(..., pattern="^(approve|reject)$")
    reason: Optional[str] = None  # Required if action == "reject"
