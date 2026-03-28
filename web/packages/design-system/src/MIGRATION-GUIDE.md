# v2.0.0 Migration Guide

> **Package:** `@mfe/design-system`
> **Updated:** 2026-03-20
> **Codemod:** `scripts/codemods/remove-deprecated-aliases.mjs`

---

## Overview

v2.0.0 removes all 107 deprecated APIs that were announced in v1.x minor releases. All deprecated props, type aliases, and component renames have been removed from the source.

**Automated migration:** Run the codemod to handle most changes automatically:

```bash
node scripts/codemods/remove-deprecated-aliases.mjs --dry-run   # preview
node scripts/codemods/remove-deprecated-aliases.mjs              # apply
```

---

## Breaking Changes Summary

| Category | Count | Description |
|----------|-------|-------------|
| Prop renames | 26 | Old prop names removed — use new names |
| Removed props | 80 | Backward-compat props that were silently ignored — now deleted |
| Type renames | 2 | `BadgeTone` → `BadgeVariant`, `TagColor` → `TagVariant` |
| Component renames | 1 | `Empty` → `EmptyState` |

---

## Prop Renames (search-and-replace)

These props were renamed in v1.x with backward compat. In v2.0.0 the old names no longer work.

| Component | Old Prop | New Prop |
|-----------|----------|----------|
| Badge | `tone` | `variant` |
| Checkbox | `checkboxSize` | `size` |
| Checkbox | `onCheckedChange` | `onChange` |
| Input | `inputSize` | `size` |
| Input | `invalid` | `error` |
| Pagination | `totalItems` | `total` |
| Pagination | `page` | `current` |
| Pagination | `onPageChange` | `onChange` |
| Radio | `radioSize` | `size` |
| SearchInput | `searchSize` | `size` |
| Select | `selectSize` | `size` |
| Select | `onValueChange` | `onChange` (native `ChangeEvent`) |
| Switch | `switchSize` | `size` |
| Tabs | `activeTabId` | `activeKey` |
| Tabs | `onValueChange` | `onChange` |
| Textarea | `invalid` | `error` |
| Tooltip | `text` | `content` |

### Examples

```tsx
// Badge: tone → variant
- <Badge tone="info">New</Badge>
+ <Badge variant="info">New</Badge>

// Checkbox: checkboxSize → size
- <Checkbox checkboxSize="lg" />
+ <Checkbox size="lg" />

// Input: inputSize → size, invalid → error
- <Input inputSize="sm" invalid />
+ <Input size="sm" error />

// Pagination: totalItems → total, page → current, onPageChange → onChange
- <Pagination totalItems={100} page={1} onPageChange={fn} />
+ <Pagination total={100} current={1} onChange={fn} />

// Select: selectSize → size, onValueChange → onChange
- <Select selectSize="lg" onValueChange={(v) => setValue(v)} />
+ <Select size="lg" onChange={(e) => setValue(e.target.value)} />
// Note: Select.onChange is a native ChangeEvent, not a value callback

// Switch: switchSize → size
- <Switch switchSize="sm" />
+ <Switch size="sm" />

// Tabs: activeTabId → activeKey
- <Tabs activeTabId="tab1" onValueChange={fn} />
+ <Tabs activeKey="tab1" onChange={fn} />

// Tooltip: text → content
- <Tooltip text="Help text"><Button>?</Button></Tooltip>
+ <Tooltip content="Help text"><Button>?</Button></Tooltip>
```

---

## Type Renames

| Old Type | New Type |
|----------|----------|
| `BadgeTone` | `BadgeVariant` |
| `TagColor` | `TagVariant` |

```tsx
- import type { BadgeTone } from '@mfe/design-system';
+ import type { BadgeVariant } from '@mfe/design-system';
```

---

## Component Renames

| Old Name | New Name |
|----------|----------|
| `Empty` | `EmptyState` |

```tsx
- import { Empty } from '@mfe/design-system';
+ import { EmptyState } from '@mfe/design-system';
```

---

## Removed Props (no replacement needed)

These props were accepted but silently ignored in v1.x. They are now removed from the type interface. Simply delete them from your JSX.

### Checkbox
`hint`, `invalid`, `fullWidth`

### DetailDrawer
`width`, `height`, `extra`, `tabs`, `onTabChange`, `closeOnOverlayClick`, `closeOnEscape`, `keepMounted`, `destroyOnHidden`, `transitionPreset`, `portalTarget`, `disablePortal`, `classes`, `access`, `accessReason`

> **DetailDrawer manual migration:** If you used `width`/`height`, use CSS or the `size` prop. If you used `tabs`/`onTabChange`, compose `<Tabs>` inside the drawer body.

### Modal
`transitionPreset`, `access`, `accessReason`

### Pagination
`mode`, `showPageInfo`, `showSizeChanger`, `pageSizeOptions`, `showQuickJumper`, `localeText`, `simple`, `shape`, `appearance`, `align`, `access`, `accessReason`, `compact`, `showFirstLastButtons`, `boundaryCount`, `onPageSizeChange`

### Select
`description`, `disabledReason`, `title`, `metaLabel`, `tone`, `keywords`, `label`, `hint`, `invalid`, `clearable`, `clearLabel`, `emptyOptionLabel`, `emptyStateLabel`, `showSelectionMeta`, `selectionMetaAriaLabel`

### Skeleton
`variant` — Skeleton no longer has a variant prop. Use `circle`, `height`, `width` props for shape control.

### Steps
`value` (alias for `current`), `onValueChange` (alias for `onChange`), `optional`, `interactive`, `orientation` (alias for `direction`)

### Switch
`fullWidth`

### Tabs
`appearance`, `listLabel`, `orientation`, `direction`

### Tag
`TagTone` type, `tone` prop — use `variant` instead

### Text
`preset`, `access`, `accessReason`

### Textarea
`autoResize` — use `resize="auto"` instead

### Other
- **Alert:** `severity`, `description`, `banner`
- **Button:** `loadingLabel`
- **Descriptions:** `access`, `accessReason`
- **EntityGridTemplate:** `ColumnApi` (removed in AG Grid v31+, use `GridApi`)
- **PageLayout:** `access`, `accessReason`
- **Segmented:** `access`, `accessReason`
- **SummaryStrip:** `access`, `accessReason`

---

## Codemod Coverage

The automated codemod handles:
- All prop renames (find old → replace with new)
- Prop removals (delete from JSX)
- Type renames (update imports)
- Component renames (`Empty` → `EmptyState`)
- Manual migration warnings for complex cases (DetailDrawer `width`/`height`/`tabs`)

Run with `--dry-run` first to preview changes.

---

## Select `onChange` API Change

**Important:** Select's callback changed from a value-based callback to a native event:

```tsx
// v1 (deprecated onValueChange)
<Select onValueChange={(value) => setValue(value)} />

// v2 (native onChange)
<Select onChange={(e) => setValue(e.target.value)} />
```

If you used `PaginationSizeChanger` directly, its `onValueChange` prop is unchanged — it internally handles the Select event conversion.

---

_Total deprecated APIs removed: 107 (across 26 source files)_
_Codemod: `scripts/codemods/remove-deprecated-aliases.mjs`_
