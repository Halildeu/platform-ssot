#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const prototypesArtifactPath = path.join(latestDir, 'ui-library-codemod-prototypes.v1.json');
const candidatesArtifactPath = path.join(latestDir, 'ui-library-codemod-candidates.v1.json');
const auditArtifactPath = path.join(latestDir, 'ui-library-codemod-prototypes.audit.v1.json');
const RETRY_ATTEMPTS = 8;
const RETRY_DELAY_MS = 500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadJsonWithRetry = async (artifactPath, propertyName) => {
  let lastError = null;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    try {
      if (!existsSync(artifactPath)) {
        throw new Error(`artifact bulunamadi: ${artifactPath}`);
      }
      const artifact = JSON.parse(await readFile(artifactPath, 'utf8'));
      if (!artifact[propertyName]) {
        throw new Error(`artifact hazir degil: ${artifactPath}`);
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

const hasNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const hasNonEmptyArray = (value) => Array.isArray(value) && value.some((entry) => hasNonEmptyString(String(entry)));

const main = async () => {
  const prototypesArtifact = await loadJsonWithRetry(prototypesArtifactPath, 'codemodPrototypes');
  const candidatesArtifact = await loadJsonWithRetry(candidatesArtifactPath, 'codemodCandidates');
  const prototypes = Array.isArray(prototypesArtifact.codemodPrototypes?.items) ? prototypesArtifact.codemodPrototypes.items : [];
  const candidateIds = new Set(
    Array.isArray(candidatesArtifact.codemodCandidates?.items)
      ? candidatesArtifact.codemodCandidates.items.map((item) => String(item?.candidateId || '').trim()).filter(Boolean)
      : [],
  );
  const results = [];

  for (const prototype of prototypes) {
    const candidateId = String(prototype.candidateId || '').trim();
    const prototypePath = String(prototype.prototypePath || '').trim();
    const prototypeSourcePath = String(prototype.prototypeSourcePath || '').trim();
    const absolutePrototypePath = prototypePath ? path.join(repoRoot, prototypePath) : '';
    const absoluteSourcePath = prototypeSourcePath ? path.join(repoRoot, prototypeSourcePath) : '';
    const rewriteRule = String(prototype.rewriteRule || '').trim();
    const prototypeStatus = String(prototype.prototypeStatus || '').trim();
    const prototypeReviewMode = String(prototype.prototypeReviewMode || '').trim();

    const prototypeSpec = absolutePrototypePath && existsSync(absolutePrototypePath)
      ? JSON.parse(await readFile(absolutePrototypePath, 'utf8'))
      : null;

    const rewritePreview = prototypeSpec?.rewritePreview ?? {};
    const matchStrategy = prototypeSpec?.matchStrategy ?? {};
    const manualValidation = prototypeSpec?.manualValidation ?? {};
    const rollbackPlan = prototypeSpec?.rollbackPlan ?? [];
    const sourceText = absoluteSourcePath && existsSync(absoluteSourcePath)
      ? await readFile(absoluteSourcePath, 'utf8')
      : '';

    const status =
      candidateIds.has(candidateId) &&
      prototypeStatus === 'ready' &&
      prototypeReviewMode.length > 0 &&
      hasNonEmptyString(rewriteRule) &&
      absolutePrototypePath &&
      existsSync(absolutePrototypePath) &&
      absoluteSourcePath &&
      existsSync(absoluteSourcePath) &&
      hasNonEmptyString(rewritePreview.before) &&
      hasNonEmptyString(rewritePreview.after) &&
      hasNonEmptyArray(matchStrategy.requiredSelectors) &&
      hasNonEmptyArray(manualValidation.storybook) &&
      hasNonEmptyArray(rollbackPlan) &&
      sourceText.includes(candidateId)
        ? 'PASS'
        : 'FAIL';

    results.push({
      candidateId,
      component: String(prototype.component || '').trim(),
      status,
      prototypeStatus,
      prototypeReviewMode,
      prototypePath,
      prototypeSourcePath,
      checks: {
        candidateLinked: candidateIds.has(candidateId),
        prototypeSpecPresent: Boolean(absolutePrototypePath && existsSync(absolutePrototypePath)),
        prototypeSourcePresent: Boolean(absoluteSourcePath && existsSync(absoluteSourcePath)),
        rewritePreviewPresent: hasNonEmptyString(rewritePreview.before) && hasNonEmptyString(rewritePreview.after),
        matchStrategyPresent: hasNonEmptyArray(matchStrategy.requiredSelectors),
        manualValidationPresent: hasNonEmptyArray(manualValidation.storybook),
        rollbackPlanPresent: hasNonEmptyArray(rollbackPlan),
        sourceContainsCandidateId: sourceText.includes(candidateId),
      },
    });
  }

  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: path.relative(repoRoot, prototypesArtifactPath).replaceAll(path.sep, '/'),
    prototypeCount: results.length,
    passCount: results.filter((entry) => entry.status === 'PASS').length,
    failCount: results.filter((entry) => entry.status === 'FAIL').length,
    readyCount: results.filter((entry) => entry.prototypeStatus === 'ready').length,
    illustrativePreviewCount: results.filter((entry) => entry.prototypeReviewMode === 'illustrative-dry-run').length,
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
  console.error('[audit-ui-library-codemod-prototypes] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
