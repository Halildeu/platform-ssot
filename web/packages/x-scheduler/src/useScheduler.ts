import { useCallback, useMemo, useState } from 'react';
import type { SchedulerEvent, SchedulerView } from './types';

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

/** Start of a day (00:00:00.000) */
function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** End of a day (23:59:59.999) */
function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

/** Monday-based start of week */
function startOfWeek(d: Date, weekStartsOn: 0 | 1 = 1): Date {
  const r = new Date(d);
  const day = r.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  r.setDate(r.getDate() - diff);
  return startOfDay(r);
}

function endOfWeek(d: Date, weekStartsOn: 0 | 1 = 1): Date {
  const s = startOfWeek(d, weekStartsOn);
  const r = new Date(s);
  r.setDate(r.getDate() + 6);
  return endOfDay(r);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
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

/* ------------------------------------------------------------------ */
/*  Visible range                                                      */
/* ------------------------------------------------------------------ */

export function getVisibleRange(
  view: SchedulerView,
  date: Date,
  weekStartsOn: 0 | 1 = 1,
): { start: Date; end: Date } {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) };
    case 'week':
      return { start: startOfWeek(date, weekStartsOn), end: endOfWeek(date, weekStartsOn) };
    case 'month': {
      const ms = startOfMonth(date);
      const me = endOfMonth(date);
      // extend to full weeks for the grid
      return { start: startOfWeek(ms, weekStartsOn), end: endOfWeek(me, weekStartsOn) };
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseSchedulerOptions {
  /** Initial view */
  initialView?: SchedulerView;
  /** Initial date */
  initialDate?: Date;
  /** All events */
  events?: SchedulerEvent[];
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
}

export interface UseSchedulerReturn {
  view: SchedulerView;
  date: Date;
  setView: (v: SchedulerView) => void;
  setDate: (d: Date) => void;
  goToday: () => void;
  goNext: () => void;
  goPrev: () => void;
  /** Events filtered to the current visible range */
  visibleEvents: SchedulerEvent[];
  /** The start/end of the current visible window */
  visibleRange: { start: Date; end: Date };

  /* Drag state */
  dragEvent: SchedulerEvent | null;
  startDrag: (event: SchedulerEvent) => void;
  endDrag: () => void;
}

export function useScheduler(opts: UseSchedulerOptions = {}): UseSchedulerReturn {
  const {
    initialView = 'week',
    initialDate = new Date(),
    events = [],
    weekStartsOn = 1,
  } = opts;

  const [view, setView] = useState<SchedulerView>(initialView);
  const [date, setDate] = useState<Date>(initialDate);
  const [dragEvent, setDragEvent] = useState<SchedulerEvent | null>(null);

  /* Navigation helpers */
  const goToday = useCallback(() => setDate(new Date()), []);

  const goNext = useCallback(() => {
    setDate((prev) => {
      switch (view) {
        case 'day':
          return addDays(prev, 1);
        case 'week':
          return addDays(prev, 7);
        case 'month':
          return addMonths(prev, 1);
      }
    });
  }, [view]);

  const goPrev = useCallback(() => {
    setDate((prev) => {
      switch (view) {
        case 'day':
          return addDays(prev, -1);
        case 'week':
          return addDays(prev, -7);
        case 'month':
          return addMonths(prev, -1);
      }
    });
  }, [view]);

  /* Visible range + filtered events */
  const visibleRange = useMemo(() => getVisibleRange(view, date, weekStartsOn), [view, date, weekStartsOn]);

  const visibleEvents = useMemo(() => {
    const { start, end } = visibleRange;
    return events.filter((e) => e.start < end && e.end > start);
  }, [events, visibleRange]);

  /* Drag helpers */
  const startDrag = useCallback((event: SchedulerEvent) => setDragEvent(event), []);
  const endDrag = useCallback(() => setDragEvent(null), []);

  return {
    view,
    date,
    setView,
    setDate,
    goToday,
    goNext,
    goPrev,
    visibleEvents,
    visibleRange,
    dragEvent,
    startDrag,
    endDrag,
  };
}
