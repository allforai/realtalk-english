'use client';

/**
 * MetricsDashboard -- Grid of KpiCards + charts.
 * Provenance: design.md Section 3.3, REQ-005
 * TODO: Render 4 KpiCards (DAU, MAU, retention, revenue) + trend charts.
 */

import type { MetricsDashboard as MetricsDashboardType } from '@/types/api';

interface MetricsDashboardProps {
  data?: MetricsDashboardType;
  isLoading?: boolean;
}

export default function MetricsDashboard({
  data,
  isLoading,
}: MetricsDashboardProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Metrics dashboard — 4 KPI cards + DAU/retention/revenue charts.
      {data && <p className="mt-2 text-xs">DAU: {data.dau.current}</p>}
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
