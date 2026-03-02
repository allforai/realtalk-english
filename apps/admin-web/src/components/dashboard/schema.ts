/**
 * Alert threshold validation schema.
 * Provenance: design.md Section 6.5, REQ-006
 */

import { z } from 'zod';

export const alertSchema = z.object({
  metric: z.string().min(1),
  operator: z.enum(['<', '>', '<=', '>=']),
  threshold: z.number().positive('Threshold must be a positive number'),
  channel: z.enum(['email']),
});

export type AlertFormData = z.infer<typeof alertSchema>;
