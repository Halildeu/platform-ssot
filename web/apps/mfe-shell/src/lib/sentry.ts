/**
 * Sentry error tracking integration.
 * Activated by setting VITE_SENTRY_DSN environment variable.
 */

interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
}

let initialized = false;

export function initSentry(config?: Partial<SentryConfig>): void {
  const dsn = config?.dsn || import.meta.env?.VITE_SENTRY_DSN;
  if (!dsn || initialized) return;

  const sentryConfig: SentryConfig = {
    dsn,
    environment: config?.environment || import.meta.env?.MODE || 'development',
    release: config?.release || import.meta.env?.VITE_APP_VERSION,
    tracesSampleRate: config?.tracesSampleRate ?? 0.1,
    replaysSessionSampleRate: config?.replaysSessionSampleRate ?? 0.1,
  };

  // Dynamic import to avoid bundling Sentry when not configured
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: sentryConfig.environment,
      release: sentryConfig.release,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: sentryConfig.tracesSampleRate,
      replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
    });
    initialized = true;
    console.info('[Sentry] Initialized for', sentryConfig.environment);
  }).catch(() => {
    // Sentry package not installed — silent fallback
    console.debug('[Sentry] @sentry/react not available, skipping initialization');
  });
}

export function captureError(error: Error, context?: Record<string, unknown>): void {
  if (!initialized) {
    console.error('[Error]', error.message, context);
    return;
  }
  import('@sentry/react').then((Sentry) => {
    Sentry.captureException(error, { extra: context });
  });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (!initialized) {
    console.log(`[${level}]`, message);
    return;
  }
  import('@sentry/react').then((Sentry) => {
    Sentry.captureMessage(message, level);
  });
}

export function setUser(user: { id: string; email?: string; username?: string } | null): void {
  if (!initialized) return;
  import('@sentry/react').then((Sentry) => {
    Sentry.setUser(user);
  });
}
