'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/scenarios -- Scenario list page (S009).
 * Provenance: REQ-001, design.md Section 2.1
 * TODO: Integrate ScenarioForm listing, DataTable with filters, "New Scenario" button.
 */
export default function ScenariosPage() {
  return (
    <div>
      <PageHeader
        title="Scenarios"
        description="Manage conversation scenarios for learners."
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: Scenario list with DataTable, filters (status, difficulty), and &quot;New Scenario&quot; button.
      </div>
    </div>
  );
}
