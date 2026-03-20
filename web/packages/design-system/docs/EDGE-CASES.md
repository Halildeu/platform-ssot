# Edge-Case Behavior Catalog

> **Package:** `@mfe/design-system`
> **Generated from source and test files:** 2026-03-20
>
> This catalog documents verified edge-case behaviors found in component source
> code and test suites. Every entry below is backed by source inspection or an
> existing test.

---

## Button

- **iconOnly without accessible label**: In development mode, a `console.warn` is emitted if `iconOnly` is `true` but no `aria-label`, `aria-labelledby`, or `title` is provided. The button still renders but is inaccessible to screen readers.
- **loading + disabled interaction**: When `loading` is `true`, the button is automatically disabled (`disabled` attribute set). `onClick` is not fired. A `Spinner` replaces children content.
- **loadingLabel fallback**: If `loading` is true and `loadingLabel` is not provided, `children` text is shown alongside the spinner. If `iconOnly` is also true, both `loadingLabel` and `children` are hidden.
- **access="hidden" behavior**: The button is still rendered in the DOM but receives the `invisible` CSS class, making it visually hidden but preserving layout space.
- **access-blocked click prevention**: When `access` blocks interaction (readonly/disabled), the `onClick` handler is replaced with `preventDefault + stopPropagation`, not just skipped. This prevents event bubbling.
- **className forwarding**: Custom `className` is merged with internal classes via `cn()` utility, allowing override of internal styles.
- **ref forwarding**: `forwardRef` correctly exposes the underlying `HTMLButtonElement`.

## Input

- **error hides hint**: When both `error` and `hint` are provided, the hint is completely hidden and only the error message is displayed. Verified in tests.
- **controlled vs uncontrolled parity**: Component supports both modes. In controlled mode (`value` prop provided), typing calls `onChange` but the displayed value does not change without a prop update. In uncontrolled mode, `defaultValue` sets the initial value and typing updates the display.
- **onValueChange + onChange coexistence**: Both callbacks can be provided simultaneously. `onChange` fires the native event; `onValueChange` fires with the string value and event.
- **loading makes input readonly**: When `loading` is `true`, the input becomes `readOnly` (not disabled), and a `Spinner` appears in the trailing visual slot.
- **access="hidden" returns null**: Unlike Button's `invisible` class, Input returns `null` from render when `access="hidden"`, removing it from the DOM entirely.
- **access="readonly" behavior**: The input receives the `readOnly` HTML attribute. The `withAccessGuard` wrapper actively prevents change events via `preventDefault + stopPropagation`.
- **Character counter (sr-only)**: The `showCount` / `maxLength` counter is rendered inside a `sr-only` span, making it accessible to screen readers but invisible visually.
- **inputSize deprecated resolution**: When both `size` and `inputSize` are provided, `size` takes precedence (`sizeProp ?? inputSize ?? "md"`).
- **prefix/suffix aliases**: `prefix` maps to `leadingVisual`, `suffix` maps to `trailingVisual`. The leading/trailing prop takes precedence if both are provided.

## Select

- **Empty options array**: Renders a valid `<select>` element with no `<option>` children. No crash or error. Verified in tests.
- **Placeholder is disabled**: The placeholder option is rendered as `<option value="" disabled>`, preventing selection after initial display.
- **selectSize vs size precedence**: `size` takes precedence over deprecated `selectSize` (`sizeProp ?? selectSize ?? "md"`). A dev-mode `console.warn` fires when `selectSize` is used.
- **onValueChange as onChange fallback**: If `onChange` is not provided but `onValueChange` is, it is wired as the `onChange` handler. If both are provided, `onChange` wins.
- **Loading replaces chevron**: When `loading` is `true`, the chevron icon is replaced with an animated SVG spinner. The select itself becomes disabled.
- **Deprecated props are destructured out**: Props like `label`, `description`, `hint`, `clearable`, etc. are destructured and discarded so they do not leak to the native `<select>` element as invalid HTML attributes.

## Checkbox

- **Indeterminate state**: Set via a ref callback (`el.indeterminate = indeterminate`), not via an HTML attribute (since HTML does not support indeterminate as an attribute). The visual shows a dash icon instead of a checkmark.
- **Card variant with checked state**: When `variant="card"`, the checkbox is wrapped in a bordered card container. When `checked`, the card receives a primary border and subtle background color.
- **readonly click prevention**: HTML `<input type="checkbox" readOnly>` does not actually prevent clicks. The component uses `withAccessGuard` to actively `preventDefault + stopPropagation` on change events, plus an `onClick` handler that calls `preventDefault` on the input directly.
- **Label click delegation blocking**: For readonly and disabled states, the `<label>` element's `onClick` calls `preventDefault` to prevent click delegation from the label to the hidden input.
- **onCheckedChange as onChange fallback**: If `onChange` is absent but `onCheckedChange` is provided, it is wired as the change handler with `(checked: boolean, event)` signature.

## Radio

- **readonly click prevention**: Same pattern as Checkbox -- `withAccessGuard` prevents change events, and an `onClick` handler on the input calls `preventDefault` for readonly state.
- **Label click blocked in readonly**: For readonly state, the `<label>` `htmlFor` is set to `undefined` and `onClick` calls `preventDefault`, doubly ensuring no click delegation.
- **RadioGroup cloneElement injection**: `RadioGroup` uses `React.Children.map` + `cloneElement` to inject `name`, `checked`, and `onChange` into child `Radio` components. Non-`Radio` children pass through unchanged.
- **access="hidden" returns null**: Both `Radio` and its parent context correctly handle null render for hidden access.

## Switch

- **Uses checkbox with role="switch"**: Internally renders `<input type="checkbox" role="switch">`. This is important for assistive technology behavior.
- **loading disables interaction**: When `loading` is `true`, the switch is disabled and shows an animated spinner SVG inside the thumb circle.
- **Destructive variant color**: When `variant="destructive"` and `checked`, the track uses `--state-error-text` color instead of `--action-primary`.
- **Density via CSS scale**: Unlike other components that use padding-based density, Switch uses `scale-75` (compact) and `scale-110` (spacious) CSS transforms.
- **readonly click prevention**: Same `withAccessGuard` pattern as Checkbox. The `onClick` handler on the input calls `preventDefault` for readonly state.

## Tabs

- **Legacy variant normalization**: Variant values `"standard"` and `"scrollable"` are silently normalized to `"line"`. `"fullWidth"` is normalized to `"line"` and also sets `fullWidth=true`.
- **TabItem.value deprecated fallback**: `resolveKey(item)` returns `item.key ?? item.value ?? ""`. This allows legacy `value` field to work as the tab identifier.
- **Roving tabindex (overlay-engine)**: Arrow key navigation uses `useRovingTabindex` from the overlay engine. Arrow keys both move focus and select the tab simultaneously. Disabled tabs are skipped during arrow navigation.
- **value/onValueChange backward compat**: `value` maps to `activeKey`, `onValueChange` maps to `onChange`. The new props take precedence.
- **Closable tab close button isolation**: The close button's `onClick` calls `e.stopPropagation()` to prevent the tab from being selected when the close button is clicked.
- **Empty items**: No crash with an empty `items` array, though no tablist content will render.

## Accordion

- **Single vs multiple selection mode**: In `single` mode, opening a new panel automatically closes the previously open one. In `multiple` mode, panels are independent.
- **defaultValue single-mode truncation**: If `defaultValue` contains multiple values but `selectionMode="single"`, only the first value is used (`explicit.slice(0, 1)`).
- **destroyOnHidden behavior**: When `destroyOnHidden=true` (default), collapsed panel content is removed from the DOM. When `false`, all panels remain in DOM with `hidden` attribute.
- **forceRender override**: Individual items can set `forceRender=true` to keep their panel in DOM even when `destroyOnHidden=true` globally.
- **Nested accordion support**: `createAccordionItemsFromSections` recursively builds nested `Accordion` components from a section tree. Nested accordions can have independent configuration via options.
- **Collapsible="icon" mode**: Only the icon button triggers expand/collapse, not the full header. The header text is non-interactive.
- **Collapsible="disabled" mode**: The item cannot be toggled at all, regardless of click target.
- **Empty items array**: Renders the root container with `aria-label` but no items. No crash.
- **access="disabled" blocks all items**: All toggle buttons receive `disabled` attribute.
- **access="readonly" blocks all items**: All toggle buttons receive `disabled` attribute (same visual behavior as disabled).

## Dialog

- **Native `<dialog>` element**: Uses `dialog.showModal()` and `dialog.close()` for open/close, providing built-in focus trap and backdrop.
- **Nested dialog stacking**: Two open dialogs register in the overlay-engine layer stack with increasing z-index. Each dialog gets its own layer registration via `registerLayer/unregisterLayer`.
- **Backdrop click detection**: Uses `e.target === dialogRef.current` to distinguish backdrop clicks from content clicks. Clicking inside the dialog body does not trigger close (event bubbling is handled correctly).
- **closeOnEscape=false**: The native `cancel` event is caught and `preventDefault()` is called. If `closeOnEscape=false`, `onClose` is not called, but the dialog stays open.
- **open=false returns null**: No DOM element is rendered at all when `open=false`. This means no hidden dialog exists in the DOM.
- **closable=false + no title**: The entire header section (including border-b divider) is not rendered. Only the body content appears.

## Modal

- **OverlayCloseReason discrimination**: `onClose` receives a reason parameter: `"close-button"`, `"overlay"`, or `"escape"`. This allows consumers to differentiate close actions.
- **Scroll lock integration**: Uses `useScrollLock(open)` from overlay-engine. Sets `body.style.overflow = "hidden"` when open, restores on close.
- **keepMounted behavior**: When `keepMounted=true` and `open=false`, the dialog remains in DOM with `hidden` CSS class. This preserves internal state (form values, scroll position).
- **Portal rendering**: By default, Modal portals to `document.body`. Can be disabled with `disablePortal` or redirected with `portalTarget`.
- **Surface header coloring**: `surface="destructive"` applies `bg-red-50` to the header. `surface="confirm"` applies `bg-blue-50`. These are dark-mode aware.
- **maxWidth overrides size**: When `maxWidth` is provided, the `size`-based `max-w-*` class is not applied. `maxWidth` is set as inline style.
- **No onClose = no close button**: The close button only renders when `onClose` is provided. Without it, title renders but there is no way to close via button (must use controlled `open` prop).

## Popover

- **Viewport collision flipping**: When `flipOnCollision=true` (default), `resolveOverlayPosition` from `OverlayPositioning` calculates whether the popover fits in the preferred side and flips to the opposite side if needed. The `data-collision-flipped` attribute is set on the panel.
- **String trigger fallback**: If `trigger` is a string (not a ReactElement), a styled `<button>` element is created automatically as a wrapper.
- **Hover delay with enter/leave**: Hover trigger mode uses configurable `openDelay` (default 90ms) and `closeDelay` (default 90ms). Moving from trigger to panel cancels the close timer via `onMouseEnter` on the panel.
- **Focus trigger with blur tracking**: Focus-mode popover tracks `relatedTarget` on blur events. If focus moves to the panel or root container, the close is cancelled.
- **Outside click via overlay-engine**: `useOutsideClick` hook excludes both `rootRef` and `panelRef` from triggering close.
- **Escape key restores focus**: Pressing Escape closes the popover and restores focus to the first focusable element within the trigger anchor.
- **access="hidden" returns null**: No DOM output when access is hidden.
- **Non-modal dialog**: The popover panel has `aria-modal="false"`, indicating it is a non-modal dialog (content behind it remains interactive).
- **Portal positioning**: When portaled, the panel uses `fixed` positioning with calculated `left`/`top` from `resolveOverlayPosition`. A `requestAnimationFrame` + `useLayoutEffect` ensures position is accurate after paint.

## Tooltip

- **Empty content passthrough**: If neither `content` nor `text` is provided (both undefined), the component renders only `{children}` with no wrapper tooltip behavior.
- **Escape key dismissal**: Pressing Escape while tooltip is visible hides it immediately, without waiting for `closeDelay`.
- **Disabled prevents show**: When `disabled=true`, the `show()` function returns early. Even with hover/focus events, the tooltip never appears.
- **Delay resolution**: `openDelay` takes precedence over `delay`. If neither is set, defaults to 200ms. `closeDelay` defaults to 0.
- **Layer stack registration**: Tooltip registers in the overlay-engine layer stack with type `"toast"` (not `"tooltip"`), placing it at a high z-index.
- **Focus-triggered tooltip**: Tooltip appears on both `mouseEnter` and `focus` events, ensuring keyboard users see tooltips.

## Toast

- **useToast outside provider throws**: Calling `useToast()` outside of `<ToastProvider>` throws an error with a descriptive message.
- **maxVisible drops oldest**: When `maxVisible` is exceeded, the oldest toasts are dropped (using `slice(-(maxVisible - 1))`). Only the newest N toasts survive.
- **duration=0 prevents auto-dismiss**: Setting `duration` to `0` or a falsy value prevents the auto-dismiss timer from being set. Toast stays until manually dismissed.
- **Multiple variant coexistence**: Different variant toasts (info, success, warning, error) can coexist in the toast container simultaneously. Each has independent dismiss timers.
- **Long message no truncation**: Long messages render without truncation. There is no max-width text overflow applied.
- **Dismiss targets specific toast**: Clicking dismiss on one toast removes only that toast. Other toasts remain visible. Verified in tests.
- **aria-live="polite" container**: Toast container uses `aria-live="polite"` for accessibility. Individual toasts use `role="alert"`.

## FormField

- **Error hides help text**: When `error` is provided, `help` text is not rendered. Only one of the two is visible at a time.
- **cloneElement prop injection**: FormField uses `React.Children.map` + `cloneElement` to inject `id`, `aria-describedby`, `aria-invalid`, `disabled`, and `error` props into child input elements.
- **required and optional mutually exclusive**: Both `required` and `optional` props exist. If `required=true`, an asterisk (*) is shown. If `optional=true`, "(optional)" text is shown. No runtime enforcement of mutual exclusivity.
- **Horizontal layout**: When `horizontal=true`, the label is rendered as a fixed-width (`w-32`) left column with `mt-2` alignment.

## Table (TableSimple)

- **Empty rows shows EmptyState**: When `rows` is an empty array and `loading` is `false`, an `<Empty>` component is rendered instead of the table. The empty message comes from `emptyStateLabel` or `localeText.emptyStateLabel`.
- **Loading skeleton rows**: When `loading=true`, 3 skeleton rows are rendered regardless of `rows` content. Alternating rows get different animation timing.
- **Column render vs accessor priority**: If `column.render` is provided, it takes precedence over `column.accessor`. If `accessor` is a function, it receives `(row, index)`. If it is a string key, it does a direct property lookup.
- **access="hidden" returns null**: No DOM output when access is hidden.
- **stickyHeader with backdrop-blur**: `stickyHeader=true` applies `sticky top-0 z-[1]` with `backdrop-blur` for a glass effect on scroll.
- **Striped alternation**: Row striping uses `rowIndex % 2 === 1` for the muted background. Only odd-indexed rows (0-based) get the stripe.
- **getRowKey fallback**: If `getRowKey` is not provided, the row index is used as the React key. This can cause issues with list reordering.
