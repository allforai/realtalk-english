'use client';

/**
 * RevenueChart -- Revenue trend line chart.
 * Provenance: design.md Section 3.3, REQ-005
 * TODO: Integrate recharts LineChart with revenue trend data.
 */

interface RevenueChartProps {
  data: { date: string; value: number }[];
  isLoading?: boolean;
}

export default function RevenueChart({ data, isLoading }: RevenueChartProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Revenue trend line chart ({data.length} data points).
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
