/**
 * usePermission -- Role check hook.
 * Provenance: design.md Section 10, XR-003
 */

import { useAuthStore } from '@/stores/authStore';
import { canAccessRoute } from '@/lib/permissions';

export function usePermission() {
  const user = useAuthStore((s) => s.user);
  const userRoles = user?.roles ?? [];

  return {
    /** Check if user has a specific role */
    hasRole: (role: string) => userRoles.includes(role),

    /** Check if user has any of the given roles */
    hasAnyRole: (roles: string[]) => roles.some((r) => userRoles.includes(r)),

    /** Check if user can access a specific route */
    canAccess: (pathname: string) => canAccessRoute(userRoles, pathname),

    /** The user's current roles */
    roles: userRoles,
  };
}
