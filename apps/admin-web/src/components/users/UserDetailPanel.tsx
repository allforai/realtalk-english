'use client';

/**
 * UserDetailPanel -- Full user profile + learning summary.
 * Provenance: design.md Section 3.3, REQ-007
 * TODO: Profile info, subscription details, learning stats, ban/unban controls.
 */

import type { UserDetail } from '@/types/api';

interface UserDetailPanelProps {
  user?: UserDetail;
  isLoading?: boolean;
}

export default function UserDetailPanel({
  user,
  isLoading,
}: UserDetailPanelProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: User detail panel.
      {user && <p className="mt-2 text-xs">User: {user.display_name}</p>}
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
    </div>
  );
}
