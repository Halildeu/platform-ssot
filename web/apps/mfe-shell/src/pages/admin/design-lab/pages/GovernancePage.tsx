/**
 * GovernancePage — Design Lab Governance Plane
 *
 * Combines all governance panels into a single command center:
 * 1. Release Health Card (top)
 * 2. Approval Queue (pending items)
 * 3. Ownership Coverage
 * 4. Audit Trail (recent entries)
 * 5. RBAC info (current role)
 */

import React from "react";
import { Shield } from "lucide-react";
import { Text } from "@mfe/design-system";
import { ReleaseHealthCard } from "../governance/ReleaseHealthCard";
import { ApprovalQueue } from "../governance/ApprovalQueue";
import { OwnershipPanel } from "../governance/OwnershipPanel";
import { AuditTrailPanel } from "../governance/AuditTrailPanel";
import { useDesignLabRBAC } from "../governance/useDesignLabRBAC";
import { DataProvenanceBadge } from "../components/DataProvenanceBadge";

const ROLE_LABELS: Record<string, string> = {
  viewer: "Viewer",
  contributor: "Contributor",
  maintainer: "Maintainer",
  admin: "Admin",
};

const ROLE_COLORS: Record<string, string> = {
  viewer: "bg-surface-muted text-text-secondary",
  contributor: "bg-blue-100 text-blue-700",
  maintainer: "bg-purple-100 text-purple-700",
  admin: "bg-emerald-100 text-emerald-700",
};

export default function GovernancePage() {
  const { role, permissions } = useDesignLabRBAC();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
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
                  ? "bg-emerald-50 text-emerald-700"
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
    </div>
  );
}
