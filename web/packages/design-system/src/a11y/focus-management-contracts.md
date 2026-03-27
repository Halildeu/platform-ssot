# Focus Management Contracts

This document defines the expected focus behavior for each overlay component in the design system. These contracts serve as the authoritative reference for accessibility testing and implementation.

---

## Dialog

- **On open:** Focus moves to the first focusable element inside the dialog.
- **On close:** Focus returns to the element that triggered the dialog (trigger element).
- **Focus trap:** Yes. Focus is trapped within the dialog while it is open.
- **Escape key:** Closes the dialog when `closeOnEscape` is enabled (default: true).

## Modal

- **On open:** Focus moves to the first focusable element inside the modal.
- **On close:** Focus returns to the element that triggered the modal (trigger element).
- **Focus trap:** Yes. Focus is trapped within the modal while it is open.
- **Escape key:** Closes the modal when `closeOnEscape` is enabled (default: true).

## Popover

- **On open:** Focus moves to the popover content container.
- **On close:** Focus returns to the trigger element that opened the popover.
- **Focus trap:** No. Focus can leave the popover via Tab.
- **Escape key:** Closes the popover and returns focus to the trigger.

## Tooltip

- **On open:** No focus change. Tooltips are triggered by hover or focus on the trigger element.
- **On close:** No focus change. The trigger element retains focus.
- **Focus trap:** No. Tooltips do not receive focus.
- **Escape key:** Not applicable. Tooltips dismiss on mouse leave or trigger blur.

## DetailDrawer

- **On open:** Focus moves to the drawer content (first focusable element or the close button).
- **On close:** Focus returns to the element that triggered the drawer.
- **Focus trap:** Yes. Focus is trapped within the drawer while it is open.
- **Escape key:** Closes the drawer and returns focus to the trigger.

## FormDrawer

- **On open:** Focus moves to the drawer content (typically the first form field).
- **On close:** Focus returns to the element that triggered the drawer.
- **Focus trap:** Yes. Focus is trapped within the drawer while it is open.
- **Escape key:** Closes the drawer and returns focus to the trigger.

## Toast

- **On open:** No focus change. Toasts are announced to assistive technology via `aria-live` regions.
- **On close:** No focus change.
- **Focus trap:** No. Toasts do not steal focus from the user's current context.
- **Escape key:** Not applicable. Toasts auto-dismiss or are closed via an action button.

## Dropdown

- **On open:** Focus moves to the first menu item in the dropdown list.
- **On close:** Focus returns to the trigger element (the button that opened the dropdown).
- **Focus trap:** No, but arrow keys cycle through menu items.
- **Escape key:** Closes the dropdown and returns focus to the trigger.

## CommandPalette

- **On open:** Focus moves to the search input field inside the command palette.
- **On close:** Focus returns to the previously focused element (before the palette was opened).
- **Focus trap:** Yes. Focus is trapped within the command palette dialog.
- **Escape key:** Closes the command palette and restores previous focus.

---

## General Guidelines

1. **Return focus on close:** Every overlay component that moves focus on open must return focus to the original trigger element when it closes. This prevents the user from losing their place in the page.

2. **aria-modal:** Components that trap focus (Dialog, Modal, DetailDrawer, FormDrawer, CommandPalette) must set `aria-modal="true"` to inform assistive technology.

3. **No focus stealing:** Components that provide passive notifications (Toast, Tooltip) must never steal focus from the user's current context.

4. **Keyboard dismissal:** All overlay components that accept focus must support Escape key dismissal unless there is a documented reason to deviate.

5. **Tab order:** When focus is trapped, Tab and Shift+Tab must cycle through focusable elements within the overlay without escaping to the page behind.
