import React, { useMemo, useState } from "react";
import {
  Figma,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Palette,
  Type,
  Box,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";

/* ------------------------------------------------------------------ */
/*  FigmaSyncPage — Figma token sync status & drift indicator          */
/*                                                                     */
/*  Reads design-token metadata from the DesignLab index to show:      */
/*  - Last sync timestamp                                              */
/*  - Token counts by category                                         */
/*  - Drift indicator (tokens added/removed/changed since last sync)   */
/*  - Token diff viewer                                                */
/*  Route: /admin/design-lab/figma-sync                                */
/* ------------------------------------------------------------------ */

/* ---- Simulated sync metadata (in production, read from figma.tokens.json) ---- */

type SyncStatus = "synced" | "drift" | "error" | "never";
type TokenChange = { token: string; category: string; type: "added" | "removed" | "changed"; before?: string; after?: string };

function useFigmaSyncData() {
  const { index } = useDesignLab();

  return useMemo(() => {
    // Derive token groups from what Design Lab index provides
    const tokenGroups = ["colors", "typography", "spacing", "radius", "motion", "zindex"];
    const tokenCounts: Record<string, number> = {};
    let totalTokens = 0;

    for (const group of tokenGroups) {
      // Estimate token counts from design token system
      const count = group === "colors" ? 48 : group === "typography" ? 24 : group === "spacing" ? 16 : group === "radius" ? 8 : group === "motion" ? 12 : 6;
      tokenCounts[group] = count;
      totalTokens += count;
    }

    // Simulated sync state (in production, this would read figma.tokens.json metadata)
    const lastSyncDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const figmaFileVersion = "v4.12.0";
    const syncStatus: SyncStatus = "drift";

    // Simulated drift changes
    const changes: TokenChange[] = [
      { token: "--color-brand-600", category: "colors", type: "changed", before: "#2563eb", after: "#2461e0" },
      { token: "--color-surface-elevated", category: "colors", type: "added", after: "#fafbfc" },
      { token: "--spacing-18", category: "spacing", type: "added", after: "4.5rem" },
      { token: "--radius-pill", category: "radius", type: "removed", before: "9999px" },
      { token: "--font-size-2xs", category: "typography", type: "added", after: "0.625rem" },
    ];

    return {
      tokenGroups,
      tokenCounts,
      totalTokens,
      lastSyncDate,
      figmaFileVersion,
      syncStatus,
      changes,
      componentCount: index.items.length,
    };
  }, [index]);
}

/* ---- Status badge ---- */

const STATUS_CONFIG: Record<SyncStatus, { label: string; color: string; icon: React.ReactNode }> = {
  synced: { label: "In Sync", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="h-4 w-4" /> },
  drift: { label: "Drift Detected", color: "bg-amber-100 text-amber-700", icon: <AlertTriangle className="h-4 w-4" /> },
  error: { label: "Sync Error", color: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4" /> },
  never: { label: "Never Synced", color: "bg-[var(--surface-muted)] text-[var(--text-secondary)]", icon: <Clock className="h-4 w-4" /> },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  colors: <Palette className="h-4 w-4" />,
  typography: <Type className="h-4 w-4" />,
  spacing: <Box className="h-4 w-4" />,
  radius: <Box className="h-4 w-4" />,
  motion: <RefreshCw className="h-4 w-4" />,
  zindex: <Layers className="h-4 w-4" />,
};

const CHANGE_TYPE_STYLES: Record<TokenChange["type"], string> = {
  added: "bg-emerald-100 text-emerald-700",
  removed: "bg-red-100 text-red-700",
  changed: "bg-amber-100 text-amber-700",
};

/* ---- Stat Card ---- */

function StatCard({ label, value, icon, subtitle }: { label: string; value: string | number; icon: React.ReactNode; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-start justify-between">
        <div>
          <Text variant="secondary" className="text-xs font-medium uppercase tracking-wider">
            {label}
          </Text>
          <Text className="mt-1 text-2xl font-bold text-text-primary">{value}</Text>
          {subtitle && (
            <Text variant="secondary" className="mt-0.5 text-xs">
              {subtitle}
            </Text>
          )}
        </div>
        <div className="rounded-xl bg-surface-muted p-2.5 text-text-secondary">{icon}</div>
      </div>
    </div>
  );
}

/* ---- Token Category Row ---- */

function TokenCategoryRow({ name, count, total }: { name: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-text-secondary">
        {CATEGORY_ICONS[name] ?? <Box className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <Text className="text-sm font-medium capitalize text-text-primary">{name}</Text>
          <Text variant="secondary" className="text-xs tabular-nums">
            {count} tokens
          </Text>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-action-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---- Diff Viewer ---- */

function DiffViewer({ changes }: { changes: TokenChange[] }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (changes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
          <Text className="mt-2 text-sm font-medium text-text-primary">No Changes</Text>
          <Text variant="secondary" className="mt-1 text-xs">
            Design tokens are perfectly in sync with Figma
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-subtle">
      {changes.map((change, i) => {
        const isExpanded = expandedIdx === i;
        return (
          <button
            key={`${change.token}-${i}`}
            type="button"
            onClick={() => setExpandedIdx(isExpanded ? null : i)}
            className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-surface-muted/50"
          >
            <div className="mt-0.5">
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <code className="text-xs font-medium text-text-primary">{change.token}</code>
                <span
                  className={[
                    "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                    CHANGE_TYPE_STYLES[change.type],
                  ].join(" ")}
                >
                  {change.type}
                </span>
                <Text variant="secondary" className="ml-auto text-[10px] capitalize">
                  {change.category}
                </Text>
              </div>
              {isExpanded && (
                <div className="mt-2 space-y-1 rounded-lg bg-surface-canvas p-3">
                  {change.before && (
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[10px] font-medium text-red-600">Before</span>
                      <code className="text-xs text-text-secondary">{change.before}</code>
                      {change.type === "changed" && change.token.includes("color") && (
                        <span className="h-4 w-4 rounded border border-border-subtle" style={{ backgroundColor: change.before }} />
                      )}
                    </div>
                  )}
                  {change.after && (
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[10px] font-medium text-emerald-600">After</span>
                      <code className="text-xs text-text-secondary">{change.after}</code>
                      {change.type === "changed" && change.token.includes("color") && (
                        <span className="h-4 w-4 rounded border border-border-subtle" style={{ backgroundColor: change.after }} />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ==================================================================== */
/*  Main Page Component                                                  */
/* ==================================================================== */

export const FigmaSyncPage: React.FC = () => {
  const { t } = useDesignLab();
  const data = useFigmaSyncData();
  const statusCfg = STATUS_CONFIG[data.syncStatus];

  const addedCount = data.changes.filter((c) => c.type === "added").length;
  const removedCount = data.changes.filter((c) => c.type === "removed").length;
  const changedCount = data.changes.filter((c) => c.type === "changed").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Figma className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text as="h1" className="text-xl font-bold text-text-primary">
                Figma Token Sync
              </Text>
              <DataProvenanceBadge level="simulated" />
            </div>
            <Text variant="secondary" className="text-sm">
              Monitor design token synchronization between Figma and code
            </Text>
          </div>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className={["flex items-center gap-3 rounded-2xl border px-5 py-4", (data.syncStatus as string) === "synced" ? "border-emerald-200 bg-emerald-50" : (data.syncStatus as string) === "drift" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"].join(" ")}>
        {statusCfg.icon}
        <div className="flex-1">
          <Text className="text-sm font-semibold text-text-primary">{statusCfg.label}</Text>
          <Text variant="secondary" className="text-xs">
            Last synced {data.lastSyncDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })} · Figma file {data.figmaFileVersion}
          </Text>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.8))] px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition hover:bg-[var(--surface-default,#fff)]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Re-sync
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tokens"
          value={data.totalTokens}
          icon={<Palette className="h-5 w-5" />}
          subtitle={`${data.tokenGroups.length} categories`}
        />
        <StatCard
          label="Components Using"
          value={data.componentCount}
          icon={<Layers className="h-5 w-5" />}
          subtitle="Consuming tokens"
        />
        <StatCard
          label="Changes Detected"
          value={data.changes.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          subtitle={`+${addedCount} −${removedCount} ~${changedCount}`}
        />
        <StatCard
          label="Figma Version"
          value={data.figmaFileVersion}
          icon={<Figma className="h-5 w-5" />}
          subtitle="Design file version"
        />
      </div>

      {/* Token Categories + Diff Viewer grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Token Categories */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <Text as="div" className="mb-4 text-sm font-semibold text-text-primary">
            Token Categories
          </Text>
          <div className="space-y-1">
            {data.tokenGroups.map((group) => (
              <TokenCategoryRow
                key={group}
                name={group}
                count={data.tokenCounts[group]}
                total={data.totalTokens}
              />
            ))}
          </div>
        </div>

        {/* Diff Viewer */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default">
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
            <Text className="text-sm font-semibold text-text-primary">
              Token Changes
            </Text>
            <div className="flex gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                +{addedCount} added
              </span>
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                −{removedCount} removed
              </span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                ~{changedCount} changed
              </span>
            </div>
          </div>
          <DiffViewer changes={data.changes} />
        </div>
      </div>

      {/* Sync Validation */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
          Sync Validation
        </Text>
        <Text variant="secondary" className="text-xs">
          Run <code className="rounded bg-surface-canvas px-1.5 py-0.5 text-[11px] font-mono">generate-theme-css.mjs --check</code> to validate that all Figma tokens are correctly mapped to CSS custom properties.
        </Text>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Token → CSS mapping", status: "pass" as const },
            { label: "Theme variants coverage", status: "pass" as const },
            { label: "Unused token detection", status: "warn" as const },
          ].map((check) => (
            <div key={check.label} className="flex items-center gap-2 rounded-xl bg-surface-canvas px-3 py-2.5">
              {check.status === "pass" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              )}
              <Text className="text-xs font-medium text-text-primary">{check.label}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FigmaSyncPage;
