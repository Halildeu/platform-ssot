import React, { useCallback, useMemo } from 'react';
import type { FormErrors, FormSchema, FormValues } from './types';
import { useFormSchema } from './useFormSchema';
import { FieldRenderer } from './FieldRenderer';

/* ------------------------------------------------------------------ */
/*  FormRenderer — Renders a complete form from a FormSchema           */
/* ------------------------------------------------------------------ */

export interface FormRendererProps {
  schema: FormSchema;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
  onSubmit?: (values: FormValues) => void;
  onReset?: () => void;
  errors?: FormErrors;
  readOnly?: boolean;
  loading?: boolean;
  className?: string;
}

/** CSS Grid template for the given column count. */
const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  values: externalValues,
  onChange,
  onSubmit,
  onReset,
  errors: externalErrors,
  readOnly = false,
  loading = false,
  className,
}) => {
  const columns = schema.columns ?? 1;

  const form = useFormSchema(schema, externalValues);

  // Merge external errors with internal validation errors
  const mergedErrors = useMemo(
    () => ({ ...form.errors, ...externalErrors }),
    [form.errors, externalErrors],
  );

  // Propagate value changes to parent when controlled
  const handleFieldChange = useCallback(
    (name: string, value: unknown) => {
      form.setFieldValue(name, value);
      if (onChange) {
        onChange({ ...form.values, [name]: value });
      }
    },
    [form, onChange],
  );

  // Validate a single field on blur
  const handleFieldBlur = useCallback(
    (name: string) => {
      form.validateField(name);
    },
    [form],
  );

  // Submit handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const formErrors = form.validateForm();
      if (Object.keys(formErrors).length === 0 && onSubmit) {
        onSubmit(form.values);
      }
    },
    [form, onSubmit],
  );

  // Reset handler
  const handleReset = useCallback(() => {
    form.reset();
    onReset?.();
  }, [form, onReset]);

  const visibleFields = form.getVisibleFields();

  return (
    <form
      onSubmit={handleSubmit}
      onReset={(e) => {
        e.preventDefault();
        handleReset();
      }}
      noValidate
      className={className}
    >
      {/* Title + Description */}
      {(schema.title || schema.description) && (
        <div className="mb-6">
          {schema.title && (
            <h2 className="text-lg font-semibold text-text-primary">{schema.title}</h2>
          )}
          {schema.description && (
            <p className="mt-1 text-sm text-text-secondary">{schema.description}</p>
          )}
        </div>
      )}

      {/* Field grid */}
      <div className={`grid gap-4 ${gridCols[columns] ?? gridCols[1]}`}>
        {visibleFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={form.values[field.name]}
            error={mergedErrors[field.name]}
            touched={form.touched[field.name]}
            readOnly={readOnly || field.disabled}
            onChange={(value) => handleFieldChange(field.name, value)}
            onBlur={() => handleFieldBlur(field.name)}
          />
        ))}
      </div>

      {/* Actions */}
      {!readOnly && (onSubmit || onReset) && (
        <div className="mt-6 flex items-center gap-3">
          {onSubmit && (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-white hover:bg-action-primary focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {schema.submitLabel ?? 'Submit'}
            </button>
          )}
          {onReset && (
            <button
              type="reset"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              {schema.resetLabel ?? 'Reset'}
            </button>
          )}
        </div>
      )}
    </form>
  );
};
