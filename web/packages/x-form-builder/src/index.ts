/* ------------------------------------------------------------------ */
/*  @mfe/x-form-builder — Schema-driven form renderer                  */
/*                                                                     */
/*  Extends @mfe/design-system AdaptiveForm with a JSON-schema-based   */
/*  runtime renderer, extensible field registry, and form state hook.  */
/*  FormBuilder (visual designer) is planned for v2.                   */
/* ------------------------------------------------------------------ */

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
export { createSchemaValidator } from './zodAdapter';
export type { SchemaValidator } from './zodAdapter';

/* ---- Hooks ---- */
export { useFormSchema } from './useFormSchema';
export type { UseFormSchemaReturn } from './useFormSchema';

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
