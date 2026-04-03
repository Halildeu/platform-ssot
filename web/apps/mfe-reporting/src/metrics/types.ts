/**
 * Metric Types — Semantic layer for consistent metric definitions.
 *
 * A metric is defined once, used in any report. Ensures "Aylık Gelir"
 * is calculated the same way everywhere.
 */

export interface MetricFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'between' | 'in';
  value: unknown;
}

export interface MetricDefinition {
  id: string;
  name: string;
  nameKey?: string;
  description?: string;
  /** SQL expression: "SUM(INVOICE.TOTAL) - SUM(INVOICE.TAX)" */
  formula: string;
  sourceTables: string[];
  filters?: MetricFilter[];
  format: 'number' | 'currency' | 'percent';
  formatConfig?: {
    decimals?: number;
    currencyCode?: string;
    suffix?: string;
    prefix?: string;
  };
  category: string;
  owner?: string;
  /** Certified = reviewed and approved for org-wide use */
  certified: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricValue {
  metricId: string;
  value: number;
  formattedValue: string;
  period?: string;
  trend?: { direction: 'up' | 'down' | 'flat'; percentage: number };
}
