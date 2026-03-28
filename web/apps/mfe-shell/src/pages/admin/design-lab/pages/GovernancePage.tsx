/**
 * GovernancePage — Design Lab Governance Plane
 *
 * Combines all governance panels into a single command center:
 * 1. Release Health Card (top)
 * 2. Approval Queue (pending items)
 * 3. Ownership Coverage
 * 4. Audit Trail (recent entries)
 * 5. RBAC info (current role)
 * 6. Deprecation Timeline
 * 7. Quality Exception Registry
 * 8. Policy Compliance Summary
 * 9. Known Issues Panel
 */

import React, { useMemo } from "react";
import {
  Shield,
  Clock,
  AlertOctagon,
  CheckSquare,
  AlertCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { ReleaseHealthCard } from "../governance/ReleaseHealthCard";
import { ApprovalQueue } from "../governance/ApprovalQueue";
import { OwnershipPanel } from "../governance/OwnershipPanel";
import { AuditTrailPanel } from "../governance/AuditTrailPanel";
import { useDesignLabRBAC } from "../governance/useDesignLabRBAC";
import { useDesignLab } from "../DesignLabProvider";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";

const ROLE_LABELS: Record<string, string> = {
  viewer: "Viewer",
  contributor: "Contributor",
  maintainer: "Maintainer",
  admin: "Admin",
};

const ROLE_COLORS: Record<string, string> = {
  viewer: "bg-surface-muted text-text-secondary",
  contributor: "bg-state-info-bg text-state-info-text",
  maintainer: "bg-action-primary/10 text-action-primary",
  admin: "bg-state-success-bg text-state-success-text",
};

/* ------------------------------------------------------------------ */
/*  Quality gate constants                                             */
/* ------------------------------------------------------------------ */

const ALL_QUALITY_GATES = [
  "design_tokens",
  "a11y_keyboard_support",
  "unit_tests",
  "visual_regression",
  "documentation",
];

/* ------------------------------------------------------------------ */
/*  Deprecation Timeline                                               */
/* ------------------------------------------------------------------ */

function DeprecationTimeline() {
  const { index } = useDesignLab();

  const deprecated = useMemo(() => {
    return index.items.filter(
      (item) =>
        item.lifecycle === ("deprecated" as string) ||
        (item.tags && item.tags.includes("deprecated")),
    );
  }, [index.items]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-state-warning-text" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Deprecation Timeline
          </Text>
        </div>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="mt-3">
        {deprecated.length === 0 ? (
          <div className="rounded-xl bg-state-success-bg p-4 text-center">
            <CheckSquare className="mx-auto h-6 w-6 text-state-success-text" />
            <Text className="mt-2 text-sm font-medium text-state-success-text">
              0 deprecated — tum bilesenler guncel
            </Text>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {deprecated.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-xl border border-state-warning-text/20/50 bg-state-warning-bg/50 p-3"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-state-warning-text" />
                <div className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold text-text-primary">
                    {item.name}
                  </Text>
                  <Text variant="secondary" className="text-xs">
                    {item.group} / {item.subgroup}
                  </Text>
                </div>
                <div className="text-right">
                  <Text variant="secondary" className="text-[10px]">
                    Lifecycle: {item.lifecycle}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quality Exception Registry                                         */
/* ------------------------------------------------------------------ */

function QualityExceptionRegistry() {
  const { index } = useDesignLab();

  const exceptions = useMemo(() => {
    return index.items.filter(
      (item) =>
        item.lifecycle === ("experimental" as string) &&
        item.whereUsed.length > 0,
    );
  }, [index.items]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-state-danger-text" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Quality Exception Registry
          </Text>
        </div>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="mt-3">
        {exceptions.length === 0 ? (
          <div className="rounded-xl bg-state-success-bg p-4 text-center">
            <CheckSquare className="mx-auto h-6 w-6 text-state-success-text" />
            <Text className="mt-2 text-sm font-medium text-state-success-text">
              Kalite istisna kaydı yok — tum uretim bilesenleri stabil
            </Text>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {exceptions.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-xl border border-state-danger-text/20/50 bg-state-danger-bg/30 p-3"
              >
                <AlertOctagon className="h-4 w-4 shrink-0 text-state-danger-text" />
                <div className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold text-text-primary">
                    {item.name}
                  </Text>
                  <Text variant="secondary" className="text-xs">
                    Maturity: {item.lifecycle} &middot; Kullanim:{" "}
                    {item.whereUsed.length} uygulama
                  </Text>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.whereUsed.slice(0, 3).map((app) => (
                    <span
                      key={app}
                      className="rounded-xs bg-state-danger-bg px-1.5 py-0.5 text-[10px] font-medium text-state-danger-text"
                    >
                      {app}
                    </span>
                  ))}
                  {item.whereUsed.length > 3 && (
                    <span className="rounded-xs bg-surface-muted px-1.5 py-0.5 text-[10px] text-text-secondary">
                      +{item.whereUsed.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Policy Compliance Summary                                          */
/* ------------------------------------------------------------------ */

function PolicyComplianceSummary() {
  const { index } = useDesignLab();

  const stats = useMemo(() => {
    const items = index.items;
    const total = items.length;
    if (total === 0)
      return { total: 0, allGates: 0, designTokens: 0, a11yKeyboard: 0, pct: 0 };

    const allGates = items.filter(
      (item) =>
        item.qualityGates.length >= ALL_QUALITY_GATES.length &&
        ALL_QUALITY_GATES.every((g) => item.qualityGates.includes(g)),
    ).length;

    const designTokens = items.filter((item) =>
      item.qualityGates.includes("design_tokens"),
    ).length;

    const a11yKeyboard = items.filter((item) =>
      item.qualityGates.includes("a11y_keyboard_support"),
    ).length;

    const pct =
      total > 0 ? Math.round((allGates / total) * 100) : 0;

    return { total, allGates, designTokens, a11yKeyboard, pct };
  }, [index.items]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-action-primary" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Policy Compliance Summary
          </Text>
        </div>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="flex flex-col mt-4 gap-3">
        {/* Overall compliance bar */}
        <div>
          <div className="flex items-center justify-between">
            <Text variant="secondary" className="text-xs">
              Tum kapilar gecen bilesenler
            </Text>
            <Text className="text-sm font-bold text-text-primary">
              {stats.pct}%
            </Text>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={`h-full rounded-full transition-all ${
                stats.pct >= 80
                  ? "bg-state-success-text"
                  : stats.pct >= 50
                    ? "bg-state-warning-text"
                    : "bg-state-danger-text"
              }`}
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>

        {/* Gate breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface-muted p-3 text-center">
            <Text className="text-xl font-bold text-text-primary">
              {stats.allGates}
              <span className="text-sm font-normal text-text-secondary">
                /{stats.total}
              </span>
            </Text>
            <Text variant="secondary" className="text-[10px]">
              Tum 5 kapi
            </Text>
          </div>
          <div className="rounded-xl bg-surface-muted p-3 text-center">
            <Text className="text-xl font-bold text-text-primary">
              {stats.designTokens}
              <span className="text-sm font-normal text-text-secondary">
                /{stats.total}
              </span>
            </Text>
            <Text variant="secondary" className="text-[10px]">
              design_tokens
            </Text>
          </div>
          <div className="rounded-xl bg-surface-muted p-3 text-center">
            <Text className="text-xl font-bold text-text-primary">
              {stats.a11yKeyboard}
              <span className="text-sm font-normal text-text-secondary">
                /{stats.total}
              </span>
            </Text>
            <Text variant="secondary" className="text-[10px]">
              a11y_keyboard
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Known Issues Panel                                                 */
/* ------------------------------------------------------------------ */

function KnownIssuesPanel() {
  const { index } = useDesignLab();

  const issueCount = useMemo(() => {
    // Count items with lifecycle=beta and quality gates < 3 as potential issues
    return index.items.filter(
      (item) =>
        item.lifecycle === "beta" && item.qualityGates.length < 3,
    ).length;
  }, [index.items]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-state-warning-text" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Known Issues
          </Text>
        </div>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between rounded-xl bg-surface-muted p-4">
          <div>
            <Text className="text-2xl font-bold text-text-primary">
              {issueCount}
            </Text>
            <Text variant="secondary" className="text-xs">
              beta bilesen, yetersiz kalite kapisi (&lt;3)
            </Text>
          </div>
          <a
            href="/admin/design-lab/quality-dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-action-primary/10 px-3 py-2 text-xs font-semibold text-action-primary transition hover:bg-action-primary/20"
          >
            Quality Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function GovernancePage() {
  const { role, permissions } = useDesignLabRBAC();

  return (
    <div className="flex flex-col mx-auto max-w-5xl gap-6 px-4 py-6 sm:px-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-text-secondary" />
            <Text as="h1" className="text-xl font-bold text-text-primary">
              Governance
            </Text>
          </div>
          <Text variant="secondary" className="mt-1 text-sm leading-6">
            Policy cockpit for RBAC, approvals, ownership, and release health.
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <DataProvenanceBadge level="derived" />
          {/* Current role badge */}
          <div className="flex items-center gap-1.5">
            <Text variant="secondary" className="text-xs">
              Your role:
            </Text>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_COLORS[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Release Health */}
      <ReleaseHealthCard />

      {/* 2. Approval Queue */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <ApprovalQueue />
      </div>

      {/* Two-column layout for ownership + audit */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3. Ownership Coverage */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <OwnershipPanel />
        </div>

        {/* 4. Audit Trail */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
          <AuditTrailPanel maxEntries={20} />
        </div>
      </div>

      {/* 5. RBAC permissions summary */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-text-secondary" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Your Permissions
          </Text>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            Object.entries(permissions) as [string, boolean][]
          ).map(([key, value]) => (
            <div
              key={key}
              className={`rounded-lg px-3 py-2 text-xs ${
                value
                  ? "bg-state-success-bg text-state-success-text"
                  : "bg-surface-muted text-text-secondary"
              }`}
            >
              <span className="mr-1.5">{value ? "\u2713" : "\u2717"}</span>
              {key
                .replace("can", "")
                .replace(/([A-Z])/g, " $1")
                .trim()}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Policy Compliance Summary */}
      <PolicyComplianceSummary />

      {/* Two-column layout for deprecation + exceptions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 7. Deprecation Timeline */}
        <DeprecationTimeline />

        {/* 8. Quality Exception Registry */}
        <QualityExceptionRegistry />
      </div>

      {/* 9. Known Issues */}
      <KnownIssuesPanel />
    </div>
  );
}
