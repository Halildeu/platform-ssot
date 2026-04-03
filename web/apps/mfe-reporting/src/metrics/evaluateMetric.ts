/**
 * evaluateMetric — Client-side metric expression utilities.
 *
 * For preview only — actual calculation happens on backend.
 * This validates formula syntax and extracts dependencies.
 */

import type { MetricDefinition } from './types';

/** Extract field references from a formula (e.g., "SUM(INVOICE.TOTAL)" → ["INVOICE.TOTAL"]) */
export function extractFormulaDeps(formula: string): string[] {
  const matches = formula.match(/[A-Z_]+\.[A-Z_]+/gi);
  return matches ? [...new Set(matches)] : [];
}

/** Validate a metric formula has balanced parens and known aggregates */
export function validateFormula(formula: string): string[] {
  const errors: string[] = [];
  if (!formula.trim()) {
    errors.push('Formül boş olamaz');
    return errors;
  }

  const openParens = (formula.match(/\(/g) ?? []).length;
  const closeParens = (formula.match(/\)/g) ?? []).length;
  if (openParens !== closeParens) {
    errors.push('Parantezler dengesiz');
  }

  const knownAggregates = ['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'DISTINCT'];
  const unknownFns = formula.match(/[A-Z_]+\s*\(/gi) ?? [];
  for (const fn of unknownFns) {
    const name = fn.replace(/\s*\(/, '').toUpperCase();
    if (!knownAggregates.includes(name)) {
      errors.push(`Bilinmeyen fonksiyon: ${name}`);
    }
  }

  return errors;
}

/** Format a metric value according to its format config */
export function formatMetricValue(
  value: number,
  metric: MetricDefinition,
  locale: string = 'tr-TR',
): string {
  const cfg = metric.formatConfig ?? {};
  const decimals = cfg.decimals ?? (metric.format === 'currency' ? 2 : metric.format === 'percent' ? 1 : 0);

  switch (metric.format) {
    case 'currency':
      return value.toLocaleString(locale, {
        style: 'currency',
        currency: cfg.currencyCode ?? 'TRY',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    case 'percent':
      return `%${value.toFixed(decimals)}`;
    default: {
      const formatted = value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const parts: string[] = [];
      if (cfg.prefix) parts.push(cfg.prefix);
      parts.push(formatted);
      if (cfg.suffix) parts.push(cfg.suffix);
      return parts.join(' ');
    }
  }
}
