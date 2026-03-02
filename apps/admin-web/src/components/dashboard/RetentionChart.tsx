'use client';

/**
 * RetentionChart -- Cohort retention heatmap or line chart.
 * Provenance: design.md Section 3.3, REQ-005
 * TODO: Integrate recharts for retention cohort visualization.
 */

interface RetentionChartProps {
  data: { cohort: string; day: number; rate: number }[];
  isLoading?: boolean;
}

export default function RetentionChart({ data, isLoading }: RetentionChartProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Retention cohort chart ({data.length} data points).
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
