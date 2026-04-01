/**
 * Filter Builders — Generates AG Grid filter config from column metadata.
 *
 * Automatically selects the right filter type and params based on columnType.
 */

import type { ColumnMeta } from './types';

/* ------------------------------------------------------------------ */
/*  Filter type mapping                                                */
/* ------------------------------------------------------------------ */

type AgFilterType =
  | 'agTextColumnFilter'
  | 'agNumberColumnFilter'
  | 'agDateColumnFilter'
  | 'agSetColumnFilter'
  | boolean;

export interface FilterConfig {
  filter: AgFilterType;
  filterParams?: Record<string, unknown>;
  floatingFilter?: boolean;
}

/**
 * Builds AG Grid filter config from column metadata.
 * Returns undefined if column is not filterable.
 */
export function buildFilterConfig(meta: ColumnMeta): FilterConfig | undefined {
  if (meta.filterable === false) {
    return { filter: false, floatingFilter: false };
  }

  switch (meta.columnType) {
    case 'text':
    case 'bold-text':
    case 'link':
      return { filter: 'agTextColumnFilter' };

    case 'badge':
      return {
        filter: 'agSetColumnFilter',
        filterParams: createSetFilterParams(
          meta.filterValues ?? Object.keys(meta.variantMap),
        ),
      };

    case 'status':
      return {
        filter: 'agSetColumnFilter',
        filterParams: createSetFilterParams(Object.keys(meta.statusMap)),
      };

    case 'enum':
      return {
        filter: 'agSetColumnFilter',
        filterParams: createSetFilterParams(Object.keys(meta.labelMap)),
      };

    case 'date':
      return { filter: 'agDateColumnFilter' };

    case 'number':
    case 'currency':
    case 'percent':
      return { filter: 'agNumberColumnFilter' };

    case 'boolean':
      return {
        filter: 'agSetColumnFilter',
        filterParams: createSetFilterParams(['true', 'false']),
      };

    case 'actions':
      return { filter: false, floatingFilter: false };

    default:
      return { filter: 'agTextColumnFilter' };
  }
}

/* ------------------------------------------------------------------ */
/*  Set filter params builder                                          */
/* ------------------------------------------------------------------ */

function createSetFilterParams(values: string[]): Record<string, unknown> {
  return {
    values,
    suppressSyncValuesAfterDataChange: true,
  };
}
