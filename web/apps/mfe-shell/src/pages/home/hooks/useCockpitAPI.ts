import { useState, useCallback } from "react";

const COCKPIT_URL = "/cockpit-api";

export interface ContextHealth {
  status: string;
  score: number;
  grade: string;
  blocking: boolean;
  components: Record<string, { score: number; max: number }>;
  reasons: string[];
  ts: number;
}

export interface SystemStatus {
  overall_status: string;
  sections?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WorkIntakeItem {
  id: string;
  title?: string;
  bucket?: string;
  status?: string;
  priority?: string;
  source?: string;
  [key: string]: unknown;
}

export interface WorkIntake {
  items: WorkIntakeItem[];
  summary?: Record<string, number>;
}

export interface DecisionInbox {
  items: unknown[];
  pending_decisions_count: number;
  seed_pending_count: number;
}

export interface ExtensionInfo {
  extension_id: string;
  enabled?: boolean;
  manifest?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ExtensionRegistry {
  registry_exists: boolean;
  items: ExtensionInfo[];
}

export interface MultiRepoStatus {
  repos: {
    repo_name: string;
    overall_status: string;
    risk_score: number;
    risk_level: string;
    critical: boolean;
    gates: Record<string, unknown>;
    [key: string]: unknown;
  }[];
}

export interface LockStatus {
  lock_state: string;
  owner_tag?: string;
  expires_at?: string;
  lease_count?: number;
  claim_count?: number;
}

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${COCKPIT_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function useCockpitAPI() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const fetchWithTracking = useCallback(async <T>(key: string, path: string): Promise<T | null> => {
    setLoading((p) => ({ ...p, [key]: true }));
    setErrors((p) => ({ ...p, [key]: null }));
    try {
      const data = await fetchJSON<T>(path);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrors((p) => ({ ...p, [key]: msg }));
      return null;
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
    }
  }, []);

  return {
    loading,
    errors,
    fetchContextHealth: () => fetchWithTracking<ContextHealth>("health", "/context-health"),
    fetchStatus: () => fetchWithTracking<SystemStatus>("status", "/status"),
    fetchOverview: () => fetchWithTracking<Record<string, unknown>>("overview", "/overview"),
    fetchIntake: () => fetchWithTracking<WorkIntake>("intake", "/intake"),
    fetchDecisions: () => fetchWithTracking<DecisionInbox>("decisions", "/decisions"),
    fetchExtensions: () => fetchWithTracking<ExtensionRegistry>("extensions", "/extensions"),
    fetchMultiRepo: () => fetchWithTracking<MultiRepoStatus>("multirepo", "/multi-repo-status"),
    fetchLocks: () => fetchWithTracking<LockStatus>("locks", "/locks"),
    fetchJobs: () => fetchWithTracking<{ summary: Record<string, number>; jobs: unknown[] }>("jobs", "/jobs"),
    fetchNorthStar: () => fetchWithTracking<Record<string, unknown>>("northstar", "/north_star"),
  };
}
