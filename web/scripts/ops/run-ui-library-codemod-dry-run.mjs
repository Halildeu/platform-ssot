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

const toRepoRelative = (absolutePath) => path.relative(repoRoot, absolutePath).replaceAll(path.sep, '/');
const lineNumberForIndex = (source, index) => source.slice(0, index).split('\n').length;

const loadContract = async () => JSON.parse(await readFile(contractPath, 'utf8'));

const replaceBooleanShorthand = (fullMatch, attributeName) =>
  fullMatch.replace(new RegExp(`\\b${attributeName}\\b(?!\\s*=)`), `${attributeName}={true}`);

const buildEmptyRecords = (source) => {
  const records = [];
  const pattern = /<Empty\b([\s\S]*?)\/>/g;
  for (const match of source.matchAll(pattern)) {
    const fullMatch = match[0];
    const attrs = match[1] ?? '';
    if (!/\baccess\s*=\s*['"]readonly['"]/.test(attrs)) {
      continue;
    }
    const line = lineNumberForIndex(source, match.index ?? 0);
    if (/\baccessReason\s*=/.test(attrs)) {
      records.push({
        kind: 'already_normalized',
        line,
        reason: 'Readonly Empty kullaniminda accessReason zaten mevcut.',
        before: fullMatch,
        after: fullMatch,
      });
      continue;
    }
    if (!/\bdescription\s*=/.test(attrs)) {
      records.push({
        kind: 'skipped',
        line,
        reason: 'Description sinyali olmadigi icin fallback preview uretilmedi.',
        before: fullMatch,
        after: fullMatch,
      });
      continue;
    }
    records.push({
      kind: 'proposed',
      line,
      reason: 'Readonly Empty kullanimina approved accessReason fallback preview eklendi.',
      before: fullMatch,
      after: fullMatch.replace(/\s*\/>$/, ' accessReason="Yalnız görüntüleme" />'),
    });
  }
  return records;
};

const buildTagRecords = (source) => {
  const records = [];
  const pattern = /<Tag\b([\s\S]*?)>([\s\S]*?)<\/Tag>/g;
  for (const match of source.matchAll(pattern)) {
    const fullMatch = match[0];
    const attrs = match[1] ?? '';
    const body = match[2] ?? '';
    if (!/\baccess\s*=\s*['"]readonly['"]/.test(attrs)) {
      continue;
    }
    const line = lineNumberForIndex(source, match.index ?? 0);
    if (body.includes('<')) {
      records.push({
        kind: 'skipped',
        line,
        reason: 'Nested markup iceren Tag dry-run icin manuel review gerektiriyor.',
        before: fullMatch,
        after: fullMatch,
      });
      continue;
    }
    const tonePresent = /\btone\s*=/.test(attrs);
    const accessReasonPresent = /\baccessReason\s*=/.test(attrs);
    if (tonePresent && accessReasonPresent) {
      records.push({
        kind: 'already_normalized',
        line,
        reason: 'Readonly Tag kullaniminda tone ve accessReason zaten canonical.',
        before: fullMatch,
        after: fullMatch,
      });
      continue;
    }
    let after = fullMatch;
    if (!tonePresent) {
      after = after.replace('<Tag', '<Tag tone="info"');
    }
    if (!accessReasonPresent) {
      after = after.replace(/(<Tag\b[^>]*\baccess="readonly"[^>]*)>/, '$1 accessReason="Audit kaydı">');
    }
    records.push({
      kind: 'proposed',
      line,
      reason: 'Readonly Tag kullaniminda tone/accessReason canonical preview uretiliyor.',
      before: fullMatch,
      after,
    });
  }
  return records;
};

const buildThemePreviewCardRecords = (source) => {
  const records = [];
  const pattern = /<ThemePreviewCard\b([\s\S]*?)\/>/g;
  for (const match of source.matchAll(pattern)) {
    const fullMatch = match[0];
    const attrs = match[1] ?? '';
    if (!/\bselected\b/.test(attrs)) {
      continue;
    }
    const line = lineNumberForIndex(source, match.index ?? 0);
    if (/\bselected\s*=/.test(attrs)) {
      records.push({
        kind: 'already_normalized',
        line,
        reason: 'ThemePreviewCard selected prop kullanimi zaten explicit boolean formunda.',
        before: fullMatch,
        after: fullMatch,
      });
      continue;
    }
    records.push({
      kind: 'proposed',
      line,
      reason: 'Boolean shorthand selected kullanimini explicit selected={true} formuna getir.',
      before: fullMatch,
      after: replaceBooleanShorthand(fullMatch, 'selected'),
    });
  }
  return records;
};

const analyzers = {
  Empty: buildEmptyRecords,
  Tag: buildTagRecords,
  ThemePreviewCard: buildThemePreviewCardRecords,
};

const analyzeFile = async ({ component, relativePath }) => {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    return {
      path: relativePath,
      status: 'FAIL',
      proposalCount: 0,
      alreadyNormalizedCount: 0,
      skippedCount: 0,
      observedCount: 0,
      records: [],
      failureReason: 'target-file-missing',
    };
  }
  const source = await readFile(absolutePath, 'utf8');
  const analyzer = analyzers[component];
  const records = analyzer ? analyzer(source) : [];
  const proposalCount = records.filter((record) => record.kind === 'proposed').length;
  const alreadyNormalizedCount = records.filter((record) => record.kind === 'already_normalized').length;
  const skippedCount = records.filter((record) => record.kind === 'skipped').length;
  const observedCount = proposalCount + alreadyNormalizedCount + skippedCount;
  return {
    path: relativePath,
    status: observedCount > 0 ? 'PASS' : 'SKIPPED',
    proposalCount,
    alreadyNormalizedCount,
    skippedCount,
    observedCount,
    records: records.slice(0, 8),
    failureReason: observedCount > 0 ? '' : 'no-target-signals-observed',
  };
};

const main = async () => {
  const contract = await loadContract();
  const candidatesArtifactPath = path.join(repoRoot, String(contract.input_artifact_path || '').trim());
  if (!existsSync(candidatesArtifactPath)) {
    throw new Error(`codemod candidates artifact bulunamadi: ${toRepoRelative(candidatesArtifactPath)}`);
  }
  const candidatesArtifact = JSON.parse(await readFile(candidatesArtifactPath, 'utf8'));
  const candidates = Array.isArray(candidatesArtifact.codemodCandidates?.items)
    ? candidatesArtifact.codemodCandidates.items
    : [];
  const focusComponents = new Set(
    Array.isArray(contract.focus_components)
      ? contract.focus_components.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [],
  );
  const targetedCandidates = candidates.filter(
    (candidate) => focusComponents.has(String(candidate.component || '').trim()) && String(candidate.riskLevel || '').trim() === 'low',
  );

  const results = [];
  for (const candidate of targetedCandidates) {
    const files = [];
    for (const relativePath of Array.isArray(candidate.targetFiles) ? candidate.targetFiles : []) {
      files.push(await analyzeFile({ component: String(candidate.component || '').trim(), relativePath: String(relativePath || '').trim() }));
    }
    const proposalCount = files.reduce((sum, entry) => sum + Number(entry.proposalCount || 0), 0);
    const alreadyNormalizedCount = files.reduce((sum, entry) => sum + Number(entry.alreadyNormalizedCount || 0), 0);
    const skippedCount = files.reduce((sum, entry) => sum + Number(entry.skippedCount || 0), 0);
    const observedCount = files.reduce((sum, entry) => sum + Number(entry.observedCount || 0), 0);
    const passCount = files.filter((entry) => entry.status === 'PASS').length;
    const failCount = files.filter((entry) => entry.status === 'FAIL').length;
    const skippedFileCount = files.filter((entry) => entry.status === 'SKIPPED').length;
    results.push({
      candidateId: String(candidate.candidateId || '').trim(),
      component: String(candidate.component || '').trim(),
      consumerApp: String(candidate.consumerApp || '').trim(),
      riskLevel: String(candidate.riskLevel || '').trim(),
      prototypeStatus: String(candidate.prototypeStatus || '').trim(),
      rewriteRule: String(candidate.rewriteRule || '').trim(),
      executionMode: String(contract.execution_mode || 'illustrative-dry-run'),
      targetFiles: Array.isArray(candidate.targetFiles) ? candidate.targetFiles : [],
      analyzedFileCount: files.length,
      proposalCount,
      alreadyNormalizedCount,
      skippedCount,
      observedCount,
      passFileCount: passCount,
      failFileCount: failCount,
      skippedFileCount,
      status: files.length > 0 && failCount === 0 && passCount > 0 ? 'PASS' : 'FAIL',
      files,
    });
  }

  const artifactPath = path.join(repoRoot, String(contract.artifact_path || '').trim());
  const summary = {
    totalCandidates: candidates.length,
    focusedCandidates: targetedCandidates.length,
    passCount: results.filter((entry) => entry.status === 'PASS').length,
    failCount: results.filter((entry) => entry.status === 'FAIL').length,
    totalFiles: results.reduce((sum, entry) => sum + Number(entry.analyzedFileCount || 0), 0),
    proposalCount: results.reduce((sum, entry) => sum + Number(entry.proposalCount || 0), 0),
    alreadyNormalizedCount: results.reduce((sum, entry) => sum + Number(entry.alreadyNormalizedCount || 0), 0),
    skippedCount: results.reduce((sum, entry) => sum + Number(entry.skippedCount || 0), 0),
    observedCount: results.reduce((sum, entry) => sum + Number(entry.observedCount || 0), 0),
    candidateWithProposalsCount: results.filter((entry) => Number(entry.proposalCount || 0) > 0).length,
    candidateReadyNoopCount: results.filter(
      (entry) => Number(entry.proposalCount || 0) === 0 && Number(entry.alreadyNormalizedCount || 0) > 0,
    ).length,
  };
  const artifact = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    contractPath: toRepoRelative(contractPath),
    sourceArtifactPath: toRepoRelative(candidatesArtifactPath),
    prototypeArtifactPath: String(contract.prototype_artifact_path || '').trim(),
    executionMode: String(contract.execution_mode || 'illustrative-dry-run'),
    focusComponents: [...focusComponents],
    summary,
    items: results,
    rules: Array.isArray(contract.rules) ? contract.rules : [],
  };

  await mkdir(latestDir, { recursive: true });
  await writeFile(artifactPath, JSON.stringify({ codemodDryRun: artifact }, null, 2), 'utf8');
  console.log(JSON.stringify(artifact));
  if (summary.failCount > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[run-ui-library-codemod-dry-run] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
