import { useState, useEffect, useCallback, useRef } from 'react';

export type ServiceInfo = {
  name: string;
  container: string | null;
  port: number | null;
  category: string;
  type?: 'docker' | 'process';
  containerId: string | null;
  containerStatus: string;
  running: boolean;
  startedAt: string | null;
  uptime: string | null;
  dockerHealth: string | null;
  health: string;
  responseTime: number | null;
  rssMb: number | null;
  cpu: number | null;
};

type ServicesResponse = {
  services: ServiceInfo[];
  timestamp: string;
};

type ActionResult = {
  ok: boolean;
  action: string;
  name: string;
  note?: string;
  error?: string;
};

type BulkResult = {
  action: string;
  results: Array<{ name: string; ok: boolean; error?: string }>;
};

const API_BASE = '/api/services';
const POLL_INTERVAL = 10_000;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function useServiceManager() {
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [actionPending, setActionPending] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const data = await apiFetch<ServicesResponse>('');
      setServices(data.services);
      setLastRefresh(data.timestamp);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchServices();
    intervalRef.current = setInterval(fetchServices, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchServices]);

  const startService = useCallback(async (name: string) => {
    setActionPending(name);
    try {
      await apiFetch<ActionResult>(`/${name}/start`, { method: 'POST' });
      await fetchServices();
    } finally {
      setActionPending(null);
    }
  }, [fetchServices]);

  const stopService = useCallback(async (name: string) => {
    setActionPending(name);
    try {
      await apiFetch<ActionResult>(`/${name}/stop`, { method: 'POST' });
      await fetchServices();
    } finally {
      setActionPending(null);
    }
  }, [fetchServices]);

  const restartService = useCallback(async (name: string) => {
    setActionPending(name);
    try {
      await apiFetch<ActionResult>(`/${name}/restart`, { method: 'POST' });
      await fetchServices();
    } finally {
      setActionPending(null);
    }
  }, [fetchServices]);

  const bulkAction = useCallback(async (action: 'start' | 'stop' | 'restart', names?: string[]) => {
    setActionPending('bulk');
    try {
      await apiFetch<BulkResult>('/bulk-action', {
        method: 'POST',
        body: JSON.stringify({ action, services: names }),
      });
      await fetchServices();
    } finally {
      setActionPending(null);
    }
  }, [fetchServices]);

  const fetchLogs = useCallback(async (name: string, tail = 100): Promise<string> => {
    const data = await apiFetch<{ logs: string }>(`/${name}/logs?tail=${tail}`);
    return data.logs;
  }, []);

  return {
    services,
    loading,
    error,
    lastRefresh,
    actionPending,
    refresh: fetchServices,
    startService,
    stopService,
    restartService,
    bulkAction,
    fetchLogs,
  };
}
