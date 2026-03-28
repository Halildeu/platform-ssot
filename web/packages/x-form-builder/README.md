# @corp/x-form-builder

Schema-driven form engine for dynamic forms, multi-step wizards, and drag-and-drop form design. Integrates with Zod for validation and design-system components for rendering.

## Installation

```bash
pnpm add @corp/x-form-builder
```

Peer dependencies:

```bash
pnpm add @corp/design-system zod react-hook-form
```

## Quick Start

```tsx
import { FormRenderer } from '@corp/x-form-builder';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

const fields = [
  { name: 'name', label: 'Full Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'role', label: 'Role', type: 'select', options: ['admin', 'editor', 'viewer'] },
];

export function UserForm() {
  return (
    <FormRenderer
      fields={fields}
      schema={schema}
      onSubmit={(data) => console.log('Submitted:', data)}
    />
  );
}
```

## Multi-Step Wizard

```tsx
import { MultiStepForm } from '@corp/x-form-builder';

const steps = [
  {
    title: 'Personal Info',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'tel' },
    ],
  },
  {
    title: 'Preferences',
    fields: [
      { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox' },
      { name: 'theme', label: 'Theme', type: 'select', options: ['light', 'dark', 'system'] },
    ],
  },
];

export function OnboardingWizard() {
  return (
    <MultiStepForm
      steps={steps}
      onComplete={(data) => console.log('All steps:', data)}
      showProgressBar
    />
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `FormRenderer` | Renders a form from a field schema array |
| `MultiStepForm` | Multi-step wizard with progress bar and validation per step |
| `FormDesigner` | Drag-and-drop visual form builder |
| `FieldArray` | Dynamic add/remove field rows |

## Hooks

| Hook | Description |
|------|-------------|
| `useZodForm` | Binds a Zod schema to react-hook-form with type inference |
| `useConditionalLogic` | Show/hide fields based on other field values |
| `useFormPersist` | Auto-save form state to localStorage |

## API Reference

Full props documentation: [/api/x-form-builder](/api/x-form-builder)

## License

Private -- internal use only.
