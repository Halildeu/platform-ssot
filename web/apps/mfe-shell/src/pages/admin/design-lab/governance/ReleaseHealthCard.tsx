/**
 * ReleaseHealthCard — Visual health summary for the design system release
 *
 * Shows current version, verify status, coverage, pending approvals,
 * and known issues with color-coded indicators.
 */

import React from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Clock,
  Bug,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { useReleaseHealth, type ReleaseHealth } from "./useReleaseHealth";

const STATUS_CONFIG = {
  pass: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Passing",
  },
  fail: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Failing",
  },
  unknown: {
    icon: HelpCircle,
    color: "text-text-secondary",
    bg: "bg-surface-muted",
    label: "Unknown",
  },
} as const;

const COVERAGE_CONFIG = {
  good: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Good",
  },
  warning: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Warning",
  },
  critical: {
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Critical",
  },
  unknown: {
    color: "text-text-secondary",
    bg: "bg-surface-muted",
    label: "Unknown",
  },
} as const;

export function ReleaseHealthCard() {
  const health = useReleaseHealth();

  const verifyConfig = STATUS_CONFIG[health.verifyStatus];
  const VerifyIcon = verifyConfig.icon;
  const coverageConfig = COVERAGE_CONFIG[health.coverageStatus];

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-text-secondary" />
        <Text as="h3" className="text-sm font-semibold text-text-primary">
          Release Health
        </Text>
      </div>

      {/* Version + date */}
      <div className="mt-3 flex items-baseline gap-2">
        <Text className="text-2xl font-bold text-text-primary">
          v{health.currentVersion}
        </Text>
        {health.lastReleaseDate && (
          <Text variant="secondary" className="text-xs">
            released {health.lastReleaseDate}
          </Text>
        )}
      </div>

      {/* Metrics grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Verify status */}
        <div className={`rounded-xl px-3 py-2.5 ${verifyConfig.bg}`}>
          <div className="flex items-center gap-1.5">
            <VerifyIcon className={`h-3.5 w-3.5 ${verifyConfig.color}`} />
            <Text className={`text-xs font-medium ${verifyConfig.color}`}>
              {verifyConfig.label}
            </Text>
          </div>
          <Text variant="secondary" className="mt-0.5 text-[10px]">
            Verify
          </Text>
        </div>

        {/* Coverage */}
        <div className={`rounded-xl px-3 py-2.5 ${coverageConfig.bg}`}>
          <Text className={`text-xs font-medium ${coverageConfig.color}`}>
            {coverageConfig.label}
          </Text>
          <Text variant="secondary" className="mt-0.5 text-[10px]">
            Coverage
          </Text>
        </div>

        {/* Pending approvals */}
        <div className="rounded-xl bg-surface-muted px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <Text className="text-xs font-medium text-text-primary">
              {health.pendingApprovals}
            </Text>
          </div>
          <Text variant="secondary" className="mt-0.5 text-[10px]">
            Pending
          </Text>
        </div>

        {/* Known issues */}
        <div className="rounded-xl bg-surface-muted px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5 text-text-secondary" />
            <Text className="text-xs font-medium text-text-primary">
              {health.knownIssues}
            </Text>
          </div>
          <Text variant="secondary" className="mt-0.5 text-[10px]">
            Known Issues
          </Text>
        </div>
      </div>

      {/* Changelog link */}
      <div className="mt-3 flex items-center gap-2">
        <Text variant="secondary" className="text-[11px]">
          {health.changelogEntries} packages tracked
        </Text>
      </div>
    </div>
  );
}

export default ReleaseHealthCard;
