/**
 * Visualization Types — Chart configuration for report visualizations.
 */

export type ChartType =
  | 'grid'
  | 'bar'
  | 'line'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'heatmap'
  | 'treemap'
  | 'gauge'
  | 'funnel'
  | 'waterfall'
  | 'radar'
  | 'histogram'
  | 'bullet'
  | 'pareto'
  | 'kpi';

export interface ChartConfig {
  type: ChartType;
  /** Field for X axis / categories */
  xAxis: string;
  /** Field(s) for Y axis / values — multi-series support */
  yAxis: string[];
  /** Group data by this field (for stacked/grouped charts) */
  groupBy?: string;
  /** Color series by this field */
  colorBy?: string;
  /** Aggregation function */
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  /** Show legend */
  showLegend?: boolean;
  /** Show data labels on chart */
  showLabels?: boolean;
  /** Stack bars/areas */
  stacked?: boolean;
  /** Chart title */
  title?: string;
  /** Value formatter (e.g., "₺{value}" or "{value}%") */
  valueFormat?: string;
  /** Chart size */
  size?: 'sm' | 'md' | 'lg';
}

export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  grid: 'Tablo',
  bar: 'Bar',
  line: 'Çizgi',
  pie: 'Pasta',
  area: 'Alan',
  scatter: 'Nokta',
  heatmap: 'Isı Haritası',
  treemap: 'Ağaç Haritası',
  gauge: 'Gösterge',
  funnel: 'Huni',
  waterfall: 'Şelale',
  radar: 'Radar',
  histogram: 'Histogram',
  bullet: 'Mermi',
  pareto: 'Pareto',
  kpi: 'KPI Kart',
};

export const CHART_TYPE_ICONS: Record<ChartType, string> = {
  grid: '⊞',
  bar: '▊',
  line: '📈',
  pie: '◑',
  area: '▓',
  scatter: '⁘',
  heatmap: '▦',
  treemap: '⊟',
  gauge: '◔',
  funnel: '▽',
  waterfall: '▤',
  radar: '◎',
  histogram: '▥',
  bullet: '▬',
  pareto: '⬒',
  kpi: '🔢',
};
