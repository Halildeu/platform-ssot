import { api } from '@mfe/shared-http';

const LS_PREFIX = 'mfe.theme.admin';

export function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}.${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function lsSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${LS_PREFIX}.${key}`, JSON.stringify(value));
  } catch {
    /* quota exceeded — silent */
  }
}

export async function apiOrFallback<T>(
  apiCall: () => Promise<{ data: T }>,
  fallbackKey: string,
  fallbackData?: T,
): Promise<T> {
  try {
    const res = await apiCall();
    const data = res.data;
    lsSet(fallbackKey, data);
    return data;
  } catch {
    const cached = lsGet<T>(fallbackKey);
    if (cached) return cached;
    if (fallbackData !== undefined) return fallbackData;
    throw new Error(`No API and no cached data for ${fallbackKey}`);
  }
}

export async function apiPutOrLocal(
  url: string,
  payload: unknown,
  localKey: string,
): Promise<void> {
  lsSet(localKey, payload);
  try {
    await api.put(url, payload);
  } catch {
    /* API unavailable — saved locally, silent */
  }
}
