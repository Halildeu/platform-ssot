import { useState, useEffect, type RefObject } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveChartConfig {
  /** Font size for axis labels, tooltips, etc. */
  fontSize: number;
  /** Whether to show the legend. */
  showLegend: boolean;
  /** Legend placement when visible. */
  legendPosition: 'bottom' | 'right' | 'none';
  /** Chart padding/margin in pixels. */
  padding: { top: number; right: number; bottom: number; left: number };
  /** Whether to show axis labels. */
  showAxisLabels: boolean;
  /** Point/bar size multiplier (1 = default). */
  elementScale: number;
  /** Tick density reduction factor (1 = full, 0.5 = half ticks). */
  tickDensity: number;
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

/* ------------------------------------------------------------------ */
/*  useResponsiveBreakpoint                                            */
/* ------------------------------------------------------------------ */

/**
 * Tracks the breakpoint of a container element via `ResizeObserver`.
 *
 * - mobile: < 480 px
 * - tablet: 480 – 1024 px
 * - desktop: > 1024 px
 */
export function useResponsiveBreakpoint(
  containerRef: RefObject<HTMLElement | null>,
): Breakpoint {
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

  return breakpoint;
}

/* ------------------------------------------------------------------ */
/*  useResponsiveChartConfig                                           */
/* ------------------------------------------------------------------ */

const CONFIG_MAP: Record<Breakpoint, ResponsiveChartConfig> = {
  mobile: {
    fontSize: 10,
    showLegend: false,
    legendPosition: 'none',
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    showAxisLabels: false,
    elementScale: 0.7,
    tickDensity: 0.3,
  },
  tablet: {
    fontSize: 12,
    showLegend: true,
    legendPosition: 'bottom',
    padding: { top: 12, right: 16, bottom: 12, left: 16 },
    showAxisLabels: true,
    elementScale: 0.85,
    tickDensity: 0.6,
  },
  desktop: {
    fontSize: 14,
    showLegend: true,
    legendPosition: 'right',
    padding: { top: 16, right: 24, bottom: 16, left: 24 },
    showAxisLabels: true,
    elementScale: 1,
    tickDensity: 1,
  },
};

/**
 * Returns a chart configuration adapted for the given breakpoint.
 *
 * - **mobile**: smaller fonts, no legend, compact padding
 * - **tablet**: medium fonts, legend below chart
 * - **desktop**: full configuration
 */
export function useResponsiveChartConfig(
  breakpoint: Breakpoint,
): ResponsiveChartConfig {
  return CONFIG_MAP[breakpoint];
}
