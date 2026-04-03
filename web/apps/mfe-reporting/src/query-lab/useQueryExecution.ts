/**
 * useQueryExecution — Executes SQL queries against schema-service.
 */

import { useState, useCallback } from 'react';
import type { QueryExecution } from './types';

const SCHEMA_API_BASE = '/api/v1/schema';
const DEFAULT_LIMIT = 1000;
const QUERY_TIMEOUT_MS = 30000;

export function useQueryExecution() {
  const [execution, setExecution] = useState<QueryExecution | null>(null);

  const execute = useCallback(async (sql: string, schema: string, limit?: number) => {
    const id = `q-${Date.now()}`;
    const startedAt = new Date().toISOString();

    setExecution({
      id,
      sql,
      schema,
      status: 'running',
      startedAt,
    });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);

      const res = await fetch(`${SCHEMA_API_BASE}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, schema, limit: limit ?? DEFAULT_LIMIT }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      const completedAt = new Date().toISOString();
      const durationMs = Date.now() - new Date(startedAt).getTime();

      setExecution({
        id,
        sql,
        schema,
        status: 'success',
        startedAt,
        completedAt,
        durationMs,
        columns: data.columns ?? [],
        rows: data.rows ?? [],
        rowCount: data.rowCount ?? (data.rows?.length ?? 0),
      });
    } catch (err) {
      setExecution({
        id,
        sql,
        schema,
        status: 'error',
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - new Date(startedAt).getTime(),
        error: err instanceof Error ? err.message : 'Sorgu çalıştırılamadı.',
      });
    }
  }, []);

  const clear = useCallback(() => setExecution(null), []);

  return { execution, execute, clear };
}
