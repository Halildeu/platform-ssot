import {
  describeAllowedScopes,
  formatIsoShort,
  getDeviceProfile,
  getNotificationsStatus,
  hasSessionPermission,
  initialSessionState,
  isSessionExpired,
  useNetworkStatus,
  useOfflineQueue,
} from "@platform-mobile/core";
import { colors, spacing, typography } from "@platform-mobile/tokens";
import { ActionButton, InfoCard, ScreenScaffold, StatusPill } from "@platform-mobile/ui";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useAuthSession } from "../app/providers/AuthSessionProvider";
import { useAuditSummaryMatrix } from "../features/audit/useAuditSummaryMatrix";
import { HomeHero } from "../features/home/HomeHero";
import { copy } from "../i18n";
import { resolveGatewayBaseUrl } from "../services/api/httpClient";
import { fetchLocalePreferenceSnapshot } from "../services/locale/localePreferenceClient";
import type { LocalePreferenceSnapshot } from "../services/locale/localePreference.contract";
import { fetchNotificationPreferenceSnapshot } from "../services/notification-preferences/notificationPreferenceClient";
import type { NotificationPreferenceSnapshot } from "../services/notification-preferences/notificationPreference.contract";
import { fetchProfileSessionTimeoutSnapshot } from "../services/profile/profileClient";
import type { ProfileSessionTimeoutSnapshot } from "../services/profile/profile.contract";
import { fetchTimezonePreferenceSnapshot } from "../services/timezone/timezonePreferenceClient";
import type { TimezonePreferenceSnapshot } from "../services/timezone/timezonePreference.contract";

const deviceProfile = getDeviceProfile();
const notificationsStatus = getNotificationsStatus();
const gatewayBaseUrl = resolveGatewayBaseUrl();
const localeCycle = ["tr", "en", "de", "es"] as const;
const timezoneCycle = [
  "Europe/Istanbul",
  "Europe/Berlin",
  "Europe/London",
  "America/New_York",
] as const;

const nextSteps = [
  "Capability catalog icindeki retry ve audit sozlugunu backend API contract registry ile bire bir hizala.",
  "Locale ve diger kullanici tercihlerini ayni offline mutation contract altinda capability bazli route'lara ayir.",
  "Timezone dahil tum profil tercihlerini ortak route uzerinden yonetip replay remediation akislarini sadeleştir.",
];

type HomeScreenProps = {
  auditRouteReason: string;
  canOpenAuditRoute: boolean;
  canOpenPreferencesRoute: boolean;
  onOpenAuditRoute: () => void;
  onOpenPreferencesRoute: () => void;
  preferencesRouteReason: string;
};

export function HomeScreen({
  auditRouteReason,
  canOpenAuditRoute,
  canOpenPreferencesRoute,
  onOpenAuditRoute,
  onOpenPreferencesRoute,
  preferencesRouteReason,
}: HomeScreenProps) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin1234");
  const [companyId, setCompanyId] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);
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

  const networkStatus = useNetworkStatus();
  const {
    canReplayProtectedActions,
    error: authError,
    isBusy,
    refreshAuthorization,
    requiresReauthentication,
    session,
    sessionGate,
    signIn,
    signOut,
    status,
    summary: authSummary,
  } = useAuthSession();
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
    isReplaying,
    replayQueue,
    resolveConflict,
    resetQueue,
    retryFailedActions,
  } = useOfflineQueue();

  const sessionExpired = isSessionExpired(session);
  const notificationChannel = "email";
  const profileResourceKey = session
    ? `profile:${session.email.trim().toLowerCase()}`
    : "profile:admin@example.com";
  const notificationResourceKey = session
    ? `notification-preference:${session.email.trim().toLowerCase()}:${notificationChannel}`
    : `notification-preference:admin@example.com:${notificationChannel}`;
  const localeResourceKey = session
    ? `profile:${session.email.trim().toLowerCase()}`
    : "profile:admin@example.com";
  const timezoneResourceKey = session
    ? `profile:${session.email.trim().toLowerCase()}`
    : "profile:admin@example.com";
  const queueGuardActive = canReplayProtectedActions && Boolean(profileSyncState);
  const notificationQueueGuardActive =
    canReplayProtectedActions && Boolean(notificationPreferenceState);
  const localeQueueGuardActive = canReplayProtectedActions && Boolean(localePreferenceState);
  const timezoneQueueGuardActive = canReplayProtectedActions && Boolean(timezonePreferenceState);
  const offlineQueueReady =
    queueGuardActive ||
    notificationQueueGuardActive ||
    localeQueueGuardActive ||
    timezoneQueueGuardActive;
  const auditPermissionGranted = hasSessionPermission(session, "audit-read");
  const latestConflictAction = queuedActions.find((action) => action.status === "conflict");
  const auditSummary = useAuditSummaryMatrix(status, session);

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
        error instanceof Error && error.message.trim()
          ? error.message
          : "Locale snapshot could not be loaded.";
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

  useEffect(() => {
    if (!session?.token) {
      setProfileSyncState(null);
      setProfileSyncError(null);
      setIsProfileSyncBusy(false);
      setNotificationPreferenceState(null);
      setNotificationPreferenceError(null);
      setIsNotificationPreferenceBusy(false);
      setLocalePreferenceState(null);
      setLocalePreferenceError(null);
      setIsLocalePreferenceBusy(false);
      setTimezonePreferenceState(null);
      setTimezonePreferenceError(null);
      setIsTimezonePreferenceBusy(false);
      return;
    }

    void refreshProfileSyncState();
    void refreshNotificationPreferenceState();
    void refreshLocalePreferenceState();
    void refreshTimezonePreferenceState();
  }, [session?.email, session?.token]);

  const handleSignIn = async () => {
    setFormError(null);

    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();
    const normalizedCompanyId = companyId.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setFormError("Email and password are required.");
      return;
    }

    const parsedCompanyId =
      normalizedCompanyId.length === 0 ? null : Number.parseInt(normalizedCompanyId, 10);

    if (normalizedCompanyId.length > 0 && !Number.isFinite(parsedCompanyId)) {
      setFormError("Company id must be numeric.");
      return;
    }

    await signIn({
      email: normalizedEmail,
      password: normalizedPassword,
      companyId: parsedCompanyId,
    });
  };

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
      resourceKey: localePreferenceState.resourceKey || localeResourceKey,
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
      resourceKey: timezonePreferenceState.resourceKey || timezoneResourceKey,
      expectedVersion,
      targetTimezone,
    };
  };

  const handleQueueDemoAction = () => {
    const request = buildQueueRequest(1);
    if (!queueGuardActive || !request) {
      return;
    }

    enqueueDemoAction(request);
  };

  const handleQueueRetryDemoAction = () => {
    const request = buildQueueRequest(2);
    if (!queueGuardActive || !request) {
      return;
    }

    enqueueRetryDemoAction(request);
  };

  const handleQueueConflictDemoAction = () => {
    if (!queueGuardActive || !profileSyncState) {
      return;
    }

    enqueueConflictDemoAction(
      buildQueueRequest(3, Math.max(profileSyncState.version - 1, 0)) ?? undefined,
    );
  };

  const handleReplayQueue = async () => {
    await replayQueue();
    await refreshProfileSyncState();
    await refreshNotificationPreferenceState();
    await refreshLocalePreferenceState();
    await refreshTimezonePreferenceState();
  };

  const handleRetryFailedActions = async () => {
    await retryFailedActions();
    await refreshProfileSyncState();
    await refreshNotificationPreferenceState();
    await refreshLocalePreferenceState();
    await refreshTimezonePreferenceState();
  };

  const handleResolveConflict = async (resolution: "client-wins" | "server-wins" | "discard") => {
    if (!latestConflictAction) {
      return;
    }

    await resolveConflict(latestConflictAction.id, resolution);
    await refreshProfileSyncState();
    await refreshNotificationPreferenceState();
    await refreshLocalePreferenceState();
    await refreshTimezonePreferenceState();
  };

  const handleNotificationDemoAction = () => {
    if (!notificationQueueGuardActive || !notificationPreferenceState) {
      return;
    }

    enqueueNotificationDemoAction(
      buildNotificationQueueRequest(!notificationPreferenceState.enabled) ?? undefined,
    );
  };

  const handleNotificationRetryDemoAction = () => {
    if (!notificationQueueGuardActive || !notificationPreferenceState) {
      return;
    }

    enqueueNotificationRetryDemoAction(
      buildNotificationQueueRequest(!notificationPreferenceState.enabled) ?? undefined,
    );
  };

  const handleNotificationConflictDemoAction = () => {
    if (!notificationQueueGuardActive || !notificationPreferenceState) {
      return;
    }

    enqueueNotificationConflictDemoAction(
      buildNotificationQueueRequest(
        !notificationPreferenceState.enabled,
        Math.max(notificationPreferenceState.version - 1, 0),
      ) ?? undefined,
    );
  };

  const handleLocaleDemoAction = () => {
    if (!localeQueueGuardActive || !localePreferenceState) {
      return;
    }

    enqueueLocaleDemoAction(buildLocaleQueueRequest() ?? undefined);
  };

  const handleLocaleRetryDemoAction = () => {
    if (!localeQueueGuardActive || !localePreferenceState) {
      return;
    }

    enqueueLocaleRetryDemoAction(buildLocaleQueueRequest() ?? undefined);
  };

  const handleLocaleConflictDemoAction = () => {
    if (!localeQueueGuardActive || !localePreferenceState) {
      return;
    }

    enqueueLocaleConflictDemoAction(
      buildLocaleQueueRequest(
        resolveNextLocale(localePreferenceState.locale),
        Math.max(localePreferenceState.version - 1, 0),
      ) ?? undefined,
    );
  };

  const handleTimezoneDemoAction = () => {
    if (!timezoneQueueGuardActive || !timezonePreferenceState) {
      return;
    }

    enqueueTimezoneDemoAction(buildTimezoneQueueRequest() ?? undefined);
  };

  const handleTimezoneRetryDemoAction = () => {
    if (!timezoneQueueGuardActive || !timezonePreferenceState) {
      return;
    }

    enqueueTimezoneRetryDemoAction(buildTimezoneQueueRequest() ?? undefined);
  };

  const handleTimezoneConflictDemoAction = () => {
    if (!timezoneQueueGuardActive || !timezonePreferenceState) {
      return;
    }

    enqueueTimezoneConflictDemoAction(
      buildTimezoneQueueRequest(
        resolveNextTimezone(timezonePreferenceState.timezone),
        Math.max(timezonePreferenceState.version - 1, 0),
      ) ?? undefined,
    );
  };

  return (
    <ScreenScaffold>
      <HomeHero title={copy.appName} subtitle={copy.heroSubtitle} />

      <InfoCard title="Bootstrap" description={copy.bootstrapDescription}>
        <StatusPill label="Expo SDK 55" tone="ready" />
        <StatusPill label="App shell aligned with mobile/ layout" tone="ready" />
        <StatusPill label="Boot timestamp captured in core state" tone="ready" />
        <Text style={styles.metaText}>Booted: {formatIsoShort(initialSessionState.lastBootAt)}</Text>
      </InfoCard>

      <InfoCard
        title="Auth session"
        description="Mobile now consumes the same v1 auth and authz endpoints as the platform backend."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={`Status: ${authSummary.statusLabel}`}
            tone={status === "authenticated" ? "ready" : "pending"}
          />
          <StatusPill
            label={
              offlineQueueReady
                ? "Queue guard ready"
                : canReplayProtectedActions
                  ? "Queue guard syncing"
                  : "Queue guard locked"
            }
            tone={offlineQueueReady ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>Gateway: {gatewayBaseUrl}</Text>
        <Text style={styles.metaText}>Session gate: {sessionGate.reason}</Text>
        <Text style={styles.metaText}>
          Raw permissions: {authSummary.permissionCount} / Effective permissions:{" "}
          {authSummary.effectivePermissionCount}
        </Text>
        <Text style={styles.metaText}>Allowed scopes: {authSummary.allowedScopeCount}</Text>
        <Text style={styles.metaText}>Scope preview: {describeAllowedScopes(session)}</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="admin@example.com"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={email}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Company id</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={setCompanyId}
            placeholder="1"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={companyId}
          />
        </View>
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={isBusy}
            label={isBusy ? "Working..." : "Sign in"}
            onPress={() => {
              void handleSignIn();
            }}
          />
          <ActionButton
            disabled={isBusy || !session}
            label="Refresh authz"
            onPress={() => {
              void refreshAuthorization();
            }}
            variant="secondary"
          />
          <ActionButton
            disabled={isBusy || !session}
            label="Sign out"
            onPress={() => {
              void signOut();
            }}
            variant="secondary"
          />
        </View>
        {formError || authError ? <Text style={styles.errorText}>{formError ?? authError}</Text> : null}
        {session ? (
          <View style={styles.sessionBlock}>
            <Text style={styles.queueLabel}>{session.email}</Text>
            <Text style={styles.metaText}>Role: {session.role}</Text>
            <Text style={styles.metaText}>
              Token expiry: {formatIsoShort(new Date(session.expiresAt).toISOString())}
            </Text>
            <Text style={styles.metaText}>Synced at: {formatIsoShort(session.lastSyncedAt)}</Text>
            {requiresReauthentication ? (
              <Text style={styles.errorText}>
                Session requires reauthentication before protected reads or writes continue.
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.metaText}>No session has been established yet.</Text>
        )}
      </InfoCard>

      <InfoCard
        title="Security audit route"
        description="The protected audit route now shows auth session events plus user-service replay success and conflict feeds for all promoted profile preference mutations."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={auditPermissionGranted ? "audit-read granted" : "audit-read missing"}
            tone={auditPermissionGranted ? "ready" : "pending"}
          />
          <StatusPill
            label={canOpenAuditRoute ? "Route ready" : "Route gated"}
            tone={canOpenAuditRoute ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>Gate reason: {auditRouteReason}</Text>
        <Text style={styles.metaText}>
          Route target: auth-service session feed + user-service replay success/conflict feeds across all six offline capabilities
        </Text>
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!canOpenAuditRoute}
            label="Open audit route"
            onPress={onOpenAuditRoute}
          />
          <ActionButton
            disabled={isBusy || !session}
            label="Refresh authz"
            onPress={() => {
              void refreshAuthorization();
            }}
            variant="secondary"
          />
        </View>
        <Text style={styles.metaText}>
          {canOpenAuditRoute
            ? "Protected route is ready. Open it to inspect the central audit feed."
            : "Sign in and refresh authorization before opening the dedicated audit route."}
        </Text>
      </InfoCard>

      <InfoCard
        title="Settings route"
        description="Mobil ayarlar artik profil, bolgesel, bildirim, guvenlik ve genel bolumler halinde yonetiliyor."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={canOpenPreferencesRoute ? "Route ready" : "Route gated"}
            tone={canOpenPreferencesRoute ? "ready" : "pending"}
          />
          <StatusPill
            label={`Queued actions: ${summary.queuedCount}`}
            tone={summary.queuedCount > 0 ? "pending" : "ready"}
          />
        </View>
        <Text style={styles.metaText}>Route gate: {preferencesRouteReason}</Text>
        <Text style={styles.metaText}>
          Route focus: personal info, language, notifications, session security and general app settings on the same controlled surface.
        </Text>
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!canOpenPreferencesRoute}
            label="Open settings editor"
            onPress={onOpenPreferencesRoute}
          />
          <ActionButton
            disabled={!canOpenAuditRoute}
            label="Open audit route"
            onPress={onOpenAuditRoute}
            variant="secondary"
          />
        </View>
      </InfoCard>

      <InfoCard
        title="Audit summary"
        description="Shared capability catalog cards surface visible session and replay activity before opening the dedicated audit route."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={auditSummary.canReadAudit ? "audit-read granted" : "audit-read missing"}
            tone={auditSummary.canReadAudit ? "ready" : "pending"}
          />
          <StatusPill
            label={
              auditSummary.status === "ready"
                ? "Summary ready"
                : auditSummary.status === "loading"
                  ? "Summary syncing"
                  : "Summary gated"
            }
            tone={auditSummary.status === "ready" ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>Summary gate: {auditSummary.gateReason}</Text>
        <Text style={styles.metaText}>
          Last fetch: {auditSummary.lastFetchedAt ? formatIsoShort(auditSummary.lastFetchedAt) : "n/a"}
        </Text>
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!auditSummary.canReadAudit || auditSummary.status === "loading"}
            label={auditSummary.status === "loading" ? "Refreshing..." : "Refresh audit summary"}
            onPress={() => {
              void auditSummary.refresh();
            }}
          />
          <ActionButton
            disabled={!canOpenAuditRoute}
            label="Open audit route"
            onPress={onOpenAuditRoute}
            variant="secondary"
          />
        </View>
        {auditSummary.error ? <Text style={styles.errorText}>{auditSummary.error}</Text> : null}
        {auditSummary.groups.map((group) => (
          <View key={group.groupId} style={styles.summaryRow}>
            <Text style={styles.queueLabel}>{group.title}</Text>
            <Text style={styles.metaText}>{group.description}</Text>
            <Text style={styles.metaText}>Visible events: {group.total}</Text>
            <Text style={styles.metaText}>
              Latest event: {group.latestEventTimestamp ? formatIsoShort(group.latestEventTimestamp) : "n/a"}
            </Text>
            <View style={styles.summaryMetricRow}>
              {group.metrics.map((metric) => (
                <StatusPill
                  key={`${group.groupId}-${metric.capabilityId}`}
                  label={`${metric.label}: ${metric.total}`}
                  tone={metric.total > 0 ? "ready" : "pending"}
                />
              ))}
            </View>
          </View>
        ))}
      </InfoCard>

      <InfoCard
        title="Network"
        description={`Status: ${networkStatus.isOnline ? "online" : "offline"}`}
      >
        <Text style={styles.metaText}>Source: {networkStatus.source}</Text>
        <Text style={styles.metaText}>Last check: {formatIsoShort(networkStatus.lastCheckedAt)}</Text>
      </InfoCard>

      <InfoCard title="Offline queue" description={copy.queueDescription}>
        <StatusPill
          label={queueGuardActive ? "Protected writes enabled" : "Protected writes blocked"}
          tone={queueGuardActive ? "ready" : "pending"}
        />
        <StatusPill label="Local persistence active" tone="ready" />
        <StatusPill
          label={`Retry ready: ${summary.retryReadyCount}`}
          tone={summary.retryReadyCount > 0 ? "pending" : "ready"}
        />
        <StatusPill
          label={`Conflicts: ${summary.conflictCount}`}
          tone={summary.conflictCount > 0 ? "pending" : "ready"}
        />
        <Text style={styles.emphasis}>Queued actions: {summary.queuedCount}</Text>
        <Text style={styles.metaText}>Profile resource: {profileSyncState?.resourceKey ?? profileResourceKey}</Text>
        <Text style={styles.metaText}>
          Backend timeout:{" "}
          {profileSyncState ? `${profileSyncState.sessionTimeoutMinutes} min` : "n/a"} / Version:{" "}
          {profileSyncState ? profileSyncState.version : "n/a"}
        </Text>
        <Text style={styles.metaText}>
          Active offline policies:{" "}
          {mutationPolicies.map((policy) => `${policy.title} (${policy.retryPolicyKey})`).join(", ")}
        </Text>
        <Text style={styles.metaText}>
          Last replay audit id: {summary.lastMutationAuditId ?? "n/a"}
        </Text>
        {profileSyncError ? <Text style={styles.errorText}>{profileSyncError}</Text> : null}
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!queueGuardActive}
            label="Queue protected action"
            onPress={handleQueueDemoAction}
          />
          <ActionButton
            disabled={!queueGuardActive}
            label="Queue retry demo"
            onPress={handleQueueRetryDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={!queueGuardActive}
            label="Queue conflict demo"
            onPress={handleQueueConflictDemoAction}
            variant="secondary"
          />
        </View>
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!offlineQueueReady || summary.queuedCount === 0 || isReplaying}
            label={isReplaying ? "Replaying..." : "Replay ready writes"}
            onPress={() => {
              void handleReplayQueue();
            }}
          />
          <ActionButton
            disabled={!offlineQueueReady || summary.failedCount === 0 || isReplaying}
            label="Force retry failed"
            onPress={() => {
              void handleRetryFailedActions();
            }}
            variant="secondary"
          />
          <ActionButton
            disabled={isProfileSyncBusy || !session}
            label={isProfileSyncBusy ? "Refreshing..." : "Refresh backend state"}
            onPress={() => {
              void refreshProfileSyncState();
            }}
            variant="secondary"
          />
          <ActionButton label="Clear queue" onPress={resetQueue} variant="secondary" />
        </View>
        <Text style={styles.metaText}>
          {offlineQueueReady
            ? "Queued writes now call real user-service mutations and drain against backend version state."
            : "Sign in and wait for at least one protected resource snapshot before queueing writes."}
        </Text>
        <Text style={styles.metaText}>
          Replay outcome: {summary.lastReplayOutcome ?? "No replay run yet."}
        </Text>
        <Text style={styles.metaText}>
          Last replay: {summary.lastReplayAt ? formatIsoShort(summary.lastReplayAt) : "n/a"}
        </Text>
        <Text style={styles.metaText}>
          Failed items: {summary.failedCount} / Conflict items: {summary.conflictCount}
        </Text>
        {latestConflictAction ? (
          <View style={styles.conflictPanel}>
            <Text style={styles.queueLabel}>Conflict resolution required</Text>
            <Text style={styles.metaText}>{latestConflictAction.label}</Text>
            <Text style={styles.metaText}>
              Expected version: {latestConflictAction.expectedVersion} / Server version:{" "}
              {latestConflictAction.serverVersion ?? "n/a"}
            </Text>
            {latestConflictAction.kind === "notification.preference.sync" ? (
              <Text style={styles.metaText}>
                Server preference:{" "}
                {typeof latestConflictAction.serverPreferenceEnabled === "boolean"
                  ? String(latestConflictAction.serverPreferenceEnabled)
                  : "n/a"}{" "}
                / Frequency:{" "}
                {latestConflictAction.serverPreferenceFrequency ?? "n/a"} / Channel:{" "}
                {latestConflictAction.preferenceChannel ?? "n/a"}
              </Text>
            ) : latestConflictAction.kind === "profile.locale.sync" ? (
              <Text style={styles.metaText}>
                Server locale: {latestConflictAction.serverLocale ?? "n/a"} / Target locale:{" "}
                {latestConflictAction.targetLocale ?? "n/a"}
              </Text>
            ) : latestConflictAction.kind === "profile.timezone.sync" ? (
              <Text style={styles.metaText}>
                Server timezone: {latestConflictAction.serverTimezone ?? "n/a"} / Target timezone:{" "}
                {latestConflictAction.targetTimezone ?? "n/a"}
              </Text>
            ) : latestConflictAction.kind === "profile.date-format.sync" ? (
              <Text style={styles.metaText}>
                Server date format: {latestConflictAction.serverDateFormat ?? "n/a"} / Target date format:{" "}
                {latestConflictAction.targetDateFormat ?? "n/a"}
              </Text>
            ) : latestConflictAction.kind === "profile.time-format.sync" ? (
              <Text style={styles.metaText}>
                Server time format: {latestConflictAction.serverTimeFormat ?? "n/a"} / Target time format:{" "}
                {latestConflictAction.targetTimeFormat ?? "n/a"}
              </Text>
            ) : (
              <Text style={styles.metaText}>
                Server timeout: {latestConflictAction.serverSessionTimeoutMinutes ?? "n/a"} min
              </Text>
            )}
            <Text style={styles.metaText}>
              Conflict reason: {latestConflictAction.conflictReason ?? "n/a"} / Error code:{" "}
              {latestConflictAction.errorCode ?? "n/a"}
            </Text>
            <Text style={styles.metaText}>
              {latestConflictAction.lastError ?? "Replay the queue after resolving this conflict."}
            </Text>
            <View style={styles.buttonRow}>
              <ActionButton
                label="Client wins"
                onPress={() => {
                  void handleResolveConflict("client-wins");
                }}
                variant="secondary"
              />
              <ActionButton
                label="Server wins"
                onPress={() => {
                  void handleResolveConflict("server-wins");
                }}
                variant="secondary"
              />
              <ActionButton
                label="Discard conflict"
                onPress={() => {
                  void handleResolveConflict("discard");
                }}
                variant="secondary"
              />
            </View>
          </View>
        ) : null}
        {queuedActions.length === 0 ? (
          <Text style={styles.metaText}>No queued actions yet.</Text>
        ) : (
          queuedActions.slice(0, 3).map((action) => (
            <View key={action.id} style={styles.queueRow}>
              <Text style={styles.queueLabel}>{action.label}</Text>
              <Text style={styles.queueMeta}>
                {action.kind === "notification.preference.sync"
                  ? `${action.status} - ${action.preferenceChannel ?? "channel"} -> ${
                      action.targetPreferenceEnabled ? "enabled" : "disabled"
                    } (${action.targetPreferenceFrequency ?? "n/a"})`
                  : action.kind === "profile.locale.sync"
                    ? `${action.status} - locale ${action.targetLocale ?? "n/a"}`
                    : action.kind === "profile.timezone.sync"
                      ? `${action.status} - timezone ${action.targetTimezone ?? "n/a"}`
                      : action.kind === "profile.date-format.sync"
                        ? `${action.status} - date format ${action.targetDateFormat ?? "n/a"}`
                        : action.kind === "profile.time-format.sync"
                          ? `${action.status} - time format ${action.targetTimeFormat ?? "n/a"}`
                        : `${action.status} - target ${action.targetSessionTimeoutMinutes} min`}{" "}
                - attempt {action.attemptCount} - {formatIsoShort(action.queuedAt)}
              </Text>
              <Text style={styles.metaText}>
                Policy: {action.retryPolicyKey} / Audit action: {action.auditAction}
              </Text>
              {action.lastError ? <Text style={styles.metaText}>{action.lastError}</Text> : null}
              {action.errorCode ? (
                <Text style={styles.metaText}>Error code: {action.errorCode}</Text>
              ) : null}
              {action.conflictReason ? (
                <Text style={styles.metaText}>Conflict reason: {action.conflictReason}</Text>
              ) : null}
              {action.auditId ? (
                <Text style={styles.metaText}>Audit id: {action.auditId}</Text>
              ) : null}
              {action.nextRetryAt ? (
                <Text style={styles.metaText}>Retry after: {formatIsoShort(action.nextRetryAt)}</Text>
              ) : null}
            </View>
          ))
        )}
      </InfoCard>

      <InfoCard
        title="Notification preference queue"
        description="Second real offline mutation capability: optimistic-lock protected notification preference replay."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={notificationQueueGuardActive ? "Preference replay ready" : "Preference replay locked"}
            tone={notificationQueueGuardActive ? "ready" : "pending"}
          />
          <StatusPill
            label={
              notificationPreferenceState?.enabled ? "Email notifications enabled" : "Email notifications disabled"
            }
            tone={notificationPreferenceState?.enabled ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>
          Resource: {notificationPreferenceState?.resourceKey ?? notificationResourceKey}
        </Text>
        <Text style={styles.metaText}>
          Channel: {notificationPreferenceState?.channel ?? notificationChannel} / Frequency:{" "}
          {notificationPreferenceState?.frequency ?? "n/a"}
        </Text>
        <Text style={styles.metaText}>
          Enabled: {notificationPreferenceState ? String(notificationPreferenceState.enabled) : "n/a"} / Version:{" "}
          {notificationPreferenceState ? notificationPreferenceState.version : "n/a"}
        </Text>
        {notificationPreferenceError ? (
          <Text style={styles.errorText}>{notificationPreferenceError}</Text>
        ) : null}
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!notificationQueueGuardActive}
            label="Queue preference action"
            onPress={handleNotificationDemoAction}
          />
          <ActionButton
            disabled={!notificationQueueGuardActive}
            label="Queue preference retry"
            onPress={handleNotificationRetryDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={!notificationQueueGuardActive}
            label="Queue preference conflict"
            onPress={handleNotificationConflictDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={isNotificationPreferenceBusy || !session}
            label={isNotificationPreferenceBusy ? "Refreshing..." : "Refresh preference state"}
            onPress={() => {
              void refreshNotificationPreferenceState();
            }}
            variant="secondary"
          />
        </View>
        <Text style={styles.metaText}>
          Replay uses the same shared queue, retry, conflict and audit pipeline as profile session-timeout sync.
        </Text>
      </InfoCard>

      <InfoCard
        title="Locale queue"
        description="Third real offline mutation capability: optimistic-lock protected locale replay on top of the same shared queue and audit contract."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={localeQueueGuardActive ? "Locale replay ready" : "Locale replay locked"}
            tone={localeQueueGuardActive ? "ready" : "pending"}
          />
          <StatusPill
            label={`Current locale: ${localePreferenceState?.locale ?? "n/a"}`}
            tone={localePreferenceState ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>
          Resource: {localePreferenceState?.resourceKey ?? localeResourceKey}
        </Text>
        <Text style={styles.metaText}>
          Locale: {localePreferenceState?.locale ?? "n/a"} / Version:{" "}
          {localePreferenceState ? localePreferenceState.version : "n/a"}
        </Text>
        <Text style={styles.metaText}>Supported locales: {localeCycle.join(", ")}</Text>
        {localePreferenceError ? <Text style={styles.errorText}>{localePreferenceError}</Text> : null}
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!localeQueueGuardActive}
            label="Queue locale action"
            onPress={handleLocaleDemoAction}
          />
          <ActionButton
            disabled={!localeQueueGuardActive}
            label="Queue locale retry"
            onPress={handleLocaleRetryDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={!localeQueueGuardActive}
            label="Queue locale conflict"
            onPress={handleLocaleConflictDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={isLocalePreferenceBusy || !session}
            label={isLocalePreferenceBusy ? "Refreshing..." : "Refresh locale state"}
            onPress={() => {
              void refreshLocalePreferenceState();
            }}
            variant="secondary"
          />
        </View>
        <Text style={styles.metaText}>
          Locale replay writes against the same profile resource version and emits its own success/conflict audit capability.
        </Text>
      </InfoCard>

      <InfoCard
        title="Timezone queue"
        description="Fourth real offline mutation capability: optimistic-lock protected timezone replay on the same shared queue, retry and audit contract."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={timezoneQueueGuardActive ? "Timezone replay ready" : "Timezone replay locked"}
            tone={timezoneQueueGuardActive ? "ready" : "pending"}
          />
          <StatusPill
            label={`Current timezone: ${timezonePreferenceState?.timezone ?? "n/a"}`}
            tone={timezonePreferenceState ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>
          Resource: {timezonePreferenceState?.resourceKey ?? timezoneResourceKey}
        </Text>
        <Text style={styles.metaText}>
          Timezone: {timezonePreferenceState?.timezone ?? "n/a"} / Version:{" "}
          {timezonePreferenceState ? timezonePreferenceState.version : "n/a"}
        </Text>
        <Text style={styles.metaText}>Demo timezones: {timezoneCycle.join(", ")}</Text>
        {timezonePreferenceError ? <Text style={styles.errorText}>{timezonePreferenceError}</Text> : null}
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={!timezoneQueueGuardActive}
            label="Queue timezone action"
            onPress={handleTimezoneDemoAction}
          />
          <ActionButton
            disabled={!timezoneQueueGuardActive}
            label="Queue timezone retry"
            onPress={handleTimezoneRetryDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={!timezoneQueueGuardActive}
            label="Queue timezone conflict"
            onPress={handleTimezoneConflictDemoAction}
            variant="secondary"
          />
          <ActionButton
            disabled={isTimezonePreferenceBusy || !session}
            label={isTimezonePreferenceBusy ? "Refreshing..." : "Refresh timezone state"}
            onPress={() => {
              void refreshTimezonePreferenceState();
            }}
            variant="secondary"
          />
        </View>
        <Text style={styles.metaText}>
          Timezone replay shares the same profile version fence but produces its own success/conflict audit capabilities.
        </Text>
      </InfoCard>

      <InfoCard title="Device services" description="Service placeholders are ready for native integrations.">
        <Text style={styles.metaText}>Platform: {deviceProfile.platform}</Text>
        <Text style={styles.metaText}>Version: {deviceProfile.version}</Text>
        <Text style={styles.metaText}>
          Notifications: {notificationsStatus.enabled ? "configured" : "not configured"}
        </Text>
      </InfoCard>

      <InfoCard title="Next steps" description={copy.nextStepsDescription}>
        {nextSteps.map((step) => (
          <Text key={step} style={styles.listItem}>
            - {step}
          </Text>
        ))}
      </InfoCard>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  conflictPanel: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    gap: spacing.xs,
    padding: spacing.md,
  },
  emphasis: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  listItem: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  metaText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  queueLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
  },
  queueMeta: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  queueRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  sessionBlock: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  summaryMetricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  summaryRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
