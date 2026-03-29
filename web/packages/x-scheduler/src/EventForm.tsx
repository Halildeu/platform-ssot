import React, { useCallback, useMemo, useState } from 'react';
import { cn } from '@mfe/design-system';
import type { RecurrenceRule, Resource, SchedulerEvent } from './types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toDateTimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocal(s: string): Date {
  return new Date(s);
}

/** Design-token-aligned color palette */
const COLOR_PALETTE = [
  'var(--action-primary)', // blue
  'var(--state-success-text)', // emerald
  'var(--state-warning-text)', // amber
  'var(--state-danger-text)', // red
  'var(--action-primary)', // violet
  'var(--state-danger-text)', // pink
  'var(--state-info-text)', // cyan
  'var(--state-success-text)', // lime
] as const;

const RECURRENCE_OPTIONS: { value: RecurrenceRule['frequency'] | 'none'; label: string }[] = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface EventFormProps {
  event?: Partial<SchedulerEvent>;
  resources?: Resource[];
  onSave: (event: SchedulerEvent) => void;
  onCancel: () => void;
  onDelete?: (eventId: string) => void;
  className?: string;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  resources,
  onSave,
  onCancel,
  onDelete,
  className,
}) => {
  const isEditing = Boolean(event?.id);

  /* Form state */
  const [title, setTitle] = useState(event?.title ?? '');
  const [startStr, setStartStr] = useState(
    toDateTimeLocal(event?.start ?? new Date()),
  );
  const [endStr, setEndStr] = useState(
    toDateTimeLocal(event?.end ?? new Date(Date.now() + 3600_000)),
  );
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [resourceId, setResourceId] = useState(event?.resourceId ?? '');
  const [color, setColor] = useState(event?.color ?? COLOR_PALETTE[0]);
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceRule['frequency'] | 'none'>(
    event?.recurrence?.frequency ?? 'none',
  );

  /* Derived */
  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    const s = fromDateTimeLocal(startStr);
    const e = fromDateTimeLocal(endStr);
    return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s;
  }, [title, startStr, endStr]);

  /* Handlers */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      const start = fromDateTimeLocal(startStr);
      const end = fromDateTimeLocal(endStr);

      const recurrence: RecurrenceRule | undefined =
        recurrenceFreq !== 'none' ? { frequency: recurrenceFreq } : undefined;

      onSave({
        id: event?.id ?? crypto.randomUUID(),
        title: title.trim(),
        start,
        end,
        allDay,
        color,
        resourceId: resourceId || undefined,
        recurrence,
        editable: event?.editable ?? true,
        metadata: event?.metadata,
      });
    },
    [canSubmit, title, startStr, endStr, allDay, color, resourceId, recurrenceFreq, event, onSave],
  );

  const handleDelete = useCallback(() => {
    if (event?.id && onDelete) {
      onDelete(event.id);
    }
  }, [event?.id, onDelete]);

  return (
    <form
      className={cn('x-scheduler-event-form', className)}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Title */}
      <div className="x-scheduler-event-form__field">
        <label className="x-scheduler-event-form__label" htmlFor="evt-title">
          Title
        </label>
        <input
          id="evt-title"
          type="text"
          className="x-scheduler-event-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          autoFocus
          required
        />
      </div>

      {/* All-day toggle */}
      <div className="x-scheduler-event-form__field x-scheduler-event-form__field--row">
        <input
          id="evt-allday"
          type="checkbox"
          className="x-scheduler-event-form__checkbox"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
        />
        <label className="x-scheduler-event-form__label" htmlFor="evt-allday">
          All day
        </label>
      </div>

      {/* Start */}
      <div className="x-scheduler-event-form__field">
        <label className="x-scheduler-event-form__label" htmlFor="evt-start">
          Start
        </label>
        <input
          id="evt-start"
          type={allDay ? 'date' : 'datetime-local'}
          className="x-scheduler-event-form__input"
          value={allDay ? startStr.split('T')[0] : startStr}
          onChange={(e) => setStartStr(allDay ? `${e.target.value}T00:00` : e.target.value)}
          required
        />
      </div>

      {/* End */}
      <div className="x-scheduler-event-form__field">
        <label className="x-scheduler-event-form__label" htmlFor="evt-end">
          End
        </label>
        <input
          id="evt-end"
          type={allDay ? 'date' : 'datetime-local'}
          className="x-scheduler-event-form__input"
          value={allDay ? endStr.split('T')[0] : endStr}
          onChange={(e) => setEndStr(allDay ? `${e.target.value}T23:59` : e.target.value)}
          required
        />
      </div>

      {/* Resource selector */}
      {resources && resources.length > 0 && (
        <div className="x-scheduler-event-form__field">
          <label className="x-scheduler-event-form__label" htmlFor="evt-resource">
            Resource
          </label>
          <select
            id="evt-resource"
            className="x-scheduler-event-form__select"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
          >
            <option value="">No resource</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Recurrence */}
      <div className="x-scheduler-event-form__field">
        <label className="x-scheduler-event-form__label" htmlFor="evt-recurrence">
          Repeat
        </label>
        <select
          id="evt-recurrence"
          className="x-scheduler-event-form__select"
          value={recurrenceFreq}
          onChange={(e) =>
            setRecurrenceFreq(e.target.value as RecurrenceRule['frequency'] | 'none')
          }
        >
          {RECURRENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color picker */}
      <div className="x-scheduler-event-form__field">
        <span className="x-scheduler-event-form__label">Color</span>
        <div className="x-scheduler-event-form__colors" role="radiogroup" aria-label="Event color">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              aria-label={c}
              className={cn(
                'x-scheduler-event-form__color-swatch',
                color === c && 'x-scheduler-event-form__color-swatch--selected',
              )}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="x-scheduler-event-form__actions">
        {isEditing && onDelete && (
          <button
            type="button"
            className="x-scheduler-event-form__btn x-scheduler-event-form__btn--danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
        <div className="x-scheduler-event-form__actions-right">
          <button
            type="button"
            className="x-scheduler-event-form__btn x-scheduler-event-form__btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="x-scheduler-event-form__btn x-scheduler-event-form__btn--primary"
            disabled={!canSubmit}
          >
            {isEditing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
};
