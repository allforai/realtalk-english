# Source: design.md TASK-B2-008 -- Report service
"""Report generation service: AI-powered conversation reports with fallback."""

from typing import Any, Dict
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession


class ReportService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def generate_report(self, conversation_id: UUID) -> Dict[str, Any]:
        """Generate a comprehensive conversation report.

        - Call ai_client.generate_report() for scoring and analysis
        - Extract grammar errors and expression suggestions
        - Calculate basic stats (duration, word count, message count)
        - Create ReviewCards for new vocabulary via srs_service
        - Fallback: if AI fails, return basic stats only
        Source: T003, TS001
        """
        # TODO: implement generate_report from T003
        pass
