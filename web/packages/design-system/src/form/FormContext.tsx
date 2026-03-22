'use client';
/* ------------------------------------------------------------------ */
/*  FormContext — form-level state context + provider                   */
/* ------------------------------------------------------------------ */

import { createContext, useContext } from 'react';
import type { AccessLevel } from '../internal/access-controller';
import type { SchemaValidator } from './validation/types';

export interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirtyFields: Record<string, boolean>;
  access: AccessLevel;
  mode: 'onBlur' | 'onChange' | 'onSubmit';
  setFieldValue: (name: string, value: unknown) => void;
  setFieldTouched: (name: string, isTouched?: boolean) => void;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
  validateField: (name: string) => string | null;
  validateForm: () => Record<string, string>;
  reset: (nextValues?: Record<string, unknown>) => void;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  validator: SchemaValidator | null;
}

const FormContext = createContext<FormContextValue | null>(null);
FormContext.displayName = 'FormContext';

/**
 * Read form context. Throws if used outside a FormProvider.
 */
export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error(
      'useFormContext must be used within a <FormProvider>. ' +
        'Wrap your form with the FormProvider returned by useForm() or pass one explicitly.',
    );
  }
  return ctx;
}

export { FormContext };
