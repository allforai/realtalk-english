/**
 * Navigation types for the admin sidebar.
 * Provenance: design.md Section 9
 */

export interface NavItem {
  label: string;
  href: string;
  icon: string;         // Lucide icon name
  roles: string[];      // Required roles
  badge?: string;       // e.g., "Soon"
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
