import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface ContextMenuItem {
    type?: "item";
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    shortcut?: string;
    disabled?: boolean;
    danger?: boolean;
    onClick?: () => void;
}
export interface ContextMenuSeparator {
    type: "separator";
    key: string;
}
export interface ContextMenuLabel {
    type: "label";
    key: string;
    label: React.ReactNode;
}
export type ContextMenuEntry = ContextMenuItem | ContextMenuSeparator | ContextMenuLabel;
export interface ContextMenuProps extends AccessControlledProps {
    /** Menu entries (items, separators, and labels). */
    items: ContextMenuEntry[];
    /** Trigger element that activates the context menu on right-click. */
    children: React.ReactElement;
    /** Whether the context menu is disabled. */
    disabled?: boolean;
    /** Additional CSS class name for the menu panel. */
    className?: string;
    /** Access level controlling visibility and interactivity. */
    access?: import('../../internal/access-controller').AccessLevel;
    /** Tooltip text explaining access restrictions. */
    accessReason?: string;
}
/**

 * ContextMenu component.

 * @example

 * ```tsx

 * <ContextMenu />

 * ```

 * @since 1.0.0

 * @see [Docs](https://design.mfe.dev/components/context-menu)

 */
export declare const ContextMenu: React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<HTMLDivElement>>;
