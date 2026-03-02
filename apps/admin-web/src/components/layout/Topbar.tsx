'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * Topbar -- Logo, breadcrumb, user menu (role badge, logout).
 * Provenance: design.md Section 3.1
 * Height: 64px fixed.
 */
export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Breadcrumb placeholder */}
      <div className="text-sm text-gray-500">
        {/* TODO: implement breadcrumb from pathname */}
        Admin
      </div>

      {/* User menu */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-700">{user.displayName}</span>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {user.roles.join(', ')}
            </span>
          </>
        )}
        <button
          onClick={handleLogout}
          className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
