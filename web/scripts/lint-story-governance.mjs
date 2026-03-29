#!/usr/bin/env node
/**
 * Story Governance Lint
 *
 * Checks:
 *   3.7 — Orphan detection: exported components with no story file
 *   3.8 — Coverage threshold: story coverage %, fail if < 60%
 *   3.9 — Ownership: CODEOWNERS covers story directories
 *
 * Usage:
 *   node scripts/lint-story-governance.mjs
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const COVERAGE_THRESHOLD = 60; // percent

// ---------------------------------------------------------------------------
// Component discovery
// ---------------------------------------------------------------------------
const COMPONENT_DIRS = [
  'packages/design-system/src/primitives',
  'packages/design-system/src/components',
  'packages/design-system/src/advanced',
];

const STORY_DIRS = [
  'stories',
  'packages/design-system/src',
  'apps/docs/stories',
];

function walkDir(dir, callback) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.storybook') {
        walkDir(full, callback);
      } else if (entry.isFile()) {
        callback(full);
      }
    }
  } catch {
    // skip unreadable
  }
}

function findExportedComponents() {
  const components = new Set();

  for (const dir of COMPONENT_DIRS) {
    const absDir = resolve(ROOT, dir);
    if (!existsSync(absDir)) continue;

    walkDir(absDir, (filePath) => {
      const name = basename(filePath);
      if (name.endsWith('.tsx') && !name.includes('.test.') && !name.includes('.spec.') && !name.includes('.stories.')) {
        const componentName = name === 'index.tsx'
          ? basename(dirname(filePath))
          : basename(filePath, '.tsx');

        if (/^[A-Z]/.test(componentName)) {
          components.add(componentName);
        }
      }
    });
  }

  return components;
}

function findStoriedComponents() {
  const storied = new Set();

  for (const dir of STORY_DIRS) {
    const absDir = resolve(ROOT, dir);
    if (!existsSync(absDir)) continue;

    walkDir(absDir, (filePath) => {
      const name = basename(filePath);
      if (name.includes('.stories.')) {
        // Extract component name from story filename
        // e.g., Button.stories.tsx -> Button
        const match = name.match(/^([A-Z][A-Za-z0-9]*)\.stories\./);
        if (match) {
          storied.add(match[1]);
        }
      }
    });
  }

  return storied;
}

// ---------------------------------------------------------------------------
// CODEOWNERS check
// ---------------------------------------------------------------------------
function checkCodeowners() {
  const codeownersPath = resolve(ROOT, '.github/CODEOWNERS');
  if (!existsSync(codeownersPath)) {
    return { exists: false, coversStories: false, details: 'No CODEOWNERS file found' };
  }

  const content = readFileSync(codeownersPath, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim() && !l.startsWith('#'));

  const storyPatterns = ['/stories/', '.stories.', '/packages/design-system/'];
  const coversStories = storyPatterns.some((pat) =>
    lines.some((line) => line.includes(pat.replace(/\//g, '/')))
  );

  return {
    exists: true,
    coversStories,
    details: coversStories
      ? 'CODEOWNERS covers story directories'
      : 'CODEOWNERS missing explicit story directory coverage (stories/ not listed)',
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const allComponents = findExportedComponents();
const storiedComponents = findStoriedComponents();

const orphans = [...allComponents].filter((c) => !storiedComponents.has(c)).sort();
const covered = [...allComponents].filter((c) => storiedComponents.has(c));
const coveragePct = allComponents.size > 0
  ? Math.round((covered.length / allComponents.size) * 100)
  : 100;

const codeowners = checkCodeowners();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log('=== Story Governance Report ===\n');

console.log(`Total exported components: ${allComponents.size}`);
console.log(`Components with stories:   ${covered.length}`);
console.log(`Components without stories: ${orphans.length} (orphans)`);
console.log(`Coverage: ${coveragePct}%`);
console.log(`Threshold: ${COVERAGE_THRESHOLD}%`);
console.log('');

if (orphans.length > 0) {
  console.log('Orphaned components (no story):');
  for (const name of orphans) {
    console.log(`  - ${name}`);
  }
  console.log('');
}

console.log(`CODEOWNERS: ${codeowners.details}`);
console.log('');

// ---------------------------------------------------------------------------
// Exit
// ---------------------------------------------------------------------------
let exitCode = 0;

if (coveragePct < COVERAGE_THRESHOLD) {
  console.log(`FAIL — Story coverage ${coveragePct}% is below ${COVERAGE_THRESHOLD}% threshold.`);
  exitCode = 1;
} else {
  console.log(`PASS — Story coverage ${coveragePct}% meets ${COVERAGE_THRESHOLD}% threshold.`);
}

if (!codeowners.coversStories) {
  console.log('WARN — CODEOWNERS should explicitly cover /stories/ directory.');
}

process.exit(exitCode);
