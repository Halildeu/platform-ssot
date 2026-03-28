# Migration Notes

> **Package:** `@mfe/design-system`
> **Last updated:** 2026-03-20

---

## 1. Deprecated Props and Their Replacements

The design system is standardizing prop names across all components. The following props have been deprecated and will be removed in the next major version (v2.0.0).

### Size Prop Renames

All component-prefixed size props are deprecated in favor of a unified `size` prop.

| Component | Deprecated Prop | Replacement | Status |
|-----------|----------------|-------------|--------|
| Select | `selectSize` | `size` | Both accepted; `size` takes precedence |
| Switch | `switchSize` | `size` | Both accepted; `size` takes precedence |
| Checkbox | `checkboxSize` | `size` | Both accepted; `size` takes precedence |
| Radio | `radioSize` | `size` | Both accepted; `size` takes precedence |

**Before:**

```tsx
<Select selectSize="lg" options={options} />
<Switch switchSize="sm" label="Toggle" />
<Checkbox checkboxSize="md" label="Accept" />
<Radio radioSize="md" value="a" label="Option A" />
```

**After:**

```tsx
<Select size="lg" options={options} />
<Switch size="sm" label="Toggle" />
<Checkbox size="md" label="Accept" />
<Radio size="md" value="a" label="Option A" />
```

### Validation Prop Renames

| Component | Deprecated Prop | Replacement | Notes |
|-----------|----------------|-------------|-------|
| Input | `invalid` (boolean) | `error` (string or boolean) | `error` can carry the error message directly |
| Textarea | `invalid` (boolean) | `error` (string or boolean) | Same pattern as Input |
| Textarea | `autoResize` (boolean) | `resize="auto"` | Use the `resize` prop instead |

**Before:**

```tsx
<Input invalid label="Email" />
<Textarea autoResize label="Notes" />
```

**After:**

```tsx
<Input error="Gecersiz e-posta adresi." label="Email" />
<Textarea resize="auto" label="Notes" />
```

### Alert Prop Renames

| Deprecated Prop | Replacement | Notes |
|----------------|-------------|-------|
| `severity` | `variant` | Same values: `info`, `success`, `warning`, `error` |
| `description` | `children` | Pass content as children instead |
| `banner` | _(removed)_ | Accepted but ignored for backward compatibility |

### Pagination Prop Renames

| Deprecated Prop | Replacement | Notes |
|----------------|-------------|-------|
| `totalItems` | `total` | Direct rename |
| `page` | `current` | Direct rename |
| `onPageChange` | `onChange` | Direct rename |
| `mode`, `simple`, `shape`, `appearance`, `compact` | _(removed)_ | Accepted but ignored |
| `showSizeChanger`, `pageSizeOptions`, `showQuickJumper` | _(removed)_ | Accepted but ignored |

### Steps Prop Renames

| Deprecated Prop | Replacement | Notes |
|----------------|-------------|-------|
| `value` (string) | `current` (number) | Use 0-based index |
| `onValueChange` | `onChange` | Direct rename |
| `interactive` | _(removed)_ | Accepted but ignored |
| `orientation` | `direction` | Use `horizontal` or `vertical` |

### Tooltip Prop Rename

| Deprecated Prop | Replacement | Notes |
|----------------|-------------|-------|
| `text` | `content` | Direct rename |

---

## 2. Breaking Changes from Ant Design Migration

The design system provides native replacements for all Ant Design components. The `ant-exit-plan.ts` file in `src/legacy/` tracks the full mapping.

### Key Ant Design to Native Mappings

| Ant Component | Native Replacement | Notes |
|---------------|-------------------|-------|
| `Button` | `Button` / `IconButton` | Direct replacement |
| `Input` | `Input` / `Textarea` | `TextInput` alias also available |
| `Select` | `Select` / `Combobox` | `Combobox` for searchable/multi-select |
| `Checkbox` | `Checkbox` | Direct replacement |
| `Radio` / `Radio.Group` | `Radio` / `RadioGroup` | Direct replacement |
| `Switch` | `Switch` | Direct replacement |
| `Modal` | `Modal` / `Dialog` | `Dialog` for simple confirm; `Modal` for rich content |
| `Drawer` | `Dialog` / `Modal` | Use overlay components |
| `Tooltip` | `Tooltip` | Direct replacement |
| `Dropdown` / `Menu` | `Dropdown` / `MenuBar` | Direct replacement |
| `Alert` | `Alert` | Direct replacement |
| `message` | `useToast()` | Hook-based API replaces imperative `message.success()` |
| `notification` | `useToast()` / `NotificationDrawer` | Toast for ephemeral; Drawer for persistent |
| `Tabs` | `Tabs` | Direct replacement |
| `Pagination` | `Pagination` | Direct replacement |
| `Steps` | `Steps` | Direct replacement |
| `Table` | `TableSimple` / `TreeTable` | `TableSimple` for basic; AG Grid for complex |
| `Calendar` | `Calendar` | Direct replacement |
| `DatePicker` | `DatePicker` | Direct replacement |
| `Form` | `FormField` / `AdaptiveForm` | `FormField` for individual fields |
| `Tree` | `Tree` / `TreeTable` | Direct replacement |
| `AutoComplete` | `Combobox` | Use `freeSolo` prop |
| `Collapse` | `Accordion` | Direct replacement |
| `Typography` | `Text` | Direct replacement |
| `Space` | `Stack` / `HStack` / `VStack` | Direct replacement |
| `Spin` | `Spinner` | Direct replacement |
| `Skeleton` | `Skeleton` | Direct replacement |
| `Empty` | `EmptyState` / `Empty` | Direct replacement |
| `Breadcrumb` | `Breadcrumb` | Direct replacement |
| `ConfigProvider` | `DesignSystemProvider` / `ThemeProvider` | Direct replacement |

---

## 3. Step-by-Step Migration Instructions

### Phase 1: Update Import Paths

Replace Ant Design imports with design-system imports:

```tsx
// Before
import { Button, Input, Select } from 'antd';

// After
import { Button } from '@mfe/design-system/primitives/button';
import { Input } from '@mfe/design-system/primitives/input';
import { Select } from '@mfe/design-system/primitives/select';
```

### Phase 2: Update Deprecated Props

1. Search your codebase for deprecated prop names using the tables above.
2. Replace each deprecated prop with its replacement.
3. Run the `no-new-ant-import` ESLint rule to catch any remaining Ant imports.

### Phase 3: Update Message/Notification API

Replace imperative message API with hook-based toast:

```tsx
// Before (Ant Design)
import { message } from 'antd';
message.success('Saved!');

// After (Design System)
import { useToast } from '@mfe/design-system/components/toast';
const toast = useToast();
toast.success('Saved!');
```

Wrap your app with `<ToastProvider>` at the root level.

### Phase 4: Update Form Patterns

Replace Ant Form with FormField wrapper or AdaptiveForm:

```tsx
// Before (Ant Design)
<Form.Item label="Name" rules={[{ required: true }]}>
  <Input />
</Form.Item>

// After (Design System)
<Input label="Name" required error={errors.name} />
```

---

## 4. ESLint Rule

The `no-new-ant-import` ESLint rule prevents new Ant Design imports. Enable it in your ESLint config:

```js
// .eslintrc.js
rules: {
  '@mfe/no-new-ant-import': 'error',
}
```

This rule suggests the native design-system replacement for each Ant component.

---

## 5. Access Control Migration

All form components and overlays now support access control props:

```tsx
interface AccessControlledProps {
  access?: 'full' | 'readonly' | 'disabled' | 'hidden';
  accessReason?: string;
}
```

Use these instead of manually managing `disabled` / `readOnly` states for permission-based UIs.

---

## 6. Timeline

| Phase | Version | What Happens |
|-------|---------|-------------|
| Current | v1.x | Deprecated props accepted with console warnings in development |
| Deprecation period | v1.x+1, v1.x+2 | Both old and new props work; documentation updated |
| Removal | v2.0.0 | Deprecated props removed from interfaces |

For the full deprecation policy, see `DEPRECATION-POLICY.md` in the package root.
