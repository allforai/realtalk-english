/**
 * Role check utilities.
 * Provenance: design.md Section 2.2, XR-003
 */

/** Role-to-default-page mapping */
export const ROLE_DEFAULT_PAGE: Record<string, string> = {
  R004: '/admin/scenarios',
  R005: '/admin/ai-quality',
  R006: '/admin/dashboard',
  R007: '/admin/users',
};

/** Route pattern to required roles mapping */
export const ROUTE_ROLE_MAP: Record<string, string[]> = {
  '/admin/scenarios': ['R004'],
  '/admin/dashboard': ['R006'],
  '/admin/ai-quality': ['R005'],
  '/admin/users': ['R007'],
  '/admin/scenario-packs': ['R004'],
  '/admin/scenario-tags': ['R004'],
  '/admin/behavior': ['R006'],
  '/admin/ab-tests': ['R006'],
  '/admin/reports': ['R006'],
  '/admin/anomalies': ['R005'],
  '/admin/prompts': ['R005'],
  '/admin/pronunciation': ['R005'],
  '/admin/subscriptions': ['R007'],
  '/admin/settings': ['R007'],
  '/admin/roles': ['R007'],
  '/admin/complaints': ['R007'],
  '/admin/feedback': ['R007'],
};

/**
 * Check if a user with the given roles can access a specific route.
 */
export function canAccessRoute(userRoles: string[], pathname: string): boolean {
  // Find the matching route pattern (longest prefix match)
  const matchingRoute = Object.keys(ROUTE_ROLE_MAP)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingRoute) return true; // No restriction found
  const requiredRoles = ROUTE_ROLE_MAP[matchingRoute];
  return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * Get the default page for a user based on their roles.
 */
export function getDefaultPageForRoles(roles: string[]): string {
  for (const role of roles) {
    if (ROLE_DEFAULT_PAGE[role]) return ROLE_DEFAULT_PAGE[role];
  }
  return '/admin/unauthorized';
}
