'use client';

/**
 * ReviewActionPanel -- Approve/Reject buttons + rejection reason textarea.
 * Provenance: design.md Section 3.3, REQ-003
 * TODO: Approve button, reject with reason (min 10 chars), zod validation.
 */

interface ReviewActionPanelProps {
  scenarioId: string;
  onApprove: () => void;
  onReject: (reason: string) => void;
  isSubmitting?: boolean;
}

export default function ReviewActionPanel({
  scenarioId,
  onApprove,
  onReject,
  isSubmitting,
}: ReviewActionPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Review Actions</h3>
      <p className="mt-1 text-sm text-gray-500">Scenario: {scenarioId}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={onApprove}
          disabled={isSubmitting}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={() => onReject('TODO: reason from textarea')}
          disabled={isSubmitting}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
