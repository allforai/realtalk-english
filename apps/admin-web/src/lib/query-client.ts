/**
 * QueryClient configuration for TanStack Query.
 * Provenance: design.md Section 4.3
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 min default
      gcTime: 10 * 60 * 1000,         // 10 min garbage collection
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
