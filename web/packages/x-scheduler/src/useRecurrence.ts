import { useMemo } from 'react';
import type { RecurrenceRule, SchedulerEvent } from './types';

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function addYears(d: Date, n: number): Date {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() + n);
  return r;
}

/* ------------------------------------------------------------------ */
/*  Expansion logic                                                    */
/* ------------------------------------------------------------------ */

function isExcluded(date: Date, exceptions: Date[] | undefined): boolean {
  if (!exceptions || exceptions.length === 0) return false;
  return exceptions.some((ex) => isSameDay(ex, date));
}

/**
 * Advance a date by one recurrence step according to the rule's frequency
 * and interval.
 */
function nextOccurrence(current: Date, rule: RecurrenceRule): Date {
  const interval = rule.interval ?? 1;

  switch (rule.frequency) {
    case 'daily':
      return addDays(current, interval);
    case 'weekly':
      return addDays(current, 7 * interval);
    case 'monthly':
      return addMonths(current, interval);
    case 'yearly':
      return addYears(current, interval);
  }
}

/**
 * Expand a single recurring event into concrete instances within the
 * given date range.
 */
function expandEvent(
  event: SchedulerEvent,
  range: { start: Date; end: Date },
): SchedulerEvent[] {
  const rule = event.recurrence;
  if (!rule) return [];

  const durationMs = event.end.getTime() - event.start.getTime();
  const instances: SchedulerEvent[] = [];

  let cursor = new Date(event.start);
  let count = 0;
  const maxCount = rule.count ?? Infinity;
  const endDate = rule.endDate ? new Date(rule.endDate) : null;

  // Safety cap to prevent infinite loops on bad data
  const MAX_ITERATIONS = 10_000;
  let iterations = 0;

  while (iterations++ < MAX_ITERATIONS) {
    // Exceeded count limit
    if (count >= maxCount) break;

    // Past the recurrence end date
    if (endDate && cursor > endDate) break;

    // Past the requested range — no more instances needed
    if (cursor > range.end) break;

    const instanceEnd = new Date(cursor.getTime() + durationMs);

    // Check if this instance falls within the requested range
    const inRange = instanceEnd > range.start && cursor < range.end;

    if (rule.frequency === 'weekly' && rule.byDay && rule.byDay.length > 0) {
      // For weekly + byDay: emit one instance per matching day in the week
      const weekStart = new Date(cursor);
      for (const dayOfWeek of rule.byDay) {
        const dayDiff = (dayOfWeek - weekStart.getDay() + 7) % 7;
        const dayDate = addDays(weekStart, dayDiff);
        const dayEnd = new Date(dayDate.getTime() + durationMs);
        // Copy the time from the original event
        dayDate.setHours(event.start.getHours(), event.start.getMinutes(), event.start.getSeconds());
        dayEnd.setTime(dayDate.getTime() + durationMs);

        if (dayDate < range.start && dayEnd <= range.start) continue;
        if (dayDate > range.end) continue;
        if (endDate && dayDate > endDate) continue;
        if (isExcluded(dayDate, rule.exceptions)) continue;

        if (count >= maxCount) break;

        instances.push({
          ...event,
          id: `${event.id}_${dayDate.getTime()}`,
          start: new Date(dayDate),
          end: new Date(dayEnd),
        });
        count++;
      }

      cursor = nextOccurrence(cursor, rule);
    } else {
      // Standard: one instance per occurrence
      if (inRange && !isExcluded(cursor, rule.exceptions)) {
        instances.push({
          ...event,
          id: `${event.id}_${cursor.getTime()}`,
          start: new Date(cursor),
          end: new Date(instanceEnd),
        });
        count++;
      } else if (!inRange) {
        // Not excluded, just not in range yet — keep going
      }

      cursor = nextOccurrence(cursor, rule);
    }
  }

  return instances;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Expand recurring events into concrete instances within a date range.
 *
 * Non-recurring events pass through unchanged. Recurring base events are
 * replaced by their expanded instances.
 */
export function useRecurrence(
  events: SchedulerEvent[],
  range: { start: Date; end: Date },
): SchedulerEvent[] {
  return useMemo(() => {
    const result: SchedulerEvent[] = [];

    for (const event of events) {
      if (event.recurrence) {
        result.push(...expandEvent(event, range));
      } else {
        result.push(event);
      }
    }

    return result;
  }, [events, range]);
}
