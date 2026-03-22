'use client';
/* ------------------------------------------------------------------ */
/*  useForm — standalone form state hook                                */
/*                                                                     */
/*  Provides form state management without react-hook-form.             */
/*  Returns a FormProvider that injects context for useFormField.        */
/* ------------------------------------------------------------------ */

import { useCallback, useMemo, useRef, useState } from 'react';
import React from 'react';
import type { AccessLevel } from '../internal/access-controller';
import type { SchemaValidator } from './validation/types';
import { FormContext, type FormContextValue } from './FormContext';

export interface UseFormOptions<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  defaultValues: T;
  validator?: SchemaValidator;
  mode?: 'onBlur' | 'onChange' | 'onSubmit';
  access?: AccessLevel;
}

export interface UseFormReturn<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirtyFields: Record<string, boolean>;
  setFieldValue: (name: string, value: unknown) => void;
  setFieldTouched: (name: string, isTouched?: boolean) => void;
  validateField: (name: string) => string | null;
  validateForm: () => Record<string, string>;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>,
  ) => (e?: React.FormEvent) => void;
  reset: (nextValues?: Partial<T>) => void;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  /** Wrap your form tree with this provider to enable useFormField. */
  FormProvider: React.FC<{ children: React.ReactNode }>;
}

export function useForm<
  T extends Record<string, unknown> = Record<string, unknown>,
>(options: UseFormOptions<T>): UseFormReturn<T> {
  const { defaultValues, validator, mode = 'onBlur', access = 'full' } = options;

  const defaultsRef = useRef(defaultValues);
  const [values, setValues] = useState<T>({ ...defaultValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dirty tracking
  const dirtyFields = useMemo(() => {
    const dirty: Record<string, boolean> = {};
    for (const key of Object.keys(values)) {
      if (values[key] !== defaultsRef.current[key]) {
        dirty[key] = true;
      }
    }
    return dirty;
  }, [values]);

  const isDirty = Object.keys(dirtyFields).length > 0;

  // Validation
  const runValidateField = useCallback(
    (name: string): string | null => {
      if (!validator) return null;
      const msg = validator.validateField(name, values[name], values);
      setErrors((prev) => {
        if (msg) return { ...prev, [name]: msg };
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return msg;
    },
    [validator, values],
  );

  const runValidateForm = useCallback((): Record<string, string> => {
    if (!validator) return {};
    const result = validator.validate(values);
    setErrors(result);
    return result;
  }, [validator, values]);

  const isValid = Object.keys(errors).length === 0;

  // Field setters
  const setFieldValue = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (mode === 'onChange' && validator) {
        const msg = validator.validateField(name, value, { ...values, [name]: value });
        setErrors((prev) => {
          if (msg) return { ...prev, [name]: msg };
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [mode, validator, values],
  );

  const setFieldTouched = useCallback(
    (name: string, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));
      if (mode === 'onBlur' && validator) {
        const msg = validator.validateField(name, values[name], values);
        setErrors((prev) => {
          if (msg) return { ...prev, [name]: msg };
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [mode, validator, values],
  );

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  // Submit
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async (e?: React.FormEvent) => {
        e?.preventDefault();

        // Touch all fields
        const allTouched: Record<string, boolean> = {};
        for (const key of Object.keys(values)) {
          allTouched[key] = true;
        }
        setTouched(allTouched);

        // Validate
        const formErrors = validator ? validator.validate(values) : {};
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [validator, values],
  );

  // Reset
  const reset = useCallback(
    (nextValues?: Partial<T>) => {
      const resetTo = nextValues
        ? { ...defaultsRef.current, ...nextValues }
        : { ...defaultsRef.current };
      setValues(resetTo as T);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [],
  );

  // Context value (memoized)
  const contextValue = useMemo<FormContextValue>(
    () => ({
      values,
      errors,
      touched,
      dirtyFields,
      access,
      mode,
      setFieldValue,
      setFieldTouched,
      setFieldError,
      clearFieldError,
      validateField: runValidateField,
      validateForm: runValidateForm,
      reset: reset as (nextValues?: Record<string, unknown>) => void,
      isValid,
      isDirty,
      isSubmitting,
      validator: validator ?? null,
    }),
    [
      values, errors, touched, dirtyFields, access, mode,
      setFieldValue, setFieldTouched, setFieldError, clearFieldError,
      runValidateField, runValidateForm, reset, isValid, isDirty, isSubmitting,
      validator,
    ],
  );

  // FormProvider component
  const FormProvider = useMemo(() => {
    const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
      React.createElement(FormContext.Provider, { value: contextValue }, children);
    Provider.displayName = 'FormProvider';
    return Provider;
  }, [contextValue]);

  return {
    values,
    errors,
    touched,
    dirtyFields,
    setFieldValue,
    setFieldTouched,
    validateField: runValidateField,
    validateForm: runValidateForm,
    handleSubmit,
    reset,
    isValid,
    isDirty,
    isSubmitting,
    FormProvider,
  };
}
