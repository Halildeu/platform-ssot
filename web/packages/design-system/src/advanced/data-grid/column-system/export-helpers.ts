/**
 * Export Helpers — Generates processCellCallback for Excel/CSV export.
 *
 * Ensures exported values show rendered labels (Aktif, Yönetici)
 * instead of raw values (ACTIVE, ADMIN).
 */

import type {
  ColumnMeta,
  TranslateFn,
  StatusColumnMeta,
  BadgeColumnMeta,
  DateColumnMeta,
  NumberColumnMeta,
  CurrencyColumnMeta,
  BooleanColumnMeta,
} from './types';

type ProcessCellParams = {
  value: unknown;
  column: { getColId: () => string };
  node?: { data?: Record<string, unknown> };
};

/**
 * Creates a processCellCallback from column metadata.
 * Maps raw cell values to human-readable labels for export.
 */
export function buildProcessCellCallback(
  columns: ColumnMeta[],
  t: TranslateFn,
  locale: string = 'tr-TR',
): (params: ProcessCellParams) => string {
  const columnMap = new Map<string, ColumnMeta>();
  for (const col of columns) {
    if (col.field) columnMap.set(col.field, col);
  }

  return (params) => {
    const colId = params.column.getColId();
    const meta = columnMap.get(colId);

    if (!meta) return params.value != null ? String(params.value) : '';

    const value = params.value;
    if (value == null || value === '') return '';

    switch (meta.columnType) {
      case 'status': {
        const sm = meta as StatusColumnMeta;
        const raw = String(value).toUpperCase();
        const entry = sm.statusMap[raw] ?? sm.statusMap[String(value)];
        if (entry) {
          const label = t(entry.labelKey);
          return label && label !== entry.labelKey ? label : String(value);
        }
        return String(value);
      }

      case 'badge': {
        const bm = meta as BadgeColumnMeta;
        if (bm.labelMap) {
          const raw = String(value).toUpperCase();
          const lk = bm.labelMap[raw] ?? bm.labelMap[String(value)];
          if (lk) {
            const label = t(lk);
            return label && label !== lk ? label : String(value);
          }
        }
        return String(value);
      }

      case 'date': {
        try {
          const date = new Date(value as string | number);
          if (Number.isNaN(date.getTime())) return String(value);
          const dm = meta as DateColumnMeta;
          const fmt = dm.format ?? 'datetime';
          if (fmt === 'short') return date.toLocaleDateString(locale);
          return date.toLocaleString(locale);
        } catch {
          return String(value);
        }
      }

      case 'number': {
        const nm = meta as NumberColumnMeta;
        const num = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(num)) return String(value);
        const formatted = num.toLocaleString(locale, {
          minimumFractionDigits: nm.decimals ?? 0,
          maximumFractionDigits: nm.decimals ?? 0,
        });
        const parts: string[] = [];
        if (nm.prefix) parts.push(nm.prefix);
        parts.push(formatted);
        if (nm.suffix) parts.push(nm.suffix);
        return parts.join(' ');
      }

      case 'currency': {
        const cm = meta as CurrencyColumnMeta;
        const num = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(num)) return String(value);
        return num.toLocaleString(locale, {
          style: 'currency',
          currency: cm.currencyCode ?? 'TRY',
          minimumFractionDigits: cm.decimals ?? 2,
          maximumFractionDigits: cm.decimals ?? 2,
        });
      }

      case 'boolean': {
        const bm = meta as BooleanColumnMeta;
        const isTruthy = value === true || value === 'true' || value === 1;
        const trueText = bm.trueLabelKey ? t(bm.trueLabelKey) : (bm.trueLabel ?? 'Evet');
        const falseText = bm.falseLabelKey ? t(bm.falseLabelKey) : (bm.falseLabel ?? 'Hayır');
        return isTruthy ? trueText : falseText;
      }

      case 'percent': {
        const num = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(num)) return String(value);
        return `%${num.toFixed((meta as { decimals?: number }).decimals ?? 1)}`;
      }

      default:
        return String(value);
    }
  };
}
