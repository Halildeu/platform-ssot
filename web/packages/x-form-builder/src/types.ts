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

/* ------------------------------------------------------------------ */
/*  Sections & Multi-step                                              */
/* ------------------------------------------------------------------ */

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // field IDs
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  condition?: FieldDependency;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  sections?: FormSection[];
  fields?: string[]; // field IDs (flat, if no sections)
  validation?: 'onNext' | 'onSubmit';
}

/* ------------------------------------------------------------------ */
/*  Conditional logic engine                                           */
/* ------------------------------------------------------------------ */

export interface ConditionalRule {
  id: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value?: unknown;
  }>;
  logic: 'and' | 'or';
  actions: Array<{
    type: 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'setRequired';
    target: string; // field ID
    value?: unknown;
  }>;
}

/* ------------------------------------------------------------------ */
/*  Async validation                                                   */
/* ------------------------------------------------------------------ */

export interface AsyncValidator {
  field: string;
  validate: (value: unknown, formData: FormValues) => Promise<string | null>;
  debounceMs?: number;
}

/* ------------------------------------------------------------------ */
/*  Multi-step form schema                                             */
/* ------------------------------------------------------------------ */

export interface MultiStepFormSchema extends FormSchema {
  steps: FormStep[];
  showProgress?: boolean;
  allowStepNavigation?: boolean;
}
