import type { OfflineQueueMutationAdapter, OfflineQueueMutationResult, QueuedAction } from "@platform-mobile/core";

import { resolveGatewayBaseUrl } from "../api/httpClient";
import type {
  NotificationPreferenceMutationRequest,
  NotificationPreferenceMutationResponse,
  NotificationPreferenceSnapshot,
} from "./notificationPreference.contract";

const DEFAULT_SOURCE = "mobile-offline-queue";
const DEFAULT_RETRY_AFTER_MS = 30_000;

function normalizeChannel(channel: string) {
  return channel.trim().toLowerCase().replace("-", "_");
}

function buildNotificationPreferenceUrl(channel: string) {
  return `${resolveGatewayBaseUrl().replace(/\/+$/, "")}/v1/notification-preferences/${normalizeChannel(channel)}`;
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

export async function fetchNotificationPreferenceSnapshot(
  token: string,
  channel: string,
): Promise<NotificationPreferenceSnapshot> {
  const response = await fetch(buildNotificationPreferenceUrl(channel), {
    method: "GET",
    headers: buildAuthorizedHeaders(token),
  });

  const payload = await readJsonSafe<NotificationPreferenceSnapshot>(response);
  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Notification preference snapshot failed: ${response.status}`));
  }

  return payload;
}

function mapQueuedActionToMutationRequest(action: QueuedAction): NotificationPreferenceMutationRequest {
  return {
    enabled: action.targetPreferenceEnabled ?? true,
    frequency: action.targetPreferenceFrequency,
    expectedVersion: action.expectedVersion,
    source: DEFAULT_SOURCE,
    attemptCount: action.attemptCount + 1,
    queueActionId: action.id,
  };
}

function mapHttpFailureResult(response: Response, payload: unknown): OfflineQueueMutationResult {
  const errorCode = getErrorCode(payload);
  const message = getErrorMessage(payload, `Notification preference mutation failed: ${response.status}`);

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

export function createNotificationPreferenceSyncMutationAdapter(token: string): OfflineQueueMutationAdapter {
  return {
    execute: async (action: QueuedAction): Promise<OfflineQueueMutationResult> => {
      if (action.kind !== "notification.preference.sync" || !action.preferenceChannel) {
        return {
          status: "failed",
          retryable: false,
          errorCode: "UNSUPPORTED_MUTATION_KIND",
          message: "Notification preference adapter cannot handle this queued action.",
        };
      }

      const request = mapQueuedActionToMutationRequest(action);
      let response: Response;

      try {
        response = await fetch(buildNotificationPreferenceUrl(action.preferenceChannel), {
          method: "PUT",
          headers: buildAuthorizedHeaders(token),
          body: JSON.stringify({
            enabled: request.enabled,
            frequency: request.frequency,
            expectedVersion: request.expectedVersion,
            source: request.source ?? DEFAULT_SOURCE,
            attemptCount: request.attemptCount,
            queueActionId: request.queueActionId,
          }),
        });
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim()
            ? error.message
            : "Notification preference request failed.";

        return {
          status: "failed",
          retryable: true,
          retryAfterMs: DEFAULT_RETRY_AFTER_MS,
          errorCode: "NETWORK_UNAVAILABLE",
          message,
        };
      }

      const payload = await readJsonSafe<NotificationPreferenceMutationResponse>(response);
      if (response.status === 409 && payload) {
        return {
          status: "conflict",
          auditId: payload.auditId,
          resourceVersion: payload.version,
          preferenceChannel: payload.channel,
          preferenceEnabled: payload.enabled,
          preferenceFrequency: payload.frequency,
          errorCode: payload.errorCode,
          conflictReason: payload.conflictReason,
          message: payload.message || "Notification preference conflict detected.",
        };
      }

      if (!response.ok || !payload) {
        return mapHttpFailureResult(response, payload);
      }

      return {
        status: "drained",
        auditId: payload.auditId,
        resourceVersion: payload.version,
        preferenceChannel: payload.channel,
        preferenceEnabled: payload.enabled,
        preferenceFrequency: payload.frequency,
        message: payload.message,
      };
    },
  };
}
