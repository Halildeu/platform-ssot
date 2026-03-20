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
  'ui-library-consumer-codemod-manual-review.contract.v1.json',
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
  const payload = await loadJsonWithRetry(artifactPath, 'codemodManualReview');
  const review = payload.codemodManualReview ?? {};
  const items = Array.isArray(review.items) ? review.items : [];
  const focusComponents = Array.isArray(contract.focus_components)
    ? contract.focus_components.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: String(contract.artifact_path || '').trim(),
    candidateCount: items.length,
    expectedCandidateCount: focusComponents.length,
    passCount: items.filter((entry) => String(entry.status || '').trim() === 'PASS').length,
    failCount: items.filter((entry) => String(entry.status || '').trim() !== 'PASS').length,
    mediumRiskCount: items.filter((entry) => String(entry.riskLevel || '').trim() === 'medium').length,
    highRiskCount: items.filter((entry) => String(entry.riskLevel || '').trim() === 'high').length,
    reviewMode: String(review.reviewMode || ''),
    reviewWriteEnabled: Boolean(review.reviewWriteEnabled),
    approvalModel: String(review.approvalModel || ''),
    decisionStateDefault: String(review.decisionStateDefault || ''),
    readyForDecisionCount: items.filter((entry) => Boolean(entry.approvalPacket?.readyForDecision)).length,
    pendingDecisionCount: items.filter(
      (entry) => String(entry.approvalPacket?.decisionState || '').trim() === String(review.decisionStateDefault || '').trim(),
    ).length,
    singleOwnerApprovalCount: items.filter((entry) => Boolean(entry.approvalPacket?.singleOwner)).length,
    generatedChecklistItemCount: items.reduce(
      (sum, entry) => sum + (Array.isArray(entry.reviewChecklist) ? entry.reviewChecklist.length : 0),
      0,
    ),
    results: items.map((item) => ({
      candidateId: String(item.candidateId || '').trim(),
      component: String(item.component || '').trim(),
      status: String(item.status || '').trim(),
      riskLevel: String(item.riskLevel || '').trim(),
      passFileCount: Number(item.packetSummary?.passFileCount || 0),
      failFileCount: Number(item.packetSummary?.failFileCount || 0),
      checklistItemCount: Array.isArray(item.reviewChecklist) ? item.reviewChecklist.length : 0,
      decisionState: String(item.approvalPacket?.decisionState || '').trim(),
    })),
  };

  await mkdir(latestDir, { recursive: true });
  await writeFile(auditArtifactPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));
  if (
    summary.candidateCount !== summary.expectedCandidateCount ||
    summary.failCount > 0 ||
    summary.reviewMode !== 'manual-review-only' ||
    summary.reviewWriteEnabled ||
    summary.approvalModel !== 'single-owner-direct-approval' ||
    summary.decisionStateDefault !== 'owner_review_pending' ||
    summary.readyForDecisionCount !== summary.candidateCount ||
    summary.pendingDecisionCount !== summary.candidateCount ||
    summary.generatedChecklistItemCount <= 0 ||
    summary.results.some((entry) => entry.checklistItemCount <= 0 || entry.decisionState !== 'owner_review_pending')
  ) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[audit-ui-library-codemod-manual-review] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
