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
  'dept-salary-comparison':    { dimension: 'department',  valueField: 'label' },
  'gender-salary-comparison':  { dimension: 'department',  valueField: 'label' },
  'education-salary-premium':  { dimension: 'education',   valueField: 'label' },
  'collar-type-salary':        { dimension: 'collarType',  valueField: 'label' },
  'company-payroll-pie':       { dimension: 'company',     valueField: 'label' },
  'dept-percentile-radar':     { dimension: 'department',  valueField: 'label' },
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
