/**
 * Preset Renderer Factories — Creates AG Grid cellRenderer functions
 * from declarative column metadata.
 *
 * Each factory returns a `(params: { value, data }) => ReactNode` function.
 * These are pure — no side effects, no hooks.
 */

import React from 'react';
import { Badge } from '@mfe/design-system';
import type {
  BadgeVariant,
  BadgeColumnMeta,
  StatusColumnMeta,
  DateColumnMeta,
  NumberColumnMeta,
  CurrencyColumnMeta,
  BooleanColumnMeta,
  PercentColumnMeta,
  LinkColumnMeta,
  TranslateFn,
} from './types';

type CellParams<T = unknown> = { value: unknown; data: T | undefined };

/* ------------------------------------------------------------------ */
/*  text — plain text (no custom renderer needed, returns undefined)   */
/* ------------------------------------------------------------------ */

export function createTextRenderer() {
  return undefined; // AG Grid default is fine
}

/* ------------------------------------------------------------------ */
/*  bold-text — font-semibold emphasized text                          */
/* ------------------------------------------------------------------ */

export function createBoldTextRenderer(className?: string) {
  const cls = className ?? 'font-semibold text-text-primary';
  return (params: CellParams) => {
    const val = params.value;
    if (val == null || val === '') return <span className="text-text-subtle">-</span>;
    return <span className={cls}>{String(val)}</span>;
  };
}

/* ------------------------------------------------------------------ */
/*  badge — colored Badge with variant map                             */
/* ------------------------------------------------------------------ */

export function createBadgeRenderer(
  variantMap: Record<string, BadgeVariant>,
  defaultVariant: BadgeVariant = 'default',
  labelMap?: Record<string, string>,
  t?: TranslateFn,
) {
  return (params: CellParams) => {
    const raw = typeof params.value === 'string' ? params.value : String(params.value ?? '');
    if (!raw) return <span className="text-text-subtle">-</span>;

    const key = raw.toUpperCase();
    const variant = variantMap[key] ?? variantMap[raw] ?? defaultVariant;

    let label = raw;
    if (labelMap && t) {
      const lk = labelMap[key] ?? labelMap[raw];
      if (lk) {
        const translated = t(lk);
        if (translated && !translated.startsWith('shared.') && !translated.startsWith('reports.')) {
          label = translated;
        }
      }
    } else if (labelMap) {
      label = labelMap[key] ?? labelMap[raw] ?? raw;
    }

    return <Badge variant={variant}>{label}</Badge>;
  };
}

/* ------------------------------------------------------------------ */
/*  status — Badge + i18n label (most common pattern)                  */
/* ------------------------------------------------------------------ */

export function createStatusRenderer(
  meta: Pick<StatusColumnMeta, 'statusMap' | 'defaultVariant'>,
  t: TranslateFn,
) {
  return (params: CellParams) => {
    const raw = typeof params.value === 'string' ? params.value : String(params.value ?? '');
    if (!raw) return <span className="text-text-subtle">-</span>;

    const key = raw.toUpperCase();
    const entry = meta.statusMap[key] ?? meta.statusMap[raw];

    if (!entry) {
      return <Badge variant={meta.defaultVariant ?? 'default'}>{raw}</Badge>;
    }

    const label = t(entry.labelKey);
    const displayLabel = label && !label.startsWith('shared.') && !label.startsWith('reports.')
      ? label
      : raw;

    return <Badge variant={entry.variant}>{displayLabel}</Badge>;
  };
}

/* ------------------------------------------------------------------ */
/*  date — locale-formatted date                                       */
/* ------------------------------------------------------------------ */

export function createDateRenderer(
  meta: Pick<DateColumnMeta, 'format' | 'emptyText'>,
  locale: string,
) {
  const emptyText = meta.emptyText ?? '-';
  const fmt = meta.format ?? 'datetime';

  return (params: CellParams) => {
    const val = params.value;
    if (val == null || val === '') return <span className="text-text-subtle">{emptyText}</span>;

    try {
      const date = new Date(val as string | number);
      if (Number.isNaN(date.getTime())) return <span className="text-text-subtle">{emptyText}</span>;

      switch (fmt) {
        case 'short':
          return date.toLocaleDateString(locale);
        case 'long':
          return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
        case 'relative': {
          const diff = Date.now() - date.getTime();
          const mins = Math.floor(diff / 60_000);
          if (mins < 1) return 'az önce';
          if (mins < 60) return `${mins}dk önce`;
          const hours = Math.floor(mins / 60);
          if (hours < 24) return `${hours}sa önce`;
          const days = Math.floor(hours / 24);
          if (days < 30) return `${days}g önce`;
          return date.toLocaleDateString(locale);
        }
        case 'datetime':
        default:
          return date.toLocaleString(locale);
      }
    } catch {
      return String(val);
    }
  };
}

/* ------------------------------------------------------------------ */
/*  number — formatted number with optional prefix/suffix              */
/* ------------------------------------------------------------------ */

export function createNumberRenderer(
  meta: Pick<NumberColumnMeta, 'decimals' | 'suffix' | 'prefix' | 'emptyText'>,
  locale: string,
) {
  const emptyText = meta.emptyText ?? '-';
  const decimals = meta.decimals ?? 0;

  return (params: CellParams) => {
    const val = params.value;
    if (val == null || val === '') return <span className="text-text-subtle">{emptyText}</span>;

    const num = typeof val === 'number' ? val : Number(val);
    if (!Number.isFinite(num)) return <span className="text-text-subtle">{emptyText}</span>;

    const formatted = num.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const parts: string[] = [];
    if (meta.prefix) parts.push(meta.prefix);
    parts.push(formatted);
    if (meta.suffix) parts.push(meta.suffix);

    return parts.join(' ');
  };
}

/* ------------------------------------------------------------------ */
/*  currency — locale currency format                                  */
/* ------------------------------------------------------------------ */

export function createCurrencyRenderer(
  meta: Pick<CurrencyColumnMeta, 'currencyCode' | 'decimals'>,
  locale: string,
) {
  const code = meta.currencyCode ?? 'TRY';
  const decimals = meta.decimals ?? 2;

  return (params: CellParams) => {
    const val = params.value;
    if (val == null || val === '') return <span className="text-text-subtle">-</span>;

    const num = typeof val === 'number' ? val : Number(val);
    if (!Number.isFinite(num)) return <span className="text-text-subtle">-</span>;

    return num.toLocaleString(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };
}

/* ------------------------------------------------------------------ */
/*  boolean — icon or text for true/false                              */
/* ------------------------------------------------------------------ */

export function createBooleanRenderer(
  meta: Pick<BooleanColumnMeta, 'display' | 'trueLabel' | 'falseLabel' | 'trueLabelKey' | 'falseLabelKey'>,
  t: TranslateFn,
) {
  const mode = meta.display ?? 'icon';

  return (params: CellParams) => {
    const val = params.value;
    const isTruthy = val === true || val === 'true' || val === 1 || val === '1';

    if (mode === 'icon') {
      return isTruthy
        ? <span className="text-state-success-text">✓</span>
        : <span className="text-text-subtle">✗</span>;
    }

    const trueText = meta.trueLabelKey ? t(meta.trueLabelKey) : (meta.trueLabel ?? 'Evet');
    const falseText = meta.falseLabelKey ? t(meta.falseLabelKey) : (meta.falseLabel ?? 'Hayır');
    return isTruthy ? trueText : falseText;
  };
}

/* ------------------------------------------------------------------ */
/*  percent — percentage with optional bar                             */
/* ------------------------------------------------------------------ */

export function createPercentRenderer(
  meta: Pick<PercentColumnMeta, 'decimals' | 'showBar' | 'barColor'>,
) {
  const decimals = meta.decimals ?? 1;
  const showBar = meta.showBar ?? false;
  const barColor = meta.barColor ?? 'var(--action-primary)';

  return (params: CellParams) => {
    const val = params.value;
    if (val == null || val === '') return <span className="text-text-subtle">-</span>;

    const num = typeof val === 'number' ? val : Number(val);
    if (!Number.isFinite(num)) return <span className="text-text-subtle">-</span>;

    const text = `%${num.toFixed(decimals)}`;

    if (!showBar) return text;

    const clamped = Math.max(0, Math.min(100, num));
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-surface-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${clamped}%`, backgroundColor: barColor }}
          />
        </div>
        <span className="shrink-0 text-[11px]">{text}</span>
      </div>
    );
  };
}

/* ------------------------------------------------------------------ */
/*  link — clickable text                                              */
/* ------------------------------------------------------------------ */

export function createLinkRenderer(
  meta: Pick<LinkColumnMeta, 'hrefTemplate' | 'hrefField' | 'newTab'>,
) {
  return (params: CellParams) => {
    const val = params.value;
    if (val == null || val === '') return <span className="text-text-subtle">-</span>;

    const data = params.data as Record<string, unknown> | undefined;
    let href: string;

    if (meta.hrefField && data) {
      href = String(data[meta.hrefField] ?? '');
    } else if (meta.hrefTemplate && data) {
      href = meta.hrefTemplate.replace(/\{(\w+)\}/g, (_, field) => String(data[field] ?? ''));
    } else {
      href = String(val);
    }

    return (
      <a
        href={href}
        target={meta.newTab ? '_blank' : undefined}
        rel={meta.newTab ? 'noopener noreferrer' : undefined}
        className="text-action-primary hover:underline"
      >
        {String(val)}
      </a>
    );
  };
}

/* ------------------------------------------------------------------ */
/*  enum — text with label mapping                                     */
/* ------------------------------------------------------------------ */

export function createEnumRenderer(
  labelMap: Record<string, string>,
  labelsAreKeys: boolean,
  t: TranslateFn,
) {
  return (params: CellParams) => {
    const raw = typeof params.value === 'string' ? params.value : String(params.value ?? '');
    if (!raw) return <span className="text-text-subtle">-</span>;

    const mapped = labelMap[raw] ?? labelMap[raw.toUpperCase()] ?? raw;
    return labelsAreKeys ? (t(mapped) || mapped) : mapped;
  };
}

/* ------------------------------------------------------------------ */
/*  Export value formatter — for Excel/CSV export                      */
/*  Returns rendered label instead of raw value                        */
/* ------------------------------------------------------------------ */

export function createExportValueGetter(
  meta: { columnType: string } & Record<string, unknown>,
  t: TranslateFn,
): ((params: { value: unknown; data: unknown }) => string) | undefined {
  switch (meta.columnType) {
    case 'status': {
      const statusMap = meta.statusMap as Record<string, { labelKey: string }>;
      return (params) => {
        const raw = typeof params.value === 'string' ? params.value.toUpperCase() : '';
        const entry = statusMap[raw];
        if (!entry) return raw;
        const label = t(entry.labelKey);
        return label && !label.startsWith('shared.') ? label : raw;
      };
    }
    case 'badge': {
      const labelMap = meta.labelMap as Record<string, string> | undefined;
      if (!labelMap) return undefined;
      return (params) => {
        const raw = typeof params.value === 'string' ? params.value : '';
        const lk = labelMap[raw.toUpperCase()] ?? labelMap[raw];
        if (!lk) return raw;
        return t(lk) || raw;
      };
    }
    case 'boolean': {
      const trueLabel = meta.trueLabelKey ? t(meta.trueLabelKey as string) : (meta.trueLabel as string ?? 'Evet');
      const falseLabel = meta.falseLabelKey ? t(meta.falseLabelKey as string) : (meta.falseLabel as string ?? 'Hayır');
      return (params) => {
        const val = params.value;
        return val === true || val === 'true' || val === 1 ? trueLabel : falseLabel;
      };
    }
    default:
      return undefined;
  }
}
