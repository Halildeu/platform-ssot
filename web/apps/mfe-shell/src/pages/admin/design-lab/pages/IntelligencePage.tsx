/**
 * IntelligencePage — Design Lab Impact Intelligence
 *
 * Combines all intelligence panels:
 * 1. AI Assistant
 * 2. Blast Radius
 * 3. Consumer Heatmap
 * 4. Codegen Sandbox
 * 5. Dependency Graph Summary
 * 6. Migration Impact Calculator
 * 7. API Surface Stats
 * 8. Usage Analytics Quick View
 * + MCP Export button
 */

import React, { useState, useCallback, useMemo } from "react";
import { Text } from "@mfe/design-system";
import {
  Brain,
  Download,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Shuffle,
  Layers,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useDesignLab } from "../DesignLabProvider";
import AssistantPanel from "../intelligence/AssistantPanel";
import BlastRadiusPanel from "../intelligence/BlastRadiusPanel";
import ConsumerHeatmap from "../intelligence/ConsumerHeatmap";
import { useCodegenSandbox } from "../intelligence/useCodegenSandbox";
import { generateMCPManifest } from "../intelligence/mcpExport";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";
import type { CodegenResult } from "../intelligence/useCodegenSandbox";

/* ------------------------------------------------------------------ */
/*  Collapsible section                                                 */
/* ------------------------------------------------------------------ */

function Section({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-canvas/50"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          {icon}
        </div>
        <Text className="flex-1 text-sm font-semibold text-text-primary">
          {title}
        </Text>
        {badge && <div className="mr-2">{badge}</div>}
        {open ? (
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-text-secondary" />
        )}
      </button>
      {open && (
        <div className="border-t border-border-subtle px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Codegen sandbox inline                                              */
/* ------------------------------------------------------------------ */

function CodegenSandboxSection() {
  const { generate } = useCodegenSandbox();
  const [componentName, setComponentName] = useState("");
  const [propsJson, setPropsJson] = useState("{}");
  const [result, setResult] = useState<CodegenResult | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = useCallback(() => {
    if (!componentName.trim()) return;
    setError("");
    try {
      const props = JSON.parse(propsJson);
      const gen = generate(componentName.trim(), props);
      setResult(gen);
    } catch (e) {
      setError("Props JSON gecersiz. Ornek: {\"variant\": \"primary\"}");
      setResult(null);
    }
  }, [componentName, propsJson, generate]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Text variant="secondary" className="mb-1 text-xs font-medium">
            Component Adi
          </Text>
          <input
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="Button"
            className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary outline-hidden focus:border-action-primary"
          />
        </div>
        <div>
          <Text variant="secondary" className="mb-1 text-xs font-medium">
            Props (JSON)
          </Text>
          <input
            value={propsJson}
            onChange={(e) => setPropsJson(e.target.value)}
            placeholder='{"variant": "primary"}'
            className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm font-mono text-text-primary outline-hidden focus:border-action-primary"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!componentName.trim()}
        className="self-start rounded-lg bg-action-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-action-primary/90 disabled:opacity-40"
      >
        Kod Uret
      </button>

      {error && (
        <Text className="text-xs text-red-600">{error}</Text>
      )}

      {result && (
        <div className="space-y-2">
          {/* Validity */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${result.isValid ? "bg-emerald-500" : "bg-red-500"}`}
            />
            <Text className="text-xs font-medium text-text-primary">
              {result.isValid ? "Gecerli" : "Uyari mevcut"}
            </Text>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="rounded-lg bg-amber-50 p-2.5">
              {result.warnings.map((w, i) => (
                <Text key={i} className="text-xs text-amber-700">
                  - {w}
                </Text>
              ))}
            </div>
          )}

          {/* Generated code */}
          <pre className="overflow-x-auto rounded-lg bg-surface-canvas p-3 text-xs leading-5 text-text-primary">
            <code>{result.fullExample}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MCP Export button                                                   */
/* ------------------------------------------------------------------ */

function MCPExportButton() {
  const { index, apiItemMap } = useDesignLab();

  const handleExport = useCallback(() => {
    const json = generateMCPManifest(index, apiItemMap);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-lab-mcp-manifest.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [index, apiItemMap]);

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 rounded-xl bg-action-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-action-primary/90"
    >
      <Download className="h-4 w-4" />
      MCP Manifest Indir
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Dependency Graph Summary                                           */
/* ------------------------------------------------------------------ */

function DependencyGraphSummary() {
  const { index } = useDesignLab();

  const stats = useMemo(() => {
    const items = index.items;
    const total = items.length;

    // Total connections = sum of all whereUsed lengths
    let totalConnections = 0;
    let maxDeps = 0;
    let mostDepended = "";

    for (const item of items) {
      const deps = item.whereUsed.length;
      totalConnections += deps;
      if (deps > maxDeps) {
        maxDeps = deps;
        mostDepended = item.name;
      }
    }

    return { total, totalConnections, mostDepended, maxDeps };
  }, [index.items]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-surface-muted p-3 text-center">
          <Text className="text-2xl font-bold text-text-primary">
            {stats.total}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            Toplam bilesen
          </Text>
        </div>
        <div className="rounded-xl bg-surface-muted p-3 text-center">
          <Text className="text-2xl font-bold text-text-primary">
            {stats.totalConnections}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            Toplam baglanti
          </Text>
        </div>
        <div className="rounded-xl bg-violet-50 p-3 text-center">
          <Text className="text-lg font-bold text-violet-700">
            {stats.mostDepended || "—"}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            En bagli ({stats.maxDeps} tuketici)
          </Text>
        </div>
      </div>

      <a
        href="/admin/design-lab/graph"
        className="flex items-center gap-1.5 self-start rounded-lg bg-action-primary/10 px-3 py-2 text-xs font-semibold text-action-primary transition hover:bg-action-primary/20"
      >
        Dependency Graph
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Migration Impact Calculator                                        */
/* ------------------------------------------------------------------ */

function MigrationImpactCalculator() {
  const { index } = useDesignLab();
  const [selectedComponent, setSelectedComponent] = useState("");

  const componentNames = useMemo(
    () =>
      index.items
        .filter((item) => item.kind === "component")
        .map((item) => item.name)
        .sort(),
    [index.items],
  );

  const impact = useMemo(() => {
    if (!selectedComponent) return null;
    const item = index.items.find((i) => i.name === selectedComponent);
    if (!item) return null;

    const affectedApps = item.whereUsed;

    // Find recipes that reference this component
    const affectedRecipes = (index.recipes?.currentFamilies ?? []).filter(
      (r) =>
        r.ownerBlocks.includes(item.name) ||
        r.sectionIds?.some((sid) => item.sectionIds.includes(sid)),
    );

    // Find pages referencing this component
    const affectedPages = (index.pages?.currentFamilies ?? []).filter(
      (p) =>
        p.ownerBlocks.includes(item.name) ||
        p.sectionIds?.some((sid) => item.sectionIds.includes(sid)),
    );

    const consumerCount = affectedApps.length;
    const riskScore =
      consumerCount >= 5 ? "high" : consumerCount >= 2 ? "medium" : "low";

    return {
      affectedApps,
      affectedRecipes,
      affectedPages,
      riskScore,
      consumerCount,
    };
  }, [selectedComponent, index]);

  const riskColors = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text variant="secondary" className="mb-1.5 text-xs font-medium">
          Bilesen Sec
        </Text>
        <select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary outline-hidden focus:border-action-primary"
        >
          <option value="">-- Bir bilesen secin --</option>
          {componentNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {impact && (
        <div className="space-y-3">
          {/* Risk badge */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-text-secondary" />
            <Text className="text-xs font-medium text-text-primary">
              Risk Skoru:
            </Text>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${riskColors[impact.riskScore]}`}
            >
              {impact.riskScore.toUpperCase()}
            </span>
          </div>

          {/* Affected apps */}
          <div>
            <Text variant="secondary" className="mb-1 text-xs font-medium">
              Etkilenen Uygulamalar ({impact.affectedApps.length})
            </Text>
            {impact.affectedApps.length === 0 ? (
              <Text className="text-xs text-text-secondary">
                Tuketici bulunamadi
              </Text>
            ) : (
              <div className="flex flex-wrap gap-1">
                {impact.affectedApps.map((app) => (
                  <span
                    key={app}
                    className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                  >
                    {app}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Affected recipes */}
          <div>
            <Text variant="secondary" className="mb-1 text-xs font-medium">
              Etkilenen Tarifler ({impact.affectedRecipes.length})
            </Text>
            {impact.affectedRecipes.length === 0 ? (
              <Text className="text-xs text-text-secondary">Yok</Text>
            ) : (
              <div className="flex flex-wrap gap-1">
                {impact.affectedRecipes.map((r) => (
                  <span
                    key={r.recipeId}
                    className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700"
                  >
                    {r.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Affected pages */}
          <div>
            <Text variant="secondary" className="mb-1 text-xs font-medium">
              Etkilenen Sayfalar ({impact.affectedPages.length})
            </Text>
            {impact.affectedPages.length === 0 ? (
              <Text className="text-xs text-text-secondary">Yok</Text>
            ) : (
              <div className="flex flex-wrap gap-1">
                {impact.affectedPages.map((p) => (
                  <span
                    key={p.pageId}
                    className="rounded bg-cyan-100 px-2 py-0.5 text-[10px] font-medium text-cyan-700"
                  >
                    {p.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  API Surface Stats                                                  */
/* ------------------------------------------------------------------ */

function APISurfaceStats() {
  const { apiItemMap, index } = useDesignLab();

  const stats = useMemo(() => {
    const apiItems = [...apiItemMap.values()];
    const totalProps = apiItems.reduce(
      (sum, item) => sum + item.props.length,
      0,
    );
    const avgProps =
      apiItems.length > 0
        ? Math.round((totalProps / apiItems.length) * 10) / 10
        : 0;

    const zeroProps = apiItems.filter((item) => item.props.length === 0);
    const complexApi = apiItems.filter((item) => item.props.length >= 10);

    // Components in index but not in API catalog = undocumented
    const indexComponentNames = new Set(
      index.items
        .filter((i) => i.kind === "component")
        .map((i) => i.name),
    );
    const documentedNames = new Set(apiItems.map((i) => i.name));
    const undocumented = [...indexComponentNames].filter(
      (n) => !documentedNames.has(n),
    );

    return {
      totalApiItems: apiItems.length,
      totalProps,
      avgProps,
      zeroPropsCount: zeroProps.length,
      zeroPropsNames: zeroProps.slice(0, 5).map((i) => i.name),
      complexCount: complexApi.length,
      complexNames: complexApi.slice(0, 5).map((i) => i.name),
      undocumentedCount: undocumented.length,
    };
  }, [apiItemMap, index.items]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-surface-muted p-3 text-center">
          <Text className="text-2xl font-bold text-text-primary">
            {stats.totalProps}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            Toplam prop
          </Text>
        </div>
        <div className="rounded-xl bg-surface-muted p-3 text-center">
          <Text className="text-2xl font-bold text-text-primary">
            {stats.avgProps}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            Ort. prop/bilesen
          </Text>
        </div>
        <div className="rounded-xl bg-surface-muted p-3 text-center">
          <Text className="text-2xl font-bold text-text-primary">
            {stats.zeroPropsCount}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            0 prop (dokumansiz)
          </Text>
        </div>
        <div className="rounded-xl bg-surface-muted p-3 text-center">
          <Text className="text-2xl font-bold text-amber-700">
            {stats.complexCount}
          </Text>
          <Text variant="secondary" className="text-[10px]">
            10+ prop (karmasik)
          </Text>
        </div>
      </div>

      {stats.complexCount > 0 && (
        <div className="rounded-xl bg-amber-50/50 p-3">
          <Text variant="secondary" className="mb-1 text-[10px] font-medium">
            Karmasik API bilesenleri:
          </Text>
          <div className="flex flex-wrap gap-1">
            {stats.complexNames.map((name) => (
              <span
                key={name}
                className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700"
              >
                {name}
              </span>
            ))}
            {stats.complexCount > 5 && (
              <span className="rounded bg-surface-muted px-2 py-0.5 text-[10px] text-text-secondary">
                +{stats.complexCount - 5} daha
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Usage Analytics Quick View                                         */
/* ------------------------------------------------------------------ */

function UsageAnalyticsQuickView() {
  const { index } = useDesignLab();

  const analytics = useMemo(() => {
    const items = index.items.filter((i) => i.kind === "component");
    if (items.length === 0)
      return { mostUsed: null, leastUsed: [], orphans: [] };

    // Sort by whereUsed count
    const sorted = [...items].sort(
      (a, b) => b.whereUsed.length - a.whereUsed.length,
    );

    const mostUsed = sorted[0];

    // Least used among exported (non-zero usage)
    const exported = items.filter(
      (i) => i.availability === "exported" && i.whereUsed.length > 0,
    );
    const leastUsed = [...exported]
      .sort((a, b) => a.whereUsed.length - b.whereUsed.length)
      .slice(0, 5);

    // Orphan candidates: exported with 0 usage
    const orphans = items
      .filter(
        (i) => i.availability === "exported" && i.whereUsed.length === 0,
      )
      .slice(0, 10);

    return { mostUsed, leastUsed, orphans };
  }, [index.items]);

  return (
    <div className="flex flex-col gap-4">
      {/* Most used */}
      {analytics.mostUsed && (
        <div className="rounded-xl bg-emerald-50/50 p-3">
          <Text variant="secondary" className="text-[10px] font-medium">
            En cok kullanilan bilesen
          </Text>
          <div className="mt-1 flex items-baseline gap-2">
            <Text className="text-lg font-bold text-emerald-700">
              {analytics.mostUsed.name}
            </Text>
            <Text variant="secondary" className="text-xs">
              {analytics.mostUsed.whereUsed.length} uygulama
            </Text>
          </div>
        </div>
      )}

      {/* Least used */}
      {analytics.leastUsed.length > 0 && (
        <div>
          <Text variant="secondary" className="mb-1.5 text-xs font-medium">
            En az kullanilan (exported)
          </Text>
          <div className="space-y-1">
            {analytics.leastUsed.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-1.5"
              >
                <Text className="text-xs font-medium text-text-primary">
                  {item.name}
                </Text>
                <Text variant="secondary" className="text-[10px]">
                  {item.whereUsed.length} kullanim
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orphan candidates */}
      {analytics.orphans.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <Text variant="secondary" className="text-xs font-medium">
              Yetim adaylari (0 kullanim, exported)
            </Text>
          </div>
          <div className="flex flex-wrap gap-1">
            {analytics.orphans.map((item) => (
              <span
                key={item.name}
                className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {analytics.orphans.length === 0 &&
        analytics.leastUsed.length === 0 && (
          <Text variant="secondary" className="text-xs">
            Tum exported bilesenler kullaniliyor.
          </Text>
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function IntelligencePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border-subtle bg-surface-default px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <Brain className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <Text as="h1" className="text-lg font-bold text-text-primary">
              Impact Intelligence
            </Text>
            <Text variant="secondary" className="text-xs">
              Blast-radius analizi, AI asistan, codegen sandbox ve MCP export
            </Text>
          </div>
          <div className="ml-auto">
            <MCPExportButton />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 p-6">
        {/* Dependency Graph Summary */}
        <Section
          title="Dependency Graph Summary"
          icon={<GitBranch className="h-4 w-4" />}
          defaultOpen
          badge={<DataProvenanceBadge level="derived" />}
        >
          <DependencyGraphSummary />
        </Section>

        {/* Migration Impact Calculator */}
        <Section
          title="Migration Impact Calculator"
          icon={<Shuffle className="h-4 w-4" />}
          defaultOpen
          badge={<DataProvenanceBadge level="derived" />}
        >
          <MigrationImpactCalculator />
        </Section>

        {/* API Surface Stats */}
        <Section
          title="API Surface Stats"
          icon={<Layers className="h-4 w-4" />}
          badge={<DataProvenanceBadge level="derived" />}
        >
          <APISurfaceStats />
        </Section>

        {/* Usage Analytics Quick View */}
        <Section
          title="Usage Analytics Quick View"
          icon={<TrendingUp className="h-4 w-4" />}
          badge={<DataProvenanceBadge level="derived" />}
        >
          <UsageAnalyticsQuickView />
        </Section>

        {/* Assistant (default open) */}
        <Section
          title="AI Asistan"
          icon={<Brain className="h-4 w-4" />}
          defaultOpen
        >
          <AssistantPanel />
        </Section>

        {/* Blast Radius */}
        <Section
          title="Blast Radius"
          icon={<Brain className="h-4 w-4" />}
          defaultOpen
        >
          <BlastRadiusPanel />
        </Section>

        {/* Consumer Heatmap */}
        <Section
          title="Consumer Heatmap"
          icon={<Brain className="h-4 w-4" />}
        >
          <ConsumerHeatmap />
        </Section>

        {/* Codegen Sandbox */}
        <Section
          title="Codegen Sandbox"
          icon={<Brain className="h-4 w-4" />}
        >
          <CodegenSandboxSection />
        </Section>
      </div>
    </div>
  );
}
