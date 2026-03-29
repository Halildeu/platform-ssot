import React, { useContext, useId } from 'react';
import type { FieldSchema } from './types';
import { FieldRegistryContext } from './FieldRegistry';

/* ------------------------------------------------------------------ */
/*  FieldRenderer — Maps FieldSchema.type to a design-system component */
/* ------------------------------------------------------------------ */

export interface FieldRendererProps {
  field: FieldSchema;
  value: unknown;
  error?: string;
  touched?: boolean;
  readOnly?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

/**
 * Wraps every field with label, help text, error message, and required
 * indicator. Delegates the actual input to the registry component.
 */
export const FieldRenderer: React.FC<FieldRendererProps> = (props) => {
  const { field, error, touched } = props;
  const autoId = useId();
  const inputId = `fb-${field.id}-${autoId}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const showError = Boolean(error && touched);

  const registry = useContext(FieldRegistryContext);
  const Component = registry[field.type];

  if (!Component) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[x-form-builder] No renderer registered for field type "${field.type}"`);
    }
    return null;
  }

  return (
    <div
      className="flex flex-col gap-1.5"
      style={{ gridColumn: field.span ? `span ${field.span}` : undefined }}
    >
      {/* Label */}
      <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
        {field.label}
        {field.required && (
          <span className="ml-0.5 text-state-danger-text" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Input (delegated to registry component) */}
      <Component
        {...props}
        // Forward a11y ids so the registry component can wire them up
        {...({ inputId, errorId: showError ? errorId : undefined, helpId: field.helpText ? helpId : undefined } as Record<string, string | undefined>)}
      />

      {/* Help text */}
      {field.helpText && !showError && (
        <p id={helpId} className="text-xs text-text-secondary">
          {field.helpText}
        </p>
      )}

      {/* Error message */}
      {showError && (
        <p id={errorId} role="alert" className="text-xs text-state-danger-text">
          {error}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Default field components — used by the default registry            */
/* ------------------------------------------------------------------ */

/**
 * Helper: common input props shared by simple text-like fields.
 */
function inputProps(
  props: FieldRendererProps & { inputId?: string; errorId?: string; helpId?: string },
) {
  const { field, value, readOnly, onChange, onBlur, inputId, errorId, helpId } = props;
  return {
    id: inputId,
    name: field.name,
    placeholder: field.placeholder,
    disabled: field.disabled,
    readOnly,
    required: field.required,
    'aria-invalid': Boolean(props.error && props.touched) || undefined,
    'aria-describedby': [errorId, helpId].filter(Boolean).join(' ') || undefined,
    value: (value as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(e.target.value),
    onBlur,
    className:
      'w-full rounded-md border border-border-default bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:cursor-not-allowed disabled:opacity-50',
  };
}

/* ---- Text / Email / Password ---- */

export const TextFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const type = props.field.type === 'email' ? 'email' : props.field.type === 'password' ? 'password' : 'text';
  return <input type={type} {...inputProps(props)} />;
};

/* ---- Number ---- */

export const NumberFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, value, readOnly: _readOnly, onChange, onBlur: _onBlur } = props;
  const ip = inputProps(props);
  return (
    <input
      {...ip}
      type="number"
      min={field.validation?.min}
      max={field.validation?.max}
      value={value !== undefined && value !== null ? String(value) : ''}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === '' ? '' : Number(raw));
      }}
    />
  );
};

/* ---- Select ---- */

export const SelectFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, value, readOnly: _readOnly, onChange: _onChange, onBlur: _onBlur } = props;
  const ip = inputProps(props);
  return (
    <select {...ip} value={(value as string) ?? ''}>
      {field.placeholder && (
        <option value="" disabled>
          {field.placeholder}
        </option>
      )}
      {field.options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

/* ---- Multiselect ---- */

export const MultiselectFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, value, readOnly: _readOnly, onChange, onBlur: _onBlur } = props;
  const ip = inputProps(props);
  const selected = Array.isArray(value) ? value : [];
  return (
    <select
      {...ip}
      multiple
      value={selected as string[]}
      onChange={(e) => {
        const opts = Array.from(e.target.selectedOptions, (o) => o.value);
        onChange(opts);
      }}
    >
      {field.options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

/* ---- Checkbox ---- */

export const CheckboxFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, value, readOnly, onChange, onBlur } = props;
  const checked = Boolean(value);
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        id={(props as Record<string, unknown>).inputId as string}
        type="checkbox"
        name={field.name}
        checked={checked}
        disabled={field.disabled || readOnly}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        className="h-4 w-4 rounded-xs border-border-default text-action-primary focus:ring-2 focus:ring-accent-focus"
        aria-invalid={Boolean(props.error && props.touched) || undefined}
        aria-describedby={
          [(props as Record<string, unknown>).errorId, (props as Record<string, unknown>).helpId]
            .filter(Boolean)
            .join(' ') || undefined
        }
      />
    </label>
  );
};

/* ---- Radio ---- */

export const RadioFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, value, readOnly, onChange, onBlur } = props;
  return (
    <div role="radiogroup" aria-label={field.label} className="flex flex-col gap-2">
      {field.options?.map((opt) => (
        <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="radio"
            name={field.name}
            value={opt.value}
            checked={value === opt.value}
            disabled={field.disabled || readOnly}
            onChange={() => onChange(opt.value)}
            onBlur={onBlur}
            className="h-4 w-4 border-border-default text-action-primary focus:ring-2 focus:ring-accent-focus"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

/* ---- Switch ---- */

export const SwitchFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, value, readOnly, onChange, onBlur } = props;
  const checked = Boolean(value);
  return (
    <button
      type="button"
      role="switch"
      id={(props as Record<string, unknown>).inputId as string}
      aria-checked={checked}
      aria-label={field.label}
      disabled={field.disabled || readOnly}
      onClick={() => onChange(!checked)}
      onBlur={onBlur}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-action-primary' : 'bg-border-default'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-default shadow-xs transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

/* ---- Textarea ---- */

export const TextareaFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const ip = inputProps(props);
  return <textarea {...ip} rows={4} />;
};

/* ---- Date ---- */

export const DateFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  return <input type="date" {...inputProps(props)} />;
};

/* ---- Time ---- */

export const TimeFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  return <input type="time" {...inputProps(props)} />;
};

/* ---- File ---- */

export const FileFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  const { field, readOnly, onChange, onBlur } = props;
  return (
    <input
      id={(props as Record<string, unknown>).inputId as string}
      type="file"
      name={field.name}
      disabled={field.disabled || readOnly}
      onChange={(e) => onChange(e.target.files)}
      onBlur={onBlur}
      className="w-full text-sm text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-surface-muted file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-surface-muted"
      aria-invalid={Boolean(props.error && props.touched) || undefined}
      aria-describedby={
        [(props as Record<string, unknown>).errorId, (props as Record<string, unknown>).helpId]
          .filter(Boolean)
          .join(' ') || undefined
      }
    />
  );
};

/* ---- Custom (render prop / children placeholder) ---- */

export const CustomFieldRenderer: React.FC<FieldRendererProps & Record<string, unknown>> = (props) => {
  return (
    <div className="text-xs text-text-secondary italic">
      Custom field: {props.field.name} (provide via FieldRegistry)
    </div>
  );
};
