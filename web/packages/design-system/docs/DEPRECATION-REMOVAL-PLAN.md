# Deprecation Removal Plan — v2.0.0

> **Status:** Active — all 107 `@deprecated` annotations are intentional backward-compat shims for v1.x consumers. They will be removed in v2.0.0.
> **Last updated:** 2026-03-20
> **Automated codemod:** `scripts/codemods/remove-deprecated-aliases.mjs`

---

## Summary

| Category | Count | Migration Effort | Codemod |
|---|---|---|---|
| Size alias props | 6 | Trivial — rename prop | ✅ Auto |
| Renamed/aliased props | 15 | Trivial — rename prop | ✅ Auto |
| Ignored compat props | 62 | Zero — just delete | ✅ Auto |
| Type aliases | 2 | Trivial — rename import | ✅ Auto |
| Component aliases | 2 | Trivial — rename import | ✅ Auto |
| Functional deprecated props | 5 | Medium — behavior change | ⚠️ Manual |
| **Total** | **107** | | |

---

## Category 1: Size Alias Props (6)

These are old `{component}Size` props renamed to the standard `size`.

| Component | Deprecated Prop | New Prop | File |
|---|---|---|---|
| Checkbox | `checkboxSize` | `size` | `primitives/checkbox/Checkbox.tsx:21` |
| Radio | `radioSize` | `size` | `primitives/radio/Radio.tsx:21` |
| Select | `selectSize` | `size` | `primitives/select/Select.tsx:45` |
| Switch | `switchSize` | `size` | `primitives/switch/Switch.tsx:31` |
| SearchInput | `searchSize` | `size` | `components/search-input/SearchInput.tsx:12` |
| Input | `inputSize` | `size` | `primitives/input/Input.tsx:45` |

**Migration:**
```diff
- <Checkbox checkboxSize="sm" />
+ <Checkbox size="sm" />
```

---

## Category 2: Renamed/Aliased Props (15)

Props that were renamed for API consistency. The old name maps to the new name internally.

| Component | Deprecated Prop | New Prop | File |
|---|---|---|---|
| Pagination | `totalItems` | `total` | `components/pagination/Pagination.tsx:13` |
| Pagination | `currentPage` | `current` | `components/pagination/Pagination.tsx:18` |
| Pagination | `onPageChange` | `onChange` | `components/pagination/Pagination.tsx:22` |
| Checkbox | `onCheckedChange` | `onChange` | `primitives/checkbox/Checkbox.tsx:41` |
| Select | `onSelectChange` | `onChange` | `primitives/select/Select.tsx:71` |
| Tabs | `tabId` (on TabItem) | `key` | `components/tabs/Tabs.tsx:25` |
| Tabs | `activeTabId` | `activeKey` | `components/tabs/Tabs.tsx:44` |
| Tabs | `onTabChange` | `onChange` | `components/tabs/Tabs.tsx:48` |
| Steps | `stepId` (on StepItem) | `key` | `components/steps/Steps.tsx:16` |
| Steps | `activeStep` | `current` | `components/steps/Steps.tsx:48` |
| Steps | `onStepChange` | `onChange` | `components/steps/Steps.tsx:50` |
| Tooltip | `tooltip` | `content` | `primitives/tooltip/Tooltip.tsx:16` |
| Tag | `color` | `variant` | `primitives/tag/Tag.tsx:19` |
| Badge | `color` | `variant` | `primitives/badge/Badge.tsx:26` |
| Alert | `severity` | `variant` | `primitives/alert/Alert.tsx:22` |

**Migration:**
```diff
- <Pagination totalItems={100} currentPage={1} onPageChange={fn} />
+ <Pagination total={100} current={1} onChange={fn} />

- <Tabs activeTabId="tab1" onTabChange={fn}>
+ <Tabs activeKey="tab1" onChange={fn}>
```

---

## Category 3: Ignored Compat Props (62)

Props accepted in the type signature but completely ignored at runtime. Removing them from consumer code has zero behavior change.

### Select (12 ignored props)
`mode`, `showSearch`, `allowClear`, `filterOption`, `notFoundContent`, `dropdownMatchSelectWidth`, `loading`, `maxTagCount`, `optionLabelProp`, `optionFilterProp`, `virtual`, `listHeight`

### Pagination (14 ignored props)
`showSizeChanger`, `showQuickJumper`, `showTotal`, `pageSizeOptions`, `simple`, `size`, `responsive`, `hideOnSinglePage`, `defaultCurrent`, `defaultPageSize`, `itemRender`, `access`, `accessReason`, `disabled`

### DetailDrawer (10 ignored props)
`closeOnMaskClick`, `destroyOnClose`, `keyboard`, `mask`, `maskClosable`, `maskStyle`, `zIndex`, `getContainer`, `afterOpenChange`, `afterClose`

### Checkbox (3 ignored props)
`indeterminate`, `autoFocus`

### Steps (2 ignored props)
`direction`, `progressDot`

### Tabs (4 ignored props)
`centered`, `animated`, `destroyInactiveTabPane`, `tabBarGutter`

### Textarea (1 ignored prop)
`hasError` → use `error` instead

### Input (1 ignored prop)
`hasError` → use `error` instead

### Others
- **PageLayout:** `headerBackground`, `sidebarCollapsed` (2)
- **SummaryStrip:** `variant`, `size` (2)
- **Modal:** `destroyOnClose`, `keyboard`, `centered` (3)
- **Skeleton:** `active` (1)
- **Text:** `truncate`, `access`, `accessReason` (3)
- **Button:** `loadingLabel` (1 — functional but deprecated)
- **Alert:** `message` (rendered as children), `closable` (ignored) (2)
- **Switch:** `autoFocus` (1)

**Migration:** Simply remove the prop from your JSX. No behavior change.
```diff
- <Select mode="default" showSearch allowClear value={v} onChange={fn} />
+ <Select value={v} onChange={fn} />
```

---

## Category 4: Type Aliases (2)

| Deprecated Type | New Type | File |
|---|---|---|
| `TagColor` | `TagVariant` | `primitives/tag/Tag.tsx:14` |
| `BadgeColor` | `BadgeVariant` | `primitives/badge/Badge.tsx:21` |

**Migration:**
```diff
- import { TagColor } from '@mfe/design-system';
+ import { TagVariant } from '@mfe/design-system';
```

---

## Category 5: Component Aliases (2)

| Deprecated Export | New Export | File |
|---|---|---|
| `Empty` | `EmptyState` | `components/empty-state/EmptyState.tsx:85` |
| `DetailDrawerTabSection` | `DetailDrawerTab` | `patterns/detail-drawer/index.ts:10` |

**Migration:**
```diff
- import { Empty } from '@mfe/design-system';
+ import { EmptyState } from '@mfe/design-system';
```

---

## Category 6: Functional Deprecated Props (5) — Manual Migration

These props actually change rendered output. Consumers must manually migrate.

| Component | Deprecated Prop | Migration Path |
|---|---|---|
| DetailDrawer | `width` | Use `size="sm" \| "md" \| "lg" \| "xl"` instead. If you need a custom pixel width, compose with `className` or `style` on a wrapper. |
| DetailDrawer | `maxHeight` | Drawer now fills viewport height. Use CSS `max-height` on content if needed. |
| DetailDrawer | `headerExtra` | Use the `actions` slot prop instead. |
| DetailDrawer | `tabs` | Compose `<Tabs>` inside drawer `children` instead of using the built-in tabs prop. |
| DetailDrawer | `onTabChange` | Compose `<Tabs onChange={fn}>` inside drawer `children`. |

---

## v2.0.0 Removal Checklist

1. [ ] Run codemod on all consumer apps: `node scripts/codemods/remove-deprecated-aliases.mjs --write apps/`
2. [ ] Review codemod output for Category 6 (manual migration) warnings
3. [ ] Remove all `@deprecated` prop definitions from component interfaces
4. [ ] Remove runtime compat logic (prop aliasing, console.warn calls)
5. [ ] Remove deprecated type aliases from exports
6. [ ] Remove deprecated component aliases from barrel exports
7. [ ] Update `scripts/ci/deprecation-audit.mjs` — switch to `--strict` mode (exit 1 if any remain)
8. [ ] Run full test suite — update/remove tests for deprecated props
9. [ ] Update CHANGELOG with breaking changes list
10. [ ] Update MIGRATION-NOTES.md with upgrade guide

---

## Deprecation Audit CI Gate

The `scripts/ci/deprecation-audit.mjs` runs as part of `pre-release-check.mjs` gate #7.

- **v1.x:** Non-strict mode — reports count, does NOT fail the build
- **v2.0.0:** Enable `--strict` mode — any remaining `@deprecated` annotation fails CI
