import type {
  OfflineQueueMutationAdapter,
  OfflineQueueMutationResult,
  QueuedAction,
} from "@platform-mobile/core";

import { resolveGatewayBaseUrl } from "../api/httpClient";
import type {
  DateFormatPreferenceMutationRequest,
  DateFormatPreferenceMutationResponse,
  DateFormatPreferenceSnapshot,
} from "./dateFormatPreference.contract";

const DEFAULT_SOURCE = "mobile-offline-queue";
const DEFAULT_RETRY_AFTER_MS = 30_000;

function buildDateFormatPreferenceUrl() {
  return `${resolveGatewayBaseUrl().replace(/\/+$/, "")}/v1/users/me/date-format`;
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

function normalizeDateFormat(dateFormat: string) {
  return dateFormat.trim();
}

export async function fetchDateFormatPreferenceSnapshot(
  token: string,
): Promise<DateFormatPreferenceSnapshot> {
  const response = await fetch(buildDateFormatPreferenceUrl(), {
    method: "GET",
    headers: buildAuthorizedHeaders(token),
  });

  const payload = await readJsonSafe<DateFormatPreferenceSnapshot>(response);
  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Date-format snapshot failed: ${response.status}`));
  }

  return payload;
}

function mapQueuedActionToMutationRequest(action: QueuedAction): DateFormatPreferenceMutationRequest {
  return {
    dateFormat: normalizeDateFormat(action.targetDateFormat ?? "dd.MM.yyyy"),
    expectedVersion: action.expectedVersion,
    source: DEFAULT_SOURCE,
    attemptCount: action.attemptCount + 1,
    queueActionId: action.id,
  };
}

function mapHttpFailureResult(response: Response, payload: unknown): OfflineQueueMutationResult {
  const errorCode = getErrorCode(payload);
  const message = getErrorMessage(payload, `Date-format mutation failed: ${response.status}`);

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

export function createDateFormatPreferenceSyncMutationAdapter(
  token: string,
): OfflineQueueMutationAdapter {
  return {
    execute: async (action: QueuedAction): Promise<OfflineQueueMutationResult> => {
      if (action.kind !== "profile.date-format.sync") {
        return {
          status: "failed",
          retryable: false,
          errorCode: "UNSUPPORTED_MUTATION_KIND",
          message: "Date-format adapter cannot handle this queued action.",
        };
      }

      const request = mapQueuedActionToMutationRequest(action);
      let response: Response;

      try {
        response = await fetch(buildDateFormatPreferenceUrl(), {
          method: "PUT",
          headers: buildAuthorizedHeaders(token),
          body: JSON.stringify({
            dateFormat: request.dateFormat,
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
            : "Date-format sync request failed.";

        return {
          status: "failed",
          retryable: true,
          retryAfterMs: DEFAULT_RETRY_AFTER_MS,
          errorCode: "NETWORK_UNAVAILABLE",
          message,
        };
      }

      const payload = await readJsonSafe<DateFormatPreferenceMutationResponse>(response);
      if (response.status === 409 && payload) {
        return {
          status: "conflict",
          auditId: payload.auditId,
          resourceVersion: payload.version,
          dateFormat: payload.dateFormat,
          errorCode: payload.errorCode,
          conflictReason: payload.conflictReason,
          message: payload.message || "Date-format sync conflict detected.",
        };
      }

      if (!response.ok || !payload) {
        return mapHttpFailureResult(response, payload);
      }

      return {
        status: "drained",
        auditId: payload.auditId,
        resourceVersion: payload.version,
        dateFormat: payload.dateFormat,
        message: payload.message,
      };
    },
  };
}
