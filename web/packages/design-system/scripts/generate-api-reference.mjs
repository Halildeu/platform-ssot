#!/usr/bin/env node
/**
 * API Reference Generator
 *
 * Extracts prop interfaces from component source files using regex parsing.
 * Outputs JSON + Markdown API reference.
 *
 * Usage: node scripts/generate-api-reference.mjs [--json] [--md] [--component Button]
 */
import { readdir, readFile, writeFile, stat, mkdir } from "node:fs/promises";
import { join, basename, relative } from "node:path";

const SRC_DIR = join(import.meta.dirname, "..", "src");
const OUTPUT_DIR = join(import.meta.dirname, "..", "docs", "api");

// Component directories to scan
const COMPONENT_DIRS = [
  join(SRC_DIR, "primitives"),
  join(SRC_DIR, "components"),
];

// ---------------------------------------------------------------------------
// Directory scanning
// ---------------------------------------------------------------------------

/**
 * Discover component subdirectories inside a base directory.
 * Skips index.ts files and only returns actual directories.
 */
async function findComponentDirs(baseDir) {
  let entries;
  try {
    entries = await readdir(baseDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({
      name: e.name,
      path: join(baseDir, e.name),
      category: basename(baseDir), // primitives | components
    }));
}

// ---------------------------------------------------------------------------
// File discovery inside a component directory
// ---------------------------------------------------------------------------

/**
 * Find the primary source file(s) that contain prop interfaces.
 * Priority: *.types.ts > PascalCase.tsx
 */
async function findSourceFiles(componentDir) {
  const entries = await readdir(componentDir);
  // 1. Prefer dedicated types file
  const typesFile = entries.find(
    (f) => f.endsWith(".types.ts") || f.endsWith(".types.tsx"),
  );
  if (typesFile) {
    return [join(componentDir, typesFile)];
  }
  // 2. Fall back to .tsx component files (skip stories, tests, index)
  return entries
    .filter(
      (f) =>
        f.endsWith(".tsx") &&
        !f.includes(".stories.") &&
        !f.includes(".test.") &&
        !f.includes(".spec.") &&
        f !== "index.ts" &&
        f !== "index.tsx",
    )
    .map((f) => join(componentDir, f));
}

// ---------------------------------------------------------------------------
// JSDoc parser
// ---------------------------------------------------------------------------

/**
 * Parse a JSDoc comment block into description + tags.
 */
function parseJSDoc(raw) {
  if (!raw) return { description: "", tags: {} };

  // Strip comment delimiters
  const lines = raw
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim());

  const tags = {};
  const descLines = [];

  for (const line of lines) {
    const tagMatch = line.match(/^@(\w+)\s*(.*)?$/);
    if (tagMatch) {
      const [, tag, value] = tagMatch;
      tags[tag] = (value || "").trim() || true;
    } else if (Object.keys(tags).length === 0) {
      // Only add to description before first tag
      if (line) descLines.push(line);
    }
  }

  return {
    description: descLines.join(" ").trim(),
    tags,
  };
}

// ---------------------------------------------------------------------------
// Interface / type extraction
// ---------------------------------------------------------------------------

/**
 * Find all interface/type blocks whose name contains "Props" in the file content.
 * Returns an array of { name, extendsClause, body }.
 */
function findPropsBlocks(content) {
  const results = [];

  // Match: export interface FooProps extends Bar { ... }
  // We need to handle nested braces so we do a manual brace-matching approach.
  const interfaceStartRe =
    /export\s+interface\s+(\w*Props\w*)\s*(?:extends\s+([\s\S]*?))?\s*\{/g;
  let match;

  while ((match = interfaceStartRe.exec(content)) !== null) {
    const name = match[1];
    const extendsClause = (match[2] || "").trim();
    const bodyStart = match.index + match[0].length;

    const body = extractBracedBlock(content, bodyStart);
    if (body !== null) {
      results.push({ name, extendsClause, body, kind: "interface" });
    }
  }

  // Also match: export type FooProps = { ... }
  const typeStartRe =
    /export\s+type\s+(\w*Props\w*)\s*=\s*(?:[\s\S]*?)?\{/g;
  while ((match = typeStartRe.exec(content)) !== null) {
    const name = match[1];
    const bodyStart = match.index + match[0].length;
    const body = extractBracedBlock(content, bodyStart);
    if (body !== null) {
      // Avoid duplicates (if we already captured as interface)
      if (!results.some((r) => r.name === name)) {
        results.push({ name, extendsClause: "", body, kind: "type" });
      }
    }
  }

  return results;
}

/**
 * Extract content between matched braces starting after an opening brace.
 * `startIdx` points to the character right after the opening `{`.
 */
function extractBracedBlock(content, startIdx) {
  let depth = 1;
  let i = startIdx;

  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }

  if (depth !== 0) return null;
  // Return content excluding the final closing brace
  return content.slice(startIdx, i - 1);
}

// ---------------------------------------------------------------------------
// Prop line parser
// ---------------------------------------------------------------------------

/**
 * Parse the body of an interface/type into individual prop definitions.
 */
function parsePropsBody(body, fullContent) {
  const props = [];

  // Strategy: walk through the body, tracking JSDoc comments and prop lines.
  // A prop line looks like:
  //   propName?: TypeAnnotation;
  //   propName: TypeAnnotation;
  // Possibly preceded by a JSDoc comment /** ... */

  // We use a state machine approach to handle multi-line types correctly.
  const lines = body.split("\n");

  let currentJSDoc = null;
  let pendingPropLine = "";
  let braceDepth = 0;
  let parenDepth = 0;
  let angleBracketDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and plain comment lines (not JSDoc)
    if (!trimmed) continue;

    // Check for JSDoc start
    if (trimmed.startsWith("/**")) {
      // Collect the full JSDoc block
      if (trimmed.includes("*/")) {
        // Single-line JSDoc
        currentJSDoc = trimmed;
      } else {
        // Multi-line JSDoc
        const jsdocLines = [trimmed];
        let j = i + 1;
        while (j < lines.length && !lines[j].includes("*/")) {
          jsdocLines.push(lines[j].trim());
          j++;
        }
        if (j < lines.length) {
          jsdocLines.push(lines[j].trim());
          i = j;
        }
        currentJSDoc = jsdocLines.join("\n");
      }
      continue;
    }

    // Skip section comment lines like /* -- ... -- */
    if (trimmed.startsWith("/*") || trimmed.startsWith("//")) {
      continue;
    }

    // Accumulate prop definition (may span multiple lines for complex types)
    pendingPropLine += (pendingPropLine ? " " : "") + trimmed;

    // Track depth of nested braces/parens/angle brackets
    for (const ch of trimmed) {
      if (ch === "{") braceDepth++;
      else if (ch === "}") braceDepth--;
      else if (ch === "(") parenDepth++;
      else if (ch === ")") parenDepth--;
      else if (ch === "<") angleBracketDepth++;
      else if (ch === ">") angleBracketDepth--;
    }

    // A prop definition is complete when we hit a semicolon at depth 0
    // or the line is a standalone definition without semicolons (less common)
    const isComplete =
      braceDepth <= 0 &&
      parenDepth <= 0 &&
      angleBracketDepth <= 0 &&
      (pendingPropLine.endsWith(";") || pendingPropLine.endsWith(","));

    if (!isComplete && braceDepth <= 0 && parenDepth <= 0 && angleBracketDepth <= 0) {
      // Also consider complete if the next line starts a new prop or JSDoc
      const nextTrimmed = i + 1 < lines.length ? lines[i + 1]?.trim() : "";
      if (
        nextTrimmed.startsWith("/**") ||
        nextTrimmed.startsWith("/*") ||
        nextTrimmed.startsWith("//") ||
        nextTrimmed === "" ||
        /^\w+[?]?\s*:/.test(nextTrimmed) ||
        i + 1 >= lines.length
      ) {
        // Treat current as complete
      } else {
        continue;
      }
    }

    // Try to parse the accumulated line as a prop
    const prop = parseSingleProp(pendingPropLine, currentJSDoc);
    if (prop) {
      props.push(prop);
    }

    pendingPropLine = "";
    braceDepth = 0;
    parenDepth = 0;
    angleBracketDepth = 0;
    currentJSDoc = null;
  }

  return props;
}

/**
 * Parse a single prop line like `variant?: 'primary' | 'secondary';`
 */
function parseSingleProp(line, jsdocRaw) {
  // Clean trailing semicolons/commas
  const cleaned = line.replace(/[;,]\s*$/, "").trim();

  // Match: propName? : Type
  const propMatch = cleaned.match(/^(\w+)(\?)?\s*:\s*([\s\S]+)$/);
  if (!propMatch) return null;

  const [, name, optionalMarker, rawType] = propMatch;

  // Skip internal/noise props
  if (name.startsWith("_")) return null;

  const type = rawType.trim();
  const required = !optionalMarker;

  const jsdoc = parseJSDoc(jsdocRaw);

  return {
    name,
    type,
    required,
    description: jsdoc.description,
    deprecated: jsdoc.tags.deprecated
      ? typeof jsdoc.tags.deprecated === "string"
        ? jsdoc.tags.deprecated
        : true
      : false,
    experimental: !!jsdoc.tags.experimental,
    defaultValue: undefined, // filled later
  };
}

// ---------------------------------------------------------------------------
// Default value extraction
// ---------------------------------------------------------------------------

/**
 * Find default values from the component's destructuring pattern.
 * Looks for patterns like: { variant = "primary", size = "md", loading = false }
 * Uses brace-matching to handle multi-line destructuring correctly.
 */
function extractDefaultValues(content) {
  const defaults = {};

  // Find destructuring blocks by looking for opening patterns then brace-matching.
  // Patterns we look for:
  //   forwardRef<...>( ( { ... }, ref ) => {
  //   : React.FC<...> = ({ ... }) => {

  // Strategy: find all `({` or `( {` occurrences that look like destructuring params
  const openPatterns = [
    // forwardRef callback: ( { ...
    /\(\s*\{/g,
  ];

  for (const re of openPatterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      // Find the position of the opening brace
      const bracePos = content.indexOf("{", m.index);
      if (bracePos === -1) continue;

      const block = extractBracedBlock(content, bracePos + 1);
      if (block === null) continue;

      // Only process if this looks like a destructuring pattern (has prop = value)
      if (!/\w+\s*=\s*/.test(block)) continue;

      // Find prop = defaultValue patterns
      // Handle: prop = "value", prop = false, prop = 123, prop = 'value'
      const defaultRe =
        /(\w+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|true|false|null|undefined|\d+(?:\.\d+)?)/g;
      let dm;
      while ((dm = defaultRe.exec(block)) !== null) {
        const [, propName, defaultVal] = dm;
        defaults[propName] = defaultVal.replace(/^["']|["']$/g, "");
      }
    }
  }

  return defaults;
}

// ---------------------------------------------------------------------------
// Component extraction orchestrator
// ---------------------------------------------------------------------------

/**
 * Extract all prop interfaces from a component directory.
 */
async function extractComponentProps(componentInfo) {
  const sourceFiles = await findSourceFiles(componentInfo.path);
  if (sourceFiles.length === 0) return [];

  const components = [];

  for (const filePath of sourceFiles) {
    let content;
    try {
      content = await readFile(filePath, "utf-8");
    } catch {
      continue;
    }

    const propsBlocks = findPropsBlocks(content);
    if (propsBlocks.length === 0) continue;

    const defaults = extractDefaultValues(content);
    const relPath = relative(
      join(import.meta.dirname, ".."),
      filePath,
    );

    for (const block of propsBlocks) {
      const props = parsePropsBody(block.body, content);

      // Merge default values
      for (const prop of props) {
        if (defaults[prop.name] !== undefined && prop.defaultValue === undefined) {
          prop.defaultValue = defaults[prop.name];
        }
      }

      // Derive component name from interface name (remove "Props" suffix)
      const componentName = block.name.replace(/Props$/, "") || basename(filePath, ".tsx");

      components.push({
        name: componentName,
        interfaceName: block.name,
        category: componentInfo.category,
        filePath: relPath,
        extends: block.extendsClause || undefined,
        props,
      });
    }
  }

  return components;
}

// ---------------------------------------------------------------------------
// Output generators
// ---------------------------------------------------------------------------

function generateJSON(components) {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      componentCount: components.length,
      components,
    },
    null,
    2,
  );
}

function generateMarkdown(components) {
  const lines = [];

  lines.push("# API Reference");
  lines.push("");
  lines.push(
    `> Auto-generated on ${new Date().toISOString().split("T")[0]} by \`generate-api-reference.mjs\``,
  );
  lines.push(`> ${components.length} component interfaces documented.`);
  lines.push("");

  // Table of contents
  lines.push("## Table of Contents");
  lines.push("");

  const grouped = {};
  for (const comp of components) {
    const cat = comp.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(comp);
  }

  for (const [category, comps] of Object.entries(grouped)) {
    lines.push(`### ${capitalize(category)}`);
    lines.push("");
    for (const comp of comps) {
      lines.push(`- [${comp.name}](#${comp.name.toLowerCase()})`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  // Component sections
  for (const comp of components) {
    lines.push(`## ${comp.name}`);
    lines.push("");
    lines.push(`**Category:** ${comp.category}`);
    lines.push(`**Interface:** \`${comp.interfaceName}\``);
    lines.push(`**Source:** \`${comp.filePath}\``);
    if (comp.extends) {
      lines.push(`**Extends:** \`${comp.extends}\``);
    }
    lines.push("");

    if (comp.props.length === 0) {
      lines.push("_No props defined._");
      lines.push("");
      lines.push("---");
      lines.push("");
      continue;
    }

    // Props table
    lines.push("| Prop | Type | Required | Default | Description |");
    lines.push("|------|------|----------|---------|-------------|");

    for (const prop of comp.props) {
      const flags = [];
      if (prop.deprecated) flags.push("**DEPRECATED**");
      if (prop.experimental) flags.push("_experimental_");

      let desc = prop.description || "";
      if (flags.length > 0) {
        desc = flags.join(" ") + (desc ? ` ${desc}` : "");
      }
      if (prop.deprecated && typeof prop.deprecated === "string") {
        desc += ` (${prop.deprecated})`;
      }

      // Escape pipes in type strings
      const typeStr = escapeMarkdown(prop.type);
      const defaultStr = prop.defaultValue !== undefined ? `\`${prop.defaultValue}\`` : "-";

      lines.push(
        `| \`${prop.name}\` | \`${typeStr}\` | ${prop.required ? "Yes" : "No"} | ${defaultStr} | ${desc} |`,
      );
    }

    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeMarkdown(str) {
  return str.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const outputJson = args.includes("--json") || !args.includes("--md");
  const outputMd = args.includes("--md") || !args.includes("--json");
  const filterIdx = args.indexOf("--component");
  const filterComponent = filterIdx !== -1 ? args[filterIdx + 1] : null;

  // Discover all component directories
  const allDirs = [];
  for (const baseDir of COMPONENT_DIRS) {
    const dirs = await findComponentDirs(baseDir);
    allDirs.push(...dirs);
  }

  console.log(`Scanning ${allDirs.length} component directories...`);

  // Extract props from each
  let components = [];
  let skipped = 0;

  for (const dir of allDirs) {
    try {
      const comps = await extractComponentProps(dir);
      components.push(...comps);
    } catch (err) {
      console.warn(`  [skip] ${dir.name}: ${err.message}`);
      skipped++;
    }
  }

  // Filter if requested
  if (filterComponent) {
    components = components.filter(
      (c) =>
        c.name.toLowerCase() === filterComponent.toLowerCase() ||
        c.interfaceName.toLowerCase() === filterComponent.toLowerCase() + "props",
    );
  }

  // Sort: primitives first, then components, alphabetically within
  const categoryOrder = { primitives: 0, components: 1, advanced: 2 };
  components.sort((a, b) => {
    const catDiff =
      (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Write outputs
  if (outputJson) {
    const jsonPath = join(OUTPUT_DIR, "api-reference.json");
    await writeFile(jsonPath, generateJSON(components), "utf-8");
  }

  if (outputMd) {
    const mdPath = join(OUTPUT_DIR, "API-REFERENCE.md");
    await writeFile(mdPath, generateMarkdown(components), "utf-8");
  }

  // Summary
  const totalProps = components.reduce((sum, c) => sum + c.props.length, 0);
  console.log(`\nAPI Reference Generated`);
  console.log(`  Components: ${components.length}`);
  console.log(`  Total props: ${totalProps}`);
  if (skipped > 0) console.log(`  Skipped: ${skipped}`);
  if (outputJson) console.log(`  JSON: docs/api/api-reference.json`);
  if (outputMd) console.log(`  MD:   docs/api/API-REFERENCE.md`);
}

main().catch(console.error);
