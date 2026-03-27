import React from 'react';
import type { AppSidebarSeparatorProps as AppSidebarSeparatorPropsBase } from './types';
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
export declare const AppSidebarSeparator: React.ForwardRefExoticComponent<AppSidebarSeparatorPropsBase & React.RefAttributes<HTMLHRElement>>;
/** Props for the AppSidebarSeparator component. */
export interface AppSidebarSeparatorProps extends AppSidebarSeparatorPropsBase {
}
/** Ref type for AppSidebarSeparator. */
export type AppSidebarSeparatorRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarSeparator. */
export type AppSidebarSeparatorElement = HTMLDivElement;
/** CSS properties type for AppSidebarSeparator. */
export type AppSidebarSeparatorCSSProperties = React.CSSProperties;
