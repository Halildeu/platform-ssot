/**
 * Contract Tests: AI — NL→ChartSpec, Auto-Insight, Suggestion, Description
 *
 * @see contract P5 DoD
 */
import { describe, it, expect, vi } from 'vitest';
import { nlToChartSpec } from '../ai/nl-to-chart-spec';
import { detectAnomalies, identifyTrends } from '../ai/auto-insight';
import { suggestChartType } from '../ai/chart-type-suggestion';
import { generateChartDescription } from '../ai/chart-description';

/* ================================================================== */
/*  NL → ChartSpec                                                     */
/* ================================================================== */

describe('nlToChartSpec', () => {
  it('generates valid spec from LLM response', async () => {
    const mockFetch = vi.fn().mockResolvedValue(JSON.stringify({
      spec_version: '1.0.0',
      chart_type: 'bar',
      title: 'Revenue by Department',
      encoding: {
        x: { field: 'department', type: 'nominal' },
        y: { field: 'revenue', type: 'quantitative', aggregate: 'sum' },
      },
      data_source: { type: 'inline', values: [] },
    }));

    const result = await nlToChartSpec({
      query: 'Show revenue by department',
      columns: [{ field: 'department', type: 'string' }, { field: 'revenue', type: 'number' }],
      fetchFn: mockFetch,
    });

    expect(result.spec).toBeDefined();
    expect(result.spec!.chart_type).toBe('bar');
    expect(result.prompt).toContain('revenue by department');
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('handles markdown-wrapped JSON response', async () => {
    const mockFetch = vi.fn().mockResolvedValue('```json\n{"spec_version":"1.0.0","chart_type":"line","title":"Trend","encoding":{"x":{"field":"date","type":"temporal"},"y":{"field":"value","type":"quantitative"}}}\n```');

    const result = await nlToChartSpec({ query: 'show trend', fetchFn: mockFetch });
    expect(result.spec).toBeDefined();
    expect(result.spec!.chart_type).toBe('line');
  });

  it('returns errors for invalid JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue('not json at all');
    const result = await nlToChartSpec({ query: 'test', fetchFn: mockFetch });
    expect(result.spec).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns errors for fetch failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const result = await nlToChartSpec({ query: 'test', fetchFn: mockFetch });
    expect(result.spec).toBeNull();
    expect(result.errors).toContain('Network error');
  });

  it('includes column context in prompt', async () => {
    const mockFetch = vi.fn().mockResolvedValue('{}');
    await nlToChartSpec({
      query: 'test',
      columns: [{ field: 'name', type: 'string' }],
      fetchFn: mockFetch,
    });
    expect(mockFetch.mock.calls[0][0]).toContain('name (string)');
  });
});

/* ================================================================== */
/*  Auto-Insight: Anomaly Detection                                    */
/* ================================================================== */

describe('detectAnomalies', () => {
  it('detects high outliers', () => {
    const data = [10, 12, 11, 13, 10, 12, 100, 11, 12, 10];
    const anomalies = detectAnomalies(data);
    expect(anomalies.length).toBeGreaterThan(0);
    expect(anomalies[0].value).toBe(100);
    expect(anomalies[0].direction).toBe('high');
  });

  it('detects low outliers', () => {
    const data = [100, 98, 102, 99, 101, 100, 5, 99, 101, 100];
    const anomalies = detectAnomalies(data);
    expect(anomalies.some((a) => a.value === 5 && a.direction === 'low')).toBe(true);
  });

  it('returns empty for uniform data', () => {
    expect(detectAnomalies([5, 5, 5, 5, 5])).toEqual([]);
  });

  it('returns empty for too few points', () => {
    expect(detectAnomalies([1, 2, 3])).toEqual([]);
  });

  it('respects sensitivity parameter', () => {
    const data = [10, 12, 11, 13, 10, 12, 30, 11, 12, 10];
    const loose = detectAnomalies(data, 3);
    const tight = detectAnomalies(data, 1);
    expect(tight.length).toBeGreaterThanOrEqual(loose.length);
  });
});

/* ================================================================== */
/*  Auto-Insight: Trend Identification                                 */
/* ================================================================== */

describe('identifyTrends', () => {
  it('detects upward trend', () => {
    const trend = identifyTrends([10, 20, 30, 40, 50]);
    expect(trend).not.toBeNull();
    expect(trend!.direction).toBe('up');
    expect(trend!.slope).toBeGreaterThan(0);
    expect(trend!.rSquared).toBeCloseTo(1);
  });

  it('detects downward trend', () => {
    const trend = identifyTrends([50, 40, 30, 20, 10]);
    expect(trend!.direction).toBe('down');
    expect(trend!.slope).toBeLessThan(0);
  });

  it('detects flat trend', () => {
    const trend = identifyTrends([100, 101, 99, 100, 101, 100]);
    expect(trend!.direction).toBe('flat');
  });

  it('returns null for single point', () => {
    expect(identifyTrends([42])).toBeNull();
  });

  it('summary is in Turkish', () => {
    const trend = identifyTrends([10, 20, 30]);
    expect(trend!.summary).toContain('trend');
  });
});

/* ================================================================== */
/*  Chart Type Suggestion                                              */
/* ================================================================== */

describe('suggestChartType', () => {
  it('suggests line for date + number', () => {
    const data = [
      { date: '2026-01-01', value: 100 },
      { date: '2026-02-01', value: 200 },
      { date: '2026-03-01', value: 150 },
    ];
    const suggestions = suggestChartType(data);
    expect(suggestions[0].type).toBe('line');
    expect(suggestions[0].confidence).toBeGreaterThan(0.8);
  });

  it('suggests bar for low-cardinality string + number', () => {
    const data = [
      { department: 'IT', revenue: 100 },
      { department: 'HR', revenue: 200 },
      { department: 'Sales', revenue: 300 },
    ];
    const suggestions = suggestChartType(data);
    expect(suggestions.some((s) => s.type === 'bar')).toBe(true);
  });

  it('suggests scatter for two numbers', () => {
    const data = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ];
    const suggestions = suggestChartType(data);
    expect(suggestions.some((s) => s.type === 'scatter')).toBe(true);
  });

  it('suggests gauge for single row', () => {
    const data = [{ value: 75 }];
    const suggestions = suggestChartType(data);
    expect(suggestions.some((s) => s.type === 'gauge')).toBe(true);
  });

  it('returns default for empty data', () => {
    const suggestions = suggestChartType([]);
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].type).toBe('bar');
  });

  it('limits to maxSuggestions', () => {
    const data = Array.from({ length: 50 }, (_, i) => ({ cat: `C${i % 5}`, val: i, date: `2026-0${(i % 9) + 1}-01` }));
    const suggestions = suggestChartType(data, 3);
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });
});

/* ================================================================== */
/*  Chart Description (a11y)                                           */
/* ================================================================== */

describe('generateChartDescription', () => {
  it('includes title and chart type', () => {
    const desc = generateChartDescription({ chartType: 'bar', title: 'Gelir', dataPointCount: 12 });
    expect(desc).toContain('Gelir');
    expect(desc).toContain('çubuk grafik');
    expect(desc).toContain('12');
  });

  it('includes axis labels', () => {
    const desc = generateChartDescription({ chartType: 'line', dataPointCount: 5, xLabel: 'Ay', yLabel: 'Gelir (TL)' });
    expect(desc).toContain('Ay');
    expect(desc).toContain('Gelir (TL)');
  });

  it('includes value range', () => {
    const desc = generateChartDescription({ chartType: 'bar', dataPointCount: 3, minValue: 100, maxValue: 500 });
    expect(desc).toContain('100');
    expect(desc).toContain('500');
  });

  it('includes categories (truncated)', () => {
    const desc = generateChartDescription({
      chartType: 'pie', dataPointCount: 8,
      categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    });
    expect(desc).toContain('A, B, C, D, E');
    expect(desc).toContain('3 diğer');
  });

  it('includes series count', () => {
    const desc = generateChartDescription({ chartType: 'line', dataPointCount: 10, seriesCount: 3 });
    expect(desc).toContain('3 seri');
  });

  it('handles unknown chart type gracefully', () => {
    const desc = generateChartDescription({ chartType: 'custom' as any, dataPointCount: 1 });
    expect(desc).toContain('custom');
  });
});
