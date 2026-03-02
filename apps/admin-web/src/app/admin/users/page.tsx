'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/users -- User management list (S031).
 * Provenance: REQ-007, design.md Section 2.1
 * TODO: Integrate UserSearchTable with debounced search, filter chips, pagination.
 */
export default function UsersPage() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Search and manage user accounts."
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: UserSearchTable with search (email/name/phone), filters (tier, ban status), pagination.
      </div>
    </div>
  );
}
