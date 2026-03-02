# Source: design.md Section 4.5 -- Streak DTOs
"""Streak request/response schemas."""

from datetime import date
from typing import Optional

from pydantic import BaseModel


class StreakDTO(BaseModel):
    current_streak: int = 0
    longest_streak: int = 0
    last_active_date: Optional[date] = None
    can_restore: bool = False
