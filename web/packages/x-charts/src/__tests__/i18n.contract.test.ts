/**
 * Contract Tests: i18n — Locale, Formatters, RTL
 *
 * @see contract P3-C DoD
 */
import { describe, it, expect } from 'vitest';
import { registerEChartsLocale, getEChartsLocale, ECHARTS_LOCALE_MAP } from '../i18n/echarts-locale';
import { createNumberFormatter, createDateFormatter } from '../i18n/formatters';
import { isRTL, isRTLLocale, applyRTLTransforms } from '../i18n/rtl';

/* ================================================================== */
/*  ECharts Locale                                                     */
/* ================================================================== */

describe('ECharts Locale', () => {
  it('maps tr-TR to TR key', () => {
    expect(ECHARTS_LOCALE_MAP['tr-TR']).toBe('TR');
  });

  it('maps en-US to EN key', () => {
    expect(ECHARTS_LOCALE_MAP['en-US']).toBe('EN');
  });

  it('registerEChartsLocale returns key for supported locale', () => {
    expect(registerEChartsLocale('tr-TR')).toBe('TR');
  });

  it('registerEChartsLocale returns null for unsupported locale', () => {
    expect(registerEChartsLocale('xx-XX')).toBeNull();
  });

  it('getEChartsLocale returns data for tr-TR', () => {
    const data = getEChartsLocale('tr-TR');
    expect(data).toBeDefined();
    expect(data!.toolbox.saveAsImage.title).toBe('Resim olarak kaydet');
    expect(data!.legend.selector.all).toBe('Tümü');
  });

  it('getEChartsLocale returns data for en-US', () => {
    const data = getEChartsLocale('en-US');
    expect(data).toBeDefined();
    expect(data!.toolbox.saveAsImage.title).toBe('Save as image');
  });

  it('getEChartsLocale returns null for unsupported', () => {
    expect(getEChartsLocale('xx-XX')).toBeNull();
  });
});

/* ================================================================== */
/*  Number Formatter                                                   */
/* ================================================================== */

describe('createNumberFormatter', () => {
  it('formats Turkish locale by default', () => {
    const fmt = createNumberFormatter();
    const result = fmt(1234.56);
    // tr-TR: 1.234,56
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('formats with custom separators', () => {
    const fmt = createNumberFormatter({
      decimalSeparator: ',',
      thousandsSeparator: '.',
      maximumFractionDigits: 2,
    });
    expect(fmt(1234567.89)).toBe('1.234.567,89');
  });

  it('formats compact notation', () => {
    const fmt = createNumberFormatter({ locale: 'en-US', notation: 'compact' });
    const result = fmt(1500000);
    // Should produce something like "1.5M"
    expect(result.length).toBeLessThan(10);
  });

  it('handles zero', () => {
    const fmt = createNumberFormatter();
    expect(fmt(0)).toBeDefined();
  });

  it('handles negative numbers', () => {
    const fmt = createNumberFormatter({ decimalSeparator: '.', thousandsSeparator: ',' });
    const result = fmt(-1234.56);
    expect(result).toContain('-');
  });
});

/* ================================================================== */
/*  Date Formatter                                                     */
/* ================================================================== */

describe('createDateFormatter', () => {
  it('formats date-only preset', () => {
    const fmt = createDateFormatter({ locale: 'tr-TR', preset: 'date-only' });
    const result = fmt(new Date('2026-04-04T12:00:00Z'));
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats time-only preset', () => {
    const fmt = createDateFormatter({ locale: 'en-US', preset: 'time-only' });
    const result = fmt(new Date('2026-04-04T14:30:00Z'));
    expect(result).toBeDefined();
  });

  it('accepts Date object', () => {
    const fmt = createDateFormatter();
    expect(fmt(new Date())).toBeDefined();
  });

  it('accepts number timestamp', () => {
    const fmt = createDateFormatter();
    expect(fmt(Date.now())).toBeDefined();
  });

  it('accepts ISO string', () => {
    const fmt = createDateFormatter();
    expect(fmt('2026-04-04T00:00:00Z')).toBeDefined();
  });
});

/* ================================================================== */
/*  RTL Support                                                        */
/* ================================================================== */

describe('RTL', () => {
  it('isRTLLocale detects Arabic', () => {
    expect(isRTLLocale('ar-SA')).toBe(true);
    expect(isRTLLocale('ar')).toBe(true);
  });

  it('isRTLLocale detects Hebrew', () => {
    expect(isRTLLocale('he-IL')).toBe(true);
  });

  it('isRTLLocale returns false for Turkish', () => {
    expect(isRTLLocale('tr-TR')).toBe(false);
  });

  it('isRTLLocale returns false for English', () => {
    expect(isRTLLocale('en-US')).toBe(false);
  });

  it('isRTL falls back to locale when no DOM dir', () => {
    document.documentElement.removeAttribute('dir');
    expect(isRTL('ar-SA')).toBe(true);
    expect(isRTL('en-US')).toBe(false);
  });

  it('isRTL respects DOM dir attribute', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    expect(isRTL('en-US')).toBe(true);
    document.documentElement.removeAttribute('dir');
  });

  it('applyRTLTransforms mirrors title alignment', () => {
    const option = { title: { left: 'left', textAlign: 'left' } };
    const result = applyRTLTransforms(option);
    expect((result.title as Record<string, unknown>).left).toBe('right');
    expect((result.title as Record<string, unknown>).textAlign).toBe('right');
  });

  it('applyRTLTransforms mirrors grid', () => {
    const option = { grid: { left: '5%', right: '10%' } };
    const result = applyRTLTransforms(option);
    expect((result.grid as Record<string, unknown>).left).toBe('10%');
    expect((result.grid as Record<string, unknown>).right).toBe('5%');
  });

  it('applyRTLTransforms handles missing properties', () => {
    const option = {};
    const result = applyRTLTransforms(option);
    expect(result).toEqual({});
  });
});
