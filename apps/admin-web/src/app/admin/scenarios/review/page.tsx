'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/scenarios/review -- Review queue (S010).
 * Provenance: REQ-003, design.md Section 2.1
 * TODO: Integrate ReviewQueueTable with pagination, sorted by submitted_at.
 */
export default function ReviewQueuePage() {
  return (
    <div>
      <PageHeader
        title="Review Queue"
        description="Review submitted scenarios before publishing."
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: ReviewQueueTable showing scenarios with status=review, pagination (20/page).
      </div>
    </div>
  );
}
