'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/scenarios/[id] -- Edit scenario (S009 edit mode).
 * Provenance: REQ-001, REQ-002, design.md Section 2.1
 * TODO: Load scenario by ID, populate ScenarioForm, handle status transitions.
 */
export default function EditScenarioPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <PageHeader
        title="Edit Scenario"
        description={`Editing scenario ${params.id}`}
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: Load scenario by ID, render ScenarioForm in edit mode, submit-for-review button for drafts.
      </div>
    </div>
  );
}
