import React from 'react';
import type { AppSidebarSearchProps as AppSidebarSearchPropsBase } from './types';
/**
 * Search input slot for the AppSidebar compound component. Shows a full text
 * input with keyboard shortcut hint when expanded, and a search icon button
 * when collapsed.
 *
 * @example
 * ```tsx
 * <AppSidebar.Search
 *   placeholder="Search navigation..."
 *   shortcut="Cmd+K"
 *   value={query}
 *   onChange={setQuery}
 * />
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarSearch: React.ForwardRefExoticComponent<AppSidebarSearchPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarSearch component. */
export interface AppSidebarSearchProps extends AppSidebarSearchPropsBase {
}
/** Ref type for AppSidebarSearch. */
export type AppSidebarSearchRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarSearch. */
export type AppSidebarSearchElement = HTMLDivElement;
/** CSS properties type for AppSidebarSearch. */
export type AppSidebarSearchCSSProperties = React.CSSProperties;
