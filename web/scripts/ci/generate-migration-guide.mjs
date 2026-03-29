#!/usr/bin/env node
/**
 * generate-migration-guide.mjs
 *
 * Scans the design system for deprecated APIs and generates
 * a migration guide with before/after examples.
 *
 * Usage: node scripts/ci/generate-migration-guide.mjs [--output path]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const ROOT = resolve(__dirname, "../..");
const DESIGN_SYSTEM_SRC = join(ROOT, "packages/design-system/src");
const BASELINE_PATH = join(__dirname, ".export-baseline.json");
const DEFAULT_OUTPUT = join(ROOT, "packages/design-system/src/MIGRATION-GUIDE.md");

/* ------------------------------------------------------------------ */
/*  CLI args                                                           */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

const outputPath = getArg("--output") || DEFAULT_OUTPUT;

/* ------------------------------------------------------------------ */
/*  Glob helper (Node 20 compatible)                                   */
/* ------------------------------------------------------------------ */

function walkDir(dir, pattern) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, pattern));
    } else if (entry.isFile() && entry.name.endsWith(pattern)) {
      results.push(fullPath);
    }
  }
  return results;
}

/* ------------------------------------------------------------------ */
/*  1. Scan @deprecated JSDoc tags                                     */
/* ------------------------------------------------------------------ */

/**
 * Parse @deprecated JSDoc comments from a TSX file.
 * Returns array of { file, line, prop, message, component }
 */
function scanDeprecatedJSDoc(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const results = [];

  // Determine component name from file path
  const relPath = relative(DESIGN_SYSTEM_SRC, filePath);
  const fileName = filePath.split("/").pop().replace(/\.tsx$/, "");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const deprecatedMatch = line.match(/@deprecated\s+(.*)/);
    if (!deprecatedMatch) continue;

    const message = deprecatedMatch[1].replace(/\*\/\s*$/, "").trim();

    // Look at the next non-empty, non-comment line for the prop name
    let prop = null;
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const nextLine = lines[j].trim();
      if (!nextLine || nextLine.startsWith("*") || nextLine.startsWith("//")) continue;

      // Match prop declarations like: propName?: Type;
      const propMatch = nextLine.match(/^(\w+)\??:\s/);
      if (propMatch) {
        prop = propMatch[1];
      }
      // Match type alias: export type Foo = ...
      const typeMatch = nextLine.match(/^export\s+type\s+(\w+)/);
      if (typeMatch) {
        prop = typeMatch[1];
      }
      // Match interface: export interface Foo
      const ifaceMatch = nextLine.match(/^export\s+interface\s+(\w+)/);
      if (ifaceMatch) {
        prop = ifaceMatch[1];
      }
      // Match const: export const Foo = ...
      const constMatch = nextLine.match(/^export\s+const\s+(\w+)/);
      if (constMatch) {
        prop = constMatch[1];
      }
      break;
    }

    results.push({
      file: relPath,
      line: i + 1,
      component: fileName,
      prop: prop || "(unknown)",
      message,
    });
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  2. Scan console.warn deprecation messages                          */
/* ------------------------------------------------------------------ */

/**
 * Parse console.warn deprecation patterns.
 * Looks for: console.warn("[Component] `oldProp` is deprecated. Use `newProp` instead.")
 */
function scanConsoleWarnDeprecations(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const relPath = relative(DESIGN_SYSTEM_SRC, filePath);
  const results = [];

  // Match console.warn lines with deprecation messages
  const warnRe =
    /console\.warn\(\s*["'`]\[?(@?\w[\w/]*)\]?\s*[:\s]*[`"']?(\w+)[`"']?\s+is\s+deprecated\.?\s*(?:Use\s+[`"']?(\w+)[`"']?\s+instead\.?)?\s*["'`]\s*\)/g;

  let match;
  while ((match = warnRe.exec(content)) !== null) {
    const lineNumber = content.slice(0, match.index).split("\n").length;
    results.push({
      file: relPath,
      line: lineNumber,
      component: match[1].replace(/^@mfe\/design-system\]\s*/, ""),
      oldProp: match[2],
      newProp: match[3] || null,
    });
  }

  // Fallback: simpler pattern for the actual format used in the codebase
  // e.g. console.warn("[Checkbox] `checkboxSize` is deprecated. Use `size` instead.");
  const simpleWarnRe =
    /console\.warn\(\s*["'`]\[(\w+)\]\s+`(\w+)`\s+is\s+deprecated\.\s*Use\s+`(\w+)`\s+instead\.["'`]\s*\)/g;

  while ((match = simpleWarnRe.exec(content)) !== null) {
    // Avoid duplicates
    const existing = results.find(
      (r) => r.component === match[1] && r.oldProp === match[2]
    );
    if (!existing) {
      const lineNumber = content.slice(0, match.index).split("\n").length;
      results.push({
        file: relPath,
        line: lineNumber,
        component: match[1],
        oldProp: match[2],
        newProp: match[3],
      });
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  3. Extract replacement mapping from deprecation messages           */
/* ------------------------------------------------------------------ */

function parseReplacement(message) {
  // "Use `size` instead" or "Use `size` instead. Will be removed in next major version."
  const useMatch = message.match(/[Uu]se\s+`(\w+)`\s+instead/);
  if (useMatch) return useMatch[1];

  // "Use `EmptyState` instead — alias kept for backward compat."
  const useMatch2 = message.match(/[Uu]se\s+`(\w+)`/);
  if (useMatch2) return useMatch2[1];

  return null;
}

function parseTimeline(message) {
  if (/next\s+major\s+version/i.test(message)) return "Next major version (v2.0.0)";
  if (/will\s+be\s+removed/i.test(message)) return "Next major version (v2.0.0)";
  if (/backward\s*[-\s]?compat/i.test(message)) return "Next major version (v2.0.0)";
  return "Next major version (v2.0.0)";
}

function classifyDeprecation(message) {
  if (/[Uu]se\s+`\w+`\s+instead/i.test(message)) return "renamed";
  if (/[Aa]ccepted\s+(for\s+)?backward\s+compat.*ignored/i.test(message))
    return "ignored-compat";
  if (/alias/i.test(message)) return "alias";
  if (/compat/i.test(message)) return "compat";
  return "deprecated";
}

/* ------------------------------------------------------------------ */
/*  4. Generate before/after code examples                             */
/* ------------------------------------------------------------------ */

function generateCodeExample(component, oldProp, newProp, classification) {
  if (!newProp) return null;

  if (classification === "renamed") {
    return {
      before: `<${component} ${oldProp}="md" />`,
      after: `<${component} ${newProp}="md" />`,
    };
  }

  if (classification === "alias") {
    return {
      before: `<${component} />  // using ${oldProp}`,
      after: `<${component} />  // use ${newProp} instead`,
    };
  }

  return {
    before: `<${component} ${oldProp}={value} />`,
    after: `<${component} ${newProp}={value} />`,
  };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

console.log("Scanning design system for deprecated APIs...\n");

const tsxFiles = walkDir(DESIGN_SYSTEM_SRC, ".tsx");
console.log(`Found ${tsxFiles.length} .tsx files to scan.\n`);

// Collect all deprecations
const jsdocDeprecations = [];
const warnDeprecations = [];

for (const file of tsxFiles) {
  jsdocDeprecations.push(...scanDeprecatedJSDoc(file));
  warnDeprecations.push(...scanConsoleWarnDeprecations(file));
}

console.log(
  `Found ${jsdocDeprecations.length} @deprecated JSDoc tags and ${warnDeprecations.length} console.warn deprecations.\n`
);

// Group by component
const componentMap = new Map();

for (const dep of jsdocDeprecations) {
  const key = dep.component;
  if (!componentMap.has(key)) {
    componentMap.set(key, { jsdoc: [], warns: [], file: dep.file });
  }
  componentMap.get(key).jsdoc.push(dep);
}

for (const dep of warnDeprecations) {
  const key = dep.component;
  if (!componentMap.has(key)) {
    componentMap.set(key, { jsdoc: [], warns: [], file: dep.file });
  }
  componentMap.get(key).warns.push(dep);
}

// Read baseline for export surface info
let baseline = { values: [], types: [] };
if (existsSync(BASELINE_PATH)) {
  try {
    baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
  } catch {
    console.warn("Warning: Could not read export baseline.");
  }
}

/* ------------------------------------------------------------------ */
/*  Render markdown                                                    */
/* ------------------------------------------------------------------ */

const today = new Date().toISOString().slice(0, 10);
const lines = [];

lines.push("# Migration Guide");
lines.push("");
lines.push(`> **Package:** \`@mfe/design-system\``);
lines.push(`> **Generated:** ${today}`);
lines.push(
  `> **Policy:** See [DEPRECATION-POLICY.md](../../DEPRECATION-POLICY.md) for timeline details.`
);
lines.push("");
lines.push("---");
lines.push("");
lines.push("## Deprecation Timeline");
lines.push("");
lines.push("| Phase | Duration | What happens |");
lines.push("|-------|----------|-------------|");
lines.push(
  "| **Announced** | Current minor release | `@deprecated` JSDoc tag added. `console.warn` fires in dev mode. The API continues to work. |"
);
lines.push(
  "| **Deprecated** | 2 subsequent minor releases | Warning remains. Documentation marks the API as deprecated. |"
);
lines.push(
  "| **Removed** | Next major release (v2.0.0) | The symbol is deleted from the public API. |"
);
lines.push("");
lines.push("---");
lines.push("");

// Summary table
lines.push("## Summary of Deprecated APIs");
lines.push("");
lines.push(
  "| Component | Deprecated Prop/API | Replacement | Category | Removal Target |"
);
lines.push("|-----------|-------------------|-------------|----------|----------------|");

const sortedComponents = [...componentMap.keys()].sort();

for (const comp of sortedComponents) {
  const data = componentMap.get(comp);

  for (const dep of data.jsdoc) {
    const replacement = parseReplacement(dep.message);
    const classification = classifyDeprecation(dep.message);
    const timeline = parseTimeline(dep.message);
    const categoryLabel =
      classification === "renamed"
        ? "Prop rename"
        : classification === "ignored-compat"
          ? "Ignored (compat)"
          : classification === "alias"
            ? "Alias"
            : "Deprecated";

    lines.push(
      `| ${comp} | \`${dep.prop}\` | ${replacement ? "`" + replacement + "`" : "Remove usage"} | ${categoryLabel} | ${timeline} |`
    );
  }
}

lines.push("");
lines.push("---");
lines.push("");

// Detailed per-component sections
lines.push("## Component Migration Details");
lines.push("");

for (const comp of sortedComponents) {
  const data = componentMap.get(comp);
  const hasActionable = data.jsdoc.some(
    (d) => classifyDeprecation(d.message) !== "ignored-compat"
  );
  const hasCompat = data.jsdoc.some(
    (d) => classifyDeprecation(d.message) === "ignored-compat"
  );

  lines.push(`### ${comp}`);
  lines.push("");
  lines.push(`**Source:** \`${data.file}\``);
  lines.push("");

  // Actionable deprecations (prop renames, etc.)
  const actionable = data.jsdoc.filter(
    (d) => classifyDeprecation(d.message) !== "ignored-compat"
  );

  if (actionable.length > 0) {
    lines.push("#### Prop Changes");
    lines.push("");

    for (const dep of actionable) {
      const replacement = parseReplacement(dep.message);
      const classification = classifyDeprecation(dep.message);

      lines.push(`- **\`${dep.prop}\`** — ${dep.message}`);

      // Generate code example
      if (replacement) {
        const example = generateCodeExample(
          comp,
          dep.prop,
          replacement,
          classification
        );
        if (example) {
          lines.push("");
          lines.push("  **Before:**");
          lines.push("  ```tsx");
          lines.push(`  ${example.before}`);
          lines.push("  ```");
          lines.push("");
          lines.push("  **After:**");
          lines.push("  ```tsx");
          lines.push(`  ${example.after}`);
          lines.push("  ```");
          lines.push("");
        }
      }
    }
  }

  // Console.warn deprecations
  if (data.warns.length > 0) {
    lines.push("#### Runtime Warnings");
    lines.push("");
    for (const w of data.warns) {
      lines.push(
        `- \`${w.oldProp}\` is deprecated.${w.newProp ? ` Use \`${w.newProp}\` instead.` : ""} _(runtime warning in dev mode)_`
      );
    }
    lines.push("");
  }

  // Backward-compat props (ignored)
  if (hasCompat) {
    const compatProps = data.jsdoc
      .filter((d) => classifyDeprecation(d.message) === "ignored-compat")
      .map((d) => `\`${d.prop}\``)
      .join(", ");

    lines.push("#### Backward-Compat Props (safe to remove)");
    lines.push("");
    lines.push(
      `The following props are accepted but ignored: ${compatProps}. You can safely remove them from your code.`
    );
    lines.push("");
  }

  lines.push("---");
  lines.push("");
}

// Quick-fix checklist
lines.push("## Quick Migration Checklist");
lines.push("");
lines.push("### Prop Renames (search-and-replace)");
lines.push("");
lines.push("| Old Prop | New Prop | Components |");
lines.push("|----------|----------|------------|");

// Collect unique renames
const renames = new Map();
for (const comp of sortedComponents) {
  const data = componentMap.get(comp);
  for (const dep of data.jsdoc) {
    const replacement = parseReplacement(dep.message);
    if (replacement && classifyDeprecation(dep.message) === "renamed") {
      const key = `${dep.prop}->${replacement}`;
      if (!renames.has(key)) {
        renames.set(key, { old: dep.prop, new: replacement, components: [] });
      }
      if (!renames.get(key).components.includes(comp)) {
        renames.get(key).components.push(comp);
      }
    }
  }
}

for (const [, rename] of renames) {
  lines.push(
    `| \`${rename.old}\` | \`${rename.new}\` | ${rename.components.join(", ")} |`
  );
}

lines.push("");
lines.push("### Type Renames");
lines.push("");

const typeRenames = [];
for (const comp of sortedComponents) {
  const data = componentMap.get(comp);
  for (const dep of data.jsdoc) {
    const replacement = parseReplacement(dep.message);
    if (replacement && /^[A-Z]/.test(dep.prop)) {
      typeRenames.push({ old: dep.prop, new: replacement, component: comp });
    }
  }
}

if (typeRenames.length > 0) {
  lines.push("| Old Type | New Type | Component |");
  lines.push("|----------|----------|-----------|");
  for (const t of typeRenames) {
    lines.push(`| \`${t.old}\` | \`${t.new}\` | ${t.component} |`);
  }
} else {
  lines.push("No type renames detected.");
}

lines.push("");
lines.push("### Props Safe to Remove (ignored compat)");
lines.push("");
lines.push(
  "These props are accepted but have no effect. You can remove them at your convenience:"
);
lines.push("");

for (const comp of sortedComponents) {
  const data = componentMap.get(comp);
  const ignored = data.jsdoc.filter(
    (d) => classifyDeprecation(d.message) === "ignored-compat"
  );
  if (ignored.length > 0) {
    const props = ignored.map((d) => `\`${d.prop}\``).join(", ");
    lines.push(`- **${comp}:** ${props}`);
  }
}

lines.push("");
lines.push("---");
lines.push("");
lines.push(
  "_This guide was auto-generated by `scripts/ci/generate-migration-guide.mjs`. Re-run to update._"
);

/* ------------------------------------------------------------------ */
/*  Write output                                                       */
/* ------------------------------------------------------------------ */

const output = lines.join("\n") + "\n";
writeFileSync(outputPath, output, "utf-8");
console.log(`Migration guide written to ${outputPath}`);
console.log(
  `  ${componentMap.size} components with deprecations`
);
console.log(
  `  ${jsdocDeprecations.length} @deprecated tags, ${warnDeprecations.length} console.warn patterns`
);
