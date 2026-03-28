import React, { useCallback } from 'react';
import { cn } from '@mfe/design-system';
import type { Resource, SchedulerEvent, SchedulerResource, SchedulerView, TimeSlot } from './types';
import { SchedulerToolbar } from './SchedulerToolbar';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { AgendaView } from './AgendaView';
import { ResourceView } from './ResourceView';
import { MiniMonthNav } from './MiniMonthNav';
import { getVisibleRange } from './useScheduler';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface SchedulerProps {
  events: SchedulerEvent[];
  resources?: SchedulerResource[];
  /** Extended resources for the resource view (with name, avatar, capacity) */
  resourceList?: Resource[];
  view: SchedulerView;
  date: Date;
  onViewChange?: (view: SchedulerView) => void;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  onEventDrop?: (event: SchedulerEvent, newStart: Date, newEnd: Date) => void;
  /** Drag-to-move callback (Wave 2.2) */
  onEventMove?: (eventId: string, newStart: Date, newEnd: Date) => void;
  /** Drag-to-resize callback (Wave 2.2) */
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
  onSlotClick?: (slot: TimeSlot) => void;
  locale?: string;
  className?: string;
  hourStart?: number;
  hourEnd?: number;
  /** IANA timezone string (e.g. "America/New_York"). Defaults to browser tz. */
  timezone?: string;
  /** Show the red current-time indicator line (default true) */
  currentTimeIndicator?: boolean;
  /** Show the mini month navigation sidebar (default false) */
  miniMonthNav?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Scheduler: React.FC<SchedulerProps> = ({
  events,
  // resources — reserved for legacy resource support
  resourceList = [],
  view,
  date,
  onViewChange,
  onDateChange,
  onEventClick,
  onEventDrop,
  onEventMove,
  onEventResize,
  onSlotClick,
  locale = 'en',
  className,
  hourStart = 8,
  hourEnd = 20,
  timezone,
  currentTimeIndicator = true,
  miniMonthNav = false,
}) => {
  /* Navigation helpers */
  const goToday = useCallback(() => onDateChange?.(new Date()), [onDateChange]);

  const goPrev = useCallback(() => {
    const d = new Date(date);
    switch (view) {
      case 'day':
      case 'resource':
        d.setDate(d.getDate() - 1);
        break;
      case 'week':
        d.setDate(d.getDate() - 7);
        break;
      case 'month':
      case 'agenda':
        d.setMonth(d.getMonth() - 1);
        break;
    }
    onDateChange?.(d);
  }, [date, view, onDateChange]);

  const goNext = useCallback(() => {
    const d = new Date(date);
    switch (view) {
      case 'day':
      case 'resource':
        d.setDate(d.getDate() + 1);
        break;
      case 'week':
        d.setDate(d.getDate() + 7);
        break;
      case 'month':
      case 'agenda':
        d.setMonth(d.getMonth() + 1);
        break;
    }
    onDateChange?.(d);
  }, [date, view, onDateChange]);

  /* Drag-start relay (for external coordination) */
  const handleDragStart = useCallback(() => {
    // placeholder for cross-view drag state if needed
  }, []);

  /* Shared view props */
  const viewProps = {
    date,
    events,
    hourStart,
    hourEnd,
    locale,
    onEventClick,
    onEventDrop,
    onEventMove,
    onEventResize,
    onSlotClick,
    onDragStart: handleDragStart,
    timezone,
    currentTimeIndicator,
  };

  return (
    <div className={cn('x-scheduler', className)}>
      <SchedulerToolbar
        view={view}
        date={date}
        locale={locale}
        onViewChange={onViewChange}
        onToday={goToday}
        onPrev={goPrev}
        onNext={goNext}
      />

      <div className="x-scheduler__body">
        {miniMonthNav && onDateChange && (
          <div className="x-scheduler__sidebar">
            <MiniMonthNav date={date} onDateChange={onDateChange} events={events} />
          </div>
        )}
        <div className="x-scheduler__main">
        {view === 'day' && <DayView {...viewProps} />}
        {view === 'week' && <WeekView {...viewProps} />}
        {view === 'month' && <MonthView {...viewProps} />}
        {view === 'agenda' && (() => {
          const range = getVisibleRange('month', date);
          return (
            <AgendaView
              events={events}
              startDate={range.start}
              endDate={range.end}
              locale={locale}
              onEventClick={onEventClick}
            />
          );
        })()}
        {view === 'resource' && (
          <ResourceView
            events={events}
            resources={resourceList}
            date={date}
            hourStart={hourStart}
            hourEnd={hourEnd}
            locale={locale}
            onEventClick={onEventClick}
            onSlotClick={
              onSlotClick
                ? (resource, slotDate) =>
                    onSlotClick({ start: slotDate, end: new Date(slotDate.getTime() + 3600_000), resourceId: resource.id })
                : undefined
            }
          />
        )}
        </div>
      </div>
    </div>
  );
};
