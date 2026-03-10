#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const recipesArtifactPath = path.join(latestDir, 'ui-library-upgrade-recipes.v1.json');
const auditArtifactPath = path.join(latestDir, 'ui-library-upgrade-recipes.audit.v1.json');
const RETRY_ATTEMPTS = 8;
const RETRY_DELAY_MS = 500;

const countMatches = (text, pattern) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadRecipesArtifact = async () => {
  let lastError = null;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    try {
      if (!existsSync(recipesArtifactPath)) {
        throw new Error(`upgrade recipes artifact bulunamadi: ${recipesArtifactPath}`);
      }
      const artifact = JSON.parse(await readFile(recipesArtifactPath, 'utf8'));
      const recipes = Array.isArray(artifact.upgradeRecipes?.items) ? artifact.upgradeRecipes.items : [];
      if (!artifact.upgradeRecipes || recipes.length === 0) {
        throw new Error(`upgrade recipes artifact hazir degil: ${recipesArtifactPath}`);
      }
      return artifact;
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_ATTEMPTS - 1) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};

const main = async () => {
  const artifact = await loadRecipesArtifact();
  const recipes = Array.isArray(artifact.upgradeRecipes?.items) ? artifact.upgradeRecipes.items : [];
  const results = [];
  for (const recipe of recipes) {
    const component = String(recipe.component || '').trim();
    const targetFiles = Array.isArray(recipe.targetFiles) ? recipe.targetFiles.map((entry) => String(entry || '').trim()).filter(Boolean) : [];
    const fileChecks = [];
    for (const relativePath of targetFiles) {
      const absolutePath = path.join(repoRoot, relativePath);
      const exists = existsSync(absolutePath);
      let importFound = false;
      let usageCount = 0;
      if (exists) {
        const source = await readFile(absolutePath, 'utf8');
        importFound = new RegExp(`import\\s*\\{[^}]*\\b${component}\\b[^}]*\\}\\s*from\\s*['"]mfe-ui-kit['"]`, 'm').test(source);
        usageCount = countMatches(source, new RegExp(`(?<![A-Za-z0-9_])${component}(?![A-Za-z0-9_])`, 'g'));
      }
      fileChecks.push({
        path: relativePath,
        exists,
        importFound,
        usageCount,
        status: exists && importFound && usageCount > 0 ? 'PASS' : 'FAIL',
      });
    }
    const status = fileChecks.every((entry) => entry.status === 'PASS') ? 'PASS' : 'FAIL';
    results.push({
      recipeId: recipe.recipeId,
      component,
      consumerApp: recipe.consumerApp,
      status,
      targetFileCount: fileChecks.length,
      passingFileCount: fileChecks.filter((entry) => entry.status === 'PASS').length,
      fileChecks,
    });
  }
  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: path.relative(repoRoot, recipesArtifactPath).replaceAll(path.sep, '/'),
    recipeCount: results.length,
    passCount: results.filter((entry) => entry.status === 'PASS').length,
    failCount: results.filter((entry) => entry.status === 'FAIL').length,
    results,
  };
  await mkdir(latestDir, { recursive: true });
  await writeFile(auditArtifactPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));
  if (summary.failCount > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[audit-ui-library-upgrade-recipes] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
