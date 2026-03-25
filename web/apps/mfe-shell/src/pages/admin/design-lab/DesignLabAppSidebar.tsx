import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircleHelp, Menu, ChevronDown, ChevronUp, Star,
  Palette, Shapes, Box, Layout, BookOpen, Globe, Code,
} from "lucide-react";
import { AppSidebar, IconButton, Text, Tooltip } from "@mfe/design-system";
import { useDesignLabI18n } from "./useDesignLabI18n";
import { useDesignLab } from "./DesignLabProvider";
import { useDesignLabShell } from "./DesignLabShell";
import {
  PRIMITIVE_NAMES,
  ADVANCED_NAMES,
  API_NAMES,
} from "./DesignLabSidebarRouter";

/* New sidebar v2 modules */
import {
  SidebarHealthBanner,
  SidebarBreadcrumb,
  SidebarSearchEnhanced,
  HighlightedLabel,
  SidebarFilterBar,
  useFilterState,
  SidebarFavorites,
  SidebarRecentlyViewed,
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
        return <ComponentsNav activeItem={activeItem} query={fuzzy.query.toLowerCase()} searchValue={fuzzy.query} onItemSelect={handleItemSelect} getHighlightRanges={getHighlightRanges} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} groupState={groupState} filterMatches={filterMatches} />;
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
    <div className="flex h-full w-full flex-col overflow-hidden">
      <AppSidebar
        storageKey="design-lab-sidebar"
        defaultMode="expanded"
        expandedWidth={9999}
        className="h-full !w-full !border-0 !bg-transparent"
      >
        {/* Mobile menu toggle */}
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2 sm:hidden">
          <Text className="text-sm font-semibold">Design Lab</Text>
          <IconButton icon={<Menu className="h-4 w-4" />} label="Close menu" size="sm" variant="ghost" onClick={toggleSidebar} />
        </div>

        {/* Health Banner */}
        <SidebarHealthBanner />

        {/* Layer tabs — icon pills */}
        <AppSidebar.Header className="border-b-0 p-0">
          <div className="border-b border-border-subtle p-2">
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
          <div className="border-b border-border-subtle px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Text as="div" className="text-[1.1rem] font-semibold leading-tight text-text-primary">
                  {layerTitle}
                </Text>
                <Text variant="secondary" className="mt-0.5 block text-[11px] leading-5">
                  {t("designlab.sidebar.itemCount", { count: layerItemCount })}
                </Text>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip content="Expand all">
                  <span>
                    <IconButton icon={<ChevronDown className="h-3.5 w-3.5" />} label="Expand all" size="sm" variant="ghost" onClick={groupState.expandAll} />
                  </span>
                </Tooltip>
                <Tooltip content={layerHelpText}>
                  <span>
                    <IconButton icon={<CircleHelp className="h-3.5 w-3.5" />} label="Help" size="sm" variant="ghost" />
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        </AppSidebar.Header>

        {/* Breadcrumb */}
        <SidebarBreadcrumb />

        {/* Enhanced Search */}
        <SidebarSearchEnhanced
          value={fuzzy.query}
          onChange={fuzzy.setQuery}
          placeholder={t(`designlab.sidebar.search.${activeLayer}.placeholder`)}
          scopeLabel={layerTitle}
          className="py-1"
        />

        {/* Filter Chips */}
        {["components", "primitives", "patterns", "apis"].includes(activeLayer) && (
          <SidebarFilterBar activeFilters={filters} onChange={setFilters} />
        )}

        {/* Favorites */}
        {favorites.length > 0 && !fuzzy.isSearching && (
          <>
            <SidebarFavorites />
            <AppSidebar.Separator />
          </>
        )}

        {/* Recently Viewed */}
        {recents.length > 0 && !fuzzy.isSearching && (
          <>
            <SidebarRecentlyViewed />
            <AppSidebar.Separator />
          </>
        )}

        {/* Layer content */}
        <AppSidebar.Nav
          className="min-h-0 flex-1 overflow-auto px-3 py-2"
          enableKeyboardNav
          data-testid="design-lab-sidebar-scroll"
        >
          {navContent}
        </AppSidebar.Nav>
      </AppSidebar>
    </div>
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
        <AppSidebar.Group label={t("designlab.sidebar.group.designTokens") || "Design Tokens"}>
          {tokenGroups.map((g) => (
            <ScrollableNavItem key={g.id} active={activeItem === g.id} label={g.title} onClick={() => onItemSelect(`/admin/design-lab/design/${g.id}`)} />
          ))}
        </AppSidebar.Group>
      )}
      {themeAxes.length > 0 && (
        <>
          <AppSidebar.Separator />
          <AppSidebar.Group label={t("designlab.sidebar.group.themeAxes") || "Theme Axes"}>
            {themeAxes.map((a) => (
              <ScrollableNavItem key={a.id} active={activeItem === a.id} label={a.title} onClick={() => onItemSelect(`/admin/design-lab/theme/${a.id}`)} />
            ))}
          </AppSidebar.Group>
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

function ComponentsNav({ activeItem, query, searchValue, onItemSelect, getHighlightRanges, isFavorite, onToggleFavorite, groupState, filterMatches }: LayerNavProps) {
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
      {groups.map((group) => (
        <AppSidebar.Group
          key={group.id}
          label={group.label}
          defaultOpen={groupState?.isOpen(group.id) ?? true}
        >
          {group.subgroups.flatMap((sg) =>
            sg.items.map((itemName) => {
              const indexItem = index.items.find((i) => i.name === itemName);
              return (
                <ScrollableNavItem
                  key={itemName}
                  active={activeItem === itemName}
                  label={itemName}
                  highlightRanges={getHighlightRanges?.(itemName)}
                  badge={<LifecycleBadge lifecycle={indexItem?.lifecycle} />}
                  pinned={isFavorite?.(itemName)}
                  onPin={onToggleFavorite ? () => onToggleFavorite({ name: itemName, layer: "components", path: `/admin/design-lab/components/${group.id}/${encodeURIComponent(itemName)}` }) : undefined}
                  onClick={() => onItemSelect(`/admin/design-lab/components/${group.id}/${encodeURIComponent(itemName.replace(/\//g, "~"))}`)}
                />
              );
            }),
          )}
        </AppSidebar.Group>
      ))}
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
        <AppSidebar.Group label="Pages">
          {pages.map((f) => (
            <ScrollableNavItem key={f.id} active={activeItem === f.id} label={f.title} onClick={() => onItemSelect(`/admin/design-lab/patterns/${f.id}`)} />
          ))}
        </AppSidebar.Group>
      )}
      {advancedItems.length > 0 && (
        <>
          {pages.length > 0 && <AppSidebar.Separator />}
          <AppSidebar.Group label="Advanced">
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
          </AppSidebar.Group>
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
}: {
  active: boolean;
  label: string;
  badge?: React.ReactNode;
  highlightRanges?: HighlightRange[];
  pinned?: boolean;
  onPin?: () => void;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const displayLabel = highlightRanges?.length ? (
    <HighlightedLabel text={label} ranges={highlightRanges} />
  ) : (
    label
  );

  return (
    <div ref={ref} className="group scroll-mt-4 relative">
      <AppSidebar.NavItem
        label={label}
        active={active}
        badge={badge}
        onClick={onClick}
      />
      {/* Pin button — appears on hover */}
      {onPin && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPin(); }}
          className={`
            absolute right-8 top-1/2 -translate-y-1/2
            ${pinned ? "opacity-100 text-state-warning-text" : "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-state-warning-text"}
            transition-opacity cursor-pointer
          `}
          aria-label={pinned ? `Unpin ${label}` : `Pin ${label}`}
          title={pinned ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`h-3 w-3 ${pinned ? "fill-current" : ""}`} />
        </button>
      )}
    </div>
  );
}

function LifecycleBadge({ lifecycle }: { lifecycle?: string }) {
  if (!lifecycle || lifecycle === "stable") return null;
  return (
    <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
      {lifecycle}
    </span>
  );
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
