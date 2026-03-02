// Source: design.md screen: S037 -- login/logout/token management
import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthContext } from '../../../app/providers';
import { authService } from '../services/authService';
import { setAccessToken } from '../../../services/apiClient';
import { registerForPushNotifications } from '../../../services/pushService';

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticated } = useAuthContext();

  const login = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      // Store tokens
      setAccessToken(response.access_token);
      await SecureStore.setItemAsync('refreshToken', response.refresh_token);
      // Register push notifications
      await registerForPushNotifications().catch(() => {
        // Non-blocking: push registration failure should not prevent login
      });
      setAuthenticated(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [setAuthenticated]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Best effort -- proceed with local cleanup
    }
    setAccessToken(null);
    await SecureStore.deleteItemAsync('refreshToken');
    setAuthenticated(false);
  }, [setAuthenticated]);

  return { login, logout, isSubmitting, error };
}
