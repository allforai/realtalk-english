'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/scenarios/review/[id] -- Review detail for a specific scenario.
 * Provenance: REQ-003, design.md Section 2.1
 * TODO: Load scenario, show ScenarioPreview (read-only), ReviewActionPanel (approve/reject).
 */
export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <PageHeader
        title="Review Scenario"
        description={`Reviewing scenario ${params.id}`}
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: ScenarioPreview (read-only) + ReviewActionPanel (approve/reject with reason).
      </div>
    </div>
  );
}
