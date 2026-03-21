import { useState, useEffect, type RefObject } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveKanbanState {
  /** Current breakpoint based on container width. */
  breakpoint: Breakpoint;
  /** Number of columns that should be visible at this breakpoint. */
  visibleColumns: number;
  /** True when container width < 480 px. */
  isMobile: boolean;
  /** Recommended column width in pixels for the current breakpoint. */
  columnWidth: number;
}

/* ------------------------------------------------------------------ */
/*  Breakpoint thresholds                                              */
/* ------------------------------------------------------------------ */

const MOBILE_MAX = 480;
const TABLET_MAX = 1024;

/** Default column counts when totalColumns is unknown. */
const DEFAULT_VISIBLE: Record<Breakpoint, number> = {
  mobile: 1,
  tablet: 2,
  desktop: Infinity, // all columns
};

/** Default column widths per breakpoint. */
const DEFAULT_WIDTH: Record<Breakpoint, number> = {
  mobile: 300,
  tablet: 320,
  desktop: 280,
};

function resolveBreakpoint(width: number): Breakpoint {
  if (width < MOBILE_MAX) return 'mobile';
  if (width <= TABLET_MAX) return 'tablet';
  return 'desktop';
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseResponsiveKanbanOptions {
  /** Total number of columns in the board (used to cap visibleColumns). */
  totalColumns?: number;
}

/**
 * Tracks the responsive state of a kanban container and recommends
 * the number of visible columns and column width.
 *
 * - **mobile** (< 480 px): 1 column, full-width swipeable layout
 * - **tablet** (480 – 1024 px): 2 columns side by side
 * - **desktop** (> 1024 px): all columns visible
 */
export function useResponsiveKanban(
  containerRef: RefObject<HTMLElement | null>,
  options: UseResponsiveKanbanOptions = {},
): ResponsiveKanbanState {
  const { totalColumns } = options;
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure immediately
    const rect = el.getBoundingClientRect();
    const w = Math.round(rect.width);
    setContainerWidth(w);
    setBreakpoint(resolveBreakpoint(w));

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const rounded = Math.round(width);
        setContainerWidth(rounded);
        setBreakpoint(resolveBreakpoint(rounded));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  // Compute visible columns
  let visibleColumns = DEFAULT_VISIBLE[breakpoint];
  if (totalColumns !== undefined && visibleColumns > totalColumns) {
    visibleColumns = totalColumns;
  }
  // For desktop, cap at totalColumns or calculate from container
  if (breakpoint === 'desktop' && visibleColumns === Infinity) {
    visibleColumns = totalColumns ?? Math.max(1, Math.floor(containerWidth / DEFAULT_WIDTH.desktop));
  }

  // Compute column width — fit evenly into available space
  const gap = 12; // column gap in px
  const columnWidth =
    visibleColumns > 0
      ? Math.floor((containerWidth - gap * (visibleColumns - 1)) / visibleColumns)
      : DEFAULT_WIDTH[breakpoint];

  return {
    breakpoint,
    visibleColumns,
    isMobile: breakpoint === 'mobile',
    columnWidth: Math.max(columnWidth, 200), // minimum 200px
  };
}
