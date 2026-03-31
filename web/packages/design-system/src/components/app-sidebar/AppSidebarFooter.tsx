import React from 'react';
import { cn } from '../../utils/cn';
import type { AppSidebarFooterProps as AppSidebarFooterPropsBase } from './types';
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
export const AppSidebarFooter = React.forwardRef<HTMLDivElement, AppSidebarFooterPropsBase>(({
  children,
  className,
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-auto shrink-0 border-t border-[var(--border-subtle)] px-2 py-2 pb-3 text-text-primary',
      className,
    )}
  >
    {children}
  </div>
));

AppSidebarFooter.displayName = 'AppSidebar.Footer';

/** Props for the AppSidebarFooter component. */
export interface AppSidebarFooterProps extends AppSidebarFooterPropsBase {}

/** Ref type for AppSidebarFooter. */
export type AppSidebarFooterRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarFooter. */
export type AppSidebarFooterElement = HTMLDivElement;
/** CSS properties type for AppSidebarFooter. */
export type AppSidebarFooterCSSProperties = React.CSSProperties;
