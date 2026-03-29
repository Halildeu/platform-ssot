import React from 'react';
export interface VirtualListProps<T> {
    /** The full array of items to virtualise */
    items: T[];
    /** Fixed height (number) or function returning height per index */
    itemHeight: number | ((index: number) => number);
    /** Extra items rendered above/below the visible window (default 5) */
    overscan?: number;
    /** Height of the scrollable container in px */
    containerHeight: number;
    /** Render callback for each visible item */
    renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
    /** Fired when the user scrolls near the bottom */
    onEndReached?: () => void;
    /** Distance from bottom (px) to trigger onEndReached (default 200) */
    endReachedThreshold?: number;
    /** Optional CSS class for the outer container */
    className?: string;
    /** Accessible label for the listbox */
    'aria-label'?: string;
}
/**
 * A lightweight virtualised list for rendering 1000+ items efficiently.
 *
 * Features:
 * - Fixed and variable item heights
 * - Overscan for smooth scrolling (default 5)
 * - Infinite scroll callback (`onEndReached`)
 * - Keyboard navigation (ArrowUp/Down)
 * - `role="listbox"` with proper ARIA
 * - Zero external dependencies
 * - CSS variable compatible
 
 * @example
 * ```tsx
 * <VirtualList />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/virtual-list)
 */
export declare function VirtualList<T>({ items, itemHeight, overscan, containerHeight, renderItem, onEndReached, endReachedThreshold, className, 'aria-label': ariaLabel, }: VirtualListProps<T>): React.ReactElement;
export declare namespace VirtualList {
    // eslint-disable-next-line no-var
    var displayName: string;
}
/** Type alias for VirtualList ref. */
export type VirtualListRef = React.Ref<HTMLElement>;
/** Type alias for VirtualList element. */
export type VirtualListElement = HTMLElement;
/** Type alias for VirtualList cssproperties. */
export type VirtualListCSSProperties = React.CSSProperties;
