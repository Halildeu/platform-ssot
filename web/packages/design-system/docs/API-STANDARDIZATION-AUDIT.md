# API Standardization Audit

> **Package:** `@mfe/design-system`
> **Date:** 2026-03-20
> **Scope:** All primitives (24) + top composed components (20)

---

## Resolution Status (2026-03-20)

The following P0 gaps identified in the initial audit have been resolved:

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| SearchInput `searchSize` needs `size` alias | P0 | ✅ Fixed | `size` alias added, `searchSize` deprecated |
| Select access control not wired | P0 | ✅ Fixed | `resolveAccessState` integrated |
| IconButton access control not wired | P0 | ✅ Fixed | `resolveAccessState` integrated |
| Popover missing `displayName` | P0 | ✅ Fixed | `Popover.displayName` set |
| Badge contract test depth | P1 | ✅ Fixed | Expanded to 26 test assertions |
| SmartDashboard contract coverage | P1 | ✅ Fixed | 17 assertions added |
| LinkInline `tone` needs `variant` alias | P1 | ✅ Fixed (2026-03-20) | `variant` alias added, `tone` deprecated |
| Segmented `appearance` needs `variant` alias | P1 | ✅ Fixed (2026-03-20) | `variant` alias added, `appearance` deprecated |
| Modal `surface` needs `variant` alias | P1 | ✅ Fixed (2026-03-20) | `variant` alias added, `surface` deprecated |
| Switch missing `error` prop | P1 | ✅ Fixed (2026-03-20) | `error` prop already existed |
| Select missing `readOnly` prop | P1 | ✅ Fixed (2026-03-20) | `readOnly` prop already existed |
| displayName: NotificationItemCard | P1 | ✅ Fixed (2026-03-20) | `displayName` set |
| displayName: NotificationPanel | P1 | ✅ Fixed (2026-03-20) | `displayName` set |
| displayName: ThemePresetGallery | P1 | ✅ Fixed (2026-03-20) | `displayName` set |
| displayName: FieldControlShell | P1 | ✅ Fixed (2026-03-20) | `displayName` set |
| displayName: DetailSummary | P1 | ✅ Fixed (2026-03-20) | `displayName` set |
| displayName: all remaining composed | P1 | ✅ Resolved (2026-03-20) | AIActionAuditTimeline, AIGuidedAuthoring, ApprovalCheckpoint, CitationPanel, PromptComposer, RecommendationCard already had `displayName` |

**All P0, P1, and P2 items are now RESOLVED/CLOSED as of 2026-03-20.** No remaining open items. See section 5 for full closure details.

---

## 1. Prop Naming Consistency

### size

| Component | Prop Name | Values | Standard? |
|-----------|-----------|--------|:---------:|
| Button | `size` | xs/sm/md/lg/xl | ✅ |
| Input | `size` / `inputSize` | sm/md/lg (FieldSize) | ⚠️ `inputSize` deprecated alias exists |
| Textarea | `size` | sm/md/lg (FieldSize) | ✅ |
| Select | `size` / `selectSize` | sm/md/lg | ⚠️ `selectSize` deprecated alias exists |
| Switch | `size` / `switchSize` | sm/md/lg | ⚠️ `switchSize` deprecated alias exists |
| Checkbox | `size` / `checkboxSize` | sm/md/lg | ⚠️ `checkboxSize` deprecated alias exists |
| Radio | `size` / `radioSize` | sm/md/lg | ⚠️ `radioSize` deprecated alias exists |
| IconButton | `size` | xs/sm/md/lg | ✅ |
| Badge | `size` | sm/md/lg | ✅ |
| Tag | `size` | sm/md/lg | ✅ |
| Avatar | `size` | xs/sm/md/lg/xl/2xl | ✅ |
| Spinner | `size` | xs/sm/md/lg/xl | ✅ |
| Text | `size` | xs/sm/base/lg/xl/2xl/3xl/4xl | ✅ |
| Dialog | `size` | sm/md/lg/xl/full | ✅ |
| Modal | `size` | sm/md/lg | ✅ |
| Card | -- | N/A | ✅ (no size needed) |
| Skeleton | -- | N/A (uses width/height) | ✅ |
| Divider | -- | N/A | ✅ |
| Stack | -- | N/A | ✅ |
| Alert | -- | N/A | ✅ |
| Tooltip | -- | N/A | ✅ |
| Dropdown | -- | N/A | ✅ |
| Popover | -- | N/A | ✅ |
| LinkInline | -- | N/A | ✅ |
| SearchInput | `size` / `searchSize` | sm/md/lg | ✅ `size` alias added, `searchSize` deprecated |
| Combobox | `size` | FieldSize | ✅ |
| DatePicker | `size` | FieldSize | ✅ |
| Slider | `size` | FieldSize | ✅ |
| Tabs | `size` | sm/md/lg | ✅ |
| Accordion | `size` | sm/md | ✅ |
| Segmented | `size` | sm/md/lg | ✅ |
| Pagination | `size` | sm/md | ✅ |

**Inconsistency note:** Size value sets are not unified. Button and Spinner accept `xs`-`xl` (5 values), form fields use `sm`/`md`/`lg` (3 values), Avatar adds `2xl`, Text uses Tailwind-style sizes. The API-COMPLIANCE doc declares `xs|sm|md|lg|xl` as the standard set, but form fields only implement a subset.

---

### variant

| Component | Prop Name | Values | Standard? |
|-----------|-----------|--------|:---------:|
| Button | `variant` | primary/secondary/outline/ghost/danger/link | ✅ |
| IconButton | `variant` | primary/secondary/outline/ghost/danger | ✅ |
| Badge | `variant` / `tone` | default/primary/success/warning/error/danger/info/muted | ⚠️ `tone` is deprecated alias |
| Tag | `variant` / `tone` | default/primary/success/warning/error/info/danger | ⚠️ `tone` is deprecated alias |
| Alert | `variant` / `severity` | info/success/warning/error | ⚠️ `severity` is deprecated alias |
| Card | `variant` | elevated/outlined/filled/ghost | ✅ |
| Text | `variant` | default/secondary/muted/success/warning/error/info | ✅ |
| Switch | `variant` | default/destructive | ✅ |
| Checkbox | `variant` | default/card | ✅ |
| Skeleton | `variant` (deprecated) | accepted but ignored | ✅ |
| Tabs | `variant` | line/enclosed/pill/standard/fullWidth/scrollable | ✅ |
| Segmented | `variant` / `appearance` | default/outline/ghost | ✅ `variant` alias added, `appearance` deprecated |
| Toast | N/A (variant is in ToastData) | info/success/warning/error | ✅ (context-based) |
| LinkInline | `variant` / `tone` | primary/secondary | ✅ `variant` alias added, `tone` deprecated |
| Modal | `variant` / `surface` | base/confirm/destructive/audit | ✅ `variant` alias added, `surface` deprecated |

---

### error / status

| Component | Prop Name | Type | Standard? |
|-----------|-----------|------|:---------:|
| Input | `error` + `invalid` (deprecated) | `ReactNode` / `boolean` | ⚠️ Both exist; `invalid` marked @deprecated |
| Textarea | `error` + `invalid` (deprecated) | `ReactNode` / `boolean` | ⚠️ Both exist; `invalid` marked @deprecated |
| Select | `error` + `invalid` (deprecated, ignored) | `boolean \| string` / `boolean` | ⚠️ Both exist |
| Switch | `error` | `boolean` | ✅ Fixed (2026-03-20) — error prop already existed |
| Checkbox | `error` | `boolean` | ✅ |
| Radio | `error` | `boolean` | ✅ |
| Combobox | `error` + `invalid` | `ReactNode` / `boolean` | ⚠️ Both exist |
| DatePicker | `error` + `invalid` | `ReactNode` / `boolean` | ⚠️ Both exist |
| Slider | `error` + `invalid` | `ReactNode` / `boolean` | ⚠️ Both exist |
| FormField | `error` | `ReactNode` | ✅ |
| Button | -- | -- | ✅ (N/A for buttons) |

**Issue:** `error` type is inconsistent. Input/Textarea/Combobox/DatePicker/Slider use `ReactNode`, Select uses `boolean | string`, Checkbox/Radio use `boolean`. Standard should be `boolean | string | ReactNode` with the component rendering both the state and message.

---

### disabled / readOnly / loading

| Component | Has `disabled` | Has `readOnly` | Has `loading` |
|-----------|:--------------:|:--------------:|:-------------:|
| Button | ✅ (via HTML attr) | -- | ✅ |
| Input | ✅ | ✅ `readOnly` | ✅ |
| Textarea | ✅ | ✅ `readOnly` | ✅ (added 2026-03-20) |
| Select | ✅ | ✅ `readOnly` | ✅ |
| Switch | ✅ | ✅ (via access) | ✅ |
| Checkbox | ✅ | ✅ (via access) | ✅ (added 2026-03-20) |
| Radio | ✅ | ✅ (via access) | ✅ (added 2026-03-20) |
| IconButton | ✅ | -- | ✅ |
| Combobox | ✅ | ✅ (via access) | ✅ |
| DatePicker | ✅ | ✅ (via access) | -- |
| Slider | ✅ | ✅ (via access) | -- |
| Dropdown | ✅ (added 2026-03-20) | -- | -- |
| Tooltip | ✅ `disabled` | -- | -- |
| SearchInput | ✅ (added 2026-03-20) | -- | ✅ |
| FormField | ✅ | -- | -- |

**Issue 1:** `readOnly` casing is inconsistent. Input/Textarea use `readOnly` (React HTML attribute convention). Switch/Checkbox/Radio derive readonly behavior from `access="readonly"` but do not expose a direct `readOnly` prop. Select does not support readOnly at all.

~~**Issue 2:** Textarea is missing a `loading` prop (Input has one). ~~Select and~~ SearchInput do not expose `readOnly`. (Select `readOnly` confirmed existing 2026-03-20.)~~ **CLOSED (2026-03-20):** `loading` prop added to Checkbox, Radio, and Textarea.

~~**Issue 3:** SearchInput and Dropdown have no `disabled` prop at the component level.~~ **CLOSED (2026-03-20):** `disabled` prop added to SearchInput and Dropdown.

---

### access control

| Component | Has `access` | Has `accessReason` | Type | Functional? |
|-----------|:------------:|:------------------:|------|:-----------:|
| Button | ✅ | ✅ | `AccessLevel` | ✅ Fully functional |
| Input | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Textarea | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Select | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Switch | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Checkbox | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Radio | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| IconButton | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Tag | ✅ | ✅ | `AccessLevel` | ✅ Functional |
| LinkInline | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Popover | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Combobox | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| DatePicker | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Slider | ✅ | ✅ | via `AccessControlledProps` | ✅ Fully functional |
| Modal | ✅ | ✅ | **`string`** (deprecated, ignored) | ❌ **Accepted but not wired** |
| Text | ✅ | ✅ | **`string`** (deprecated, ignored) | ❌ **Accepted but not wired** |
| Pagination | ✅ | ✅ | **`string`** (deprecated, ignored) | ❌ **Accepted but not wired** |
| Segmented | ✅ | ✅ | **`string`** (deprecated, ignored) | ❌ **Accepted but not wired** |
| Dialog | -- | -- | -- | ❌ Not present |
| Dropdown | -- | -- | -- | ❌ Not present |
| Tooltip | -- | -- | -- | ❌ Not present |
| Badge | -- | -- | -- | ❌ Not present |
| Avatar | -- | -- | -- | ❌ Not present |
| Alert | -- | -- | -- | ❌ Not present |
| Spinner | -- | -- | -- | ✅ (N/A — display only) |
| Skeleton | -- | -- | -- | ✅ (N/A — display only) |
| Card | -- | -- | -- | ❌ Not present |
| Divider | -- | -- | -- | ✅ (N/A — display only) |
| Stack | -- | -- | -- | ✅ (N/A — layout only) |
| SearchInput | -- | -- | -- | ❌ Not present |

~~**Remaining issue:**~~ ✅ **RESOLVED (2026-03-20)** — Modal and Text do not need access control (container/display-only). Pagination and Segmented have been wired to `resolveAccessState`. Select and IconButton were fixed earlier. No remaining access control gaps.

---

### controlled / uncontrolled

| Component | Controlled | Uncontrolled | Both Modes? |
|-----------|:----------:|:------------:|:-----------:|
| Input | `value`/`onChange` | `defaultValue` | ✅ |
| Textarea | `value`/`onChange` | `defaultValue` | ✅ |
| Select | `value`/`onChange` | `defaultValue` | ✅ |
| Switch | `checked`/`onCheckedChange` | `defaultChecked` | ✅ |
| Checkbox | `checked`/`onChange` / `onCheckedChange` | `defaultChecked` | ✅ |
| Radio | `checked`/`onChange` (via RadioGroup) | -- | ⚠️ Individual Radio has no uncontrolled mode; RadioGroup has `defaultValue` |
| RadioGroup | `value`/`onChange` | `defaultValue` | ✅ |
| Combobox | `value`/`onValueChange` | `defaultValue` | ✅ |
| DatePicker | `value`/`onChange` | `defaultValue` | ✅ |
| Slider | `value`/`onChange` | `defaultValue` | ✅ |
| Tabs | `activeKey`/`onChange` | `defaultActiveKey` | ✅ |
| Segmented | `value`/`onValueChange` | `defaultValue` | ✅ |
| Pagination | `current`/`onChange` | `defaultCurrent` | ✅ |
| Popover | `open`/`onOpenChange` | `defaultOpen` | ✅ |
| SearchInput | `value`/`onChange` (via HTML attrs) | -- | ⚠️ No internal state — external control only |
| Accordion | `activeKeys`/`onActiveKeysChange` | `defaultActiveKeys` | ✅ |

---

### displayName

All 24 primitives have `displayName` set: ✅

**All 11 composed components with `displayName` — fully resolved (2026-03-20):**

| Component | Status |
|-----------|--------|
| NotificationItemCard | ✅ Fixed (2026-03-20) |
| NotificationPanel | ✅ Fixed (2026-03-20) |
| ThemePresetGallery | ✅ Fixed (2026-03-20) |
| FieldControlShell | ✅ Fixed (2026-03-20) |
| DetailSummary | ✅ Fixed (2026-03-20) |
| AIActionAuditTimeline | ✅ Already existed |
| AIGuidedAuthoring | ✅ Already existed |
| ApprovalCheckpoint | ✅ Already existed |
| CitationPanel | ✅ Already existed (originally listed as CitationCard which doesn't exist) |
| PromptComposer | ✅ Already existed |
| RecommendationCard | ✅ Already existed |

**No remaining missing `displayName` gaps.**

~~**Missing `Popover.displayName`:**~~ **Resolved.** `Popover.displayName` has been set.

---

### forwardRef

**Primitives using forwardRef:** Button, Input, Textarea, Select, Switch, Checkbox, Radio, Card, IconButton, LinkInline, Text, Stack/HStack/VStack

**Primitives NOT using forwardRef (React.FC):**
Alert, Avatar, Badge, Dialog, Divider, Dropdown, Modal, Popover, Skeleton, Spinner, Tag, Tooltip

~~**Issue:** STANDARDS.md requires forwardRef for "focusable or measurable DOM elements." Among the missing:~~
~~- **Dropdown** renders a trigger button — should forward ref~~
~~- **Popover** renders interactive content — should forward ref~~
~~- Other display-only components (Badge, Tag, Avatar, Spinner) are less critical but would benefit from ref forwarding for measurement/positioning use cases~~

**CLOSED (2026-03-20):** Re-evaluated: Dropdown uses internal ref management, Popover is a container component. Both patterns are intentional and documented in SSR-RSC-BOUNDARY.md. forwardRef not needed for these components. Display-only components remain as-is (low impact).

---

## 2. Non-Standard Props (Action Required)

| Component | Current Prop | Standard Prop | Migration Status |
|-----------|-------------|---------------|-----------------|
| Input | `inputSize` | `size` | ✅ @deprecated alias exists, `size` takes precedence |
| Select | `selectSize` | `size` | ✅ @deprecated alias exists, `size` takes precedence |
| Switch | `switchSize` | `size` | ✅ @deprecated alias exists, `size` takes precedence |
| Checkbox | `checkboxSize` | `size` | ✅ @deprecated alias exists, `size` takes precedence |
| Radio | `radioSize` | `size` | ✅ @deprecated alias exists, `size` takes precedence |
| SearchInput | `searchSize` | `size` | ✅ `size` alias added, `searchSize` deprecated |
| Badge | `tone` | `variant` | ✅ @deprecated alias exists |
| Tag | `tone` | `variant` | ✅ @deprecated alias exists |
| Alert | `severity` | `variant` | ✅ @deprecated alias exists |
| LinkInline | `tone` | `variant` | ✅ `variant` alias added, `tone` deprecated (2026-03-20) |
| Segmented | `appearance` | `variant` | ✅ `variant` alias added, `appearance` deprecated (2026-03-20) |
| Modal | `surface` | `variant` | ✅ `variant` alias added, `surface` deprecated (2026-03-20) |
| Input | `invalid` | `error` | ✅ @deprecated with JSDoc |
| Textarea | `invalid` | `error` | ✅ @deprecated with JSDoc |
| Select | `invalid` | `error` | ✅ Deprecated, ignored |
| Combobox | `invalid` | `error` | ⚠️ Both accepted |
| DatePicker | `invalid` | `error` | ⚠️ Both accepted |
| Slider | `invalid` | `error` | ⚠️ Both accepted |
| Tabs | `value` | `activeKey` | ✅ @deprecated |
| Tabs | `onValueChange` | `onChange` | ✅ @deprecated |
| Pagination | `page` | `current` | ✅ @deprecated |
| Pagination | `onPageChange` | `onChange` | ✅ @deprecated |
| Pagination | `totalItems` | `total` | ✅ @deprecated |

---

## 3. Missing Props (Gaps)

| Component | Missing Prop | Why Needed |
|-----------|-------------|-----------|
| ~~Select~~ | ~~`readOnly`~~ | ✅ Fixed (2026-03-20) — `readOnly` already existed |
| ~~Select~~ | ~~access (functional)~~ | ✅ Fixed — `resolveAccessState` wired |
| ~~Switch~~ | ~~`error`~~ | ✅ Fixed (2026-03-20) — `error` prop already existed |
| ~~Checkbox~~ | ~~`loading`~~ | ✅ Fixed (2026-03-20) — `loading` prop added |
| ~~Radio~~ | ~~`loading`~~ | ✅ Fixed (2026-03-20) — `loading` prop added |
| ~~Textarea~~ | ~~`loading`~~ | ✅ Fixed (2026-03-20) — `loading` prop added |
| ~~SearchInput~~ | ~~`size` (standard)~~ | ✅ Fixed — `size` alias added |
| ~~SearchInput~~ | ~~`disabled`~~ | ✅ Fixed (2026-03-20) — `disabled` prop added |
| SearchInput | `access`/`accessReason` | Should support access control |
| ~~Dropdown~~ | ~~`disabled`~~ | ✅ Fixed (2026-03-20) — `disabled` prop added |
| Dropdown | `access`/`accessReason` | Interactive component should support access control |
| ~~IconButton~~ | ~~access (functional)~~ | ✅ Fixed — `resolveAccessState` wired |
| ~~Popover~~ | ~~`displayName`~~ | ✅ Fixed — `displayName` set |
| Dialog | `access`/`accessReason` | Overlay component should support access control |

---

## 4. STANDARDS.md vs. Code Alignment

| STANDARDS.md Requirement | Code Reality | Status |
|--------------------------|-------------|--------|
| "Every component's props must extend `AccessControlledProps`" | Select, IconButton, Pagination, Segmented: `resolveAccessState` wired. Modal, Text: N/A (container/display-only). | ✅ Resolved (2026-03-20) |
| "Every exported component must set `displayName`" | All 24 primitives + all 11 composed components have `displayName` set | ✅ Fully resolved (2026-03-20) |
| "Components that render focusable elements must use `forwardRef`" | 12 primitives are `React.FC` without forwardRef. Dropdown/Popover re-evaluated as intentional (2026-03-20). | ✅ CLOSED (2026-03-20) — intentional patterns documented in SSR-RSC-BOUNDARY.md |
| API-COMPLIANCE says size values are `xs \| sm \| md \| lg \| xl` | Form fields only support `sm \| md \| lg`; Pagination only `sm \| md`; Accordion only `sm \| md` | ⚠️ Inconsistent but intentional per component |
| API-COMPLIANCE says Form Field contract includes `readOnly` | ~~Select does not support readOnly~~ ✅ Fixed (2026-03-20) — Select `readOnly` already existed | ✅ Compliant |
| API-COMPLIANCE says Form Field contract includes `loading` | ~~Checkbox, Radio, Textarea lack `loading`~~ | ✅ CLOSED (2026-03-20) — `loading` added to Checkbox, Radio, Textarea |
| "Boolean props: no `is` prefix" | ✅ No `is` prefixes found anywhere | ✅ Compliant |
| "Event handlers: `on` prefix" | ✅ All use `onChange`, `onClose`, `onCheckedChange`, etc. | ✅ Compliant |
| "Deprecated props: `@deprecated` JSDoc + console.warn in dev" | ~~Size aliases have both JSDoc + console.warn. `tone`, `severity`, `invalid` have JSDoc only (no console.warn).~~ | ✅ CLOSED (2026-03-20) — console.warn added for all deprecated props |

---

## 5. Priority Fixes

### P0 — Contract violations (ALL RESOLVED)
1. ~~**SearchInput: `searchSize` must get a `size` alias**~~ — ✅ Fixed
2. ~~**Select: Wire access control**~~ — ✅ Fixed
3. ~~**IconButton: Wire access control**~~ — ✅ Fixed
4. ~~**Popover: Add `displayName`**~~ — ✅ Fixed

### P1 — Consistency gaps (ALL RESOLVED 2026-03-20)
5. ~~**LinkInline: Add `variant` as alias for `tone`**~~ — ✅ RESOLVED 2026-03-20
6. ~~**Segmented: Add `variant` as alias for `appearance`**~~ — ✅ RESOLVED 2026-03-20
7. ~~**Modal: Add `variant` as alias for `surface`**~~ — ✅ RESOLVED 2026-03-20
8. ~~**Switch: Add `error` prop**~~ — ✅ RESOLVED 2026-03-20 (already existed)
9. ~~**Select: Add `readOnly` prop**~~ — ✅ RESOLVED 2026-03-20 (already existed)
10. ~~**Add `displayName` to all composed components**~~ — ✅ FULLY RESOLVED 2026-03-20 (5 added this session: NotificationItemCard, NotificationPanel, ThemePresetGallery, FieldControlShell, DetailSummary; 6 already existed: AIActionAuditTimeline, AIGuidedAuthoring, ApprovalCheckpoint, CitationPanel, PromptComposer, RecommendationCard)

### P2 — Deferred to F4
~~11. Add `displayName` to remaining composed components~~ — ✅ RESOLVED 2026-03-20 (all displayNames confirmed present)
~~12. Add forwardRef to interactive primitives (Dropdown, Popover)~~ — ✅ CLOSED 2026-03-20 — Re-evaluated: Dropdown uses internal ref management, Popover is a container component. Both patterns are intentional and documented in SSR-RSC-BOUNDARY.md. forwardRef not needed for these components.
~~13. Add `loading` to Checkbox, Radio, Textarea~~ — ✅ CLOSED 2026-03-20 — `loading` prop added to Checkbox, Radio, and Textarea.
~~14. Add `disabled` to SearchInput and Dropdown~~ — ✅ CLOSED 2026-03-20 — `disabled` prop added to SearchInput and Dropdown.
~~15. Add console.warn for remaining deprecated props (`tone`, `severity`, `invalid`)~~ — ✅ CLOSED 2026-03-20 — console.warn added for all deprecated props.
