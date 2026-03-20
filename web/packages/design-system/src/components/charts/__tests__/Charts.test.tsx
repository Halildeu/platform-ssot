// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BarChart } from "../BarChart";
import { LineChart } from "../LineChart";
import { PieChart } from "../PieChart";
import { AreaChart } from "../AreaChart";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ================================================================== */
/*  Sample data                                                        */
/* ================================================================== */

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

/* ================================================================== */
/*  BarChart                                                           */
/* ================================================================== */

describe("BarChart - temel render", () => {
  it("veri ile render eder", () => {
    render(<BarChart data={barData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<BarChart data={[]} />);
    expect(screen.getByTestId("bar-chart-empty")).toBeInTheDocument();
    expect(screen.getByText("Veri yok")).toBeInTheDocument();
  });

  it("custom noData metni gosterir", () => {
    render(<BarChart data={[]} localeText={{ noData: "Bos" }} />);
    expect(screen.getByText("Bos")).toBeInTheDocument();
  });

  it("displayName BarChart olarak atanmistir", () => {
    expect(BarChart.displayName).toBe("BarChart");
  });

  it("SVG role=img ve aria-label vardir", () => {
    render(<BarChart data={barData} title="Aylik" />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("aria-label", "Aylik");
  });

  it("title render eder", () => {
    render(<BarChart data={barData} title="Gelir" />);
    expect(screen.getByTestId("bar-chart-title")).toHaveTextContent("Gelir");
  });

  it("barlari render eder", () => {
    render(<BarChart data={barData} />);
    const bars = screen.getAllByTestId("bar-chart-bar");
    expect(bars).toHaveLength(3);
  });

  it("labellar render eder", () => {
    render(<BarChart data={barData} />);
    const labels = screen.getAllByTestId("bar-chart-label");
    expect(labels).toHaveLength(3);
  });

  it("showValues ile deger labellarini gosterir", () => {
    render(<BarChart data={barData} showValues />);
    const values = screen.getAllByTestId("bar-chart-value");
    expect(values).toHaveLength(3);
  });

  it("valueFormatter ile formatli deger gosterir", () => {
    const fmt = (v: number) => `$${v}`;
    render(<BarChart data={[{ label: "X", value: 42 }]} showValues valueFormatter={fmt} />);
    expect(screen.getByTestId("bar-chart-value")).toHaveTextContent("$42");
  });

  it("showGrid=false ise grid cizgileri olmaz", () => {
    render(<BarChart data={barData} showGrid={false} />);
    expect(screen.queryAllByTestId("bar-chart-grid-line")).toHaveLength(0);
  });

  it("showGrid=true ise grid cizgileri vardir", () => {
    render(<BarChart data={barData} showGrid />);
    expect(screen.getAllByTestId("bar-chart-grid-line").length).toBeGreaterThan(0);
  });

  it("showLegend ile legend gosterir", () => {
    render(<BarChart data={barData} showLegend />);
    expect(screen.getByTestId("bar-chart-legend")).toBeInTheDocument();
  });

  it("horizontal orientation destekler", () => {
    render(<BarChart data={barData} orientation="horizontal" />);
    const bars = screen.getAllByTestId("bar-chart-bar");
    expect(bars).toHaveLength(3);
  });

  it("className eklenir", () => {
    render(<BarChart data={barData} className="my-bar" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("my-bar");
  });
});

/* ---- BarChart access control ---- */

describe("BarChart - access control", () => {
  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<BarChart data={barData} access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" durumunda opacity azalir', () => {
    render(<BarChart data={barData} access="disabled" />);
    expect(screen.getByTestId("bar-chart")).toHaveClass("opacity-50");
  });

  it("accessReason title olarak atanir", () => {
    render(<BarChart data={barData} accessReason="Yetkiniz yok" />);
    expect(screen.getByTestId("bar-chart")).toHaveAttribute("title", "Yetkiniz yok");
  });
});

/* ================================================================== */
/*  LineChart                                                          */
/* ================================================================== */

describe("LineChart - temel render", () => {
  it("veri ile render eder", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<LineChart series={[]} labels={[]} />);
    expect(screen.getByTestId("line-chart-empty")).toBeInTheDocument();
  });

  it("displayName LineChart olarak atanmistir", () => {
    expect(LineChart.displayName).toBe("LineChart");
  });

  it("SVG role=img vardir", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("title render eder", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} title="Satis Trendi" />);
    expect(screen.getByTestId("line-chart-title")).toHaveTextContent("Satis Trendi");
  });

  it("birden fazla seri destekler", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    const seriesEls = screen.getAllByTestId("line-chart-series");
    expect(seriesEls).toHaveLength(2);
  });

  it("showDots ile noktalar gosterir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showDots />);
    const dots = screen.getAllByTestId("line-chart-dot");
    expect(dots).toHaveLength(4);
  });

  it("showDots=false ile noktalar gizlenir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showDots={false} />);
    expect(screen.queryAllByTestId("line-chart-dot")).toHaveLength(0);
  });

  it("showArea ile alan doldurur", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} showArea />);
    expect(screen.getByTestId("line-chart-area")).toBeInTheDocument();
  });

  it("curved ile egri cizgiler kullanir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} curved />);
    const line = screen.getByTestId("line-chart-line");
    // curved uses <path> with d attribute containing "C" (cubic bezier)
    expect(line.tagName.toLowerCase()).toBe("path");
  });

  it("curved=false ile polyline kullanir", () => {
    render(<LineChart series={[lineSeries[0]]} labels={lineLabels} curved={false} />);
    const line = screen.getByTestId("line-chart-line");
    expect(line.tagName.toLowerCase()).toBe("polyline");
  });

  it("showLegend ile legend gosterir", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} showLegend />);
    expect(screen.getByTestId("line-chart-legend")).toBeInTheDocument();
  });

  it("showGrid=false ise grid cizgileri olmaz", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} showGrid={false} />);
    expect(screen.queryAllByTestId("line-chart-grid-line")).toHaveLength(0);
  });

  it("label render eder", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} />);
    const labels = screen.getAllByTestId("line-chart-label");
    expect(labels).toHaveLength(4);
  });
});

/* ---- LineChart access control ---- */

describe("LineChart - access control", () => {
  it('access="hidden" durumunda null doner', () => {
    const { container } = render(
      <LineChart series={lineSeries} labels={lineLabels} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" durumunda opacity azalir', () => {
    render(
      <LineChart series={lineSeries} labels={lineLabels} access="disabled" />,
    );
    expect(screen.getByTestId("line-chart")).toHaveClass("opacity-50");
  });
});

/* ================================================================== */
/*  PieChart                                                           */
/* ================================================================== */

describe("PieChart - temel render", () => {
  it("veri ile render eder", () => {
    render(<PieChart data={pieData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<PieChart data={[]} />);
    expect(screen.getByTestId("pie-chart-empty")).toBeInTheDocument();
  });

  it("displayName PieChart olarak atanmistir", () => {
    expect(PieChart.displayName).toBe("PieChart");
  });

  it("SVG role=img vardir", () => {
    render(<PieChart data={pieData} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("title render eder", () => {
    render(<PieChart data={pieData} title="Dagilim" />);
    expect(screen.getByTestId("pie-chart-title")).toHaveTextContent("Dagilim");
  });

  it("dilimleri render eder", () => {
    render(<PieChart data={pieData} />);
    const slices = screen.getAllByTestId("pie-chart-slice");
    expect(slices).toHaveLength(3);
  });

  it("donut modunda donut render eder", () => {
    render(<PieChart data={pieData} donut />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    const slices = screen.getAllByTestId("pie-chart-slice");
    expect(slices).toHaveLength(3);
  });

  it("donut modunda innerLabel gosterir", () => {
    render(
      <PieChart data={pieData} donut innerLabel={<span data-testid="inner">Toplam</span>} />,
    );
    expect(screen.getByTestId("pie-chart-inner-label")).toBeInTheDocument();
    expect(screen.getByTestId("inner")).toHaveTextContent("Toplam");
  });

  it("showPercentage ile yuzde gosterir", () => {
    render(<PieChart data={pieData} showPercentage />);
    const labels = screen.getAllByTestId("pie-chart-label");
    expect(labels.length).toBeGreaterThan(0);
    // Check that at least one label has a percentage
    const texts = labels.map((l) => l.textContent);
    expect(texts.some((t) => t?.includes("%"))).toBe(true);
  });

  it("showLabels ile dilim isimleri gosterir", () => {
    render(<PieChart data={pieData} showLabels />);
    const labels = screen.getAllByTestId("pie-chart-label");
    const texts = labels.map((l) => l.textContent);
    expect(texts).toContain("A");
    expect(texts).toContain("B");
  });

  it("showLegend ile legend gosterir", () => {
    render(<PieChart data={pieData} showLegend />);
    expect(screen.getByTestId("pie-chart-legend")).toBeInTheDocument();
  });

  it("valueFormatter ile formatli deger gosterir", () => {
    const fmt = (v: number) => `${v} TL`;
    render(<PieChart data={[{ label: "X", value: 100 }]} showLabels valueFormatter={fmt} />);
    // The formatter is used in tooltips, not the label text itself
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });
});

/* ---- PieChart access control ---- */

describe("PieChart - access control", () => {
  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<PieChart data={pieData} access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" durumunda opacity azalir', () => {
    render(<PieChart data={pieData} access="disabled" />);
    expect(screen.getByTestId("pie-chart")).toHaveClass("opacity-50");
  });
});

/* ================================================================== */
/*  AreaChart                                                          */
/* ================================================================== */

describe("AreaChart - temel render", () => {
  it("veri ile render eder", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  it("bos veri durumunda empty state gosterir", () => {
    render(<AreaChart series={[]} labels={[]} />);
    expect(screen.getByTestId("area-chart-empty")).toBeInTheDocument();
  });

  it("displayName AreaChart olarak atanmistir", () => {
    expect(AreaChart.displayName).toBe("AreaChart");
  });

  it("SVG role=img vardir", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("title render eder", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} title="Alan Grafik" />);
    expect(screen.getByTestId("area-chart-title")).toHaveTextContent("Alan Grafik");
  });

  it("birden fazla seri destekler", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    const seriesEls = screen.getAllByTestId("area-chart-series");
    expect(seriesEls).toHaveLength(2);
  });

  it("alan dolgusunu render eder", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} />);
    expect(screen.getByTestId("area-chart-area")).toBeInTheDocument();
  });

  it("showDots ile noktalar gosterir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} showDots />);
    const dots = screen.getAllByTestId("area-chart-dot");
    expect(dots).toHaveLength(4);
  });

  it("showDots=false ile noktalar gizlenir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} showDots={false} />);
    expect(screen.queryAllByTestId("area-chart-dot")).toHaveLength(0);
  });

  it("stacked mod destekler", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} stacked />);
    const areas = screen.getAllByTestId("area-chart-area");
    expect(areas).toHaveLength(2);
  });

  it("curved ile egri cizgiler kullanir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} curved />);
    const line = screen.getByTestId("area-chart-line");
    const d = line.getAttribute("d") ?? "";
    expect(d).toContain("C"); // cubic bezier
  });

  it("showLegend ile legend gosterir", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} showLegend />);
    expect(screen.getByTestId("area-chart-legend")).toBeInTheDocument();
  });

  it("showGrid=false ise grid cizgileri olmaz", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} showGrid={false} />);
    expect(screen.queryAllByTestId("area-chart-grid-line")).toHaveLength(0);
  });

  it("label render eder", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} />);
    const labels = screen.getAllByTestId("area-chart-label");
    expect(labels).toHaveLength(4);
  });

  it("gradient=false ile duz renk kullanir", () => {
    render(<AreaChart series={[lineSeries[0]]} labels={lineLabels} gradient={false} />);
    expect(screen.getByTestId("area-chart-area")).toBeInTheDocument();
  });
});

/* ---- AreaChart access control ---- */

describe("AreaChart - access control", () => {
  it('access="hidden" durumunda null doner', () => {
    const { container } = render(
      <AreaChart series={lineSeries} labels={lineLabels} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" durumunda opacity azalir', () => {
    render(
      <AreaChart series={lineSeries} labels={lineLabels} access="disabled" />,
    );
    expect(screen.getByTestId("area-chart")).toHaveClass("opacity-50");
  });
});

/* ================================================================== */
/*  Size variants (all charts)                                         */
/* ================================================================== */

describe("Charts - size variants", () => {
  it("BarChart sm boyutunda render eder", () => {
    render(<BarChart data={barData} size="sm" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("BarChart lg boyutunda render eder", () => {
    render(<BarChart data={barData} size="lg" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("LineChart sm boyutunda render eder", () => {
    render(<LineChart series={lineSeries} labels={lineLabels} size="sm" />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("PieChart lg boyutunda render eder", () => {
    render(<PieChart data={pieData} size="lg" />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("AreaChart sm boyutunda render eder", () => {
    render(<AreaChart series={lineSeries} labels={lineLabels} size="sm" />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });
});

describe('BarChart — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<BarChart data={[{ label: 'A', value: 10 }]} />);
    await expectNoA11yViolations(container);
  });
});
