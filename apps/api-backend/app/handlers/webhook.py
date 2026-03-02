# Source: design.md Section 4.11 -- Webhook handler
"""Webhook receiver: RevenueCat subscription events."""

from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db

router = APIRouter()


@router.post("/revenuecat")
async def revenuecat_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Process RevenueCat subscription webhook events. Source: TS003, CN005.

    Auth: Signature verification (HMAC), not JWT.
    Always returns 200 to RevenueCat even on processing errors.
    """
    # TODO: implement -- verify signature, delegate to SubscriptionService.process_webhook()
    # 1. Read raw body for signature verification
    # 2. Verify HMAC signature from header
    # 3. Parse payload
    # 4. Process webhook event
    # 5. Always return 200 to RevenueCat
    return success(data={"message": "TODO: implement"})
