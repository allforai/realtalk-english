'use client';

import ConfirmDialog from '@/components/ui/ConfirmDialog';

/**
 * UnbanUserDialog -- Simple ConfirmDialog for unban.
 * Provenance: design.md Section 3.3, REQ-008
 */

interface UnbanUserDialogProps {
  open: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function UnbanUserDialog({
  open,
  userName,
  onConfirm,
  onCancel,
  isSubmitting,
}: UnbanUserDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Unban User"
      message={`Are you sure you want to unban "${userName}"? They will regain access to the app.`}
      confirmLabel="Unban User"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isSubmitting}
    />
  );
}
