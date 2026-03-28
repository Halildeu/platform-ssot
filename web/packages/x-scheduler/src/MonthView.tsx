import React, { useCallback, useMemo } from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerEvent, TimeSlot } from './types';
import { SchedulerEventCard } from './SchedulerEvent';

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

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfWeekDate(d: Date, weekStartsOn: 0 | 1 = 1): Date {
  const r = new Date(d);
  const day = r.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  r.setDate(r.getDate() - diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

const MAX_VISIBLE_EVENTS = 3;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface MonthViewProps {
  date: Date;
  events: SchedulerEvent[];
  locale?: string;
  weekStartsOn?: 0 | 1;
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (slot: TimeSlot) => void;
  onDragStart?: (event: SchedulerEvent) => void;
  className?: string;
}

export const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  locale = 'en',
  weekStartsOn = 1,
  onEventClick,
  onSlotClick,
  onDragStart,
  className,
}) => {
  /* Day header labels */
  const dayHeaders = useMemo(() => {
    const base = new Date(2024, 0, weekStartsOn === 1 ? 1 : 7); // a known Monday / Sunday
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, i) => fmt.format(addDays(base, i)));
  }, [locale, weekStartsOn]);

  /* Build 6-row grid of dates */
  const weeks = useMemo(() => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const gridStart = startOfWeekDate(monthStart, weekStartsOn);
    const rows: Date[][] = [];
    let cursor = gridStart;
    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let d = 0; d < 7; d++) {
        row.push(new Date(cursor));
        cursor = addDays(cursor, 1);
      }
      rows.push(row);
    }
    // Drop trailing week if entirely outside current month
    const lastRow = rows[rows.length - 1];
    if (!lastRow.some((d) => isSameMonth(d, date))) {
      rows.pop();
    }
    return rows;
  }, [date, weekStartsOn]);

  /* Events for a single day */
  const eventsForDay = useCallback(
    (day: Date): SchedulerEvent[] => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      return events.filter((e) => e.start <= dayEnd && e.end >= dayStart);
    },
    [events],
  );

  /* Slot click */
  const handleSlotClick = useCallback(
    (day: Date) => {
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);
      onSlotClick?.({ start, end });
    },
    [onSlotClick],
  );

  const today = new Date();
  const dayNumFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric' }),
    [locale],
  );

  return (
    <div className={cn('x-scheduler-month', className)}>
      {/* Day headers */}
      <div className="x-scheduler-month__header">
        {dayHeaders.map((label) => (
          <div key={label} className="x-scheduler-month__header-cell">
            {label}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="x-scheduler-month__body">
        {weeks.map((week, wi) => (
          <div key={wi} className="x-scheduler-month__row">
            {week.map((day) => {
              const dayEvts = eventsForDay(day);
              const overflow = dayEvts.length - MAX_VISIBLE_EVENTS;
              const isCurrentMonth = isSameMonth(day, date);
              const isDayToday = isSameDay(day, today);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'x-scheduler-month__cell',
                    !isCurrentMonth && 'x-scheduler-month__cell--outside',
                    isDayToday && 'x-scheduler-month__cell--today',
                  )}
                  role="button"
                  tabIndex={0}
                  aria-label={day.toLocaleDateString(locale, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                  onClick={() => handleSlotClick(day)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick(day);
                    }
                  }}
                >
                  <span
                    className={cn(
                      'x-scheduler-month__day-num',
                      isDayToday && 'x-scheduler-month__day-num--today',
                    )}
                  >
                    {dayNumFmt.format(day)}
                  </span>

                  <div className="x-scheduler-month__events">
                    {dayEvts.slice(0, MAX_VISIBLE_EVENTS).map((evt) => (
                      <SchedulerEventCard
                        key={evt.id}
                        event={evt}
                        compact
                        locale={locale}
                        onClick={onEventClick}
                        onDragStart={onDragStart}
                      />
                    ))}
                    {overflow > 0 && (
                      <span className="x-scheduler-month__overflow">
                        +{overflow} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
