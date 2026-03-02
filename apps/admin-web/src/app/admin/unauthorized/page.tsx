'use client';

import Link from 'next/link';

/**
 * /admin/unauthorized -- 403 Unauthorized page.
 * Provenance: design.md Section 2.2, XR-003
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-300">403</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">Access Denied</h2>
      <p className="mt-2 text-gray-500">
        You do not have permission to access this page.
      </p>
      <Link
        href="/admin"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
