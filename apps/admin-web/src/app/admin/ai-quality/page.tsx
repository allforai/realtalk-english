'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/ai-quality -- AI quality scores (S027).
 * Provenance: REQ-004, design.md Section 2.1
 * TODO: Integrate QualityOverviewCards, QualityTrendChart, LowScoreTable.
 */
export default function AiQualityPage() {
  return (
    <div>
      <PageHeader
        title="AI Quality Scores"
        description="Monitor AI dialogue quality and identify low-score conversations."
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: Quality overview cards + 30-day trend chart + low-score conversation table.
      </div>
    </div>
  );
}
