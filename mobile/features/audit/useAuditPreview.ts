import {
  resolvePermissionGate,
  type AuthSessionBundle,
  type AuthSessionStatus,
} from "@platform-mobile/core";
import { startTransition, useEffect, useState } from "react";

import { fetchAuditPreview } from "../../services/audit/auditClient";
import type { AuditEventRecord, AuditPreviewQuery } from "../../services/audit/audit.contract";

type AuditPreviewStatus = "idle" | "loading" | "ready" | "blocked" | "error";

type AuditPreviewState = {
  status: AuditPreviewStatus;
  events: AuditEventRecord[];
  total: number;
  error: string | null;
  gateReason: string;
  lastFetchedAt: string | null;
};

const initialState: AuditPreviewState = {
  status: "idle",
  events: [],
  total: 0,
  error: null,
  gateReason: "Sign in before opening protected mobile features.",
  lastFetchedAt: null,
};

function getAuditErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Audit preview request failed.";
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

async function loadAuditPreview(
  authStatus: AuthSessionStatus,
  session: AuthSessionBundle | null,
  query: AuditPreviewQuery,
): Promise<AuditPreviewState> {
  const gate = resolvePermissionGate(authStatus, session, "audit-read");
  if (!gate.allowed || !session) {
    return {
      ...initialState,
      status: "blocked",
      gateReason: gate.reason,
    };
  }

  try {
    const response = await fetchAuditPreview(session.token, query);
    return {
      status: "ready",
      events: response.events ?? [],
      total: Number(response.total ?? 0),
      error: null,
      gateReason: gate.reason,
      lastFetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: isUnauthorizedError(error) ? "blocked" : "error",
      events: [],
      total: 0,
      error: getAuditErrorMessage(error),
      gateReason: isUnauthorizedError(error)
        ? "Session expired or was revoked. Refresh authorization or sign in again."
        : gate.reason,
      lastFetchedAt: null,
    };
  }
}

export function useAuditPreview(
  authStatus: AuthSessionStatus,
  session: AuthSessionBundle | null,
  query: AuditPreviewQuery = {},
) {
  const [state, setState] = useState<AuditPreviewState>(initialState);
  const gate = resolvePermissionGate(authStatus, session, "audit-read");

  const refresh = async () => {
    startTransition(() => {
      setState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));
    });

    const nextState = await loadAuditPreview(authStatus, session, query);
    startTransition(() => {
      setState(nextState);
    });
  };

  useEffect(() => {
    void refresh();
  }, [authStatus, query.action, query.page, query.pageSize, query.service, session?.token, session?.lastSyncedAt]);

  return {
    ...state,
    canReadAudit: gate.allowed,
    refresh,
  };
}
