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

/* ---- Hooks ---- */
export { useFormSchema } from './useFormSchema';
export type { UseFormSchemaReturn } from './useFormSchema';

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
