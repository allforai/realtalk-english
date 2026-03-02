# Source: design.md Section 4.3 -- Conversation handler
"""Conversation endpoints: create, messages, audio, complete, report, list."""

from typing import Any, Dict
from uuid import UUID

from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.response import success
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.conversation import CreateConversationReq, SendMessageReq

router = APIRouter()


@router.post("", status_code=201)
async def create_conversation(
    body: CreateConversationReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Start a new conversation (checks CN001 rate limit). Source: T002, CN001."""
    # TODO: implement -- delegate to ConversationService.create()
    return success(data={"message": "TODO: implement"})


@router.get("")
async def list_conversations(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """List user conversations. Source: T002."""
    # TODO: implement -- delegate to ConversationService.list_conversations()
    return success(data={"message": "TODO: implement"})


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get conversation with messages. Source: T002."""
    # TODO: implement -- delegate to ConversationService.get_conversation()
    return success(data={"message": "TODO: implement"})


@router.post("/{conversation_id}/messages")
async def send_message(
    conversation_id: UUID,
    body: SendMessageReq,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Send text message, receive AI response via SSE stream. Source: T002, TS001."""
    # TODO: implement -- delegate to ConversationService.send_message()
    # Should return EventSourceResponse for SSE streaming
    return success(data={"message": "TODO: implement"})


@router.post("/{conversation_id}/messages/audio")
async def send_audio_message(
    conversation_id: UUID,
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Send audio message: STT + pronunciation + AI response. Source: T002, T005, TS002."""
    # TODO: implement -- delegate to ConversationService.send_audio()
    # Should return EventSourceResponse for SSE streaming
    return success(data={"message": "TODO: implement"})


@router.post("/{conversation_id}/complete")
async def complete_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """End conversation and trigger report generation. Source: T002, T003."""
    # TODO: implement -- delegate to ConversationService.complete()
    return success(data={"message": "TODO: implement"})


@router.get("/{conversation_id}/report")
async def get_report(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get conversation report. Source: T003."""
    # TODO: implement -- delegate to ConversationService.get_report()
    return success(data={"message": "TODO: implement"})
