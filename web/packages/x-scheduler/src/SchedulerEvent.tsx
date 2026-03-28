import React, { useCallback } from 'react';
import { cn } from '@mfe/design-system';
import type { SchedulerEvent as SchedulerEventType } from './types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTimeRange(start: Date, end: Date, locale: string): string {
  const fmt = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface SchedulerEventCardProps {
  event: SchedulerEventType;
  /** Compact = month-view pill style */
  compact?: boolean;
  locale?: string;
  onClick?: (event: SchedulerEventType) => void;
  onDragStart?: (event: SchedulerEventType) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SchedulerEventCard: React.FC<SchedulerEventCardProps> = ({
  event,
  compact = false,
  locale = 'en',
  onClick,
  onDragStart,
  className,
  style,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.(event);
    },
    [event, onClick],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', event.id);
      onDragStart?.(event);
    },
    [event, onDragStart],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(event);
      }
    },
    [event, onClick],
  );

  const colorStyle: React.CSSProperties = event.color
    ? { '--evt-color': event.color } as React.CSSProperties
    : {};

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${event.title}, ${formatTimeRange(event.start, event.end, locale)}`}
      draggable={event.editable !== false}
      className={cn(
        'x-scheduler-event',
        compact && 'x-scheduler-event--compact',
        className,
      )}
      style={{ ...colorStyle, ...style }}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
    >
      {/* drag handle indicator */}
      {!compact && event.editable !== false && (
        <span className="x-scheduler-event__drag-handle" aria-hidden="true">
          &#x2801;&#x2801;
        </span>
      )}

      <span className="x-scheduler-event__title">{event.title}</span>

      {!compact && (
        <span className="x-scheduler-event__time">
          {formatTimeRange(event.start, event.end, locale)}
        </span>
      )}
    </div>
  );
};
