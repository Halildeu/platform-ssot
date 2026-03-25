#!/usr/bin/env node
/**
 * generate-figma-connect-stubs.mjs
 *
 * Scans design-system component directories and generates `.figma.tsx`
 * Code Connect stubs for every component that doesn't already have one.
 *
 * Usage:
 *   node scripts/generate-figma-connect-stubs.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const DS_SRC = path.join(ROOT, 'packages', 'design-system', 'src');
const COMPONENT_MAP_PATH = path.join(ROOT, 'packages', 'design-system', 'figma-component-map.json');

const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Directories to scan
// ---------------------------------------------------------------------------

/** Directories where components live in sub-folders (primitives/button/Button.tsx) */
const FOLDER_BASED_DIRS = ['primitives', 'components', 'patterns', 'advanced'];

/** Directories where components are flat files (enterprise/ActivityFeed.tsx) */
const FLAT_DIRS = ['enterprise'];

/** Directories/files to skip */
const SKIP_DIRS = new Set(['__tests__', '_shared', '__visual__', '{data-grid}']);
const SKIP_FILE_PATTERNS = [/\.stories\.tsx$/, /\.test\.tsx$/, /\.spec\.tsx$/, /\.figma\.tsx$/, /index\.ts$/, /types\.ts$/];

// ---------------------------------------------------------------------------
// Prop extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extract the component name from the filename.
 * e.g. "Button.tsx" -> "Button", "TextInput.tsx" -> "TextInput"
 */
function componentNameFromFile(filename) {
  return filename.replace(/\.tsx?$/, '');
}

/**
 * Convert kebab-case directory name to PascalCase.
 * e.g. "icon-button" -> "IconButton"
 */
function kebabToPascal(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Parse a TypeScript union type string into its literal values.
 * e.g. "'primary' | 'secondary' | 'outline'" -> ['primary', 'secondary', 'outline']
 */
function parseUnionValues(unionStr) {
  if (!unionStr) return null;
  const matches = unionStr.match(/'([^']+)'/g) || unionStr.match(/"([^"]+)"/g);
  if (!matches) return null;
  return matches.map((m) => m.replace(/['"]/g, ''));
}

/**
 * Resolve a type alias referenced in props.
 * Searches the source for `type Alias = 'a' | 'b' | ...` patterns.
 */
function resolveTypeAlias(source, typeName) {
  if (!typeName || typeName.length < 2) return null;
  // Escape special regex chars in type name
  const escaped = typeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Look for: export type TypeName = 'a' | 'b' | 'c';
  const re = new RegExp(`(?:export\\s+)?type\\s+${escaped}\\s*=\\s*([^;]+);`, 's');
  const m = source.match(re);
  if (!m || !m[1]) return null;
  return parseUnionValues(m[1]);
}

/**
 * Extract props from a component source file.
 * Returns an array of { name, figmaCall } entries.
 */
function extractProps(source) {
  // Find the props interface or type
  const interfaceMatch = source.match(
    /(?:export\s+)?interface\s+(\w+Props)\s+(?:extends\s+[^{]+)?\{([\s\S]*?)^\}/m
  );
  const typeMatch = source.match(
    /(?:export\s+)?type\s+(\w+Props)\s*=\s*(?:[^{]*&\s*)?\{([\s\S]*?)^\}/m
  );

  const propsBlock = interfaceMatch?.[2] || typeMatch?.[2];
  if (!propsBlock) return [];

  const props = [];
  // Match each prop line: propName?: Type  or  propName: Type
  const propRegex = /^\s+(\w+)\??\s*:\s*([^;]+)/gm;
  let match;

  while ((match = propRegex.exec(propsBlock)) !== null) {
    const propName = match[1];
    let propType = match[2].trim();

    // Skip callback props, ReactNode (slots), complex types, internal props
    if (propName.startsWith('on') && propName.length > 2 && propName[2] === propName[2].toUpperCase()) continue;
    if (propType.includes('ReactNode') || propType.includes('React.ReactNode')) continue;
    if (propType.includes('=>')) continue; // function types
    if (propType.includes('Record<')) continue;
    if (propType.includes('[]') && !propType.match(/^'[^']+'\[\]$/)) continue; // arrays (non-union)
    if (propName === 'children') continue;
    if (propName === 'className') continue;
    if (propName === 'style') continue;
    if (propName === 'ref') continue;
    if (propName === 'asChild') continue;
    if (propName.startsWith('aria')) continue;
    if (propName === 'id') continue;
    if (propName === 'key') continue;
    if (propName === 'as') continue;
    if (propName === 'role') continue;
    if (propName === 'tabIndex') continue;
    if (propName === 'testId') continue;
    if (propName === 'data') continue;
    if (propName === 'items') continue;
    if (propName === 'accessRole') continue;
    if (propName === 'accessDenyMessage') continue;

    // Determine figma call type
    if (propType === 'boolean') {
      const label = propName.charAt(0).toUpperCase() + propName.slice(1);
      props.push({ name: propName, figmaCall: `figma.boolean('${label}')` });
      continue;
    }

    if (propType === 'string') {
      const label = propName.charAt(0).toUpperCase() + propName.slice(1);
      props.push({ name: propName, figmaCall: `figma.string('${label}')` });
      continue;
    }

    if (propType === 'number') {
      // Skip number props - no direct figma mapping for arbitrary numbers
      continue;
    }

    // Check inline union: 'a' | 'b' | 'c'
    const inlineValues = parseUnionValues(propType);
    if (inlineValues && inlineValues.length > 0) {
      const label = propName.charAt(0).toUpperCase() + propName.slice(1);
      const enumMap = inlineValues.map((v) => `      ${v}: '${v}'`).join(',\n');
      props.push({
        name: propName,
        figmaCall: `figma.enum('${label}', {\n${enumMap},\n    })`,
      });
      continue;
    }

    // Check if it references a type alias
    const typeRef = propType.replace(/\s/g, '');
    const resolvedValues = resolveTypeAlias(source, typeRef);
    if (resolvedValues && resolvedValues.length > 0) {
      const label = propName.charAt(0).toUpperCase() + propName.slice(1);
      const enumMap = resolvedValues.map((v) => `      ${v}: '${v}'`).join(',\n');
      props.push({
        name: propName,
        figmaCall: `figma.enum('${label}', {\n${enumMap},\n    })`,
      });
      continue;
    }
  }

  return props;
}

/**
 * Generate the .figma.tsx stub content for a component.
 */
function generateStub(componentName, importPath, props) {
  const propsSection = props
    .map((p) => `    ${p.name}: ${p.figmaCall},`)
    .join('\n');

  const propNames = props.map((p) => p.name);
  const spreadOrNamed =
    propNames.length <= 3
      ? `({ ${propNames.join(', ')} })`
      : '(props)';

  const jsxProps =
    propNames.length <= 3
      ? propNames.map((n) => `${n}={${n}}`).join(' ')
      : '{...props}';

  return `import figma from '@figma/code-connect';
import { ${componentName} } from './${importPath}';

figma.connect(${componentName}, 'FIGMA_URL_PLACEHOLDER', {
  props: {
${propsSection}
  },
  example: ${spreadOrNamed} => (
    <${componentName} ${jsxProps} />
  ),
});
`;
}

// ---------------------------------------------------------------------------
// Directory scanning
// ---------------------------------------------------------------------------

/**
 * Find the main component file in a directory.
 * Returns the filename (e.g. "Button.tsx") or null.
 */
function findMainComponentFile(dirPath) {
  const dirName = path.basename(dirPath);
  const expectedName = kebabToPascal(dirName);

  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch {
    return null;
  }

  // Filter to .tsx files that aren't tests/stories/figma/index
  const candidates = files.filter((f) => {
    if (!f.endsWith('.tsx')) return false;
    return !SKIP_FILE_PATTERNS.some((pat) => pat.test(f));
  });

  // Prefer exact PascalCase match
  const exactMatch = candidates.find(
    (f) => componentNameFromFile(f) === expectedName
  );
  if (exactMatch) return exactMatch;

  // Otherwise pick the first candidate that looks like a component (starts uppercase)
  return candidates.find((f) => /^[A-Z]/.test(f)) || null;
}

/**
 * Process a folder-based component directory.
 */
function processFolderDir(category, dirName) {
  const dirPath = path.join(DS_SRC, category, dirName);

  if (SKIP_DIRS.has(dirName)) return null;
  if (!fs.statSync(dirPath).isDirectory()) return null;

  // Check if .figma.tsx already exists
  const existingFigma = fs.readdirSync(dirPath).find((f) => f.endsWith('.figma.tsx'));
  if (existingFigma) {
    return { componentName: componentNameFromFile(existingFigma.replace('.figma.tsx', '.tsx')), skipped: true };
  }

  const mainFile = findMainComponentFile(dirPath);
  if (!mainFile) return null;

  const componentName = componentNameFromFile(mainFile);
  const source = fs.readFileSync(path.join(dirPath, mainFile), 'utf-8');
  const props = extractProps(source);

  const stubContent = generateStub(componentName, componentName, props);
  const stubPath = path.join(dirPath, `${componentName}.figma.tsx`);

  if (!DRY_RUN) {
    fs.writeFileSync(stubPath, stubContent, 'utf-8');
  }

  return { componentName, stubPath, props: props.length, skipped: false };
}

/**
 * Process a flat enterprise-style component file.
 */
function processFlatFile(category, fileName) {
  if (!fileName.endsWith('.tsx')) return null;
  if (SKIP_FILE_PATTERNS.some((pat) => pat.test(fileName))) return null;
  if (fileName === 'types.ts') return null;

  const dirPath = path.join(DS_SRC, category);
  const componentName = componentNameFromFile(fileName);
  const figmaFileName = `${componentName}.figma.tsx`;

  // Check if .figma.tsx already exists
  if (fs.existsSync(path.join(dirPath, figmaFileName))) {
    return { componentName, skipped: true };
  }

  const source = fs.readFileSync(path.join(dirPath, fileName), 'utf-8');
  const props = extractProps(source);

  const stubContent = generateStub(componentName, componentName, props);
  const stubPath = path.join(dirPath, figmaFileName);

  if (!DRY_RUN) {
    fs.writeFileSync(stubPath, stubContent, 'utf-8');
  }

  return { componentName, stubPath, props: props.length, skipped: false };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('Figma Code Connect Stub Generator');
  console.log('=================================');
  if (DRY_RUN) console.log('(dry-run mode — no files will be written)\n');

  const allComponents = {};
  let created = 0;
  let skipped = 0;

  // Process folder-based directories
  for (const category of FOLDER_BASED_DIRS) {
    const categoryPath = path.join(DS_SRC, category);
    if (!fs.existsSync(categoryPath)) continue;

    const dirs = fs.readdirSync(categoryPath);
    for (const dirName of dirs) {
      const result = processFolderDir(category, dirName);
      if (!result) continue;

      const key = result.componentName;
      allComponents[key] = {
        figmaUrl: 'FIGMA_URL_PLACEHOLDER',
        figmaNodeId: '',
        category,
      };

      if (result.skipped) {
        skipped++;
        console.log(`  SKIP  ${category}/${dirName} (already has .figma.tsx)`);
      } else {
        created++;
        console.log(`  NEW   ${category}/${dirName}/${result.componentName}.figma.tsx (${result.props} props)`);
      }
    }
  }

  // Process flat directories (enterprise)
  for (const category of FLAT_DIRS) {
    const categoryPath = path.join(DS_SRC, category);
    if (!fs.existsSync(categoryPath)) continue;

    const files = fs.readdirSync(categoryPath);
    for (const fileName of files) {
      const result = processFlatFile(category, fileName);
      if (!result) continue;

      const key = result.componentName;
      allComponents[key] = {
        figmaUrl: 'FIGMA_URL_PLACEHOLDER',
        figmaNodeId: '',
        category,
      };

      if (result.skipped) {
        skipped++;
        console.log(`  SKIP  ${category}/${result.componentName} (already has .figma.tsx)`);
      } else {
        created++;
        console.log(`  NEW   ${category}/${result.componentName}.figma.tsx (${result.props} props)`);
      }
    }
  }

  // Write component map
  const componentMap = {
    $schema: './figma-component-map.schema.json',
    components: {},
  };

  for (const [name, info] of Object.entries(allComponents).sort(([a], [b]) => a.localeCompare(b))) {
    componentMap.components[name] = {
      figmaUrl: info.figmaUrl,
      figmaNodeId: info.figmaNodeId,
    };
  }

  if (!DRY_RUN) {
    fs.writeFileSync(COMPONENT_MAP_PATH, JSON.stringify(componentMap, null, 2) + '\n', 'utf-8');
    console.log(`\nWrote ${COMPONENT_MAP_PATH}`);
  }

  console.log(`\nSummary:`);
  console.log(`  Created: ${created} stubs`);
  console.log(`  Skipped: ${skipped} (already existed)`);
  console.log(`  Total components in map: ${Object.keys(allComponents).length}`);
}

main();
