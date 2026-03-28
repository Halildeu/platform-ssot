import {
  buildDefaultOfflineMutationPolicy,
  getOfflineMutationPolicy as getSharedOfflineMutationPolicy,
  listOfflineMutationPolicies as listSharedOfflineMutationPolicies,
} from "@platform/capabilities";
import type {
  OfflineMutationConflictPolicy,
  OfflineMutationKind as SharedOfflineMutationKind,
  OfflineMutationPolicyDescriptor as SharedOfflineMutationPolicyDescriptor,
} from "@platform/capabilities";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export * from "./auth";

export type OfflineMutationKind = SharedOfflineMutationKind;
export type QueueActionStatus = "queued" | "flushing" | "failed" | "conflict";
export type QueueConflictPolicy = OfflineMutationConflictPolicy;
export type QueueReplayResolution = "client-wins" | "server-wins" | "discard";
export type QueueDemoBehavior = "success" | "transient-failure" | "version-conflict";
export type QueueConflictReason = "STALE_EXPECTED_VERSION" | (string & {});

export type OfflineMutationPolicyDescriptor = SharedOfflineMutationPolicyDescriptor;

export type QueuedAction = {
  id: string;
  label: string;
  queuedAt: string;
  status: QueueActionStatus;
  kind: OfflineMutationKind;
  resourceKey: string;
  auditAction: string;
  conflictPolicy: QueueConflictPolicy;
  retryPolicyKey: string;
  demoBehavior: QueueDemoBehavior;
  expectedVersion: number;
  serverVersion: number | null;
  targetSessionTimeoutMinutes: number;
  serverSessionTimeoutMinutes: number | null;
  preferenceChannel: string | null;
  targetPreferenceEnabled: boolean | null;
  serverPreferenceEnabled: boolean | null;
  targetPreferenceFrequency: string | null;
  serverPreferenceFrequency: string | null;
  targetLocale: string | null;
  serverLocale: string | null;
  targetTimezone: string | null;
  serverTimezone: string | null;
  targetDateFormat: string | null;
  serverDateFormat: string | null;
  targetTimeFormat: string | null;
  serverTimeFormat: string | null;
  attemptCount: number;
  lastAttemptAt: string | null;
  lastError: string | null;
  nextRetryAt: string | null;
  auditId: string | null;
  errorCode: string | null;
  conflictReason: QueueConflictReason | null;
};

export type OfflineQueueSummary = {
  queuedCount: number;
  failedCount: number;
  conflictCount: number;
  retryReadyCount: number;
  latestQueuedAction?: QueuedAction;
  lastReplayAt: string | null;
  lastReplayOutcome: string | null;
  lastMutationAuditId: string | null;
};

export type OfflineQueueStorageAdapter = {
  read: () => Promise<QueuedAction[]>;
  write: (actions: QueuedAction[]) => Promise<void>;
};

export type OfflineQueueMutationResult =
  | {
      status: "drained";
      resourceVersion: number;
      sessionTimeoutMinutes?: number | null;
      preferenceChannel?: string | null;
      preferenceEnabled?: boolean | null;
      preferenceFrequency?: string | null;
      locale?: string | null;
      timezone?: string | null;
      dateFormat?: string | null;
      timeFormat?: string | null;
      auditId?: string | null;
      message?: string | null;
    }
  | {
      status: "conflict";
      resourceVersion: number;
      sessionTimeoutMinutes?: number | null;
      preferenceChannel?: string | null;
      preferenceEnabled?: boolean | null;
      preferenceFrequency?: string | null;
      locale?: string | null;
      timezone?: string | null;
      dateFormat?: string | null;
      timeFormat?: string | null;
      auditId?: string | null;
      errorCode?: string | null;
      conflictReason?: QueueConflictReason | null;
      message: string;
    }
  | {
      status: "failed";
      retryable?: boolean;
      retryAfterMs?: number | null;
      auditId?: string | null;
      errorCode?: string | null;
      message: string;
    };

export type OfflineQueueMutationAdapter = {
  execute: (action: QueuedAction) => Promise<OfflineQueueMutationResult>;
};

export type ReplayQueueResult = {
  drainedCount: number;
  failedCount: number;
  conflictCount: number;
  skippedCount: number;
  replayedAt: string;
  outcome: string;
};

export type NetworkSnapshot = {
  isOnline: boolean;
  lastCheckedAt: string;
  source: "bootstrap";
};

export type SessionState = {
  appReady: boolean;
  lastBootAt: string;
};

type EnqueueQueuedActionOptions = {
  auditAction?: string;
  conflictPolicy?: QueueConflictPolicy;
  demoBehavior?: QueueDemoBehavior;
  expectedVersion?: number;
  kind?: OfflineMutationKind;
  preferenceChannel?: string;
  targetPreferenceEnabled?: boolean;
  targetPreferenceFrequency?: string | null;
  targetLocale?: string | null;
  targetTimezone?: string | null;
  targetDateFormat?: string | null;
  targetTimeFormat?: string | null;
  resourceKey?: string;
  targetSessionTimeoutMinutes?: number;
};

type QueueMutationRequest = {
  expectedVersion?: number;
  preferenceChannel?: string;
  targetPreferenceEnabled?: boolean;
  targetPreferenceFrequency?: string | null;
  targetLocale?: string | null;
  targetTimezone?: string | null;
  targetDateFormat?: string | null;
  targetTimeFormat?: string | null;
  resourceKey?: string;
  targetSessionTimeoutMinutes?: number;
};

const DEFAULT_RESOURCE_KEY = "profile:admin@example.com";
const DEFAULT_NOTIFICATION_RESOURCE_KEY = "notification-preference:admin@example.com:email";
const DEFAULT_RESOURCE_VERSION = 0;
const DEFAULT_SESSION_TIMEOUT_MINUTES = 15;
const RETRY_DELAY_MS = 30_000;
const DEFAULT_NOTIFICATION_CHANNEL = "email";
const DEFAULT_NOTIFICATION_FREQUENCY = "immediate";
const DEFAULT_PROFILE_LOCALE = "tr";
const DEFAULT_PROFILE_TIMEZONE = "Europe/Istanbul";
const DEFAULT_PROFILE_DATE_FORMAT = "dd.MM.yyyy";
const DEFAULT_PROFILE_TIME_FORMAT = "HH:mm";

const offlineMutationPolicies = new Map<string, OfflineMutationPolicyDescriptor>(
  listSharedOfflineMutationPolicies().map((policy) => [policy.kind, policy]),
);

const queuedActions: QueuedAction[] = [];
const resourceVersionIndex = new Map<string, number>();
const resourceTimeoutIndex = new Map<string, number>();
const resourcePreferenceEnabledIndex = new Map<string, boolean>();
const resourcePreferenceFrequencyIndex = new Map<string, string | null>();
const resourceLocaleIndex = new Map<string, string>();
const resourceTimezoneIndex = new Map<string, string>();
const resourceDateFormatIndex = new Map<string, string>();
const resourceTimeFormatIndex = new Map<string, string>();

let offlineQueueStorageAdapter: OfflineQueueStorageAdapter | null = null;
let offlineQueueMutationAdapter: OfflineQueueMutationAdapter | null = null;
let offlineQueueHydrationPromise: Promise<QueuedAction[]> | null = null;
let lastQueueReplayAt: string | null = null;
let lastQueueReplayOutcome: string | null = null;
let lastQueueMutationAuditId: string | null = null;

export const initialSessionState: SessionState = {
  appReady: true,
  lastBootAt: new Date().toISOString(),
};

export function listOfflineMutationPolicies() {
  return Array.from(offlineMutationPolicies.values());
}

export function registerOfflineMutationPolicies(policies: OfflineMutationPolicyDescriptor[]) {
  policies.forEach((policy) => {
    offlineMutationPolicies.set(policy.kind, policy);
  });
}

function resolveOfflineMutationPolicy(kind: OfflineMutationKind): OfflineMutationPolicyDescriptor {
  return (
    offlineMutationPolicies.get(kind) ??
    getSharedOfflineMutationPolicy(kind) ??
    buildDefaultOfflineMutationPolicy(kind)
  );
}

export function formatIsoShort(value: string) {
  if (!value) {
    return "n/a";
  }

  return value.replace("T", " ").replace("Z", " UTC").slice(0, 19);
}

export function getDeviceProfile() {
  return {
    platform: Platform.OS,
    version: String(Platform.Version),
  };
}

export function getNotificationsStatus() {
  return {
    enabled: false,
    reason: "not_configured",
  };
}

export function getBootstrapNetworkSnapshot(): NetworkSnapshot {
  return {
    isOnline: true,
    lastCheckedAt: new Date().toISOString(),
    source: "bootstrap",
  };
}

function normalizeQueuedActionStatus(value: unknown): QueueActionStatus {
  return value === "flushing" || value === "failed" || value === "conflict" ? value : "queued";
}

function normalizeConflictPolicy(value: unknown): QueueConflictPolicy {
  return value === "client-wins" || value === "server-wins" ? value : "manual";
}

function normalizeDemoBehavior(value: unknown): QueueDemoBehavior {
  return value === "transient-failure" || value === "version-conflict" ? value : "success";
}

function normalizePreferenceChannel(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim().toLowerCase().replace("-", "_");
}

function normalizeLocale(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim().toLowerCase().replace("-", "_");
}

function normalizeTimezone(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function normalizeDateFormat(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function normalizeTimeFormat(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function sanitizeQueuedAction(value: unknown): QueuedAction | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<QueuedAction>;
  if (typeof candidate.id !== "string" || typeof candidate.label !== "string") {
    return null;
  }

  if (typeof candidate.queuedAt !== "string" || !candidate.queuedAt.trim()) {
    return null;
  }

  const kind =
    typeof candidate.kind === "string" && candidate.kind.trim()
      ? (candidate.kind as OfflineMutationKind)
      : "profile.sync";
  const policy = resolveOfflineMutationPolicy(kind);
  const expectedVersion = Number(candidate.expectedVersion ?? DEFAULT_RESOURCE_VERSION);
  const attemptCount = Number(candidate.attemptCount ?? 0);
  const serverVersionRaw = candidate.serverVersion;
  const targetSessionTimeoutMinutes = Number(
    candidate.targetSessionTimeoutMinutes ?? DEFAULT_SESSION_TIMEOUT_MINUTES,
  );
  const serverSessionTimeoutMinutes = Number(candidate.serverSessionTimeoutMinutes ?? NaN);
  const preferenceChannel = normalizePreferenceChannel(candidate.preferenceChannel);
  const targetPreferenceEnabled =
    typeof candidate.targetPreferenceEnabled === "boolean" ? candidate.targetPreferenceEnabled : null;
  const serverPreferenceEnabled =
    typeof candidate.serverPreferenceEnabled === "boolean" ? candidate.serverPreferenceEnabled : null;
  const targetPreferenceFrequency =
    typeof candidate.targetPreferenceFrequency === "string" && candidate.targetPreferenceFrequency.trim()
      ? candidate.targetPreferenceFrequency
      : null;
  const serverPreferenceFrequency =
    typeof candidate.serverPreferenceFrequency === "string" && candidate.serverPreferenceFrequency.trim()
      ? candidate.serverPreferenceFrequency
      : null;
  const targetLocale = normalizeLocale(candidate.targetLocale);
  const serverLocale = normalizeLocale(candidate.serverLocale);
  const targetTimezone = normalizeTimezone(candidate.targetTimezone);
  const serverTimezone = normalizeTimezone(candidate.serverTimezone);
  const targetDateFormat = normalizeDateFormat(candidate.targetDateFormat);
  const serverDateFormat = normalizeDateFormat(candidate.serverDateFormat);
  const targetTimeFormat = normalizeTimeFormat(candidate.targetTimeFormat);
  const serverTimeFormat = normalizeTimeFormat(candidate.serverTimeFormat);

  return {
    id: candidate.id,
    label: candidate.label,
    queuedAt: candidate.queuedAt,
    status: normalizeQueuedActionStatus(candidate.status),
    kind,
    resourceKey:
      typeof candidate.resourceKey === "string" && candidate.resourceKey.trim()
        ? candidate.resourceKey
        : DEFAULT_RESOURCE_KEY,
    auditAction:
      typeof candidate.auditAction === "string" && candidate.auditAction.trim()
        ? candidate.auditAction
        : policy.auditAction,
    conflictPolicy: normalizeConflictPolicy(candidate.conflictPolicy),
    retryPolicyKey:
      typeof candidate.retryPolicyKey === "string" && candidate.retryPolicyKey.trim()
        ? candidate.retryPolicyKey
        : policy.retryPolicyKey,
    demoBehavior: normalizeDemoBehavior(candidate.demoBehavior),
    expectedVersion: Number.isFinite(expectedVersion) ? expectedVersion : DEFAULT_RESOURCE_VERSION,
    serverVersion:
      typeof serverVersionRaw === "number" && Number.isFinite(serverVersionRaw)
        ? serverVersionRaw
        : null,
    targetSessionTimeoutMinutes: Number.isFinite(targetSessionTimeoutMinutes)
      ? targetSessionTimeoutMinutes
      : DEFAULT_SESSION_TIMEOUT_MINUTES,
    serverSessionTimeoutMinutes: Number.isFinite(serverSessionTimeoutMinutes)
      ? serverSessionTimeoutMinutes
      : null,
    preferenceChannel,
    targetPreferenceEnabled,
    serverPreferenceEnabled,
    targetPreferenceFrequency,
    serverPreferenceFrequency,
    targetLocale,
    serverLocale,
    targetTimezone,
    serverTimezone,
    targetDateFormat,
    serverDateFormat,
    targetTimeFormat,
    serverTimeFormat,
    attemptCount: Number.isFinite(attemptCount) ? attemptCount : 0,
    lastAttemptAt:
      typeof candidate.lastAttemptAt === "string" && candidate.lastAttemptAt.trim()
        ? candidate.lastAttemptAt
        : null,
    lastError:
      typeof candidate.lastError === "string" && candidate.lastError.trim() ? candidate.lastError : null,
    nextRetryAt:
      typeof candidate.nextRetryAt === "string" && candidate.nextRetryAt.trim()
        ? candidate.nextRetryAt
        : null,
    auditId:
      typeof candidate.auditId === "string" && candidate.auditId.trim() ? candidate.auditId : null,
    errorCode:
      typeof candidate.errorCode === "string" && candidate.errorCode.trim()
        ? candidate.errorCode
        : null,
    conflictReason:
      typeof candidate.conflictReason === "string" && candidate.conflictReason.trim()
        ? (candidate.conflictReason as QueueConflictReason)
        : null,
  };
}

function replaceQueuedActions(items: QueuedAction[]) {
  queuedActions.splice(0, queuedActions.length, ...items);
}

function resolveResourceVersion(resourceKey: string) {
  return resourceVersionIndex.get(resourceKey) ?? DEFAULT_RESOURCE_VERSION;
}

function setResourceVersion(resourceKey: string, version: number) {
  resourceVersionIndex.set(resourceKey, Math.max(version, DEFAULT_RESOURCE_VERSION));
}

function resolveResourceTimeout(resourceKey: string) {
  return resourceTimeoutIndex.get(resourceKey) ?? DEFAULT_SESSION_TIMEOUT_MINUTES;
}

function setResourceTimeout(resourceKey: string, sessionTimeoutMinutes: number) {
  resourceTimeoutIndex.set(resourceKey, Math.max(1, sessionTimeoutMinutes));
}

function resolveResourcePreferenceEnabled(resourceKey: string) {
  return resourcePreferenceEnabledIndex.get(resourceKey) ?? true;
}

function setResourcePreferenceEnabled(resourceKey: string, enabled: boolean) {
  resourcePreferenceEnabledIndex.set(resourceKey, enabled);
}

function resolveResourcePreferenceFrequency(resourceKey: string) {
  return resourcePreferenceFrequencyIndex.get(resourceKey) ?? DEFAULT_NOTIFICATION_FREQUENCY;
}

function setResourcePreferenceFrequency(resourceKey: string, frequency: string | null) {
  resourcePreferenceFrequencyIndex.set(resourceKey, frequency ?? DEFAULT_NOTIFICATION_FREQUENCY);
}

function resolveResourceLocale(resourceKey: string) {
  return resourceLocaleIndex.get(resourceKey) ?? DEFAULT_PROFILE_LOCALE;
}

function setResourceLocale(resourceKey: string, locale: string | null) {
  resourceLocaleIndex.set(resourceKey, normalizeLocale(locale) ?? DEFAULT_PROFILE_LOCALE);
}

function resolveResourceTimezone(resourceKey: string) {
  return resourceTimezoneIndex.get(resourceKey) ?? DEFAULT_PROFILE_TIMEZONE;
}

function setResourceTimezone(resourceKey: string, timezone: string | null) {
  resourceTimezoneIndex.set(resourceKey, normalizeTimezone(timezone) ?? DEFAULT_PROFILE_TIMEZONE);
}

function resolveResourceDateFormat(resourceKey: string) {
  return resourceDateFormatIndex.get(resourceKey) ?? DEFAULT_PROFILE_DATE_FORMAT;
}

function setResourceDateFormat(resourceKey: string, dateFormat: string | null) {
  resourceDateFormatIndex.set(
    resourceKey,
    normalizeDateFormat(dateFormat) ?? DEFAULT_PROFILE_DATE_FORMAT,
  );
}

function resolveResourceTimeFormat(resourceKey: string) {
  return resourceTimeFormatIndex.get(resourceKey) ?? DEFAULT_PROFILE_TIME_FORMAT;
}

function setResourceTimeFormat(resourceKey: string, timeFormat: string | null) {
  resourceTimeFormatIndex.set(
    resourceKey,
    normalizeTimeFormat(timeFormat) ?? DEFAULT_PROFILE_TIME_FORMAT,
  );
}

function buildRetryAt(now: number, retryAfterMs?: number | null, fallbackDelayMs = RETRY_DELAY_MS) {
  const safeDelay = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) && retryAfterMs > 0
    ? retryAfterMs
    : fallbackDelayMs;
  return new Date(now + safeDelay).toISOString();
}

export function isRetryReady(action: Pick<QueuedAction, "status" | "nextRetryAt">, now = Date.now()) {
  if (action.status !== "failed") {
    return false;
  }

  if (!action.nextRetryAt) {
    return true;
  }

  const retryAt = Date.parse(action.nextRetryAt);
  if (!Number.isFinite(retryAt)) {
    return true;
  }

  return retryAt <= now;
}

function buildSummary(items: QueuedAction[]): OfflineQueueSummary {
  const now = Date.now();
  return {
    queuedCount: items.length,
    failedCount: items.filter((item) => item.status === "failed").length,
    conflictCount: items.filter((item) => item.status === "conflict").length,
    retryReadyCount: items.filter((item) => isRetryReady(item, now)).length,
    latestQueuedAction: items[0],
    lastReplayAt: lastQueueReplayAt,
    lastReplayOutcome: lastQueueReplayOutcome,
    lastMutationAuditId: lastQueueMutationAuditId,
  };
}

async function persistQueuedActionsSnapshot() {
  if (!offlineQueueStorageAdapter) {
    return;
  }

  try {
    await offlineQueueStorageAdapter.write(listQueuedActions());
  } catch {
    // Queue persistence is best-effort; runtime queue stays authoritative in memory.
  }
}

export function configureOfflineQueueStorage(adapter: OfflineQueueStorageAdapter | null) {
  offlineQueueStorageAdapter = adapter;
  offlineQueueHydrationPromise = null;
}

export function configureOfflineQueueMutationAdapter(adapter: OfflineQueueMutationAdapter | null) {
  offlineQueueMutationAdapter = adapter;
}

export async function hydrateOfflineQueue() {
  if (!offlineQueueStorageAdapter) {
    return listQueuedActions();
  }

  if (!offlineQueueHydrationPromise) {
    offlineQueueHydrationPromise = offlineQueueStorageAdapter.read().then((items) =>
      items.map((item) => sanitizeQueuedAction(item)).filter((item): item is QueuedAction => Boolean(item)),
    );
  }

  const hydratedItems = await offlineQueueHydrationPromise;
  replaceQueuedActions(hydratedItems);

  hydratedItems.forEach((item) => {
    if (item.serverVersion !== null) {
      setResourceVersion(item.resourceKey, item.serverVersion);
    } else {
      setResourceVersion(item.resourceKey, Math.max(resolveResourceVersion(item.resourceKey), item.expectedVersion));
    }

    if (item.serverSessionTimeoutMinutes !== null) {
      setResourceTimeout(item.resourceKey, item.serverSessionTimeoutMinutes);
    } else {
      setResourceTimeout(item.resourceKey, item.targetSessionTimeoutMinutes);
    }

    if (item.serverPreferenceEnabled !== null) {
      setResourcePreferenceEnabled(item.resourceKey, item.serverPreferenceEnabled);
    } else if (item.targetPreferenceEnabled !== null) {
      setResourcePreferenceEnabled(item.resourceKey, item.targetPreferenceEnabled);
    }

    if (item.serverPreferenceFrequency !== null) {
      setResourcePreferenceFrequency(item.resourceKey, item.serverPreferenceFrequency);
    } else if (item.targetPreferenceFrequency !== null) {
      setResourcePreferenceFrequency(item.resourceKey, item.targetPreferenceFrequency);
    }

    if (item.serverLocale !== null) {
      setResourceLocale(item.resourceKey, item.serverLocale);
    } else if (item.targetLocale !== null) {
      setResourceLocale(item.resourceKey, item.targetLocale);
    }

    if (item.serverTimezone !== null) {
      setResourceTimezone(item.resourceKey, item.serverTimezone);
    } else if (item.targetTimezone !== null) {
      setResourceTimezone(item.resourceKey, item.targetTimezone);
    }

    if (item.serverDateFormat !== null) {
      setResourceDateFormat(item.resourceKey, item.serverDateFormat);
    } else if (item.targetDateFormat !== null) {
      setResourceDateFormat(item.resourceKey, item.targetDateFormat);
    }

    if (item.serverTimeFormat !== null) {
      setResourceTimeFormat(item.resourceKey, item.serverTimeFormat);
    } else if (item.targetTimeFormat !== null) {
      setResourceTimeFormat(item.resourceKey, item.targetTimeFormat);
    }
  });

  return listQueuedActions();
}

export function useNetworkStatus() {
  const [snapshot] = useState<NetworkSnapshot>(() => getBootstrapNetworkSnapshot());
  return snapshot;
}

export function listQueuedActions() {
  return [...queuedActions];
}

function buildQueueActionId() {
  return `qa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function enqueueQueuedAction(label: string, options?: EnqueueQueuedActionOptions): QueuedAction {
  const kind = options?.kind ?? "profile.sync";
  const policy = resolveOfflineMutationPolicy(kind);
  const preferenceChannel = normalizePreferenceChannel(options?.preferenceChannel) ?? DEFAULT_NOTIFICATION_CHANNEL;
  const resourceKey =
    options?.resourceKey ??
    (kind === "notification.preference.sync"
      ? `${DEFAULT_NOTIFICATION_RESOURCE_KEY.replace(/:[^:]+$/, "")}:${preferenceChannel}`
      : DEFAULT_RESOURCE_KEY);
  const currentVersion = resolveResourceVersion(resourceKey);
  const currentSessionTimeoutMinutes = resolveResourceTimeout(resourceKey);
  const currentPreferenceEnabled = resolveResourcePreferenceEnabled(resourceKey);
  const currentPreferenceFrequency = resolveResourcePreferenceFrequency(resourceKey);
  const currentLocale = resolveResourceLocale(resourceKey);
  const currentTimezone = resolveResourceTimezone(resourceKey);
  const currentDateFormat = resolveResourceDateFormat(resourceKey);
  const currentTimeFormat = resolveResourceTimeFormat(resourceKey);
  const demoBehavior = options?.demoBehavior ?? "success";
  const expectedVersion =
    options?.expectedVersion ??
    (demoBehavior === "version-conflict" ? Math.max(currentVersion - 1, DEFAULT_RESOURCE_VERSION) : currentVersion);
  const targetSessionTimeoutMinutes =
    options?.targetSessionTimeoutMinutes ?? currentSessionTimeoutMinutes + 1;
  const targetPreferenceEnabled =
    typeof options?.targetPreferenceEnabled === "boolean"
      ? options.targetPreferenceEnabled
      : !currentPreferenceEnabled;
  const targetPreferenceFrequency =
    typeof options?.targetPreferenceFrequency === "string" && options.targetPreferenceFrequency.trim()
      ? options.targetPreferenceFrequency
      : currentPreferenceFrequency;
  const targetLocale = normalizeLocale(options?.targetLocale) ?? currentLocale;
  const targetTimezone = normalizeTimezone(options?.targetTimezone) ?? currentTimezone;
  const targetDateFormat = normalizeDateFormat(options?.targetDateFormat) ?? currentDateFormat;
  const targetTimeFormat = normalizeTimeFormat(options?.targetTimeFormat) ?? currentTimeFormat;

  const queuedAction: QueuedAction = {
    id: buildQueueActionId(),
    label,
    queuedAt: new Date().toISOString(),
    status: "queued",
    kind,
    resourceKey,
    auditAction: options?.auditAction ?? policy.auditAction,
    conflictPolicy:
      options?.conflictPolicy ?? (demoBehavior === "version-conflict" ? "manual" : policy.conflictPolicy),
    retryPolicyKey: policy.retryPolicyKey,
    demoBehavior,
    expectedVersion,
    serverVersion: null,
    targetSessionTimeoutMinutes,
    serverSessionTimeoutMinutes: null,
    preferenceChannel: kind === "notification.preference.sync" ? preferenceChannel : null,
    targetPreferenceEnabled: kind === "notification.preference.sync" ? targetPreferenceEnabled : null,
    serverPreferenceEnabled: null,
    targetPreferenceFrequency: kind === "notification.preference.sync" ? targetPreferenceFrequency : null,
    serverPreferenceFrequency: null,
    targetLocale: kind === "profile.locale.sync" ? targetLocale : null,
    serverLocale: null,
    targetTimezone: kind === "profile.timezone.sync" ? targetTimezone : null,
    serverTimezone: null,
    targetDateFormat: kind === "profile.date-format.sync" ? targetDateFormat : null,
    serverDateFormat: null,
    targetTimeFormat: kind === "profile.time-format.sync" ? targetTimeFormat : null,
    serverTimeFormat: null,
    attemptCount: 0,
    lastAttemptAt: null,
    lastError: null,
    nextRetryAt: null,
    auditId: null,
    errorCode: null,
    conflictReason: null,
  };

  queuedActions.unshift(queuedAction);
  void persistQueuedActionsSnapshot();
  return queuedAction;
}

export function clearQueuedActions() {
  queuedActions.length = 0;
  lastQueueReplayOutcome = "Queue cleared.";
  lastQueueMutationAuditId = null;
  void persistQueuedActionsSnapshot();
}

function markReplayOutcome(result: ReplayQueueResult) {
  lastQueueReplayAt = result.replayedAt;
  lastQueueReplayOutcome = result.outcome;
}

function buildReplayOutcome(result: Omit<ReplayQueueResult, "outcome">): string {
  const parts = [`${result.drainedCount} drained`];

  if (result.failedCount > 0) {
    parts.push(`${result.failedCount} failed`);
  }

  if (result.conflictCount > 0) {
    parts.push(`${result.conflictCount} conflict`);
  }

  if (result.skippedCount > 0) {
    parts.push(`${result.skippedCount} skipped`);
  }

  return parts.join(" / ");
}

function buildFailedQueuedAction(
  action: QueuedAction,
  replayedAt: string,
  now: number,
  nextAttemptCount: number,
  message: string,
  retryAfterMs?: number | null,
  auditId?: string | null,
  errorCode?: string | null,
): QueuedAction {
  return {
    ...action,
    status: "failed",
    attemptCount: nextAttemptCount,
    lastAttemptAt: replayedAt,
    lastError: message,
    nextRetryAt: buildRetryAt(now, retryAfterMs, resolveOfflineMutationPolicy(action.kind).retryDelayMs),
    auditId: auditId ?? action.auditId ?? null,
    errorCode: errorCode ?? action.errorCode ?? null,
    conflictReason: null,
  };
}

function buildConflictQueuedAction(
  action: QueuedAction,
  replayedAt: string,
  nextAttemptCount: number,
  resourceVersion: number,
  sessionTimeoutMinutes: number | null,
  message: string,
  auditId?: string | null,
  errorCode?: string | null,
  conflictReason?: QueueConflictReason | null,
  preferenceEnabled?: boolean | null,
  preferenceFrequency?: string | null,
  locale?: string | null,
  timezone?: string | null,
  dateFormat?: string | null,
  timeFormat?: string | null,
): QueuedAction {
  return {
    ...action,
    status: "conflict",
    attemptCount: nextAttemptCount,
    serverVersion: resourceVersion,
    serverSessionTimeoutMinutes: sessionTimeoutMinutes,
    serverPreferenceEnabled:
      typeof preferenceEnabled === "boolean" ? preferenceEnabled : action.serverPreferenceEnabled,
    serverPreferenceFrequency:
      typeof preferenceFrequency === "string" && preferenceFrequency.trim()
        ? preferenceFrequency
        : action.serverPreferenceFrequency,
    serverLocale: normalizeLocale(locale) ?? action.serverLocale,
    serverTimezone: normalizeTimezone(timezone) ?? action.serverTimezone,
    serverDateFormat: normalizeDateFormat(dateFormat) ?? action.serverDateFormat,
    serverTimeFormat: normalizeTimeFormat(timeFormat) ?? action.serverTimeFormat,
    lastAttemptAt: replayedAt,
    lastError: message,
    nextRetryAt: null,
    auditId: auditId ?? action.auditId ?? null,
    errorCode: errorCode ?? action.errorCode ?? null,
    conflictReason: conflictReason ?? action.conflictReason ?? "STALE_EXPECTED_VERSION",
  };
}

async function replayWithAdapter(
  action: QueuedAction,
  replayedAt: string,
  now: number,
  nextAttemptCount: number,
) {
  if (!offlineQueueMutationAdapter) {
    return null;
  }

  const result = await offlineQueueMutationAdapter.execute(action);
  if (result.auditId) {
    lastQueueMutationAuditId = result.auditId;
  }

  if (result.status === "failed") {
    return {
      status: "failed" as const,
      nextAction: buildFailedQueuedAction(
        action,
        replayedAt,
        now,
        nextAttemptCount,
        result.message,
        result.retryAfterMs,
        result.auditId,
        result.errorCode,
      ),
    };
  }

  if (result.status === "conflict") {
    setResourceVersion(action.resourceKey, result.resourceVersion);
    if (typeof result.sessionTimeoutMinutes === "number") {
      setResourceTimeout(action.resourceKey, result.sessionTimeoutMinutes);
    }
    if (typeof result.preferenceEnabled === "boolean") {
      setResourcePreferenceEnabled(action.resourceKey, result.preferenceEnabled);
    }
    if (typeof result.preferenceFrequency === "string" && result.preferenceFrequency.trim()) {
      setResourcePreferenceFrequency(action.resourceKey, result.preferenceFrequency);
    }
    if (typeof result.locale === "string" && result.locale.trim()) {
      setResourceLocale(action.resourceKey, result.locale);
    }
    if (typeof result.timezone === "string" && result.timezone.trim()) {
      setResourceTimezone(action.resourceKey, result.timezone);
    }
    if (typeof result.dateFormat === "string" && result.dateFormat.trim()) {
      setResourceDateFormat(action.resourceKey, result.dateFormat);
    }
    if (typeof result.timeFormat === "string" && result.timeFormat.trim()) {
      setResourceTimeFormat(action.resourceKey, result.timeFormat);
    }
    return {
      status: "conflict" as const,
      nextAction: buildConflictQueuedAction(
        action,
        replayedAt,
        nextAttemptCount,
        result.resourceVersion,
        result.sessionTimeoutMinutes ?? null,
        result.message,
        result.auditId,
        result.errorCode,
        result.conflictReason,
        result.preferenceEnabled,
        result.preferenceFrequency,
        result.locale,
        result.timezone,
        result.dateFormat,
        result.timeFormat,
      ),
    };
  }

  setResourceVersion(action.resourceKey, result.resourceVersion);
  if (typeof result.sessionTimeoutMinutes === "number") {
    setResourceTimeout(action.resourceKey, result.sessionTimeoutMinutes);
  }
  if (typeof result.preferenceEnabled === "boolean") {
    setResourcePreferenceEnabled(action.resourceKey, result.preferenceEnabled);
  }
  if (typeof result.preferenceFrequency === "string" && result.preferenceFrequency.trim()) {
    setResourcePreferenceFrequency(action.resourceKey, result.preferenceFrequency);
  }
  if (typeof result.locale === "string" && result.locale.trim()) {
    setResourceLocale(action.resourceKey, result.locale);
  }
  if (typeof result.timezone === "string" && result.timezone.trim()) {
    setResourceTimezone(action.resourceKey, result.timezone);
  }
  if (typeof result.dateFormat === "string" && result.dateFormat.trim()) {
    setResourceDateFormat(action.resourceKey, result.dateFormat);
  }
  if (typeof result.timeFormat === "string" && result.timeFormat.trim()) {
    setResourceTimeFormat(action.resourceKey, result.timeFormat);
  }
  lastQueueMutationAuditId = result.auditId ?? null;

  return {
    status: "drained" as const,
  };
}

export async function replayQueuedActions(options?: { forceRetry?: boolean }) {
  const now = Date.now();
  const replayedAt = new Date(now).toISOString();
  const orderedItems = [...listQueuedActions()].sort((left, right) => left.queuedAt.localeCompare(right.queuedAt));
  const remaining: QueuedAction[] = [];

  let drainedCount = 0;
  let failedCount = 0;
  let conflictCount = 0;
  let skippedCount = 0;

  for (const action of orderedItems) {
    const serverVersion = action.serverVersion ?? resolveResourceVersion(action.resourceKey);
    const serverSessionTimeoutMinutes =
      action.serverSessionTimeoutMinutes ?? resolveResourceTimeout(action.resourceKey);
    const serverLocale = action.serverLocale ?? resolveResourceLocale(action.resourceKey);
    const serverTimezone = action.serverTimezone ?? resolveResourceTimezone(action.resourceKey);
    const serverDateFormat = action.serverDateFormat ?? resolveResourceDateFormat(action.resourceKey);
    const serverTimeFormat = action.serverTimeFormat ?? resolveResourceTimeFormat(action.resourceKey);

    if (action.status === "conflict") {
      conflictCount += 1;
      remaining.unshift(action);
      continue;
    }

    if (action.status === "failed" && !options?.forceRetry && !isRetryReady(action, now)) {
      skippedCount += 1;
      remaining.unshift(action);
      continue;
    }

    const nextAttemptCount = action.attemptCount + 1;

    if (action.demoBehavior === "transient-failure" && action.attemptCount === 0) {
      failedCount += 1;
      remaining.unshift(
        buildFailedQueuedAction(
          action,
          replayedAt,
          now,
          nextAttemptCount,
          "Gateway timeout. Retry after the cooldown window or force retry.",
          undefined,
          undefined,
          "TRANSIENT_GATEWAY_TIMEOUT",
        ),
      );
      continue;
    }

    const adapterReplayResult = await replayWithAdapter(action, replayedAt, now, nextAttemptCount);
    if (adapterReplayResult) {
      if (adapterReplayResult.status === "drained") {
        drainedCount += 1;
      } else if (adapterReplayResult.status === "failed") {
        failedCount += 1;
        remaining.unshift(adapterReplayResult.nextAction);
      } else {
        conflictCount += 1;
        remaining.unshift(adapterReplayResult.nextAction);
      }
      continue;
    }

    if (action.expectedVersion < serverVersion) {
      if (action.conflictPolicy === "client-wins") {
        setResourceVersion(action.resourceKey, serverVersion + 1);
        if (action.kind === "notification.preference.sync") {
          if (typeof action.targetPreferenceEnabled === "boolean") {
            setResourcePreferenceEnabled(action.resourceKey, action.targetPreferenceEnabled);
          }
          if (typeof action.targetPreferenceFrequency === "string" && action.targetPreferenceFrequency.trim()) {
            setResourcePreferenceFrequency(action.resourceKey, action.targetPreferenceFrequency);
          }
        } else if (action.kind === "profile.locale.sync") {
          setResourceLocale(action.resourceKey, action.targetLocale);
        } else if (action.kind === "profile.timezone.sync") {
          setResourceTimezone(action.resourceKey, action.targetTimezone);
        } else if (action.kind === "profile.date-format.sync") {
          setResourceDateFormat(action.resourceKey, action.targetDateFormat);
        } else if (action.kind === "profile.time-format.sync") {
          setResourceTimeFormat(action.resourceKey, action.targetTimeFormat);
        } else {
          setResourceTimeout(action.resourceKey, action.targetSessionTimeoutMinutes);
        }
        drainedCount += 1;
        continue;
      }

      if (action.conflictPolicy === "server-wins") {
        setResourceVersion(action.resourceKey, serverVersion);
        if (action.kind === "notification.preference.sync") {
          setResourcePreferenceEnabled(
            action.resourceKey,
            action.serverPreferenceEnabled ?? resolveResourcePreferenceEnabled(action.resourceKey),
          );
          setResourcePreferenceFrequency(
            action.resourceKey,
            action.serverPreferenceFrequency ?? resolveResourcePreferenceFrequency(action.resourceKey),
          );
        } else if (action.kind === "profile.locale.sync") {
          setResourceLocale(action.resourceKey, serverLocale);
        } else if (action.kind === "profile.timezone.sync") {
          setResourceTimezone(action.resourceKey, serverTimezone);
        } else if (action.kind === "profile.date-format.sync") {
          setResourceDateFormat(action.resourceKey, serverDateFormat);
        } else if (action.kind === "profile.time-format.sync") {
          setResourceTimeFormat(action.resourceKey, serverTimeFormat);
        } else {
          setResourceTimeout(action.resourceKey, serverSessionTimeoutMinutes);
        }
        drainedCount += 1;
        continue;
      }

      conflictCount += 1;
      remaining.unshift(
        buildConflictQueuedAction(
          action,
          replayedAt,
          nextAttemptCount,
          serverVersion,
          action.kind === "notification.preference.sync" ? null : serverSessionTimeoutMinutes,
          `Remote resource advanced to version ${serverVersion}. Resolve conflict before replaying.`,
          undefined,
          action.kind === "notification.preference.sync"
            ? "USER_NOTIFICATION_PREFERENCE_SYNC_CONFLICT"
            : action.kind === "profile.locale.sync"
              ? "USER_LOCALE_SYNC_CONFLICT"
              : action.kind === "profile.timezone.sync"
                ? "USER_TIMEZONE_SYNC_CONFLICT"
              : action.kind === "profile.date-format.sync"
                ? "USER_DATE_FORMAT_SYNC_CONFLICT"
              : action.kind === "profile.time-format.sync"
                ? "USER_TIME_FORMAT_SYNC_CONFLICT"
              : "USER_PROFILE_VERSION_CONFLICT",
          "STALE_EXPECTED_VERSION",
          action.serverPreferenceEnabled ?? resolveResourcePreferenceEnabled(action.resourceKey),
          action.serverPreferenceFrequency ?? resolveResourcePreferenceFrequency(action.resourceKey),
          action.kind === "profile.locale.sync" ? serverLocale : null,
          action.kind === "profile.timezone.sync" ? serverTimezone : null,
          action.kind === "profile.date-format.sync" ? serverDateFormat : null,
          action.kind === "profile.time-format.sync" ? serverTimeFormat : null,
        ),
      );
      continue;
    }

    setResourceVersion(action.resourceKey, Math.max(serverVersion, action.expectedVersion) + 1);
    if (action.kind === "notification.preference.sync") {
      if (typeof action.targetPreferenceEnabled === "boolean") {
        setResourcePreferenceEnabled(action.resourceKey, action.targetPreferenceEnabled);
      }
      if (typeof action.targetPreferenceFrequency === "string" && action.targetPreferenceFrequency.trim()) {
        setResourcePreferenceFrequency(action.resourceKey, action.targetPreferenceFrequency);
      }
    } else if (action.kind === "profile.locale.sync") {
      setResourceLocale(action.resourceKey, action.targetLocale);
    } else if (action.kind === "profile.timezone.sync") {
      setResourceTimezone(action.resourceKey, action.targetTimezone);
    } else if (action.kind === "profile.date-format.sync") {
      setResourceDateFormat(action.resourceKey, action.targetDateFormat);
    } else if (action.kind === "profile.time-format.sync") {
      setResourceTimeFormat(action.resourceKey, action.targetTimeFormat);
    } else {
      setResourceTimeout(action.resourceKey, action.targetSessionTimeoutMinutes);
    }
    drainedCount += 1;
  }

  replaceQueuedActions(remaining);
  const resultBase = {
    drainedCount,
    failedCount,
    conflictCount,
    skippedCount,
    replayedAt,
  };
  const result: ReplayQueueResult = {
    ...resultBase,
    outcome: buildReplayOutcome(resultBase),
  };

  markReplayOutcome(result);
  await persistQueuedActionsSnapshot();
  return result;
}

export async function resolveQueuedActionConflict(actionId: string, resolution: QueueReplayResolution) {
  const nextItems: QueuedAction[] = [];

  for (const action of listQueuedActions()) {
    if (action.id !== actionId) {
      nextItems.push(action);
      continue;
    }

    if (resolution === "discard") {
      continue;
    }

    const resolvedVersion = action.serverVersion ?? resolveResourceVersion(action.resourceKey);
    const resolvedSessionTimeoutMinutes =
      action.serverSessionTimeoutMinutes ?? resolveResourceTimeout(action.resourceKey);
    const resolvedLocale = action.serverLocale ?? resolveResourceLocale(action.resourceKey);
    const resolvedTimezone = action.serverTimezone ?? resolveResourceTimezone(action.resourceKey);
    const resolvedDateFormat = action.serverDateFormat ?? resolveResourceDateFormat(action.resourceKey);
    const resolvedTimeFormat = action.serverTimeFormat ?? resolveResourceTimeFormat(action.resourceKey);

    if (resolution === "server-wins") {
      setResourceVersion(action.resourceKey, resolvedVersion);
      if (action.kind === "notification.preference.sync") {
        setResourcePreferenceEnabled(
          action.resourceKey,
          action.serverPreferenceEnabled ?? resolveResourcePreferenceEnabled(action.resourceKey),
        );
        setResourcePreferenceFrequency(
          action.resourceKey,
          action.serverPreferenceFrequency ?? resolveResourcePreferenceFrequency(action.resourceKey),
        );
      } else if (action.kind === "profile.locale.sync") {
        setResourceLocale(action.resourceKey, resolvedLocale);
      } else if (action.kind === "profile.timezone.sync") {
        setResourceTimezone(action.resourceKey, resolvedTimezone);
      } else if (action.kind === "profile.date-format.sync") {
        setResourceDateFormat(action.resourceKey, resolvedDateFormat);
      } else if (action.kind === "profile.time-format.sync") {
        setResourceTimeFormat(action.resourceKey, resolvedTimeFormat);
      } else {
        setResourceTimeout(action.resourceKey, resolvedSessionTimeoutMinutes);
      }
      continue;
    }

    nextItems.push({
      ...action,
      status: "queued",
      conflictPolicy: "client-wins",
      expectedVersion: resolvedVersion,
      serverVersion: null,
      serverSessionTimeoutMinutes: null,
      serverPreferenceEnabled: null,
      serverPreferenceFrequency: null,
      serverLocale: null,
      serverTimezone: null,
      serverDateFormat: null,
      serverTimeFormat: null,
      lastError: null,
      nextRetryAt: null,
      errorCode: null,
      conflictReason: null,
    });
  }

  replaceQueuedActions(nextItems);
  lastQueueReplayOutcome =
    resolution === "client-wins"
      ? "Conflict resolved with client-wins. Replay the queue to drain it."
      : resolution === "server-wins"
        ? "Conflict resolved with server-wins. Local queued change was dropped."
        : "Conflict discarded from the queue.";

  await persistQueuedActionsSnapshot();
  return listQueuedActions();
}

export function useOfflineQueue() {
  const [items, setItems] = useState<QueuedAction[]>(() => listQueuedActions());
  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      const hydrated = await hydrateOfflineQueue();
      if (!active) {
        return;
      }
      setItems(hydrated);
    };

    void restore();

    return () => {
      active = false;
    };
  }, []);

  const refresh = () => {
    const snapshot = listQueuedActions();
    setItems(snapshot);
    return buildSummary(snapshot);
  };

  const enqueueDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Sync profile changes", {
      conflictPolicy: "client-wins",
      demoBehavior: "success",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetSessionTimeoutMinutes: request?.targetSessionTimeoutMinutes,
    });
    return refresh();
  };

  const enqueueRetryDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Retry profile sync", {
      conflictPolicy: "client-wins",
      demoBehavior: "transient-failure",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetSessionTimeoutMinutes: request?.targetSessionTimeoutMinutes,
    });
    return refresh();
  };

  const enqueueConflictDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Resolve stale profile update", {
      conflictPolicy: "manual",
      demoBehavior: "version-conflict",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetSessionTimeoutMinutes: request?.targetSessionTimeoutMinutes,
    });
    return refresh();
  };

  const enqueueNotificationDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Sync notification preference", {
      kind: "notification.preference.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "success",
      resourceKey: request?.resourceKey,
      preferenceChannel: request?.preferenceChannel,
      expectedVersion: request?.expectedVersion,
      targetPreferenceEnabled: request?.targetPreferenceEnabled,
      targetPreferenceFrequency: request?.targetPreferenceFrequency,
    });
    return refresh();
  };

  const enqueueNotificationRetryDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Retry notification preference sync", {
      kind: "notification.preference.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "transient-failure",
      resourceKey: request?.resourceKey,
      preferenceChannel: request?.preferenceChannel,
      expectedVersion: request?.expectedVersion,
      targetPreferenceEnabled: request?.targetPreferenceEnabled,
      targetPreferenceFrequency: request?.targetPreferenceFrequency,
    });
    return refresh();
  };

  const enqueueNotificationConflictDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Resolve stale notification preference", {
      kind: "notification.preference.sync",
      conflictPolicy: "manual",
      demoBehavior: "version-conflict",
      resourceKey: request?.resourceKey,
      preferenceChannel: request?.preferenceChannel,
      expectedVersion: request?.expectedVersion,
      targetPreferenceEnabled: request?.targetPreferenceEnabled,
      targetPreferenceFrequency: request?.targetPreferenceFrequency,
    });
    return refresh();
  };

  const enqueueLocaleDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Sync profile locale", {
      kind: "profile.locale.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "success",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetLocale: request?.targetLocale,
    });
    return refresh();
  };

  const enqueueLocaleRetryDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Retry profile locale sync", {
      kind: "profile.locale.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "transient-failure",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetLocale: request?.targetLocale,
    });
    return refresh();
  };

  const enqueueLocaleConflictDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Resolve stale profile locale", {
      kind: "profile.locale.sync",
      conflictPolicy: "manual",
      demoBehavior: "version-conflict",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetLocale: request?.targetLocale,
    });
    return refresh();
  };

  const enqueueTimezoneDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Sync profile timezone", {
      kind: "profile.timezone.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "success",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetTimezone: request?.targetTimezone,
    });
    return refresh();
  };

  const enqueueTimezoneRetryDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Retry profile timezone sync", {
      kind: "profile.timezone.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "transient-failure",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetTimezone: request?.targetTimezone,
    });
    return refresh();
  };

  const enqueueTimezoneConflictDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Resolve stale profile timezone", {
      kind: "profile.timezone.sync",
      conflictPolicy: "manual",
      demoBehavior: "version-conflict",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetTimezone: request?.targetTimezone,
    });
    return refresh();
  };

  const enqueueDateFormatDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Sync profile date format", {
      kind: "profile.date-format.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "success",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetDateFormat: request?.targetDateFormat,
    });
    return refresh();
  };

  const enqueueDateFormatRetryDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Retry profile date-format sync", {
      kind: "profile.date-format.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "transient-failure",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetDateFormat: request?.targetDateFormat,
    });
    return refresh();
  };

  const enqueueDateFormatConflictDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Resolve stale profile date format", {
      kind: "profile.date-format.sync",
      conflictPolicy: "manual",
      demoBehavior: "version-conflict",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetDateFormat: request?.targetDateFormat,
    });
    return refresh();
  };

  const enqueueTimeFormatDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Sync profile time format", {
      kind: "profile.time-format.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "success",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetTimeFormat: request?.targetTimeFormat,
    });
    return refresh();
  };

  const enqueueTimeFormatRetryDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Retry profile time-format sync", {
      kind: "profile.time-format.sync",
      conflictPolicy: "client-wins",
      demoBehavior: "transient-failure",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetTimeFormat: request?.targetTimeFormat,
    });
    return refresh();
  };

  const enqueueTimeFormatConflictDemoAction = (request?: QueueMutationRequest) => {
    enqueueQueuedAction("Resolve stale profile time format", {
      kind: "profile.time-format.sync",
      conflictPolicy: "manual",
      demoBehavior: "version-conflict",
      resourceKey: request?.resourceKey,
      expectedVersion: request?.expectedVersion,
      targetTimeFormat: request?.targetTimeFormat,
    });
    return refresh();
  };

  const replayQueue = async () => {
    setIsReplaying(true);
    try {
      await replayQueuedActions();
      return refresh();
    } finally {
      setIsReplaying(false);
    }
  };

  const retryFailedActions = async () => {
    setIsReplaying(true);
    try {
      await replayQueuedActions({ forceRetry: true });
      return refresh();
    } finally {
      setIsReplaying(false);
    }
  };

  const resolveConflict = async (actionId: string, resolution: QueueReplayResolution) => {
    await resolveQueuedActionConflict(actionId, resolution);
    return refresh();
  };

  const resetQueue = () => {
    clearQueuedActions();
    return refresh();
  };

  return {
    queuedActions: items,
    summary: buildSummary(items),
    mutationPolicies: listOfflineMutationPolicies(),
    isReplaying,
    enqueueDemoAction,
    enqueueRetryDemoAction,
    enqueueConflictDemoAction,
    enqueueNotificationDemoAction,
    enqueueNotificationRetryDemoAction,
    enqueueNotificationConflictDemoAction,
    enqueueLocaleDemoAction,
    enqueueLocaleRetryDemoAction,
    enqueueLocaleConflictDemoAction,
    enqueueTimezoneDemoAction,
    enqueueTimezoneRetryDemoAction,
    enqueueTimezoneConflictDemoAction,
    enqueueDateFormatDemoAction,
    enqueueDateFormatRetryDemoAction,
    enqueueDateFormatConflictDemoAction,
    enqueueTimeFormatDemoAction,
    enqueueTimeFormatRetryDemoAction,
    enqueueTimeFormatConflictDemoAction,
    replayQueue,
    retryFailedActions,
    resolveConflict,
    resetQueue,
  };
}
