import React, { useState, useMemo } from "react";
import { Target, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabComponentDocEntry } from "../DesignLabProvider";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";

/* ------------------------------------------------------------------ */
/*  ParityDashboardPage — Component quality parity derived from docs   */
/*                                                                     */
/*  For each component, checks presence of:                            */
/*  - props docs (apiItem.props.length > 0)                            */
/*  - stateModel (apiItem.stateModel)                                  */
/*  - variantAxes (apiItem.variantAxes)                                */
/*  - previewStates (apiItem.previewStates)                            */
/*  - behaviorModel (apiItem.behaviorModel)                            */
/*  - regressionFocus (apiItem.regressionFocus)                        */
/*                                                                     */
/*  All data is REAL — derived from actual doc entries.                 */
/* ------------------------------------------------------------------ */

type QualityDimension = "props" | "stateModel" | "variantAxes" | "previewStates" | "behaviorModel" | "regressionFocus";

const DIMENSIONS: { id: QualityDimension; label: string }[] = [
  { id: "props", label: "Props Docs" },
  { id: "stateModel", label: "State Model" },
  { id: "variantAxes", label: "Variant Axes" },
  { id: "previewStates", label: "Preview States" },
  { id: "behaviorModel", label: "Behavior Model" },
  { id: "regressionFocus", label: "Regression Focus" },
];

type ParityRow = {
  name: string;
  category: string;
  dimensions: Record<QualityDimension, boolean>;
  score: number; // 0-6
};

function deriveParityData(docEntryMap: Map<string, DesignLabComponentDocEntry>): ParityRow[] {
  const rows: ParityRow[] = [];

  for (const [name, entry] of docEntryMap) {
    const api = entry.apiItem;
    const idx = entry.indexItem;

    // Only include components (not hooks/functions/const)
    if (idx.kind !== "component") continue;

    const dims: Record<QualityDimension, boolean> = {
      props: (api?.props?.length ?? 0) > 0,
      stateModel: (api?.stateModel?.length ?? 0) > 0,
      variantAxes: (api?.variantAxes?.length ?? 0) > 0,
      previewStates: ((api as Record<string, unknown>)?.previewStates as string[] | undefined)?.length ? true : false,
      behaviorModel: ((api as Record<string, unknown>)?.behaviorModel as string[] | undefined)?.length ? true : false,
      regressionFocus: (api?.regressionFocus?.length ?? 0) > 0,
    };

    const score = Object.values(dims).filter(Boolean).length;

    rows.push({
      name,
      category: idx.taxonomyGroupId ?? "components",
      dimensions: dims,
      score,
    });
  }

  return rows.sort((a, b) => b.score - a.score);
}

/* ---- Progress Ring SVG ---- */

function ProgressRing({ score, max, size = 60, color }: { score: number; max: number; size?: number; color: string }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = max > 0 ? score / max : 0;
  const offset = circumference * (1 - percent);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-text-primary">{Math.round(percent * 100)}%</span>
    </div>
  );
}

export default function ParityDashboardPage() {
  const { docEntryMap } = useDesignLab();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const rows = useMemo(() => deriveParityData(docEntryMap), [docEntryMap]);
  const categories = useMemo(() => Array.from(new Set(rows.map((r) => r.category))).sort(), [rows]);
  const filtered = useMemo(
    () => filterCategory === "all" ? rows : rows.filter((r) => r.category === filterCategory),
    [filterCategory, rows],
  );

  const maxScore = DIMENSIONS.length; // 6
  const totalPossible = rows.length * maxScore;
  const totalAchieved = rows.reduce((s, r) => s + r.score, 0);

  // Per-dimension coverage
  const dimensionCoverage = DIMENSIONS.map((dim) => ({
    ...dim,
    count: rows.filter((r) => r.dimensions[dim.id]).length,
    pct: rows.length > 0 ? Math.round((rows.filter((r) => r.dimensions[dim.id]).length / rows.length) * 100) : 0,
  }));

  // Per-category coverage
  const categoryCoverage = categories.map((cat) => {
    const catRows = rows.filter((r) => r.category === cat);
    const catMax = catRows.length * maxScore;
    const catAchieved = catRows.reduce((s, r) => s + r.score, 0);
    return {
      category: cat,
      count: catRows.length,
      pct: catMax > 0 ? Math.round((catAchieved / catMax) * 100) : 0,
    };
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/20 to-blue-500/20">
          <Target className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text as="h1" className="text-xl font-bold text-text-primary">Bilesen Kalite Paritesi</Text>
            <DataProvenanceBadge level="derived" />
          </div>
          <Text variant="secondary" className="text-sm">
            {rows.length} bilesen, {DIMENSIONS.length} kalite boyutunda analiz ediliyor
          </Text>
        </div>
      </div>

      {/* Score summary */}
      <div className="flex items-center gap-6 rounded-2xl border border-border-subtle bg-surface-default p-5">
        <div className="text-center">
          <ProgressRing score={totalAchieved} max={totalPossible} size={70} color="#22c55e" />
          <Text as="div" className="mt-1 text-xs font-bold text-text-primary">Genel Puan</Text>
        </div>
        <div className="h-12 w-px bg-border-subtle" />
        {dimensionCoverage.map((dim) => (
          <div key={dim.id} className="text-center">
            <ProgressRing score={dim.count} max={rows.length} size={50} color={dim.pct >= 70 ? "#22c55e" : dim.pct >= 40 ? "#f59e0b" : "#ef4444"} />
            <Text as="div" className="mt-1 text-[10px] font-medium text-text-secondary">{dim.label}</Text>
          </div>
        ))}
      </div>

      {/* Category coverage summary */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categoryCoverage.map((cat) => (
          <div key={cat.category} className="rounded-2xl border border-border-subtle bg-surface-default p-4">
            <Text variant="secondary" className="text-[10px] font-medium uppercase tracking-wider">{cat.category}</Text>
            <Text className="mt-1 text-xl font-bold text-text-primary">{cat.pct}%</Text>
            <Text variant="secondary" className="text-[10px]">{cat.count} bilesen</Text>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setFilterCategory("all")}
          className={[
            "rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
            filterCategory === "all" ? "bg-action-primary text-white" : "bg-surface-muted text-text-secondary hover:text-text-primary",
          ].join(" ")}
        >
          Tumu ({rows.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={[
              "rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition",
              filterCategory === cat ? "bg-action-primary text-white" : "bg-surface-muted text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Parity matrix table */}
      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-canvas text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              <th className="px-4 py-3 text-left">Bilesen</th>
              {DIMENSIONS.map((dim) => (
                <th key={dim.id} className="px-3 py-3 text-center">{dim.label}</th>
              ))}
              <th className="px-3 py-3 text-center">Puan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.name} className="border-t border-border-subtle hover:bg-surface-muted/30 transition">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-[9px] font-medium text-text-tertiary">{row.category}</span>
                    <Text className="text-xs text-text-primary">{row.name}</Text>
                  </div>
                </td>
                {DIMENSIONS.map((dim) => (
                  <td key={dim.id} className="px-3 py-2.5 text-center">
                    {row.dimensions[dim.id] ? (
                      <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="mx-auto h-3.5 w-3.5 text-red-300" />
                    )}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    row.score >= 5 ? "bg-emerald-100 text-emerald-700" :
                    row.score >= 3 ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {row.score}/{maxScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Text variant="secondary" className="text-sm">Bu kategoride bilesen bulunamadi</Text>
        </div>
      )}
    </div>
  );
}
