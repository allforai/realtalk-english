'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * /admin -- redirects to the role-appropriate default page.
 * Provenance: design.md Section 2.2 -- Role-to-default-page mapping
 */
export default function AdminIndexPage() {
  const router = useRouter();
  const getDefaultPage = useAuthStore((s) => s.getDefaultPage);

  useEffect(() => {
    router.replace(getDefaultPage());
  }, [router, getDefaultPage]);

  return null;
}
