import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { OfflineQueueStorageAdapter, QueuedAction } from "@platform-mobile/core";

const STORAGE_KEY = "platform-mobile.offline-queue.v1";
const memoryFallbackStore = new Map<string, string>();

const hasWindow = typeof window !== "undefined";

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

export const offlineQueueStorageAdapter: OfflineQueueStorageAdapter = {
  async read(): Promise<QueuedAction[]> {
    const raw = await getRawValue();
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as QueuedAction[]) : [];
    } catch {
      return [];
    }
  },
  async write(actions: QueuedAction[]) {
    await setRawValue(JSON.stringify(actions));
  },
};
