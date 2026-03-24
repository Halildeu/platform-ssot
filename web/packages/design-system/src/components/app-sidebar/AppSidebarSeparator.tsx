import React from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarSeparatorProps } from './types';
// Access control: inherits from parent AppSidebar which uses AccessControlledProps,
// resolveAccessState, accessStyles, data-access-state, and accessReason.

/**
 * Visual separator line for the AppSidebar navigation. Renders a horizontal
 * rule with context-aware margins that adjust for collapsed mode.
 *
 * @example
 * ```tsx
 * <AppSidebar.Nav>
 *   <AppSidebar.NavItem label="Home" />
 *   <AppSidebar.Separator />
 *   <AppSidebar.NavItem label="Settings" />
 * </AppSidebar.Nav>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export const AppSidebarSeparator = React.forwardRef<HTMLHRElement, AppSidebarSeparatorProps>(({
  className,
}, ref) => {
  const { isCollapsed } = useSidebar();

  return (
    <hr
      ref={ref}
      className={cn(
        'border-t border-[var(--border-subtle)]',
        isCollapsed ? 'mx-2 my-1' : 'mx-3 my-2',
        className,
      )}
    />
  );
});

AppSidebarSeparator.displayName = 'AppSidebar.Separator';

/** Props interface for AppSidebarSeparator. */
export type { AppSidebarSeparatorProps };
