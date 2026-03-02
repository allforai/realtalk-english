'use client';

/**
 * ConversationDetail -- Message history viewer (chat bubbles, read-only).
 * Provenance: design.md Section 3.3, REQ-004
 * TODO: Fetch and render full conversation message history.
 */

interface ConversationDetailProps {
  conversationId: string;
}

export default function ConversationDetail({
  conversationId,
}: ConversationDetailProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Conversation detail viewer for {conversationId}.
    </div>
  );
}
