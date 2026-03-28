import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Describes a single content block within the AI layout grid.
 * @example
 * ```tsx
 * <AILayoutBuilder />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/a-i-layout-builder)
 */
export type LayoutBlock = {
    /** Unique identifier for this block. */
    key: string;
    /** Semantic block type used for intent-based ordering. */
    type: "metric" | "chart" | "table" | "list" | "form" | "text" | "action" | "custom";
    /** Optional heading displayed above the block content. */
    title?: string;
    /** Sorting priority within the layout. @default "medium" */
    priority?: "high" | "medium" | "low";
    /** Number of grid columns this block should span. */
    span?: 1 | 2 | 3 | 4;
    /** The React content rendered inside the block card. */
    content: React.ReactNode;
    /** Whether the block can be collapsed by the user. */
    collapsible?: boolean;
    /** Whether the block starts in collapsed state. */
    defaultCollapsed?: boolean;
};
export type LayoutIntent = "overview" | "detail" | "comparison" | "workflow" | "monitoring";
export type LayoutDensity = "comfortable" | "compact" | "spacious";
/**
 * AILayoutBuilder dynamically arranges content blocks based on intent, priority,
 * and data shape with drag-and-drop, collapsible sections, and responsive columns.
 */
export interface AILayoutBuilderProps extends AccessControlledProps {
    /** Array of content blocks to render in the grid. */
    blocks: LayoutBlock[];
    /** Layout intent that controls block ordering and span heuristics. @default "overview" */
    intent?: LayoutIntent;
    /** Maximum number of grid columns. @default 3 */
    columns?: 1 | 2 | 3 | 4;
    /** Spacing density for the grid and block cards. @default "comfortable" */
    density?: LayoutDensity;
    /** Callback fired after a drag-and-drop reorder with the new key order. */
    onBlockReorder?: (keys: string[]) => void;
    /** Callback fired when a block's collapsed state changes. */
    onBlockToggle?: (key: string, collapsed: boolean) => void;
    /** Enable drag-and-drop reordering of blocks. @default false */
    draggable?: boolean;
    /** Optional section heading. */
    title?: string;
    /** Optional subtitle below the heading. */
    description?: string;
    /** Additional CSS class name. */
    className?: string;
}
export declare const AILayoutBuilder: React.ForwardRefExoticComponent<AILayoutBuilderProps & React.RefAttributes<HTMLDivElement>>;
export default AILayoutBuilder;
