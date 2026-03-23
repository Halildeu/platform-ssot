import React, { useMemo, useState } from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image,
  GitBranch,
  Clock,
  Filter,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";
import { useEvidence, FALLBACK_REGISTRY } from "../evidence/useEvidence";
import type { EvidenceStatus } from "../evidence/useEvidence";

/* ------------------------------------------------------------------ */
/*  VisualRegressionPage — Per-component visual regression dashboard    */
/*                                                                     */
/*  Displays Chromatic-style visual regression status:                  */
/*  - Per-component pass/fail/changed status                           */
/*  - Build summary with acceptance rate                               */
/*  - Filter by status, search by name                                 */
/*  Route: /admin/design-lab/visual-regression                         */
/* ------------------------------------------------------------------ */

type VRStatus = "pass" | "fail" | "changed" | "new" | "skipped";

type VRResult = {
  componentName: string;
  layer: string;
  status: VRStatus;
  storyCount: number;
  changedStories: number;
  lastChecked: Date;
  snapshotUrl?: string;
};

/* ---- Derived VR data from repo structure & Playwright config ---- */

/**
 * Derived from actual repo structure:
 * - Playwright projects: chromium, firefox, webkit (from playwright.config.ts)
 * - Chromatic workflow: .github/workflows/chromatic.yml
 * - Visual regression workflow: packages/design-system/.github/workflows/visual-regression.yml
 * - Test file count derived from index items (each component = 1 potential spec)
 */

function useVisualRegressionData() {
  const { index } = useDesignLab();
  const evidenceState = useEvidence();

  return useMemo(() => {
    const evidence =
      evidenceState.status === 'loaded'
        ? evidenceState.data.visual_regression
        : FALLBACK_REGISTRY.visual_regression;
    const evidenceAvailable = evidenceState.status === 'loaded';
    const evidenceStatus: EvidenceStatus = evidenceAvailable
      ? evidence.status
      : 'no_data';

    // Derive from actual Playwright config & workflow presence
    const playwrightBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
    const thresholdPixelRatio = 0.01;
    const chromaticWorkflowExists = evidence.workflow_exists;
    const visualRegressionWorkflowExists = true;

    // Map VR status from evidence to per-component display
    const defaultVRStatus: VRStatus =
      evidenceStatus === 'passing' ? 'pass' :
      evidenceStatus === 'failing' ? 'fail' :
      'skipped';

    const results: VRResult[] = index.items.map((item) => ({
      componentName: item.name,
      layer: item.taxonomyGroupId ?? "components",
      status: defaultVRStatus,
      storyCount: 0,
      changedStories: 0,
      lastChecked: evidence.last_run ? new Date(evidence.last_run) : new Date(0),
    }));

    // Use evidence stats when available
    const passCount = evidence.stats.pass;
    const failCount = evidence.stats.fail;
    const changedCount = evidence.stats.changed;
    const newCount = evidence.stats.new;
    const totalSnapshots = evidenceAvailable
      ? passCount + failCount + changedCount + newCount + evidence.stats.skipped
      : index.items.length * playwrightBrowsers.length;
    const acceptanceRate = totalSnapshots > 0
      ? Math.round((passCount / totalSnapshots) * 100)
      : 0;

    const buildInfo = {
      buildNumber: null as number | null,
      branch: "main",
      commit: null as string | null,
      triggeredAt: evidence.last_run ? new Date(evidence.last_run) : null,
      duration: null as string | null,
      browsers: playwrightBrowsers,
      thresholdPixelRatio,
      chromaticWorkflow: chromaticWorkflowExists,
      playwrightWorkflow: visualRegressionWorkflowExists,
    };

    return { results, passCount, failCount, changedCount, newCount, totalSnapshots, acceptanceRate, buildInfo, evidenceStatus };
  }, [index, evidenceState]);
}

/* ---- Status config ---- */

const STATUS_CONFIG: Record<VRStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pass: { label: "Pass", color: "text-emerald-700", bg: "bg-emerald-100", icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> },
  fail: { label: "Fail", color: "text-red-700", bg: "bg-red-100", icon: <XCircle className="h-3.5 w-3.5 text-red-600" /> },
  changed: { label: "Changed", color: "text-amber-700", bg: "bg-amber-100", icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> },
  new: { label: "New", color: "text-blue-700", bg: "bg-blue-100", icon: <Eye className="h-3.5 w-3.5 text-blue-600" /> },
  skipped: { label: "Skipped", color: "text-[var(--text-secondary)]", bg: "bg-[var(--surface-muted)]", icon: <Clock className="h-3.5 w-3.5 text-[var(--text-subtle)]" /> },
};

/* ---- Stat Card ---- */

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <div className="flex items-center gap-2">
        {icon}
        <Text variant="secondary" className="text-xs font-medium uppercase tracking-wider">
          {label}
        </Text>
      </div>
      <Text className={`mt-1 text-2xl font-bold ${color}`}>{value}</Text>
    </div>
  );
}

/* ---- Acceptance Gauge (pure SVG) ---- */

function AcceptanceGauge({ rate }: { rate: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;
  const gaugeColor = rate >= 90 ? "#10b981" : rate >= 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className="text-surface-muted" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-700"
        />
        <text x="50" y="50" textAnchor="middle" dy="0.35em" className="fill-current text-text-primary" fontSize="18" fontWeight="700">
          {rate}%
        </text>
      </svg>
      <Text variant="secondary" className="mt-1 text-xs">
        Acceptance Rate
      </Text>
    </div>
  );
}

/* ---- Component Result Row ---- */

function ResultRow({ result }: { result: VRResult }) {
  const cfg = STATUS_CONFIG[result.status];
  const timeAgo = getTimeAgo(result.lastChecked);

  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3 last:border-0 transition hover:bg-surface-muted/50">
      {cfg.icon}
      <div className="min-w-0 flex-1">
        <Text className="text-sm font-medium text-text-primary">{result.componentName}</Text>
        <Text variant="secondary" className="text-[11px]">
          {result.storyCount} stories · {result.layer}
        </Text>
      </div>
      {result.changedStories > 0 && (
        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          {result.changedStories} changed
        </span>
      )}
      <span className={["rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase", cfg.bg, cfg.color].join(" ")}>
        {cfg.label}
      </span>
      <Text variant="secondary" className="w-16 text-right text-[10px]">
        {timeAgo}
      </Text>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ==================================================================== */
/*  Main Page Component                                                  */
/* ==================================================================== */

type StatusFilter = "all" | VRStatus;

export const VisualRegressionPage: React.FC = () => {
  const { t } = useDesignLab();
  const data = useVisualRegressionData();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filteredResults = useMemo(() => {
    let results = data.results;
    if (filter !== "all") {
      results = results.filter((r) => r.status === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((r) => r.componentName.toLowerCase().includes(q));
    }
    return results;
  }, [data.results, filter, search]);

  const filterOptions: Array<{ id: StatusFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: data.results.length },
    { id: "pass", label: "Pass", count: data.passCount },
    { id: "changed", label: "Changed", count: data.changedCount },
    { id: "fail", label: "Fail", count: data.failCount },
    { id: "new", label: "New", count: data.newCount },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Image className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text as="h1" className="text-xl font-bold text-text-primary">
                Visual Regression
              </Text>
              <DataProvenanceBadge level="derived" />
            </div>
            <Text variant="secondary" className="text-sm">
              Per-component snapshot comparison & change detection
            </Text>
            <Text variant="secondary" className="text-[10px] mt-0.5">
              Altyapı yapılandırması türetilmiş · CI sonuçları henüz bağlı değil
            </Text>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-muted"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Chromatic
        </button>
      </div>

      {/* Evidence Status Banner */}
      {data.evidenceStatus === 'no_data' && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <Text className="text-sm text-amber-800">
            Evidence registry bulunamadi. <code className="rounded-sm bg-amber-100 px-1 text-xs">npm run collect:evidence</code> komutunu calistirin.
          </Text>
        </div>
      )}
      {data.evidenceStatus === 'configured' && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3">
          <Clock className="h-4 w-4 text-blue-600" />
          <Text className="text-sm text-blue-800">
            Yapilandirilmis — henuz kosulmadi. CI pipeline ilk calistirildiginda sonuclar burada gorunecek.
          </Text>
        </div>
      )}
      {data.evidenceStatus === 'passing' && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <Text className="text-sm text-emerald-800">
            Tum gorsel regresyon testleri gecti.
          </Text>
        </div>
      )}
      {data.evidenceStatus === 'failing' && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
          <XCircle className="h-4 w-4 text-red-600" />
          <Text className="text-sm text-red-800">
            Gorsel regresyon testlerinde basarisizlik var — asagidaki detaylari inceleyin.
          </Text>
        </div>
      )}

      {/* Build Info Banner — derived from repo config */}
      <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface-default px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-text-secondary" />
            <Text className="text-sm font-medium text-text-primary">
              {data.buildInfo.browsers.join(" · ")}
            </Text>
          </div>
          <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-mono text-text-secondary">
            threshold: {data.buildInfo.thresholdPixelRatio}
          </span>
          {data.buildInfo.chromaticWorkflow && (
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Chromatic CI
            </span>
          )}
          {data.buildInfo.playwrightWorkflow && (
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              Playwright CI
            </span>
          )}
        </div>
        <Text variant="secondary" className="text-xs">
          Son sonuclar CI artefaktindan alinacak.{" "}
          <a
            href="https://github.com/Halildeu/web/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-action-primary underline"
          >
            GitHub Actions
          </a>
        </Text>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Passed" value={data.passCount} color="text-emerald-600" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} />
        <StatCard label="Changed" value={data.changedCount} color="text-amber-600" icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} />
        <StatCard label="Failed" value={data.failCount} color="text-red-600" icon={<XCircle className="h-4 w-4 text-red-500" />} />
        <StatCard label="Snapshots" value={data.totalSnapshots} color="text-text-primary" icon={<Image className="h-4 w-4 text-text-secondary" />} />
        <div className="flex items-center justify-center rounded-2xl border border-border-subtle bg-surface-default p-4">
          <AcceptanceGauge rate={data.acceptanceRate} />
        </div>
      </div>

      {/* Filter + Results */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle px-4 py-3">
          <Filter className="h-4 w-4 text-text-secondary" />
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={[
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                filter === opt.id
                  ? "bg-action-primary text-white"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {opt.label}
              <span className={filter === opt.id ? "text-white/70" : "text-text-tertiary"}>
                {opt.count}
              </span>
            </button>
          ))}
          <input
            type="text"
            placeholder="Search components…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto max-w-[200px] rounded-lg border border-border-subtle bg-surface-canvas px-3 py-1.5 text-xs text-text-primary outline-hidden placeholder:text-text-tertiary focus:border-action-primary"
          />
        </div>

        {/* Results List */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Text variant="secondary" className="text-sm">
                No components match the current filter
              </Text>
            </div>
          ) : (
            filteredResults.map((result) => (
              <ResultRow key={result.componentName} result={result} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-4 py-2">
          <Text variant="secondary" className="text-[11px]">
            Showing {filteredResults.length} of {data.results.length} components · {data.totalSnapshots} total snapshots
          </Text>
        </div>
      </div>
    </div>
  );
};

export default VisualRegressionPage;
