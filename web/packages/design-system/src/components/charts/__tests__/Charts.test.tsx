// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

/* Mock x-charts chart components via their relative paths */
const mockState = vi.hoisted(() => ({ renders: [] as any[] }));

vi.mock("../../../../../x-charts/src/BarChart", () => ({
  BarChart: React.forwardRef((props: any, ref: any) => {
    mockState.renders.push({ type: "BarChart", props });
    if (!props.data || props.data.length === 0) return <div data-testid="bar-chart-empty">Veri yok</div>;
    return <div ref={ref} data-testid="bar-chart" />;
  }),
}));

vi.mock("../../../../../x-charts/src/LineChart", () => ({
  LineChart: React.forwardRef((props: any, ref: any) => {
    mockState.renders.push({ type: "LineChart", props });
    if (!props.series?.length || !props.labels?.length) return <div data-testid="line-chart-empty">Veri yok</div>;
    return <div ref={ref} data-testid="line-chart" />;
  }),
}));

vi.mock("../../../../../x-charts/src/PieChart", () => ({
  PieChart: React.forwardRef((props: any, ref: any) => {
    mockState.renders.push({ type: "PieChart", props });
    const valid = (props.data ?? []).filter((d: any) => d.value > 0);
    if (valid.length === 0) return <div data-testid="pie-chart-empty">Veri yok</div>;
    return <div ref={ref} data-testid="pie-chart" />;
  }),
}));

vi.mock("../../../../../x-charts/src/AreaChart", () => ({
  AreaChart: React.forwardRef((props: any, ref: any) => {
    mockState.renders.push({ type: "AreaChart", props });
    if (!props.series?.length || !props.labels?.length) return <div data-testid="area-chart-empty">Veri yok</div>;
    return <div ref={ref} data-testid="area-chart" />;
  }),
}));

import { BarChart } from "../BarChart";
import { LineChart } from "../LineChart";
import { PieChart } from "../PieChart";
import { AreaChart } from "../AreaChart";

const barData = [{ label: "Ocak", value: 40 }, { label: "Subat", value: 65 }];
const pieData = [{ label: "A", value: 30 }, { label: "B", value: 50 }];
const lineSeries = [{ name: "Satis", data: [10, 40, 30] }];
const lineLabels = ["Q1", "Q2", "Q3"];

beforeEach(() => { mockState.renders.length = 0; });
afterEach(() => { cleanup(); });

describe("BarChart", () => {
  it("render eder", () => { render(<BarChart data={barData} />); expect(screen.getByTestId("bar-chart")).toBeInTheDocument(); });
  it("bos veri empty state", () => { render(<BarChart data={[]} />); expect(screen.getByTestId("bar-chart-empty")).toBeInTheDocument(); });
  it("props iletir", () => { render(<BarChart data={barData} title="Gelir" showLegend />); expect(mockState.renders.at(-1).props.title).toBe("Gelir"); });
});

describe("LineChart", () => {
  it("render eder", () => { render(<LineChart series={lineSeries} labels={lineLabels} />); expect(screen.getByTestId("line-chart")).toBeInTheDocument(); });
  it("bos veri empty state", () => { render(<LineChart series={[]} labels={[]} />); expect(screen.getByTestId("line-chart-empty")).toBeInTheDocument(); });
});

describe("PieChart", () => {
  it("render eder", () => { render(<PieChart data={pieData} />); expect(screen.getByTestId("pie-chart")).toBeInTheDocument(); });
  it("sifir degerlerde empty state", () => { render(<PieChart data={[{ label: "A", value: 0 }]} />); expect(screen.getByTestId("pie-chart-empty")).toBeInTheDocument(); });
});

describe("AreaChart", () => {
  it("render eder", () => { render(<AreaChart series={lineSeries} labels={lineLabels} />); expect(screen.getByTestId("area-chart")).toBeInTheDocument(); });
  it("bos veri empty state", () => { render(<AreaChart series={[]} labels={[]} />); expect(screen.getByTestId("area-chart-empty")).toBeInTheDocument(); });
});

describe("Charts - accessibility", () => {
  it("BarChart a11y ihlali uretmez", async () => { const { container } = render(<BarChart data={barData} />); await expectNoA11yViolations(container); });
});
