import React, { useMemo, useState } from "react";
import { Package, ArrowUpDown, Search, TrendingDown, TrendingUp, X } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { PRIMITIVE_NAMES, ADVANCED_NAMES } from "../DesignLabSidebarRouter";

/* ------------------------------------------------------------------ */
/*  BundleSizePage — Estimated gzip sizes for all design-system comps  */
/*                                                                     */
/*  Heuristic estimates based on component complexity.                 */
/*  Sortable table + category breakdown + visual treemap bars.         */
/* ------------------------------------------------------------------ */

/* ---- Size data (heuristic gzip KB) ---- */

const KNOWN_SIZES: Record<string, number> = {
  /* Primitives */
  Text: 0.4, Button: 1.2, IconButton: 0.9, Badge: 0.3, Tag: 0.4,
  Avatar: 0.8, Spinner: 0.3, Skeleton: 0.4, Divider: 0.2, Icon: 0.2,
  Link: 0.3, LinkInline: 0.3, Label: 0.2, Input: 1.1, TextInput: 1.1,
  Textarea: 0.9, TextArea: 0.9, Select: 2.1, Checkbox: 0.6, Radio: 0.5,
  RadioButton: 0.5, RadioGroup: 0.7, Switch: 0.7, Slider: 1.4,
  Tooltip: 1.3, Popover: 1.5, Portal: 0.2, VisuallyHidden: 0.1,
  FocusTrap: 0.3,

  /* Form */
  FormField: 1.0, SearchInput: 1.3, Combobox: 2.4,
  DatePicker: 3.2, TimePicker: 2.8, Upload: 2.1,

  /* Feedback */
  Alert: 0.8, EmptyState: 0.6, Empty: 0.5,
  EmptyErrorLoading: 0.8,

  /* Navigation */
  Tabs: 1.8, Steps: 1.4, Breadcrumb: 0.7, Pagination: 1.5,
  Segmented: 1.1, NavigationRail: 1.2, MenuBar: 1.5,

  /* Compound */
  Accordion: 1.6, Modal: 2.5, Dialog: 2.2,
  Dropdown: 1.8, ContextMenu: 1.6, CommandPalette: 3.8,
  DetailDrawer: 2.6, FormDrawer: 2.8,

  /* Data display */
  TableSimple: 2.6, List: 1.2, Tree: 2.4, TreeTable: 4.5,
  JsonViewer: 2.2, Descriptions: 1.0, Card: 0.5,

  /* Notification */
  NotificationDrawer: 2.0, NotificationPanel: 1.5,
  NotificationItemCard: 0.8,

  /* Patterns */
  PageHeader: 1.4, FilterBar: 2.0, MasterDetail: 3.0,
  PageLayout: 1.0, SummaryStrip: 0.8, EntitySummaryBlock: 1.0,
  DetailSummary: 0.9, ReportFilterPanel: 1.8,
  SearchFilterListing: 2.5,

  /* Advanced */
  EntityGrid: 8.5, AgGridServer: 12.0,

  /* Misc */
  ConfidenceBadge: 0.3, AnchorToc: 0.8, DetailSectionTabs: 1.0,
  TourCoachmarks: 1.5, ThemePreviewCard: 0.6,
  Stack: 0.3, HStack: 0.3, VStack: 0.3,

  /* Provider */
  DesignSystemProvider: 1.2, ThemeProvider: 0.8,
  LocaleProvider: 0.5, DirectionProvider: 0.3,
  ToastProvider: 1.0,
};

type SortKey = "name" | "size" | "tier";
type SortDir = "asc" | "desc";

type ComponentRow = {
  name: string;
  size: number;
  tier: "primitive" | "component" | "advanced" | "pattern" | "provider";
};

function getTier(name: string): ComponentRow["tier"] {
  if (PRIMITIVE_NAMES.has(name)) return "primitive";
  if (ADVANCED_NAMES.has(name)) return "advanced";
  if (/Provider$/.test(name)) return "provider";
  if (/^(PageHeader|FilterBar|MasterDetail|PageLayout|SummaryStrip|EntitySummaryBlock|DetailSummary|ReportFilterPanel|SearchFilterListing)$/.test(name)) return "pattern";
  return "component";
}

const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  primitive: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Primitive" },
  component: { bg: "bg-violet-500/10", text: "text-violet-600", label: "Component" },
  advanced: { bg: "bg-orange-500/10", text: "text-orange-600", label: "Advanced" },
  pattern: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Pattern" },
  provider: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Provider" },
};

/* ================================================================== */

export default function BundleSizePage() {
  const { t } = useDesignLab();
  const [sortKey, setSortKey] = useState<SortKey>("size");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  const rows = useMemo<ComponentRow[]>(() => {
    return Object.entries(KNOWN_SIZES).map(([name, size]) => ({
      name,
      size,
      tier: getTier(name),
    }));
  }, []);

  const filtered = useMemo(() => {
    let result = rows;
    if (tierFilter) {
      result = result.filter((r) => r.tier === tierFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "size") cmp = a.size - b.size;
      else cmp = a.tier.localeCompare(b.tier);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [rows, search, tierFilter, sortKey, sortDir]);

  const totalSize = filtered.reduce((acc, r) => acc + r.size, 0);
  const maxSize = Math.max(...rows.map((r) => r.size));

  /* Tier summary */
  const tierSummary = useMemo(() => {
    const map = new Map<string, { count: number; totalKb: number }>();
    for (const r of rows) {
      const entry = map.get(r.tier) ?? { count: 0, totalKb: 0 };
      entry.count++;
      entry.totalKb += r.size;
      map.set(r.tier, entry);
    }
    return Array.from(map.entries())
      .map(([tier, data]) => ({ tier, ...data }))
      .sort((a, b) => b.totalKb - a.totalKb);
  }, [rows]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

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
            <Package className="h-3 w-3" />
            {rows.length} components
          </div>
          <Text as="div" className="text-2xl font-extrabold tracking-tight text-text-primary">
            {t("designlab.bundleSize.title")}
          </Text>
          <Text variant="secondary" className="mt-2 max-w-xl text-sm leading-relaxed">
            {t("designlab.bundleSize.description")}
          </Text>
        </div>
      </div>

      {/* ── Tier Summary Cards ── */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tierSummary.map(({ tier, count, totalKb }) => {
          const c = TIER_COLORS[tier];
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
              className={[
                "group rounded-xl border p-4 text-left transition-all duration-200",
                tierFilter === tier
                  ? "border-action-primary bg-action-primary/5 shadow-xs"
                  : "border-border-subtle bg-surface-default hover:border-border-default hover:shadow-xs",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}>
                  {c.label}
                </span>
              </div>
              <Text as="div" className="mt-2 text-lg font-extrabold tabular-nums text-text-primary">
                {totalKb.toFixed(1)} KB
              </Text>
              <Text variant="secondary" className="text-[10px]">
                {count} components
              </Text>
            </button>
          );
        })}
      </div>

      {/* ── Search + Total ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="h-10 w-full rounded-xl border border-border-subtle bg-surface-default pl-10 pr-10 text-sm text-text-primary placeholder:text-text-secondary/50 transition focus:border-action-primary focus:outline-hidden focus:ring-2 focus:ring-action-primary/20"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-4 py-2.5">
          <Text variant="secondary" className="text-xs">Total:</Text>
          <Text as="span" className="text-sm font-bold tabular-nums text-text-primary">
            {totalSize.toFixed(1)} KB
          </Text>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-canvas/50">
                <SortHeader label="Component" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Tier" sortKey="tier" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Gzip Size" sortKey="size" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Relative
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const c = TIER_COLORS[row.tier];
                const pct = (row.size / maxSize) * 100;
                return (
                  <tr key={row.name} className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-canvas/30">
                    <td className="px-4 py-3">
                      <code className="rounded-md bg-surface-canvas px-1.5 py-0.5 font-mono text-xs font-semibold text-text-primary">
                        {row.name}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}>
                        {c.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold tabular-nums text-text-primary">
                          {row.size.toFixed(1)} KB
                        </span>
                        {row.size <= 0.5 && <TrendingDown className="h-3 w-3 text-emerald-500" />}
                        {row.size >= 5 && <TrendingUp className="h-3 w-3 text-amber-500" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-surface-muted">
                          <div
                            className={[
                              "h-2 rounded-full transition-all duration-500",
                              row.size >= 5 ? "bg-amber-500" : row.size >= 2 ? "bg-blue-500" : "bg-emerald-500",
                            ].join(" ")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[10px] tabular-nums text-text-secondary">
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="mb-3 h-8 w-8 text-text-secondary/30" />
            <Text variant="secondary" className="text-sm">No components match your search.</Text>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Sortable table header ---- */

function SortHeader({
  label,
  sortKey,
  currentKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentKey === sortKey;
  return (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary transition hover:text-text-primary"
      >
        {label}
        <ArrowUpDown className={`h-3 w-3 ${isActive ? "text-action-primary" : "opacity-40"}`} />
        {isActive && (
          <span className="text-[8px] text-action-primary">{dir === "asc" ? "↑" : "↓"}</span>
        )}
      </button>
    </th>
  );
}
