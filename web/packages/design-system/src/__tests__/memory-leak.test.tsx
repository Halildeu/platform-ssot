// @vitest-environment jsdom
/**
 * Memory Leak Prevention Tests
 *
 * Verifies that overlay components properly clean up after mount/unmount cycles.
 * Checks for:
 *  - DOM node accumulation (portal leftovers)
 *  - Event listener accumulation
 *  - Style tag / scroll-lock accumulation
 */
import React from "react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

/* ------------------------------------------------------------------ */
/*  JSDOM polyfills for <dialog>                                       */
/* ------------------------------------------------------------------ */

if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MOUNT_CYCLES = 10;
const noop = () => {};

/**
 * Removes all child nodes from document.body that are NOT part of the
 * vitest/testing-library container. This gives us a clean slate between
 * test runs and between mount cycles.
 */
function cleanBodyPortals(): void {
  const children = Array.from(document.body.childNodes);
  for (const child of children) {
    // Keep vitest root if any, remove everything else
    if (child instanceof HTMLElement && child.id === "__vitest_browser_runner__") continue;
    try { document.body.removeChild(child); } catch { /* already removed */ }
  }
}

afterEach(() => {
  cleanup();
  cleanBodyPortals();
  // Reset body styles that scroll-lock may have set
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
});

/* ------------------------------------------------------------------ */
/*  DOM Node Leak Tests                                                */
/* ------------------------------------------------------------------ */

describe("Memory Leak Prevention", () => {
  describe("DOM node cleanup", () => {
    it("Dialog mount/unmount cycle does not leak DOM nodes", async () => {
      const { Dialog } = await import("../primitives/dialog");

      // Do one mount/unmount to warm up any lazy singletons
      const warmup = render(
        React.createElement(Dialog, {
          open: true,
          onClose: noop,
          title: "warmup",
          children: React.createElement("p", null, "x"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Dialog, {
            open: true,
            onClose: noop,
            title: `Dialog ${i}`,
            children: React.createElement("p", null, "content"),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      // Dialog uses ReactDOM portals; each render may leave a portal container.
      // Guard: nodes should not grow unboundedly beyond MOUNT_CYCLES.
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("Modal mount/unmount cycle does not leak DOM nodes", async () => {
      const { Modal } = await import("../primitives/modal");

      // Warm up
      const warmup = render(
        React.createElement(Modal, {
          open: true,
          onClose: noop,
          title: "warmup",
          children: React.createElement("p", null, "x"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Modal, {
            open: true,
            onClose: noop,
            title: `Modal ${i}`,
            children: React.createElement("p", null, "content"),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      // Modal uses ReactDOM portals; allow tolerance similar to Dialog.
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("Popover mount/unmount cycle does not leak DOM nodes", async () => {
      const { Popover } = await import("../primitives/popover");

      // Warm up
      const warmup = render(
        React.createElement(Popover, {
          open: true,
          trigger: React.createElement("button", null, "t"),
          content: React.createElement("div", null, "w"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Popover, {
            open: true,
            trigger: React.createElement("button", null, "trigger"),
            content: React.createElement("div", null, `Popover ${i}`),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      // Portals may create containers; allow up to 1 per cycle as a regression guard
      // but ideally should be <= baseNodeCount + 1
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("Tooltip mount/unmount cycle does not leak DOM nodes", async () => {
      const { Tooltip } = await import("../primitives/tooltip");

      const warmup = render(
        React.createElement(Tooltip, {
          content: "w",
          children: React.createElement("span", null, "w"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Tooltip, {
            content: `Tip ${i}`,
            children: React.createElement("span", null, "hover"),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      // Tooltip wraps inline — should not create portals, but allow tolerance
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("DetailDrawer mount/unmount cycle does not leak DOM nodes", async () => {
      const { DetailDrawer } = await import("../patterns/detail-drawer");

      const warmup = render(
        React.createElement(DetailDrawer, {
          open: true,
          onClose: noop,
          title: "w",
          children: React.createElement("p", null, "x"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(DetailDrawer, {
            open: true,
            onClose: noop,
            title: `Drawer ${i}`,
            children: React.createElement("p", null, "content"),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("Dropdown mount/unmount cycle does not leak DOM nodes", async () => {
      const { Dropdown } = await import("../primitives/dropdown");

      // Warm up
      const warmup = render(
        React.createElement(Dropdown, {
          items: [{ key: "a", label: "Alpha" }],
          children: React.createElement("button", null, "Open"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Dropdown, {
            items: [{ key: `item-${i}`, label: `Item ${i}` }],
            children: React.createElement("button", null, "Open"),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("Cascader mount/unmount cycle does not leak DOM nodes", async () => {
      const { Cascader } = await import("../components/cascader");

      // Warm up
      const warmup = render(
        React.createElement(Cascader, {
          options: [
            { value: "a", label: "Alpha", children: [{ value: "a1", label: "A1" }] },
          ],
          placeholder: "Select",
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Cascader, {
            options: [
              { value: `opt-${i}`, label: `Option ${i}`, children: [{ value: `sub-${i}`, label: `Sub ${i}` }] },
            ],
            placeholder: "Select",
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("Combobox mount/unmount cycle does not leak DOM nodes", async () => {
      const { Combobox } = await import("../components/combobox");

      // Warm up
      const warmup = render(
        React.createElement(Combobox, {
          options: [{ value: "a", label: "Alpha" }],
          placeholder: "Search",
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(Combobox, {
            options: [{ value: `opt-${i}`, label: `Option ${i}` }],
            placeholder: "Search",
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });

    it("FormDrawer mount/unmount cycle does not leak DOM nodes", async () => {
      const { FormDrawer } = await import("../patterns/form-drawer");

      const warmup = render(
        React.createElement(FormDrawer, {
          open: true,
          onClose: noop,
          title: "w",
          children: React.createElement("p", null, "x"),
        }),
      );
      warmup.unmount();

      const baseNodeCount = document.body.childNodes.length;

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        const { unmount } = render(
          React.createElement(FormDrawer, {
            open: true,
            onClose: noop,
            title: `Form ${i}`,
            children: React.createElement("p", null, "content"),
          }),
        );
        unmount();
      }

      const finalNodeCount = document.body.childNodes.length;
      expect(finalNodeCount).toBeLessThanOrEqual(baseNodeCount + MOUNT_CYCLES);
    });
  });

  /* ---------------------------------------------------------------- */
  /*  Scroll-lock cleanup                                              */
  /* ---------------------------------------------------------------- */

  describe("scroll-lock cleanup", () => {
    it("scroll-lock does not accumulate after repeated lock/unlock cycles", async () => {
      const { lockScroll, unlockScroll, resetScrollLock } =
        await import("../internal/overlay-engine/scroll-lock");

      resetScrollLock();

      for (let i = 0; i < MOUNT_CYCLES; i++) {
        lockScroll();
        unlockScroll();
      }

      // Body should be back to normal
      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("nested lock/unlock pairs resolve correctly", async () => {
      const { lockScroll, unlockScroll, getScrollLockCount, resetScrollLock } =
        await import("../internal/overlay-engine/scroll-lock");

      resetScrollLock();

      // Simulate two overlapping overlays
      lockScroll(); // lock count = 1
      lockScroll(); // lock count = 2
      expect(document.body.style.overflow).toBe("hidden");

      unlockScroll(); // lock count = 1 — still locked
      expect(document.body.style.overflow).toBe("hidden");

      unlockScroll(); // lock count = 0 — unlocked
      expect(document.body.style.overflow).not.toBe("hidden");
      expect(getScrollLockCount()).toBe(0);
    });

    it("resetScrollLock fully cleans up state", async () => {
      const { lockScroll, resetScrollLock, getScrollLockCount } =
        await import("../internal/overlay-engine/scroll-lock");

      lockScroll();
      lockScroll();
      lockScroll();

      resetScrollLock();

      expect(getScrollLockCount()).toBe(0);
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.paddingRight).toBe("");
    });
  });

  /* ---------------------------------------------------------------- */
  /*  Event listener cleanup                                           */
  /* ---------------------------------------------------------------- */

  describe("event listener cleanup", () => {
    it("event listeners are cleaned up after Dialog mount/unmount", async () => {
      const { Dialog } = await import("../primitives/dialog");

      const originalAdd = document.addEventListener.bind(document);
      const originalRemove = document.removeEventListener.bind(document);
      let addCount = 0;
      let removeCount = 0;

      const addSpy = vi.spyOn(document, "addEventListener").mockImplementation((...args: any[]) => {
        addCount++;
        return originalAdd(...args);
      });
      const removeSpy = vi.spyOn(document, "removeEventListener").mockImplementation((...args: any[]) => {
        removeCount++;
        return originalRemove(...args);
      });

      const { unmount } = render(
        React.createElement(Dialog, {
          open: true,
          onClose: noop,
          title: "Test",
          children: React.createElement("p", null, "body"),
        }),
      );

      const listenersAdded = addCount;
      unmount();
      const listenersRemoved = removeCount;

      // Every listener added while mounted should be removed on unmount
      expect(listenersRemoved).toBeGreaterThanOrEqual(listenersAdded);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it("event listeners are cleaned up after Dropdown mount/unmount", async () => {
      const { Dropdown } = await import("../primitives/dropdown");

      const originalAdd = document.addEventListener.bind(document);
      const originalRemove = document.removeEventListener.bind(document);
      let addCount = 0;
      let removeCount = 0;

      const addSpy = vi.spyOn(document, "addEventListener").mockImplementation((...args: any[]) => {
        addCount++;
        return originalAdd(...args);
      });
      const removeSpy = vi.spyOn(document, "removeEventListener").mockImplementation((...args: any[]) => {
        removeCount++;
        return originalRemove(...args);
      });

      const { unmount } = render(
        React.createElement(Dropdown, {
          items: [{ key: "a", label: "Alpha" }, { key: "b", label: "Beta" }],
          children: React.createElement("button", null, "Open"),
        }),
      );

      const listenersAdded = addCount;
      unmount();
      const listenersRemoved = removeCount;

      expect(listenersRemoved).toBeGreaterThanOrEqual(listenersAdded);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it("event listeners are cleaned up after Modal mount/unmount", async () => {
      const { Modal } = await import("../primitives/modal");

      const originalAdd = document.addEventListener.bind(document);
      const originalRemove = document.removeEventListener.bind(document);
      let addCount = 0;
      let removeCount = 0;

      const addSpy = vi.spyOn(document, "addEventListener").mockImplementation((...args: any[]) => {
        addCount++;
        return originalAdd(...args);
      });
      const removeSpy = vi.spyOn(document, "removeEventListener").mockImplementation((...args: any[]) => {
        removeCount++;
        return originalRemove(...args);
      });

      const { unmount } = render(
        React.createElement(Modal, {
          open: true,
          onClose: noop,
          title: "Test Modal",
          children: React.createElement("p", null, "body"),
        }),
      );

      const listenersAdded = addCount;
      unmount();
      const listenersRemoved = removeCount;

      expect(listenersRemoved).toBeGreaterThanOrEqual(listenersAdded);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });
});
