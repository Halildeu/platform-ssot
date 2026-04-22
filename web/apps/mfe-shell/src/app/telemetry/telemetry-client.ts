import { resolveTraceId, sendTelemetry } from '@mfe/shared-http';
import type { TelemetryContext, TelemetryEvent } from '@mfe/shared-types';
import { readEnv } from '../config/env';

export type ShellTelemetryEvent = {
  type: string;
  payload?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  timestamp?: number;
};

export type TelemetryClient = {
  emit: (event: unknown) => void;
  trackPageView: (path: string) => void;
};

const sanitizeTags = (
  value: Record<string, unknown> | undefined,
): Record<string, string | number | boolean> | undefined => {
  if (!value) {
    return undefined;
  }

  const entries = Object.entries(value).flatMap(([key, tagValue]) => {
    if (
      typeof tagValue === 'string'
      || typeof tagValue === 'number'
      || typeof tagValue === 'boolean'
    ) {
      return [[key, tagValue] as const];
    }

    if (tagValue === null || tagValue === undefined) {
      return [];
    }

    try {
      return [[key, JSON.stringify(tagValue).slice(0, 500)] as const];
    } catch {
      return [[key, String(tagValue)] as const];
    }
  });

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

const readBaseContext = (): TelemetryContext => ({
  app: 'mfe-shell',
  env: readEnv('APP_ENVIRONMENT', 'local') as TelemetryContext['env'],
  version: readEnv('APP_RELEASE', 'dev'),
});

const isShellTelemetryEvent = (value: unknown): value is ShellTelemetryEvent => {
  return typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string';
};

const mapShellEventType = (type: string): TelemetryEvent['eventType'] => {
  if (/error|exception|rejection/i.test(type)) {
    return 'error';
  }
  if (/audit/i.test(type)) {
    return 'audit';
  }
  return 'telemetry';
};

const toIsoTimestamp = (timestamp?: number): string => {
  if (typeof timestamp === 'number' && Number.isFinite(timestamp)) {
    return new Date(timestamp).toISOString();
  }
  return new Date().toISOString();
};

const buildErrorInfo = (
  type: string,
  payload?: Record<string, unknown>,
): TelemetryEvent['error'] | undefined => {
  if (!/error|exception|rejection/i.test(type)) {
    return undefined;
  }

  const message =
    (typeof payload?.message === 'string' && payload.message.trim()) ? payload.message : type;
  const stack =
    (typeof payload?.stack === 'string' && payload.stack.trim()) ? payload.stack : undefined;
  const code =
    (typeof payload?.code === 'string' && payload.code.trim()) ? payload.code : undefined;

  return {
    message,
    stack,
    code,
  };
};

const buildShellTelemetryEvent = (event: ShellTelemetryEvent): TelemetryEvent => {
  const baseContext = readBaseContext();
  const traceId = resolveTraceId() ?? undefined;

  return {
    eventType: mapShellEventType(event.type),
    eventName: event.type,
    timestamp: toIsoTimestamp(event.timestamp),
    traceId,
    context: {
      ...baseContext,
      tags: sanitizeTags(event.meta),
    },
    payload: event.payload,
    error: buildErrorInfo(event.type, event.payload),
  };
};

const emit = (event: unknown): void => {
  if (!isShellTelemetryEvent(event)) {
    return;
  }

  void sendTelemetry(buildShellTelemetryEvent(event));
};

const trackPageView = (path: string): void => {
  const baseContext = readBaseContext();
  const traceId = resolveTraceId() ?? undefined;

  void sendTelemetry({
    eventType: 'telemetry',
    eventName: 'page_view',
    timestamp: new Date().toISOString(),
    traceId,
    context: {
      ...baseContext,
      tags: {
        route: path,
      },
    },
    payload: {
      route: path,
    },
  });
};

const telemetryClient: TelemetryClient = {
  emit,
  trackPageView,
};

export default telemetryClient;
