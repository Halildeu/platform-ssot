import { useEffect } from 'react';
import { getGatewayBaseUrl, resolveAuthToken, resolveTraceId } from '@mfe/shared-http';
import { AuditEvent } from '../types/audit-event';
import { ApiAuditEvent, normaliseAuditEvent } from '../utils/normalise-audit-event';

type LiveStreamHandlers = {
  onEvent?: (event: AuditEvent) => void;
  onFallbackTick?: () => void;
  fallbackIntervalMs?: number;
};

const DEFAULT_FALLBACK_INTERVAL = 15_000;
const RECONNECT_DELAY = 5_000;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const buildGatewayUrl = (path: string): string => {
  const base = trimTrailingSlash(getGatewayBaseUrl());
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${safePath}`;
};

const generateTraceId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `trace-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 10)}`;
};

const createSseHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
  };
  const token = resolveAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const traceId = resolveTraceId() ?? generateTraceId();
  headers['X-Trace-Id'] = traceId;
  return headers;
};

const normaliseChunk = (chunk: string) => chunk.replace(/\r\n/g, '\n');

const shouldLogLiveStreamWarning = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (!message) {
    return false;
  }
  const normalized = message.toLowerCase();
  if (normalized.includes('abort')) {
    return false;
  }
  if (normalized.includes('failed to fetch')) {
    return false;
  }
  if (normalized.includes('load failed')) {
    return false;
  }
  return true;
};

export const useAuditLiveStream = (enabled: boolean, handlers: LiveStreamHandlers) => {
  useEffect(() => {
    if (!enabled) {
      return () => {};
    }

    let abortController: AbortController | null = null;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isStreaming = false;

    const stopFallback = () => {
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
    };

    const startFallback = () => {
      if (fallbackTimer || !handlers.onFallbackTick) {
        return;
      }
      fallbackTimer = setInterval(() => {
        handlers.onFallbackTick?.();
      }, handlers.fallbackIntervalMs ?? DEFAULT_FALLBACK_INTERVAL);
    };

    const scheduleReconnect = () => {
      if (reconnectTimer) {
        return;
      }
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        initialiseStream();
      }, RECONNECT_DELAY);
    };

    const handleEventMessage = (data: string) => {
      try {
        const payload = JSON.parse(data) as ApiAuditEvent;
        const normalised = normaliseAuditEvent(payload);
        handlers.onEvent?.(normalised);
        stopFallback();
      } catch (error) {
        console.warn('Failed to parse audit live event', error);
        handlers.onFallbackTick?.();
      }
    };

    const processEventPayload = (payload: string) => {
      const trimmed = payload.trim();
      if (!trimmed) {
        return;
      }
      const dataLines = trimmed
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .filter(Boolean);
      dataLines.forEach((line) => handleEventMessage(line));
    };

    const openStream = async (): Promise<void> => {
      const headers = createSseHeaders();
      const controller = new AbortController();
      abortController = controller;
      try {
        const response = await fetch(buildGatewayUrl('/audit/events/live'), {
          headers,
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          throw new Error(`Audit live stream failed: ${response.status}`);
        }
        isStreaming = true;
        stopFallback();
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          buffer += normaliseChunk(decoder.decode(value, { stream: true }));
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const chunk = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            processEventPayload(chunk);
            boundary = buffer.indexOf('\n\n');
          }
        }
        if (buffer.trim().length > 0) {
          processEventPayload(buffer);
        }
        throw new Error('Audit live stream closed unexpectedly.');
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        throw error;
      } finally {
        if (abortController === controller) {
          abortController = null;
        }
        isStreaming = false;
      }
    };

    const initialiseStream = () => {
      if (isStreaming || abortController) {
        return;
      }
      if (!resolveAuthToken()) {
        startFallback();
        scheduleReconnect();
        return;
      }
      openStream().catch((error) => {
        if (process.env.NODE_ENV !== 'production' && shouldLogLiveStreamWarning(error)) {
          console.warn('Audit live stream error', error);
        }
        handlers.onFallbackTick?.();
        startFallback();
        scheduleReconnect();
      });
    };

    initialiseStream();

    return () => {
      abortController?.abort();
      abortController = null;
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };
  }, [enabled, handlers]);
};
