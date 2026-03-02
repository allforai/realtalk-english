'use client';

/**
 * AlertDialog -- Set alert threshold dialog.
 * Provenance: design.md Section 3.3, REQ-006
 * TODO: Form with metric name, operator (<, >, <=, >=), threshold, notification channel.
 */

interface AlertDialogProps {
  open: boolean;
  metricName: string;
  onSave: (data: { operator: string; threshold: number; channel: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AlertDialog({
  open,
  metricName,
  onSave,
  onCancel,
  isSubmitting,
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Set Alert</h3>
        <p className="mt-1 text-sm text-gray-500">Metric: {metricName}</p>
        <div className="mt-4 text-sm text-gray-500">
          TODO: Operator select, threshold input, channel select (email).
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ operator: '>', threshold: 0, channel: 'email' })}
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Alert'}
          </button>
        </div>
      </div>
    </div>
  );
}
