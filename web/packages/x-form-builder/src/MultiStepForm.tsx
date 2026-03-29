import React, { useCallback, useMemo } from 'react';
import type { FormValues, MultiStepFormSchema } from './types';
import { useMultiStepForm } from './useMultiStepForm';
import { FieldRenderer } from './FieldRenderer';
import { FormSectionComponent } from './FormSection';

/* ------------------------------------------------------------------ */
/*  MultiStepForm — Multi-step wizard form with progress bar           */
/* ------------------------------------------------------------------ */

export interface MultiStepFormProps {
  schema: MultiStepFormSchema;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
  onSubmit?: (values: FormValues) => void;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  schema,
  values: externalValues,
  onChange,
  onSubmit,
  onStepChange,
  className,
}) => {
  const multi = useMultiStepForm(schema, externalValues);
  const showProgress = schema.showProgress ?? true;

  // Field map for quick lookup by ID
  const fieldMap = useMemo(() => {
    const map = new Map<string, (typeof schema.fields)[number]>();
    for (const f of schema.fields) map.set(f.id, f);
    return map;
  }, [schema.fields]);

  const handleFieldChange = useCallback(
    (name: string, value: unknown) => {
      multi.setFieldValue(name, value);
      if (onChange) {
        onChange({ ...multi.values, [name]: value });
      }
    },
    [multi, onChange],
  );

  const handleFieldBlur = useCallback(
    (name: string) => {
      multi.validateField(name);
    },
    [multi],
  );

  const handleNext = useCallback(() => {
    const success = multi.nextStep();
    if (success && onStepChange) {
      onStepChange(multi.currentStep + 1);
    }
  }, [multi, onStepChange]);

  const handlePrevious = useCallback(() => {
    multi.previousStep();
    if (onStepChange) {
      onStepChange(multi.currentStep - 1);
    }
  }, [multi, onStepChange]);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (!schema.allowStepNavigation) return;
      const success = multi.goToStep(stepIndex);
      if (success && onStepChange) {
        onStepChange(stepIndex);
      }
    },
    [multi, schema.allowStepNavigation, onStepChange],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const formErrors = multi.validateForm();
      if (Object.keys(formErrors).length === 0 && onSubmit) {
        onSubmit(multi.values);
      }
    },
    [multi, onSubmit],
  );

  const currentStepDef = schema.steps[multi.currentStep];

  /** Render fields by their IDs. */
  const renderFields = (fieldIds: string[]) => {
    const cols = schema.columns ?? 1;
    const gridCols: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div className={`grid gap-4 ${gridCols[cols] ?? gridCols[1]}`}>
        {fieldIds
          .map((id) => fieldMap.get(id))
          .filter(Boolean)
          .map((field) => (
            <FieldRenderer
              key={field!.id}
              field={field!}
              value={multi.values[field!.name]}
              error={multi.errors[field!.name]}
              touched={multi.touched[field!.name]}
              onChange={(value) => handleFieldChange(field!.name, value)}
              onBlur={() => handleFieldBlur(field!.name)}
            />
          ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {/* Title + Description */}
      {(schema.title || schema.description) && (
        <div className="mb-6">
          {schema.title && (
            <h2 className="text-lg font-semibold text-text-primary">{schema.title}</h2>
          )}
          {schema.description && (
            <p className="mt-1 text-sm text-text-secondary">{schema.description}</p>
          )}
        </div>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="mb-8">
          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {schema.steps.map((step, index) => {
              const isActive = index === multi.currentStep;
              const isCompleted = index < multi.currentStep;
              const isVisited = multi.visitedSteps.has(index);
              const isClickable = schema.allowStepNavigation && isVisited;

              return (
                <React.Fragment key={step.id}>
                  {/* Step indicator */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!isClickable}
                      onClick={() => handleStepClick(index)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-action-primary text-text-inverse'
                          : isCompleted
                            ? 'bg-action-primary/20 text-action-primary'
                            : 'bg-surface-muted text-text-secondary'
                      } ${
                        isClickable
                          ? 'cursor-pointer hover:ring-2 hover:ring-accent-focus'
                          : 'cursor-default'
                      }`}
                      aria-label={`Step ${index + 1}: ${step.title}`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </button>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index < schema.steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 transition-colors ${
                        index < multi.currentStep ? 'bg-action-primary' : 'bg-border-default'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-action-primary transition-all duration-300 ease-in-out"
              style={{ width: `${multi.progress}%` }}
              role="progressbar"
              aria-valuenow={multi.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Form progress"
            />
          </div>
        </div>
      )}

      {/* Current step content */}
      <div className="min-h-[200px]">
        {/* Step title + description */}
        {(currentStepDef.title || currentStepDef.description) && (
          <div className="mb-4">
            <h3 className="text-base font-semibold text-text-primary">
              {currentStepDef.title}
            </h3>
            {currentStepDef.description && (
              <p className="mt-1 text-sm text-text-secondary">
                {currentStepDef.description}
              </p>
            )}
          </div>
        )}

        {/* Sections or flat fields */}
        {currentStepDef.sections ? (
          <div className="flex flex-col gap-6">
            {currentStepDef.sections.map((section) => (
              <FormSectionComponent key={section.id} section={section}>
                {renderFields(section.fields)}
              </FormSectionComponent>
            ))}
          </div>
        ) : currentStepDef.fields ? (
          renderFields(currentStepDef.fields)
        ) : null}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {!multi.isFirstStep && (
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center justify-center rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted focus:outline-hidden focus:ring-2 focus:ring-accent-focus"
            >
              <svg
                className="mr-1.5 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>
          )}
        </div>

        <div>
          {multi.isLastStep ? (
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-action-primary focus:outline-hidden focus:ring-2 focus:ring-accent-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              {schema.submitLabel ?? 'Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-action-primary focus:outline-hidden focus:ring-2 focus:ring-accent-focus"
            >
              Next
              <svg
                className="ml-1.5 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
