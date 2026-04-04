/**
 * Chart Code Splitting — Lazy import per chart type
 *
 * Dynamic imports for enterprise chart types to reduce initial bundle.
 * Core charts (bar, line, pie, area) are eager; enterprise types lazy.
 *
 * @see contract P6 DoD: "Bundle code splitting (per chart type)"
 */

import { lazy, type ComponentType } from 'react';

type LazyChart = ComponentType<Record<string, unknown>>;

const CHART_IMPORTS: Record<string, () => Promise<{ default: LazyChart }>> = {
  gauge: () => import('../GaugeChart').then((m) => ({ default: m.GaugeChart as unknown as LazyChart })),
  radar: () => import('../RadarChart').then((m) => ({ default: m.RadarChart as unknown as LazyChart })),
  treemap: () => import('../TreemapChart').then((m) => ({ default: m.TreemapChart as unknown as LazyChart })),
  heatmap: () => import('../HeatmapChart').then((m) => ({ default: m.HeatmapChart as unknown as LazyChart })),
  waterfall: () => import('../WaterfallChart').then((m) => ({ default: m.WaterfallChart as unknown as LazyChart })),
  funnel: () => import('../FunnelChart').then((m) => ({ default: m.FunnelChart as unknown as LazyChart })),
  sankey: () => import('../SankeyChart').then((m) => ({ default: m.SankeyChart as unknown as LazyChart })),
  sunburst: () => import('../SunburstChart').then((m) => ({ default: m.SunburstChart as unknown as LazyChart })),
};

/**
 * Get a lazy-loaded chart component by type name.
 *
 * ```tsx
 * const GaugeChart = lazyChartImport('gauge');
 * // Use in JSX with Suspense
 * <Suspense fallback={<ChartLoadingState />}>
 *   <GaugeChart value={75} />
 * </Suspense>
 * ```
 */
export function lazyChartImport(chartType: string): LazyChart {
  const importFn = CHART_IMPORTS[chartType];
  if (!importFn) {
    throw new Error(`Unknown lazy chart type: ${chartType}. Available: ${Object.keys(CHART_IMPORTS).join(', ')}`);
  }
  return lazy(importFn);
}
