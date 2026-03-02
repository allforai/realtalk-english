/**
 * StatusBadge -- Colored badge mapping: draft=gray, review=yellow, published=green, rejected=red.
 * Provenance: design.md Section 3.2
 */

import type { ScenarioStatus } from '@/types/api';

interface StatusBadgeProps {
  status: ScenarioStatus | 'active' | 'banned';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
  review: { label: 'In Review', className: 'bg-yellow-100 text-yellow-700' },
  published: { label: 'Published', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-500' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  banned: { label: 'Banned', className: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
