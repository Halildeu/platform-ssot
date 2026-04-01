import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeftOpen,
  UnfoldVertical,
  FoldVertical,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";
import { useReporting } from "./ReportingProvider";
import { useReportingShell } from "./ReportingShell";
import {
  TOP_CATEGORIES,
  TOP_CATEGORY_IDS,
  resolveTopCategory,
  type TopCategoryId,
  type CatalogItemLike,
} from "./reportingCategoryMap";
import {
  useReportingSidebarFavorites,
  useReportingSidebarRecents,
  useReportingSidebarAutoTrack,
  useReportingSidebarGroupState,
} from "./sidebar/hooks";
import {
  ReportingFilterBar,
  useReportingFilterState,
  ReportingSidebarFavorites,
  ReportingSidebarRecents,
} from "./sidebar/sections";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const BASE_PATH = "/admin/reports";
const DEBOUNCE_MS = 200;

function resolveActiveRoute(pathname: string): string {
  return pathname.replace(/^\/admin\/reports\/?/, "").split("/")[0] || "";
}

/* ------------------------------------------------------------------ */
/*  ReportingAppSidebar                                                */
/* ------------------------------------------------------------------ */

export const ReportingAppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebarCollapse } = useReportingShell();
  const { catalog, isLoading, grouped, activeCategory, setActiveCategory } =
    useReporting();

  const activeRoute = resolveActiveRoute(location.pathname);

  /* Search */
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchInput(val);
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(
        () => setSearchQuery(val),
        DEBOUNCE_MS,
      );
    },
    [],
  );

  /* Keyboard shortcut ⌘K */
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Filters */
  const { filters, setFilters, matches: filterMatches } =
    useReportingFilterState();

  /* Favorites */
  const { isFavorite, toggle: toggleFavorite } =
    useReportingSidebarFavorites();

  /* Group state */
  const groupState = useReportingSidebarGroupState(activeCategory);

  /* Auto-track recents */
  useReportingSidebarAutoTrack(
    useCallback(
      (pathname: string) => {
        const route = resolveActiveRoute(pathname);
        if (!route) return null;
        const item = catalog.find((c) => c.route === route);
        if (!item) return null;
        return {
          id: item.id,
          title: item.title,
          topCategory: resolveTopCategory(item),
          route: item.route,
        };
      },
      [catalog],
    ),
  );

  /* Active category data */
  const activeCategoryData = grouped.get(activeCategory);

  /* Filtered items for active category */
  const filteredSubGroups = useMemo(() => {
    if (!activeCategoryData) return [];

    const query = searchQuery.toLowerCase();

    return activeCategoryData.subGroups
      .map((sg) => {
        const filtered = sg.items.filter((item) => {
          if (!filterMatches(item)) return false;
          if (query) {
            return (
              item.title.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.category.toLowerCase().includes(query)
            );
          }
          return true;
        });
        return { ...sg, items: filtered };
      })
      .filter((sg) => sg.items.length > 0);
  }, [activeCategoryData, searchQuery, filterMatches]);

  const totalFiltered = filteredSubGroups.reduce(
    (sum, sg) => sum + sg.items.length,
    0,
  );

  /* Handlers */
  const handleNavigate = useCallback(
    (route: string) => {
      navigate(`${BASE_PATH}/${route}`);
    },
    [navigate],
  );

  const handleCategorySwitch = useCallback(
    (id: TopCategoryId) => {
      setActiveCategory(id);
      setSearchInput("");
      setSearchQuery("");
    },
    [setActiveCategory],
  );

  /* ── Collapsed mode: icon strip ────────────────────────────────── */
  if (sidebarCollapsed) {
    return (
      <aside
        className="hidden sm:flex w-full flex-col items-center overflow-y-auto bg-surface-default border border-border-subtle rounded-[16px] shadow-xs"
        aria-label="Raporlar sidebar (daraltilmis)"
        data-testid="reporting-sidebar-collapsed"
      >
        {/* Expand toggle */}
        <div className="shrink-0 border-b border-border-subtle w-full flex items-center justify-center px-2 py-1.5">
          <button
            type="button"
            data-testid="reporting-sidebar-expand"
            aria-label="Sidebar'i genislet"
            onClick={toggleSidebarCollapse}
            title="Sidebar'i genislet"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)]"
          >
            <PanelLeftOpen className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Category icons */}
        <div className="flex flex-col items-center gap-0.5 px-1 py-1.5">
          {TOP_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                aria-label={cat.label}
                title={cat.label}
                data-testid={`reporting-category-tab-${cat.id}`}
                onClick={() => handleCategorySwitch(cat.id)}
                className={[
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg transition",
                  isActive
                    ? "bg-action-primary text-text-inverse shadow-xs"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  /* ── Expanded mode: full sidebar ───────────────────────────────── */
  const activeCatMeta = TOP_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <aside
      className="flex h-full w-full flex-col overflow-hidden bg-surface-default text-text-primary border border-border-subtle rounded-[16px] shadow-xs"
      aria-label="Raporlar sidebar"
    >
      {/* Top bar: collapse + expand/collapse all */}
      <div className="hidden sm:flex shrink-0 border-b border-border-subtle px-2 py-1.5 items-center justify-between">
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          aria-label="Sidebar'i daralt"
          title="Sidebar'i daralt"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
        >
          <PanelLeftClose className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={groupState.expandAll}
            title="Tumunu genislet"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-muted"
          >
            <UnfoldVertical className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              groupState.collapseAll(
                filteredSubGroups.map((sg) => sg.label),
              )
            }
            title="Tumunu daralt"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-muted"
          >
            <FoldVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Category tab strip */}
      <div className="shrink-0 flex items-center gap-0.5 border-b border-border-subtle px-2 py-1.5">
        {TOP_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              aria-label={cat.label}
              title={cat.label}
              onClick={() => handleCategorySwitch(cat.id)}
              className={[
                "inline-flex h-8 w-8 items-center justify-center rounded-lg transition",
                isActive
                  ? "bg-action-primary text-text-inverse shadow-xs"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
        <span className="ml-auto text-[10px] text-text-tertiary">
          {totalFiltered} rapor
        </span>
      </div>

      {/* Category title */}
      <div className="shrink-0 px-3 pt-2 pb-1">
        <h2 className="text-sm font-semibold text-text-primary">
          {activeCatMeta?.label}
        </h2>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 py-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            ref={searchRef}
            type="search"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Rapor ara..."
            className="w-full rounded-lg border border-border-subtle bg-surface-default py-1.5 pe-8 ps-8 text-xs text-text-primary transition placeholder:text-text-disabled hover:bg-surface-muted focus:border-action-primary focus:outline-hidden focus:ring-1 focus:ring-action-primary/20 [&::-webkit-search-cancel-button]:hidden"
            aria-label="Rapor ara"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border-subtle bg-surface-panel px-1 py-px text-[9px] font-semibold text-text-subtle">
            {"\u2318"}K
          </kbd>
        </div>
      </div>

      {/* Filter chips */}
      <ReportingFilterBar
        activeFilters={filters}
        onChange={setFilters}
      />

      {/* Scrollable nav */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {isLoading && filteredSubGroups.length === 0 && (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 animate-pulse rounded-md bg-surface-muted"
              />
            ))}
          </div>
        )}

        {/* Sub-group accordions */}
        {filteredSubGroups.map((subGroup) => (
          <SubGroupAccordion
            key={subGroup.label}
            label={subGroup.label}
            items={subGroup.items}
            isOpen={groupState.isOpen(subGroup.label)}
            onToggle={() => groupState.toggle(subGroup.label)}
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            isFavorite={isFavorite}
            onToggleFavorite={(item) =>
              toggleFavorite({
                id: item.id,
                title: item.title,
                topCategory: resolveTopCategory(item),
                route: item.route,
              })
            }
          />
        ))}

        {!isLoading && filteredSubGroups.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-text-tertiary">
            {searchQuery
              ? "Sonuc bulunamadi"
              : "Bu kategoride rapor yok"}
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="shrink-0 border-t border-border-subtle" />

      {/* Favorites + Recents */}
      <div className="shrink-0 overflow-y-auto max-h-[200px]">
        <ReportingSidebarFavorites
          onItemClick={handleNavigate}
          activeRoute={activeRoute}
        />
        <ReportingSidebarRecents
          onItemClick={handleNavigate}
          activeRoute={activeRoute}
        />
      </div>
    </aside>
  );
};

/* ------------------------------------------------------------------ */
/*  SubGroupAccordion                                                  */
/* ------------------------------------------------------------------ */

const SubGroupAccordion: React.FC<{
  label: string;
  items: CatalogItemLike[];
  isOpen: boolean;
  onToggle: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (item: CatalogItemLike) => void;
}> = ({
  label,
  items,
  isOpen,
  onToggle,
  activeRoute,
  onNavigate,
  isFavorite,
  onToggleFavorite,
}) => (
  <div>
    {/* Group header */}
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary transition"
    >
      {isOpen ? (
        <ChevronDown className="h-3 w-3 shrink-0" />
      ) : (
        <ChevronRight className="h-3 w-3 shrink-0" />
      )}
      <span className="flex-1 text-left truncate">{label}</span>
      <span className="rounded-full bg-surface-muted px-1.5 text-[10px] font-medium text-text-tertiary">
        {items.length}
      </span>
    </button>

    {/* Items */}
    {isOpen && (
      <div className="space-y-px pl-2">
        {items.map((item) => {
          const isActive = activeRoute === item.route;
          return (
            <div
              key={item.id}
              className={`group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs cursor-pointer transition
                ${
                  isActive
                    ? "bg-[color-mix(in_oklab,var(--action-primary)_10%,transparent)] text-[var(--action-primary)] font-medium"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }
              `}
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => onNavigate(item.route)}
              >
                {item.title}
              </button>

              {/* Type badge */}
              <span
                className={`shrink-0 rounded px-1 py-px text-[9px] font-medium
                  ${
                    item.type === "dashboard"
                      ? "bg-state-info-subtle text-state-info-text"
                      : item.type === "mixed"
                        ? "bg-state-warning-subtle text-state-warning-text"
                        : "bg-surface-muted text-text-tertiary"
                  }
                `}
              >
                {item.type === "dashboard"
                  ? "Dash"
                  : item.type === "mixed"
                    ? "Hibrit"
                    : "Grid"}
              </span>

              {/* Favorite toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item);
                }}
                className={`shrink-0 transition ${
                  isFavorite(item.id)
                    ? "text-state-warning-text"
                    : "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-state-warning-text"
                }`}
                aria-label={
                  isFavorite(item.id)
                    ? `${item.title} favorilerden cikar`
                    : `${item.title} favorilere ekle`
                }
              >
                <Star
                  className="h-3 w-3"
                  fill={isFavorite(item.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
