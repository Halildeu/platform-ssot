/**
 * Dashboard-as-Code — JSON config → full dashboard
 *
 * Declarative dashboard configuration that can be stored as JSON,
 * version-controlled, and rendered programmatically.
 *
 * @see contract P8 DoD: "Dashboard-as-code: JSON config → full dashboard"
 */

import type { ChartType } from '../spec/ChartSpec';

export interface DashboardWidgetConfig {
  id: string;
  type: 'chart' | 'kpi' | 'stat' | 'table';
  chartType?: ChartType;
  title?: string;
  /** Grid position: { col, row, colSpan, rowSpan } */
  position: { col: number; row: number; colSpan?: number; rowSpan?: number };
  /** Data source config */
  dataSource: {
    type: 'api' | 'inline' | 'query';
    endpoint?: string;
    query?: string;
    data?: unknown[];
  };
  /** Chart encoding (x/y/color/size field mappings) */
  encoding?: Record<string, { field: string; type: string; aggregate?: string }>;
  /** Widget-specific options */
  options?: Record<string, unknown>;
}

export interface DashboardConfig {
  version: string;
  id: string;
  title: string;
  description?: string;
  /** Grid layout: columns count */
  columns?: number;
  /** Default time range filter */
  defaultTimeRange?: string;
  /** Global filters applied to all widgets */
  globalFilters?: Record<string, unknown>;
  /** Widget definitions */
  widgets: DashboardWidgetConfig[];
  /** Theme preset name */
  theme?: 'light' | 'dark' | 'high-contrast' | 'print';
}

/**
 * Validate and normalize a dashboard config.
 * Returns widget render instructions for the UI layer.
 */
export function renderDashboardFromConfig(config: DashboardConfig): {
  valid: boolean;
  errors: string[];
  widgets: Array<DashboardWidgetConfig & { resolved: boolean }>;
  gridColumns: number;
} {
  const errors: string[] = [];

  if (!config.version) errors.push('Missing version');
  if (!config.id) errors.push('Missing dashboard id');
  if (!config.title) errors.push('Missing title');
  if (!config.widgets || config.widgets.length === 0) errors.push('No widgets defined');

  // Validate widget positions
  const widgets = (config.widgets ?? []).map((w) => {
    const widgetErrors: string[] = [];
    if (!w.id) widgetErrors.push(`Widget missing id`);
    if (!w.type) widgetErrors.push(`Widget ${w.id}: missing type`);
    if (!w.position) widgetErrors.push(`Widget ${w.id}: missing position`);
    if (w.type === 'chart' && !w.chartType) widgetErrors.push(`Widget ${w.id}: chart type required`);

    if (widgetErrors.length > 0) errors.push(...widgetErrors);

    return { ...w, resolved: widgetErrors.length === 0 };
  });

  // Check for position overlaps
  const grid = new Map<string, string>();
  for (const w of widgets) {
    if (!w.position) continue;
    const colSpan = w.position.colSpan ?? 1;
    const rowSpan = w.position.rowSpan ?? 1;
    for (let r = w.position.row; r < w.position.row + rowSpan; r++) {
      for (let c = w.position.col; c < w.position.col + colSpan; c++) {
        const key = `${r}:${c}`;
        if (grid.has(key)) {
          errors.push(`Position overlap at row=${r}, col=${c} between ${grid.get(key)} and ${w.id}`);
        }
        grid.set(key, w.id);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    widgets,
    gridColumns: config.columns ?? 2,
  };
}
