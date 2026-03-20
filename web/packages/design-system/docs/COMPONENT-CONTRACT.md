# Component API Contract

Every public component in `@mfe/design-system` MUST implement this contract.

For authoring workflow, profile selection, scaffold usage, and family-specific decisions, start with:

- [Component Authoring Guide](./COMPONENT-AUTHORING.md)

---

## Required Props (where applicable)

### Interactive Components (Button, IconButton, Dropdown, Tag, LinkInline, etc.)

| Prop | Type | Description |
|------|------|-------------|
| `disabled?` | `boolean` | Renders `aria-disabled`, blocks interaction |
| `access?` | `'full' \| 'readonly' \| 'disabled' \| 'hidden'` | Access control via `resolveAccessState` |
| `accessReason?` | `string` | Tooltip/title text explaining access restriction |
| `className?` | `string` | Additional CSS classes |
| `ref` | forwarded via `forwardRef` | Ref to root or primary interactive element |

### Form Components (Input, Textarea, Select, Checkbox, Radio, Switch, Combobox, DatePicker, Slider)

| Prop | Type | Description |
|------|------|-------------|
| `value` / `checked` | varies | Controlled mode |
| `defaultValue` / `defaultChecked` | varies | Uncontrolled mode |
| `onChange` | handler | Standard change handler |
| `error?` | `boolean \| string \| ReactNode` | Error state + optional message |
| `disabled?` | `boolean` | Disabled state |
| `readOnly?` | `boolean` | Read-only state |
| `required?` | `boolean` | Required field indicator |
| `name?` | `string` | Form submission name |
| `id?` | `string` | Element ID (auto-generated if omitted) |
| `loading?` | `boolean` | Loading indicator, makes input non-interactive |
| `label?` | `ReactNode` | Field label |
| `description?` | `ReactNode` | Helper text below label |
| `hint?` | `ReactNode` | Supplementary hint text |

Every form component must support **both** controlled and uncontrolled modes.

### Overlay Components (Dialog, Modal, Popover, Dropdown, Tooltip)

| Prop | Type | Description |
|------|------|-------------|
| `open` / controlled state | `boolean` | Whether the overlay is visible |
| `onClose` / `onOpenChange` | handler | Callback when overlay should close |
| `closeOnEscape?` | `boolean` | Close on Escape key press |
| `className?` | `string` | Additional CSS classes |

---

## Sizing

| Prop | Type | Description |
|------|------|-------------|
| `size?` | `'sm' \| 'md' \| 'lg'` (minimum) | Consistent name across all components |
| `density?` | `'compact' \| 'comfortable' \| 'spacious'` | Via context or direct prop |

**Rules:**
- The prop MUST be named `size` (never `inputSize`, `searchSize`, `selectSize`, etc.)
- Prefixed size props are allowed only as `@deprecated` aliases during migration
- Default value: `'md'`

---

## Variant / Appearance

| Prop | Type | Description |
|------|------|-------------|
| `variant?` | component-specific union | Visual style variant |

**Rules:**
- The prop MUST be named `variant` (never `tone`, `appearance`, `severity`, `surface`)
- Legacy names are allowed only as `@deprecated` aliases during migration

---

## Naming Rules

### Boolean props
- No `is` prefix: use `disabled` (not `isDisabled`), `loading` (not `isLoading`), `readOnly` (not `isReadOnly`)

### Event handlers
- `on` prefix: `onChange`, `onClose`, `onOpenChange`, `onCheckedChange`

### Deprecated props
- `@deprecated` JSDoc annotation on the type
- `console.warn` in `process.env.NODE_ENV !== 'production'` when the deprecated prop is used
- Resolution order: standard prop takes precedence over deprecated alias (e.g. `size ?? selectSize ?? 'md'`)

---

## Access Control

Every interactive component MUST integrate with the access control system:

```ts
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";

export interface MyComponentProps extends AccessControlledProps {
  // ...
}

// In component body:
const accessState = resolveAccessState(access);
if (accessState.isHidden) return null;
const isDisabled = disabled || accessState.isDisabled;
const isReadonly = accessState.isReadonly;
```

**Implementation requirements:**
- `access="hidden"` must cause the component to return `null`
- `access="disabled"` must disable all interaction
- `access="readonly"` must prevent value changes but keep visual presence
- `accessReason` must render as `title` attribute for tooltip

---

## displayName

Every exported component MUST set `displayName` immediately after its definition:

```ts
MyComponent.displayName = "MyComponent";
```

This is required for:
- React DevTools identification
- Error message clarity
- Component catalog enumeration

---

## forwardRef

Components that render a focusable or measurable DOM element MUST use `React.forwardRef`:

```ts
export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  (props, ref) => {
    // ...
  },
);
```

**Required for:** all form inputs, buttons, interactive controls, overlays with portals.
**Optional for:** purely display components (Badge, Spinner, Skeleton) though recommended.

---

## Implementation Checklist

For each new component:

- [ ] Props extend `AccessControlledProps` (if interactive)
- [ ] `forwardRef` applied (if focusable/measurable)
- [ ] `displayName` set
- [ ] Access control integrated via `resolveAccessState`
- [ ] `size` prop named correctly (no prefix)
- [ ] `variant` prop named correctly (not `tone`/`appearance`)
- [ ] `error` prop (if form field) supports `boolean | string | ReactNode`
- [ ] Both controlled and uncontrolled modes (if form field)
- [ ] `disabled`, `readOnly`, `loading` props (where applicable)
- [ ] CSS variables used (no hardcoded colors)
- [ ] Tests for each state: disabled, error, loading, readonly, access="hidden"
- [ ] axe-core a11y test (`expectNoA11yViolations`)
- [ ] `userEvent` interaction tests
- [ ] `@deprecated` JSDoc + console.warn for any legacy aliases

---

## Reference: AccessControlledProps

```ts
// From src/internal/access-controller.ts
export type AccessLevel = "full" | "readonly" | "disabled" | "hidden";

export type AccessControlledProps = {
  access?: AccessLevel;
  accessReason?: string;
};
```
