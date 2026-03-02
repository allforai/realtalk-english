/**
 * Review action validation schema.
 * Provenance: design.md Section 6.4, REQ-003, SCEN_005
 */

import { z } from 'zod';

export const reviewApproveSchema = z.object({
  action: z.literal('approve'),
});

export const reviewRejectSchema = z.object({
  action: z.literal('reject'),
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters'), // SCEN_005
});

export const reviewSchema = z.discriminatedUnion('action', [
  reviewApproveSchema,
  reviewRejectSchema,
]);

export type ReviewFormData = z.infer<typeof reviewSchema>;
