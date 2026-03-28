import React from 'react';
import { type AccessControlledProps } from '../../internal/access-controller';
import { type OverlayAlign, type OverlaySide } from '../../internal/OverlayPositioning';
export type PopoverTriggerMode = 'click' | 'hover' | 'focus' | 'hover-focus';
export type PopoverSide = OverlaySide;
export type PopoverAlign = OverlayAlign;
/**
 * Popover renders a positioned overlay panel triggered by click, hover, or focus
 * with portal support, collision flipping, and arrow indicator.
 * @example
 * ```tsx
 * <Popover />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/popover)

 */
export interface PopoverProps extends AccessControlledProps {
    /** The element that anchors and triggers the popover. */
    trigger: React.ReactNode;
    /** Optional title rendered at the top of the panel. */
    title?: React.ReactNode;
    /** Body content rendered inside the popover panel. */
    content: React.ReactNode;
    /** Horizontal alignment relative to the trigger. @default "center" */
    align?: PopoverAlign;
    /** Preferred side the popover appears on. @default "bottom" */
    side?: PopoverSide;
    /** Interaction mode that opens the popover. @default "click" */
    triggerMode?: PopoverTriggerMode;
    /** Controlled open state. */
    open?: boolean;
    /** Initial open state for uncontrolled mode. @default false */
    defaultOpen?: boolean;
    /** Callback fired when the open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** Additional CSS class name on the root wrapper. */
    className?: string;
    /** DOM element to portal the panel into. @default document.body */
    portalTarget?: HTMLElement | null;
    /** Disable portaling and render the panel inline. @default false */
    disablePortal?: boolean;
    /** Accessible label for the popover dialog. @default "Popover" */
    ariaLabel?: string;
    /** Flip to the opposite side when clipped by viewport edges. @default true */
    flipOnCollision?: boolean;
    /** Delay in ms before showing on hover/focus triggers. */
    openDelay?: number;
    /** Delay in ms before hiding on hover/focus leave. */
    closeDelay?: number;
    /** Show a directional arrow pointing to the trigger. @default true */
    showArrow?: boolean;
    /** Additional CSS class name for the arrow element. */
    arrowClassName?: string;
    /** Additional CSS class name for the panel element. */
    panelClassName?: string;
}
/** Floating content panel anchored to a trigger with configurable placement, arrow, and access control. */
export declare const Popover: React.ForwardRefExoticComponent<PopoverProps & React.RefAttributes<HTMLDivElement>>;
export default Popover;
