import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Props for the PageHeader component.
 * @example
 * ```tsx
 * <PageHeader />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/page-header)
 */
export interface PageHeaderProps extends AccessControlledProps {
    /** Page title */
    title: React.ReactNode;
    /** Optional subtitle / description */
    subtitle?: React.ReactNode;
    /** Breadcrumb or back navigation slot */
    breadcrumb?: React.ReactNode;
    /** Avatar or icon before the title */
    avatar?: React.ReactNode;
    /** Primary actions (right-aligned) */
    actions?: React.ReactNode;
    /** Extra content below the title row (e.g. Tabs, metadata) */
    footer?: React.ReactNode;
    /** Additional content between title area and footer */
    extra?: React.ReactNode;
    /** Tags next to the title */
    tags?: React.ReactNode;
    /** Sticky header */
    sticky?: boolean;
    /** Remove bottom border */
    noBorder?: boolean;
    className?: string;
}
/** Standard page-level header with title, breadcrumb, avatar, actions, tags, and footer slot. */
export declare const PageHeader: React.ForwardRefExoticComponent<PageHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface PageHeaderTagItem {
    key?: React.Key;
    label: React.ReactNode;
    tone?: string;
}
export type PageHeaderTagInput = string | PageHeaderTagItem;
export interface PageHeaderStatItem {
    key?: React.Key;
    label: React.ReactNode;
    value: React.ReactNode;
    helper?: React.ReactNode;
}
export type PageHeaderStatInput = PageHeaderStatItem | [React.ReactNode, React.ReactNode, React.ReactNode?];
export interface PageHeaderClasses {
    root?: string;
    body?: string;
    content?: string;
    breadcrumb?: string;
    titleRow?: string;
    titleBlock?: string;
    description?: string;
    metaRow?: string;
    statsGrid?: string;
    statItem?: string;
    actions?: string;
    aside?: string;
    footer?: string;
    secondaryNav?: string;
}
export declare function createPageHeaderTagItems(inputs: PageHeaderTagInput[]): PageHeaderTagItem[];
export declare function createPageHeaderStatItems(inputs: PageHeaderStatInput[]): PageHeaderStatItem[];
