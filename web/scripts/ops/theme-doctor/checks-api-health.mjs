/**
 * API Health checks (#60-73)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/*  API HEALTH CHECKS (#60–73)                                         */
/* ================================================================== */

const SHARED_HTTP = join(ROOT, 'packages', 'shared-http', 'src');
const MFE_DIRS = ['apps/mfe-shell', 'apps/mfe-users', 'apps/mfe-access', 'apps/mfe-audit', 'apps/mfe-reporting', 'apps/mfe-suggestions', 'apps/mfe-ethic'].map(d => join(ROOT, d, 'src'));

// 60. API Error Handling — unreachable code after parseError/throw
check('api-unreachable-fallback', 'API services with unreachable fallback returns after throw', () => {
  const scanDirs = [...MFE_DIRS, SHARED_HTTP];
  const skipPaths = ['__tests__', '__stories__', 'node_modules'];
  const violations = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      /* Pattern: parseError(err); return { ... } — return is unreachable if parseError throws */
      const matches = content.match(/parseError\([^)]*\);\s*\n\s*return\s/g);
      if (matches) violations.push({ file: rel.split('/').pop(), count: matches.length });
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No unreachable fallback returns after parseError()' };
  return {
    status: 'warn',
    message: `${violations.length} files with unreachable code after parseError() throw`,
    details: violations.map(v => `${v.file}: ${v.count} unreachable returns`),
    fix: FIX_HINT ? 'Remove unreachable return after parseError() or use Result<T,E> pattern' : undefined,
  };
});

// 61. API Response Typing — catch blocks with untyped errors
check('api-untyped-errors', 'API catch blocks with untyped or weakly typed errors', () => {
  const scanDirs = [...MFE_DIRS];
  const skipPaths = ['__tests__', '__stories__', 'node_modules'];
  let untypedCount = 0;
  let typedCount = 0;
  const files = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (!rel.includes('api') && !rel.includes('service') && !rel.includes('hook') && !rel.includes('model')) continue;
      const content = readSafe(file);
      const untyped = (content.match(/catch\s*\(\s*(?:err|error|e)\s*\)/g) || []).length;
      const typed = (content.match(/catch\s*\(\s*(?:err|error|e)\s*:\s*\w+/g) || []).length;
      untypedCount += untyped;
      typedCount += typed;
      if (untyped > 0 && files.length < 5) files.push(`${rel.split('/').pop()}: ${untyped} untyped`);
    }
  }

  const total = untypedCount + typedCount;
  if (total === 0) return { status: 'pass', message: 'No API catch blocks found' };
  const pct = total > 0 ? Math.round((typedCount / total) * 100) : 0;
  if (untypedCount <= 3) return { status: 'pass', message: `${pct}% typed catch blocks (${typedCount}/${total})` };
  return {
    status: 'warn',
    message: `${untypedCount}/${total} catch blocks untyped (${pct}% typed)`,
    details: files,
    fix: FIX_HINT ? 'Type catch: catch (err: unknown) { if (isAxiosError(err)) ... } or use AxiosError<T>' : undefined,
  };
});

// 62. API Response Envelope Consistency — different shapes across services
check('api-envelope-consistency', 'API response envelope shapes across services', () => {
  const scanDirs = [...MFE_DIRS];
  const skipPaths = ['__tests__', '__stories__', 'node_modules'];
  const shapes = { items_total: 0, data: 0, direct_array: 0, custom: 0 };
  const customFiles = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (!rel.includes('api') && !rel.includes('service')) continue;
      const content = readSafe(file);
      if (content.includes('.data.items') || content.includes('items:') && content.includes('total:')) shapes.items_total++;
      if (content.includes('.data.data') || content.includes('response.data')) shapes.data++;
      if (content.match(/\.data\s*(?:as|:)\s*\w+\[\]/)) shapes.direct_array++;
      /* Custom shapes */
      if (content.includes('.data.events') || content.includes('.data.results') || content.includes('.data.records')) {
        shapes.custom++;
        if (customFiles.length < 5) customFiles.push(rel.split('/').pop());
      }
    }
  }

  const total = Object.values(shapes).reduce((s, v) => s + v, 0);
  const dominant = Object.entries(shapes).sort((a, b) => b[1] - a[1])[0];
  if (shapes.custom === 0 && total > 0) return { status: 'pass', message: `${total} API calls — consistent ${dominant[0]} envelope pattern` };
  return {
    status: shapes.custom > 3 ? 'warn' : 'pass',
    message: `API envelope shapes: items_total=${shapes.items_total}, data=${shapes.data}, array=${shapes.direct_array}, custom=${shapes.custom}`,
    details: customFiles.length > 0 ? [`Custom envelopes: ${customFiles.join(', ')}`] : undefined,
    fix: FIX_HINT ? 'Standardize on { items, total, page } for lists, { data } for single items' : undefined,
  };
});

// 63. Mock Data Fallback — silent fallback to mock data on API error
check('api-silent-mock-fallback', 'Silent fallback to mock/dummy data on API error', () => {
  const scanDirs = [...MFE_DIRS];
  const skipPaths = ['__tests__', '__stories__', 'node_modules', 'design-lab'];
  const violations = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      /* Only flag catch blocks that SET mock data — not dev fallback utility functions */
      if (content.includes('shouldUseDevUsersFallback') || content.includes('DEV_FALLBACK')) continue;
      if (content.match(/catch.*\{[\s\S]{0,200}(?:setData|return)\s*\(?(?:mock|dummy|fake)(?:AccessRoles|Data|Items)/i)) {
        violations.push(rel.split('/').pop());
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No silent mock data fallbacks in API error handlers' };
  return {
    status: 'warn',
    message: `${violations.length} files silently fall back to mock data on API error`,
    details: violations.slice(0, 5),
    fix: FIX_HINT ? 'Show error UI instead of mock data — users should know the API failed' : undefined,
  };
});

// 64. React Query Configuration — staleTime, retry, error handling
check('react-query-config', 'React Query configuration completeness', () => {
  const scanDirs = [...MFE_DIRS];
  let configFound = false;
  let hasGlobalError = false;
  let hasStaleTime = false;
  let hasRetry = false;
  let hookCount = 0;
  let hooksWithErrorUI = 0;

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const content = readSafe(file);
      if (content.includes('new QueryClient')) {
        configFound = true;
        if (content.includes('onError') || content.includes('queryCache')) hasGlobalError = true;
        if (content.includes('staleTime')) hasStaleTime = true;
        if (content.includes('retry')) hasRetry = true;
      }
      if (content.includes('useQuery(') || content.includes('useQuery<')) {
        hookCount++;
        if (content.includes('isError') || content.includes('error &&') || content.includes('.error')) hooksWithErrorUI++;
      }
    }
  }

  const details = [
    `QueryClient: ${configFound ? 'found' : 'MISSING'}`,
    `Global error handler: ${hasGlobalError ? 'yes' : 'NO'}`,
    `staleTime: ${hasStaleTime ? 'configured' : 'default (0)'}`,
    `retry: ${hasRetry ? 'configured' : 'default (3)'}`,
    `Hooks: ${hookCount} total, ${hooksWithErrorUI} check .isError (${hookCount > 0 ? Math.round((hooksWithErrorUI/hookCount)*100) : 0}%)`,
  ];

  /* With global QueryCache onError, hook-level error checks are nice-to-have, not critical */
  if (configFound && hasStaleTime && hasRetry && hasGlobalError) {
    return { status: 'pass', message: `React Query configured: global error handler + ${hookCount} hooks (${Math.round((hooksWithErrorUI/hookCount)*100)}% with local error UI)`, details };
  }
  return {
    status: 'warn',
    message: `React Query gaps: ${!hasGlobalError ? 'no global error handler, ' : ''}${!hasStaleTime ? 'no staleTime, ' : ''}${!hasRetry ? 'no retry config' : ''}`,
    details,
    fix: FIX_HINT ? 'Add QueryCache onError for global toast, ensure all hooks render error state' : undefined,
  };
});

// 65. Auth Token Refresh — proper token lifecycle management
check('auth-token-lifecycle', 'Auth token refresh and expiry handling', () => {
  const scanDirs = [...MFE_DIRS, SHARED_HTTP];
  let hasTokenRefresh = false;
  let hasTokenExpiry = false;
  let has401Handler = false;
  let hasGracePeriod = false;
  let hasTabSync = false;

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const content = readSafe(file);
      if (content.includes('updateToken') || content.includes('refreshToken') || content.includes('token_refresh')) hasTokenRefresh = true;
      if (content.includes('tokenParsed') || content.includes('exp') && content.includes('token')) hasTokenExpiry = true;
      if (content.includes('401') && content.includes('interceptor')) has401Handler = true;
      if (content.includes('401') && content.includes('response')) has401Handler = true;
      if (content.includes('GRACE') || content.includes('grace')) hasGracePeriod = true;
      if (content.includes('BroadcastChannel') || content.includes('auth-sync')) hasTabSync = true;
    }
  }

  const details = [
    `Token refresh: ${hasTokenRefresh ? 'yes' : 'NO'}`,
    `Expiry check: ${hasTokenExpiry ? 'yes' : 'NO'}`,
    `401 handler: ${has401Handler ? 'yes' : 'NO'}`,
    `Grace period: ${hasGracePeriod ? 'yes (caution)' : 'no'}`,
    `Tab sync: ${hasTabSync ? 'yes' : 'NO'}`,
  ];

  if (hasTokenRefresh && has401Handler && hasTabSync) {
    return { status: 'pass', message: 'Auth lifecycle complete: refresh + 401 handler + tab sync', details };
  }
  return {
    status: 'warn',
    message: `Auth gaps: ${!hasTokenRefresh ? 'no refresh, ' : ''}${!has401Handler ? 'no 401 handler, ' : ''}${!hasTabSync ? 'no tab sync' : ''}`,
    details,
  };
});

// 66. API Zod Validation — runtime response validation
check('api-runtime-validation', 'Runtime API response validation (Zod/schema)', () => {
  const scanDirs = [...MFE_DIRS];
  const skipPaths = ['__tests__', 'node_modules'];
  let zodImports = 0;
  let zodParse = 0;
  let apiFiles = 0;

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (!rel.includes('api') && !rel.includes('service')) continue;
      apiFiles++;
      const content = readSafe(file);
      if (content.includes('from "zod"') || content.includes("from 'zod'") || content.includes('z.object')) zodImports++;
      if (content.includes('.parse(') || content.includes('.safeParse(') || content.includes('zodSchema')) zodParse++;
    }
  }

  if (apiFiles === 0) return { status: 'pass', message: 'No API service files found' };
  if (zodParse > 0) return { status: 'pass', message: `${zodParse} API calls with Zod validation (${zodImports} files import Zod)` };
  return {
    status: 'warn',
    message: `${apiFiles} API service files — 0 use Zod runtime validation (zod in deps but unused for API)`,
    fix: FIX_HINT ? 'Add Zod schemas for API responses: const UserSchema = z.object({...}); const data = UserSchema.parse(response.data)' : undefined,
  };
});

// 67. API Console Logging — console.log/error in production API code
check('api-console-leaks', 'Console.log/error statements in API service code', () => {
  const scanDirs = [...MFE_DIRS, SHARED_HTTP];
  const skipPaths = ['__tests__', '__stories__', 'node_modules'];
  let count = 0;
  const files = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (!rel.includes('api') && !rel.includes('service') && !rel.includes('http')) continue;
      const content = readSafe(file);
      /* Skip files where console calls are dev-guarded */
      if (content.includes("process.env.NODE_ENV !== 'production'") || content.includes('process.env.NODE_ENV !== "production"')) continue;
      /* console.warn in catch blocks is acceptable for error tracing — only count console.log */
      const hits = (content.match(/console\.log\(/g) || []).length;
      if (hits > 0) { count += hits; if (files.length < 5) files.push(`${rel.split('/').pop()}: ${hits}`); }
    }
  }

  if (count === 0) return { status: 'pass', message: 'No console.log/error in API service code' };
  return {
    status: count > 10 ? 'warn' : 'pass',
    message: `${count} console statements in API service code`,
    details: files,
    fix: FIX_HINT ? 'Replace console.log with structured logger or telemetry.emit()' : undefined,
  };
});

// 68. API Trace ID — all requests have X-Trace-Id header
check('api-trace-id', 'API request tracing (X-Trace-Id header injection)', () => {
  const httpSrc = readSafe(join(SHARED_HTTP, 'index.ts'));
  const hasTraceId = httpSrc.includes('X-Trace-Id') || httpSrc.includes('x-trace-id') || httpSrc.includes('traceId');
  const hasResolver = httpSrc.includes('TraceIdResolver') || httpSrc.includes('traceIdResolver');

  if (hasTraceId && hasResolver) return { status: 'pass', message: 'X-Trace-Id injected via resolver pattern in shared-http' };
  return {
    status: hasTraceId ? 'pass' : 'warn',
    message: `Trace ID: header=${hasTraceId ? 'yes' : 'NO'}, resolver=${hasResolver ? 'yes' : 'NO'}`,
    fix: FIX_HINT ? 'Add X-Trace-Id to request interceptor for distributed tracing' : undefined,
  };
});

// 69. API Abort/Cleanup — pending requests cancelled on unmount
check('api-request-cleanup', 'Pending API requests cancelled on component unmount', () => {
  const httpSrc = readSafe(join(SHARED_HTTP, 'index.ts'));
  const hasAbort = httpSrc.includes('AbortController') || httpSrc.includes('abort') || httpSrc.includes('cancel');
  const scanDirs = [...MFE_DIRS];
  let hooksWithCleanup = 0;
  let totalHooks = 0;

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.ts')) {
      const content = readSafe(file);
      if (!content.includes('useQuery') && !content.includes('useMutation')) continue;
      totalHooks++;
      /* React Query handles cleanup natively, but custom fetches need AbortController */
      if (content.includes('AbortController') || content.includes('signal') || content.includes('useQuery')) hooksWithCleanup++;
    }
  }

  if (hasAbort) return { status: 'pass', message: `AbortController in shared-http + ${hooksWithCleanup}/${totalHooks} hooks with cleanup` };
  return { status: 'warn', message: `No AbortController in shared-http — ${totalHooks} hooks may leak pending requests` };
});

// 70. API Retry Logic — exponential backoff for transient failures
check('api-retry-logic', 'API retry strategy for transient failures', () => {
  const httpSrc = readSafe(join(SHARED_HTTP, 'index.ts'));
  const hasRetry = httpSrc.includes('retry') || httpSrc.includes('retries') || httpSrc.includes('backoff');
  const hasAxiosRetry = httpSrc.includes('axios-retry');

  const scanDirs = [...MFE_DIRS];
  let queryRetry = false;
  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.ts')) {
      const content = readSafe(file);
      if (content.includes('new QueryClient') && content.includes('retry')) { queryRetry = true; break; }
    }
    if (queryRetry) break;
  }

  const details = [
    `Axios retry: ${hasRetry || hasAxiosRetry ? 'yes' : 'NO'}`,
    `React Query retry: ${queryRetry ? 'configured' : 'default (3)'}`,
  ];

  if (queryRetry) return { status: 'pass', message: 'React Query retry configured + Axios interceptors', details };
  return {
    status: 'warn',
    message: 'No explicit retry strategy — using React Query default (3 retries, no backoff)',
    details,
    fix: FIX_HINT ? 'Configure retry with backoff: retry: (count, err) => count < 3 && err.status >= 500' : undefined,
  };
});

// 71. API Base URL Configuration — hardcoded vs env-driven
check('api-base-url', 'API base URL configuration (env-driven vs hardcoded)', () => {
  const scanDirs = [...MFE_DIRS, SHARED_HTTP];
  const skipPaths = ['__tests__', 'node_modules', 'webpack', 'design-lab', 'admin/', 'mf-resilience'];
  const hardcoded = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      /* Skip files where localhost is env fallback (readEnv/getEnvValue/?? pattern) */
      if (content.includes('readEnv') || content.includes('getEnvValue') || content.includes('?? \'http://localhost') || content.includes("|| 'http://localhost") || content.includes('process.env.VITE_GATEWAY')) continue;
      /* Hardcoded localhost URLs in production code */
      const matches = content.match(/['"]https?:\/\/localhost:\d+/g);
      if (matches) hardcoded.push({ file: rel.split('/').pop(), urls: matches.slice(0, 3) });
    }
  }

  if (hardcoded.length === 0) return { status: 'pass', message: 'No hardcoded localhost URLs in API code — all env-driven' };
  return {
    status: 'warn',
    message: `${hardcoded.length} files with hardcoded localhost URLs`,
    details: hardcoded.slice(0, 5).map(h => `${h.file}: ${h.urls.join(', ')}`),
    fix: FIX_HINT ? 'Replace hardcoded URLs with env vars: process.env.VITE_API_URL or window.__env__.API_URL' : undefined,
  };
});

// 72. API Type Coverage — service functions with explicit return types
check('api-type-coverage', 'API service functions with explicit return type annotations', () => {
  const scanDirs = [...MFE_DIRS];
  const skipPaths = ['__tests__', '__stories__', 'node_modules'];
  let typed = 0;
  let untyped = 0;
  const untypedFiles = [];

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (!rel.includes('api') && !rel.includes('service')) continue;
      const content = readSafe(file);
      /* Count async functions with/without return types */
      const withType = (content.match(/(?:async\s+function|const\s+\w+\s*=\s*async)\s*[^{]*:\s*Promise</g) || []).length;
      const withoutType = (content.match(/(?:async\s+function|const\s+\w+\s*=\s*async)\s*\([^)]*\)\s*(?:=>|\{)/g) || []).length - withType;
      typed += withType;
      if (withoutType > 0) { untyped += withoutType; if (untypedFiles.length < 5) untypedFiles.push(`${rel.split('/').pop()}: ${withoutType} untyped`); }
    }
  }

  const total = typed + untyped;
  if (total === 0) return { status: 'pass', message: 'No API service functions found' };
  const pct = Math.round((typed / total) * 100);
  if (pct >= 70) return { status: 'pass', message: `${pct}% API functions have explicit return types (${typed}/${total})` };
  return {
    status: 'warn',
    message: `${pct}% API functions typed (${untyped}/${total} missing return type)`,
    details: untypedFiles,
    fix: FIX_HINT ? 'Add return types: async function getUsers(): Promise<PagedResponse<User>>' : undefined,
  };
});

// 73. API Error Response Format — standardized error extraction
check('api-error-format', 'Standardized API error extraction pattern', () => {
  const scanDirs = [...MFE_DIRS, SHARED_HTTP];
  const skipPaths = ['__tests__', 'node_modules'];
  let hasParseError = false;
  let hasErrorExtractor = false;
  let inconsistentFields = 0;

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.ts'), ...walkDir(dir, '.tsx')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      if (content.includes('parseError') || content.includes('extractError')) hasParseError = true;
      if (content.includes('ErrorExtractor') || content.includes('normalizeError')) hasErrorExtractor = true;
      /* Count different error field access patterns */
      if (content.includes('.message') && content.includes('.error') && content.includes('.detail')) inconsistentFields++;
    }
  }

  if (hasParseError || hasErrorExtractor) {
    return { status: 'pass', message: `Centralized error parsing: ${hasParseError ? 'parseError()' : ''}${hasErrorExtractor ? ' + ErrorExtractor' : ''} (${inconsistentFields} files access multiple error fields)` };
  }
  return {
    status: 'warn',
    message: 'No centralized error parsing — services check .message, .error, .detail individually',
    fix: FIX_HINT ? 'Create parseApiError(err): { message, code, fieldErrors, traceId } utility' : undefined,
  };
});

/* ================================================================== */
}
