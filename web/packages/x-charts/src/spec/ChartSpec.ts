/**
 * ChartSpec — Engine-Agnostic Declarative Chart Specification
 *
 * The universal input contract for all Design Lab chart components.
 * Any producer (human, AI, template) generates this; the rendering layer consumes it.
 *
 * Mirrors: schemas/chart-spec.schema.v1.json (orchestrator repo)
 * Decision: decisions/topics/chart-viz-engine-selection.v1.json (D-005)
 */

/* ------------------------------------------------------------------ */
/*  Chart Types                                                        */
/* ------------------------------------------------------------------ */

export type ChartType =
  | 'bar' | 'stacked_bar' | 'grouped_bar'
  | 'line' | 'area' | 'stacked_area'
  | 'pie' | 'donut' | 'ring'
  | 'scatter' | 'bubble'
  | 'heatmap' | 'treemap' | 'sunburst'
  | 'radar' | 'polar'
  | 'funnel' | 'gauge'
  | 'sankey' | 'chord'
  | 'candlestick' | 'waterfall'
  | 'histogram' | 'box'
  | 'parallel' | 'graph'
  | 'map' | 'custom';

export type FieldType = 'quantitative' | 'ordinal' | 'nominal' | 'temporal';
export type AggregateType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median' | 'distinct';
export type DataSourceType = 'inline' | 'query' | 'stream' | 'grid_linked';

/* ------------------------------------------------------------------ */
/*  Channel (encoding field → visual property)                         */
/* ------------------------------------------------------------------ */

export interface ChartChannel {
  field: string;
  type?: FieldType;
  aggregate?: AggregateType;
  format?: string;
  title?: string;
  scale?: Record<string, unknown>;
  sort?: 'ascending' | 'descending' | 'none';
}

/* ------------------------------------------------------------------ */
/*  Encoding                                                           */
/* ------------------------------------------------------------------ */

export interface ChartEncoding {
  x?: ChartChannel;
  y?: ChartChannel;
  color?: ChartChannel;
  size?: ChartChannel;
  shape?: ChartChannel;
  opacity?: ChartChannel;
  label?: ChartChannel;
  tooltip?: ChartChannel[];
  detail?: ChartChannel;
  angle?: ChartChannel;
  radius?: ChartChannel;
  source?: ChartChannel;
  target?: ChartChannel;
  value?: ChartChannel;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export interface ChartTransform {
  type: 'filter' | 'aggregate' | 'sort' | 'calculate' | 'bin' | 'timeunit' | 'window';
  config: Record<string, unknown>;
}

export interface ChartDataSpec {
  source: DataSourceType;
  values?: Record<string, unknown>[];
  query_ref?: string;
  grid_id?: string;
  stream_url?: string;
  transforms?: ChartTransform[];
}

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

export interface DrillDownLevel {
  field: string;
  label?: string;
  chart_type?: ChartType;
}

export interface ContextMenuItem {
  action_id: string;
  label: string;
  icon?: string;
  disabled_reason?: string;
}

export interface ChartInteractionSpec {
  click_to_filter?: boolean;
  hover_tooltip?: boolean;
  hover_highlight?: boolean;
  drill_down?: { enabled: boolean; levels: DrillDownLevel[] };
  brush_select?: boolean;
  zoom_pan?: boolean;
  context_menu?: ContextMenuItem[];
}

/* ------------------------------------------------------------------ */
/*  Cross-Filter                                                       */
/* ------------------------------------------------------------------ */

export interface ChartCrossFilterSpec {
  enabled?: boolean;
  emit_fields?: string[];
  receive_fields?: string[];
  group_id?: string;
}

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

export type ColorblindPalette = 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochrome';

export interface ChartAccessibilitySpec {
  description?: string;
  auto_description?: boolean;
  data_table_fallback?: boolean;
  keyboard_navigation?: boolean;
  announce_updates?: boolean;
  decal_patterns?: boolean;
  colorblind_palette?: ColorblindPalette;
  minimum_contrast_ratio?: number;
}

/* ------------------------------------------------------------------ */
/*  States                                                             */
/* ------------------------------------------------------------------ */

export interface ChartStatesSpec {
  loading?: { type: 'skeleton' | 'spinner' | 'progress' | 'placeholder'; message?: string };
  empty?: { type: 'illustration' | 'message' | 'suggestion'; message?: string; action_label?: string };
  error?: { type: 'inline' | 'overlay' | 'fallback_chart'; retry_enabled?: boolean; timeout_ms?: number };
  partial?: { show_available?: boolean; indicator?: boolean };
}

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

export interface ChartAnimationSpec {
  enabled?: boolean;
  duration_ms?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  stagger_ms?: number;
  update_transition?: boolean;
  reduced_motion_behavior?: 'disable_all' | 'instant' | 'minimal';
}

/* ------------------------------------------------------------------ */
/*  Locale                                                             */
/* ------------------------------------------------------------------ */

export interface ChartLocaleSpec {
  locale?: string;
  timezone?: string;
  rtl?: boolean;
  number_format?: { decimal_separator?: string; thousands_separator?: string; currency_symbol?: string };
  date_format?: string;
}

/* ------------------------------------------------------------------ */
/*  Security                                                           */
/* ------------------------------------------------------------------ */

export interface ChartSecuritySpec {
  sanitize_labels?: boolean;
  sanitize_annotations?: boolean;
  stream_url_whitelist?: string[];
  disable_custom_formatters?: boolean;
  export_respect_masking?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Performance                                                        */
/* ------------------------------------------------------------------ */

export interface ChartPerformanceSpec {
  lazy_render?: boolean;
  debounce_ms?: number;
  max_data_points_canvas?: number;
  downsampling?: 'none' | 'lttb' | 'average' | 'min_max';
  web_worker_transform?: boolean;
  progressive_render?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Annotation                                                         */
/* ------------------------------------------------------------------ */

export interface ChartAnnotation {
  type: 'text' | 'line' | 'area' | 'point';
  content: string;
  position?: Record<string, unknown>;
  style?: Record<string, unknown>;
  source?: 'manual' | 'ai_insight' | 'threshold' | 'anomaly';
}

/* ------------------------------------------------------------------ */
/*  Responsive                                                         */
/* ------------------------------------------------------------------ */

export interface ChartResponsiveSpec {
  min_height?: number;
  aspect_ratio?: number;
  breakpoints?: Record<string, Partial<ChartSpec>>;
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export interface ChartExportSpec {
  png?: boolean;
  svg?: boolean;
  csv?: boolean;
  pdf?: boolean;
}

/* ------------------------------------------------------------------ */
/*  ChartSpec (root)                                                   */
/* ------------------------------------------------------------------ */

export interface ChartSpec {
  version: 'v1';
  chart_id?: string;
  chart_type: ChartType;
  title?: string;
  subtitle?: string;
  data: ChartDataSpec;
  encoding: ChartEncoding;
  interaction?: ChartInteractionSpec;
  cross_filter?: ChartCrossFilterSpec;
  theme_overrides?: Record<string, unknown>;
  responsive?: ChartResponsiveSpec;
  export?: ChartExportSpec;
  annotations?: ChartAnnotation[];
  accessibility?: ChartAccessibilitySpec;
  states?: ChartStatesSpec;
  animation?: ChartAnimationSpec;
  locale?: ChartLocaleSpec;
  security?: ChartSecuritySpec;
  performance?: ChartPerformanceSpec;
  meta?: Record<string, unknown>;
}
