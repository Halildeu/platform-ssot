import React from 'react';
import type { AppSidebarTriggerProps as AppSidebarTriggerPropsBase } from './types';
/**
 * Toggle button that collapses or expands the AppSidebar. Renders a
 * panel-left-open or panel-left-close icon depending on current state,
 * with dynamic `aria-label` for screen readers.
 *
 * @example
 * ```tsx
 * <AppSidebar.Header action={<AppSidebar.Trigger />} />
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarTrigger: React.ForwardRefExoticComponent<AppSidebarTriggerPropsBase & React.RefAttributes<HTMLButtonElement>>;
/** Props for the AppSidebarTrigger component. */
export interface AppSidebarTriggerProps extends AppSidebarTriggerPropsBase {
}
/** Ref type for AppSidebarTrigger. */
export type AppSidebarTriggerRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarTrigger. */
export type AppSidebarTriggerElement = HTMLDivElement;
/** CSS properties type for AppSidebarTrigger. */
export type AppSidebarTriggerCSSProperties = React.CSSProperties;
