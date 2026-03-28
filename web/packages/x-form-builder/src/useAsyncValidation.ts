import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AsyncValidator, FormValues } from './types';

/* ------------------------------------------------------------------ */
/*  useAsyncValidation — Debounced async field validation              */
/* ------------------------------------------------------------------ */

export interface AsyncValidationResult {
  /** Trigger async validation for a single field. */
  validateField: (field: string, value: unknown, formData: FormValues) => void;
  /** Current async validation errors keyed by field name. */
  errors: Record<string, string>;
  /** Whether each field is currently being validated. */
  validating: Record<string, boolean>;
  /** Whether any field is currently being validated. */
  isValidating: boolean;
  /** Clear all async errors and cancel pending validations. */
  clearAll: () => void;
}

export function useAsyncValidation(
  validators: AsyncValidator[],
): AsyncValidationResult {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validating, setValidating] = useState<Record<string, boolean>>({});

  // Map validators by field name for O(1) lookup
  const validatorMap = useMemo(() => {
    const map = new Map<string, AsyncValidator>();
    for (const v of validators) map.set(v.field, v);
    return map;
  }, [validators]);

  // Track debounce timers and abort controllers per field
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) clearTimeout(timer);
      for (const controller of controllersRef.current.values()) controller.abort();
    };
  }, []);

  const validateField = useCallback(
    (field: string, value: unknown, formData: FormValues) => {
      const validator = validatorMap.get(field);
      if (!validator) return;

      // Cancel any pending timer for this field
      const existingTimer = timersRef.current.get(field);
      if (existingTimer) clearTimeout(existingTimer);

      // Abort any in-flight validation for this field
      const existingController = controllersRef.current.get(field);
      if (existingController) existingController.abort();

      const debounce = validator.debounceMs ?? 300;

      const timer = setTimeout(() => {
        const controller = new AbortController();
        controllersRef.current.set(field, controller);

        setValidating((prev) => ({ ...prev, [field]: true }));

        validator
          .validate(value, formData)
          .then((errorMsg) => {
            // If aborted, don't update state
            if (controller.signal.aborted) return;

            setErrors((prev) => {
              if (errorMsg) return { ...prev, [field]: errorMsg };
              if (!prev[field]) return prev;
              const next = { ...prev };
              delete next[field];
              return next;
            });
          })
          .catch((err: unknown) => {
            // Only log non-abort errors
            if (controller.signal.aborted) return;
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[x-form-builder] Async validation error for "${field}":`, err);
            }
          })
          .finally(() => {
            if (controller.signal.aborted) return;
            setValidating((prev) => {
              const next = { ...prev };
              delete next[field];
              return next;
            });
            controllersRef.current.delete(field);
          });
      }, debounce);

      timersRef.current.set(field, timer);
    },
    [validatorMap],
  );

  const isValidating = useMemo(
    () => Object.values(validating).some(Boolean),
    [validating],
  );

  const clearAll = useCallback(() => {
    for (const timer of timersRef.current.values()) clearTimeout(timer);
    for (const controller of controllersRef.current.values()) controller.abort();
    timersRef.current.clear();
    controllersRef.current.clear();
    setErrors({});
    setValidating({});
  }, []);

  return { validateField, errors, validating, isValidating, clearAll };
}
