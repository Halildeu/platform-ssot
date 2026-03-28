# Do / Don't Guidelines

Practical usage guidelines for `@mfe/design-system` components.

> Generated from source code, edge-case catalog, and API stability tiers.

---

## Button

### Do

- Use `variant="primary"` for the main action in a form or dialog
- Use `variant="ghost"` for secondary or toolbar actions
- Set `loading={true}` during async operations -- it automatically disables the button and shows a spinner
- Use `type="submit"` inside forms (default `type` is `"button"`)
- Provide `aria-label` or `title` when using `iconOnly={true}`
- Use the `access` prop for permission-based disabling instead of raw `disabled`
- Use `variant="danger"` for destructive actions (delete, remove)

### Don't

- Don't nest interactive elements (buttons, links) inside Button -- a11y violation
- Don't use Button for navigation -- use a link/anchor element instead, or use `variant="link"` only when semantically appropriate
- Don't rely on `disabled` for access control -- use `access="disabled"` with `accessReason` to show a tooltip explaining why
- Don't use `loadingLabel` -- it is deprecated (backward compat only)
- Don't put long text in buttons -- keep labels concise (2-3 words)
- Don't set `iconOnly={true}` without providing `aria-label`, `aria-labelledby`, or `title` -- a dev-mode warning will fire and the button will be inaccessible

### Tips

- `loading={true}` automatically sets `disabled`, replaces children with a `Spinner`, and sets `aria-busy`
- `access="hidden"` keeps the button in the DOM with `invisible` class (preserves layout space), unlike other components that return `null`
- When `access` blocks interaction, `onClick` is replaced with `preventDefault + stopPropagation` -- events do not bubble
- `className` is merged via `cn()` utility, allowing style overrides
- `ref` forwards to the underlying `HTMLButtonElement`

---

## Input

### Do

- Always provide a `label` prop or wrap with `FormField` to ensure accessible labeling
- Use the `error` prop with a descriptive message, not just `true`
- Use `onValueChange` for convenience when you only need the string value
- Use `leadingVisual` / `trailingVisual` for icons and addons (not `prefix` / `suffix`, which are aliases)
- Use `showCount` with `maxLength` to show character counts (rendered as `sr-only`)
- Use `access="readonly"` instead of the `readOnly` HTML prop for consistent access-control behavior

### Don't

- Don't use `placeholder` as the sole label -- it is not accessible
- Don't set both `value` and `defaultValue` -- pick controlled or uncontrolled mode
- Don't use `inputSize` -- it is deprecated, use `size` instead
- Don't use `invalid` -- it is deprecated, use `error` instead
- Don't use `prefix` / `suffix` when you also set `leadingVisual` / `trailingVisual` -- the latter take precedence
- Don't expect `hint` to show when `error` is set -- error hides hint completely

### Tips

- `loading={true}` makes the input `readOnly` (not disabled) and shows a `Spinner` in the trailing slot
- `access="hidden"` returns `null` (removes from DOM), unlike Button which uses `invisible` class
- `access="readonly"` sets `readOnly` and uses `withAccessGuard` to actively `preventDefault + stopPropagation` on change events
- `ref` forwards to the native `<input>` element -- compatible with `react-hook-form` `register()`
- Error message accepts `ReactNode` -- you can pass formatted content

---

## Select

### Do

- Always provide `options` as a `SelectOption[]` array
- Use `placeholder` for an initial hint -- it renders as a disabled `<option>`
- Use `onChange` for the native event handler
- Use `size` for component sizing
- Wrap with `FormField` to get label, error, and help text

### Don't

- Don't use `selectSize` -- it is deprecated, use `size` instead
- Don't use `onValueChange` -- it is deprecated, use `onChange` instead
- Don't pass `label`, `description`, `hint`, `clearable`, or `invalid` directly -- they are accepted but ignored (compat shims only); use `FormField` instead
- The `access` prop is now fully wired on Select — it supports `"full"`, `"readonly"`, `"disabled"`, and `"hidden"` states via `resolveAccessState`
- Don't pass `SelectOption` fields like `description`, `disabledReason`, `title`, `metaLabel`, `tone`, `keywords` -- they are all ignored

### Tips

- `loading={true}` replaces the chevron icon with an animated spinner and disables the select
- The placeholder option is rendered as `<option value="" disabled>` -- users cannot re-select it after choosing a value
- Select supports both controlled (`value`) and uncontrolled (`defaultValue`) modes
- `ref` forwards to the native `<select>` element

---

## Checkbox

### Do

- Use `label` and `description` for accessible labeling
- Use `variant="card"` when you need a larger click target with visual feedback (bordered container)
- Use `indeterminate` for "select all" patterns with partial selection
- Use `access` prop for permission-based control
- Use `size` for component sizing

### Don't

- Don't use `checkboxSize` -- it is deprecated, use `size` instead
- Don't use `onCheckedChange` -- it is deprecated, use `onChange` instead
- Don't pass `hint`, `invalid`, or `fullWidth` -- they are accepted but ignored
- Don't rely on HTML `readOnly` attribute alone -- native checkboxes ignore `readOnly`; the component uses `withAccessGuard` internally via the `access` prop to properly block interaction

### Tips

- `indeterminate` is set via a ref callback (`el.indeterminate = true`) since HTML does not support it as an attribute; the visual shows a dash icon
- `access="hidden"` returns `null` -- the component is removed from the DOM
- In `variant="card"` mode, the checked state adds a primary border and subtle background
- For `access="readonly"`, label click delegation is also blocked via `preventDefault` on the `<label>` element
- Supports both controlled (`checked`) and uncontrolled (`defaultChecked`) modes

---

## Radio / RadioGroup

### Do

- Always use `Radio` inside `RadioGroup` for proper name and value management
- Provide `name` on `RadioGroup` -- it is required
- Use `RadioGroup` `direction="horizontal"` for inline layouts
- Use `label` and `description` on individual `Radio` components
- Use `size` for component sizing

### Don't

- Don't use `radioSize` -- it is deprecated, use `size` instead
- Don't use standalone `Radio` without `RadioGroup` unless you manually handle `name`, `checked`, and `onChange`
- Don't rely on HTML `readOnly` attribute -- native radios ignore `readOnly`; use `access="readonly"` instead

### Tips

- `RadioGroup` uses `React.Children.map` + `cloneElement` to inject `name`, `checked`, and `onChange` into child `Radio` components -- non-Radio children pass through unchanged
- `access="hidden"` returns `null` on both `Radio` and `RadioGroup` contexts
- For `access="readonly"`, both the `<label>` `htmlFor` and `onClick` are disabled to prevent click delegation
- Supports both controlled (`value` on `RadioGroup`) and uncontrolled (`defaultValue`) modes

---

## Switch

### Do

- Use `label` and `description` for accessible labeling
- Use `onCheckedChange` for the checked boolean callback
- Use `variant="destructive"` for toggles that control dangerous settings (uses error color when checked)
- Use `loading={true}` during async toggle operations

### Don't

- Don't use `switchSize` -- it is deprecated, use `size` instead
- Don't pass `fullWidth` -- it is accepted but ignored
- Don't rely on HTML `readOnly` attribute -- use `access="readonly"` instead

### Tips

- Internally renders `<input type="checkbox" role="switch">` -- assistive technology treats this as a switch, not a checkbox
- `loading={true}` disables the switch and shows an animated spinner inside the thumb
- `density` uses CSS `scale` transforms (not padding): `compact` = `scale-75`, `spacious` = `scale-110`
- `access="hidden"` returns `null`
- For `access="readonly"`, the `withAccessGuard` pattern actively prevents change events
- Supports both controlled (`checked`) and uncontrolled (`defaultChecked`) modes

---

## Textarea

### Do

- Use `resize="auto"` for auto-expanding textareas that grow with content
- Use `label`, `hint`, and `error` for accessible field information
- Use `showCount` with `maxLength` for character counting
- Use `rows` to set initial height (defaults to 4)
- Use `access="readonly"` for read-only permission states

### Don't

- Don't use `autoResize` -- it is deprecated, use `resize="auto"` instead
- Don't use `invalid` -- it is deprecated, use `error` instead
- Don't set both `value` and `defaultValue` -- pick controlled or uncontrolled
- Don't expect `hint` to display when `error` is set -- error hides hint

### Tips

- `access="hidden"` returns `null`
- `resize="auto"` dynamically adjusts height via a `useEffect` that measures `scrollHeight`
- `resize="vertical"` allows manual resizing; `resize="none"` disables resizing
- Character count is rendered as `sr-only` for screen reader accessibility
- `ref` forwards to the native `<textarea>` element

---

## Tabs

### Do

- Provide each `TabItem` with a unique `key` property
- Use `activeKey` for controlled mode, `defaultActiveKey` for uncontrolled
- Use `onChange` for the tab change callback
- Use `onCloseTab` with `closable: true` on individual items for dismissible tabs
- Use `variant="enclosed"` for card-like tab containers, `variant="pill"` for pill-shaped tabs

### Don't

- Don't use `value` on `TabItem` -- it is deprecated, use `key` instead
- Don't use `value` or `onValueChange` on `Tabs` -- they are deprecated, use `activeKey` and `onChange`
- Don't pass `appearance`, `listLabel`, `orientation`, or `direction` -- they are accepted but ignored
- Don't use legacy variant names `"standard"`, `"scrollable"`, or `"fullWidth"` -- they are silently normalized to `"line"`

### Tips

- Arrow key navigation uses roving tabindex: arrow keys both move focus and select the tab simultaneously; disabled tabs are skipped
- The close button's `onClick` calls `stopPropagation()` to prevent the tab from being selected when closed
- `fullWidth={true}` or `variant="fullWidth"` makes tabs stretch to fill available width
- Empty `items` array does not crash -- no tablist content renders

---

## Accordion

### Do

- Choose `selectionMode="single"` for FAQ-style (one open at a time) or `"multiple"` for independent panels
- Use `onValueChange` to track which panels are expanded
- Use `onItemToggle` when you need per-item expand/collapse callbacks
- Use `destroyOnHidden={false}` when panel content has expensive initialization or form state
- Use `forceRender` on individual items to keep specific panels in DOM even when `destroyOnHidden={true}`
- Use `createAccordionPreset("faq" | "compact" | "settings")` for common configurations
- Use `collapsible="icon"` when only the icon button should trigger expand/collapse

### Don't

- Don't pass multiple values in `defaultValue` when `selectionMode="single"` -- only the first value is used
- Don't set `collapsible="disabled"` and expect user interaction -- the item cannot be toggled
- Don't rely on `access="readonly"` being visually different from `access="disabled"` -- both disable toggle buttons

### Tips

- In `single` mode, opening a new panel automatically closes the previously open one
- `classes` prop provides per-slot CSS overrides: `root`, `item`, `trigger`, `header`, `titleRow`, `title`, `description`, `extra`, `iconButton`, `icon`, `panel`, `panelInner`
- `createAccordionItemsFromSections` recursively builds nested `Accordion` components from a section tree
- `access="hidden"` returns `null`
- Supports both controlled (`value`) and uncontrolled (`defaultValue`) modes

---

## Dialog

### Do

- Always provide both `open` and `onClose` -- Dialog is always controlled
- Use `size` for width constraint: `"sm"`, `"md"`, `"lg"`, `"xl"`, `"full"`
- Use `title` and `description` for the header section
- Use `footer` for action buttons
- Use `closeOnBackdrop={false}` for confirmation dialogs that require explicit action
- Use `closeOnEscape={false}` for critical workflows where accidental dismiss is dangerous

### Don't

- Don't set `open={true}` without providing `onClose` -- there will be no way to close the dialog
- Don't set `closable={false}` without a `title` if you want a header -- the entire header section is hidden
- Don't try to render Dialog content when `open={false}` -- it returns `null` (no DOM element)

### Tips

- Built on native `<dialog>` element with `showModal()` / `close()` -- provides built-in focus trap and backdrop
- Registers in the overlay-engine layer stack for proper z-index management
- Backdrop click detection uses `e.target === dialogRef.current` to distinguish backdrop from content clicks
- For `closeOnEscape={false}`, the native `cancel` event is caught with `preventDefault()`
- Nested dialogs are supported with increasing z-index via layer stack registration

---

## Modal

### Do

- Always provide `open` and `onClose` for controlled state management
- Use `surface="destructive"` for delete confirmations, `surface="confirm"` for standard confirmations
- Use `onClose` reason parameter (`"close-button"`, `"overlay"`, `"escape"`) to differentiate close actions
- Use `keepMounted={true}` when you need to preserve internal state (form values, scroll position) across open/close
- Use `classes` for per-slot CSS customization: `overlay`, `panel`, `header`, `title`, `body`, `footer`, `closeButton`

### Don't

- Don't omit `onClose` if you want a close button -- the close button only renders when `onClose` is provided
- Don't set both `maxWidth` and `size` -- `maxWidth` overrides the `size`-based `max-w-*` class
- Don't pass `transitionPreset`, `access`, or `accessReason` -- they are accepted but ignored (compat shims)
- Don't use `disablePortal` unless you specifically need inline rendering -- portal to `document.body` is the default for proper stacking

### Tips

- Uses `useScrollLock(open)` to set `body.style.overflow = "hidden"` when open
- When `keepMounted={true}` and `open={false}`, the dialog stays in DOM with `hidden` CSS class
- `portalTarget` redirects portal rendering to a custom mount point
- No `onClose` = no close button and no header (if `title` is also omitted)

---

## Popover

### Do

- Pass a React element as `trigger` -- it receives ARIA attributes via `cloneElement`
- Use `triggerMode` to control interaction: `"click"` (default), `"hover"`, `"focus"`, or `"hover-focus"`
- Use `flipOnCollision={true}` (default) for automatic viewport-aware positioning
- Use `disablePortal={true}` when you need the popover positioned relative to its parent (CSS `absolute`)
- Use `onOpenChange` for controlled open state
- Provide `ariaLabel` for accessibility when no `title` is set

### Don't

- Don't pass a string as `trigger` unless you want an auto-generated `<button>` wrapper -- pass a React element for full control
- Don't use both `open` and `defaultOpen` -- pick controlled or uncontrolled
- Don't forget to set `openDelay` / `closeDelay` for hover mode -- defaults to 90ms each

### Tips

- `access="hidden"` returns `null` -- no DOM output
- The popover panel has `aria-modal="false"` -- content behind it remains interactive (it is a non-modal dialog)
- Pressing Escape closes the popover and restores focus to the trigger
- `useOutsideClick` excludes both the root container and panel from triggering close
- When portaled, uses `fixed` positioning calculated via `resolveOverlayPosition`

---

## Tooltip

### Do

- Use `content` as the primary prop for tooltip text
- Use `placement` to position: `"top"` (default), `"bottom"`, `"left"`, `"right"`
- Set `disabled={true}` when the tooltip should not appear (e.g., when data is loaded)
- Keep tooltip content concise -- it is meant for supplementary information

### Don't

- Don't use `text` -- it is deprecated, use `content` instead
- Don't use tooltips for critical information -- they are not visible on touch devices by default
- Don't put interactive content (buttons, links) inside tooltips -- use Popover instead
- Don't set both `delay` and `openDelay` -- `openDelay` takes precedence over `delay`

### Tips

- If neither `content` nor `text` is provided, the component renders only `{children}` with no tooltip behavior
- Tooltip appears on both `mouseEnter` and `focus` events -- keyboard users see tooltips
- Pressing Escape dismisses the tooltip immediately, bypassing `closeDelay`
- Default `openDelay` is 200ms, default `closeDelay` is 0ms
- `disabled={true}` causes `show()` to return early -- even hover/focus events do not trigger display

---

## Toast

### Do

- Wrap your application tree in `<ToastProvider>` -- `useToast()` throws if used outside the provider
- Use `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()` with a message string
- Use the `title` option for a bold heading above the message
- Use `duration: 0` to prevent auto-dismiss for important messages
- Use `toast.dismiss(id)` for programmatic dismissal

### Don't

- Don't call `useToast()` outside of `<ToastProvider>` -- it throws an error
- Don't exceed `maxVisible` without understanding that oldest toasts are dropped silently
- Don't rely on toasts for critical information that must be acknowledged -- use Dialog or Modal instead

### Tips

- Default `duration` is 4000ms; `maxVisible` defaults to 5
- When `maxVisible` is exceeded, the oldest toasts are dropped (`slice(-(maxVisible - 1))`)
- Different variant toasts can coexist simultaneously with independent dismiss timers
- Long messages render without truncation -- no max-width text overflow is applied
- Toast container uses `aria-live="polite"`; individual toasts use `role="alert"`

---

## Badge

### Do

- Use semantic `variant` values: `"success"`, `"warning"`, `"error"`, `"info"` for status indicators
- Use `dot={true}` for minimal status indicators (renders as a small colored circle)
- Use `size` for proportional sizing: `"sm"`, `"md"` (default), `"lg"`

### Don't

- Don't use `tone` -- it is deprecated, use `variant` instead
- Don't put interactive content inside Badge -- it renders as a `<span>`
- Don't use Badge for clickable actions -- it has no click handler or keyboard support
- Don't use `variant="danger"` and `variant="error"` interchangeably without consistency -- they produce the same visual output

### Tips

- When `dot={true}`, children are ignored -- only the colored dot renders
- `variant` defaults to `"default"` (muted background)
- `className` is merged via `cn()` for style overrides

---

## Card

### Do

- Use `variant` to control visual weight: `"elevated"` (default, shadow), `"outlined"`, `"filled"`, `"ghost"`
- Use `padding` prop instead of custom padding classes: `"none"`, `"sm"`, `"md"` (default), `"lg"`
- Use `hoverable={true}` for clickable cards -- adds hover effects and cursor change
- Use `CardHeader`, `CardBody`, `CardFooter` sub-components for structured layouts
- Use `as="article"` or `as="section"` for semantic HTML when appropriate

### Don't

- Don't use `as="button"` without an `onClick` handler
- Don't nest `Card` inside another `Card` with the same variant unless intentional
- Don't override `padding` with custom classes when the `padding` prop suffices

### Tips

- `as="button"` adds `role="button"` and `tabIndex={0}` to the rendered `<div>` (note: it does not render an actual `<button>` element)
- `hoverable` adds `cursor-pointer`, hover border color, shadow elevation, and active scale effect
- `CardFooter` includes a top border separator and flex layout for action buttons
- `ref` forwards to the root `<div>` element

---

## Pagination

### Do

- Provide `total` (total number of items) and `pageSize` for proper page calculation
- Use `current` for controlled mode, `defaultCurrent` for uncontrolled
- Use `onChange` for the page change callback
- Use `siblingCount` to control how many page buttons are visible around the current page
- Use `showTotal={true}` to display the total item count

### Don't

- Don't use `totalItems` -- it is deprecated, use `total` instead
- Don't use `page` -- it is deprecated, use `current` instead
- Don't use `onPageChange` -- it is deprecated, use `onChange` instead
- Don't pass `mode`, `showPageInfo`, `showSizeChanger`, `pageSizeOptions`, `showQuickJumper`, `simple`, `shape`, `appearance`, `align`, `compact`, `showFirstLastButtons`, `boundaryCount`, or `onPageSizeChange` -- they are all accepted but ignored (compat shims)
- Don't pass `access` or `accessReason` -- they are accepted but ignored on Pagination

### Tips

- Smart ellipsis logic: when there are many pages, ellipsis (`...`) is shown between page ranges
- Previous/Next buttons are automatically disabled at boundaries (page 1 and last page)
- Active page uses `aria-current="page"` for accessibility
- `nav` element uses `aria-label="Pagination"`
- Supports both controlled and uncontrolled modes

---

## Steps

### Do

- Provide each `StepItem` with a unique `key`
- Use `current` for the 0-based active step index
- Use `onChange` to handle step clicks (steps become clickable only when `onChange` is provided)
- Use `status="error"` to mark the current step as failed
- Use `dot={true}` for a minimal dot-style progress indicator
- Use `direction="vertical"` for sidebar or narrow layouts

### Don't

- Don't use `value` (string key) -- it is deprecated, use `current` (numeric index) instead
- Don't use `onValueChange` -- it is deprecated, use `onChange` instead
- Don't pass `interactive` or `orientation` -- they are accepted but ignored
- Don't pass `optional` on `StepItem` -- it is accepted but ignored
- Don't use `key` as the deprecated alias `value` on `StepItem`

### Tips

- Steps automatically determine status: `"finish"` for completed (index < current), `"process"` for active, `"wait"` for future
- Finished steps show a checkmark icon; error steps show an exclamation mark
- `direction="horizontal"` renders connectors as horizontal lines between step indicators
- Steps are only clickable when `onChange` is provided and `disabled` is not set on the step
- Supports both controlled (`current`) and uncontrolled (`defaultCurrent`) modes

---

## FormField

### Do

- Use `FormField` to wrap inputs for consistent label, help, and error styling
- Use `error` to show validation messages -- it also injects `aria-invalid` into the child input
- Use `required` to show the required indicator asterisk (*)
- Use `optional` to show "(optional)" text
- Use `horizontal={true}` for side-by-side label and input layout
- Use `htmlFor` to override the auto-generated ID for input association

### Don't

- Don't set both `required` and `optional` -- they are not mutually exclusive at runtime but are semantically contradictory
- Don't expect `help` to show when `error` is set -- error hides help text
- Don't use FormField with components that don't accept `id`, `aria-describedby`, `aria-invalid`, `disabled`, and `error` props -- FormField injects these via `cloneElement`

### Tips

- FormField uses `React.Children.map` + `cloneElement` to inject `id`, `aria-describedby`, `aria-invalid`, `disabled`, and `error` props into child input elements
- Error message renders with `role="alert"` for screen reader announcement
- `horizontal` layout uses a fixed-width (`w-32`) left column for the label
- Auto-generates a unique `id` via `useId()` if `htmlFor` is not provided

---

## EmptyState

### Do

- Use `icon` for a visual indicator (illustration or icon)
- Use `title` for a clear, concise heading describing the empty state
- Use `description` for helpful guidance on what the user can do next
- Use `action` for a primary CTA button and `secondaryAction` for an alternative action
- Use `compact={true}` for inline empty states within smaller containers (tables, sidebars)

### Don't

- Don't use the `Empty` export -- it is deprecated, use `EmptyState` instead
- Don't overload `description` with long text -- keep it under 2 sentences
- Don't omit `title` -- always tell the user what is empty

### Tips

- `access="hidden"` returns `null`
- `compact` mode uses smaller padding (`py-6 px-4` vs `py-12 px-6`) and smaller text sizes
- Icons are auto-sized to `h-6 w-6` via the `[&>svg]` selector
- Action buttons are rendered in a flex container with `gap-2` spacing
