#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const contextPath = path.join(repoRoot, 'docs', '02-architecture', 'context', 'ui-library-system.context.v1.json');
const readActiveWave = () => {
  const context = JSON.parse(readFileSync(contextPath, 'utf8'));
  const active = context.active_wave_contracts?.[0];
  if (!active) {
    throw new Error('active_wave_contracts bos');
  }
  const base = path.basename(active);
  if (base.includes('wave-1-foundation-primitives')) return 'wave_1_foundation_primitives';
  if (base.includes('wave-2-navigation')) return 'wave_2_navigation';
  if (base.includes('wave-3-forms')) return 'wave_3_forms';
  throw new Error(`aktif wave anlasilamadi: ${active}`);
};

const waveId = getArg('--wave', readActiveWave());
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(webRoot, 'test-results', 'diagnostics', 'ui-library-wave-gate', `${stamp}-${waveId}`);
const logDir = path.join(outDir, 'logs');
mkdirSync(logDir, { recursive: true });

const waveMap = {
  wave_1_foundation_primitives: {
    checker: 'python3 scripts/check_ui_library_wave_1_foundation_primitives.py',
    focus: ['Button', 'Text', 'LinkInline', 'IconButton'],
  },
  wave_2_navigation: {
    checker: 'python3 scripts/check_ui_library_wave_2_navigation.py',
    focus: ['Tabs', 'Breadcrumb', 'Pagination', 'Steps', 'AnchorToc'],
  },
  wave_3_forms: {
    checker: 'python3 scripts/check_ui_library_wave_3_forms.py',
    focus: ['TextInput', 'TextArea', 'Checkbox', 'Radio', 'Switch', 'Slider', 'DatePicker'],
  },
};

if (!waveMap[waveId]) {
  console.error(`[ui-library-wave-gate] Bilinmeyen wave: ${waveId}`);
  process.exit(2);
}

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
    id: 'frontend_diagnostics_registry',
    label: 'Frontend diagnostics registry check',
    cmd: 'python3',
    args: ['scripts/check_frontend_diagnostics_registry.py'],
    cwd: repoRoot,
  },
  {
    id: 'wave_contract',
    label: 'Wave contract check',
    cmd: 'python3',
    args: [waveMap[waveId].checker.replace(/^python3\s+/, '')],
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
    maxBuffer: 1024 * 1024 * 16,
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
  gate_id: 'ui-library-wave-gate',
  wave_id: waveId,
  focus_components: waveMap[waveId].focus,
  overall_status: overall,
  started_at: executed[0]?.startedAt ?? new Date().toISOString(),
  ended_at: new Date().toISOString(),
  steps: executed,
  out_dir: path.relative(repoRoot, outDir),
};

const jsonPath = path.join(outDir, 'ui-library-wave-gate.summary.v1.json');
const mdPath = path.join(outDir, 'ui-library-wave-gate.summary.v1.md');
writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf8');

const lines = [
  '# UI Library Wave Gate Summary',
  '',
  `- Wave: ${waveId}`,
  `- Overall: ${overall}`,
  `- Focus: ${waveMap[waveId].focus.join(', ')}`,
  '',
  '## Steps',
  '| Step | Result | Log |',
  '|---|---|---|',
  ...executed.map((step) => `| ${step.id} | ${step.status} | ${step.logPath} |`),
];
writeFileSync(mdPath, lines.join('\n'), 'utf8');

console.log(JSON.stringify({
  status: overall,
  wave_id: waveId,
  out_json: path.relative(repoRoot, jsonPath),
  out_md: path.relative(repoRoot, mdPath),
}, null, 2));

if (overall !== 'PASS') {
  process.exit(1);
}
