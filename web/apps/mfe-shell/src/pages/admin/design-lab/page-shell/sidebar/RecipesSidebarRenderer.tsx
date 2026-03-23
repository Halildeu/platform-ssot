import React from "react";
import { Text } from "@mfe/design-system";
import type { DesignLabSidebarRendererProps, DesignLabSidebarFamily } from "./sidebarRendererTypes";

const toSidebarTestIdSuffix = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const WORKFLOW_INTENT_SIGNALS: ReadonlyArray<{
  keywords: readonly string[];
  signal: string;
}> = [
  { keywords: ["dashboard", "kpi", "metric"], signal: "KPI ve karar" },
  { keywords: ["crud", "listing", "management"], signal: "Liste ve aksiyon" },
  { keywords: ["detail", "review", "approval", "inspector"], signal: "Inceleme ve karar" },
  { keywords: ["command", "workspace", "search", "filter"], signal: "Arama ve yonlendirme" },
  { keywords: ["settings", "configuration", "preference"], signal: "Ayar ve guardrail" },
  { keywords: ["empty", "error", "loading", "skeleton"], signal: "Durum ve feedback" },
  { keywords: ["ai", "prompt", "recommendation", "confidence"], signal: "AI workflow" },
  { keywords: ["form", "wizard", "onboarding", "step"], signal: "Form ve adim" },
  { keywords: ["export", "report", "download"], signal: "Cikti ve rapor" },
];

const getFamilyCardSignal = (family: {
  familyId: string;
  title?: string;
  clusterTitle?: string;
}) => {
  const normalized =
    `${family.familyId} ${family.title ?? ""} ${family.clusterTitle ?? ""}`.toLowerCase();
  const match = WORKFLOW_INTENT_SIGNALS.find((entry) =>
    entry.keywords.some((kw) => normalized.includes(kw)),
  );
  return match?.signal ?? "Workflow signal";
};

const getWorkflowComplexity = (family: {
  ownerBlocks: string[];
}): "simple" | "moderate" | "complex" => {
  const blockCount = family.ownerBlocks.length;
  if (blockCount >= 6) return "complex";
  if (blockCount >= 3) return "moderate";
  return "simple";
};

const groupFamilies = (families: DesignLabSidebarFamily[], fallbackTitle: string) => {
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
 * Recipes layer sidebar renderer.
 *
 * Shows recipe cluster list grouped by workflow clusters.
 *
 * Contract (from layer-contract-matrix):
 * - mustContain: recipe cluster list, recipe context card, recipe-specific search copy
 * - mustNotContain: component tree, foundation token tree, page template gallery
 */
export const RecipesSidebarRenderer: React.FC<DesignLabSidebarRendererProps> = ({
  layerTitle,
  familyItems,
  selectedFamilyId,
  onFamilySelect,
  sidebarSearchValue,
  SectionBadgeComponent,
  t,
}) => {
  const SectionBadge = SectionBadgeComponent;
  const familyCountLabel = t("designlab.sidebar.recipe.count", {
    count: familyItems.length,
  });
  const familyEmptyMessage = sidebarSearchValue.trim()
    ? t("designlab.sidebar.recipe.empty.search", {
        query: sidebarSearchValue,
        lens: layerTitle,
      })
    : t("designlab.sidebar.recipe.empty.default", {
        lens: layerTitle,
      });

  const groupedFamilyItems = React.useMemo(
    () => groupFamilies(familyItems, "General recipes"),
    [familyItems],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3.5">
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {t("designlab.sidebar.context.recipes")}
        </Text>
        <Text
          as="div"
          className="mt-2 text-sm font-semibold leading-6 text-text-primary"
        >
          {layerTitle}
        </Text>
        <Text variant="secondary" className="mt-1 block text-xs leading-5">
          {familyCountLabel}
        </Text>
      </section>

      <section className="rounded-[22px] border border-border-subtle bg-surface-panel p-2.5">
        <div className="mb-3 flex items-center justify-between gap-2 px-2">
          <Text
            as="div"
            variant="secondary"
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {t("designlab.sidebar.recipeList.title")}
          </Text>
          <SectionBadge label={familyCountLabel} />
        </div>
        <div className="space-y-4" data-testid="design-lab-recipe-list">
          {familyItems.length ? (
            groupedFamilyItems.map((cluster) => (
              <section
                key={cluster.title}
                className="space-y-2"
                data-testid={`design-lab-recipe-cluster-${toSidebarTestIdSuffix(cluster.title)}`}
              >
                <div className="px-2">
                  <div className="flex items-center justify-between gap-2">
                    <Text
                      as="div"
                      variant="secondary"
                      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                      data-testid={`design-lab-recipe-cluster-summary-${toSidebarTestIdSuffix(cluster.title)}`}
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
                <div className="space-y-1.5">
                  {cluster.items.map((family) => {
                    const active = selectedFamilyId === family.familyId;
                    const familySignal =
                      family.primarySectionTitle ?? getFamilyCardSignal(family);
                    const complexity = getWorkflowComplexity(family);
                    const familySupportLine = [familySignal, family.intent]
                      .filter(Boolean)
                      .join(" / ");

                    return (
                      <button
                        key={family.familyId}
                        type="button"
                        onClick={() => onFamilySelect(family.familyId)}
                        data-testid={`design-lab-recipe-${toSidebarTestIdSuffix(family.familyId)}`}
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
                              {familySupportLine}
                            </Text>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                                complexity === "complex"
                                  ? "bg-red-400"
                                  : complexity === "moderate"
                                    ? "bg-amber-400"
                                    : "bg-emerald-400"
                              }`} />
                              <Text variant="secondary" className="text-[10px]">
                                {family.ownerBlocks.length} blocks
                              </Text>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <SectionBadge label={familySignal} />
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
                {familyEmptyMessage}
              </Text>
              <Text
                variant="secondary"
                className="mt-2 block text-xs leading-6"
              >
                {t("designlab.sidebar.recipe.empty.hint")}
              </Text>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
