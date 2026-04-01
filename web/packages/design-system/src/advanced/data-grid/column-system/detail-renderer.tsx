/**
 * Auto Detail Drawer — Generates a detail panel from ColumnMeta[].
 *
 * Replaces manually written renderDetail() in each module.
 * Uses column metadata to determine field labels, formatting, and layout.
 */

import React from 'react';
import { Badge } from '../../../primitives/badge';
import type {
  ColumnMeta,
  TranslateFn,
  BadgeColumnMeta,
  StatusColumnMeta,
  DateColumnMeta,
  NumberColumnMeta,
  CurrencyColumnMeta,
  BooleanColumnMeta,
} from './types';

/* ------------------------------------------------------------------ */
/*  Detail value formatter — renders a single field value              */
/* ------------------------------------------------------------------ */

function formatDetailValue(
  meta: ColumnMeta,
  value: unknown,
  t: TranslateFn,
  locale: string,
): React.ReactNode {
  if (value == null || value === '') {
    return <span className="text-text-subtle">-</span>;
  }

  switch (meta.columnType) {
    case 'bold-text':
      return <span className="font-semibold text-text-primary">{String(value)}</span>;

    case 'badge': {
      const bm = meta as BadgeColumnMeta;
      const raw = String(value).toUpperCase();
      const variant = bm.variantMap[raw] ?? bm.variantMap[String(value)] ?? bm.defaultVariant ?? 'default';
      let label = String(value);
      if (bm.labelMap && t) {
        const lk = bm.labelMap[raw] ?? bm.labelMap[String(value)];
        if (lk) {
          const translated = t(lk);
          if (translated && translated !== lk) label = translated;
        }
      }
      return <Badge variant={variant}>{label}</Badge>;
    }

    case 'status': {
      const sm = meta as StatusColumnMeta;
      const raw = String(value).toUpperCase();
      const entry = sm.statusMap[raw] ?? sm.statusMap[String(value)];
      if (!entry) return String(value);
      const label = t(entry.labelKey);
      return <Badge variant={entry.variant}>{label && label !== entry.labelKey ? label : String(value)}</Badge>;
    }

    case 'date': {
      const dm = meta as DateColumnMeta;
      try {
        const date = new Date(value as string | number);
        if (Number.isNaN(date.getTime())) return String(value);
        const fmt = dm.format ?? 'datetime';
        if (fmt === 'short') return date.toLocaleDateString(locale);
        if (fmt === 'long') return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
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

    case 'link':
      return (
        <a href={String(value)} className="text-action-primary hover:underline" target="_blank" rel="noopener noreferrer">
          {String(value)}
        </a>
      );

    default:
      return String(value);
  }
}

/* ------------------------------------------------------------------ */
/*  buildDetailRenderer — THE auto detail drawer function              */
/* ------------------------------------------------------------------ */

export interface DetailExtraField {
  /** Display label (raw string or i18n key) */
  label: string;
  /** Field name to read from the row data */
  field: string;
}

/**
 * Creates a renderDetail function from column metadata.
 *
 * @param columns - Same ColumnMeta[] used for the grid
 * @param locale - Locale for formatting (default: 'tr-TR')
 * @param extraFields - Additional fields to show in detail drawer beyond column definitions
 * @returns A function compatible with ReportModule.renderDetail
 */
export function buildDetailRenderer<TRow extends Record<string, unknown>>(
  columns: ColumnMeta[],
  locale: string = 'tr-TR',
  extraFields?: DetailExtraField[],
): (row: TRow | null, t: TranslateFn) => React.ReactNode {
  return (row, t) => {
    if (!row) {
      return (
        <div className="flex items-center justify-center py-8 text-sm text-text-subtle">
          {t('reports.detail.empty') || 'Detayları görmek için bir satır seçin.'}
        </div>
      );
    }

    /* Filter out actions columns and hidden columns */
    const visibleColumns = columns.filter(
      (col) => col.columnType !== 'actions' && !col.hidden,
    );

    return (
      <dl className="grid gap-y-3 gap-x-4" style={{ gridTemplateColumns: '180px 1fr' }}>
        {/* Show ID if present in row but not in columns */}
        {row.id != null && !visibleColumns.some((c) => c.field === 'id') && (
          <>
            <dt className="text-xs font-medium text-text-secondary">ID</dt>
            <dd className="text-sm text-text-primary">{String(row.id)}</dd>
          </>
        )}

        {visibleColumns.map((col) => {
          const value = row[col.field];
          const headerName = col.headerNameKey.includes('.')
            ? (t(col.headerNameKey) || col.headerNameKey)
            : col.headerNameKey;

          return (
            <React.Fragment key={col.field}>
              <dt className="text-xs font-medium text-text-secondary">{headerName}</dt>
              <dd className="text-sm text-text-primary">
                {formatDetailValue(col, value, t, locale)}
              </dd>
            </React.Fragment>
          );
        })}

        {/* Extra fields — shown after column-based fields */}
        {extraFields?.map((ef) => {
          const value = row[ef.field];
          if (value == null) return null;
          const label = ef.label.includes('.') ? (t(ef.label) || ef.label) : ef.label;
          return (
            <React.Fragment key={ef.field}>
              <dt className="text-xs font-medium text-text-secondary">{label}</dt>
              <dd className="text-sm text-text-primary">{String(value)}</dd>
            </React.Fragment>
          );
        })}
      </dl>
    );
  };
}
