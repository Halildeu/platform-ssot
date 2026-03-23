import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Clock, Zap, GitFork, BarChart3, Moon, Sun, Palette, Figma, Image, History, Target, Activity, Blocks } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "./DesignLabProvider";
import { PRIMITIVE_NAMES, ADVANCED_NAMES, API_NAMES } from "./DesignLabSidebarRouter";
import { semanticSearch, getSearchSuggestions } from "./search/SemanticSearch";

/* ------------------------------------------------------------------ */
/*  DesignLabSearchModal — Cmd+K global search overlay                 */
/*                                                                     */
/*  Opens with Cmd+K / Ctrl+K. Searches across all items:              */
/*  components, recipes, pages, ecosystem, foundations.                 */
/*  Arrow-key navigation + Enter to select.                            */
/* ------------------------------------------------------------------ */

type SearchResult = {
  name: string;
  type: "component" | "primitive" | "recipe" | "pattern" | "ecosystem" | "token" | "advanced" | "api" | "command" | "recent";
  description?: string;
  href: string;
  icon?: React.ReactNode;
  action?: () => void;
};

const TYPE_BADGE_STYLES: Record<SearchResult["type"], string> = {
  token: "bg-rose-100 text-rose-700",
  primitive: "bg-teal-100 text-teal-700",
  component: "bg-state-info-bg text-state-info-text",
  pattern: "bg-state-warning-bg text-state-warning-text",
  advanced: "bg-orange-100 text-orange-700",
  api: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  recipe: "bg-state-success-bg text-state-success-text",
  ecosystem: "bg-purple-100 text-purple-700",
  command: "bg-indigo-100 text-indigo-700",
  recent: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
};

/* ---- Recent visits (localStorage) ---- */

const RECENT_KEY = "designlab_recent_visits";
const MAX_RECENT = 5;

function getRecentVisits(): Array<{ name: string; href: string }> {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function addRecentVisit(name: string, href: string) {
  const visits = getRecentVisits().filter((v) => v.href !== href);
  visits.unshift({ name, href });
  localStorage.setItem(RECENT_KEY, JSON.stringify(visits.slice(0, MAX_RECENT)));
}

/* ---- Track page visits ---- */

function useTrackVisits() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // Only track detail pages
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 4) {
      const name = segments[segments.length - 1];
      addRecentVisit(name, path);
    }
  }, [location.pathname]);
}

export function useSearchModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen };
}

type DesignLabSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DesignLabSearchModal: React.FC<DesignLabSearchModalProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { index, t } = useDesignLab();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Track page visits for recent
  useTrackVisits();

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Use rAF to ensure element is mounted
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  /* ---- Commands (available via empty query or > prefix) ---- */
  const commands = useMemo<SearchResult[]>(
    () => [
      {
        name: "Switch to Dark Theme",
        type: "command" as const,
        description: "Toggle dark appearance",
        href: "",
        icon: <Moon className="h-3.5 w-3.5" />,
        action: () => {
          document.documentElement.setAttribute("data-appearance", "dark");
          document.documentElement.setAttribute("data-mode", "dark");
          document.documentElement.setAttribute("data-theme", "serban-dark");
        },
      },
      {
        name: "Switch to Light Theme",
        type: "command" as const,
        description: "Toggle light appearance",
        href: "",
        icon: <Sun className="h-3.5 w-3.5" />,
        action: () => {
          document.documentElement.setAttribute("data-appearance", "light");
          document.documentElement.setAttribute("data-mode", "light");
          document.documentElement.setAttribute("data-theme", "serban-light");
        },
      },
      {
        name: "Open Theme Builder",
        type: "command" as const,
        description: "Navigate to theme customization",
        href: "/admin/design-lab/theme",
        icon: <Palette className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Dependency Graph",
        type: "command" as const,
        description: "Visualize component relationships",
        href: "/admin/design-lab/graph",
        icon: <GitFork className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Usage Analytics",
        type: "command" as const,
        description: "Component adoption metrics",
        href: "/admin/design-lab/analytics",
        icon: <BarChart3 className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Figma Sync",
        type: "command" as const,
        description: "Token synchronization status",
        href: "/admin/design-lab/figma-sync",
        icon: <Figma className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Visual Regression",
        type: "command" as const,
        description: "Snapshot comparison dashboard",
        href: "/admin/design-lab/visual-regression",
        icon: <Image className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Migration Guide",
        type: "command" as const,
        description: "Version upgrade paths and breaking changes",
        href: "/admin/design-lab/migration",
        icon: <History className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Theming Guide",
        type: "command" as const,
        description: "Theme customization documentation and sandbox",
        href: "/admin/design-lab/theming",
        icon: <Palette className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Parity Dashboard",
        type: "command" as const,
        description: "Feature parity matrix vs MUI, AntD, Storybook, Shadcn",
        href: "/admin/design-lab/parity",
        icon: <Target className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Adoption Insights",
        type: "command" as const,
        description: "Component adoption heatmap, trends, and backlog",
        href: "/admin/design-lab/insights",
        icon: <Activity className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Composition Builder",
        type: "command" as const,
        description: "Visual drag-and-drop component composition canvas",
        href: "/admin/design-lab/compose",
        icon: <Blocks className="h-3.5 w-3.5" />,
      },
      {
        name: "Open Interaction Playground",
        type: "command" as const,
        description: "Cross-component interaction scenarios with shared state",
        href: "/admin/design-lab/interactions",
        icon: <Zap className="h-3.5 w-3.5" />,
      },
    ],
    [],
  );

  // Build search results
  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();

    /* Empty query → show recent visits + commands */
    if (!q) {
      const recentVisits = getRecentVisits();
      const recentResults: SearchResult[] = recentVisits.map((v) => ({
        name: v.name,
        type: "recent" as const,
        description: v.href,
        href: v.href,
        icon: <Clock className="h-3.5 w-3.5" />,
      }));
      return [...recentResults, ...commands];
    }

    /* ">" prefix → filter commands only */
    if (q.startsWith(">")) {
      const cmdQuery = q.slice(1).trim();
      if (!cmdQuery) return commands;
      return commands.filter(
        (c) =>
          c.name.toLowerCase().includes(cmdQuery) ||
          c.description?.toLowerCase().includes(cmdQuery),
      );
    }

    const out: SearchResult[] = [];
    const MAX = 20;

    // Token groups
    const tokenGroups = ["colors", "typography", "spacing", "radius", "motion", "zindex"];
    for (const tg of tokenGroups) {
      if (out.length >= MAX) break;
      if (tg.includes(q) || "token".includes(q) || "design".includes(q)) {
        out.push({
          name: tg.charAt(0).toUpperCase() + tg.slice(1),
          type: "token",
          description: `Design token group`,
          href: `/admin/design-lab/design/${tg}`,
        });
      }
    }

    // Components — split into primitives, components, advanced, and apis
    for (const item of index.items) {
      if (out.length >= MAX) break;
      if (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(q))
      ) {
        const isPrimitive = PRIMITIVE_NAMES.has(item.name);
        const isAdvanced = ADVANCED_NAMES.has(item.name);
        const isApi = API_NAMES.has(item.name);
        out.push({
          name: item.name,
          type: isPrimitive ? "primitive" : isApi ? "api" : isAdvanced ? "advanced" : "component",
          description: item.description,
          href: isPrimitive
            ? `/admin/design-lab/primitives/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
            : isApi
              ? `/admin/design-lab/apis/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
              : isAdvanced
                ? `/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
                : `/admin/design-lab/components/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`,
        });
      }
    }

    // Recipes
    for (const recipe of index.recipes?.currentFamilies ?? []) {
      if (out.length >= MAX) break;
      if (
        recipe.title.toLowerCase().includes(q) ||
        recipe.recipeId.toLowerCase().includes(q)
      ) {
        out.push({
          name: recipe.title,
          type: "recipe",
          href: `/admin/design-lab/recipes/${recipe.recipeId}`,
        });
      }
    }

    // Patterns (was: Pages)
    for (const page of index.pages?.currentFamilies ?? []) {
      if (out.length >= MAX) break;
      if (
        page.title.toLowerCase().includes(q) ||
        page.pageId.toLowerCase().includes(q)
      ) {
        out.push({
          name: page.title,
          type: "pattern",
          href: `/admin/design-lab/patterns/${page.pageId}`,
        });
      }
    }

    // Ecosystem
    for (const ext of index.ecosystem?.currentFamilies ?? []) {
      if (out.length >= MAX) break;
      if (
        ext.title.toLowerCase().includes(q) ||
        ext.extensionId.toLowerCase().includes(q)
      ) {
        out.push({
          name: ext.title,
          type: "ecosystem",
          href: `/admin/design-lab/ecosystem/${ext.extensionId}`,
        });
      }
    }

    // If few exact results, augment with semantic/NLP search
    if (q.length >= 3 && out.length < 5) {
      const nlpResults = semanticSearch(q, 6);
      nlpResults.forEach((sr) => {
        // Skip if already in results
        if (out.some((o) => o.name === sr.componentName)) return;
        if (out.length >= MAX) return;
        // Find item in index to get href
        const item = index.items.find((i: { name: string }) => i.name === sr.componentName);
        if (item) {
          const isPrimitive = PRIMITIVE_NAMES.has(item.name);
          const isAdvanced = ADVANCED_NAMES.has(item.name);
          const isApi = API_NAMES.has(item.name);
          out.push({
            name: item.name,
            type: isPrimitive ? "primitive" : isApi ? "api" : isAdvanced ? "advanced" : "component",
            description: sr.explanation ? `AI: ${sr.explanation}` : item.description,
            href: isPrimitive
              ? `/admin/design-lab/primitives/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
              : isApi
                ? `/admin/design-lab/apis/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
                : isAdvanced
                  ? `/admin/design-lab/advanced/${encodeURIComponent(item.name.replace(/\//g, '~'))}`
                  : `/admin/design-lab/components/${item.taxonomyGroupId}/${encodeURIComponent(item.name.replace(/\//g, '~'))}`,
          });
        }
      });
    }

    return out;
  }, [query, index]);

  // Clamp active index
  useEffect(() => {
    if (activeIndex >= results.length) {
      setActiveIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (result.action) {
        result.action();
        onClose();
        return;
      }
      if (result.href) {
        navigate(result.href);
        onClose();
      }
    },
    [navigate, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[activeIndex]) {
            handleSelect(results[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, activeIndex, handleSelect, onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border-subtle bg-surface-default shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t("designlab.landing.search.placeholder")}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-text-secondary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("designlab.landing.search.placeholder")}
            className="flex-1 bg-transparent text-base text-text-primary outline-hidden placeholder:text-text-secondary"
          />
          <div className="flex items-center gap-1.5">
            <kbd className="hidden rounded-md border border-border-subtle bg-surface-canvas px-1.5 py-0.5 text-[10px] font-medium text-text-secondary sm:inline-block">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-text-secondary hover:bg-surface-muted hover:text-text-primary sm:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2">
          {query && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Text variant="secondary" className="text-sm">
                {t("designlab.sidebar.empty.noResults")}
              </Text>
              <div className="mt-3">
                <Text variant="secondary" className="text-[10px] font-medium uppercase tracking-wider">
                  Try natural language
                </Text>
                <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                  {getSearchSuggestions().slice(0, 4).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setQuery(s); setActiveIndex(0); }}
                      className="rounded-md bg-surface-muted px-2 py-1 text-[10px] text-text-secondary hover:text-text-primary transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section headers for empty query */}
          {!query && results.some((r) => r.type === "recent") && (
            <div className="mb-1 mt-1 flex items-center gap-1.5 px-3 py-1">
              <Clock className="h-3 w-3 text-text-tertiary" />
              <Text className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Recent
              </Text>
            </div>
          )}

          {results.map((result, i) => {
            // Show "Commands" section header before first command
            const showCommandHeader =
              !query &&
              result.type === "command" &&
              (i === 0 || results[i - 1]?.type !== "command");

            return (
              <React.Fragment key={`${result.type}-${result.name}`}>
                {showCommandHeader && (
                  <div className="mb-1 mt-2 flex items-center gap-1.5 px-3 py-1">
                    <Zap className="h-3 w-3 text-text-tertiary" />
                    <Text className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                      Commands
                    </Text>
                    <Text className="ml-auto text-[10px] text-text-tertiary">
                      type &gt; to filter
                    </Text>
                  </div>
                )}
                <button
                  type="button"
                  data-active={i === activeIndex}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    i === activeIndex
                      ? "bg-surface-muted"
                      : "hover:bg-surface-muted/50",
                  ].join(" ")}
                >
                  {result.icon ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-canvas text-text-secondary">
                      {result.icon}
                    </span>
                  ) : (
                    <span
                      className={[
                        "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase",
                        TYPE_BADGE_STYLES[result.type],
                      ].join(" ")}
                    >
                      {result.type}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <Text className="truncate text-sm font-medium text-text-primary">
                      {result.name}
                    </Text>
                    {result.description && (
                      <Text
                        variant="secondary"
                        className="mt-0.5 truncate text-xs"
                      >
                        {result.description}
                      </Text>
                    )}
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="hidden items-center gap-4 border-t border-border-subtle px-4 py-2 sm:flex">
          <span className="flex items-center gap-1 text-[11px] text-text-secondary">
            <kbd className="rounded border border-border-subtle bg-surface-canvas px-1 text-[10px]">
              ↑↓
            </kbd>
            {t("designlab.search.hint.navigate")}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-secondary">
            <kbd className="rounded border border-border-subtle bg-surface-canvas px-1 text-[10px]">
              ↵
            </kbd>
            {t("designlab.search.hint.select")}
          </span>
        </div>
      </div>
    </div>
  );
};
