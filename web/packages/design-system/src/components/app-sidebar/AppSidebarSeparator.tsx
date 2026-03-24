import React from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarSeparatorProps } from './types';

export const AppSidebarSeparator: React.FC<AppSidebarSeparatorProps> = ({
  className,
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <hr
      className={cn(
        'border-t border-[var(--border-subtle)]',
        isCollapsed ? 'mx-2 my-1' : 'mx-3 my-2',
        className,
      )}
    />
  );
};

AppSidebarSeparator.displayName = 'AppSidebar.Separator';
