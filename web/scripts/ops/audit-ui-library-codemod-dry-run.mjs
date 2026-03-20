#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const contractPath = path.join(repoRoot, 'docs', '02-architecture', 'context', 'ui-library-consumer-codemod-dry-run.contract.v1.json');
const RETRY_ATTEMPTS = 8;
const RETRY_DELAY_MS = 500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadJsonWithRetry = async (absolutePath, propertyName) => {
  let lastError = null;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    try {
      if (!existsSync(absolutePath)) {
        throw new Error(`artifact bulunamadi: ${absolutePath}`);
      }
      const payload = JSON.parse(await readFile(absolutePath, 'utf8'));
      if (!payload[propertyName]) {
        throw new Error(`artifact hazir degil: ${absolutePath}`);
      }
      return payload;
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
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  const artifactPath = path.join(repoRoot, String(contract.artifact_path || '').trim());
  const auditArtifactPath = path.join(repoRoot, String(contract.audit_artifact_path || '').trim());
  const payload = await loadJsonWithRetry(artifactPath, 'codemodDryRun');
  const dryRun = payload.codemodDryRun ?? {};
  const items = Array.isArray(dryRun.items) ? dryRun.items : [];
  const focusComponents = Array.isArray(contract.focus_components)
    ? contract.focus_components.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
  const results = items.map((item) => {
    const observedCount = Number(item.observedCount || 0);
    const proposalCount = Number(item.proposalCount || 0);
    const alreadyNormalizedCount = Number(item.alreadyNormalizedCount || 0);
    const status =
      String(item.status || '') === 'PASS' &&
      observedCount > 0 &&
      (proposalCount > 0 || alreadyNormalizedCount > 0)
        ? 'PASS'
        : 'FAIL';
    return {
      candidateId: String(item.candidateId || '').trim(),
      component: String(item.component || '').trim(),
      status,
      observedCount,
      proposalCount,
      alreadyNormalizedCount,
      skippedCount: Number(item.skippedCount || 0),
      analyzedFileCount: Number(item.analyzedFileCount || 0),
      passFileCount: Number(item.passFileCount || 0),
      failFileCount: Number(item.failFileCount || 0),
      skippedFileCount: Number(item.skippedFileCount || 0),
    };
  });
  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: String(contract.artifact_path || '').trim(),
    candidateCount: items.length,
    expectedCandidateCount: focusComponents.length,
    passCount: results.filter((entry) => entry.status === 'PASS').length,
    failCount: results.filter((entry) => entry.status === 'FAIL').length,
    proposalCount: results.reduce((sum, entry) => sum + Number(entry.proposalCount || 0), 0),
    alreadyNormalizedCount: results.reduce((sum, entry) => sum + Number(entry.alreadyNormalizedCount || 0), 0),
    skippedCount: results.reduce((sum, entry) => sum + Number(entry.skippedCount || 0), 0),
    candidateWithProposalsCount: results.filter((entry) => Number(entry.proposalCount || 0) > 0).length,
    candidateReadyNoopCount: results.filter(
      (entry) => Number(entry.proposalCount || 0) === 0 && Number(entry.alreadyNormalizedCount || 0) > 0,
    ).length,
    focusComponents,
    results,
  };

  await mkdir(latestDir, { recursive: true });
  await writeFile(auditArtifactPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));
  if (summary.candidateCount !== summary.expectedCandidateCount || summary.failCount > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[audit-ui-library-codemod-dry-run] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
