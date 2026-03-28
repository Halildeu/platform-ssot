import React, { useCallback, useMemo } from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerEvent } from './types';

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

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function formatTimeRange(start: Date, end: Date, locale: string): string {
  const fmt = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function relativeDayLabel(day: Date, locale: string): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(day, today)) return 'Today';
  if (isSameDay(day, tomorrow)) return 'Tomorrow';
  if (isSameDay(day, yesterday)) return 'Yesterday';

  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(day);
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DayGroup {
  date: Date;
  label: string;
  events: SchedulerEvent[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface AgendaViewProps {
  events: SchedulerEvent[];
  startDate: Date;
  endDate: Date;
  locale?: string;
  onEventClick?: (event: SchedulerEvent) => void;
  className?: string;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  startDate,
  endDate,
  locale = 'en',
  onEventClick,
  className,
}) => {
  /* Group events by day */
  const groups = useMemo((): DayGroup[] => {
    // Filter events within the date range
    const filtered = events
      .filter((e) => e.start < endDate && e.end > startDate)
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const map = new Map<string, SchedulerEvent[]>();

    for (const evt of filtered) {
      const key = startOfDay(evt.start).toISOString();
      const list = map.get(key);
      if (list) {
        list.push(evt);
      } else {
        map.set(key, [evt]);
      }
    }

    const result: DayGroup[] = [];
    for (const [key, dayEvents] of map) {
      const date = new Date(key);
      result.push({
        date,
        label: relativeDayLabel(date, locale),
        events: dayEvents,
      });
    }

    return result;
  }, [events, startDate, endDate, locale]);

  /* Click handler */
  const handleEventClick = useCallback(
    (event: SchedulerEvent) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onEventClick?.(event);
    },
    [onEventClick],
  );

  const handleEventKeyDown = useCallback(
    (event: SchedulerEvent) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEventClick?.(event);
      }
    },
    [onEventClick],
  );

  if (groups.length === 0) {
    return (
      <div className={cn('x-scheduler-agenda', 'x-scheduler-agenda--empty', className)}>
        <p className="x-scheduler-agenda__empty-text">No events in this period</p>
      </div>
    );
  }

  return (
    <div className={cn('x-scheduler-agenda', className)}>
      {groups.map((group) => (
        <div key={group.date.toISOString()} className="x-scheduler-agenda__day-group">
          {/* Date header */}
          <div className="x-scheduler-agenda__date-header">
            <span className="x-scheduler-agenda__date-label">{group.label}</span>
            <span className="x-scheduler-agenda__date-sub">
              {new Intl.DateTimeFormat(locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(group.date)}
            </span>
          </div>

          {/* Event list */}
          <ul className="x-scheduler-agenda__event-list" role="list">
            {group.events.map((evt) => {
              const colorStyle: React.CSSProperties = evt.color
                ? ({ '--evt-color': evt.color } as React.CSSProperties)
                : {};

              return (
                <li
                  key={evt.id}
                  role="button"
                  tabIndex={0}
                  className="x-scheduler-agenda__event-item"
                  style={colorStyle}
                  aria-label={`${evt.title}, ${formatTimeRange(evt.start, evt.end, locale)}`}
                  onClick={handleEventClick(evt)}
                  onKeyDown={handleEventKeyDown(evt)}
                >
                  {/* Time column */}
                  <span className="x-scheduler-agenda__event-time">
                    {evt.allDay ? 'All day' : formatTimeRange(evt.start, evt.end, locale)}
                  </span>

                  {/* Color indicator */}
                  <span
                    className="x-scheduler-agenda__event-indicator"
                    aria-hidden="true"
                  />

                  {/* Title + resource badge */}
                  <span className="x-scheduler-agenda__event-title">{evt.title}</span>

                  {evt.resourceId && (
                    <span className="x-scheduler-agenda__event-resource">
                      {evt.resourceId}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
