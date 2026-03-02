/**
 * NAV_SECTIONS -- Sidebar navigation structure with role mappings.
 * Provenance: design.md Section 9
 */

import type { NavSection } from '@/types/navigation';

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Content',
    items: [
      { label: 'Scenarios', href: '/admin/scenarios', icon: 'BookOpen', roles: ['R004'] },
      { label: 'Review Queue', href: '/admin/scenarios/review', icon: 'ClipboardCheck', roles: ['R004'] },
      { label: 'Scenario Packs', href: '/admin/scenario-packs', icon: 'Package', roles: ['R004'], badge: 'Soon' },
      { label: 'Tags', href: '/admin/scenario-tags', icon: 'Tag', roles: ['R004'], badge: 'Soon' },
    ],
  },
  {
    title: 'AI Quality',
    items: [
      { label: 'Quality Scores', href: '/admin/ai-quality', icon: 'Brain', roles: ['R005'] },
      { label: 'Anomalies', href: '/admin/anomalies', icon: 'AlertTriangle', roles: ['R005'], badge: 'Soon' },
      { label: 'Prompts', href: '/admin/prompts', icon: 'FileText', roles: ['R005'], badge: 'Soon' },
      { label: 'Pronunciation', href: '/admin/pronunciation', icon: 'Mic', roles: ['R005'], badge: 'Soon' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'BarChart3', roles: ['R006'] },
      { label: 'Behavior', href: '/admin/behavior', icon: 'TrendingUp', roles: ['R006'], badge: 'Soon' },
      { label: 'A/B Tests', href: '/admin/ab-tests', icon: 'Split', roles: ['R006'], badge: 'Soon' },
      { label: 'Reports', href: '/admin/reports', icon: 'FileBarChart', roles: ['R006'], badge: 'Soon' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Users', href: '/admin/users', icon: 'Users', roles: ['R007'] },
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: 'CreditCard', roles: ['R007'], badge: 'Soon' },
      { label: 'Settings', href: '/admin/settings', icon: 'Settings', roles: ['R007'], badge: 'Soon' },
      { label: 'Roles', href: '/admin/roles', icon: 'Shield', roles: ['R007'], badge: 'Soon' },
      { label: 'Complaints', href: '/admin/complaints', icon: 'MessageSquareWarning', roles: ['R007'], badge: 'Soon' },
      { label: 'Feedback', href: '/admin/feedback', icon: 'MessageCircle', roles: ['R007'], badge: 'Soon' },
    ],
  },
];
