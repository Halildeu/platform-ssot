import React, { useCallback, useMemo, useState } from "react";
import type { CatalogItemLike } from "../../reportingCategoryMap";

/* ------------------------------------------------------------------ */
/*  ReportingFilterBar — type filter chips                             */
/*  [Tümü] [Grid ●] [Dashboard ●] [Hibrit ●] [Özel ●]               */
/* ------------------------------------------------------------------ */

export type ReportingFilterKey =
  | "all"
  | "grid"
  | "dashboard"
  | "mixed"
  | "custom";

const FILTERS: Array<{
  key: ReportingFilterKey;
  label: string;
  dot?: string;
}> = [
  { key: "all", label: "T\u00FCm\u00FC" },
  { key: "grid", label: "Grid", dot: "bg-action-primary" },
  { key: "dashboard", label: "Dashboard", dot: "bg-state-info-text" },
  { key: "mixed", label: "Hibrit", dot: "bg-state-warning-text" },
  { key: "custom", label: "\u00D6zel", dot: "bg-state-success-text" },
];

type Props = {
  activeFilters: Set<ReportingFilterKey>;
  onChange: (filters: Set<ReportingFilterKey>) => void;
  className?: string;
};

export const ReportingFilterBar: React.FC<Props> = ({
  activeFilters,
  onChange,
  className,
}) => {
  const toggle = useCallback(
    (key: ReportingFilterKey) => {
      if (key === "all") {
        onChange(new Set(["all"]));
        return;
      }

      const next = new Set(activeFilters);
      next.delete("all");

      if (next.has(key)) {
        next.delete(key);
        if (next.size === 0) next.add("all");
      } else {
        next.add(key);
      }

      onChange(next);
    },
    [activeFilters, onChange],
  );

  return (
    <div
      className={`flex flex-wrap gap-1 px-3 py-1.5 ${className ?? ""}`}
      role="toolbar"
      aria-label="Rapor tipi filtresi"
    >
      {FILTERS.map(({ key, label, dot }) => {
        const isActive = activeFilters.has(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-pressed={isActive}
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
              transition-colors cursor-pointer select-none
              ${
                isActive
                  ? "bg-action-primary text-action-primary-text"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-canvas hover:text-text-primary"
              }
            `}
          >
            {dot && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-surface-default" : dot}`}
                aria-hidden
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
};

ReportingFilterBar.displayName = "ReportingFilterBar";

/* ------------------------------------------------------------------ */
/*  Filter logic helper                                                */
/* ------------------------------------------------------------------ */

export function useReportingFilterState() {
  const [filters, setFilters] = useState<Set<ReportingFilterKey>>(
    () => new Set(["all"]),
  );

  const matches = useCallback(
    (item: CatalogItemLike) => {
      if (filters.has("all")) return true;

      for (const f of filters) {
        if (f === "grid" && item.type === "grid") return true;
        if (f === "dashboard" && item.type === "dashboard") return true;
        if (f === "mixed" && item.type === "mixed") return true;
        if (f === "custom" && item.source === "dynamic") return true;
      }

      return false;
    },
    [filters],
  );

  return useMemo(
    () => ({ filters, setFilters, matches }),
    [filters, setFilters, matches],
  );
}
