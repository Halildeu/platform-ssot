import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TreeDensity = "comfortable" | "compact";
export type TreeTone = "default" | "info" | "success" | "warning" | "danger";
export type TreeNode = {
    key: React.Key;
    label: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    badges?: Array<React.ReactNode | string>;
    tone?: TreeTone;
    disabled?: boolean;
    children?: TreeNode[];
};
export interface TreeLocaleText {
    emptyStateLabel?: React.ReactNode;
    emptyFallbackDescription?: React.ReactNode;
    expandNodeAriaLabel?: string;
    collapseNodeAriaLabel?: string;
}
/** Props for the Tree component. */
export interface TreeProps extends AccessControlledProps {
    /** Hierarchical node data to display. */
    nodes: TreeNode[];
    /** Heading text above the tree. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Node spacing density variant. */
    density?: TreeDensity;
    /** Label shown when the tree is empty. */
    emptyStateLabel?: React.ReactNode;
    /** Whether to show loading skeleton placeholders. */
    loading?: boolean;
    /** Key of the currently selected node. */
    selectedKey?: React.Key | null;
    /** Callback fired when a node is selected. */
    onNodeSelect?: (key: React.Key) => void;
    /** Initially expanded node keys for uncontrolled mode. */
    defaultExpandedKeys?: React.Key[];
    /** Controlled set of expanded node keys. */
    expandedKeys?: React.Key[];
    /** Callback fired when expanded keys change. */
    onExpandedKeysChange?: (keys: React.Key[]) => void;
    /** Whether the tree spans the full container width. */
    fullWidth?: boolean;
    /** Locale-specific label overrides. */
    localeText?: TreeLocaleText;
}
/**
 * Hierarchical tree view with expand/collapse, selection, badges, and tone-based node styling.
 *
 * @example
 * ```tsx
 * <Tree
 *   nodes={[
 *     { key: 'src', label: 'src', children: [
 *       { key: 'index', label: 'index.tsx' },
 *       { key: 'app', label: 'App.tsx' },
 *     ]},
 *   ]}
 *   onNodeSelect={(key) => openFile(key)}
 * />
 * ```
 */
export declare const Tree: React.ForwardRefExoticComponent<TreeProps & React.RefAttributes<HTMLElement>>;
export default Tree;
