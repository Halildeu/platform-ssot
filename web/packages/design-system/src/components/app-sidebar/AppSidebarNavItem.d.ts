import React from 'react';
import type { AppSidebarNavItemProps as AppSidebarNavItemPropsBase } from './types';
/**
 * Individual navigation item within the AppSidebar. Renders as an anchor when
 * `href` is provided, otherwise a button. Supports active state with
 * `aria-current="page"`, disabled state, badges, tooltips in collapsed mode,
 * and nested children up to 3 levels deep.
 *
 * @example
 * ```tsx
 * <AppSidebar.NavItem
 *   icon={<HomeIcon />}
 *   label="Dashboard"
 *   href="/dashboard"
 *   active
 * />
 * ```
 *
 * @since 1.0.0
 * @see AppSidebar
 */
export declare const AppSidebarNavItem: React.ForwardRefExoticComponent<AppSidebarNavItemPropsBase & React.RefAttributes<HTMLDivElement>>;
/** Props for the AppSidebarNavItem component. */
export interface AppSidebarNavItemProps extends AppSidebarNavItemPropsBase {
}
/** Ref type for AppSidebarNavItem. */
export type AppSidebarNavItemRef = React.Ref<HTMLDivElement>;
/** Element type for AppSidebarNavItem. */
export type AppSidebarNavItemElement = HTMLDivElement;
/** CSS properties type for AppSidebarNavItem. */
export type AppSidebarNavItemCSSProperties = React.CSSProperties;
