/**
 * Responsive Chart Type Switch
 *
 * Switches chart type based on container width to optimize
 * readability on different screen sizes.
 *
 * Rules:
 *   - Pie → horizontal bar on mobile (< 400px)
 *   - Scatter → bar on mobile (< 400px)
 *   - Heatmap → table fallback on mobile (< 480px)
 *   - Multi-series line → stacked area on mobile (< 480px)
 *
 * @see contract P3-D DoD: "Responsive: chart type switch at breakpoint"
 */

import { useMemo } from 'react';
import type { ChartType } from '../spec/ChartSpec';

export interface ResponsiveChartTypeConfig {
  /** Original chart type from ChartSpec */
  chartType: ChartType;
  /** Container width in pixels */
  width: number;
  /** Number of series. Affects multi-series switching. */
  seriesCount?: number;
  /** Mobile breakpoint. @default 400 */
  mobileBreakpoint?: number;
  /** Tablet breakpoint. @default 480 */
  tabletBreakpoint?: number;
}

/**
 * Returns the effective chart type for the current container width.
 * Returns `null` when the chart should fall back to a data table
 * (e.g., heatmap on very narrow screens).
 */
export function useResponsiveChartType(config: ResponsiveChartTypeConfig): {
  effectiveType: ChartType;
  fallbackToTable: boolean;
} {
  const {
    chartType,
    width,
    seriesCount = 1,
    mobileBreakpoint = 400,
    tabletBreakpoint = 480,
  } = config;

  return useMemo(() => {
    // Desktop — no changes
    if (width >= tabletBreakpoint) {
      return { effectiveType: chartType, fallbackToTable: false };
    }

    // Tablet zone (mobileBreakpoint..tabletBreakpoint)
    if (width >= mobileBreakpoint) {
      if (chartType === 'heatmap') return { effectiveType: chartType, fallbackToTable: true };
      if (chartType === 'line' && seriesCount > 3) return { effectiveType: 'area' as ChartType, fallbackToTable: false };
      return { effectiveType: chartType, fallbackToTable: false };
    }

    // Mobile zone (< mobileBreakpoint)
    switch (chartType) {
      case 'pie':
        return { effectiveType: 'bar' as ChartType, fallbackToTable: false };
      case 'scatter':
        return { effectiveType: 'bar' as ChartType, fallbackToTable: false };
      case 'heatmap':
        return { effectiveType: chartType, fallbackToTable: true };
      case 'radar':
        return { effectiveType: chartType, fallbackToTable: true };
      case 'sankey':
        return { effectiveType: chartType, fallbackToTable: true };
      case 'line':
        if (seriesCount > 3) return { effectiveType: 'area' as ChartType, fallbackToTable: false };
        return { effectiveType: chartType, fallbackToTable: false };
      default:
        return { effectiveType: chartType, fallbackToTable: false };
    }
  }, [chartType, width, seriesCount, mobileBreakpoint, tabletBreakpoint]);
}
