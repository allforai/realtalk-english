// Source: design.md -- Auth, Theme, Network providers
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// --- Auth Context ---
interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  setAuthenticated: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

// --- Network Context ---
interface NetworkContextValue {
  isConnected: boolean;
}

export const NetworkContext = createContext<NetworkContextValue>({
  isConnected: true,
});

export const useNetworkContext = () => useContext(NetworkContext);

// --- Theme Context ---
interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

// --- Combined Providers ---
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // TODO: Check stored token on mount to restore auth state
  useEffect(() => {
    setIsAuthLoading(false);
  }, []);

  // Network listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading: isAuthLoading, setAuthenticated }}
    >
      <NetworkContext.Provider value={{ isConnected }}>
        <ThemeContext.Provider
          value={{ isDark, toggleTheme: () => setIsDark((prev) => !prev) }}
        >
          {children}
        </ThemeContext.Provider>
      </NetworkContext.Provider>
    </AuthContext.Provider>
  );
}
