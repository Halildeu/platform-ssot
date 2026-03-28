import { formatIsoShort, useOfflineQueue } from "@platform-mobile/core";
import { colors, spacing, typography } from "@platform-mobile/tokens";
import { ActionButton, InfoCard, ScreenScaffold, StatusPill } from "@platform-mobile/ui";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAuthSession } from "../app/providers/AuthSessionProvider";
import { useAuditSummaryMatrix } from "../features/audit/useAuditSummaryMatrix";
import { useMobileReportPreferences } from "../features/reporting/useMobileReportPreferences";
import { useReportingDashboardSnapshot } from "../features/reporting/useReportingDashboardSnapshot";
import type { MobileReportId } from "../services/reporting/reporting.contract";

type DashboardScreenProps = {
  canOpenAuditRoute: boolean;
  canOpenPreferencesRoute: boolean;
  onOpenAuditRoute: () => void;
  onOpenPreferencesRoute: () => void;
  onOpenReportDetail: (reportId: MobileReportId) => void;
  onOpenReportsRoute: () => void;
};

export function DashboardScreen({
  canOpenAuditRoute,
  canOpenPreferencesRoute,
  onOpenAuditRoute,
  onOpenPreferencesRoute,
  onOpenReportDetail,
  onOpenReportsRoute,
}: DashboardScreenProps) {
  const { error, refreshAuthorization, session, signOut, status, summary } = useAuthSession();
  const { summary: queueSummary } = useOfflineQueue();
  const auditSummary = useAuditSummaryMatrix(status, session);
  const reporting = useReportingDashboardSnapshot(session?.token, session?.companyId);
  const preferences = useMobileReportPreferences(session?.token);

  const dashboardMetrics = useMemo(() => {
    const cards = reporting.snapshot?.reportCards ?? [];
    const usersTotal = cards.find((item) => item.id === "users-overview")?.total ?? 0;
    const rolesTotal = cards.find((item) => item.id === "roles-access")?.total ?? 0;
    const auditTotal = cards.find((item) => item.id === "audit-activity")?.total ?? 0;
    const auditGroupTotal = auditSummary.groups.reduce((sum, group) => sum + group.total, 0);

    return [
      {
        label: "Kullanicilar",
        value: String(usersTotal),
        note: "Canli kullanici hacmi",
      },
      {
        label: "Roller",
        value: String(rolesTotal),
        note: "Erisim matrisi",
      },
      {
        label: "Audit",
        value: String(auditTotal),
        note: auditGroupTotal > 0 ? `${auditGroupTotal} takip edilen olay` : "Audit akisi hazir",
      },
      {
        label: "Bekleyen is",
        value: String(queueSummary.queuedCount),
        note: queueSummary.conflictCount > 0 ? `${queueSummary.conflictCount} conflict` : "Queue temiz",
      },
    ];
  }, [auditSummary.groups, queueSummary.conflictCount, queueSummary.queuedCount, reporting.snapshot]);

  const watchItems = [
    queueSummary.conflictCount > 0
      ? `${queueSummary.conflictCount} bekleyen conflict, remediation route uzerinden cozulmeli.`
      : "Conflict bekleyen queue aksiyonu yok.",
    reporting.snapshot?.reportCards.some((item) => item.status !== "ready")
      ? "Bazi rapor kartlari yetki veya endpoint durumuna gore sinirli olabilir."
      : "Tum temel rapor kartlari mobilde okunabilir durumda.",
    auditSummary.status === "ready"
      ? `Audit ozet matrisi ${auditSummary.groups.length} capability grubunu izliyor.`
      : auditSummary.gateReason,
  ];

  const recentInsight = reporting.snapshot?.recentAuditEvents[0] ?? null;
  const recentUser = reporting.snapshot?.recentUsers[0] ?? null;
  const prioritizedReports = useMemo(() => {
    const cards = [...(reporting.snapshot?.reportCards ?? [])];
    cards.sort((left, right) => {
      const leftFavorite = preferences.isFavorite(left.id) ? 1 : 0;
      const rightFavorite = preferences.isFavorite(right.id) ? 1 : 0;
      if (leftFavorite !== rightFavorite) {
        return rightFavorite - leftFavorite;
      }
      return left.title.localeCompare(right.title, "tr");
    });
    return cards;
  }, [preferences, reporting.snapshot?.reportCards]);

  return (
    <ScreenScaffold>
      <InfoCard
        title="Mobil dashboard"
        description="Gunluk KPI, hizli rapor girisleri ve kritik operasyon sinyalleri bu ana ekranda toplanir."
      >
        <View style={styles.pillRow}>
          <StatusPill label={summary.statusLabel} tone={status === "authenticated" ? "ready" : "pending"} />
          <StatusPill
            label={queueSummary.queuedCount > 0 ? `${queueSummary.queuedCount} queue` : "Queue temiz"}
            tone={queueSummary.queuedCount > 0 ? "pending" : "ready"}
          />
          <StatusPill
            label={canOpenAuditRoute ? "Audit acik" : "Audit kilitli"}
            tone={canOpenAuditRoute ? "ready" : "pending"}
          />
        </View>
        <Text style={styles.helperText}>
          {session
            ? `${session.email} / ${session.role} - ${summary.effectivePermissionCount} etkili izin`
            : "Dashboard sadece aktif oturumla acilir."}
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.actionRow}>
          <ActionButton label="Open reports" onPress={onOpenReportsRoute} />
          <ActionButton
            label="Open settings"
            onPress={onOpenPreferencesRoute}
            variant="secondary"
            disabled={!canOpenPreferencesRoute}
          />
        </View>
        <View style={styles.actionRow}>
          <ActionButton
            label="Open audit"
            onPress={onOpenAuditRoute}
            variant="secondary"
            disabled={!canOpenAuditRoute}
          />
          <ActionButton label="Refresh authz" onPress={() => void refreshAuthorization()} variant="secondary" />
          <ActionButton label="Sign out" onPress={() => void signOut()} variant="secondary" />
        </View>
      </InfoCard>

      <InfoCard
        title="KPI ozet"
        description="Mobilde ilk gorunmesi gereken sinyaller buyuk tablo degil, karar aldiran ozet kartlardir."
      >
        <View style={styles.metricGrid}>
          {dashboardMetrics.map((metric) => (
            <View key={metric.label} style={styles.metricTile}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricNote}>{metric.note}</Text>
            </View>
          ))}
        </View>
      </InfoCard>

      <InfoCard
        title="Oncelikli raporlar"
        description="Dashboard kartlari, kullaniciyi mobilde en cok acilacak rapor detaylarina goturur."
      >
        {reporting.error ? <Text style={styles.errorText}>{reporting.error}</Text> : null}
        <View style={styles.reportList}>
          {prioritizedReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportCardHeader}>
                <View style={styles.reportCardCopy}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDescription}>{report.description}</Text>
                </View>
                <View style={styles.pillRow}>
                  <StatusPill
                    label={report.status === "ready" ? "Canli" : "Sinirli"}
                    tone={report.status === "ready" ? "ready" : "pending"}
                  />
                  {preferences.isFavorite(report.id) ? <StatusPill label="Favori" tone="ready" /> : null}
                </View>
              </View>
              <Text style={styles.reportMetric}>
                {report.metricLabel}: {report.total ?? "n/a"}
              </Text>
              <Text style={styles.reportNote}>{report.note}</Text>
              <View style={styles.actionRow}>
                <ActionButton label="Open detail" onPress={() => onOpenReportDetail(report.id)} />
                <ActionButton
                  label={preferences.isFavorite(report.id) ? "Remove favorite" : "Add favorite"}
                  onPress={() => void preferences.toggleFavorite(report.id)}
                  variant="secondary"
                />
              </View>
            </View>
          ))}
        </View>
      </InfoCard>

      <InfoCard
        title="Karar sinyalleri"
        description="Dashboard karti yalniz sayi gostermemeli; neye bakmaniz gerektigini de soylemeli."
      >
        {watchItems.map((item) => (
          <Text key={item} style={styles.bulletText}>
            - {item}
          </Text>
        ))}
        {recentInsight ? (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Son audit sinyali</Text>
            <Text style={styles.eventBody}>
              {recentInsight.action} / {recentInsight.service}
            </Text>
            <Text style={styles.eventMeta}>
              {recentInsight.userEmail} - {formatIsoShort(recentInsight.timestamp)}
            </Text>
          </View>
        ) : null}
        {recentUser ? (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Son kullanici hareketi</Text>
            <Text style={styles.eventBody}>
              {recentUser.name} / {recentUser.role}
            </Text>
            <Text style={styles.eventMeta}>
              {recentUser.lastLogin ? `Son giris ${formatIsoShort(recentUser.lastLogin)}` : "Son giris kaydi yok"}
            </Text>
          </View>
        ) : null}
      </InfoCard>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  bulletText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  eventBody: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  eventCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  eventMeta: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  eventTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  helperText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  metricNote: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  metricTile: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: "47%",
    gap: spacing.xs,
    minWidth: 150,
    padding: spacing.md,
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.hero,
    fontWeight: "800",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  reportCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  reportCardCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  reportCardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  reportDescription: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  reportList: {
    gap: spacing.sm,
  },
  reportMetric: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  reportNote: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  reportTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "700",
  },
});
