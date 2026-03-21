import React, { useCallback } from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerEvent, SchedulerResource, SchedulerView, TimeSlot } from './types';
import { SchedulerToolbar } from './SchedulerToolbar';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface SchedulerProps {
  events: SchedulerEvent[];
  resources?: SchedulerResource[];
  view: SchedulerView;
  date: Date;
  onViewChange?: (view: SchedulerView) => void;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  onEventDrop?: (event: SchedulerEvent, newStart: Date, newEnd: Date) => void;
  onSlotClick?: (slot: TimeSlot) => void;
  locale?: string;
  className?: string;
  hourStart?: number;
  hourEnd?: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Scheduler: React.FC<SchedulerProps> = ({
  events,
  // resources — reserved for future resource lane support
  view,
  date,
  onViewChange,
  onDateChange,
  onEventClick,
  onEventDrop,
  onSlotClick,
  locale = 'en',
  className,
  hourStart = 8,
  hourEnd = 20,
}) => {
  /* Navigation helpers */
  const goToday = useCallback(() => onDateChange?.(new Date()), [onDateChange]);

  const goPrev = useCallback(() => {
    const d = new Date(date);
    switch (view) {
      case 'day':
        d.setDate(d.getDate() - 1);
        break;
      case 'week':
        d.setDate(d.getDate() - 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() - 1);
        break;
    }
    onDateChange?.(d);
  }, [date, view, onDateChange]);

  const goNext = useCallback(() => {
    const d = new Date(date);
    switch (view) {
      case 'day':
        d.setDate(d.getDate() + 1);
        break;
      case 'week':
        d.setDate(d.getDate() + 7);
        break;
      case 'month':
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
    onSlotClick,
    onDragStart: handleDragStart,
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
        {view === 'day' && <DayView {...viewProps} />}
        {view === 'week' && <WeekView {...viewProps} />}
        {view === 'month' && <MonthView {...viewProps} />}
      </div>
    </div>
  );
};
