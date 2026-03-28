import React, { useMemo, useState } from "react";
import { Text } from "@mfe/design-system";
import { BarChart3, PieChart, TrendingUp, AlertTriangle } from "lucide-react";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  UsageAnalyticsPage — Component adoption & lifecycle analytics      */
/*                                                                     */
/*  Pure SVG charts — no chart library needed.                        */
/*  Shows: Top adopted, lifecycle distribution, layer coverage,        */
/*  and anomaly highlights (stable-unused, beta-high-adoption).        */
/* ------------------------------------------------------------------ */

/* ---- SVG Chart primitives ---- */

function HorizontalBarChart({
  data,
  maxValue,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  maxValue: number;
}) {
  const barHeight = 28;
  const gap = 6;
  const labelWidth = 140;
  const chartWidth = 400;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${labelWidth + chartWidth + 60} ${data.length * (barHeight + gap) + 10}`}
      className="max-h-[360px]"
    >
      {data.map((item, i) => {
        const y = i * (barHeight + gap) + 5;
        const barW = maxValue > 0 ? (item.value / maxValue) * chartWidth : 0;

        return (
          <g key={item.label}>
            <text x={labelWidth - 8} y={y + barHeight / 2 + 4} fontSize={11} textAnchor="end" fill="currentColor" className="text-text-secondary">
              {item.label.length > 18 ? `${item.label.slice(0, 16)}…` : item.label}
            </text>
            <rect x={labelWidth} y={y} width={barW} height={barHeight} rx={6} fill={item.color} opacity={0.85} />
            <text x={labelWidth + barW + 8} y={y + barHeight / 2 + 4} fontSize={11} fontWeight={600} fill="currentColor" className="text-text-primary">
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({
  segments,
  size = 200,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  size?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  const radius = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;
  let cumulativeAngle = -90;

  const paths = segments.map((seg) => {
    const angle = (seg.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const innerRadius = radius * 0.6;
    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const d = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return <path key={seg.label} d={d} fill={seg.color} opacity={0.85} />;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={24} fontWeight={700} fill="currentColor" className="text-text-primary">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill="currentColor" className="text-text-tertiary">
        total
      </text>
    </svg>
  );
}

/* ---- Stat card ---- */

function StatCard({
  icon,
  label,
  value,
  sub,
  color = "text-text-primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface-default p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-canvas text-text-secondary">
        {icon}
      </div>
      <div>
        <Text variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </Text>
        <Text as="div" className={`mt-0.5 text-xl font-bold ${color}`}>
          {value}
        </Text>
        {sub && (
          <Text variant="secondary" className="text-[10px]">
            {sub}
          </Text>
        )}
      </div>
    </div>
  );
}

/* ---- Highlight card ---- */

function HighlightCard({
  title,
  items,
  variant,
}: {
  title: string;
  items: Array<{ name: string; detail: string }>;
  variant: "warning" | "info";
}) {
  if (items.length === 0) return null;
  const bgColor = variant === "warning" ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200";
  const textColor = variant === "warning" ? "text-amber-800" : "text-blue-800";
  const iconColor = variant === "warning" ? "text-amber-500" : "text-blue-500";

  return (
    <div className={`rounded-2xl border p-4 ${bgColor}`}>
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className={`h-4 w-4 ${iconColor}`} />
        <Text as="div" className={`text-sm font-semibold ${textColor}`}>
          {title}
        </Text>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.slice(0, 5).map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <Text className={`text-xs font-medium ${textColor}`}>{item.name}</Text>
            <Text className={`text-[10px] ${textColor} opacity-70`}>{item.detail}</Text>
          </div>
        ))}
        {items.length > 5 && (
          <Text className={`text-[10px] ${textColor} opacity-60`}>
            +{items.length - 5} more
          </Text>
        )}
      </div>
    </div>
  );
}

/* ---- Main ---- */

type AnalyticsTab = "overview" | "adoption" | "lifecycle" | "layers";

export default function UsageAnalyticsPage() {
  const { index } = useDesignLab();
  const [tab, setTab] = useState<AnalyticsTab>("overview");
  const items = index?.items ?? [];

  /* ---- Computed analytics ---- */

  const analytics = useMemo(() => {
    const lifecycleCounts: Record<string, number> = {};
    const layerCounts: Record<string, number> = {};
    const kindCounts: Record<string, number> = {};
    const adoptionData: Array<{ name: string; usedBy: number; lifecycle: string }> = [];

    for (const item of items) {
      lifecycleCounts[item.lifecycle] = (lifecycleCounts[item.lifecycle] ?? 0) + 1;
      const layer = item.group || "other";
      layerCounts[layer] = (layerCounts[layer] ?? 0) + 1;
      kindCounts[item.kind] = (kindCounts[item.kind] ?? 0) + 1;

      const usedByCount = item.whereUsed?.length ?? 0;
      adoptionData.push({
        name: item.name,
        usedBy: usedByCount,
        lifecycle: item.lifecycle,
      });
    }

    // Sort by adoption (most used first)
    adoptionData.sort((a, b) => b.usedBy - a.usedBy);

    // Anomalies
    const stableUnused = adoptionData
      .filter((d) => d.lifecycle === "stable" && d.usedBy === 0)
      .map((d) => ({ name: d.name, detail: "stable, 0 dependents" }));

    const betaHighAdoption = adoptionData
      .filter((d) => d.lifecycle === "beta" && d.usedBy >= 3)
      .map((d) => ({ name: d.name, detail: `beta, ${d.usedBy} dependents` }));

    const exportedCount = items.filter((i) => i.availability === "exported").length;
    const stableCount = lifecycleCounts["stable"] ?? 0;
    const avgAdoption = items.length > 0
      ? (items.reduce((sum, i) => sum + (i.whereUsed?.length ?? 0), 0) / items.length).toFixed(1)
      : "0";

    return {
      total: items.length,
      exportedCount,
      stableCount,
      avgAdoption,
      lifecycleCounts,
      layerCounts,
      kindCounts,
      topAdopted: adoptionData.slice(0, 15),
      stableUnused,
      betaHighAdoption,
    };
  }, [items]);

  /* ---- Lifecycle chart data ---- */
  const lifecycleSegments = useMemo(
    () => [
      { label: "Stable", value: analytics.lifecycleCounts["stable"] ?? 0, color: "#22c55e" },
      { label: "Beta", value: analytics.lifecycleCounts["beta"] ?? 0, color: "#f59e0b" },
      { label: "Planned", value: analytics.lifecycleCounts["planned"] ?? 0, color: "#94a3b8" },
    ],
    [analytics.lifecycleCounts],
  );

  /* ---- Layer chart data ---- */
  const layerBars = useMemo(() => {
    const colors: Record<string, string> = {
      primitives: "#3b82f6",
      "form-controls": "#22c55e",
      feedback: "#f59e0b",
      "data-display": "#a855f7",
      navigation: "#ec4899",
      overlays: "#06b6d4",
      layout: "#8b5cf6",
      patterns: "#f97316",
    };

    return Object.entries(analytics.layerCounts)
      .map(([layer, count]) => ({
        label: layer,
        value: count,
        color: colors[layer.toLowerCase()] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  }, [analytics.layerCounts]);

  /* ---- Top adopted chart data ---- */
  const adoptionBars = useMemo(
    () =>
      analytics.topAdopted
        .filter((d) => d.usedBy > 0)
        .slice(0, 12)
        .map((d) => ({
          label: d.name,
          value: d.usedBy,
          color: d.lifecycle === "stable" ? "#22c55e" : d.lifecycle === "beta" ? "#f59e0b" : "#94a3b8",
        })),
    [analytics.topAdopted],
  );

  const maxAdoption = Math.max(...adoptionBars.map((b) => b.value), 1);
  const maxLayer = Math.max(...layerBars.map((b) => b.value), 1);

  const TABS: Array<{ id: AnalyticsTab; label: string; icon: React.ReactNode }> = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { id: "adoption", label: "Adoption", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { id: "lifecycle", label: "Lifecycle", icon: <PieChart className="h-3.5 w-3.5" /> },
    { id: "layers", label: "Layers", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border-subtle bg-surface-default px-6 py-4">
        <Text as="h1" className="text-lg font-bold text-text-primary">
          Usage Analytics
        </Text>
        <Text variant="secondary" className="mt-0.5 text-xs">
          Component adoption metrics, lifecycle distribution, and quality insights
        </Text>

        {/* Tabs */}
        <div className="mt-3 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                tab === t.id
                  ? "bg-action-primary text-white"
                  : "text-text-secondary hover:bg-surface-canvas hover:text-text-primary"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-6 p-6">
        {/* Stats row — always visible */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<BarChart3 className="h-4 w-4" />}
            label="Total Components"
            value={analytics.total}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Exported"
            value={analytics.exportedCount}
            sub={`${analytics.total > 0 ? Math.round((analytics.exportedCount / analytics.total) * 100) : 0}% of total`}
          />
          <StatCard
            icon={<PieChart className="h-4 w-4" />}
            label="Stable"
            value={analytics.stableCount}
            color="text-emerald-600"
            sub={`${analytics.total > 0 ? Math.round((analytics.stableCount / analytics.total) * 100) : 0}% mature`}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Avg. Adoption"
            value={analytics.avgAdoption}
            sub="dependents per component"
          />
        </div>

        {/* Tab content */}
        {(tab === "overview" || tab === "adoption") && (
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
            <Text as="h2" className="text-sm font-semibold text-text-primary">
              Top Adopted Components
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Components with the most dependents in the design system
            </Text>
            <div className="mt-4">
              {adoptionBars.length > 0 ? (
                <HorizontalBarChart data={adoptionBars} maxValue={maxAdoption} />
              ) : (
                <Text variant="secondary" className="py-8 text-center text-sm">
                  No adoption data available
                </Text>
              )}
            </div>
          </div>
        )}

        {(tab === "overview" || tab === "lifecycle") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
              <Text as="h2" className="text-sm font-semibold text-text-primary">
                Lifecycle Distribution
              </Text>
              <div className="mt-4 flex items-center justify-center">
                <DonutChart segments={lifecycleSegments} />
              </div>
              <div className="mt-4 flex justify-center gap-4">
                {lifecycleSegments.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <Text className="text-xs text-text-secondary">
                      {seg.label} ({seg.value})
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Anomaly highlights */}
            <div className="flex flex-col gap-4">
              <HighlightCard
                title="Stable but Unused"
                items={analytics.stableUnused}
                variant="warning"
              />
              <HighlightCard
                title="Beta with High Adoption"
                items={analytics.betaHighAdoption}
                variant="info"
              />
              {analytics.stableUnused.length === 0 && analytics.betaHighAdoption.length === 0 && (
                <div className="flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
                  <Text className="text-sm font-medium text-emerald-700">
                    ✓ No anomalies detected — healthy library!
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}

        {(tab === "overview" || tab === "layers") && (
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
            <Text as="h2" className="text-sm font-semibold text-text-primary">
              Components by Layer
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Distribution across design system layers
            </Text>
            <div className="mt-4">
              <HorizontalBarChart data={layerBars} maxValue={maxLayer} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
