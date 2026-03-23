import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LayoutGrid, PanelTop, Columns, PanelBottom, ArrowRight, Wrench } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  PageTemplateDetail — Individual page template                      */
/*                                                                     */
/*  Tabs: Overview · Regions · Components · Quality                    */
/* ------------------------------------------------------------------ */

type PageTab = "overview" | "regions" | "components" | "quality";
const PAGE_TABS: PageTab[] = ["overview", "regions", "components", "quality"];

export default function PageTemplateDetail() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { index, t } = useDesignLab();
  const [activeTab, setActiveTab] = useState<PageTab>("overview");

  const pageTemplate = useMemo(
    () => index.pages?.currentFamilies.find((f) => f.pageId === templateId),
    [index, templateId],
  );

  // Find components that belong to this page's sections
  const relatedComponents = useMemo(() => {
    if (!pageTemplate?.sectionIds?.length) return [];
    return index.items.filter((item) =>
      item.sectionIds?.some((sid) => pageTemplate.sectionIds?.includes(sid)),
    );
  }, [pageTemplate, index.items]);

  if (!pageTemplate) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 text-center">
        <Text variant="secondary">{t("designlab.detail.notFound")}</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <button type="button" onClick={() => navigate("/admin/design-lab")} className="hover:text-text-primary">
          {t("designlab.breadcrumb.library")}
        </button>
        <span>/</span>
        <button type="button" onClick={() => navigate("/admin/design-lab/pages")} className="hover:text-text-primary">
          {t("designlab.sidebar.title.pages")}
        </button>
        <span>/</span>
        <span className="text-text-primary">{pageTemplate.title}</span>
      </div>

      {/* Hero */}
      <div>
        {pageTemplate.clusterTitle && (
          <Text variant="secondary" className="text-xs font-semibold uppercase tracking-wider">
            {pageTemplate.clusterTitle}
          </Text>
        )}
        <Text as="div" className="mt-1 text-3xl font-bold tracking-tight text-text-primary">
          {pageTemplate.title}
        </Text>
        <Text variant="secondary" className="mt-2 max-w-2xl text-sm leading-6">
          {pageTemplate.intent}
        </Text>
        {pageTemplate.ownerBlocks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {pageTemplate.ownerBlocks.map((block) => (
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
          {PAGE_TABS.map((tab) => (
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
              {t(`designlab.page.tab.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <PageOverview pageTemplate={pageTemplate} relatedComponents={relatedComponents} />
        )}
        {activeTab === "regions" && (
          <PageRegions pageTemplate={pageTemplate} relatedComponents={relatedComponents} navigate={navigate} />
        )}
        {activeTab === "components" && (
          <PageComponents relatedComponents={relatedComponents} navigate={navigate} />
        )}
        {activeTab === "quality" && (
          <PageQuality />
        )}
      </div>
    </div>
  );
}

type PageFamily = NonNullable<
  ReturnType<typeof useDesignLab>["index"]["pages"]
>["currentFamilies"][number];

function PageOverview({
  pageTemplate,
  relatedComponents,
}: {
  pageTemplate: PageFamily;
  relatedComponents: ReturnType<typeof useDesignLab>["index"]["items"];
}) {
  const { t } = useDesignLab();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Intent */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
          {t("designlab.page.overview.intent")}
        </Text>
        <Text variant="secondary" className="text-sm leading-6">
          {pageTemplate.intent}
        </Text>
      </div>

      {/* Cluster */}
      {pageTemplate.clusterTitle && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.page.overview.cluster")}
          </Text>
          <Text className="text-sm font-medium text-text-primary">
            {pageTemplate.clusterTitle}
          </Text>
          {pageTemplate.clusterDescription && (
            <Text variant="secondary" className="mt-1 text-xs">
              {pageTemplate.clusterDescription}
            </Text>
          )}
        </div>
      )}

      {/* Owner blocks */}
      {pageTemplate.ownerBlocks.length > 0 && (
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.page.overview.ownerBlocks")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {pageTemplate.ownerBlocks.map((block) => (
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
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.page.overview.usedComponents")} ({relatedComponents.length})
          </Text>
          <div className="flex flex-wrap gap-2">
            {relatedComponents.slice(0, 10).map((comp) => (
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

/* ---- Zone heuristic mapping ---- */

const ZONE_KEYWORDS: Record<string, string[]> = {
  header: ["PageHeader", "MenuBar", "Navigation", "AppHeader", "Header"],
  toolbar: ["FilterBar", "SummaryStrip", "Tabs", "ActionBar", "Segmented", "SearchInput", "ReportFilterPanel"],
  main: ["AgGridServer", "EntityGrid", "TableSimple", "List", "Tree", "TreeTable", "DetailDrawer", "JsonViewer", "MasterDetail", "Empty", "EmptyState", "EmptyErrorLoading", "SearchFilterListing", "Card"],
  sidebar: ["EntitySummaryBlock", "Descriptions", "DetailSummary", "AnchorToc", "NotificationPanel"],
  footer: ["Pagination", "Badge", "StatusBar", "TablePagination"],
};

const ZONE_ICONS: Record<string, React.ReactNode> = {
  header: <PanelTop className="h-4 w-4" />,
  toolbar: <Columns className="h-4 w-4" />,
  main: <LayoutGrid className="h-4 w-4" />,
  sidebar: <Columns className="h-4 w-4" />,
  footer: <PanelBottom className="h-4 w-4" />,
  utilities: <Wrench className="h-4 w-4" />,
};

const ZONE_COLORS: Record<string, string> = {
  header: "border-blue-500/30 bg-blue-500/5",
  toolbar: "border-amber-500/30 bg-amber-500/5",
  main: "border-emerald-500/30 bg-emerald-500/5",
  sidebar: "border-violet-500/30 bg-violet-500/5",
  footer: "border-rose-500/30 bg-rose-500/5",
  utilities: "border-zinc-500/30 bg-zinc-500/5",
};

function classifyBlock(block: string): string {
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    if (keywords.some((kw) => block.includes(kw))) return zone;
  }
  return "utilities";
}

function PageRegions({
  pageTemplate,
  relatedComponents,
  navigate,
}: {
  pageTemplate: PageFamily;
  relatedComponents: ReturnType<typeof useDesignLab>["index"]["items"];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { t } = useDesignLab();

  const zones = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const block of pageTemplate.ownerBlocks) {
      const zone = classifyBlock(block);
      const list = map.get(zone) ?? [];
      list.push(block);
      map.set(zone, list);
    }
    return map;
  }, [pageTemplate.ownerBlocks]);

  if (pageTemplate.ownerBlocks.length === 0 && relatedComponents.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-8 text-center">
        <Text variant="secondary" className="text-sm">
          {t("designlab.page.regions.noRegions")}
        </Text>
      </div>
    );
  }

  const orderedZones = ["header", "toolbar", "main", "sidebar", "footer", "utilities"].filter(
    (z) => zones.has(z),
  );
  const hasMainAndSidebar = zones.has("main") && zones.has("sidebar");

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-text-secondary" />
        <Text as="div" className="text-sm font-semibold text-text-primary">
          {t("designlab.page.regions.wireframe")}
        </Text>
      </div>

      {/* Wireframe grid */}
      <div className="space-y-3">
        {orderedZones.map((zone) => {
          // main + sidebar rendered side by side
          if (zone === "sidebar" && hasMainAndSidebar) return null;

          if (zone === "main" && hasMainAndSidebar) {
            return (
              <div key="main-sidebar" className="grid gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ZoneCard zone="main" blocks={zones.get("main") ?? []} navigate={navigate} />
                </div>
                <ZoneCard zone="sidebar" blocks={zones.get("sidebar") ?? []} navigate={navigate} />
              </div>
            );
          }

          return (
            <ZoneCard key={zone} zone={zone} blocks={zones.get(zone) ?? []} navigate={navigate} />
          );
        })}
      </div>

      {/* Section components (not in any zone) */}
      {relatedComponents.length > 0 && (
        <div>
          <Text as="div" className="mb-3 text-sm font-semibold text-text-primary">
            {t("designlab.page.regions.sectionComponents")} ({relatedComponents.length})
          </Text>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedComponents.map((comp) => (
              <button
                key={comp.name}
                type="button"
                onClick={() =>
                  navigate(`/admin/design-lab/components/${comp.taxonomyGroupId}/${encodeURIComponent(comp.name.replace(/\//g, '~'))}`)
                }
                className="group flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-default p-3 text-left transition hover:border-action-primary/30 hover:shadow-xs"
              >
                <div className="flex-1 min-w-0">
                  <Text className="truncate text-xs font-semibold text-text-primary group-hover:text-action-primary">
                    {comp.name}
                  </Text>
                  <Text variant="secondary" className="truncate text-[10px]">
                    {comp.description}
                  </Text>
                </div>
                <ArrowRight className="h-3 w-3 shrink-0 text-text-secondary opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ZoneCard({
  zone,
  blocks,
  navigate,
}: {
  zone: string;
  blocks: string[];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { t } = useDesignLab();
  const color = ZONE_COLORS[zone] ?? ZONE_COLORS.utilities;
  const icon = ZONE_ICONS[zone] ?? ZONE_ICONS.utilities;
  const label = t(`designlab.page.regions.zone.${zone}`);

  return (
    <div className={`rounded-xl border-2 border-dashed p-4 ${color}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <Text as="div" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        {blocks.map((block) => (
          <button
            key={block}
            type="button"
            onClick={() => navigate(`/admin/design-lab/components/actions/${encodeURIComponent(block.replace(/\//g, '~'))}`)}
            className="rounded-lg bg-surface-default px-3 py-1.5 text-xs font-medium text-text-primary shadow-xs transition hover:bg-action-primary/10 hover:text-action-primary"
          >
            {block}
          </button>
        ))}
      </div>
    </div>
  );
}

function PageComponents({
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
          {t("designlab.page.components.empty")}
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

function PageQuality() {
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
