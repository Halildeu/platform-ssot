import type { Page, ConsoleMessage, Request, Response } from '@playwright/test';

type RegexLike = RegExp | string;

export type TelemetryNetworkAllowlistRule = {
  url?: RegexLike;
  status?: RegexLike;
  method?: RegexLike;
};

export type TelemetryAllowlists = {
  console_error_allowlist?: RegexLike[];
  console_warn_allowlist?: RegexLike[];
  network_allowlist?: TelemetryNetworkAllowlistRule[];
  readonly_allowlist?: TelemetryNetworkAllowlistRule[];
};

export type TelemetryConsoleEntry = {
  ts: string;
  level: string;
  text: string;
  location?: {
    url?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
  allowed: boolean;
};

export type TelemetryPageErrorEntry = {
  ts: string;
  message: string;
  stack?: string;
};

export type TelemetryNetworkEntry = {
  ts: string;
  url: string;
  method: string;
  resourceType: string;
  status?: number;
  failureText?: string;
  hasAuthHeader: boolean;
  headers?: Record<string, string>;
  timing?: Record<string, unknown>;
  allowed: boolean;
};

export type TelemetrySummary = {
  consoleErrors: number;
  consoleErrorsAllowed: number;
  consoleWarns: number;
  consoleWarnsAllowed: number;
  pageErrors: number;
  network401: number;
  network403: number;
  network5xx: number;
  networkFailures: number;
  readonlyViolations: number;
};

export type TelemetryResult = {
  startedAt: string;
  endedAt: string;
  consoleErrors: TelemetryConsoleEntry[];
  consoleWarns: TelemetryConsoleEntry[];
  consoleLogs: TelemetryConsoleEntry[];
  pageErrors: TelemetryPageErrorEntry[];
  network: TelemetryNetworkEntry[];
  readonlyViolations: TelemetryNetworkEntry[];
  summary: TelemetrySummary;
};

export type TelemetryCollector = {
  stop: () => TelemetryResult;
};

export type TelemetryOptions = {
  readonlyEnforce?: boolean;
  readonlyPathRegex?: RegexLike;
};

const toRegExp = (value: RegexLike): RegExp => (value instanceof RegExp ? value : new RegExp(value));

const compileAllowlists = (allowlists: TelemetryAllowlists | undefined) => ({
  consoleError: (allowlists?.console_error_allowlist ?? []).map(toRegExp),
  consoleWarn: (allowlists?.console_warn_allowlist ?? []).map(toRegExp),
  network: (allowlists?.network_allowlist ?? []).map((rule) => ({
    url: rule.url ? toRegExp(rule.url) : null,
    status: rule.status ? toRegExp(rule.status) : null,
    method: rule.method ? toRegExp(rule.method) : null,
  })),
  readonly: (allowlists?.readonly_allowlist ?? []).map((rule) => ({
    url: rule.url ? toRegExp(rule.url) : null,
    method: rule.method ? toRegExp(rule.method) : null,
  })),
});

const sanitizeHeaders = (headers: Record<string, string>): Record<string, string> => {
  const redacted = new Set(['authorization', 'cookie', 'set-cookie']);
  const result: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    if (redacted.has(normalizedKey)) {
      result[key] = '<redacted>';
      return;
    }
    result[key] = value;
  });
  return result;
};

const sanitizeUrl = (rawUrl: string): string => {
  try {
    const parsed = new URL(rawUrl);
    const keysToRedact = /(code|token|session_state|state|access_token|refresh_token|id_token|password)/i;
    parsed.searchParams.forEach((_value, key) => {
      if (keysToRedact.test(key)) {
        parsed.searchParams.set(key, '<redacted>');
      }
    });
    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

const isXhrOrFetch = (resourceType: string) => resourceType === 'xhr' || resourceType === 'fetch';

const hasAuthHeader = (request: Request) => {
  const headers = request.headers();
  return Boolean(headers.authorization || headers.Authorization);
};

const isNetworkAllowed = (
  compiled: ReturnType<typeof compileAllowlists>,
  network: Pick<TelemetryNetworkEntry, 'url' | 'status' | 'method'>,
) => {
  if (compiled.network.length === 0) return false;
  return compiled.network.some((rule) => {
    if (rule.url && !rule.url.test(network.url)) return false;
    if (rule.method && !rule.method.test(network.method)) return false;
    if (rule.status) {
      const statusValue = network.status === undefined ? '' : String(network.status);
      if (!rule.status.test(statusValue)) return false;
    }
    return true;
  });
};

const isReadonlyViolation = (method: string) => {
  const normalized = method.trim().toUpperCase();
  return normalized !== 'GET' && normalized !== 'HEAD' && normalized !== 'OPTIONS';
};

const matchesReadonlyPath = (rawUrl: string, pathRegex: RegExp) => {
  try {
    const parsed = new URL(rawUrl);
    return pathRegex.test(parsed.pathname);
  } catch {
    return pathRegex.test(rawUrl);
  }
};

const isReadonlyAllowed = (
  compiled: ReturnType<typeof compileAllowlists>,
  network: Pick<TelemetryNetworkEntry, 'url' | 'method'>,
) => {
  if (compiled.readonly.length === 0) return false;
  return compiled.readonly.some((rule) => {
    if (rule.url && !rule.url.test(network.url)) return false;
    if (rule.method && !rule.method.test(network.method)) return false;
    return true;
  });
};

const isConsoleAllowed = (allowlist: RegExp[], message: string, locationUrl?: string) => {
  if (allowlist.length === 0) return false;
  const probe = locationUrl ? `${message} ${locationUrl}` : message;
  return allowlist.some((regex) => regex.test(message) || regex.test(probe));
};

const captureConsole = (
  msg: ConsoleMessage,
  allowlist: RegExp[],
): Omit<TelemetryConsoleEntry, 'allowed'> & { allowed: boolean } => {
  const location = msg.location();
  const text = msg.text();
  const sanitizedLocationUrl = location?.url ? sanitizeUrl(location.url) : undefined;
  return {
    ts: new Date().toISOString(),
    level: msg.type(),
    text,
    location: sanitizedLocationUrl
      ? { url: sanitizedLocationUrl, lineNumber: location.lineNumber, columnNumber: location.columnNumber }
      : undefined,
    allowed: isConsoleAllowed(allowlist, text, sanitizedLocationUrl),
  };
};

const captureResponse = async (
  response: Response,
  compiledAllowlists: ReturnType<typeof compileAllowlists>,
): Promise<TelemetryNetworkEntry | null> => {
  const request = response.request();
  const resourceType = request.resourceType();
  if (!isXhrOrFetch(resourceType)) return null;

  const url = sanitizeUrl(response.url());
  const method = request.method();
  const status = response.status();
  const headers = sanitizeHeaders(response.headers());
  const timing = request.timing() as unknown as Record<string, unknown>;
  const allowed = isNetworkAllowed(compiledAllowlists, { url, status, method });
  return {
    ts: new Date().toISOString(),
    url,
    method,
    resourceType,
    status,
    hasAuthHeader: hasAuthHeader(request),
    headers,
    timing,
    allowed,
  };
};

const captureRequestFailed = (
  request: Request,
  compiledAllowlists: ReturnType<typeof compileAllowlists>,
): TelemetryNetworkEntry | null => {
  const resourceType = request.resourceType();
  if (!isXhrOrFetch(resourceType)) return null;
  const failureText = request.failure()?.errorText ?? 'requestfailed';
  // Navigasyon kaynaklı iptaller gürültü üretir (özellikle auth bootstrap sırasında).
  if (/net::err_aborted/i.test(failureText)) {
    return null;
  }
  const url = sanitizeUrl(request.url());
  const method = request.method();
  const allowed = isNetworkAllowed(compiledAllowlists, { url, status: undefined, method });
  return {
    ts: new Date().toISOString(),
    url,
    method,
    resourceType,
    failureText,
    hasAuthHeader: hasAuthHeader(request),
    allowed,
  };
};

export const createTelemetryCollector = (
  page: Page,
  allowlists?: TelemetryAllowlists,
  options?: TelemetryOptions,
): TelemetryCollector => {
  const startedAt = new Date().toISOString();
  const compiledAllowlists = compileAllowlists(allowlists);
  const readonlyEnforce = Boolean(options?.readonlyEnforce);
  const readonlyPathRegex = toRegExp(options?.readonlyPathRegex ?? '/api/');

  const consoleErrors: TelemetryConsoleEntry[] = [];
  const consoleWarns: TelemetryConsoleEntry[] = [];
  const consoleLogs: TelemetryConsoleEntry[] = [];
  const pageErrors: TelemetryPageErrorEntry[] = [];
  const network: TelemetryNetworkEntry[] = [];

  const onConsole = (message: ConsoleMessage) => {
    const level = message.type();
    if (level === 'error') {
      consoleErrors.push(captureConsole(message, compiledAllowlists.consoleError));
      return;
    }
    if (level === 'warning' || level === 'warn') {
      consoleWarns.push(captureConsole(message, compiledAllowlists.consoleWarn));
      return;
    }
    consoleLogs.push({
      ...captureConsole(message, []),
      allowed: true,
    });
  };

  const onPageError = (error: Error) => {
    pageErrors.push({
      ts: new Date().toISOString(),
      message: error.message ?? String(error),
      stack: error.stack,
    });
  };

  const onRequestFailed = (request: Request) => {
    const entry = captureRequestFailed(request, compiledAllowlists);
    if (entry) network.push(entry);
  };

  const onResponse = async (response: Response) => {
    const entry = await captureResponse(response, compiledAllowlists);
    if (entry) network.push(entry);
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);

  const stop = () => {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
    page.off('requestfailed', onRequestFailed);
    page.off('response', onResponse);

    const endedAt = new Date().toISOString();
    const consoleErrorsAllowed = consoleErrors.filter((item) => item.allowed).length;
    const consoleWarnsAllowed = consoleWarns.filter((item) => item.allowed).length;

    const network401 = network.filter((item) => item.status === 401 && !item.allowed).length;
    const network403 = network.filter((item) => item.status === 403 && !item.allowed).length;
    const network5xx = network.filter((item) => {
      const status = item.status ?? 0;
      return status >= 500 && status <= 599 && !item.allowed;
    }).length;
    const networkFailures = network.filter((item) => Boolean(item.failureText) && !item.allowed).length;

    const readonlyViolations = readonlyEnforce
      ? network.filter(
          (item) =>
            matchesReadonlyPath(item.url, readonlyPathRegex) &&
            isReadonlyViolation(item.method) &&
            !isReadonlyAllowed(compiledAllowlists, item),
        )
      : [];

    return {
      startedAt,
      endedAt,
      consoleErrors,
      consoleWarns,
      consoleLogs,
      pageErrors,
      network,
      readonlyViolations,
      summary: {
        consoleErrors: consoleErrors.length - consoleErrorsAllowed,
        consoleErrorsAllowed,
        consoleWarns: consoleWarns.length - consoleWarnsAllowed,
        consoleWarnsAllowed,
        pageErrors: pageErrors.length,
        network401,
        network403,
        network5xx,
        networkFailures,
        readonlyViolations: readonlyViolations.length,
      },
    };
  };

  return { stop };
};
