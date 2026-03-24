import React, { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircleHelp, Menu,
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

/* ------------------------------------------------------------------ */
/*  DesignLabAppSidebar — AppSidebar compound-component adapter        */
/*                                                                     */
/*  Replaces the monolithic DesignLabSidebarRouter render tree with    */
/*  the design-system AppSidebar compound API while reusing all        */
/*  existing data logic (layers, search, route detection, counts).     */
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
  "foundations",
  "primitives",
  "components",
  "patterns",
  "apis",
  "recipes",
  "ecosystem",
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

/* ---- Constants ---- */

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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const DesignLabAppSidebar: React.FC = () => {
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
      case "foundations":
        return 16; // 6 token groups + 10 theme axes
      case "primitives":
        return PRIMITIVE_NAMES.size;
      case "components":
        return index.items.filter(
          (i) =>
            i.availability === "exported" &&
            !PRIMITIVE_NAMES.has(i.name) &&
            !API_NAMES.has(i.name) &&
            !ADVANCED_NAMES.has(i.name),
        ).length;
      case "patterns":
        return (index.pages?.currentFamilies.length ?? 0) + ADVANCED_NAMES.size;
      case "apis":
        return API_NAMES.size;
      case "recipes":
        return index.recipes?.currentFamilies.length ?? 0;
      case "ecosystem":
        return (
          (index.ecosystem?.currentFamilies.length ?? 0) +
          index.items.filter(
            (i) =>
              ["x_data_grid", "x_charts", "x_scheduler", "x_kanban", "x_editor", "x_form_builder"].includes(
                i.taxonomyGroupId,
              ) && i.availability === "exported",
          ).length
        );
    }
  }, [activeLayer, index]);

  const handleLayerSwitch = (layerId: LayerId) => {
    navigate(`/admin/design-lab/${layerId}`);
  };

  const handleItemSelect = (itemPath: string) => {
    navigate(itemPath);
    closeSidebar();
  };

  /* ---- Build grouped nav items per layer ---- */
  const navContent = useMemo(() => {
    const query = searchValue.toLowerCase().trim();

    switch (activeLayer) {
      case "foundations":
        return (
          <FoundationsNav
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
      case "primitives":
        return (
          <PrimitivesNav
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
      case "components":
        return (
          <ComponentsNav
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
      case "patterns":
        return (
          <PatternsNav
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
      case "apis":
        return (
          <ApisNav
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
      case "recipes":
        return (
          <FamilyNav
            layer="recipes"
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
      case "ecosystem":
        return (
          <FamilyNav
            layer="ecosystem"
            activeItem={activeItem}
            query={query}
            searchValue={searchValue}
            onItemSelect={handleItemSelect}
          />
        );
    }
  }, [activeLayer, activeItem, searchValue, handleItemSelect]);

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
        <Text className="text-sm font-semibold">
          {t("designlab.breadcrumb.library")}
        </Text>
        <IconButton
          icon={<Menu className="h-4 w-4" />}
          label="Close menu"
          size="sm"
          variant="ghost"
          onClick={toggleSidebar}
        />
      </div>

      {/* Layer tabs — icon pills */}
      <AppSidebar.Header
        className="border-b-0 p-0"
      >
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

        {/* Title + count + help */}
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
        </div>
      </AppSidebar.Header>

      {/* Search */}
      <AppSidebar.Search
        value={searchValue}
        onChange={setSearchValue}
        placeholder={searchPlaceholder}
        shortcut="⌘K"
      />

      {/* Layer content */}
      <AppSidebar.Nav
        className="min-h-0 flex-1 overflow-auto px-3 py-4"
        data-testid="design-lab-sidebar-scroll"
      >
        {navContent}
      </AppSidebar.Nav>
    </AppSidebar>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Per-layer nav renderers using AppSidebar compound components       */
/* ------------------------------------------------------------------ */

interface LayerNavProps {
  activeItem: string | null;
  query: string;
  searchValue: string;
  onItemSelect: (path: string) => void;
}

/* ---- Foundations ---- */

function FoundationsNav({ activeItem, query, searchValue, onItemSelect }: LayerNavProps) {
  const { t } = useDesignLabI18n();

  const tokenGroups = useMemo(() => {
    return DESIGN_TOKEN_GROUPS.filter((id) => {
      if (!query) return true;
      const title = t(`designlab.tokenGroup.${id}.title`).toLowerCase();
      return title.includes(query) || id.includes(query);
    }).map((id) => ({
      id,
      title: t(`designlab.tokenGroup.${id}.title`),
      description: t(`designlab.tokenGroup.${id}.description`),
    }));
  }, [query, t]);

  const themeAxes = useMemo(() => {
    return THEME_AXES.filter((id) => {
      if (!query) return true;
      const title = t(`designlab.themeAxis.${id}.title`).toLowerCase();
      return title.includes(query) || id.includes(query);
    }).map((id) => ({
      id,
      title: t(`designlab.themeAxis.${id}.title`),
      description: t(`designlab.themeAxis.${id}.description`),
    }));
  }, [query, t]);

  if (tokenGroups.length === 0 && themeAxes.length === 0) {
    return <EmptyNav searchValue={searchValue} />;
  }

  return (
    <>
      {tokenGroups.length > 0 && (
        <AppSidebar.Group label={t("designlab.sidebar.group.designTokens") || "Design Tokens"}>
          {tokenGroups.map((group) => (
            <ScrollableNavItem
              key={group.id}
              active={activeItem === group.id}
              label={group.title}
              onClick={() => onItemSelect(`/admin/design-lab/design/${group.id}`)}
            />
          ))}
        </AppSidebar.Group>
      )}
      {themeAxes.length > 0 && (
        <>
          <AppSidebar.Separator />
          <AppSidebar.Group label={t("designlab.sidebar.group.themeAxes") || "Theme Axes"}>
            {themeAxes.map((axis) => (
              <ScrollableNavItem
                key={axis.id}
                active={activeItem === axis.id}
                label={axis.title}
                onClick={() => onItemSelect(`/admin/design-lab/theme/${axis.id}`)}
              />
            ))}
          </AppSidebar.Group>
        </>
      )}
    </>
  );
}

/* ---- Primitives ---- */

function PrimitivesNav({ activeItem, query, searchValue, onItemSelect }: LayerNavProps) {
  const { index } = useDesignLab();

  const items = useMemo(() => {
    return index.items
      .filter((i) => i.availability === "exported" && PRIMITIVE_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({
        name: i.name,
        description: i.description,
        lifecycle: i.lifecycle,
        groupId: i.taxonomyGroupId,
      }));
  }, [index, query]);

  if (items.length === 0) {
    return <EmptyNav searchValue={searchValue} />;
  }

  return (
    <>
      {items.map((item) => (
        <ScrollableNavItem
          key={item.name}
          active={activeItem === item.name}
          label={item.name}
          badge={item.lifecycle ? (
            <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              {item.lifecycle}
            </span>
          ) : undefined}
          onClick={() =>
            onItemSelect(
              `/admin/design-lab/primitives/${item.groupId}/${encodeURIComponent(item.name.replace(/\//g, "~"))}`,
            )
          }
        />
      ))}
    </>
  );
}

/* ---- Components (grouped by taxonomy) ---- */

function ComponentsNav({ activeItem, query, searchValue, onItemSelect }: LayerNavProps) {
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
              if (!query) return true;
              return itemName.toLowerCase().includes(query);
            }),
          }))
          .filter((sg) => sg.items.length > 0),
      }))
      .filter((g) => g.subgroups.length > 0);
  }, [taxonomy, query]);

  if (groups.length === 0) {
    return <EmptyNav searchValue={searchValue} />;
  }

  return (
    <>
      {groups.map((group) => (
        <AppSidebar.Group key={group.id} label={group.label}>
          {group.subgroups.flatMap((sg) =>
            sg.items.map((itemName) => {
              const indexItem = index.items.find((i) => i.name === itemName);
              return (
                <ScrollableNavItem
                  key={itemName}
                  active={activeItem === itemName}
                  label={itemName}
                  badge={indexItem?.lifecycle ? (
                    <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                      {indexItem.lifecycle}
                    </span>
                  ) : undefined}
                  onClick={() =>
                    onItemSelect(
                      `/admin/design-lab/components/${group.id}/${encodeURIComponent(itemName.replace(/\//g, "~"))}`,
                    )
                  }
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

function PatternsNav({ activeItem, query, searchValue, onItemSelect }: LayerNavProps) {
  const { index } = useDesignLab();

  const pages = useMemo(() => {
    const rawFamilies =
      index.pages?.currentFamilies.map((f) => ({
        id: f.pageId,
        title: f.title,
        intent: f.intent,
      })) ?? [];

    if (!query) return rawFamilies;
    return rawFamilies.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query) ||
        f.intent.toLowerCase().includes(query),
    );
  }, [index, query]);

  const advancedItems = useMemo(() => {
    return index.items
      .filter((i) => ADVANCED_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({
        name: i.name,
        description: i.description,
        lifecycle: i.lifecycle,
      }));
  }, [index, query]);

  if (pages.length === 0 && advancedItems.length === 0) {
    return <EmptyNav searchValue={searchValue} />;
  }

  return (
    <>
      {pages.length > 0 && (
        <AppSidebar.Group label="Pages">
          {pages.map((family) => (
            <ScrollableNavItem
              key={family.id}
              active={activeItem === family.id}
              label={family.title}
              onClick={() => onItemSelect(`/admin/design-lab/patterns/${family.id}`)}
            />
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
                badge={item.lifecycle ? (
                  <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                    {item.lifecycle}
                  </span>
                ) : undefined}
                onClick={() =>
                  onItemSelect(
                    `/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, "~"))}`,
                  )
                }
              />
            ))}
          </AppSidebar.Group>
        </>
      )}
    </>
  );
}

/* ---- APIs ---- */

function ApisNav({ activeItem, query, searchValue, onItemSelect }: LayerNavProps) {
  const { index } = useDesignLab();

  const items = useMemo(() => {
    return index.items
      .filter((i) => API_NAMES.has(i.name))
      .filter((i) => !query || i.name.toLowerCase().includes(query))
      .map((i) => ({
        name: i.name,
        description: i.description,
        lifecycle: i.lifecycle,
      }));
  }, [index, query]);

  if (items.length === 0) {
    return <EmptyNav searchValue={searchValue} />;
  }

  return (
    <>
      {items.map((item) => (
        <ScrollableNavItem
          key={item.name}
          active={activeItem === item.name}
          label={item.name}
          badge={item.lifecycle ? (
            <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              {item.lifecycle}
            </span>
          ) : undefined}
          onClick={() =>
            onItemSelect(
              `/admin/design-lab/apis/${encodeURIComponent(item.name.replace(/\//g, "~"))}`,
            )
          }
        />
      ))}
    </>
  );
}

/* ---- Family-based (Recipes / Ecosystem) ---- */

function FamilyNav({
  layer,
  activeItem,
  query,
  searchValue,
  onItemSelect,
}: LayerNavProps & { layer: "recipes" | "ecosystem" }) {
  const { index } = useDesignLab();

  const families = useMemo(() => {
    let rawFamilies: Array<{ id: string; title: string; intent: string }> = [];

    if (layer === "recipes") {
      rawFamilies =
        index.recipes?.currentFamilies.map((f) => ({
          id: f.recipeId,
          title: f.title,
          intent: f.intent,
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
  }, [layer, index, query]);

  const basePath = `/admin/design-lab/${layer}`;

  if (families.length === 0) {
    return <EmptyNav searchValue={searchValue} />;
  }

  return (
    <>
      {families.map((family) => (
        <ScrollableNavItem
          key={family.id}
          active={activeItem === family.id}
          label={family.title}
          onClick={() => onItemSelect(`${basePath}/${family.id}`)}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Wrapper around AppSidebar.NavItem that auto-scrolls the active item
 * into view on mount — matching the behaviour of the original sidebar.
 */
function ScrollableNavItem({
  active,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  label: string;
  badge?: React.ReactNode;
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

  return (
    <div ref={ref} className="scroll-mt-4">
      <AppSidebar.NavItem
        label={label}
        active={active}
        badge={badge}
        onClick={onClick}
      />
    </div>
  );
}

function EmptyNav({ searchValue }: { searchValue: string }) {
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

export default DesignLabAppSidebar;
