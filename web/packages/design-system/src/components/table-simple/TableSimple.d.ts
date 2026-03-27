import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TableSimpleDensity = "comfortable" | "compact";
export type TableSimpleAlign = "left" | "center" | "right";
/** Column definition for TableSimple. */
export type TableSimpleColumn<Row> = {
    /** Unique column identifier used as React key and default accessor. */
    key: string;
    /** Column header label. */
    label: React.ReactNode;
    /** Property name or function to extract cell value from a row. */
    accessor?: keyof Row | ((row: Row, index: number) => React.ReactNode);
    /** Custom render function for the cell content. */
    render?: (row: Row, index: number) => React.ReactNode;
    /** Horizontal text alignment. @default "left" */
    align?: TableSimpleAlign;
    /** Render the cell in bold primary text. */
    emphasis?: boolean;
    /** Truncate overflowing cell content with an ellipsis. */
    truncate?: boolean;
    /** Fixed CSS width for the column (e.g. "120px"). */
    width?: string;
    /** Additional class name for the header cell. */
    headerClassName?: string;
    /** Additional class name for body cells in this column. */
    cellClassName?: string;
};
/** Locale text overrides for TableSimple empty states. */
export interface TableSimpleLocaleText {
    /** Label displayed in the empty state. */
    emptyStateLabel?: React.ReactNode;
    /** Fallback description for the empty state component. */
    emptyFallbackDescription?: React.ReactNode;
}
/**
 * TableSimple renders a lightweight, static data table with access control,
 * striped rows, sticky header support, and a loading skeleton state.
 */
export interface TableSimpleProps<Row extends Record<string, unknown> = Record<string, unknown>> extends AccessControlledProps {
    /** Column definitions. */
    columns: TableSimpleColumn<Row>[];
    /** Data rows to display. */
    rows: Row[];
    /** Table caption shown as a heading above the table. */
    caption?: React.ReactNode;
    /** Subtitle shown below the caption. */
    description?: React.ReactNode;
    /** Row padding density. @default "comfortable" */
    density?: TableSimpleDensity;
    /** Apply alternating row background colors. @default true */
    striped?: boolean;
    /** Make the header row sticky on scroll. @default false */
    stickyHeader?: boolean;
    /** Show skeleton loading rows instead of data. @default false */
    loading?: boolean;
    /** Stretch the table to full container width. @default true */
    fullWidth?: boolean;
    /** Custom empty state label when no rows exist. */
    emptyStateLabel?: React.ReactNode;
    /** Function to derive a stable React key for each row. */
    getRowKey?: (row: Row, index: number) => React.Key;
    /** Locale text overrides. */
    localeText?: TableSimpleLocaleText;
}
/**
 * Lightweight static data table with striped rows, sticky header, and loading skeleton state.
 *
 * @example
 * ```tsx
 * <TableSimple
 *   columns={[
 *     { key: 'name', label: 'Name' },
 *     { key: 'role', label: 'Role' },
 *   ]}
 *   rows={[{ name: 'Jane', role: 'Admin' }, { name: 'Ali', role: 'Editor' }]}
 *   striped
 * />
 * ```
 */
export declare const TableSimple: (<Row extends Record<string, unknown> = Record<string, unknown>>(props: TableSimpleProps<Row> & {
    ref?: React.Ref<HTMLElement>;
}) => React.ReactElement | null) & {
    displayName?: string;
};
export default TableSimple;
