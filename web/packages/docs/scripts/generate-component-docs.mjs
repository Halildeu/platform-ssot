#!/usr/bin/env node
/**
 * generate-component-docs.mjs
 *
 * Reads design-system API reference JSON and generates Starlight-compatible
 * .mdx files for each component.
 *
 * Usage:
 *   node scripts/generate-component-docs.mjs
 *
 * Expects:
 *   ../design-system/docs/api/api-reference.json
 *
 * Outputs:
 *   src/content/docs/components/<component-name>.mdx
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const API_REF_PATHS = [
  path.resolve(ROOT, '../design-system/docs/api/api-reference.json'),
  path.resolve(ROOT, '../design-system/api-reference.json'),
  path.resolve(ROOT, '../design-system/docs/api-reference.json'),
];

const OUTPUT_DIR = path.resolve(ROOT, 'src/content/docs/components');

// --- Helpers ---

function findApiReference() {
  for (const p of API_REF_PATHS) {
    if (fs.existsSync(p)) {
      console.log(`Found API reference at: ${p}`);
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  }
  return null;
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function escapeForTable(str) {
  return (str || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function generatePropsTable(props) {
  if (!props || props.length === 0) return '';

  const rows = props.map((prop) => {
    const name = `\`${prop.name}\``;
    const type = `\`${escapeForTable(prop.type || 'unknown')}\``;
    const defaultVal = prop.defaultValue ? `\`${escapeForTable(prop.defaultValue)}\`` : '—';
    const required = prop.required ? '**Evet**' : 'Hayır';
    const desc = escapeForTable(prop.description || '');
    return `| ${name} | ${type} | ${defaultVal} | ${required} | ${desc} |`;
  });

  return [
    '## Props',
    '',
    '| Prop | Tip | Varsayılan | Zorunlu | Açıklama |',
    '|------|-----|-----------|---------|----------|',
    ...rows,
  ].join('\n');
}

function generateMdx(component) {
  const { name, description, props, category } = component;

  const sections = [
    '---',
    `title: ${name}`,
    `description: '${escapeForTable(description || `${name} bileşeni`)}'`,
    '---',
    '',
    '## Import',
    '',
    '```tsx',
    `import { ${name} } from '@mfe/design-system';`,
    '```',
    '',
    '## Kullanım',
    '',
    '```tsx',
    `<${name} />`,
    '```',
    '',
  ];

  const propsTable = generatePropsTable(props);
  if (propsTable) {
    sections.push(propsTable, '');
  }

  // Add accessibility section
  sections.push(
    '## Erişilebilirlik',
    '',
    '- Keyboard navigasyonu desteklenir',
    '- ARIA attribute\'ları otomatik eklenir',
    '- Focus yönetimi `:focus-visible` ile sağlanır',
    '',
  );

  return sections.join('\n');
}

// --- Main ---

function main() {
  const apiRef = findApiReference();

  if (!apiRef) {
    console.log('API reference JSON not found at any expected location.');
    console.log('Searched paths:');
    API_REF_PATHS.forEach((p) => console.log(`  - ${p}`));
    console.log('');
    console.log('Generating placeholder docs for known components...');
    generatePlaceholders();
    return;
  }

  // Support both array and object formats
  const components = Array.isArray(apiRef)
    ? apiRef
    : apiRef.components || Object.values(apiRef);

  if (!components || components.length === 0) {
    console.log('No components found in API reference.');
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const component of components) {
    const name = component.name || component.displayName;
    if (!name) {
      skipped++;
      continue;
    }

    const filename = `${toKebabCase(name)}.mdx`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip manually authored docs (button, input, data-grid)
    const manualDocs = ['button.mdx', 'input.mdx', 'data-grid.mdx', 'index.mdx'];
    if (manualDocs.includes(filename)) {
      console.log(`  SKIP ${filename} (manually authored)`);
      skipped++;
      continue;
    }

    const content = generateMdx(component);
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  WRITE ${filename}`);
    generated++;
  }

  console.log('');
  console.log(`Done: ${generated} generated, ${skipped} skipped.`);
}

function generatePlaceholders() {
  // Known component list for placeholder generation when API ref is unavailable
  const knownComponents = [
    { name: 'Checkbox', description: 'Onay kutusu bileşeni' },
    { name: 'Radio', description: 'Radyo butonu bileşeni' },
    { name: 'Select', description: 'Açılır liste bileşeni' },
    { name: 'Switch', description: 'Anahtar bileşeni' },
    { name: 'Textarea', description: 'Çok satırlı metin girişi' },
    { name: 'Badge', description: 'Rozet / etiket bileşeni' },
    { name: 'Tooltip', description: 'İpucu bileşeni' },
    { name: 'Modal', description: 'Diyalog / modal pencere' },
    { name: 'Tabs', description: 'Sekme bileşeni' },
    { name: 'Accordion', description: 'Akordiyon bileşeni' },
    { name: 'DatePicker', description: 'Tarih seçici bileşeni' },
    { name: 'Card', description: 'Kart bileşeni' },
  ];

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let generated = 0;

  for (const comp of knownComponents) {
    const filename = `${toKebabCase(comp.name)}.mdx`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`  SKIP ${filename} (already exists)`);
      continue;
    }

    const content = generateMdx(comp);
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  WRITE ${filename}`);
    generated++;
  }

  console.log(`\nPlaceholders generated: ${generated}`);
}

main();
