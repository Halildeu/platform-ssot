import { describe, expect, it } from 'vitest';
import { inferChartTypes, suggestBestChart } from '../chartTypeInference';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';

describe('inferChartTypes', () => {
  it('date + number → line chart önerir', () => {
    const columns: ColumnMeta[] = [
      { field: 'date', headerNameKey: 'Tarih', columnType: 'date' },
      { field: 'amount', headerNameKey: 'Tutar', columnType: 'number' },
    ];
    const suggestions = inferChartTypes(columns);
    const lineChart = suggestions.find((s) => s.type === 'line');
    expect(lineChart).toBeDefined();
    expect(lineChart!.confidence).toBeGreaterThanOrEqual(0.8);
    expect(lineChart!.xAxis).toBe('date');
    expect(lineChart!.yAxis).toContain('amount');
  });

  it('date + number → area chart da önerir', () => {
    const columns: ColumnMeta[] = [
      { field: 'date', headerNameKey: 'Tarih', columnType: 'date' },
      { field: 'revenue', headerNameKey: 'Gelir', columnType: 'currency', currencyCode: 'TRY' } as ColumnMeta,
    ];
    const suggestions = inferChartTypes(columns);
    expect(suggestions.some((s) => s.type === 'area')).toBe(true);
  });

  it('category + number → bar chart', () => {
    const columns: ColumnMeta[] = [
      { field: 'department', headerNameKey: 'Departman', columnType: 'badge', variantMap: {} } as ColumnMeta,
      { field: 'count', headerNameKey: 'Sayı', columnType: 'number' },
    ];
    const suggestions = inferChartTypes(columns);
    const bar = suggestions.find((s) => s.type === 'bar');
    expect(bar).toBeDefined();
    expect(bar!.xAxis).toBe('department');
  });

  it('tek category + tek number → pie chart', () => {
    const columns: ColumnMeta[] = [
      { field: 'status', headerNameKey: 'Durum', columnType: 'status', statusMap: {} } as ColumnMeta,
      { field: 'count', headerNameKey: 'Sayı', columnType: 'number' },
    ];
    const suggestions = inferChartTypes(columns);
    expect(suggestions.some((s) => s.type === 'pie')).toBe(true);
  });

  it('2+ number → scatter chart', () => {
    const columns: ColumnMeta[] = [
      { field: 'x', headerNameKey: 'X', columnType: 'number' },
      { field: 'y', headerNameKey: 'Y', columnType: 'number' },
    ];
    const suggestions = inferChartTypes(columns);
    expect(suggestions.some((s) => s.type === 'scatter')).toBe(true);
  });

  it('category + 3+ number → radar chart', () => {
    const columns: ColumnMeta[] = [
      { field: 'dept', headerNameKey: 'Dept', columnType: 'text' },
      { field: 'a', headerNameKey: 'A', columnType: 'number' },
      { field: 'b', headerNameKey: 'B', columnType: 'number' },
      { field: 'c', headerNameKey: 'C', columnType: 'number' },
    ];
    const suggestions = inferChartTypes(columns);
    expect(suggestions.some((s) => s.type === 'radar')).toBe(true);
  });

  it('boolean → pie chart', () => {
    const columns: ColumnMeta[] = [
      { field: 'active', headerNameKey: 'Aktif', columnType: 'boolean' },
    ];
    const suggestions = inferChartTypes(columns);
    expect(suggestions.some((s) => s.type === 'pie')).toBe(true);
  });

  it('her zaman grid fallback var', () => {
    const columns: ColumnMeta[] = [
      { field: 'name', headerNameKey: 'Ad', columnType: 'text' },
    ];
    const suggestions = inferChartTypes(columns);
    expect(suggestions.some((s) => s.type === 'grid')).toBe(true);
  });

  it('confidence sıralı (yüksek → düşük)', () => {
    const columns: ColumnMeta[] = [
      { field: 'date', headerNameKey: 'Tarih', columnType: 'date' },
      { field: 'amount', headerNameKey: 'Tutar', columnType: 'number' },
      { field: 'dept', headerNameKey: 'Dept', columnType: 'text' },
    ];
    const suggestions = inferChartTypes(columns);
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i - 1].confidence).toBeGreaterThanOrEqual(suggestions[i].confidence);
    }
  });
});

describe('suggestBestChart', () => {
  it('date + number → line (en iyi)', () => {
    const columns: ColumnMeta[] = [
      { field: 'date', headerNameKey: 'Tarih', columnType: 'date' },
      { field: 'amount', headerNameKey: 'Tutar', columnType: 'number' },
    ];
    expect(suggestBestChart(columns).type).toBe('line');
  });

  it('sadece text → grid', () => {
    const columns: ColumnMeta[] = [
      { field: 'name', headerNameKey: 'Ad', columnType: 'text' },
    ];
    expect(suggestBestChart(columns).type).toBe('grid');
  });
});
