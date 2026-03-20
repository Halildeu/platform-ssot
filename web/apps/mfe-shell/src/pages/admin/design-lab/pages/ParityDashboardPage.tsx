import React, { useState, useMemo } from "react";
import { Target, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Trophy } from "lucide-react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  ParityDashboardPage — Feature parity matrix vs competitors          */
/*                                                                     */
/*  Rows: Feature categories                                           */
/*  Cols: Our DS, MUI, AntD, Storybook, Shadcn                        */
/*  Cells: green (parity+), yellow (partial), red (gap)                */
/*  Overall score per competitor                                       */
/*                                                                     */
/*  Unique feature — self-improvement dashboard                        */
/* ------------------------------------------------------------------ */

type ParityStatus = "ahead" | "parity" | "partial" | "gap";

type CompetitorId = "mui" | "antd" | "storybook" | "shadcn";

type FeatureRow = {
  category: string;
  feature: string;
  ours: ParityStatus;
  competitors: Record<CompetitorId, ParityStatus>;
};

const COMPETITORS: { id: CompetitorId; name: string; color: string }[] = [
  { id: "mui", name: "MUI", color: "#007FFF" },
  { id: "antd", name: "Ant Design", color: "#1677ff" },
  { id: "storybook", name: "Storybook", color: "#FF4785" },
  { id: "shadcn", name: "Shadcn/ui", color: "#000000" },
];

const STATUS_META: Record<ParityStatus, { label: string; color: string; bg: string; icon: React.ReactNode; score: number }> = {
  ahead: { label: "Ahead", color: "text-emerald-600", bg: "bg-emerald-100", icon: <Trophy className="h-3 w-3" />, score: 3 },
  parity: { label: "Parity", color: "text-blue-600", bg: "bg-blue-100", icon: <CheckCircle2 className="h-3 w-3" />, score: 2 },
  partial: { label: "Partial", color: "text-amber-600", bg: "bg-amber-100", icon: <AlertTriangle className="h-3 w-3" />, score: 1 },
  gap: { label: "Gap", color: "text-red-600", bg: "bg-red-100", icon: <XCircle className="h-3 w-3" />, score: 0 },
};

const FEATURES: FeatureRow[] = [
  // Playground
  { category: "Playground", feature: "Interactive prop editor", ours: "ahead", competitors: { mui: "partial", antd: "partial", storybook: "parity", shadcn: "gap" } },
  { category: "Playground", feature: "Event logger (Actions)", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "parity", shadcn: "gap" } },
  { category: "Playground", feature: "Responsive multi-viewport", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "partial", shadcn: "gap" } },
  { category: "Playground", feature: "Measure & outline tools", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "parity", shadcn: "gap" } },
  { category: "Playground", feature: "Performance profiler", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "gap", shadcn: "gap" } },
  { category: "Playground", feature: "Composition/slot editor", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "gap", shadcn: "gap" } },

  // Documentation
  { category: "Documentation", feature: "Narrative guide (When to Use)", ours: "ahead", competitors: { mui: "partial", antd: "parity", storybook: "partial", shadcn: "partial" } },
  { category: "Documentation", feature: "Component anatomy diagram", ours: "parity", competitors: { mui: "parity", antd: "partial", storybook: "gap", shadcn: "gap" } },
  { category: "Documentation", feature: "Anti-patterns section", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "gap", shadcn: "gap" } },
  { category: "Documentation", feature: "Migration guides", ours: "ahead", competitors: { mui: "partial", antd: "partial", storybook: "gap", shadcn: "gap" } },
  { category: "Documentation", feature: "Curated code examples", ours: "parity", competitors: { mui: "parity", antd: "parity", storybook: "parity", shadcn: "parity" } },

  // API
  { category: "API", feature: "Rich props table", ours: "ahead", competitors: { mui: "parity", antd: "parity", storybook: "parity", shadcn: "partial" } },
  { category: "API", feature: "Props dependency graph", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "gap", shadcn: "gap" } },
  { category: "API", feature: "Design token documentation", ours: "ahead", competitors: { mui: "partial", antd: "parity", storybook: "gap", shadcn: "gap" } },
  { category: "API", feature: "View component source", ours: "parity", competitors: { mui: "partial", antd: "gap", storybook: "partial", shadcn: "parity" } },

  // Theming
  { category: "Theming", feature: "Multi-theme preview", ours: "ahead", competitors: { mui: "partial", antd: "partial", storybook: "partial", shadcn: "gap" } },
  { category: "Theming", feature: "Theme builder UI", ours: "parity", competitors: { mui: "gap", antd: "gap", storybook: "gap", shadcn: "gap" } },
  { category: "Theming", feature: "Theming documentation", ours: "parity", competitors: { mui: "parity", antd: "parity", storybook: "partial", shadcn: "partial" } },
  { category: "Theming", feature: "Token override generator", ours: "ahead", competitors: { mui: "gap", antd: "partial", storybook: "gap", shadcn: "gap" } },

  // Accessibility
  { category: "Accessibility", feature: "A11y scorecard", ours: "parity", competitors: { mui: "partial", antd: "partial", storybook: "parity", shadcn: "gap" } },
  { category: "Accessibility", feature: "Live a11y audit", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "parity", shadcn: "gap" } },
  { category: "Accessibility", feature: "WCAG guideline links", ours: "parity", competitors: { mui: "parity", antd: "partial", storybook: "parity", shadcn: "partial" } },

  // Developer Experience
  { category: "DX", feature: "⌘K command palette", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "partial", shadcn: "gap" } },
  { category: "DX", feature: "Dependency graph", ours: "ahead", competitors: { mui: "gap", antd: "gap", storybook: "gap", shadcn: "gap" } },
  { category: "DX", feature: "Usage analytics", ours: "parity", competitors: { mui: "gap", antd: "gap", storybook: "partial", shadcn: "gap" } },
  { category: "DX", feature: "Visual regression", ours: "parity", competitors: { mui: "gap", antd: "gap", storybook: "parity", shadcn: "gap" } },
  { category: "DX", feature: "Figma token sync", ours: "parity", competitors: { mui: "partial", antd: "gap", storybook: "partial", shadcn: "gap" } },
];

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
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = useMemo(() => Array.from(new Set(FEATURES.map((f) => f.category))), []);

  const filtered = useMemo(
    () => filterCategory === "all" ? FEATURES : FEATURES.filter((f) => f.category === filterCategory),
    [filterCategory],
  );

  // Calculate scores
  const maxScore = FEATURES.length * 3;
  const ourScore = FEATURES.reduce((s, f) => s + STATUS_META[f.ours].score, 0);
  const competitorScores = COMPETITORS.map((c) => ({
    ...c,
    score: FEATURES.reduce((s, f) => s + STATUS_META[f.competitors[c.id]].score, 0),
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20">
          <Target className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <Text as="h1" className="text-xl font-bold text-text-primary">Feature Parity Dashboard</Text>
          <Text variant="secondary" className="text-sm">
            Design Lab vs MUI, AntD, Storybook, Shadcn — {FEATURES.length} features tracked
          </Text>
        </div>
      </div>

      {/* Score rings */}
      <div className="flex items-center gap-6 rounded-2xl border border-border-subtle bg-surface-default p-5">
        <div className="text-center">
          <ProgressRing score={ourScore} max={maxScore} size={70} color="#22c55e" />
          <Text as="div" className="mt-1 text-xs font-bold text-text-primary">Our DS</Text>
        </div>
        <div className="h-12 w-px bg-border-subtle" />
        {competitorScores.map((c) => (
          <div key={c.id} className="text-center">
            <ProgressRing score={c.score} max={maxScore} size={60} color={c.color} />
            <Text as="div" className="mt-1 text-[10px] font-medium text-text-secondary">{c.name}</Text>
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
          All ({FEATURES.length})
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

      {/* Feature matrix table */}
      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-canvas text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              <th className="px-4 py-3 text-left">Feature</th>
              <th className="px-3 py-3 text-center">Our DS</th>
              {COMPETITORS.map((c) => (
                <th key={c.id} className="px-3 py-3 text-center">{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} className="border-t border-border-subtle hover:bg-surface-muted/30 transition">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[9px] font-medium text-text-tertiary">{row.category}</span>
                    <Text className="text-xs text-text-primary">{row.feature}</Text>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <StatusCell status={row.ours} />
                </td>
                {COMPETITORS.map((c) => (
                  <td key={c.id} className="px-3 py-2.5 text-center">
                    <StatusCell status={row.competitors[c.id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusCell({ status }: { status: ParityStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
      {meta.icon} {meta.label}
    </span>
  );
}
