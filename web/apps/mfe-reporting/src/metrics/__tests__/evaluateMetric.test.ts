import { describe, expect, it } from 'vitest';
import { extractFormulaDeps, validateFormula, formatMetricValue } from '../evaluateMetric';
import type { MetricDefinition } from '../types';

describe('extractFormulaDeps', () => {
  it('tek tablo.sütun referansı', () => {
    expect(extractFormulaDeps('SUM(INVOICE.TOTAL)')).toEqual(['INVOICE.TOTAL']);
  });

  it('birden fazla referans', () => {
    const deps = extractFormulaDeps('SUM(INVOICE.TOTAL) - SUM(INVOICE.TAX)');
    expect(deps).toContain('INVOICE.TOTAL');
    expect(deps).toContain('INVOICE.TAX');
  });

  it('duplicate referanslar tekil döner', () => {
    const deps = extractFormulaDeps('SUM(INVOICE.TOTAL) + AVG(INVOICE.TOTAL)');
    expect(deps).toEqual(['INVOICE.TOTAL']);
  });

  it('referanssız formül → boş', () => {
    expect(extractFormulaDeps('42 + 58')).toEqual([]);
  });
});

describe('validateFormula', () => {
  it('geçerli formül — 0 hata', () => {
    expect(validateFormula('SUM(INVOICE.TOTAL) - SUM(INVOICE.TAX)')).toEqual([]);
  });

  it('boş formül — hata', () => {
    expect(validateFormula('')).toContain('Formül boş olamaz');
  });

  it('dengesiz parantez — hata', () => {
    expect(validateFormula('SUM(INVOICE.TOTAL')).toContain('Parantezler dengesiz');
  });

  it('bilinmeyen fonksiyon — hata', () => {
    const errors = validateFormula('MEDIAN(INVOICE.TOTAL)');
    expect(errors.some((e) => e.includes('MEDIAN'))).toBe(true);
  });

  it('bilinen aggregateler geçer', () => {
    expect(validateFormula('SUM(A.B) + AVG(C.D) + COUNT(E.F) + MIN(G.H) + MAX(I.J)')).toEqual([]);
  });
});

describe('formatMetricValue', () => {
  const numberMetric: MetricDefinition = {
    id: 'm1', name: 'Test', formula: '', sourceTables: [],
    format: 'number', certified: false, category: 'Test',
  };

  const currencyMetric: MetricDefinition = {
    ...numberMetric, format: 'currency',
    formatConfig: { currencyCode: 'TRY', decimals: 2 },
  };

  const percentMetric: MetricDefinition = {
    ...numberMetric, format: 'percent',
    formatConfig: { decimals: 1 },
  };

  it('number format', () => {
    const result = formatMetricValue(1500, numberMetric, 'tr-TR');
    expect(result).toContain('1.500');
  });

  it('currency format — TRY', () => {
    const result = formatMetricValue(1500.50, currencyMetric, 'tr-TR');
    expect(result).toContain('₺') ;
  });

  it('percent format', () => {
    expect(formatMetricValue(75.5, percentMetric)).toBe('%75.5');
  });

  it('suffix/prefix', () => {
    const suffixMetric: MetricDefinition = {
      ...numberMetric, formatConfig: { suffix: 'adet' },
    };
    expect(formatMetricValue(42, suffixMetric)).toContain('adet');
  });
});
