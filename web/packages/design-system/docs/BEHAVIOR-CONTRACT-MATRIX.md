# Behavior Contract Matrix (F2.3)

## Top 15 Components x 10 Behaviors

Based on analysis of actual test files in the codebase.

| Component  | Controlled | Uncontrolled | Disabled | ReadOnly | Loading | Error  | Keyboard | Focus  | Slots  | Overlay |
|------------|:----------:|:------------:|:--------:|:--------:|:-------:|:------:|:--------:|:------:|:------:|:-------:|
| Button     | N/A        | N/A          | YES      | N/A      | YES     | N/A    | GAP      | GAP    | YES    | N/A     |
| Input      | YES        | YES          | YES      | YES      | GAP     | YES    | GAP      | GAP    | YES    | N/A     |
| Select     | GAP        | GAP          | YES      | GAP      | GAP     | YES    | YES      | YES    | GAP    | N/A     |
| Checkbox   | YES        | YES          | YES      | GAP      | N/A     | YES    | GAP      | GAP    | GAP    | N/A     |
| Radio      | YES        | YES          | YES      | GAP      | N/A     | YES    | GAP      | GAP    | GAP    | N/A     |
| Switch     | PARTIAL    | PARTIAL      | YES      | YES      | N/A     | GAP    | GAP      | GAP    | GAP    | N/A     |
| Tabs       | YES        | YES          | YES      | N/A      | N/A     | N/A    | GAP      | GAP    | YES    | N/A     |
| Accordion  | YES        | YES          | YES      | YES      | N/A     | N/A    | GAP      | GAP    | YES    | N/A     |
| Dialog     | N/A        | N/A          | N/A      | N/A      | N/A     | N/A    | YES      | YES    | YES    | YES     |
| Modal      | N/A        | N/A          | N/A      | N/A      | N/A     | N/A    | YES      | YES    | YES    | YES     |
| Popover    | YES        | YES          | YES      | GAP      | N/A     | N/A    | YES      | GAP    | GAP    | YES     |
| Tooltip    | N/A        | N/A          | YES      | N/A      | N/A     | N/A    | YES      | YES    | N/A    | PARTIAL |
| Toast      | N/A        | N/A          | N/A      | N/A      | N/A     | N/A    | GAP      | GAP    | N/A    | PARTIAL |
| FormField  | N/A        | N/A          | YES      | N/A      | N/A     | YES    | N/A      | N/A    | N/A    | N/A     |
| Table      | N/A        | N/A          | N/A      | N/A      | N/A     | N/A    | N/A      | N/A    | YES    | N/A     |

### Legend
- **YES** = Test exists and covers the behavior
- **GAP** = Should exist but doesn't (gap in test coverage)
- **PARTIAL** = Some coverage but incomplete
- **N/A** = Not applicable for this component (see rationale below)

---

## Detailed Analysis per Component

### Button (`primitives/button`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | Buttons don't have value state |
| Uncontrolled | N/A     | Buttons don't have value state |
| Disabled     | YES     | Tests: `disabled` prop blocks click, `access="disabled"` blocks click, `access="readonly"` disables |
| ReadOnly     | N/A     | Buttons don't have a read-only semantic |
| Loading      | YES     | Tests: `loading` disables button, renders spinner (`role="status"`), shows `loadingLabel` |
| Error        | N/A     | Buttons don't have error state |
| Keyboard     | GAP     | No tests for Enter/Space key activation, no keyboard-specific tests |
| Focus        | GAP     | No tests for focus ring class, focus-visible behavior |
| Slots        | YES     | Tests: `leftIcon`, `rightIcon`, `iconOnly` render correctly |
| Overlay      | N/A     | Not an overlay component |

### Input (`primitives/input`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | YES     | Tests: `value` + `onChange` works, value doesn't change without prop update, reflects prop update |
| Uncontrolled | YES     | Tests: `defaultValue` renders initial value, typing updates displayed value |
| Disabled     | YES     | Tests: `disabled` attr set, onChange not fired when disabled |
| ReadOnly     | YES     | Tests: `readOnly` attr set, `aria-readonly="true"`, typing does not change value |
| Loading      | GAP     | No loading state tests (component may not support loading) |
| Error        | YES     | Tests: `error` prop sets `aria-invalid="true"`, error message rendered, error border styling via `data-field-tone="invalid"` |
| Keyboard     | GAP     | No keyboard-specific tests (typing is tested via userEvent but no specific key behavior tests) |
| Focus        | GAP     | No focus ring tests, no focus-visible tests |
| Slots        | YES     | Tests: `leadingVisual`, `trailingVisual`, `prefix`, `suffix` render correctly |
| Overlay      | N/A     | Not an overlay component |

### Select (`primitives/select`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | GAP     | No explicit test for controlled `value` prop + `onChange` (only tests `onChange` fires, and `onValueChange`) |
| Uncontrolled | GAP     | No `defaultValue` test |
| Disabled     | YES     | Tests: `disabled` attr set, onChange not fired, opacity styling |
| ReadOnly     | GAP     | No readOnly tests |
| Loading      | GAP     | No loading state tests |
| Error        | YES     | Tests: error border class, error focus ring class, detailed error state tests |
| Keyboard     | YES     | Tests: Space, Enter, ArrowDown key behavior, Tab focus, disabled keyboard block |
| Focus        | YES     | Tests: `focus:ring-2`, `focus:border-[var(--action-primary)]`, Tab focus |
| Slots        | GAP     | No slot/visual customization tests |
| Overlay      | N/A     | Not an overlay component (native `<select>`) |

### Checkbox (`primitives/checkbox`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | YES     | Tests: `checked={false}` + click calls `onCheckedChange(true)`, visual state doesn't toggle without prop update, reflects prop update |
| Uncontrolled | YES     | Tests: renders unchecked, click toggles to checked, click again toggles back |
| Disabled     | YES     | Tests: `disabled` attr set, opacity class applied |
| ReadOnly     | GAP     | No readOnly tests (component may not have readOnly prop) |
| Loading      | N/A     | Checkboxes don't typically have loading state |
| Error        | YES     | Tests: error border class applied |
| Keyboard     | GAP     | No Space/Enter key activation tests |
| Focus        | GAP     | No focus ring or focus-visible tests |
| Slots        | GAP     | No slot tests (label/description tested in render, but no visual slot customization) |
| Overlay      | N/A     | Not an overlay component |

### Radio (`primitives/radio`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | YES     | Tests: RadioGroup `value` prop controls selection, `onChange` fires with value, visual state doesn't change without prop update, reflects prop update |
| Uncontrolled | YES     | Tests: standalone Radio toggles on click, RadioGroup without `value` fires onChange |
| Disabled     | YES     | Tests: `disabled` attr set, opacity class applied |
| ReadOnly     | GAP     | No readOnly tests |
| Loading      | N/A     | Radio buttons don't typically have loading state |
| Error        | YES     | Tests: error border class applied |
| Keyboard     | GAP     | No Arrow key navigation tests within RadioGroup |
| Focus        | GAP     | No focus ring tests |
| Slots        | GAP     | No slot tests |
| Overlay      | N/A     | Not an overlay component |

### Switch (`primitives/switch`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | PARTIAL | Tests: `checked` prop controls visual state (background, thumb translate), `onCheckedChange` fires. Missing: explicit test that visual state doesn't toggle without prop update |
| Uncontrolled | PARTIAL | Tests: `onCheckedChange` fires on click. Missing: explicit test that clicking toggles visual state when no `checked` prop |
| Disabled     | YES     | Tests: `disabled` attr set, opacity class, `access="disabled"` applies opacity, `access="readonly"` blocks click |
| ReadOnly     | YES     | Tests: `access="readonly"` blocks onClick, applies opacity-70 |
| Loading      | N/A     | Switches don't typically have loading state |
| Error        | GAP     | No error state tests (component may have error prop via access controller) |
| Keyboard     | GAP     | No Space key toggle tests |
| Focus        | GAP     | No focus ring tests |
| Slots        | GAP     | No slot tests |
| Overlay      | N/A     | Not an overlay component |

### Tabs (`components/tabs`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | YES     | Tests: `activeKey` controls active tab, `value` (deprecated) works, `onChange` fires |
| Uncontrolled | YES     | Tests: `defaultActiveKey` selects initial tab, clicking changes tab |
| Disabled     | YES     | Tests: disabled tab not clickable, disabled tab gets disabled attr |
| ReadOnly     | N/A     | Not applicable for Tabs |
| Loading      | N/A     | Not applicable for Tabs |
| Error        | N/A     | Not applicable for Tabs |
| Keyboard     | GAP     | No Arrow key navigation tests (component uses `useRovingTabindex` but no test validates it) |
| Focus        | GAP     | No focus ring tests (component uses `focusRingClass("outline")` but no test validates it) |
| Slots        | YES     | Tests: icon, badge, closable close button, description all render correctly |
| Overlay      | N/A     | Not an overlay component |

### Accordion (`components/accordion`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | YES     | Tests: `value` prop controls expanded panels, `onValueChange` callback fires, `onItemToggle` fires |
| Uncontrolled | YES     | Tests: `defaultValue` opens specified panel, `defaultExpanded` on item works |
| Disabled     | YES     | Tests: disabled item not clickable, `access="disabled"` disables all buttons, `access="readonly"` disables all buttons |
| ReadOnly     | YES     | Tests: `access="readonly"` disables buttons (treated same as disabled) |
| Loading      | N/A     | Not applicable for Accordion |
| Error        | N/A     | Not applicable for Accordion |
| Keyboard     | GAP     | No Enter/Space key tests for expanding panels, no Arrow key navigation tests |
| Focus        | GAP     | No focus ring tests |
| Slots        | YES     | Tests: description, extra content, icon, arrow visibility |
| Overlay      | N/A     | Not an overlay component |

### Dialog (`primitives/dialog`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | Dialog has `open`/`onClose` (imperative open/close, not value-based) |
| Uncontrolled | N/A     | Dialog is always controlled via `open` prop |
| Disabled     | N/A     | Dialogs don't have disabled state |
| ReadOnly     | N/A     | Dialogs don't have readonly state |
| Loading      | N/A     | No loading state on Dialog |
| Error        | N/A     | Dialogs don't have error state |
| Keyboard     | YES     | Tests: Escape via cancel event closes dialog (`closeOnEscape` true/false), focus trap within dialog (all focusable elements within dialog ancestor) |
| Focus        | YES     | Tests: focus trap verification, focus return to trigger on close |
| Slots        | YES     | Tests: title, description, footer, close button (closable prop) |
| Overlay      | YES     | Tests: layer-stack registration/unregistration, z-index stacking for two dialogs, backdrop click handling |

### Modal (`primitives/modal`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | Modal has `open`/`onClose` (imperative) |
| Uncontrolled | N/A     | Modal is always controlled via `open` prop |
| Disabled     | N/A     | Modals don't have disabled state |
| ReadOnly     | N/A     | Modals don't have readonly state |
| Loading      | N/A     | No loading state tests (Modal doesn't have loading prop) |
| Error        | N/A     | Modals don't have error state |
| Keyboard     | YES     | Tests: Escape via cancel event fires `onClose("escape")`, `closeOnEscape=false` blocks it, focus trap within dialog |
| Focus        | YES     | Tests: focus trap verification, focus return to trigger |
| Slots        | YES     | Tests: title, footer, close button, surface variants (destructive, confirm), classes prop, keepMounted |
| Overlay      | YES     | Tests: scroll lock (body overflow hidden/restored), layer-stack registration/unregistration, overlay click fires `onClose("overlay")`, portal rendering |

### Popover (`primitives/popover`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | YES     | Tests: `open` prop controls visibility, `onOpenChange` callback fires |
| Uncontrolled | YES     | Tests: `defaultOpen` renders open, click toggles open/closed |
| Disabled     | YES     | Tests: `access="disabled"` disables trigger, `access="hidden"` hides |
| ReadOnly     | GAP     | No explicit readOnly test (Popover supports `access="readonly"` but no test) |
| Loading      | N/A     | Popovers don't have loading state |
| Error        | N/A     | Popovers don't have error state |
| Keyboard     | YES     | Tests: Escape closes popover, trigger click opens, outside click closes, Enter/Space toggle (via click simulation) |
| Focus        | GAP     | No focus ring tests on trigger |
| Slots        | GAP     | No slot/slotProps tests (has `panelClassName`, `arrowClassName` but no tests for them) |
| Overlay      | YES     | Tests: overlay-engine outside click integration, Escape key integration, `aria-modal="false"`, `role="dialog"`, arrow rendering |

### Tooltip (`primitives/tooltip`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | Tooltip is uncontrolled only (no `open` prop) |
| Uncontrolled | N/A     | Tooltip auto-shows on hover/focus, auto-hides on leave/blur |
| Disabled     | YES     | Tests: `disabled=true` prevents tooltip from showing |
| ReadOnly     | N/A     | Not applicable for Tooltip |
| Loading      | N/A     | Not applicable for Tooltip |
| Error        | N/A     | Not applicable for Tooltip |
| Keyboard     | YES     | Tests: focus shows tooltip, Escape key hides tooltip |
| Focus        | YES     | Tests: focus/blur shows/hides tooltip |
| Slots        | N/A     | Tooltip has no customizable slots |
| Overlay      | PARTIAL | Tests: hover/focus show/hide, delay, placement, arrow. Missing: no layer-stack test, no portal test |

### Toast (`components/toast`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | Toast is imperative (via `useToast` hook methods) |
| Uncontrolled | N/A     | Toast is imperative |
| Disabled     | N/A     | Toast doesn't have disabled state |
| ReadOnly     | N/A     | Toast doesn't have readonly state |
| Loading      | N/A     | Toast doesn't have loading state |
| Error        | N/A     | Toast has `error` variant but it's a visual style, not an error state |
| Keyboard     | GAP     | No keyboard dismiss tests (e.g., Escape to dismiss) |
| Focus        | GAP     | No focus management tests (e.g., focus on toast, focus trap for interactive toasts) |
| Slots        | N/A     | Toast uses title/message API, not slot pattern |
| Overlay      | PARTIAL | Tests: `role="alert"`, `aria-live="polite"` container, dismiss button, auto-dismiss, maxVisible. Missing: no z-index/layer-stack test, no portal test |

### FormField (`components/form-field`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | FormField is a wrapper, not a value-bearing component |
| Uncontrolled | N/A     | FormField is a wrapper |
| Disabled     | YES     | Source: `disabled` prop applies opacity-60 and passes `disabled` to children via cloneElement |
| ReadOnly     | N/A     | No readOnly prop on FormField |
| Loading      | N/A     | No loading state on FormField |
| Error        | YES     | Source: `error` prop renders error message with `role="alert"`, sets `aria-invalid` on child, hides help text |
| Keyboard     | N/A     | FormField is a layout wrapper |
| Focus        | N/A     | FormField is a layout wrapper |
| Slots        | N/A     | FormField has label/help/error sections but these are props not slots |
| Overlay      | N/A     | Not an overlay component |

**Note**: FormField has NO test file. All analysis is from source code review. This is a gap.

### Table (`components/table-simple`)

| Behavior     | Status  | Evidence |
|--------------|---------|----------|
| Controlled   | N/A     | Table is a presentational component |
| Uncontrolled | N/A     | Table is presentational |
| Disabled     | N/A     | Table doesn't have disabled state |
| ReadOnly     | N/A     | Table is always read-only by nature |
| Loading      | N/A     | No loading state in TableSimple (may exist in more complex Table) |
| Error        | N/A     | No error state |
| Keyboard     | N/A     | No keyboard interaction (presentational) |
| Focus        | N/A     | No focus management |
| Slots        | YES     | Tests: `render` function for custom cells, `accessor` function |
| Overlay      | N/A     | Not an overlay component |

---

## Gap Summary

### Critical Gaps (should address soon)

1. **FormField has no test file** -- All behaviors are untested.
2. **Keyboard tests missing for Button** -- No Enter/Space activation tests.
3. **Keyboard tests missing for Checkbox** -- No Space key toggle tests.
4. **Keyboard tests missing for Radio** -- No Arrow key navigation tests in RadioGroup.
5. **Keyboard tests missing for Tabs** -- useRovingTabindex is used but not tested.
6. **Keyboard tests missing for Accordion** -- No Enter/Space expand tests.
7. **Focus ring tests missing across most components** -- Button, Input, Checkbox, Radio, Switch, Tabs, Accordion all use `focusRingClass` but have no tests validating focus-visible behavior.

### Moderate Gaps (good to address)

8. **Select controlled/uncontrolled parity tests** -- Has onChange tests but no explicit controlled value test or defaultValue test.
9. **Switch controlled/uncontrolled parity** -- Has partial tests but missing explicit "doesn't toggle without prop update" and "toggles without checked prop" tests.
10. **Toast keyboard tests** -- No Escape-to-dismiss test.
11. **Popover focus ring test** -- No test for trigger focus ring.
12. **Input loading state** -- No loading test (may not be applicable).

### Low Priority Gaps

13. **Dropdown not in top 15** but has gaps in overlay-engine adoption.
14. **Table keyboard navigation** -- Not applicable for TableSimple but may be needed for full Table component.
15. **Checkbox/Radio readOnly** -- May not be applicable for these components.
