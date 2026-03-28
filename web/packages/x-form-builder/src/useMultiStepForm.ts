import { useCallback, useMemo, useState } from 'react';
import type {
  FieldSchema,
  FormErrors,
  FormValues,
  MultiStepFormSchema,
} from './types';
import { useFormSchema } from './useFormSchema';
import type { UseFormSchemaReturn } from './useFormSchema';

/* ------------------------------------------------------------------ */
/*  useMultiStepForm — Multi-step form state management                */
/* ------------------------------------------------------------------ */

export interface UseMultiStepFormReturn extends UseFormSchemaReturn {
  /** Zero-based index of the current step. */
  currentStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Whether the current step is the first step. */
  isFirstStep: boolean;
  /** Whether the current step is the last step. */
  isLastStep: boolean;
  /** Fields belonging to the current step. */
  stepFields: FieldSchema[];
  /** Navigate to a specific step. Returns true if navigation succeeded. */
  goToStep: (step: number) => boolean;
  /** Advance to the next step. Returns true if validation passed and step changed. */
  nextStep: () => boolean;
  /** Go back to the previous step. */
  previousStep: () => void;
  /** Whether the current step is valid and the user can advance. */
  canAdvance: boolean;
  /** Progress percentage (0-100). */
  progress: number;
  /** Set of step indices the user has visited. */
  visitedSteps: Set<number>;
  /** Validation errors for the current step only. */
  stepErrors: FormErrors;
  /** Validate only the fields in the current step. */
  validateStep: () => FormErrors;
}

/** Collect all field IDs for a given step (from sections or flat fields). */
function getStepFieldIds(step: MultiStepFormSchema['steps'][number]): string[] {
  const ids: string[] = [];

  if (step.sections) {
    for (const section of step.sections) {
      ids.push(...section.fields);
    }
  }

  if (step.fields) {
    ids.push(...step.fields);
  }

  return ids;
}

export function useMultiStepForm(
  schema: MultiStepFormSchema,
  initialValues?: FormValues,
): UseMultiStepFormReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(() => new Set([0]));

  // Delegate to useFormSchema for core form state
  const form = useFormSchema(schema, initialValues);

  const totalSteps = schema.steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Build a field map for quick lookup by ID
  const fieldMap = useMemo(() => {
    const map = new Map<string, FieldSchema>();
    for (const f of schema.fields) map.set(f.id, f);
    return map;
  }, [schema.fields]);

  // Resolve the FieldSchema[] for the current step
  const stepFields = useMemo((): FieldSchema[] => {
    if (currentStep >= totalSteps) return [];
    const step = schema.steps[currentStep];
    const ids = getStepFieldIds(step);
    return ids.map((id) => fieldMap.get(id)).filter(Boolean) as FieldSchema[];
  }, [currentStep, totalSteps, schema.steps, fieldMap]);

  // Validate only fields in the current step
  const validateStep = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    for (const field of stepFields) {
      const msg = form.validateField(field.name);
      if (msg) errs[field.name] = msg;
    }
    return errs;
  }, [stepFields, form]);

  // Step errors: subset of form errors for current step fields
  const stepErrors = useMemo((): FormErrors => {
    const errs: FormErrors = {};
    const stepFieldNames = new Set(stepFields.map((f) => f.name));
    for (const [name, error] of Object.entries(form.errors)) {
      if (stepFieldNames.has(name)) errs[name] = error;
    }
    return errs;
  }, [form.errors, stepFields]);

  const canAdvance = useMemo(
    () => Object.keys(stepErrors).length === 0,
    [stepErrors],
  );

  const progress = useMemo(
    () => (totalSteps <= 1 ? 100 : Math.round((currentStep / (totalSteps - 1)) * 100)),
    [currentStep, totalSteps],
  );

  const goToStep = useCallback(
    (step: number): boolean => {
      if (step < 0 || step >= totalSteps) return false;
      if (!schema.allowStepNavigation && step > currentStep) {
        // Must use nextStep to advance when step navigation is not allowed
        return false;
      }
      // Going backward is always allowed; going forward requires validation
      if (step > currentStep) {
        const currentStepDef = schema.steps[currentStep];
        if (currentStepDef.validation !== 'onSubmit') {
          const errs = validateStep();
          if (Object.keys(errs).length > 0) return false;
        }
      }
      setCurrentStep(step);
      setVisitedSteps((prev) => new Set([...prev, step]));
      return true;
    },
    [totalSteps, currentStep, schema.allowStepNavigation, schema.steps, validateStep],
  );

  const nextStep = useCallback((): boolean => {
    if (isLastStep) return false;
    const currentStepDef = schema.steps[currentStep];
    if (currentStepDef.validation !== 'onSubmit') {
      const errs = validateStep();
      if (Object.keys(errs).length > 0) return false;
    }
    const next = currentStep + 1;
    setCurrentStep(next);
    setVisitedSteps((prev) => new Set([...prev, next]));
    return true;
  }, [isLastStep, currentStep, schema.steps, validateStep]);

  const previousStep = useCallback(() => {
    if (isFirstStep) return;
    setCurrentStep((prev) => prev - 1);
  }, [isFirstStep]);

  return {
    ...form,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    stepFields,
    goToStep,
    nextStep,
    previousStep,
    canAdvance,
    progress,
    visitedSteps,
    stepErrors,
    validateStep,
  };
}
