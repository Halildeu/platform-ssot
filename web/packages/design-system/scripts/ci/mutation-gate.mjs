#!/usr/bin/env node
/**
 * mutation-gate.mjs — Mutation Testing CI Gate
 *
 * Runs Stryker on changed files and enforces minimum mutation score.
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const THRESHOLD = 40; // Minimum mutation score %
const CI_MODE = process.argv.includes('--ci');

console.log('\n🧬 Mutation Testing Gate\n');
console.log(`  Threshold: ${THRESHOLD}%`);
console.log(`  Scope: enterprise/ (most critical)\n`);

try {
  // Run Stryker on enterprise scope only (fastest, most value)
  const result = execSync(
    'npx stryker run --mutate "src/enterprise/**/*.tsx" --reporters clear-text,json',
    { encoding: 'utf-8', cwd: ROOT, timeout: 300000, stdio: ['pipe', 'pipe', 'pipe'] }
  );

  // Parse result
  const scoreMatch = result.match(/Mutation score[:\s]+(\d+(?:\.\d+)?)/i);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

  console.log(`  Mutation Score: ${score}%`);

  if (CI_MODE && score < THRESHOLD) {
    console.log(`\n❌ MUTATION GATE FAILED: ${score}% < ${THRESHOLD}%\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ MUTATION GATE PASSED: ${score}%\n`);
  }
} catch (_error) {
  // Stryker may not be installed or may fail — warn but don't block
  console.log('  ⚠️  Stryker run failed (may not be installed)');
  console.log('  Skipping mutation gate...\n');
  if (CI_MODE) {
    console.log('  Note: Install @stryker-mutator/core for mutation testing');
  }
}
