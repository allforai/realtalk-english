# Source: design.md Section 6 -- core/config.py
"""Application configuration via pydantic-settings, loaded from environment / .env file."""

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Application
    app_name: str = "realtalk-english-api"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/realtalk_english"

    # JWT
    jwt_secret: str = "change-me-to-a-random-string-at-least-32-chars"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    jwt_refresh_expire_days: int = 7

    # OpenAI
    openai_api_key: str = ""

    # Azure Speech
    azure_speech_key: str = ""
    azure_speech_region: str = "eastus"

    # RevenueCat
    revenuecat_webhook_secret: str = ""

    # Expo Push
    expo_push_url: str = "https://exp.host/--/api/v2/push/send"

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:8080"]

    # Database pool
    db_pool_size: int = 10
    db_max_overflow: int = 20


settings = Settings()
