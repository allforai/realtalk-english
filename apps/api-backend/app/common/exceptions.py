# Source: design.md Section 8 -- Error Code Registry
"""Application exception hierarchy."""


class AppError(Exception):
    """Base application error with machine-readable error code."""

    def __init__(self, code: str, message: str, http_status: int = 400, data=None):
        self.code = code
        self.message = message
        self.http_status = http_status
        self.data = data
        super().__init__(message)


class AuthenticationError(AppError):
    """401-class authentication errors."""

    def __init__(self, code: str = "AUTH_001", message: str = "Invalid credentials"):
        super().__init__(code=code, message=message, http_status=401)


class AuthorizationError(AppError):
    """403-class authorization errors."""

    def __init__(self, code: str = "AUTH_004", message: str = "Insufficient permissions"):
        super().__init__(code=code, message=message, http_status=403)


class NotFoundError(AppError):
    """404 resource not found."""

    def __init__(self, code: str = "GENERAL_001", message: str = "Resource not found"):
        super().__init__(code=code, message=message, http_status=404)


class ConflictError(AppError):
    """409 conflict (e.g. invalid state transition)."""

    def __init__(self, code: str = "SCEN_006", message: str = "Invalid status transition"):
        super().__init__(code=code, message=message, http_status=409)


class ValidationError(AppError):
    """422 validation error."""

    def __init__(self, code: str = "GENERAL_002", message: str = "Validation error"):
        super().__init__(code=code, message=message, http_status=422)


class RateLimitError(AppError):
    """429 rate limit exceeded."""

    def __init__(self, code: str = "CONV_001", message: str = "Daily conversation limit reached"):
        super().__init__(code=code, message=message, http_status=429)


class ExternalServiceError(AppError):
    """502/504 external service failure."""

    def __init__(self, code: str = "SPEECH_001", message: str = "External service unavailable", http_status: int = 502):
        super().__init__(code=code, message=message, http_status=http_status)
