import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  BookOpen,
  Palette,
  Code2,
  Gamepad2,
  TestTube2,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { Text, Badge } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabIndexItem } from "../DesignLabProvider";
import { hasGuide } from "../docs/guideRegistry";
import { hasTokens } from "../tabs/componentTokenMap";
import { hasExamples } from "../examples/registry";
import { hasPlayground } from "../playground";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";

/* ------------------------------------------------------------------ */
/*  QualityAuditPage                                                   */
/*                                                                     */
/*  Tum bilesenlerin kalite kapsam durumunu gosteren bir matris.        */
/*  Rehber, token, ornek, playground ve test bilgilerini ice alinir.   */
/* ------------------------------------------------------------------ */

/* ---- Types ---- */

type CoverageColumn =
  | "guide"
  | "tokens"
  | "examples"
  | "playground"
  | "tests";

type SortColumn = "name" | "lifecycle" | "score" | CoverageColumn;
type SortDirection = "asc" | "desc";

type ComponentAuditRow = {
  name: string;
  lifecycle: string;
  guide: boolean;
  tokens: boolean;
  examples: boolean;
  playground: boolean;
  tests: boolean;
  score: number;
};

/* ---- Constants ---- */

const COVERAGE_COLUMNS: {
  key: CoverageColumn;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "guide", label: "Rehber", icon: <BookOpen className="h-3.5 w-3.5" /> },
  { key: "tokens", label: "Tokenlar", icon: <Palette className="h-3.5 w-3.5" /> },
  { key: "examples", label: "Ornekler", icon: <Code2 className="h-3.5 w-3.5" /> },
  { key: "playground", label: "Playground", icon: <Gamepad2 className="h-3.5 w-3.5" /> },
  { key: "tests", label: "Testler", icon: <TestTube2 className="h-3.5 w-3.5" /> },
];

const FILTER_OPTIONS: { key: CoverageColumn | "all"; label: string }[] = [
  { key: "all", label: "Tumu" },
  { key: "guide", label: "Rehber eksik" },
  { key: "tokens", label: "Token eksik" },
  { key: "examples", label: "Ornek eksik" },
  { key: "playground", label: "Playground eksik" },
  { key: "tests", label: "Test eksik" },
];

/* ---- Helpers ---- */

/**
 * Normalizes display names to PascalCase registry keys.
 * e.g. "App Header" → "AppHeader", "Search / Command Header" → "CommandHeader"
 */
function toRegistryKey(displayName: string): string {
  // Handle special compound names with slashes
  const SPECIAL_ALIASES: Record<string, string> = {
    "Search / Command Header": "CommandHeader",
    "CRUD Template": "CrudTemplate",
    "Desktop Menubar": "DesktopMenubar",
  };
  if (SPECIAL_ALIASES[displayName]) return SPECIAL_ALIASES[displayName];
  // Remove spaces and slashes to get PascalCase
  return displayName.replace(/[\s/]+/g, "");
}

function computeScore(row: Omit<ComponentAuditRow, "score">): number {
  const checks = [row.guide, row.tokens, row.examples, row.playground, row.tests];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

/* ---- Components with unit tests ---- */
const _TESTED_COMPONENTS = new Set([
  "AIActionAuditTimeline", "AIGuidedAuthoring", "Accordion", "AgGridServer",
  "Alert", "AnchorToc", "ApprovalCheckpoint", "ApprovalReview", "Avatar",
  "Badge", "Breadcrumb", "Button", "Card", "Checkbox", "CitationPanel",
  "Combobox", "CommandPalette", "ConfidenceBadge", "ContextMenu", "DatePicker",
  "Descriptions", "DetailDrawer", "DetailSectionTabs", "DetailSummary", "Dialog",
  "Divider", "Dropdown", "EmptyErrorLoading", "Empty", "EmptyState",
  "EntityGridTemplate", "EntitySummaryBlock", "FilterBar", "FormDrawer",
  "IconButton", "Input", "TextInput", "JsonViewer", "LinkInline", "List",
  "MenuBar", "Modal", "NavigationRail", "NotificationDrawer",
  "NotificationItemCard", "NotificationPanel", "PageHeader", "PageLayout",
  "Pagination", "Popover", "PromptComposer", "Radio", "RecommendationCard",
  "ReportFilterPanel", "SearchFilterListing", "Segmented", "Select", "Skeleton",
  "Slider", "Spinner", "Steps", "SummaryStrip", "Switch", "TablePagination",
  "TableSimple", "Tabs", "Tag", "Text", "TextArea", "Textarea",
  "ThemePresetCompare", "ThemePresetGallery", "ThemePreviewCard", "TimePicker",
  "Toast", "ToastProvider", "Tooltip", "TourCoachmarks", "Tree", "TreeTable",
  "Upload",
  // MenuBar recipe variants (tested via MenuBar tests)
  "App Header", "AppHeader", "Navigation Menu", "NavigationMenu",
  "Search / Command Header", "CommandHeader", "Action Header", "ActionHeader",
  "Action Bar", "ActionBar", "Desktop Menubar", "DesktopMenubar",
  // PageLayout template variants (tested via PageLayout tests)
  "CRUD Template", "CrudTemplate", "Dashboard Template", "DashboardTemplate",
  "Detail Template", "DetailTemplate", "Settings Template", "SettingsTemplate",
  "Command Workspace", "CommandWorkspace",
  // Internal components tested via parent
  "SectionTabs", "MobileStepper", "TablePagination",
  "Segmented Control",
]);

function hasComponentTests(item: DesignLabIndexItem): boolean {
  return _TESTED_COMPONENTS.has(item.name);
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-state-success-text";
  if (score >= 60) return "text-state-warning-text";
  if (score >= 40) return "text-state-warning-text";
  return "text-state-danger-text";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-state-success-text";
  if (score >= 60) return "bg-state-warning-text";
  if (score >= 40) return "bg-state-warning-text";
  return "bg-state-danger-text";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function QualityAuditPage() {
  const { index } = useDesignLab();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGap, setFilterGap] = useState<CoverageColumn | "all">("all");
  const [sortCol, setSortCol] = useState<SortColumn>("score");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  /* Build audit rows from live registry data */
  const rows: ComponentAuditRow[] = useMemo(() => {
    return index.items
      .filter((item) => item.availability === "exported" && item.kind === "component")
      .map((item) => {
        const key = toRegistryKey(item.name);
        const base = {
          name: item.name,
          lifecycle: item.lifecycle,
          guide: hasGuide(key) || hasGuide(item.name),
          tokens: hasTokens(key) || hasTokens(item.name),
          examples: hasExamples(key) || hasExamples(item.name),
          playground: hasPlayground(key) || hasPlayground(item.name),
          tests: hasComponentTests(item),
        };
        return { ...base, score: computeScore(base) };
      });
  }, [index]);

  /* Filtered + sorted */
  const displayRows = useMemo(() => {
    let result = rows;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q));
    }

    // Gap filter
    if (filterGap !== "all") {
      result = result.filter((r) => !r[filterGap]);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "lifecycle":
          cmp = a.lifecycle.localeCompare(b.lifecycle);
          break;
        case "score":
          cmp = a.score - b.score;
          break;
        default:
          cmp = (a[sortCol] ? 1 : 0) - (b[sortCol] ? 1 : 0);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [rows, searchQuery, filterGap, sortCol, sortDir]);

  /* KPI computations */
  const kpis = useMemo(() => {
    const total = rows.length;
    if (total === 0) return { total: 0, guide: 0, tokens: 0, examples: 0, playground: 0, overall: 0 };
    const guideCount = rows.filter((r) => r.guide).length;
    const tokenCount = rows.filter((r) => r.tokens).length;
    const exampleCount = rows.filter((r) => r.examples).length;
    const playgroundCount = rows.filter((r) => r.playground).length;
    const avgScore = Math.round(rows.reduce((s, r) => s + r.score, 0) / total);
    return {
      total,
      guide: Math.round((guideCount / total) * 100),
      tokens: Math.round((tokenCount / total) * 100),
      examples: Math.round((exampleCount / total) * 100),
      playground: Math.round((playgroundCount / total) * 100),
      overall: avgScore,
    };
  }, [rows]);

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortColumn }) => {
    if (sortCol !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3 w-3" />
    ) : (
      <ChevronDown className="inline h-3 w-3" />
    );
  };

  return (
    <div className="flex flex-col mx-auto max-w-7xl gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-state-success-text/20 to-state-success-text/20">
          <ShieldCheck className="h-5 w-5 text-state-success-text" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text as="h1" className="text-xl font-bold text-text-primary">
              Kalite Denetim Paneli
            </Text>
            <DataProvenanceBadge level="derived" />
          </div>
          <Text variant="secondary" className="text-sm">
            {rows.length} bilesen icin kapsam durumu (katalogda {index.items.length} oge)
          </Text>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <KpiCard label="Toplam Bilesen" value={String(kpis.total)} icon={<BarChart3 className="h-4 w-4 text-action-primary" />} color="bg-action-primary/10" />
        <KpiCard label="Rehber Kapsami" value={`%${kpis.guide}`} icon={<BookOpen className="h-4 w-4 text-action-primary" />} color="bg-state-info-bg" pct={kpis.guide} />
        <KpiCard label="Token Kapsami" value={`%${kpis.tokens}`} icon={<Palette className="h-4 w-4 text-action-primary" />} color="bg-action-primary/10" pct={kpis.tokens} />
        <KpiCard label="Ornek Kapsami" value={`%${kpis.examples}`} icon={<Code2 className="h-4 w-4 text-state-warning-text" />} color="bg-state-warning-bg" pct={kpis.examples} />
        <KpiCard label="Playground Kapsami" value={`%${kpis.playground}`} icon={<Gamepad2 className="h-4 w-4 text-state-danger-text" />} color="bg-state-danger-bg" pct={kpis.playground} />
        <KpiCard label="Genel Puan" value={`%${kpis.overall}`} icon={<ShieldCheck className="h-4 w-4 text-state-success-text" />} color="bg-state-success-bg" pct={kpis.overall} />
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bilesen ara..."
            className="h-10 w-full rounded-xl border border-border-subtle bg-surface-default pl-10 pr-4 text-sm text-text-primary transition focus:border-border-default focus:outline-hidden focus:ring-2 focus:ring-action-primary/20"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-text-secondary" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFilterGap(opt.key)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                filterGap === opt.key
                  ? "bg-action-primary text-text-inverse shadow-xs"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-default hover:text-text-primary",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface-default shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-muted/50">
              <th
                className="cursor-pointer px-4 py-3 font-semibold text-text-primary"
                onClick={() => handleSort("name")}
              >
                Bilesen Adi <SortIcon col="name" />
              </th>
              <th
                className="cursor-pointer px-3 py-3 text-center font-semibold text-text-primary"
                onClick={() => handleSort("lifecycle")}
              >
                Yasam Dongusu <SortIcon col="lifecycle" />
              </th>
              {COVERAGE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="cursor-pointer px-3 py-3 text-center font-semibold text-text-primary"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.icon} {col.label}
                  </span>{" "}
                  <SortIcon col={col.key} />
                </th>
              ))}
              <th
                className="cursor-pointer px-3 py-3 text-center font-semibold text-text-primary"
                onClick={() => handleSort("score")}
              >
                Puan <SortIcon col="score" />
              </th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr
                key={row.name}
                className="border-b border-border-subtle/50 transition hover:bg-surface-muted/30"
              >
                <td className="px-4 py-3 font-medium text-text-primary">
                  {row.name}
                </td>
                <td className="px-3 py-3 text-center">
                  <Badge
                    variant={row.lifecycle === "stable" ? "success" : "warning"}
                  >
                    {row.lifecycle === "stable" ? "Stabil" : "Beta"}
                  </Badge>
                </td>
                {COVERAGE_COLUMNS.map((col) => (
                  <td key={col.key} className="px-3 py-3 text-center">
                    <CoverageIndicator covered={row[col.key]} />
                  </td>
                ))}
                <td className="px-3 py-3 text-center">
                  <ScoreBadge score={row.score} />
                </td>
              </tr>
            ))}
            {displayRows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-text-secondary"
                >
                  Eslesen bilesen bulunamadi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/50 px-4 py-3">
        <Text variant="secondary" className="text-sm">
          {displayRows.length} / {rows.length} bilesen gosteriliyor
        </Text>
        <Text variant="secondary" className="text-sm">
          Genel kalite puani: <span className={`font-semibold ${scoreColor(kpis.overall)}`}>%{kpis.overall}</span>
        </Text>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  icon,
  color,
  pct,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  pct?: number;
}) {
  return (
    <div className={`rounded-2xl border border-border-subtle ${color} p-4`}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-card))]">
          {icon}
        </div>
        <Text variant="secondary" className="text-xs font-medium">
          {label}
        </Text>
      </div>
      <Text as="div" className="mt-2 text-2xl font-bold text-text-primary">
        {value}
      </Text>
      {pct != null && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-card))]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreBg(pct)}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function CoverageIndicator({ covered }: { covered: boolean }) {
  return covered ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-state-success-bg text-xs text-state-success-text">
      &#10003;
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-state-danger-bg text-xs text-state-danger-text">
      &#10007;
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`inline-block min-w-[3rem] rounded-full px-2 py-0.5 text-xs font-semibold ${
        score >= 80
          ? "bg-state-success-bg text-state-success-text"
          : score >= 60
            ? "bg-state-warning-bg text-state-warning-text"
            : score >= 40
              ? "bg-state-warning-bg text-state-warning-text"
              : "bg-state-danger-bg text-state-danger-text"
      }`}
    >
      %{score}
    </span>
  );
}
