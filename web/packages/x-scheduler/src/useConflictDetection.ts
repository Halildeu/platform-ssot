import { useMemo } from 'react';
import type { SchedulerConflict, SchedulerEvent } from './types';

/* ------------------------------------------------------------------ */
/*  Sweep-line conflict detection — O(n log n)                         */
/* ------------------------------------------------------------------ */

interface Endpoint {
  time: number;
  type: 'start' | 'end';
  event: SchedulerEvent;
}

function detectConflicts(events: SchedulerEvent[]): SchedulerConflict[] {
  if (events.length < 2) return [];

  // Group events by resourceId (undefined / empty string treated as one pool)
  const groups = new Map<string, SchedulerEvent[]>();
  for (const evt of events) {
    const key = evt.resourceId ?? '';
    const list = groups.get(key);
    if (list) {
      list.push(evt);
    } else {
      groups.set(key, [evt]);
    }
  }

  const conflicts: SchedulerConflict[] = [];

  for (const group of groups.values()) {
    if (group.length < 2) continue;

    // Build sorted endpoint list
    const endpoints: Endpoint[] = [];
    for (const evt of group) {
      endpoints.push({ time: evt.start.getTime(), type: 'start', event: evt });
      endpoints.push({ time: evt.end.getTime(), type: 'end', event: evt });
    }

    // Sort: by time, then ends before starts at the same instant
    endpoints.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.type === 'end' ? -1 : 1;
    });

    // Sweep: maintain set of active events
    const active = new Set<SchedulerEvent>();

    for (const ep of endpoints) {
      if (ep.type === 'start') {
        // Current event overlaps with every already-active event
        for (const existing of active) {
          const overlapStart = new Date(Math.max(ep.event.start.getTime(), existing.start.getTime()));
          const overlapEnd = new Date(Math.min(ep.event.end.getTime(), existing.end.getTime()));
          conflicts.push({
            eventA: existing,
            eventB: ep.event,
            overlapStart,
            overlapEnd,
          });
        }
        active.add(ep.event);
      } else {
        active.delete(ep.event);
      }
    }
  }

  return conflicts;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseConflictDetectionReturn {
  conflicts: SchedulerConflict[];
  hasConflicts: boolean;
  getConflictsForEvent: (eventId: string) => SchedulerConflict[];
}

export function useConflictDetection(
  events: SchedulerEvent[],
): UseConflictDetectionReturn {
  const conflicts = useMemo(() => detectConflicts(events), [events]);

  const hasConflicts = conflicts.length > 0;

  const getConflictsForEvent = useMemo(() => {
    return (eventId: string): SchedulerConflict[] =>
      conflicts.filter((c) => c.eventA.id === eventId || c.eventB.id === eventId);
  }, [conflicts]);

  return { conflicts, hasConflicts, getConflictsForEvent };
}
