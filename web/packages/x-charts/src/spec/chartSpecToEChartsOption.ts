/**
 * ChartSpec → ECharts Option Transformer
 *
 * PURE FUNCTION — no side effects, no DOM, no network.
 * This is the core integration point between the declarative ChartSpec contract
 * and the ECharts rendering engine.
 *
 * All text content is sanitized before being passed to ECharts.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-005)
 */

import type { ChartSpec, ChartChannel, ChartEncoding } from './ChartSpec';
import type { EChartsOption } from '../renderers/echarts-imports';

/* ------------------------------------------------------------------ */
/*  Sanitization (XSS prevention — D-004 security requirement)         */
/* ------------------------------------------------------------------ */

function escapeHtml(text: string | undefined): string | undefined {
  if (!text) return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ------------------------------------------------------------------ */
/*  Chart Type Mapping                                                 */
/* ------------------------------------------------------------------ */

type EChartsSeriesType = 'bar' | 'line' | 'pie' | 'scatter' | 'effectScatter'
  | 'radar' | 'treemap' | 'sunburst' | 'boxplot' | 'candlestick'
  | 'heatmap' | 'parallel' | 'graph' | 'sankey' | 'funnel' | 'gauge';

function mapChartType(chartType: ChartSpec['chart_type']): EChartsSeriesType {
  const map: Record<string, EChartsSeriesType> = {
    bar: 'bar',
    stacked_bar: 'bar',
    grouped_bar: 'bar',
    line: 'line',
    area: 'line',
    stacked_area: 'line',
    pie: 'pie',
    donut: 'pie',
    ring: 'pie',
    scatter: 'scatter',
    bubble: 'effectScatter',
    heatmap: 'heatmap',
    treemap: 'treemap',
    sunburst: 'sunburst',
    radar: 'radar',
    funnel: 'funnel',
    gauge: 'gauge',
    sankey: 'sankey',
    candlestick: 'candlestick',
    waterfall: 'bar', // waterfall is a styled bar
    histogram: 'bar',
    box: 'boxplot',
    parallel: 'parallel',
    graph: 'graph',
  };
  return map[chartType] ?? 'bar';
}

/* ------------------------------------------------------------------ */
/*  Data extraction                                                    */
/* ------------------------------------------------------------------ */

function extractDataset(spec: ChartSpec): Record<string, unknown> | undefined {
  if (spec.data.source === 'inline' && spec.data.values) {
    return {
      source: spec.data.values,
    };
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Series building                                                    */
/* ------------------------------------------------------------------ */

function buildSeries(spec: ChartSpec): Record<string, unknown>[] {
  const seriesType = mapChartType(spec.chart_type);
  const series: Record<string, unknown> = { type: seriesType };

  // Encode mapping
  const enc = spec.encoding;

  if (enc.x?.field) {
    series.encode = { ...(series.encode as object ?? {}), x: enc.x.field };
  }
  if (enc.y?.field) {
    series.encode = { ...(series.encode as object ?? {}), y: enc.y.field };
  }
  if (enc.value?.field) {
    series.encode = { ...(series.encode as object ?? {}), value: enc.value.field };
  }
  if (enc.label?.field) {
    series.encode = { ...(series.encode as object ?? {}), itemName: enc.label.field };
  }

  // Stacking
  if (spec.chart_type === 'stacked_bar' || spec.chart_type === 'stacked_area') {
    series.stack = 'total';
  }

  // Area fill for area charts
  if (spec.chart_type === 'area' || spec.chart_type === 'stacked_area') {
    series.areaStyle = {};
  }

  // Pie/donut specifics
  if (spec.chart_type === 'donut') {
    series.radius = ['40%', '70%'];
  } else if (spec.chart_type === 'ring') {
    series.radius = ['50%', '70%'];
  }

  // Smooth line
  if (seriesType === 'line') {
    series.smooth = true;
  }

  return [series];
}

/* ------------------------------------------------------------------ */
/*  Axis building                                                      */
/* ------------------------------------------------------------------ */

function buildAxes(spec: ChartSpec): { xAxis?: unknown; yAxis?: unknown } {
  const isPolar = ['pie', 'donut', 'ring', 'radar', 'gauge', 'funnel', 'sunburst', 'treemap'].includes(spec.chart_type);
  if (isPolar) return {};

  const enc = spec.encoding;

  const xAxis: Record<string, unknown> = { type: 'category' };
  const yAxis: Record<string, unknown> = { type: 'value' };

  if (enc.x?.type === 'temporal') xAxis.type = 'time';
  if (enc.x?.type === 'quantitative') xAxis.type = 'value';
  if (enc.x?.title) xAxis.name = escapeHtml(enc.x.title);

  if (enc.y?.title) yAxis.name = escapeHtml(enc.y.title);

  // Horizontal bar
  if (spec.chart_type === 'bar' && enc.x?.type === 'quantitative' && enc.y?.type !== 'quantitative') {
    return { xAxis: yAxis, yAxis: xAxis };
  }

  return { xAxis, yAxis };
}

/* ------------------------------------------------------------------ */
/*  Tooltip                                                            */
/* ------------------------------------------------------------------ */

function buildTooltip(spec: ChartSpec): Record<string, unknown> {
  const interaction = spec.interaction;
  if (interaction?.hover_tooltip === false) return { show: false };

  return {
    show: true,
    trigger: ['pie', 'donut', 'ring', 'funnel', 'treemap', 'sunburst'].includes(spec.chart_type) ? 'item' : 'axis',
    confine: true, // prevent overflow outside container
  };
}

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */

function buildLegend(spec: ChartSpec): Record<string, unknown> {
  if (spec.encoding.color?.field) {
    return { show: true, bottom: 0 };
  }
  return { show: false };
}

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

function buildAnimation(spec: ChartSpec): Record<string, unknown> {
  const anim = spec.animation;
  if (!anim || anim.enabled === false) {
    return { animation: false };
  }
  return {
    animation: true,
    animationDuration: anim.duration_ms ?? 500,
    animationEasing: anim.easing === 'ease-in' ? 'cubicIn'
      : anim.easing === 'ease-out' ? 'cubicOut'
      : anim.easing === 'ease-in-out' ? 'cubicInOut'
      : 'cubicOut',
    animationDurationUpdate: anim.duration_ms ?? 300,
  };
}

/* ------------------------------------------------------------------ */
/*  ARIA (accessibility)                                               */
/* ------------------------------------------------------------------ */

function buildAria(spec: ChartSpec): Record<string, unknown> {
  const a11y = spec.accessibility;
  if (!a11y) return {};

  const aria: Record<string, unknown> = { enabled: true };

  if (a11y.description) {
    aria.label = { description: escapeHtml(a11y.description) };
  } else if (a11y.auto_description !== false) {
    aria.label = { show: true };
  }

  if (a11y.decal_patterns) {
    aria.decal = { show: true };
  }

  return aria;
}

/* ------------------------------------------------------------------ */
/*  Main Transformer                                                   */
/* ------------------------------------------------------------------ */

/**
 * Transform a ChartSpec into an ECharts option object.
 *
 * This is a PURE FUNCTION — safe to call in tests, workers, or SSR.
 * All text content is HTML-escaped to prevent XSS.
 */
export function chartSpecToEChartsOption(spec: ChartSpec): EChartsOption {
  const shouldSanitize = spec.security?.sanitize_labels !== false;

  const option: EChartsOption = {};

  // Title
  if (spec.title) {
    (option as Record<string, unknown>).title = {
      text: shouldSanitize ? escapeHtml(spec.title) : spec.title,
      subtext: shouldSanitize ? escapeHtml(spec.subtitle) : spec.subtitle,
      left: 'center',
    };
  }

  // Dataset
  const dataset = extractDataset(spec);
  if (dataset) {
    (option as Record<string, unknown>).dataset = dataset;
  }

  // Axes
  const axes = buildAxes(spec);
  if (axes.xAxis) (option as Record<string, unknown>).xAxis = axes.xAxis;
  if (axes.yAxis) (option as Record<string, unknown>).yAxis = axes.yAxis;

  // Series
  (option as Record<string, unknown>).series = buildSeries(spec);

  // Tooltip
  (option as Record<string, unknown>).tooltip = buildTooltip(spec);

  // Legend
  (option as Record<string, unknown>).legend = buildLegend(spec);

  // Animation
  Object.assign(option, buildAnimation(spec));

  // ARIA
  const aria = buildAria(spec);
  if (Object.keys(aria).length > 0) {
    (option as Record<string, unknown>).aria = aria;
  }

  // Data zoom (if zoom_pan enabled)
  if (spec.interaction?.zoom_pan) {
    (option as Record<string, unknown>).dataZoom = [
      { type: 'inside' },
      { type: 'slider', bottom: 20 },
    ];
  }

  // Theme overrides (merge last)
  if (spec.theme_overrides) {
    Object.assign(option, spec.theme_overrides);
  }

  return option;
}
