import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircleHelp, Menu, ChevronDown, Star,
  Palette, Shapes, Box, Layout, BookOpen, Globe, Code,
} from "lucide-react";
import { IconButton, Text } from "@mfe/design-system";
import { useDesignLabI18n } from "./useDesignLabI18n";
import { useDesignLab } from "./DesignLabProvider";
import { useDesignLabShell } from "./DesignLabShell";
import {
  PRIMITIVE_NAMES,
  ADVANCED_NAMES,
  API_NAMES,
} from "./DesignLabSidebarRouter";

/* Sidebar v3 modules */
import {
  SidebarHealthBanner,
  SidebarBreadcrumb,
  SidebarSearchEnhanced,
  HighlightedLabel,
  SidebarFilterBar,
  useFilterState,
  SidebarFavorites,
  SidebarRecentlyViewed,
  ContextMenuProvider,
  useContextMenu,
  buildComponentMenuItems,
  HoverPreviewProvider,
  useHoverPreview,
  SidebarQuickActions,
  SidebarGroupProgress,
  type PreviewData,
} from "./sidebar/sections";
import {
  useSidebarFavorites,
  useSidebarRecents,
  useSidebarGroupState,
  useFuzzySearch,
  type HighlightRange,
} from "./sidebar/hooks";

/* ------------------------------------------------------------------ */
/*  DesignLabAppSidebar v2 — World-Class Component Navigation          */
/*                                                                     */
/*  Features: Health banner, breadcrumb, fuzzy search with highlight,  */
/*  filter chips, favorites, recently viewed, group state memory,      */
/*  keyboard navigation, pin-on-hover.                                 */
/* ------------------------------------------------------------------ */

type LayerId =
  | "foundations"
  | "primitives"
  | "components"
  | "patterns"
  | "apis"
  | "recipes"
  | "ecosystem";

const LAYER_IDS: LayerId[] = [
  "foundations", "primitives", "components", "patterns",
  "apis", "recipes", "ecosystem",
];

const LAYER_ICONS: Record<LayerId, React.ReactNode> = {
  foundations: <Palette className="h-4 w-4" />,
  primitives: <Shapes className="h-4 w-4" />,
  components: <Box className="h-4 w-4" />,
  patterns: <Layout className="h-4 w-4" />,
  apis: <Code className="h-4 w-4" />,
  recipes: <BookOpen className="h-4 w-4" />,
  ecosystem: <Globe className="h-4 w-4" />,
};

const DESIGN_TOKEN_GROUPS = [
  "colors", "typography", "spacing", "radius", "motion", "zindex",
] as const;

const THEME_AXES = [
  "appearance", "density", "radius", "elevation", "motion",
  "tableSurfaceTone", "surfaceTone", "accent", "overlayIntensity", "overlayOpacity",
] as const;

const LAYER_ALIASES: Record<string, LayerId> = {
  design: "foundations",
  theme: "foundations",
  advanced: "patterns",
  pages: "patterns",
};

/* ---- Route helpers ---- */

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
  if (segments.length >= 2) return segments[segments.length - 1];
  return null;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export const DesignLabAppSidebar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useDesignLabI18n();
  const { index, taxonomy } = useDesignLab();
  const { toggleSidebar, closeSidebar } = useDesignLabShell();

  const activeLayer = useMemo(() => resolveLayerFromPath(pathname), [pathname]);
  const activeItem = useMemo(() => resolveActiveItemFromPath(pathname), [pathname]);

  /* New v2 hooks */
  const { favorites, isFavorite, toggle: toggleFavorite } = useSidebarFavorites();
  const { recents, track: trackRecent } = useSidebarRecents();
  const groupState = useSidebarGroupState(activeLayer);
  const { filters, setFilters, matches: filterMatches } = useFilterState();
  const [allGroupsOpen, setAllGroupsOpen] = useState<boolean | null>(null); // null = use individual state

  /* All searchable items for fuzzy search */
  const searchableItems = useMemo(() => {
    return index.items
      .filter((i) => i.availability === "exported")
      .map((i) => ({ name: i.name, lifecycle: i.lifecycle, demoMode: i.demoMode }));
  }, [index]);

  const fuzzy = useFuzzySearch(searchableItems);

  /* Auto-track recent visits */
  useEffect(() => {
    if (activeItem) {
      trackRecent({ name: activeItem, layer: activeLayer, path: pathname });
    }
  }, [pathname, activeItem, activeLayer, trackRecent]);

  const layerTitle = t(`designlab.sidebar.title.${activeLayer}`);
  const layerHelpText = t(`designlab.sidebar.help.${activeLayer}`);

  /* Count for current layer */
  const layerItemCount = useMemo(() => {
    switch (activeLayer) {
      case "foundations": return 16;
      case "primitives": return PRIMITIVE_NAMES.size;
      case "components":
        return index.items.filter(
          (i) => i.availability === "exported" && !PRIMITIVE_NAMES.has(i.name) && !API_NAMES.has(i.name) && !ADVANCED_NAMES.has(i.name),
        ).length;
      case "patterns":
        return (index.pages?.currentFamilies.length ?? 0) + ADVANCED_NAMES.size;
      case "apis": return API_NAMES.size;
      case "recipes": return index.recipes?.currentFamilies.length ?? 0;
      case "ecosystem":
        return (index.ecosystem?.currentFamilies.length ?? 0) +
          index.items.filter((i) =>
            ["x_data_grid", "x_charts", "x_scheduler", "x_kanban", "x_editor", "x_form_builder"].includes(i.taxonomyGroupId) && i.availability === "exported",
          ).length;
    }
  }, [activeLayer, index]);

  const handleLayerSwitch = useCallback((layerId: LayerId) => {
    navigate(`/admin/design-lab/${layerId}`);
    fuzzy.clear();
  }, [navigate, fuzzy]);

  const handleItemSelect = useCallback((itemPath: string) => {
    navigate(itemPath);
    closeSidebar();
    fuzzy.saveSearch(fuzzy.query);
    fuzzy.clear();
  }, [navigate, closeSidebar, fuzzy]);

  /* Fuzzy search highlight ranges for a given item name */
  const getHighlightRanges = useCallback((name: string): HighlightRange[] => {
    if (!fuzzy.isSearching) return [];
    const match = fuzzy.results.find((r) => r.item.name === name);
    return match?.ranges ?? [];
  }, [fuzzy.isSearching, fuzzy.results]);

  /* Filter + search combined matching */
  const isItemVisible = useCallback((item: { name: string; lifecycle?: string; demoMode?: string }) => {
    if (!filterMatches(item)) return false;
    if (fuzzy.isSearching) {
      return fuzzy.results.some((r) => r.item.name === item.name);
    }
    return true;
  }, [filterMatches, fuzzy.isSearching, fuzzy.results]);

  /* Build nav content */
  const navContent = useMemo(() => {
    const query = fuzzy.isSearching ? "" : ""; // Fuzzy handles filtering

    switch (activeLayer) {
      case "foundations":
        return <FoundationsNav activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} />;
      case "primitives":
        return <PrimitivesNav activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} getHighlightRanges={getHighlightRanges} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
      case "components":
        return <ComponentsNav activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} getHighlightRanges={getHighlightRanges} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} groupState={groupState} filterMatches={filterMatches} allGroupsOpen={allGroupsOpen} />;
      case "patterns":
        return <PatternsNav activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} getHighlightRanges={getHighlightRanges} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
      case "apis":
        return <ApisNav activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} getHighlightRanges={getHighlightRanges} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
      case "recipes":
        return <FamilyNav layer="recipes" activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} />;
      case "ecosystem":
        return <FamilyNav layer="ecosystem" activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} />;
    }
  }, [activeLayer, activeItem, fuzzy.query, fuzzy.isSearching, handleItemSelect, getHighlightRanges, isFavorite, toggleFavorite, groupState, filterMatches]);

  return (
    <ContextMenuProvider>
    <HoverPreviewProvider>
    <aside className="flex h-full w-full flex-col overflow-hidden bg-surface-default text-text-primary" aria-label="Design Lab sidebar">
        {/* Mobile menu toggle */}
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2 sm:hidden">
          <Text className="text-sm font-semibold">Design Lab</Text>
          <IconButton icon={<Menu className="h-4 w-4" />} label="Close menu" size="sm" variant="ghost" onClick={toggleSidebar} />
        </div>

        {/* Health Banner */}
        <div className="shrink-0">
          <SidebarHealthBanner />
        </div>

        {/* Layer tabs — icon pills */}
        <div className="shrink-0 border-b border-border-subtle p-2">
          <div className="flex gap-1">
            {LAYER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleLayerSwitch(id)}
                data-testid={`design-lab-layer-tab-${id}`}
                className={[
                  "flex flex-1 items-center justify-center rounded-lg py-2 transition-all duration-200 cursor-pointer",
                  activeLayer === id
                    ? "bg-action-primary text-white shadow-xs"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                ].join(" ")}
                title={t(`designlab.sidebar.title.${id}`)}
              >
                {LAYER_ICONS[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Title + count + expand/collapse controls */}
        <div className="shrink-0 border-b border-border-subtle px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Text as="div" className="text-sm font-semibold leading-tight text-text-primary">
                {layerTitle}
              </Text>
              <Text variant="secondary" className="block text-[10px] leading-4 mt-0.5">
                {layerItemCount} items
              </Text>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setAllGroupsOpen(allGroupsOpen === true ? false : true)}
                className="p-1 rounded hover:bg-surface-canvas text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                title={allGroupsOpen === false ? "Expand all groups" : "Collapse all groups"}
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${allGroupsOpen === false ? "" : "rotate-180"}`} />
              </button>
              <IconButton icon={<CircleHelp className="h-3.5 w-3.5" />} label="Help" size="sm" variant="ghost" />
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="shrink-0">
          <SidebarBreadcrumb />
        </div>

        {/* Enhanced Search */}
        <SidebarSearchEnhanced
          value={fuzzy.query}
          onChange={fuzzy.setQuery}
          placeholder={t(`designlab.sidebar.search.${activeLayer}.placeholder`)}
          scopeLabel={layerTitle}
          className="shrink-0 py-1"
        />

        {/* Filter Chips */}
        {["components", "primitives", "patterns", "apis"].includes(activeLayer) && (
          <div className="shrink-0">
            <SidebarFilterBar activeFilters={filters} onChange={setFilters} />
          </div>
        )}

        {/* Favorites + Recently Viewed — collapsible, shrink-0 */}
        <div className="shrink-0">
          {favorites.length > 0 && !fuzzy.isSearching && (
            <>
              <SidebarFavorites />
              <SidebarDivider />
            </>
          )}
          {recents.length > 0 && !fuzzy.isSearching && (
            <>
              <SidebarRecentlyViewed />
              <SidebarDivider />
            </>
          )}
        </div>

        {/* Layer content — scrollable */}
        <nav
          className="min-h-0 flex-1 overflow-y-auto px-2 py-2 space-y-0.5"
          data-testid="design-lab-sidebar-scroll"
          aria-label="Component navigation"
        >
          {navContent}
        </nav>
    </aside>
    </HoverPreviewProvider>
    </ContextMenuProvider>
  );
};

/* ------------------------------------------------------------------ */
/*  Per-layer nav renderers                                            */
/* ------------------------------------------------------------------ */

interface LayerNavProps {
  activeItem: string | null;
  query: string;
  searchValue: string;
  onItemSelect: (path: string) => void;
  getHighlightRanges?: (name: string) => HighlightRange[];
  isFavorite?: (name: string) => boolean;
  onToggleFavorite?: (item: { name: string; layer: string; path: string }) => void;
  groupState?: ReturnType<typeof useSidebarGroupState>;
  filterMatches?: (item: { lifecycle?: string; demoMode?: string }) => boolean;
  allGroupsOpen?: boolean | null;
}

/* ---- Foundations ---- */

function FoundationsNav({ activeItem, query, searchValue, onItemSelect }: LayerNavProps) {
  const { t } = useDesignLabI18n();

  const tokenGroups = useMemo(() => {
    return DESIGN_TOKEN_GROUPS.filter((id) => {
      if (!query) return true;
      const title = t(`designlab.tokenGroup.${id}.title`).toLowerCase();
      return title.includes(query) || id.includes(query);
    }).map((id) => ({ id, title: t(`designlab.tokenGroup.${id}.title`) }));
  }, [query, t]);

  const themeAxes = useMemo(() => {
    return THEME_AXES.filter((id) => {
      if (!query) return true;
      const title = t(`designlab.themeAxis.${id}.title`).toLowerCase();
      return title.includes(query) || id.includes(query);
    }).map((id) => ({ id, title: t(`designlab.themeAxis.${id}.title`) }));
  }, [query, t]);

  if (tokenGroups.length === 0 && themeAxes.length === 0) return <EmptyNav searchValue={searchValue} />;

  return (
    <>
      {tokenGroups.length > 0 && (
        <SidebarGroup label={t("designlab.sidebar.group.designTokens") || "Design Tokens"}>
          {tokenGroups.map((g) => (
            <ScrollableNavItem key={g.id} active={activeItem === g.id} label={g.title} onClick={() => onItemSelect(`/admin/design-lab/design/${g.id}`)} />
          ))}
        </SidebarGroup>
      )}
      {themeAxes.length > 0 && (
        <>
          <SidebarDivider />
          <SidebarGroup label={t("designlab.sidebar.group.themeAxes") || "Theme Axes"}>
            {themeAxes.map((a) => (
              <ScrollableNavItem key={a.id} active={activeItem === a.id} label={a.title} onClick={() => onItemSelect(`/admin/design-lab/theme/${a.id}`)} />
            ))}
          </SidebarGroup>
        </>
      )}
    </>
  );
}

/* ---- Primitives ---- */

function PrimitivesNav({ activeItem, query, searchValue, onItemSelect, getHighlightRanges, isFavorite, onToggleFavorite }: LayerNavProps) {
  const { index } = useDesignLab();

  const items = useMemo(() => {
    return index.items
      .filter((i) => i.availability === "exported" && PRIMITIVE_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({ name: i.name, lifecycle: i.lifecycle, groupId: i.taxonomyGroupId }));
  }, [index, query]);

  if (items.length === 0) return <EmptyNav searchValue={searchValue} />;

  return (
    <>
      {items.map((item) => (
        <ScrollableNavItem
          key={item.name}
          active={activeItem === item.name}
          label={item.name}
          highlightRanges={getHighlightRanges?.(item.name)}
          badge={<LifecycleBadge lifecycle={item.lifecycle} />}
          pinned={isFavorite?.(item.name)}
          onPin={onToggleFavorite ? () => onToggleFavorite({ name: item.name, layer: "primitives", path: `/admin/design-lab/primitives/${item.groupId}/${encodeURIComponent(item.name)}` }) : undefined}
          onClick={() => onItemSelect(`/admin/design-lab/primitives/${item.groupId}/${encodeURIComponent(item.name.replace(/\//g, "~"))}`)}
        />
      ))}
    </>
  );
}

/* ---- Components (grouped by taxonomy) ---- */

function ComponentsNav({ activeItem, query, searchValue, onItemSelect, getHighlightRanges, isFavorite, onToggleFavorite, groupState, filterMatches, allGroupsOpen }: LayerNavProps) {
  const { index, taxonomy } = useDesignLab();

  const groups = useMemo(() => {
    return taxonomy.groups
      .map((group) => ({
        ...group,
        subgroups: group.subgroups
          .map((sg) => ({
            ...sg,
            items: sg.items.filter((itemName) => {
              if (PRIMITIVE_NAMES.has(itemName) || ADVANCED_NAMES.has(itemName)) return false;
              if (query && !itemName.toLowerCase().includes(query)) return false;
              if (filterMatches) {
                const indexItem = index.items.find((i) => i.name === itemName);
                if (indexItem && !filterMatches(indexItem)) return false;
              }
              return true;
            }),
          }))
          .filter((sg) => sg.items.length > 0),
      }))
      .filter((g) => g.subgroups.length > 0);
  }, [taxonomy, query, index, filterMatches]);

  if (groups.length === 0) return <EmptyNav searchValue={searchValue} />;

  return (
    <>
      {groups.map((group) => {
        const totalItems = group.subgroups.reduce((sum, sg) => sum + sg.items.length, 0);
        const stableItems = group.subgroups.reduce((sum, sg) => sum + sg.items.filter((name) => {
          const item = index.items.find((i) => i.name === name);
          return item?.lifecycle === "stable";
        }).length, 0);
        return (
        <SidebarGroup
          key={group.id}
          label={`${group.label} (${stableItems}/${totalItems})`}
          defaultOpen={groupState?.isOpen(group.id) ?? true}
          forceOpen={allGroupsOpen}
        >
          {group.subgroups.flatMap((sg) =>
            sg.items.map((itemName) => {
              const indexItem = index.items.find((i) => i.name === itemName);
              return (
                <ScrollableNavItem
                  key={itemName}
                  active={activeItem === itemName}
                  label={itemName}
                  description={indexItem?.description}
                  lifecycle={indexItem?.lifecycle}
                  tags={indexItem?.tags}
                  highlightRanges={getHighlightRanges?.(itemName)}
                  badge={<LifecycleBadge lifecycle={indexItem?.lifecycle} />}
                  pinned={isFavorite?.(itemName)}
                  onPin={onToggleFavorite ? () => onToggleFavorite({ name: itemName, layer: "components", path: `/admin/design-lab/components/${group.id}/${encodeURIComponent(itemName)}` }) : undefined}
                  onClick={() => onItemSelect(`/admin/design-lab/components/${group.id}/${encodeURIComponent(itemName.replace(/\//g, "~"))}`)}
                />
              );
            }),
          )}
        </SidebarGroup>
        );
      })}
    </>
  );
}

/* ---- Patterns (pages + advanced) ---- */

function PatternsNav({ activeItem, query, searchValue, onItemSelect, getHighlightRanges, isFavorite, onToggleFavorite }: LayerNavProps) {
  const { index } = useDesignLab();

  const pages = useMemo(() => {
    const raw = index.pages?.currentFamilies.map((f) => ({ id: f.pageId, title: f.title, intent: f.intent })) ?? [];
    if (!query) return raw;
    return raw.filter((f) => f.title.toLowerCase().includes(query) || f.id.toLowerCase().includes(query));
  }, [index, query]);

  const advancedItems = useMemo(() => {
    return index.items
      .filter((i) => ADVANCED_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({ name: i.name, lifecycle: i.lifecycle }));
  }, [index, query]);

  if (pages.length === 0 && advancedItems.length === 0) return <EmptyNav searchValue={searchValue} />;

  return (
    <>
      {pages.length > 0 && (
        <SidebarGroup label="Pages">
          {pages.map((f) => (
            <ScrollableNavItem key={f.id} active={activeItem === f.id} label={f.title} onClick={() => onItemSelect(`/admin/design-lab/patterns/${f.id}`)} />
          ))}
        </SidebarGroup>
      )}
      {advancedItems.length > 0 && (
        <>
          {pages.length > 0 && <SidebarDivider />}
          <SidebarGroup label="Advanced">
            {advancedItems.map((item) => (
              <ScrollableNavItem
                key={item.name}
                active={activeItem === item.name}
                label={item.name}
                highlightRanges={getHighlightRanges?.(item.name)}
                badge={<LifecycleBadge lifecycle={item.lifecycle} />}
                pinned={isFavorite?.(item.name)}
                onPin={onToggleFavorite ? () => onToggleFavorite({ name: item.name, layer: "patterns", path: `/admin/design-lab/advanced/${encodeURIComponent(item.name)}` }) : undefined}
                onClick={() => onItemSelect(`/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, "~"))}`)}
              />
            ))}
          </SidebarGroup>
        </>
      )}
    </>
  );
}

/* ---- APIs ---- */

function ApisNav({ activeItem, query, searchValue, onItemSelect, getHighlightRanges, isFavorite, onToggleFavorite }: LayerNavProps) {
  const { index } = useDesignLab();

  const items = useMemo(() => {
    return index.items
      .filter((i) => API_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({ name: i.name, lifecycle: i.lifecycle }));
  }, [index, query]);

  if (items.length === 0) return <EmptyNav searchValue={searchValue} />;

  return (
    <>
      {items.map((item) => (
        <ScrollableNavItem
          key={item.name}
          active={activeItem === item.name}
          label={item.name}
          highlightRanges={getHighlightRanges?.(item.name)}
          badge={<LifecycleBadge lifecycle={item.lifecycle} />}
          pinned={isFavorite?.(item.name)}
          onPin={onToggleFavorite ? () => onToggleFavorite({ name: item.name, layer: "apis", path: `/admin/design-lab/apis/${encodeURIComponent(item.name)}` }) : undefined}
          onClick={() => onItemSelect(`/admin/design-lab/apis/${encodeURIComponent(item.name.replace(/\//g, "~"))}`)}
        />
      ))}
    </>
  );
}

/* ---- Family-based (Recipes / Ecosystem) ---- */

function FamilyNav({ layer, activeItem, query, searchValue, onItemSelect }: LayerNavProps & { layer: "recipes" | "ecosystem" }) {
  const { index } = useDesignLab();

  const families = useMemo(() => {
    let raw: Array<{ id: string; title: string; intent: string }> = [];
    if (layer === "recipes") {
      raw = index.recipes?.currentFamilies.map((f) => ({ id: f.recipeId, title: f.title, intent: f.intent })) ?? [];
    } else {
      raw = index.ecosystem?.currentFamilies.map((f) => ({ id: f.extensionId, title: f.title, intent: f.intent })) ?? [];
    }
    if (!query) return raw;
    return raw.filter((f) => f.title.toLowerCase().includes(query) || f.id.toLowerCase().includes(query));
  }, [layer, index, query]);

  if (families.length === 0) return <EmptyNav searchValue={searchValue} />;

  return (
    <>
      {families.map((f) => (
        <ScrollableNavItem key={f.id} active={activeItem === f.id} label={f.title} onClick={() => onItemSelect(`/admin/design-lab/${layer}/${f.id}`)} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function ScrollableNavItem({
  active,
  label,
  badge,
  highlightRanges,
  pinned,
  onPin,
  onClick,
  description,
  lifecycle,
  tags,
}: {
  active: boolean;
  label: string;
  badge?: React.ReactNode;
  highlightRanges?: HighlightRange[];
  pinned?: boolean;
  onPin?: () => void;
  onClick: () => void;
  description?: string;
  lifecycle?: string;
  tags?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { show: showContextMenu } = useContextMenu();
  const { scheduleShow, cancelShow } = useHoverPreview();

  useEffect(() => {
    if (active && ref.current) {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const items = buildComponentMenuItems({
        name: label,
        importPath: `@mfe/design-system`,
        isPinned: pinned ?? false,
        onTogglePin: onPin ?? (() => {}),
        onNavigate: onClick as unknown as (path: string) => void,
      });
      showContextMenu(e, items);
    },
    [label, pinned, onPin, onClick, showContextMenu],
  );

  const handleMouseEnter = useCallback(() => {
    if (!ref.current || !description) return;
    const rect = ref.current.getBoundingClientRect();
    const previewData: PreviewData = {
      name: label,
      description,
      lifecycle,
      tags,
    };
    scheduleShow(rect, previewData);
  }, [label, description, lifecycle, tags, scheduleShow]);

  return (
    <div
      ref={ref}
      className="group scroll-mt-4 relative"
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={cancelShow}
    >
      <SidebarNavButton
        label={label}
        active={active}
        badge={badge}
        onClick={onClick}
      />
      {/* Quick actions — appear on hover */}
      {onPin && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <SidebarQuickActions
            name={label}
            isPinned={pinned ?? false}
            onCopyImport={() =>
              navigator.clipboard.writeText(
                `import { ${label} } from '@mfe/design-system';`,
              )
            }
            onTogglePin={onPin}
          />
        </div>
      )}
    </div>
  );
}

/* ---- Color-coded lifecycle badge with status dot ---- */

const LIFECYCLE_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  stable: { dot: "bg-state-success-text", text: "text-state-success-text", bg: "bg-state-success-bg" },
  beta: { dot: "bg-state-warning-text", text: "text-state-warning-text", bg: "bg-state-warning-bg" },
  planned: { dot: "bg-text-tertiary", text: "text-text-tertiary", bg: "bg-surface-muted" },
  deprecated: { dot: "bg-state-danger-text", text: "text-state-danger-text", bg: "bg-state-danger-bg" },
};

function LifecycleBadge({ lifecycle }: { lifecycle?: string }) {
  if (!lifecycle) return null;
  const style = LIFECYCLE_STYLES[lifecycle] ?? LIFECYCLE_STYLES.planned;

  return (
    <span className={`inline-flex items-center gap-1 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {lifecycle}
    </span>
  );
}

/* ---- Lightweight sidebar primitives (no AppSidebar dependency) ---- */

function SidebarGroup({
  label,
  defaultOpen = true,
  forceOpen,
  action,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  forceOpen?: boolean | null;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // forceOpen overrides local state when not null
  const isOpen = forceOpen != null ? forceOpen : open;

  return (
    <div className="mb-1" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => { setOpen(!isOpen); }}
        className="flex w-full items-center justify-between gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hover:bg-surface-canvas transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <svg
            className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate">{label}</span>
        </div>
        {action && <div className="shrink-0" onClick={(e) => e.stopPropagation()}>{action}</div>}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="pl-1 space-y-px mt-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarNavButton({
  label,
  active,
  badge,
  onClick,
}: {
  label: string;
  active: boolean;
  badge?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-sidebar-item=""
      aria-current={active ? "page" : undefined}
      className={`
        flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5
        text-[13px] transition-colors cursor-pointer text-left
        ${
          active
            ? "bg-action-primary/10 text-action-primary font-medium border-l-2 border-action-primary"
            : "text-text-secondary hover:bg-surface-canvas hover:text-text-primary"
        }
      `}
    >
      <span className="truncate">{label}</span>
      {badge}
    </button>
  );
}

function SidebarDivider() {
  return <hr className="my-2 border-border-subtle" />;
}

function EmptyNav({ searchValue }: { searchValue: string }) {
  const { t } = useDesignLabI18n();
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-canvas px-4 py-3.5">
      <Text variant="secondary" className="block text-sm leading-6">
        {searchValue.trim()
          ? t("designlab.sidebar.empty.search", { query: searchValue })
          : t("designlab.sidebar.empty.default")}
      </Text>
    </div>
  );
}

export default DesignLabAppSidebar;
