import React from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarHeaderProps } from './types';

export const AppSidebarHeader: React.FC<AppSidebarHeaderProps> = ({
  title,
  subtitle,
  logo,
  action,
  className,
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-4 border-b',
        'border-[var(--border-subtle)]',
        isCollapsed && 'justify-center px-2',
        className,
      )}
    >
      {logo && <span className="shrink-0">{logo}</span>}

      {!isCollapsed && (title || subtitle) && (
        <div className="min-w-0 flex-1">
          {title && (
            <h2 className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {action && <span className="shrink-0">{action}</span>}
    </div>
  );
};

AppSidebarHeader.displayName = 'AppSidebar.Header';
