'use client';

import DestructiveConfirmDialog from '@/components/ui/DestructiveConfirmDialog';

/**
 * BanUserDialog -- DestructiveConfirmDialog configured for ban flow.
 * Provenance: design.md Section 3.3, REQ-008, CN008
 */

interface BanUserDialogProps {
  open: boolean;
  userName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function BanUserDialog({
  open,
  userName,
  onConfirm,
  onCancel,
  isSubmitting,
}: BanUserDialogProps) {
  return (
    <DestructiveConfirmDialog
      open={open}
      title="Ban User"
      warningText={`This will immediately block "${userName}" from accessing the app.`}
      confirmLabel="Ban User"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      requireReason
      minReasonLength={5}
    />
  );
}
