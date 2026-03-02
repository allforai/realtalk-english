/**
 * Ban user validation schema.
 * Provenance: design.md Section 6.3, REQ-008, CN008
 * confirm: z.literal(true) ensures the checkbox is checked before submission.
 */

import { z } from 'zod';

export const banUserSchema = z.object({
  reason: z.string().min(5, 'Ban reason must be at least 5 characters'),   // CN008
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm this action' }),
  }),
});

export type BanUserFormData = z.infer<typeof banUserSchema>;
