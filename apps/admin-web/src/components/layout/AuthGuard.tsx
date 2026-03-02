'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * AuthGuard -- Client component that checks auth state and redirects.
 * Provenance: design.md Section 3.1, XR-001, XR-003
 *
 * - No token -> redirect to /admin/login
 * - Wrong role for current route -> redirect to /admin/unauthorized
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // Skip guard for login page
    if (pathname === '/admin/login') return;

    if (!isAuthenticated || !user) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, user, pathname, router]);

  // While checking auth, render nothing
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
