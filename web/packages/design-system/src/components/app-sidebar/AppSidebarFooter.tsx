import React from 'react';
import { cn } from '../../utils/cn';
import type { AppSidebarFooterProps } from './types';

export const AppSidebarFooter: React.FC<AppSidebarFooterProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'mt-auto border-t border-[var(--border-subtle)] px-2 py-2',
      className,
    )}
  >
    {children}
  </div>
);

AppSidebarFooter.displayName = 'AppSidebar.Footer';
