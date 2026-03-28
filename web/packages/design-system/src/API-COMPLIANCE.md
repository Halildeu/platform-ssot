# API Compliance Report

> **Package:** `@mfe/design-system`
> **Standard:** `src/internal/component-contract.ts`

---

## 1. Standard Component Contract

Every public component should conform to one of these contracts:

### Interactive Component (Base)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | Visual size of the component |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | No | Spacing and padding density |
| `className` | `string` | No | Additional CSS classes |
| `disabled` | `boolean` | No | Whether the component is disabled |
| `data-testid` | `string` | No | Test identifier |

### Form Field Component (extends Interactive)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `React.ReactNode` | No | Field label |
| `description` | `React.ReactNode` | No | Helper text below the field |
| `error` | `boolean \| string` | No | Error state or message |
| `readOnly` | `boolean` | No | Whether the field is read-only |
| `loading` | `boolean` | No | Loading state |
| `required` | `boolean` | No | Required field indicator |

### Overlay Component

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Whether the overlay is open |
| `onClose` | `() => void` | Yes | Callback when overlay should close |
| `closeOnEscape` | `boolean` | No | Close on Escape key |
| `className` | `string` | No | Additional CSS classes |

---

## 2. Current Compliance per Component

### Primitives -- Form Controls

| Component | Contract | `size` | `density` | `className` | `disabled` | `label` | `error` | `readOnly` | `loading` | Notes |
|-----------|----------|--------|-----------|-------------|------------|---------|---------|------------|-----------|-------|
| Button | interactive | `size` | `density` | yes | yes | -- | -- | -- | `loading` | Fully compliant |
| Input | form-field | `size` | `density` | yes | yes | yes | `error` + `invalid` | yes | yes | Uses both `error` and `invalid` |
| Select | form-field | `size` ✅ | `density` | yes | yes | deprecated | `error` | -- | yes | `selectSize` deprecated → `size` alias active |
| Switch | form-field | `size` ✅ | `density` | yes | yes | yes | -- | -- | yes | `switchSize` deprecated → `size` alias active |
| Checkbox | form-field | `size` ✅ | `density` | yes | yes | yes | `error` | -- | -- | `checkboxSize` deprecated → `size` alias active |
| Radio | form-field | `size` ✅ | `density` | yes | yes | yes | `error` | -- | -- | `radioSize` deprecated → `size` alias active |

### Primitives -- Overlays

| Component | Contract | `open` | `onClose` | `closeOnEscape` | `className` | Notes |
|-----------|----------|--------|-----------|-----------------|-------------|-------|
| Dialog | overlay | yes | yes | yes | yes | Fully compliant |
| Modal | overlay | yes | yes | yes | yes | Fully compliant |
| Popover | overlay | yes | yes | -- | yes | Missing `closeOnEscape` |
| Tooltip | overlay | -- | -- | -- | yes | Trigger-based, different pattern |
| Dropdown | overlay | -- | -- | -- | yes | Trigger-based, different pattern |

### Primitives -- Display

| Component | Contract | `size` | `className` | `disabled` | Notes |
|-----------|----------|--------|-------------|------------|-------|
| Text | interactive | `size` | yes | -- | Display-only, disabled N/A |
| Badge | interactive | `size` | yes | -- | Display-only |
| Tag | interactive | `size` | yes | -- | Display-only |
| Avatar | interactive | `size` | yes | -- | Display-only |
| Alert | interactive | -- | yes | -- | Uses `variant` for severity |
| Spinner | interactive | `size` | yes | -- | Display-only |
| Skeleton | interactive | -- | yes | -- | Display-only |
| Card | interactive | -- | yes | -- | Layout component |
| Divider | interactive | -- | yes | -- | Layout component |
| IconButton | interactive | `size` | yes | yes | Fully compliant |

---

## 3. Known Prop Naming Inconsistencies

| Component | Current Prop | Standard Prop | Severity | Migration |
|-----------|-------------|---------------|----------|-----------|
| Select | `selectSize` | `size` | ✅ DONE | Both accepted; `size` takes precedence; `selectSize` deprecated with console.warn |
| Switch | `switchSize` | `size` | ✅ DONE | Both accepted; `size` takes precedence; `switchSize` deprecated with console.warn |
| Checkbox | `checkboxSize` | `size` | ✅ DONE | Both accepted; `size` takes precedence; `checkboxSize` deprecated with console.warn |
| Radio | `radioSize` | `size` | ✅ DONE | Both accepted; `size` takes precedence; `radioSize` deprecated with console.warn |
| Input | `invalid` | `error` (boolean) | ✅ DONE | Both accepted; `invalid` marked @deprecated with JSDoc |
| Textarea | `invalid` | `error` (boolean) | ✅ DONE | Both accepted; `invalid` marked @deprecated with JSDoc |
| Select | `label` (deprecated) | `label` | Low | Already deprecated in Select; consumers should use FormField wrapper |

---

## 4. Migration Plan

### Phase 1: Add Standard Props (Minor Release)

For each component with a non-standard size prop:

1. Add `size` as the primary prop.
2. Keep the prefixed variant (`selectSize`, etc.) as a deprecated alias.
3. Resolution order: `size ?? selectSize ?? 'md'`.
4. Add `console.warn` in development mode when the deprecated prop is used.

Example implementation:

```ts
// In Select.tsx
interface SelectProps {
  /** @deprecated Use `size` instead */
  selectSize?: SelectSize;
  size?: SelectSize;
  // ...
}

// In component body:
const resolvedSize = size ?? selectSize ?? 'md';
if (process.env.NODE_ENV !== 'production' && selectSize !== undefined) {
  console.warn('[@mfe/design-system] Select: `selectSize` is deprecated. Use `size` instead.');
}
```

### Phase 2: Deprecation Warning Period (2 Minor Releases)

- Prefixed props continue to work with runtime warnings.
- Documentation updated to show standard prop names only.
- Codemods provided for automated migration.

### Phase 3: Removal (Next Major Release)

- Prefixed props removed from interfaces.
- `detect-breaking.mjs` baseline updated.
- Migration guide published in changelog.
