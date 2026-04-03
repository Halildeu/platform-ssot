/**
 * Chart Type Inference — Suggests the best chart type based on column metadata.
 *
 * Analyzes the selected columns to recommend visualizations.
 */

import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { ChartType } from './types';

interface InferenceSuggestion {
  type: ChartType;
  confidence: number;
  reason: string;
  xAxis: string;
  yAxis: string[];
}

/**
 * Suggests chart types based on column metadata.
 * Returns suggestions sorted by confidence (highest first).
 */
export function inferChartTypes(columns: ColumnMeta[]): InferenceSuggestion[] {
  const suggestions: InferenceSuggestion[] = [];

  const dateColumns = columns.filter((c) => c.columnType === 'date');
  const numberColumns = columns.filter((c) =>
    c.columnType === 'number' || c.columnType === 'currency' || c.columnType === 'percent',
  );
  const categoryColumns = columns.filter((c) =>
    c.columnType === 'badge' || c.columnType === 'status' || c.columnType === 'enum' || c.columnType === 'text',
  );
  const booleanColumns = columns.filter((c) => c.columnType === 'boolean');

  /* Date + Number → Line chart (time series) */
  if (dateColumns.length > 0 && numberColumns.length > 0) {
    suggestions.push({
      type: 'line',
      confidence: 0.9,
      reason: 'Tarih + sayısal veri → zaman serisi',
      xAxis: dateColumns[0].field,
      yAxis: numberColumns.map((c) => c.field),
    });
    suggestions.push({
      type: 'area',
      confidence: 0.8,
      reason: 'Tarih + sayısal veri → alan grafiği',
      xAxis: dateColumns[0].field,
      yAxis: numberColumns.map((c) => c.field),
    });
  }

  /* Category + Number → Bar chart */
  if (categoryColumns.length > 0 && numberColumns.length > 0) {
    suggestions.push({
      type: 'bar',
      confidence: 0.85,
      reason: 'Kategori + sayısal veri → bar grafiği',
      xAxis: categoryColumns[0].field,
      yAxis: numberColumns.slice(0, 3).map((c) => c.field),
    });
  }

  /* Single category + single number → Pie chart */
  if (categoryColumns.length === 1 && numberColumns.length === 1) {
    suggestions.push({
      type: 'pie',
      confidence: 0.75,
      reason: 'Tek kategori + tek değer → pasta grafiği',
      xAxis: categoryColumns[0].field,
      yAxis: [numberColumns[0].field],
    });
  }

  /* Multiple numbers → Scatter */
  if (numberColumns.length >= 2) {
    suggestions.push({
      type: 'scatter',
      confidence: 0.6,
      reason: 'Birden fazla sayısal → nokta grafiği',
      xAxis: numberColumns[0].field,
      yAxis: [numberColumns[1].field],
    });
  }

  /* Category + multiple numbers → Radar */
  if (categoryColumns.length > 0 && numberColumns.length >= 3) {
    suggestions.push({
      type: 'radar',
      confidence: 0.5,
      reason: 'Kategori + çok boyutlu sayısal → radar',
      xAxis: categoryColumns[0].field,
      yAxis: numberColumns.slice(0, 5).map((c) => c.field),
    });
  }

  /* Boolean distribution → Pie */
  if (booleanColumns.length > 0) {
    suggestions.push({
      type: 'pie',
      confidence: 0.7,
      reason: 'Evet/hayır dağılımı → pasta',
      xAxis: booleanColumns[0].field,
      yAxis: [],
    });
  }

  /* Always suggest grid as fallback */
  suggestions.push({
    type: 'grid',
    confidence: 1.0,
    reason: 'Tablo görünümü (varsayılan)',
    xAxis: '',
    yAxis: [],
  });

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Returns the single best chart suggestion.
 */
export function suggestBestChart(columns: ColumnMeta[]): InferenceSuggestion {
  const suggestions = inferChartTypes(columns);
  /* Return first non-grid suggestion, or grid if nothing better */
  return suggestions.find((s) => s.type !== 'grid') ?? suggestions[suggestions.length - 1];
}
