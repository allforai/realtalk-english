'use client';

/**
 * QualityOverviewCards -- Avg score gauge + score distribution histogram.
 * Provenance: design.md Section 3.3, REQ-004
 * TODO: Integrate recharts gauge/histogram.
 */

import type { QualityOverview } from '@/types/api';

interface QualityOverviewCardsProps {
  data?: QualityOverview;
  isLoading?: boolean;
}

export default function QualityOverviewCards({
  data,
  isLoading,
}: QualityOverviewCardsProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Quality overview — avg score gauge + distribution histogram.
      {data && <p className="mt-2 text-xs">Avg: {data.avg_score}</p>}
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
