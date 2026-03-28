#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }
  return args[index + 1] ?? fallback;
};

const outDirArg = getArg('--out-dir');
const outDir = outDirArg
  ? (path.isAbsolute(outDirArg) ? outDirArg : path.resolve(webRoot, outDirArg))
  : path.join(webRoot, 'test-results', 'ops', 'mutation-status');
const sourcePath = path.join(repoRoot, '.cache', 'reports', 'real_user_mutation_smoke.v1.json');
const summaryJsonPath = path.join(outDir, 'mutation-lane-summary.v1.json');
const summaryMarkdownPath = path.join(outDir, 'mutation-lane-summary.md');

const nowIsoUtc = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const toRepoRelative = (absolutePath) => path.relative(repoRoot, absolutePath) || '.';

const ignoredNoisePatterns = [
  /localhost:3001\/remoteEntry\.js/i,
  /localhost:3002\/remoteEntry\.js/i,
  /mfe_suggestions/i,
  /mfe_ethic/i,
  /SuggestionsApp/i,
  /EthicApp/i,
  /ScriptExternalLoadError/i,
  /^Failed to load resource: net::ERR_CONNECTION_REFUSED$/i,
];

const matchesIgnoredNoise = (value) => ignoredNoisePatterns.some((pattern) => pattern.test(String(value ?? '')));

const splitMessages = (messages) => {
  const ignored = [];
  const actionable = [];
  for (const message of Array.isArray(messages) ? messages : []) {
    if (matchesIgnoredNoise(message)) {
      ignored.push(String(message));
    } else {
      actionable.push(String(message));
    }
  }
  return { ignored, actionable };
};

if (!existsSync(sourcePath)) {
  mkdirSync(outDir, { recursive: true });
  const missingPayload = {
    version: 'v1',
    kind: 'mutation-lane-summary',
    generated_at: nowIsoUtc(),
    source_report_path: toRepoRelative(sourcePath),
    overall_status: 'FAILED',
    error: 'real_user_mutation_smoke report is missing',
  };
  writeFileSync(summaryJsonPath, `${JSON.stringify(missingPayload, null, 2)}\n`, 'utf8');
  writeFileSync(
    summaryMarkdownPath,
    [
      '# Mutation Lane Summary',
      '',
      `- Generated at: ${missingPayload.generated_at}`,
      '- Overall status: FAILED',
      `- Source report: ${missingPayload.source_report_path}`,
      `- Error: ${missingPayload.error}`,
      '',
    ].join('\n'),
    'utf8',
  );
  console.log(JSON.stringify({
    summaryJsonPath: toRepoRelative(summaryJsonPath),
    summaryMarkdownPath: toRepoRelative(summaryMarkdownPath),
    overallStatus: missingPayload.overall_status,
  }));
  process.exit(1);
}

const rawReport = JSON.parse(readFileSync(sourcePath, 'utf8'));
const users = rawReport.users ?? {};
const access = rawReport.access ?? {};
const consoleErrors = splitMessages(rawReport.console_errors);
const consoleWarnings = splitMessages(rawReport.console_warnings);
const pageErrors = splitMessages(rawReport.page_errors);
const badResponses = Array.isArray(rawReport.bad_responses) ? rawReport.bad_responses : [];

const usersChecks = {
  target_selected: Boolean(users.targetUserId && users.targetUserEmail),
  status_toggled: Boolean(users.originalStatus && users.toggledStatus && users.originalStatus !== users.toggledStatus),
  audit_id_present: Boolean(users.auditId),
  session_timeout_changed: Number(users.originalSessionTimeout) !== Number(users.updatedSessionTimeout),
  session_timeout_persisted: Number(users.sessionTimeoutAfterSave) === Number(users.updatedSessionTimeout),
  rolled_back: users.rolledBack === true,
};

const accessChecks = {
  role_selected: Boolean(access.roleId && access.roleName),
  permission_toggled: Boolean(access.toggledPermissionId && access.toggledPermissionCode),
  audit_id_present: Boolean(access.auditId),
  audit_visible_in_api: access.auditVisibleInApi === true,
  audit_visible_in_ui: access.auditVisibleInUi === true,
  rolled_back: access.rolledBack === true,
};

const usersStatus = Object.values(usersChecks).every(Boolean) ? 'OK' : 'FAILED';
const accessStatus = Object.values(accessChecks).every(Boolean) ? 'OK' : 'FAILED';

const diagnostics = {
  console_error_count: Number(rawReport.console_error_count ?? 0),
  console_warning_count: Number(rawReport.console_warning_count ?? 0),
  page_error_count: Number(rawReport.page_error_count ?? 0),
  bad_response_count: Number(rawReport.bad_response_count ?? 0),
  ignored_console_errors: consoleErrors.ignored.length,
  actionable_console_errors: consoleErrors.actionable.length,
  ignored_console_warnings: consoleWarnings.ignored.length,
  actionable_console_warnings: consoleWarnings.actionable.length,
  ignored_page_errors: pageErrors.ignored.length,
  actionable_page_errors: pageErrors.actionable.length,
  actionable_examples: [
    ...consoleErrors.actionable.slice(0, 3),
    ...consoleWarnings.actionable.slice(0, 3),
    ...pageErrors.actionable.slice(0, 3),
  ],
};

let diagnosticsStatus = 'OK';
if (diagnostics.bad_response_count > 0) {
  diagnosticsStatus = 'FAILED';
} else if (
  diagnostics.actionable_console_errors > 0
  || diagnostics.actionable_console_warnings > 0
  || diagnostics.actionable_page_errors > 0
) {
  diagnosticsStatus = 'WARN';
}

let overallStatus = 'OK';
if (String(rawReport.status ?? '').toUpperCase() !== 'OK' || usersStatus === 'FAILED' || accessStatus === 'FAILED' || diagnosticsStatus === 'FAILED') {
  overallStatus = 'FAILED';
} else if (diagnosticsStatus === 'WARN') {
  overallStatus = 'WARN';
}

const payload = {
  version: 'v1',
  kind: 'mutation-lane-summary',
  generated_at: nowIsoUtc(),
  source_report_path: toRepoRelative(sourcePath),
  overall_status: overallStatus,
  source_status: rawReport.status ?? 'UNKNOWN',
  users: {
    status: usersStatus,
    checks: usersChecks,
    details: {
      targetUserId: users.targetUserId ?? null,
      targetUserEmail: users.targetUserEmail ?? null,
      originalStatus: users.originalStatus ?? null,
      toggledStatus: users.toggledStatus ?? null,
      originalSessionTimeout: users.originalSessionTimeout ?? null,
      updatedSessionTimeout: users.updatedSessionTimeout ?? null,
      sessionTimeoutAfterSave: users.sessionTimeoutAfterSave ?? null,
      auditId: users.auditId ?? null,
    },
  },
  access: {
    status: accessStatus,
    checks: accessChecks,
    details: {
      roleId: access.roleId ?? null,
      roleName: access.roleName ?? null,
      toggledPermissionId: access.toggledPermissionId ?? null,
      toggledPermissionCode: access.toggledPermissionCode ?? null,
      auditId: access.auditId ?? null,
      auditUiNeedle: access.auditUiNeedle ?? null,
    },
  },
  diagnostics: {
    status: diagnosticsStatus,
    counts: diagnostics,
    bad_responses: badResponses,
  },
};

const markdownLines = [
  '# Mutation Lane Summary',
  '',
  `- Generated at: ${payload.generated_at}`,
  `- Overall status: ${payload.overall_status}`,
  `- Source status: ${payload.source_status}`,
  `- Source report: ${payload.source_report_path}`,
  '',
  '## users',
  `- status: ${payload.users.status}`,
  `- checks: ${JSON.stringify(payload.users.checks)}`,
  `- details: ${JSON.stringify(payload.users.details)}`,
  '',
  '## access',
  `- status: ${payload.access.status}`,
  `- checks: ${JSON.stringify(payload.access.checks)}`,
  `- details: ${JSON.stringify(payload.access.details)}`,
  '',
  '## diagnostics',
  `- status: ${payload.diagnostics.status}`,
  `- counts: ${JSON.stringify(payload.diagnostics.counts)}`,
];

if (badResponses.length > 0) {
  markdownLines.push(`- bad_responses: ${JSON.stringify(badResponses)}`);
}
if (diagnostics.actionable_examples.length > 0) {
  markdownLines.push(`- actionable_examples: ${JSON.stringify(diagnostics.actionable_examples)}`);
}
markdownLines.push('');

mkdirSync(outDir, { recursive: true });
writeFileSync(summaryJsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
writeFileSync(summaryMarkdownPath, `${markdownLines.join('\n')}\n`, 'utf8');

console.log(JSON.stringify({
  summaryJsonPath: toRepoRelative(summaryJsonPath),
  summaryMarkdownPath: toRepoRelative(summaryMarkdownPath),
  overallStatus: payload.overall_status,
  usersStatus: payload.users.status,
  accessStatus: payload.access.status,
  diagnosticsStatus: payload.diagnostics.status,
}));
