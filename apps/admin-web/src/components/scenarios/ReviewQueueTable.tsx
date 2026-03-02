'use client';

/**
 * ReviewQueueTable -- DataTable configured for review queue.
 * Provenance: design.md Section 3.3, REQ-003
 * TODO: Integrate DataTable with columns: title, author, difficulty, submitted_at, node count.
 */

import type { ScenarioListItem } from '@/types/api';

interface ReviewQueueTableProps {
  data: ScenarioListItem[];
  isLoading?: boolean;
  onSelect: (id: string) => void;
}

export default function ReviewQueueTable({
  data,
  isLoading,
  onSelect,
}: ReviewQueueTableProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Review queue table ({data.length} items, loading={String(isLoading)}).
      {onSelect && null}
    </div>
  );
}
