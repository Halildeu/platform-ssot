# Design Decisions & Rationale

> **Package:** `@mfe/design-system`
> **Generated from source analysis:** 2026-03-20
>
> This document records the key API and architectural decisions for the top 10
> components, including what was chosen, why, and what trade-offs were accepted.

---

## 1. Button

**Decision:** Flat props interface extending `React.ButtonHTMLAttributes`

**Why:** Button is a leaf primitive -- it wraps a single `<button>` element. A flat props interface (variant, size, density, loading, leftIcon, rightIcon) is simpler than a compound component for this case. All props map directly to visual states of one element.

**Decision:** CSS variables (`var(--action-primary)` etc.) for theming, Tailwind utility classes for layout

**Why:** CSS variables enable runtime theming (light/dark mode, tenant branding) without rebuilding CSS. Tailwind classes handle static layout concerns (padding, height, flex). This hybrid avoids both the rigidity of pure Tailwind color classes and the verbosity of writing all styles as CSS variables.

**Decision:** `access` prop via `interaction-core` module instead of just `disabled`

**Why:** The design system needs four access levels (full, readonly, disabled, hidden) to support role-based access control in enterprise UIs. A simple `disabled` boolean cannot express "visible but non-interactive" (readonly) or "takes up layout space but invisible" (hidden). The `access-controller` module centralizes this logic.

**Trade-off:** The `access="hidden"` behavior uses `invisible` (CSS visibility: hidden) rather than returning `null`. This preserves layout space, which may be unexpected but prevents layout shifts when access changes.

---

## 2. Input

**Decision:** Wrapper component with `FieldControlShell` rather than a bare `<input>`

**Why:** Enterprise forms require consistent label, description, hint, error, and character count rendering around every input. Wrapping the native `<input>` in `FieldControlShell` ensures visual consistency and accessibility (aria-describedby wiring) without requiring consumers to compose these elements manually.

**Decision:** `onValueChange(value, event)` alongside `onChange(event)`

**Why:** Most consumers want the string value, not the synthetic event. `onValueChange` provides a convenience API. Both callbacks fire on every change, so consumers can choose their preferred signature without losing information.

**Decision:** `access="hidden"` returns `null` (unlike Button's `invisible`)

**Why:** Inputs participate in form layouts differently than buttons. A hidden input that preserves space would create visible gaps in form layouts. Returning null allows the form layout to reflow naturally.

**Trade-off:** Returning null means the component's ref becomes null when hidden. Consumers holding refs must handle this case.

---

## 3. Select

**Decision:** Native `<select>` element instead of custom dropdown

**Why:** Native `<select>` provides built-in keyboard navigation, mobile-optimized option pickers, and full accessibility without custom ARIA implementation. The design system wraps it with consistent styling but does not replace the browser's native behavior.

**Trade-off:** Limited styling control over the dropdown panel (option list). Cannot render rich content (icons, descriptions) inside options. The deprecated `description`, `metaLabel`, and `tone` fields on `SelectOption` reflect a prior attempt at rich options that was abandoned in favor of the native approach.

**Decision:** Many deprecated props accepted but ignored

**Why:** The Select component was migrated from a more complex custom implementation. To avoid breaking consumers, the old props (`clearable`, `showSelectionMeta`, `access`, etc.) are accepted in the type signature but destructured and discarded. This allows gradual migration without runtime errors.

---

## 4. Dialog

**Decision:** Native `<dialog>` element with `showModal()` API

**Why:** The native `<dialog>` element provides built-in focus trap, Escape key handling, backdrop rendering, and top-layer stacking. This eliminates the need for custom focus trap implementations, custom backdrop overlays, and z-index management hacks.

**Decision:** Controlled-only API (`open` + `onClose` required)

**Why:** Dialogs are inherently stateful UI that affects application flow (confirming actions, displaying forms). Uncontrolled dialogs would create hidden state that is difficult to synchronize with application logic. The controlled pattern forces consumers to own the open/close state.

**Decision:** `open=false` returns `null` (no DOM)

**Why:** Unlike Modal's `keepMounted` option, Dialog takes a simpler approach -- closed dialogs are fully unmounted. This is appropriate for the simpler Dialog use case (content display, confirmation). Modal provides `keepMounted` for cases where internal state preservation matters.

**Trade-off:** No animation on close since the element is immediately removed. Opening uses CSS `animate-in` for entrance animation.

---

## 5. Modal

**Decision:** Rich Modal with `OverlayCloseReason` discrimination

**Why:** Modal is the more feature-rich sibling of Dialog. It adds close reason tracking (`"close-button" | "overlay" | "escape"`), surface variants for semantic coloring, scroll locking, portal rendering, and `keepMounted` support. These features are needed for complex workflows (multi-step forms, audit trails).

**Decision:** `surface` prop for semantic header coloring

**Why:** Enterprise UIs need destructive confirmations (red header), informational confirmations (blue header), and audit overlays (muted header). Using a `surface` enum rather than raw color props keeps the API semantic and constrains choices to the design system's palette.

**Decision:** Portal rendering by default

**Why:** Modals must render above all other content regardless of DOM nesting. Portaling to `document.body` ensures correct stacking. `disablePortal` is provided for testing and SSR scenarios where portaling is problematic.

---

## 6. Popover

**Decision:** Trigger-content compound pattern with `trigger` as a prop

**Why:** Popover needs to attach event handlers (click, hover, focus, keyboard) to the trigger element. Passing trigger as a prop allows the component to `cloneElement` and inject these handlers while preserving the consumer's original handlers. This is more flexible than a render-prop pattern and less boilerplate than a compound component.

**Decision:** Custom positioning engine (`resolveOverlayPosition`) instead of Floating UI / Popper.js

**Why:** The design system uses a custom `OverlayPositioning` module that handles side preference, alignment, collision flipping, and viewport edge padding. This avoids a heavy third-party dependency while providing the specific positioning behavior needed. The positioning runs on `useLayoutEffect` + `requestAnimationFrame` for paint-accurate placement.

**Decision:** Multiple trigger modes (`click | hover | focus | hover-focus`)

**Why:** Different UI patterns need different trigger behaviors -- menus use click, help text uses hover, and accessible patterns need focus support. The `triggerMode` prop unifies these patterns in one component rather than requiring separate components for each interaction model.

**Trade-off:** The hover mode requires careful timer management (open/close delays, panel enter/leave cancellation) to prevent flickering. The `scheduleOpen` / `scheduleClose` pattern with ref-tracked timers handles this but adds complexity.

---

## 7. Tooltip

**Decision:** Inline CSS positioning instead of portal

**Why:** Tooltips are simple text overlays that appear adjacent to their trigger. Using `absolute` positioning within a `relative` wrapper (no portal) keeps the implementation simple and avoids the complexity of portal-based positioning for a lightweight component.

**Trade-off:** Tooltips can be clipped by `overflow: hidden` ancestors. For complex layout scenarios, Popover (which supports portaling) is the recommended alternative.

**Decision:** `content` replaces deprecated `text` prop

**Why:** `content` is a more descriptive prop name and aligns with Popover's API. The `text` prop is maintained for backward compatibility but `content` takes precedence (`content ?? text`).

**Decision:** 200ms default open delay

**Why:** A 200ms delay prevents tooltips from flashing during casual mouse movement. This matches common tooltip library defaults and provides a good balance between responsiveness and avoiding visual noise.

---

## 8. Switch

**Decision:** `<input type="checkbox" role="switch">` instead of custom element

**Why:** Using a native checkbox as the underlying element provides built-in keyboard interaction (Space to toggle) and form participation. The `role="switch"` ARIA attribute tells assistive technology to announce it as a toggle switch rather than a checkbox.

**Decision:** `onCheckedChange(checked: boolean)` instead of `onChange(event)`

**Why:** Switch is a binary control -- consumers almost always want the boolean state, not the synthetic event. Unlike Checkbox (which offers both `onChange` and deprecated `onCheckedChange`), Switch uses `onCheckedChange` as its primary API. This was an intentional API improvement learned from the Checkbox migration.

**Decision:** Density via CSS `scale` transform

**Why:** Switch has a complex visual structure (track + thumb) where proportional scaling produces better results than adjusting individual padding values. `scale-75` and `scale-110` maintain the aspect ratio and visual balance that would be lost with padding-only adjustments.

---

## 9. Tabs

**Decision:** Data-driven `items` array instead of compound `<Tab>` / `<TabPanel>` children

**Why:** The `items` array pattern simplifies controlled state management -- the component knows all tab keys upfront, can validate `activeKey`, and can render the correct panel without child traversal. It also makes dynamic tab addition/removal straightforward (just update the array).

**Trade-off:** Less flexible than compound components for complex per-tab customization. Mitigated by `TabItem` fields like `icon`, `badge`, `description`, `closable`, and the `content` field accepting any ReactNode.

**Decision:** Roving tabindex for keyboard navigation

**Why:** The WAI-ARIA Tabs pattern recommends roving tabindex for tab lists. Arrow keys move focus between tabs (and select them). Tab key moves focus into/out of the tab list. The `useRovingTabindex` hook from `overlay-engine` implements this with loop support and disabled tab skipping.

**Decision:** Legacy variant normalization

**Why:** The Tabs component went through multiple API iterations. Rather than breaking consumers, legacy variant names (`"standard"`, `"scrollable"`, `"fullWidth"`) are silently mapped to the canonical variants (`"line"`, `"line"`, `"line"` + `fullWidth`).

---

## 10. Accordion

**Decision:** Data-driven `items` array with controlled/uncontrolled dual API

**Why:** Same rationale as Tabs -- the items array makes state management explicit. The component supports both controlled (`value` prop) and uncontrolled (`defaultValue`) modes. `onValueChange` provides the full expanded array; `onItemToggle` provides per-item granularity.

**Decision:** Three `collapsible` modes (`"header" | "icon" | "disabled"`)

**Why:** Enterprise UIs need varying levels of accordion interactivity. `"header"` makes the full header clickable (most common). `"icon"` restricts toggling to just the expand/collapse icon button (useful when header content is interactive). `"disabled"` prevents any toggling.

**Decision:** Premium surface styling with `border-subtle`, `backdrop-blur`, `shadow` tokens

**Why:** The accordion uses the design system's "premium surface" treatment -- glass-effect borders, subtle shadows, and backdrop blur. This is consistent with the broader design language (also seen in Popover panels and Modal surfaces) and provides visual hierarchy without heavy decoration.

**Decision:** `destroyOnHidden=true` as default

**Why:** Collapsed accordion panels are unmounted by default to keep the DOM lightweight. For panels with expensive content or internal state that must survive collapse, `destroyOnHidden=false` or per-item `forceRender` can be used.

**Decision:** `createAccordionPreset()` factory

**Why:** Common accordion patterns (FAQ, compact sidebar, settings panel) have specific combinations of props. The preset factory (`createAccordionPreset("faq")`) returns a pre-configured props object, reducing boilerplate and ensuring consistency across the application.

---

## Cross-Cutting Decisions

### Access Control System

All interactive components share the `access-controller` / `interaction-core` module providing four access levels: `full`, `readonly`, `disabled`, `hidden`. This is a design-system-wide decision to support enterprise RBAC requirements without ad-hoc per-component implementations.

### Density System

All components support a `density` prop with values `"compact" | "comfortable" | "spacious"`. This enables information-dense table UIs (compact) and touch-friendly mobile UIs (spacious) without separate component variants.

### CSS Variables + Tailwind Hybrid

The design system uses CSS custom properties for all color tokens (`--action-primary`, `--text-primary`, `--border-default`, etc.) and Tailwind utility classes for layout (spacing, sizing, flex). This separation allows runtime theme switching via CSS variable overrides while keeping layout styles statically analyzable.

### Overlay Engine

All overlay components (Dialog, Modal, Popover, Tooltip) share the `overlay-engine` module which provides: layer stack management (z-index ordering), scroll locking, outside click detection, escape key handling, and roving tabindex. This centralizes complex overlay logic and ensures consistent behavior across components.

### Deprecation Strategy

All prop renames follow the same pattern: accept both old and new prop, new prop takes precedence, emit dev-mode `console.warn` for old prop, old prop scheduled for removal in next major. See [DEPRECATION-POLICY.md](../../DEPRECATION-POLICY.md).
