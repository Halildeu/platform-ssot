/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

const chartMockState = vi.hoisted(() => ({ calls: [] as any[] }));

vi.mock("ag-charts-react", () => ({
  AgCharts: (props: any) => {
    chartMockState.calls.push(props);
    return <div data-testid="ag-charts-mock" />;
  },
}));

import { BarChart } from "../BarChart";

const sampleData = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 200 },
  { label: "Mar", value: 150 },
];

function getLastOptions() {
  const call = chartMockState.calls.at(-1);
  expect(call).toBeDefined();
  return call.options;
}

beforeEach(() => {
  chartMockState.calls.length = 0;
});

afterEach(() => {
  cleanup();
});

describe("BarChart contract", () => {
  it("displayName tasir", () => {
    expect(BarChart.displayName).toBe("BarChart");
  });

  it("root test id ile render olur", () => {
    render(<BarChart data={sampleData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("ag-charts-mock")).toBeInTheDocument();
  });

  it("title verildiginde options'a yansir", () => {
    render(<BarChart data={sampleData} title="Revenue" description="Q1" />);
    const options = getLastOptions();
    expect(options.title.text).toBe("Revenue");
    expect(options.subtitle.text).toBe("Q1");
  });

  it("showValues acikken label formatter tanimlar", () => {
    render(<BarChart data={sampleData} showValues />);
    expect(typeof getLastOptions().series[0].label.formatter).toBe("function");
  });

  it("showLegend acikken legend etkinlesir", () => {
    render(<BarChart data={sampleData} showLegend />);
    expect(getLastOptions().legend.enabled).toBe(true);
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<BarChart data={[]} />);
    expect(screen.getByTestId("bar-chart-empty")).toBeInTheDocument();
  });

  it("className birlesimini korur", () => {
    render(<BarChart data={sampleData} className="my-chart" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("my-chart");
  });

  it('access="hidden" oldugunda hicbir sey render etmez', () => {
    const { container } = render(<BarChart data={sampleData} access="hidden" />);
    expect(container.innerHTML).toBe("");
  });
});

describe("BarChart accessibility", () => {
  it("sarmalayi a11y ihlali uretmez", async () => {
    const { container } = render(<BarChart data={sampleData} title="Revenue" />);
    await expectNoA11yViolations(container);
  });
});
