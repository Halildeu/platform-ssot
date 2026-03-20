# Overlay Capability Matrix (F2.1)

Analysis of each overlay component's actual implementation against overlay-engine hooks.

## Matrix

| Capability        | Dialog           | Modal            | Popover          | Tooltip          | Combobox         | Dropdown         | Tabs             | DetailDrawer     | FormDrawer       |
|-------------------|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|
| **Layer Stack**   | Yes              | Yes              | No               | Yes              | No               | No               | No               | Yes              | Yes              |
| **Portal**        | No               | Yes (createPortal) | Yes (createPortal) | No             | Yes (createPortal) | No             | N/A              | No               | No               |
| **Focus Trap**    | Native `<dialog>` | Native `<dialog>` | No             | No               | No               | No               | N/A              | Manual (focus panel) | Manual (focus panel) |
| **Scroll Lock**   | No               | Yes (useScrollLock) | No            | No               | No               | No               | N/A              | Yes (useScrollLock) | Yes (useScrollLock) |
| **Outside Click** | Via backdrop click | Via backdrop click | Yes (useOutsideClick) | No (mouseLeave) | Yes (useOutsideClick) | Inline handler | N/A          | Backdrop click   | Backdrop click   |
| **Escape**        | Native `onCancel` | Native `onCancel` | Yes (useEscapeKey) | Inline handler | Inline handler   | Inline handler   | N/A              | Inline handler   | Inline handler   |
| **Positioning**   | Fixed (CSS)      | Fixed (CSS)      | resolveOverlayPosition + fixed | Absolute (CSS) | Inline or fixed (portal) | Absolute (CSS) | N/A          | Fixed (CSS)      | Fixed (CSS)      |
| **Restore Focus** | No               | No               | Yes (manual)     | No               | Yes (rAF focus)  | No               | N/A              | No               | No               |

## Notes per Component

### Dialog (`primitives/dialog/Dialog.tsx`)
- Uses native `<dialog>` with `showModal()` / `close()`
- Registers in layer-stack via `registerLayer(layerId, "modal")`
- Escape handled by native `<dialog>` `onCancel` event (prevents default, calls `onClose` if `closeOnEscape` is true)
- Backdrop click handled inline by checking `e.target === dialogRef.current`
- Does NOT use `useScrollLock` (native `<dialog>` may handle this in some browsers, but not explicitly)
- Does NOT use portal (renders inline, native `<dialog>` goes to top layer)
- Does NOT use `useFocusTrap` (relies on native `<dialog>` focus trapping)
- Does NOT restore focus explicitly (relies on native `<dialog>` behavior)

### Modal (`primitives/modal/Modal.tsx`)
- Uses native `<dialog>` with `showModal()` / `close()`
- Registers in layer-stack via `registerLayer(layerId, "modal")`
- Uses `useScrollLock(open)` from overlay-engine
- Uses `ReactDOM.createPortal` when `disablePortal` is false (default)
- Escape handled by native `<dialog>` `onCancel` event
- Backdrop click handled inline by checking `e.target === dialogRef.current`
- Does NOT use `useFocusTrap` (relies on native `<dialog>`)
- Does NOT restore focus explicitly

### Popover (`primitives/popover/Popover.tsx`)
- Uses `useOutsideClick` from overlay-engine (with excludeRefs for root + panel)
- Uses `useEscapeKey` from overlay-engine (restores focus on Escape via `closePopover(true)`)
- Uses `createPortal` when `disablePortal` is false
- Uses `resolveOverlayPosition` for fixed positioning (calculates top/left from trigger bounds)
- Does NOT use layer-stack
- Does NOT use scroll lock
- Does NOT use focus trap
- Restores focus manually: on Escape, calls `triggerAnchorRef.current?.querySelector(...)?.focus()`

### Tooltip (`primitives/tooltip/Tooltip.tsx`)
- Registers in layer-stack via `registerLayer` with "toast" layer (z-index 400+)
- Escape handled inline via `onKeyDown` on wrapper span
- Show/hide via `onMouseEnter`/`onMouseLeave` and `onFocus`/`onBlur`
- Positioned absolutely relative to wrapper via CSS classes
- Does NOT use portal
- Does NOT use focus trap, scroll lock, or outside click
- Does NOT restore focus (not applicable for tooltip)

### Combobox (`components/combobox/Combobox.tsx`)
- Uses `useOutsideClick` from overlay-engine (with excludeRefs for root + popup)
- Escape handled inline in `handleKeyDown` (`event.key === 'Escape'`)
- Uses `createPortal` when `popupStrategy === 'portal'`
- Position calculated manually with viewport collision detection
- Does NOT use layer-stack
- Does NOT use `useEscapeKey` hook (uses inline handler instead)
- Does NOT use scroll lock or focus trap
- Restores focus to input via `requestAnimationFrame(() => inputRef.current?.focus())`

### Dropdown (`primitives/dropdown/Dropdown.tsx`)
- Outside click handled inline via `document.addEventListener("mousedown", ...)`
- Escape handled inline in `handleKeyDown` (`case "Escape"`)
- Positioned absolutely via CSS classes
- Does NOT use any overlay-engine hooks (no imports except `stateAttrs`)
- Does NOT use portal, layer-stack, scroll lock, or focus trap

### Tabs (`components/tabs/Tabs.tsx`)
- Uses `useRovingTabindex` from overlay-engine for arrow key navigation
- Not an overlay component (no portal, focus trap, scroll lock, etc.)
- Included for completeness as it uses an overlay-engine hook

### DetailDrawer (`patterns/detail-drawer/DetailDrawer.tsx`)
- Registers in layer-stack via `registerLayer(layerId, "modal")`
- Uses `useScrollLock(open)` from overlay-engine
- Escape handled inline via `document.addEventListener("keydown", ...)`
- Backdrop click handled inline
- Focuses panel on open via `panelRef.current?.focus()` with `tabIndex={-1}`
- Does NOT use portal (renders as fixed div)
- Does NOT use `useFocusTrap` (no Tab wrapping)
- Does NOT use `useEscapeKey` hook
- Does NOT restore focus on close

### FormDrawer (`patterns/form-drawer/FormDrawer.tsx`)
- Registers in layer-stack via `registerLayer(layerId, "modal")`
- Uses `useScrollLock(open)` from overlay-engine
- Escape handled inline via `document.addEventListener("keydown", ...)`
- Backdrop click handled inline
- Focuses panel on open via `panelRef.current?.focus()` with `tabIndex={-1}`
- Does NOT use portal
- Does NOT use `useFocusTrap`
- Does NOT use `useEscapeKey` hook
- Does NOT restore focus on close

## Dead Code Analysis

### `useFocusTrap` / `FocusTrap` (`overlay-engine/focus-trap.tsx`)
**Status: DEAD CODE (never imported by any component)**

The hook and component are defined and exported from the overlay-engine index, but no component in `primitives/`, `components/`, or `patterns/` imports or uses them. Dialog and Modal rely on native `<dialog>` focus trapping. DetailDrawer and FormDrawer only set `tabIndex={-1}` on the panel and focus it on open, but have no Tab key wrapping.

### `useEscapeKey` (`overlay-engine/outside-click.ts`)
**Status: Used by 1 component (Popover only)**

- **Popover**: imports and calls `useEscapeKey(resolvedOpen, () => closePopover(true))`
- Dialog/Modal: use native `<dialog>` `onCancel` event instead
- Combobox/Dropdown/DetailDrawer/FormDrawer: all use inline `document.addEventListener("keydown", ...)` handlers

### `useOutsideClick` (`overlay-engine/outside-click.ts`)
**Status: Used by 2 components**

- **Popover**: `useOutsideClick({ active: resolvedOpen, onOutsideClick: ..., excludeRefs: [rootRef, panelRef] })`
- **Combobox**: `useOutsideClick({ active: isOpen, onOutsideClick: ..., excludeRefs: [rootRef, popupRef] })`
- Dropdown: uses its own inline mousedown listener instead

### `useScrollLock` (`overlay-engine/scroll-lock.ts`)
**Status: Used by 3 components**

- **Modal**, **DetailDrawer**, **FormDrawer**: all call `useScrollLock(open)`
- Dialog: does NOT use it (potential gap -- native `<dialog>` does not lock scroll in all browsers)

### `registerLayer` / `unregisterLayer` (`overlay-engine/layer-stack.ts`)
**Status: Used by 5 components**

- **Dialog**, **Modal**, **Tooltip**, **DetailDrawer**, **FormDrawer**: all register in the layer stack
- Popover, Combobox, Dropdown: do NOT register (potential gap for z-index management)

### `usePortal` / `Portal` (`overlay-engine/portal.tsx`, `overlay-engine/usePortal.tsx`)
**Status: NOT used by any overlay component directly**

Portal components use `createPortal` from React directly or `ReactDOM.createPortal`. The overlay-engine `usePortal` hook and `Portal` component are exported but not imported by any overlay component. They are used only by internal infrastructure (`OverlaySurface`, `MenuSurface`).

### `useRovingTabindex` (`overlay-engine/roving-tabindex.tsx`)
**Status: Used by 1 component**

- **Tabs**: uses `useRovingTabindex` for arrow key navigation between tab buttons
