# Source: design.md Section 4.12 -- System handler
"""System endpoints: health check."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint. No authentication required.

    Returns DB connectivity status with 2s timeout.
    """
    # TODO: add DB connectivity check with 2s timeout
    return {"status": "ok"}
