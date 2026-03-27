import { describe, test, expect, vi } from "vitest";
import {
  stateAttrs,
  stateSelector,
  focusRingClass,
  focusRingClassWithColor,
  defaultFocusStrategy,
  Keys,
  KEYBOARD_CONTRACTS,
  createKeyHandler,
  describeKeyboardContract,
  evaluateGuard,
  guardEvent,
  guardStyles,
  guardAria,
  resolveKeyboardIntent,
  resolveClickIntent,
} from "../index";

/* ================================================================== */
/*  State Attributes                                                   */
/* ================================================================== */

describe("stateAttrs", () => {
  test("returns empty object for default/full access", () => {
    expect(stateAttrs({})).toEqual({});
    expect(stateAttrs({ access: "full" })).toEqual({});
  });

  test("sets data-access for non-full access levels", () => {
    expect(stateAttrs({ access: "readonly" })).toMatchObject({ "data-access": "readonly" });
    expect(stateAttrs({ access: "disabled" })).toMatchObject({ "data-access": "disabled" });
    expect(stateAttrs({ access: "hidden" })).toMatchObject({ "data-access": "hidden" });
  });

  test("sets data-state", () => {
    expect(stateAttrs({ state: "checked" })).toMatchObject({ "data-state": "checked" });
    expect(stateAttrs({ state: "expanded" })).toMatchObject({ "data-state": "expanded" });
  });

  test("sets data-status for non-idle", () => {
    expect(stateAttrs({ status: "idle" })).toEqual({});
    expect(stateAttrs({ status: "error" })).toMatchObject({ "data-status": "error" });
    expect(stateAttrs({ status: "loading" })).toMatchObject({ "data-status": "loading" });
  });

  test("sets boolean attributes as empty strings", () => {
    expect(stateAttrs({ disabled: true })).toMatchObject({ "data-disabled": "" });
    expect(stateAttrs({ readonly: true })).toMatchObject({ "data-readonly": "" });
    expect(stateAttrs({ loading: true })).toMatchObject({ "data-loading": "" });
    expect(stateAttrs({ error: true })).toMatchObject({ "data-error": "" });
  });

  test("omits false boolean attributes", () => {
    const result = stateAttrs({ disabled: false, loading: false });
    expect(result).not.toHaveProperty("data-disabled");
    expect(result).not.toHaveProperty("data-loading");
  });

  test("sets data-component for debugging", () => {
    expect(stateAttrs({ component: "Switch" })).toMatchObject({ "data-component": "Switch" });
  });

  test("combines multiple attributes", () => {
    const result = stateAttrs({
      access: "readonly",
      state: "checked",
      status: "warning",
      readonly: true,
      component: "Switch",
    });
    expect(result).toEqual({
      "data-access": "readonly",
      "data-state": "checked",
      "data-status": "warning",
      "data-readonly": "",
      "data-component": "Switch",
    });
  });
});

describe("stateSelector", () => {
  test("generates attribute selectors", () => {
    expect(stateSelector({ access: "disabled" })).toBe('[data-access="disabled"]');
    expect(stateSelector({ state: "checked" })).toBe('[data-state="checked"]');
    expect(stateSelector({ disabled: true })).toBe("[data-disabled]");
  });

  test("combines multiple selectors", () => {
    expect(stateSelector({ access: "readonly", state: "checked" }))
      .toBe('[data-access="readonly"][data-state="checked"]');
  });
});

/* ================================================================== */
/*  Focus Policy                                                       */
/* ================================================================== */

describe("focusRingClass", () => {
  test("returns ring classes by default", () => {
    const result = focusRingClass();
    expect(result).toContain("focus-visible:ring-2");
    expect(result).toContain("focus-visible:ring-offset-2");
  });

  test("returns outline classes", () => {
    const result = focusRingClass("outline");
    expect(result).toContain("focus-visible:ring-1");
    expect(result).toContain("focus-visible:ring-offset-1");
  });

  test("returns inset classes", () => {
    const result = focusRingClass("inset");
    expect(result).toContain("focus-visible:ring-inset");
  });

  test("returns none class", () => {
    expect(focusRingClass("none")).toBe("focus-visible:outline-hidden");
  });
});

describe("focusRingClassWithColor", () => {
  test("includes custom color", () => {
    const result = focusRingClassWithColor("ring", "var(--state-error-text)");
    expect(result).toContain("focus-visible:ring-[color-mix(in_oklab,var(--state-error-text)_30%,transparent)]");
  });

  test("none strategy ignores color", () => {
    expect(focusRingClassWithColor("none", "#ff0000")).toBe("focus-visible:outline-hidden");
  });
});

describe("defaultFocusStrategy", () => {
  test("returns ring for buttons and inputs", () => {
    expect(defaultFocusStrategy("button")).toBe("ring");
    expect(defaultFocusStrategy("input")).toBe("ring");
    expect(defaultFocusStrategy("toggle")).toBe("ring");
  });

  test("returns outline for navigation elements", () => {
    expect(defaultFocusStrategy("link")).toBe("outline");
    expect(defaultFocusStrategy("tab")).toBe("outline");
    expect(defaultFocusStrategy("menu-item")).toBe("outline");
  });
});

/* ================================================================== */
/*  Keyboard Contract                                                  */
/* ================================================================== */

describe("KEYBOARD_CONTRACTS", () => {
  test("has contracts for all expected components", () => {
    const expected = [
      "button", "switch", "checkbox", "radio", "textInput",
      "select", "tabs", "accordion", "dialog", "combobox",
      "menu", "tooltip", "slider",
    ];
    for (const key of expected) {
      expect(KEYBOARD_CONTRACTS).toHaveProperty(key);
    }
  });

  test("each contract has component name and role", () => {
    for (const contract of Object.values(KEYBOARD_CONTRACTS)) {
      expect(contract.component).toBeTruthy();
      expect(contract.role).toBeTruthy();
      expect(contract.bindings.length).toBeGreaterThan(0);
    }
  });

  test("button contract has Enter and Space for activate", () => {
    const button = KEYBOARD_CONTRACTS.button;
    const activateBinding = button.bindings.find((b) => b.action === "activate");
    expect(activateBinding).toBeDefined();
    expect(activateBinding!.key).toContain(Keys.Enter);
    expect(activateBinding!.key).toContain(Keys.Space);
  });

  test("switch contract has Space for toggle", () => {
    const sw = KEYBOARD_CONTRACTS.switch;
    const toggleBinding = sw.bindings.find((b) => b.action === "toggle");
    expect(toggleBinding).toBeDefined();
    expect(toggleBinding!.key).toBe(Keys.Space);
  });
});

describe("createKeyHandler", () => {
  test("calls handler on matching key", () => {
    const toggle = vi.fn();
    const handler = createKeyHandler("switch", { toggle });

    const event = {
      key: " ",
      preventDefault: vi.fn(),
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    } as unknown as KeyboardEvent;

    handler(event);
    expect(toggle).toHaveBeenCalledOnce();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("does not call handler on non-matching key", () => {
    const toggle = vi.fn();
    const handler = createKeyHandler("switch", { toggle });

    const event = {
      key: "Enter",
      preventDefault: vi.fn(),
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    } as unknown as KeyboardEvent;

    handler(event);
    expect(toggle).not.toHaveBeenCalled();
  });

  test("returns noop for unknown contract", () => {
    const handler = createKeyHandler("nonexistent" as keyof typeof KEYBOARD_CONTRACTS, {});
    expect(() => handler({} as KeyboardEvent)).not.toThrow();
  });
});

describe("describeKeyboardContract", () => {
  test("returns descriptions for switch", () => {
    const descriptions = describeKeyboardContract("switch");
    expect(descriptions).toContain("  → Toggle switch state");
  });

  test("returns empty for unknown contract", () => {
    expect(describeKeyboardContract("nonexistent" as keyof typeof KEYBOARD_CONTRACTS)).toEqual([]);
  });
});

/* ================================================================== */
/*  Event Guard                                                        */
/* ================================================================== */

describe("evaluateGuard", () => {
  test("allows interaction for full access", () => {
    const result = evaluateGuard({ access: "full" });
    expect(result.blocked).toBe(false);
  });

  test("blocks interaction for disabled", () => {
    const result = evaluateGuard({ disabled: true });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("disabled");
  });

  test("blocks interaction for loading", () => {
    const result = evaluateGuard({ loading: true });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("loading");
  });

  test("blocks interaction for readonly access", () => {
    const result = evaluateGuard({ access: "readonly" });
    expect(result.blocked).toBe(true);
    expect(result.readonly).toBe(true);
    expect(result.reason).toBe("readonly");
  });

  test("blocks interaction for hidden access", () => {
    const result = evaluateGuard({ access: "hidden" });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("hidden");
  });

  test("disabled takes priority over loading", () => {
    const result = evaluateGuard({ disabled: true, loading: true });
    expect(result.reason).toBe("disabled");
  });
});

describe("guardEvent", () => {
  test("calls handler when not blocked", () => {
    const handler = vi.fn();
    const guarded = guardEvent({ access: "full" }, handler);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as React.SyntheticEvent;
    guarded(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  test("blocks handler when disabled", () => {
    const handler = vi.fn();
    const guarded = guardEvent({ disabled: true }, handler);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as React.SyntheticEvent;
    guarded(event);
    expect(handler).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

describe("guardStyles", () => {
  test("returns pointer for full access", () => {
    expect(guardStyles({ access: "full" })).toContain("cursor-pointer");
  });

  test("returns not-allowed for disabled", () => {
    expect(guardStyles({ disabled: true })).toContain("cursor-not-allowed");
    expect(guardStyles({ disabled: true })).toContain("opacity-50");
  });

  test("returns default for readonly", () => {
    expect(guardStyles({ access: "readonly" })).toContain("cursor-default");
    expect(guardStyles({ access: "readonly" })).toContain("opacity-70");
  });
});

describe("guardAria", () => {
  test("returns undefined for full access", () => {
    const result = guardAria({ access: "full" });
    expect(result["aria-disabled"]).toBeUndefined();
    expect(result["aria-readonly"]).toBeUndefined();
  });

  test("returns aria-disabled for disabled", () => {
    expect(guardAria({ disabled: true })["aria-disabled"]).toBe(true);
  });

  test("returns aria-readonly for readonly", () => {
    expect(guardAria({ access: "readonly" })["aria-readonly"]).toBe(true);
  });

  test("returns aria-busy for loading", () => {
    expect(guardAria({ loading: true })["aria-busy"]).toBe(true);
  });
});

/* ================================================================== */
/*  Semantic Intent                                                    */
/* ================================================================== */

describe("resolveKeyboardIntent", () => {
  const makeEvent = (key: string, extras = {}) =>
    ({ key, altKey: false, ...extras } as unknown as KeyboardEvent);

  test("Space on switch = toggle", () => {
    const result = resolveKeyboardIntent(makeEvent(" "), "switch");
    expect(result?.intent).toBe("toggle");
    expect(result?.source).toBe("keyboard");
  });

  test("Enter on button = activate", () => {
    const result = resolveKeyboardIntent(makeEvent("Enter"), "button");
    expect(result?.intent).toBe("activate");
  });

  test("ArrowDown on select = navigate-next", () => {
    const result = resolveKeyboardIntent(makeEvent("ArrowDown"), "select");
    expect(result?.intent).toBe("navigate");
    expect(result?.direction).toBe("next");
  });

  test("Alt+ArrowDown on select = open", () => {
    const result = resolveKeyboardIntent(makeEvent("ArrowDown", { altKey: true }), "select");
    expect(result?.intent).toBe("open");
  });

  test("Escape on dialog = close", () => {
    const result = resolveKeyboardIntent(makeEvent("Escape"), "dialog");
    expect(result?.intent).toBe("close");
  });

  test("unrecognized key returns null", () => {
    expect(resolveKeyboardIntent(makeEvent("a"), "button")).toBeNull();
  });
});

describe("resolveClickIntent", () => {
  test("switch click = toggle", () => {
    expect(resolveClickIntent("switch").intent).toBe("toggle");
  });

  test("button click = activate", () => {
    expect(resolveClickIntent("button").intent).toBe("activate");
  });

  test("tabs click = select", () => {
    expect(resolveClickIntent("tabs").intent).toBe("select");
  });

  test("select click = open", () => {
    expect(resolveClickIntent("select").intent).toBe("open");
  });
});

// Import React type for guardEvent test
import type React from "react";
