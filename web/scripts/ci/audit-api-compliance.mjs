#!/usr/bin/env node
/**
 * audit-api-compliance.mjs
 *
 * Scans all primitive and component files, extracts their Props interfaces,
 * and checks compliance against the standard component contract.
 *
 * Outputs a markdown table showing which standard props each component
 * supports, missing, or deviates from.
 *
 * Usage: node scripts/ci/audit-api-compliance.mjs
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const DS_SRC = join(ROOT, "packages/design-system/src");

/* ------------------------------------------------------------------ */
/*  Standard contract props                                            */
/* ------------------------------------------------------------------ */

const INTERACTIVE_PROPS = ["size", "density", "className", "disabled", "data-testid"];
const FORM_FIELD_PROPS = [...INTERACTIVE_PROPS, "label", "description", "error", "readOnly", "loading", "required"];
const OVERLAY_PROPS = ["open", "onClose", "closeOnEscape", "className"];

/* ------------------------------------------------------------------ */
/*  Known component classifications                                    */
/* ------------------------------------------------------------------ */

const FORM_FIELD_COMPONENTS = new Set([
  "Input", "Select", "Checkbox", "Radio", "Switch", "Textarea",
  "DatePicker", "TimePicker", "ColorPicker", "Slider", "Rating",
  "Combobox", "Mentions", "Transfer",
]);

const OVERLAY_COMPONENTS = new Set([
  "Dialog", "Modal", "Popover", "Tooltip", "Dropdown", "ContextMenu",
  "CommandPalette", "NotificationDrawer",
]);

/* ------------------------------------------------------------------ */
/*  Prop extraction via regex                                          */
/* ------------------------------------------------------------------ */

/**
 * Extract property names from a TypeScript interface/type definition.
 * Uses regex heuristics -- not a full parser, but good enough for auditing.
 */
function extractPropsFromFile(filePath) {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath, "utf-8");

  // Find the main Props interface (e.g., ButtonProps, SelectProps)
  // Match: interface XxxProps { ... }
  const interfaceRe = /export\s+interface\s+(\w+Props)\s+(?:extends\s+[^{]+)?\{/g;
  let bestMatch = null;
  let m;

  while ((m = interfaceRe.exec(content)) !== null) {
    // Take the first Props interface that looks like the main one
    if (!bestMatch || m[1].length < bestMatch.name.length) {
      bestMatch = { name: m[1], index: m.index + m[0].length };
    }
  }

  if (!bestMatch) return null;

  // Extract the body of the interface by counting braces
  let depth = 1;
  let i = bestMatch.index;
  while (i < content.length && depth > 0) {
    if (content[i] === "{") depth++;
    if (content[i] === "}") depth--;
    i++;
  }
  const body = content.slice(bestMatch.index, i - 1);

  // Extract property names from the body
  // Match lines like: propName?: Type  or  propName: Type  or  'data-testid'?: string
  const props = new Set();
  const propRe = /(?:['"]([^'"]+)['"]|(\w+))\s*\??:/g;
  let pm;
  while ((pm = propRe.exec(body)) !== null) {
    props.add(pm[1] || pm[2]);
  }

  // Also check extends clause for inherited props
  const extendsMatch = content.slice(Math.max(0, bestMatch.index - 200), bestMatch.index)
    .match(/extends\s+([^{]+)/);
  const extendsClause = extendsMatch ? extendsMatch[1] : "";

  // If it extends HTMLAttributes, it inherits className, disabled, etc.
  const inheritsHTML = /HTML\w*Attributes|React\.\w*HTMLAttributes/.test(extendsClause);
  if (inheritsHTML) {
    props.add("className");
    props.add("disabled");
    props.add("data-testid"); // via React HTML attributes
  }

  // Check for Omit<..., "size"> which means size is removed from HTML attrs
  const omitMatch = extendsClause.match(/Omit<[^>]+,\s*["']([^"']+)["']/);

  // Check for size-related props with non-standard names
  const sizeAliases = {};
  for (const prop of props) {
    if (prop !== "size" && prop.toLowerCase().includes("size")) {
      sizeAliases[prop] = true;
    }
  }

  return {
    interfaceName: bestMatch.name,
    props: [...props],
    inheritsHTML,
    sizeAliases,
  };
}

/* ------------------------------------------------------------------ */
/*  Scan directories                                                    */
/* ------------------------------------------------------------------ */

function scanDirectory(dirPath, label) {
  const results = [];
  if (!existsSync(dirPath)) return results;

  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const entryPath = join(dirPath, entry);
    if (!statSync(entryPath).isDirectory()) continue;
    if (entry === "__tests__" || entry === "index.ts") continue;

    // Find the main component file
    const candidates = [
      join(entryPath, `${capitalize(entry)}.tsx`),
      join(entryPath, `${capitalize(kebabToPascal(entry))}.tsx`),
      join(entryPath, `index.tsx`),
    ];

    let componentFile = null;
    for (const c of candidates) {
      if (existsSync(c)) {
        componentFile = c;
        break;
      }
    }

    if (!componentFile) {
      // Try to find any .tsx file
      const tsxFiles = readdirSync(entryPath).filter(
        (f) => f.endsWith(".tsx") && !f.includes(".stories.") && !f.includes(".test.")
      );
      if (tsxFiles.length > 0) {
        componentFile = join(entryPath, tsxFiles[0]);
      }
    }

    if (componentFile) {
      const extracted = extractPropsFromFile(componentFile);
      if (extracted) {
        results.push({
          name: kebabToPascal(entry),
          file: componentFile.replace(ROOT + "/", ""),
          tier: label,
          ...extracted,
        });
      }
    }
  }
  return results;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function kebabToPascal(s) {
  return s
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

console.log("# API Compliance Audit Report\n");
console.log(`Generated: ${new Date().toISOString().split("T")[0]}\n`);

const primitives = scanDirectory(join(DS_SRC, "primitives"), "primitive");
const components = scanDirectory(join(DS_SRC, "components"), "component");
const allComponents = [...primitives, ...components];

/* ------------------------------------------------------------------ */
/*  Generate compliance table                                          */
/* ------------------------------------------------------------------ */

function getContractType(name) {
  if (FORM_FIELD_COMPONENTS.has(name)) return "form-field";
  if (OVERLAY_COMPONENTS.has(name)) return "overlay";
  return "interactive";
}

function getRequiredProps(contract) {
  if (contract === "form-field") return FORM_FIELD_PROPS;
  if (contract === "overlay") return OVERLAY_PROPS;
  return INTERACTIVE_PROPS;
}

console.log("## Compliance Summary\n");
console.log("| Component | Tier | Contract | Compliant Props | Missing Props | Non-standard |");
console.log("|-----------|------|----------|-----------------|---------------|-------------|");

let totalCompliant = 0;
let totalChecked = 0;

for (const comp of allComponents) {
  const contract = getContractType(comp.name);
  const required = getRequiredProps(contract);
  const propSet = new Set(comp.props);

  const compliant = [];
  const missing = [];
  for (const prop of required) {
    if (propSet.has(prop)) {
      compliant.push(prop);
    } else {
      missing.push(prop);
    }
  }

  const nonStandard = Object.keys(comp.sizeAliases || {});
  const missingStr = missing.length > 0 ? missing.join(", ") : "--";
  const nonStdStr = nonStandard.length > 0 ? nonStandard.join(", ") : "--";

  console.log(
    `| ${comp.name} | ${comp.tier} | ${contract} | ${compliant.length}/${required.length} | ${missingStr} | ${nonStdStr} |`
  );

  totalCompliant += compliant.length;
  totalChecked += required.length;
}

console.log("");
console.log(`**Overall compliance: ${totalCompliant}/${totalChecked} (${Math.round((totalCompliant / totalChecked) * 100)}%)**\n`);

/* ------------------------------------------------------------------ */
/*  Known inconsistencies                                              */
/* ------------------------------------------------------------------ */

console.log("## Known Prop Naming Inconsistencies\n");
console.log("| Component | Non-standard Prop | Standard | Status |");
console.log("|-----------|-------------------|----------|--------|");

const knownIssues = [
  { component: "Select", nonStandard: "selectSize", standard: "size", status: "Migration planned" },
  { component: "Switch", nonStandard: "switchSize", standard: "size", status: "Migration planned" },
  { component: "Checkbox", nonStandard: "checkboxSize", standard: "size", status: "Migration planned" },
  { component: "Radio", nonStandard: "radioSize", standard: "size", status: "Migration planned" },
  { component: "Input", nonStandard: "invalid", standard: "error (boolean)", status: "Both accepted" },
  { component: "Select", nonStandard: "label (deprecated)", standard: "label", status: "Deprecated in Select" },
];

for (const issue of knownIssues) {
  console.log(
    `| ${issue.component} | \`${issue.nonStandard}\` | \`${issue.standard}\` | ${issue.status} |`
  );
}

console.log("");
