import React from "react";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import { EmptyState as Empty } from "../empty-state/EmptyState";
import { Skeleton } from "../../primitives/skeleton/Skeleton";
import { Text } from "../../primitives/text/Text";

/* ------------------------------------------------------------------ */
/*  TableSimple — Lightweight static table with access control          */
/* ------------------------------------------------------------------ */

export type TableSimpleDensity = "comfortable" | "compact";
export type TableSimpleAlign = "left" | "center" | "right";

export type TableSimpleColumn<Row> = {
  key: string;
  label: React.ReactNode;
  accessor?: keyof Row | ((row: Row, index: number) => React.ReactNode);
  render?: (row: Row, index: number) => React.ReactNode;
  align?: TableSimpleAlign;
  emphasis?: boolean;
  truncate?: boolean;
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
};

export interface TableSimpleLocaleText {
  emptyStateLabel?: React.ReactNode;
  emptyFallbackDescription?: React.ReactNode;
}

export interface TableSimpleProps<
  Row extends Record<string, unknown> = Record<string, unknown>,
> extends AccessControlledProps {
  columns: TableSimpleColumn<Row>[];
  rows: Row[];
  caption?: React.ReactNode;
  description?: React.ReactNode;
  density?: TableSimpleDensity;
  striped?: boolean;
  stickyHeader?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  emptyStateLabel?: React.ReactNode;
  getRowKey?: (row: Row, index: number) => React.Key;
  localeText?: TableSimpleLocaleText;
}

const densityRowClass: Record<TableSimpleDensity, string> = {
  comfortable: "px-4 py-3.5",
  compact: "px-4 py-2.5",
};

const alignClass: Record<TableSimpleAlign, string> = {
  left: "text-start",
  center: "text-center",
  right: "text-end",
};

const resolveCellValue = <Row extends Record<string, unknown>>(
  column: TableSimpleColumn<Row>,
  row: Row,
  index: number,
) => {
  if (column.render) return column.render(row, index);
  if (typeof column.accessor === "function")
    return column.accessor(row, index);
  if (typeof column.accessor === "string")
    return row[column.accessor] as React.ReactNode;
  return row[column.key] as React.ReactNode;
};

export function TableSimple<
  Row extends Record<string, unknown> = Record<string, unknown>,
>({
  columns,
  rows,
  caption,
  description,
  density = "comfortable",
  striped = true,
  stickyHeader = false,
  loading = false,
  fullWidth = true,
  emptyStateLabel,
  getRowKey,
  localeText,
  access = "full",
  accessReason,
}: TableSimpleProps<Row>) {
  const accessState = resolveAccessState(access);
  const resolvedEmptyStateLabel =
    emptyStateLabel ??
    localeText?.emptyStateLabel ??
    "No records found for this table.";
  const resolvedEmptyFallbackDescription =
    localeText?.emptyFallbackDescription ??
    (typeof resolvedEmptyStateLabel === "string"
      ? resolvedEmptyStateLabel
      : "No records found.");

  if (accessState.isHidden) {
    return null;
  }

  const showEmpty = !loading && rows.length === 0;

  return (
    <section
      className={fullWidth ? "w-full" : undefined}
      data-access-state={accessState.state}
      data-component="table-simple"
      title={accessReason}
    >
      {caption ? (
        <Text
          as="div"
          className="text-base font-semibold text-[var(--text-primary)]"
        >
          {caption}
        </Text>
      ) : null}
      {description ? (
        <Text variant="secondary" className="mt-1 block text-sm leading-6">
          {description}
        </Text>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-[26px] border border-[var(--border-subtle)] bg-[var(--surface-default)] shadow-sm">
        {showEmpty ? (
          <div className="p-5">
            <Empty description={resolvedEmptyFallbackDescription} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-[var(--text-primary)]">
              <thead
                className={
                  stickyHeader
                    ? "sticky top-0 z-[1] bg-[var(--surface-muted)]/95 backdrop-blur"
                    : "bg-[var(--surface-muted)]"
                }
              >
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={[
                        "border-b border-[var(--border-subtle)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]",
                        alignClass[column.align ?? "left"],
                        column.headerClassName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={
                        column.width ? { width: column.width } : undefined
                      }
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, rowIndex) => (
                      <tr
                        key={`loading-${rowIndex}`}
                        className="bg-[var(--surface-default)]"
                      >
                        {columns.map((column) => (
                          <td
                            key={`${column.key}-${rowIndex}`}
                            className={[
                              "border-b border-[var(--border-subtle)] align-top",
                              densityRowClass[density],
                              alignClass[column.align ?? "left"],
                            ].join(" ")}
                          >
                            <Skeleton
                              lines={1}
                              animated={rowIndex % 2 === 0}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  : rows.map((row, rowIndex) => (
                      <tr
                        key={
                          getRowKey ? getRowKey(row, rowIndex) : rowIndex
                        }
                        className={[
                          striped && rowIndex % 2 === 1
                            ? "bg-[var(--surface-muted)]/60"
                            : "bg-[var(--surface-default)]",
                          accessState.isReadonly ? "opacity-95" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {columns.map((column) => {
                          const value = resolveCellValue(
                            column,
                            row,
                            rowIndex,
                          );
                          return (
                            <td
                              key={column.key}
                              className={[
                                "border-b border-[var(--border-subtle)] align-top text-sm leading-6 text-[var(--text-primary)]",
                                densityRowClass[density],
                                alignClass[column.align ?? "left"],
                                column.cellClassName,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              <div
                                className={[
                                  column.truncate ? "truncate" : "",
                                  column.emphasis
                                    ? "font-semibold text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)]",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {value}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

TableSimple.displayName = "TableSimple";

export default TableSimple;
