// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SparklineChart } from "../SparklineChart";

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

describe("SparklineChart", () => {
  const sampleData = [10, 20, 15, 25, 30];

  it("renders SVG with correct dimensions", () => {
    const { container } = render(
      <SparklineChart data={sampleData} width={200} height={40} />,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute("width")).toBe("200");
    expect(svg!.getAttribute("height")).toBe("40");
    expect(svg!.getAttribute("viewBox")).toBe("0 0 200 40");
  });

  it("renders polyline for line type (default)", () => {
    const { container } = render(
      <SparklineChart data={sampleData} type="line" />,
    );

    const polyline = container.querySelector("polyline");
    expect(polyline).toBeTruthy();
    expect(polyline!.getAttribute("fill")).toBe("none");
    expect(polyline!.getAttribute("stroke")).toBeTruthy();
  });

  it("renders bars (rect elements) for bar type", () => {
    const { container } = render(
      <SparklineChart data={sampleData} type="bar" />,
    );

    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(sampleData.length);
  });

  it("renders area path and polyline for area type", () => {
    const { container } = render(
      <SparklineChart data={sampleData} type="area" />,
    );

    const path = container.querySelector("path");
    const polyline = container.querySelector("polyline");
    expect(path).toBeTruthy();
    expect(polyline).toBeTruthy();
    // area path should close with Z
    expect(path!.getAttribute("d")).toContain("Z");
  });

  it("shows last point marker when showLastPoint=true", () => {
    const { container } = render(
      <SparklineChart data={sampleData} showLastPoint />,
    );

    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(1);
    expect(circles[0].getAttribute("r")).toBe("2.5");
  });

  it("does not show last point marker when showLastPoint=false (default)", () => {
    const { container } = render(
      <SparklineChart data={sampleData} />,
    );

    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(0);
  });

  it("shows min/max markers when showMinMax=true", () => {
    const { container } = render(
      <SparklineChart data={sampleData} showMinMax />,
    );

    // min + max = 2 circles
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(2);
    // min marker has r=2
    expect(circles[0].getAttribute("r")).toBe("2");
    expect(circles[1].getAttribute("r")).toBe("2");
  });

  it("shows min/max and lastPoint markers together", () => {
    const { container } = render(
      <SparklineChart data={sampleData} showMinMax showLastPoint />,
    );

    // lastPoint (r=2.5) + min (r=2) + max (r=2) = 3 circles
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(3);
  });

  it("applies custom color", () => {
    const { container } = render(
      <SparklineChart data={sampleData} type="line" color="var(--state-danger-text)" />,
    );

    const polyline = container.querySelector("polyline");
    expect(polyline!.getAttribute("stroke")).toBe("var(--state-danger-text)");
  });

  it("handles empty data array", () => {
    render(<SparklineChart data={[]} />);

    const emptyEl = screen.getByTestId("sparkline-chart-empty");
    expect(emptyEl).toBeInTheDocument();
    expect(emptyEl.querySelector("svg")).toBeNull();
  });

  it("renders aria-label with data summary", () => {
    const { container } = render(
      <SparklineChart data={[5, 10, 15]} />,
    );

    const svg = container.querySelector("svg");
    expect(svg!.getAttribute("aria-label")).toBe(
      "Sparkline chart: 3 data points, last value 15",
    );
  });
});
