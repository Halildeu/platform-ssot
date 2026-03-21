/* ------------------------------------------------------------------ */
/*  @mfe/x-form-builder — Form schema types                           */
/* ------------------------------------------------------------------ */

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'textarea'
  | 'date'
  | 'time'
  | 'file'
  | 'custom';

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  custom?: (value: unknown, formData: Record<string, unknown>) => string | null;
}

export interface FieldDependency {
  field: string;
  value: unknown;
  operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
}

export interface FieldSchema {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: unknown;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: FieldValidation;
  dependsOn?: FieldDependency;
  /** Grid column span (1-4) */
  span?: 1 | 2 | 3 | 4;
  helpText?: string;
}

export interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  fields: FieldSchema[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: 1 | 2 | 3 | 4;
  submitLabel?: string;
  resetLabel?: string;
}

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string>;
