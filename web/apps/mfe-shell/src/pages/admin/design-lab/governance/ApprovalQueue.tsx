/**
 * ApprovalQueue — Pending governance approval requests
 *
 * Lists pending items with Approve/Reject actions (role-gated to maintainer+).
 * Shows request details, proposer, age, and type.
 */

import React, { useMemo, useState } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Text } from "@mfe/design-system";
import { useApprovalWorkflow, type ApprovalRequest, type ApprovalType } from "./useApprovalWorkflow";
import { RoleGate } from "./RoleGate";
import { useDesignLabRBAC } from "./useDesignLabRBAC";

const TYPE_LABELS: Record<ApprovalType, string> = {
  deprecation: "Deprecation",
  quality_exception: "Quality Exception",
  breaking_change: "Breaking Change",
};

const TYPE_COLORS: Record<ApprovalType, string> = {
  deprecation: "bg-state-danger-bg text-state-danger-text",
  quality_exception: "bg-state-warning-bg text-state-warning-text",
  breaking_change: "bg-state-warning-bg text-state-warning-text",
};

function formatAge(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

interface ApprovalQueueProps {
  /** Show only pending requests (default: true) */
  pendingOnly?: boolean;
}

export function ApprovalQueue({ pendingOnly = true }: ApprovalQueueProps) {
  const { requests, approve, reject } = useApprovalWorkflow();
  const { role } = useDesignLabRBAC();
  const [typeFilter, setTypeFilter] = useState<ApprovalType | "all">("all");

  const displayed = useMemo(() => {
    let result = pendingOnly
      ? requests.filter((r) => r.status === "pending")
      : requests;

    if (typeFilter !== "all") {
      result = result.filter((r) => r.type === typeFilter);
    }

    return result;
  }, [requests, pendingOnly, typeFilter]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-text-secondary" />
          <Text as="h3" className="text-sm font-semibold text-text-primary">
            Approval Queue
          </Text>
          {pendingCount > 0 && (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-state-warning-text px-1.5 text-[10px] font-bold text-text-inverse">
              {pendingCount}
            </span>
          )}
        </div>
        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as ApprovalType | "all")
          }
          className="h-7 rounded-lg border border-border-subtle bg-surface-canvas px-2 text-xs text-text-primary focus:outline-hidden"
        >
          <option value="all">All types</option>
          {(Object.keys(TYPE_LABELS) as ApprovalType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface-canvas px-4 py-6 text-center">
          <Text variant="secondary" className="text-sm">
            No pending approvals.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayed.map((request) => (
            <ApprovalRequestCard
              key={request.id}
              request={request}
              onApprove={() => approve(request.id, "current-user")}
              onReject={() => reject(request.id, "current-user", "Rejected")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalRequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: ApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-default px-4 py-3 transition hover:shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[request.type]}`}
            >
              {TYPE_LABELS[request.type]}
            </span>
            <Text className="truncate text-sm font-medium text-text-primary">
              {request.target}
            </Text>
          </div>
          <Text variant="secondary" className="mt-1 text-xs leading-5">
            {request.reason}
          </Text>
          <div className="mt-1.5 flex items-center gap-3">
            <Text variant="secondary" className="text-[10px]">
              by {request.proposer}
            </Text>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-text-secondary" />
              <Text variant="secondary" className="text-[10px]">
                {formatAge(request.createdAt)}
              </Text>
            </div>
            {request.status !== "pending" && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  request.status === "approved"
                    ? "bg-state-success-bg text-state-success-text"
                    : "bg-state-danger-bg text-state-danger-text"
                }`}
              >
                {request.status}
              </span>
            )}
          </div>
        </div>

        {/* Actions — role-gated to maintainer+ */}
        {request.status === "pending" && (
          <RoleGate minRole="maintainer">
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={onApprove}
                className="inline-flex items-center gap-1 rounded-lg bg-state-success-bg px-2.5 py-1.5 text-xs font-medium text-state-success-text transition hover:bg-state-success-bg"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                type="button"
                onClick={onReject}
                className="inline-flex items-center gap-1 rounded-lg bg-state-danger-bg px-2.5 py-1.5 text-xs font-medium text-state-danger-text transition hover:bg-state-danger-bg"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          </RoleGate>
        )}
      </div>
    </div>
  );
}

export default ApprovalQueue;
