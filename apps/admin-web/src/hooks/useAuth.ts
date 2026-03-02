/**
 * useAuth -- Convenience hook wrapping authStore.
 * Provenance: design.md Section 10 (hooks)
 */

import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const hasRole = useAuthStore((s) => s.hasRole);
  const getDefaultPage = useAuthStore((s) => s.getDefaultPage);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
    getDefaultPage,
  };
}
