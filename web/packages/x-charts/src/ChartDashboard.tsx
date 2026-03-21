import React from "react";
import { cn } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartDashboardProps {
  /** Dashboard grid content (ChartDashboard.Item elements). */
  children: React.ReactNode;
  /** Number of columns. @default 3 */
  columns?: 1 | 2 | 3 | 4;
  /** Gap size between items. @default "md" */
  gap?: "sm" | "md" | "lg";
  /** Additional class name. */
  className?: string;
}

export interface ChartDashboardItemProps {
  /** Number of columns to span. @default 1 */
  span?: 1 | 2 | 3 | 4;
  /** Number of rows to span. @default 1 */
  rowSpan?: 1 | 2;
  /** Item content. */
  children: React.ReactNode;
  /** Additional class name. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GAP_MAP: Record<string, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const COL_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const SPAN_MAP: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  3: "col-span-1 sm:col-span-2 lg:col-span-3",
  4: "col-span-1 sm:col-span-2 lg:col-span-4",
};

const ROW_SPAN_MAP: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
};

/* ------------------------------------------------------------------ */
/*  ChartDashboardItem                                                 */
/* ------------------------------------------------------------------ */

function ChartDashboardItem({
  span = 1,
  rowSpan = 1,
  children,
  className,
}: ChartDashboardItemProps) {
  return (
    <div
      className={cn(
        SPAN_MAP[span],
        ROW_SPAN_MAP[rowSpan],
        "min-w-0", // prevent overflow
        className,
      )}
      data-testid="chart-dashboard-item"
    >
      {children}
    </div>
  );
}

ChartDashboardItem.displayName = "ChartDashboardItem";

/* ------------------------------------------------------------------ */
/*  ChartDashboard                                                     */
/* ------------------------------------------------------------------ */

export function ChartDashboard({
  children,
  columns = 3,
  gap = "md",
  className,
}: ChartDashboardProps) {
  return (
    <div
      className={cn("grid", COL_MAP[columns], GAP_MAP[gap], className)}
      data-testid="chart-dashboard"
    >
      {children}
    </div>
  );
}

ChartDashboard.displayName = "ChartDashboard";

/** Sub-component for individual dashboard grid items. */
ChartDashboard.Item = ChartDashboardItem;

export default ChartDashboard;
