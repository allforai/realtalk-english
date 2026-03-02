'use client';

/**
 * ScenarioForm -- Create/edit scenario form (title, description, difficulty, target_roles, tags).
 * Provenance: design.md Section 3.3, REQ-001
 * TODO: Integrate zod validation, auto-save (30s), submit-for-review button.
 */

import type { ScenarioDetail } from '@/types/api';

interface ScenarioFormProps {
  initialData?: ScenarioDetail;
  onSave?: (data: unknown) => void;
  isSubmitting?: boolean;
}

export default function ScenarioForm({
  initialData,
  onSave,
  isSubmitting,
}: ScenarioFormProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: ScenarioForm — title, description, difficulty select, target roles multi-select,
      DialogueNodeEditor, tags, prompt template link.
      {initialData && <p className="mt-2 text-xs">Editing: {initialData.title}</p>}
      {onSave && isSubmitting !== undefined && null}
    </div>
  );
}
