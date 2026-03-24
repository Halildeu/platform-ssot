import React from 'react';
import { cn } from '../../utils/cn';
import type { AppSidebarNavProps } from './types';

export const AppSidebarNav: React.FC<AppSidebarNavProps> = ({
  children,
  className,
}) => (
  <nav
    className={cn('flex-1 overflow-y-auto px-2 py-2', className)}
    role="navigation"
  >
    {children}
  </nav>
);

AppSidebarNav.displayName = 'AppSidebar.Nav';
