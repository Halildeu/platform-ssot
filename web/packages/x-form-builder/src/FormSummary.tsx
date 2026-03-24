import React, { useMemo } from 'react';
import type {
  FieldSchema,
  FormSchema,
  FormValues,
  MultiStepFormSchema,
} from './types';

/* ------------------------------------------------------------------ */
/*  FormSummary — Read-only review of all form values before submit    */
/* ------------------------------------------------------------------ */

export interface FormSummaryProps {
  schema: FormSchema;
  values: FormValues;
  onEdit?: (fieldId: string) => void;
  className?: string;
}

/** Format a field value for human-readable display. */
function formatValue(field: FieldSchema, value: unknown): string {
  if (value === undefined || value === null || value === '') return '\u2014';

  // For select/radio/multiselect, show option labels instead of values
  if (field.options && field.options.length > 0) {
    if (Array.isArray(value)) {
      return value
        .map((v) => field.options?.find((o) => o.value === v)?.label ?? String(v))
        .join(', ');
    }
    const opt = field.options.find((o) => o.value === value);
    if (opt) return opt.label;
  }

  // Boolean fields
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  // File fields
  if (value instanceof FileList) {
    return Array.from(value)
      .map((f) => f.name)
      .join(', ');
  }

  return String(value);
}

/** Group fields by step/section when schema is multi-step. */
function buildGroups(schema: FormSchema, fieldMap: Map<string, FieldSchema>) {
  const multiStep = 'steps' in schema ? (schema as MultiStepFormSchema) : null;

  if (multiStep?.steps) {
    return multiStep.steps.map((step) => {
      const sections = step.sections?.map((section) => ({
        id: section.id,
        title: section.title,
        fields: section.fields
          .map((id) => fieldMap.get(id))
          .filter(Boolean) as FieldSchema[],
      }));

      const flatFields = step.fields
        ?.map((id) => fieldMap.get(id))
        .filter(Boolean) as FieldSchema[] | undefined;

      return {
        id: step.id,
        title: step.title,
        sections,
        fields: flatFields,
      };
    });
  }

  // Single group with all fields
  return [
    {
      id: 'default',
      title: schema.title ?? 'Form',
      sections: undefined,
      fields: schema.fields,
    },
  ];
}

export const FormSummary: React.FC<FormSummaryProps> = ({
  schema,
  values,
  onEdit,
  className,
}) => {
  const fieldMap = useMemo(() => {
    const map = new Map<string, FieldSchema>();
    for (const f of schema.fields) map.set(f.id, f);
    return map;
  }, [schema.fields]);

  const groups = useMemo(() => buildGroups(schema, fieldMap), [schema, fieldMap]);

  const renderFieldRow = (field: FieldSchema) => (
    <div
      key={field.id}
      className="flex items-start justify-between gap-4 py-2"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text-secondary">
          {field.label}
        </span>
        <span className="text-sm text-text-primary">
          {formatValue(field, values[field.name])}
        </span>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(field.id)}
          className="shrink-0 text-xs font-medium text-action-primary hover:text-action-primary-hover focus:outline-hidden focus:underline"
          aria-label={`Edit ${field.label}`}
        >
          Edit
        </button>
      )}
    </div>
  );

  return (
    <div className={`rounded-lg border border-border-default bg-surface-default ${className ?? ''}`}>
      {/* Summary header */}
      <div className="border-b border-border-default px-4 py-3">
        <h3 className="text-sm font-semibold text-text-primary">Review</h3>
        <p className="mt-0.5 text-xs text-text-secondary">
          Please review your answers before submitting.
        </p>
      </div>

      <div className="divide-y divide-border-default">
        {groups.map((group) => (
          <div key={group.id} className="px-4 py-4">
            <h4 className="mb-2 text-sm font-semibold text-text-primary">
              {group.title}
            </h4>

            {group.sections ? (
              <div className="flex flex-col gap-4">
                {group.sections.map((section) => (
                  <div key={section.id}>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
                      {section.title}
                    </p>
                    <div className="divide-y divide-border-default/50">
                      {section.fields.map(renderFieldRow)}
                    </div>
                  </div>
                ))}
              </div>
            ) : group.fields ? (
              <div className="divide-y divide-border-default/50">
                {group.fields.map(renderFieldRow)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
