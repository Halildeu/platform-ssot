/**
 * OpenTelemetry Bridge
 *
 * Connects frontend traces to backend traces via trace context propagation.
 *
 * Architecture:
 * - Uses W3C Trace Context headers (traceparent, tracestate)
 * - Generates trace ID on navigation/interaction
 * - Attaches to fetch/XHR requests
 * - Correlates with Sentry via trace ID
 *
 * Integration points:
 * - initOtel() called from bootstrap.tsx after initSentry()
 * - Provides getTraceContext() for manual instrumentation
 * - Auto-instruments fetch via monkey-patch
 */

export interface TraceContext {
  traceId: string;
  spanId: string;
  traceparent: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < bytes; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

function generateTraceId(): string {
  return randomHex(16); // 32 hex chars
}

function generateSpanId(): string {
  return randomHex(8); // 16 hex chars
}

function formatTraceparent(traceId: string, spanId: string): string {
  // W3C Trace Context format: version-traceid-parentid-traceflags
  return `00-${traceId}-${spanId}-01`;
}

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

let currentTraceId = '';
let currentSpanId = '';
let initialized = false;
let originalFetch: typeof fetch | null = null;

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function initOtel(options?: { serviceName?: string; environment?: string }): void {
  if (typeof window === 'undefined' || initialized) return;

  const serviceName = options?.serviceName ?? 'mfe-shell';
  const environment = options?.environment ?? (import.meta.env?.MODE || 'development');

  // Generate root trace context for this page session
  currentTraceId = generateTraceId();
  currentSpanId = generateSpanId();

  // Monkey-patch fetch to add traceparent header
  originalFetch = window.fetch;
  window.fetch = function patchedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Skip trace headers for cross-origin auth requests (Keycloak, OAuth)
    // Adding custom headers to these causes CORS preflight failures
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
    const isAuthEndpoint = url.includes('/realms/') || url.includes('/openid-connect/') || url.includes('/oauth2/');

    if (isAuthEndpoint) {
      return originalFetch!.call(window, input, init);
    }

    const headers = new Headers(init?.headers);

    // Only add trace headers if not already present
    if (!headers.has('traceparent')) {
      const spanId = generateSpanId();
      headers.set('traceparent', formatTraceparent(currentTraceId, spanId));
      headers.set('tracestate', `mfe=${serviceName}`);
    }

    return originalFetch!.call(window, input, { ...init, headers });
  };

  initialized = true;

  if (process.env.NODE_ENV === 'development') {
    console.info(
      `[OTel] Initialized — service=${serviceName} env=${environment} traceId=${currentTraceId}`,
    );
  }
}

export function getTraceContext(): TraceContext {
  if (!currentTraceId) {
    // Generate on demand if initOtel hasn't been called
    currentTraceId = generateTraceId();
    currentSpanId = generateSpanId();
  }

  return {
    traceId: currentTraceId,
    spanId: currentSpanId,
    traceparent: formatTraceparent(currentTraceId, currentSpanId),
  };
}

export function createSpan(name: string): { end: () => void } {
  const spanId = generateSpanId();
  const startTime = performance.now();

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[OTel] Span start: ${name} (${spanId})`);
  }

  return {
    end() {
      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[OTel] Span end: ${name} (${spanId}) — ${duration.toFixed(1)}ms`);
      }

      // Report to Sentry as custom measurement if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).__SENTRY__) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).__SENTRY__.setMeasurement?.(
            `otel.${name}`,
            duration,
            'millisecond',
          );
        } catch {
          // silent
        }
      }
    },
  };
}
