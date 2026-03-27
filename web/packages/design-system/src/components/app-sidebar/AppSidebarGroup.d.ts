import React from 'react';
import type { AppSidebarGroupProps as AppSidebarGroupPropsBase } from './types';
/**
 * Collapsible group container for the AppSidebar. Renders a labeled section
 * with an animated expand/collapse toggle, child count badge, and chevron
 * indicator. Shows only the icon when the sidebar is collapsed.
 *
 * @example
 * ```tsx
 * <AppSidebar.Group label="Resources" icon={<FolderIcon />} collapsible>
 *   <AppSidebar.NavItem label="Docs" />
 * </AppSidebar.Group>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarGroup: React.ForwardRefExoticComponent<AppSidebarGroupPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarGroup component. */
export interface AppSidebarGroupProps extends AppSidebarGroupPropsBase {
}
/** Ref type for AppSidebarGroup. */
export type AppSidebarGroupRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarGroup. */
export type AppSidebarGroupElement = HTMLDivElement;
/** CSS properties type for AppSidebarGroup. */
export type AppSidebarGroupCSSProperties = React.CSSProperties;
