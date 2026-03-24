import React from 'react';
import { cn } from '../../utils/cn';
import type { AppSidebarFooterProps } from './types';
// Access control: inherits from parent AppSidebar which uses AccessControlledProps,
// resolveAccessState, accessStyles, data-access-state, and accessReason.

/**
 * Footer slot for the AppSidebar compound component. Automatically sticks
 * to the bottom of the sidebar via `mt-auto` and renders a top border.
 *
 * @example
 * ```tsx
 * <AppSidebar.Footer>
 *   <span>v2.0.0</span>
 * </AppSidebar.Footer>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
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

/** Props interface for AppSidebarFooter. */
export interface AppSidebarFooterComponentProps extends AppSidebarFooterProps {}
