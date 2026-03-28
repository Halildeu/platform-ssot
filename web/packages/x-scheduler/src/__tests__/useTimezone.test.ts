import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimezone } from '../useTimezone';

describe('useTimezone', () => {
  it('defaults to browser timezone when no initial timezone is provided', () => {
    const { result } = renderHook(() => useTimezone());
    // Should be a non-empty string (IANA name)
    expect(result.current.timezone).toBeTruthy();
    expect(typeof result.current.timezone).toBe('string');
  });

  it('uses the provided initial timezone', () => {
    const { result } = renderHook(() => useTimezone('America/New_York'));
    expect(result.current.timezone).toBe('America/New_York');
  });

  it('setTimezone updates the active timezone', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    expect(result.current.timezone).toBe('UTC');

    act(() => {
      result.current.setTimezone('Europe/Istanbul');
    });

    expect(result.current.timezone).toBe('Europe/Istanbul');
  });

  it('toLocal returns a Date object', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const date = new Date('2025-06-15T12:00:00Z');
    const local = result.current.toLocal(date);
    expect(local).toBeInstanceOf(Date);
  });

  it('toUTC returns a Date object', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const date = new Date('2025-06-15T12:00:00Z');
    const utc = result.current.toUTC(date);
    expect(utc).toBeInstanceOf(Date);
  });

  it('toLocal and toUTC are inverse operations (round-trip)', () => {
    const { result } = renderHook(() => useTimezone('America/New_York'));
    const original = new Date('2025-06-15T18:00:00Z');
    const local = result.current.toLocal(original);
    const backToUtc = result.current.toUTC(local);

    // Should round-trip within 1 minute tolerance (due to snapping)
    expect(Math.abs(backToUtc.getTime() - original.getTime())).toBeLessThan(60_000);
  });

  it('formatInTimezone returns a non-empty string', () => {
    const { result } = renderHook(() => useTimezone('Europe/Istanbul'));
    const date = new Date('2025-06-15T12:00:00Z');
    const formatted = result.current.formatInTimezone(date);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('formatInTimezone supports "time" format', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const date = new Date('2025-06-15T14:30:00Z');
    const formatted = result.current.formatInTimezone(date, 'time');
    expect(formatted).toBeTruthy();
  });

  it('formatInTimezone supports "date" format', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const date = new Date('2025-06-15T14:30:00Z');
    const formatted = result.current.formatInTimezone(date, 'date');
    expect(formatted).toContain('06');
    expect(formatted).toContain('15');
  });

  it('formatInTimezone supports "datetime" format', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const date = new Date('2025-06-15T14:30:00Z');
    const formatted = result.current.formatInTimezone(date, 'datetime');
    expect(formatted).toBeTruthy();
  });

  it('getOffset returns a number', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const offset = result.current.getOffset();
    expect(typeof offset).toBe('number');
    // UTC offset should be 0
    expect(Math.abs(offset)).toBe(0);
  });

  it('getOffset returns non-zero for non-UTC timezone', () => {
    const { result } = renderHook(() => useTimezone('America/New_York'));
    const offset = result.current.getOffset();
    expect(typeof offset).toBe('number');
    // New York is either -5 or -4 hours (depending on DST)
    expect(offset).toBeLessThan(0);
    expect(offset).toBeGreaterThanOrEqual(-300);
  });

  it('timezoneLabel is a non-empty string', () => {
    const { result } = renderHook(() => useTimezone('America/New_York'));
    expect(result.current.timezoneLabel).toBeTruthy();
    expect(typeof result.current.timezoneLabel).toBe('string');
  });

  it('timezoneLabel updates when timezone changes', () => {
    const { result } = renderHook(() => useTimezone('UTC'));
    const initialLabel = result.current.timezoneLabel;

    act(() => {
      result.current.setTimezone('Asia/Tokyo');
    });

    // Label should change (unless both happen to have same abbreviation, which they don't)
    expect(result.current.timezoneLabel).not.toBe(initialLabel);
  });
});
