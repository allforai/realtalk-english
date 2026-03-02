'use client';

/**
 * UserSearchTable -- DataTable with search + filters (tier, ban status).
 * Provenance: design.md Section 3.3, REQ-007
 * TODO: Debounced search (300ms), filter chips (tier, banned), pagination (20/page).
 */

import type { UserListItem } from '@/types/api';

interface UserSearchTableProps {
  data: UserListItem[];
  isLoading?: boolean;
  onSelect: (userId: string) => void;
}

export default function UserSearchTable({
  data,
  isLoading,
  onSelect,
}: UserSearchTableProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: User search table ({data.length} users) with search + tier/ban filters.
      {isLoading && <p className="mt-2 text-xs">Loading...</p>}
      {onSelect && null}
    </div>
  );
}
