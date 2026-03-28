import React, { useCallback, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  SidebarFilterBar — lifecycle/status toggle chips                    */
/*  [All] [stable ●] [beta ●] [planned ○] [has-demo]                  */
/* ------------------------------------------------------------------ */

export type FilterKey = "all" | "stable" | "beta" | "planned" | "has-demo";

const FILTERS: Array<{ key: FilterKey; label: string; dot?: string }> = [
  { key: "all", label: "All" },
  { key: "stable", label: "Stable", dot: "bg-state-success-text" },
  { key: "beta", label: "Beta", dot: "bg-state-warning-text" },
  { key: "planned", label: "Planned", dot: "bg-text-tertiary" },
  { key: "has-demo", label: "Demo" },
];

type Props = {
  activeFilters: Set<FilterKey>;
  onChange: (filters: Set<FilterKey>) => void;
  className?: string;
};

export const SidebarFilterBar: React.FC<Props> = ({
  activeFilters,
  onChange,
  className,
}) => {
  const toggle = useCallback(
    (key: FilterKey) => {
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
      aria-label="Filter components"
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
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : dot}`}
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

SidebarFilterBar.displayName = "SidebarFilterBar";

/* ------------------------------------------------------------------ */
/*  Filter logic helper                                                */
/* ------------------------------------------------------------------ */
export function useFilterState() {
  const [filters, setFilters] = useState<Set<FilterKey>>(
    () => new Set(["all"]),
  );

  const matches = useCallback(
    (item: { lifecycle?: string; demoMode?: string }) => {
      if (filters.has("all")) return true;

      for (const f of filters) {
        if (f === "stable" && item.lifecycle === "stable") return true;
        if (f === "beta" && item.lifecycle === "beta") return true;
        if (f === "planned" && item.lifecycle === "planned") return true;
        if (f === "has-demo" && item.demoMode === "live") return true;
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
