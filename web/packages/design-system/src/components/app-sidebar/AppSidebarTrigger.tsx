import React from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarTriggerProps } from './types';

export const AppSidebarTrigger: React.FC<AppSidebarTriggerProps> = ({
  className,
}) => {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md',
        'text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)] hover:text-[var(--text-primary)]',
        'transition-colors duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]',
        className,
      )}
    >
      {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
    </button>
  );
};

AppSidebarTrigger.displayName = 'AppSidebar.Trigger';

/* ------------------------------------------------------------------ */
/*  Inline icons (avoid external icon dependency)                      */
/* ------------------------------------------------------------------ */

function PanelLeftCloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  );
}

function PanelLeftOpenIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <path d="m14 9 3 3-3 3" />
    </svg>
  );
}
