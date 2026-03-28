import { colors, spacing, typography } from "@platform-mobile/tokens";
import { ActionButton, InfoCard, ScreenScaffold, StatusPill } from "@platform-mobile/ui";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAuthSession } from "../app/providers/AuthSessionProvider";
import { useMobileReportPreferences } from "../features/reporting/useMobileReportPreferences";
import { useReportingDashboardSnapshot } from "../features/reporting/useReportingDashboardSnapshot";
import type { MobileReportId } from "../services/reporting/reporting.contract";

type ReportsScreenProps = {
  canOpenAuditRoute: boolean;
  onBack: () => void;
  onOpenAuditRoute: () => void;
  onOpenPreferencesRoute: () => void;
  onOpenReportDetail: (reportId: MobileReportId) => void;
};

export function ReportsScreen({
  canOpenAuditRoute,
  onBack,
  onOpenAuditRoute,
  onOpenPreferencesRoute,
  onOpenReportDetail,
}: ReportsScreenProps) {
  const { session } = useAuthSession();
  const reporting = useReportingDashboardSnapshot(session?.token, session?.companyId);
  const preferences = useMobileReportPreferences(session?.token);
  const reportCards = useMemo(() => {
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
        title="Rapor merkezi"
        description="Mobil raporlar tablo kopyasi degil; hizli KPI, filtreli drill-down ve audit gorunurlugu icin optimize edilir."
      >
        <View style={styles.actionRow}>
          <ActionButton label="Back to dashboard" onPress={onBack} variant="secondary" />
          <ActionButton label="Refresh catalog" onPress={() => void reporting.refresh()} />
          <ActionButton label="Open settings" onPress={onOpenPreferencesRoute} variant="secondary" />
          <ActionButton
            label="Open audit"
            onPress={onOpenAuditRoute}
            variant="secondary"
            disabled={!canOpenAuditRoute}
          />
        </View>
        {reporting.error ? <Text style={styles.errorText}>{reporting.error}</Text> : null}
        <Text style={styles.helperText}>
          Hazir katalog kullanici, erisim ve audit raporlarini mobilde okunabilir bloklara ayirir.
        </Text>
      </InfoCard>

      <InfoCard
        title="Hazir raporlar"
        description="Ilk fazda her rapor bir capability gibi ele aliniyor; yetki, ozet ve detay ayni zincirde takip ediliyor."
      >
        <View style={styles.reportList}>
          {reportCards.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportCopy}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDescription}>{report.description}</Text>
                </View>
                <View style={styles.pillRow}>
                  <StatusPill
                    label={report.status === "ready" ? "Hazir" : "Sinirli"}
                    tone={report.status === "ready" ? "ready" : "pending"}
                  />
                  {preferences.isFavorite(report.id) ? (
                    <StatusPill label="Favori" tone="ready" />
                  ) : null}
                </View>
              </View>
              <Text style={styles.metricText}>
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
        title="Mobil raporlama ilkeleri"
        description="Bu ilkeler, rapor ekraninin masaustu kopyasi yerine mobil karar yuzeyi olarak kalmasini saglar."
      >
        <Text style={styles.bulletText}>- Ilk ekranda KPI, trend ve son durum; agir tablo detaylari ikinci seviyede acilir.</Text>
        <Text style={styles.bulletText}>- Export ve buyuk veri setleri cihazda degil backend tarafinda olusturulur.</Text>
        <Text style={styles.bulletText}>- Yetki eksigi olan rapor bloklanir, ama kullanici nedenini detay ekraninda gorur.</Text>
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
  },
  helperText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  metricText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  reportCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  reportCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  reportDescription: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  reportHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  reportList: {
    gap: spacing.sm,
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
