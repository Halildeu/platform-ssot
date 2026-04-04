/**
 * Responsive Legend Collapse
 *
 * Collapses chart legend to a compact mode when container width
 * drops below a breakpoint. Prevents legend from overwhelming
 * the chart area on narrow screens.
 *
 * @see contract P3-D DoD: "Responsive: legend collapse at breakpoint"
 */

import { useMemo } from 'react';

export interface ResponsiveLegendConfig {
  /** Container width in pixels */
  width: number;
  /** Breakpoint to collapse legend. @default 480 */
  collapseAt?: number;
  /** Number of series. Used to decide scroll vs hide. */
  seriesCount?: number;
}

export interface LegendOverride {
  show: boolean;
  type: 'plain' | 'scroll';
  orient: 'horizontal' | 'vertical';
  top?: string | number;
  right?: string | number;
  itemWidth: number;
  itemHeight: number;
  textStyle: { fontSize: number };
}

/**
 * Returns ECharts legend config adapted to container width.
 *
 * - width >= collapseAt: full horizontal legend
 * - width < collapseAt && seriesCount <= 5: compact legend (smaller icons)
 * - width < collapseAt && seriesCount > 5: scroll legend (vertical, right-aligned)
 */
export function useResponsiveLegend(config: ResponsiveLegendConfig): LegendOverride {
  const { width, collapseAt = 480, seriesCount = 0 } = config;

  return useMemo(() => {
    if (width >= collapseAt) {
      return {
        show: true,
        type: 'plain' as const,
        orient: 'horizontal' as const,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12 },
      };
    }

    if (seriesCount > 5) {
      return {
        show: true,
        type: 'scroll' as const,
        orient: 'vertical' as const,
        right: 0,
        top: 'middle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 10 },
      };
    }

    return {
      show: true,
      type: 'plain' as const,
      orient: 'horizontal' as const,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { fontSize: 10 },
    };
  }, [width, collapseAt, seriesCount]);
}
