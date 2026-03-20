import React, { useMemo, useState } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  FileQuestion,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { AdoptionHeatmap, TrendSparkline } from "../insights/AdoptionHeatmap";
import {
  getAdoptionData,
  getTopRising,
  getTopDeclining,
  getUndocumentedBacklog,
  CONSUMER_APPS,
} from "../insights/insightsUtils";
import type { AdoptionEntry } from "../insights/insightsUtils";

/* ------------------------------------------------------------------ */
/*  InsightsDashboardPage — Component adoption metrics & trends        */
/*                                                                     */
/*  Sections:                                                          */
/*  1. Summary cards (total, documented, rising, declining)            */
/*  2. Adoption heatmap (component × app)                              */
/*  3. Rising / Declining lists with sparklines                        */
/*  4. Undocumented backlog with priority scores                       */
/* ------------------------------------------------------------------ */

type ViewMode = "heatmap" | "table";

const STATUS_ICON: Record<string, React.ReactNode> = {
  rising: <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />,
  declining: <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />,
  stable: <Minus className="h-3.5 w-3.5 text-[var(--text-subtle)]" />,
};

const STATUS_BADGE: Record<string, string> = {
  rising: "bg-emerald-100 text-emerald-700",
  declining: "bg-red-100 text-red-700",
  stable: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
};

export default function InsightsDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");
  const [searchQuery, setSearchQuery] = useState("");

  const data = useMemo(() => getAdoptionData(), []);
  const rising = useMemo(() => getTopRising(data), [data]);
  const declining = useMemo(() => getTopDeclining(data), [data]);
  const backlog = useMemo(() => getUndocumentedBacklog(data), [data]);

  const documented = data.filter((d) => d.documented).length;
  const totalApps = CONSUMER_APPS.length;
  const avgAdoption = Math.round(
    data.reduce((sum, d) => sum + Object.values(d.apps).filter(Boolean).length, 0) / data.length * 100 / totalApps,
  );

  const filtered = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((d) => d.component.toLowerCase().includes(q));
  }, [data, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
          <Activity className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <Text as="h1" className="text-xl font-bold text-text-primary">Adoption Insights</Text>
          <Text variant="secondary" className="text-sm">
            {data.length} components tracked across {totalApps} consumer apps
          </Text>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Components"
          value={data.length}
          icon={<BarChart3 className="h-4 w-4 text-indigo-500" />}
          color="bg-indigo-50"
        />
        <SummaryCard
          label="Documented"
          value={`${documented}/${data.length}`}
          sub={`${Math.round((documented / data.length) * 100)}%`}
          icon={<FileQuestion className="h-4 w-4 text-amber-500" />}
          color="bg-amber-50"
        />
        <SummaryCard
          label="Rising"
          value={rising.length}
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          color="bg-emerald-50"
        />
        <SummaryCard
          label="Avg Adoption"
          value={`${avgAdoption}%`}
          sub={`across ${totalApps} apps`}
          icon={<Activity className="h-4 w-4 text-violet-500" />}
          color="bg-violet-50"
        />
      </div>

      {/* Heatmap / Table toggle + search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1">
          {(["heatmap", "table"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                viewMode === mode
                  ? "bg-action-primary text-white"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {mode === "heatmap" ? "Heatmap" : "Table"}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter components..."
          className="rounded-lg border border-border-subtle bg-surface-default px-3 py-1.5 text-xs outline-none focus:border-action-primary"
        />
      </div>

      {/* Main Content */}
      {viewMode === "heatmap" ? (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface-default p-4">
          <AdoptionHeatmap data={filtered} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-canvas text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="px-4 py-3 text-left">Component</th>
                <th className="px-3 py-3 text-center">Apps</th>
                <th className="px-3 py-3 text-center">Trend</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-center">Documented</th>
                <th className="px-3 py-3 text-center">Priority</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.component} className="border-t border-border-subtle hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-2.5">
                    <Text className="text-xs font-medium text-text-primary">{entry.component}</Text>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Text className="text-xs text-text-secondary">
                      {Object.values(entry.apps).filter(Boolean).length}/{totalApps}
                    </Text>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <TrendSparkline data={entry.weeklyTrend} status={entry.status} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[entry.status]}`}>
                      {STATUS_ICON[entry.status]} {entry.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {entry.documented ? (
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    ) : (
                      <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <PriorityBar value={entry.priority} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom panels: Rising, Declining, Backlog */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Rising */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <Text as="h3" className="text-sm font-semibold text-text-primary">Rising</Text>
          </div>
          <div className="space-y-2">
            {rising.map((entry) => (
              <div key={entry.component} className="flex items-center justify-between rounded-lg bg-surface-canvas px-3 py-2">
                <Text className="text-xs font-medium text-text-primary">{entry.component}</Text>
                <TrendSparkline data={entry.weeklyTrend} status={entry.status} />
              </div>
            ))}
            {rising.length === 0 && (
              <Text variant="secondary" className="text-xs">No rising components</Text>
            )}
          </div>
        </div>

        {/* Declining */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <Text as="h3" className="text-sm font-semibold text-text-primary">Declining</Text>
          </div>
          <div className="space-y-2">
            {declining.map((entry) => (
              <div key={entry.component} className="flex items-center justify-between rounded-lg bg-surface-canvas px-3 py-2">
                <Text className="text-xs font-medium text-text-primary">{entry.component}</Text>
                <TrendSparkline data={entry.weeklyTrend} status={entry.status} />
              </div>
            ))}
            {declining.length === 0 && (
              <Text variant="secondary" className="text-xs">No declining components</Text>
            )}
          </div>
        </div>

        {/* Undocumented Backlog */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <Text as="h3" className="text-sm font-semibold text-text-primary">Undocumented</Text>
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {backlog.length}
            </span>
          </div>
          <div className="space-y-2">
            {backlog.slice(0, 6).map((entry) => (
              <div key={entry.component} className="flex items-center justify-between rounded-lg bg-surface-canvas px-3 py-2">
                <div>
                  <Text className="text-xs font-medium text-text-primary">{entry.component}</Text>
                  <Text variant="secondary" className="text-[10px]">
                    {Object.values(entry.apps).filter(Boolean).length} apps
                  </Text>
                </div>
                <PriorityBar value={entry.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function SummaryCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>{icon}</div>
        <Text variant="secondary" className="text-[11px] font-medium">{label}</Text>
      </div>
      <div className="flex items-baseline gap-1.5">
        <Text as="div" className="text-2xl font-bold text-text-primary">{value}</Text>
        {sub && <Text variant="secondary" className="text-xs">{sub}</Text>}
      </div>
    </div>
  );
}

function PriorityBar({ value }: { value: number }) {
  const color = value >= 70 ? "bg-red-400" : value >= 40 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <Text className="text-[10px] text-text-tertiary">{value}</Text>
    </div>
  );
}
