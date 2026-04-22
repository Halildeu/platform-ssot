import telemetryClient from './telemetry-client';

export type RuntimeErrorSource =
  | 'early-window-error'
  | 'window-error'
  | 'unhandledrejection'
  | 'console-error';

export interface RuntimeErrorRecord {
  id: string;
  source: RuntimeErrorSource;
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  route: string;
  href: string;
  timestamp: string;
  occurrences: number;
}

type EarlyErrorRecord = {
  msg?: string;
  file?: string;
  line?: number;
  col?: number;
};

declare global {
  interface Window {
    __earlyErrors?: EarlyErrorRecord[];
    __shellRuntimeErrors?: RuntimeErrorRecord[];
    __shellRuntimeMonitorInstalled?: boolean;
  }
}

const MAX_BUFFER_SIZE = 100;

const hasWindow = (): boolean => typeof window !== 'undefined';

const getRuntimeBuffer = (): RuntimeErrorRecord[] => {
  if (!hasWindow()) {
    return [];
  }
  if (!Array.isArray(window.__shellRuntimeErrors)) {
    window.__shellRuntimeErrors = [];
  }
  return window.__shellRuntimeErrors;
};

const toRuntimeLocation = () => {
  if (!hasWindow()) {
    return { route: 'n/a', href: 'n/a' };
  }
  return {
    route: window.location?.pathname ?? 'n/a',
    href: window.location?.href ?? 'n/a',
  };
};

const toFingerprint = (record: Omit<RuntimeErrorRecord, 'id' | 'timestamp' | 'occurrences'>): string => {
  return [
    record.source,
    record.message,
    record.filename ?? '',
    record.lineno ?? '',
    record.colno ?? '',
    record.route,
  ].join('::');
};

const safeJsonClone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

const persistRuntimeError = (
  record: Omit<RuntimeErrorRecord, 'id' | 'timestamp' | 'occurrences'>,
): void => {
  if (!hasWindow()) {
    return;
  }

  const buffer = getRuntimeBuffer();
  const fingerprint = toFingerprint(record);
  const existing = buffer.find((item) => toFingerprint(item) === fingerprint);

  if (existing) {
    existing.occurrences += 1;
    existing.timestamp = new Date().toISOString();
  } else {
    buffer.unshift({
      ...record,
      id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      occurrences: 1,
    });
    if (buffer.length > MAX_BUFFER_SIZE) {
      buffer.length = MAX_BUFFER_SIZE;
    }
  }

  const latest = buffer[0];
  window.dispatchEvent(
    new CustomEvent('app:runtime-error', {
      detail: safeJsonClone(latest),
    }),
  );

  telemetryClient.emit({
    type: `browser_${latest.source}`,
    payload: {
      message: latest.message,
      stack: latest.stack,
      filename: latest.filename,
      lineno: latest.lineno,
      colno: latest.colno,
      href: latest.href,
      route: latest.route,
      occurrences: latest.occurrences,
    },
    meta: {
      source: latest.source,
      route: latest.route,
    },
  });
};

const toMessage = (value: unknown): string => {
  if (value instanceof Error) {
    return value.message || value.name || 'Unknown error';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object') {
    const candidate = value as { message?: unknown };
    if (typeof candidate.message === 'string') {
      return candidate.message;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value ?? 'Unknown error');
};

const toStack = (value: unknown): string | undefined => {
  if (value instanceof Error && typeof value.stack === 'string' && value.stack.trim()) {
    return value.stack;
  }
  if (value && typeof value === 'object') {
    const candidate = value as { stack?: unknown };
    if (typeof candidate.stack === 'string' && candidate.stack.trim()) {
      return candidate.stack;
    }
  }
  return undefined;
};

const captureEarlyErrors = (): void => {
  if (!hasWindow() || !Array.isArray(window.__earlyErrors)) {
    return;
  }

  const earlyErrors = [...window.__earlyErrors];
  window.__earlyErrors = [];

  earlyErrors.forEach((entry) => {
    const location = toRuntimeLocation();
    persistRuntimeError({
      source: 'early-window-error',
      message: toMessage(entry.msg),
      filename: entry.file,
      lineno: entry.line,
      colno: entry.col,
      route: location.route,
      href: location.href,
    });
  });
};

const handleWindowError = (event: ErrorEvent): void => {
  const location = toRuntimeLocation();
  persistRuntimeError({
    source: 'window-error',
    message: toMessage(event.error ?? event.message),
    stack: toStack(event.error),
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    route: location.route,
    href: location.href,
  });
};

const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
  const location = toRuntimeLocation();
  persistRuntimeError({
    source: 'unhandledrejection',
    message: toMessage(event.reason),
    stack: toStack(event.reason),
    route: location.route,
    href: location.href,
  });
};

const handleConsoleError = (args: unknown[]): void => {
  const location = toRuntimeLocation();
  const firstError = args.find((value) => value instanceof Error);
  const message = args.map((value) => toMessage(value)).join(' ').trim();

  persistRuntimeError({
    source: 'console-error',
    message: message || 'console.error',
    stack: toStack(firstError),
    route: location.route,
    href: location.href,
  });
};

export const initRuntimeErrorMonitor = (): void => {
  if (!hasWindow() || window.__shellRuntimeMonitorInstalled) {
    return;
  }

  window.__shellRuntimeMonitorInstalled = true;
  getRuntimeBuffer();
  captureEarlyErrors();

  const originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    handleConsoleError(args);
    originalConsoleError(...args);
  };

  window.addEventListener('error', handleWindowError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
};
