import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TimelineColor = "default" | "primary" | "success" | "warning" | "danger" | "info";
export type TimelineMode = "left" | "right" | "alternate";
export type TimelineSize = "sm" | "md";
export interface TimelineItemProps {
    /** Unique key for the item */
    key: React.Key;
    /** Item content */
    children: React.ReactNode;
    /** Dot color/variant */
    color?: TimelineColor;
    /** Custom dot icon — replaces the default dot */
    dot?: React.ReactNode;
    /** Label (shown on opposite side in alternate mode, or above content in left/right mode) */
    label?: React.ReactNode;
    /** Timestamp or meta info */
    meta?: React.ReactNode;
    /** Pending state — shows a pulsing dot animation */
    pending?: boolean;
}
export interface TimelineProps extends AccessControlledProps {
    /** Timeline items */
    items: TimelineItemProps[];
    /** Layout mode — left-aligned, right-aligned, or alternating */
    mode?: TimelineMode;
    /** Reverse order of items */
    reverse?: boolean;
    /** Pending item content shown at the end */
    pending?: React.ReactNode;
    /** Custom pending dot */
    pendingDot?: React.ReactNode;
    /** Size variant */
    size?: TimelineSize;
    /** Show connector line between dots (default: true) */
    showConnector?: boolean;
    /** Additional CSS class */
    className?: string;
}
/**
 * Chronological event display with left, right, or alternating layout and color-coded dots.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { key: '1', color: 'success', children: 'Order placed' },
 *     { key: '2', color: 'primary', children: 'Shipped', pending: true },
 *   ]}
 *   mode="left"
 * />
 * ```
 */
export declare const Timeline: React.ForwardRefExoticComponent<TimelineProps & React.RefAttributes<HTMLDivElement>>;
