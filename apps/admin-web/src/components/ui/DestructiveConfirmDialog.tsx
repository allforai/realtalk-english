'use client';

import { useState } from 'react';

/**
 * DestructiveConfirmDialog -- ConfirmDialog variant with checkbox + reason textarea.
 * Provenance: design.md Section 3.2, REQ-008, CN008
 * Used for ban user flow: mandatory reason + "I confirm this action" checkbox.
 */

interface DestructiveConfirmDialogProps {
  open: boolean;
  title: string;
  warningText: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  requireReason?: boolean;
  minReasonLength?: number;
}

export default function DestructiveConfirmDialog({
  open,
  title,
  warningText,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading,
  requireReason = true,
  minReasonLength = 5,
}: DestructiveConfirmDialogProps) {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const canSubmit =
    confirmed && (!requireReason || reason.length >= minReasonLength);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-red-600">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{warningText}</p>

        {requireReason && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder={`Minimum ${minReasonLength} characters`}
            />
            {reason.length > 0 && reason.length < minReasonLength && (
              <p className="mt-1 text-xs text-red-600">
                Reason must be at least {minReasonLength} characters.
              </p>
            )}
          </div>
        )}

        <label className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">I confirm this action</span>
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!canSubmit || isLoading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
