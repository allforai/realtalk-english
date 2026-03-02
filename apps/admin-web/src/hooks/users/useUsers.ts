/**
 * useUsers -- TanStack Query hooks for user management.
 * Provenance: design.md Section 4.2, REQ-007, REQ-008
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { UserSearchQuery, BanUserReq } from '@/types/api';

export function useUsers(params: UserSearchQuery = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiClient.searchUsers(params),
    staleTime: 60 * 1000, // 1 min
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiClient.getUserDetail(id),
    staleTime: 60 * 1000, // 1 min
    enabled: !!id,
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BanUserReq }) =>
      apiClient.banUser(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.unbanUser(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
