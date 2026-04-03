/**
 * Dashboard Builder Types
 */

import type { ChartConfig } from '../../../../apps/mfe-reporting/src/visualization/types';

export interface LayoutItem {
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export type WidgetType = 'chart' | 'grid' | 'kpi' | 'filter' | 'text';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title?: string;
  reportId?: string;
  chartConfig?: ChartConfig;
  metricId?: string;
  content?: string;
  refreshInterval?: number;
}

export interface DashboardFilter {
  id: string;
  field: string;
  label: string;
  type: 'text' | 'date' | 'set';
  linkedWidgets: string[];
  defaultValue?: unknown;
}

export interface DashboardDefinition {
  id: string;
  title: string;
  description?: string;
  layout: LayoutItem[];
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refreshInterval?: number;
  createdBy?: string;
  createdAt?: string;
  version: number;
}

export const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  chart: 'Grafik',
  grid: 'Tablo',
  kpi: 'KPI Kart',
  filter: 'Filtre',
  text: 'Metin',
};
