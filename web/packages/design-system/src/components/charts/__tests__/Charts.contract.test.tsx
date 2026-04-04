// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

const mockState = vi.hoisted(() => ({ options: [] as any[] }));

vi.mock("../useInlineECharts", () => ({
  useInlineECharts: (opts: any) => {
    mockState.options.push(opts.option);
    const ref = { current: null };
    return { containerRef: ref, isReady: false, resize: vi.fn() };
  },
  buildLightTheme: () => ({}),
}));

import { BarChart } from "../BarChart";

const sampleData = [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 200 },
  { label: "Mar", value: 150 },
];

function getLastOption() {
  const opt = mockState.options.at(-1);
  expect(opt).toBeDefined();
  return opt;
}

beforeEach(() => {
  mockState.options.length = 0;
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
  });

  it("title verildiginde option'a yansir", () => {
    render(<BarChart data={sampleData} title="Revenue" description="Q1" />);
    const opt = getLastOption();
    expect(opt.title.text).toBe("Revenue");
    expect(opt.title.subtext).toBe("Q1");
  });

  it("showValues acikken label tanimlar", () => {
    render(<BarChart data={sampleData} showValues />);
    expect(getLastOption().series[0].label.show).toBe(true);
  });

  it("showLegend acikken legend etkinlesir", () => {
    render(<BarChart data={sampleData} showLegend />);
    expect(getLastOption().legend.show).toBe(true);
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
