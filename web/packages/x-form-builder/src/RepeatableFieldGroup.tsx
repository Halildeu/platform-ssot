import React, { useCallback } from 'react';
import type { FieldSchema } from './types';
import { FieldRenderer } from './FieldRenderer';

/* ------------------------------------------------------------------ */
/*  RepeatableFieldGroup — Dynamic add/remove rows of field groups     */
/* ------------------------------------------------------------------ */

export interface RepeatableFieldGroupProps {
  fields: FieldSchema[];
  values: Array<Record<string, unknown>>;
  onChange: (values: Array<Record<string, unknown>>) => void;
  minRows?: number;
  maxRows?: number;
  addLabel?: string;
  removeLabel?: string;
  className?: string;
}

/** Create an empty row with default values from the field schemas. */
function createEmptyRow(fields: FieldSchema[]): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of fields) {
    row[field.name] = field.defaultValue ?? '';
  }
  return row;
}

export const RepeatableFieldGroup: React.FC<RepeatableFieldGroupProps> = ({
  fields,
  values,
  onChange,
  minRows = 0,
  maxRows = Infinity,
  addLabel = 'Add row',
  removeLabel = 'Remove',
  className,
}) => {
  const canAdd = values.length < maxRows;
  const canRemove = values.length > minRows;

  const handleAddRow = useCallback(() => {
    if (!canAdd) return;
    onChange([...values, createEmptyRow(fields)]);
  }, [canAdd, values, fields, onChange]);

  const handleRemoveRow = useCallback(
    (index: number) => {
      if (!canRemove) return;
      const next = [...values];
      next.splice(index, 1);
      onChange(next);
    },
    [canRemove, values, onChange],
  );

  const handleFieldChange = useCallback(
    (rowIndex: number, fieldName: string, value: unknown) => {
      const next = [...values];
      next[rowIndex] = { ...next[rowIndex], [fieldName]: value };
      onChange(next);
    },
    [values, onChange],
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      const next = [...values];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      onChange(next);
    },
    [values, onChange],
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= values.length - 1) return;
      const next = [...values];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      onChange(next);
    },
    [values, onChange],
  );

  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      {values.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="group relative rounded-lg border border-border-default bg-surface-default p-4"
        >
          {/* Row header with reorder + remove controls */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">
              Row {rowIndex + 1}
            </span>

            <div className="flex items-center gap-1">
              {/* Move up */}
              <button
                type="button"
                disabled={rowIndex === 0}
                onClick={() => handleMoveUp(rowIndex)}
                className="rounded-xs p-1 text-text-secondary hover:bg-surface-muted focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={`Move row ${rowIndex + 1} up`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Move down */}
              <button
                type="button"
                disabled={rowIndex === values.length - 1}
                onClick={() => handleMoveDown(rowIndex)}
                className="rounded-xs p-1 text-text-secondary hover:bg-surface-muted focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={`Move row ${rowIndex + 1} down`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Remove */}
              {canRemove && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(rowIndex)}
                  className="ml-1 rounded-xs p-1 text-state-danger-text hover:bg-state-danger-bg focus:outline-hidden focus:ring-2 focus:ring-accent-focus"
                  aria-label={`${removeLabel} row ${rowIndex + 1}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Field grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldRenderer
                key={`${rowIndex}-${field.id}`}
                field={field}
                value={row[field.name]}
                onChange={(value) => handleFieldChange(rowIndex, field.name, value)}
                onBlur={() => {}}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Add row button */}
      {canAdd && (
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border-default px-4 py-3 text-sm font-medium text-text-secondary hover:border-action-primary hover:text-action-primary focus:outline-hidden focus:ring-2 focus:ring-accent-focus transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          {addLabel}
        </button>
      )}

      {/* Row count indicator */}
      <p className="text-xs text-text-secondary">
        {values.length} {values.length === 1 ? 'row' : 'rows'}
        {maxRows < Infinity && ` (max ${maxRows})`}
      </p>
    </div>
  );
};
