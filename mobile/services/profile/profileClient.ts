import type { OfflineQueueMutationAdapter, OfflineQueueMutationResult, QueuedAction } from "@platform-mobile/core";

import { resolveGatewayBaseUrl } from "../api/httpClient";
import type {
  ProfileSessionTimeoutMutationRequest,
  ProfileSessionTimeoutMutationResponse,
  ProfileSessionTimeoutSnapshot,
} from "./profile.contract";

const DEFAULT_SOURCE = "mobile-offline-queue";
const DEFAULT_RETRY_AFTER_MS = 30_000;

function buildProfileSessionTimeoutUrl() {
  return `${resolveGatewayBaseUrl().replace(/\/+$/, "")}/v1/users/me/session-timeout`;
}

function buildAuthorizedHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

function getErrorCode(payload: unknown) {
  if (payload && typeof payload === "object" && "errorCode" in payload) {
    const errorCode = (payload as { errorCode?: unknown }).errorCode;
    if (typeof errorCode === "string" && errorCode.trim()) {
      return errorCode;
    }
  }

  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }

  return null;
}

function getConflictReason(payload: unknown) {
  if (payload && typeof payload === "object" && "conflictReason" in payload) {
    const conflictReason = (payload as { conflictReason?: unknown }).conflictReason;
    if (typeof conflictReason === "string" && conflictReason.trim()) {
      return conflictReason;
    }
  }

  return null;
}

function getRetryAfterMs(response: Response) {
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) {
    return null;
  }

  const seconds = Number.parseInt(retryAfter, 10);
  if (Number.isFinite(seconds) && seconds > 0) {
    return seconds * 1000;
  }

  return null;
}

async function readJsonSafe<T>(response: Response) {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchProfileSessionTimeoutSnapshot(
  token: string,
): Promise<ProfileSessionTimeoutSnapshot> {
  const response = await fetch(buildProfileSessionTimeoutUrl(), {
    method: "GET",
    headers: buildAuthorizedHeaders(token),
  });

  const payload = await readJsonSafe<ProfileSessionTimeoutSnapshot>(response);
  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Profile sync snapshot failed: ${response.status}`));
  }

  return payload;
}

export async function syncProfileSessionTimeout(
  token: string,
  request: ProfileSessionTimeoutMutationRequest,
): Promise<ProfileSessionTimeoutMutationResponse> {
  const response = await fetch(buildProfileSessionTimeoutUrl(), {
    method: "PUT",
    headers: buildAuthorizedHeaders(token),
    body: JSON.stringify({
      expectedVersion: request.expectedVersion,
      sessionTimeoutMinutes: request.sessionTimeoutMinutes,
      source: request.source ?? DEFAULT_SOURCE,
      attemptCount: request.attemptCount,
      queueActionId: request.queueActionId,
    }),
  });

  const payload = await readJsonSafe<ProfileSessionTimeoutMutationResponse>(response);
  if (response.status === 409 && payload) {
    return payload;
  }

  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Profile sync mutation failed: ${response.status}`));
  }

  return payload;
}

function mapQueuedActionToMutationRequest(action: QueuedAction): ProfileSessionTimeoutMutationRequest {
  return {
    expectedVersion: action.expectedVersion,
    sessionTimeoutMinutes: action.targetSessionTimeoutMinutes,
    source: DEFAULT_SOURCE,
    attemptCount: action.attemptCount + 1,
    queueActionId: action.id,
  };
}

function mapHttpFailureResult(response: Response, payload: unknown): OfflineQueueMutationResult {
  const errorCode = getErrorCode(payload);
  const message = getErrorMessage(payload, `Profile sync mutation failed: ${response.status}`);

  if (response.status === 429) {
    return {
      status: "failed",
      retryable: true,
      retryAfterMs: getRetryAfterMs(response) ?? DEFAULT_RETRY_AFTER_MS,
      errorCode: errorCode ?? "RATE_LIMITED",
      message,
    };
  }

  if (response.status >= 500) {
    return {
      status: "failed",
      retryable: true,
      retryAfterMs: DEFAULT_RETRY_AFTER_MS,
      errorCode: errorCode ?? "BACKEND_UNAVAILABLE",
      message,
    };
  }

  return {
    status: "failed",
    retryable: false,
    errorCode: errorCode ?? `HTTP_${response.status}`,
    message,
  };
}

export function createProfileSyncMutationAdapter(token: string): OfflineQueueMutationAdapter {
  return {
    execute: async (action: QueuedAction): Promise<OfflineQueueMutationResult> => {
      const request = mapQueuedActionToMutationRequest(action);
      let response: Response;

      try {
        response = await fetch(buildProfileSessionTimeoutUrl(), {
          method: "PUT",
          headers: buildAuthorizedHeaders(token),
          body: JSON.stringify({
            expectedVersion: request.expectedVersion,
            sessionTimeoutMinutes: request.sessionTimeoutMinutes,
            source: request.source ?? DEFAULT_SOURCE,
            attemptCount: request.attemptCount,
            queueActionId: request.queueActionId,
          }),
        });
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim()
            ? error.message
            : "Profile sync request failed.";

        return {
          status: "failed",
          retryable: true,
          retryAfterMs: DEFAULT_RETRY_AFTER_MS,
          errorCode: "NETWORK_UNAVAILABLE",
          message,
        };
      }

      const payload = await readJsonSafe<ProfileSessionTimeoutMutationResponse>(response);
      if (response.status === 409 && payload) {
        return {
          status: "conflict",
          auditId: payload.auditId,
          resourceVersion: payload.version,
          sessionTimeoutMinutes: payload.sessionTimeoutMinutes,
          errorCode: payload.errorCode,
          conflictReason: payload.conflictReason,
          message: payload.message || "Profile sync conflict detected.",
        };
      }

      if (!response.ok || !payload) {
        return mapHttpFailureResult(response, payload);
      }

      return {
        status: "drained",
        auditId: payload.auditId,
        resourceVersion: payload.version,
        sessionTimeoutMinutes: payload.sessionTimeoutMinutes,
        message: payload.message,
      };
    },
  };
}
