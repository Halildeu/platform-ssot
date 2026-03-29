import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Monitor, Shield, CheckCircle2, XCircle, Package, Zap, Code, Globe } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import surfacesCatalog from "../../design-lab.enterprise-data-surfaces.v1.json";

/* ------------------------------------------------------------------ */
/*  ExtensionDetail — Individual ecosystem extension                   */
/*                                                                     */
/*  Tabs: Overview · Surfaces · Components · Quality                   */
/* ------------------------------------------------------------------ */

type ExtTab = "overview" | "surfaces" | "components" | "quality";
const EXT_TABS: ExtTab[] = ["overview", "surfaces", "components", "quality"];

export default function ExtensionDetail() {
  const { extensionId } = useParams<{ extensionId: string }>();
  const navigate = useNavigate();
  const { index, t } = useDesignLab();
  const [activeTab, setActiveTab] = useState<ExtTab>("overview");

  const extension = useMemo(
    () =>
      index.ecosystem?.currentFamilies.find(
        (f) => f.extensionId === extensionId,
      ),
    [index, extensionId],
  );

  // Find components that belong to this extension's sections
  const relatedComponents = useMemo(() => {
    if (!extension?.sectionIds?.length) return [];
    return index.items.filter((item) =>
      item.sectionIds?.some((sid) => extension.sectionIds?.includes(sid)),
    );
  }, [extension, index.items]);

  if (!extension) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
        <Text variant="secondary">{t("designlab.detail.notFound")}</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <button type="button" onClick={() => navigate("/admin/design-lab")} className="hover:text-text-primary">
          {t("designlab.breadcrumb.library")}
        </button>
        <span>/</span>
        <button type="button" onClick={() => navigate("/admin/design-lab/ecosystem")} className="hover:text-text-primary">
          {t("designlab.sidebar.title.ecosystem")}
        </button>
        <span>/</span>
        <span className="text-text-primary">{extension.title}</span>
      </div>

      {/* Hero */}
      <div>
        <Text as="div" className="text-3xl font-bold tracking-tight text-text-primary">
          {extension.title}
        </Text>
        <Text variant="secondary" className="mt-2 max-w-2xl text-sm leading-6">
          {extension.intent}
        </Text>
        {extension.ownerBlocks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {extension.ownerBlocks.map((block) => (
              <span key={block} className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                {block}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border-subtle">
        <div className="-mb-px flex gap-1">
          {EXT_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2.5 text-sm font-medium transition",
                activeTab === tab
                  ? "border-b-2 border-action-primary text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {t(`designlab.extension.tab.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <ExtOverview extension={extension} relatedComponents={relatedComponents} />
        )}
        {activeTab === "surfaces" && (
          <ExtSurfaces extension={extension} />
        )}
        {activeTab === "components" && (
          <ExtComponents relatedComponents={relatedComponents} navigate={navigate} />
        )}
        {activeTab === "quality" && (
          <ExtQuality />
        )}
      </div>
    </div>
  );
}

type ExtFamily = NonNullable<
  ReturnType<typeof useDesignLab>["index"]["ecosystem"]
>["currentFamilies"][number];

function ExtOverview({
  extension,
  relatedComponents,
}: {
  extension: ExtFamily;
  relatedComponents: ReturnType<typeof useDesignLab>["index"]["items"];
}) {
  const { t } = useDesignLab();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Intent */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
          {t("designlab.extension.overview.intent")}
        </Text>
        <Text variant="secondary" className="text-sm leading-6">
          {extension.intent}
        </Text>
      </div>

      {/* Owner blocks */}
      {extension.ownerBlocks.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.extension.overview.ownerBlocks")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {extension.ownerBlocks.map((block) => (
              <span
                key={block}
                className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary"
              >
                {block}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related components */}
      {relatedComponents.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5 lg:col-span-2">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.extension.overview.usedComponents")} ({relatedComponents.length})
          </Text>
          <div className="flex flex-wrap gap-2">
            {relatedComponents.slice(0, 12).map((comp) => (
              <span
                key={comp.name}
                className="rounded-full bg-state-info-bg px-3 py-1 text-xs font-medium text-state-info-text"
              >
                {comp.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Surface matching helpers ---- */

type Surface = (typeof surfacesCatalog.surfaces)[number];

const TIER_COLORS: Record<string, string> = {
  pro: "bg-action-primary/10 text-action-primary",
  enterprise: "bg-action-primary/10 text-action-primary",
  community: "bg-state-success-text/10 text-state-success-text",
};

const READINESS_LABELS: Record<string, string> = {
  multiTenant: "Multi-Tenant",
  rbac: "RBAC",
  auditTrail: "Audit Trail",
  perfBenchmark: "Perf Benchmark",
  a11yWcag: "WCAG A11y",
  i18nRtl: "i18n / RTL",
};

function snakeToPretty(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function findMatchingSurfaces(ownerBlocks: string[]): Surface[] {
  if (!ownerBlocks.length) return [];
  return surfacesCatalog.surfaces.filter((surface) =>
    surface.coreComponents.some((cc) =>
      ownerBlocks.some((ob) => ob.includes(cc) || cc.includes(ob)),
    ),
  );
}

function ExtSurfaces({ extension }: { extension: ExtFamily }) {
  const { t } = useDesignLab();

  const matchedSurfaces = useMemo(
    () => findMatchingSurfaces(extension.ownerBlocks),
    [extension.ownerBlocks],
  );

  // Merge readiness checks — "best of" across matched surfaces
  const mergedReadiness = useMemo(() => {
    if (!matchedSurfaces.length) return null;
    const merged: Record<string, boolean> = {};
    for (const key of Object.keys(READINESS_LABELS)) {
      merged[key] = matchedSurfaces.some(
        (s) => (s.readinessChecks as Record<string, boolean>)[key] === true,
      );
    }
    return merged;
  }, [matchedSurfaces]);

  // Merge quality gates
  const mergedGates = useMemo(() => {
    const set = new Set<string>();
    for (const s of matchedSurfaces) {
      for (const g of s.qualityGates) set.add(g);
    }
    return Array.from(set);
  }, [matchedSurfaces]);

  if (matchedSurfaces.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {/* Show ownerBlocks as simple component cards */}
        {extension.ownerBlocks.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-text-secondary" />
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Owner Blocks
              </Text>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extension.ownerBlocks.map((block) => (
                <div
                  key={block}
                  className="rounded-xl border border-border-subtle bg-surface-default p-3 text-xs font-medium text-text-primary"
                >
                  {block}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
          <Monitor className="mx-auto mb-2 h-8 w-8 text-text-secondary opacity-40" />
          <Text variant="secondary" className="text-sm">
            {t("designlab.extension.surfaces.noSurfaces")}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Section A — Surface Cards */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5 text-text-secondary" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            {t("designlab.extension.surfaces.integrations")} ({matchedSurfaces.length})
          </Text>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {matchedSurfaces.map((surface) => (
            <SurfaceCard key={surface.surfaceId} surface={surface} />
          ))}
        </div>
      </div>

      {/* Section B — Enterprise Readiness Matrix */}
      {mergedReadiness && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-text-secondary" />
            <Text as="div" className="text-sm font-semibold text-text-primary">
              {t("designlab.extension.surfaces.readiness")}
            </Text>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(READINESS_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  {mergedReadiness[key] ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-state-success-text" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-state-error-text" />
                  )}
                  <Text className="text-xs font-medium text-text-primary">{label}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section C — API Contracts */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Code className="h-5 w-5 text-text-secondary" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            {t("designlab.extension.surfaces.apiContract")}
          </Text>
        </div>
        <div className="flex flex-col gap-3">
          {matchedSurfaces.map((surface) => (
            <div
              key={surface.surfaceId}
              className="rounded-xl border border-border-subtle bg-surface-default p-4"
            >
              <Text as="div" className="mb-2 text-xs font-semibold text-text-primary">
                {surface.title}
              </Text>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                    Import
                  </span>
                  <code className="rounded-xs bg-surface-muted px-2 py-0.5 text-[11px] font-mono text-text-primary">
                    {surface.apiContract.importPath}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                    Props
                  </span>
                  <code className="rounded-xs bg-surface-muted px-2 py-0.5 text-[11px] font-mono text-text-primary">
                    {surface.apiContract.propsInterface}
                  </code>
                </div>
                {surface.apiContract.serverSideModel?.endpoint && (
                  <div className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                      Endpoint
                    </span>
                    <code className="rounded-xs bg-surface-muted px-2 py-0.5 text-[11px] font-mono text-text-primary">
                      {surface.apiContract.serverSideModel.endpoint}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section D — Quality Gates */}
      {mergedGates.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-text-secondary" />
            <Text as="div" className="text-sm font-semibold text-text-primary">
              {t("designlab.extension.surfaces.qualityGates")} ({mergedGates.length})
            </Text>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {mergedGates.map((gate) => (
                <div key={gate} className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
                  <Text className="text-xs text-text-primary">{snakeToPretty(gate)}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SurfaceCard({ surface }: { surface: Surface }) {
  const { t } = useDesignLab();
  const tierColor = TIER_COLORS[surface.tier] ?? TIER_COLORS.community;
  const MAX_CAPS = 6;
  const overflowCount = Math.max(0, surface.capabilities.length - MAX_CAPS);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5 transition hover:shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <Text as="div" className="text-sm font-semibold text-text-primary">
          {surface.title}
        </Text>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${tierColor}`}>
          {t(`designlab.extension.surfaces.tier.${surface.tier}`) || surface.tier}
        </span>
      </div>

      {/* Description */}
      <Text variant="secondary" className="mt-1.5 line-clamp-2 text-xs leading-5">
        {surface.description}
      </Text>

      {/* Core Components */}
      {surface.coreComponents.length > 0 && (
        <div className="mt-3">
          <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            {t("designlab.extension.surfaces.coreComponents")}
          </Text>
          <div className="flex flex-wrap gap-1.5">
            {surface.coreComponents.map((cc) => (
              <span
                key={cc}
                className="rounded-full bg-state-info-bg px-2.5 py-0.5 text-[10px] font-medium text-state-info-text"
              >
                {cc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Capabilities */}
      <div className="mt-3">
        <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          {t("designlab.extension.surfaces.capabilities")}
        </Text>
        <div className="flex flex-wrap gap-1.5">
          {surface.capabilities.slice(0, MAX_CAPS).map((cap) => (
            <span
              key={cap}
              className="rounded-xs bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary"
            >
              {snakeToPretty(cap)}
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="rounded-xs bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              +{overflowCount} more
            </span>
          )}
        </div>
      </div>

      {/* Benchmark Ref */}
      {surface.benchmarkRef && (
        <div className="mt-3 flex items-start gap-2">
          <Globe className="mt-0.5 h-3 w-3 shrink-0 text-text-secondary" />
          <Text className="text-[10px] leading-4 text-text-secondary">
            <span className="font-medium">Ant:</span> {surface.benchmarkRef.antDesign}
            {" · "}
            <span className="font-medium">MUI:</span> {surface.benchmarkRef.mui}
          </Text>
        </div>
      )}
    </div>
  );
}

function ExtComponents({
  relatedComponents,
  navigate,
}: {
  relatedComponents: ReturnType<typeof useDesignLab>["index"]["items"];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { t } = useDesignLab();

  if (relatedComponents.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
        <Text variant="secondary" className="text-sm">
          {t("designlab.extension.components.empty")}
        </Text>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {relatedComponents.map((comp) => (
        <button
          key={comp.name}
          type="button"
          onClick={() =>
            navigate(`/admin/design-lab/components/${comp.taxonomyGroupId}/${encodeURIComponent(comp.name.replace(/\//g, '~'))}`)
          }
          className="group rounded-2xl border border-border-subtle bg-surface-default p-4 text-left transition hover:border-action-primary/30 hover:shadow-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <Text className="text-sm font-semibold text-text-primary group-hover:text-action-primary">
              {comp.name}
            </Text>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                comp.lifecycle === "stable"
                  ? "bg-state-success-bg text-state-success-text"
                  : comp.lifecycle === "beta"
                    ? "bg-state-warning-bg text-state-warning-text"
                    : "bg-state-info-bg text-state-info-text",
              ].join(" ")}
            >
              {comp.lifecycle}
            </span>
          </div>
          <Text variant="secondary" className="mt-1 line-clamp-2 text-xs">
            {comp.description}
          </Text>
        </button>
      ))}
    </div>
  );
}

function ExtQuality() {
  const { t } = useDesignLab();

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
        {t("designlab.detail.quality.gates")}
      </Text>
      <Text variant="secondary" className="text-xs">
        {t("designlab.detail.quality.noGates")}
      </Text>
    </div>
  );
}
