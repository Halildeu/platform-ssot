import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { icons as lucideIconMap, Search, X, SearchX, Sparkles, Check } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  IconGalleryPage — Searchable icon gallery with categories          */
/*                                                                     */
/*  Features:                                                          */
/*    - 1800+ lucide-react icons, dynamically loaded                   */
/*    - Real-time search with instant filtering                        */
/*    - Category tabs for quick browsing                               */
/*    - Click-to-copy import statement                                 */
/*    - Size preview (sm / md / lg / xl)                               */
/*    - Grid / List view toggle                                        */
/* ------------------------------------------------------------------ */

/* ---- Icon metadata ---- */

type IconEntry = {
  name: string;
  Component: React.ComponentType<{ className?: string }>;
  category: string;
};

/** Categorize icons by name prefix/pattern heuristics */
function categorize(name: string): string {
  const n = name.toLowerCase();
  if (/^(arrow|chevron|move|corner|align|expand|shrink|minimize|maximize|flip|rotate)/.test(n)) return "Arrows & Direction";
  if (/^(file|folder|clipboard|save|archive|document|book|notebook|library|newspaper|scroll)/.test(n)) return "Files & Folders";
  if (/^(user|users|contact|person|people|baby|accessibility)/.test(n)) return "People";
  if (/^(heart|star|thumb|smile|frown|meh|annoyed|angry|laugh|party|sparkle|flame|zap|trophy|award|crown|gift|gem|diamond)/.test(n)) return "Feedback & Emotion";
  if (/^(mail|message|phone|video|camera|mic|speaker|volume|headphone|radio|podcast|rss|wifi|bluetooth|satellite|signal|antenna|broadcast|screen|monitor|tv|projector|airplay)/.test(n)) return "Communication";
  if (/^(home|building|store|warehouse|factory|castle|church|hospital|hotel|school|landmark|tent|fence|door|bed|sofa|lamp|fan|bath|shower|toilet|plug|power|lightbulb|sun|moon|cloud|umbrella|snowflake|thermometer|wind|droplet|wave|mountain|tree|flower|leaf|sprout)/.test(n)) return "Home & Environment";
  if (/^(lock|unlock|key|shield|eye|scan|fingerprint|guard|siren|badge)/.test(n)) return "Security";
  if (/^(search|filter|sort|list|grid|layout|table|kanban|columns|rows|sidebar|panel|split|group|layers|stack)/.test(n)) return "Layout & Navigation";
  if (/^(plus|minus|x|check|circle|square|triangle|hexagon|octagon|pentagon|diamond|rect|oval|dot|hash|at|asterisk|slash|percent|equal)/.test(n)) return "Shapes & Symbols";
  if (/^(settings|sliders|toggle|switch|wrench|hammer|tool|screwdriver|nut|bolt|cog|gear|config|adjust|tune)/.test(n)) return "Settings & Tools";
  if (/^(chart|bar|pie|line|trending|activity|gauge|signal|analytics|graph)/.test(n)) return "Charts & Data";
  if (/^(calendar|clock|timer|alarm|watch|hourglass|history|schedule|date|time|stopwatch)/.test(n)) return "Date & Time";
  if (/^(credit|wallet|banknote|coins|dollar|euro|pound|receipt|shopping|cart|bag|store|tag|percent|badge|ticket|barcode|qr)/.test(n)) return "Commerce";
  if (/^(map|compass|navigation|globe|pin|flag|route|milestone|signpost|locate|crosshair)/.test(n)) return "Maps & Travel";
  if (/^(code|terminal|braces|brackets|binary|bug|git|github|database|server|hard|cpu|memory|chip|circuit|network|cloud|api|webhook|variable|regex|function)/.test(n)) return "Development";
  if (/^(play|pause|stop|skip|rewind|fast|repeat|shuffle|music|disc|headphone|piano|guitar|drum)/.test(n)) return "Media & Music";
  if (/^(image|picture|photo|camera|palette|brush|pen|pencil|paint|eraser|crop|frame|aperture|focus|contrast|blend|pipette|swatch|canvas|easel|wand)/.test(n)) return "Design & Media";
  if (/^(type|text|font|bold|italic|underline|strikethrough|align|indent|heading|quote|paragraph|subscript|superscript|spell|case|baseline|pilcrow|wrap|whole)/.test(n)) return "Text & Typography";
  if (/^(upload|download|import|export|share|send|inbox|outbox|external|link|unlink|attach|paperclip|copy|paste|cut|clipboard|undo|redo|refresh|sync|replace)/.test(n)) return "Actions";
  if (/^(alert|info|help|warning|error|bell|notification|megaphone|siren|exclamation|question)/.test(n)) return "Alerts & Notifications";
  if (/^(log|login|logout|sign|entry|exit|door|gate)/.test(n)) return "Authentication";
  return "Other";
}

/** Build icon entries from lucide-react (cached on module level) */
let _cachedIcons: IconEntry[] | null = null;

function getIconEntries(): IconEntry[] {
  if (_cachedIcons) return _cachedIcons;
  const entries: IconEntry[] = [];
  for (const [name, value] of Object.entries(lucideIconMap)) {
    // Each entry in lucideIconMap is a forwardRef component (object with $$typeof)
    if (name && value) {
      entries.push({
        name,
        Component: value as unknown as React.ComponentType<{ className?: string }>,
        category: categorize(name),
      });
    }
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  _cachedIcons = entries;
  return entries;
}

/* ---- Constants ---- */

const SIZES = [
  { key: "sm", label: "16px", cls: "h-4 w-4" },
  { key: "md", label: "20px", cls: "h-5 w-5" },
  { key: "lg", label: "24px", cls: "h-6 w-6" },
  { key: "xl", label: "32px", cls: "h-8 w-8" },
] as const;

const PAGE_SIZE = 120;

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function IconGalleryPage() {
  const { t } = useDesignLab();
  const allIcons = useMemo(() => getIconEntries(), []);
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const icon of allIcons) {
      map.set(icon.category, (map.get(icon.category) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ name: cat, count }));
  }, [allIcons]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sizeIdx, setSizeIdx] = useState(1); // md
  const [copied, setCopied] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Filtered icons */
  const filtered = useMemo(() => {
    let result = allIcons;
    if (activeCategory) {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    return result;
  }, [allIcons, activeCategory, search]);

  /* Paginated */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page],
  );

  /* Reset page on filter change */
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  /* Copy handler */
  const handleCopy = useCallback(
    async (iconName: string) => {
      const code = `import { ${iconName} } from "lucide-react";`;
      try {
        await navigator.clipboard.writeText(code);
        setCopied(iconName);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        /* noop */
      }
    },
    [],
  );

  /* Keyboard shortcut — focus search on "/" */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default to-surface-canvas px-6 py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default/80 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            {allIcons.length} icons
          </div>
          <Text as="div" className="text-2xl font-extrabold tracking-tight text-text-primary">
            {t("designlab.iconGallery.title")}
          </Text>
          <Text variant="secondary" className="mt-2 max-w-xl text-sm leading-relaxed">
            {t("designlab.iconGallery.description")}
          </Text>
        </div>
      </div>

      {/* ── Search + Size controls ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("designlab.iconGallery.searchPlaceholder")}
            className="h-10 w-full rounded-xl border border-border-subtle bg-surface-default pl-10 pr-10 text-sm text-text-primary placeholder:text-text-secondary/50 transition focus:border-action-primary focus:outline-hidden focus:ring-2 focus:ring-action-primary/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-text-secondary transition hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border-subtle bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-secondary" style={{ display: search ? "none" : undefined }}>
            /
          </kbd>
        </div>

        {/* Size picker */}
        <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-default p-1">
          {SIZES.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSizeIdx(idx)}
              className={[
                "rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                idx === sizeIdx
                  ? "bg-action-primary text-text-inverse shadow-xs"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              ].join(" ")}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <Text variant="secondary" className="text-xs tabular-nums">
          {filtered.length} / {allIcons.length}
        </Text>
      </div>

      {/* ── Category pills ── */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={[
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            activeCategory === null
              ? "bg-action-primary text-text-inverse shadow-xs"
              : "border border-border-subtle bg-surface-default text-text-secondary hover:border-border-default hover:text-text-primary",
          ].join(" ")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              activeCategory === cat.name
                ? "bg-action-primary text-text-inverse shadow-xs"
                : "border border-border-subtle bg-surface-default text-text-secondary hover:border-border-default hover:text-text-primary",
            ].join(" ")}
          >
            {cat.name}
            <span className="ml-1.5 tabular-nums opacity-60">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* ── Icon grid ── */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface-canvas py-20">
          <SearchX className="mb-3 h-10 w-10 text-text-secondary/30" />
          <Text variant="secondary" className="text-sm">
            No icons found for &ldquo;{search}&rdquo;
          </Text>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
            {visible.map((icon) => (
              <IconCell
                key={icon.name}
                icon={icon}
                sizeCls={SIZES[sizeIdx].cls}
                copied={copied === icon.name}
                onCopy={handleCopy}
              />
            ))}
          </div>

          {/* Load more */}
          {page < totalPages && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-border-subtle bg-surface-default px-6 py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-default hover:text-text-primary"
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---- Icon Cell ---- */

const IconCell = React.memo(function IconCell({
  icon,
  sizeCls,
  copied,
  onCopy,
}: {
  icon: IconEntry;
  sizeCls: string;
  copied: boolean;
  onCopy: (name: string) => void;
}) {
  const { Component, name } = icon;

  return (
    <button
      type="button"
      onClick={() => onCopy(name)}
      title={name}
      className={[
        "group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all duration-200",
        copied
          ? "border-state-success-text/50 bg-state-success-text/5"
          : "border-border-subtle bg-surface-default hover:-translate-y-0.5 hover:border-action-primary/30 hover:shadow-md",
      ].join(" ")}
    >
      {copied ? (
        <Check className={`${sizeCls} text-state-success-text`} />
      ) : (
        <Component className={`${sizeCls} text-text-primary transition-colors group-hover:text-action-primary`} />
      )}
      <span className="w-full truncate text-center text-[9px] leading-tight text-text-secondary group-hover:text-text-primary">
        {name}
      </span>

      {/* Hover overlay — copy hint */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-surface-default/80 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
        <div className="flex flex-col items-center gap-1">
          <Component className={`${sizeCls} text-action-primary`} />
          <span className="text-[8px] font-semibold uppercase tracking-wider text-action-primary">
            {copied ? "Copied!" : "Copy"}
          </span>
        </div>
      </div>
    </button>
  );
});
