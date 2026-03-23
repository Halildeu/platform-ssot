/**
 * AuditTrailPanel — Timeline of governance audit entries
 *
 * Renders a filterable list of audit trail entries showing actor,
 * timestamp, action type, and human-readable details.
 */

import React, { useMemo, useState } from "react";
import { Clock, Filter } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useAuditTrail, type AuditAction, type AuditEntry } from "./useAuditTrail";

const ACTION_LABELS: Record<AuditAction, string> = {
  doc_entry_modified: "Doc Modified",
  quality_override: "Quality Override",
  deprecation_approved: "Deprecation Approved",
  deprecation_proposed: "Deprecation Proposed",
  role_changed: "Role Changed",
  lifecycle_transition: "Lifecycle Transition",
  exception_created: "Exception Created",
  component_published: "Component Published",
};

const ACTION_COLORS: Record<AuditAction, string> = {
  doc_entry_modified: "bg-blue-100 text-blue-700",
  quality_override: "bg-amber-100 text-amber-700",
  deprecation_approved: "bg-red-100 text-red-700",
  deprecation_proposed: "bg-orange-100 text-orange-700",
  role_changed: "bg-purple-100 text-purple-700",
  lifecycle_transition: "bg-emerald-100 text-emerald-700",
  exception_created: "bg-yellow-100 text-yellow-700",
  component_published: "bg-teal-100 text-teal-700",
};

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface AuditTrailPanelProps {
  /** Maximum entries to display (default: 50) */
  maxEntries?: number;
  /** Filter to a specific target component */
  targetFilter?: string;
}

export function AuditTrailPanel({
  maxEntries = 50,
  targetFilter,
}: AuditTrailPanelProps) {
  const { entries } = useAuditTrail();
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (targetFilter) {
      result = result.filter((e) => e.target === targetFilter);
    }

    if (actionFilter !== "all") {
      result = result.filter((e) => e.action === actionFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.target.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q),
      );
    }

    return result.slice(0, maxEntries);
  }, [entries, actionFilter, searchQuery, targetFilter, maxEntries]);

  const actionOptions = Object.keys(ACTION_LABELS) as AuditAction[];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-secondary" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Audit Trail
          </Text>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-secondary">
            {filteredEntries.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="h-8 w-full rounded-lg border border-border-subtle bg-surface-canvas px-3 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-default focus:outline-hidden focus:ring-1 focus:ring-[var(--accent-focus)]"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-text-secondary" />
          <select
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value as AuditAction | "all")
            }
            className="h-8 rounded-lg border border-border-subtle bg-surface-canvas px-2 text-xs text-text-primary focus:outline-hidden"
          >
            <option value="all">All actions</option>
            {actionOptions.map((action) => (
              <option key={action} value={action}>
                {ACTION_LABELS[action]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface-canvas px-4 py-6 text-center">
          <Text variant="secondary" className="text-sm">
            No audit entries found.
          </Text>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredEntries.map((entry) => (
            <AuditEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function AuditEntryRow({ entry }: { entry: AuditEntry }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-border-subtle hover:bg-surface-muted/50">
      {/* Timeline dot */}
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-border-default" />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${ACTION_COLORS[entry.action]}`}
          >
            {ACTION_LABELS[entry.action]}
          </span>
          <Text className="truncate text-xs font-medium text-text-primary">
            {entry.target}
          </Text>
          <Text variant="secondary" className="shrink-0 text-[10px]">
            {formatRelativeTime(entry.timestamp)}
          </Text>
        </div>
        <Text variant="secondary" className="mt-0.5 text-xs leading-5">
          {entry.details}
        </Text>
        <Text variant="secondary" className="text-[10px]">
          by {entry.actor}
        </Text>
      </div>
    </div>
  );
}

export default AuditTrailPanel;
