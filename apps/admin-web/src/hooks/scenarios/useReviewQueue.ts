/**
 * useReviewQueue -- TanStack Query hook for review queue.
 * Provenance: design.md Section 4.2, REQ-003
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useReviewQueue(page = 1, size = 20) {
  return useQuery({
    queryKey: ['review-queue', page, size],
    queryFn: () => apiClient.getReviewQueue(page, size),
    staleTime: 30 * 1000, // 30 sec
  });
}
