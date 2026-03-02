'use client';

/**
 * LowScoreTable -- DataTable for low-score conversations.
 * Provenance: design.md Section 3.3, REQ-004
 * TODO: Columns: conversation_id, user_display_name, scenario_title, score, date.
 */

import type { LowScoreItem } from '@/types/api';

interface LowScoreTableProps {
  data: LowScoreItem[];
  isLoading?: boolean;
  onSelect: (conversationId: string) => void;
}

export default function LowScoreTable({
  data,
  isLoading,
  onSelect,
}: LowScoreTableProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Low-score conversations table ({data.length} items).
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
      {onSelect && null}
    </div>
  );
}
