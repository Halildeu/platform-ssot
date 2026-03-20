import { getAuditFeedCapability } from "@platform/capabilities";
import {
  formatIsoShort,
  getDeviceProfile,
  getNotificationsStatus,
  hasSessionPermission,
  type OfflineMutationKind,
  type QueuedAction,
  useNetworkStatus,
  useOfflineQueue,
} from "@platform-mobile/core";
import { colors, spacing, typography } from "@platform-mobile/tokens";
import {
  ActionButton,
  InlineToast,
  PreferenceCapabilityCard,
  PreferenceCapabilityEditorSection,
  PreferenceRemediationPanel,
  ScreenScaffold,
  StatusPill,
} from "@platform-mobile/ui";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useAuthSession } from "../app/providers/AuthSessionProvider";
import { fetchDateFormatPreferenceSnapshot } from "../services/date-format/dateFormatPreferenceClient";
import type { DateFormatPreferenceSnapshot } from "../services/date-format/dateFormatPreference.contract";
import { fetchLocalePreferenceSnapshot } from "../services/locale/localePreferenceClient";
import type { LocalePreferenceSnapshot } from "../services/locale/localePreference.contract";
import { fetchNotificationPreferenceSnapshot } from "../services/notification-preferences/notificationPreferenceClient";
import type { NotificationPreferenceSnapshot } from "../services/notification-preferences/notificationPreference.contract";
import { fetchProfileSessionTimeoutSnapshot } from "../services/profile/profileClient";
import type { ProfileSessionTimeoutSnapshot } from "../services/profile/profile.contract";
import { fetchTimeFormatPreferenceSnapshot } from "../services/time-format/timeFormatPreferenceClient";
import type { TimeFormatPreferenceSnapshot } from "../services/time-format/timeFormatPreference.contract";
import { fetchTimezonePreferenceSnapshot } from "../services/timezone/timezonePreferenceClient";
import type { TimezonePreferenceSnapshot } from "../services/timezone/timezonePreference.contract";
import { fetchCurrentUserProfile, updateCurrentUserDisplayName } from "../services/user-profile/userProfileClient";
import type { UserProfileSnapshot } from "../services/user-profile/userProfile.contract";

type PreferencesScreenProps = {
  canOpenAuditRoute: boolean;
  onBack: () => void;
  onOpenAuditRoute: () => void;
};

type RouteNotice = {
  id: string;
  title: string;
  message: string;
  tone: "success" | "warning";
  kind: "replay-success" | "retry-needed" | "conflict";
  actionId?: string | null;
};

type QueueLaneSummary = {
  kind: OfflineMutationKind;
  title: string;
  description: string;
  auditAction: string;
  retryPolicyKey: string;
  total: number;
  failedCount: number;
  conflictCount: number;
  latestItem: QueuedAction | null;
  latestFailed: QueuedAction | null;
  latestConflict: QueuedAction | null;
};

type SettingsCategory = "profile" | "regional" | "notifications" | "security" | "general";

type SettingsCategoryMeta = {
  id: SettingsCategory;
  label: string;
  description: string;
};

const settingsCategories: readonly SettingsCategoryMeta[] = [
  {
    id: "profile",
    label: "Profil",
    description: "Kisisel bilgiler, gorunen ad ve hesap ozeti burada toplanir.",
  },
  {
    id: "regional",
    label: "Bolgesel",
    description: "Uygulama dili, saat dilimi ve tarih/saat formatlari bu bolumdedir.",
  },
  {
    id: "notifications",
    label: "Bildirim",
    description: "E-posta ve ileride push kanallari icin kullanici tercihleri burada yonetilir.",
  },
  {
    id: "security",
    label: "Guvenlik",
    description: "Oturum davranisi, audit erisimi ve guvenlik gorunurlugu burada kalir.",
  },
  {
    id: "general",
    label: "Genel",
    description: "Cihaz, ag, offline queue ve uygulama davranisi ozeti bu bolumdedir.",
  },
] as const;

const notificationChannel = "email";
const localeCycle = ["tr", "en", "de", "es"] as const;
const timezoneCycle = [
  "Europe/Istanbul",
  "Europe/Berlin",
  "Europe/London",
  "America/New_York",
] as const;
const dateFormatCycle = ["dd.MM.yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "dd/MM/yyyy"] as const;
const timeFormatCycle = ["HH:mm", "hh:mm a", "HH.mm"] as const;
const deviceProfile = getDeviceProfile();
const notificationsStatus = getNotificationsStatus();

const sessionTimeoutSuccessCapability = getAuditFeedCapability("user.session-timeout.synced");
const sessionTimeoutConflictCapability = getAuditFeedCapability("user.session-timeout.conflict");
const notificationSuccessCapability = getAuditFeedCapability("user.notification-preference.synced");
const notificationConflictCapability = getAuditFeedCapability("user.notification-preference.conflict");
const localeSuccessCapability = getAuditFeedCapability("user.locale.synced");
const localeConflictCapability = getAuditFeedCapability("user.locale.conflict");
const timezoneSuccessCapability = getAuditFeedCapability("user.timezone.synced");
const timezoneConflictCapability = getAuditFeedCapability("user.timezone.conflict");
const dateFormatSuccessCapability = getAuditFeedCapability("user.date-format.synced");
const dateFormatConflictCapability = getAuditFeedCapability("user.date-format.conflict");
const timeFormatSuccessCapability = getAuditFeedCapability("user.time-format.synced");
const timeFormatConflictCapability = getAuditFeedCapability("user.time-format.conflict");

function parseReplayOutcomeCounts(value: string | null) {
  const outcome = value ?? "";
  const matchCount = (label: string) => {
    const match = outcome.match(new RegExp(`(\\d+) ${label}`));
    return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
  };

  return {
    drainedCount: matchCount("drained"),
    failedCount: matchCount("failed"),
    conflictCount: matchCount("conflict"),
  };
}

function renderQueueTarget(action: QueuedAction) {
  if (action.kind === "notification.preference.sync") {
    return `${action.preferenceChannel ?? "channel"} -> ${
      action.targetPreferenceEnabled ? "enabled" : "disabled"
    } (${action.targetPreferenceFrequency ?? "n/a"})`;
  }

  if (action.kind === "profile.locale.sync") {
    return `locale ${action.targetLocale ?? "n/a"}`;
  }

  if (action.kind === "profile.timezone.sync") {
    return `timezone ${action.targetTimezone ?? "n/a"}`;
  }

  if (action.kind === "profile.date-format.sync") {
    return `date format ${action.targetDateFormat ?? "n/a"}`;
  }

  if (action.kind === "profile.time-format.sync") {
    return `time format ${action.targetTimeFormat ?? "n/a"}`;
  }

  return `timeout ${action.targetSessionTimeoutMinutes} min`;
}

function buildLaneSummary(
  kind: OfflineMutationKind,
  queuedActions: QueuedAction[],
  mutationPolicies: {
    kind: OfflineMutationKind;
    title: string;
    description: string;
    auditAction: string;
    retryPolicyKey: string;
  }[],
): QueueLaneSummary {
  const policy = mutationPolicies.find((item) => item.kind === kind);
  if (!policy) {
    throw new Error(`Missing mutation policy for kind: ${kind}`);
  }

  const items = queuedActions.filter((action) => action.kind === kind);

  return {
    kind,
    title: policy.title,
    description: policy.description,
    auditAction: policy.auditAction,
    retryPolicyKey: policy.retryPolicyKey,
    total: items.length,
    failedCount: items.filter((item) => item.status === "failed").length,
    conflictCount: items.filter((item) => item.status === "conflict").length,
    latestItem: items[0] ?? null,
    latestFailed: items.find((item) => item.status === "failed") ?? null,
    latestConflict: items.find((item) => item.status === "conflict") ?? null,
  };
}

function buildStatusTone(count: number) {
  return count > 0 ? "pending" : "ready";
}

export function PreferencesScreen({
  canOpenAuditRoute,
  onBack,
  onOpenAuditRoute,
}: PreferencesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategory>("profile");
  const {
    queuedActions,
    summary,
    mutationPolicies,
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
    isReplaying,
    replayQueue,
    resetQueue,
    resolveConflict,
    retryFailedActions,
  } = useOfflineQueue();
  const {
    isBusy,
    refreshAuthorization,
    requiresReauthentication,
    session,
    signOut,
    status,
    summary: authSummary,
  } = useAuthSession();
  const networkStatus = useNetworkStatus();
  const [notices, setNotices] = useState<RouteNotice[]>([]);
  const [userProfileState, setUserProfileState] = useState<UserProfileSnapshot | null>(null);
  const [userProfileError, setUserProfileError] = useState<string | null>(null);
  const [isUserProfileBusy, setIsUserProfileBusy] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [displayNameSaveError, setDisplayNameSaveError] = useState<string | null>(null);
  const [isSavingDisplayName, setIsSavingDisplayName] = useState(false);
  const [profileSyncState, setProfileSyncState] = useState<ProfileSessionTimeoutSnapshot | null>(null);
  const [profileSyncError, setProfileSyncError] = useState<string | null>(null);
  const [isProfileSyncBusy, setIsProfileSyncBusy] = useState(false);
  const [notificationPreferenceState, setNotificationPreferenceState] =
    useState<NotificationPreferenceSnapshot | null>(null);
  const [notificationPreferenceError, setNotificationPreferenceError] = useState<string | null>(null);
  const [isNotificationPreferenceBusy, setIsNotificationPreferenceBusy] = useState(false);
  const [localePreferenceState, setLocalePreferenceState] = useState<LocalePreferenceSnapshot | null>(null);
  const [localePreferenceError, setLocalePreferenceError] = useState<string | null>(null);
  const [isLocalePreferenceBusy, setIsLocalePreferenceBusy] = useState(false);
  const [timezonePreferenceState, setTimezonePreferenceState] =
    useState<TimezonePreferenceSnapshot | null>(null);
  const [timezonePreferenceError, setTimezonePreferenceError] = useState<string | null>(null);
  const [isTimezonePreferenceBusy, setIsTimezonePreferenceBusy] = useState(false);
  const [dateFormatPreferenceState, setDateFormatPreferenceState] =
    useState<DateFormatPreferenceSnapshot | null>(null);
  const [dateFormatPreferenceError, setDateFormatPreferenceError] = useState<string | null>(null);
  const [isDateFormatPreferenceBusy, setIsDateFormatPreferenceBusy] = useState(false);
  const [timeFormatPreferenceState, setTimeFormatPreferenceState] =
    useState<TimeFormatPreferenceSnapshot | null>(null);
  const [timeFormatPreferenceError, setTimeFormatPreferenceError] = useState<string | null>(null);
  const [isTimeFormatPreferenceBusy, setIsTimeFormatPreferenceBusy] = useState(false);
  const lastReplayAtRef = useRef<string | null>(null);
  const latestFailedIdRef = useRef<string | null>(null);
  const latestConflictIdRef = useRef<string | null>(null);

  const profileResourceKey = session
    ? `profile:${session.email.trim().toLowerCase()}`
    : "profile:admin@example.com";
  const notificationResourceKey = session
    ? `notification-preference:${session.email.trim().toLowerCase()}:${notificationChannel}`
    : `notification-preference:admin@example.com:${notificationChannel}`;

  const sessionTimeoutLane = buildLaneSummary("profile.sync", queuedActions, mutationPolicies);
  const notificationLane = buildLaneSummary(
    "notification.preference.sync",
    queuedActions,
    mutationPolicies,
  );
  const localeLane = buildLaneSummary("profile.locale.sync", queuedActions, mutationPolicies);
  const timezoneLane = buildLaneSummary("profile.timezone.sync", queuedActions, mutationPolicies);
  const dateFormatLane = buildLaneSummary("profile.date-format.sync", queuedActions, mutationPolicies);
  const timeFormatLane = buildLaneSummary("profile.time-format.sync", queuedActions, mutationPolicies);
  const currentCategory =
    settingsCategories.find((category) => category.id === selectedCategory) ?? settingsCategories[0];
  const canEditDisplayName = hasSessionPermission(session, "user-update") && Boolean(userProfileState);
  const profileLastLoginLabel = userProfileState?.lastLogin ? formatIsoShort(userProfileState.lastLogin) : "n/a";
  const profileCreateDateLabel = userProfileState?.createDate
    ? formatIsoShort(userProfileState.createDate)
    : "n/a";
  const sessionExpiryLabel = session ? formatIsoShort(new Date(session.expiresAt).toISOString()) : "n/a";
  const latestConflictAction = queuedActions.find((action) => action.status === "conflict") ?? null;
  const latestFailedAction = queuedActions.find((action) => action.status === "failed") ?? null;

  const pushNotice = (notice: RouteNotice) => {
    setNotices((current) => {
      if (current.some((item) => item.id === notice.id)) {
        return current;
      }

      return [notice, ...current].slice(0, 3);
    });
  };

  const dismissNotice = (noticeId: string) => {
    setNotices((current) => current.filter((notice) => notice.id !== noticeId));
  };

  const refreshUserProfileState = async () => {
    if (!session?.token) {
      setUserProfileState(null);
      setUserProfileError(null);
      return null;
    }

    setIsUserProfileBusy(true);
    try {
      const snapshot = await fetchCurrentUserProfile(session.token);
      setUserProfileState(snapshot);
      setDisplayNameDraft(snapshot.name ?? "");
      setUserProfileError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "User profile snapshot could not be loaded.";
      setUserProfileError(message);
      return null;
    } finally {
      setIsUserProfileBusy(false);
    }
  };

  const refreshProfileSyncState = async () => {
    if (!session?.token) {
      setProfileSyncState(null);
      setProfileSyncError(null);
      return null;
    }

    setIsProfileSyncBusy(true);
    try {
      const snapshot = await fetchProfileSessionTimeoutSnapshot(session.token);
      setProfileSyncState(snapshot);
      setProfileSyncError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Profile sync snapshot could not be loaded.";
      setProfileSyncError(message);
      return null;
    } finally {
      setIsProfileSyncBusy(false);
    }
  };

  const refreshNotificationPreferenceState = async () => {
    if (!session?.token) {
      setNotificationPreferenceState(null);
      setNotificationPreferenceError(null);
      return null;
    }

    setIsNotificationPreferenceBusy(true);
    try {
      const snapshot = await fetchNotificationPreferenceSnapshot(session.token, notificationChannel);
      setNotificationPreferenceState(snapshot);
      setNotificationPreferenceError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Notification preference snapshot could not be loaded.";
      setNotificationPreferenceError(message);
      return null;
    } finally {
      setIsNotificationPreferenceBusy(false);
    }
  };

  const refreshLocalePreferenceState = async () => {
    if (!session?.token) {
      setLocalePreferenceState(null);
      setLocalePreferenceError(null);
      return null;
    }

    setIsLocalePreferenceBusy(true);
    try {
      const snapshot = await fetchLocalePreferenceSnapshot(session.token);
      setLocalePreferenceState(snapshot);
      setLocalePreferenceError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim() ? error.message : "Locale snapshot could not be loaded.";
      setLocalePreferenceError(message);
      return null;
    } finally {
      setIsLocalePreferenceBusy(false);
    }
  };

  const refreshTimezonePreferenceState = async () => {
    if (!session?.token) {
      setTimezonePreferenceState(null);
      setTimezonePreferenceError(null);
      return null;
    }

    setIsTimezonePreferenceBusy(true);
    try {
      const snapshot = await fetchTimezonePreferenceSnapshot(session.token);
      setTimezonePreferenceState(snapshot);
      setTimezonePreferenceError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Timezone snapshot could not be loaded.";
      setTimezonePreferenceError(message);
      return null;
    } finally {
      setIsTimezonePreferenceBusy(false);
    }
  };

  const refreshDateFormatPreferenceState = async () => {
    if (!session?.token) {
      setDateFormatPreferenceState(null);
      setDateFormatPreferenceError(null);
      return null;
    }

    setIsDateFormatPreferenceBusy(true);
    try {
      const snapshot = await fetchDateFormatPreferenceSnapshot(session.token);
      setDateFormatPreferenceState(snapshot);
      setDateFormatPreferenceError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Date-format snapshot could not be loaded.";
      setDateFormatPreferenceError(message);
      return null;
    } finally {
      setIsDateFormatPreferenceBusy(false);
    }
  };

  const refreshTimeFormatPreferenceState = async () => {
    if (!session?.token) {
      setTimeFormatPreferenceState(null);
      setTimeFormatPreferenceError(null);
      return null;
    }

    setIsTimeFormatPreferenceBusy(true);
    try {
      const snapshot = await fetchTimeFormatPreferenceSnapshot(session.token);
      setTimeFormatPreferenceState(snapshot);
      setTimeFormatPreferenceError(null);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Time-format snapshot could not be loaded.";
      setTimeFormatPreferenceError(message);
      return null;
    } finally {
      setIsTimeFormatPreferenceBusy(false);
    }
  };

  const refreshAllPreferenceStates = async () => {
    await Promise.all([
      refreshUserProfileState(),
      refreshProfileSyncState(),
      refreshNotificationPreferenceState(),
      refreshLocalePreferenceState(),
      refreshTimezonePreferenceState(),
      refreshDateFormatPreferenceState(),
      refreshTimeFormatPreferenceState(),
    ]);
  };

  useEffect(() => {
    if (!session?.token) {
      setUserProfileState(null);
      setUserProfileError(null);
      setDisplayNameDraft("");
      setDisplayNameSaveError(null);
      setProfileSyncState(null);
      setProfileSyncError(null);
      setNotificationPreferenceState(null);
      setNotificationPreferenceError(null);
      setLocalePreferenceState(null);
      setLocalePreferenceError(null);
      setTimezonePreferenceState(null);
      setTimezonePreferenceError(null);
      setDateFormatPreferenceState(null);
      setDateFormatPreferenceError(null);
      setTimeFormatPreferenceState(null);
      setTimeFormatPreferenceError(null);
      return;
    }

    void refreshAllPreferenceStates();
  }, [session?.email, session?.token]);

  useEffect(() => {
    if (!userProfileState) {
      return;
    }

    setDisplayNameDraft(userProfileState.name ?? "");
  }, [userProfileState?.id, userProfileState?.name]);

  useEffect(() => {
    if (!summary.lastReplayAt || lastReplayAtRef.current === summary.lastReplayAt) {
      return;
    }

    lastReplayAtRef.current = summary.lastReplayAt;
    const counts = parseReplayOutcomeCounts(summary.lastReplayOutcome);

    if (counts.drainedCount > 0) {
      pushNotice({
        id: `replay-success:${summary.lastReplayAt}`,
        title: "Replay tamamlandi",
        message: `${counts.drainedCount} queued write drained edildi. Editor icinden audit route acilabilir.`,
        tone: "success",
        kind: "replay-success",
      });
    }

    if (counts.failedCount > 0 && latestFailedAction) {
      latestFailedIdRef.current = latestFailedAction.id;
      pushNotice({
        id: `retry-needed:${latestFailedAction.id}`,
        title: "Replay retry gerekiyor",
        message: `${latestFailedAction.label} yeni bir failure kaydetti. Force retry ile queue tekrar deneyebilir.`,
        tone: "warning",
        kind: "retry-needed",
        actionId: latestFailedAction.id,
      });
    }

    if (counts.conflictCount > 0 && latestConflictAction) {
      latestConflictIdRef.current = latestConflictAction.id;
      pushNotice({
        id: `conflict:${latestConflictAction.id}`,
        title: "Conflict remediation bekliyor",
        message: `${latestConflictAction.label} stale version ile dondu. Capability kartindan veya toast aksiyonundan remediation baslatabilirsiniz.`,
        tone: "warning",
        kind: "conflict",
        actionId: latestConflictAction.id,
      });
    }
  }, [latestConflictAction, latestFailedAction, summary.lastReplayAt, summary.lastReplayOutcome]);

  useEffect(() => {
    if (!latestFailedAction || latestFailedIdRef.current === latestFailedAction.id) {
      return;
    }

    latestFailedIdRef.current = latestFailedAction.id;
    pushNotice({
      id: `retry-needed:${latestFailedAction.id}`,
      title: "Failed item bulundu",
      message: `${latestFailedAction.label} retry cooldown penceresinde bekliyor.`,
      tone: "warning",
      kind: "retry-needed",
      actionId: latestFailedAction.id,
    });
  }, [latestFailedAction]);

  useEffect(() => {
    if (!latestConflictAction || latestConflictIdRef.current === latestConflictAction.id) {
      return;
    }

    latestConflictIdRef.current = latestConflictAction.id;
    pushNotice({
      id: `conflict:${latestConflictAction.id}`,
      title: "Manual conflict tespit edildi",
      message: `${latestConflictAction.label} icin karar gerekiyor. Bu route uzerinden remediation devam edebilir.`,
      tone: "warning",
      kind: "conflict",
      actionId: latestConflictAction.id,
    });
  }, [latestConflictAction]);

  const buildQueueRequest = (delta: number, expectedVersion = profileSyncState?.version) => {
    if (!profileSyncState) {
      return null;
    }

    return {
      resourceKey: profileSyncState.resourceKey || profileResourceKey,
      expectedVersion,
      targetSessionTimeoutMinutes: profileSyncState.sessionTimeoutMinutes + delta,
    };
  };

  const buildNotificationQueueRequest = (
    targetEnabled: boolean,
    expectedVersion = notificationPreferenceState?.version,
  ) => {
    if (!notificationPreferenceState) {
      return null;
    }

    return {
      resourceKey: notificationPreferenceState.resourceKey || notificationResourceKey,
      preferenceChannel: notificationPreferenceState.channel || notificationChannel,
      expectedVersion,
      targetPreferenceEnabled: targetEnabled,
      targetPreferenceFrequency: notificationPreferenceState.frequency,
    };
  };

  const resolveNextLocale = (currentLocale?: string | null) => {
    const normalizedCurrent = currentLocale?.trim().toLowerCase() ?? "tr";
    const currentIndex = localeCycle.findIndex((locale) => locale === normalizedCurrent);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % localeCycle.length;
    return localeCycle[nextIndex];
  };

  const buildLocaleQueueRequest = (
    targetLocale = resolveNextLocale(localePreferenceState?.locale),
    expectedVersion = localePreferenceState?.version,
  ) => {
    if (!localePreferenceState) {
      return null;
    }

    return {
      resourceKey: localePreferenceState.resourceKey || profileResourceKey,
      expectedVersion,
      targetLocale,
    };
  };

  const resolveNextTimezone = (currentTimezone?: string | null) => {
    const normalizedCurrent = currentTimezone?.trim() ?? timezoneCycle[0];
    const currentIndex = timezoneCycle.findIndex((timezone) => timezone === normalizedCurrent);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % timezoneCycle.length;
    return timezoneCycle[nextIndex];
  };

  const buildTimezoneQueueRequest = (
    targetTimezone = resolveNextTimezone(timezonePreferenceState?.timezone),
    expectedVersion = timezonePreferenceState?.version,
  ) => {
    if (!timezonePreferenceState) {
      return null;
    }

    return {
      resourceKey: timezonePreferenceState.resourceKey || profileResourceKey,
      expectedVersion,
      targetTimezone,
    };
  };

  const resolveNextDateFormat = (currentDateFormat?: string | null) => {
    const normalizedCurrent = currentDateFormat?.trim() ?? dateFormatCycle[0];
    const currentIndex = dateFormatCycle.findIndex((dateFormat) => dateFormat === normalizedCurrent);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % dateFormatCycle.length;
    return dateFormatCycle[nextIndex];
  };

  const buildDateFormatQueueRequest = (
    targetDateFormat = resolveNextDateFormat(dateFormatPreferenceState?.dateFormat),
    expectedVersion = dateFormatPreferenceState?.version,
  ) => {
    if (!dateFormatPreferenceState) {
      return null;
    }

    return {
      resourceKey: dateFormatPreferenceState.resourceKey || profileResourceKey,
      expectedVersion,
      targetDateFormat,
    };
  };

  const resolveNextTimeFormat = (currentTimeFormat?: string | null) => {
    const normalizedCurrent = currentTimeFormat?.trim() ?? timeFormatCycle[0];
    const currentIndex = timeFormatCycle.findIndex((timeFormat) => timeFormat === normalizedCurrent);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % timeFormatCycle.length;
    return timeFormatCycle[nextIndex];
  };

  const buildTimeFormatQueueRequest = (
    targetTimeFormat = resolveNextTimeFormat(timeFormatPreferenceState?.timeFormat),
    expectedVersion = timeFormatPreferenceState?.version,
  ) => {
    if (!timeFormatPreferenceState) {
      return null;
    }

    return {
      resourceKey: timeFormatPreferenceState.resourceKey || profileResourceKey,
      expectedVersion,
      targetTimeFormat,
    };
  };

  const handleSaveDisplayName = async () => {
    if (!session?.token || !userProfileState) {
      return;
    }

    const normalizedName = displayNameDraft.trim();
    if (!normalizedName) {
      setDisplayNameSaveError("Gorunen ad bos birakilamaz.");
      return;
    }

    if (normalizedName === userProfileState.name.trim()) {
      setDisplayNameSaveError(null);
      return;
    }

    setIsSavingDisplayName(true);
    try {
      const updatedProfile = await updateCurrentUserDisplayName(session.token, {
        name: normalizedName,
      });
      setUserProfileState(updatedProfile);
      setDisplayNameDraft(updatedProfile.name);
      setDisplayNameSaveError(null);
      pushNotice({
        id: `profile-name-saved:${updatedProfile.id}:${updatedProfile.name}`,
        title: "Kisisel bilgiler guncellendi",
        message: "Gorunen ad ayari kaydedildi.",
        tone: "success",
        kind: "replay-success",
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Gorunen ad kaydedilemedi.";
      setDisplayNameSaveError(message);
    } finally {
      setIsSavingDisplayName(false);
    }
  };

  const handleReplayQueue = async () => {
    await replayQueue();
    await refreshAllPreferenceStates();
  };

  const handleRetryFailedActions = async () => {
    await retryFailedActions();
    await refreshAllPreferenceStates();
  };

  const handleResolveConflict = async (
    actionId: string,
    resolution: "client-wins" | "server-wins" | "discard",
  ) => {
    await resolveConflict(actionId, resolution);
    await refreshAllPreferenceStates();
  };

  const handleNoticeAction = async (notice: RouteNotice) => {
    if (notice.kind === "replay-success") {
      if (canOpenAuditRoute) {
        onOpenAuditRoute();
      }
      dismissNotice(notice.id);
      return;
    }

    if (notice.kind === "retry-needed") {
      await handleRetryFailedActions();
      dismissNotice(notice.id);
      return;
    }

    if (notice.kind === "conflict" && notice.actionId) {
      await handleResolveConflict(notice.actionId, "server-wins");
      dismissNotice(notice.id);
    }
  };

  const buildFailedPanel = (lane: QueueLaneSummary, auditActionLabel: string) => {
    if (!lane.latestFailed) {
      return null;
    }

    return {
      title: `Failed ${lane.title.toLowerCase()}`,
      detailLines: [
        lane.latestFailed.label,
        `Error code: ${lane.latestFailed.errorCode ?? "n/a"} / Retry after: ${
          lane.latestFailed.nextRetryAt ? formatIsoShort(lane.latestFailed.nextRetryAt) : "ready now"
        }`,
        lane.latestFailed.lastError ?? "No failure message recorded.",
      ],
      actions: [
        {
          label: "Retry failed queue",
          onPress: () => {
            void handleRetryFailedActions();
          },
          variant: "secondary" as const,
          disabled: summary.failedCount === 0 || isReplaying,
        },
        {
          label: auditActionLabel,
          onPress: onOpenAuditRoute,
          variant: "secondary" as const,
          disabled: !canOpenAuditRoute,
        },
      ],
    };
  };

  const buildConflictPanel = (
    lane: QueueLaneSummary,
    detailLines: string[],
    auditActionLabel: string,
  ) => {
    if (!lane.latestConflict) {
      return null;
    }

    return {
      title: `${lane.title} conflict remediation`,
      detailLines,
      actions: [
        {
          label: "Apply server state",
          onPress: () => {
            void handleResolveConflict(lane.latestConflict!.id, "server-wins");
          },
          variant: "secondary" as const,
        },
        {
          label: "Client wins",
          onPress: () => {
            void handleResolveConflict(lane.latestConflict!.id, "client-wins");
          },
          variant: "secondary" as const,
        },
        {
          label: auditActionLabel,
          onPress: onOpenAuditRoute,
          variant: "secondary" as const,
          disabled: !canOpenAuditRoute,
        },
      ],
    };
  };

  return (
    <ScreenScaffold>
      {notices.length > 0 ? (
        <View style={styles.sectionStack}>
          {notices.map((notice) => (
            <InlineToast
              key={notice.id}
              title={notice.title}
              message={notice.message}
              tone={notice.tone}
              actionLabel={
                notice.kind === "replay-success"
                  ? "Open audit route"
                  : notice.kind === "retry-needed"
                    ? "Retry failed"
                    : "Apply server state"
              }
              onAction={() => {
                void handleNoticeAction(notice);
              }}
              onDismiss={() => {
                dismissNotice(notice.id);
              }}
            />
          ))}
        </View>
      ) : null}

      <PreferenceCapabilityCard
        title="Profile preferences editor"
        description="Bu route artik ayarlari kategori bazli toplar. Home auth/bootstrap icin sade kalir; profil, bolgesel, bildirim, guvenlik ve genel ayarlar burada yonetilir."
        statusPills={[
          {
            label: status === "authenticated" ? "Session ready" : `Session ${authSummary.statusLabel}`,
            tone: status === "authenticated" ? "ready" : "pending",
          },
          {
            label: `Queued: ${summary.queuedCount}`,
            tone: buildStatusTone(summary.queuedCount),
          },
          {
            label: `Retry ready: ${summary.retryReadyCount}`,
            tone: buildStatusTone(summary.retryReadyCount),
          },
          {
            label: `Conflicts: ${summary.conflictCount}`,
            tone: buildStatusTone(summary.conflictCount),
          },
        ]}
        detailLines={[
          `Current user: ${session?.email ?? "n/a"}`,
          `Active section: ${currentCategory.label}`,
          `Raw permissions: ${authSummary.permissionCount} / Effective permissions: ${authSummary.effectivePermissionCount}`,
          `Last replay: ${summary.lastReplayAt ? formatIsoShort(summary.lastReplayAt) : "n/a"}`,
          `Last replay outcome: ${summary.lastReplayOutcome ?? "No replay has been executed yet."}`,
        ]}
        actions={[
          {
            label: "Back to home",
            onPress: onBack,
            variant: "secondary",
          },
          {
            label: "Open audit route",
            onPress: onOpenAuditRoute,
            disabled: !canOpenAuditRoute,
          },
          {
            label: "Refresh authz",
            onPress: () => {
              void refreshAuthorization();
            },
            variant: "secondary",
            disabled: isBusy || !session,
          },
          {
            label: "Refresh all states",
            onPress: () => {
              void refreshAllPreferenceStates();
            },
            variant: "secondary",
            disabled: isBusy || !session,
          },
          {
            label: "Sign out",
            onPress: () => {
              void signOut();
            },
            variant: "secondary",
            disabled: !session,
          },
        ]}
      />

      <PreferenceCapabilityCard
        title="Settings sections"
        description="Ayarlar, kullanicinin daha hizli bulmasi icin mantiksal bolumlere ayrildi."
        detailLines={[currentCategory.description]}
      >
        <View style={styles.categoryButtonRow}>
          {settingsCategories.map((category) => (
            <ActionButton
              key={category.id}
              label={category.label}
              onPress={() => {
                setSelectedCategory(category.id);
              }}
              variant={selectedCategory === category.id ? "primary" : "secondary"}
            />
          ))}
        </View>
      </PreferenceCapabilityCard>

      {selectedCategory === "general" ? (
        <>
          <PreferenceCapabilityCard
            title="Genel uygulama ayarlari"
            description="Cihaz, ag, bildirim runtime durumu ve offline queue sagligi bu bolumde toplanir."
            statusPills={[
              {
                label: networkStatus.isOnline ? "Network online" : "Network offline",
                tone: networkStatus.isOnline ? "ready" : "pending",
              },
              {
                label: notificationsStatus.enabled ? "Push enabled" : "Push not configured",
                tone: notificationsStatus.enabled ? "ready" : "pending",
              },
              {
                label: `Queued ${summary.queuedCount}`,
                tone: buildStatusTone(summary.queuedCount),
              },
            ]}
            detailLines={[
              `Device: ${deviceProfile.platform} / ${deviceProfile.version}`,
              `Gateway: http://127.0.0.1:8080/api`,
              `Notifications runtime: ${notificationsStatus.reason}`,
              `Last network check: ${formatIsoShort(networkStatus.lastCheckedAt)}`,
              `Queue persistence: local storage active / Last audit id: ${summary.lastMutationAuditId ?? "n/a"}`,
            ]}
          />

          <PreferenceCapabilityCard
            title="Capability health"
            description="Which capability is waiting, failing or conflicting is visible here before you start remediation."
          >
            <View style={styles.sectionStack}>
              {[sessionTimeoutLane, notificationLane, localeLane, timezoneLane, dateFormatLane, timeFormatLane].map((lane) => (
                <PreferenceRemediationPanel
                  key={`health-${lane.kind}`}
                  title={lane.title}
                  detailLines={[
                    lane.retryPolicyKey,
                    `Latest: ${lane.latestItem ? `${lane.latestItem.label} / ${lane.latestItem.status}` : "No queued item yet."}`,
                  ]}
                >
                  <View style={styles.statusRow}>
                    <StatusPill label={`Queued ${lane.total}`} tone={buildStatusTone(lane.total)} />
                    <StatusPill label={`Failed ${lane.failedCount}`} tone={buildStatusTone(lane.failedCount)} />
                    <StatusPill
                      label={`Conflict ${lane.conflictCount}`}
                      tone={buildStatusTone(lane.conflictCount)}
                    />
                  </View>
                </PreferenceRemediationPanel>
              ))}
            </View>
          </PreferenceCapabilityCard>
        </>
      ) : null}

      {selectedCategory === "profile" ? (
        <>
          <PreferenceCapabilityCard
            title="Kisisel bilgiler"
            description="Kullanicinin temel hesap ozeti burada gorunur. E-posta ve rol salt okunur tutulur; gorunen ad ise ayarlanabilir."
            statusPills={[
              {
                label: userProfileState ? "Profile loaded" : "Profile syncing",
                tone: userProfileState ? "ready" : "pending",
              },
              {
                label: userProfileState?.enabled ? "Account active" : "Account passive",
                tone: userProfileState?.enabled ? "ready" : "pending",
              },
              {
                label: canEditDisplayName ? "Name editable" : "Read only",
                tone: canEditDisplayName ? "ready" : "pending",
              },
            ]}
            detailLines={[
              `Gorunen ad: ${userProfileState?.name ?? "n/a"}`,
              `E-posta: ${userProfileState?.email ?? session?.email ?? "n/a"}`,
              `Rol: ${userProfileState?.role ?? session?.role ?? "n/a"} / Company: ${session?.companyId ?? "n/a"}`,
              `Son giris: ${profileLastLoginLabel} / Hesap olusturma: ${profileCreateDateLabel}`,
              "Telefon, avatar ve ekip bilgisi sonraki capability setinde eklenecek.",
            ]}
            error={userProfileError}
            actions={[
              {
                label: isUserProfileBusy ? "Refreshing..." : "Refresh profile",
                onPress: () => {
                  void refreshUserProfileState();
                },
                variant: "secondary",
                disabled: isUserProfileBusy || !session,
              },
            ]}
          />

          <PreferenceCapabilityCard
            title="Gorunen ad"
            description="Kisisel bilgiler icinde ilk duzenlenebilir alan olarak gorunen ad ayarlandi."
            detailLines={[
              canEditDisplayName
                ? "Bu alan mevcut permission seti ile kaydedilebilir."
                : "Bu alan user-update yetkisi olmadiginda salt okunur kalir.",
            ]}
            error={displayNameSaveError}
            actions={[
              {
                label: isSavingDisplayName ? "Saving..." : "Save display name",
                onPress: () => {
                  void handleSaveDisplayName();
                },
                disabled:
                  !canEditDisplayName ||
                  isSavingDisplayName ||
                  !displayNameDraft.trim() ||
                  displayNameDraft.trim() === (userProfileState?.name ?? "").trim(),
              },
              {
                label: "Reset draft",
                onPress: () => {
                  setDisplayNameDraft(userProfileState?.name ?? "");
                  setDisplayNameSaveError(null);
                },
                variant: "secondary",
                disabled: isSavingDisplayName,
              },
            ]}
          >
            <View style={styles.fieldStack}>
              <Text style={styles.inputLabel}>Gorunen ad</Text>
              <TextInput
                value={displayNameDraft}
                onChangeText={setDisplayNameDraft}
                editable={canEditDisplayName && !isSavingDisplayName}
                placeholder="Ad Soyad"
                style={[
                  styles.textInput,
                  !canEditDisplayName ? styles.textInputDisabled : null,
                ]}
              />
              <Text style={styles.metaText}>
                Bu degisiklik mevcut kullanicinin profil kaydina yazilir. E-posta ve rol bu ekranda
                degistirilmez.
              </Text>
            </View>
          </PreferenceCapabilityCard>
        </>
      ) : null}

      {selectedCategory === "security" ? (
        <>
          <PreferenceCapabilityCard
            title="Guvenlik ve oturumlar"
            description="Oturum omru, audit erisimi ve hesap guvenligi gorunurlugu bu bolumde tutulur."
            statusPills={[
              {
                label: requiresReauthentication ? "Reauth required" : "Session active",
                tone: requiresReauthentication ? "pending" : "ready",
              },
              {
                label: canOpenAuditRoute ? "Audit access ready" : "Audit gated",
                tone: canOpenAuditRoute ? "ready" : "pending",
              },
              {
                label: session ? `Role ${session.role}` : "No session",
                tone: session ? "ready" : "pending",
              },
            ]}
            detailLines={[
              `Session email: ${session?.email ?? "n/a"} / Company: ${session?.companyId ?? "n/a"}`,
              `Session expires: ${sessionExpiryLabel}`,
              `Last auth sync: ${session?.lastSyncedAt ? formatIsoShort(session.lastSyncedAt) : "n/a"}`,
              `Permissions: ${authSummary.effectivePermissionCount} effective / ${authSummary.allowedScopeCount} scopes`,
            ]}
            actions={[
              {
                label: "Open audit route",
                onPress: onOpenAuditRoute,
                disabled: !canOpenAuditRoute,
              },
              {
                label: "Refresh authz",
                onPress: () => {
                  void refreshAuthorization();
                },
                variant: "secondary",
                disabled: isBusy || !session,
              },
              {
                label: "Sign out",
                onPress: () => {
                  void signOut();
                },
                variant: "secondary",
                disabled: !session,
              },
            ]}
          />

          <PreferenceCapabilityEditorSection
            title="Session-timeout editor"
            description="Oturum suresi, mobilde guvenlik davranisinin ilk ayarlanabilir capability'si olarak korunuyor."
        statusPills={[
          {
            label: profileSyncState ? "Snapshot ready" : "Snapshot gated",
            tone: profileSyncState ? "ready" : "pending",
          },
          {
            label: `Queued ${sessionTimeoutLane.total}`,
            tone: buildStatusTone(sessionTimeoutLane.total),
          },
          {
            label: `Conflicts ${sessionTimeoutLane.conflictCount}`,
            tone: buildStatusTone(sessionTimeoutLane.conflictCount),
          },
        ]}
        detailLines={[
          `Resource: ${profileSyncState?.resourceKey ?? profileResourceKey}`,
          `Timeout: ${profileSyncState ? `${profileSyncState.sessionTimeoutMinutes} min` : "n/a"} / Version: ${profileSyncState ? profileSyncState.version : "n/a"}`,
          `Policy: ${sessionTimeoutLane.retryPolicyKey} / Audit: ${sessionTimeoutLane.auditAction}`,
          `Success feed: ${sessionTimeoutSuccessCapability.routeLabel} / Conflict feed: ${sessionTimeoutConflictCapability.routeLabel}`,
        ]}
        error={profileSyncError}
        actions={[
          {
            label: "Queue timeout action",
            onPress: () => {
              const request = buildQueueRequest(1);
              if (request) {
                enqueueDemoAction(request);
              }
            },
            disabled: !profileSyncState,
          },
          {
            label: "Queue timeout retry",
            onPress: () => {
              const request = buildQueueRequest(2);
              if (request) {
                enqueueRetryDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !profileSyncState,
          },
          {
            label: "Queue timeout conflict",
            onPress: () => {
              const request = buildQueueRequest(3, Math.max((profileSyncState?.version ?? 0) - 1, 0));
              if (request) {
                enqueueConflictDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !profileSyncState,
          },
          {
            label: isProfileSyncBusy ? "Refreshing..." : "Refresh state",
            onPress: () => {
              void refreshProfileSyncState();
            },
            variant: "secondary",
            disabled: isProfileSyncBusy || !session,
          },
        ]}
        failedPanel={buildFailedPanel(sessionTimeoutLane, "Open timeout audit")}
        conflictPanel={buildConflictPanel(
          sessionTimeoutLane,
          [
            `Expected version: ${sessionTimeoutLane.latestConflict?.expectedVersion ?? "n/a"} / Server version: ${sessionTimeoutLane.latestConflict?.serverVersion ?? "n/a"}`,
            `Server timeout: ${sessionTimeoutLane.latestConflict?.serverSessionTimeoutMinutes ?? "n/a"} min`,
            `Error code: ${sessionTimeoutLane.latestConflict?.errorCode ?? "n/a"} / Conflict reason: ${sessionTimeoutLane.latestConflict?.conflictReason ?? "n/a"}`,
          ],
          "Open timeout conflict",
        )}
          />
        </>
      ) : null}

      {selectedCategory === "notifications" ? (
        <PreferenceCapabilityEditorSection
          title="Bildirim tercihi"
          description="E-posta bildirim tercihi ayari bu bolumde kalir; ileride push ve sessiz saat capability'leri ayni yere eklenecek."
        statusPills={[
          {
            label: notificationPreferenceState ? "Snapshot ready" : "Snapshot gated",
            tone: notificationPreferenceState ? "ready" : "pending",
          },
          {
            label: `Queued ${notificationLane.total}`,
            tone: buildStatusTone(notificationLane.total),
          },
          {
            label: `Conflicts ${notificationLane.conflictCount}`,
            tone: buildStatusTone(notificationLane.conflictCount),
          },
        ]}
        detailLines={[
          `Resource: ${notificationPreferenceState?.resourceKey ?? notificationResourceKey}`,
          `Channel: ${notificationPreferenceState?.channel ?? notificationChannel} / Enabled: ${notificationPreferenceState ? String(notificationPreferenceState.enabled) : "n/a"} / Frequency: ${notificationPreferenceState?.frequency ?? "n/a"}`,
          `Version: ${notificationPreferenceState ? notificationPreferenceState.version : "n/a"} / Policy: ${notificationLane.retryPolicyKey}`,
          `Success feed: ${notificationSuccessCapability.routeLabel} / Conflict feed: ${notificationConflictCapability.routeLabel}`,
        ]}
        error={notificationPreferenceError}
        actions={[
          {
            label: "Queue preference action",
            onPress: () => {
              if (!notificationPreferenceState) {
                return;
              }
              const request = buildNotificationQueueRequest(!notificationPreferenceState.enabled);
              if (request) {
                enqueueNotificationDemoAction(request);
              }
            },
            disabled: !notificationPreferenceState,
          },
          {
            label: "Queue preference retry",
            onPress: () => {
              if (!notificationPreferenceState) {
                return;
              }
              const request = buildNotificationQueueRequest(!notificationPreferenceState.enabled);
              if (request) {
                enqueueNotificationRetryDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !notificationPreferenceState,
          },
          {
            label: "Queue preference conflict",
            onPress: () => {
              if (!notificationPreferenceState) {
                return;
              }
              const request = buildNotificationQueueRequest(
                !notificationPreferenceState.enabled,
                Math.max(notificationPreferenceState.version - 1, 0),
              );
              if (request) {
                enqueueNotificationConflictDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !notificationPreferenceState,
          },
          {
            label: isNotificationPreferenceBusy ? "Refreshing..." : "Refresh state",
            onPress: () => {
              void refreshNotificationPreferenceState();
            },
            variant: "secondary",
            disabled: isNotificationPreferenceBusy || !session,
          },
        ]}
        failedPanel={buildFailedPanel(notificationLane, "Open preference audit")}
        conflictPanel={buildConflictPanel(
          notificationLane,
          [
            `Expected version: ${notificationLane.latestConflict?.expectedVersion ?? "n/a"} / Server version: ${notificationLane.latestConflict?.serverVersion ?? "n/a"}`,
            `Server preference: ${typeof notificationLane.latestConflict?.serverPreferenceEnabled === "boolean" ? String(notificationLane.latestConflict.serverPreferenceEnabled) : "n/a"} / Frequency: ${notificationLane.latestConflict?.serverPreferenceFrequency ?? "n/a"}`,
            `Error code: ${notificationLane.latestConflict?.errorCode ?? "n/a"} / Conflict reason: ${notificationLane.latestConflict?.conflictReason ?? "n/a"}`,
          ],
          "Open preference conflict",
        )}
        />
      ) : null}

      {selectedCategory === "regional" ? (
        <>
          <PreferenceCapabilityCard
            title="Dil ve bolgesel ayarlar"
            description="Uygulama dili ve bolgesel bicim tercihleri ayri ama bagli capability'ler olarak gruplanir."
            detailLines={[
              "Uygulama dili, bolgesel tarih/saat biciminden ayri dusunulur.",
              "Saat dilimi, tarih formati ve saat formati birlikte yonetilir.",
            ]}
          />

          <PreferenceCapabilityEditorSection
            title="Uygulama dili"
            description="Mobil arayuz dili locale capability uzerinden yonetilir; bolgesel bicim tercihleri ise alttaki capability'lerde ayridir."
        statusPills={[
          {
            label: localePreferenceState ? "Snapshot ready" : "Snapshot gated",
            tone: localePreferenceState ? "ready" : "pending",
          },
          {
            label: `Queued ${localeLane.total}`,
            tone: buildStatusTone(localeLane.total),
          },
          {
            label: `Conflicts ${localeLane.conflictCount}`,
            tone: buildStatusTone(localeLane.conflictCount),
          },
        ]}
        detailLines={[
          `Resource: ${localePreferenceState?.resourceKey ?? profileResourceKey}`,
          `Locale: ${localePreferenceState?.locale ?? "n/a"} / Version: ${localePreferenceState ? localePreferenceState.version : "n/a"}`,
          `Policy: ${localeLane.retryPolicyKey} / Audit: ${localeLane.auditAction}`,
          `Success feed: ${localeSuccessCapability.routeLabel} / Conflict feed: ${localeConflictCapability.routeLabel}`,
        ]}
        error={localePreferenceError}
        actions={[
          {
            label: "Queue locale action",
            onPress: () => {
              const request = buildLocaleQueueRequest();
              if (request) {
                enqueueLocaleDemoAction(request);
              }
            },
            disabled: !localePreferenceState,
          },
          {
            label: "Queue locale retry",
            onPress: () => {
              const request = buildLocaleQueueRequest();
              if (request) {
                enqueueLocaleRetryDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !localePreferenceState,
          },
          {
            label: "Queue locale conflict",
            onPress: () => {
              const request = buildLocaleQueueRequest(
                resolveNextLocale(localePreferenceState?.locale),
                Math.max((localePreferenceState?.version ?? 0) - 1, 0),
              );
              if (request) {
                enqueueLocaleConflictDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !localePreferenceState,
          },
          {
            label: isLocalePreferenceBusy ? "Refreshing..." : "Refresh state",
            onPress: () => {
              void refreshLocalePreferenceState();
            },
            variant: "secondary",
            disabled: isLocalePreferenceBusy || !session,
          },
        ]}
        failedPanel={buildFailedPanel(localeLane, "Open locale audit")}
        conflictPanel={buildConflictPanel(
          localeLane,
          [
            `Expected version: ${localeLane.latestConflict?.expectedVersion ?? "n/a"} / Server version: ${localeLane.latestConflict?.serverVersion ?? "n/a"}`,
            `Server locale: ${localeLane.latestConflict?.serverLocale ?? "n/a"} / Target locale: ${localeLane.latestConflict?.targetLocale ?? "n/a"}`,
            `Error code: ${localeLane.latestConflict?.errorCode ?? "n/a"} / Conflict reason: ${localeLane.latestConflict?.conflictReason ?? "n/a"}`,
          ],
          "Open locale conflict",
        )}
          />

          <PreferenceCapabilityEditorSection
            title="Saat dilimi"
            description="Bolgesel deneyim icin timezone capability ayri tutulur ve audit ile izlenir."
        statusPills={[
          {
            label: timezonePreferenceState ? "Snapshot ready" : "Snapshot gated",
            tone: timezonePreferenceState ? "ready" : "pending",
          },
          {
            label: `Queued ${timezoneLane.total}`,
            tone: buildStatusTone(timezoneLane.total),
          },
          {
            label: `Conflicts ${timezoneLane.conflictCount}`,
            tone: buildStatusTone(timezoneLane.conflictCount),
          },
        ]}
        detailLines={[
          `Resource: ${timezonePreferenceState?.resourceKey ?? profileResourceKey}`,
          `Timezone: ${timezonePreferenceState?.timezone ?? "n/a"} / Version: ${timezonePreferenceState ? timezonePreferenceState.version : "n/a"}`,
          `Policy: ${timezoneLane.retryPolicyKey} / Audit: ${timezoneLane.auditAction}`,
          `Success feed: ${timezoneSuccessCapability.routeLabel} / Conflict feed: ${timezoneConflictCapability.routeLabel}`,
        ]}
        error={timezonePreferenceError}
        actions={[
          {
            label: "Queue timezone action",
            onPress: () => {
              const request = buildTimezoneQueueRequest();
              if (request) {
                enqueueTimezoneDemoAction(request);
              }
            },
            disabled: !timezonePreferenceState,
          },
          {
            label: "Queue timezone retry",
            onPress: () => {
              const request = buildTimezoneQueueRequest();
              if (request) {
                enqueueTimezoneRetryDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !timezonePreferenceState,
          },
          {
            label: "Queue timezone conflict",
            onPress: () => {
              const request = buildTimezoneQueueRequest(
                resolveNextTimezone(timezonePreferenceState?.timezone),
                Math.max((timezonePreferenceState?.version ?? 0) - 1, 0),
              );
              if (request) {
                enqueueTimezoneConflictDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !timezonePreferenceState,
          },
          {
            label: isTimezonePreferenceBusy ? "Refreshing..." : "Refresh state",
            onPress: () => {
              void refreshTimezonePreferenceState();
            },
            variant: "secondary",
            disabled: isTimezonePreferenceBusy || !session,
          },
        ]}
        failedPanel={buildFailedPanel(timezoneLane, "Open timezone audit")}
        conflictPanel={buildConflictPanel(
          timezoneLane,
          [
            `Expected version: ${timezoneLane.latestConflict?.expectedVersion ?? "n/a"} / Server version: ${timezoneLane.latestConflict?.serverVersion ?? "n/a"}`,
            `Server timezone: ${timezoneLane.latestConflict?.serverTimezone ?? "n/a"} / Target timezone: ${timezoneLane.latestConflict?.targetTimezone ?? "n/a"}`,
            `Error code: ${timezoneLane.latestConflict?.errorCode ?? "n/a"} / Conflict reason: ${timezoneLane.latestConflict?.conflictReason ?? "n/a"}`,
          ],
          "Open timezone conflict",
        )}
          />

          <PreferenceCapabilityEditorSection
            title="Tarih formati"
            description="Tarih gosterimi bolgesel ayarlar icinde ayri capability olarak korunur."
        statusPills={[
          {
            label: dateFormatPreferenceState ? "Snapshot ready" : "Snapshot gated",
            tone: dateFormatPreferenceState ? "ready" : "pending",
          },
          {
            label: `Queued ${dateFormatLane.total}`,
            tone: buildStatusTone(dateFormatLane.total),
          },
          {
            label: `Conflicts ${dateFormatLane.conflictCount}`,
            tone: buildStatusTone(dateFormatLane.conflictCount),
          },
        ]}
        detailLines={[
          `Resource: ${dateFormatPreferenceState?.resourceKey ?? profileResourceKey}`,
          `Date format: ${dateFormatPreferenceState?.dateFormat ?? "n/a"} / Version: ${dateFormatPreferenceState ? dateFormatPreferenceState.version : "n/a"}`,
          `Policy: ${dateFormatLane.retryPolicyKey} / Audit: ${dateFormatLane.auditAction}`,
          `Success feed: ${dateFormatSuccessCapability.routeLabel} / Conflict feed: ${dateFormatConflictCapability.routeLabel}`,
        ]}
        error={dateFormatPreferenceError}
        actions={[
          {
            label: "Queue date format action",
            onPress: () => {
              const request = buildDateFormatQueueRequest();
              if (request) {
                enqueueDateFormatDemoAction(request);
              }
            },
            disabled: !dateFormatPreferenceState,
          },
          {
            label: "Queue date format retry",
            onPress: () => {
              const request = buildDateFormatQueueRequest();
              if (request) {
                enqueueDateFormatRetryDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !dateFormatPreferenceState,
          },
          {
            label: "Queue date format conflict",
            onPress: () => {
              const request = buildDateFormatQueueRequest(
                resolveNextDateFormat(dateFormatPreferenceState?.dateFormat),
                Math.max((dateFormatPreferenceState?.version ?? 0) - 1, 0),
              );
              if (request) {
                enqueueDateFormatConflictDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !dateFormatPreferenceState,
          },
          {
            label: isDateFormatPreferenceBusy ? "Refreshing..." : "Refresh state",
            onPress: () => {
              void refreshDateFormatPreferenceState();
            },
            variant: "secondary",
            disabled: isDateFormatPreferenceBusy || !session,
          },
        ]}
        failedPanel={buildFailedPanel(dateFormatLane, "Open date-format audit")}
        conflictPanel={buildConflictPanel(
          dateFormatLane,
          [
            `Expected version: ${dateFormatLane.latestConflict?.expectedVersion ?? "n/a"} / Server version: ${dateFormatLane.latestConflict?.serverVersion ?? "n/a"}`,
            `Server date format: ${dateFormatLane.latestConflict?.serverDateFormat ?? "n/a"} / Target date format: ${dateFormatLane.latestConflict?.targetDateFormat ?? "n/a"}`,
            `Error code: ${dateFormatLane.latestConflict?.errorCode ?? "n/a"} / Conflict reason: ${dateFormatLane.latestConflict?.conflictReason ?? "n/a"}`,
          ],
          "Open date-format conflict",
        )}
          />

          <PreferenceCapabilityEditorSection
            title="Saat formati"
            description="Saat gosterimi, locale ve timezone'dan bagimsiz ayarlanabilir bir bolgesel capability olarak devam eder."
        statusPills={[
          {
            label: timeFormatPreferenceState ? "Snapshot ready" : "Snapshot gated",
            tone: timeFormatPreferenceState ? "ready" : "pending",
          },
          {
            label: `Queued ${timeFormatLane.total}`,
            tone: buildStatusTone(timeFormatLane.total),
          },
          {
            label: `Conflicts ${timeFormatLane.conflictCount}`,
            tone: buildStatusTone(timeFormatLane.conflictCount),
          },
        ]}
        detailLines={[
          `Resource: ${timeFormatPreferenceState?.resourceKey ?? profileResourceKey}`,
          `Time format: ${timeFormatPreferenceState?.timeFormat ?? "n/a"} / Version: ${timeFormatPreferenceState ? timeFormatPreferenceState.version : "n/a"}`,
          `Policy: ${timeFormatLane.retryPolicyKey} / Audit: ${timeFormatLane.auditAction}`,
          `Success feed: ${timeFormatSuccessCapability.routeLabel} / Conflict feed: ${timeFormatConflictCapability.routeLabel}`,
        ]}
        error={timeFormatPreferenceError}
        actions={[
          {
            label: "Queue time format action",
            onPress: () => {
              const request = buildTimeFormatQueueRequest();
              if (request) {
                enqueueTimeFormatDemoAction(request);
              }
            },
            disabled: !timeFormatPreferenceState,
          },
          {
            label: "Queue time format retry",
            onPress: () => {
              const request = buildTimeFormatQueueRequest();
              if (request) {
                enqueueTimeFormatRetryDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !timeFormatPreferenceState,
          },
          {
            label: "Queue time format conflict",
            onPress: () => {
              const request = buildTimeFormatQueueRequest(
                resolveNextTimeFormat(timeFormatPreferenceState?.timeFormat),
                Math.max((timeFormatPreferenceState?.version ?? 0) - 1, 0),
              );
              if (request) {
                enqueueTimeFormatConflictDemoAction(request);
              }
            },
            variant: "secondary",
            disabled: !timeFormatPreferenceState,
          },
          {
            label: isTimeFormatPreferenceBusy ? "Refreshing..." : "Refresh state",
            onPress: () => {
              void refreshTimeFormatPreferenceState();
            },
            variant: "secondary",
            disabled: isTimeFormatPreferenceBusy || !session,
          },
        ]}
        failedPanel={buildFailedPanel(timeFormatLane, "Open time-format audit")}
        conflictPanel={buildConflictPanel(
          timeFormatLane,
          [
            `Expected version: ${timeFormatLane.latestConflict?.expectedVersion ?? "n/a"} / Server version: ${timeFormatLane.latestConflict?.serverVersion ?? "n/a"}`,
            `Server time format: ${timeFormatLane.latestConflict?.serverTimeFormat ?? "n/a"} / Target time format: ${timeFormatLane.latestConflict?.targetTimeFormat ?? "n/a"}`,
            `Error code: ${timeFormatLane.latestConflict?.errorCode ?? "n/a"} / Conflict reason: ${timeFormatLane.latestConflict?.conflictReason ?? "n/a"}`,
          ],
          "Open time-format conflict",
        )}
          />
        </>
      ) : null}

      {selectedCategory === "general" ? (
        <>
          <PreferenceCapabilityCard
            title="Replay controls"
            description="Shared queue controls stay available as the main remediation surface across all preference capabilities."
        actions={[
          {
            label: isReplaying ? "Replaying..." : "Replay ready writes",
            onPress: () => {
              void handleReplayQueue();
            },
            disabled: summary.queuedCount === 0 || isReplaying,
          },
          {
            label: "Force retry failed",
            onPress: () => {
              void handleRetryFailedActions();
            },
            variant: "secondary",
            disabled: summary.failedCount === 0 || isReplaying,
          },
          {
            label: "Clear queue",
            onPress: resetQueue,
            variant: "secondary",
            disabled: summary.queuedCount === 0,
          },
        ]}
      >
        {latestConflictAction ? (
          <PreferenceRemediationPanel
            title="Latest conflict across all capabilities"
            detailLines={[
              latestConflictAction.label,
              `${renderQueueTarget(latestConflictAction)} / ${latestConflictAction.conflictReason ?? "n/a"}`,
              `Audit id: ${latestConflictAction.auditId ?? "n/a"} / Error code: ${latestConflictAction.errorCode ?? "n/a"}`,
            ]}
          />
        ) : (
          <Text style={styles.metaText}>No conflict item is currently waiting for a manual decision.</Text>
        )}
          </PreferenceCapabilityCard>

          <PreferenceCapabilityCard
            title="Recent queue items"
            description="Quick operational view across all preference mutations."
          >
            {queuedActions.length === 0 ? (
              <Text style={styles.metaText}>Queue is empty.</Text>
            ) : (
              <View style={styles.sectionStack}>
                {queuedActions.slice(0, 8).map((action) => (
                  <PreferenceRemediationPanel
                    key={action.id}
                    title={action.label}
                    detailLines={[
                      `${action.kind} / ${action.status} / ${renderQueueTarget(action)} / attempt ${action.attemptCount}`,
                      `Queued at: ${formatIsoShort(action.queuedAt)}`,
                      `Audit id: ${action.auditId ?? "n/a"} / Error code: ${action.errorCode ?? "n/a"}`,
                    ]}
                  />
                ))}
              </View>
            )}
          </PreferenceCapabilityCard>
        </>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  categoryButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  fieldStack: {
    gap: spacing.xs,
  },
  inputLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  metaText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  sectionStack: {
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  textInputDisabled: {
    opacity: 0.55,
  },
});
