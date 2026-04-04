/**
 * ChartKeyboardNav — Keyboard navigation for chart data points
 *
 * Provides Tab/Arrow key navigation between chart data points.
 * Wraps a chart component and adds a focus-visible ring on active point.
 *
 * @see chart-viz-engine-selection D-009 (a11y)
 */
import React, { useRef, useState, useCallback } from "react";

export interface ChartKeyboardNavProps {
  /** Total number of data points in the chart. */
  dataPointCount: number;
  /** Callback when active data point index changes via keyboard. */
  onActiveIndexChange?: (index: number) => void;
  /** Callback when user presses Enter/Space on active point. */
  onSelect?: (index: number) => void;
  /** Chart content (rendered inside the navigation wrapper). */
  children: React.ReactNode;
  /** Accessible label for the navigation region. */
  ariaLabel?: string;
  /** Additional class name. */
  className?: string;
}

/**
 * Wraps a chart to provide keyboard navigation through data points.
 *
 * @example
 * ```tsx
 * <ChartKeyboardNav
 *   dataPointCount={data.length}
 *   onActiveIndexChange={(i) => chart.dispatchAction({ type: 'highlight', dataIndex: i })}
 *   onSelect={(i) => handleClick(data[i])}
 * >
 *   <div ref={chartContainerRef} style={{ height: 300 }} />
 * </ChartKeyboardNav>
 * ```
 */
export function ChartKeyboardNav({
  dataPointCount,
  onActiveIndexChange,
  onSelect,
  children,
  ariaLabel = "Chart data navigation",
  className,
}: ChartKeyboardNavProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const move = useCallback(
    (delta: number) => {
      if (dataPointCount <= 0) return;
      setActiveIndex((prev) => {
        const next =
          prev < 0
            ? delta > 0
              ? 0
              : dataPointCount - 1
            : (prev + delta + dataPointCount) % dataPointCount;
        onActiveIndexChange?.(next);
        return next;
      });
    },
    [dataPointCount, onActiveIndexChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          move(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          move(-1);
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          onActiveIndexChange?.(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(dataPointCount - 1);
          onActiveIndexChange?.(dataPointCount - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeIndex >= 0) onSelect?.(activeIndex);
          break;
        case "Escape":
          e.preventDefault();
          setActiveIndex(-1);
          onActiveIndexChange?.(-1);
          break;
      }
    },
    [activeIndex, dataPointCount, move, onActiveIndexChange, onSelect],
  );

  return (
    <div
      ref={containerRef}
      role="application"
      aria-roledescription="chart"
      aria-label={ariaLabel}
      aria-activedescendant={
        activeIndex >= 0 ? `chart-point-${activeIndex}` : undefined
      }
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        setActiveIndex(-1);
        onActiveIndexChange?.(-1);
      }}
      className={className}
      style={{ outline: "none" }}
    >
      {children}
      {/* Screen reader: announce active point */}
      {activeIndex >= 0 && (
        <span
          id={`chart-point-${activeIndex}`}
          role="status"
          className="sr-only"
          aria-live="polite"
        >
          Data point {activeIndex + 1} of {dataPointCount}
        </span>
      )}
    </div>
  );
}
