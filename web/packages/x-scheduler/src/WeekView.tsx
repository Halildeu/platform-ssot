import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

function minutesSinceMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface WeekViewProps {
  date: Date;
  events: SchedulerEvent[];
  hourStart?: number;
  hourEnd?: number;
  locale?: string;
  weekStartsOn?: 0 | 1;
  onEventClick?: (event: SchedulerEvent) => void;
  onEventDrop?: (event: SchedulerEvent, newStart: Date, newEnd: Date) => void;
  onSlotClick?: (slot: TimeSlot) => void;
  onDragStart?: (event: SchedulerEvent) => void;
  className?: string;
}

const HOUR_HEIGHT = 60;

export const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  hourStart = 8,
  hourEnd = 20,
  locale = 'en',
  weekStartsOn = 1,
  onEventClick,
  onEventDrop,
  onSlotClick,
  onDragStart,
  className,
}) => {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = hourStart; h < hourEnd; h++) arr.push(h);
    return arr;
  }, [hourStart, hourEnd]);

  const totalMinutes = (hourEnd - hourStart) * 60;

  /* Week days */
  const weekDays = useMemo(() => {
    const start = startOfWeekDate(date, weekStartsOn);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [date, weekStartsOn]);

  /* Current time */
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* Formatters */
  const dayNameFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale],
  );
  const dayNumFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric' }),
    [locale],
  );
  const hourFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
    [locale],
  );

  /* Categorise events */
  const allDayEvents = useMemo(() => events.filter((e) => e.allDay), [events]);
  const timedEvents = useMemo(() => events.filter((e) => !e.allDay), [events]);

  /* Events for a specific day */
  const eventsForDay = useCallback(
    (day: Date) => timedEvents.filter((e) => isSameDay(e.start, day)),
    [timedEvents],
  );

  const allDayForDay = useCallback(
    (day: Date) =>
      allDayEvents.filter((e) => {
        const ds = new Date(day);
        ds.setHours(0, 0, 0, 0);
        const de = new Date(day);
        de.setHours(23, 59, 59, 999);
        return e.start <= de && e.end >= ds;
      }),
    [allDayEvents],
  );

  /* Slot click */
  const handleSlotClick = useCallback(
    (day: Date, hour: number) => {
      const start = new Date(day);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(day);
      end.setHours(hour + 1, 0, 0, 0);
      onSlotClick?.({ start, end });
    },
    [onSlotClick],
  );

  /* Drop */
  const handleDrop = useCallback(
    (e: React.DragEvent, day: Date, hour: number) => {
      e.preventDefault();
      const eventId = e.dataTransfer.getData('text/plain');
      const droppedEvent = events.find((ev) => ev.id === eventId);
      if (!droppedEvent || !onEventDrop) return;

      const durationMs = droppedEvent.end.getTime() - droppedEvent.start.getTime();
      const newStart = new Date(day);
      newStart.setHours(hour, 0, 0, 0);
      const newEnd = new Date(newStart.getTime() + durationMs);
      onEventDrop(droppedEvent, newStart, newEnd);
    },
    [events, onEventDrop],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  /* Position an event in its column */
  const eventStyle = useCallback(
    (event: SchedulerEvent): React.CSSProperties => {
      const startMin = Math.max(minutesSinceMidnight(event.start) - hourStart * 60, 0);
      const endMin = Math.min(minutesSinceMidnight(event.end) - hourStart * 60, totalMinutes);
      const top = (startMin / totalMinutes) * 100;
      const height = ((endMin - startMin) / totalMinutes) * 100;
      return {
        position: 'absolute',
        top: `${top}%`,
        height: `${Math.max(height, 1.5)}%`,
        left: '2px',
        right: '2px',
      };
    },
    [hourStart, totalMinutes],
  );

  const isToday = (d: Date) => isSameDay(d, now);
  const nowMinuteOffset = minutesSinceMidnight(now);
  const nowInRange = nowMinuteOffset >= hourStart * 60 && nowMinuteOffset < hourEnd * 60;
  const nowTop = ((nowMinuteOffset - hourStart * 60) / totalMinutes) * 100;

  return (
    <div className={cn('x-scheduler-week', className)}>
      {/* All-day row */}
      {allDayEvents.length > 0 && (
        <div className="x-scheduler-week__allday-row">
          <div className="x-scheduler-week__allday-gutter">All day</div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="x-scheduler-week__allday-cell">
              {allDayForDay(day).map((evt) => (
                <SchedulerEventCard
                  key={evt.id}
                  event={evt}
                  compact
                  locale={locale}
                  onClick={onEventClick}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Header row */}
      <div className="x-scheduler-week__header">
        <div className="x-scheduler-week__header-gutter" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              'x-scheduler-week__header-cell',
              isToday(day) && 'x-scheduler-week__header-cell--today',
            )}
          >
            <span className="x-scheduler-week__day-name">{dayNameFmt.format(day)}</span>
            <span className="x-scheduler-week__day-num">{dayNumFmt.format(day)}</span>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="x-scheduler-week__body">
        {/* Hour gutter */}
        <div className="x-scheduler-week__gutter">
          {hours.map((h) => (
            <div key={h} className="x-scheduler-week__hour-label" style={{ height: HOUR_HEIGHT }}>
              {hourFmt.format(new Date(2000, 0, 1, h))}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const dayEvts = eventsForDay(day);
          const showNow = isToday(day) && nowInRange;
          return (
            <div key={day.toISOString()} className="x-scheduler-week__column" style={{ position: 'relative' }}>
              {/* Hour slots */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="x-scheduler-week__slot"
                  style={{ height: HOUR_HEIGHT }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${dayNameFmt.format(day)} ${hourFmt.format(new Date(2000, 0, 1, h))}`}
                  onClick={() => handleSlotClick(day, h)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick(day, h);
                    }
                  }}
                  onDrop={(e) => handleDrop(e, day, h)}
                  onDragOver={handleDragOver}
                />
              ))}

              {/* Events */}
              {dayEvts.map((evt) => (
                <SchedulerEventCard
                  key={evt.id}
                  event={evt}
                  locale={locale}
                  onClick={onEventClick}
                  onDragStart={onDragStart}
                  style={eventStyle(evt)}
                />
              ))}

              {/* Now line */}
              {showNow && (
                <div
                  className="x-scheduler-week__now"
                  style={{ top: `${nowTop}%` }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
