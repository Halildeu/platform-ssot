import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  FieldDependency,
  FieldSchema,
  FormErrors,
  FormSchema,
  FormValues,
} from './types';
import { createSchemaValidator, type SchemaValidator } from './zodAdapter';

/* ------------------------------------------------------------------ */
/*  useFormSchema — Form state management driven by FormSchema         */
/*                                                                     */
/*  Validation is delegated to SchemaValidator (see zodAdapter.ts).    */
/*  Current: Built-in SchemaValidator from FormSchema rules            */
/*  Planned: Zod/AJV adapter for external schema validation            */
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
  /** The underlying SchemaValidator — useful for external validation scenarios */
  validator: SchemaValidator;
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

  // Build validator from schema — delegates all validation logic to SchemaValidator
  const validator = useMemo(() => createSchemaValidator(schema), [schema]);

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

  /* ---- Validation (delegated to SchemaValidator) ---- */

  const validateField = useCallback(
    (name: string): string | null => {
      const msg = validator.validateField(name, values[name], values);
      setErrors((prev) => {
        if (msg) return { ...prev, [name]: msg };
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return msg;
    },
    [validator, values],
  );

  const validateForm = useCallback((): FormErrors => {
    // Filter to only visible fields before validating
    const visibleValues: Record<string, unknown> = {};
    for (const field of schema.fields) {
      if (field.hidden) continue;
      if (field.dependsOn && !evaluateDependency(field.dependsOn, values)) continue;
      visibleValues[field.name] = values[field.name];
    }

    // Use the validator but only for visible fields
    const allErrors = validator.validate(values);
    const result: FormErrors = {};
    for (const key of Object.keys(allErrors)) {
      if (key in visibleValues) {
        result[key] = allErrors[key];
      }
    }

    setErrors(result);
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    for (const field of schema.fields) allTouched[field.name] = true;
    setTouched(allTouched);
    return result;
  }, [schema, values, validator]);

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
    validator,
  };
}
