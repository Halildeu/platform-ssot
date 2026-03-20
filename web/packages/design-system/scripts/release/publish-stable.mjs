#!/usr/bin/env node
/**
 * Stable Release Publisher
 *
 * Publishes a stable version of @mfe/design-system.
 * Delegates ALL quality checks to the canonical pre-release-check.mjs.
 *
 * Usage: node scripts/release/publish-stable.mjs <patch|minor|major> [--dry-run]
 *
 * Prerequisites:
 * - Clean working tree on main branch
 * - npm authentication configured
 * - All quality gates pass (verified by pre-release-check.mjs)
 */
import { execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const ROOT = join(import.meta.dirname, '..', '..');
const PKG_PATH = join(ROOT, 'package.json');
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md');

const VALID_BUMPS = ['patch', 'minor', 'major'];

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${type}`);
  }
}

function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
}

function runQuiet(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf-8' }).trim();
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const bumpType = process.argv.find((arg) => VALID_BUMPS.includes(arg));

  if (!bumpType) {
    console.error(`Usage: node scripts/release/publish-stable.mjs <${VALID_BUMPS.join('|')}> [--dry-run]`);
    process.exit(1);
  }

  console.log('  Stable Release\n');

  // 1. Check branch (pre-release-check handles clean tree)
  const branch = runQuiet('git rev-parse --abbrev-ref HEAD');
  if (branch !== 'main' && !isDryRun) {
    console.error(`  Releases must be published from main branch (currently on ${branch}).`);
    process.exit(1);
  }

  // 2. Compute new version
  const pkg = JSON.parse(await readFile(PKG_PATH, 'utf-8'));
  const currentVersion = pkg.version;
  const newVersion = bumpVersion(currentVersion, bumpType);

  console.log(`Current version: ${currentVersion}`);
  console.log(`Bump type: ${bumpType}`);
  console.log(`New version: ${newVersion}`);
  console.log(`Dry run: ${isDryRun}\n`);

  // 3. Run canonical pre-release-check (ALL quality gates + release gates)
  console.log('── Canonical Release Gate ─────────────\n');

  const preReleaseFlags = isDryRun ? '--allow-dirty --skip-visual' : '--skip-visual';
  run(`node scripts/release/pre-release-check.mjs ${preReleaseFlags}`);

  console.log('\n  All release gates passed.\n');

  // 4. Confirmation
  if (!isDryRun) {
    const ok = await confirm(
      `Publish @mfe/design-system@${newVersion} to npm with tag "latest"? (y/N) `
    );
    if (!ok) {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  // 5. Update CHANGELOG.md
  try {
    let changelog = await readFile(CHANGELOG_PATH, 'utf-8');
    const today = new Date().toISOString().slice(0, 10);
    changelog = changelog.replace(
      /## \[Unreleased\]/,
      `## [Unreleased]\n\n## [${newVersion}] - ${today}`
    );
    await writeFile(CHANGELOG_PATH, changelog);
    console.log(`  Updated CHANGELOG.md with ${newVersion} (${today})`);
  } catch {
    console.warn('  Could not update CHANGELOG.md — continuing anyway.');
  }

  // 6. Update package.json version
  pkg.version = newVersion;
  await writeFile(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

  if (!isDryRun) {
    // 7. Commit and tag
    run('git add package.json CHANGELOG.md');
    run(`git commit -m "release: @mfe/design-system@${newVersion}"`);
    run(`git tag -a v${newVersion} -m "v${newVersion}"`);
    console.log(`  Created tag v${newVersion}`);

    // 8. Publish
    console.log('\n  Publishing to npm...');
    run('npm publish --tag latest');

    console.log(`\n  Published @mfe/design-system@${newVersion}`);
    console.log(`\nNext steps:`);
    console.log(`  git push origin main --follow-tags`);
  } else {
    console.log('\n  npm publish --tag latest --dry-run');
    run('npm publish --tag latest --dry-run');

    // Restore package.json in dry-run
    pkg.version = currentVersion;
    await writeFile(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

    // Restore CHANGELOG in dry-run
    try {
      run('git checkout -- CHANGELOG.md', { stdio: 'pipe' });
    } catch {
      // ignore if changelog wasn't tracked
    }

    console.log(`\n  Dry run complete for @mfe/design-system@${newVersion}`);
  }
}

main().catch((err) => {
  console.error('  Stable release failed:', err.message);
  process.exit(1);
});
