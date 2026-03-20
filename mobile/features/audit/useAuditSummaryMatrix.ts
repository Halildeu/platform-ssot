import {
  buildAuditSummarySnapshot,
  getAuditFeedCapability,
  listAuditSummaryGroups,
  type AuditCapabilitySummarySnapshot,
  type AuditSummarySnapshot,
} from "@platform/capabilities";
import {
  resolvePermissionGate,
  type AuthSessionBundle,
  type AuthSessionStatus,
} from "@platform-mobile/core";
import { startTransition, useEffect, useState } from "react";

import { fetchAuditPreview } from "../../services/audit/auditClient";

type AuditSummaryMatrixStatus = "idle" | "loading" | "ready" | "blocked" | "error";

type AuditSummaryMatrixState = {
  status: AuditSummaryMatrixStatus;
  groups: AuditSummarySnapshot[];
  error: string | null;
  gateReason: string;
  lastFetchedAt: string | null;
};

const auditSummaryGroups = listAuditSummaryGroups();
const initialGroups = auditSummaryGroups.map((group) => buildAuditSummarySnapshot(group.id, []));

const initialState: AuditSummaryMatrixState = {
  status: "idle",
  groups: initialGroups,
  error: null,
  gateReason: "Sign in before opening protected mobile features.",
  lastFetchedAt: null,
};

function getAuditErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Audit summary request failed.";
}

function isUnauthorizedError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number" &&
    (error as { status: number }).status === 401
  );
}

async function loadAuditSummaryMatrix(
  authStatus: AuthSessionStatus,
  session: AuthSessionBundle | null,
): Promise<AuditSummaryMatrixState> {
  const gate = resolvePermissionGate(authStatus, session, "audit-read");
  if (!gate.allowed || !session) {
    return {
      ...initialState,
      status: "blocked",
      gateReason: gate.reason,
    };
  }

  try {
    const capabilitySnapshots = await Promise.all(
      auditSummaryGroups.flatMap((group) =>
        group.capabilityIds.map(async (capabilityId): Promise<AuditCapabilitySummarySnapshot> => {
          const capability = getAuditFeedCapability(capabilityId);
          const response = await fetchAuditPreview(session.token, {
            action: capability.action,
            page: 1,
            pageSize: 3,
            service: capability.service,
          });
          const latestEvent = [...(response.events ?? [])].sort((left, right) => {
            return Date.parse(right.timestamp) - Date.parse(left.timestamp);
          })[0];

          return {
            capabilityId,
            total: Number(response.total ?? 0),
            latestEventId: latestEvent?.id ?? null,
            latestEventTimestamp: latestEvent?.timestamp ?? null,
            latestAction: latestEvent?.action ?? null,
          };
        }),
      ),
    );

    return {
      status: "ready",
      groups: auditSummaryGroups.map((group) =>
        buildAuditSummarySnapshot(group.id, capabilitySnapshots),
      ),
      error: null,
      gateReason: gate.reason,
      lastFetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      ...initialState,
      status: isUnauthorizedError(error) ? "blocked" : "error",
      error: getAuditErrorMessage(error),
      gateReason: isUnauthorizedError(error)
        ? "Session expired or was revoked. Refresh authorization or sign in again."
        : gate.reason,
    };
  }
}

export function useAuditSummaryMatrix(
  authStatus: AuthSessionStatus,
  session: AuthSessionBundle | null,
) {
  const [state, setState] = useState<AuditSummaryMatrixState>(initialState);
  const gate = resolvePermissionGate(authStatus, session, "audit-read");

  const refresh = async () => {
    startTransition(() => {
      setState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));
    });

    const nextState = await loadAuditSummaryMatrix(authStatus, session);
    startTransition(() => {
      setState(nextState);
    });
  };

  useEffect(() => {
    void refresh();
  }, [authStatus, session?.lastSyncedAt, session?.token]);

  return {
    ...state,
    canReadAudit: gate.allowed,
    refresh,
  };
}
