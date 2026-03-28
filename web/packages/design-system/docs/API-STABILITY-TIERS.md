# API Stability Tiers

> **Package:** `@mfe/design-system`
> **Generated from source:** 2026-03-20
> **Tier policy:** See [DEPRECATION-POLICY.md](../DEPRECATION-POLICY.md)

## Tier Definitions

- **Stable**: Core API. Will not change without major version bump. Safe for production use.
- **Experimental**: May evolve in minor releases. Use with awareness of potential changes.
- **Deprecated**: Scheduled for removal in next major version. Migration path documented in JSDoc.

---

## Component API Tiers

### Button

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `variant` | Stable | v1.0 | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` |
| `size` | Stable | v1.0 | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` |
| `density` | Stable | v1.0 | `"compact" \| "comfortable" \| "spacious"` |
| `loading` | Stable | v1.0 | Shows spinner, disables interaction |
| `loadingLabel` | Deprecated | v1.0 | Label shown while loading. Backward compat only |
| `leftIcon` | Stable | v1.0 | Icon placed before children |
| `rightIcon` | Stable | v1.0 | Icon placed after children |
| `fullWidth` | Stable | v1.0 | Stretch to fill parent width |
| `iconOnly` | Stable | v1.0 | Square aspect ratio for icon-only buttons |
| `access` | Stable | v1.0 | `AccessLevel` -- controls disabled/readonly/hidden state |
| `accessReason` | Stable | v1.0 | Tooltip text explaining access restriction |
| `disabled` | Stable | v1.0 | Native HTML disabled attribute |
| `onClick` | Stable | v1.0 | Native click handler |
| `className` | Stable | v1.0 | Custom CSS class forwarding |
| `ref` | Stable | v1.0 | `forwardRef` to `HTMLButtonElement` |

### Input

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `label` | Stable | v1.0 | Field label |
| `description` | Stable | v1.0 | Descriptive text below label |
| `hint` | Stable | v1.0 | Hint text (hidden when `error` is set) |
| `error` | Stable | v1.0 | Error message; also sets `aria-invalid` |
| `invalid` | Deprecated | v1.0 | Use `error` instead. Will be removed in next major version |
| `size` | Stable | v1.0 | `FieldSize` (`"sm" \| "md" \| "lg"`) |
| `inputSize` | Deprecated | v1.0 | Use `size` instead |
| `density` | Stable | v1.0 | `FieldDensity` |
| `leadingVisual` | Stable | v1.0 | Node rendered before input |
| `trailingVisual` | Stable | v1.0 | Node rendered after input |
| `prefix` | Stable | v1.0 | Alias for `leadingVisual` |
| `suffix` | Stable | v1.0 | Alias for `trailingVisual` |
| `onChange` | Stable | v1.0 | Native change event handler |
| `onValueChange` | Stable | v1.0 | Convenience callback `(value: string, event) => void` |
| `showCount` | Stable | v1.0 | Show character count (sr-only) |
| `fullWidth` | Stable | v1.0 | Defaults to `true` |
| `loading` | Stable | v1.0 | Shows spinner in trailing slot, makes input readonly |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title text for access restriction |
| `ref` | Stable | v1.0 | `forwardRef` to `HTMLInputElement` |

### Select

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `options` | Stable | v1.0 | `SelectOption[]` -- required |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg"` |
| `selectSize` | Deprecated | v1.0 | Use `size` instead. Will be removed in next major version |
| `placeholder` | Stable | v1.0 | First disabled option text |
| `error` | Stable | v1.0 | `boolean \| string` |
| `fullWidth` | Stable | v1.0 | Defaults to `true` |
| `loading` | Stable | v1.0 | Shows spinner, disables select |
| `density` | Stable | v1.0 | `"compact" \| "comfortable" \| "spacious"` |
| `onChange` | Stable | v1.0 | Native change handler |
| `onValueChange` | Deprecated | v1.0 | Use `onChange` instead. Wired as fallback if `onChange` absent |
| `disabled` | Stable | v1.0 | Native disabled |
| `label` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `description` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `hint` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `invalid` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `clearable` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `clearLabel` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `emptyOptionLabel` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `emptyStateLabel` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `showSelectionMeta` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `selectionMetaAriaLabel` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `access` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `accessReason` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `ref` | Stable | v1.0 | `forwardRef` to `HTMLSelectElement` |

**SelectOption deprecated fields:** `description`, `disabledReason`, `title`, `metaLabel`, `tone`, `keywords` are all accepted but ignored.

### Checkbox

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `label` | Stable | v1.0 | Label text |
| `description` | Stable | v1.0 | Description text |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg"` |
| `checkboxSize` | Deprecated | v1.0 | Use `size` instead. Will be removed in next major version |
| `indeterminate` | Stable | v1.0 | Indeterminate visual state |
| `error` | Stable | v1.0 | Error border styling |
| `density` | Stable | v1.0 | `"compact" \| "comfortable" \| "spacious"` |
| `variant` | Stable | v1.0 | `"default" \| "card"` -- card wraps in bordered container |
| `checked` | Stable | v1.0 | Controlled checked state |
| `onChange` | Stable | v1.0 | Native change handler |
| `onCheckedChange` | Deprecated | v1.0 | Use `onChange` instead. Wired as fallback if `onChange` absent |
| `disabled` | Stable | v1.0 | Native disabled |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title text for access restriction |
| `hint` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `invalid` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `fullWidth` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `ref` | Stable | v1.0 | `forwardRef` to `HTMLInputElement` |

### Radio

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `label` | Stable | v1.0 | Label text |
| `description` | Stable | v1.0 | Description text |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg"` |
| `radioSize` | Deprecated | v1.0 | Use `size` instead. Will be removed in next major version |
| `density` | Stable | v1.0 | `"compact" \| "comfortable" \| "spacious"` |
| `error` | Stable | v1.0 | Error border styling |
| `checked` | Stable | v1.0 | Controlled checked state |
| `onChange` | Stable | v1.0 | Native change handler |
| `disabled` | Stable | v1.0 | Native disabled |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title text for access restriction |
| `ref` | Stable | v1.0 | `forwardRef` to `HTMLInputElement` |

**RadioGroup:**

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `name` | Stable | v1.0 | Required group name |
| `value` | Stable | v1.0 | Controlled selected value |
| `onChange` | Stable | v1.0 | `(value: string) => void` |
| `direction` | Stable | v1.0 | `"horizontal" \| "vertical"` |
| `className` | Stable | v1.0 | Custom class |
| `children` | Stable | v1.0 | `Radio` children |

### Switch

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `label` | Stable | v1.0 | Label text |
| `description` | Stable | v1.0 | Description text |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg"` |
| `switchSize` | Deprecated | v1.0 | Use `size` instead. Will be removed in next major version |
| `variant` | Stable | v1.0 | `"default" \| "destructive"` -- destructive uses error color |
| `density` | Stable | v1.0 | `"compact" \| "comfortable" \| "spacious"` |
| `checked` | Stable | v1.0 | Controlled checked state |
| `onCheckedChange` | Stable | v1.0 | `(checked: boolean) => void` |
| `loading` | Stable | v1.0 | Shows spinner on thumb, makes non-interactive |
| `disabled` | Stable | v1.0 | Native disabled |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title text for access restriction |
| `fullWidth` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `ref` | Stable | v1.0 | `forwardRef` to `HTMLInputElement` |

### Tabs

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `items` | Stable | v1.0 | `TabItem[]` -- required |
| `variant` | Stable | v1.0 | `"line" \| "enclosed" \| "pill"`. Legacy values `"standard"`, `"fullWidth"`, `"scrollable"` normalized to `"line"` |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg"` |
| `activeKey` | Stable | v1.0 | Controlled active tab key |
| `value` | Deprecated | v1.0 | Use `activeKey` instead |
| `defaultActiveKey` | Stable | v1.0 | Uncontrolled initial active key |
| `onChange` | Stable | v1.0 | `(key: string) => void` |
| `onValueChange` | Deprecated | v1.0 | Use `onChange` instead |
| `onCloseTab` | Stable | v1.0 | Called when closable tab close button clicked |
| `fullWidth` | Stable | v1.0 | Tabs stretch to fill width |
| `density` | Stable | v1.0 | `"compact" \| "comfortable" \| "spacious"` |
| `className` | Stable | v1.0 | Custom class |
| `appearance` | Deprecated | v1.0 | Ignored -- kept for backward compat |
| `listLabel` | Deprecated | v1.0 | Ignored -- kept for backward compat |
| `orientation` | Deprecated | v1.0 | Ignored -- kept for backward compat |
| `direction` | Deprecated | v1.0 | Ignored -- kept for backward compat |

**TabItem deprecated fields:** `value` (use `key` instead).

### Accordion

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `items` | Stable | v1.0 | `AccordionItem[]` -- required |
| `value` | Stable | v1.0 | Controlled expanded items (`string \| string[]`) |
| `defaultValue` | Stable | v1.0 | Initial expanded items |
| `onValueChange` | Stable | v1.0 | `(nextValue: string[]) => void` |
| `onItemToggle` | Stable | v1.0 | `(itemValue: string, expanded: boolean) => void` |
| `selectionMode` | Stable | v1.0 | `"single" \| "multiple"` |
| `ariaLabel` | Stable | v1.0 | Defaults to `"Accordion"` |
| `size` | Stable | v1.0 | `"sm" \| "md"` |
| `bordered` | Stable | v1.0 | Premium surface border |
| `ghost` | Stable | v1.0 | Transparent background |
| `showArrow` | Stable | v1.0 | Show chevron icon |
| `expandIcon` | Stable | v1.0 | Custom expand icon node |
| `expandIconPosition` | Stable | v1.0 | `"start" \| "end"` |
| `disableGutters` | Stable | v1.0 | Remove horizontal padding |
| `destroyOnHidden` | Stable | v1.0 | Unmount panel content when collapsed |
| `collapsible` | Stable | v1.0 | `"header" \| "icon" \| "disabled"` |
| `classes` | Stable | v1.0 | `AccordionClasses` -- per-slot CSS class overrides |
| `className` | Stable | v1.0 | Root class |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title text for access restriction |

### Dialog

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `open` | Stable | v1.0 | Required controlled state |
| `onClose` | Stable | v1.0 | Required close handler |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg" \| "xl" \| "full"` |
| `closable` | Stable | v1.0 | Show close button (default `true`) |
| `closeOnBackdrop` | Stable | v1.0 | Close on backdrop click (default `true`) |
| `closeOnEscape` | Stable | v1.0 | Close on Escape key (default `true`) |
| `title` | Stable | v1.0 | Header title |
| `description` | Stable | v1.0 | Description below title |
| `footer` | Stable | v1.0 | Footer content (action buttons) |
| `className` | Stable | v1.0 | Custom class |
| `children` | Stable | v1.0 | Body content |

### Modal

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `open` | Stable | v1.0 | Required controlled state |
| `onClose` | Stable | v1.0 | `(reason?: OverlayCloseReason) => void` |
| `title` | Stable | v1.0 | Header title |
| `footer` | Stable | v1.0 | Footer content |
| `size` | Stable | v1.0 | `"sm" \| "md" \| "lg"` |
| `maxWidth` | Stable | v1.0 | `number \| string` -- inline style override |
| `fullWidth` | Stable | v1.0 | Stretch to full width |
| `surface` | Stable | v1.0 | `"base" \| "confirm" \| "destructive" \| "audit"` |
| `closeOnOverlayClick` | Stable | v1.0 | Default `true` |
| `closeOnEscape` | Stable | v1.0 | Default `true` |
| `keepMounted` | Stable | v1.0 | Keep dialog in DOM when closed (hidden) |
| `destroyOnHidden` | Stable | v1.0 | Destroy content on close |
| `portalTarget` | Stable | v1.0 | Custom portal mount point |
| `disablePortal` | Stable | v1.0 | Render inline instead of portal |
| `classes` | Stable | v1.0 | `ModalClasses` -- per-slot CSS class overrides |
| `className` | Stable | v1.0 | Custom class |
| `children` | Stable | v1.0 | Body content |
| `transitionPreset` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `access` | Deprecated | v1.0 | Accepted for backward compat -- ignored |
| `accessReason` | Deprecated | v1.0 | Accepted for backward compat -- ignored |

### Popover

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `trigger` | Stable | v1.0 | Required trigger element or string |
| `content` | Stable | v1.0 | Required popover content |
| `title` | Stable | v1.0 | Optional popover title |
| `side` | Stable | v1.0 | `"top" \| "bottom" \| "left" \| "right"` |
| `align` | Stable | v1.0 | `"start" \| "center" \| "end"` |
| `triggerMode` | Stable | v1.0 | `"click" \| "hover" \| "focus" \| "hover-focus"` |
| `open` | Stable | v1.0 | Controlled open state |
| `defaultOpen` | Stable | v1.0 | Uncontrolled initial state |
| `onOpenChange` | Stable | v1.0 | `(open: boolean) => void` |
| `flipOnCollision` | Stable | v1.0 | Auto-flip when hitting viewport edge (default `true`) |
| `openDelay` | Stable | v1.0 | Delay before showing (ms) |
| `closeDelay` | Stable | v1.0 | Delay before hiding (ms) |
| `showArrow` | Stable | v1.0 | Show arrow indicator (default `true`) |
| `arrowClassName` | Stable | v1.0 | Custom arrow class |
| `panelClassName` | Stable | v1.0 | Custom panel class |
| `portalTarget` | Stable | v1.0 | Custom portal mount point |
| `disablePortal` | Stable | v1.0 | Render inline |
| `ariaLabel` | Stable | v1.0 | Accessible label (default `"Popover"`) |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title for access restriction |
| `className` | Stable | v1.0 | Custom class |

### Tooltip

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `content` | Stable | v1.0 | Primary tooltip content |
| `text` | Deprecated | v1.0 | Use `content` instead |
| `placement` | Stable | v1.0 | `"top" \| "bottom" \| "left" \| "right"` |
| `align` | Stable | v1.0 | `"start" \| "center" \| "end"` |
| `delay` | Stable | v1.0 | Delay before showing (ms). Alias for `openDelay` |
| `openDelay` | Stable | v1.0 | Delay before showing (ms). Takes precedence over `delay` |
| `closeDelay` | Stable | v1.0 | Delay before hiding (ms) |
| `disabled` | Stable | v1.0 | Disable tooltip entirely |
| `showArrow` | Stable | v1.0 | Show arrow indicator |
| `className` | Stable | v1.0 | Wrapper class |
| `children` | Stable | v1.0 | Trigger element |

### Toast (ToastProvider)

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `position` | Stable | v1.0 | `"top-right" \| "top-center" \| "bottom-right" \| "bottom-center"` |
| `duration` | Stable | v1.0 | Default auto-dismiss duration (ms). `0` disables auto-dismiss |
| `maxVisible` | Stable | v1.0 | Max visible toasts. Oldest dropped when exceeded |
| `children` | Stable | v1.0 | Application tree |

**useToast() API:**

| Method | Tier | Since | Notes |
|--------|------|-------|-------|
| `info(msg, opts?)` | Stable | v1.0 | Show info toast |
| `success(msg, opts?)` | Stable | v1.0 | Show success toast |
| `warning(msg, opts?)` | Stable | v1.0 | Show warning toast |
| `error(msg, opts?)` | Stable | v1.0 | Show error toast |
| `dismiss(id)` | Stable | v1.0 | Programmatically dismiss a toast |

### FormField

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `label` | Stable | v1.0 | Field label |
| `help` | Stable | v1.0 | Help text below input |
| `error` | Stable | v1.0 | Error message; sets `aria-invalid` on child |
| `required` | Stable | v1.0 | Shows required indicator (*) |
| `optional` | Stable | v1.0 | Shows "(optional)" text |
| `disabled` | Stable | v1.0 | Propagated to child input |
| `horizontal` | Stable | v1.0 | Horizontal layout mode |
| `htmlFor` | Stable | v1.0 | Custom ID for input association |
| `className` | Stable | v1.0 | Custom class |
| `children` | Stable | v1.0 | Input element(s) |

### Table (TableSimple)

| Prop | Tier | Since | Notes |
|------|------|-------|-------|
| `columns` | Stable | v1.0 | `TableSimpleColumn<Row>[]` -- required |
| `rows` | Stable | v1.0 | `Row[]` -- required |
| `caption` | Stable | v1.0 | Table caption |
| `description` | Stable | v1.0 | Description text below caption |
| `density` | Stable | v1.0 | `"comfortable" \| "compact"` |
| `striped` | Stable | v1.0 | Alternating row backgrounds (default `true`) |
| `stickyHeader` | Stable | v1.0 | Sticky table header |
| `loading` | Stable | v1.0 | Show skeleton rows |
| `fullWidth` | Stable | v1.0 | Full width (default `true`) |
| `emptyStateLabel` | Stable | v1.0 | Custom empty state text |
| `getRowKey` | Stable | v1.0 | Custom row key function |
| `localeText` | Stable | v1.0 | i18n overrides |
| `access` | Stable | v1.0 | `AccessLevel` |
| `accessReason` | Stable | v1.0 | Title text for access restriction |

---

## Summary Statistics

| Tier | Count |
|------|-------|
| Stable | ~120 props across 15 components |
| Deprecated | ~30 props (primarily legacy size aliases and compat shims from pre-v1 API) |
| Experimental | 0 |

All deprecated props follow the pattern documented in [DEPRECATION-POLICY.md](../DEPRECATION-POLICY.md): they are accepted without error, produce a `console.warn` in development mode, and will be removed in the next major version.
