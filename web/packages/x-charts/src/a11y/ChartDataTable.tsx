/**
 * ChartDataTable — "View as data table" toggle for screen readers
 *
 * Renders an accessible HTML table alternative to the visual chart.
 * Toggle button allows users to switch between chart and table view.
 *
 * @see chart-viz-engine-selection D-009 (a11y)
 */
import React, { useState } from "react";

export interface ChartDataTableColumn {
  /** Column header text. */
  header: string;
  /** Key to access in data row. */
  accessorKey: string;
  /** Optional value formatter. */
  formatter?: (value: unknown) => string;
}

export interface ChartDataTableProps {
  /** Column definitions. */
  columns: ChartDataTableColumn[];
  /** Data rows. */
  data: Record<string, unknown>[];
  /** Chart content (shown when table is hidden). */
  children: React.ReactNode;
  /** Table caption for screen readers. */
  caption?: string;
  /** Initial view mode. @default "chart" */
  defaultView?: "chart" | "table";
  /** Toggle button label. @default "View as data table" */
  toggleLabel?: string;
  /** Additional class name for wrapper. */
  className?: string;
}

/**
 * Wraps a chart with a toggle to show data as an HTML table.
 *
 * @example
 * ```tsx
 * <ChartDataTable
 *   columns={[{ header: "Month", accessorKey: "label" }, { header: "Sales", accessorKey: "value" }]}
 *   data={chartData}
 *   caption="Monthly sales data"
 * >
 *   <BarChart data={chartData} />
 * </ChartDataTable>
 * ```
 */
export function ChartDataTable({
  columns,
  data,
  children,
  caption,
  defaultView = "chart",
  toggleLabel = "View as data table",
  className,
}: ChartDataTableProps) {
  const [view, setView] = useState<"chart" | "table">(defaultView);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setView((v) => (v === "chart" ? "table" : "chart"))}
        aria-pressed={view === "table"}
        style={{
          fontSize: 12,
          padding: "4px 8px",
          marginBottom: 8,
          cursor: "pointer",
          border: "1px solid var(--border-default, #e5e7eb)",
          borderRadius: 4,
          background: view === "table" ? "var(--bg-muted, #f3f4f6)" : "transparent",
          color: "var(--text-secondary, #6b7280)",
        }}
      >
        {view === "chart" ? toggleLabel : "View as chart"}
      </button>

      {view === "chart" ? (
        children
      ) : (
        <div role="region" aria-label={caption ?? "Chart data table"} tabIndex={0}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
            }}
          >
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessorKey}
                    scope="col"
                    style={{
                      textAlign: "left",
                      padding: "6px 8px",
                      borderBottom: "2px solid var(--border-default, #e5e7eb)",
                      color: "var(--text-primary, #1a1a2e)",
                      fontWeight: 600,
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col) => (
                    <td
                      key={col.accessorKey}
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid var(--border-default, #e5e7eb)",
                        color: "var(--text-secondary, #6b7280)",
                      }}
                    >
                      {col.formatter
                        ? col.formatter(row[col.accessorKey])
                        : String(row[col.accessorKey] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
