import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..', '..');

function run(command, args, env = process.env) {
  const proc = spawnSync(command, args, {
    cwd: webRoot,
    stdio: 'inherit',
    env,
  });
  if (proc.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} basarisiz oldu`);
  }
}

async function readVersion() {
  const pkg = JSON.parse(await fs.readFile(path.join(webRoot, 'packages', 'ui-kit', 'package.json'), 'utf8'));
  return pkg.version;
}

async function main() {
  const version = await readVersion();
  const outputDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
  await fs.mkdir(outputDir, { recursive: true });

  run('npm', ['run', 'gate:ui-library-release']);
  run('npm', ['run', 'build-storybook']);
  run('npm', ['run', 'security:build-bundle']);
  run('npm', ['run', 'release:ui-library:manifest']);

  const chromaticToken = (process.env.CHROMATIC_PROJECT_TOKEN || '').trim();
  let chromaticStatus = 'skipped';
  if (chromaticToken) {
    run('npm', ['run', 'chromatic'], { ...process.env, CHROMATIC_PROJECT_TOKEN: chromaticToken });
    chromaticStatus = 'ran';
  }

  const summary = {
    version: '1.0',
    summary_id: 'ui-library-release-summary-v1',
    package: 'mfe-ui-kit',
    release_version: version,
    status: 'PASS',
    chromatic: chromaticStatus,
    steps: [
      'gate:ui-library-release',
      'build-storybook',
      'security:build-bundle',
      'release:ui-library:manifest',
    ],
  };
  await fs.writeFile(path.join(outputDir, 'ui-library-release.summary.v1.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  console.log(`[run-ui-library-release] OK version=${version} chromatic=${chromaticStatus}`);
}

main().catch((error) => {
  console.error(`[run-ui-library-release] FAIL ${error.message}`);
  process.exit(1);
});
