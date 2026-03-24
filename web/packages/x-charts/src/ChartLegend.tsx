import React from "react";
import { cn, Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartLegendItem {
  /** Legend label. */
  label: string;
  /** Dot colour (CSS value or custom property). */
  color: string;
  /** Optional value displayed next to the label. */
  value?: string | number;
}

export interface ChartLegendProps {
  /** Legend entries. */
  items: ChartLegendItem[];
  /** Layout direction. @default "horizontal" */
  direction?: "horizontal" | "vertical";
  /** Maximum visible items before "+N more" truncation. Omit to show all. */
  maxItems?: number;
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  function ChartLegend(
    { items, direction = "horizontal", maxItems, className, ...rest },
    forwardedRef,
  ) {
    const visibleItems =
      maxItems != null && maxItems < items.length
        ? items.slice(0, maxItems)
        : items;

    const overflowCount =
      maxItems != null && maxItems < items.length
        ? items.length - maxItems
        : 0;

    const isVertical = direction === "vertical";

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "flex flex-wrap",
          isVertical ? "flex-col gap-1.5" : "flex-row items-center gap-x-4 gap-y-1",
          className,
        )}
        role="list"
        aria-label="Chart legend"
        data-testid="chart-legend"
        {...rest}
      >
        {visibleItems.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="inline-flex items-center gap-1.5"
            role="listitem"
          >
            {/* colour dot */}
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <Text
              as="span"
              className="text-xs text-[var(--text-secondary)]"
            >
              {item.label}
            </Text>
            {item.value != null && (
              <Text
                as="span"
                className="text-xs font-semibold text-[var(--text-primary)]"
              >
                {item.value}
              </Text>
            )}
          </div>
        ))}

        {overflowCount > 0 && (
          <Text
            as="span"
            className="text-[11px] text-[var(--text-tertiary)]"
            role="listitem"
          >
            +{overflowCount} more
          </Text>
        )}
      </div>
    );
  },
);

ChartLegend.displayName = "ChartLegend";

export default ChartLegend;
