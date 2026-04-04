/**
 * Contract Test: ChartSpec → ECharts Option Transformer
 *
 * Validates the core transformation pipeline:
 * - ChartSpec input → valid ECharts option output
 * - Title/subtitle sanitization (XSS)
 * - Chart type mapping
 * - Axis configuration
 * - Series building
 * - Animation settings
 * - ARIA/accessibility output
 *
 * @see chart-viz-engine-selection D-005
 */
import { describe, it, expect } from "vitest";
import { chartSpecToEChartsOption } from "../spec/chartSpecToEChartsOption";
import type { ChartSpec } from "../spec/ChartSpec";

function makeSpec(overrides: Partial<ChartSpec> = {}): ChartSpec {
  return {
    $schema: "urn:ao:chart-spec:v1",
    version: "v1",
    spec_version: "1.0.0",
    chart_type: "bar",
    title: "Test Chart",
    data: { source: "inline", values: [{ label: "A", value: 10 }] },
    encoding: {
      x: { field: "label", type: "nominal" },
      y: { field: "value", type: "quantitative" },
    },
    ...overrides,
  } as ChartSpec;
}

describe("chartSpecToEChartsOption", () => {
  it("transforms a basic bar spec to ECharts option", () => {
    const spec = makeSpec();
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;

    expect(option).toBeDefined();
    expect(option.series).toBeDefined();
    expect(Array.isArray(option.series)).toBe(true);
    const series = option.series as Record<string, unknown>[];
    expect(series[0].type).toBe("bar");
  });

  it("maps chart types correctly", () => {
    const types: Array<[string, string]> = [
      ["bar", "bar"],
      ["line", "line"],
      ["area", "line"],
      ["pie", "pie"],
      ["scatter", "scatter"],
      ["donut", "pie"],
      ["stacked_bar", "bar"],
    ];

    for (const [input, expected] of types) {
      const spec = makeSpec({ chart_type: input as ChartSpec["chart_type"] });
      const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;
      const series = option.series as Record<string, unknown>[];
      expect(series[0].type).toBe(expected);
    }
  });

  it("sanitizes title text (XSS prevention)", () => {
    const spec = makeSpec({ title: '<script>alert("xss")</script>' });
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;
    const title = option.title as Record<string, unknown>;

    expect(title.text).not.toContain("<script>");
    expect(title.text).toContain("&lt;script&gt;");
  });

  it("builds dataset from inline data", () => {
    const spec = makeSpec({
      data: {
        source: "inline",
        values: [
          { label: "A", value: 10 },
          { label: "B", value: 20 },
        ],
      },
    });
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;
    const dataset = option.dataset as Record<string, unknown>;

    expect(dataset).toBeDefined();
    expect(Array.isArray(dataset.source)).toBe(true);
    expect((dataset.source as unknown[]).length).toBe(2);
  });

  it("excludes axes for pie/donut charts", () => {
    const spec = makeSpec({ chart_type: "pie" });
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;

    expect(option.xAxis).toBeUndefined();
    expect(option.yAxis).toBeUndefined();
  });

  it("sets stacking for stacked_bar", () => {
    const spec = makeSpec({ chart_type: "stacked_bar" });
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;
    const series = option.series as Record<string, unknown>[];

    expect(series[0].stack).toBe("total");
  });

  it("applies animation settings", () => {
    const spec = makeSpec({
      animation: { enabled: true, duration_ms: 800, easing: "ease-in-out" },
    } as Partial<ChartSpec>);
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;

    expect(option.animation).toBe(true);
    expect(option.animationDuration).toBe(800);
    expect(option.animationEasing).toBe("cubicInOut");
  });

  it("disables animation when enabled=false", () => {
    const spec = makeSpec({
      animation: { enabled: false },
    } as Partial<ChartSpec>);
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;

    expect(option.animation).toBe(false);
  });

  it("builds ARIA accessibility output", () => {
    const spec = makeSpec({
      accessibility: { description: "Monthly revenue chart" },
    } as Partial<ChartSpec>);
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;
    const aria = option.aria as Record<string, unknown>;

    expect(aria).toBeDefined();
    expect(aria.enabled).toBe(true);
  });

  it("enables data zoom when zoom_pan is true", () => {
    const spec = makeSpec({
      interaction: { zoom_pan: true },
    } as Partial<ChartSpec>);
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;

    expect(option.dataZoom).toBeDefined();
    expect(Array.isArray(option.dataZoom)).toBe(true);
  });

  it("generates tooltip with correct trigger type", () => {
    // Axis trigger for bar
    const barSpec = makeSpec({ chart_type: "bar" });
    const barOpt = chartSpecToEChartsOption(barSpec) as Record<string, unknown>;
    const barTooltip = barOpt.tooltip as Record<string, unknown>;
    expect(barTooltip.trigger).toBe("axis");

    // Item trigger for pie
    const pieSpec = makeSpec({ chart_type: "pie" });
    const pieOpt = chartSpecToEChartsOption(pieSpec) as Record<string, unknown>;
    const pieTooltip = pieOpt.tooltip as Record<string, unknown>;
    expect(pieTooltip.trigger).toBe("item");
  });

  it("donut chart has radius hole", () => {
    const spec = makeSpec({ chart_type: "donut" });
    const option = chartSpecToEChartsOption(spec) as Record<string, unknown>;
    const series = option.series as Record<string, unknown>[];

    expect(series[0].radius).toBeDefined();
    expect(Array.isArray(series[0].radius)).toBe(true);
  });
});
