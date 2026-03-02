// Date/number/score formatting stubs

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  // TODO: Implement with proper locale support
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

/**
 * Format a date string as relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateStr: string): string {
  // TODO: Implement relative time formatting
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a score (0-100) as a percentage string.
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Format duration in seconds to "Xm Xs" format.
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
