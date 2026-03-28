import React from "react";
import { Text } from "@mfe/design-system";
import type { DesignLabSidebarRendererProps, DesignLabSidebarFamily } from "./sidebarRendererTypes";

const toSidebarTestIdSuffix = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

/**
 * Enterprise extension tier classification.
 *
 * Determines the tier badge shown on each extension family card
 * based on keywords in the family/cluster identifiers.
 */
const EXTENSION_TIER_SIGNALS: ReadonlyArray<{
  keywords: readonly string[];
  tier: string;
  tone: "pro" | "enterprise" | "community";
}> = [
  { keywords: ["pro", "premium", "advanced", "pivot"], tier: "Pro", tone: "pro" },
  { keywords: ["enterprise", "admin", "tenant", "multi-org", "onboarding", "audit"], tier: "Enterprise", tone: "enterprise" },
  { keywords: ["grid", "table", "export", "pipeline", "report", "scheduled"], tier: "Pro", tone: "pro" },
  { keywords: ["dashboard", "kpi", "metric", "analytics", "real-time"], tier: "Analytics", tone: "pro" },
  { keywords: ["form", "wizard", "settings", "user", "role", "permission"], tier: "Admin", tone: "enterprise" },
];

const getExtensionTier = (family: {
  familyId: string;
  title?: string;
  clusterTitle?: string;
}): { tier: string; tone: "pro" | "enterprise" | "community" } => {
  const normalized =
    `${family.familyId} ${family.title ?? ""} ${family.clusterTitle ?? ""}`.toLowerCase();
  const match = EXTENSION_TIER_SIGNALS.find((entry) =>
    entry.keywords.some((kw) => normalized.includes(kw)),
  );
  return match ?? { tier: "Extension", tone: "community" };
};

/**
 * Extension surface type classification.
 */
const getExtensionSurfaceKind = (family: {
  familyId: string;
  title?: string;
}): string => {
  const normalized = `${family.familyId} ${family.title ?? ""}`.toLowerCase();
  if (normalized.includes("grid") || normalized.includes("table")) return "Data Surface";
  if (normalized.includes("dashboard") || normalized.includes("kpi")) return "Analytics";
  if (normalized.includes("form") || normalized.includes("wizard")) return "Input Surface";
  if (normalized.includes("admin") || normalized.includes("shell")) return "Admin Shell";
  if (normalized.includes("export") || normalized.includes("report")) return "Output Surface";
  if (normalized.includes("chart") || normalized.includes("visual")) return "Visualization";
  return "Extension";
};

const groupExtensionFamilies = (families: DesignLabSidebarFamily[], fallbackTitle: string) => {
  const clusters = new Map<
    string,
    { title: string; description?: string; items: DesignLabSidebarFamily[] }
  >();

  families.forEach((family) => {
    const clusterTitle = family.clusterTitle ?? fallbackTitle;
    const current = clusters.get(clusterTitle);
    if (current) {
      current.items.push(family);
      return;
    }
    clusters.set(clusterTitle, {
      title: clusterTitle,
      description: family.clusterDescription,
      items: [family],
    });
  });

  return Array.from(clusters.values());
};

/**
 * Ecosystem layer sidebar renderer.
 *
 * Shows enterprise extension families grouped by extension domain.
 * Each family card displays extension tier (Pro/Enterprise/Community),
 * surface kind classification, and owner block count.
 *
 * Contract (from layer-contract-matrix):
 * - mustContain: extension catalog, enterprise context card, enterprise search
 * - mustNotContain: foundation token tree, recipe cluster list, page template gallery
 */
export const EcosystemSidebarRenderer: React.FC<DesignLabSidebarRendererProps> = ({
  layerTitle,
  familyItems,
  selectedFamilyId,
  onFamilySelect,
  sidebarSearchValue,
  SectionBadgeComponent,
  t,
}) => {
  const SectionBadge = SectionBadgeComponent;
  const extensionCountLabel = t("designlab.sidebar.ecosystem.count", {
    count: familyItems.length,
  });
  const extensionEmptyMessage = sidebarSearchValue.trim()
    ? t("designlab.sidebar.ecosystem.empty.search", {
        query: sidebarSearchValue,
        lens: layerTitle,
      })
    : t("designlab.sidebar.ecosystem.empty.default", {
        lens: layerTitle,
      });

  const groupedExtensions = React.useMemo(
    () => groupExtensionFamilies(familyItems, "Extensions"),
    [familyItems],
  );

  const selectedExtension = React.useMemo(
    () =>
      familyItems.find((family) => family.familyId === selectedFamilyId)
      ?? familyItems[0]
      ?? null,
    [familyItems, selectedFamilyId],
  );

  const tierBreakdown = React.useMemo(() => {
    const breakdown = { pro: 0, enterprise: 0, community: 0 };
    familyItems.forEach((family) => {
      const { tone } = getExtensionTier(family);
      breakdown[tone] += 1;
    });
    return breakdown;
  }, [familyItems]);

  return (
    <div className="flex flex-col gap-4">
      {/* Enterprise context card */}
      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3.5"
        data-testid="design-lab-ecosystem-context-card"
      >
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {t("designlab.sidebar.context.ecosystem")}
        </Text>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Text variant="secondary" className="block text-xs leading-5">
              {layerTitle}
            </Text>
            <Text
              as="div"
              className="mt-1 text-sm font-semibold leading-6 text-text-primary"
            >
              {selectedExtension?.clusterTitle ?? t("designlab.sidebar.context.empty")}
            </Text>
          </div>
          <SectionBadge label={extensionCountLabel} />
        </div>
        <Text variant="secondary" className="mt-2 block text-xs leading-5">
          {selectedExtension?.intent ?? "Enterprise extension catalog"}
        </Text>
      </section>

      {/* Tier breakdown card */}
      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3"
        data-testid="design-lab-ecosystem-tier-breakdown"
      >
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          Extension Tiers
        </Text>
        <div className="flex flex-col mt-2.5 gap-1.5">
          <div
            className="flex items-center justify-between gap-2 rounded-xl bg-surface-default px-3 py-2"
            data-testid="design-lab-ecosystem-tier-pro"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <Text className="text-xs font-medium text-text-primary">Pro</Text>
            </div>
            <Text variant="secondary" className="shrink-0 text-[10px]">
              {tierBreakdown.pro} extensions
            </Text>
          </div>
          <div
            className="flex items-center justify-between gap-2 rounded-xl bg-surface-default px-3 py-2"
            data-testid="design-lab-ecosystem-tier-enterprise"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <Text className="text-xs font-medium text-text-primary">Enterprise</Text>
            </div>
            <Text variant="secondary" className="shrink-0 text-[10px]">
              {tierBreakdown.enterprise} extensions
            </Text>
          </div>
          <div
            className="flex items-center justify-between gap-2 rounded-xl bg-surface-default px-3 py-2"
            data-testid="design-lab-ecosystem-tier-community"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <Text className="text-xs font-medium text-text-primary">Community</Text>
            </div>
            <Text variant="secondary" className="shrink-0 text-[10px]">
              {tierBreakdown.community} extensions
            </Text>
          </div>
        </div>
      </section>

      {/* Extension catalog list */}
      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel p-2.5"
        data-testid="design-lab-ecosystem-catalog"
      >
        <div className="mb-3 flex items-center justify-between gap-2 px-2">
          <Text
            as="div"
            variant="secondary"
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            Extension Catalog
          </Text>
          <SectionBadge label={extensionCountLabel} />
        </div>
        <div className="flex flex-col gap-4" data-testid="design-lab-ecosystem-list">
          {familyItems.length ? (
            groupedExtensions.map((cluster) => (
              <section
                key={cluster.title}
                className="flex flex-col gap-2"
                data-testid={`design-lab-ecosystem-cluster-${toSidebarTestIdSuffix(cluster.title)}`}
              >
                <div className="px-2">
                  <div className="flex items-center justify-between gap-2">
                    <Text
                      as="div"
                      variant="secondary"
                      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    >
                      {cluster.title}
                    </Text>
                    <SectionBadge label={String(cluster.items.length)} />
                  </div>
                  {cluster.description ? (
                    <Text
                      variant="secondary"
                      className="mt-1 block text-xs leading-5"
                    >
                      {cluster.description}
                    </Text>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1.5">
                  {cluster.items.map((family) => {
                    const active = selectedFamilyId === family.familyId;
                    const { tier, tone } = getExtensionTier(family);
                    const surfaceKind = getExtensionSurfaceKind(family);
                    const supportLine = [surfaceKind, family.intent]
                      .filter(Boolean)
                      .join(" / ");

                    return (
                      <button
                        key={family.familyId}
                        type="button"
                        onClick={() => onFamilySelect(family.familyId)}
                        data-testid={`design-lab-ecosystem-ext-${toSidebarTestIdSuffix(family.familyId)}`}
                        className={`w-full scroll-mt-4 rounded-2xl border px-3.5 py-3 text-left transition ${
                          active
                            ? "border-action-primary/30 bg-surface-default shadow-xs ring-1 ring-action-primary/10"
                            : "border-border-subtle bg-surface-default hover:bg-surface-muted"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Text
                              as="div"
                              className="text-sm font-semibold text-text-primary"
                            >
                              {family.title ?? family.familyId}
                            </Text>
                            <Text
                              variant="secondary"
                              className="mt-1 block text-xs leading-5"
                            >
                              {supportLine}
                            </Text>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                                tone === "pro"
                                  ? "bg-violet-400"
                                  : tone === "enterprise"
                                    ? "bg-amber-400"
                                    : "bg-emerald-400"
                              }`} />
                              <Text variant="secondary" className="text-[10px]">
                                {tier}
                              </Text>
                              {family.ownerBlocks.length > 0 ? (
                                <Text variant="secondary" className="text-[10px]">
                                  {family.ownerBlocks.length} surfaces
                                </Text>
                              ) : null}
                            </div>
                          </div>
                          <div className="shrink-0">
                            <SectionBadge label={tier} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-[18px] border border-border-subtle bg-surface-canvas px-4 py-3.5">
              <Text variant="secondary" className="block text-sm leading-6">
                {extensionEmptyMessage}
              </Text>
              <Text
                variant="secondary"
                className="mt-2 block text-xs leading-6"
              >
                Enterprise extensions will appear here once configured.
              </Text>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
