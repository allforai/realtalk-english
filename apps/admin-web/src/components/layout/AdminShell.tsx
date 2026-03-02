'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUiStore } from '@/stores/uiStore';

/**
 * AdminShell -- Sidebar + Topbar + main content wrapper.
 * Provenance: design.md Section 3.1
 *
 * Layout:
 *   Sidebar (240px / 64px) | Topbar (64px)
 *                           | Content (scrollable, p-6)
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className="flex flex-1 flex-col transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
      >
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
