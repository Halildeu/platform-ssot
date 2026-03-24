#!/usr/bin/env node
/**
 * changelog-gen.mjs — Auto-generate CHANGELOG entries from git history
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// Get commits since last tag or last 50
function getCommits() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf-8', cwd: ROOT }).trim();
    return execSync(`git log ${lastTag}..HEAD --pretty=format:"%H|%s|%an|%aI" -- packages/design-system/`, { encoding: 'utf-8', cwd: path.resolve(ROOT, '../..') }).trim().split('\n').filter(Boolean);
  } catch {
    return execSync('git log -50 --pretty=format:"%H|%s|%an|%aI" -- packages/design-system/', { encoding: 'utf-8', cwd: path.resolve(ROOT, '../..') }).trim().split('\n').filter(Boolean);
  }
}

function categorize(subject) {
  if (subject.startsWith('feat')) return 'Features';
  if (subject.startsWith('fix')) return 'Bug Fixes';
  if (subject.startsWith('refactor')) return 'Refactoring';
  if (subject.startsWith('perf')) return 'Performance';
  if (subject.startsWith('test')) return 'Tests';
  if (subject.startsWith('docs')) return 'Documentation';
  if (subject.startsWith('chore')) return 'Chores';
  return 'Other';
}

const commits = getCommits();
const groups = {};

for (const line of commits) {
  const [hash, subject, author, date] = line.split('|');
  if (!subject) continue;
  const category = categorize(subject);
  groups[category] = groups[category] || [];
  groups[category].push({ hash: hash.slice(0, 7), subject, author, date: date?.split('T')[0] });
}

// Generate markdown
const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')).version || 'unreleased';
const date = new Date().toISOString().split('T')[0];

let md = `## [${version}] - ${date}\n\n`;

const order = ['Features', 'Bug Fixes', 'Performance', 'Refactoring', 'Tests', 'Documentation', 'Chores', 'Other'];
for (const cat of order) {
  if (!groups[cat] || groups[cat].length === 0) continue;
  md += `### ${cat}\n\n`;
  for (const c of groups[cat]) {
    md += `- ${c.subject} (${c.hash})\n`;
  }
  md += '\n';
}

// Output
const outputPath = path.join(ROOT, 'CHANGELOG.md');
if (fs.existsSync(outputPath)) {
  const existing = fs.readFileSync(outputPath, 'utf-8');
  fs.writeFileSync(outputPath, md + '\n---\n\n' + existing, 'utf-8');
} else {
  fs.writeFileSync(outputPath, `# Changelog\n\n${md}`, 'utf-8');
}

console.log(`Changelog generated: ${outputPath}`);
console.log(`   ${commits.length} commits, ${Object.keys(groups).length} categories`);
