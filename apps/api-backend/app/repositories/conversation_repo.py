# Source: design.md entity: Conversation -- TASK-B2-008
"""Conversation repository."""

from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation
from app.repositories.base import GenericRepository


class ConversationRepository(GenericRepository[Conversation]):
    model = Conversation

    async def list_by_user(self, user_id: UUID, page: int = 1, size: int = 20) -> Dict[str, Any]:
        """List conversations for a specific user, newest first."""
        # TODO: implement list_by_user
        pass

    async def get_with_messages(self, conversation_id: UUID) -> Optional[Conversation]:
        """Fetch conversation with all messages eagerly loaded."""
        # TODO: implement get_with_messages
        pass
