# Accessibility Notes

Per-component WCAG compliance notes and screen reader behavior for `@mfe/design-system`.

> Generated from source code inspection.

---

## Button

- **Role:** `button` (native `<button>` element)
- **Keyboard:** Enter/Space activates (native behavior)
- **ARIA:** `aria-disabled` set when disabled or access-blocked; `aria-busy` set when `loading={true}`
- **Screen reader:** Announces label text + disabled state. When `loading`, `aria-busy="true"` signals ongoing action
- **Focus:** Visible focus ring via `focusRingClass`; danger variant uses a red-tinted focus ring
- **Icon-only:** Dev-mode `console.warn` when `iconOnly={true}` without `aria-label`, `aria-labelledby`, or `title`
- **Access control:** `access="hidden"` applies `invisible` class (keeps layout); `access="disabled"` sets `aria-disabled` via `guardAria()`

---

## Input

- **Role:** `textbox` (native `<input>` element)
- **Keyboard:** Standard text input behavior
- **ARIA:** `aria-invalid` when `error` is set; `aria-readonly` when readonly; `aria-disabled` when disabled or readonly; `aria-describedby` links to description, hint/error, and character count elements
- **Label:** Must have associated label via `label` prop (renders `<label>` with `htmlFor`) or external `FormField`
- **Character count:** Rendered inside a `sr-only` `<span>` with unique `id`, accessible to screen readers but invisible
- **Focus:** Visible focus ring via field frame class
- **Error/hint:** Error and hint have unique `id` attributes linked via `aria-describedby`; error takes precedence over hint

---

## Select

- **Role:** Native `<select>` element
- **Keyboard:** Standard select behavior (arrow keys, Space/Enter)
- **ARIA:** No custom ARIA attributes beyond native; error styling is visual only (no `aria-invalid` -- use `FormField` wrapper for that)
- **Label:** Not built in -- must be provided externally via `FormField` or a `<label>` element
- **Focus:** Visible focus ring via CSS `focus:ring-2`
- **Loading spinner:** Has `role="status"` and `aria-label="Loading"` for screen reader announcement
- **Placeholder:** Rendered as `<option value="" disabled>` -- not selectable after initial display

---

## Checkbox

- **Role:** `checkbox` (native `<input type="checkbox">`)
- **Keyboard:** Space toggles (native behavior); label click toggles via `htmlFor`
- **ARIA:** `aria-readonly` when access is readonly; indeterminate state set via JavaScript `el.indeterminate = true`
- **Screen reader:** Announces label text + checked/unchecked/indeterminate state
- **Visual indicator:** Custom styled `<span>` with `aria-hidden` for the checkbox box; native input is `sr-only`
- **Focus:** Focus ring on the custom visual indicator (inherited from label focus)
- **Readonly protection:** `htmlFor` removed on label, `onClick` blocked with `preventDefault`, `withAccessGuard` blocks change events
- **Access control:** `access="hidden"` returns `null`; data attributes `data-access-state`, `data-state` (checked/unchecked/indeterminate) set on the label

---

## Radio / RadioGroup

- **Role:** `radio` (native `<input type="radio">`); `RadioGroup` uses `role="radiogroup"` on the container
- **Keyboard:** Arrow keys cycle through group (native radiogroup behavior when same `name`); Space selects
- **ARIA:** `aria-readonly` when access is readonly
- **Screen reader:** Announces label text + selected/unselected state
- **Visual indicator:** Custom styled `<span>` with `aria-hidden` for the radio circle; native input is `sr-only`
- **Focus:** Focus ring on the custom visual indicator
- **Readonly protection:** Same pattern as Checkbox -- `htmlFor` removed, `onClick` blocked, `withAccessGuard` blocks change events
- **RadioGroup:** Injects `name`, `checked`, `onChange` into child `Radio` components via `cloneElement`
- **Access control:** `access="hidden"` returns `null`

---

## Switch

- **Role:** `switch` (native `<input type="checkbox" role="switch">`)
- **Keyboard:** Space toggles (native behavior)
- **ARIA:** `aria-disabled` and `aria-readonly` set via `guardAria()`; `role="switch"` ensures assistive technology treats this as a toggle switch, not a checkbox
- **Screen reader:** Announces label text + on/off state (switch role provides "on"/"off" instead of "checked"/"unchecked")
- **Visual indicator:** Custom styled track and thumb with `aria-hidden`; native input is `sr-only`
- **Focus:** Focus ring via `focusRingClass` on the label
- **Readonly protection:** Same `withAccessGuard` pattern; label `htmlFor` removed and `onClick` blocked
- **Access control:** `access="hidden"` returns `null`

---

## Textarea

- **Role:** Native `<textarea>` element
- **Keyboard:** Standard multiline text input behavior
- **ARIA:** `aria-invalid` when `error` is set; `aria-readonly` when readonly; `aria-disabled` when disabled or readonly; `aria-describedby` links to description, hint/error, and character count
- **Label:** Must have associated label via `label` prop or external `FormField`
- **Character count:** Rendered inside a `sr-only` `<span>` -- accessible to screen readers
- **Focus:** Visible focus ring via field frame class
- **Access control:** `access="hidden"` returns `null`

---

## Tabs

- **Role:** `tablist` on the container; `tab` on each tab button; `tabpanel` on the content panel
- **Keyboard:** Arrow keys navigate between tabs (roving tabindex via `useRovingTabindex`); arrow keys both move focus and select the tab; disabled tabs are skipped during navigation
- **ARIA:** `aria-selected` on active tab; `aria-controls` links tab to panel; `aria-labelledby` links panel to tab; `aria-disabled` on disabled tabs
- **Screen reader:** Announces tab label + selected state
- **Focus:** `tabIndex` managed by roving tabindex -- only the active tab receives `tabIndex={0}`; focus ring via `focusRingClass("outline")`
- **Close button:** Has `aria-label="Close tab"`; uses `stopPropagation` to prevent tab selection when closing

---

## Accordion

- **Role:** Header buttons use `aria-expanded` and `aria-controls`; panels use `role="region"` with `aria-labelledby` linking back to the header
- **Keyboard:** Enter/Space toggles expansion (native button behavior); focus ring on trigger buttons
- **ARIA:** `aria-expanded` (true/false) on each header button; `aria-controls` links to panel id; `aria-disabled` when blocked; `aria-hidden` on collapsed panels; `aria-label` on root element (defaults to `"Accordion"`)
- **Screen reader:** Announces title + expanded/collapsed state
- **Hidden content:** When `destroyOnHidden={true}`, collapsed panels are removed from DOM; when `false`, panels use `hidden` attribute
- **Icon-only collapsible:** When `collapsible="icon"`, the icon button has an explicit `aria-label` describing the action
- **Access control:** `access="hidden"` returns `null`; `access="disabled"` and `access="readonly"` both disable all toggle buttons

---

## Dialog

- **Role:** Native `<dialog>` element used with `showModal()` -- provides built-in focus trap, Escape handling, and backdrop
- **Keyboard:** Escape closes (unless `closeOnEscape={false}`); Tab cycles within dialog (native focus trap)
- **ARIA:** No custom ARIA beyond native `<dialog>` semantics; close button has `aria-label="Close"`
- **Screen reader:** Native dialog semantics announce the dialog and trap screen reader focus within it
- **Focus trap:** Built-in via native `<dialog>.showModal()` -- no need for custom focus trap implementation
- **Stacking:** Registers in overlay-engine layer stack; nested dialogs get increasing z-index
- **No DOM when closed:** `open={false}` returns `null` -- no hidden dialog in the DOM

---

## Modal

- **Role:** Native `<dialog>` element used with `showModal()` -- same semantics as Dialog
- **Keyboard:** Escape closes (unless `closeOnEscape={false}`); Tab cycles within dialog; scroll lock prevents background scrolling
- **ARIA:** Close button has `aria-label="Close"`; `OverlayCloseReason` sent to `onClose` distinguishes close action
- **Screen reader:** Native dialog semantics; close button announced
- **Focus trap:** Built-in via native `<dialog>.showModal()`
- **Scroll lock:** `useScrollLock(open)` sets `body.style.overflow = "hidden"` to prevent background scrolling
- **Portal:** Renders via `createPortal` to `document.body` by default; `disablePortal` renders inline

---

## Popover

- **Role:** Panel has `role="dialog"` with `aria-modal="false"` (non-modal -- background content remains interactive)
- **Keyboard:** Enter/Space toggles when trigger is focused; ArrowDown/ArrowUp opens; Escape closes and restores focus to trigger
- **ARIA:** Trigger gets `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`; panel gets `aria-label` (or `aria-labelledby` when `title` is provided); `aria-disabled` on trigger when access blocks interaction
- **Screen reader:** Trigger announces expanded/collapsed state; panel title is announced if provided
- **Focus management:** Escape restores focus to the first focusable element within the trigger anchor
- **Access control:** `access="hidden"` returns `null`; `access="disabled"` or `access="readonly"` blocks trigger interaction and sets `aria-disabled`

---

## Tooltip

- **Role:** `tooltip` (via `role="tooltip"` on the tooltip content)
- **Keyboard:** Tooltip appears on `focus` for keyboard accessibility; Escape dismisses immediately
- **ARIA:** `role="tooltip"` on the content span
- **Screen reader:** Content is announced when tooltip becomes visible (via DOM insertion)
- **Focus-triggered:** Tooltip appears on both `mouseEnter` and `focus` events, ensuring keyboard users have access
- **No interactive content:** Tooltip content has `pointer-events: none` -- it cannot be interacted with (use Popover for interactive overlays)
- **Empty content:** If neither `content` nor `text` is provided, renders only `{children}` with no tooltip behavior

---

## Toast

- **Role:** Toast container uses `aria-live="polite"` for non-intrusive announcements; individual toasts use `role="alert"` for immediate announcement
- **Keyboard:** Dismiss button is keyboard-accessible (native `<button>`)
- **ARIA:** Dismiss button has `aria-label="Dismiss"`
- **Screen reader:** New toasts are announced automatically via `aria-live="polite"` region; `role="alert"` ensures individual toast content is read immediately
- **Auto-dismiss:** Toasts auto-dismiss after `duration` ms (default 4000); `duration: 0` disables auto-dismiss
- **Provider requirement:** `useToast()` throws descriptive error when used outside `<ToastProvider>` -- helps developers debug

---

## Badge

- **Role:** No semantic role (`<span>` element) -- Badge is presentational
- **Keyboard:** Not keyboard-accessible (not interactive)
- **ARIA:** No ARIA attributes set
- **Screen reader:** Reads the text content of the badge; for dot badges, no text content is present -- consider adding `aria-label` if the dot conveys meaning
- **Note:** Badge is purely visual. If the badge communicates status (e.g., error count), ensure surrounding context provides that information accessibly

---

## Card

- **Role:** Default `<div>` has no semantic role; `as="button"` adds `role="button"` and `tabIndex={0}`; `as="article"` or `as="section"` provides semantic HTML
- **Keyboard:** When `as="button"`, focusable via Tab and activatable via Enter/Space (note: rendered as `<div>` with `role="button"`, not native `<button>`)
- **ARIA:** `role="button"` and `tabIndex={0}` when `as="button"`
- **Screen reader:** When `as="article"`, announced as an article landmark
- **Note:** For clickable cards, consider using `as="button"` with `hoverable={true}` to get both visual and accessibility behavior. However, since it renders as a `<div>`, ensure `onClick` is provided for actual interactivity

---

## Pagination

- **Role:** `<nav>` with `aria-label="Pagination"`
- **Keyboard:** Tab navigates between page buttons; Enter/Space activates
- **ARIA:** Active page has `aria-current="page"`; prev/next buttons have `aria-label="Previous page"` / `aria-label="Next page"`; disabled prev/next buttons use native `disabled`
- **Screen reader:** Navigation landmark announced; current page identified via `aria-current`
- **Disabled state:** Previous button disabled on page 1; Next button disabled on last page; both use native `disabled` attribute

---

## Steps

- **Role:** Container uses `role="list"` with `aria-label="Progress steps"`; each step uses `role="listitem"`
- **Keyboard:** Step indicator buttons are focusable; Enter/Space activates when `onChange` is provided; focus ring via `focusRingClass`
- **ARIA:** Active step has `aria-current="step"`; each step button has `aria-label="Step N: Title"`; disabled steps use native `disabled`
- **Screen reader:** List semantics provide step count; current step identified via `aria-current`; step title announced via `aria-label`
- **Clickability:** Steps are only interactive (clickable) when `onChange` is provided; without it, step buttons are disabled

---

## FormField

- **Role:** No semantic role on the wrapper `<div>`; `<label>` associates with child input via `htmlFor`
- **Keyboard:** Label click delegates focus to associated input (native behavior)
- **ARIA:** `aria-describedby` injected into child input, linking to help text or error message; `aria-invalid` injected when `error` is set; `disabled` propagated to child input
- **Screen reader:** Label announced when input is focused; error message announced via `role="alert"` on the error element; help text linked via `aria-describedby`
- **Required indicator:** Asterisk (*) has `aria-hidden` -- screen readers rely on the native `required` attribute on the input
- **Error message:** Rendered with `role="alert"` for immediate screen reader announcement
- **Prop injection:** Uses `cloneElement` to inject `id`, `aria-describedby`, `aria-invalid`, `disabled`, `error` into child elements

---

## EmptyState

- **Role:** No semantic role (`<div>` element) -- EmptyState is presentational
- **Keyboard:** Action buttons (if provided) are keyboard-accessible
- **ARIA:** No ARIA attributes set on the container
- **Screen reader:** Reads title and description as regular text content; action buttons are announced normally
- **Access control:** `access="hidden"` returns `null`
- **Note:** For screen readers, the title and description provide the primary empty state message. Ensure `action` buttons have descriptive labels for context
