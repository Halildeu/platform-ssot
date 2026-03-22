import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ArrowRight,
  Palette, SlidersHorizontal, Shapes, Box, Layout, Database, BookOpen, Globe, Code,
  Sparkles, Package, ShieldCheck, Award, Activity,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { API_NAMES } from "../DesignLabSidebarRouter";

/* ------------------------------------------------------------------ */
/*  DesignLabLanding — Modern overview / search page                   */
/*                                                                     */
/*  Design language:                                                   */
/*  - Gradient hero with floating search                               */
/*  - Glassmorphism layer cards with icon + hover lift                  */
/*  - Animated stat counters                                           */
/*  - Smooth micro-interactions                                        */
/* ------------------------------------------------------------------ */

type LayerCardData = {
  id: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  title: string;
  description: string;
  count: number;
  href: string;
};

const LAYER_ICONS: Record<string, React.ReactNode> = {
  design: <Palette className="h-5 w-5" />,
  theme: <SlidersHorizontal className="h-5 w-5" />,
  primitives: <Shapes className="h-5 w-5" />,
  components: <Box className="h-5 w-5" />,
  patterns: <Layout className="h-5 w-5" />,
  advanced: <Database className="h-5 w-5" />,
  apis: <Code className="h-5 w-5" />,
  recipes: <BookOpen className="h-5 w-5" />,
  ecosystem: <Globe className="h-5 w-5" />,
};

const LAYER_GRADIENTS: Record<string, string> = {
  design: "from-rose-500/10 to-pink-500/5",
  theme: "from-violet-500/10 to-purple-500/5",
  primitives: "from-teal-500/10 to-cyan-500/5",
  components: "from-blue-500/10 to-cyan-500/5",
  patterns: "from-amber-500/10 to-orange-500/5",
  advanced: "from-orange-500/10 to-red-500/5",
  apis: "from-cyan-500/10 to-blue-500/5",
  recipes: "from-emerald-500/10 to-teal-500/5",
  ecosystem: "from-indigo-500/10 to-blue-500/5",
};

const LAYER_ICON_BG: Record<string, string> = {
  design: "bg-rose-500/10 text-rose-600",
  theme: "bg-violet-500/10 text-violet-600",
  primitives: "bg-teal-500/10 text-teal-600",
  components: "bg-blue-500/10 text-blue-600",
  patterns: "bg-amber-500/10 text-amber-600",
  advanced: "bg-orange-500/10 text-orange-600",
  apis: "bg-cyan-500/10 text-cyan-600",
  recipes: "bg-emerald-500/10 text-emerald-600",
  ecosystem: "bg-indigo-500/10 text-indigo-600",
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  component: "bg-blue-500/10 text-blue-600",
  api: "bg-cyan-500/10 text-cyan-600",
  recipe: "bg-emerald-500/10 text-emerald-600",
  page: "bg-amber-500/10 text-amber-600",
};

export default function DesignLabLanding() {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);

  const layerCards = useMemo<LayerCardData[]>(
    () => [
      {
        id: "design",
        icon: LAYER_ICONS.design,
        gradient: LAYER_GRADIENTS.design,
        iconBg: LAYER_ICON_BG.design,
        title: t("designlab.landing.layer.design.title"),
        description: t("designlab.landing.layer.design.description"),
        count: 6,
        href: "/admin/design-lab/design",
      },
      {
        id: "theme",
        icon: LAYER_ICONS.theme,
        gradient: LAYER_GRADIENTS.theme,
        iconBg: LAYER_ICON_BG.theme,
        title: t("designlab.landing.layer.theme.title"),
        description: t("designlab.landing.layer.theme.description"),
        count: 10,
        href: "/admin/design-lab/theme",
      },
      {
        id: "primitives",
        icon: LAYER_ICONS.primitives,
        gradient: LAYER_GRADIENTS.primitives,
        iconBg: LAYER_ICON_BG.primitives,
        title: t("designlab.landing.layer.primitives.title"),
        description: t("designlab.landing.layer.primitives.description"),
        count: 24,
        href: "/admin/design-lab/primitives",
      },
      {
        id: "components",
        icon: LAYER_ICONS.components,
        gradient: LAYER_GRADIENTS.components,
        iconBg: LAYER_ICON_BG.components,
        title: t("designlab.landing.layer.components.title"),
        description: t("designlab.landing.layer.components.description"),
        count: index.items.filter((i) => i.availability === "exported" && !API_NAMES.has(i.name)).length,
        href: "/admin/design-lab/components",
      },
      {
        id: "patterns",
        icon: LAYER_ICONS.patterns,
        gradient: LAYER_GRADIENTS.patterns,
        iconBg: LAYER_ICON_BG.patterns,
        title: t("designlab.landing.layer.patterns.title"),
        description: t("designlab.landing.layer.patterns.description"),
        count: index.pages?.currentFamilies.length ?? 0,
        href: "/admin/design-lab/patterns",
      },
      {
        id: "advanced",
        icon: LAYER_ICONS.advanced,
        gradient: LAYER_GRADIENTS.advanced,
        iconBg: LAYER_ICON_BG.advanced,
        title: t("designlab.landing.layer.advanced.title"),
        description: t("designlab.landing.layer.advanced.description"),
        count: index.items.filter((i) => i.group === "advanced" && i.availability === "exported").length || 3,
        href: "/admin/design-lab/advanced",
      },
      {
        id: "apis",
        icon: LAYER_ICONS.apis,
        gradient: LAYER_GRADIENTS.apis,
        iconBg: LAYER_ICON_BG.apis,
        title: "API'ler",
        description: "Hooks, utilities, theme API ve yardımcı fonksiyonlar",
        count: index.items.filter((i) => ["hooks", "utilities", "theme_api", "theme_setters", "constants", "hocs"].includes(i.taxonomyGroupId)).length,
        href: "/admin/design-lab/apis",
      },
      {
        id: "recipes",
        icon: LAYER_ICONS.recipes,
        gradient: LAYER_GRADIENTS.recipes,
        iconBg: LAYER_ICON_BG.recipes,
        title: t("designlab.landing.layer.recipes.title"),
        description: t("designlab.landing.layer.recipes.description"),
        count: index.recipes?.currentFamilies.length ?? 0,
        href: "/admin/design-lab/recipes",
      },
      {
        id: "ecosystem",
        icon: LAYER_ICONS.ecosystem,
        gradient: LAYER_GRADIENTS.ecosystem,
        iconBg: LAYER_ICON_BG.ecosystem,
        title: t("designlab.landing.layer.ecosystem.title"),
        description: t("designlab.landing.layer.ecosystem.description"),
        count: index.ecosystem?.currentFamilies.length ?? 0,
        href: "/admin/design-lab/ecosystem",
      },
    ],
    [index, t],
  );

  /* Quick search results across all items */
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    const results: Array<{ name: string; type: string; href: string; description?: string }> = [];

    // Components & APIs
    for (const item of index.items) {
      if (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      ) {
        const isApi = API_NAMES.has(item.name);
        results.push({
          name: item.name,
          type: isApi ? "api" : "component",
          description: item.description,
          href: isApi
            ? `/admin/design-lab/apis/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
            : `/admin/design-lab/components/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`,
        });
      }
      if (results.length >= 20) break;
    }

    // Recipes
    if (results.length < 20) {
      for (const recipe of index.recipes?.currentFamilies ?? []) {
        if (
          recipe.title.toLowerCase().includes(query) ||
          recipe.recipeId.toLowerCase().includes(query)
        ) {
          results.push({
            name: recipe.title,
            type: "recipe",
            href: `/admin/design-lab/recipes/${recipe.recipeId}`,
          });
        }
        if (results.length >= 20) break;
      }
    }

    // Patterns (was: Pages)
    if (results.length < 20) {
      for (const page of index.pages?.currentFamilies ?? []) {
        if (
          page.title.toLowerCase().includes(query) ||
          page.pageId.toLowerCase().includes(query)
        ) {
          results.push({
            name: page.title,
            type: "page",
            href: `/admin/design-lab/patterns/${page.pageId}`,
          });
        }
        if (results.length >= 20) break;
      }
    }

    return results;
  }, [searchQuery, index]);

  const totalExported = index.summary?.exported ?? index.items.length;

  return (
    <div className="space-y-10 pb-12">
      {/* ── Hero Section with gradient background ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-action-primary/5 via-surface-default to-surface-canvas px-6 py-12 sm:px-10 sm:py-16">
        {/* Decorative grid dots */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default/80 px-4 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-state-success-bg" />
            {t("designlab.sidebar.itemCount", { count: totalExported })}
          </div>

          <Text
            as="div"
            className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
          >
            {t("designlab.landing.title")}
          </Text>
          <Text
            variant="secondary"
            className="mx-auto mt-4 max-w-2xl text-base leading-7 sm:text-lg"
          >
            {t("designlab.landing.subtitle", { count: totalExported })}
          </Text>

          {/* ── Floating search bar ── */}
          <div className="mx-auto mt-8 max-w-xl">
            <div
              className={[
                "relative rounded-2xl border bg-surface-default shadow-lg transition-all duration-300",
                searchFocused
                  ? "border-action-primary shadow-action-primary/10 ring-4 ring-action-primary/5"
                  : "border-border-subtle",
              ].join(" ")}
            >
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                data-testid="design-lab-global-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t("designlab.landing.search.placeholder")}
                className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-16 text-base text-text-primary outline-none placeholder:text-text-secondary/60"
              />
              <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-lg border border-border-subtle bg-surface-canvas px-2 py-1 text-[10px] font-medium text-text-secondary sm:inline-block">
                ⌘K
              </kbd>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-1/2 z-20 mt-2 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-border-subtle bg-surface-default/95 p-2 shadow-2xl backdrop-blur-xl">
                {searchResults.slice(0, 8).map((result) => (
                  <button
                    key={`${result.type}-${result.name}`}
                    type="button"
                    onClick={() => {
                      navigate(result.href);
                      setSearchQuery("");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-surface-muted"
                  >
                    <span
                      className={[
                        "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase",
                        TYPE_BADGE_COLORS[result.type] ?? "bg-surface-muted text-text-secondary",
                      ].join(" ")}
                    >
                      {result.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Text className="truncate text-sm font-medium text-text-primary">
                        {result.name}
                      </Text>
                      {result.description && (
                        <Text variant="secondary" className="truncate text-xs">
                          {result.description}
                        </Text>
                      )}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
                {searchResults.length > 8 && (
                  <div className="border-t border-border-subtle px-3 py-2 text-center text-xs text-text-secondary">
                    +{searchResults.length - 8} more results
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Layer Cards — Glassmorphism style ── */}
      <div>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Explore
        </Text>
        <Text as="div" className="mb-6 text-xl font-bold text-text-primary">
          Design System Layers
        </Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {layerCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => navigate(card.href)}
              data-testid={`design-lab-layer-card-${card.id}`}
              className={[
                "group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300",
                "hover:-translate-y-1 hover:border-border-default hover:shadow-lg",
              ].join(" ")}
            >
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              <div className="relative">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  {card.icon}
                </div>
                <Text as="div" className="text-sm font-semibold text-text-primary">
                  {card.title}
                </Text>
                <Text variant="secondary" className="mt-1.5 line-clamp-2 text-xs leading-5">
                  {card.description}
                </Text>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
                    {card.count}
                  </span>
                  <ArrowRight className="h-4 w-4 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick-access Tools ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/icons")}
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 transition-transform duration-300 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              {t("designlab.iconGallery.title")}
            </Text>
            <Text variant="secondary" className="mt-0.5 line-clamp-1 text-xs">
              1800+ searchable icons with copy-to-clipboard
            </Text>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/bundle-size")}
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 transition-transform duration-300 group-hover:scale-110">
            <Package className="h-5 w-5 text-rose-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              {t("designlab.bundleSize.title")}
            </Text>
            <Text variant="secondary" className="mt-0.5 line-clamp-1 text-xs">
              Gzip estimates for every component
            </Text>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/quality-dashboard")}
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 transition-transform duration-300 group-hover:scale-110">
            <Award className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Quality Command Center
            </Text>
            <Text variant="secondary" className="mt-0.5 line-clamp-1 text-xs">
              Kalite skorları, SLO, kapsam matrisi, güvenlik durumu
            </Text>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/observability")}
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 transition-transform duration-300 group-hover:scale-110">
            <Activity className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Observability
            </Text>
            <Text variant="secondary" className="mt-0.5 line-clamp-1 text-xs">
              Web Vitals, MF health, synthetic monitoring, traces
            </Text>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/governance")}
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Governance
            </Text>
            <Text variant="secondary" className="mt-0.5 line-clamp-1 text-xs">
              RBAC, approvals, ownership, audit trail, release health
            </Text>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
      </div>

      {/* ── Stats Grid — Modern metric cards ── */}
      <div>
        <Text as="div" className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">
          At a glance
        </Text>
        <Text as="div" className="mb-6 text-xl font-bold text-text-primary">
          {t("designlab.landing.stats.title")}
        </Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t("designlab.landing.stats.exported")}
            value={index.summary?.exported ?? 0}
            accent="text-blue-600"
          />
          <StatCard
            label={t("designlab.landing.stats.stable")}
            value={
              index.items.filter((i) => i.lifecycle === "stable").length
            }
            accent="text-emerald-600"
          />
          <StatCard
            label={t("designlab.landing.stats.liveDemo")}
            value={index.summary?.liveDemo ?? 0}
            accent="text-violet-600"
          />
          <StatCard
            label={t("designlab.landing.stats.apiCoverage")}
            value={`${Math.round(
              ((index.adoption as any)?.apiCoverage?.coveragePercent ?? 0),
            )}%`}
            accent="text-amber-600"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "text-text-primary",
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default px-5 py-4 transition-all duration-300 hover:border-border-default hover:shadow-md">
      <Text variant="secondary" className="text-xs font-medium">
        {label}
      </Text>
      <Text as="div" className={`mt-2 text-3xl font-extrabold tabular-nums tracking-tight ${accent}`}>
        {value}
      </Text>
      {/* Decorative corner gradient */}
      <div className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-tl from-action-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
