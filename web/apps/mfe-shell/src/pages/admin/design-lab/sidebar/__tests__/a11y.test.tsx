// @vitest-environment jsdom

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

/* ------------------------------------------------------------------ */
/*  Accessibility Tests — Sidebar v3                                   */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: false,
      media: q,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => cleanup());

/* ================================================================== */
/*  SidebarBreadcrumb — a11y                                           */
/* ================================================================== */

describe("SidebarBreadcrumb — accessibility", () => {
  it("has nav landmark with aria-label", async () => {
    const { SidebarBreadcrumb } = await import("../sections/SidebarBreadcrumb");
    const { MemoryRouter } = await import("react-router-dom");
    render(
      <MemoryRouter initialEntries={["/admin/design-lab/components/nav/Tabs"]}>
        <SidebarBreadcrumb />
      </MemoryRouter>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
  });

  it("parent segments are clickable buttons", async () => {
    const { SidebarBreadcrumb } = await import("../sections/SidebarBreadcrumb");
    const { MemoryRouter } = await import("react-router-dom");
    render(
      <MemoryRouter initialEntries={["/admin/design-lab/components/nav/Tabs"]}>
        <SidebarBreadcrumb />
      </MemoryRouter>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1); // parent segments
  });
});

/* ================================================================== */
/*  SidebarFilterBar — a11y                                            */
/* ================================================================== */

describe("SidebarFilterBar — accessibility", () => {
  it("has toolbar role with label", async () => {
    const { SidebarFilterBar } = await import("../sections/SidebarFilterBar");
    render(<SidebarFilterBar activeFilters={new Set(["all"])} onChange={vi.fn()} />);
    expect(screen.getByRole("toolbar", { name: "Filter components" })).toBeInTheDocument();
  });

  it("filter buttons have aria-pressed", async () => {
    const { SidebarFilterBar } = await import("../sections/SidebarFilterBar");
    render(<SidebarFilterBar activeFilters={new Set(["stable"])} onChange={vi.fn()} />);

    const stableBtn = screen.getByText("Stable").closest("button");
    expect(stableBtn).toHaveAttribute("aria-pressed", "true");

    const allBtn = screen.getByText("All").closest("button");
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
  });
});

/* ================================================================== */
/*  SidebarSearchEnhanced — a11y                                       */
/* ================================================================== */

describe("SidebarSearchEnhanced — accessibility", () => {
  it("input has aria-label", async () => {
    const { SidebarSearchEnhanced } = await import("../sections/SidebarSearchEnhanced");
    render(<SidebarSearchEnhanced value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Search components")).toBeInTheDocument();
  });

  it("clear button has aria-label", async () => {
    const { SidebarSearchEnhanced } = await import("../sections/SidebarSearchEnhanced");
    render(<SidebarSearchEnhanced value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  SidebarContextMenu — a11y                                          */
/* ================================================================== */

describe("ContextMenuProvider — accessibility", () => {
  it("menu has role=menu", async () => {
    const { ContextMenuProvider, useContextMenu } = await import("../sections/SidebarContextMenu");

    function TestComponent() {
      const { show } = useContextMenu();
      return (
        <button
          onContextMenu={(e) =>
            show(e, [{ label: "Copy", onClick: vi.fn() }])
          }
        >
          Right-click me
        </button>
      );
    }

    render(
      <ContextMenuProvider>
        <TestComponent />
      </ContextMenuProvider>,
    );

    fireEvent.contextMenu(screen.getByText("Right-click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const { ContextMenuProvider, useContextMenu } = await import("../sections/SidebarContextMenu");

    function TestComponent() {
      const { show } = useContextMenu();
      return (
        <button
          onContextMenu={(e) =>
            show(e, [{ label: "Copy", onClick: vi.fn() }])
          }
        >
          Target
        </button>
      );
    }

    render(
      <ContextMenuProvider>
        <TestComponent />
      </ContextMenuProvider>,
    );

    fireEvent.contextMenu(screen.getByText("Target"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

/* ================================================================== */
/*  SidebarQuickActions — a11y                                         */
/* ================================================================== */

describe("SidebarQuickActions — accessibility", () => {
  it("pin button has descriptive aria-label", async () => {
    const { SidebarQuickActions } = await import("../sections/SidebarQuickActions");
    render(
      <SidebarQuickActions
        name="Button"
        isPinned={false}
        onCopyImport={vi.fn()}
        onTogglePin={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Pin Button")).toBeInTheDocument();
  });

  it("unpin label when pinned", async () => {
    const { SidebarQuickActions } = await import("../sections/SidebarQuickActions");
    render(
      <SidebarQuickActions
        name="Modal"
        isPinned={true}
        onCopyImport={vi.fn()}
        onTogglePin={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Unpin Modal")).toBeInTheDocument();
  });

  it("copy import button has aria-label", async () => {
    const { SidebarQuickActions } = await import("../sections/SidebarQuickActions");
    render(
      <SidebarQuickActions
        name="Tabs"
        isPinned={false}
        onCopyImport={vi.fn()}
        onTogglePin={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Copy import for Tabs")).toBeInTheDocument();
  });
});
