'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/dashboard -- Key metrics dashboard (S023).
 * Provenance: REQ-005, REQ-006, design.md Section 2.1
 * TODO: Integrate MetricsDashboard with KpiCards, DauChart, RetentionChart, RevenueChart.
 */
export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Key product metrics at a glance."
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: KPI cards (DAU, MAU, retention, revenue) + trend charts + alert thresholds.
      </div>
    </div>
  );
}
