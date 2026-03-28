import {
  buildEffectivePermissionCodes,
  normalizeAuthzSnapshot,
  normalizePermissionCodes,
  type AuthSessionBundle,
} from "@platform-mobile/core";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_STORAGE_KEY = "platform-mobile.auth.session.v1";
const memoryFallbackStore = new Map<string, string>();

const hasWindow = typeof window !== "undefined";

async function setRawValue(raw: string) {
  if (Platform.OS === "web" && hasWindow) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, raw);
    return;
  }

  try {
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, raw);
  } catch {
    memoryFallbackStore.set(SESSION_STORAGE_KEY, raw);
  }
}

async function getRawValue() {
  if (Platform.OS === "web" && hasWindow) {
    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  }

  try {
    return await SecureStore.getItemAsync(SESSION_STORAGE_KEY);
  } catch {
    return memoryFallbackStore.get(SESSION_STORAGE_KEY) ?? null;
  }
}

async function removeRawValue() {
  if (Platform.OS === "web" && hasWindow) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
  } catch {
    memoryFallbackStore.delete(SESSION_STORAGE_KEY);
  }
}

function sanitizeStoredSession(
  value: Partial<AuthSessionBundle> | null | undefined,
): AuthSessionBundle | null {
  if (!value || typeof value.token !== "string" || typeof value.email !== "string") {
    return null;
  }

  const expiresAt = Number(value.expiresAt);
  const sessionTimeoutMinutes = Number(value.sessionTimeoutMinutes ?? 0);

  if (!Number.isFinite(expiresAt) || !Number.isFinite(sessionTimeoutMinutes)) {
    return null;
  }

  return {
    token: value.token,
    email: value.email,
    role: typeof value.role === "string" && value.role.trim() ? value.role : "USER",
    permissions: normalizePermissionCodes(value.permissions),
    effectivePermissions: buildEffectivePermissionCodes([
      ...(value.permissions ?? []),
      ...(value.effectivePermissions ?? []),
    ]),
    expiresAt,
    sessionTimeoutMinutes,
    authz: normalizeAuthzSnapshot(value.authz),
    companyId: typeof value.companyId === "number" ? value.companyId : null,
    lastSyncedAt:
      typeof value.lastSyncedAt === "string" && value.lastSyncedAt
        ? value.lastSyncedAt
        : new Date().toISOString(),
  };
}

export async function readStoredAuthSession() {
  const raw = await getRawValue();

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSessionBundle>;
    return sanitizeStoredSession(parsed);
  } catch {
    await clearStoredAuthSession();
    return null;
  }
}

export async function writeStoredAuthSession(session: AuthSessionBundle) {
  await setRawValue(JSON.stringify(session));
}

export async function clearStoredAuthSession() {
  await removeRawValue();
}
