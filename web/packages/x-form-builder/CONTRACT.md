# @mfe/x-form-builder — API Contract v1

## Status: DRAFT | Date: 2026-03-21

## 1. Public API Surface

### Components
```tsx
FormRenderer
  props: {
    schema: FormSchema;
    data?: Record<string, unknown>;
    mode?: 'edit' | 'readonly' | 'preview';
    density?: 'compact' | 'comfortable' | 'spacious';
    onSubmit?: (data: Record<string, unknown>) => void;
    onChange?: (field: string, value: unknown) => void;
    onValidationError?: (errors: ValidationError[]) => void;
  }

FormBuilder
  props: {
    schema?: FormSchema;           // initial schema for editing
    fieldRegistry?: FieldRegistry;  // available field types
    onSchemaChange?: (schema: FormSchema) => void;
    onSave?: (schema: FormSchema) => void;
  }
  // reserved — drag-and-drop designer not active in v1

FieldRegistry
  props: {
    fields: FieldDefinition[];
    customRenderers?: Record<string, FieldRenderer>;
  }

FormPreview
  props: {
    schema: FormSchema;
    data?: Record<string, unknown>;
    splitView?: boolean;           // side-by-side schema + preview
  }
```

### Hooks
- `useFormSchema(schema)` — returns form state, validation, and exposes `SchemaValidator` instance
  - Built-in `SchemaValidator` from `FormSchema` validation rules (via `createSchemaValidator()`)
- `useFieldValidation(field, value)` — returns validation state for a single field: `{ valid, errors, touched }`
- `useConditionalFields(schema, data)` — returns visible field set based on conditional rules and current data

### Utilities
- `validateSchema(schema)` — validates the form schema itself (meta-validation)
- `evaluateCondition(condition, data)` — evaluates a visibility/validation condition
- `createSchemaValidator(schema)` — creates a `SchemaValidator` from `FormSchema` rules
- `schemaToJsonSchema(schema)` — exports to JSON Schema Draft 7

### Type Exports
- `FormRendererProps`, `FormBuilderProps`, `FormPreviewProps`
- `FormSchema`, `FieldDefinition`, `FieldType`
- `ValidationRule`, `ValidationError`, `ConditionalRule`
- `FieldRegistry`, `FieldRenderer`

### Base
- Extends `AdaptiveForm` layout system
- Schema format: JSON Schema Draft 7 compatible with UI extensions

### Validation
- Built-in `SchemaValidator` that evaluates `FieldSchema.validation` rules (required, min/max, minLength/maxLength, pattern, custom)

### Validation Architecture
- `SchemaValidator` interface abstracts all validation (`validate`, `validateField`)
- `createSchemaValidator(schema)` — built-in implementation from FormSchema rules

### Field Types
- `text` — single-line input
- `number` — numeric input with min/max/step
- `select` — dropdown with static or async options
- `date` — date picker (single date, range)
- `checkbox` — single or group
- `radio` — radio group
- `textarea` — multi-line text
- `file` — file upload with type/size constraints
- `custom` — consumer-provided renderer via FieldRegistry

## 2. Theme / Token Integration

### Consumed Tokens
- `--form-bg`, `--form-border`, `--form-border-focus`
- `--form-label-color`, `--form-label-font-weight`
- `--form-input-bg`, `--form-input-border`, `--form-input-border-radius`
- `--form-error-color`, `--form-error-bg`
- `--form-success-color`
- `--form-disabled-bg`, `--form-disabled-fg`
- Typography: `--font-family-ui`, `--font-size-label`, `--font-size-input`, `--font-size-helper`
- Spacing: `--form-gap-compact`, `--form-gap-comfortable`, `--form-gap-spacious`

### Dark Mode
- All form surfaces, inputs, and labels adapt via `[data-theme="dark"]`
- Validation error/success colors adjust for dark background contrast
- File upload dropzone adjusts background

### Density Support
- `compact` — reduced field gaps, smaller label font, inline labels where possible
- `comfortable` — standard field spacing (default)
- `spacious` — larger gaps, stacked labels, more padding in inputs

### Custom Theme Extension
- `themeOverrides` prop for partial token override
- Per-field custom class via `fieldClassName` in schema
- Form layout (columns, sections) independently styleable

## 3. Access Control

### Granularity
- **Component-level**: entire form visible/hidden
- **Section-level**: form sections individually controllable
- **Field-level**: per-field visibility, editability, and validation

### AccessControlledProps Integration
```tsx
<FormRenderer
  accessControl={{
    resource: 'form.{formId}',
    fieldPermission: (fieldName: string) => Permission;
    sectionPermission: (sectionId: string) => Permission;
    actions: { submit: Permission; save_draft: Permission; reset: Permission }
  }}
/>
```

### Policy-Based Visibility States
- `full` — field editable with full validation
- `readonly` — field value displayed as text, not editable
- `disabled` — field rendered but greyed out, value included in submission
- `hidden` — field removed from layout, value excluded from submission

## 4. SSR / Client Boundary

### Server-Renderable
- Form layout skeleton from schema
- Field labels and static text
- Readonly/preview mode (fully server-renderable)

### Client-Only (`'use client'`)
- FormBuilder designer (reserved for v2)
- Field validation (built-in SchemaValidator)
- Conditional field visibility (reactive)
- File upload interaction
- Date picker popup
- Select dropdown search and async loading

### Hydration Strategy
- SSR renders form layout with input elements (native HTML form)
- Client hydration attaches validation, conditional logic, and enhanced widgets
- Forms functional without JS in readonly/preview mode

### Streaming SSR
- Form skeleton with labels and layout streams first
- Enhanced field widgets mount progressively on client

## 5. Data Model

### Schema Shape
```typescript
interface FormSchema {
  id: string;
  version: string;
  title?: string;
  description?: string;
  sections: FormSection[];
  validation?: GlobalValidationRule[];
  conditionalRules?: ConditionalRule[];
}

interface FormSection {
  id: string;
  title?: string;
  columns?: 1 | 2 | 3;
  fields: FieldDefinition[];
}

interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  options?: SelectOption[] | AsyncOptionConfig;
  conditional?: ConditionalRule;
  metadata?: Record<string, unknown>;
}

type FieldType = 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'radio' | 'textarea' | 'file' | 'custom';

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: unknown;
  message: string;
}

interface ConditionalRule {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'notIn' | 'empty' | 'notEmpty';
  value?: unknown;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
  targetFields: string[];
}

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface AsyncOptionConfig {
  endpoint: string;
  labelKey: string;
  valueKey: string;
  searchParam?: string;
}
```

### Validation
- Schema itself validated via `validateSchema()` at load time
- Field validation runs on blur + submit via built-in `SchemaValidator`
- Cross-field validation via `GlobalValidationRule` (e.g., "end date > start date")
- Async validation supported for uniqueness checks

### State Management
- **Controlled**: `data` prop + `onChange` for external state management (e.g., React Hook Form)
- **Uncontrolled**: internal form state with `onSubmit` for simple use cases
- Dirty tracking, touched state, and submission count managed internally

### Async Data Loading
- Select options loaded asynchronously via `AsyncOptionConfig`
- Schema can be loaded asynchronously (FormRenderer shows skeleton until schema arrives)
- File upload with progress tracking

## 6. Accessibility

### WCAG Target
- **AA** minimum

### Keyboard Navigation
- `Tab` / `Shift+Tab` to navigate between fields
- `Enter` to submit form (configurable)
- `Space` to toggle checkboxes and radio buttons
- Arrow keys within radio groups and select dropdowns
- `Escape` to close dropdown/date picker
- FormBuilder: `Space` to pick up field, arrows to reorder, `Space` to drop

### Screen Reader Announcements
- Field labels associated via `<label>` elements
- Required fields announced: "Name, required, text input"
- Validation errors announced on blur: "Email, invalid, please enter a valid email address"
- Form submission result announced
- Conditional field appearance/disappearance announced via `aria-live="polite"`
- `aria-live="polite"` for async validation results

### Focus Management
- Focus moves to first error field on validation failure
- Focus returns to trigger when closing date picker/dropdown
- Visible focus ring on all interactive elements
- FormBuilder: focus follows dragged field

### ARIA Attributes
- `aria-required` on required fields
- `aria-invalid` and `aria-errormessage` on validation failure
- `aria-describedby` linking to helper text and error messages
- `role="group"` on checkbox/radio groups with `aria-labelledby`
- `role="form"` on form container with `aria-label`

## 7. Performance Budget

### Bundle Size
- **< 20 KB** gzipped (built-in SchemaValidator)
- FieldRegistry custom renderers loaded on demand
- Date picker and file upload widgets lazy-loaded

### Render Targets
- **50 fields**: initial render < 100ms
- **Field validation** (single): < 10ms
- **Full form validation** (50 fields): < 50ms
- **Conditional field re-evaluation**: < 16ms (single frame)
- **Schema parsing**: < 50ms for 100-field schema

### Memory Budget
- FormRenderer: < 3MB for 50-field form
- FormBuilder: < 8MB with drag-and-drop state
- Validation schema generated once and cached

### Lazy Loading
- FormBuilder loaded separately from FormRenderer (not included in renderer bundle)
- Date picker widget loaded on first date field focus
- File upload widget loaded on first file field interaction
- Async select loaded on first dropdown open

## 8. Test & Docs Exit Criteria

### Tests
- **30 unit tests** — schema parsing, validation rule generation, conditional evaluation, field type rendering
- **8 integration tests** — full form render, validation flow, conditional fields, async options, file upload
- **4 visual regression tests** — default form, dark mode, validation error states, density variants

### Contract Tests
- JSON Schema Draft 7 compatibility for schema import/export
- SchemaValidator interface contract verified
- AdaptiveForm layout contract verification

### Documentation
- API reference page with full props table
- **8 examples** — basic form, validation, conditional fields, custom field, async select, file upload, FormBuilder, readonly mode
- **3 recipes** — multi-step wizard, dynamic form from API schema, embedded form with external state

---

## v2 Roadmap (Out of Scope for v1)

> v1 scope is frozen. Items below are tracked for v2 and do not affect v1 quality gates.

### FormBuilder Drag-and-Drop Designer
- Full drag-and-drop form designer UI
- FormBuilder separately chunked, not included in FormRenderer bundle
- FormBuilder drag-and-drop integration tests

### Zod / AJV Validation Adapters
- `createZodValidator(zodSchema)` — Zod-backed `SchemaValidator` implementation (same interface, drop-in replacement)
- `toZodSchema(formSchema)` / `fromZodSchema(zodSchema)` — bidirectional conversion
- `schemaToZod(schema)` — converts FormSchema to zod validation schema
- `ajv` adapter for strict JSON Schema Draft 7 compliance
- Zod schema generation correctness contract tests for all field types
- v2 bundle budget: < 35 KB gzipped (excluding zod ~13KB)
