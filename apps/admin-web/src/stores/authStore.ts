/**
 * authStore -- Zustand store with persist for authentication state.
 * Provenance: design.md Section 4.1, REQ-009, XR-001/002
 *
 * Persistence: localStorage (access_token, refresh_token, user).
 * On app load, validate token expiry; if expired, attempt refresh.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TokenResponse } from '@/types/api';

interface UserInfo {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  roles: string[]; // ['R004'], ['R005'], etc.
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;

  // Actions
  login: (tokens: TokenResponse, user: UserInfo) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  hasRole: (role: string) => boolean;
  getDefaultPage: () => string;
}

const ROLE_DEFAULT_PAGE: Record<string, string> = {
  R004: '/admin/scenarios',
  R005: '/admin/ai-quality',
  R006: '/admin/dashboard',
  R007: '/admin/users',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (tokens, user) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      hasRole: (role: string) => {
        const { user } = get();
        return user?.roles.includes(role) ?? false;
      },

      getDefaultPage: () => {
        const { user } = get();
        if (!user?.roles.length) return '/admin/login';
        for (const role of user.roles) {
          if (ROLE_DEFAULT_PAGE[role]) return ROLE_DEFAULT_PAGE[role];
        }
        return '/admin/unauthorized';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
