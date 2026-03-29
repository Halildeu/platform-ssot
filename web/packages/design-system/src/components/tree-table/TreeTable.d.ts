import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TreeTableDensity = "comfortable" | "compact";
export type TreeTableAlign = "left" | "center" | "right";
export type TreeTableTone = "default" | "info" | "success" | "warning" | "danger";
export type TreeTableColumn<RowData extends Record<string, unknown> = Record<string, unknown>> = {
    key: string;
    label: React.ReactNode;
    accessor?: keyof RowData | ((node: TreeTableNode<RowData>, index: number) => React.ReactNode);
    render?: (node: TreeTableNode<RowData>, index: number) => React.ReactNode;
    align?: TreeTableAlign;
    width?: string;
    emphasis?: boolean;
};
export type TreeTableNode<RowData extends Record<string, unknown> = Record<string, unknown>> = {
    key: React.Key;
    label: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    badges?: Array<React.ReactNode | string>;
    tone?: TreeTableTone;
    disabled?: boolean;
    data?: RowData;
    children?: TreeTableNode<RowData>[];
};
export interface TreeTableLocaleText {
    treeColumnLabel?: React.ReactNode;
    emptyStateLabel?: React.ReactNode;
    emptyFallbackDescription?: React.ReactNode;
    expandNodeAriaLabel?: string;
    collapseNodeAriaLabel?: string;
}
/** Props for the TreeTable component.
 * @example
 * ```tsx
 * <TreeTable />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/tree-table)
 */
export interface TreeTableProps<RowData extends Record<string, unknown> = Record<string, unknown>> extends AccessControlledProps {
    /** Hierarchical node data to display. */
    nodes: TreeTableNode<RowData>[];
    /** Column definitions for the tabular section. */
    columns: TreeTableColumn<RowData>[];
    /** Header label for the tree column. */
    treeColumnLabel?: React.ReactNode;
    /** Heading text above the table. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Row spacing density variant. */
    density?: TreeTableDensity;
    /** Label shown when there are no nodes. */
    emptyStateLabel?: React.ReactNode;
    /** Whether to show loading skeleton rows. */
    loading?: boolean;
    /** Key of the currently selected node. */
    selectedKey?: React.Key | null;
    /** Callback fired when a node row is selected. */
    onNodeSelect?: (key: React.Key) => void;
    /** Initially expanded node keys for uncontrolled mode. */
    defaultExpandedKeys?: React.Key[];
    /** Controlled set of expanded node keys. */
    expandedKeys?: React.Key[];
    /** Callback fired when expanded keys change. */
    onExpandedKeysChange?: (keys: React.Key[]) => void;
    /** Whether the table spans the full container width. */
    fullWidth?: boolean;
    /** Locale-specific label overrides. */
    localeText?: TreeTableLocaleText;
}
/** Hierarchical tree with tabular data columns, expand/collapse, sorting, and row selection. */
export declare function TreeTable<RowData extends Record<string, unknown> = Record<string, unknown>>({ nodes, columns, treeColumnLabel, title, description, density, emptyStateLabel, loading, selectedKey, onNodeSelect, defaultExpandedKeys, expandedKeys, onExpandedKeysChange, fullWidth, localeText, access, accessReason, }: TreeTableProps<RowData>): import("react/jsx-runtime").JSX.Element | null;
export declare namespace TreeTable {
    // eslint-disable-next-line no-var
    var displayName: string;
}
/**
 * ForwardRef wrapper for TreeTable that forwards the ref to the root element.
 * Use the generic `TreeTable` export directly when ref forwarding is not needed.
 */
declare const TreeTableWithRef: React.ForwardRefExoticComponent<TreeTableProps<Record<string, unknown>> & React.RefAttributes<HTMLElement>>;
export default TreeTable;
export { TreeTableWithRef };
