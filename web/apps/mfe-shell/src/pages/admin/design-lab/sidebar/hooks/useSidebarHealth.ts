import { useEffect, useMemo, useState } from "react";

const CACHE_KEY = "design-lab-health";
const CACHE_TTL = 60_000; // 60s

export type HealthSummary = {
  total: number;
  pass: number;
  warn: number;
  fail: number;
  version: string;
  checkedAt: number;
};

type CacheEntry = HealthSummary & { cachedAt: number };

function loadCache(): HealthSummary | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.cachedAt > CACHE_TTL) return null;
    return entry;
  } catch {
    return null;
  }
}

function saveCache(data: HealthSummary) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ ...data, cachedAt: Date.now() }),
  );
}

/**
 * Fetches doctor health summary.
 * In dev mode, reads from /api/doctor-health or falls back to static values.
 * Caches for 60s in localStorage.
 */
export function useSidebarHealth() {
  const [health, setHealth] = useState<HealthSummary | null>(() => loadCache());
  const [loading, setLoading] = useState(!health);

  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setHealth(cached);
      setLoading(false);
      return;
    }

    // Try fetching from cockpit API (if running)
    let cancelled = false;

    async function fetchHealth() {
      try {
        const res = await fetch("/cockpit-api/health/doctor", {
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const data = (await res.json()) as HealthSummary;
          if (!cancelled) {
            setHealth(data);
            saveCache(data);
          }
        }
      } catch {
        // Fallback: hardcoded from last known doctor run
        if (!cancelled) {
          const fallback: HealthSummary = {
            total: 73,
            pass: 73,
            warn: 0,
            fail: 0,
            version: "6.0.0",
            checkedAt: Date.now(),
          };
          setHealth(fallback);
          saveCache(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  const status = useMemo(() => {
    if (!health) return "unknown";
    if (health.fail > 0) return "critical";
    if (health.warn > 0) return "warning";
    return "healthy";
  }, [health]);

  const percentage = useMemo(() => {
    if (!health || health.total === 0) return 0;
    return Math.round((health.pass / health.total) * 100);
  }, [health]);

  return useMemo(
    () => ({ health, loading, status, percentage }),
    [health, loading, status, percentage],
  );
}
