/**
 * Module Federation Resilience
 *
 * Handles:
 * - Remote unavailable (timeout, network error)
 * - Version mismatch (shared dependency conflict)
 * - Graceful degradation (fallback UI)
 * - Health monitoring (remote status checks)
 *
 * Usage:
 * const resilience = createMFResilience({ remotes: { suggestions: 'http://localhost:3001/remoteEntry.js' } });
 * const Component = await resilience.loadRemote('suggestions', './App');
 * const health = await resilience.checkHealth();
 */

import React from 'react';

export interface RemoteHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unavailable';
  lastCheck: string;
  latency?: number;
  error?: string;
}

interface MFResilienceConfig {
  remotes: Record<string, string>;  // name -> remoteEntry URL
  timeout?: number;                  // default 5000ms
  retries?: number;                  // default 2
  fallback?: React.ComponentType;    // default error boundary
}

interface MFResilience {
  loadRemote: (name: string, module: string) => Promise<React.ComponentType<any>>;
  getRemoteHealth: () => RemoteHealth[];
  checkHealth: () => Promise<RemoteHealth[]>;
}

/* ------------------------------------------------------------------ */
/*  Default fallback component                                         */
/* ------------------------------------------------------------------ */

function DefaultFallback() {
  return React.createElement(
    'div',
    {
      className: 'flex items-center justify-center rounded-xl border border-border-subtle bg-surface-muted p-8',
    },
    React.createElement(
      'div',
      { className: 'text-center' },
      React.createElement('div', { className: 'text-2xl mb-2' }, '\u26A0\uFE0F'),
      React.createElement(
        'p',
        { className: 'text-sm text-text-secondary' },
        'Bu modul su anda kullanilamiyor',
      ),
      React.createElement(
        'p',
        { className: 'mt-1 text-xs text-text-secondary' },
        'Lutfen daha sonra tekrar deneyin',
      ),
    ),
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err: unknown) {
    clearTimeout(timer);
    throw err;
  }
}

async function retryAsync<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < retries) {
        // Exponential backoff: 500ms, 1000ms
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      }
    }
  }
  throw lastError;
}

/* ------------------------------------------------------------------ */
/*  Factory                                                            */
/* ------------------------------------------------------------------ */

export function createMFResilience(config: MFResilienceConfig): MFResilience {
  const {
    remotes,
    timeout = 5000,
    retries = 2,
    fallback: FallbackComponent = DefaultFallback,
  } = config;

  const healthCache = new Map<string, RemoteHealth>();

  // Initialize health cache
  for (const name of Object.keys(remotes)) {
    healthCache.set(name, {
      name,
      status: 'healthy',
      lastCheck: new Date().toISOString(),
    });
  }

  async function loadRemote(name: string, module: string): Promise<React.ComponentType<any>> {
    const remoteUrl = remotes[name];
    if (!remoteUrl) {
      console.error(`[MF Resilience] Unknown remote: ${name}`);
      return FallbackComponent;
    }

    try {
      const result = await retryAsync(async () => {
        // In a real Module Federation setup, this would use __webpack_init_sharing__
        // and the container interface. Here we check availability.
        const start = performance.now();
        const res = await fetchWithTimeout(remoteUrl, timeout);
        const latency = performance.now() - start;

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        healthCache.set(name, {
          name,
          status: latency > timeout * 0.8 ? 'degraded' : 'healthy',
          lastCheck: new Date().toISOString(),
          latency: Math.round(latency),
        });

        // Module Federation container access
        const container = (window as any)[name];
        if (!container) {
          throw new Error(`Container '${name}' not found on window`);
        }
        await container.init((window as any).__webpack_share_scopes__?.default ?? {});
        const factory = await container.get(module);
        const mod = factory();
        return mod.default ?? mod;
      }, retries);

      return result;
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error(`[MF Resilience] Failed to load ${name}/${module}: ${error}`);

      healthCache.set(name, {
        name,
        status: 'unavailable',
        lastCheck: new Date().toISOString(),
        error,
      });

      return FallbackComponent;
    }
  }

  function getRemoteHealth(): RemoteHealth[] {
    return Array.from(healthCache.values());
  }

  async function checkHealth(): Promise<RemoteHealth[]> {
    const checks = Object.entries(remotes).map(async ([name, url]) => {
      try {
        const start = performance.now();
        const res = await fetchWithTimeout(url, timeout);
        const latency = performance.now() - start;

        const health: RemoteHealth = {
          name,
          status: res.ok ? (latency > timeout * 0.8 ? 'degraded' : 'healthy') : 'unavailable',
          lastCheck: new Date().toISOString(),
          latency: Math.round(latency),
          error: res.ok ? undefined : `HTTP ${res.status}`,
        };
        healthCache.set(name, health);
        return health;
      } catch (err: unknown) {
        const health: RemoteHealth = {
          name,
          status: 'unavailable',
          lastCheck: new Date().toISOString(),
          error: err instanceof Error ? err.message : String(err),
        };
        healthCache.set(name, health);
        return health;
      }
    });

    return Promise.all(checks);
  }

  return { loadRemote, getRemoteHealth, checkHealth };
}
