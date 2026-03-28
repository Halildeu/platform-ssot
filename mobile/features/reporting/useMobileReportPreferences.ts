import {
  createEmptySharedReportPreferenceSnapshot,
  isSharedReportFavorite,
  listSharedReportSavedFilters,
  removeSharedReportSavedFilter,
  saveSharedReportFilter,
  toggleSharedReportFavorite,
  type ReportChannel,
  type SharedReportId,
  type SharedReportSavedFilter,
} from "@platform/capabilities";
import { startTransition, useEffect, useState } from "react";

import {
  removeRemoteReportFilterPreset,
  saveRemoteReportFilterPreset,
  syncRemoteReportPreferences,
  toggleRemoteFavoriteReport,
} from "../../services/reporting/reportPreferences.remote";
import {
  readStoredReportPreferences,
  writeStoredReportPreferences,
} from "../../services/reporting/reportPreferences.storage";

function sanitizeFilterValues(values: Record<string, unknown>) {
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

export function useMobileReportPreferences(token?: string | null) {
  const [snapshot, setSnapshot] = useState(createEmptySharedReportPreferenceSnapshot());

  const refresh = async () => {
    const localSnapshot = await readStoredReportPreferences();
    startTransition(() => {
      setSnapshot(localSnapshot);
    });

    if (!token) {
      return localSnapshot;
    }

    try {
      const remoteSnapshot = await syncRemoteReportPreferences(token, ["mobile", "web"]);
      await writeStoredReportPreferences(remoteSnapshot);
      startTransition(() => {
        setSnapshot(remoteSnapshot);
      });
      return remoteSnapshot;
    } catch {
      return localSnapshot;
    }
  };

  const toggleFavorite = async (reportId: SharedReportId) => {
    const optimistic = toggleSharedReportFavorite(snapshot, reportId);
    await writeStoredReportPreferences(optimistic);
    startTransition(() => {
      setSnapshot(optimistic);
    });

    if (!token) {
      return optimistic;
    }

    try {
      const persisted = await toggleRemoteFavoriteReport(token, snapshot, reportId);
      await writeStoredReportPreferences(persisted);
      startTransition(() => {
        setSnapshot(persisted);
      });
      return persisted;
    } catch {
      return optimistic;
    }
  };

  const savePreset = async (
    reportId: SharedReportId,
    channel: ReportChannel,
    values: Record<string, unknown>,
    name?: string,
    presetId?: string | null,
  ) => {
    const sanitizedValues = sanitizeFilterValues(values);
    const currentPresets = listSharedReportSavedFilters(snapshot, reportId, channel);
    const existingPreset = presetId
      ? currentPresets.find((preset) => preset.id === presetId) ?? null
      : null;
    const optimisticPreset = {
      id: existingPreset?.id ?? `${reportId}.${channel}.${Date.now()}`,
      reportId,
      channel,
      name: name?.trim() || existingPreset?.name || `Preset ${currentPresets.length + 1}`,
      values: sanitizedValues,
      createdAt: existingPreset?.createdAt ?? new Date().toISOString(),
    } satisfies SharedReportSavedFilter;
    const optimistic = saveSharedReportFilter(snapshot, optimisticPreset);
    await writeStoredReportPreferences(optimistic);
    startTransition(() => {
      setSnapshot(optimistic);
    });

    if (!token) {
      return {
        preset: optimisticPreset,
        snapshot: optimistic,
      };
    }

    try {
      const persisted = await saveRemoteReportFilterPreset(
        token,
        snapshot,
        reportId,
        channel,
        sanitizedValues,
        name,
        presetId,
      );
      await writeStoredReportPreferences(persisted.snapshot);
      startTransition(() => {
        setSnapshot(persisted.snapshot);
      });
      return persisted;
    } catch {
      return {
        preset: optimisticPreset,
        snapshot: optimistic,
      };
    }
  };

  const removePreset = async (
    reportId: SharedReportId,
    channel: ReportChannel,
    presetId: string,
  ) => {
    const optimistic = removeSharedReportSavedFilter(snapshot, presetId);
    await writeStoredReportPreferences(optimistic);
    startTransition(() => {
      setSnapshot(optimistic);
    });

    if (!token) {
      return optimistic;
    }

    try {
      const persisted = await removeRemoteReportFilterPreset(
        token,
        snapshot,
        reportId,
        channel,
        presetId,
      );
      await writeStoredReportPreferences(persisted);
      startTransition(() => {
        setSnapshot(persisted);
      });
      return persisted;
    } catch {
      return optimistic;
    }
  };

  useEffect(() => {
    void refresh();
  }, [token]);

  return {
    snapshot,
    refresh,
    isFavorite: (reportId: SharedReportId) => isSharedReportFavorite(snapshot, reportId),
    listSavedFilters: (reportId: SharedReportId, channels?: readonly ReportChannel[]) => {
      const targetChannels: readonly ReportChannel[] =
        channels && channels.length > 0 ? channels : ["mobile", "web"];
      return targetChannels.flatMap((channel) =>
        listSharedReportSavedFilters(snapshot, reportId, channel),
      );
    },
    removePreset,
    savePreset,
    toggleFavorite,
  };
}
