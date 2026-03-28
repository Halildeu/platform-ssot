import React from "react";
export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";
/**
 * Tooltip renders a hover/focus information overlay positioned relative to its trigger element.
 */
export interface TooltipProps {
    /** Tooltip content displayed in the overlay. */
    content?: React.ReactNode;
    /** Side on which the tooltip appears. @default "top" */
    placement?: TooltipPlacement;
    /** Horizontal alignment relative to the trigger. @default "center" */
    align?: TooltipAlign;
    /** @deprecated Use `openDelay` instead. Delay before showing (ms). */
    delay?: number;
    /** Delay in ms before the tooltip appears. @default 200 */
    openDelay?: number;
    /** Delay in ms before the tooltip hides. @default 0 */
    closeDelay?: number;
    /** Prevent the tooltip from appearing. @default false */
    disabled?: boolean;
    /** Show a directional arrow pointing to the trigger. @default false */
    showArrow?: boolean;
    /** Additional CSS class name for the wrapper span. */
    className?: string;
    /**
     * Render the trigger via Slot — merges tooltip event handlers
     * directly onto the child element, removing the wrapper `<span>`.
     * The child element must accept `className`, `onMouseEnter`,
     * `onMouseLeave`, `onFocus`, `onBlur`, and `onKeyDown` props.
     * @example
     * <Tooltip content="Settings" asChild>
     *   <IconButton icon={<GearIcon />} aria-label="Settings" />
     * </Tooltip>
     */
    asChild?: boolean;
    /** Trigger element that the tooltip wraps. */
    children: React.ReactNode;
}
/** Hover/focus information overlay positioned relative to its trigger element. */
export declare const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLSpanElement>>;
