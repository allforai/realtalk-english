/**
 * Date formatting utilities (dayjs).
 * Provenance: design.md Section 10 (lib/date.ts)
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format a date string as a localized display string.
 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * Format a date string as a relative time string (e.g., "2 hours ago").
 */
export function formatRelative(date: string | Date): string {
  return dayjs(date).fromNow();
}

/**
 * Format a date string with time.
 */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}
