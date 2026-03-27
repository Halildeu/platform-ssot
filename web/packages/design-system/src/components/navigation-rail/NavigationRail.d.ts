import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type NavigationRailAlignment = "start" | "center";
export type NavigationRailSize = "sm" | "md";
export type NavigationRailAppearance = "default" | "outline" | "ghost";
export type NavigationRailLabelVisibility = "always" | "active" | "none";
export type NavigationRailPresetKind = "workspace" | "compact_utility" | "ops_side_nav";
export interface NavigationRailItem {
    value: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    badge?: React.ReactNode;
    dataTestId?: string;
    ariaLabel?: string;
    href?: string;
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
    rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
    matchPath?: string | string[];
    disabled?: boolean;
    itemClassName?: string;
    activeClassName?: string;
}
export interface NavigationDestinationInput {
    value: string;
    label?: React.ReactNode;
    title?: React.ReactNode;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    badge?: React.ReactNode;
    dataTestId?: string;
    href?: string;
    current?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
    rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
    matchPath?: string | string[];
}
export interface CreateNavigationDestinationItemsOptions {
    currentValue?: string;
    currentPath?: string;
    currentBadge?: React.ReactNode;
}
export interface NavigationRailClasses {
    root?: string;
    list?: string;
    item?: string;
    activeItem?: string;
    icon?: string;
    label?: string;
    description?: string;
    badge?: string;
    footer?: string;
}
/** Props for the NavigationRail component.
 * @example
 * ```tsx
 * <NavigationRail />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/navigation-rail)
 */
export interface NavigationRailProps extends AccessControlledProps {
    /** Navigation items to render in the rail. */
    items: NavigationRailItem[];
    /** Controlled active item value. */
    value?: string;
    /** Initial active item value for uncontrolled mode. */
    defaultValue?: string;
    /** Callback fired when the active item changes. */
    onValueChange?: (value: string) => void;
    /** Callback fired when a navigation item is clicked. */
    onItemClick?: (value: string, event: React.MouseEvent<HTMLElement>) => void;
    /** Accessible label for the navigation rail. */
    ariaLabel?: string;
    /** Vertical alignment of items within the rail. */
    align?: NavigationRailAlignment;
    /** Whether to use the narrow compact layout. */
    compact?: boolean;
    /** Size variant for item spacing. */
    size?: NavigationRailSize;
    /** Visual appearance variant. */
    appearance?: NavigationRailAppearance;
    /** Controls when item labels are visible. */
    labelVisibility?: NavigationRailLabelVisibility;
    /** Current URL path used for automatic active detection. */
    currentPath?: string;
    /** Content rendered at the bottom of the rail. */
    footer?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
    /** Custom class name overrides for sub-elements. */
    classes?: NavigationRailClasses;
}
export interface ResolveNavigationRailActiveValueArgs {
    currentValue?: string;
    items: NavigationRailItem[];
    currentPath?: string;
}
export interface NavigationRailPreset {
    compact: boolean;
    size: NavigationRailSize;
    align: NavigationRailAlignment;
    appearance: NavigationRailAppearance;
    labelVisibility: NavigationRailLabelVisibility;
}
export declare function resolveNavigationRailActiveValue({ currentValue, items, currentPath, }: ResolveNavigationRailActiveValueArgs): string;
export declare function createNavigationDestinationItems(destinations: NavigationDestinationInput[], options?: CreateNavigationDestinationItemsOptions): NavigationRailItem[];
export declare function createNavigationRailPreset(kind: NavigationRailPresetKind): NavigationRailPreset;
/** Vertical navigation rail with icon-and-label destinations, badge support, and responsive sizing. */
export declare const NavigationRail: React.ForwardRefExoticComponent<NavigationRailProps & React.RefAttributes<HTMLElement>>;
