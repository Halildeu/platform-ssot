// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { DesignLabShell, useDesignLabShell } from "../DesignLabShell";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

/* ------------------------------------------------------------------ */
/*  Helper: renders shell with sidebar + main + inspector component    */
/* ------------------------------------------------------------------ */

function ShellInspector() {
  const { sidebarCollapsed, toggleSidebarCollapse } = useDesignLabShell();
  return (
    <div>
      <span data-testid="collapsed-state">{String(sidebarCollapsed)}</span>
      <button data-testid="toggle" onClick={toggleSidebarCollapse}>toggle</button>
    </div>
  );
}

function renderShell() {
  return render(
    <DesignLabShell>
      <DesignLabShell.Sidebar>
        <ShellInspector />
      </DesignLabShell.Sidebar>
      <DesignLabShell.Main>
        <div data-testid="main-content">Main</div>
      </DesignLabShell.Main>
    </DesignLabShell>,
  );
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("DesignLabShell — sidebar collapse", () => {
  it("starts expanded by default (no localStorage)", () => {
    renderShell();
    expect(screen.getByTestId("collapsed-state").textContent).toBe("false");
  });

  it("reads initial state from localStorage", () => {
    localStorage.setItem("design-lab-sidebar-collapsed", "true");
    renderShell();
    expect(screen.getByTestId("collapsed-state").textContent).toBe("true");
  });

  it("toggles collapsed state on click", () => {
    renderShell();
    expect(screen.getByTestId("collapsed-state").textContent).toBe("false");
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("collapsed-state").textContent).toBe("true");
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("collapsed-state").textContent).toBe("false");
  });

  it("persists collapsed state to localStorage", () => {
    renderShell();
    fireEvent.click(screen.getByTestId("toggle"));
    expect(localStorage.getItem("design-lab-sidebar-collapsed")).toBe("true");
    fireEvent.click(screen.getByTestId("toggle"));
    expect(localStorage.getItem("design-lab-sidebar-collapsed")).toBe("false");
  });

  it("sidebar container has data-collapsed attribute", () => {
    renderShell();
    const container = screen.getByTestId("design-lab-sidebar-container");
    expect(container.getAttribute("data-collapsed")).toBe("false");
    fireEvent.click(screen.getByTestId("toggle"));
    expect(container.getAttribute("data-collapsed")).toBe("true");
  });

  it("sidebar container has overflow-hidden when collapsed", () => {
    renderShell();
    fireEvent.click(screen.getByTestId("toggle"));
    const container = screen.getByTestId("design-lab-sidebar-container");
    expect(container.className).toContain("overflow-hidden");
  });

  it("sidebar container has max-w when collapsed to prevent overflow", () => {
    renderShell();
    fireEvent.click(screen.getByTestId("toggle"));
    const container = screen.getByTestId("design-lab-sidebar-container");
    expect(container.className).toContain("max-w-[52px]");
  });

  it("sidebar container does NOT have overflow-hidden when expanded", () => {
    renderShell();
    const container = screen.getByTestId("design-lab-sidebar-container");
    // sm:overflow-hidden should NOT be present in expanded mode
    expect(container.className).not.toContain("sm:overflow-hidden");
  });

  it("main area has overflow-x-hidden to prevent horizontal scroll", () => {
    renderShell();
    const main = screen.getByTestId("main-content").closest("main");
    expect(main?.className).toContain("overflow-x-hidden");
  });

  it("main area has min-w-0 for flex shrink", () => {
    renderShell();
    const main = screen.getByTestId("main-content").closest("main");
    expect(main?.className).toContain("min-w-0");
  });

  it("root container has overflow-x-hidden", () => {
    const { container } = renderShell();
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("overflow-x-hidden");
  });
});

describe("DesignLabShell — layout widths", () => {
  it("collapsed sidebar classes include sm:w-[52px]", () => {
    localStorage.setItem("design-lab-sidebar-collapsed", "true");
    renderShell();
    const container = screen.getByTestId("design-lab-sidebar-container");
    expect(container.className).toContain("sm:w-[52px]");
  });

  it("expanded sidebar classes include sm:w-[240px]", () => {
    renderShell();
    const container = screen.getByTestId("design-lab-sidebar-container");
    expect(container.className).toContain("sm:w-[240px]");
  });

  it("collapsed sidebar has shrink-0 to prevent flex shrinking", () => {
    localStorage.setItem("design-lab-sidebar-collapsed", "true");
    renderShell();
    const container = screen.getByTestId("design-lab-sidebar-container");
    expect(container.className).toContain("shrink-0");
  });
});
