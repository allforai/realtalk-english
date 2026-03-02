# Source: TS001 -- OpenAI/LangChain service wrapper
# Principle U4: Business layer never imports SDK directly.
"""AI client wrapper: conversation streaming, report generation, vocabulary extraction, recommendations."""

from typing import Any, AsyncGenerator, Dict, List

from app.core.config import settings


class AIClient:
    """Wraps OpenAI SDK calls. All AI interactions go through this service."""

    def __init__(self):
        # TODO: initialize openai.AsyncOpenAI with settings.openai_api_key
        pass

    async def stream_conversation(
        self, messages: List[Dict[str, str]], prompt_template: Dict[str, Any] | None = None
    ) -> AsyncGenerator[str, None]:
        """Stream AI conversation response token-by-token via SSE. Source: TS001.

        Includes:
        - Conversation history compression after N turns (PS2)
        - Content filter on input and output (PS1)
        - Retry with tenacity (3 retries, exponential backoff)
        """
        # TODO: implement stream_conversation from TS001
        yield ""  # placeholder

    async def generate_report(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Generate a conversation report (non-streaming). Source: T003.

        Returns: {overall_score, grammar_errors[], expression_suggestions[]}
        """
        # TODO: implement generate_report from T003
        pass

    async def extract_vocabulary(self, messages: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """Extract new vocabulary from conversation messages. Source: T002."""
        # TODO: implement extract_vocabulary from T002
        pass

    async def generate_recommendations(
        self, user_profile: Dict[str, Any], history: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate personalized scenario recommendations. Source: T020."""
        # TODO: implement generate_recommendations from T020
        pass

    async def score_quality(self, conversation: Dict[str, Any]) -> float:
        """Score AI conversation quality. Source: T029."""
        # TODO: implement score_quality from T029
        pass
