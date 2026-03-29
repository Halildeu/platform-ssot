/**
 * Consumer compatibility heatmap
 * Shows which apps use which components, with health indicators
 *
 * Rows: components (top 30 most used)
 * Columns: apps (mfe-shell, mfe-suggestions, etc.)
 * Cells: usage count + health color
 */

import React, { useMemo, useState } from "react";
import { Text } from "@mfe/design-system";
import { ArrowUpDown } from "lucide-react";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const KNOWN_APPS = [
  "mfe-shell",
  "mfe-suggestions",
  "mfe-reports",
  "mfe-settings",
  "mfe-crm",
  "mfe-hr",
  "mfe-finance",
];

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type SortKey = "name" | "total";

interface HeatmapRow {
  name: string;
  lifecycle: string;
  total: number;
  appUsage: Record<string, number>;
}

/* ------------------------------------------------------------------ */
/*  Cell color                                                          */
/* ------------------------------------------------------------------ */

function cellColor(count: number, lifecycle: string): string {
  if (count === 0) return "bg-surface-canvas text-text-secondary/30";

  // Red if lifecycle is planned but in use (breaking risk)
  if (lifecycle === "planned" && count > 0) {
    return "bg-state-danger-bg text-state-danger-text";
  }

  // Yellow if beta
  if (lifecycle === "beta") {
    return count > 2
      ? "bg-state-warning-bg text-state-warning-text"
      : "bg-state-warning-bg text-state-warning-text";
  }

  // Green for stable
  if (count >= 3) return "bg-state-success-bg text-state-success-text";
  if (count >= 1) return "bg-state-success-bg text-state-success-text";

  return "bg-surface-canvas text-text-secondary";
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function ConsumerHeatmap() {
  const { index } = useDesignLab();
  const [sortKey, setSortKey] = useState<SortKey>("total");

  // Detect which apps actually appear in whereUsed
  const activeApps = useMemo(() => {
    const appSet = new Set<string>();
    for (const item of index.items) {
      for (const w of item.whereUsed ?? []) {
        for (const app of KNOWN_APPS) {
          if (w.toLowerCase().includes(app)) {
            appSet.add(app);
          }
        }
      }
    }
    // Always show at least the known apps
    return KNOWN_APPS.filter((a) => appSet.has(a) || true);
  }, [index.items]);

  // Build heatmap rows
  const rows = useMemo<HeatmapRow[]>(() => {
    return index.items
      .filter((i) => i.availability === "exported")
      .map((item) => {
        const appUsage: Record<string, number> = {};
        for (const app of activeApps) {
          appUsage[app] = 0;
        }

        for (const w of item.whereUsed ?? []) {
          const lower = w.toLowerCase();
          for (const app of activeApps) {
            if (lower.includes(app)) {
              appUsage[app] = (appUsage[app] ?? 0) + 1;
            }
          }
        }

        const total = Object.values(appUsage).reduce((s, v) => s + v, 0);

        return {
          name: item.name,
          lifecycle: item.lifecycle,
          total,
          appUsage,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 30);
  }, [index.items, activeApps]);

  // Sort
  const sortedRows = useMemo(() => {
    const sorted = [...rows];
    if (sortKey === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => b.total - a.total);
    }
    return sorted;
  }, [rows, sortKey]);

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-sm font-semibold text-text-primary">
            Consumer Uyumluluk Heatmap
          </Text>
          <Text variant="secondary" className="text-xs">
            En cok kullanilan {sortedRows.length} component x app matrisi
          </Text>
        </div>
        <button
          type="button"
          onClick={() => setSortKey(sortKey === "total" ? "name" : "total")}
          className="flex items-center gap-1 rounded-lg bg-surface-canvas px-2.5 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-surface-muted"
        >
          <ArrowUpDown className="h-3 w-3" />
          {sortKey === "total" ? "Kullanima gore" : "Isme gore"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-xs bg-state-success-bg" />
          <Text className="text-[10px] text-text-secondary">Stable + kullaniliyor</Text>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-xs bg-state-warning-bg" />
          <Text className="text-[10px] text-text-secondary">Beta</Text>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-xs bg-state-danger-bg" />
          <Text className="text-[10px] text-text-secondary">Breaking risk</Text>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-xs bg-surface-canvas" />
          <Text className="text-[10px] text-text-secondary">Kullanilmiyor</Text>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-canvas">
              <th className="sticky left-0 z-10 bg-surface-canvas px-3 py-2 text-left font-medium text-text-secondary">
                Component
              </th>
              {activeApps.map((app) => (
                <th
                  key={app}
                  className="px-2 py-2 text-center font-medium text-text-secondary"
                  style={{ minWidth: 72 }}
                >
                  {app.replace("mfe-", "")}
                </th>
              ))}
              <th className="px-2 py-2 text-center font-semibold text-text-primary">
                Toplam
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr
                key={row.name}
                className="border-t border-border-subtle hover:bg-surface-canvas/50"
              >
                <td className="sticky left-0 z-10 bg-surface-default px-3 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Text className="truncate font-medium text-text-primary" style={{ maxWidth: 160 }}>
                      {row.name}
                    </Text>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                        row.lifecycle === "stable"
                          ? "bg-state-success-bg text-state-success-text"
                          : row.lifecycle === "beta"
                            ? "bg-state-warning-bg text-state-warning-text"
                            : "bg-surface-muted text-text-secondary"
                      }`}
                    >
                      {row.lifecycle}
                    </span>
                  </div>
                </td>
                {activeApps.map((app) => {
                  const count = row.appUsage[app] ?? 0;
                  return (
                    <td key={app} className="px-1 py-1 text-center">
                      <span
                        className={`inline-flex h-7 w-full items-center justify-center rounded-xs text-[11px] font-semibold tabular-nums ${cellColor(count, row.lifecycle)}`}
                      >
                        {count > 0 ? count : "-"}
                      </span>
                    </td>
                  );
                })}
                <td className="px-2 py-1.5 text-center font-bold text-text-primary">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedRows.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-border-subtle bg-surface-canvas p-8">
          <Text variant="secondary" className="text-sm">
            Heatmap verisi henuz mevcut degil
          </Text>
        </div>
      )}
    </div>
  );
}
