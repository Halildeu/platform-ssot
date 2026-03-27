import React from 'react';
import type { AppSidebarSectionProps as AppSidebarSectionPropsBase } from './types';
/**
 * Lightweight grouping section for the AppSidebar navigation. Renders
 * an optional uppercase section title with collapsible content via
 * `aria-expanded`. Title is hidden when the sidebar is collapsed.
 *
 * @example
 * ```tsx
 * <AppSidebar.Section title="General" collapsible>
 *   <AppSidebar.NavItem label="Overview" />
 * </AppSidebar.Section>
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarSection: React.ForwardRefExoticComponent<AppSidebarSectionPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarSection component. */
export interface AppSidebarSectionProps extends AppSidebarSectionPropsBase {
}
/** Ref type for AppSidebarSection. */
export type AppSidebarSectionRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarSection. */
export type AppSidebarSectionElement = HTMLDivElement;
/** CSS properties type for AppSidebarSection. */
export type AppSidebarSectionCSSProperties = React.CSSProperties;
