import {
  buildSharedReportFavoritesVariantState,
  buildSharedReportSavedFilterVariantState,
  buildSharedReportSavedFilterGridId,
  createEmptySharedReportPreferenceSnapshot,
  listSharedReportSavedFilters,
  listSharedReports,
  removeSharedReportSavedFilter,
  readSharedReportFavoritesFromVariantState,
  readSharedReportSavedFilterValuesFromVariantState,
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

import { apiJsonRequest, apiRequest } from "../api/httpClient";

type VariantDto = {
  id?: string | number;
  name?: string;
  state?: unknown;
  isGlobal?: boolean;
  schemaVersion?: number;
  createdAt?: string;
};

type VariantListResponse = {
  items?: VariantDto[];
};

const MAX_SAVED_FILTERS_PER_REPORT = 5;

function normalizeChannels(
  channels: ReportChannel | readonly ReportChannel[],
): ReportChannel[] {
  const list = Array.isArray(channels) ? [...channels] : [channels];
  return [...new Set(list.filter((item): item is ReportChannel => item === "web" || item === "mobile"))];
}

function mapVariantId(value: string | number | undefined) {
  return value === undefined ? "" : String(value);
}

function isPersonalVariant(variant: VariantDto) {
  return variant.isGlobal !== true;
}

function findFavoriteVariant(variants: VariantDto[]) {
  return (
    variants.find(
      (variant) => isPersonalVariant(variant) && variant.name === SHARED_REPORT_FAVORITES_VARIANT_NAME,
    ) ??
    variants.find((variant) => variant.name === SHARED_REPORT_FAVORITES_VARIANT_NAME) ??
    null
  );
}

function compareSavedFiltersNewestFirst(
  left: SharedReportSavedFilter,
  right: SharedReportSavedFilter,
) {
  return Date.parse(right.createdAt) - Date.parse(left.createdAt);
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

function sanitizeSavedFilterValues(values: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(values).flatMap(([key, value]) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed ? [[key, trimmed]] : [];
      }

      if (value === undefined || value === null) {
        return [];
      }

      return [[key, value]];
    }),
  );
}

function mapSavedFilterVariant(
  reportId: SharedReportId,
  channel: ReportChannel,
  variant: VariantDto,
): SharedReportSavedFilter {
  return {
    id: mapVariantId(variant.id),
    reportId,
    channel,
    name: typeof variant.name === "string" && variant.name.trim() ? variant.name : "Preset",
    values: readSharedReportSavedFilterValuesFromVariantState(variant.state),
    createdAt:
      typeof variant.createdAt === "string" && variant.createdAt.trim()
        ? variant.createdAt
        : new Date().toISOString(),
  };
}

async function fetchVariants(token: string, gridId: string) {
  const response = await apiJsonRequest<VariantListResponse | VariantDto[]>(
    `/v1/variants?gridId=${encodeURIComponent(gridId)}`,
    {
      method: "GET",
      token,
    },
  );

  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response.items) ? response.items : [];
}

async function createVariant(
  token: string,
  payload: Record<string, unknown>,
) {
  return apiJsonRequest<VariantDto>("/v1/variants", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

async function updateVariant(
  token: string,
  variantId: string,
  payload: Record<string, unknown>,
) {
  return apiJsonRequest<VariantDto>(`/v1/variants/${encodeURIComponent(variantId)}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

async function deleteVariant(token: string, variantId: string) {
  await apiRequest(`/v1/variants/${encodeURIComponent(variantId)}`, {
    method: "DELETE",
    token,
  });
}

async function readSavedFiltersForReportFromServer(
  token: string,
  reportId: SharedReportId,
  channel: ReportChannel,
) {
  const variants = await readAllSavedFiltersForReportFromServer(token, reportId, channel);
  return variants.slice(0, MAX_SAVED_FILTERS_PER_REPORT);
}

async function readAllSavedFiltersForReportFromServer(
  token: string,
  reportId: SharedReportId,
  channel: ReportChannel,
) {
  const variants = await fetchVariants(token, buildSharedReportSavedFilterGridId(reportId, channel));
  return variants
    .filter(isPersonalVariant)
    .map((variant) => mapSavedFilterVariant(reportId, channel, variant))
    .sort(compareSavedFiltersNewestFirst);
}

export async function syncRemoteReportPreferences(
  token: string,
  channels: ReportChannel | readonly ReportChannel[],
): Promise<SharedReportPreferenceSnapshot> {
  const normalizedChannels = normalizeChannels(channels);
  const [favoriteVariants, savedFilterGroups] = await Promise.all([
    fetchVariants(token, SHARED_REPORT_FAVORITES_GRID_ID),
    Promise.all(
      normalizedChannels.flatMap((channel) =>
        listSharedReports()
          .filter((report) => supportsSharedReportSavedFilters(report.id, channel))
          .map((report) => readSavedFiltersForReportFromServer(token, report.id, channel)),
      ),
    ),
  ]);

  const favorites = readSharedReportFavoritesFromVariantState(findFavoriteVariant(favoriteVariants)?.state);

  return {
    favorites,
    savedFilters: savedFilterGroups.flat(),
  };
}

export async function toggleRemoteFavoriteReport(
  token: string,
  currentSnapshot: SharedReportPreferenceSnapshot,
  reportId: SharedReportId,
) {
  const next = toggleSharedReportFavorite(currentSnapshot, reportId);
  const favoritesVariant = findFavoriteVariant(
    await fetchVariants(token, SHARED_REPORT_FAVORITES_GRID_ID),
  );

  if (next.favorites.length === 0) {
    if (favoritesVariant?.id !== undefined) {
      await deleteVariant(token, mapVariantId(favoritesVariant.id));
    }
    return {
      ...createEmptySharedReportPreferenceSnapshot(),
      savedFilters: currentSnapshot.savedFilters,
    };
  }

  const payload = {
    gridId: SHARED_REPORT_FAVORITES_GRID_ID,
    name: SHARED_REPORT_FAVORITES_VARIANT_NAME,
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    schemaVersion: Number(favoritesVariant?.schemaVersion ?? 1),
    state: buildSharedReportFavoritesVariantState(next.favorites),
  };

  if (favoritesVariant?.id !== undefined) {
    await updateVariant(token, mapVariantId(favoritesVariant.id), payload);
  } else {
    await createVariant(token, payload);
  }

  return {
    favorites: next.favorites,
    savedFilters: currentSnapshot.savedFilters,
  };
}

export async function saveRemoteReportFilterPreset(
  token: string,
  currentSnapshot: SharedReportPreferenceSnapshot,
  reportId: SharedReportId,
  channel: ReportChannel,
  values: Record<string, unknown>,
  name?: string,
  presetId?: string | null,
) {
  const sanitizedValues = sanitizeSavedFilterValues(values);
  const currentPresets = listSharedReportSavedFilters(currentSnapshot, reportId, channel);
  const existingPreset = presetId
    ? currentPresets.find((preset) => preset.id === presetId) ?? null
    : null;
  const presetName =
    name?.trim() ||
    existingPreset?.name ||
    `Preset ${currentPresets.length + 1}`;
  const gridId = buildSharedReportSavedFilterGridId(reportId, channel);
  const payload = {
    gridId,
    name: presetName,
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    schemaVersion: 1,
    state: buildSharedReportSavedFilterVariantState(sanitizedValues),
  };
  const created = existingPreset
    ? await updateVariant(token, existingPreset.id, payload)
    : await createVariant(token, payload);

  const latestPresets = await readAllSavedFiltersForReportFromServer(token, reportId, channel);
  const overflow = latestPresets.slice(MAX_SAVED_FILTERS_PER_REPORT);
  if (overflow.length > 0) {
    await Promise.allSettled(
      overflow.map((preset) => deleteVariant(token, preset.id)),
    );
  }

  const scopedFilters = latestPresets.slice(0, MAX_SAVED_FILTERS_PER_REPORT);
  const next = mergeScopedSavedFilters(currentSnapshot, reportId, channel, scopedFilters);
  const preset =
    scopedFilters.find((item) => item.id === mapVariantId(created.id)) ??
    mapSavedFilterVariant(reportId, channel, created);

  return {
    preset,
    snapshot: next,
  };
}

export async function removeRemoteReportFilterPreset(
  token: string,
  currentSnapshot: SharedReportPreferenceSnapshot,
  reportId: SharedReportId,
  channel: ReportChannel,
  presetId: string,
) {
  try {
    await deleteVariant(token, presetId);
  } catch {
    const next = removeSharedReportSavedFilter(currentSnapshot, presetId);
    return next;
  }

  try {
    const scopedFilters = await readSavedFiltersForReportFromServer(token, reportId, channel);
    return mergeScopedSavedFilters(currentSnapshot, reportId, channel, scopedFilters);
  } catch {
    return removeSharedReportSavedFilter(currentSnapshot, presetId);
  }
}
