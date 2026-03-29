// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useConflictDetection } from '../useConflictDetection';
import type { SchedulerEvent } from '../types';

function makeEvent(overrides: Partial<SchedulerEvent> = {}): SchedulerEvent {
  return {
    id: 'evt-1',
    title: 'Event',
    start: new Date(2025, 5, 10, 9, 0),
    end: new Date(2025, 5, 10, 10, 0),
    ...overrides,
  };
}

describe('useConflictDetection', () => {
  it('detects two overlapping events', () => {
    const events: SchedulerEvent[] = [
      makeEvent({ id: 'a', start: new Date(2025, 5, 10, 9, 0), end: new Date(2025, 5, 10, 10, 0) }),
      makeEvent({ id: 'b', start: new Date(2025, 5, 10, 9, 30), end: new Date(2025, 5, 10, 10, 30) }),
    ];

    const { result } = renderHook(() => useConflictDetection(events));

    expect(result.current.hasConflicts).toBe(true);
    expect(result.current.conflicts.length).toBe(1);
    expect(result.current.conflicts[0].overlapStart.getTime()).toBe(
      new Date(2025, 5, 10, 9, 30).getTime(),
    );
    expect(result.current.conflicts[0].overlapEnd.getTime()).toBe(
      new Date(2025, 5, 10, 10, 0).getTime(),
    );
  });

  it('no conflicts when events don\'t overlap', () => {
    const events: SchedulerEvent[] = [
      makeEvent({ id: 'a', start: new Date(2025, 5, 10, 9, 0), end: new Date(2025, 5, 10, 10, 0) }),
      makeEvent({ id: 'b', start: new Date(2025, 5, 10, 10, 0), end: new Date(2025, 5, 10, 11, 0) }),
    ];

    const { result } = renderHook(() => useConflictDetection(events));

    expect(result.current.hasConflicts).toBe(false);
    expect(result.current.conflicts.length).toBe(0);
  });

  it('detects multi-event conflicts', () => {
    const events: SchedulerEvent[] = [
      makeEvent({ id: 'a', start: new Date(2025, 5, 10, 9, 0), end: new Date(2025, 5, 10, 11, 0) }),
      makeEvent({ id: 'b', start: new Date(2025, 5, 10, 9, 30), end: new Date(2025, 5, 10, 10, 30) }),
      makeEvent({ id: 'c', start: new Date(2025, 5, 10, 10, 0), end: new Date(2025, 5, 10, 12, 0) }),
    ];

    const { result } = renderHook(() => useConflictDetection(events));

    expect(result.current.hasConflicts).toBe(true);
    // a overlaps b, a overlaps c, b overlaps c = 3 conflicts
    expect(result.current.conflicts.length).toBe(3);
  });

  it('getConflictsForEvent returns correct conflicts', () => {
    const events: SchedulerEvent[] = [
      makeEvent({ id: 'a', start: new Date(2025, 5, 10, 9, 0), end: new Date(2025, 5, 10, 10, 0) }),
      makeEvent({ id: 'b', start: new Date(2025, 5, 10, 9, 30), end: new Date(2025, 5, 10, 10, 30) }),
      makeEvent({ id: 'c', start: new Date(2025, 5, 10, 14, 0), end: new Date(2025, 5, 10, 15, 0) }),
    ];

    const { result } = renderHook(() => useConflictDetection(events));

    const conflictsForA = result.current.getConflictsForEvent('a');
    expect(conflictsForA.length).toBe(1);

    const conflictsForC = result.current.getConflictsForEvent('c');
    expect(conflictsForC.length).toBe(0);
  });

  it('groups by resourceId when present', () => {
    const events: SchedulerEvent[] = [
      makeEvent({ id: 'a', resourceId: 'room-1', start: new Date(2025, 5, 10, 9, 0), end: new Date(2025, 5, 10, 10, 0) }),
      makeEvent({ id: 'b', resourceId: 'room-2', start: new Date(2025, 5, 10, 9, 0), end: new Date(2025, 5, 10, 10, 0) }),
    ];

    const { result } = renderHook(() => useConflictDetection(events));

    // Same time but different resources -> no conflict
    expect(result.current.hasConflicts).toBe(false);
  });

  it('handles all-day events', () => {
    const events: SchedulerEvent[] = [
      makeEvent({
        id: 'a',
        allDay: true,
        start: new Date(2025, 5, 10, 0, 0),
        end: new Date(2025, 5, 10, 23, 59, 59),
      }),
      makeEvent({
        id: 'b',
        start: new Date(2025, 5, 10, 14, 0),
        end: new Date(2025, 5, 10, 15, 0),
      }),
    ];

    const { result } = renderHook(() => useConflictDetection(events));

    expect(result.current.hasConflicts).toBe(true);
    expect(result.current.conflicts.length).toBe(1);
  });
});
