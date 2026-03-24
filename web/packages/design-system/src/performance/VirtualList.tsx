import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  renderItem: (
    item: T,
    index: number,
    style: React.CSSProperties,
  ) => React.ReactNode;
  /** Fired when the user scrolls near the bottom */
  onEndReached?: () => void;
  /** Distance from bottom (px) to trigger onEndReached (default 200) */
  endReachedThreshold?: number;
  /** Optional CSS class for the outer container */
  className?: string;
  /** Accessible label for the listbox */
  'aria-label'?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------
   */

function getItemOffset(
  index: number,
  itemHeight: number | ((i: number) => number),
): number {
  if (typeof itemHeight === 'number') return index * itemHeight;
  let offset = 0;
  for (let i = 0; i < index; i++) offset += itemHeight(i);
  return offset;
}

function getHeight(
  index: number,
  itemHeight: number | ((i: number) => number),
): number {
  return typeof itemHeight === 'number' ? itemHeight : itemHeight(index);
}

function getTotalHeight(
  count: number,
  itemHeight: number | ((i: number) => number),
): number {
  if (typeof itemHeight === 'number') return count * itemHeight;
  let total = 0;
  for (let i = 0; i < count; i++) total += itemHeight(i);
  return total;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

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
export function VirtualList<T>({
  items,
  itemHeight,
  overscan = 5,
  containerHeight,
  renderItem,
  onEndReached,
  endReachedThreshold = 200,
  className,
  'aria-label': ariaLabel,
}: VirtualListProps<T>): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const endReachedFired = useRef(false);

  /* Total content height */
  const totalHeight = useMemo(
    () => getTotalHeight(items.length, itemHeight),
    [items.length, itemHeight],
  );

  /* Visible range */
  const { startIndex, endIndex } = useMemo(() => {
    let start = 0;
    let accumulated = 0;

    // Find start index
    for (let i = 0; i < items.length; i++) {
      const h = getHeight(i, itemHeight);
      if (accumulated + h > scrollTop) {
        start = i;
        break;
      }
      accumulated += h;
      if (i === items.length - 1) start = items.length;
    }

    // Find end index
    let end = start;
    let visible = 0;
    for (let i = start; i < items.length; i++) {
      visible += getHeight(i, itemHeight);
      end = i + 1;
      if (visible >= containerHeight) break;
    }

    // Apply overscan
    const s = Math.max(0, start - overscan);
    const e = Math.min(items.length, end + overscan);
    return { startIndex: s, endIndex: e };
  }, [scrollTop, items.length, itemHeight, containerHeight, overscan]);

  /* Scroll handler */
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      setScrollTop(target.scrollTop);

      // Infinite scroll
      if (onEndReached) {
        const distanceFromBottom =
          target.scrollHeight - target.scrollTop - target.clientHeight;
        if (distanceFromBottom <= endReachedThreshold) {
          if (!endReachedFired.current) {
            endReachedFired.current = true;
            onEndReached();
          }
        } else {
          endReachedFired.current = false;
        }
      }
    },
    [onEndReached, endReachedThreshold],
  );

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [items.length],
  );

  /* Scroll focused item into view */
  useEffect(() => {
    if (focusedIndex < 0 || !containerRef.current) return;
    const offset = getItemOffset(focusedIndex, itemHeight);
    const h = getHeight(focusedIndex, itemHeight);
    const el = containerRef.current;

    if (offset < el.scrollTop) {
      el.scrollTop = offset;
    } else if (offset + h > el.scrollTop + containerHeight) {
      el.scrollTop = offset + h - containerHeight;
    }
  }, [focusedIndex, itemHeight, containerHeight]);

  /* Render visible items */
  const visibleItems = useMemo(() => {
    const rendered: React.ReactNode[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      const offset = getItemOffset(i, itemHeight);
      const h = getHeight(i, itemHeight);
      const style: React.CSSProperties = {
        position: 'absolute',
        top: offset,
        left: 0,
        width: '100%',
        height: h,
      };
      rendered.push(
        <div
          key={i}
          role="option"
          aria-selected={i === focusedIndex}
          data-index={i}
        >
          {renderItem(items[i], i, style)}
        </div>,
      );
    }
    return rendered;
  }, [startIndex, endIndex, itemHeight, renderItem, items, focusedIndex]);

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      className={className}
      data-component="virtual-list"
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
}

VirtualList.displayName = "VirtualList";

/** Type alias for VirtualList ref. */
export type VirtualListRef = React.Ref<HTMLElement>;
/** Type alias for VirtualList element. */
export type VirtualListElement = HTMLElement;
/** Type alias for VirtualList cssproperties. */
export type VirtualListCSSProperties = React.CSSProperties;
