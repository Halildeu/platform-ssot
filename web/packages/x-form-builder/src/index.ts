/* ------------------------------------------------------------------ */
/*  @mfe/x-form-builder — Schema-driven form renderer                  */
/*                                                                     */
/*  @deprecated This package is superseded by @mfe/design-system/form  */
/*  which provides useForm, useFormField, ConnectedInput/Select/etc,   */
/*  createZodValidator, zodResolver, and RHF adapter out of the box.   */
/*                                                                     */
/*  Migration: import { useForm, createZodValidator, ConnectedInput }  */
/*             from '@mfe/design-system/form';                         */
/*                                                                     */
/*  This package will be removed in the next major version.            */
/* ------------------------------------------------------------------ */

if (typeof console !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.warn(
    '[@mfe/x-form-builder] This package is deprecated. ' +
    'Use @mfe/design-system/form instead. ' +
    'See: web/packages/design-system/docs/recipes/react-hook-form.md',
  );
}

/* ---- Types ---- */
export type {
  FieldType,
  FieldSchema,
  FieldValidation,
  FieldDependency,
  FormSchema,
  FormValues,
  FormErrors,
  FormSection,
  FormStep,
  ConditionalRule,
  AsyncValidator,
  MultiStepFormSchema,
} from './types';

/* ---- Core components ---- */
export { FormRenderer } from './FormRenderer';
export type { FormRendererProps } from './FormRenderer';

export { FormPreview } from './FormPreview';
export type { FormPreviewProps } from './FormPreview';

export { FieldRenderer } from './FieldRenderer';
export type { FieldRendererProps } from './FieldRenderer';

/* ---- Field registry ---- */
export {
  FieldRegistryContext,
  FieldRegistryProvider,
  createFieldRegistry,
} from './FieldRegistry';
export type { FieldRegistry, FieldRegistryProviderProps } from './FieldRegistry';

/* ---- Sections & Multi-step ---- */
export { FormSectionComponent } from './FormSection';
export type { FormSectionProps } from './FormSection';

export { MultiStepForm } from './MultiStepForm';
export type { MultiStepFormProps } from './MultiStepForm';

export { FormSummary } from './FormSummary';
export type { FormSummaryProps } from './FormSummary';

export { RepeatableFieldGroup } from './RepeatableFieldGroup';
export type { RepeatableFieldGroupProps } from './RepeatableFieldGroup';

/* ---- Validation adapter ---- */
export { createSchemaValidator, createZodValidator, toZodSchema, fromZodSchema, isZodAvailable } from './zodAdapter';
export type { SchemaValidator } from './zodAdapter';

/* ---- Hooks ---- */
export { useFormSchema, useZodForm } from './useFormSchema';
export type { UseFormSchemaReturn, UseFormSchemaOptions } from './useFormSchema';

export { useConditionalLogic } from './useConditionalLogic';
export type { ConditionalLogicResult } from './useConditionalLogic';

export { useAsyncValidation } from './useAsyncValidation';
export type { AsyncValidationResult } from './useAsyncValidation';

export { useMultiStepForm } from './useMultiStepForm';
export type { UseMultiStepFormReturn } from './useMultiStepForm';

/* ---- Default field renderers (for custom registries) ---- */
export {
  TextFieldRenderer,
  NumberFieldRenderer,
  SelectFieldRenderer,
  MultiselectFieldRenderer,
  CheckboxFieldRenderer,
  RadioFieldRenderer,
  SwitchFieldRenderer,
  TextareaFieldRenderer,
  DateFieldRenderer,
  TimeFieldRenderer,
  FileFieldRenderer,
  CustomFieldRenderer,
} from './FieldRenderer';
