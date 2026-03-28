import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface SegmentedItem {
    value: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    description?: React.ReactNode;
    dataTestId?: string;
    disabled?: boolean;
    itemClassName?: string;
    activeClassName?: string;
    badgeClassName?: string;
}
export interface SegmentedClasses {
    root?: string;
    list?: string;
    item?: string;
    activeItem?: string;
    content?: string;
    icon?: string;
    label?: string;
    badge?: string;
    description?: string;
}
export interface SegmentedProps extends AccessControlledProps {
    /** Array of segment items to render. */
    items: SegmentedItem[];
    /** Controlled selected value(s). */
    value?: string | string[];
    /** Default selected value(s) for uncontrolled mode. */
    defaultValue?: string | string[];
    /** Callback fired when the selection changes. */
    onValueChange?: (nextValue: string | string[]) => void;
    /** Callback fired when a segment item is clicked. */
    onItemClick?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Whether single or multiple segments can be selected. @default "single" */
    selectionMode?: "single" | "multiple";
    /** Size variant for the segment buttons. @default "md" */
    size?: "sm" | "md" | "lg";
    /** Layout orientation of the segment group. @default "horizontal" */
    orientation?: "horizontal" | "vertical";
    /** @deprecated Use `variant` instead. Visual appearance style. */
    appearance?: "default" | "outline" | "ghost";
    /** Visual style variant for the segmented control. */
    variant?: "default" | "outline" | "ghost";
    /** Border radius shape of the container and items. @default "rounded" */
    shape?: "rounded" | "pill";
    /** Position of item icons relative to the label. @default "start" */
    iconPosition?: "start" | "end" | "top";
    /** Whether deselecting all items is allowed. @default false */
    allowEmptySelection?: boolean;
    /** Whether the control spans the full container width. */
    fullWidth?: boolean;
    /** Accessible label for the segment group. */
    ariaLabel?: string;
    /** Custom CSS class overrides for internal elements. */
    classes?: SegmentedClasses;
    /** Additional CSS class name for the root element. */
    className?: string;
}
export declare function resolveSegmentedNextValue(currentValue: string | string[], itemValue: string, selectionMode: "single" | "multiple", options?: {
    allowEmptySelection?: boolean;
}): string | string[];
export interface SegmentedPreset {
    size: "sm" | "md" | "lg";
    variant: "default" | "outline" | "ghost";
    /** @deprecated Use `variant` instead. Will be removed in v3.0.0. */
    appearance: "default" | "outline" | "ghost";
    shape: "rounded" | "pill";
    iconPosition?: "start" | "end" | "top";
}
export declare function createSegmentedPreset(kind: "toolbar" | "filter_bar" | "pill_tabs"): SegmentedPreset;
export declare const Segmented: React.ForwardRefExoticComponent<SegmentedProps & React.RefAttributes<HTMLDivElement>>;
