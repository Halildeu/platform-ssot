# Migration Notes

## Deprecation Timeline

| Phase | Duration | Behavior |
|-------|----------|----------|
| **Announced** | Current minor | `@deprecated` JSDoc tag added. `console.warn` in dev mode. API works. |
| **Deprecated** | 2 subsequent minors | Warning remains. Docs mark as deprecated. |
| **Removed** | Next major (v2.0.0) | Symbol deleted from public API. |

## Key Prop Renames

### Size props

| Component | Deprecated | Replacement |
|-----------|-----------|-------------|
| Select | `selectSize` | `size` |
| Switch | `switchSize` | `size` |
| Radio | `radioSize` | `size` |
| Checkbox | `checkboxSize` | `size` |
| Input | `inputSize` | `size` |

```tsx
// Before
<Select selectSize="md" />
<Switch switchSize="lg" />
<Radio radioSize="sm" />
<Checkbox checkboxSize="md" />
<Input inputSize="lg" />

// After
<Select size="md" />
<Switch size="lg" />
<Radio size="sm" />
<Checkbox size="md" />
<Input size="lg" />
```

### Validation props

| Component | Deprecated | Replacement |
|-----------|-----------|-------------|
| Input | `invalid` | `error` |
| Textarea | `invalid` | `error` |

```tsx
// Before
<Input invalid />
<Textarea invalid />

// After
<Input error />
<Textarea error="Field is required" />  // also accepts string messages
```

### Other renames

| Component | Deprecated | Replacement |
|-----------|-----------|-------------|
| Badge | `tone` | `variant` |
| Tooltip | `text` | `content` |
| Pagination | `totalItems` | `total` |
| Pagination | `page` | `current` |
| Pagination | `onPageChange` | `onChange` |
| Select | `onValueChange` | `onChange` |
| Checkbox | `onCheckedChange` | `onChange` |
| Tabs | `value` | `activeKey` |
| Tabs | `onValueChange` | `onChange` |

## Precedence Behavior

When both deprecated and new props are provided, the **new prop wins**.

```tsx
// `size` takes effect, `selectSize` is ignored
<Select selectSize="sm" size="lg" />  // renders as "lg"

// `error` takes effect, `invalid` is ignored
<Input invalid error="Required" />  // shows error message
```

## Props Safe to Remove (Ignored Compat)

These are accepted without warning but have no effect. Remove at your convenience:

- **Checkbox:** `hint`, `invalid`, `fullWidth`
- **Switch:** `fullWidth`
- **Select:** `description`, `disabledReason`, `title`, `metaLabel`, `tone`, `keywords`, `label`, `hint`, `invalid`, `clearable`, `clearLabel`, `emptyOptionLabel`, `emptyStateLabel`, `showSelectionMeta`, `selectionMetaAriaLabel`, `access`, `accessReason`
- **DetailDrawer:** `closeOnOverlayClick`, `closeOnEscape`, `keepMounted`, `destroyOnHidden`, `transitionPreset`, `portalTarget`, `disablePortal`, `classes`, `access`, `accessReason`

## Running the Migration Guide Generator

The full migration guide is auto-generated from source code annotations:

```bash
node scripts/ci/generate-migration-guide.mjs
```

This scans all component files for `@deprecated` JSDoc tags and generates `src/MIGRATION-GUIDE.md` with the complete table and per-component details.

## Full Reference

See `src/MIGRATION-GUIDE.md` for the exhaustive list of all deprecated APIs, including type renames and component-level details.
