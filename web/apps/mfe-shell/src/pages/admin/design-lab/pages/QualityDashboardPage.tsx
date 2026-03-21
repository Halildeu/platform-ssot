import React, { useMemo, useState } from "react";
import {
  Shield,
  Award,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  XCircle,
  ArrowDown,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabIndexItem } from "../DesignLabProvider";
import {
  QualityBadge,
  getQualityTier,
  countByTier,
} from "../components/QualityBadge";
import type { QualityTier } from "../components/QualityBadge";
import {
  PackageQualityScore,
} from "../components/PackageQualityScore";
import type { ComponentScoreEntry } from "../components/PackageQualityScore";
import { hasGuide } from "../docs/guideRegistry";
import { hasTokens } from "../tabs/componentTokenMap";
import { hasExamples } from "../examples/registry";
import { hasPlayground } from "../playground";

/* ------------------------------------------------------------------ */
/*  QualityDashboardPage                                               */
/*                                                                     */
/*  Platform-wide quality overview with:                               */
/*  - Overall quality score + tier                                     */
/*  - Per-package quality breakdown                                    */
/*  - Tier distribution chart                                          */
/*  - Bottom-10 lowest-scoring components                              */
/*  - Quality gates status                                             */
/* ------------------------------------------------------------------ */

/* ---- Quality gate definitions ---- */

const QUALITY_GATES = [
  { key: "design_tokens", label: "Design Tokens", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "a11y_keyboard_support", label: "Keyboard A11y", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "ux_catalog_alignment", label: "UX Catalog", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
] as const;

/* ---- Package grouping ---- */

const PACKAGE_PREFIXES: { name: string; match: (item: DesignLabIndexItem) => boolean }[] = [
  {
    name: "x-data-grid",
    match: (i) =>
      i.name.includes("DataGrid") ||
      i.name.includes("Grid") ||
      i.name === "EntityGrid" ||
      i.name === "AgGridServer",
  },
  {
    name: "x-charts",
    match: (i) =>
      i.name.includes("Chart") ||
      i.name.includes("Sparkline") ||
      i.name.includes("KPI") ||
      i.name.includes("Gauge") ||
      i.name.includes("Stat"),
  },
  {
    name: "x-scheduler",
    match: (i) =>
      i.name.includes("Scheduler") || i.name.includes("Agenda") || i.name.includes("ResourceView"),
  },
  {
    name: "x-kanban",
    match: (i) => i.name.includes("Kanban"),
  },
  {
    name: "x-editor",
    match: (i) =>
      i.name.includes("Editor") ||
      i.name.includes("SlashCommand") ||
      i.name.includes("MentionList"),
  },
  {
    name: "x-form-builder",
    match: (i) =>
      i.name.includes("FormRenderer") ||
      i.name.includes("FieldRenderer") ||
      i.name.includes("FormPreview") ||
      i.name.includes("MultiStepForm") ||
      i.name.includes("FormSummary") ||
      i.name.includes("RepeatableField") ||
      i.name.includes("FieldRegistry"),
  },
  {
    name: "core",
    match: () => true, // fallback
  },
];

function assignPackage(item: DesignLabIndexItem): string {
  for (const pkg of PACKAGE_PREFIXES) {
    if (pkg.name === "core") continue;
    if (pkg.match(item)) return pkg.name;
  }
  return "core";
}

/* ---- Score computation ---- */

function computeComponentScore(item: DesignLabIndexItem): {
  a11yScore: number;
  qualityScore: number;
  combined: number;
} {
  // A11y score based on quality gates and props
  const a11yChecks = [
    item.qualityGates.includes("design_tokens"),
    item.qualityGates.includes("a11y_keyboard_support"),
    item.qualityGates.length >= 2,
  ];
  const a11yScore = Math.round(
    (a11yChecks.filter(Boolean).length / a11yChecks.length) * 100,
  );

  // Quality checklist score based on coverage
  const key = item.name;
  const qualityChecks = [
    hasGuide(key) || hasGuide(item.name),
    hasTokens(key) || hasTokens(item.name),
    hasExamples(key) || hasExamples(item.name),
    hasPlayground(key) || hasPlayground(item.name),
    item.qualityGates.includes("ux_catalog_alignment"),
    item.lifecycle === "stable",
    item.qualityGates.length >= 3,
  ];
  const qualityScore = Math.round(
    (qualityChecks.filter(Boolean).length / qualityChecks.length) * 100,
  );

  const combined = Math.round(a11yScore * 0.4 + qualityScore * 0.6);

  return { a11yScore, qualityScore, combined };
}

/* ---- Tier colors for the distribution chart ---- */

const TIER_DISPLAY: Record<
  QualityTier,
  { label: string; color: string; bg: string; barBg: string }
> = {
  platinum: { label: "Platinum", color: "text-indigo-600", bg: "bg-indigo-100", barBg: "bg-indigo-500" },
  gold: { label: "Gold", color: "text-amber-700", bg: "bg-amber-100", barBg: "bg-amber-500" },
  silver: { label: "Silver", color: "text-zinc-600", bg: "bg-zinc-100", barBg: "bg-zinc-400" },
  bronze: { label: "Bronze", color: "text-orange-700", bg: "bg-orange-100", barBg: "bg-orange-500" },
};

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function QualityDashboardPage() {
  const { index } = useDesignLab();
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  /* ---- Compute all scores ---- */
  const scoredComponents = useMemo(() => {
    return index.items
      .filter(
        (item) =>
          item.availability === "exported" && item.kind === "component",
      )
      .map((item) => ({
        item,
        pkg: assignPackage(item),
        ...computeComponentScore(item),
      }));
  }, [index]);

  /* ---- Aggregate metrics ---- */
  const overallScore = useMemo(() => {
    if (scoredComponents.length === 0) return 0;
    return Math.round(
      scoredComponents.reduce((s, c) => s + c.combined, 0) /
        scoredComponents.length,
    );
  }, [scoredComponents]);

  const tierDistribution = useMemo(
    () => countByTier(scoredComponents.map((c) => c.combined)),
    [scoredComponents],
  );

  /* ---- Per-package data ---- */
  const packageData = useMemo(() => {
    const map = new Map<string, ComponentScoreEntry[]>();
    for (const comp of scoredComponents) {
      if (!map.has(comp.pkg)) map.set(comp.pkg, []);
      map.get(comp.pkg)!.push({
        name: comp.item.name,
        a11yScore: comp.a11yScore,
        qualityScore: comp.qualityScore,
      });
    }
    return Array.from(map.entries())
      .map(([name, components]) => ({
        name,
        components,
        avgScore: Math.round(
          components.reduce(
            (s, c) => s + Math.round(c.a11yScore * 0.4 + c.qualityScore * 0.6),
            0,
          ) / components.length,
        ),
      }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [scoredComponents]);

  /* ---- Bottom 10 ---- */
  const bottom10 = useMemo(() => {
    return [...scoredComponents]
      .sort((a, b) => a.combined - b.combined)
      .slice(0, 10);
  }, [scoredComponents]);

  /* ---- Quality gates summary ---- */
  const gateStats = useMemo(() => {
    const total = scoredComponents.length;
    return QUALITY_GATES.map((gate) => {
      const passing = scoredComponents.filter((c) =>
        c.item.qualityGates.includes(gate.key),
      ).length;
      return {
        ...gate,
        passing,
        total,
        pct: total > 0 ? Math.round((passing / total) * 100) : 0,
      };
    });
  }, [scoredComponents]);

  /* ---- Max tier count for chart bar scaling ---- */
  const maxTierCount = Math.max(
    ...Object.values(tierDistribution),
    1,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
          <Award className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <Text as="h1" className="text-xl font-bold text-text-primary">
            Quality Dashboard
          </Text>
          <Text variant="secondary" className="text-sm">
            {scoredComponents.length} components scored across{" "}
            {packageData.length} packages
          </Text>
        </div>
      </div>

      {/* ─── Top KPI Row ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Score */}
        <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-indigo-500/5 to-transparent p-5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" />
            <Text variant="secondary" className="text-xs font-medium">
              Platform Quality
            </Text>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <Text
              as="div"
              className="text-3xl font-bold tabular-nums text-text-primary"
            >
              {overallScore}%
            </Text>
            <QualityBadge score={overallScore} size="sm" />
          </div>
        </div>

        {/* Tier counts */}
        {(["platinum", "gold", "silver", "bronze"] as QualityTier[]).map(
          (tier) => {
            const d = TIER_DISPLAY[tier];
            return (
              <div
                key={tier}
                className={`rounded-2xl border border-border-subtle ${d.bg}/40 p-5`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${d.barBg}`}
                  />
                  <Text
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {d.label}
                  </Text>
                </div>
                <Text
                  as="div"
                  className={`mt-2 text-2xl font-bold tabular-nums ${d.color}`}
                >
                  {tierDistribution[tier]}
                </Text>
                <Text variant="secondary" className="text-[10px]">
                  component{tierDistribution[tier] !== 1 ? "s" : ""}
                </Text>
              </div>
            );
          },
        )}
      </div>

      {/* ─── Tier Distribution Bar Chart ─── */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="mb-4 text-sm font-semibold text-text-primary">
          <BarChart3 className="mr-2 inline h-4 w-4 text-text-secondary" />
          Quality Distribution
        </Text>
        <div className="flex items-end gap-3" style={{ height: 120 }}>
          {(["platinum", "gold", "silver", "bronze"] as QualityTier[]).map(
            (tier) => {
              const count = tierDistribution[tier];
              const heightPct =
                maxTierCount > 0 ? (count / maxTierCount) * 100 : 0;
              const d = TIER_DISPLAY[tier];
              return (
                <div
                  key={tier}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <Text className="text-xs font-semibold tabular-nums text-text-primary">
                    {count}
                  </Text>
                  <div className="flex w-full justify-center" style={{ height: 80 }}>
                    <div
                      className={`w-10 rounded-t-lg ${d.barBg} transition-all duration-500`}
                      style={{
                        height: `${heightPct}%`,
                        minHeight: count > 0 ? 4 : 0,
                        alignSelf: "flex-end",
                      }}
                    />
                  </div>
                  <Text
                    variant="secondary"
                    className="text-[10px] font-medium"
                  >
                    {d.label}
                  </Text>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* ─── Quality Gates Status ─── */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="mb-4 text-sm font-semibold text-text-primary">
          <CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-500" />
          Quality Gates
        </Text>
        <div className="grid gap-4 sm:grid-cols-3">
          {gateStats.map((gate) => (
            <div
              key={gate.key}
              className="rounded-xl border border-border-subtle bg-surface-canvas/50 p-4"
            >
              <div className="flex items-center justify-between">
                <Text className="text-xs font-medium text-text-primary">
                  {gate.label}
                </Text>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    gate.pct >= 80
                      ? "bg-emerald-100 text-emerald-700"
                      : gate.pct >= 50
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {gate.pct}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    gate.pct >= 80
                      ? "bg-emerald-500"
                      : gate.pct >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${gate.pct}%` }}
                />
              </div>
              <Text variant="secondary" className="mt-1.5 text-[10px] tabular-nums">
                {gate.passing}/{gate.total} passing
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Per-Package Scores ─── */}
      <div>
        <Text as="div" className="mb-4 text-sm font-semibold text-text-primary">
          <TrendingUp className="mr-2 inline h-4 w-4 text-text-secondary" />
          Package Quality Scores
        </Text>
        <div className="grid gap-4 lg:grid-cols-2">
          {packageData.map((pkg) => (
            <PackageQualityScore
              key={pkg.name}
              packageName={pkg.name}
              components={pkg.components}
            />
          ))}
        </div>
      </div>

      {/* ─── Bottom 10 Components ─── */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default">
        <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-4">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            Bottom 10 — Lowest Quality Scores
          </Text>
        </div>
        <div className="divide-y divide-border-subtle/50">
          {bottom10.map((comp, idx) => (
            <div
              key={comp.item.name}
              className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-canvas/30"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Text className="text-sm font-medium text-text-primary">
                  {comp.item.name}
                </Text>
                <Text variant="secondary" className="text-[10px]">
                  {comp.pkg} &middot; {comp.item.lifecycle}
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <Text className="text-[10px] tabular-nums text-text-secondary">
                  a11y {comp.a11yScore}%
                </Text>
                <Text className="text-[10px] tabular-nums text-text-secondary">
                  quality {comp.qualityScore}%
                </Text>
                <QualityBadge score={comp.combined} size="sm" />
              </div>
            </div>
          ))}
          {bottom10.length === 0 && (
            <div className="px-5 py-8 text-center">
              <Text variant="secondary" className="text-sm">
                No components to display.
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/50 px-4 py-3">
        <Text variant="secondary" className="text-sm">
          {scoredComponents.length} components scored
        </Text>
        <Text variant="secondary" className="text-sm">
          Platform quality:{" "}
          <span className="font-semibold text-text-primary">
            {overallScore}%
          </span>{" "}
          ({getQualityTier(overallScore)})
        </Text>
      </div>
    </div>
  );
}
