/**
 * Contract Test: DrillDownBreadcrumb
 *
 * Tests rendering, navigation, and accessibility.
 */
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DrillDownBreadcrumb } from "../DrillDownBreadcrumb";
import type { BreadcrumbItem } from "../useDrillDown";

const ROOT_ONLY: BreadcrumbItem[] = [
  { label: "All", index: -1, isCurrent: true },
];

const THREE_LEVELS: BreadcrumbItem[] = [
  { label: "All", index: -1, isCurrent: false },
  { label: "Europe", index: 0, isCurrent: false },
  { label: "Berlin", index: 1, isCurrent: true },
];

describe("DrillDownBreadcrumb", () => {
  it("renders nothing at root (single item)", () => {
    const { container } = render(
      <DrillDownBreadcrumb items={ROOT_ONLY} onNavigate={vi.fn()} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders breadcrumb trail at drill depth", () => {
    render(
      <DrillDownBreadcrumb items={THREE_LEVELS} onNavigate={vi.fn()} />,
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
  });

  it("current item has aria-current=page", () => {
    render(
      <DrillDownBreadcrumb items={THREE_LEVELS} onNavigate={vi.fn()} />,
    );

    const current = screen.getByText("Berlin");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("non-current items are clickable buttons", () => {
    const onNavigate = vi.fn();
    render(
      <DrillDownBreadcrumb items={THREE_LEVELS} onNavigate={onNavigate} />,
    );

    fireEvent.click(screen.getByText("All"));
    expect(onNavigate).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByText("Europe"));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it("current item is NOT a button", () => {
    render(
      <DrillDownBreadcrumb items={THREE_LEVELS} onNavigate={vi.fn()} />,
    );

    const berlin = screen.getByText("Berlin");
    expect(berlin.tagName).not.toBe("BUTTON");
  });

  it("has nav landmark with correct label", () => {
    render(
      <DrillDownBreadcrumb items={THREE_LEVELS} onNavigate={vi.fn()} />,
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Drill-down breadcrumb");
  });

  it("renders separators between items", () => {
    const { container } = render(
      <DrillDownBreadcrumb items={THREE_LEVELS} onNavigate={vi.fn()} />,
    );

    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBe(2); // 3 items = 2 separators
  });
});
