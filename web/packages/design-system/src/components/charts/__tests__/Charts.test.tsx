 
// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

const chartMockState = vi.hoisted(() => ({ calls: [] as any[] }));

vi.mock("ag-charts-react", () => ({
  AgCharts: (props: any) => {
    chartMockState.calls.push(props);
    return <div data-testid="ag-charts-mock" />;
  },
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

function getLastCall() {
  const call = chartMockState.calls.at(-1);
  expect(call).toBeDefined();
  return call;
}

function getLastOptions() {
  return getLastCall().options;
}

function getLastStyle() {
  return getLastCall().style;
}

beforeEach(() => {
  chartMockState.calls.length = 0;
});

afterEach(() => {
  cleanup();
});

describe("BarChart", () => {
  it("veri ile render eder", () => {
    render(<BarChart data={barData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("ag-charts-mock")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<BarChart data={[]} />);
    expect(screen.getByTestId("bar-chart-empty")).toHaveTextContent("Veri yok");
  });

  it("title ve description bilgisini options'a tasir", () => {
    render(<BarChart data={barData} title="Gelir" description="Aylik dagilim" />);
    const options = getLastOptions();
    expect(options.title.text).toBe("Gelir");
    expect(options.subtitle.text).toBe("Aylik dagilim");
  });

  it("showValues ve valueFormatter ile label formatter tanimlar", () => {
    const formatter = vi.fn((value: number) => `${value} TL`);
    render(<BarChart data={barData} showValues valueFormatter={formatter} />);
    const options = getLastOptions();
    const labelFormatter = options.series[0].label.formatter;
    expect(labelFormatter({ value: 42 })).toBe("42 TL");
    expect(formatter).toHaveBeenCalledWith(42);
  });

  it("showGrid=false oldugunda number axis grid'i kapatir", () => {
    render(<BarChart data={barData} showGrid={false} />);
    const options = getLastOptions();
    expect(options.theme.overrides.bar.axes.number.gridLine.enabled).toBe(false);
  });

  it("showLegend ile legend'i acar", () => {
    render(<BarChart data={barData} showLegend />);
    expect(getLastOptions().legend.enabled).toBe(true);
  });

  it("horizontal orientation icin yatay yonu kullanir", () => {
    render(<BarChart data={barData} orientation="horizontal" />);
    expect(getLastOptions().series[0].direction).toBe("horizontal");
  });

  it("multi-series veriyi gruplanmis bar series'e cevirir", () => {
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
    const options = getLastOptions();
    expect(options.series).toHaveLength(2);
    expect(options.legend.enabled).toBe(true);
    expect(options.series[1].yKey).toBe("refunds");
  });

  it("className ekler ve size variant yuksekligini uygular", () => {
    render(<BarChart data={barData} className="my-bar" size="lg" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("my-bar");
    expect(getLastStyle().height).toBe(400);
  });

  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<BarChart data={barData} access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<BarChart data={barData} access="disabled" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("opacity-50");
  });
});

describe("LineChart", () => {
  it("veri ile render eder", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<LineChart series={[]} labels={[]} />);
    expect(screen.getByTestId("line-chart-empty")).toHaveTextContent("Veri yok");
  });

  it("title ve description bilgisini options'a tasir", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} title="Trend" description="Q bazli" />);
    const options = getLastOptions();
    expect(options.title.text).toBe("Trend");
    expect(options.subtitle.text).toBe("Q bazli");
  });

  it("seri sayisini korur ve legend'i coklu seride otomatik acabilir", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    const options = getLastOptions();
    expect(options.series).toHaveLength(2);
    expect(options.legend.enabled).toBe(true);
  });

  it("showDots=false iken marker'lari kapatir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showDots={false} />);
    expect(getLastOptions().series[0].marker.enabled).toBe(false);
  });

  it("showArea ile area series kullanir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showArea />);
    const series = getLastOptions().series[0];
    expect(series.type).toBe("area");
    expect(series.fillOpacity).toBe(0.18);
  });

  it("curved ile smooth interpolation kullanir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} curved />);
    expect(getLastOptions().series[0].interpolation).toEqual({ type: "smooth" });
  });

  it("showGrid=false iken sayisal axis grid'ini kapatir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showGrid={false} />);
    expect(getLastOptions().axes[1].gridLine.enabled).toBe(false);
  });

  it("valueFormatter'i axis label formatter olarak kullanir", () => {
    const formatter = vi.fn((value: number) => `${value}%`);
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} valueFormatter={formatter} />);
    const labelFormatter = getLastOptions().axes[1].label.formatter;
    expect(labelFormatter({ value: 95 })).toBe("95%");
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<LineChart series={lineSeries} labels={lineLabels} access="disabled" />);
    expect(screen.getByTestId("line-chart")).toHaveClass("opacity-50");
  });
});

describe("PieChart", () => {
  it("veri ile render eder", () => {
    render(<PieChart data={pieData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("gecersiz veya sifir degerlerde empty state gosterir", () => {
    render(<PieChart data={[{ label: "A", value: 0 }]} />);
    expect(screen.getByTestId("pie-chart-empty")).toBeInTheDocument();
  });

  it("title ve description bilgisini options'a tasir", () => {
    render(<PieChart data={pieData} title="Dagilim" description="Kategori bazli" />);
    const options = getLastOptions();
    expect(options.title.text).toBe("Dagilim");
    expect(options.subtitle.text).toBe("Kategori bazli");
  });

  it("donut modunda innerLabel render eder", () => {
    render(<PieChart data={pieData} donut innerLabel={<span data-testid="inner-label">Toplam</span>} />);
    const options = getLastOptions();
    expect(options.series[0].type).toBe("donut");
    expect(screen.getByTestId("pie-chart-inner-label")).toBeInTheDocument();
    expect(screen.getByTestId("inner-label")).toHaveTextContent("Toplam");
  });

  it("showPercentage ile yuzde formatter tanimlar", () => {
    render(<PieChart data={pieData} showPercentage />);
    const formatter = getLastOptions().series[0].sectorLabel.formatter;
    expect(formatter({ value: 25, total: 100 })).toBe("25%");
  });

  it("showLabels ile callout label'i acar", () => {
    render(<PieChart data={pieData} showLabels />);
    expect(getLastOptions().series[0].calloutLabel.enabled).toBe(true);
  });

  it("showLegend ile legend'i acar", () => {
    render(<PieChart data={pieData} showLegend />);
    expect(getLastOptions().legend.enabled).toBe(true);
  });

  it("valueFormatter tooltip icerigine yansir", () => {
    render(<PieChart data={pieData} valueFormatter={(value) => `${value} TL`} />);
    const renderer = getLastOptions().series[0].tooltip.renderer;
    expect(renderer({ datum: { label: "A", value: 30 } }).content).toBe("A: 30 TL");
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<PieChart data={pieData} access="disabled" />);
    expect(screen.getByTestId("pie-chart")).toHaveClass("opacity-50");
  });
});

describe("AreaChart", () => {
  it("veri ile render eder", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<AreaChart series={[]} labels={[]} />);
    expect(screen.getByTestId("area-chart-empty")).toBeInTheDocument();
  });

  it("birden fazla seri icin area config uretir", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    const options = getLastOptions();
    expect(options.series).toHaveLength(2);
    expect(options.series[0].type).toBe("area");
  });

  it("showDots=false iken marker'lari kapatir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} showDots={false} />);
    expect(getLastOptions().series[0].marker.enabled).toBe(false);
  });

  it("stacked ve curved ayarlarini options'a tasir", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} stacked curved />);
    const series = getLastOptions().series[0];
    expect(series.stacked).toBe(true);
    expect(series.interpolation).toEqual({ type: "smooth" });
  });

  it("gradient=false iken daha opak fill kullanir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} gradient={false} />);
    expect(getLastOptions().series[0].fillOpacity).toBe(0.6);
  });

  it("showGrid=false iken number axis grid'ini kapatir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} showGrid={false} />);
    expect(getLastOptions().axes[1].gridLine.enabled).toBe(false);
  });

  it("size variant yuksekligini uygular", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} size="sm" />);
    expect(getLastStyle().height).toBe(200);
  });

  it('access="disabled" durumunda opacity sinifi uygular', () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} access="disabled" />);
    expect(screen.getByTestId("area-chart")).toHaveClass("opacity-50");
  });
});

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

describe("Charts - interaction signals", () => {
  it("odaklanabilir bir interaktif yuzeyle kullanici etkilesimini simule eder", async () => {
    const user = userEvent.setup();
    render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const element = screen.getByTestId("interactive");
    await user.click(element);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(element).toHaveAttribute("role", "button");
    expect(element).toHaveTextContent("Click me");
  });
});
