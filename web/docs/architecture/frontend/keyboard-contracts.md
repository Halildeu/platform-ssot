# Keyboard Contracts Reference

Keyboard contracts define the expected keyboard interaction for every interactive component in the design system. They are based on WAI-ARIA Authoring Practices Guide (APG) patterns and enforced through a central registry in `keyboard-contract.ts`.

Each contract maps physical key presses to semantic actions (`activate`, `toggle`, `navigate-next`, etc.). Components consume these contracts via `createKeyHandler()`, which wires key events to action callbacks. This keeps keyboard logic consistent, testable, and decoupled from component rendering.

Source: `packages/design-system/src/internal/interaction-core/keyboard-contract.ts`

---

## Component Keyboard Tables

### Button
**Role:** `button`

| Key | Action | Description |
|-----|--------|-------------|
| Enter / Space | `activate` | Trigger button action |

### Switch
**Role:** `switch`

| Key | Action | Description |
|-----|--------|-------------|
| Space | `toggle` | Toggle switch state |

### Checkbox
**Role:** `checkbox`

| Key | Action | Description |
|-----|--------|-------------|
| Space | `toggle` | Toggle checked state |

### Radio
**Role:** `radio`

| Key | Action | Description |
|-----|--------|-------------|
| ArrowDown / ArrowRight | `navigate-next` | Move to next radio option |
| ArrowUp / ArrowLeft | `navigate-prev` | Move to previous radio option |
| Space | `select` | Select current option |

### TextInput
**Role:** `textbox`

| Key | Action | Description |
|-----|--------|-------------|
| Escape | `clear` | Clear input (if clearable) |
| Enter | `submit` | Submit form (if in form context) |

### Select
**Role:** `listbox`

| Key | Action | Description |
|-----|--------|-------------|
| Enter / Space | `expand` | Open dropdown |
| Escape | `dismiss` | Close dropdown |
| ArrowDown | `navigate-next` | Next option |
| ArrowUp | `navigate-prev` | Previous option |
| Home | `navigate-first` | First option |
| End | `navigate-last` | Last option |
| Enter | `select` | Select current option |

### Tabs
**Role:** `tablist`

| Key | Action | Description |
|-----|--------|-------------|
| ArrowRight | `navigate-next` | Next tab |
| ArrowLeft | `navigate-prev` | Previous tab |
| Home | `navigate-first` | First tab |
| End | `navigate-last` | Last tab |

### Accordion
**Role:** `region`

| Key | Action | Description |
|-----|--------|-------------|
| Enter / Space | `toggle` | Expand/collapse panel |
| ArrowDown | `navigate-next` | Next panel header |
| ArrowUp | `navigate-prev` | Previous panel header |
| Home | `navigate-first` | First panel header |
| End | `navigate-last` | Last panel header |

### Dialog
**Role:** `dialog`

| Key | Action | Description |
|-----|--------|-------------|
| Escape | `dismiss` | Close dialog |
| Tab | `navigate-next` | Move focus within dialog (trapped) |

### Combobox
**Role:** `combobox`

| Key | Action | Description |
|-----|--------|-------------|
| ArrowDown | `expand` | Open listbox or navigate next |
| ArrowUp | `navigate-prev` | Navigate previous |
| Escape | `dismiss` | Close listbox |
| Enter | `select` | Select highlighted option |
| Home | `navigate-first` | First option |
| End | `navigate-last` | Last option |

### Menu
**Role:** `menu`

| Key | Action | Description |
|-----|--------|-------------|
| ArrowDown | `navigate-next` | Next menu item |
| ArrowUp | `navigate-prev` | Previous menu item |
| Enter / Space | `activate` | Activate menu item |
| Escape | `dismiss` | Close menu |
| Home | `navigate-first` | First menu item |
| End | `navigate-last` | Last menu item |

### Tooltip
**Role:** `tooltip`

| Key | Action | Description |
|-----|--------|-------------|
| Escape | `dismiss` | Dismiss tooltip |

### Slider
**Role:** `slider`

| Key | Action | Description |
|-----|--------|-------------|
| ArrowRight | `navigate-next` | Increase value |
| ArrowLeft | `navigate-prev` | Decrease value |
| Home | `navigate-first` | Set to minimum |
| End | `navigate-last` | Set to maximum |
| PageUp | `navigate-next` | Large increase |
| PageDown | `navigate-prev` | Large decrease |

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Button | Integrated | Native `<button>` handles Enter/Space |
| Switch | Integrated | Space to toggle via contract |
| Checkbox | Integrated | Space to toggle via native + contract |
| Radio | Integrated | Arrow keys + Space via contract |
| TextInput | Integrated | Native `<input>` handles most keys |
| Select | Integrated | Native `<select>` + contract for custom select |
| Tabs | Integrated | Arrow keys via interaction-core |
| Accordion | Not yet integrated | Contract defined, component pending |
| Dialog | Not yet integrated | Contract defined, component pending |
| Combobox | Not yet integrated | Contract defined, component pending |
| Menu | Not yet integrated | Contract defined, component pending |
| Tooltip | Not yet integrated | Contract defined, component pending |
| Slider | Not yet integrated | Contract defined, component pending |

---

## Testing Guide

Use `createKeyHandler()` directly in vitest tests to verify keyboard contracts without rendering full components.

### Basic pattern

```ts
import { describe, it, expect, vi } from "vitest";
import { createKeyHandler, Keys } from "@/internal/interaction-core/keyboard-contract";

describe("Switch keyboard contract", () => {
  it("calls toggle on Space", () => {
    const toggle = vi.fn();
    const handler = createKeyHandler("switch", { toggle });

    const event = new KeyboardEvent("keydown", { key: Keys.Space });
    // Stub preventDefault since JSDOM events are not cancelable by default
    event.preventDefault = vi.fn();

    handler(event);

    expect(toggle).toHaveBeenCalledOnce();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("ignores Enter (not in switch contract)", () => {
    const toggle = vi.fn();
    const handler = createKeyHandler("switch", { toggle });

    handler(new KeyboardEvent("keydown", { key: Keys.Enter }));

    expect(toggle).not.toHaveBeenCalled();
  });
});
```

### Testing navigation contracts (e.g. Tabs)

```ts
describe("Tabs keyboard contract", () => {
  it("navigates with ArrowRight / ArrowLeft", () => {
    const next = vi.fn();
    const prev = vi.fn();
    const handler = createKeyHandler("tabs", {
      "navigate-next": next,
      "navigate-prev": prev,
    });

    const right = new KeyboardEvent("keydown", { key: Keys.ArrowRight });
    right.preventDefault = vi.fn();
    handler(right);
    expect(next).toHaveBeenCalledOnce();

    const left = new KeyboardEvent("keydown", { key: Keys.ArrowLeft });
    left.preventDefault = vi.fn();
    handler(left);
    expect(prev).toHaveBeenCalledOnce();
  });

  it("jumps to first/last with Home/End", () => {
    const first = vi.fn();
    const last = vi.fn();
    const handler = createKeyHandler("tabs", {
      "navigate-first": first,
      "navigate-last": last,
    });

    const home = new KeyboardEvent("keydown", { key: Keys.Home });
    home.preventDefault = vi.fn();
    handler(home);
    expect(first).toHaveBeenCalledOnce();

    const end = new KeyboardEvent("keydown", { key: Keys.End });
    end.preventDefault = vi.fn();
    handler(end);
    expect(last).toHaveBeenCalledOnce();
  });
});
```

### Testing with modifiers

```ts
it("requires modifier key when contract specifies withModifier", () => {
  // If a contract binding has withModifier: true,
  // the handler only fires when Ctrl (or Cmd on Mac) is held.
  const handler = createKeyHandler("someComponent", {
    activate: vi.fn(),
  });

  // Without modifier — should not fire
  handler(new KeyboardEvent("keydown", { key: Keys.Enter }));

  // With modifier — should fire
  handler(new KeyboardEvent("keydown", { key: Keys.Enter, ctrlKey: true }));
});
```

### Describing contracts for snapshots

Use `describeKeyboardContract()` to generate human-readable descriptions, useful for snapshot tests or documentation output:

```ts
import { describeKeyboardContract } from "@/internal/interaction-core/keyboard-contract";

it("describes the select contract", () => {
  const lines = describeKeyboardContract("select");
  expect(lines).toContain("Enter / → Open dropdown");
  expect(lines.length).toBe(7);
});
```
