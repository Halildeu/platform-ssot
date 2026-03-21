import React, { useMemo } from 'react';
import type { FormSchema, FormValues } from './types';
import { FormRenderer } from './FormRenderer';

/* ------------------------------------------------------------------ */
/*  FormPreview — Read-only preview of a FormSchema with sample data   */
/*                                                                     */
/*  Useful in Design Lab and form-builder tooling to preview how a     */
/*  schema will render without live interaction.                        */
/* ------------------------------------------------------------------ */

export interface FormPreviewProps {
  schema: FormSchema;
  sampleValues?: FormValues;
  className?: string;
}

/**
 * Generate plausible sample values from the schema so the preview
 * is not completely empty.
 */
function generateSampleValues(schema: FormSchema): FormValues {
  const values: FormValues = {};
  for (const field of schema.fields) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
      continue;
    }
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        values[field.name] = '';
        break;
      case 'number':
        values[field.name] = field.validation?.min ?? 0;
        break;
      case 'select':
      case 'radio':
        values[field.name] = field.options?.[0]?.value ?? '';
        break;
      case 'multiselect':
        values[field.name] = field.options?.slice(0, 1).map((o) => o.value) ?? [];
        break;
      case 'checkbox':
      case 'switch':
        values[field.name] = false;
        break;
      case 'textarea':
        values[field.name] = '';
        break;
      case 'date':
        values[field.name] = new Date().toISOString().slice(0, 10);
        break;
      case 'time':
        values[field.name] = '09:00';
        break;
      default:
        values[field.name] = '';
    }
  }
  return values;
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  schema,
  sampleValues,
  className,
}) => {
  const values = useMemo(
    () => sampleValues ?? generateSampleValues(schema),
    [schema, sampleValues],
  );

  return (
    <div
      className={`rounded-lg border border-ds-border bg-ds-surface p-6 shadow-sm ${className ?? ''}`}
    >
      {/* Preview badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-ds-surface-secondary px-2.5 py-0.5 text-xs font-medium text-ds-text-secondary">
          Preview
        </span>
        {schema.title && (
          <span className="text-sm font-medium text-ds-text-primary">{schema.title}</span>
        )}
      </div>

      <FormRenderer
        schema={schema}
        values={values}
        readOnly
      />
    </div>
  );
};
