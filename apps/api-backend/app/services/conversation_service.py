# Source: design.md TASK-B2-008 -- Conversation service
"""Conversation service: create, send message (text/audio), complete, list."""

from typing import Any, AsyncGenerator, Dict, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.conversation_repo import ConversationRepository
from app.repositories.daily_count_repo import DailyCountRepository


class ConversationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ConversationRepository(session)
        self.daily_count_repo = DailyCountRepository(session)

    async def create(self, user_id: UUID, scenario_id: UUID) -> Dict[str, Any]:
        """Start a new conversation.

        - Check scenario exists and is published
        - Increment DailyConversationCount
        - Create Conversation(status=active)
        Source: T002, CN001
        """
        # TODO: implement create from T002
        pass

    async def send_message(self, conv_id: UUID, content: str, user_id: UUID) -> AsyncGenerator:
        """Send text message and stream AI response via SSE.

        - Persist user message
        - Call ai_client.stream_conversation()
        - Yield SSE tokens
        - Persist AI message
        - Extract vocabulary
        - Yield done event
        Source: T002, TS001, TS005
        """
        # TODO: implement send_message from T002
        yield  # placeholder for async generator

    async def send_audio(self, conv_id: UUID, audio_bytes: bytes, user_id: UUID) -> AsyncGenerator:
        """Send audio message: STT + pronunciation assessment + AI response.

        - Call speech_service.speech_to_text()
        - Call speech_service.assess_pronunciation()
        - Yield pronunciation SSE event
        - Delegate to send_message flow
        Source: T002, T005, TS002
        """
        # TODO: implement send_audio from T002, T005
        yield  # placeholder for async generator

    async def complete(self, conv_id: UUID, user_id: UUID) -> Dict[str, Any]:
        """End conversation and trigger report generation.

        - Set status=completed
        - Call report_service.generate_report()
        Source: T002, T003
        """
        # TODO: implement complete from T003
        pass

    async def get_conversation(self, conv_id: UUID, user_id: UUID) -> Dict[str, Any]:
        """Get conversation with messages."""
        # TODO: implement get_conversation from T002
        pass

    async def get_report(self, conv_id: UUID, user_id: UUID) -> Dict[str, Any]:
        """Get conversation report. Source: T003."""
        # TODO: implement get_report from T003
        pass

    async def list_conversations(self, user_id: UUID, page: int = 1, size: int = 20) -> Dict[str, Any]:
        """List user conversations, newest first. Source: T002."""
        # TODO: implement list_conversations from T002
        pass
