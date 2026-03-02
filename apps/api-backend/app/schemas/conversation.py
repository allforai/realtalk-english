# Source: design.md Section 4.3 -- Conversation DTOs
"""Conversation request/response schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CreateConversationReq(BaseModel):
    scenario_id: UUID


class SendMessageReq(BaseModel):
    content: str = Field(..., min_length=1)


class SSEEvent(BaseModel):
    """Server-Sent Event payload."""
    event: str  # "token" | "pronunciation" | "vocabulary" | "done"
    data: Dict[str, Any] = {}


class ConversationReport(BaseModel):
    overall_score: Optional[float] = None
    grammar_errors: List[Dict[str, Any]] = []
    expression_suggestions: List[Dict[str, Any]] = []
    pronunciation_summary: Optional[Dict[str, Any]] = None
    duration_seconds: Optional[int] = None
    message_count: int = 0
    word_count: int = 0


class ConversationListItem(BaseModel):
    id: UUID
    scenario_id: Optional[UUID] = None
    status: str
    overall_score: Optional[float] = None
    message_count: int = 0
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
