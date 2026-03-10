#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(webRoot, 'test-results', 'diagnostics', 'ui-library-release-gate', stamp);
const summaryPath = path.join(outDir, 'ui-library-release-gate.summary.v1.json');
const summaryMdPath = path.join(outDir, 'ui-library-release-gate.summary.v1.md');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const latestSummaryPath = path.join(latestDir, 'ui-library-release-gate.summary.v1.json');
const latestSummaryMdPath = path.join(latestDir, 'ui-library-release-gate.summary.v1.md');

const steps = [
  ['designlab_index', 'npm', ['run', 'designlab:index']],
  ['component_docs', 'python3', ['../scripts/generate_component_doc_modules.py']],
  ['build_ui_kit', 'npm', ['run', 'build:ui-kit']],
  ['build_storybook', 'npm', ['run', 'build-storybook']],
  ['publish_bundle', 'npm', ['run', 'publish:bundle']],
  ['release_manifest', 'npm', ['run', 'release:ui-library:manifest']],
  ['upgrade_recipes_audit', 'npm', ['run', 'audit:ui-library-upgrade-recipes']],
  ['codemod_candidates_audit', 'npm', ['run', 'audit:ui-library-codemod-candidates']],
  ['release_manifest_audit_sync', 'npm', ['run', 'release:ui-library:manifest']],
  ['package_release_contract', 'python3', ['../scripts/check_ui_library_package_release_contract.py']],
  ['visual_contract', 'npm', ['run', 'gate:ui-library-visual']],
  ['wave_gate', 'npm', ['run', 'gate:ui-library-wave', '--', '--wave', 'wave_11_recipes']],
  ['frontend_doctor', 'npm', ['run', 'doctor:frontend', '--', '--preset', 'ui-library']],
  ['release_manifest_finalize', 'npm', ['run', 'release:ui-library:manifest']],
  ['upgrade_recipes_audit_finalize', 'npm', ['run', 'audit:ui-library-upgrade-recipes']],
  ['codemod_candidates_audit_finalize', 'npm', ['run', 'audit:ui-library-codemod-candidates']],
  ['release_manifest_finalize_sync', 'npm', ['run', 'release:ui-library:manifest']],
  ['package_release_contract_finalize', 'python3', ['../scripts/check_ui_library_package_release_contract.py']],
];

const runStep = ([id, cmd, args]) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(cmd, args, {
    cwd: webRoot,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 16,
  });
  return {
    id,
    command: `${cmd} ${args.join(' ')}`,
    status: result.status === 0 ? 'PASS' : 'FAIL',
    exitCode: result.status ?? 1,
    startedAt,
    endedAt: new Date().toISOString(),
  };
};

const renderSummaryMarkdown = (summary) => [
  '# UI Library Release Gate Summary',
  '',
  `- Overall: ${summary.overall_status}`,
  `- Generated: ${summary.generatedAt}`,
  '',
  '## Steps',
  '| Step | Result | Exit |',
  '|---|---|---|',
  ...summary.steps.map((step) => `| ${step.id} | ${step.status} | ${step.exitCode} |`),
  '',
].join('\n');

const main = async () => {
  await mkdir(outDir, { recursive: true });
  const executed = steps.map(runStep);
  const overall_status = executed.every((step) => step.status === 'PASS') ? 'PASS' : 'FAIL';
  const summary = {
    version: '1.0',
    overall_status,
    generatedAt: new Date().toISOString(),
    steps: executed,
    outDir: path.relative(path.join(webRoot, '..'), outDir),
  };
  await mkdir(path.dirname(summaryPath), { recursive: true });
  await mkdir(latestDir, { recursive: true });
  await writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  await writeFile(summaryMdPath, renderSummaryMarkdown(summary), 'utf8');
  await writeFile(latestSummaryPath, JSON.stringify(summary, null, 2), 'utf8');
  await writeFile(latestSummaryMdPath, renderSummaryMarkdown(summary), 'utf8');
  console.log(
    JSON.stringify({
      ...summary,
      summaryPath: path.relative(path.join(webRoot, '..'), summaryPath),
      latestSummaryPath: path.relative(path.join(webRoot, '..'), latestSummaryPath),
    }),
  );
  if (overall_status !== 'PASS') {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[run-ui-library-release-gate] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
