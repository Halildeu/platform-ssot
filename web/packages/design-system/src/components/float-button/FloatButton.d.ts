import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type FloatButtonShape = "circle" | "square";
export type FloatButtonSize = "sm" | "md" | "lg";
export type FloatButtonPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type FloatButtonTrigger = "click" | "hover";
export interface FloatButtonGroupItem {
    key: string;
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
}
export interface FloatButtonProps extends AccessControlledProps {
    /** Icon rendered inside the button. */
    icon?: React.ReactNode;
    /** Text label displayed next to the icon. */
    label?: string;
    /** Tooltip text. @default label value */
    tooltip?: string;
    /** Button shape. @default "circle" */
    shape?: FloatButtonShape;
    /** Visual size variant. @default "md" */
    size?: FloatButtonSize;
    /** Fixed position on the viewport. @default "bottom-right" */
    position?: FloatButtonPosition;
    /** Pixel offset from the positioned edge [horizontal, vertical]. @default [24, 24] */
    offset?: [number, number];
    /** Badge indicator. Number shows count, true shows a dot. */
    badge?: number | boolean;
    /** Click handler for the primary button. */
    onClick?: () => void;
    /** Speed-dial / group items that expand from the primary button. */
    items?: FloatButtonGroupItem[];
    /** How the group menu is triggered. @default "click" */
    trigger?: FloatButtonTrigger;
    /** Controlled open state for the group menu. */
    open?: boolean;
    /** Callback when group menu open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** Additional class name for the root wrapper. */
    className?: string;
    /** Accessible label for the button. @default "Eylem butonu" */
    "aria-label"?: string;
}
export declare const FloatButton: React.ForwardRefExoticComponent<FloatButtonProps & React.RefAttributes<HTMLDivElement>>;
export default FloatButton;
