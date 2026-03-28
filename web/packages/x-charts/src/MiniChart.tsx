import React, { useMemo } from "react";
import { cn } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MiniChartDataPoint {
  label: string;
  value: number;
}

export interface MiniChartProps {
  /** Data points to visualise. */
  data: Array<MiniChartDataPoint>;
  /** Chart type. @default "line" */
  type?: "line" | "bar" | "area" | "donut";
  /** Chart height in pixels. @default 120 */
  height?: number;
  /** Primary colour (CSS value or custom property). @default "var(--action-primary)" */
  color?: string;
  /** Trend direction indicator. */
  trend?: "up" | "down" | "flat";
  /** Trend label (e.g. "+12%"). */
  trendValue?: string;
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TrendIndicator({
  trend,
  trendValue,
}: {
  trend: "up" | "down" | "flat";
  trendValue?: string;
}) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  const color = isUp
    ? "var(--state-success-text, #22c55e)"
    : isDown
      ? "var(--state-error-text, #ef4444)"
      : "var(--text-secondary, #64748b)";

  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-medium"
      style={{ color }}
    >
      {isUp && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 2.5L10 7H2L6 2.5Z" fill="currentColor" />
        </svg>
      )}
      {isDown && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 9.5L2 5H10L6 9.5Z" fill="currentColor" />
        </svg>
      )}
      {trend === "flat" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {trendValue}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart renderers                                                    */
/* ------------------------------------------------------------------ */

function renderLineSVG(
  data: MiniChartDataPoint[],
  width: number,
  height: number,
  color: string,
  filled: boolean,
) {
  const PADDING = 8;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;
  const innerW = width - PADDING * 2;
  const innerH = height - PADDING * 2;

  const coords = data.map((d, i) => ({
    x: PADDING + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PADDING + innerH - ((d.value - min) / range) * innerH,
  }));

  const polyPoints = coords.map((c) => `${c.x},${c.y}`).join(" ");

  const areaPath = filled
    ? coords
        .map((c, i) => (i === 0 ? `M ${c.x},${c.y}` : `L ${c.x},${c.y}`))
        .join(" ") +
      ` L ${coords[coords.length - 1].x},${PADDING + innerH} L ${coords[0].x},${PADDING + innerH} Z`
    : undefined;

  return (
    <>
      {filled && areaPath && <path d={areaPath} fill={color} opacity="0.12" />}
      <polyline
        points={polyPoints}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* last point */}
      {coords.length > 0 && (
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="3"
          fill={color}
          stroke="var(--surface-default, #fff)"
          strokeWidth="1.5"
        />
      )}
    </>
  );
}

function renderBarSVG(
  data: MiniChartDataPoint[],
  width: number,
  height: number,
  color: string,
) {
  const PADDING = 8;
  const min = Math.min(0, ...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;
  const innerW = width - PADDING * 2;
  const innerH = height - PADDING * 2;
  const gap = 2;
  const barW = Math.max(2, (innerW - (data.length - 1) * gap) / data.length);

  return (
    <>
      {data.map((d, i) => {
        const barH = Math.max(1, ((d.value - min) / range) * innerH);
        return (
          <rect
            key={i}
            x={PADDING + i * (barW + gap)}
            y={PADDING + innerH - barH}
            width={barW}
            height={barH}
            fill={color}
            opacity="0.75"
            rx="1"
          />
        );
      })}
    </>
  );
}

function DonutChart({
  data,
  height,
  color,
}: {
  data: MiniChartDataPoint[];
  height: number;
  color: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const size = Math.min(height, 100);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.14;

  const COLORS = [
    color,
    "var(--state-success-text, #22c55e)",
    "var(--state-warning-text, #f59e0b)",
    "var(--state-error-text, #ef4444)",
    "var(--text-tertiary, #94a3b8)",
  ];

  let cumulativeAngle = -90; // start from top

  const arcs = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    return (
      <path
        key={i}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={COLORS[i % COLORS.length]}
        strokeWidth={strokeW}
        strokeLinecap="butt"
      />
    );
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Donut chart with ${data.length} segments`}
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* background track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--border-subtle, #e2e8f0)"
        strokeWidth={strokeW}
      />
      {arcs}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const MiniChart = React.forwardRef<HTMLDivElement, MiniChartProps>(
  function MiniChart(
    {
      data,
      type = "line",
      height = 120,
      color = "var(--action-primary, #3b82f6)",
      trend,
      trendValue,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const isEmpty = !data || data.length === 0;

    const chartContent = useMemo(() => {
      if (isEmpty) return null;

      if (type === "donut") {
        return <DonutChart data={data} height={height} color={color} />;
      }

      // For SVG-based types we use a responsive viewBox
      const svgWidth = 200;
      const svgHeight = height;

      let content: React.ReactNode;
      switch (type) {
        case "bar":
          content = renderBarSVG(data, svgWidth, svgHeight, color);
          break;
        case "area":
          content = renderLineSVG(data, svgWidth, svgHeight, color, true);
          break;
        default:
          content = renderLineSVG(data, svgWidth, svgHeight, color, false);
      }

      return (
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height={svgHeight}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Mini ${type} chart with ${data.length} data points`}
        >
          {content}
        </svg>
      );
    }, [data, type, height, color, isEmpty]);

    if (isEmpty) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "flex items-center justify-center text-xs text-[var(--text-secondary)]",
            className,
          )}
          style={{ height }}
          role="img"
          aria-label="Mini chart — no data"
          data-testid="mini-chart-empty"
          {...rest}
        >
          No data
        </div>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cn("w-full", className)}
        data-testid="mini-chart"
        {...rest}
      >
        {chartContent}
        {trend && (
          <div className="mt-1 flex justify-end">
            <TrendIndicator trend={trend} trendValue={trendValue} />
          </div>
        )}
      </div>
    );
  },
);

MiniChart.displayName = "MiniChart";

export default MiniChart;
