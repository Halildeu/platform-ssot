import axios from 'axios';
import type { TelemetryEvent } from '@mfe/shared-types';

// Tek telemetry client. PII göndermemeye dikkat edin; userHash/anonim kimlik kullanın.

type EnvRecord = Record<string, string | undefined>;

const getEnvValue = (key: string): string | undefined => {
  // Node / build-time env
  if (typeof process !== 'undefined' && typeof process.env?.[key] === 'string') {
    return process.env[key];
  }
  // Runtime window env (örn. window.__env__)
  if (typeof window !== 'undefined') {
    const win = window as Window & {
      __env__?: EnvRecord;
      __ENV__?: EnvRecord;
    };
    const candidate = win.__env__?.[key] ?? win.__ENV__?.[key];
    if (typeof candidate === 'string') {
      return candidate;
    }
  }
  return undefined;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveEndpoint = (): string => {
  const explicit =
    getEnvValue('TELEMETRY_ENDPOINT')
    ?? getEnvValue('VITE_TELEMETRY_ENDPOINT');
  if (explicit && explicit.trim().length > 0) {
    return explicit;
  }

  const base =
    getEnvValue('TELEMETRY_BASE_URL')
    ?? getEnvValue('VITE_TELEMETRY_BASE_URL');
  if (base && base.trim().length > 0) {
    return `${trimTrailingSlash(base)}/telemetry/events`;
  }

  // Endpoint tanımsız ise boş döndür; dev/local'de NO-OP için kullanılacak.
  return '';
};

const isDevEnv = (() => {
  const nodeEnv =
    typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : undefined;
  if (nodeEnv && nodeEnv !== 'production') {
    return true;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      return true;
    }
  }
  return false;
})();

const isTelemetryDisabledFlag = () => {
  const disabled =
    getEnvValue('TELEMETRY_DISABLED')
    ?? getEnvValue('VITE_TELEMETRY_DISABLED');
  return disabled === 'true' || disabled === '1';
};

export const sendTelemetry = async (event: TelemetryEvent): Promise<void> => {
  const endpoint = resolveEndpoint();
  const shouldSkip =
    isDevEnv
    || isTelemetryDisabledFlag()
    || !endpoint
    || typeof window === 'undefined';

  if (shouldSkip) {
    if (isDevEnv) {
      // Dev/local ortamında veya endpoint yokken ağ isteği atma.
       
      console.debug('[telemetry] dev veya disabled, istek atılmıyor', {
        endpoint,
      });
    }
    return;
  }

  try {
    await axios.post(endpoint, event, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    // Telemetry başarısız olsa bile UI’yi bloklamayalım; yalnızca debug log bırak.
    if (isDevEnv) {
       
      console.debug('[telemetry] gönderilemedi', error);
    }
  }
};

export const trackPageView = (payload: TelemetryEvent) => sendTelemetry(payload);
export const trackAction = (payload: TelemetryEvent) => sendTelemetry(payload);
export const trackMutation = (payload: TelemetryEvent) => sendTelemetry(payload);

export default {
  sendTelemetry,
  trackPageView,
  trackAction,
  trackMutation,
};
