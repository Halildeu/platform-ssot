import { getAuditFeedCapability } from "@platform/capabilities";
import {
  formatIsoShort,
  hasSessionPermission,
  useNetworkStatus,
} from "@platform-mobile/core";
import { colors, spacing, typography } from "@platform-mobile/tokens";
import { ActionButton, InfoCard, ScreenScaffold, StatusPill } from "@platform-mobile/ui";
import { StyleSheet, Text, View } from "react-native";

import { useAuthSession } from "../app/providers/AuthSessionProvider";
import { useAuditPreview } from "../features/audit/useAuditPreview";
import type { AuditEventRecord } from "../services/audit/audit.contract";

type AuditScreenProps = {
  onBack: () => void;
};

const authSessionCapability = getAuditFeedCapability("auth.session.created");
const replaySuccessCapability = getAuditFeedCapability("user.session-timeout.synced");
const replayConflictCapability = getAuditFeedCapability("user.session-timeout.conflict");
const notificationReplaySuccessCapability = getAuditFeedCapability("user.notification-preference.synced");
const notificationReplayConflictCapability = getAuditFeedCapability("user.notification-preference.conflict");
const localeReplaySuccessCapability = getAuditFeedCapability("user.locale.synced");
const localeReplayConflictCapability = getAuditFeedCapability("user.locale.conflict");
const timezoneReplaySuccessCapability = getAuditFeedCapability("user.timezone.synced");
const timezoneReplayConflictCapability = getAuditFeedCapability("user.timezone.conflict");
const dateFormatReplaySuccessCapability = getAuditFeedCapability("user.date-format.synced");
const dateFormatReplayConflictCapability = getAuditFeedCapability("user.date-format.conflict");
const timeFormatReplaySuccessCapability = getAuditFeedCapability("user.time-format.synced");
const timeFormatReplayConflictCapability = getAuditFeedCapability("user.time-format.conflict");

type AuditFeedPanelProps = {
  canReadAudit: boolean;
  error: string | null;
  events: AuditEventRecord[];
  lastFetchedAt: string | null;
  onRefresh: () => void;
  status: "idle" | "loading" | "ready" | "blocked" | "error";
  targetLabel: string;
  total: number;
};

function renderAuditMetadata(event: AuditEventRecord) {
  const parts: string[] = [];
  const queueActionId = typeof event.metadata.queueActionId === "string" ? event.metadata.queueActionId : null;
  const attemptCount = typeof event.metadata.attemptCount === "number" ? event.metadata.attemptCount : null;
  const conflictReason =
    typeof event.metadata.conflictReason === "string" ? event.metadata.conflictReason : null;

  if (queueActionId) {
    parts.push(`Queue action: ${queueActionId}`);
  }

  if (attemptCount !== null) {
    parts.push(`Attempt: ${attemptCount}`);
  }

  if (conflictReason) {
    parts.push(`Conflict reason: ${conflictReason}`);
  }

  return parts;
}

function AuditFeedPanel({
  canReadAudit,
  error,
  events,
  lastFetchedAt,
  onRefresh,
  status,
  targetLabel,
  total,
}: AuditFeedPanelProps) {
  return (
    <InfoCard
      title={targetLabel}
      description="Each panel reads the same central audit feed with a dedicated, fail-closed filter preset."
    >
      <Text style={styles.metaText}>
        Last fetch: {lastFetchedAt ? formatIsoShort(lastFetchedAt) : "n/a"} / Total visible events: {total}
      </Text>
      <View style={styles.buttonRow}>
        <ActionButton
          disabled={status === "loading" || !canReadAudit}
          label={status === "loading" ? "Refreshing..." : "Refresh panel"}
          onPress={onRefresh}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {events.length === 0 ? (
        <Text style={styles.metaText}>
          {canReadAudit
            ? "No mirrored events were returned for this preset yet."
            : "Audit feed remains blocked until the route gate opens."}
        </Text>
      ) : (
        events.map((event) => {
          const metadataLines = renderAuditMetadata(event);

          return (
            <View key={event.id} style={styles.auditRow}>
              <Text style={styles.auditTitle}>
                {event.action} / {event.service}
              </Text>
              <Text style={styles.auditMeta}>
                {formatIsoShort(event.timestamp)} / {event.level}
              </Text>
              <Text style={styles.metaText}>{event.details}</Text>
              {metadataLines.map((line) => (
                <Text key={`${event.id}-${line}`} style={styles.metaText}>
                  {line}
                </Text>
              ))}
              <Text style={styles.metaText}>Correlation: {event.correlationId}</Text>
            </View>
          );
        })
      )}
    </InfoCard>
  );
}

export function AuditScreen({ onBack }: AuditScreenProps) {
  const networkStatus = useNetworkStatus();
  const {
    error: authError,
    isBusy,
    refreshAuthorization,
    session,
    signOut,
    status,
    summary,
  } = useAuthSession();
  const sessionAudit = useAuditPreview(status, session, {
    action: authSessionCapability.action,
    pageSize: 3,
    service: authSessionCapability.service,
  });
  const replayAudit = useAuditPreview(status, session, {
    action: replaySuccessCapability.action,
    pageSize: 3,
    service: replaySuccessCapability.service,
  });
  const replayConflictAudit = useAuditPreview(status, session, {
    action: replayConflictCapability.action,
    pageSize: 3,
    service: replayConflictCapability.service,
  });
  const notificationReplayAudit = useAuditPreview(status, session, {
    action: notificationReplaySuccessCapability.action,
    pageSize: 3,
    service: notificationReplaySuccessCapability.service,
  });
  const notificationReplayConflictAudit = useAuditPreview(status, session, {
    action: notificationReplayConflictCapability.action,
    pageSize: 3,
    service: notificationReplayConflictCapability.service,
  });
  const localeReplayAudit = useAuditPreview(status, session, {
    action: localeReplaySuccessCapability.action,
    pageSize: 3,
    service: localeReplaySuccessCapability.service,
  });
  const localeReplayConflictAudit = useAuditPreview(status, session, {
    action: localeReplayConflictCapability.action,
    pageSize: 3,
    service: localeReplayConflictCapability.service,
  });
  const timezoneReplayAudit = useAuditPreview(status, session, {
    action: timezoneReplaySuccessCapability.action,
    pageSize: 3,
    service: timezoneReplaySuccessCapability.service,
  });
  const timezoneReplayConflictAudit = useAuditPreview(status, session, {
    action: timezoneReplayConflictCapability.action,
    pageSize: 3,
    service: timezoneReplayConflictCapability.service,
  });
  const dateFormatReplayAudit = useAuditPreview(status, session, {
    action: dateFormatReplaySuccessCapability.action,
    pageSize: 3,
    service: dateFormatReplaySuccessCapability.service,
  });
  const dateFormatReplayConflictAudit = useAuditPreview(status, session, {
    action: dateFormatReplayConflictCapability.action,
    pageSize: 3,
    service: dateFormatReplayConflictCapability.service,
  });
  const timeFormatReplayAudit = useAuditPreview(status, session, {
    action: timeFormatReplaySuccessCapability.action,
    pageSize: 3,
    service: timeFormatReplaySuccessCapability.service,
  });
  const timeFormatReplayConflictAudit = useAuditPreview(status, session, {
    action: timeFormatReplayConflictCapability.action,
    pageSize: 3,
    service: timeFormatReplayConflictCapability.service,
  });

  const auditPermissionGranted = hasSessionPermission(session, "audit-read");
  const refreshAll = () => {
    void Promise.all([
      sessionAudit.refresh(),
      replayAudit.refresh(),
      replayConflictAudit.refresh(),
      notificationReplayAudit.refresh(),
      notificationReplayConflictAudit.refresh(),
      localeReplayAudit.refresh(),
      localeReplayConflictAudit.refresh(),
      timezoneReplayAudit.refresh(),
      timezoneReplayConflictAudit.refresh(),
      dateFormatReplayAudit.refresh(),
      dateFormatReplayConflictAudit.refresh(),
      timeFormatReplayAudit.refresh(),
      timeFormatReplayConflictAudit.refresh(),
    ]);
  };
  const anyAuditLoading =
    sessionAudit.status === "loading" ||
    replayAudit.status === "loading" ||
    replayConflictAudit.status === "loading" ||
    notificationReplayAudit.status === "loading" ||
    notificationReplayConflictAudit.status === "loading" ||
    localeReplayAudit.status === "loading" ||
    localeReplayConflictAudit.status === "loading" ||
    timezoneReplayAudit.status === "loading" ||
    timezoneReplayConflictAudit.status === "loading" ||
    dateFormatReplayAudit.status === "loading" ||
    dateFormatReplayConflictAudit.status === "loading" ||
    timeFormatReplayAudit.status === "loading" ||
    timeFormatReplayConflictAudit.status === "loading";
  const anyAuditReady =
    sessionAudit.status === "ready" ||
    replayAudit.status === "ready" ||
    replayConflictAudit.status === "ready" ||
    notificationReplayAudit.status === "ready" ||
    notificationReplayConflictAudit.status === "ready" ||
    localeReplayAudit.status === "ready" ||
    localeReplayConflictAudit.status === "ready" ||
    timezoneReplayAudit.status === "ready" ||
    timezoneReplayConflictAudit.status === "ready" ||
    dateFormatReplayAudit.status === "ready" ||
    dateFormatReplayConflictAudit.status === "ready" ||
    timeFormatReplayAudit.status === "ready" ||
    timeFormatReplayConflictAudit.status === "ready";

  return (
    <ScreenScaffold>
      <InfoCard
        title="Security audit route"
        description="Dedicated protected route for central audit visibility. This screen stays fail-closed unless the session and permission gate are both healthy, then exposes auth session and replay feeds together across session-timeout, notification preference, locale, timezone, date-format and time-format mutations."
      >
        <View style={styles.statusRow}>
          <StatusPill
            label={auditPermissionGranted ? "audit-read granted" : "audit-read missing"}
            tone={auditPermissionGranted ? "ready" : "pending"}
          />
          <StatusPill
            label={anyAuditReady ? "Feed ready" : anyAuditLoading ? "Feed syncing" : "Feed gated"}
            tone={anyAuditReady ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.metaText}>Route gate: {sessionAudit.gateReason}</Text>
        <Text style={styles.metaText}>
          Raw permissions: {summary.permissionCount} / Effective permissions: {summary.effectivePermissionCount}
        </Text>
        <Text style={styles.metaText}>Network: {networkStatus.isOnline ? "online" : "offline"}</Text>
        <View style={styles.buttonRow}>
          <ActionButton label="Back to home" onPress={onBack} variant="secondary" />
          <ActionButton
            disabled={isBusy || !session}
            label="Refresh authz"
            onPress={() => {
              void refreshAuthorization();
            }}
            variant="secondary"
          />
          <ActionButton
            disabled={anyAuditLoading || !sessionAudit.canReadAudit}
            label={anyAuditLoading ? "Refreshing..." : "Refresh all feeds"}
            onPress={refreshAll}
          />
          <ActionButton
            disabled={!session}
            label="Sign out"
            onPress={() => {
              void signOut();
            }}
            variant="secondary"
          />
        </View>
        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
      </InfoCard>

      <AuditFeedPanel
        canReadAudit={sessionAudit.canReadAudit}
        error={sessionAudit.error}
        events={sessionAudit.events}
        lastFetchedAt={sessionAudit.lastFetchedAt}
        onRefresh={() => {
          void sessionAudit.refresh();
        }}
        status={sessionAudit.status}
        targetLabel={authSessionCapability.routeLabel}
        total={sessionAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={replayAudit.canReadAudit}
        error={replayAudit.error}
        events={replayAudit.events}
        lastFetchedAt={replayAudit.lastFetchedAt}
        onRefresh={() => {
          void replayAudit.refresh();
        }}
        status={replayAudit.status}
        targetLabel={replaySuccessCapability.routeLabel}
        total={replayAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={replayConflictAudit.canReadAudit}
        error={replayConflictAudit.error}
        events={replayConflictAudit.events}
        lastFetchedAt={replayConflictAudit.lastFetchedAt}
        onRefresh={() => {
          void replayConflictAudit.refresh();
        }}
        status={replayConflictAudit.status}
        targetLabel={replayConflictCapability.routeLabel}
        total={replayConflictAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={notificationReplayAudit.canReadAudit}
        error={notificationReplayAudit.error}
        events={notificationReplayAudit.events}
        lastFetchedAt={notificationReplayAudit.lastFetchedAt}
        onRefresh={() => {
          void notificationReplayAudit.refresh();
        }}
        status={notificationReplayAudit.status}
        targetLabel={notificationReplaySuccessCapability.routeLabel}
        total={notificationReplayAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={notificationReplayConflictAudit.canReadAudit}
        error={notificationReplayConflictAudit.error}
        events={notificationReplayConflictAudit.events}
        lastFetchedAt={notificationReplayConflictAudit.lastFetchedAt}
        onRefresh={() => {
          void notificationReplayConflictAudit.refresh();
        }}
        status={notificationReplayConflictAudit.status}
        targetLabel={notificationReplayConflictCapability.routeLabel}
        total={notificationReplayConflictAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={localeReplayAudit.canReadAudit}
        error={localeReplayAudit.error}
        events={localeReplayAudit.events}
        lastFetchedAt={localeReplayAudit.lastFetchedAt}
        onRefresh={() => {
          void localeReplayAudit.refresh();
        }}
        status={localeReplayAudit.status}
        targetLabel={localeReplaySuccessCapability.routeLabel}
        total={localeReplayAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={localeReplayConflictAudit.canReadAudit}
        error={localeReplayConflictAudit.error}
        events={localeReplayConflictAudit.events}
        lastFetchedAt={localeReplayConflictAudit.lastFetchedAt}
        onRefresh={() => {
          void localeReplayConflictAudit.refresh();
        }}
        status={localeReplayConflictAudit.status}
        targetLabel={localeReplayConflictCapability.routeLabel}
        total={localeReplayConflictAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={timezoneReplayAudit.canReadAudit}
        error={timezoneReplayAudit.error}
        events={timezoneReplayAudit.events}
        lastFetchedAt={timezoneReplayAudit.lastFetchedAt}
        onRefresh={() => {
          void timezoneReplayAudit.refresh();
        }}
        status={timezoneReplayAudit.status}
        targetLabel={timezoneReplaySuccessCapability.routeLabel}
        total={timezoneReplayAudit.total}
      />

      <AuditFeedPanel
        canReadAudit={timezoneReplayConflictAudit.canReadAudit}
        error={timezoneReplayConflictAudit.error}
        events={timezoneReplayConflictAudit.events}
        lastFetchedAt={timezoneReplayConflictAudit.lastFetchedAt}
        onRefresh={() => {
          void timezoneReplayConflictAudit.refresh();
        }}
        status={timezoneReplayConflictAudit.status}
        targetLabel={timezoneReplayConflictCapability.routeLabel}
        total={timezoneReplayConflictAudit.total}
      />
      <AuditFeedPanel
        canReadAudit={dateFormatReplayAudit.canReadAudit}
        error={dateFormatReplayAudit.error}
        events={dateFormatReplayAudit.events}
        lastFetchedAt={dateFormatReplayAudit.lastFetchedAt}
        onRefresh={() => {
          void dateFormatReplayAudit.refresh();
        }}
        status={dateFormatReplayAudit.status}
        targetLabel={dateFormatReplaySuccessCapability.routeLabel}
        total={dateFormatReplayAudit.total}
      />
      <AuditFeedPanel
        canReadAudit={dateFormatReplayConflictAudit.canReadAudit}
        error={dateFormatReplayConflictAudit.error}
        events={dateFormatReplayConflictAudit.events}
        lastFetchedAt={dateFormatReplayConflictAudit.lastFetchedAt}
        onRefresh={() => {
          void dateFormatReplayConflictAudit.refresh();
        }}
        status={dateFormatReplayConflictAudit.status}
        targetLabel={dateFormatReplayConflictCapability.routeLabel}
        total={dateFormatReplayConflictAudit.total}
      />
      <AuditFeedPanel
        canReadAudit={timeFormatReplayAudit.canReadAudit}
        error={timeFormatReplayAudit.error}
        events={timeFormatReplayAudit.events}
        lastFetchedAt={timeFormatReplayAudit.lastFetchedAt}
        onRefresh={() => {
          void timeFormatReplayAudit.refresh();
        }}
        status={timeFormatReplayAudit.status}
        targetLabel={timeFormatReplaySuccessCapability.routeLabel}
        total={timeFormatReplayAudit.total}
      />
      <AuditFeedPanel
        canReadAudit={timeFormatReplayConflictAudit.canReadAudit}
        error={timeFormatReplayConflictAudit.error}
        events={timeFormatReplayConflictAudit.events}
        lastFetchedAt={timeFormatReplayConflictAudit.lastFetchedAt}
        onRefresh={() => {
          void timeFormatReplayConflictAudit.refresh();
        }}
        status={timeFormatReplayConflictAudit.status}
        targetLabel={timeFormatReplayConflictCapability.routeLabel}
        total={timeFormatReplayConflictAudit.total}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  auditMeta: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  auditRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    gap: spacing.xs,
    padding: spacing.md,
  },
  auditTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.body,
  },
  metaText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
