import React, { useCallback, useMemo } from 'react';
import { cn } from '@mfe/design-system';
import type { Resource, SchedulerEvent } from './types';
import { SchedulerEventCard } from './SchedulerEvent';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function minutesSinceMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function hourLabel(hour: number, locale: string): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MAX_VISIBLE_PER_SLOT = 3;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface ResourceViewProps {
  events: SchedulerEvent[];
  resources: Resource[];
  date: Date;
  hourStart?: number;
  hourEnd?: number;
  locale?: string;
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (resource: Resource, date: Date) => void;
  className?: string;
}

const HOUR_HEIGHT = 60;

export const ResourceView: React.FC<ResourceViewProps> = ({
  events,
  resources,
  date,
  hourStart = 8,
  hourEnd = 20,
  locale = 'en',
  onEventClick,
  onSlotClick,
  className,
}) => {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = hourStart; h < hourEnd; h++) arr.push(h);
    return arr;
  }, [hourStart, hourEnd]);

  const totalMinutes = (hourEnd - hourStart) * 60;

  /* Events grouped by resourceId */
  const eventsByResource = useMemo(() => {
    const map = new Map<string, SchedulerEvent[]>();
    for (const res of resources) {
      map.set(res.id, []);
    }
    for (const evt of events) {
      if (!evt.resourceId) continue;
      if (!isSameDay(evt.start, date) && !evt.allDay) continue;
      const list = map.get(evt.resourceId);
      if (list) {
        list.push(evt);
      }
    }
    return map;
  }, [events, resources, date]);

  /* Position an event vertically */
  const eventStyle = useCallback(
    (event: SchedulerEvent): React.CSSProperties => {
      if (event.allDay) return {};
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

  /* Slot click handler */
  const handleSlotClick = useCallback(
    (resource: Resource, hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      onSlotClick?.(resource, start);
    },
    [date, onSlotClick],
  );

  return (
    <div className={cn('x-scheduler-resource', className)}>
      {/* Resource header row */}
      <div className="x-scheduler-resource__header">
        {/* Gutter spacer */}
        <div className="x-scheduler-resource__header-gutter" />

        {resources.map((res) => {
          const resEvents = eventsByResource.get(res.id) ?? [];
          const usedCapacity = resEvents.length;
          const capacityRatio = res.capacity ? usedCapacity / res.capacity : undefined;

          return (
            <div
              key={res.id}
              className="x-scheduler-resource__header-cell"
              style={res.color ? ({ '--res-color': res.color } as React.CSSProperties) : undefined}
            >
              {res.avatar && (
                <img
                  src={res.avatar}
                  alt=""
                  className="x-scheduler-resource__avatar"
                  aria-hidden="true"
                />
              )}
              <span className="x-scheduler-resource__name">{res.name}</span>
              {res.capacity != null && (
                <span
                  className={cn(
                    'x-scheduler-resource__capacity',
                    capacityRatio != null && capacityRatio >= 1 && 'x-scheduler-resource__capacity--full',
                  )}
                  aria-label={`${usedCapacity} of ${res.capacity} slots used`}
                >
                  {usedCapacity}/{res.capacity}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Time grid body */}
      <div className="x-scheduler-resource__body">
        {/* Hour gutter */}
        <div className="x-scheduler-resource__gutter">
          {hours.map((h) => (
            <div key={h} className="x-scheduler-resource__hour-label" style={{ height: HOUR_HEIGHT }}>
              {hourLabel(h, locale)}
            </div>
          ))}
        </div>

        {/* Resource columns */}
        {resources.map((res) => {
          const resEvents = (eventsByResource.get(res.id) ?? []).filter((e) => !e.allDay);
          const overflowCount = Math.max(resEvents.length - MAX_VISIBLE_PER_SLOT, 0);

          return (
            <div key={res.id} className="x-scheduler-resource__column" style={{ position: 'relative' }}>
              {/* Hour slots */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="x-scheduler-resource__slot"
                  style={{ height: HOUR_HEIGHT }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${res.name} ${hourLabel(h, locale)}`}
                  onClick={() => handleSlotClick(res, h)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick(res, h);
                    }
                  }}
                />
              ))}

              {/* Events */}
              {resEvents.map((evt) => (
                <SchedulerEventCard
                  key={evt.id}
                  event={evt}
                  locale={locale}
                  onClick={onEventClick}
                  style={eventStyle(evt)}
                />
              ))}

              {/* Overflow indicator */}
              {overflowCount > 0 && (
                <span className="x-scheduler-resource__overflow" aria-label={`${overflowCount} more events`}>
                  +{overflowCount} more
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
