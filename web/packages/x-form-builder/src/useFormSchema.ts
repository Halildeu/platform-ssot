import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  FieldDependency,
  FieldSchema,
  FieldValidation,
  FormErrors,
  FormSchema,
  FormValues,
} from './types';

/* ------------------------------------------------------------------ */
/*  useFormSchema — Form state management driven by FormSchema         */
/* ------------------------------------------------------------------ */

/** Evaluate a single field dependency against current form values. */
function evaluateDependency(
  dep: FieldDependency,
  values: FormValues,
): boolean {
  const current = values[dep.field];
  switch (dep.operator ?? 'equals') {
    case 'equals':
      return current === dep.value;
    case 'notEquals':
      return current !== dep.value;
    case 'contains':
      return typeof current === 'string'
        ? current.includes(String(dep.value))
        : Array.isArray(current) && current.includes(dep.value);
    case 'greaterThan':
      return Number(current) > Number(dep.value);
    case 'lessThan':
      return Number(current) < Number(dep.value);
    default:
      return true;
  }
}

/** Run built-in validators for a single field. Returns error message or null. */
function validateFieldValue(
  field: FieldSchema,
  value: unknown,
  allValues: FormValues,
): string | null {
  // Required check
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return `${field.label} is required`;
    }
  }

  // Skip further checks for empty optional fields
  if (value === undefined || value === null || value === '') return null;

  const v: FieldValidation | undefined = field.validation;
  if (!v) return null;

  // String-length checks
  if (typeof value === 'string') {
    if (v.minLength !== undefined && value.length < v.minLength) {
      return `${field.label} must be at least ${v.minLength} characters`;
    }
    if (v.maxLength !== undefined && value.length > v.maxLength) {
      return `${field.label} must be at most ${v.maxLength} characters`;
    }
    if (v.pattern) {
      const re = new RegExp(v.pattern);
      if (!re.test(value)) {
        return v.patternMessage ?? `${field.label} format is invalid`;
      }
    }
  }

  // Numeric range checks
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const num = Number(value);
    if (v.min !== undefined && num < v.min) {
      return `${field.label} must be at least ${v.min}`;
    }
    if (v.max !== undefined && num > v.max) {
      return `${field.label} must be at most ${v.max}`;
    }
  }

  // Custom validator
  if (v.custom) {
    return v.custom(value, allValues);
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseFormSchemaReturn {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, error: string) => void;
  validateField: (name: string) => string | null;
  validateForm: () => FormErrors;
  isValid: boolean;
  isDirty: boolean;
  reset: () => void;
  handleSubmit: (onSubmit: (values: FormValues) => void) => (e: React.FormEvent) => void;
  getVisibleFields: () => FieldSchema[];
}

export function useFormSchema(
  schema: FormSchema,
  initialValues?: FormValues,
): UseFormSchemaReturn {
  // Build default values from schema + caller overrides
  const defaults = useMemo(() => {
    const base: FormValues = {};
    for (const field of schema.fields) {
      if (field.defaultValue !== undefined) {
        base[field.name] = field.defaultValue;
      }
    }
    return { ...base, ...initialValues };
  }, [schema, initialValues]);

  const [values, setValues] = useState<FormValues>(() => ({ ...defaults }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Keep a stable ref for defaults so isDirty comparison is cheap
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  // Field map for quick lookup
  const fieldMap = useMemo(() => {
    const map = new Map<string, FieldSchema>();
    for (const f of schema.fields) map.set(f.name, f);
    return map;
  }, [schema]);

  /* ---- Setters ---- */

  const setFieldValue = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      // Clear error when user types
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [],
  );

  const setFieldError = useCallback(
    (name: string, error: string) => {
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [],
  );

  /* ---- Validation ---- */

  const validateField = useCallback(
    (name: string): string | null => {
      const field = fieldMap.get(name);
      if (!field) return null;
      const msg = validateFieldValue(field, values[name], values);
      setErrors((prev) => {
        if (msg) return { ...prev, [name]: msg };
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return msg;
    },
    [fieldMap, values],
  );

  const validateForm = useCallback((): FormErrors => {
    const result: FormErrors = {};
    for (const field of schema.fields) {
      // Only validate visible fields
      if (field.hidden) continue;
      if (field.dependsOn && !evaluateDependency(field.dependsOn, values)) continue;

      const msg = validateFieldValue(field, values[field.name], values);
      if (msg) result[field.name] = msg;
    }
    setErrors(result);
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    for (const field of schema.fields) allTouched[field.name] = true;
    setTouched(allTouched);
    return result;
  }, [schema, values]);

  /* ---- Derived state ---- */

  const isValid = useMemo(
    () => Object.keys(errors).length === 0,
    [errors],
  );

  const isDirty = useMemo(() => {
    const d = defaultsRef.current;
    return Object.keys(values).some((k) => values[k] !== d[k]);
  }, [values]);

  /* ---- Reset ---- */

  const reset = useCallback(() => {
    setValues({ ...defaultsRef.current });
    setErrors({});
    setTouched({});
  }, []);

  /* ---- Submit handler factory ---- */

  const handleSubmit = useCallback(
    (onSubmit: (values: FormValues) => void) =>
      (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
          onSubmit(values);
        }
      },
    [validateForm, values],
  );

  /* ---- Visible fields (dependency-filtered) ---- */

  const getVisibleFields = useCallback((): FieldSchema[] => {
    return schema.fields.filter((field) => {
      if (field.hidden) return false;
      if (field.dependsOn) return evaluateDependency(field.dependsOn, values);
      return true;
    });
  }, [schema, values]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm,
    isValid,
    isDirty,
    reset,
    handleSubmit,
    getVisibleFields,
  };
}
