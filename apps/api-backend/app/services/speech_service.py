# Source: TS002 -- Azure Speech SDK service wrapper
# Principle U4: Business layer never imports SDK directly.
"""Speech service: STT, TTS, pronunciation assessment via Azure Cognitive Services."""

from typing import Any, Dict, Optional

from app.core.config import settings


class PronunciationResult:
    """Pronunciation assessment result."""

    def __init__(
        self,
        accuracy_score: float = 0.0,
        fluency_score: float = 0.0,
        completeness_score: float = 0.0,
        prosody_score: Optional[float] = None,
        phoneme_details: list | None = None,
        fallback: bool = False,
    ):
        self.accuracy_score = accuracy_score
        self.fluency_score = fluency_score
        self.completeness_score = completeness_score
        self.prosody_score = prosody_score
        self.phoneme_details = phoneme_details or []
        self.fallback = fallback


class SpeechService:
    """Wraps Azure Speech SDK. All speech operations go through this service."""

    def __init__(self):
        # TODO: initialize Azure Speech SDK with settings.azure_speech_key / region
        pass

    async def speech_to_text(self, audio_bytes: bytes) -> str:
        """Convert audio to text (STT). Source: TS002.

        On failure: returns empty string with fallback flag.
        Retry: tenacity, 2 retries, 1s backoff.
        """
        # TODO: implement speech_to_text from TS002
        pass

    async def assess_pronunciation(self, audio_bytes: bytes, reference_text: str) -> PronunciationResult:
        """Phoneme-level pronunciation assessment. Source: T005, TS002.

        Returns PronunciationResult with accuracy, fluency, completeness, prosody, phoneme_details.
        On failure: returns PronunciationResult(fallback=True). Never raises. Source: PS4.
        """
        # TODO: implement assess_pronunciation from T005, TS002
        return PronunciationResult(fallback=True)

    async def text_to_speech(self, text: str) -> bytes:
        """Generate reference audio from text (TTS). Source: T005."""
        # TODO: implement text_to_speech from T005
        pass
