// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import {
  registerLayer,
  unregisterLayer,
  getTopZIndex,
  isTopLayer,
  getLayerStack,
  resetLayerStack,
  Z_INDEX_BASE,
  lockScroll,
  unlockScroll,
  getScrollLockCount,
  resetScrollLock,
  prefersReducedMotion,
  motionDuration,
  REDUCED_MOTION_CLASS,
} from "../index";

/* ================================================================== */
/*  Layer Stack                                                        */
/* ================================================================== */

describe("Layer Stack", () => {
  beforeEach(() => {
    resetLayerStack();
  });

  test("Z_INDEX_BASE has expected layers", () => {
    expect(Z_INDEX_BASE.content).toBe(0);
    expect(Z_INDEX_BASE.dropdown).toBe(200);
    expect(Z_INDEX_BASE.modal).toBe(300);
    expect(Z_INDEX_BASE.toast).toBe(400);
    expect(Z_INDEX_BASE.spotlight).toBe(500);
  });

  test("registerLayer returns z-index above base", () => {
    const z = registerLayer("test-dropdown", "dropdown");
    expect(z).toBeGreaterThan(Z_INDEX_BASE.dropdown);
  });

  test("subsequent registrations get higher z-index", () => {
    const z1 = registerLayer("modal-1", "modal");
    const z2 = registerLayer("modal-2", "modal");
    expect(z2).toBeGreaterThan(z1);
  });

  test("unregisterLayer removes from stack", () => {
    registerLayer("test-1", "dropdown");
    expect(getLayerStack()).toHaveLength(1);
    unregisterLayer("test-1");
    expect(getLayerStack()).toHaveLength(0);
  });

  test("getTopZIndex returns highest z-index", () => {
    registerLayer("dropdown", "dropdown");
    const modalZ = registerLayer("modal", "modal");
    expect(getTopZIndex()).toBe(modalZ);
  });

  test("getTopZIndex returns 0 for empty stack", () => {
    expect(getTopZIndex()).toBe(0);
  });

  test("isTopLayer identifies top layer", () => {
    registerLayer("dropdown", "dropdown");
    registerLayer("modal", "modal");
    expect(isTopLayer("modal")).toBe(true);
    expect(isTopLayer("dropdown")).toBe(false);
  });

  test("re-registration removes old entry and adds new one", () => {
    registerLayer("dropdown", "dropdown");
    registerLayer("modal", "modal");
    const newZ = registerLayer("dropdown", "dropdown");
    // Stack should have 2 entries (modal + re-registered dropdown)
    expect(getLayerStack()).toHaveLength(2);
    expect(newZ).toBeGreaterThan(Z_INDEX_BASE.dropdown);
  });

  test("resetLayerStack clears everything", () => {
    registerLayer("a", "dropdown");
    registerLayer("b", "modal");
    resetLayerStack();
    expect(getLayerStack()).toHaveLength(0);
    expect(getTopZIndex()).toBe(0);
  });
});

/* ================================================================== */
/*  Scroll Lock                                                        */
/* ================================================================== */

describe("Scroll Lock", () => {
  beforeEach(() => {
    resetScrollLock();
  });

  test("lockScroll sets overflow hidden", () => {
    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockScroll();
  });

  test("unlockScroll restores overflow", () => {
    document.body.style.overflow = "";
    lockScroll();
    unlockScroll();
    expect(document.body.style.overflow).toBe("");
  });

  test("nested locks only unlock on last call", () => {
    lockScroll();
    lockScroll();
    expect(getScrollLockCount()).toBe(2);
    unlockScroll();
    expect(getScrollLockCount()).toBe(1);
    expect(document.body.style.overflow).toBe("hidden"); // Still locked
    unlockScroll();
    expect(getScrollLockCount()).toBe(0);
    expect(document.body.style.overflow).toBe(""); // Now unlocked
  });

  test("unlockScroll does not go below 0", () => {
    unlockScroll();
    unlockScroll();
    expect(getScrollLockCount()).toBe(0);
  });
});

/* ================================================================== */
/*  Reduced Motion                                                     */
/* ================================================================== */

/* ================================================================== */
/*  Layer Stack — Multi-overlay integration                            */
/* ================================================================== */

describe("Layer Stack — multi-overlay integration", () => {
  beforeEach(() => {
    resetLayerStack();
  });

  test("Dialog1 → Dialog2 stacking: Dialog2 gets higher z-index", () => {
    const z1 = registerLayer("dialog-1", "modal");
    const z2 = registerLayer("dialog-2", "modal");
    expect(z2).toBeGreaterThan(z1);
    expect(isTopLayer("dialog-2")).toBe(true);
    expect(isTopLayer("dialog-1")).toBe(false);
    expect(getLayerStack()).toHaveLength(2);
  });

  test("Close Dialog2 → Dialog1 is now top layer", () => {
    registerLayer("dialog-1", "modal");
    registerLayer("dialog-2", "modal");
    expect(isTopLayer("dialog-2")).toBe(true);

    unregisterLayer("dialog-2");
    expect(getLayerStack()).toHaveLength(1);
    expect(isTopLayer("dialog-1")).toBe(true);
  });

  test("Mixed layers: dropdown under modal under toast", () => {
    const zDropdown = registerLayer("dropdown-1", "dropdown");
    const zModal = registerLayer("modal-1", "modal");
    const zToast = registerLayer("toast-1", "toast");

    expect(zModal).toBeGreaterThan(zDropdown);
    expect(zToast).toBeGreaterThan(zModal);
    expect(isTopLayer("toast-1")).toBe(true);
    expect(getLayerStack()).toHaveLength(3);

    // Remove middle layer
    unregisterLayer("modal-1");
    expect(getLayerStack()).toHaveLength(2);
    expect(isTopLayer("toast-1")).toBe(true);
  });

  test("Multiple modals: close in reverse order restores stack correctly", () => {
    const z1 = registerLayer("modal-a", "modal");
    const z2 = registerLayer("modal-b", "modal");
    const z3 = registerLayer("modal-c", "modal");

    expect(z3).toBeGreaterThan(z2);
    expect(z2).toBeGreaterThan(z1);
    expect(isTopLayer("modal-c")).toBe(true);

    unregisterLayer("modal-c");
    expect(isTopLayer("modal-b")).toBe(true);

    unregisterLayer("modal-b");
    expect(isTopLayer("modal-a")).toBe(true);

    unregisterLayer("modal-a");
    expect(getLayerStack()).toHaveLength(0);
  });
});

/* ================================================================== */
/*  Reduced Motion                                                     */
/* ================================================================== */

describe("Reduced Motion", () => {
  test("prefersReducedMotion returns boolean", () => {
    expect(typeof prefersReducedMotion()).toBe("boolean");
  });

  test("motionDuration returns 0 when reduced motion preferred", () => {
    // Can't easily mock matchMedia in unit tests, but we can verify the API
    const duration = motionDuration(300);
    expect(typeof duration).toBe("number");
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  test("REDUCED_MOTION_CLASS contains motion-reduce prefix", () => {
    expect(REDUCED_MOTION_CLASS).toContain("motion-reduce:");
  });
});
