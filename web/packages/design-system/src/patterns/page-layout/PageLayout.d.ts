import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface PageBreadcrumbItem {
    title: React.ReactNode;
    path?: string;
    onClick?: () => void;
    current?: boolean;
}
export type PageLayoutRouteInput = string | {
    title?: React.ReactNode;
    label?: React.ReactNode;
    path?: string;
    href?: string;
    onClick?: () => void;
    current?: boolean;
};
export interface PageLayoutClasses {
    root?: string;
    header?: string;
    headerInner?: string;
    breadcrumb?: string;
    titleRow?: string;
    titleBlock?: string;
    description?: string;
    headerExtra?: string;
    actions?: string;
    content?: string;
    contentInner?: string;
    filters?: string;
    contentHeader?: string;
    contentToolbar?: string;
    body?: string;
    main?: string;
    detail?: string;
    footer?: string;
    footerInner?: string;
    secondaryNav?: string;
}
/** Props for the PageLayout component.
 * @example
 * ```tsx
 * <PageLayout />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/page-layout)
 */
export interface PageLayoutProps extends AccessControlledProps {
    /** Page heading text. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Breadcrumb navigation items. */
    breadcrumbItems?: PageBreadcrumbItem[];
    /** How the current breadcrumb item is rendered. */
    currentBreadcrumbMode?: "text" | "link";
    /** Accessible label for the breadcrumb navigation. */
    breadcrumbAriaLabel?: string;
    /** Extra content displayed beside the title. */
    headerExtra?: React.ReactNode;
    /** Action buttons rendered in the header. */
    actions?: React.ReactNode;
    /** Secondary navigation rendered below the header. */
    secondaryNav?: React.ReactNode;
    /** Filter bar rendered above the main content. */
    filterBar?: React.ReactNode;
    /** Header content rendered inside the content area. */
    contentHeader?: React.ReactNode;
    /** Toolbar rendered between the content header and body. */
    contentToolbar?: React.ReactNode;
    /** Main page content. */
    children?: React.ReactNode;
    /** Side detail panel content. */
    detail?: React.ReactNode;
    /** Footer content at the bottom of the page. */
    footer?: React.ReactNode;
    /** Whether the header sticks to the top on scroll. */
    stickyHeader?: boolean;
    /** Maximum width constraint for the page content. */
    pageWidth?: "default" | "wide" | "full";
    /** Whether the detail panel collapses on smaller screens. */
    responsiveDetailCollapse?: boolean;
    /** Breakpoint at which the detail panel collapses. */
    responsiveDetailBreakpoint?: "base" | "sm" | "md" | "lg" | "xl";
    /** Accessible label for the page landmark. */
    ariaLabel?: string;
    /** Custom class name overrides for sub-elements. */
    classes?: PageLayoutClasses;
    /** Additional CSS class name. */
    className?: string;
    /** CSS class for the content area. */
    contentClassName?: string;
    /** CSS class for the detail panel. */
    detailClassName?: string;
    /** Inline styles for the root element. */
    style?: React.CSSProperties;
}
/** Full-page scaffold with breadcrumb, header, filter bar, content area, sidebar, and footer slots. */
export declare const PageLayout: React.ForwardRefExoticComponent<PageLayoutProps & React.RefAttributes<HTMLDivElement>>;
export interface PageLayoutPresetOptions {
    preset: "content-only" | "detail-sidebar" | "ops-workspace";
    pageWidth?: "default" | "wide" | "full";
    stickyHeader?: boolean;
    currentBreadcrumbMode?: "text" | "link";
    responsiveDetailBreakpoint?: "base" | "sm" | "md" | "lg" | "xl";
}
/**
 * Create a set of PageLayoutProps for common page archetypes.
 *
 * - `content-only`     — non-sticky, default width, no collapse
 * - `detail-sidebar`   — full width, collapse at md
 * - `ops-workspace`    — full width, sticky, collapse at lg
 */
export declare function createPageLayoutPreset(options: PageLayoutPresetOptions): Partial<PageLayoutProps>;
/**
 * Convert flexible route inputs to normalized `PageBreadcrumbItem[]`.
 *
 * - Strings become `{ title: str }`
 * - Objects map `label` or `title` to `title`, and `href` or `path` to `path`
 * - If no item has explicit `current: true`, the last item is auto-marked current
 */
export declare function createPageLayoutBreadcrumbItems(inputs: PageLayoutRouteInput[]): PageBreadcrumbItem[];
