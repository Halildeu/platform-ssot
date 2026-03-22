/**
 * Module Federation Health Panel
 *
 * Shows health status of each MF remote:
 * - Color-coded: green/yellow/red
 * - Latency display
 * - Last check timestamp
 * - "Yeniden Dene" (retry) button
 */

import React, { useCallback, useEffect, useState } from 'react';
import type { RemoteHealth } from '../../../../lib/mf-resilience';

/* ------------------------------------------------------------------ */
/*  Known remotes — derived from shell config                          */
/* ------------------------------------------------------------------ */

const KNOWN_REMOTES: Record<string, string> = {
  suggestions: 'http://localhost:3001/remoteEntry.js',
  ethic: 'http://localhost:3002/remoteEntry.js',
  users: 'http://localhost:3003/remoteEntry.js',
  access: 'http://localhost:3004/remoteEntry.js',
  audit: 'http://localhost:3005/remoteEntry.js',
  reporting: 'http://localhost:3006/remoteEntry.js',
};

const STATUS_CONFIG: Record<RemoteHealth['status'], { label: string; color: string; dot: string }> = {
  healthy: {
    label: 'Saglikli',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  degraded: {
    label: 'Yavaslamis',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  unavailable: {
    label: 'Erisilemiyor',
    color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

async function checkRemoteHealth(name: string, url: string): Promise<RemoteHealth> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const start = performance.now();
    const res = await fetch(url, { signal: controller.signal, mode: 'no-cors' });
    clearTimeout(timer);
    const latency = Math.round(performance.now() - start);

    return {
      name,
      status: latency > 4000 ? 'degraded' : 'healthy',
      lastCheck: new Date().toISOString(),
      latency,
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      name,
      status: 'unavailable',
      lastCheck: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export default function MFHealthPanel() {
  const [healthData, setHealthData] = useState<RemoteHealth[]>(
    Object.keys(KNOWN_REMOTES).map((name) => ({
      name,
      status: 'healthy' as const,
      lastCheck: new Date().toISOString(),
    })),
  );
  const [checking, setChecking] = useState(false);

  const runChecks = useCallback(async () => {
    setChecking(true);
    const results = await Promise.all(
      Object.entries(KNOWN_REMOTES).map(([name, url]) => checkRemoteHealth(name, url)),
    );
    setHealthData(results);
    setChecking(false);
  }, []);

  useEffect(() => {
    runChecks();
    const interval = setInterval(runChecks, 30_000);
    return () => clearInterval(interval);
  }, [runChecks]);

  const healthyCount = healthData.filter((h) => h.status === 'healthy').length;
  const totalCount = healthData.length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Module Federation Durumu</h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            {healthyCount}/{totalCount} remote saglikli
          </p>
        </div>
        <button
          type="button"
          onClick={runChecks}
          disabled={checking}
          className="rounded-lg border border-border-subtle bg-surface-default px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-muted disabled:opacity-50"
        >
          {checking ? 'Kontrol ediliyor...' : 'Yeniden Dene'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {healthData.map((remote) => {
          const cfg = STATUS_CONFIG[remote.status];
          return (
            <div
              key={remote.name}
              className={`rounded-xl border border-border-subtle p-4 ${cfg.color}`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-sm font-semibold capitalize">{remote.name}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span>{cfg.label}</span>
                {remote.latency != null && (
                  <span className="tabular-nums">{remote.latency}ms</span>
                )}
              </div>
              {remote.error && (
                <div className="mt-1 truncate text-[10px] opacity-75">{remote.error}</div>
              )}
              <div className="mt-2 text-[10px] opacity-60">
                Son kontrol: {new Date(remote.lastCheck).toLocaleTimeString('tr-TR')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
