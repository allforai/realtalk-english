/**
 * Tailwind className merger utility (clsx + twMerge).
 * Provenance: design.md Section 10
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
