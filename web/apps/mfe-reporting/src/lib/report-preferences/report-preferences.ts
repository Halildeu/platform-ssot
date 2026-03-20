import type { GridVariant } from "@mfe/shared-types";
import {
  buildSharedReportFavoritesVariantState,
  buildSharedReportSavedFilterGridId,
  buildSharedReportSavedFilterVariantState,
  createEmptySharedReportPreferenceSnapshot,
  isSharedReportFavorite,
  isSharedReportId,
  listSharedReportSavedFilters,
  listSharedReports,
  readSharedReportFavoritesFromVariantState,
  readSharedReportSavedFilterValuesFromVariantState,
  removeSharedReportSavedFilter,
  saveSharedReportFilter,
  supportsSharedReportSavedFilters,
  toggleSharedReportFavorite,
  SHARED_REPORT_FAVORITES_GRID_ID,
  SHARED_REPORT_FAVORITES_VARIANT_NAME,
  type ReportChannel,
  type SharedReportId,
  type SharedReportPreferenceSnapshot,
  type SharedReportSavedFilter,
} from "@platform/capabilities";

import {
  createGridVariant,
  deleteGridVariant,
  fetchGridVariants,
  updateGridVariant,
} from "../grid-variants/variants.api";

const STORAGE_KEY = "mfe-reporting.report-preferences.v1";
const MAX_SAVED_FILTERS_PER_REPORT = 5;

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isReportChannel(value: unknown): value is ReportChannel {
  return value === "web" || value === "mobile";
}

function sanitizeSnapshot(
  value: Partial<SharedReportPreferenceSnapshot> | null | undefined,
): SharedReportPreferenceSnapshot {
  return {
    favorites: Array.isArray(value?.favorites)
      ? value.favorites.filter((item): item is SharedReportId => isSharedReportId(item))
      : [],
    savedFilters: Array.isArray(value?.savedFilters)
      ? value.savedFilters.filter(
          (item): item is SharedReportSavedFilter =>
            Boolean(
              item &&
                typeof item.id === "string" &&
                isSharedReportId(item.reportId) &&
                isReportChannel(item.channel) &&
                typeof item.name === "string" &&
                item.values &&
                typeof item.values === "object" &&
                typeof item.createdAt === "string",
            ),
        )
      : [],
  };
}

function isPersonalVariant(variant: GridVariant) {
  return !variant.isGlobal;
}

function compareSavedFiltersNewestFirst(
  left: SharedReportSavedFilter,
  right: SharedReportSavedFilter,
) {
  return Date.parse(right.createdAt) - Date.parse(left.createdAt);
}

function mergeChannelSavedFilters(
  current: SharedReportPreferenceSnapshot,
  channel: ReportChannel,
  nextFilters: SharedReportSavedFilter[],
): SharedReportPreferenceSnapshot {
  return {
    favorites: [...current.favorites],
    savedFilters: [
      ...current.savedFilters.filter((item) => item.channel !== channel),
      ...nextFilters,
    ],
  };
}

function mergeScopedSavedFilters(
  current: SharedReportPreferenceSnapshot,
  reportId: SharedReportId,
  channel: ReportChannel,
  scopedFilters: SharedReportSavedFilter[],
): SharedReportPreferenceSnapshot {
  return {
    favorites: [...current.favorites],
    savedFilters: [
      ...current.savedFilters.filter(
        (item) => item.reportId !== reportId || item.channel !== channel,
      ),
      ...scopedFilters,
    ],
  };
}

function findFavoriteVariant(variants: GridVariant[]) {
  return (
    variants.find(
      (variant) =>
        isPersonalVariant(variant) && variant.name === SHARED_REPORT_FAVORITES_VARIANT_NAME,
    ) ??
    variants.find((variant) => variant.name === SHARED_REPORT_FAVORITES_VARIANT_NAME) ??
    null
  );
}

function mapSavedFilterVariant(
  reportId: SharedReportId,
  channel: ReportChannel,
  variant: GridVariant,
): SharedReportSavedFilter {
  return {
    id: variant.id,
    reportId,
    channel,
    name: variant.name,
    values: readSharedReportSavedFilterValuesFromVariantState(variant.state),
    createdAt: variant.createdAt,
  };
}

async function readFavoriteReportsFromServer() {
  const variants = await fetchGridVariants(SHARED_REPORT_FAVORITES_GRID_ID);
  const favoriteVariant = findFavoriteVariant(variants);
  if (!favoriteVariant) {
    return [];
  }
  return readSharedReportFavoritesFromVariantState(favoriteVariant.state);
}

async function writeFavoriteReportsToServer(favorites: readonly SharedReportId[]) {
  const variants = await fetchGridVariants(SHARED_REPORT_FAVORITES_GRID_ID);
  const favoriteVariant = findFavoriteVariant(variants);

  if (favorites.length === 0) {
    if (favoriteVariant) {
      await deleteGridVariant(favoriteVariant.id);
    }
    return;
  }

  const state = buildSharedReportFavoritesVariantState(favorites);

  if (favoriteVariant) {
    await updateGridVariant({
      id: favoriteVariant.id,
      gridId: SHARED_REPORT_FAVORITES_GRID_ID,
      name: favoriteVariant.name,
      isDefault: false,
      isGlobal: false,
      isGlobalDefault: false,
      isUserDefault: false,
      isUserSelected: false,
      schemaVersion: favoriteVariant.schemaVersion,
      state,
    });
    return;
  }

  await createGridVariant({
    gridId: SHARED_REPORT_FAVORITES_GRID_ID,
    name: SHARED_REPORT_FAVORITES_VARIANT_NAME,
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    schemaVersion: 1,
    state,
  });
}

async function readAllSavedFiltersForReportFromServer(
  reportId: SharedReportId,
  channel: ReportChannel,
) {
  const gridId = buildSharedReportSavedFilterGridId(reportId, channel);
  const variants = await fetchGridVariants(gridId);
  return variants
    .filter(isPersonalVariant)
    .map((variant) => mapSavedFilterVariant(reportId, channel, variant))
    .sort(compareSavedFiltersNewestFirst);
}

async function readSavedFiltersForReportFromServer(
  reportId: SharedReportId,
  channel: ReportChannel,
) {
  const variants = await readAllSavedFiltersForReportFromServer(reportId, channel);
  return variants.slice(0, MAX_SAVED_FILTERS_PER_REPORT);
}

async function readSavedFiltersFromServer(channel: ReportChannel) {
  const reports = listSharedReports().filter((report) =>
    supportsSharedReportSavedFilters(report.id, channel),
  );

  const grouped = await Promise.all(
    reports.map((report) => readSavedFiltersForReportFromServer(report.id, channel)),
  );

  return grouped.flat();
}

export function readReportPreferences(): SharedReportPreferenceSnapshot {
  if (!hasWindow()) {
    return createEmptySharedReportPreferenceSnapshot();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptySharedReportPreferenceSnapshot();
    }

    const parsed = JSON.parse(raw) as Partial<SharedReportPreferenceSnapshot>;
    return sanitizeSnapshot(parsed);
  } catch {
    return createEmptySharedReportPreferenceSnapshot();
  }
}

export function writeReportPreferences(snapshot: SharedReportPreferenceSnapshot) {
  if (!hasWindow()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // localStorage hatalari UI'yi bloklamasin
  }
}

export async function syncReportPreferencesFromServer(channel: ReportChannel) {
  const cached = readReportPreferences();

  try {
    const [favorites, savedFilters] = await Promise.all([
      readFavoriteReportsFromServer(),
      readSavedFiltersFromServer(channel),
    ]);

    const next = sanitizeSnapshot(
      mergeChannelSavedFilters(
        {
          favorites,
          savedFilters: cached.savedFilters,
        },
        channel,
        savedFilters,
      ),
    );
    writeReportPreferences(next);
    return next;
  } catch {
    return cached;
  }
}

export function toggleFavoriteReport(reportId: SharedReportId) {
  const next = toggleSharedReportFavorite(readReportPreferences(), reportId);
  writeReportPreferences(next);
  return next;
}

export async function toggleFavoriteReportPersisted(reportId: SharedReportId) {
  const next = toggleSharedReportFavorite(readReportPreferences(), reportId);
  writeReportPreferences(next);

  try {
    await writeFavoriteReportsToServer(next.favorites);
    const synced = await syncReportPreferencesFromServer("web");
    writeReportPreferences(synced);
    return synced;
  } catch {
    return next;
  }
}

export function isFavoriteReport(reportId: SharedReportId) {
  return isSharedReportFavorite(readReportPreferences(), reportId);
}

export function listSavedFiltersForReport(reportId: SharedReportId, channel: ReportChannel) {
  return listSharedReportSavedFilters(readReportPreferences(), reportId, channel);
}

export function saveLocalReportFilterPreset(
  reportId: SharedReportId,
  channel: ReportChannel,
  values: Record<string, unknown>,
  name?: string,
) {
  const current = readReportPreferences();
  const currentPresets = listSharedReportSavedFilters(current, reportId, channel);
  const nextIndex = currentPresets.length + 1;
  const preset = {
    id: `${reportId}.${channel}.${Date.now()}`,
    reportId,
    channel,
    name: name?.trim() || `Preset ${nextIndex}`,
    values,
    createdAt: new Date().toISOString(),
  } satisfies SharedReportSavedFilter;

  const next = saveSharedReportFilter(current, preset);
  writeReportPreferences(next);
  return preset;
}

export async function saveReportFilterPresetPersisted(
  reportId: SharedReportId,
  channel: ReportChannel,
  values: Record<string, unknown>,
  name?: string,
) {
  const current = readReportPreferences();
  const currentPresets = listSharedReportSavedFilters(current, reportId, channel);
  const presetName = name?.trim() || `Preset ${currentPresets.length + 1}`;
  const gridId = buildSharedReportSavedFilterGridId(reportId, channel);

  const created = await createGridVariant({
    gridId,
    name: presetName,
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    schemaVersion: 1,
    state: buildSharedReportSavedFilterVariantState(values),
  });

  const latestPresets = await readAllSavedFiltersForReportFromServer(reportId, channel);
  const overflow = latestPresets.slice(MAX_SAVED_FILTERS_PER_REPORT);
  if (overflow.length > 0) {
    await Promise.allSettled(overflow.map((preset) => deleteGridVariant(preset.id)));
  }
  const scopedFilters = latestPresets.slice(0, MAX_SAVED_FILTERS_PER_REPORT);
  const next = sanitizeSnapshot(
    mergeScopedSavedFilters(current, reportId, channel, scopedFilters),
  );
  writeReportPreferences(next);

  const preset =
    scopedFilters.find((item) => item.id === created.id) ??
    mapSavedFilterVariant(reportId, channel, created);

  return {
    preset,
    snapshot: next,
  };
}

export function removeLocalReportFilterPreset(presetId: string) {
  const next = removeSharedReportSavedFilter(readReportPreferences(), presetId);
  writeReportPreferences(next);
  return next;
}

export async function removeReportFilterPresetPersisted(
  reportId: SharedReportId,
  channel: ReportChannel,
  presetId: string,
) {
  try {
    await deleteGridVariant(presetId);
  } catch {
    // Sunucu hatasinda yerel snapshot yine de temizlenir.
  }

  try {
    const scopedFilters = await readSavedFiltersForReportFromServer(reportId, channel);
    const next = sanitizeSnapshot(
      mergeScopedSavedFilters(readReportPreferences(), reportId, channel, scopedFilters),
    );
    writeReportPreferences(next);
    return next;
  } catch {
    const next = removeSharedReportSavedFilter(readReportPreferences(), presetId);
    writeReportPreferences(next);
    return next;
  }
}
