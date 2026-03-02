# Source: design.md Section 8 -- Error Code Registry
"""Centralized error code constants. Each code maps to an HTTP status and default message."""

from enum import Enum
from typing import NamedTuple


class ErrorInfo(NamedTuple):
    http_status: int
    message: str


class ErrorCode(str, Enum):
    """All application error codes from design.md Section 8."""

    # Auth errors
    AUTH_001 = "AUTH_001"  # 401 - Invalid credentials
    AUTH_002 = "AUTH_002"  # 401 - Token expired
    AUTH_003 = "AUTH_003"  # 403 - Account banned
    AUTH_004 = "AUTH_004"  # 403 - Insufficient permissions

    # Conversation errors
    CONV_001 = "CONV_001"  # 429 - Daily conversation limit reached
    CONV_002 = "CONV_002"  # 404 - Conversation not found
    CONV_003 = "CONV_003"  # 504 - AI response timeout
    CONV_004 = "CONV_004"  # 400 - Conversation already completed

    # Scenario errors
    SCEN_001 = "SCEN_001"  # 404 - Scenario not found
    SCEN_002 = "SCEN_002"  # 422 - Minimum 3 dialogue nodes required
    SCEN_003 = "SCEN_003"  # 422 - Scenario name required
    SCEN_004 = "SCEN_004"  # 422 - Difficulty level required
    SCEN_005 = "SCEN_005"  # 400 - Rejection reason required
    SCEN_006 = "SCEN_006"  # 409 - Invalid status transition

    # Review errors
    REVIEW_001 = "REVIEW_001"  # 404 - Review card not found
    REVIEW_002 = "REVIEW_002"  # 400 - Invalid rating value

    # Streak errors
    STREAK_001 = "STREAK_001"  # 400 - Monthly restoration limit reached
    STREAK_002 = "STREAK_002"  # 400 - Streak not broken, nothing to restore

    # Speech errors
    SPEECH_001 = "SPEECH_001"  # 502 - Speech service unavailable

    # User management errors
    USER_001 = "USER_001"  # 400 - Ban confirmation required
    USER_002 = "USER_002"  # 404 - User not found

    # Config errors
    CONFIG_001 = "CONFIG_001"  # 422 - Threshold out of range [0.0, 1.0]

    # General errors
    GENERAL_001 = "GENERAL_001"  # 500 - Internal server error
    GENERAL_002 = "GENERAL_002"  # 422 - Validation error


ERROR_DETAILS: dict[str, ErrorInfo] = {
    ErrorCode.AUTH_001: ErrorInfo(401, "Invalid credentials"),
    ErrorCode.AUTH_002: ErrorInfo(401, "Token expired"),
    ErrorCode.AUTH_003: ErrorInfo(403, "Account banned"),
    ErrorCode.AUTH_004: ErrorInfo(403, "Insufficient permissions"),
    ErrorCode.CONV_001: ErrorInfo(429, "Daily conversation limit reached"),
    ErrorCode.CONV_002: ErrorInfo(404, "Conversation not found"),
    ErrorCode.CONV_003: ErrorInfo(504, "AI response timeout"),
    ErrorCode.CONV_004: ErrorInfo(400, "Conversation already completed"),
    ErrorCode.SCEN_001: ErrorInfo(404, "Scenario not found"),
    ErrorCode.SCEN_002: ErrorInfo(422, "Minimum 3 dialogue nodes required"),
    ErrorCode.SCEN_003: ErrorInfo(422, "Scenario name required"),
    ErrorCode.SCEN_004: ErrorInfo(422, "Difficulty level required"),
    ErrorCode.SCEN_005: ErrorInfo(400, "Rejection reason required"),
    ErrorCode.SCEN_006: ErrorInfo(409, "Invalid status transition"),
    ErrorCode.REVIEW_001: ErrorInfo(404, "Review card not found"),
    ErrorCode.REVIEW_002: ErrorInfo(400, "Invalid rating value"),
    ErrorCode.STREAK_001: ErrorInfo(400, "Monthly restoration limit reached"),
    ErrorCode.STREAK_002: ErrorInfo(400, "Streak not broken, nothing to restore"),
    ErrorCode.SPEECH_001: ErrorInfo(502, "Speech service unavailable (fallback to text)"),
    ErrorCode.USER_001: ErrorInfo(400, "Ban confirmation required"),
    ErrorCode.USER_002: ErrorInfo(404, "User not found"),
    ErrorCode.CONFIG_001: ErrorInfo(422, "Threshold out of range [0.0, 1.0]"),
    ErrorCode.GENERAL_001: ErrorInfo(500, "Internal server error"),
    ErrorCode.GENERAL_002: ErrorInfo(422, "Validation error"),
}
