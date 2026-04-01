/**
 * Filter Builders — Generates AG Grid filter config from column metadata.
 *
 * Automatically selects the right filter type and params based on columnType.
 */

import type { ColumnMeta, TranslateFn, BadgeColumnMeta, StatusColumnMeta, EnumColumnMeta, BooleanColumnMeta } from './types';

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
 *
 * @param meta - Column metadata
 * @param t - Optional translation function for set filter valueFormatter
 */
export function buildFilterConfig(meta: ColumnMeta, t?: TranslateFn): FilterConfig | undefined {
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
          t ? createBadgeValueFormatter(meta, t) : undefined,
        ),
      };

    case 'status':
      return {
        filter: 'agSetColumnFilter',
        filterParams: createSetFilterParams(
          Object.keys(meta.statusMap),
          t ? createStatusValueFormatter(meta, t) : undefined,
        ),
      };

    case 'enum':
      return {
        filter: 'agSetColumnFilter',
        filterParams: createSetFilterParams(
          Object.keys(meta.labelMap),
          t ? createEnumValueFormatter(meta, t) : undefined,
        ),
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
        filterParams: createSetFilterParams(
          ['true', 'false'],
          t ? createBooleanValueFormatter(meta, t) : undefined,
        ),
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

type ValueFormatterFn = (params: { value: unknown }) => string;

function createSetFilterParams(
  values: string[],
  valueFormatter?: ValueFormatterFn,
): Record<string, unknown> {
  const params: Record<string, unknown> = {
    values,
    suppressSyncValuesAfterDataChange: true,
  };
  if (valueFormatter) {
    params.valueFormatter = valueFormatter;
  }
  return params;
}

/* ------------------------------------------------------------------ */
/*  Value formatters for set filters (translates raw → display label)  */
/* ------------------------------------------------------------------ */

function createBadgeValueFormatter(meta: BadgeColumnMeta, t: TranslateFn): ValueFormatterFn {
  return ({ value }) => {
    if (typeof value !== 'string') return String(value ?? '');
    const key = value.toUpperCase();
    if (meta.labelMap) {
      const lk = meta.labelMap[key] ?? meta.labelMap[value];
      if (lk) {
        const translated = t(lk);
        if (translated && translated !== lk) return translated;
      }
    }
    return value;
  };
}

function createStatusValueFormatter(meta: StatusColumnMeta, t: TranslateFn): ValueFormatterFn {
  return ({ value }) => {
    if (typeof value !== 'string') return String(value ?? '');
    const key = value.toUpperCase();
    const entry = meta.statusMap[key] ?? meta.statusMap[value];
    if (entry) {
      const translated = t(entry.labelKey);
      if (translated && translated !== entry.labelKey) return translated;
    }
    return value;
  };
}

function createEnumValueFormatter(meta: EnumColumnMeta, t: TranslateFn): ValueFormatterFn {
  return ({ value }) => {
    if (typeof value !== 'string') return String(value ?? '');
    const mapped = meta.labelMap[value] ?? meta.labelMap[value.toUpperCase()];
    if (!mapped) return value;
    return meta.labelsAreKeys ? (t(mapped) || mapped) : mapped;
  };
}

function createBooleanValueFormatter(meta: BooleanColumnMeta, t: TranslateFn): ValueFormatterFn {
  return ({ value }) => {
    const str = String(value ?? '');
    const isTruthy = str === 'true';
    const trueText = meta.trueLabelKey ? t(meta.trueLabelKey) : (meta.trueLabel ?? 'Evet');
    const falseText = meta.falseLabelKey ? t(meta.falseLabelKey) : (meta.falseLabel ?? 'Hayır');
    return isTruthy ? trueText : falseText;
  };
}
