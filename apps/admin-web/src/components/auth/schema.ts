/**
 * Login form validation schema.
 * Provenance: design.md Section 6.1, REQ-009
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
