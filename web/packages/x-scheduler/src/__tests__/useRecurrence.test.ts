import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRecurrence } from '../useRecurrence';
import type { SchedulerEvent } from '../types';

function makeEvent(overrides: Partial<SchedulerEvent> = {}): SchedulerEvent {
  return {
    id: 'evt-1',
    title: 'Recurring Event',
    start: new Date(2025, 5, 1, 9, 0), // June 1, 2025 09:00
    end: new Date(2025, 5, 1, 10, 0),  // June 1, 2025 10:00
    ...overrides,
  };
}

describe('useRecurrence', () => {
  it('expands daily recurrence within range', () => {
    const event = makeEvent({
      recurrence: { frequency: 'daily' },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 4, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // June 1, 2, 3, 4 = 4 instances
    expect(result.current.length).toBe(4);
    expect(result.current[0].start.getDate()).toBe(1);
    expect(result.current[3].start.getDate()).toBe(4);
  });

  it('expands weekly recurrence within range', () => {
    const event = makeEvent({
      recurrence: { frequency: 'weekly' },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 22, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // June 1, 8, 15, 22 = 4 instances
    expect(result.current.length).toBe(4);
    expect(result.current[0].start.getDate()).toBe(1);
    expect(result.current[1].start.getDate()).toBe(8);
    expect(result.current[2].start.getDate()).toBe(15);
    expect(result.current[3].start.getDate()).toBe(22);
  });

  it('respects interval (every 2 days)', () => {
    const event = makeEvent({
      recurrence: { frequency: 'daily', interval: 2 },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 7, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // June 1, 3, 5, 7 = 4 instances
    expect(result.current.length).toBe(4);
    expect(result.current[0].start.getDate()).toBe(1);
    expect(result.current[1].start.getDate()).toBe(3);
    expect(result.current[2].start.getDate()).toBe(5);
    expect(result.current[3].start.getDate()).toBe(7);
  });

  it('respects endDate', () => {
    const event = makeEvent({
      recurrence: {
        frequency: 'daily',
        endDate: new Date(2025, 5, 3),
      },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 10, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // June 1, 2, 3 = 3 instances (endDate is June 3)
    expect(result.current.length).toBe(3);
  });

  it('respects count limit', () => {
    const event = makeEvent({
      recurrence: { frequency: 'daily', count: 3 },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 30, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    expect(result.current.length).toBe(3);
  });

  it('excludes exception dates', () => {
    const event = makeEvent({
      recurrence: {
        frequency: 'daily',
        exceptions: [new Date(2025, 5, 2)],
      },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 4, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // June 1, 3, 4 = 3 instances (June 2 excluded)
    expect(result.current.length).toBe(3);
    const dates = result.current.map((e) => e.start.getDate());
    expect(dates).not.toContain(2);
  });

  it('expands weekly with byDay filter', () => {
    // Event starts on Sunday June 1, 2025
    const event = makeEvent({
      start: new Date(2025, 5, 1, 9, 0), // Sunday
      end: new Date(2025, 5, 1, 10, 0),
      recurrence: {
        frequency: 'weekly',
        byDay: [1, 3, 5], // Monday, Wednesday, Friday
      },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 7, 23, 59, 59), // through Saturday
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // Within the first week starting Sunday June 1:
    // Mon June 2, Wed June 4, Fri June 6
    expect(result.current.length).toBe(3);
  });

  it('returns empty for non-recurring event', () => {
    const event = makeEvent(); // no recurrence

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 30, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    // Non-recurring events pass through unchanged
    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe('evt-1');
  });

  it('does not expand beyond range', () => {
    const event = makeEvent({
      recurrence: { frequency: 'daily' },
    });

    const range = {
      start: new Date(2025, 5, 1),
      end: new Date(2025, 5, 2, 23, 59, 59),
    };

    const { result } = renderHook(() => useRecurrence([event], range));

    expect(result.current.length).toBe(2);
    // All instances should be within range
    for (const instance of result.current) {
      expect(instance.start.getTime()).toBeLessThanOrEqual(range.end.getTime());
    }
  });
});
