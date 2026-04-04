/**
 * Chart Description Generator — Accessible Alt Text
 *
 * Generates human-readable descriptions of chart content
 * for screen readers and a11y compliance. Pure client-side,
 * no LLM needed — template-based.
 *
 * @see contract P5 DoD: "Chart description generation (for a11y alt text)"
 */

import type { ChartType } from '../spec/ChartSpec';

interface DescriptionInput {
  chartType: ChartType;
  title?: string;
  dataPointCount: number;
  seriesCount?: number;
  xLabel?: string;
  yLabel?: string;
  minValue?: number;
  maxValue?: number;
  categories?: string[];
}

const CHART_TYPE_NAMES: Partial<Record<ChartType, string>> = {
  bar: 'çubuk grafik',
  line: 'çizgi grafik',
  area: 'alan grafik',
  pie: 'pasta grafik',
  donut: 'halka grafik',
  scatter: 'dağılım grafiği',
  gauge: 'gösterge',
  radar: 'radar grafik',
  treemap: 'ağaç haritası',
  heatmap: 'ısı haritası',
  waterfall: 'şelale grafik',
  funnel: 'huni grafik',
  sankey: 'akış diyagramı',
  sunburst: 'güneş patlaması grafik',
};

/**
 * Generate an accessible description for a chart.
 *
 * ```ts
 * const desc = generateChartDescription({
 *   chartType: 'bar',
 *   title: 'Gelir Dağılımı',
 *   dataPointCount: 12,
 *   xLabel: 'Ay',
 *   yLabel: 'Gelir (TL)',
 *   minValue: 15000,
 *   maxValue: 85000,
 * });
 * // "Gelir Dağılımı — 12 veri noktası içeren çubuk grafik. Ay ekseninde Gelir (TL) gösteriliyor. Değer aralığı: 15.000 — 85.000."
 * ```
 */
export function generateChartDescription(input: DescriptionInput): string {
  const {
    chartType,
    title,
    dataPointCount,
    seriesCount = 1,
    xLabel,
    yLabel,
    minValue,
    maxValue,
    categories,
  } = input;

  const typeName = CHART_TYPE_NAMES[chartType] ?? chartType;
  const parts: string[] = [];

  // Title + type + data count
  if (title) {
    parts.push(`${title} — ${dataPointCount} veri noktası içeren ${typeName}`);
  } else {
    parts.push(`${dataPointCount} veri noktası içeren ${typeName}`);
  }

  // Series info
  if (seriesCount > 1) {
    parts.push(`${seriesCount} seri içeriyor`);
  }

  // Axis labels
  if (xLabel && yLabel) {
    parts.push(`${xLabel} ekseninde ${yLabel} gösteriliyor`);
  }

  // Value range
  if (minValue !== undefined && maxValue !== undefined) {
    const fmt = (v: number) => v.toLocaleString('tr-TR');
    parts.push(`Değer aralığı: ${fmt(minValue)} — ${fmt(maxValue)}`);
  }

  // Categories (max 5)
  if (categories && categories.length > 0) {
    const shown = categories.slice(0, 5);
    const suffix = categories.length > 5 ? ` ve ${categories.length - 5} diğer` : '';
    parts.push(`Kategoriler: ${shown.join(', ')}${suffix}`);
  }

  return parts.join('. ') + '.';
}
