import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChartDashboard } from "../ChartDashboard";

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

vi.mock("@mfe/design-system", () => ({
  cn: (...args: unknown[]) =>
    args
      .flat(Infinity)
      .filter((v) => typeof v === "string")
      .join(" "),
}));

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("ChartDashboard", () => {
  it("renders children in grid", () => {
    render(
      <ChartDashboard>
        <ChartDashboard.Item>
          <div>Card A</div>
        </ChartDashboard.Item>
        <ChartDashboard.Item>
          <div>Card B</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    expect(screen.getByText("Card A")).toBeInTheDocument();
    expect(screen.getByText("Card B")).toBeInTheDocument();
  });

  it("applies correct column count", () => {
    const { container } = render(
      <ChartDashboard columns={4}>
        <ChartDashboard.Item>
          <div>A</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const grid = screen.getByTestId("chart-dashboard");
    // columns=4 maps to "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    expect(grid.className).toContain("lg:grid-cols-4");
  });

  it("uses default 3 columns", () => {
    render(
      <ChartDashboard>
        <ChartDashboard.Item>
          <div>A</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const grid = screen.getByTestId("chart-dashboard");
    expect(grid.className).toContain("lg:grid-cols-3");
  });

  it("ChartDashboard.Item applies span", () => {
    render(
      <ChartDashboard>
        <ChartDashboard.Item span={2}>
          <div>Wide card</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const items = screen.getAllByTestId("chart-dashboard-item");
    // span=2 maps to "col-span-1 sm:col-span-2"
    expect(items[0].className).toContain("sm:col-span-2");
  });

  it("ChartDashboard.Item applies rowSpan", () => {
    render(
      <ChartDashboard>
        <ChartDashboard.Item rowSpan={2}>
          <div>Tall card</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const items = screen.getAllByTestId("chart-dashboard-item");
    expect(items[0].className).toContain("row-span-2");
  });

  it("applies gap size", () => {
    render(
      <ChartDashboard gap="lg">
        <ChartDashboard.Item>
          <div>A</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const grid = screen.getByTestId("chart-dashboard");
    expect(grid.className).toContain("gap-6");
  });

  it("uses default md gap", () => {
    render(
      <ChartDashboard>
        <ChartDashboard.Item>
          <div>A</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const grid = screen.getByTestId("chart-dashboard");
    expect(grid.className).toContain("gap-4");
  });

  it("applies className", () => {
    render(
      <ChartDashboard className="dashboard-custom">
        <ChartDashboard.Item>
          <div>A</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const grid = screen.getByTestId("chart-dashboard");
    expect(grid.className).toContain("dashboard-custom");
  });

  it("renders grid class on the container", () => {
    render(
      <ChartDashboard>
        <ChartDashboard.Item>
          <div>A</div>
        </ChartDashboard.Item>
      </ChartDashboard>,
    );

    const grid = screen.getByTestId("chart-dashboard");
    expect(grid.className).toContain("grid");
  });
});
