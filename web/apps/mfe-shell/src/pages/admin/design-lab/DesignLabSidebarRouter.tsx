import React, { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircleHelp, Search, Menu,
  Palette, SlidersHorizontal, Shapes, Box, Layout, Database, BookOpen, Globe,
} from "lucide-react";
import { IconButton, Text, Tooltip } from "@mfe/design-system";
import { useDesignLabI18n } from "./useDesignLabI18n";
import { useDesignLab } from "./DesignLabProvider";
import { useDesignLabShell } from "./DesignLabShell";

/* ------------------------------------------------------------------ */
/*  DesignLabSidebarRouter — Route-aware sidebar                       */
/*                                                                     */
/*  Reads the current URL to determine the active layer and item.      */
/*  No query-param state — purely URL-driven.                          */
/* ------------------------------------------------------------------ */

type LayerId =
  | "design"
  | "theme"
  | "primitives"
  | "components"
  | "patterns"
  | "advanced"
  | "recipes"
  | "ecosystem";

const LAYER_IDS: LayerId[] = [
  "design",
  "theme",
  "primitives",
  "components",
  "patterns",
  "advanced",
  "recipes",
  "ecosystem",
];

const LAYER_ICONS: Record<LayerId, React.ReactNode> = {
  design: <Palette className="h-4 w-4" />,
  theme: <SlidersHorizontal className="h-4 w-4" />,
  primitives: <Shapes className="h-4 w-4" />,
  components: <Box className="h-4 w-4" />,
  patterns: <Layout className="h-4 w-4" />,
  advanced: <Database className="h-4 w-4" />,
  recipes: <BookOpen className="h-4 w-4" />,
  ecosystem: <Globe className="h-4 w-4" />,
};

/* ---- Tier sets used by sidebar counts and content filtering ---- */

export const PRIMITIVE_NAMES = new Set([
  "Text", "Button", "IconButton", "Badge", "Tag", "Avatar", "Spinner",
  "Skeleton", "Divider", "Icon", "Link", "Label", "Input", "Textarea",
  "Select", "Checkbox", "RadioButton", "Switch", "Slider", "Tooltip",
  "Popover", "Portal", "VisuallyHidden", "FocusTrap",
]);

export const ADVANCED_NAMES = new Set([
  "EntityGrid", "AgGridServer", "TreeTable",
  /* X-Data-Grid */
  "DataGridFilterChips", "DataGridSelectionBar", "ServerDataSource",
  "MasterDetailGrid", "TreeDataGrid", "PivotGrid", "EditableGrid", "RowGroupingGrid",
  /* X-Charts */
  "ChartContainer", "ScatterChart", "RadarChart", "TreemapChart",
  "HeatmapChart", "GaugeChart", "WaterfallChart",
  "KPICard", "SparklineChart", "MiniChart", "ChartDashboard", "StatWidget", "ChartLegend",
  /* X-Scheduler */
  "Scheduler", "SchedulerEvent", "SchedulerToolbar", "useScheduler",
  "AgendaView", "ResourceView", "EventForm",
  /* X-Kanban */
  "KanbanBoard", "KanbanColumn", "KanbanCard", "KanbanToolbar",
  "KanbanSwimlane", "KanbanCardDetail", "KanbanMetrics",
  /* X-Editor */
  "RichTextEditor", "EditorToolbar", "EditorMenuBubble",
  "SlashCommandMenu", "MentionList", "EditorTableMenu", "EditorLinkDialog", "EditorImageUpload",
  /* X-FormBuilder */
  "FormRenderer", "FieldRenderer", "FormPreview",
  "MultiStepForm", "FormSummary", "RepeatableFieldGroup", "FieldRegistry",
]);

const DESIGN_TOKEN_GROUPS = [
  "colors", "typography", "spacing", "radius", "motion", "zindex",
] as const;

const THEME_AXES = [
  "appearance", "density", "radius", "elevation", "motion",
  "tableSurfaceTone", "surfaceTone", "accent", "overlayIntensity", "overlayOpacity",
] as const;

/** Map legacy paths to new layer IDs */
const LAYER_ALIASES: Record<string, LayerId> = {
  foundations: "design",
  pages: "patterns",
};

function resolveLayerFromPath(pathname: string): LayerId {
  const segments = pathname.replace(/^\/admin\/design-lab\/?/, "").split("/");
  const first = segments[0];
  const aliased = LAYER_ALIASES[first] ?? first;
  if (LAYER_IDS.includes(aliased as LayerId)) return aliased as LayerId;
  return "components";
}

function resolveActiveItemFromPath(pathname: string): string | null {
  const segments = pathname
    .replace(/^\/admin\/design-lab\/?/, "")
    .split("/")
    .filter(Boolean);
  // e.g. ["components", "actions", "Button"] → "Button"
  // e.g. ["recipes", "search_filter_listing"] → "search_filter_listing"
  if (segments.length >= 2) return segments[segments.length - 1];
  return null;
}

export const DesignLabSidebarRouter: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useDesignLabI18n();
  const { index, taxonomy } = useDesignLab();
  const { toggleSidebar, closeSidebar } = useDesignLabShell();

  const activeLayer = useMemo(() => resolveLayerFromPath(pathname), [pathname]);
  const activeItem = useMemo(
    () => resolveActiveItemFromPath(pathname),
    [pathname],
  );

  const [searchValue, setSearchValue] = React.useState("");

  const layerTitle = t(`designlab.sidebar.title.${activeLayer}`);
  const layerHelpText = t(`designlab.sidebar.help.${activeLayer}`);
  const searchPlaceholder = t(
    `designlab.sidebar.search.${activeLayer}.placeholder`,
  );

  /* Count for current layer */
  const layerItemCount = useMemo(() => {
    switch (activeLayer) {
      case "design":
        return 6; // colors, typography, spacing, radius, motion, zIndex
      case "theme":
        return 10; // 10 theme axes
      case "primitives":
        return PRIMITIVE_NAMES.size;
      case "components":
        return index.items.filter(
          (i) => i.availability === "exported" && !PRIMITIVE_NAMES.has(i.name),
        ).length;
      case "patterns":
        return index.pages?.currentFamilies.length ?? 0;
      case "advanced":
        return ADVANCED_NAMES.size;
      case "recipes":
        return index.recipes?.currentFamilies.length ?? 0;
      case "ecosystem":
        return index.ecosystem?.currentFamilies.length ?? 0;
    }
  }, [activeLayer, index]);

  const handleLayerSwitch = (layerId: LayerId) => {
    navigate(`/admin/design-lab/${layerId}`);
  };

  const handleItemSelect = (itemPath: string) => {
    navigate(itemPath);
    closeSidebar();
  };

  return (
    <aside
      data-testid="design-lab-sidebar"
      className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-sm"
    >
      {/* Mobile menu toggle */}
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2 sm:hidden">
        <Text className="text-sm font-semibold">{t("designlab.breadcrumb.library")}</Text>
        <IconButton
          icon={<Menu className="h-4 w-4" />}
          label="Close menu"
          size="sm"
          variant="ghost"
          onClick={toggleSidebar}
        />
      </div>

      {/* Layer tabs — icon pills */}
      <div className="border-b border-border-subtle p-2">
        <div className="flex gap-1">
          {LAYER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleLayerSwitch(id)}
              data-testid={`design-lab-layer-tab-${id}`}
              className={[
                "flex flex-1 items-center justify-center rounded-lg py-2 transition-all duration-200",
                activeLayer === id
                  ? "bg-action-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              ].join(" ")}
              title={t(`designlab.sidebar.title.${id}`)}
            >
              {LAYER_ICONS[id]}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border-subtle px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 pr-2">
            <Text
              as="div"
              className="text-[1.2rem] font-semibold leading-tight text-text-primary"
            >
              {layerTitle}
            </Text>
            <Text variant="secondary" className="mt-1 block text-xs leading-5">
              {t("designlab.sidebar.itemCount", { count: layerItemCount })}
            </Text>
          </div>
          <Tooltip text={layerHelpText}>
            <span className="shrink-0">
              <IconButton
                icon={<CircleHelp className="h-4 w-4" />}
                label={t("designlab.sidebar.context.title")}
                size="sm"
                variant="ghost"
              />
            </span>
          </Tooltip>
        </div>

        {/* Search */}
        <div className="mt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              data-testid="design-lab-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-2xl border border-border-subtle bg-surface-canvas pl-10 pr-14 text-sm text-text-primary shadow-none transition focus:border-border-default focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
              aria-label={t("designlab.sidebar.search.aria")}
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border-subtle bg-surface-default px-1.5 py-0.5 text-[10px] font-medium text-text-secondary sm:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Layer content — scrollable list */}
      <div className="min-h-0 flex-1 overflow-auto px-3 py-4" data-testid="design-lab-sidebar-scroll">
        <SidebarLayerContent
          layer={activeLayer}
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={handleItemSelect}
        />
      </div>
    </aside>
  );
};

/* ------------------------------------------------------------------ */
/*  Layer-specific content renderers                                   */
/* ------------------------------------------------------------------ */

type SidebarLayerContentProps = {
  layer: LayerId;
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
};

function SidebarLayerContent({
  layer,
  activeItem,
  searchValue,
  onItemSelect,
}: SidebarLayerContentProps) {
  switch (layer) {
    case "design":
      return (
        <DesignTokensSidebarContent
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "theme":
      return (
        <ThemeSidebarContent
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "primitives":
      return (
        <PrimitivesSidebarContent
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "components":
      return (
        <ComponentsSidebarContent
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "patterns":
      return (
        <FamilySidebarContent
          layer="pages"
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "advanced":
      return (
        <AdvancedSidebarContent
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "recipes":
      return (
        <FamilySidebarContent
          layer="recipes"
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
    case "ecosystem":
      return (
        <FamilySidebarContent
          layer="ecosystem"
          activeItem={activeItem}
          searchValue={searchValue}
          onItemSelect={onItemSelect}
        />
      );
  }
}

/* ---- Design Tokens sidebar ---- */

function DesignTokensSidebarContent({
  activeItem,
  searchValue,
  onItemSelect,
}: {
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
}) {
  const { t } = useDesignLabI18n();

  const groups = useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    return DESIGN_TOKEN_GROUPS.filter((id) => {
      if (!query) return true;
      const title = t(`designlab.tokenGroup.${id}.title`).toLowerCase();
      return title.includes(query) || id.includes(query);
    }).map((id) => ({
      id,
      title: t(`designlab.tokenGroup.${id}.title`),
      description: t(`designlab.tokenGroup.${id}.description`),
    }));
  }, [searchValue, t]);

  return (
    <div className="space-y-1.5">
      {groups.map((group) => (
        <SidebarItemButton
          key={group.id}
          active={activeItem === group.id}
          title={group.title}
          subtitle={group.description}
          onClick={() => onItemSelect(`/admin/design-lab/design/${group.id}`)}
        />
      ))}
      {groups.length === 0 && (
        <EmptySidebarMessage searchValue={searchValue} />
      )}
    </div>
  );
}

/* ---- Theme sidebar ---- */

function ThemeSidebarContent({
  activeItem,
  searchValue,
  onItemSelect,
}: {
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
}) {
  const { t } = useDesignLabI18n();

  const axes = useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    return THEME_AXES.filter((id) => {
      if (!query) return true;
      const title = t(`designlab.themeAxis.${id}.title`).toLowerCase();
      return title.includes(query) || id.includes(query);
    }).map((id) => ({
      id,
      title: t(`designlab.themeAxis.${id}.title`),
      description: t(`designlab.themeAxis.${id}.description`),
    }));
  }, [searchValue, t]);

  return (
    <div className="space-y-1.5">
      {axes.map((axis) => (
        <SidebarItemButton
          key={axis.id}
          active={activeItem === axis.id}
          title={axis.title}
          subtitle={axis.description}
          onClick={() => onItemSelect(`/admin/design-lab/theme/${axis.id}`)}
        />
      ))}
      {axes.length === 0 && (
        <EmptySidebarMessage searchValue={searchValue} />
      )}
    </div>
  );
}

/* ---- Primitives sidebar ---- */

function PrimitivesSidebarContent({
  activeItem,
  searchValue,
  onItemSelect,
}: {
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
}) {
  const { index, taxonomy } = useDesignLab();

  const items = useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    return index.items
      .filter((i) => i.availability === "exported" && PRIMITIVE_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({
        name: i.name,
        description: i.description,
        lifecycle: i.lifecycle,
        groupId: i.taxonomyGroupId,
      }));
  }, [index, searchValue]);

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <SidebarItemButton
          key={item.name}
          active={activeItem === item.name}
          title={item.name}
          subtitle={item.description}
          badge={item.lifecycle}
          onClick={() =>
            onItemSelect(`/admin/design-lab/primitives/${item.groupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`)
          }
        />
      ))}
      {items.length === 0 && (
        <EmptySidebarMessage searchValue={searchValue} />
      )}
    </div>
  );
}

/* ---- Advanced sidebar ---- */

function AdvancedSidebarContent({
  activeItem,
  searchValue,
  onItemSelect,
}: {
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
}) {
  const { index } = useDesignLab();

  const items = useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    return index.items
      .filter((i) => ADVANCED_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({
        name: i.name,
        description: i.description,
        lifecycle: i.lifecycle,
      }));
  }, [index, searchValue]);

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <SidebarItemButton
          key={item.name}
          active={activeItem === item.name}
          title={item.name}
          subtitle={item.description}
          badge={item.lifecycle}
          onClick={() =>
            onItemSelect(`/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, '~'))}`)
          }
        />
      ))}
      {items.length === 0 && (
        <EmptySidebarMessage searchValue={searchValue} />
      )}
    </div>
  );
}

/* ---- Components sidebar (grouped by taxonomy) ---- */

function ComponentsSidebarContent({
  activeItem,
  searchValue,
  onItemSelect,
}: {
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
}) {
  const { index, taxonomy } = useDesignLab();

  const groups = useMemo(() => {
    const query = searchValue.toLowerCase().trim();

    return taxonomy.groups
      .map((group) => ({
        ...group,
        subgroups: group.subgroups
          .map((sg) => ({
            ...sg,
            items: sg.items.filter((itemName) => {
              // Exclude primitives and advanced from the components layer
              if (PRIMITIVE_NAMES.has(itemName) || ADVANCED_NAMES.has(itemName)) return false;
              if (!query) return true;
              return itemName.toLowerCase().includes(query);
            }),
          }))
          .filter((sg) => sg.items.length > 0),
      }))
      .filter((g) => g.subgroups.length > 0);
  }, [taxonomy, searchValue]);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id}>
          <Text
            as="div"
            variant="secondary"
            className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {group.label}
          </Text>
          <div className="space-y-1">
            {group.subgroups.flatMap((sg) =>
              sg.items.map((itemName) => {
                const indexItem = index.items.find((i) => i.name === itemName);
                return (
                  <SidebarItemButton
                    key={itemName}
                    active={activeItem === itemName}
                    title={itemName}
                    subtitle={indexItem?.description}
                    badge={indexItem?.lifecycle}
                    onClick={() =>
                      onItemSelect(
                        `/admin/design-lab/components/${group.id}/${encodeURIComponent(itemName.replace(/\//g, '~'))}`,
                      )
                    }
                  />
                );
              }),
            )}
          </div>
        </div>
      ))}
      {groups.length === 0 && (
        <EmptySidebarMessage searchValue={searchValue} />
      )}
    </div>
  );
}

/* ---- Family-based sidebar (Recipes / Pages / Ecosystem) ---- */

function FamilySidebarContent({
  layer,
  activeItem,
  searchValue,
  onItemSelect,
}: {
  layer: "recipes" | "pages" | "ecosystem";
  activeItem: string | null;
  searchValue: string;
  onItemSelect: (path: string) => void;
}) {
  const { index, t } = useDesignLab();

  const families = useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    let rawFamilies: Array<{
      id: string;
      title: string;
      intent: string;
      clusterTitle?: string;
    }> = [];

    if (layer === "recipes") {
      rawFamilies =
        index.recipes?.currentFamilies.map((f) => ({
          id: f.recipeId,
          title: f.title,
          intent: f.intent,
        })) ?? [];
    } else if (layer === "pages") {
      rawFamilies =
        index.pages?.currentFamilies.map((f) => ({
          id: f.pageId,
          title: f.title,
          intent: f.intent,
          clusterTitle: f.clusterTitle,
        })) ?? [];
    } else {
      rawFamilies =
        index.ecosystem?.currentFamilies.map((f) => ({
          id: f.extensionId,
          title: f.title,
          intent: f.intent,
        })) ?? [];
    }

    if (!query) return rawFamilies;

    return rawFamilies.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query) ||
        f.intent.toLowerCase().includes(query),
    );
  }, [layer, index, searchValue]);

  // "pages" data layer maps to "/patterns" route
  const routeSegment = layer === "pages" ? "patterns" : layer;
  const basePath = `/admin/design-lab/${routeSegment}`;

  return (
    <div className="space-y-1.5">
      {families.map((family) => (
        <SidebarItemButton
          key={family.id}
          active={activeItem === family.id}
          title={family.title}
          subtitle={family.intent}
          onClick={() => onItemSelect(`${basePath}/${family.id}`)}
        />
      ))}
      {families.length === 0 && (
        <EmptySidebarMessage searchValue={searchValue} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared sidebar UI primitives                                       */
/* ------------------------------------------------------------------ */

function SidebarItemButton({
  active,
  title,
  subtitle,
  badge,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Scroll active item into view on mount
  useEffect(() => {
    if (active && btnRef.current) {
      // Delay to allow DOM render before scrolling
      const timer = setTimeout(() => {
        btnRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      className={[
        "w-full scroll-mt-4 rounded-2xl border px-3.5 py-3 text-left transition",
        active
          ? "border-action-primary/30 bg-surface-default shadow-sm ring-1 ring-action-primary/10"
          : "border-transparent bg-transparent hover:bg-surface-muted",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <Text as="div" className="truncate text-sm font-medium text-text-primary">
          {title}
        </Text>
        {badge && (
          <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <Text variant="secondary" className="mt-0.5 line-clamp-2 text-xs leading-5">
          {subtitle}
        </Text>
      )}
    </button>
  );
}

function EmptySidebarMessage({ searchValue }: { searchValue: string }) {
  const { t } = useDesignLabI18n();
  return (
    <div className="rounded-[18px] border border-border-subtle bg-surface-canvas px-4 py-3.5">
      <Text variant="secondary" className="block text-sm leading-6">
        {searchValue.trim()
          ? t("designlab.sidebar.empty.search", { query: searchValue })
          : t("designlab.sidebar.empty.default")}
      </Text>
    </div>
  );
}

export default DesignLabSidebarRouter;
