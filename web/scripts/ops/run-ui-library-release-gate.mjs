#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(webRoot, 'test-results', 'diagnostics', 'ui-library-release-gate', `${stamp}-ui-library-release`);
const latestDir = path.join(webRoot, 'test-results', 'diagnostics', 'ui-library-release-gate', 'latest');
const logDir = path.join(outDir, 'logs');
mkdirSync(logDir, { recursive: true });
mkdirSync(latestDir, { recursive: true });

const steps = [
  {
    id: 'governance_contract',
    label: 'Governance contract check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_governance_contract.py'],
    cwd: repoRoot,
  },
  {
    id: 'ux_alignment',
    label: 'UX alignment check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_ux_alignment.py'],
    cwd: repoRoot,
  },
  {
    id: 'component_roadmap',
    label: 'Component roadmap check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_component_roadmap.py'],
    cwd: repoRoot,
  },
  {
    id: 'page_block_contract',
    label: 'Page/block contract check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_page_block_contract.py'],
    cwd: repoRoot,
  },
  {
    id: 'package_release_contract',
    label: 'Package release contract check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_package_release_contract.py'],
    cwd: repoRoot,
  },
  {
    id: 'frontend_diagnostics_registry',
    label: 'Frontend diagnostics registry check',
    cmd: 'python3',
    args: ['scripts/check_frontend_diagnostics_registry.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_1_foundation',
    label: 'Wave 1 foundation check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_1_foundation_primitives.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_2_navigation',
    label: 'Wave 2 navigation check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_2_navigation.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_3_forms',
    label: 'Wave 3 forms check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_3_forms.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_4_data_display',
    label: 'Wave 4 data display check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_4_data_display.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_5_overlay',
    label: 'Wave 5 overlay check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_5_overlay.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_6_ai_native_helpers',
    label: 'Wave 6 AI helpers check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_6_ai_native_helpers.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_7_page_blocks',
    label: 'Wave 7 page blocks check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_7_page_blocks.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_8_overlay_extensions',
    label: 'Wave 8 overlay extensions check',
    cmd: 'python3',
    args: ['scripts/check_ui_library_wave_8_overlay_extensions.py'],
    cwd: repoRoot,
  },
  {
    id: 'designlab_index',
    label: 'Design Lab index',
    cmd: 'npm',
    args: ['run', 'designlab:index'],
    cwd: webRoot,
  },
  {
    id: 'tailwind_lint',
    label: 'Tailwind lint',
    cmd: 'npm',
    args: ['run', 'lint:tailwind'],
    cwd: webRoot,
  },
  {
    id: 'no_antd_guard',
    label: 'No antd runtime guard',
    cmd: 'npm',
    args: ['run', 'lint:no-antd'],
    cwd: webRoot,
  },
  {
    id: 'ui_kit_tests',
    label: 'UI kit tests',
    cmd: 'npm',
    args: ['run', 'test:ui-kit'],
    cwd: webRoot,
  },
  {
    id: 'doctor_frontend_ui_library',
    label: 'Frontend doctor (ui-library)',
    cmd: 'npm',
    args: ['run', 'doctor:frontend', '--', '--preset', 'ui-library'],
    cwd: webRoot,
  },
];

const runStep = (step) => {
  const startedAt = new Date();
  const result = spawnSync(step.cmd, step.args, {
    cwd: step.cwd,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 32,
  });
  const logPath = path.join(logDir, `${step.id}.log`);
  mkdirSync(logDir, { recursive: true });
  writeFileSync(
    logPath,
    [`$ ${step.cmd} ${step.args.join(' ')}`, '', result.stdout || '', result.stderr || ''].join('\n'),
    'utf8',
  );
  return {
    id: step.id,
    label: step.label,
    command: `${step.cmd} ${step.args.join(' ')}`,
    status: result.status === 0 ? 'PASS' : 'FAIL',
    exitCode: result.status,
    signal: result.signal,
    startedAt: startedAt.toISOString(),
    endedAt: new Date().toISOString(),
    logPath: path.relative(repoRoot, logPath),
  };
};

const executed = steps.map(runStep);
const failed = executed.filter((step) => step.status !== 'PASS');
const overall = failed.length === 0 ? 'PASS' : 'FAIL';

const summary = {
  version: '1.0',
  gate_id: 'ui-library-release-gate',
  overall_status: overall,
  covered_waves: [
    'wave_1_foundation_primitives',
    'wave_2_navigation',
    'wave_3_forms',
    'wave_4_data_display',
    'wave_5_overlay',
    'wave_6_ai_native_helpers',
    'wave_7_page_blocks',
    'wave_8_overlay_extensions',
  ],
  started_at: executed[0]?.startedAt ?? new Date().toISOString(),
  ended_at: new Date().toISOString(),
  steps: executed,
  out_dir: path.relative(repoRoot, outDir),
};

const jsonPath = path.join(outDir, 'ui-library-release-gate.summary.v1.json');
const mdPath = path.join(outDir, 'ui-library-release-gate.summary.v1.md');
const latestJson = path.join(latestDir, 'ui-library-release-gate.summary.v1.json');
const latestMd = path.join(latestDir, 'ui-library-release-gate.summary.v1.md');
writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf8');

const lines = [
  '# UI Library Release Gate Summary',
  '',
  `- Overall: ${overall}`,
  `- Waves: ${summary.covered_waves.join(', ')}`,
  '',
  '## Steps',
  '| Step | Result | Log |',
  '|---|---|---|',
  ...executed.map((step) => `| ${step.id} | ${step.status} | ${step.logPath} |`),
];
writeFileSync(mdPath, lines.join('\n'), 'utf8');
mkdirSync(latestDir, { recursive: true });
writeFileSync(latestJson, JSON.stringify(summary, null, 2), 'utf8');
writeFileSync(latestMd, lines.join('\n'), 'utf8');

console.log(JSON.stringify({
  status: overall,
  out_json: path.relative(repoRoot, jsonPath),
  out_md: path.relative(repoRoot, mdPath),
}, null, 2));

if (overall !== 'PASS') {
  process.exit(1);
}
