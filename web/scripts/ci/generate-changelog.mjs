#!/usr/bin/env node
/**
 * generate-changelog.mjs
 * Generates changelog from conventional commits.
 * Usage: node scripts/ci/generate-changelog.mjs [--since <tag>] [--output <file>]
 */

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

/* ------------------------------------------------------------------ */
/*  CLI args                                                           */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

const sinceTag = getArg("--since");
const outputFile = getArg("--output");

/* ------------------------------------------------------------------ */
/*  Resolve range                                                      */
/* ------------------------------------------------------------------ */

function resolveRange() {
  if (sinceTag) return sinceTag;

  // Try to find the latest tag
  try {
    const tag = execSync("git describe --tags --abbrev=0 2>/dev/null", {
      encoding: "utf-8",
    }).trim();
    if (tag) return tag;
  } catch {
    // No tags found — fall through
  }

  return null;
}

const rangeStart = resolveRange();

/* ------------------------------------------------------------------ */
/*  Read git log                                                       */
/* ------------------------------------------------------------------ */

const SEP = "---COMMIT_SEP---";
const FORMAT = `%H${SEP}%s${SEP}%b${SEP}%an${SEP}%aI`;

let gitLogCmd = `git log --format="${FORMAT}" --no-merges`;

if (rangeStart) {
  gitLogCmd += ` ${rangeStart}..HEAD`;
} else {
  gitLogCmd += " -n 50";
}

let rawLog;
try {
  rawLog = execSync(gitLogCmd, { encoding: "utf-8" }).trim();
} catch {
  console.error("Failed to read git log. Are you inside a git repository?");
  process.exit(1);
}

if (!rawLog) {
  console.log("No commits found in range.");
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/*  Parse commits                                                      */
/* ------------------------------------------------------------------ */

const CONVENTIONAL_RE =
  /^(feat|fix|chore|refactor|docs|test|perf|style|build|ci|revert)(?:\(.+?\))?(!)?:\s*(.+)/i;
const BREAKING_BODY_RE = /BREAKING[\s-]CHANGE[:\s]\s*(.*)/i;

const commits = rawLog
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const parts = line.split(SEP);
    const hash = (parts[0] || "").slice(0, 7);
    const subject = parts[1] || "";
    const body = parts[2] || "";
    const author = parts[3] || "";
    const date = parts[4] || "";

    const match = subject.match(CONVENTIONAL_RE);

    let type = "other";
    let breaking = false;
    let description = subject;

    if (match) {
      type = match[1].toLowerCase();
      breaking = match[2] === "!";
      description = match[3];
    }

    // Check body for BREAKING CHANGE footer
    const bodyBreaking = body.match(BREAKING_BODY_RE);
    if (bodyBreaking) {
      breaking = true;
    }

    return { hash, type, description, breaking, body, author, date };
  });

/* ------------------------------------------------------------------ */
/*  Group by category                                                  */
/* ------------------------------------------------------------------ */

const groups = {
  feat: { title: "Features", items: [] },
  fix: { title: "Bug Fixes", items: [] },
  perf: { title: "Performance", items: [] },
  refactor: { title: "Refactoring", items: [] },
  docs: { title: "Documentation", items: [] },
  test: { title: "Tests", items: [] },
  chore: { title: "Other", items: [] },
  style: { title: "Other", items: [] },
  build: { title: "Other", items: [] },
  ci: { title: "Other", items: [] },
  revert: { title: "Other", items: [] },
  other: { title: "Other", items: [] },
};

const breakingChanges = [];

for (const commit of commits) {
  if (commit.breaking) {
    const breakingBody = commit.body.match(BREAKING_BODY_RE);
    const breakingDesc = breakingBody
      ? breakingBody[1]
      : commit.description;
    breakingChanges.push({ description: breakingDesc, hash: commit.hash });
  }

  const group = groups[commit.type] || groups.other;
  group.items.push(commit);
}

/* ------------------------------------------------------------------ */
/*  Render markdown                                                    */
/* ------------------------------------------------------------------ */

const today = new Date().toISOString().slice(0, 10);
const lines = [];

lines.push(`## [Unreleased] - ${today}`);
lines.push("");

if (breakingChanges.length > 0) {
  lines.push("### Breaking Changes");
  for (const bc of breakingChanges) {
    lines.push(`- ${bc.description} (${bc.hash})`);
  }
  lines.push("");
}

// Merge groups that share the same title
const rendered = new Set();
const titleOrder = [
  "Features",
  "Bug Fixes",
  "Performance",
  "Refactoring",
  "Documentation",
  "Tests",
  "Other",
];

for (const title of titleOrder) {
  if (rendered.has(title)) continue;

  const items = Object.values(groups)
    .filter((g) => g.title === title)
    .flatMap((g) => g.items);

  if (items.length === 0) continue;

  rendered.add(title);
  lines.push(`### ${title}`);
  for (const item of items) {
    lines.push(`- ${item.description} (${item.hash})`);
  }
  lines.push("");
}

const output = lines.join("\n");

/* ------------------------------------------------------------------ */
/*  Output                                                             */
/* ------------------------------------------------------------------ */

if (outputFile) {
  writeFileSync(outputFile, output, "utf-8");
  console.log(`Changelog written to ${outputFile}`);
} else {
  process.stdout.write(output);
}
