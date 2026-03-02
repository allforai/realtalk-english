/**
 * useMetrics -- TanStack Query hooks for metrics dashboard.
 * Provenance: design.md Section 4.2, REQ-005, REQ-006
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { DateRange, AlertRequest } from '@/types/api';

export function useMetricsDashboard(dateRange: DateRange) {
  return useQuery({
    queryKey: ['metrics-dashboard', dateRange],
    queryFn: () => apiClient.getMetricsDashboard(dateRange),
    staleTime: 5 * 60 * 1000, // 5 min
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 min (REQ-005)
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AlertRequest) => apiClient.createAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics-dashboard'] });
    },
  });
}
