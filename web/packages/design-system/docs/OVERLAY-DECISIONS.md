# Overlay Decisions (F2.1)

Architectural decisions for overlay-engine hooks based on actual usage analysis.

---

## 1. useFocusTrap

### Current Status
Dead code. No component imports `useFocusTrap` or `FocusTrap`. Dialog and Modal rely on native `<dialog>` element focus trapping. DetailDrawer and FormDrawer do not implement Tab key wrapping at all.

### Decision: KEEP but mark as opt-in; do NOT adopt for Dialog/Modal

### Rationale
- Native `<dialog>` with `showModal()` provides built-in focus trapping that is well-supported in all modern browsers. Layering a custom focus trap on top of the native one would cause double-trapping conflicts.
- DetailDrawer and FormDrawer currently only focus the panel on open but do not trap focus. This is a gap: a user can Tab out of the drawer into the background page. These two components SHOULD adopt `useFocusTrap`.
- Popover intentionally does NOT trap focus (it sets `aria-modal="false"` and is non-modal), so `useFocusTrap` is not appropriate there.

### Action Items
1. **DetailDrawer**: Adopt `useFocusTrap({ active: open, restoreFocus: true })` to prevent Tab from escaping the drawer panel.
2. **FormDrawer**: Same as DetailDrawer.
3. **Dialog/Modal**: No change. Continue relying on native `<dialog>` focus management.
4. **Popover/Tooltip/Combobox/Dropdown**: No change. Focus trapping is not appropriate for non-modal overlays.

---

## 2. useEscapeKey

### Current Status
Used by 1 component (Popover). All other overlay components handle Escape via either:
- Native `<dialog>` `onCancel` event (Dialog, Modal)
- Inline `document.addEventListener("keydown", ...)` handlers (DetailDrawer, FormDrawer)
- Inline `onKeyDown` handler on the component (Tooltip, Combobox, Dropdown)

### Decision: ADOPT for DetailDrawer and FormDrawer; keep inline for Combobox/Dropdown/Tooltip

### Rationale
- The `useEscapeKey` hook provides consistent behavior: it calls `event.preventDefault()` and `event.stopPropagation()`, preventing the Escape from bubbling up to parent overlays. The inline handlers in DetailDrawer and FormDrawer do `preventDefault()` but NOT `stopPropagation()`, which can cause issues when drawers are nested or stacked with other overlays.
- Dialog/Modal should continue using native `<dialog>` `onCancel` because `showModal()` already provides correct Escape behavior. Adding `useEscapeKey` would fire the handler twice.
- Combobox, Dropdown, and Tooltip handle Escape as part of broader keyboard logic (e.g., Combobox checks if the popup is open before closing). Extracting just the Escape handling into `useEscapeKey` would require restructuring their keyboard handlers, with marginal benefit.

### Action Items
1. **DetailDrawer**: Replace inline `document.addEventListener("keydown", ...)` with `useEscapeKey(open, onClose)`.
2. **FormDrawer**: Replace inline handler with `useEscapeKey(open && closeOnEscape, onClose)`.
3. **Dialog/Modal**: No change.
4. **Combobox/Dropdown/Tooltip**: No change (inline handlers are fine for these use cases).

---

## 3. Restore Focus

### Current Status

| Component     | Restores Focus? | Mechanism                                           |
|---------------|:---------------:|-----------------------------------------------------|
| Dialog        | Partial         | Native `<dialog>` may restore in some browsers      |
| Modal         | Partial         | Native `<dialog>` may restore in some browsers      |
| Popover       | Yes (on Escape) | Manual: `triggerAnchorRef.current?.querySelector(...)?.focus()` |
| Tooltip       | N/A             | Not applicable (no focus context change)            |
| Combobox      | Yes             | `requestAnimationFrame(() => inputRef.current?.focus())` after selection/close |
| Dropdown      | No              | No restore logic                                    |
| DetailDrawer  | No              | Focuses panel on open, but does not restore on close |
| FormDrawer    | No              | Focuses panel on open, but does not restore on close |

### Decision: Implement restore-focus for Drawers; leverage useFocusTrap's built-in restoreFocus for consistency

### Rationale
- `useFocusTrap` already has `restoreFocus: true` as its default behavior. By adopting `useFocusTrap` for DetailDrawer and FormDrawer (see Decision 1), we get focus restoration for free.
- Dialog and Modal rely on native `<dialog>`, which restores focus in modern browsers (Chrome, Firefox, Safari all restore focus when `close()` is called on a `<dialog>` opened with `showModal()`). No additional code is needed.
- Dropdown should restore focus to the trigger when the menu closes. This is a gap but is lower priority since Dropdown is a simpler component.

### Action Items
1. **DetailDrawer**: Adopting `useFocusTrap` with `restoreFocus: true` (from Decision 1) handles this automatically.
2. **FormDrawer**: Same as DetailDrawer.
3. **Dropdown**: Add `setOpen(false)` followed by focusing the trigger button. Low priority.
4. **Dialog/Modal**: Verify native behavior in browser testing. No code change expected.

---

## 4. useOutsideClick Adoption Gap

### Current Status
Used by Popover and Combobox. Dropdown has its own inline implementation.

### Decision: ADOPT for Dropdown

### Rationale
The Dropdown component has an inline mousedown listener that duplicates the logic in `useOutsideClick`. Migrating to the hook would reduce code duplication, get the benefit of `excludeRefs` for the container element, and handle touchstart events (which the inline handler does not).

### Action Items
1. **Dropdown**: Replace inline `document.addEventListener("mousedown", ...)` with `useOutsideClick({ active: open, onOutsideClick: () => setOpen(false) })`.

---

## 5. Layer Stack Adoption Gap

### Current Status
Used by Dialog, Modal, Tooltip, DetailDrawer, FormDrawer. NOT used by Popover, Combobox, Dropdown.

### Decision: ADOPT for Popover; defer for Combobox and Dropdown

### Rationale
- Popover is a true overlay that renders via portal and uses fixed positioning. It should register in the layer stack to get proper z-index management and to allow `isTopLayer()` checks for Escape key handling in nested overlay scenarios.
- Combobox's popup is typically short-lived and closely tied to its input. It uses `z-index: 60` (inline) or `z-30` (CSS class), which is sufficient for most cases.
- Dropdown uses `z-[1500]` hardcoded, which already places it above modals. Registering in the layer stack would be more correct but is a lower-priority change.

### Action Items
1. **Popover**: Add `registerLayer` / `unregisterLayer` calls when `resolvedOpen` changes.
2. **Combobox/Dropdown**: Defer to a future phase.

---

## 6. Scroll Lock Gap in Dialog

### Current Status
Modal, DetailDrawer, and FormDrawer all use `useScrollLock(open)`. Dialog does NOT.

### Decision: ADD useScrollLock to Dialog

### Rationale
Native `<dialog>` with `showModal()` does NOT prevent background scrolling in all browsers. Chrome and Firefox differ in behavior. Explicitly adding `useScrollLock` ensures consistent scroll-lock behavior across browsers, matching the Modal component's approach.

### Action Items
1. **Dialog**: Add `useScrollLock(open)` import and call.

---

## Summary of Actions

| Component     | useFocusTrap | useEscapeKey  | Restore Focus | useOutsideClick | Layer Stack | useScrollLock |
|---------------|:------------:|:-------------:|:-------------:|:---------------:|:-----------:|:-------------:|
| Dialog        | No change    | No change     | Verify native | No change       | No change   | **ADD**       |
| Modal         | No change    | No change     | Verify native | No change       | No change   | No change     |
| Popover       | No change    | No change     | No change     | No change       | **ADD**     | No change     |
| Tooltip       | No change    | No change     | N/A           | No change       | No change   | No change     |
| Combobox      | No change    | No change     | No change     | No change       | Defer       | No change     |
| Dropdown      | No change    | No change     | **ADD**       | **ADOPT**       | Defer       | No change     |
| DetailDrawer  | **ADOPT**    | **ADOPT**     | Via useFocusTrap | No change    | No change   | No change     |
| FormDrawer    | **ADOPT**    | **ADOPT**     | Via useFocusTrap | No change    | No change   | No change     |
