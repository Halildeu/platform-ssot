import React, { useCallback, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FormField {
  name: string;
  label: string;
  type: string; // 'text' | 'number' | 'email' | 'textarea' | 'select' | ...
  required?: boolean;
  options?: Array<{ label: string; value: string }>; // for select
  placeholder?: string;
}

export interface CreateEditFormBlockProps {
  title: string;
  fields: FormField[];
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  initialValues?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CreateEditFormBlock({
  title,
  fields,
  onSubmit,
  onCancel,
  initialValues = {},
}: CreateEditFormBlockProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);

  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(values);
    },
    [onSubmit, values],
  );

  return (
    <form onSubmit={handleSubmit}>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text-primary))',
          marginBottom: '1.5rem',
          margin: '0 0 1.5rem 0',
        }}
      >
        {title}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text-primary))',
                marginBottom: '0.375rem',
              }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: 'var(--color-error))', marginLeft: '0.25rem' }}>
                  *
                </span>
              )}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                value={String(values[field.name] ?? '')}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-border))',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                value={String(values[field.name] ?? '')}
                onChange={(e) => handleChange(field.name, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-border))',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                value={String(values[field.name] ?? '')}
                onChange={(e) => handleChange(field.name, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-border))',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--color-border))',
            background: 'transparent',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            background: 'var(--color-primary))',
            color: 'var(--surface-default)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
