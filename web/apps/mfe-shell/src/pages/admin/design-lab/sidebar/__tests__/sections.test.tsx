// @vitest-environment jsdom

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Section Component Tests — Sidebar v3                               */
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

const wrap = (ui: React.ReactElement, path = "/admin/design-lab/components/navigation/Tabs") =>
  render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);

/* ================================================================== */
/*  1. SidebarBreadcrumb                                               */
/* ================================================================== */

describe("SidebarBreadcrumb", () => {
  it("renders breadcrumb segments from URL", async () => {
    const { SidebarBreadcrumb } = await import("../sections/SidebarBreadcrumb");
    wrap(<SidebarBreadcrumb />);
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Tabs")).toBeInTheDocument();
  });

  it("decodes URL-encoded names", async () => {
    const { SidebarBreadcrumb } = await import("../sections/SidebarBreadcrumb");
    wrap(<SidebarBreadcrumb />, "/admin/design-lab/components/navigation/App%20Header");
    expect(screen.getByText("App Header")).toBeInTheDocument();
  });

  it("renders nothing on landing page", async () => {
    const { SidebarBreadcrumb } = await import("../sections/SidebarBreadcrumb");
    const { container } = wrap(<SidebarBreadcrumb />, "/admin/design-lab");
    expect(container.querySelector("nav")).toBeNull();
  });

  it("has aria-label Breadcrumb", async () => {
    const { SidebarBreadcrumb } = await import("../sections/SidebarBreadcrumb");
    wrap(<SidebarBreadcrumb />);
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  2. SidebarFilterBar                                                */
/* ================================================================== */

describe("SidebarFilterBar", () => {
  it("renders all filter chips", async () => {
    const { SidebarFilterBar } = await import("../sections/SidebarFilterBar");
    const onChange = vi.fn();
    wrap(<SidebarFilterBar activeFilters={new Set(["all"])} onChange={onChange} />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Stable")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("calls onChange when chip clicked", async () => {
    const { SidebarFilterBar } = await import("../sections/SidebarFilterBar");
    const onChange = vi.fn();
    wrap(<SidebarFilterBar activeFilters={new Set(["all"])} onChange={onChange} />);

    fireEvent.click(screen.getByText("Stable"));
    expect(onChange).toHaveBeenCalled();
  });

  it("All chip resets filters", async () => {
    const { SidebarFilterBar } = await import("../sections/SidebarFilterBar");
    const onChange = vi.fn();
    wrap(<SidebarFilterBar activeFilters={new Set(["stable"])} onChange={onChange} />);

    fireEvent.click(screen.getByText("All"));
    expect(onChange).toHaveBeenCalledWith(new Set(["all"]));
  });

  it("has toolbar role", async () => {
    const { SidebarFilterBar } = await import("../sections/SidebarFilterBar");
    wrap(<SidebarFilterBar activeFilters={new Set(["all"])} onChange={vi.fn()} />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  3. useFilterState                                                  */
/* ================================================================== */

describe("useFilterState", () => {
  it("defaults to 'all'", async () => {
    const { useFilterState } = await import("../sections/SidebarFilterBar");
    const { renderHook } = await import("@testing-library/react");
    const { result } = renderHook(() => useFilterState());
    expect(result.current.filters.has("all")).toBe(true);
  });

  it("matches all items when 'all' active", async () => {
    const { useFilterState } = await import("../sections/SidebarFilterBar");
    const { renderHook } = await import("@testing-library/react");
    const { result } = renderHook(() => useFilterState());
    expect(result.current.matches({ lifecycle: "stable" })).toBe(true);
    expect(result.current.matches({ lifecycle: "beta" })).toBe(true);
  });
});

/* ================================================================== */
/*  4. SidebarSearchEnhanced                                           */
/* ================================================================== */

describe("SidebarSearchEnhanced", () => {
  it("renders search input", async () => {
    const { SidebarSearchEnhanced } = await import("../sections/SidebarSearchEnhanced");
    wrap(<SidebarSearchEnhanced value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Search components")).toBeInTheDocument();
  });

  it("shows scope label when not searching", async () => {
    const { SidebarSearchEnhanced } = await import("../sections/SidebarSearchEnhanced");
    wrap(<SidebarSearchEnhanced value="" onChange={vi.fn()} scopeLabel="Components" />);
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("shows clear button when searching", async () => {
    const { SidebarSearchEnhanced } = await import("../sections/SidebarSearchEnhanced");
    wrap(<SidebarSearchEnhanced value="button" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("calls onChange on input", async () => {
    const { SidebarSearchEnhanced } = await import("../sections/SidebarSearchEnhanced");
    const onChange = vi.fn();
    wrap(<SidebarSearchEnhanced value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Search components"), { target: { value: "btn" } });
    expect(onChange).toHaveBeenCalledWith("btn");
  });
});

/* ================================================================== */
/*  5. HighlightedLabel                                                */
/* ================================================================== */

describe("HighlightedLabel", () => {
  it("renders plain text with no ranges", async () => {
    const { HighlightedLabel } = await import("../sections/SidebarSearchEnhanced");
    const { container } = render(<HighlightedLabel text="Button" ranges={[]} />);
    expect(container.textContent).toBe("Button");
  });

  it("wraps matched ranges in <mark>", async () => {
    const { HighlightedLabel } = await import("../sections/SidebarSearchEnhanced");
    const { container } = render(<HighlightedLabel text="Button" ranges={[[0, 3]]} />);
    const marks = container.querySelectorAll("mark");
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe("But");
  });
});

/* ================================================================== */
/*  6. SidebarGroupProgress                                            */
/* ================================================================== */

describe("SidebarGroupProgress", () => {
  it("renders progress bar", async () => {
    const { SidebarGroupProgress } = await import("../sections/SidebarGroupProgress");
    const { container } = render(<SidebarGroupProgress current={8} total={10} />);
    expect(container.textContent).toContain("8/10");
  });

  it("returns null for zero total", async () => {
    const { SidebarGroupProgress } = await import("../sections/SidebarGroupProgress");
    const { container } = render(<SidebarGroupProgress current={0} total={0} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows green for high completion", async () => {
    const { SidebarGroupProgress } = await import("../sections/SidebarGroupProgress");
    const { container } = render(<SidebarGroupProgress current={9} total={10} />);
    expect(container.querySelector("[class*='success']")).toBeTruthy();
  });
});

/* ================================================================== */
/*  7. SidebarHealthBanner                                             */
/* ================================================================== */

describe("SidebarHealthBanner", () => {
  it("renders skeleton while loading", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => new Promise(() => {}))); // never resolves
    // Clear cache
    localStorage.removeItem("design-lab-health");

    const { SidebarHealthBanner } = await import("../sections/SidebarHealthBanner");
    const { container } = wrap(<SidebarHealthBanner />);
    expect(container.querySelector("[class*='animate-pulse']")).toBeTruthy();
  });
});

/* ================================================================== */
/*  8. SidebarContextMenu                                              */
/* ================================================================== */

describe("ContextMenuProvider + buildComponentMenuItems", () => {
  it("builds correct menu items", async () => {
    const { buildComponentMenuItems } = await import("../sections/SidebarContextMenu");
    const items = buildComponentMenuItems({
      name: "Button",
      importPath: "@mfe/design-system",
      isPinned: false,
      onTogglePin: vi.fn(),
      onNavigate: vi.fn(),
    });
    expect(items.length).toBeGreaterThan(2);
    expect(items.some((i) => i.label === "Copy import")).toBe(true);
    expect(items.some((i) => i.label === "Copy component name")).toBe(true);
    expect(items.some((i) => i.label === "Add to favorites")).toBe(true);
  });

  it("shows 'Remove from favorites' when pinned", async () => {
    const { buildComponentMenuItems } = await import("../sections/SidebarContextMenu");
    const items = buildComponentMenuItems({
      name: "Modal",
      isPinned: true,
      onTogglePin: vi.fn(),
      onNavigate: vi.fn(),
    });
    expect(items.some((i) => i.label === "Remove from favorites")).toBe(true);
  });
});
