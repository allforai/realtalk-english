'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/scenarios/new -- Create new scenario (S009 create mode).
 * Provenance: REQ-001, design.md Section 2.1
 * TODO: Integrate ScenarioForm + DialogueNodeEditor.
 */
export default function NewScenarioPage() {
  return (
    <div>
      <PageHeader
        title="Create Scenario"
        description="Create a new conversation scenario with dialogue nodes."
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: ScenarioForm with DialogueNodeEditor (drag-and-drop reorder), preview, and save/submit actions.
      </div>
    </div>
  );
}
