import React, { useCallback, useMemo } from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerEvent } from './types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface MiniMonthNavProps {
  /** Currently selected date */
  date: Date;
  /** Callback when user clicks a day in the mini calendar */
  onDateChange: (date: Date) => void;
  /** Optional events for dot indicators */
  events?: SchedulerEvent[];
  /** Week starts on (0 = Sun, 1 = Mon) */
  weekStartsOn?: 0 | 1;
  /** Locale for formatting */
  locale?: string;
  /** CSS class */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const MiniMonthNav: React.FC<MiniMonthNavProps> = ({
  date,
  onDateChange,
  events = [],
  weekStartsOn = 1,
  locale = 'en',
  className,
}) => {
  const today = useMemo(() => new Date(), []);

  /** Month year label */
  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  }, [date, locale]);

  /** Day-of-week header labels */
  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, weekStartsOn === 0 ? 7 : 1); // a known Monday (or Sunday)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(d);
    });
  }, [locale, weekStartsOn]);

  /** Build the 6-row grid of Date objects */
  const calendarDays = useMemo(() => {
    const first = startOfMonth(date);
    const _last = endOfMonth(date);

    // Find the grid start
    let startDay = first.getDay() - weekStartsOn;
    if (startDay < 0) startDay += 7;

    const gridStart = new Date(first);
    gridStart.setDate(gridStart.getDate() - startDay);

    const days: Date[] = [];
    const totalCells = 42; // 6 rows of 7
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(gridStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    // Trim trailing row if entirely outside the month
    const lastShown = days[days.length - 1];
    if (lastShown.getMonth() !== date.getMonth() && days[35]?.getMonth() !== date.getMonth()) {
      days.splice(35, 7);
    }

    return days;
  }, [date, weekStartsOn]);

  /** Set of date-strings that have events */
  const daysWithEvents = useMemo(() => {
    const set = new Set<string>();
    for (const evt of events) {
      const key = `${evt.start.getFullYear()}-${evt.start.getMonth()}-${evt.start.getDate()}`;
      set.add(key);
    }
    return set;
  }, [events]);

  const hasEvent = useCallback(
    (d: Date): boolean => {
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      return daysWithEvents.has(key);
    },
    [daysWithEvents],
  );

  /** Navigate month */
  const goPrev = useCallback(() => onDateChange(addMonths(date, -1)), [date, onDateChange]);
  const goNext = useCallback(() => onDateChange(addMonths(date, 1)), [date, onDateChange]);

  return (
    <div className={cn('x-scheduler-mini-month', className)}>
      {/* Header */}
      <div className="x-scheduler-mini-month__header">
        <button
          type="button"
          className="x-scheduler-mini-month__nav-btn"
          onClick={goPrev}
          aria-label="Previous month"
        >
          &#x2039;
        </button>
        <span className="x-scheduler-mini-month__title">{monthLabel}</span>
        <button
          type="button"
          className="x-scheduler-mini-month__nav-btn"
          onClick={goNext}
          aria-label="Next month"
        >
          &#x203A;
        </button>
      </div>

      {/* Weekday labels */}
      <div className="x-scheduler-mini-month__weekdays">
        {weekdayLabels.map((label, i) => (
          <span key={i} className="x-scheduler-mini-month__weekday">
            {label}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="x-scheduler-mini-month__grid">
        {calendarDays.map((d, i) => {
          const isCurrentMonth = isSameMonth(d, date);
          const isSelected = isSameDay(d, date);
          const isToday = isSameDay(d, today);
          const hasEvt = hasEvent(d);

          return (
            <button
              key={i}
              type="button"
              className={cn(
                'x-scheduler-mini-month__day',
                !isCurrentMonth && 'x-scheduler-mini-month__day--outside',
                isSelected && 'x-scheduler-mini-month__day--selected',
                isToday && 'x-scheduler-mini-month__day--today',
              )}
              onClick={() => onDateChange(d)}
              aria-label={d.toLocaleDateString(locale)}
              aria-current={isToday ? 'date' : undefined}
            >
              {d.getDate()}
              {hasEvt && (
                <span className="x-scheduler-mini-month__dot" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
