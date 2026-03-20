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

const toRepoRelative = (absolutePath) => path.relative(repoRoot, absolutePath).replaceAll(path.sep, '/');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const lineNumberForIndex = (source, index) => source.slice(0, index).split('\n').length;

const scanLiteral = (source, needle) => {
  const matches = [];
  if (!needle) {
    return { needle, count: 0, lines: [] };
  }
  let cursor = 0;
  while (cursor <= source.length) {
    const index = source.indexOf(needle, cursor);
    if (index === -1) break;
    matches.push(lineNumberForIndex(source, index));
    cursor = index + Math.max(needle.length, 1);
  }
  return {
    needle,
    count: matches.length,
    lines: matches.slice(0, 4),
  };
};

const scanSelector = (source, selector, componentName) => {
  const importPattern = /^import\s+\{\s*([A-Za-z0-9_,\s]+)\s*\}\s+from\s+['"]@mfe/design-system['"];?$/;
  const importMatch = String(selector || '').trim().match(importPattern);
  if (importMatch && componentName) {
    const regex = new RegExp(
      `import\\s+\\{[^}]*\\b${escapeRegExp(componentName)}\\b[^}]*\\}\\s+from\\s+['"]@mfe/design-system['"]`,
      'g',
    );
    const matches = [];
    for (const match of source.matchAll(regex)) {
      matches.push(lineNumberForIndex(source, match.index ?? 0));
    }
    return {
      needle: selector,
      count: matches.length,
      lines: matches.slice(0, 4),
    };
  }
  return scanLiteral(source, selector);
};

const scanWord = (source, term) => {
  if (!term) {
    return { term, count: 0, lines: [] };
  }
  const matches = [];
  const regex = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(term)}(?![A-Za-z0-9_])`, 'g');
  for (const match of source.matchAll(regex)) {
    matches.push(lineNumberForIndex(source, match.index ?? 0));
  }
  return {
    term,
    count: matches.length,
    lines: matches.slice(0, 4),
  };
};

const buildStopConditionHints = (source, stopConditions) =>
  stopConditions.map((condition) => {
    const normalized = String(condition || '').trim().toLowerCase();
    let observed = false;
    if (normalized.includes('children slot')) {
      observed = /<ReportFilterPanel[\s\S]*>{[\s\S]*=>/.test(source);
    } else if (normalized.includes('access prop')) {
      observed = /\baccess\s*=\s*{/.test(source);
    } else if (normalized.includes('inline map') || normalized.includes('fonksiyon')) {
      observed = /\boptions\s*=\s*{[\s\S]*?(?:\.map\(|=>)/.test(source);
    } else if (normalized.includes('value/onchange cifti eksik')) {
      observed = /\bvalue\s*=/.test(source) !== /\bonChange\s*=/.test(source);
    } else if (normalized.includes('truncate/clamplines')) {
      observed = /\btruncate\b/.test(source) && /\bclampLines\b/.test(source);
    } else if (normalized.includes('as prop')) {
      observed = /\bas\s*=/.test(source);
    }
    return {
      condition: String(condition || '').trim(),
      observed,
    };
  });

const normalizeHandles = (handles, fallbackHandles) => {
  const resolved = Array.isArray(handles)
    ? handles.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
  if (resolved.length > 0) {
    return resolved;
  }
  return Array.isArray(fallbackHandles)
    ? fallbackHandles.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
};

const buildChecklistItems = ({ candidate, requiredApproverHandles }) => {
  const manualValidation = candidate.manualValidation ?? {};
  const items = [];
  const pushItems = (entries, category, prefix, required = true) => {
    for (const entry of Array.isArray(entries) ? entries : []) {
      const label = String(entry || '').trim();
      if (!label) continue;
      items.push({
        id: `${String(candidate.candidateId || '').trim()}-${category}-${items.length + 1}`,
        category,
        label: `${prefix}: ${label}`,
        status: 'pending',
        required,
      });
    }
  };

  pushItems(manualValidation.storybook, 'storybook', 'Storybook');
  pushItems(manualValidation.designLab, 'design_lab', 'Design Lab');
  pushItems(manualValidation.smoke, 'smoke', 'Smoke');
  pushItems(candidate.blockers, 'blocker_ack', 'Blocker onayi');
  pushItems(candidate.rollbackPlan, 'rollback', 'Rollback kontrolu', false);

  if (requiredApproverHandles.length > 0) {
    items.push({
      id: `${String(candidate.candidateId || '').trim()}-owner-approval`,
      category: 'owner_approval',
      label: `Onay: ${requiredApproverHandles.join(', ')}`,
      status: 'pending',
      required: true,
    });
  }

  return items;
};

const buildDiffPacket = ({ candidate, files }) => {
  const preview = candidate.rewritePreview ?? {};
  const selectorEvidence = files.flatMap((file) =>
    (Array.isArray(file.selectorMatches) ? file.selectorMatches : [])
      .filter((entry) => Number(entry.count || 0) > 0)
      .map((entry) => ({
        path: file.path,
        needle: String(entry.needle || '').trim(),
        lines: Array.isArray(entry.lines) ? entry.lines : [],
      })),
  );
  const requiredSignals = files.flatMap((file) =>
    (Array.isArray(file.requiredSignalMatches) ? file.requiredSignalMatches : [])
      .filter((entry) => Number(entry.count || 0) > 0)
      .map((entry) => ({
        path: file.path,
        term: String(entry.term || '').trim(),
        lines: Array.isArray(entry.lines) ? entry.lines : [],
      })),
  );

  return {
    kind: String(preview.kind || 'illustrative'),
    rewriteRule: String(candidate.rewriteRule || '').trim(),
    before: String(preview.before || '').trim(),
    after: String(preview.after || '').trim(),
    selectorEvidence: selectorEvidence.slice(0, 6),
    requiredSignalEvidence: requiredSignals.slice(0, 8),
    targetFiles: Array.isArray(candidate.targetFiles) ? candidate.targetFiles : [],
  };
};

const analyzeFile = async ({ candidate, relativePath }) => {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    return {
      path: relativePath,
      status: 'FAIL',
      failureReason: 'target-file-missing',
      selectorMatches: [],
      requiredSignalMatches: [],
      optionalSignalMatches: [],
      stopConditionHints: [],
      matchedSelectorCount: 0,
      matchedRequiredSignalCount: 0,
      matchedOptionalSignalCount: 0,
    };
  }

  const source = await readFile(absolutePath, 'utf8');
  const matchStrategy = candidate.matchStrategy ?? {};
  const dryRunScope = candidate.dryRunScope ?? {};
  const selectors = Array.isArray(matchStrategy.requiredSelectors)
    ? matchStrategy.requiredSelectors
    : Array.isArray(candidate.matchSelectors)
      ? candidate.matchSelectors
      : [];
  const requiredSignals = Array.isArray(dryRunScope.requiredAnySignals) ? dryRunScope.requiredAnySignals : [];
  const optionalSignals = Array.isArray(dryRunScope.optionalSignals) ? dryRunScope.optionalSignals : [];
  const minRequiredMatches = Number(dryRunScope.minRequiredMatches || 0);
  const stopConditions = Array.isArray(matchStrategy.stopConditions) ? matchStrategy.stopConditions : [];

  const selectorMatches = selectors.map((selector) =>
    scanSelector(source, String(selector || '').trim(), String(candidate.component || '').trim()),
  );
  const requiredSignalMatches = requiredSignals.map((signal) => scanWord(source, String(signal || '').trim()));
  const optionalSignalMatches = optionalSignals.map((signal) => scanWord(source, String(signal || '').trim()));
  const stopConditionHints = buildStopConditionHints(source, stopConditions);

  const matchedSelectorCount = selectorMatches.filter((entry) => entry.count > 0).length;
  const matchedRequiredSignalCount = requiredSignalMatches.filter((entry) => entry.count > 0).length;
  const matchedOptionalSignalCount = optionalSignalMatches.filter((entry) => entry.count > 0).length;
  const requiredSelectorPass = selectorMatches.length === 0 || matchedSelectorCount === selectorMatches.length;
  const requiredSignalPass = matchedRequiredSignalCount >= minRequiredMatches;
  const observedSignalCount = matchedSelectorCount + matchedRequiredSignalCount + matchedOptionalSignalCount;
  const skipped = observedSignalCount === 0;

  return {
    path: relativePath,
    status: skipped ? 'SKIPPED' : requiredSelectorPass && requiredSignalPass ? 'PASS' : 'FAIL',
    failureReason: skipped ? 'no-target-signals-observed' : requiredSelectorPass && requiredSignalPass ? '' : 'selector-or-signal-missing',
    selectorMatches,
    requiredSignalMatches,
    optionalSignalMatches,
    stopConditionHints,
    matchedSelectorCount,
    matchedRequiredSignalCount,
    matchedOptionalSignalCount,
  };
};

const main = async () => {
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  const inputArtifactPath = path.join(repoRoot, String(contract.input_artifact_path || '').trim());
  if (!existsSync(inputArtifactPath)) {
    throw new Error(`codemod candidates artifact bulunamadi: ${toRepoRelative(inputArtifactPath)}`);
  }
  const payload = JSON.parse(await readFile(inputArtifactPath, 'utf8'));
  const candidates = Array.isArray(payload.codemodCandidates?.items) ? payload.codemodCandidates.items : [];
  const focusComponents = new Set(
    Array.isArray(contract.focus_components)
      ? contract.focus_components.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [],
  );
  const focusRiskLevels = new Set(
    Array.isArray(contract.focus_risk_levels)
      ? contract.focus_risk_levels.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [],
  );
  const defaultOwnerHandles = Array.isArray(contract.default_owner_handles)
    ? contract.default_owner_handles.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
  const approvalModel = String(contract.approval_model || 'single-owner-direct-approval');
  const decisionStateDefault = String(contract.decision_state_default || 'owner_review_pending');

  const targetedCandidates = candidates.filter((candidate) => {
    const component = String(candidate.component || '').trim();
    const riskLevel = String(candidate.riskLevel || '').trim();
    return focusComponents.has(component) && (focusRiskLevels.size === 0 || focusRiskLevels.has(riskLevel));
  });

  const results = [];
  for (const candidate of targetedCandidates) {
    const files = [];
    for (const relativePath of Array.isArray(candidate.targetFiles) ? candidate.targetFiles : []) {
      const normalizedPath = String(relativePath || '').trim();
      if (!normalizedPath) continue;
      files.push(await analyzeFile({ candidate, relativePath: normalizedPath }));
    }

    const passFileCount = files.filter((entry) => entry.status === 'PASS').length;
    const failFileCount = files.filter((entry) => entry.status === 'FAIL').length;
    const skippedFileCount = files.filter((entry) => entry.status === 'SKIPPED').length;
    const matchedRequiredSignalCount = files.reduce((sum, entry) => sum + Number(entry.matchedRequiredSignalCount || 0), 0);
    const matchedOptionalSignalCount = files.reduce((sum, entry) => sum + Number(entry.matchedOptionalSignalCount || 0), 0);
    const observedStopConditionCount = files.reduce(
      (sum, entry) => sum + entry.stopConditionHints.filter((hint) => hint.observed).length,
      0,
    );
    const requiredApproverHandles = normalizeHandles(candidate.ownerHandles, defaultOwnerHandles);
    const checklistItems = buildChecklistItems({ candidate, requiredApproverHandles });
    const diffPacket = buildDiffPacket({ candidate, files });
    const checklistSummary = {
      totalItems: checklistItems.length,
      requiredItems: checklistItems.filter((entry) => entry.required).length,
      pendingItems: checklistItems.filter((entry) => entry.status === 'pending').length,
      blockerAcknowledgements: checklistItems.filter((entry) => entry.category === 'blocker_ack').length,
    };

    results.push({
      candidateId: String(candidate.candidateId || '').trim(),
      component: String(candidate.component || '').trim(),
      consumerApp: String(candidate.consumerApp || '').trim(),
      riskLevel: String(candidate.riskLevel || '').trim(),
      reviewMode: String(contract.review_mode || 'manual-review-only'),
      reviewWriteEnabled: Boolean(contract.review_write_enabled),
      ownerHandles: Array.isArray(candidate.ownerHandles) ? candidate.ownerHandles : [],
      targetFiles: Array.isArray(candidate.targetFiles) ? candidate.targetFiles : [],
      prototypeStatus: String(candidate.prototypeStatus || '').trim(),
      prototypePath: String(candidate.prototypePath || '').trim(),
      prototypeSourcePath: String(candidate.prototypeSourcePath || '').trim(),
      manualChecklistRef: String(candidate.manualChecklistRef || '').trim(),
      upgradeRecipeRef: String(candidate.upgradeRecipeRef || '').trim(),
      blockers: Array.isArray(candidate.blockers) ? candidate.blockers : [],
      riskReasons: Array.isArray(candidate.riskReasons) ? candidate.riskReasons : [],
      manualValidation: candidate.manualValidation ?? { storybook: [], designLab: [], smoke: [] },
      rollbackPlan: Array.isArray(candidate.rollbackPlan) ? candidate.rollbackPlan : [],
      rewriteRule: String(candidate.rewriteRule || '').trim(),
      rewritePreview: candidate.rewritePreview ?? { kind: 'illustrative', before: '', after: '' },
      matchStrategy: candidate.matchStrategy ?? { requiredSelectors: [], dryRunSignals: [], astTargets: [], stopConditions: [] },
      packetSummary: {
        targetFileCount: files.length,
        passFileCount,
        failFileCount,
        skippedFileCount,
        matchedRequiredSignalCount,
        matchedOptionalSignalCount,
        observedStopConditionCount,
      },
      approvalPacket: {
        approvalModel,
        decisionState: decisionStateDefault,
        requiredApproverHandles,
        singleOwner: requiredApproverHandles.length === 1,
        readyForDecision: failFileCount === 0 && passFileCount > 0,
        applyAllowedAfterApproval: false,
        checklistSummary,
        diffPacket,
      },
      reviewChecklist: checklistItems,
      files,
      status: failFileCount === 0 && passFileCount > 0 ? 'PASS' : 'FAIL',
    });
  }

  const generatedChecklistItemCount = results.reduce(
    (sum, entry) => sum + (Array.isArray(entry.reviewChecklist) ? entry.reviewChecklist.length : 0),
    0,
  );
  const pendingDecisionCount = results.filter(
    (entry) => String(entry.approvalPacket?.decisionState || '') === decisionStateDefault,
  ).length;
  const singleOwnerApprovalCount = results.filter((entry) => Boolean(entry.approvalPacket?.singleOwner)).length;

  const artifact = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    contractPath: toRepoRelative(contractPath),
    sourceArtifactPath: toRepoRelative(inputArtifactPath),
    reviewMode: String(contract.review_mode || 'manual-review-only'),
    reviewWriteEnabled: Boolean(contract.review_write_enabled),
    approvalModel,
    decisionStateDefault,
    summary: {
      focusCandidateCount: results.length,
      mediumRiskFocusCount: results.filter((entry) => entry.riskLevel === 'medium').length,
      highRiskFocusCount: results.filter((entry) => entry.riskLevel === 'high').length,
      readyPacketCount: results.filter((entry) => entry.status === 'PASS').length,
      failedPacketCount: results.filter((entry) => entry.status !== 'PASS').length,
      manualOnlyPacketCount: results.length,
      readyForDecisionCount: results.filter((entry) => Boolean(entry.approvalPacket?.readyForDecision)).length,
      pendingDecisionCount,
      singleOwnerApprovalCount,
      generatedChecklistItemCount,
    },
    focusComponents: [...focusComponents],
    focusRiskLevels: [...focusRiskLevels],
    items: results,
    rules: Array.isArray(contract.rules) ? contract.rules : [],
  };

  const artifactPath = path.join(repoRoot, String(contract.artifact_path || '').trim());
  await mkdir(latestDir, { recursive: true });
  await writeFile(artifactPath, JSON.stringify({ codemodManualReview: artifact }, null, 2), 'utf8');
  console.log(JSON.stringify(artifact));
  if (results.some((entry) => entry.status !== 'PASS')) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[run-ui-library-codemod-manual-review] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
