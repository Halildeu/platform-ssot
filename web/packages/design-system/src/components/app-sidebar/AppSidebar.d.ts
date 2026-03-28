import React from 'react';
import { AppSidebarHeader } from './AppSidebarHeader';
import { AppSidebarNav } from './AppSidebarNav';
import { AppSidebarNavItem } from './AppSidebarNavItem';
import { AppSidebarSection } from './AppSidebarSection';
import { AppSidebarGroup } from './AppSidebarGroup';
import { AppSidebarFooter } from './AppSidebarFooter';
import { AppSidebarSearch } from './AppSidebarSearch';
import { AppSidebarTrigger } from './AppSidebarTrigger';
import { AppSidebarResizer } from './AppSidebarResizer';
import { AppSidebarSeparator } from './AppSidebarSeparator';
import type { AppSidebarProps as AppSidebarPropsBase, SidebarMode, SidebarContextValue, SidebarResizeState } from './types';
/** Props for the AppSidebar compound component. */
export interface AppSidebarProps extends AppSidebarPropsBase {
}
/** Sidebar display mode. */
export type AppSidebarMode = SidebarMode;
/** Sidebar context value shape. */
export type AppSidebarContextValue = SidebarContextValue;
/** Sidebar resize state shape. */
export type AppSidebarResizeState = SidebarResizeState;
/**
 * Composable, collapsible sidebar compound component with header, nav,
 * search, groups, sections, resizer, and footer slots. Persists state
 * to localStorage, auto-collapses on mobile, and supports keyboard
 * navigation, drag-to-resize, and nested nav items up to 3 levels.
 *
 * @example
 * ```tsx
 * <AppSidebar defaultMode="expanded" storageKey="my-sidebar">
 *   <AppSidebar.Header title="App" action={<AppSidebar.Trigger />} />
 *   <AppSidebar.Nav>
 *     <AppSidebar.NavItem icon={<HomeIcon />} label="Home" active />
 *   </AppSidebar.Nav>
 *   <AppSidebar.Footer><span>v1.0</span></AppSidebar.Footer>
 * </AppSidebar>
 * ```
 *
 * @since 1.0.0
 * @see useSidebar
 */
declare const AppSidebarRoot: React.ForwardRefExoticComponent<AppSidebarPropsBase & React.RefAttributes<HTMLElement>>;
type CompoundSidebar = typeof AppSidebarRoot & {
    Header: typeof AppSidebarHeader;
    Nav: typeof AppSidebarNav;
    NavItem: typeof AppSidebarNavItem;
    Section: typeof AppSidebarSection;
    Group: typeof AppSidebarGroup;
    Footer: typeof AppSidebarFooter;
    Search: typeof AppSidebarSearch;
    Trigger: typeof AppSidebarTrigger;
    Resizer: typeof AppSidebarResizer;
    Separator: typeof AppSidebarSeparator;
};
export declare const AppSidebar: CompoundSidebar;
export {};
