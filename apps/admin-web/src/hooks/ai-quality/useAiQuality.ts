/**
 * useAiQuality -- TanStack Query hooks for AI quality data.
 * Provenance: design.md Section 4.2, REQ-004
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { DateRange, LowScoreQuery } from '@/types/api';

export function useAiQualityOverview(dateRange: DateRange) {
  return useQuery({
    queryKey: ['ai-quality-overview', dateRange],
    queryFn: () => apiClient.getAiQualityOverview(dateRange),
    staleTime: 2 * 60 * 1000, // 2 min
  });
}

export function useAiQualityLowScore(params: LowScoreQuery = {}) {
  return useQuery({
    queryKey: ['ai-quality-low-score', params],
    queryFn: () => apiClient.getAiQualityLowScore(params),
    staleTime: 2 * 60 * 1000, // 2 min
  });
}
