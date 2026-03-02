'use client';

/**
 * DauChart -- DAU/MAU line chart (recharts).
 * Provenance: design.md Section 3.3, REQ-005
 * TODO: Integrate recharts LineChart with DAU trend data.
 */

interface DauChartProps {
  data: { date: string; value: number }[];
  isLoading?: boolean;
}

export default function DauChart({ data, isLoading }: DauChartProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: DAU trend line chart ({data.length} data points).
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
