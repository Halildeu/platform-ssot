#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const SRC_ROOT = path.join(ROOT, 'src');
const AUTHORING_META_FILENAME = 'component.authoring.v1.json';
const AUTHORING_NEXT_STEPS_FILENAME = 'component.authoring.next-steps.md';
const PROFILES_PATH = path.join(ROOT, 'docs', 'component-authoring.profiles.v1.json');
const DOC_INDEX_PATH = path.join(SRC_ROOT, 'catalog', 'component-docs', 'index.ts');
const API_REFERENCE_PATH = path.join(ROOT, 'docs', 'api', 'api-reference.json');

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');

const categoryBarrels = {
  primitive: path.join(SRC_ROOT, 'primitives', 'index.ts'),
  component: path.join(SRC_ROOT, 'components', 'index.ts'),
};

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');
const exists = (filePath) => fs.existsSync(filePath);
const profileConfig = JSON.parse(readFile(PROFILES_PATH));

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
    } else {
      files.push(entryPath);
    }
  }

  return files;
};

const metadataFiles = walk(path.join(SRC_ROOT, 'primitives'))
  .concat(walk(path.join(SRC_ROOT, 'components')))
  .filter((filePath) => path.basename(filePath) === AUTHORING_META_FILENAME);

if (metadataFiles.length === 0) {
  console.log('component-completeness: no scaffold-managed components found.');
  process.exit(0);
}

const failures = [];
const warnings = [];
const barrelCache = new Map();
let docIndexContent = null;
let apiReference = null;

const getBarrelContent = (componentType) => {
  if (!barrelCache.has(componentType)) {
    barrelCache.set(componentType, readFile(categoryBarrels[componentType]));
  }
  return barrelCache.get(componentType);
};

const getDocIndexContent = () => {
  if (docIndexContent === null) {
    docIndexContent = exists(DOC_INDEX_PATH) ? readFile(DOC_INDEX_PATH) : '';
  }
  return docIndexContent;
};

const getApiReference = () => {
  if (apiReference === null) {
    apiReference = exists(API_REFERENCE_PATH) ? JSON.parse(readFile(API_REFERENCE_PATH)) : null;
  }
  return apiReference;
};

for (const metadataPath of metadataFiles) {
  const componentDir = path.dirname(metadataPath);
  const metadata = JSON.parse(readFile(metadataPath));
  const componentType = metadata.type;
  const componentName = metadata.name;
  const kebab = metadata.kebabName;
  const artifacts = metadata.artifacts ?? {};
  const profile = profileConfig.profiles[metadata.profile];

  if (!profile) {
    failures.push(
      `${path.relative(ROOT, componentDir)} -> unknown authoring profile "${metadata.profile}" in ${path.relative(ROOT, metadataPath)}`,
    );
    continue;
  }

  if (!profile.allowedTypes.includes(componentType)) {
    failures.push(
      `${path.relative(ROOT, componentDir)} -> profile "${metadata.profile}" does not allow type "${componentType}"`,
    );
  }

  const requiredFiles = [
    path.join(componentDir, `${componentName}.tsx`),
    path.join(componentDir, 'index.ts'),
  ];

  if (artifacts.nextSteps !== false) {
    requiredFiles.push(path.join(componentDir, AUTHORING_NEXT_STEPS_FILENAME));
  }

  if (artifacts.story !== false) {
    requiredFiles.push(path.join(componentDir, `${componentName}.stories.tsx`));
  }

  if (artifacts.unitTest !== false) {
    requiredFiles.push(path.join(componentDir, '__tests__', `${componentName}.test.tsx`));
  }

  if (artifacts.contractTest === true) {
    requiredFiles.push(path.join(componentDir, '__tests__', `${componentName}.contract.test.tsx`));
  }

  if (artifacts.docStub === true) {
    requiredFiles.push(
      path.join(SRC_ROOT, 'catalog', 'component-docs', 'entries', `${componentName}.doc.ts`),
    );
  }

  for (const filePath of requiredFiles) {
    if (!exists(filePath)) {
      failures.push(
        `${path.relative(ROOT, componentDir)} -> missing ${path.relative(ROOT, filePath)}`,
      );
    }
  }

  const barrelContent = getBarrelContent(componentType);
  const expectedBarrelPatterns = [`"./${kebab}"`, `'./${kebab}'`];
  if (!expectedBarrelPatterns.some((pattern) => barrelContent.includes(pattern))) {
    failures.push(
      `${path.relative(ROOT, componentDir)} -> missing category barrel export in ${path.relative(ROOT, categoryBarrels[componentType])}`,
    );
  }

  if (artifacts.docStub === true) {
    const docIndex = getDocIndexContent();
    const expectedDocIndexPatterns = [
      `./entries/${componentName}.doc`,
      `./entries/${componentName}.doc"`,
      `./entries/${componentName}.doc'`,
    ];

    if (!expectedDocIndexPatterns.some((pattern) => docIndex.includes(pattern))) {
      failures.push(
        `${path.relative(ROOT, componentDir)} -> missing doc index registration in ${path.relative(ROOT, DOC_INDEX_PATH)}`,
      );
    }
  }

  if (artifacts.apiReference !== false) {
    const apiReferenceData = getApiReference();
    if (!apiReferenceData?.components) {
      failures.push(
        `${path.relative(ROOT, componentDir)} -> missing ${path.relative(ROOT, API_REFERENCE_PATH)}; run npm run docs:api`,
      );
    } else {
      const expectedCategory = componentType === 'primitive' ? 'primitives' : 'components';
      const expectedFilePathPrefix = `src/${baseDirFromType(componentType)}/${kebab}/`;
      const apiEntry = apiReferenceData.components.find((entry) => entry.name === componentName);

      if (!apiEntry) {
        failures.push(
          `${path.relative(ROOT, componentDir)} -> missing API reference entry in ${path.relative(ROOT, API_REFERENCE_PATH)} (run npm run docs:api)`,
        );
      } else {
        if (apiEntry.category !== expectedCategory) {
          failures.push(
            `${path.relative(ROOT, componentDir)} -> API reference category drift for ${componentName}: expected ${expectedCategory}, found ${apiEntry.category}`,
          );
        }

        if (typeof apiEntry.filePath !== 'string' || !apiEntry.filePath.startsWith(expectedFilePathPrefix)) {
          failures.push(
            `${path.relative(ROOT, componentDir)} -> API reference filePath drift for ${componentName}: expected prefix ${expectedFilePathPrefix}, found ${apiEntry.filePath}`,
          );
        }
      }
    }
  }

  if (artifacts.docStub !== true) {
    warnings.push(
      `${path.relative(ROOT, componentDir)} -> no doc stub required; add --with-doc-stub if the component should appear in Design Lab`,
    );
  }

  if (verbose) {
    console.log(`checked ${path.relative(ROOT, componentDir)} (${metadata.profile})`);
  }
}

if (warnings.length > 0 && verbose) {
  console.log('\nWarnings:');
  for (const warning of warnings) {
    console.log(`  - ${warning}`);
  }
}

if (failures.length > 0) {
  console.error('\ncomponent-completeness: failed');
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(
  `component-completeness: ok (${metadataFiles.length} scaffold-managed component${metadataFiles.length === 1 ? '' : 's'})`,
);

function baseDirFromType(componentType) {
  return componentType === 'primitive' ? 'primitives' : 'components';
}
