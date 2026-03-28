#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const contractPath = path.join(
  repoRoot,
  'docs',
  '02-architecture',
  'context',
  'ui-library-consumer-codemod-apply-preview.contract.v1.json',
);
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
  const payload = await loadJsonWithRetry(artifactPath, 'codemodApplyPreview');
  const preview = payload.codemodApplyPreview ?? {};
  const items = Array.isArray(preview.items) ? preview.items : [];
  const focusComponents = Array.isArray(contract.focus_components)
    ? contract.focus_components.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
  const results = items.map((item) => ({
    candidateId: String(item.candidateId || '').trim(),
    component: String(item.component || '').trim(),
    status: String(item.status || '').trim(),
    exactEligibleCount: Number(item.exactEligibleCount || 0),
    appliedCount: Number(item.appliedCount || 0),
    noopCount: Number(item.noopCount || 0),
  }));
  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: String(contract.artifact_path || '').trim(),
    candidateCount: items.length,
    expectedCandidateCount: focusComponents.length,
    passCount: results.filter((entry) => entry.status === 'PASS').length,
    failCount: results.filter((entry) => entry.status !== 'PASS').length,
    exactEligibleCandidateCount: results.filter((entry) => entry.exactEligibleCount > 0).length,
    noopReadyCandidateCount: results.filter((entry) => entry.exactEligibleCount === 0 && entry.noopCount > 0).length,
    appliedCount: results.reduce((sum, entry) => sum + Number(entry.appliedCount || 0), 0),
    focusComponents,
    results,
  };

  await mkdir(latestDir, { recursive: true });
  await writeFile(auditArtifactPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));
  if (summary.candidateCount !== summary.expectedCandidateCount || summary.failCount > 0 || summary.appliedCount !== 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[audit-ui-library-codemod-apply-preview] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
