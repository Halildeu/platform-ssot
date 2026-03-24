import React from 'react';
import { cn } from '../../utils/cn';
import type { AppSidebarNavProps } from './types';
// Access control: inherits from parent AppSidebar which uses AccessControlledProps,
// resolveAccessState, accessStyles, data-access-state, and accessReason.

/**
 * Navigation container slot for the AppSidebar compound component.
 * Renders a `<nav role="navigation">` element with vertical overflow scrolling.
 * Contains NavItem, Section, and Group children.
 *
 * @example
 * ```tsx
 * <AppSidebar.Nav>
 *   <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
 * </AppSidebar.Nav>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
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

/** Props interface for AppSidebarNav. */
export interface AppSidebarNavComponentProps extends AppSidebarNavProps {}
