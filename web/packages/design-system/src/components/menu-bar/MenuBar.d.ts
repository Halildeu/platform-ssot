import React from 'react';
import { type AccessControlledProps } from "../../internal/access-controller";
import { type MenuSurfaceItemBase } from "../../internal/MenuSurface";
export type MenuBarSize = 'sm' | 'md';
export type MenuBarAppearance = 'default' | 'outline' | 'ghost';
export type MenuBarLabelVisibility = 'always' | 'active' | 'none' | 'responsive';
export type MenuBarOverflowBehavior = 'none' | 'scroll' | 'collapse-to-more';
export type MenuBarSubmenuTrigger = 'click' | 'hover';
export type MenuBarUtilityCollapse = 'preserve' | 'hide';
export type MenuBarMobileFallback = 'none' | 'menu';
export type MenuBarPresetKind = 'workspace_header' | 'ops_command_bar' | 'ghost_utility';
export type MenuBarItemGroup = 'primary' | 'secondary' | 'utility';
export type MenuBarItemEmphasis = 'default' | 'promoted' | 'subtle';
export type MenuBarMenuItem = MenuSurfaceItemBase<MenuBarMenuItem>;
export interface MenuBarItem {
    value: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    overflowPriority?: number;
    pinned?: boolean;
    group?: MenuBarItemGroup;
    emphasis?: MenuBarItemEmphasis;
    keywords?: string[];
    favoritable?: boolean;
    menuSurfaceTitle?: React.ReactNode;
    menuSurfaceDescription?: React.ReactNode;
    menuSurfaceMeta?: React.ReactNode;
    menuSurfaceFooter?: React.ReactNode;
    menuSurfaceClassName?: string;
    dataTestId?: string;
    ariaLabel?: string;
    href?: string;
    matchPath?: string | string[];
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
    rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
    disabled?: boolean;
    menuItems?: MenuBarMenuItem[];
    itemClassName?: string;
    activeClassName?: string;
}
export interface MenuBarRouteInput {
    value: string;
    label?: React.ReactNode;
    title?: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    overflowPriority?: number;
    pinned?: boolean;
    group?: MenuBarItemGroup;
    emphasis?: MenuBarItemEmphasis;
    keywords?: string[];
    favoritable?: boolean;
    menuSurfaceTitle?: React.ReactNode;
    menuSurfaceDescription?: React.ReactNode;
    menuSurfaceMeta?: React.ReactNode;
    menuSurfaceFooter?: React.ReactNode;
    menuSurfaceClassName?: string;
    dataTestId?: string;
    ariaLabel?: string;
    href?: string;
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
    rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
    matchPath?: string | string[];
    current?: boolean;
    disabled?: boolean;
    menuItems?: MenuBarMenuItem[];
}
export interface CreateMenuBarItemsOptions {
    currentValue?: string;
    currentPath?: string;
    currentBadge?: React.ReactNode;
}
export interface MenuBarClasses {
    root?: string;
    list?: string;
    item?: string;
    activeItem?: string;
    trigger?: string;
    icon?: string;
    label?: string;
    badge?: string;
}
export interface ResolveMenuBarActiveValueArgs {
    currentValue?: string;
    items: MenuBarItem[];
    currentPath?: string;
}
export interface MenuBarPreset {
    size: MenuBarSize;
    appearance: MenuBarAppearance;
    labelVisibility: MenuBarLabelVisibility;
}
/** Props for the MenuBar component.
 * @example
 * ```tsx
 * <MenuBar />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/menu-bar)
 */
export interface MenuBarProps extends AccessControlledProps {
    /** Navigation items to render in the bar. */
    items: MenuBarItem[];
    /** Controlled active item value. */
    value?: string;
    /** Initial active item value for uncontrolled mode. */
    defaultValue?: string;
    /** Callback fired when the active item changes. */
    onValueChange?: (value: string) => void;
    /** Callback fired when a bar item is clicked. */
    onItemClick?: (value: string, event: React.MouseEvent<HTMLElement>) => void;
    /** Callback fired when a submenu item is selected. */
    onMenuItemSelect?: (rootValue: string, item: MenuBarMenuItem) => void;
    /** Controlled open submenu value. */
    openValue?: string | null;
    /** Initial open submenu value for uncontrolled mode. */
    defaultOpenValue?: string | null;
    /** Callback fired when the open submenu changes. */
    onOpenValueChange?: (value: string | null) => void;
    /** Accessible label for the navigation bar. */
    ariaLabel?: string;
    /** Accessible label for submenu surfaces. */
    menuAriaLabel?: string;
    /** Size variant of the menu bar. */
    size?: MenuBarSize;
    /** Visual appearance variant. */
    appearance?: MenuBarAppearance;
    labelVisibility?: MenuBarLabelVisibility;
    overflowBehavior?: MenuBarOverflowBehavior;
    overflowLabel?: React.ReactNode;
    maxVisibleItems?: number;
    defaultFavoriteValues?: string[];
    favoriteValues?: string[];
    onFavoriteValuesChange?: (values: string[]) => void;
    showFavoriteToggle?: boolean;
    defaultRecentValues?: string[];
    recentValues?: string[];
    onRecentValuesChange?: (values: string[]) => void;
    recentLimit?: number;
    enableSearchHandoff?: boolean;
    searchPlaceholder?: string;
    searchEmptyStateLabel?: React.ReactNode;
    submenuTrigger?: MenuBarSubmenuTrigger;
    startSlot?: React.ReactNode;
    endSlot?: React.ReactNode;
    currentPath?: string;
    labelCollapseBreakpoint?: string;
    responsiveBreakpoint?: string;
    mobileFallback?: MenuBarMobileFallback;
    utilityCollapse?: MenuBarUtilityCollapse;
    utility?: React.ReactNode;
    className?: string;
    classes?: MenuBarClasses;
}
export declare function resolveMenuBarActiveValue({ currentValue, items, currentPath, }: ResolveMenuBarActiveValueArgs): string;
export declare function createMenuBarItemsFromRoutes(routes: MenuBarRouteInput[], options?: CreateMenuBarItemsOptions): MenuBarItem[];
export declare function createMenuBarPreset(kind: MenuBarPresetKind): MenuBarPreset;
/** Horizontal menu bar with dropdown sub-menus, overflow handling, and route-aware active states. */
export declare const MenuBar: React.ForwardRefExoticComponent<MenuBarProps & React.RefAttributes<HTMLElement>>;
export default MenuBar;
