import React from "react";
import { Text } from "@mfe/design-system";
import type { DesignLabSidebarRendererProps, DesignLabSidebarFamily } from "./sidebarRendererTypes";

const toSidebarTestIdSuffix = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const getPageTemplateSignal = (family: {
  familyId: string;
  title?: string;
  clusterTitle?: string;
}) => {
  const normalized =
    `${family.familyId} ${family.title ?? ""} ${family.clusterTitle ?? ""}`.toLowerCase();
  if (normalized.includes("dashboard")) return "Dashboard";
  if (normalized.includes("settings") || normalized.includes("configuration"))
    return "Settings";
  if (normalized.includes("detail") || normalized.includes("review") || normalized.includes("approval"))
    return "Detail";
  if (normalized.includes("command") || normalized.includes("search") || normalized.includes("workspace"))
    return "Workspace";
  if (normalized.includes("crud") || normalized.includes("listing"))
    return "Management";
  return "Template";
};

const groupPageFamilies = (families: DesignLabSidebarFamily[], fallbackTitle: string) => {
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
 * Pages layer sidebar renderer.
 *
 * Shows page template families grouped by template type.
 *
 * Contract (from layer-contract-matrix):
 * - mustContain: page family or template list, page context card, page-specific search copy
 * - mustNotContain: recipe wording as primary navigation, component tree, token governance tree
 */
export const PagesSidebarRenderer: React.FC<DesignLabSidebarRendererProps> = ({
  layerTitle,
  familyItems,
  selectedFamilyId,
  onFamilySelect,
  sidebarSearchValue,
  SectionBadgeComponent,
  t,
}) => {
  const SectionBadge = SectionBadgeComponent;
  const pageCountLabel = t("designlab.sidebar.page.count", {
    count: familyItems.length,
  });
  const pageEmptyMessage = sidebarSearchValue.trim()
    ? t("designlab.sidebar.page.empty.search", {
        query: sidebarSearchValue,
        lens: layerTitle,
      })
    : t("designlab.sidebar.page.empty.default", {
        lens: layerTitle,
      });

  const groupedPageFamilies = React.useMemo(
    () => groupPageFamilies(familyItems, "Page templates"),
    [familyItems],
  );

  const selectedPageTemplate = React.useMemo(
    () =>
      familyItems.find((family) => family.familyId === selectedFamilyId)
      ?? familyItems[0]
      ?? null,
    [familyItems, selectedFamilyId],
  );

  return (
    <div className="flex flex-col gap-4">
      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel px-3.5 py-3.5"
        data-testid="design-lab-page-context-card"
      >
        <Text
          as="div"
          variant="secondary"
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {t("designlab.sidebar.context.pages")}
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
              {selectedPageTemplate?.clusterTitle ?? t("designlab.sidebar.context.empty")}
            </Text>
          </div>
          <SectionBadge label={pageCountLabel} />
        </div>
        <Text variant="secondary" className="mt-2 block text-xs leading-5">
          {selectedPageTemplate?.intent ?? t("designlab.sidebar.page.empty.hint")}
        </Text>
      </section>

      <section
        className="rounded-[22px] border border-border-subtle bg-surface-panel p-2.5"
        data-testid="design-lab-page-template-list"
      >
        <div className="mb-3 flex items-center justify-between gap-2 px-2">
          <Text
            as="div"
            variant="secondary"
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {t("designlab.sidebar.pageList.title")}
          </Text>
          <SectionBadge label={pageCountLabel} />
        </div>
        <div className="flex flex-col gap-4">
          {groupedPageFamilies.length ? (
            groupedPageFamilies.map((cluster) => (
              <section
                key={cluster.title}
                className="flex flex-col gap-2"
                data-testid={`design-lab-page-family-${toSidebarTestIdSuffix(cluster.title)}`}
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
                    const templateSignal = getPageTemplateSignal(family);
                    const supportLine = [templateSignal, family.intent]
                      .filter(Boolean)
                      .join(" / ");

                    return (
                      <button
                        key={family.familyId}
                        type="button"
                        onClick={() => onFamilySelect(family.familyId)}
                        data-testid={`design-lab-page-template-${toSidebarTestIdSuffix(family.familyId)}`}
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
                          </div>
                          <div className="shrink-0">
                            <SectionBadge label={templateSignal} />
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
                {pageEmptyMessage}
              </Text>
              <Text
                variant="secondary"
                className="mt-2 block text-xs leading-6"
              >
                {t("designlab.sidebar.page.empty.hint")}
              </Text>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
