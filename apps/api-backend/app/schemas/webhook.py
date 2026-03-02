# Source: design.md Section 4.11 -- Webhook DTOs
"""RevenueCat webhook payload schema."""

from typing import Any, Dict, Optional

from pydantic import BaseModel


class RevenueCatWebhookPayload(BaseModel):
    """RevenueCat server notification payload. Source: TS003."""
    event_type: Optional[str] = None  # e.g. INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION
    event_id: Optional[str] = None
    app_user_id: Optional[str] = None
    product_id: Optional[str] = None
    entitlement_ids: list[str] = []
    period_type: Optional[str] = None
    purchased_at_ms: Optional[int] = None
    expiration_at_ms: Optional[int] = None
    environment: Optional[str] = None
    raw: Dict[str, Any] = {}
