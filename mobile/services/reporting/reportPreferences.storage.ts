import {
  createEmptySharedReportPreferenceSnapshot,
  isSharedReportId,
  type SharedReportId,
  type SharedReportPreferenceSnapshot,
} from "@platform/capabilities";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const STORAGE_KEY = "platform-mobile.report-preferences.v1";
const memoryFallbackStore = new Map<string, string>();
const hasWindow = typeof window !== "undefined";

function isReportChannel(value: unknown): value is "web" | "mobile" {
  return value === "web" || value === "mobile";
}

async function setRawValue(raw: string) {
  if (Platform.OS === "web" && hasWindow) {
    window.localStorage.setItem(STORAGE_KEY, raw);
    return;
  }

  try {
    await SecureStore.setItemAsync(STORAGE_KEY, raw);
  } catch {
    memoryFallbackStore.set(STORAGE_KEY, raw);
  }
}

async function getRawValue() {
  if (Platform.OS === "web" && hasWindow) {
    return window.localStorage.getItem(STORAGE_KEY);
  }

  try {
    return await SecureStore.getItemAsync(STORAGE_KEY);
  } catch {
    return memoryFallbackStore.get(STORAGE_KEY) ?? null;
  }
}

function sanitizeSnapshot(
  value: Partial<SharedReportPreferenceSnapshot> | null | undefined,
): SharedReportPreferenceSnapshot {
  return {
    favorites: Array.isArray(value?.favorites)
      ? value.favorites.filter(
          (item): item is SharedReportId => isSharedReportId(item),
        )
      : [],
    savedFilters: Array.isArray(value?.savedFilters)
      ? value.savedFilters.filter(
          (item) =>
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

export async function readStoredReportPreferences() {
  const raw = await getRawValue();

  if (!raw) {
    return createEmptySharedReportPreferenceSnapshot();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SharedReportPreferenceSnapshot>;
    return sanitizeSnapshot(parsed);
  } catch {
    return createEmptySharedReportPreferenceSnapshot();
  }
}

export async function writeStoredReportPreferences(snapshot: SharedReportPreferenceSnapshot) {
  await setRawValue(JSON.stringify(snapshot));
}
