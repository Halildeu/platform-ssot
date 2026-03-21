import { useState, useEffect, type RefObject } from 'react';
import type { SchedulerView } from './types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveSchedulerState {
  /** Current breakpoint based on container width. */
  breakpoint: Breakpoint;
  /** Recommended view for the current breakpoint. */
  recommendedView: SchedulerView;
  /** True when container width < 480 px. */
  isMobile: boolean;
  /** True when container width is 480 – 1024 px. */
  isTablet: boolean;
  /** True when container width > 1024 px. */
  isDesktop: boolean;
}

/* ------------------------------------------------------------------ */
/*  Breakpoint thresholds                                              */
/* ------------------------------------------------------------------ */

const MOBILE_MAX = 480;
const TABLET_MAX = 1024;

function resolveBreakpoint(width: number): Breakpoint {
  if (width < MOBILE_MAX) return 'mobile';
  if (width <= TABLET_MAX) return 'tablet';
  return 'desktop';
}

/** Map each breakpoint to the most usable scheduler view. */
const RECOMMENDED_VIEW: Record<Breakpoint, SchedulerView> = {
  mobile: 'agenda',
  tablet: 'day',
  desktop: 'week',
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Tracks the responsive state of a scheduler container and recommends
 * the best view for the current breakpoint.
 *
 * - **mobile** (< 480 px): agenda view — single-column event list
 * - **tablet** (480 – 1024 px): day view — fits well in medium viewports
 * - **desktop** (> 1024 px): week view — full weekly overview
 */
export function useResponsiveScheduler(
  containerRef: RefObject<HTMLElement | null>,
): ResponsiveSchedulerState {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure immediately
    const rect = el.getBoundingClientRect();
    setBreakpoint(resolveBreakpoint(rect.width));

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setBreakpoint(resolveBreakpoint(width));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return {
    breakpoint,
    recommendedView: RECOMMENDED_VIEW[breakpoint],
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
}
