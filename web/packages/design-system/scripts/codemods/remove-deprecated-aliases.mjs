#!/usr/bin/env node

/**
 * Codemod: Remove Deprecated Aliases
 *
 * Scans consumer .tsx/.ts/.jsx/.js files and rewrites deprecated prop names,
 * type imports, and component imports to their modern equivalents.
 *
 * Usage:
 *   node scripts/codemods/remove-deprecated-aliases.mjs apps/        # Dry-run (default)
 *   node scripts/codemods/remove-deprecated-aliases.mjs --write apps/ # Apply changes
 *   node scripts/codemods/remove-deprecated-aliases.mjs --json apps/  # JSON report
 *
 * Categories handled:
 *   1. Size alias props:    checkboxSize → size, radioSize → size, etc.
 *   2. Renamed props:       totalItems → total, activeTabId → activeKey, etc.
 *   3. Ignored compat props: removed entirely (mode, showSearch, etc.)
 *   4. Type aliases:        TagColor → TagVariant, BadgeColor → BadgeVariant
 *   5. Component aliases:   Empty → EmptyState
 *   6. Functional deprecated (DetailDrawer): WARNING only — manual migration needed
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const WRITE_MODE = process.argv.includes("--write");
const JSON_MODE = process.argv.includes("--json");
const targetDirs = process.argv
  .filter((a) => !a.startsWith("--") && !a.endsWith(".mjs"))
  .slice(1);

if (targetDirs.length === 0) {
  console.error(
    "Usage: node remove-deprecated-aliases.mjs [--write] [--json] <dir1> [dir2 ...]"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Transformation rules
// ---------------------------------------------------------------------------

/**
 * Prop renames: { ComponentRegex: { oldProp: newProp } }
 * The regex matches JSX tag names to scope the rename.
 */
const PROP_RENAMES = {
  Checkbox: { checkboxSize: "size", onCheckedChange: "onChange" },
  Radio: { radioSize: "size" },
  Select: { selectSize: "size", onSelectChange: "onChange" },
  Switch: { switchSize: "size" },
  SearchInput: { searchSize: "size" },
  Input: { inputSize: "size" },
  Textarea: { hasError: "error" },
  Pagination: {
    totalItems: "total",
    currentPage: "current",
    onPageChange: "onChange",
  },
  Tabs: { activeTabId: "activeKey", onTabChange: "onChange" },
  Steps: { activeStep: "current", onStepChange: "onChange" },
  Tooltip: { tooltip: "content" },
  Tag: { color: "variant" },
  Badge: { color: "variant" },
  Alert: { severity: "variant" },
};

/**
 * Props to remove entirely (ignored compat props).
 * { ComponentRegex: [propName, ...] }
 */
const PROPS_TO_REMOVE = {
  Select: [
    "mode",
    "showSearch",
    "allowClear",
    "filterOption",
    "notFoundContent",
    "dropdownMatchSelectWidth",
    "loading",
    "maxTagCount",
    "optionLabelProp",
    "optionFilterProp",
    "virtual",
    "listHeight",
  ],
  Pagination: [
    "showSizeChanger",
    "showQuickJumper",
    "showTotal",
    "pageSizeOptions",
    "simple",
    "responsive",
    "hideOnSinglePage",
    "defaultCurrent",
    "defaultPageSize",
    "itemRender",
  ],
  Checkbox: ["indeterminate", "autoFocus"],
  Switch: ["autoFocus"],
  Tabs: ["centered", "animated", "destroyInactiveTabPane", "tabBarGutter"],
  Steps: ["progressDot"],
  Modal: ["destroyOnClose", "keyboard", "centered"],
  Skeleton: ["active"],
};

/**
 * Type import renames: oldName → newName
 */
const TYPE_RENAMES = {
  TagColor: "TagVariant",
  BadgeColor: "BadgeVariant",
};

/**
 * Component import renames: oldName → newName
 */
const COMPONENT_RENAMES = {
  Empty: "EmptyState",
  DetailDrawerTabSection: "DetailDrawerTab",
};

/**
 * Props that need manual migration — only warn, don't auto-fix.
 */
const MANUAL_MIGRATION_PROPS = {
  DetailDrawer: ["width", "maxHeight", "headerExtra", "tabs", "onTabChange"],
};

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

const EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);

async function findFiles(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === ".next" ||
          entry.name.startsWith(".")
        ) {
          continue;
        }
        results.push(...(await findFiles(full)));
      } else if (entry.isFile()) {
        const ext = entry.name.slice(entry.name.lastIndexOf("."));
        if (EXTENSIONS.has(ext)) {
          results.push(full);
        }
      }
    }
  } catch {
    // skip inaccessible dirs
  }
  return results;
}

// ---------------------------------------------------------------------------
// Transformations
// ---------------------------------------------------------------------------

/**
 * @typedef {{ file: string; line: number; type: string; message: string }} Change
 */

/**
 * Apply all transformations to a file's content.
 * Returns { content: string, changes: Change[] }
 */
function transform(filePath, content) {
  /** @type {Change[]} */
  const changes = [];
  let result = content;

  // --- 1. Prop renames ---
  for (const [component, renames] of Object.entries(PROP_RENAMES)) {
    for (const [oldProp, newProp] of Object.entries(renames)) {
      // Match: <Component oldProp= or <Component oldProp>  or <Component oldProp/>
      // Scoped to JSX context (after < and component name)
      const propPattern = new RegExp(
        `(<${component}(?:\\s|\\n)[^>]*?)\\b${oldProp}(\\s*[=/>])`,
        "g"
      );
      let match;
      while ((match = propPattern.exec(result)) !== null) {
        const lineNum = result.slice(0, match.index).split("\n").length;
        changes.push({
          file: filePath,
          line: lineNum,
          type: "prop-rename",
          message: `${component}: ${oldProp} → ${newProp}`,
        });
      }
      result = result.replace(propPattern, `$1${newProp}$2`);
    }
  }

  // --- 2. Remove ignored props ---
  // Strategy: Find JSX blocks for each component, then remove props line-by-line.
  // This handles multi-line JSX reliably.
  for (const [component, props] of Object.entries(PROPS_TO_REMOVE)) {
    // Build a set for O(1) lookup
    const propSet = new Set(props);

    // Find all JSX opening tags for this component (multi-line safe)
    const tagPattern = new RegExp(`<${component}(?=\\s|>|/)`, "g");
    let tagMatch;
    while ((tagMatch = tagPattern.exec(result)) !== null) {
      // We found a <Component — now scan lines from here to find props to remove
      const startIdx = tagMatch.index;
      const before = result.slice(0, startIdx);
      const after = result.slice(startIdx);

      // Find end of opening tag — must handle JSX expressions with > inside braces/strings
      let depth = 0; // brace depth
      let inStr = null; // null | '"' | "'" | '`'
      let tagEnd = -1;
      for (let ci = 1; ci < after.length; ci++) {
        const ch = after[ci];
        if (inStr) {
          if (ch === inStr && after[ci - 1] !== "\\") inStr = null;
          continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
        if (ch === "{") { depth++; continue; }
        if (ch === "}") { depth--; continue; }
        if (depth === 0 && ch === ">") {
          tagEnd = ci + 1;
          break;
        }
      }
      if (tagEnd === -1) continue;

      const tagContent = after.slice(0, tagEnd);
      const lines = tagContent.split("\n");
      const removedLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check each prop pattern on this line
        for (const prop of propSet) {
          // Check if this line starts with (or contains) the prop name
          const propStartRe = new RegExp(`(^\\s*|\\s+)${prop}(\\s*=|\\s*$|\\s+|\\s*/>|\\s*>)`);
          if (!propStartRe.test(line)) continue;

          const lineNum = before.split("\n").length + i;
          changes.push({
            file: filePath,
            line: lineNum,
            type: "prop-remove",
            message: `${component}: removed ignored prop "${prop}"`,
          });

          // Check if the entire line is dedicated to this prop (standalone line)
          const isStandaloneLine = new RegExp(`^\\s*${prop}(\\s*=|\\s*$)`).test(trimmed);

          if (isStandaloneLine) {
            // For expression props like prop={(x) => ...}, the value may span this line
            // Mark for full line removal
            removedLines.push(i);
          } else {
            // Inline: remove the prop from mixed line
            // Handle prop={expr}, prop="str", prop (bool)
            lines[i] = line
              .replace(new RegExp(`\\s+${prop}=\\{[^}]*\\}`), "")
              .replace(new RegExp(`\\s+${prop}=["'][^"']*["']`), "")
              .replace(new RegExp(`\\s+${prop}(?=\\s|/|>)`), "");
          }
          break; // Only match once per prop per line
        }
      }

      // Remove full lines (reverse order to preserve indices)
      for (const idx of removedLines.sort((a, b) => b - a)) {
        lines.splice(idx, 1);
      }

      const newTag = lines.join("\n");
      result = before + newTag + result.slice(startIdx + tagContent.length);
    }
  }

  // --- 3. Type import renames ---
  for (const [oldType, newType] of Object.entries(TYPE_RENAMES)) {
    const importPattern = new RegExp(`\\b${oldType}\\b`, "g");
    let match;
    while ((match = importPattern.exec(result)) !== null) {
      const lineNum = result.slice(0, match.index).split("\n").length;
      const line = result.split("\n")[lineNum - 1];
      // Only rename in import statements and type annotations
      if (/import\s/.test(line) || /:\s/.test(line) || /as\s/.test(line)) {
        changes.push({
          file: filePath,
          line: lineNum,
          type: "type-rename",
          message: `${oldType} → ${newType}`,
        });
      }
    }
    result = result.replace(importPattern, newType);
  }

  // --- 4. Component import renames ---
  for (const [oldName, newName] of Object.entries(COMPONENT_RENAMES)) {
    // Rename in import statements
    const importNamePattern = new RegExp(
      `(import\\s+\\{[^}]*?)\\b${oldName}\\b([^}]*\\})`,
      "g"
    );
    let match;
    while ((match = importNamePattern.exec(result)) !== null) {
      const lineNum = result.slice(0, match.index).split("\n").length;
      changes.push({
        file: filePath,
        line: lineNum,
        type: "component-rename",
        message: `import { ${oldName} } → import { ${newName} }`,
      });
    }
    result = result.replace(importNamePattern, `$1${newName}$2`);

    // Rename JSX usage
    const jsxOpenPattern = new RegExp(`<${oldName}(\\s|>|/)`, "g");
    const jsxClosePattern = new RegExp(`</${oldName}>`, "g");
    while ((match = jsxOpenPattern.exec(result)) !== null) {
      const lineNum = result.slice(0, match.index).split("\n").length;
      changes.push({
        file: filePath,
        line: lineNum,
        type: "component-rename",
        message: `<${oldName}> → <${newName}>`,
      });
    }
    result = result.replace(jsxOpenPattern, `<${newName}$1`);
    result = result.replace(jsxClosePattern, `</${newName}>`);
  }

  // --- 5. Manual migration warnings ---
  for (const [component, props] of Object.entries(MANUAL_MIGRATION_PROPS)) {
    for (const prop of props) {
      const pattern = new RegExp(
        `<${component}[^>]*\\b${prop}\\b[^>]*>`,
        "g"
      );
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const lineNum = content.slice(0, match.index).split("\n").length;
        changes.push({
          file: filePath,
          line: lineNum,
          type: "manual-warning",
          message: `⚠️  ${component}.${prop} requires manual migration — see docs/DEPRECATION-REMOVAL-PLAN.md`,
        });
      }
    }
  }

  return { content: result, changes };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  /** @type {Change[]} */
  const allChanges = [];
  let filesScanned = 0;
  let filesChanged = 0;

  for (const dir of targetDirs) {
    const absDir = resolve(dir);
    const files = await findFiles(absDir);

    for (const file of files) {
      filesScanned++;
      const content = await readFile(file, "utf-8");
      const relFile = relative(process.cwd(), file);
      const { content: transformed, changes } = transform(relFile, content);

      if (changes.length > 0) {
        filesChanged++;
        allChanges.push(...changes);

        if (WRITE_MODE && transformed !== content) {
          await writeFile(file, transformed, "utf-8");
        }
      }
    }
  }

  // --- Output ---
  if (JSON_MODE) {
    const report = {
      filesScanned,
      filesChanged,
      totalChanges: allChanges.length,
      writeMode: WRITE_MODE,
      changes: allChanges,
    };
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    return;
  }

  console.log("");
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║    @mfe/design-system — Deprecation Codemod     ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("");
  console.log(`  Files scanned:  ${filesScanned}`);
  console.log(`  Files affected: ${filesChanged}`);
  console.log(`  Total changes:  ${allChanges.length}`);
  console.log(`  Mode:           ${WRITE_MODE ? "WRITE ✏️" : "DRY-RUN (use --write to apply)"}`);
  console.log("");

  if (allChanges.length === 0) {
    console.log("  ✅ No deprecated usages found. You're clean!");
    console.log("");
    return;
  }

  // Group by type
  const byType = {};
  for (const c of allChanges) {
    byType[c.type] ??= [];
    byType[c.type].push(c);
  }

  const typeLabels = {
    "prop-rename": "Prop Renames",
    "prop-remove": "Removed Ignored Props",
    "type-rename": "Type Renames",
    "component-rename": "Component Renames",
    "manual-warning": "⚠️  Manual Migration Required",
  };

  for (const [type, items] of Object.entries(byType)) {
    console.log(`  ── ${typeLabels[type] ?? type} (${items.length}) ──`);
    for (const item of items) {
      const prefix = type === "manual-warning" ? "  ⚠️ " : "  ✓ ";
      console.log(`${prefix} ${item.file}:${item.line}  ${item.message}`);
    }
    console.log("");
  }

  if (byType["manual-warning"]?.length) {
    console.log(
      "  ⚠️  Some changes require manual migration. See docs/DEPRECATION-REMOVAL-PLAN.md"
    );
    console.log("");
  }

  if (!WRITE_MODE) {
    console.log("  💡 Run with --write to apply changes:");
    console.log(
      `     node scripts/codemods/remove-deprecated-aliases.mjs --write ${targetDirs.join(" ")}`
    );
    console.log("");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
