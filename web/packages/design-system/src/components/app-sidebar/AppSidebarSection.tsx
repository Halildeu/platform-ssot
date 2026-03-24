import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarSectionProps } from './types';

export const AppSidebarSection: React.FC<AppSidebarSectionProps> = ({
  title,
  collapsible = false,
  defaultOpen = true,
  children,
  className,
}) => {
  const { isCollapsed: sidebarCollapsed } = useSidebar();
  const [open, setOpen] = useState(defaultOpen);

  const showHeader = title && !sidebarCollapsed;
  const isOpen = !collapsible || open;

  return (
    <div className={cn('py-1', className)} role="group" aria-label={title}>
      {showHeader && (
        <div className="flex items-center px-3 py-1.5">
          {collapsible ? (
            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-1 text-[10px] font-semibold uppercase tracking-wider',
                'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                'transition-colors duration-200 outline-none',
                'focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] rounded',
              )}
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
            >
              <svg
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform duration-200',
                  !open && '-rotate-90',
                )}
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
              <span className="truncate">{title}</span>
            </button>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {title}
            </span>
          )}
        </div>
      )}

      {isOpen && <div className="space-y-0.5">{children}</div>}
    </div>
  );
};

AppSidebarSection.displayName = 'AppSidebar.Section';
