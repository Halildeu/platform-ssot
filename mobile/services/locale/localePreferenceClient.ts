import type {
  OfflineQueueMutationAdapter,
  OfflineQueueMutationResult,
  QueuedAction,
} from "@platform-mobile/core";

import { resolveGatewayBaseUrl } from "../api/httpClient";
import type {
  LocalePreferenceMutationRequest,
  LocalePreferenceMutationResponse,
  LocalePreferenceSnapshot,
} from "./localePreference.contract";

const DEFAULT_SOURCE = "mobile-offline-queue";
const DEFAULT_RETRY_AFTER_MS = 30_000;

function buildLocalePreferenceUrl() {
  return `${resolveGatewayBaseUrl().replace(/\/+$/, "")}/v1/users/me/locale`;
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

function normalizeLocale(locale: string) {
  return locale.trim().toLowerCase().replace("-", "_");
}

export async function fetchLocalePreferenceSnapshot(token: string): Promise<LocalePreferenceSnapshot> {
  const response = await fetch(buildLocalePreferenceUrl(), {
    method: "GET",
    headers: buildAuthorizedHeaders(token),
  });

  const payload = await readJsonSafe<LocalePreferenceSnapshot>(response);
  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Locale snapshot failed: ${response.status}`));
  }

  return payload;
}

function mapQueuedActionToMutationRequest(action: QueuedAction): LocalePreferenceMutationRequest {
  return {
    locale: normalizeLocale(action.targetLocale ?? "tr"),
    expectedVersion: action.expectedVersion,
    source: DEFAULT_SOURCE,
    attemptCount: action.attemptCount + 1,
    queueActionId: action.id,
  };
}

function mapHttpFailureResult(response: Response, payload: unknown): OfflineQueueMutationResult {
  const errorCode = getErrorCode(payload);
  const message = getErrorMessage(payload, `Locale mutation failed: ${response.status}`);

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

export function createLocalePreferenceSyncMutationAdapter(token: string): OfflineQueueMutationAdapter {
  return {
    execute: async (action: QueuedAction): Promise<OfflineQueueMutationResult> => {
      if (action.kind !== "profile.locale.sync") {
        return {
          status: "failed",
          retryable: false,
          errorCode: "UNSUPPORTED_MUTATION_KIND",
          message: "Locale adapter cannot handle this queued action.",
        };
      }

      const request = mapQueuedActionToMutationRequest(action);
      let response: Response;

      try {
        response = await fetch(buildLocalePreferenceUrl(), {
          method: "PUT",
          headers: buildAuthorizedHeaders(token),
          body: JSON.stringify({
            locale: request.locale,
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
            : "Locale sync request failed.";

        return {
          status: "failed",
          retryable: true,
          retryAfterMs: DEFAULT_RETRY_AFTER_MS,
          errorCode: "NETWORK_UNAVAILABLE",
          message,
        };
      }

      const payload = await readJsonSafe<LocalePreferenceMutationResponse>(response);
      if (response.status === 409 && payload) {
        return {
          status: "conflict",
          auditId: payload.auditId,
          resourceVersion: payload.version,
          locale: payload.locale,
          errorCode: payload.errorCode,
          conflictReason: payload.conflictReason,
          message: payload.message || "Locale sync conflict detected.",
        };
      }

      if (!response.ok || !payload) {
        return mapHttpFailureResult(response, payload);
      }

      return {
        status: "drained",
        auditId: payload.auditId,
        resourceVersion: payload.version,
        locale: payload.locale,
        message: payload.message,
      };
    },
  };
}
