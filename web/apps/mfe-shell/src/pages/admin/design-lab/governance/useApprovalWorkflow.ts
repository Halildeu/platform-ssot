/**
 * Approval workflow for Design Lab governance decisions
 *
 * Workflow types:
 * - deprecation: propose -> review -> approve/reject
 * - quality_exception: request -> review -> approve with expiry
 * - breaking_change: propose -> impact analysis -> approve
 *
 * Storage: localStorage in dev, API endpoint in prod
 */

import { useState, useCallback, useEffect } from "react";

export type ApprovalType =
  | "deprecation"
  | "quality_exception"
  | "breaking_change";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  proposer: string;
  reviewer?: string;
  target: string;
  reason: string;
  createdAt: string;
  resolvedAt?: string;
  expiresAt?: string;
}

const STORAGE_KEY = "design-lab-approval-requests";

function loadRequests(): ApprovalRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ApprovalRequest[];
  } catch {
    return [];
  }
}

function persistRequests(requests: ApprovalRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Storage unavailable — silently drop
  }
}

let nextId = Date.now();

export function useApprovalWorkflow(): {
  requests: ApprovalRequest[];
  propose: (
    type: ApprovalType,
    target: string,
    reason: string,
  ) => ApprovalRequest;
  approve: (id: string, reviewer: string) => void;
  reject: (id: string, reviewer: string, reason: string) => void;
  getPending: () => ApprovalRequest[];
  getByTarget: (target: string) => ApprovalRequest[];
} {
  const [requests, setRequests] = useState<ApprovalRequest[]>(() =>
    loadRequests(),
  );

  useEffect(() => {
    persistRequests(requests);
  }, [requests]);

  const propose = useCallback(
    (type: ApprovalType, target: string, reason: string): ApprovalRequest => {
      const request: ApprovalRequest = {
        id: `approval-${++nextId}`,
        type,
        status: "pending",
        proposer: "current-user",
        target,
        reason,
        createdAt: new Date().toISOString(),
        expiresAt:
          type === "quality_exception"
            ? new Date(Date.now() + 30 * 24 * 60 * 60_000).toISOString()
            : undefined,
      };
      setRequests((prev) => [request, ...prev]);
      return request;
    },
    [],
  );

  const approve = useCallback((id: string, reviewer: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved" as const,
              reviewer,
              resolvedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
  }, []);

  const reject = useCallback(
    (id: string, reviewer: string, _reason: string) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "rejected" as const,
                reviewer,
                resolvedAt: new Date().toISOString(),
              }
            : r,
        ),
      );
    },
    [],
  );

  const getPending = useCallback(
    () => requests.filter((r) => r.status === "pending"),
    [requests],
  );

  const getByTarget = useCallback(
    (target: string) => requests.filter((r) => r.target === target),
    [requests],
  );

  return { requests, propose, approve, reject, getPending, getByTarget };
}
