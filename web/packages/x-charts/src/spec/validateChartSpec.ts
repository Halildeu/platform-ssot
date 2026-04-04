/**
 * ChartSpec Runtime Validator
 *
 * Validates ChartSpec instances at runtime before passing to the renderer.
 * Catches malformed specs early with descriptive error messages.
 */

import type { ChartSpec } from './ChartSpec';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_CHART_TYPES = new Set([
  'bar', 'stacked_bar', 'grouped_bar',
  'line', 'area', 'stacked_area',
  'pie', 'donut', 'ring',
  'scatter', 'bubble',
  'heatmap', 'treemap', 'sunburst',
  'radar', 'polar',
  'funnel', 'gauge',
  'sankey', 'chord',
  'candlestick', 'waterfall',
  'histogram', 'box',
  'parallel', 'graph',
  'map', 'custom',
]);

const VALID_DATA_SOURCES = new Set(['inline', 'query', 'stream', 'grid_linked']);

export function validateChartSpec(spec: unknown): ValidationResult {
  const errors: string[] = [];

  if (!spec || typeof spec !== 'object') {
    return { valid: false, errors: ['ChartSpec must be a non-null object'] };
  }

  const s = spec as Record<string, unknown>;

  // version
  if (s.version !== 'v1') {
    errors.push(`version must be 'v1', got '${String(s.version)}'`);
  }

  // chart_type
  if (!s.chart_type || !VALID_CHART_TYPES.has(s.chart_type as string)) {
    errors.push(`chart_type '${String(s.chart_type)}' is not valid`);
  }

  // data
  if (!s.data || typeof s.data !== 'object') {
    errors.push('data is required and must be an object');
  } else {
    const data = s.data as Record<string, unknown>;
    if (!VALID_DATA_SOURCES.has(data.source as string)) {
      errors.push(`data.source '${String(data.source)}' is not valid`);
    }
    if (data.source === 'inline' && (!Array.isArray(data.values) || data.values.length === 0)) {
      errors.push('data.values must be a non-empty array when source is inline');
    }
    if (data.source === 'stream' && typeof data.stream_url !== 'string') {
      errors.push('data.stream_url is required when source is stream');
    }
  }

  // encoding
  if (!s.encoding || typeof s.encoding !== 'object') {
    errors.push('encoding is required and must be an object');
  }

  // security: stream_url whitelist check
  if (s.data && (s.data as Record<string, unknown>).source === 'stream') {
    const streamUrl = (s.data as Record<string, unknown>).stream_url as string;
    const whitelist = ((s as Record<string, unknown>).security as Record<string, unknown>)?.stream_url_whitelist;
    if (Array.isArray(whitelist) && whitelist.length > 0 && streamUrl) {
      const allowed = whitelist.some((pattern: unknown) =>
        typeof pattern === 'string' && streamUrl.startsWith(pattern)
      );
      if (!allowed) {
        errors.push(`data.stream_url '${streamUrl}' is not in security.stream_url_whitelist`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
