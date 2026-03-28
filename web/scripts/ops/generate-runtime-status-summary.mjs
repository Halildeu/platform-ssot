#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');

const nowIsoUtc = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }
  return args[index + 1] ?? fallback;
};

const resolveOutputDir = () => {
  const provided = getArg('--out-dir');
  if (!provided) {
    return path.join(webRoot, 'test-results', 'ops', 'runtime-status');
  }
  if (path.isAbsolute(provided)) {
    return provided;
  }
  return path.resolve(webRoot, provided);
};

const outDir = resolveOutputDir();
const summaryJsonPath = path.join(outDir, 'runtime-status-summary.v1.json');
const summaryMarkdownPath = path.join(outDir, 'runtime-status-summary.md');

const toRepoRelative = (absolutePath) => path.relative(repoRoot, absolutePath) || '.';

const readJsonIfExists = (absolutePath) => {
  if (!existsSync(absolutePath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8'));
  } catch {
    return null;
  }
};

const normalizeStatus = (value) => {
  const normalized = String(value ?? '').trim().toUpperCase();
  if (!normalized) {
    return 'UNKNOWN';
  }
  if (['OK', 'UP', 'PASS', 'PASSED'].includes(normalized)) {
    return 'OK';
  }
  if (['FAIL', 'FAILED', 'ERROR', 'DOWN'].includes(normalized)) {
    return 'FAILED';
  }
  return normalized;
};

const pickSessionId = (payload) =>
  payload?.session?.session_id
  ?? payload?.current_session?.session_id
  ?? payload?.session_id
  ?? null;

const pickGeneratedAt = (payload) =>
  payload?.generated_at
  ?? payload?.finishedAt
  ?? payload?.session?.created_at
  ?? payload?.current_session?.created_at
  ?? payload?.created_at
  ?? payload?.startedAt
  ?? null;

const pickModes = (payload) => ({
  startup_mode: payload?.startup_mode ?? null,
  shutdown_mode: payload?.shutdown_mode ?? null,
});

const pickExitCodes = (payload) => ({
  target_exit_code: Number.isInteger(payload?.target_exit_code) ? payload.target_exit_code : null,
  lane_exit_code: Number.isInteger(payload?.lane_exit_code) ? payload.lane_exit_code : null,
});

const summarizeSmokeSteps = (payload) => {
  if (!Array.isArray(payload?.steps)) {
    return null;
  }
  return {
    step_count: payload.steps.length,
    step_names: payload.steps.map((step) => String(step?.step ?? '').trim()).filter(Boolean),
    error: typeof payload?.error === 'string' && payload.error.length > 0 ? payload.error : null,
  };
};

const sourceSpecs = [
  {
    id: 'frontend_stack_auth_business_routes',
    group: 'frontend',
    required: false,
    absolutePath: path.join(webRoot, 'test-results', 'diagnostics', 'frontend-stack', 'auth-business-routes', 'stack-run-report.v1.json'),
  },
  {
    id: 'frontend_stack_auth_business_routes_live',
    group: 'frontend',
    required: false,
    absolutePath: path.join(webRoot, 'test-results', 'diagnostics', 'frontend-stack', 'auth-business-routes-live', 'stack-run-report.v1.json'),
  },
  {
    id: 'frontend_runtime_guard_auth_business_routes',
    group: 'frontend',
    required: false,
    absolutePath: path.join(webRoot, 'test-results', 'diagnostics', 'frontend-stack', 'auth-business-routes', 'web-runtime-guard.v1.json'),
  },
  {
    id: 'frontend_backend_guard_auth_business_routes',
    group: 'frontend',
    required: false,
    absolutePath: path.join(webRoot, 'test-results', 'diagnostics', 'frontend-stack', 'auth-business-routes', 'backend-runtime-guard-wait.v1.json'),
  },
  {
    id: 'web_runtime_guard',
    group: 'frontend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'web_runtime_guard.v1.json'),
  },
  {
    id: 'web_backend_guard_wait',
    group: 'frontend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'web_backend_guard_wait.v1.json'),
  },
  {
    id: 'backend_runtime_lane_status',
    group: 'backend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'backend_runtime_lane.status.v1.json'),
  },
  {
    id: 'backend_runtime_guard',
    group: 'backend',
    required: true,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'backend_runtime_guard.v1.json'),
  },
  {
    id: 'backend_runtime_lane_restore_guard',
    group: 'backend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'backend_runtime_lane.restore_guard.v1.json'),
  },
  {
    id: 'backend_compose_runtime_lane_status',
    group: 'backend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'backend_compose_runtime_lane.status.v1.json'),
  },
  {
    id: 'backend_compose_runtime_guard',
    group: 'backend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'backend_compose_runtime_guard.v1.json'),
  },
  {
    id: 'backend_compose_runtime_lane_restore_guard',
    group: 'backend',
    required: false,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'backend_compose_runtime_lane.restore_guard.v1.json'),
  },
  {
    id: 'grid_pagination_runtime_smoke',
    group: 'smoke',
    required: true,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'grid_pagination_runtime_smoke.v1.json'),
  },
  {
    id: 'access_audit_grid_pagination_runtime_smoke',
    group: 'smoke',
    required: true,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'access_audit_grid_pagination_runtime_smoke.v1.json'),
  },
  {
    id: 'real_user_mutation_smoke',
    group: 'smoke',
    required: false,
    ignoreMissing: true,
    absolutePath: path.join(repoRoot, '.cache', 'reports', 'real_user_mutation_smoke.v1.json'),
  },
];

const entries = sourceSpecs.map((spec) => {
  const payload = readJsonIfExists(spec.absolutePath);
  const exists = payload !== null;
  const effectiveStatus = exists ? normalizeStatus(payload?.status) : 'MISSING';
  const countedStatus = !exists && spec.ignoreMissing ? 'SKIPPED' : effectiveStatus;
  const { startup_mode, shutdown_mode } = pickModes(payload);
  const { target_exit_code, lane_exit_code } = pickExitCodes(payload);
  return {
    id: spec.id,
    group: spec.group,
    required: spec.required,
    ignore_missing: Boolean(spec.ignoreMissing),
    exists,
    effective_status: effectiveStatus,
    counted_status: countedStatus,
    kind: payload?.kind ?? null,
    generated_at: pickGeneratedAt(payload),
    session_id: pickSessionId(payload),
    startup_mode,
    shutdown_mode,
    target_exit_code,
    lane_exit_code,
    restore_attempted: typeof payload?.restore_attempted === 'boolean' ? payload.restore_attempted : null,
    restore_succeeded: typeof payload?.restore_succeeded === 'boolean' ? payload.restore_succeeded : null,
    path: toRepoRelative(spec.absolutePath),
    summary: payload?.summary ?? summarizeSmokeSteps(payload),
    error: typeof payload?.error === 'string' && payload.error.length > 0 ? payload.error : null,
  };
});

const counts = {
  ok: entries.filter((entry) => entry.counted_status === 'OK').length,
  failed: entries.filter((entry) => entry.counted_status === 'FAILED').length,
  missing: entries.filter((entry) => entry.counted_status === 'MISSING').length,
  unknown: entries.filter((entry) => entry.counted_status === 'UNKNOWN').length,
};

const hasRequiredFailure = entries.some(
  (entry) => entry.required && ['FAILED', 'MISSING', 'UNKNOWN'].includes(entry.counted_status),
);
const hasOptionalFailure = entries.some(
  (entry) => !entry.required && ['FAILED', 'MISSING', 'UNKNOWN'].includes(entry.counted_status),
);

const overallStatus = hasRequiredFailure ? 'FAILED' : hasOptionalFailure ? 'WARN' : 'OK';

const payload = {
  version: 'v1',
  kind: 'runtime-status-summary',
  generated_at: nowIsoUtc(),
  overall_status: overallStatus,
  counts,
  entries,
};

const formatModes = (entry) => {
  const fragments = [];
  if (entry.startup_mode) {
    fragments.push(`startup=${entry.startup_mode}`);
  }
  if (entry.shutdown_mode) {
    fragments.push(`shutdown=${entry.shutdown_mode}`);
  }
  if (entry.target_exit_code !== null) {
    fragments.push(`target_exit_code=${entry.target_exit_code}`);
  }
  if (entry.lane_exit_code !== null) {
    fragments.push(`lane_exit_code=${entry.lane_exit_code}`);
  }
  if (entry.restore_attempted !== null) {
    fragments.push(`restore_attempted=${entry.restore_attempted}`);
  }
  if (entry.restore_succeeded !== null) {
    fragments.push(`restore_succeeded=${entry.restore_succeeded}`);
  }
  return fragments.join(', ');
};

const markdownLines = [
  '# Runtime Status Summary',
  '',
  `- Generated at: ${payload.generated_at}`,
  `- Overall status: ${payload.overall_status}`,
  `- Counts: ok=${counts.ok}, failed=${counts.failed}, missing=${counts.missing}, unknown=${counts.unknown}`,
  '',
];

for (const group of ['frontend', 'backend', 'smoke']) {
  markdownLines.push(`## ${group}`);
  for (const entry of entries.filter((candidate) => candidate.group === group)) {
    const details = [
      `required=${entry.required}`,
      entry.kind ? `kind=${entry.kind}` : null,
      entry.generated_at ? `generated_at=${entry.generated_at}` : null,
      entry.session_id ? `session_id=${entry.session_id}` : null,
      formatModes(entry) || null,
      `path=${entry.path}`,
    ].filter(Boolean);
    markdownLines.push(`- [${entry.effective_status}] ${entry.id} (${details.join(' | ')})`);
    if (entry.summary) {
      markdownLines.push(`  summary: ${JSON.stringify(entry.summary)}`);
    }
    if (entry.error) {
      markdownLines.push(`  error: ${entry.error}`);
    }
  }
  markdownLines.push('');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(summaryJsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
writeFileSync(summaryMarkdownPath, `${markdownLines.join('\n')}\n`, 'utf8');

console.log(JSON.stringify({
  summaryJsonPath: toRepoRelative(summaryJsonPath),
  summaryMarkdownPath: toRepoRelative(summaryMarkdownPath),
  overallStatus,
  counts,
}));
