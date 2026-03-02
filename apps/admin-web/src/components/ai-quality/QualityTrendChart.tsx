'use client';

/**
 * QualityTrendChart -- 30-day line chart (recharts).
 * Provenance: design.md Section 3.3, REQ-004
 * TODO: Integrate recharts LineChart with daily avg_score trend.
 */

interface TrendDataPoint {
  date: string;
  avg_score: number;
}

interface QualityTrendChartProps {
  data: TrendDataPoint[];
  isLoading?: boolean;
}

export default function QualityTrendChart({
  data,
  isLoading,
}: QualityTrendChartProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: 30-day quality trend line chart ({data.length} data points).
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
