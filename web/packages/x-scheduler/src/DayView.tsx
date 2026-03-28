import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerEvent, TimeSlot } from './types';
import { SchedulerEventCard } from './SchedulerEvent';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { useEventDrag } from './useEventDrag';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hourLabel(hour: number, locale: string): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
}

function minutesSinceMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface DayViewProps {
  date: Date;
  events: SchedulerEvent[];
  hourStart?: number;
  hourEnd?: number;
  locale?: string;
  onEventClick?: (event: SchedulerEvent) => void;
  onEventDrop?: (event: SchedulerEvent, newStart: Date, newEnd: Date) => void;
  /** Wave 2.2: drag-to-move callback */
  onEventMove?: (eventId: string, newStart: Date, newEnd: Date) => void;
  /** Wave 2.2: drag-to-resize callback */
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
  onSlotClick?: (slot: TimeSlot) => void;
  onDragStart?: (event: SchedulerEvent) => void;
  /** IANA timezone (informational, passed from Scheduler) */
  timezone?: string;
  /** Show current-time indicator (default true) */
  currentTimeIndicator?: boolean;
  className?: string;
}

const HOUR_HEIGHT = 60; // px per hour

export const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  hourStart = 8,
  hourEnd = 20,
  locale = 'en',
  onEventClick,
  onEventDrop,
  onEventMove,
  onEventResize,
  onSlotClick,
  onDragStart,
  timezone: _timezone,
  currentTimeIndicator = true,
  className,
}) => {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = hourStart; h < hourEnd; h++) arr.push(h);
    return arr;
  }, [hourStart, hourEnd]);

  const totalMinutes = (hourEnd - hourStart) * 60;

  /* Wave 2.2: drag-to-move and resize via useEventDrag */
  const { state: dragState, getEventDragProps, getSlotDropProps, getResizeHandleProps } = useEventDrag({
    events,
    onEventMove,
    onEventResize,
    snapMinutes: 15,
  });

  /* Current-time indicator */
  const nowRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const showNow = isSameDay(now, date);
  const nowOffset = showNow
    ? ((minutesSinceMidnight(now) - hourStart * 60) / totalMinutes) * 100
    : -1;

  /* Day events (non-all-day) */
  const dayEvents = useMemo(
    () => events.filter((e) => !e.allDay),
    [events],
  );

  const allDayEvents = useMemo(
    () => events.filter((e) => e.allDay),
    [events],
  );

  /* Slot click handler */
  const handleSlotClick = useCallback(
    (hour: number) => {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(date);
      end.setHours(hour + 1, 0, 0, 0);
      onSlotClick?.({ start, end });
    },
    [date, onSlotClick],
  );

  /* Drop handler */
  const handleDrop = useCallback(
    (e: React.DragEvent, hour: number) => {
      e.preventDefault();
      const eventId = e.dataTransfer.getData('text/plain');
      const droppedEvent = events.find((ev) => ev.id === eventId);
      if (!droppedEvent || !onEventDrop) return;

      const durationMs = droppedEvent.end.getTime() - droppedEvent.start.getTime();
      const newStart = new Date(date);
      newStart.setHours(hour, 0, 0, 0);
      const newEnd = new Date(newStart.getTime() + durationMs);
      onEventDrop(droppedEvent, newStart, newEnd);
    },
    [date, events, onEventDrop],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  /* Position an event */
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
        left: '4px',
        right: '4px',
      };
    },
    [hourStart, totalMinutes],
  );

  /* Slot date builder for drag hook */
  const slotDate = useCallback(
    (hour: number): Date => {
      const d = new Date(date);
      d.setHours(hour, 0, 0, 0);
      return d;
    },
    [date],
  );

  return (
    <div className={cn('x-scheduler-day', 'x-scheduler-day--responsive', className)}>
      {/* All-day section */}
      {allDayEvents.length > 0 && (
        <div className="x-scheduler-day__allday">
          <div className="x-scheduler-day__allday-label">All day</div>
          <div className="x-scheduler-day__allday-events">
            {allDayEvents.map((evt) => (
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
        </div>
      )}

      {/* Time grid */}
      <div className="x-scheduler-day__grid">
        {/* Hour labels */}
        <div className="x-scheduler-day__gutter">
          {hours.map((h) => (
            <div key={h} className="x-scheduler-day__hour-label" style={{ height: HOUR_HEIGHT }}>
              {hourLabel(h, locale)}
            </div>
          ))}
        </div>

        {/* Slot area */}
        <div className="x-scheduler-day__content" style={{ position: 'relative' }}>
          {/* Hour slots */}
          {hours.map((h) => {
            const slotDropProps = getSlotDropProps(slotDate(h));
            return (
              <div
                key={h}
                className={cn(
                  'x-scheduler-day__slot',
                  dragState.isDragging && 'x-scheduler-day__slot--drop-target',
                )}
                style={{ height: HOUR_HEIGHT }}
                role="button"
                tabIndex={0}
                aria-label={`${hourLabel(h, locale)} time slot`}
                onClick={() => handleSlotClick(h)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSlotClick(h);
                  }
                }}
                onDrop={(e) => {
                  handleDrop(e, h);
                  slotDropProps.onDrop?.(e as React.DragEvent<HTMLElement>);
                }}
                onDragOver={(e) => {
                  handleDragOver(e);
                  slotDropProps.onDragOver?.(e as React.DragEvent<HTMLElement>);
                }}
              />
            );
          })}

          {/* Events overlay */}
          {dayEvents.map((evt) => {
            const dragProps = getEventDragProps(evt.id);
            return (
              <div
                key={evt.id}
                style={{ ...eventStyle(evt), position: 'absolute' }}
                className="x-scheduler-day__event-wrapper"
                {...dragProps}
              >
                {/* Top resize handle */}
                {evt.editable !== false && onEventResize && (
                  <div {...getResizeHandleProps(evt.id, 'top')} className="x-scheduler-day__resize-handle x-scheduler-day__resize-handle--top" />
                )}

                <SchedulerEventCard
                  event={evt}
                  locale={locale}
                  onClick={onEventClick}
                  onDragStart={onDragStart}
                  style={{ position: 'static', height: '100%' }}
                />

                {/* Bottom resize handle */}
                {evt.editable !== false && onEventResize && (
                  <div {...getResizeHandleProps(evt.id, 'bottom')} className="x-scheduler-day__resize-handle x-scheduler-day__resize-handle--bottom" />
                )}
              </div>
            );
          })}

          {/* Drag preview ghost */}
          {dragState.dragPreview && dragState.isDragging && (
            <div
              className="x-scheduler-day__drag-preview"
              style={eventStyle({
                id: '__preview',
                title: '',
                start: dragState.dragPreview.start,
                end: dragState.dragPreview.end,
              })}
              aria-hidden="true"
            />
          )}

          {/* Current-time indicator (Wave 2.2) */}
          {currentTimeIndicator && showNow && (
            <CurrentTimeIndicator
              hourStart={hourStart}
              hourEnd={hourEnd}
              className="x-scheduler-day__now"
            />
          )}

          {/* Legacy now indicator fallback */}
          {!currentTimeIndicator && showNow && nowOffset >= 0 && nowOffset <= 100 && (
            <div
              ref={nowRef}
              className="x-scheduler-day__now"
              style={{ top: `${nowOffset}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
