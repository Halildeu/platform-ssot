export type CrossFilter = {
  sourceId: string;
  dimension: string;
  value: string | number;
  displayLabel: string;
};

export type ChartFilterMapping = {
  dimension: string;
  valueField: string;
};

/**
 * Maps chart IDs to their cross-filter dimension.
 * Charts not listed here do not participate as cross-filter sources
 * (e.g., time-series or waterfall charts).
 */
export const CHART_FILTER_MAP: Record<string, ChartFilterMapping> = {
  'salary-histogram':      { dimension: 'salaryBand',  valueField: 'label' },
  'department-salary':     { dimension: 'department',  valueField: 'label' },
  'gender-salary':         { dimension: 'gender',      valueField: 'label' },
  'education-salary':      { dimension: 'education',   valueField: 'label' },
  'collar-distribution':   { dimension: 'collarType',  valueField: 'label' },
  'tenure-salary':         { dimension: 'tenureBand',  valueField: 'label' },
  'company-payroll':       { dimension: 'company',     valueField: 'label' },
  'department-percentile': { dimension: 'department',  valueField: 'label' },
};

/** KPI IDs that support click-to-filter */
export const KPI_FILTER_MAP: Record<string, string> = {
  'gender-pay-gap': 'gender',
  'collar-overtime': 'collarType',
};

/**
 * Toggle a cross-filter: if the same sourceId+dimension+value exists, remove it.
 * If the same dimension but different value, replace it.
 * Otherwise, add it.
 */
export function toggleCrossFilter(
  current: CrossFilter[],
  incoming: CrossFilter,
): CrossFilter[] {
  const existingIdx = current.findIndex(
    (f) => f.dimension === incoming.dimension && f.value === incoming.value,
  );
  if (existingIdx >= 0) {
    return current.filter((_, i) => i !== existingIdx);
  }
  return [
    ...current.filter((f) => f.dimension !== incoming.dimension),
    incoming,
  ];
}
