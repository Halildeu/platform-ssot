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

const toRepoRelative = (absolutePath) => path.relative(repoRoot, absolutePath).replaceAll(path.sep, '/');

const normalizeList = (value) =>
  Array.isArray(value) ? value.map((entry) => String(entry || '').trim()).filter(Boolean) : [];

const buildChecklistSummary = (reviewChecklist, approvalPacket) => {
  const checklistSummary = approvalPacket?.checklistSummary;
  if (checklistSummary && typeof checklistSummary === 'object') {
    return {
      totalItems: Number(checklistSummary.totalItems ?? 0),
      requiredItems: Number(checklistSummary.requiredItems ?? 0),
      pendingItems: Number(checklistSummary.pendingItems ?? 0),
      blockerAcknowledgements: Number(checklistSummary.blockerAcknowledgements ?? 0),
    };
  }

  const items = Array.isArray(reviewChecklist) ? reviewChecklist : [];
  return {
    totalItems: items.length,
    requiredItems: items.filter((entry) => Boolean(entry?.required)).length,
    pendingItems: items.filter((entry) => String(entry?.status || '').trim() === 'pending').length,
    blockerAcknowledgements: items.filter((entry) => String(entry?.category || '').trim() === 'blocker_ack').length,
  };
};

const main = async () => {
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  const inputArtifactPath = path.join(repoRoot, String(contract.input_artifact_path || '').trim());
  const artifactPath = path.join(repoRoot, String(contract.artifact_path || '').trim());
  if (!existsSync(inputArtifactPath)) {
    throw new Error(`manual review artifact bulunamadi: ${toRepoRelative(inputArtifactPath)}`);
  }

  const payload = JSON.parse(await readFile(inputArtifactPath, 'utf8'));
  const manualReview = payload.codemodManualReview ?? {};
  const manualReviewItems = Array.isArray(manualReview.items) ? manualReview.items : [];
  const manualReviewByComponent = new Map(
    manualReviewItems.map((item) => [String(item.component || '').trim(), item]),
  );
  const defaultOwnerHandles = normalizeList(contract.default_owner_handles);
  const allowedDecisions = normalizeList(contract.allowed_decisions);
  const allowedDecisionSet = new Set(allowedDecisions);
  const decisionPlan = Array.isArray(contract.decision_plan) ? contract.decision_plan : [];

  const decisionItems = decisionPlan.map((planEntry) => {
    const component = String(planEntry.component || '').trim();
    const selectedDecision = String(planEntry.decision || '').trim();
    const nextStep = String(planEntry.next_step || '').trim();
    const rationale = String(planEntry.rationale || '').trim();
    const candidate = manualReviewByComponent.get(component) ?? null;
    const approvalPacket = candidate?.approvalPacket ?? {};
    const reviewChecklist = Array.isArray(candidate?.reviewChecklist) ? candidate.reviewChecklist : [];
    const requiredApproverHandles = normalizeList(approvalPacket.requiredApproverHandles);
    const ownerHandles = normalizeList(candidate?.ownerHandles);
    const resolvedOwnerHandles = requiredApproverHandles.length
      ? requiredApproverHandles
      : ownerHandles.length
        ? ownerHandles
        : defaultOwnerHandles;
    const readyForDecision =
      Boolean(candidate) &&
      String(candidate?.status || '').trim() === 'PASS' &&
      Boolean(approvalPacket.readyForDecision);
    const decisionAllowed = allowedDecisionSet.has(selectedDecision);
    const readyForApplyPreview = readyForDecision && selectedDecision === 'approved_for_apply_preview';
    const status = readyForDecision && decisionAllowed ? 'PASS' : 'FAIL';

    return {
      candidateId: String(candidate?.candidateId || `${component.toLowerCase()}-manual-decision`).trim(),
      component,
      consumerApp: String(candidate?.consumerApp || '').trim(),
      riskLevel: String(candidate?.riskLevel || '').trim(),
      status,
      ownerHandles: resolvedOwnerHandles,
      reviewArtifactPath: String(contract.input_artifact_path || '').trim(),
      selectedDecision,
      nextStep,
      rationale,
      decisionPacket: {
        decisionMode: String(contract.decision_mode || 'single-owner-direct-approval'),
        decisionState: selectedDecision,
        requiredApproverHandles: resolvedOwnerHandles,
        recordedOwnerHandles: resolvedOwnerHandles,
        singleOwner: resolvedOwnerHandles.length === 1,
        readyForDecision,
        readyForApplyPreview,
        autoWriteAllowed: false,
      },
      checklistSummary: buildChecklistSummary(reviewChecklist, approvalPacket),
      reviewChecklist,
      diffPacket:
        approvalPacket && typeof approvalPacket.diffPacket === 'object' ? approvalPacket.diffPacket : {},
      targetFiles: Array.isArray(candidate?.targetFiles) ? candidate.targetFiles : [],
      blockers: Array.isArray(candidate?.blockers) ? candidate.blockers : [],
      evidenceRefs: [
        String(contract.input_artifact_path || '').trim(),
        ...(Array.isArray(candidate?.targetFiles) ? candidate.targetFiles : []),
      ].filter(Boolean),
    };
  });

  const summary = {
    focusCandidateCount: decisionPlan.length,
    recordedDecisionCount: decisionItems.filter((item) => item.status === 'PASS').length,
    approvedForApplyPreviewCount: decisionItems.filter(
      (item) => item.selectedDecision === 'approved_for_apply_preview',
    ).length,
    deferredUntilVisualReviewCount: decisionItems.filter(
      (item) => item.selectedDecision === 'deferred_until_visual_review',
    ).length,
    reviewOnlyManualRefactorCount: decisionItems.filter(
      (item) => item.selectedDecision === 'review_only_manual_refactor',
    ).length,
    rejectedForAutoApplyCount: decisionItems.filter(
      (item) => item.selectedDecision === 'rejected_for_auto_apply',
    ).length,
    pendingDecisionCount: Math.max(
      decisionPlan.length - decisionItems.filter((item) => item.status === 'PASS').length,
      0,
    ),
    readyForApplyPreviewCount: decisionItems.filter((item) => item.decisionPacket.readyForApplyPreview).length,
    singleOwnerDecisionCount: decisionItems.filter((item) => item.decisionPacket.singleOwner).length,
    generatedChecklistItemCount: decisionItems.reduce(
      (sum, item) => sum + (Array.isArray(item.reviewChecklist) ? item.reviewChecklist.length : 0),
      0,
    ),
  };

  const output = {
    codemodManualReviewDecisions: {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      contractPath: toRepoRelative(contractPath),
      sourceArtifactPath: String(contract.input_artifact_path || '').trim(),
      decisionMode: String(contract.decision_mode || 'single-owner-direct-approval'),
      defaultOwnerHandles,
      allowedDecisions,
      summary,
      items: decisionItems,
      rules: normalizeList(contract.rules).slice(0, 4),
    },
  };

  await mkdir(latestDir, { recursive: true });
  await writeFile(artifactPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(JSON.stringify(output.codemodManualReviewDecisions));
};

main().catch((error) => {
  console.error('[run-ui-library-codemod-manual-review-decisions] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
