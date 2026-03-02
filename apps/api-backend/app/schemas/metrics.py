# Source: design.md Section 4.8 -- Metrics Dashboard DTOs
"""Metrics dashboard request/response schemas."""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class MetricValue(BaseModel):
    name: str
    value: float
    unit: str = ""
    change_pct: Optional[float] = None


class MetricsDashboard(BaseModel):
    dau: int = 0
    mau: int = 0
    retention_d1: float = 0.0
    retention_d7: float = 0.0
    retention_d30: float = 0.0
    avg_speaking_time_seconds: float = 0.0
    revenue_summary: Dict[str, Any] = {}
    metrics: List[MetricValue] = []


class AlertRequest(BaseModel):
    metric_name: str = Field(..., max_length=100)
    threshold: float
    operator: str = Field(..., pattern="^(gt|lt|gte|lte)$")
