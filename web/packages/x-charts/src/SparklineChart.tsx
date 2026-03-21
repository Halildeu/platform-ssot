import React, { useMemo } from "react";
import { cn } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SparklineChartProps {
  /** Numeric data points to render. */
  data: number[];
  /** Visual style of the sparkline. @default "line" */
  type?: "line" | "bar" | "area";
  /** Width in pixels. @default 120 */
  width?: number;
  /** Height in pixels. @default 32 */
  height?: number;
  /** Stroke / fill colour (CSS value or custom property). @default "var(--action-primary)" */
  color?: string;
  /** Show a dot on the last data point. @default false */
  showLastPoint?: boolean;
  /** Show min/max markers. @default false */
  showMinMax?: boolean;
  /** Animate the chart on mount. @default true */
  animate?: boolean;
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildPolylinePoints(
  data: number[],
  width: number,
  height: number,
  padding: number,
): string {
  if (data.length === 0) return "";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  return data
    .map((v, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * innerW;
      const y = padding + innerH - ((v - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(
  data: number[],
  width: number,
  height: number,
  padding: number,
): string {
  if (data.length === 0) return "";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const coords = data.map((v, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * innerW;
    const y = padding + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });

  const linePart = coords.map((c, i) => (i === 0 ? `M ${c.x},${c.y}` : `L ${c.x},${c.y}`)).join(" ");
  const baseline = padding + innerH;
  return `${linePart} L ${coords[coords.length - 1].x},${baseline} L ${coords[0].x},${baseline} Z`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SparklineChart = React.forwardRef<HTMLDivElement, SparklineChartProps>(
  function SparklineChart(
    {
      data,
      type = "line",
      width = 120,
      height = 32,
      color = "var(--action-primary, #3b82f6)",
      showLastPoint = false,
      showMinMax = false,
      animate = true,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const PADDING = 4;

    const { points, areaPath, bars, lastPt, minPt, maxPt } = useMemo(() => {
      if (!data || data.length === 0) {
        return { points: "", areaPath: "", bars: [], lastPt: null, minPt: null, maxPt: null };
      }

      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;
      const innerW = width - PADDING * 2;
      const innerH = height - PADDING * 2;

      const pts = buildPolylinePoints(data, width, height, PADDING);
      const area = buildAreaPath(data, width, height, PADDING);

      // Bar rects
      const barGap = 1;
      const barW = Math.max(1, (innerW - (data.length - 1) * barGap) / data.length);
      const barRects = data.map((v, i) => {
        const barH = Math.max(1, ((v - min) / range) * innerH);
        return {
          x: PADDING + i * (barW + barGap),
          y: PADDING + innerH - barH,
          w: barW,
          h: barH,
        };
      });

      // Special points
      const coords = data.map((v, i) => ({
        x: PADDING + (i / Math.max(data.length - 1, 1)) * innerW,
        y: PADDING + innerH - ((v - min) / range) * innerH,
        value: v,
      }));

      const last = coords[coords.length - 1] ?? null;

      let minCoord = null;
      let maxCoord = null;
      if (showMinMax && coords.length > 0) {
        const minIdx = data.indexOf(min);
        const maxIdx = data.indexOf(max);
        minCoord = coords[minIdx];
        maxCoord = coords[maxIdx];
      }

      return { points: pts, areaPath: area, bars: barRects, lastPt: last, minPt: minCoord, maxPt: maxCoord };
    }, [data, width, height, showMinMax]);

    if (!data || data.length === 0) {
      return (
        <div
          ref={forwardedRef}
          className={cn("inline-block", className)}
          style={{ width, height }}
          role="img"
          aria-label="Sparkline chart — no data"
          data-testid="sparkline-chart-empty"
          {...rest}
        />
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cn("inline-block", className)}
        style={{ width, height }}
        data-testid="sparkline-chart"
        {...rest}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`Sparkline chart: ${data.length} data points, last value ${data[data.length - 1]}`}
        >
          {type === "bar" ? (
            /* ---- bar sparkline ---- */
            bars.map((b, i) => (
              <rect
                key={i}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={color}
                opacity="0.8"
                rx="0.5"
              >
                {animate && (
                  <animate
                    attributeName="height"
                    from="0"
                    to={String(b.h)}
                    dur="0.4s"
                    fill="freeze"
                  />
                )}
              </rect>
            ))
          ) : type === "area" ? (
            /* ---- area sparkline ---- */
            <>
              <path
                d={areaPath}
                fill={color}
                opacity="0.15"
              >
                {animate && (
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="0.15"
                    dur="0.4s"
                    fill="freeze"
                  />
                )}
              </path>
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {animate && (
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.4s"
                    fill="freeze"
                  />
                )}
              </polyline>
            </>
          ) : (
            /* ---- line sparkline ---- */
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {animate && (
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="0.4s"
                  fill="freeze"
                />
              )}
            </polyline>
          )}

          {/* Last-point marker */}
          {showLastPoint && lastPt && (
            <circle
              cx={lastPt.x}
              cy={lastPt.y}
              r="2.5"
              fill={color}
              stroke="var(--surface-default, #fff)"
              strokeWidth="1"
            />
          )}

          {/* Min/Max markers */}
          {showMinMax && minPt && (
            <circle
              cx={minPt.x}
              cy={minPt.y}
              r="2"
              fill="var(--state-error-text, #ef4444)"
              stroke="var(--surface-default, #fff)"
              strokeWidth="0.5"
            />
          )}
          {showMinMax && maxPt && (
            <circle
              cx={maxPt.x}
              cy={maxPt.y}
              r="2"
              fill="var(--state-success-text, #22c55e)"
              stroke="var(--surface-default, #fff)"
              strokeWidth="0.5"
            />
          )}
        </svg>
      </div>
    );
  },
);

SparklineChart.displayName = "SparklineChart";

export default SparklineChart;
