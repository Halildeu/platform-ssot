// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

/* ------------------------------------------------------------------ */
/*  Mock: useEChartsRenderer                                           */
/* ------------------------------------------------------------------ */

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
import { LineChart } from "../LineChart";
import { PieChart } from "../PieChart";
import { AreaChart } from "../AreaChart";

const barData = [
  { label: "Ocak", value: 40 },
  { label: "Subat", value: 65 },
  { label: "Mart", value: 30 },
];

const pieData = [
  { label: "A", value: 30 },
  { label: "B", value: 50 },
  { label: "C", value: 20 },
];

const lineSeries = [
  { name: "Satis", data: [10, 40, 30, 60] },
  { name: "Iade", data: [5, 20, 15, 10] },
];

const lineLabels = ["Q1", "Q2", "Q3", "Q4"];

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

/* ================================================================== */
/*  BarChart                                                           */
/* ================================================================== */

describe("BarChart", () => {
  it("veri ile render eder", () => {
    render(<BarChart data={barData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<BarChart data={[]} />);
    expect(screen.getByTestId("bar-chart-empty")).toHaveTextContent("Veri yok");
  });

  it("title ve description bilgisini ECharts option'a tasir", () => {
    render(<BarChart data={barData} title="Gelir" description="Aylik dagilim" />);
    const option = getLastOption();
    expect(option.title.text).toBe("Gelir");
    expect(option.title.subtext).toBe("Aylik dagilim");
  });

  it("showLegend ile legend'i acar", () => {
    render(<BarChart data={barData} showLegend />);
    expect(getLastOption().legend.show).toBe(true);
  });

  it("horizontal orientation icin yatay axis kullanir", () => {
    render(<BarChart data={barData} orientation="horizontal" />);
    const opt = getLastOption();
    expect(opt.xAxis.type).toBe("value");
    expect(opt.yAxis.type).toBe("category");
  });

  it("multi-series veriyi gruplar", () => {
    render(
      <BarChart
        data={[
          { label: "Ocak", sales: 10, refunds: 2 } as any,
          { label: "Subat", sales: 20, refunds: 5 } as any,
        ]}
        series={[
          { field: "sales", name: "Satis" },
          { field: "refunds", name: "Iade" },
        ]}
      />,
    );
    const option = getLastOption();
    expect(option.series).toHaveLength(2);
    expect(option.series[0].name).toBe("Satis");
    expect(option.series[1].name).toBe("Iade");
  });

  it("className ekler", () => {
    render(<BarChart data={barData} className="my-bar" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("my-bar");
  });

  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<BarChart data={barData} access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<BarChart data={barData} access="disabled" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("opacity-50");
  });

  it("showGrid=false oldugunda splitLine kapatir", () => {
    render(<BarChart data={barData} showGrid={false} />);
    const opt = getLastOption();
    expect(opt.yAxis.splitLine.show).toBe(false);
  });

  it("animation flag'ini tasir", () => {
    render(<BarChart data={barData} animate={false} />);
    expect(getLastOption().animation).toBe(false);
  });
});

/* ================================================================== */
/*  LineChart                                                          */
/* ================================================================== */

describe("LineChart", () => {
  it("veri ile render eder", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<LineChart series={[]} labels={[]} />);
    expect(screen.getByTestId("line-chart-empty")).toHaveTextContent("Veri yok");
  });

  it("title ve description bilgisini option'a tasir", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} title="Trend" description="Q bazli" />);
    const opt = getLastOption();
    expect(opt.title.text).toBe("Trend");
    expect(opt.title.subtext).toBe("Q bazli");
  });

  it("seri sayisini korur", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    expect(getLastOption().series).toHaveLength(2);
  });

  it("showDots=false iken showSymbol kapatir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showDots={false} />);
    expect(getLastOption().series[0].showSymbol).toBe(false);
  });

  it("showArea ile areaStyle ekler", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showArea />);
    expect(getLastOption().series[0].areaStyle).toBeDefined();
  });

  it("curved ile smooth kullanir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} curved />);
    expect(getLastOption().series[0].smooth).toBe(true);
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<LineChart series={lineSeries} labels={lineLabels} access="disabled" />);
    expect(screen.getByTestId("line-chart")).toHaveClass("opacity-50");
  });
});

/* ================================================================== */
/*  PieChart                                                           */
/* ================================================================== */

describe("PieChart", () => {
  it("veri ile render eder", () => {
    render(<PieChart data={pieData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("gecersiz veya sifir degerlerde empty state gosterir", () => {
    render(<PieChart data={[{ label: "A", value: 0 }]} />);
    expect(screen.getByTestId("pie-chart-empty")).toBeInTheDocument();
  });

  it("title ve description bilgisini option'a tasir", () => {
    render(<PieChart data={pieData} title="Dagilim" description="Kategori bazli" />);
    const opt = getLastOption();
    expect(opt.title.text).toBe("Dagilim");
    expect(opt.title.subtext).toBe("Kategori bazli");
  });

  it("donut modunda radius array kullanir ve innerLabel render eder", () => {
    render(<PieChart data={pieData} donut innerLabel={<span data-testid="inner-label">Toplam</span>} />);
    const opt = getLastOption();
    expect(opt.series[0].radius).toEqual(["40%", "70%"]);
    expect(screen.getByTestId("pie-chart-inner-label")).toBeInTheDocument();
    expect(screen.getByTestId("inner-label")).toHaveTextContent("Toplam");
  });

  it("showPercentage ile label formatter tanimlar", () => {
    render(<PieChart data={pieData} showPercentage />);
    expect(getLastOption().series[0].label.formatter).toBe("{d}%");
  });

  it("showLegend ile legend'i acar", () => {
    render(<PieChart data={pieData} showLegend />);
    expect(getLastOption().legend.show).toBe(true);
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<PieChart data={pieData} access="disabled" />);
    expect(screen.getByTestId("pie-chart")).toHaveClass("opacity-50");
  });
});

/* ================================================================== */
/*  AreaChart                                                          */
/* ================================================================== */

describe("AreaChart", () => {
  it("veri ile render eder", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<AreaChart series={[]} labels={[]} />);
    expect(screen.getByTestId("area-chart-empty")).toBeInTheDocument();
  });

  it("seri sayisini korur ve areaStyle ekler", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    const opt = getLastOption();
    expect(opt.series).toHaveLength(2);
    expect(opt.series[0].areaStyle).toBeDefined();
  });

  it("showDots=false iken showSymbol kapatir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} showDots={false} />);
    expect(getLastOption().series[0].showSymbol).toBe(false);
  });

  it("stacked ile stack kullanir, curved ile smooth", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} stacked curved />);
    const s = getLastOption().series[0];
    expect(s.stack).toBe("total");
    expect(s.smooth).toBe(true);
  });

  it("gradient=false iken daha opak fill kullanir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} gradient={false} />);
    expect(getLastOption().series[0].areaStyle.opacity).toBe(0.6);
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} access="disabled" />);
    expect(screen.getByTestId("area-chart")).toHaveClass("opacity-50");
  });
});

/* ================================================================== */
/*  Accessibility                                                      */
/* ================================================================== */

describe("Charts - accessibility", () => {
  it("BarChart sarmalayi uygunluk ihlali uretmez", async () => {
    const { container } = render(<BarChart data={[{ label: "A", value: 10 }]} />);
    await expectNoA11yViolations(container);
  });

  it("PieChart innerLabel ile de uygunluk ihlali uretmez", async () => {
    const { container } = render(<PieChart data={pieData} donut innerLabel={<span>Toplam</span>} />);
    await expectNoA11yViolations(container);
  });
});
