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
  'ui-library-consumer-codemod-manual-decision.contract.v1.json',
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

const normalizeList = (value) =>
  Array.isArray(value) ? value.map((entry) => String(entry || '').trim()).filter(Boolean) : [];

const main = async () => {
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  const artifactPath = path.join(repoRoot, String(contract.artifact_path || '').trim());
  const auditArtifactPath = path.join(repoRoot, String(contract.audit_artifact_path || '').trim());
  const payload = await loadJsonWithRetry(artifactPath, 'codemodManualReviewDecisions');
  const decisions = payload.codemodManualReviewDecisions ?? {};
  const items = Array.isArray(decisions.items) ? decisions.items : [];
  const allowedDecisions = normalizeList(contract.allowed_decisions);
  const allowedDecisionSet = new Set(allowedDecisions);
  const decisionPlan = Array.isArray(contract.decision_plan) ? contract.decision_plan : [];

  const expectedCounts = {
    approvedForApplyPreviewCount: decisionPlan.filter(
      (entry) => String(entry?.decision || '').trim() === 'approved_for_apply_preview',
    ).length,
    deferredUntilVisualReviewCount: decisionPlan.filter(
      (entry) => String(entry?.decision || '').trim() === 'deferred_until_visual_review',
    ).length,
    reviewOnlyManualRefactorCount: decisionPlan.filter(
      (entry) => String(entry?.decision || '').trim() === 'review_only_manual_refactor',
    ).length,
    rejectedForAutoApplyCount: decisionPlan.filter(
      (entry) => String(entry?.decision || '').trim() === 'rejected_for_auto_apply',
    ).length,
  };

  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: String(contract.artifact_path || '').trim(),
    candidateCount: items.length,
    expectedCandidateCount: decisionPlan.length,
    passCount: items.filter((entry) => String(entry.status || '').trim() === 'PASS').length,
    failCount: items.filter((entry) => String(entry.status || '').trim() !== 'PASS').length,
    approvedForApplyPreviewCount: items.filter(
      (entry) => String(entry.selectedDecision || '').trim() === 'approved_for_apply_preview',
    ).length,
    deferredUntilVisualReviewCount: items.filter(
      (entry) => String(entry.selectedDecision || '').trim() === 'deferred_until_visual_review',
    ).length,
    reviewOnlyManualRefactorCount: items.filter(
      (entry) => String(entry.selectedDecision || '').trim() === 'review_only_manual_refactor',
    ).length,
    rejectedForAutoApplyCount: items.filter(
      (entry) => String(entry.selectedDecision || '').trim() === 'rejected_for_auto_apply',
    ).length,
    pendingDecisionCount: Number(decisions.summary?.pendingDecisionCount ?? 0),
    readyForApplyPreviewCount: items.filter((entry) => Boolean(entry.decisionPacket?.readyForApplyPreview)).length,
    singleOwnerDecisionCount: items.filter((entry) => Boolean(entry.decisionPacket?.singleOwner)).length,
    generatedChecklistItemCount: items.reduce(
      (sum, entry) => sum + (Array.isArray(entry.reviewChecklist) ? entry.reviewChecklist.length : 0),
      0,
    ),
    results: items.map((item) => ({
      candidateId: String(item.candidateId || '').trim(),
      component: String(item.component || '').trim(),
      status: String(item.status || '').trim(),
      selectedDecision: String(item.selectedDecision || '').trim(),
      readyForApplyPreview: Boolean(item.decisionPacket?.readyForApplyPreview),
      checklistItemCount: Array.isArray(item.reviewChecklist) ? item.reviewChecklist.length : 0,
    })),
  };

  await mkdir(latestDir, { recursive: true });
  await writeFile(auditArtifactPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary));

  if (
    summary.candidateCount !== summary.expectedCandidateCount ||
    summary.failCount > 0 ||
    summary.pendingDecisionCount !== 0 ||
    summary.approvedForApplyPreviewCount !== expectedCounts.approvedForApplyPreviewCount ||
    summary.deferredUntilVisualReviewCount !== expectedCounts.deferredUntilVisualReviewCount ||
    summary.reviewOnlyManualRefactorCount !== expectedCounts.reviewOnlyManualRefactorCount ||
    summary.rejectedForAutoApplyCount !== expectedCounts.rejectedForAutoApplyCount ||
    summary.results.some(
      (entry) =>
        !allowedDecisionSet.has(entry.selectedDecision) ||
        (entry.selectedDecision === 'approved_for_apply_preview') !== entry.readyForApplyPreview ||
        entry.checklistItemCount <= 0,
    )
  ) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[audit-ui-library-codemod-manual-review-decisions] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
