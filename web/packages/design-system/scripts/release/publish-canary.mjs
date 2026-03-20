#!/usr/bin/env node
/**
 * Canary Release Publisher
 *
 * Publishes a canary version of @mfe/design-system for testing.
 * Version format: X.Y.Z-canary.{timestamp}.{short-sha}
 *
 * Usage: node scripts/release/publish-canary.mjs [--dry-run]
 *
 * Prerequisites:
 * - Clean working tree
 * - npm authentication configured
 * - Build passes
 */
import { execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const PKG_PATH = join(ROOT, 'package.json');

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('🐤 Canary Release\n');

  // 1. Check clean working tree
  const status = execSync('git status --porcelain', { encoding: 'utf-8', cwd: ROOT }).trim();
  if (status && !isDryRun) {
    console.error('❌ Working tree not clean. Commit or stash changes first.');
    process.exit(1);
  }

  // 2. Get version info
  const pkg = JSON.parse(await readFile(PKG_PATH, 'utf-8'));
  const baseVersion = pkg.version;
  const timestamp = Date.now();
  const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  const canaryVersion = `${baseVersion}-canary.${timestamp}.${sha}`;

  console.log(`Base version: ${baseVersion}`);
  console.log(`Canary version: ${canaryVersion}`);
  console.log(`Dry run: ${isDryRun}\n`);

  // 3. Build
  console.log('📦 Building...');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

  // 4. Run tests
  console.log('\n🧪 Testing...');
  execSync('npx vitest run', { cwd: ROOT, stdio: 'inherit' });

  // 5. Update version temporarily
  pkg.version = canaryVersion;
  await writeFile(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

  try {
    // 6. Publish
    const publishCmd = `npm publish --tag canary${isDryRun ? ' --dry-run' : ''}`;
    console.log(`\n🚀 ${publishCmd}`);
    execSync(publishCmd, { cwd: ROOT, stdio: 'inherit' });

    console.log(`\n✅ Published @mfe/design-system@${canaryVersion}`);
    console.log(`\nInstall: npm install @mfe/design-system@canary`);
    console.log(`Or: npm install @mfe/design-system@${canaryVersion}`);
  } finally {
    // 7. Restore original version
    pkg.version = baseVersion;
    await writeFile(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');
  }
}

main().catch((err) => {
  console.error('❌ Canary release failed:', err.message);
  process.exit(1);
});
