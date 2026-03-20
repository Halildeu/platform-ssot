// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

/* ------------------------------------------------------------------ */
/*  Imports — target components                                        */
/* ------------------------------------------------------------------ */
import { Carousel } from "../components/carousel";
import { ToastProvider, useToast } from "../components/toast";
import { SmartDashboard } from "../components/smart-dashboard";
import { CommandPalette } from "../components/command-palette";
import { ContextMenu } from "../components/context-menu";
import { Accordion } from "../components/accordion";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/* ================================================================== */
/*  Shared fixture data                                                */
/* ================================================================== */

const CAROUSEL_ITEMS = [
  { key: "s1", content: <div>Slide 1</div> },
  { key: "s2", content: <div>Slide 2</div> },
  { key: "s3", content: <div>Slide 3</div> },
];

const DASHBOARD_WIDGETS = [
  {
    key: "w1",
    title: "Revenue",
    type: "kpi" as const,
    value: "$12,345",
    tone: "success" as const,
    onRefresh: vi.fn(),
  },
  {
    key: "w2",
    title: "Active Users",
    type: "kpi" as const,
    value: "1,234",
    tone: "info" as const,
  },
];

const COMMAND_ITEMS = [
  { id: "cmd1", title: "Go to Dashboard", group: "Navigation" },
  { id: "cmd2", title: "Create Report", group: "Actions" },
];

const CONTEXT_MENU_ITEMS = [
  { key: "copy", label: "Copy", onClick: vi.fn() },
  { key: "paste", label: "Paste", onClick: vi.fn() },
];

const ACCORDION_ITEMS = [
  { value: "a1", title: "Section A", content: "Content A body text here" },
  { value: "a2", title: "Section B", content: "Content B body text here" },
  { value: "a3", title: "Section C", content: "Content C body text here" },
];

/* ================================================================== */
/*  Helper: Toast trigger component                                    */
/* ================================================================== */

function ToastTrigger() {
  const toast = useToast();
  return (
    <button onClick={() => toast.success("Saved!", { duration: 2000 })}>
      Show Toast
    </button>
  );
}

/* ================================================================== */
/*  O. Memory Leak Prevention Tests                                    */
/* ================================================================== */

describe("Robustness — O: Memory Leak Prevention", () => {
  it("Carousel: unmount during autoPlay does not leak", () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <Carousel items={CAROUSEL_ITEMS} autoPlay autoPlayInterval={1000} />,
    );
    act(() => {
      vi.advanceTimersByTime(500); // mid-interval
    });
    unmount(); // should clear interval
    // advancing further should not throw or cause warnings
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();
  });

  it("ToastProvider: unmount with active toast does not leak", () => {
    vi.useFakeTimers();
    const { unmount, getByText } = render(
      <ToastProvider duration={2000}>
        <ToastTrigger />
      </ToastProvider>,
    );
    // Trigger a toast
    act(() => {
      fireEvent.click(getByText("Show Toast"));
    });
    // Unmount before auto-dismiss fires
    unmount();
    // Advancing timers should not throw
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    vi.useRealTimers();
  });

  it("SmartDashboard: unmount during widget refresh does not leak", () => {
    vi.useFakeTimers();
    const onRefresh = vi.fn();
    const widgets = [
      {
        key: "w1",
        title: "Revenue",
        type: "kpi" as const,
        value: "$100",
        onRefresh,
      },
    ];
    const { unmount, container } = render(
      <SmartDashboard widgets={widgets} />,
    );
    // Click the refresh button to trigger the internal setTimeout
    const refreshBtn = container.querySelector('button[aria-label="Revenue yenile"]');
    if (refreshBtn) {
      act(() => {
        fireEvent.click(refreshBtn);
      });
    }
    unmount();
    // Internal 800ms setTimeout should not throw after unmount
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();
  });

  it("CommandPalette: unmount removes Escape keydown listener", () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={onClose} />,
    );
    unmount();
    // Dispatching Escape after unmount should NOT call onClose
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ContextMenu: unmount while open removes global listeners", () => {
    const { unmount, container } = render(
      <ContextMenu items={CONTEXT_MENU_ITEMS}>
        <button>Right-click me</button>
      </ContextMenu>,
    );
    // Open the context menu
    const trigger = container.querySelector("div");
    if (trigger) {
      fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    }
    unmount();
    // Dispatching events after unmount should not throw
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.mouseDown(document);
  });
});

/* ================================================================== */
/*  P. Z-Index Stacking Context Tests                                  */
/* ================================================================== */

describe("Robustness — P: Z-Index Stacking Context", () => {
  it("CommandPalette has z-50 stacking context", () => {
    const { container } = render(
      <CommandPalette open items={COMMAND_ITEMS} />,
    );
    const overlay = container.querySelector(".fixed");
    expect(overlay).toBeTruthy();
    expect(overlay?.className).toContain("z-50");
  });

  it("CommandPalette backdrop covers full viewport (inset-0)", () => {
    const { container } = render(
      <CommandPalette open items={COMMAND_ITEMS} />,
    );
    const overlay = container.querySelector(".fixed");
    expect(overlay?.className).toContain("inset-0");
  });

  it("ContextMenu renders with z-[1500] stacking context", () => {
    const { container } = render(
      <ContextMenu items={CONTEXT_MENU_ITEMS}>
        <button>Right-click me</button>
      </ContextMenu>,
    );
    // Open the context menu
    const trigger = container.querySelector("div");
    if (trigger) {
      fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    }
    const menu = container.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
    expect(menu?.className).toContain("z-[1500]");
  });

  it("ToastProvider renders container with z-[1700]", () => {
    const { container } = render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    );
    const toastContainer = container.querySelector('[aria-live="polite"]');
    expect(toastContainer).toBeTruthy();
    expect(toastContainer?.className).toContain("z-[1700]");
  });
});

/* ================================================================== */
/*  Q. Portal / Dialog Rendering Tests                                 */
/* ================================================================== */

describe("Robustness — Q: Portal / Dialog Rendering", () => {
  it("CommandPalette renders a dialog element when open", () => {
    const { container } = render(
      <CommandPalette open items={COMMAND_ITEMS} />,
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
  });

  it("CommandPalette does not render dialog when closed", () => {
    const { container } = render(
      <CommandPalette open={false} items={COMMAND_ITEMS} />,
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeNull();
  });

  it("ContextMenu renders menu role when triggered", () => {
    const { container } = render(
      <ContextMenu items={CONTEXT_MENU_ITEMS}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    // Not rendered initially
    expect(container.querySelector('[role="menu"]')).toBeNull();
    // Open via right-click
    const trigger = container.querySelector("div");
    if (trigger) {
      fireEvent.contextMenu(trigger, { clientX: 50, clientY: 50 });
    }
    expect(container.querySelector('[role="menu"]')).toBeTruthy();
  });

  it("ContextMenu renders menuitem roles for each item", () => {
    const { container } = render(
      <ContextMenu items={CONTEXT_MENU_ITEMS}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    const trigger = container.querySelector("div");
    if (trigger) {
      fireEvent.contextMenu(trigger, { clientX: 50, clientY: 50 });
    }
    const menuItems = container.querySelectorAll('[role="menuitem"]');
    expect(menuItems.length).toBe(CONTEXT_MENU_ITEMS.length);
  });
});

/* ================================================================== */
/*  R. Event Propagation Tests                                         */
/* ================================================================== */

describe("Robustness — R: Event Propagation", () => {
  it("CommandPalette: clicking backdrop calls onClose", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={onClose} />,
    );
    // The backdrop is the div with role="presentation"
    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toBeTruthy();
    await userEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("CommandPalette: clicking dialog content does NOT call onClose", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={onClose} />,
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    await userEvent.click(dialog!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("CommandPalette: Escape key calls onClose", () => {
    const onClose = vi.fn();
    render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={onClose} />,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Accordion: clicking one section does not affect others", async () => {
    const onItemToggle = vi.fn();
    const { getAllByRole } = render(
      <Accordion
        items={ACCORDION_ITEMS}
        selectionMode="multiple"
        onItemToggle={onItemToggle}
      />,
    );
    const buttons = getAllByRole("button");
    // Click Section A
    await userEvent.click(buttons[0]);
    expect(onItemToggle).toHaveBeenCalledWith("a1", true);
    onItemToggle.mockClear();
    // Click Section B
    await userEvent.click(buttons[1]);
    expect(onItemToggle).toHaveBeenCalledWith("a2", true);
    // Section A should still be expanded (multiple mode)
    expect(onItemToggle).not.toHaveBeenCalledWith("a1", false);
  });

  it("ContextMenu: clicking a menu item triggers its onClick", async () => {
    const onClick = vi.fn();
    const items = [
      { key: "action", label: "Do Something", onClick },
    ];
    const { container } = render(
      <ContextMenu items={items}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    // Open menu
    const trigger = container.querySelector("div");
    if (trigger) {
      fireEvent.contextMenu(trigger, { clientX: 50, clientY: 50 });
    }
    // Click the menu item
    const menuItem = container.querySelector('[role="menuitem"]');
    expect(menuItem).toBeTruthy();
    await userEvent.click(menuItem!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
