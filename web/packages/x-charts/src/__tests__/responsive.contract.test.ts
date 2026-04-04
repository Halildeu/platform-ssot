/**
 * Contract Tests: Responsive — Auto-Granularity, Legend, Chart Type Switch
 *
 * @see contract P3-D DoD
 */
import { describe, it, expect } from 'vitest';
import { resolveGranularity } from '../responsive/useAutoGranularity';

const MS_HOUR = 3_600_000;
const MS_DAY = 86_400_000;

/* ================================================================== */
/*  Auto-Granularity                                                   */
/* ================================================================== */

describe('resolveGranularity', () => {
  it('returns minute for < 4 hours', () => {
    expect(resolveGranularity(2 * MS_HOUR)).toBe('minute');
  });

  it('returns hour for 4-48 hours', () => {
    expect(resolveGranularity(12 * MS_HOUR)).toBe('hour');
  });

  it('returns day for 2-60 days', () => {
    expect(resolveGranularity(30 * MS_DAY)).toBe('day');
  });

  it('returns week for 60-365 days', () => {
    expect(resolveGranularity(180 * MS_DAY)).toBe('week');
  });

  it('returns month for > 365 days', () => {
    expect(resolveGranularity(500 * MS_DAY)).toBe('month');
  });

  it('edge case: exactly 4 hours = minute (inclusive upper bound)', () => {
    expect(resolveGranularity(4 * MS_HOUR)).toBe('minute');
  });

  it('just over 4 hours = hour', () => {
    expect(resolveGranularity(4 * MS_HOUR + 1)).toBe('hour');
  });

  it('edge case: 0ms = minute', () => {
    expect(resolveGranularity(0)).toBe('minute');
  });

  it('respects custom thresholds', () => {
    const custom = {
      minute: 1 * MS_HOUR,
      hour: 6 * MS_HOUR,
      day: 30 * MS_DAY,
      week: 90 * MS_DAY,
      month: Infinity,
    };
    expect(resolveGranularity(3 * MS_HOUR, custom)).toBe('hour');
  });
});
