import React from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerView } from './types';

export interface SchedulerToolbarProps {
  view: SchedulerView;
  date: Date;
  locale?: string;
  onViewChange?: (view: SchedulerView) => void;
  onToday?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

const VIEW_LABELS: Record<SchedulerView, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

function formatTitle(date: Date, view: SchedulerView, locale: string): string {
  const dtf = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, opts).format(date);

  switch (view) {
    case 'day':
      return dtf({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    case 'week': {
      const weekStart = new Date(date);
      const day = weekStart.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      weekStart.setDate(weekStart.getDate() + diff);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const fmtStart = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(weekStart);
      const fmtEnd = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(weekEnd);
      return `${fmtStart} – ${fmtEnd}`;
    }
    case 'month':
      return dtf({ year: 'numeric', month: 'long' });
  }
}

export const SchedulerToolbar: React.FC<SchedulerToolbarProps> = ({
  view,
  date,
  locale = 'en',
  onViewChange,
  onToday,
  onPrev,
  onNext,
  className,
}) => {
  return (
    <div className={cn('x-scheduler-toolbar', className)}>
      {/* Left group: Today + navigation */}
      <div className="x-scheduler-toolbar__nav">
        <button
          type="button"
          className="x-scheduler-toolbar__btn"
          onClick={onToday}
          aria-label="Go to today"
        >
          Today
        </button>

        <button
          type="button"
          className="x-scheduler-toolbar__btn x-scheduler-toolbar__btn--icon"
          onClick={onPrev}
          aria-label="Previous"
        >
          &#x2039;
        </button>

        <button
          type="button"
          className="x-scheduler-toolbar__btn x-scheduler-toolbar__btn--icon"
          onClick={onNext}
          aria-label="Next"
        >
          &#x203A;
        </button>
      </div>

      {/* Centre: date title */}
      <h2 className="x-scheduler-toolbar__title">
        {formatTitle(date, view, locale)}
      </h2>

      {/* Right group: view switcher */}
      <div className="x-scheduler-toolbar__views" role="tablist" aria-label="Calendar view">
        {(['day', 'week', 'month'] as SchedulerView[]).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={v === view}
            className={cn(
              'x-scheduler-toolbar__view-btn',
              v === view && 'x-scheduler-toolbar__view-btn--active',
            )}
            onClick={() => onViewChange?.(v)}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>
    </div>
  );
};
