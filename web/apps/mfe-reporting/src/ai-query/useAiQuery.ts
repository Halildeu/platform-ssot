/**
 * useAiQuery — Sends natural language prompt to AI backend, receives SQL + column config.
 */

import { useState, useCallback } from 'react';
import type { AiQueryRequest, AiQueryResponse } from './types';

const AI_API_BASE = '/api/v1/schema';

export function useAiQuery() {
  const [response, setResponse] = useState<AiQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useCallback(async (request: AiQueryRequest) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${AI_API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message ?? `AI servis hatası (HTTP ${res.status})`);
      }

      const data: AiQueryResponse = await res.json();
      setResponse(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI sorgusu başarısız.';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { response, isLoading, error, query, clear };
}
