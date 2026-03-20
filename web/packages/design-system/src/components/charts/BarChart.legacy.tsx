import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import type { ChartSize, ChartDataPoint, ChartLocaleText } from "./types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BarChartProps extends AccessControlledProps {
  /** Data points to render as bars. */
  data: ChartDataPoint[];
  /** Bar orientation. @default "vertical" */
  orientation?: "vertical" | "horizontal";
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Show value labels on bars. @default false */
  showValues?: boolean;
  /** Show grid lines. @default true */
  showGrid?: boolean;
  /** Show legend below the chart. @default false */
  showLegend?: boolean;
  /** Custom value formatter. */
  valueFormatter?: (value: number) => string;
  /** Animate bars on mount. @default true */
  animate?: boolean;
  /** Override default chart colors. */
  colors?: string[];
  /** Chart title. */
  title?: string;
  /** Accessible description. */
  description?: string;
  /** Locale overrides. */
  localeText?: ChartLocaleText;
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

const DEFAULT_COLORS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #8b5cf6)",
];

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  function BarChart(
    {
      data,
      orientation = "vertical",
      size = "md",
      showValues = false,
      showGrid = true,
      showLegend = false,
      valueFormatter,
      animate = true,
      colors,
      title,
      description,
      localeText,
      className,
      access = "full",
      accessReason,
      ...rest
    },
    forwardedRef,
  ) {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const formatValue = valueFormatter ?? ((v: number) => String(v));
    const palette = colors ?? DEFAULT_COLORS;
    const noDataText = localeText?.noData ?? "Veri yok";
    const height = SIZE_HEIGHT[size];
    const width = Math.round(height * 1.6);

    /* ---- empty state ---- */
    if (!data || data.length === 0) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "inline-flex items-center justify-center text-sm text-[var(--text-secondary)]",
            accessState.isDisabled && "opacity-50",
            className,
          )}
          style={{ width, height }}
          title={accessReason}
          data-testid="bar-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const chartW = width - PADDING.left - PADDING.right;
    const chartH = height - PADDING.top - PADDING.bottom;

    const isVertical = orientation === "vertical";

    /* ---- grid ticks (5 lines) ---- */
    const ticks = 5;
    const tickStep = maxValue / ticks;

    const ariaLabel = [title, description].filter(Boolean).join(" — ") || "Bar chart";

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "w-full max-w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        title={accessReason}
        data-testid="bar-chart"
        {...rest}
      >
        {title && (
          <div
            className="text-sm font-medium text-[var(--text-primary)] mb-1"
            data-testid="bar-chart-title"
          >
            {title}
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
          className="w-full h-auto"
          style={{ overflow: "visible", maxWidth: width }}
        >
          {description && <desc>{description}</desc>}

          {/* Grid lines */}
          {showGrid &&
            Array.from({ length: ticks + 1 }, (_, i) => {
              if (isVertical) {
                const y = PADDING.top + chartH - (i / ticks) * chartH;
                return (
                  <line
                    key={`grid-${i}`}
                    x1={PADDING.left}
                    y1={y}
                    x2={PADDING.left + chartW}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeWidth={1}
                    data-testid="bar-chart-grid-line"
                  />
                );
              } else {
                const x = PADDING.left + (i / ticks) * chartW;
                return (
                  <line
                    key={`grid-${i}`}
                    x1={x}
                    y1={PADDING.top}
                    x2={x}
                    y2={PADDING.top + chartH}
                    stroke="var(--border-subtle)"
                    strokeWidth={1}
                    data-testid="bar-chart-grid-line"
                  />
                );
              }
            })}

          {/* Y-axis tick labels (vertical) / X-axis tick labels (horizontal) */}
          {Array.from({ length: ticks + 1 }, (_, i) => {
            const val = Math.round(tickStep * i);
            if (isVertical) {
              const y = PADDING.top + chartH - (i / ticks) * chartH;
              return (
                <text
                  key={`tick-${i}`}
                  x={PADDING.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill="var(--text-secondary)"
                >
                  {formatValue(val)}
                </text>
              );
            } else {
              const x = PADDING.left + (i / ticks) * chartW;
              return (
                <text
                  key={`tick-${i}`}
                  x={x}
                  y={PADDING.top + chartH + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-secondary)"
                >
                  {formatValue(val)}
                </text>
              );
            }
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const color = d.color ?? palette[i % palette.length];
            const barGap = 4;

            if (isVertical) {
              const barW = (chartW - barGap * (data.length + 1)) / data.length;
              const barH = (d.value / maxValue) * chartH;
              const x = PADDING.left + barGap + i * (barW + barGap);
              const y = PADDING.top + chartH - barH;

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    fill={color}
                    rx={2}
                    data-testid="bar-chart-bar"
                  >
                    <title>{`${d.label}: ${formatValue(d.value)}`}</title>
                  </rect>
                  {animate && (
                    <animate
                      attributeName="height"
                      from="0"
                      to={String(barH)}
                      dur="0.6s"
                      fill="freeze"
                    />
                  )}
                  {/* X-axis label */}
                  <text
                    x={x + barW / 2}
                    y={PADDING.top + chartH + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--text-secondary)"
                    data-testid="bar-chart-label"
                  >
                    {d.label}
                  </text>
                  {/* Value label */}
                  {showValues && (
                    <text
                      x={x + barW / 2}
                      y={y - 4}
                      textAnchor="middle"
                      fontSize={10}
                      fill="var(--text-primary)"
                      data-testid="bar-chart-value"
                    >
                      {formatValue(d.value)}
                    </text>
                  )}
                </g>
              );
            } else {
              const barH = (chartH - barGap * (data.length + 1)) / data.length;
              const barW = (d.value / maxValue) * chartW;
              const x = PADDING.left;
              const y = PADDING.top + barGap + i * (barH + barGap);

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    fill={color}
                    rx={2}
                    data-testid="bar-chart-bar"
                  >
                    <title>{`${d.label}: ${formatValue(d.value)}`}</title>
                  </rect>
                  {/* Y-axis label */}
                  <text
                    x={PADDING.left - 8}
                    y={y + barH / 2 + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill="var(--text-secondary)"
                    data-testid="bar-chart-label"
                  >
                    {d.label}
                  </text>
                  {/* Value label */}
                  {showValues && (
                    <text
                      x={x + barW + 6}
                      y={y + barH / 2 + 4}
                      textAnchor="start"
                      fontSize={10}
                      fill="var(--text-primary)"
                      data-testid="bar-chart-value"
                    >
                      {formatValue(d.value)}
                    </text>
                  )}
                </g>
              );
            }
          })}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div
            className="flex flex-wrap gap-3 mt-2"
            data-testid="bar-chart-legend"
          >
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: d.color ?? palette[i % palette.length] }}
                />
                {d.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

BarChart.displayName = "BarChart";

export default BarChart;
