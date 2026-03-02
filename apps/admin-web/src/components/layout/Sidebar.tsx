'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { NAV_SECTIONS } from '@/lib/navigation';
import { cn } from '@/lib/cn';

/**
 * Sidebar -- Collapsible nav with role-filtered items.
 * Provenance: design.md Section 3.1, 9
 * Width: 240px expanded, 64px collapsed (icons only).
 */
export function Sidebar() {
  const pathname = usePathname();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const userRoles = user?.roles ?? [];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo / collapse toggle */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-gray-900">RealTalk</span>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? '>>' : '<<'}
        </button>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.some((r) => userRoles.includes(r))
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-4">
              {!sidebarCollapsed && (
                <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
              )}
              {visibleItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {/* Icon placeholder -- will be replaced with lucide-react icons */}
                    <span className="flex h-5 w-5 items-center justify-center text-xs">
                      {item.icon.slice(0, 2)}
                    </span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
