'use client';

import { PageHeader } from '@/components/ui/PageHeader';

/**
 * /admin/users/[id] -- User detail page (S031).
 * Provenance: REQ-007, REQ-008, design.md Section 2.1
 * TODO: Integrate UserDetailPanel, UserLearningStats, BanUserDialog, UnbanUserDialog.
 */
export default function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <PageHeader
        title="User Detail"
        description={`Viewing user ${params.id}`}
      />
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        TODO: User profile, learning summary, subscription history, ban/unban controls.
      </div>
    </div>
  );
}
