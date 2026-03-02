/**
 * useScenarios -- TanStack Query hooks for scenario CRUD.
 * Provenance: design.md Section 4.2
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ScenarioCreateReq, ScenarioListQuery } from '@/types/api';

export function useScenarios(params: ScenarioListQuery = {}) {
  return useQuery({
    queryKey: ['scenarios', params],
    queryFn: () => apiClient.getScenarios(params),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useScenario(id: string) {
  return useQuery({
    queryKey: ['scenario', id],
    queryFn: () => apiClient.getScenario(id),
    staleTime: 60 * 1000, // 1 min
    enabled: !!id,
  });
}

export function useCreateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScenarioCreateReq) => apiClient.createScenario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });
}

export function useUpdateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScenarioCreateReq }) =>
      apiClient.updateScenario(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scenario', variables.id] });
    },
  });
}

export function useSubmitForReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.submitForReview(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['scenario', id] });
      queryClient.invalidateQueries({ queryKey: ['review-queue'] });
    },
  });
}

export function useReviewScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { action: 'approve' | 'reject'; reason?: string };
    }) => apiClient.reviewScenario(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scenario', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['review-queue'] });
    },
  });
}
