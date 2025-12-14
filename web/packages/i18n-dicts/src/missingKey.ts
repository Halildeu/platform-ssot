import type { TelemetryEvent } from '@mfe/shared-types';
import { trackAction, resolveTraceId } from '@mfe/shared-http';

type MissingKeyPayload = {
  app?: string;
  route?: string;
  namespace: string;
  key: string;
  locale: string;
};

const sentKeys = new Set<string>();
const LIMIT_PER_KEY = 3;

export const emitMissingKey = ({ app, route, namespace, key, locale }: MissingKeyPayload) => {
  const cacheKey = `${locale}:${namespace}:${key}`;
  const seen = sentKeys.has(cacheKey);
  if (!seen && sentKeys.size < 1000) {
    sentKeys.add(cacheKey);
  }
  // rate-limit: aynı key/locale için LIMIT_PER_KEY'den fazla event gönderme
  const occurrences = Array.from(sentKeys).filter((k) => k === cacheKey).length;
  if (occurrences > LIMIT_PER_KEY) {
    return;
  }

  const traceId = resolveTraceId() ?? undefined;
  const event: TelemetryEvent = {
    eventType: 'telemetry',
    eventName: 'i18n_missing_key',
    timestamp: new Date().toISOString(),
    traceId,
    context: {
      app: app ?? 'unknown',
      env: (process.env.APP_ENVIRONMENT as TelemetryEvent['context']['env']) || 'local',
      version: process.env.APP_RELEASE || 'dev',
      tags: { route: route ?? 'unknown', namespace, key, locale },
    },
    payload: { namespace, key, locale, route: route ?? 'unknown' },
  };
  void trackAction(event);
};
