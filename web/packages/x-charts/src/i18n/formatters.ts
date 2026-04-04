/**
 * Locale-Aware Number & Date Formatters
 *
 * Uses the browser's Intl API for locale-specific formatting.
 * Integrates with ChartSpec.locale for consistent formatting
 * across tooltips, axis labels, and data tables.
 *
 * Default locale: tr-TR (per ChartSpec spec_version 1.0)
 * Default timezone: Europe/Istanbul
 */

/* ------------------------------------------------------------------ */
/*  Number Formatting                                                  */
/* ------------------------------------------------------------------ */

export interface NumberFormatOptions {
  locale?: string;
  style?: 'decimal' | 'percent' | 'currency';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: 'standard' | 'compact' | 'scientific';
  /** Custom decimal/thousands from ChartSpec.locale.number_format */
  decimalSeparator?: string;
  thousandsSeparator?: string;
}

/**
 * Create a locale-aware number formatter function.
 *
 * Uses Intl.NumberFormat when available, with ChartSpec overrides
 * applied via Intl options. Falls back to manual formatting if
 * custom separators are provided.
 *
 * ```ts
 * const fmt = createNumberFormatter({ locale: 'tr-TR' });
 * fmt(1234567.89); // "1.234.567,89"
 * ```
 */
export function createNumberFormatter(options?: NumberFormatOptions): (value: number) => string {
  const {
    locale = 'tr-TR',
    style = 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation = 'standard',
    decimalSeparator,
    thousandsSeparator,
  } = options ?? {};

  // If custom separators provided, use manual formatting
  if (decimalSeparator || thousandsSeparator) {
    const dec = decimalSeparator ?? ',';
    const thou = thousandsSeparator ?? '.';
    const fracDigits = maximumFractionDigits ?? 2;

    return (value: number): string => {
      const fixed = value.toFixed(fracDigits);
      const [intPart, fracPart] = fixed.split('.');
      const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thou);
      return fracPart ? `${withThousands}${dec}${fracPart}` : withThousands;
    };
  }

  // Use Intl.NumberFormat
  const intlOptions: Intl.NumberFormatOptions = {
    style,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  };
  if (style === 'currency' && currency) {
    intlOptions.currency = currency;
  }

  try {
    const formatter = new Intl.NumberFormat(locale, intlOptions);
    return (value: number) => formatter.format(value);
  } catch {
    // Fallback for unsupported locales
    return (value: number) => String(value);
  }
}

/* ------------------------------------------------------------------ */
/*  Date Formatting                                                    */
/* ------------------------------------------------------------------ */

export interface DateFormatOptions {
  locale?: string;
  timezone?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  /** Custom pattern for axis labels: 'date-only' | 'time-only' | 'datetime' */
  preset?: 'date-only' | 'time-only' | 'datetime';
}

/**
 * Create a locale-aware date formatter function.
 *
 * ```ts
 * const fmt = createDateFormatter({ locale: 'tr-TR', preset: 'date-only' });
 * fmt(new Date('2026-04-04')); // "04.04.2026"
 * ```
 */
export function createDateFormatter(options?: DateFormatOptions): (value: Date | number | string) => string {
  const {
    locale = 'tr-TR',
    timezone = 'Europe/Istanbul',
    dateStyle,
    timeStyle,
    preset = 'datetime',
  } = options ?? {};

  const intlOptions: Intl.DateTimeFormatOptions = { timeZone: timezone };

  if (dateStyle || timeStyle) {
    if (dateStyle) intlOptions.dateStyle = dateStyle;
    if (timeStyle) intlOptions.timeStyle = timeStyle;
  } else {
    switch (preset) {
      case 'date-only':
        intlOptions.dateStyle = 'short';
        break;
      case 'time-only':
        intlOptions.timeStyle = 'short';
        break;
      case 'datetime':
      default:
        intlOptions.dateStyle = 'short';
        intlOptions.timeStyle = 'short';
        break;
    }
  }

  try {
    const formatter = new Intl.DateTimeFormat(locale, intlOptions);
    return (value: Date | number | string): string => {
      const date = value instanceof Date ? value : new Date(value);
      return formatter.format(date);
    };
  } catch {
    return (value: Date | number | string): string => {
      const date = value instanceof Date ? value : new Date(value);
      return date.toLocaleString();
    };
  }
}
