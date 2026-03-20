import { getSharedReportExportMode } from "@platform/capabilities";
import { formatIsoShort } from "@platform-mobile/core";
import { colors, spacing, typography } from "@platform-mobile/tokens";
import { ActionButton, InfoCard, ScreenScaffold, StatusPill } from "@platform-mobile/ui";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useAuthSession } from "../app/providers/AuthSessionProvider";
import { useMobileReportPreferences } from "../features/reporting/useMobileReportPreferences";
import { useMobileReportDetail } from "../features/reporting/useMobileReportDetail";
import type { MobileReportFilterValues, MobileReportId } from "../services/reporting/reporting.contract";

type ReportDetailScreenProps = {
  canOpenAuditRoute: boolean;
  onBack: () => void;
  onOpenAuditRoute: () => void;
  reportId: MobileReportId;
};

export function ReportDetailScreen({
  canOpenAuditRoute,
  onBack,
  onOpenAuditRoute,
  reportId,
}: ReportDetailScreenProps) {
  const { session } = useAuthSession();
  const preferences = useMobileReportPreferences(session?.token);
  const savedPresets = useMemo(
    () => preferences.listSavedFilters(reportId, ["mobile", "web"]),
    [preferences, reportId],
  );
  const mobilePresets = useMemo(
    () => savedPresets.filter((preset) => preset.channel === "mobile"),
    [savedPresets],
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<MobileReportFilterValues>({});
  const [draftFilters, setDraftFilters] = useState<MobileReportFilterValues>({});
  const [presetNameDraft, setPresetNameDraft] = useState("");
  const [presetError, setPresetError] = useState<string | null>(null);
  const [presetBusy, setPresetBusy] = useState<"saving" | "deleting" | null>(null);
  const activePreset = savedPresets.find((preset) => preset.id === selectedPresetId) ?? null;
  const detail = useMobileReportDetail(session?.token, reportId, session?.companyId, appliedFilters);
  const reportTitle = detail.detail?.report.title ?? "Rapor detayi";
  const reportDescription = detail.detail?.report.description ?? "Secili raporun mobil detay gorunumu.";
  const report = detail.detail?.report ?? null;
  const mobileExportMode = getSharedReportExportMode(reportId, "mobile");
  const isFavorite = preferences.isFavorite(reportId);
  const hasSavedFilters = savedPresets.length > 0;
  const canManageMobilePresets = Boolean(report?.savedFilterChannels.includes("mobile"));
  const availableFilterDescriptors = useMemo(
    () =>
      (report?.filterParity ?? []).filter((filter) => filter.supportedChannels.includes("mobile")),
    [report],
  );
  const sanitizedDraftFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(draftFilters).flatMap(([key, value]) => {
          if (typeof value !== "string") {
            return [];
          }
          const trimmed = value.trim();
          return trimmed ? [[key, trimmed]] : [];
        }),
      ) as MobileReportFilterValues,
    [draftFilters],
  );
  const hasDraftFilters = Object.keys(sanitizedDraftFilters).length > 0;
  const activeFilterEntries = Object.entries(appliedFilters).filter(([, value]) =>
    typeof value === "string" && value.trim().length > 0,
  );
  const isUpdatingMobilePreset = activePreset?.channel === "mobile";

  const applyPreset = (presetId: string) => {
    const preset = savedPresets.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    const nextFilters = (preset.values ?? {}) as MobileReportFilterValues;
    setSelectedPresetId(preset.id);
    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPresetNameDraft(preset.channel === "mobile" ? preset.name : "");
    setPresetError(null);
  };

  const applyDraftFilters = () => {
    setSelectedPresetId(null);
    setAppliedFilters(sanitizedDraftFilters);
    setPresetError(null);
  };

  const clearAppliedFilters = () => {
    setSelectedPresetId(null);
    setDraftFilters({});
    setAppliedFilters({});
    setPresetNameDraft("");
    setPresetError(null);
  };

  const updateDraftFilter = (key: keyof MobileReportFilterValues, value: string) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSaveMobilePreset = async () => {
    if (!canManageMobilePresets || !hasDraftFilters) {
      return;
    }

    setPresetBusy("saving");
    setPresetError(null);
    try {
      const result = await preferences.savePreset(
        reportId,
        "mobile",
        sanitizedDraftFilters,
        presetNameDraft,
        isUpdatingMobilePreset ? activePreset.id : null,
      );
      setSelectedPresetId(result.preset.id);
      setAppliedFilters(result.preset.values as MobileReportFilterValues);
      setDraftFilters(result.preset.values as MobileReportFilterValues);
      setPresetNameDraft(result.preset.name);
    } catch (error) {
      setPresetError(error instanceof Error ? error.message : "Preset kaydedilemedi.");
    } finally {
      setPresetBusy(null);
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    const preset = savedPresets.find((item) => item.id === presetId);
    if (!preset || preset.channel !== "mobile") {
      return;
    }

    setPresetBusy("deleting");
    setPresetError(null);
    try {
      await preferences.removePreset(reportId, "mobile", presetId);
      if (selectedPresetId === presetId) {
        clearAppliedFilters();
      }
    } catch (error) {
      setPresetError(error instanceof Error ? error.message : "Preset silinemedi.");
    } finally {
      setPresetBusy(null);
    }
  };

  return (
    <ScreenScaffold>
      <InfoCard title={reportTitle} description={reportDescription}>
        <View style={styles.actionRow}>
          <ActionButton label="Back to reports" onPress={onBack} variant="secondary" />
          <ActionButton label="Refresh detail" onPress={() => void detail.refresh()} />
          <ActionButton
            label={isFavorite ? "Remove favorite" : "Add favorite"}
            onPress={() => void preferences.toggleFavorite(reportId)}
            variant="secondary"
          />
          <ActionButton
            label="Open audit"
            onPress={onOpenAuditRoute}
            variant="secondary"
            disabled={!canOpenAuditRoute}
          />
        </View>
        {detail.detail?.capturedAt ? (
          <Text style={styles.helperText}>Son guncelleme {formatIsoShort(detail.detail.capturedAt)}</Text>
        ) : null}
        {detail.error ? <Text style={styles.errorText}>{detail.error}</Text> : null}
      </InfoCard>

      <InfoCard
        title="Rapor yonetimi"
        description="Ayni rapor kimligi web ve mobilde ortaktir; filtre, favori ve export davranisi kanal bazli acikca gorunur."
      >
        <View style={styles.pillRow}>
          <StatusPill label={isFavorite ? "Favori" : "Standart"} tone={isFavorite ? "ready" : "pending"} />
          <StatusPill
            label={
              report?.savedFilterChannels.includes("mobile")
                ? "Mobil kayitli filtre acik"
                : report?.savedFilterChannels.includes("web")
                  ? "Kayitli filtre webde"
                  : "Kayitli filtre kapali"
            }
            tone={report?.savedFilterChannels.includes("mobile") ? "ready" : "pending"}
          />
          <StatusPill
            label={mobileExportMode === "none" ? "Export mobilde kapali" : "Export hazir"}
            tone={mobileExportMode === "none" ? "pending" : "ready"}
          />
        </View>
        <Text style={styles.helperText}>
          {report?.savedFilterChannels.includes("mobile")
            ? "Kayitli filtre presetleri web ve mobilde ayni variant-service sozlesmesiyle tutulur."
            : report?.savedFilterChannels.includes("web")
              ? "Kayitli filtre presetleri su an web reporting yuzeyinde tutulur."
            : "Bu rapor icin kayitli filtre tanimi acik degil."}
        </Text>
        <Text style={styles.helperText}>
          {mobileExportMode === "none"
            ? "Export bu kanalda acik degil; gerekirse web raporlama veya backend export job akisi kullanilacak."
            : "Bu rapor mobil export akisina hazir."}
        </Text>
        <Text style={styles.helperText}>
          {hasSavedFilters
            ? "Mobil detay ekrani kayitli filtreleri okuyup uygular; mobil kanal aciksa yeni preset de kaydedebilir."
            : "Bu rapor icin henuz kayitli filtre preset'i yok."}
        </Text>
        {availableFilterDescriptors.length > 0 ? (
          <View style={styles.fieldStack}>
            <Text style={styles.rowTitle}>Filtre editoru</Text>
            <Text style={styles.helperText}>
              Bu alanlar mobil detail fetch hattina bire bir uygulanir. Kaydettiginiz mobil presetler ayni kullaniciya kalici yazilir.
            </Text>
            {availableFilterDescriptors.map((filter) => (
              <View key={filter.key} style={styles.fieldStack}>
                <Text style={styles.inputLabel}>{filter.label}</Text>
                <TextInput
                  value={typeof draftFilters[filter.key] === "string" ? draftFilters[filter.key] ?? "" : ""}
                  onChangeText={(value) => updateDraftFilter(filter.key, value)}
                  placeholder={
                    filter.key === "level"
                      ? "INFO / WARN / CRITICAL / ALL"
                      : filter.key === "status"
                        ? "ACTIVE / PASSIVE"
                        : `${filter.label} degeri`
                  }
                  style={styles.textInput}
                />
              </View>
            ))}
            {canManageMobilePresets ? (
              <View style={styles.fieldStack}>
                <Text style={styles.inputLabel}>Mobil preset adi</Text>
                <TextInput
                  value={presetNameDraft}
                  onChangeText={setPresetNameDraft}
                  placeholder={`Preset ${mobilePresets.length + 1}`}
                  style={styles.textInput}
                />
              </View>
            ) : null}
            <View style={styles.actionRow}>
              <ActionButton
                label="Apply filters"
                onPress={applyDraftFilters}
                disabled={!hasDraftFilters}
              />
              <ActionButton
                label="Clear filters"
                onPress={clearAppliedFilters}
                variant="secondary"
                disabled={!hasDraftFilters && activeFilterEntries.length === 0}
              />
              {canManageMobilePresets ? (
                <ActionButton
                  label={
                    presetBusy === "saving"
                      ? "Saving..."
                      : isUpdatingMobilePreset
                        ? "Update mobile preset"
                        : "Save mobile preset"
                  }
                  onPress={() => void handleSaveMobilePreset()}
                  variant="secondary"
                  disabled={presetBusy !== null || !hasDraftFilters}
                />
              ) : null}
              {activePreset?.channel === "mobile" ? (
                <ActionButton
                  label={presetBusy === "deleting" ? "Deleting..." : "Delete mobile preset"}
                  onPress={() => void handleDeletePreset(activePreset.id)}
                  variant="secondary"
                  disabled={presetBusy !== null}
                />
              ) : null}
            </View>
            {presetError ? <Text style={styles.errorText}>{presetError}</Text> : null}
          </View>
        ) : null}
        {hasSavedFilters ? (
          <View style={styles.rowList}>
            {savedPresets.map((preset) => {
              const isActive = preset.id === selectedPresetId;
              const filterSummary = Object.entries(preset.values)
                .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
                .map(([key, value]) => `${key}: ${String(value)}`);

              return (
                <View key={preset.id} style={styles.rowCard}>
                  <View style={styles.rowHeader}>
                    <View style={styles.rowCopy}>
                      <Text style={styles.rowTitle}>{preset.name}</Text>
                      <Text style={styles.rowSubtitle}>
                        {preset.channel === "web" ? "Web preset" : "Mobil preset"} / {formatIsoShort(preset.createdAt)}
                      </Text>
                    </View>
                    <StatusPill label={isActive ? "Uygulandi" : "Hazir"} tone={isActive ? "ready" : "pending"} />
                  </View>
                  {filterSummary.map((item) => (
                    <Text key={`${preset.id}-${item}`} style={styles.rowMeta}>
                      {item}
                    </Text>
                  ))}
                  {filterSummary.length === 0 ? (
                    <Text style={styles.rowMeta}>Filtre degeri bulunmuyor.</Text>
                  ) : null}
                  <View style={styles.actionRow}>
                    <ActionButton
                      label={isActive ? "Refresh with preset" : "Apply preset"}
                      onPress={() => applyPreset(preset.id)}
                    />
                    {isActive ? (
                      <ActionButton
                        label="Clear preset"
                        onPress={clearAppliedFilters}
                        variant="secondary"
                      />
                    ) : null}
                    {preset.channel === "mobile" ? (
                      <ActionButton
                        label="Delete preset"
                        onPress={() => void handleDeletePreset(preset.id)}
                        variant="secondary"
                        disabled={presetBusy !== null}
                      />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
        {activeFilterEntries.length > 0 ? (
          <View style={styles.rowList}>
            <View style={styles.rowCard}>
              <Text style={styles.rowTitle}>Aktif filtreler</Text>
              {activeFilterEntries.map(([key, value]) => (
                <Text key={key} style={styles.rowMeta}>
                  {key}: {String(value)}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
        <View style={styles.rowList}>
          {(report?.filterParity ?? []).map((filter) => (
            <View key={filter.key} style={styles.rowCard}>
              <Text style={styles.rowTitle}>{filter.label}</Text>
              <Text style={styles.rowMeta}>
                Desteklenen kanallar: {filter.supportedChannels.join(", ")}
              </Text>
            </View>
          ))}
          {(report?.filterParity ?? []).length === 0 ? (
            <Text style={styles.helperText}>Bu rapor icin filtre parity tanimi bulunmuyor.</Text>
          ) : null}
        </View>
      </InfoCard>

      <InfoCard
        title="Durum"
        description="Detay ekraninda once izin ve veri durumu okunur; sonrasinda metrik ve satir detayi gosterilir."
      >
        <View style={styles.pillRow}>
          <StatusPill
            label={
              detail.detail?.status === "ready"
                ? "Canli"
                : detail.detail?.status === "blocked"
                  ? "Yetki gerekli"
                  : "Hata"
            }
            tone={detail.detail?.status === "ready" ? "ready" : "pending"}
          />
        </View>
        {detail.detail?.reason ? <Text style={styles.errorText}>{detail.detail.reason}</Text> : null}
      </InfoCard>

      <InfoCard
        title="Ozet metrikler"
        description="Detay raporunda once karar aldiran sayilar, sonra satir bazli ozetler gorunur."
      >
        <View style={styles.metricGrid}>
          {(detail.detail?.metrics ?? []).map((metric) => (
            <View key={metric.label} style={styles.metricTile}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          ))}
          {detail.detail?.metrics.length === 0 ? (
            <Text style={styles.helperText}>Bu rapor icin metrik olusmadi.</Text>
          ) : null}
        </View>
      </InfoCard>

      <InfoCard
        title="Kayit listesi"
        description="Mobil detay listesi, tablo yerine satir ozeti ve kritik meta alanlarini one cikarir."
      >
        <View style={styles.rowList}>
          {(detail.detail?.rows ?? []).map((row) => (
            <View key={row.id} style={styles.rowCard}>
              <View style={styles.rowHeader}>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
                </View>
                {row.badge ? (
                  <StatusPill
                    label={row.badge}
                    tone={row.badge === "INFO" || row.badge === "Ozel" ? "ready" : "pending"}
                  />
                ) : null}
              </View>
              {row.meta.map((item) => (
                <Text key={`${row.id}-${item}`} style={styles.rowMeta}>
                  {item}
                </Text>
              ))}
            </View>
          ))}
          {detail.detail?.rows.length === 0 ? (
            <Text style={styles.helperText}>
              {detail.detail?.report.emptyMessage ?? "Detay satiri bulunamadi."}
            </Text>
          ) : null}
        </View>
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
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  helperText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  fieldStack: {
    gap: spacing.xs,
  },
  inputLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
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
  rowCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  rowCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  rowHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  rowList: {
    gap: spacing.sm,
  },
  rowMeta: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  rowSubtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  textInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "700",
  },
});
