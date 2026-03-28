import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface BreadcrumbItem {
    /** Display text or node for the breadcrumb step. */
    label: React.ReactNode;
    /** URL for the breadcrumb link. */
    href?: string;
    /** Click handler for the breadcrumb step. */
    onClick?: () => void;
    /** Icon displayed before the label. */
    icon?: React.ReactNode;
}
export interface BreadcrumbProps extends AccessControlledProps {
    /** Ordered list of breadcrumb navigation items. */
    items: BreadcrumbItem[];
    /** Separator character */
    separator?: React.ReactNode;
    /** Max items before collapsing */
    maxItems?: number;
    /** Additional CSS class name. */
    className?: string;
}
/**
 * Navigation hierarchy breadcrumb trail with collapsible overflow and custom separators.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Widget Pro' },
 *   ]}
 *   maxItems={4}
 * />
 * ```
 */
export declare const Breadcrumb: React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLElement>>;
