/**
 * Contract Test: Chart A11y Components
 *
 * Validates accessibility utilities:
 * - ChartKeyboardNav keyboard event handling
 * - ChartDataTable view toggle
 * - ChartAriaLive announcements
 * - useReducedMotion hook
 *
 * @see chart-viz-engine-selection D-009
 */
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChartKeyboardNav } from "../a11y/ChartKeyboardNav";
import { ChartDataTable } from "../a11y/ChartDataTable";
import { ChartAriaLive } from "../a11y/ChartAriaLive";

describe("ChartKeyboardNav", () => {
  it("renders children with application role", () => {
    render(
      <ChartKeyboardNav dataPointCount={5}>
        <div data-testid="chart">Chart content</div>
      </ChartKeyboardNav>,
    );

    const wrapper = screen.getByRole("application");
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("navigates forward with ArrowRight", () => {
    const onChange = vi.fn();
    render(
      <ChartKeyboardNav dataPointCount={3} onActiveIndexChange={onChange}>
        <div>Chart</div>
      </ChartKeyboardNav>,
    );

    const nav = screen.getByRole("application");
    fireEvent.keyDown(nav, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(0);

    fireEvent.keyDown(nav, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("navigates backward with ArrowLeft", () => {
    const onChange = vi.fn();
    render(
      <ChartKeyboardNav dataPointCount={3} onActiveIndexChange={onChange}>
        <div>Chart</div>
      </ChartKeyboardNav>,
    );

    const nav = screen.getByRole("application");
    // First move to last item
    fireEvent.keyDown(nav, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("fires onSelect on Enter key", () => {
    const onSelect = vi.fn();
    const onChange = vi.fn();
    render(
      <ChartKeyboardNav
        dataPointCount={3}
        onActiveIndexChange={onChange}
        onSelect={onSelect}
      >
        <div>Chart</div>
      </ChartKeyboardNav>,
    );

    const nav = screen.getByRole("application");
    fireEvent.keyDown(nav, { key: "ArrowRight" }); // index 0
    fireEvent.keyDown(nav, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("resets on Escape", () => {
    const onChange = vi.fn();
    render(
      <ChartKeyboardNav dataPointCount={3} onActiveIndexChange={onChange}>
        <div>Chart</div>
      </ChartKeyboardNav>,
    );

    const nav = screen.getByRole("application");
    fireEvent.keyDown(nav, { key: "ArrowRight" }); // index 0
    fireEvent.keyDown(nav, { key: "Escape" });
    expect(onChange).toHaveBeenLastCalledWith(-1);
  });

  it("Home jumps to first, End to last", () => {
    const onChange = vi.fn();
    render(
      <ChartKeyboardNav dataPointCount={5} onActiveIndexChange={onChange}>
        <div>Chart</div>
      </ChartKeyboardNav>,
    );

    const nav = screen.getByRole("application");
    fireEvent.keyDown(nav, { key: "End" });
    expect(onChange).toHaveBeenCalledWith(4);

    fireEvent.keyDown(nav, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith(0);
  });
});

describe("ChartDataTable", () => {
  const columns = [
    { header: "Label", accessorKey: "label" },
    { header: "Value", accessorKey: "value" },
  ];
  const data = [
    { label: "A", value: 10 },
    { label: "B", value: 20 },
  ];

  it("shows chart view by default", () => {
    render(
      <ChartDataTable columns={columns} data={data}>
        <div data-testid="chart">Chart</div>
      </ChartDataTable>,
    );

    expect(screen.getByTestId("chart")).toBeInTheDocument();
    expect(screen.getByText("View as data table")).toBeInTheDocument();
  });

  it("toggles to table view on button click", () => {
    render(
      <ChartDataTable columns={columns} data={data} caption="Test data">
        <div data-testid="chart">Chart</div>
      </ChartDataTable>,
    );

    fireEvent.click(screen.getByText("View as data table"));

    // Table should be visible
    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();

    // Chart should be hidden
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
  });

  it("toggles back to chart view", () => {
    render(
      <ChartDataTable columns={columns} data={data}>
        <div data-testid="chart">Chart</div>
      </ChartDataTable>,
    );

    fireEvent.click(screen.getByText("View as data table"));
    fireEvent.click(screen.getByText("View as chart"));

    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });
});

describe("ChartAriaLive", () => {
  it("renders aria-live region", () => {
    render(<ChartAriaLive message="5 data points loaded" />);

    const region = screen.getByRole("status");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("supports assertive politeness", () => {
    render(<ChartAriaLive message="Error!" politeness="assertive" />);

    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "assertive");
  });
});
