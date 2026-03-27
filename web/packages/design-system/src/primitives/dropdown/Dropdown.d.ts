import React from "react";
export interface DropdownItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    description?: string;
    disabled?: boolean;
    danger?: boolean;
    onClick?: () => void;
}
export type DropdownSeparator = {
    type: "separator";
};
export type DropdownLabel = {
    type: "label";
    label: string;
};
export type DropdownEntry = DropdownItem | DropdownSeparator | DropdownLabel;
export type DropdownPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";
/** Props for the Dropdown component.
 * @example
 * ```tsx
 * <Dropdown />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/dropdown)
 */
export interface DropdownProps {
    /** Trigger element that toggles the dropdown on click. */
    children: React.ReactElement;
    /** Menu entries including items, separators, and group labels. */
    items: DropdownEntry[];
    /** Position of the dropdown menu relative to the trigger. @default "bottom-start" */
    placement?: DropdownPlacement;
    /** Minimum width of the dropdown menu in pixels. @default 180 */
    minWidth?: number;
    /** Additional CSS class name for the dropdown menu panel. */
    className?: string;
    /** Whether the dropdown is disabled and cannot be opened. */
    disabled?: boolean;
}
/** Trigger-activated dropdown menu with items, separators, group labels, and keyboard navigation. */
export declare const Dropdown: React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<HTMLDivElement>>;
