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
  'ui-library-consumer-codemod-apply.contract.v1.json',
);

const args = process.argv.slice(2);
const writeEnabled = args.includes('--write');

const toRepoRelative = (absolutePath) => path.relative(repoRoot, absolutePath).replaceAll(path.sep, '/');

const countOccurrences = (source, needle) => {
  if (!needle) return 0;
  return source.split(needle).length - 1;
};

const main = async () => {
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  const sourceArtifactPath = path.join(repoRoot, String(contract.input_artifact_path || '').trim());
  if (!existsSync(sourceArtifactPath)) {
    throw new Error(`apply preview artifact bulunamadi: ${toRepoRelative(sourceArtifactPath)}`);
  }
  const payload = JSON.parse(await readFile(sourceArtifactPath, 'utf8'));
  const applyPreview = payload.codemodApplyPreview ?? {};
  const items = Array.isArray(applyPreview.items) ? applyPreview.items : [];
  const focusComponents = new Set(
    Array.isArray(contract.focus_components)
      ? contract.focus_components.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [],
  );

  const fileCache = new Map();
  const loadFile = async (relativePath) => {
    if (fileCache.has(relativePath)) {
      return fileCache.get(relativePath);
    }
    const absolutePath = path.join(repoRoot, relativePath);
    const source = existsSync(absolutePath) ? await readFile(absolutePath, 'utf8') : '';
    const record = { absolutePath, source, changed: false };
    fileCache.set(relativePath, record);
    return record;
  };

  const results = [];
  for (const item of items) {
    const component = String(item.component || '').trim();
    if (!focusComponents.has(component)) {
      continue;
    }

    const operations = [];
    for (const operation of Array.isArray(item.operations) ? item.operations : []) {
      const relativePath = String(operation.path || '').trim();
      if (!relativePath) {
        continue;
      }
      const targetFile = await loadFile(relativePath);
      const before = String(operation.before || '');
      const after = String(operation.after || '');
      const priorStatus = String(operation.status || '').trim();
      const matchCount = before ? countOccurrences(targetFile.source, before) : 0;

      let status = 'skipped';
      let applied = false;
      if (priorStatus === 'noop_already_normalized') {
        status = 'noop_already_normalized';
      } else if (priorStatus === 'write_eligible_preview') {
        if (matchCount === 1) {
          status = writeEnabled ? 'applied' : 'ready_to_apply';
          if (writeEnabled) {
            targetFile.source = targetFile.source.replace(before, after);
            targetFile.changed = true;
            applied = true;
          }
        } else if (matchCount === 0) {
          status = 'stale_source';
        } else {
          status = 'ambiguous_multiple_matches';
        }
      } else if (priorStatus === 'stale_source' || priorStatus === 'ambiguous_multiple_matches') {
        status = priorStatus;
      }

      operations.push({
        path: relativePath,
        line: Number(operation.line || 0),
        priorStatus,
        status,
        reason: String(operation.reason || '').trim(),
        before,
        after,
        exactMatchCount: matchCount,
        writeEligible: status === 'ready_to_apply' || status === 'applied',
        applied,
      });
    }

    const readyToApplyCount = operations.filter((entry) => entry.status === 'ready_to_apply' || entry.status === 'applied').length;
    const appliedCount = operations.filter((entry) => entry.applied).length;
    const noopCount = operations.filter((entry) => entry.status === 'noop_already_normalized').length;
    const staleCount = operations.filter((entry) => entry.status === 'stale_source').length;
    const ambiguousCount = operations.filter((entry) => entry.status === 'ambiguous_multiple_matches').length;
    const status = staleCount === 0 && ambiguousCount === 0 ? 'PASS' : 'FAIL';

    results.push({
      candidateId: String(item.candidateId || '').trim(),
      component,
      consumerApp: String(item.consumerApp || '').trim(),
      executionMode: writeEnabled ? 'write_enabled' : String(contract.default_write_mode || 'write_requires_flag'),
      prototypeStatus: String(item.prototypeStatus || '').trim(),
      operations,
      readyToApplyCount,
      appliedCount,
      noopCount,
      staleCount,
      ambiguousCount,
      status,
    });
  }

  if (writeEnabled) {
    for (const [, targetFile] of fileCache.entries()) {
      if (!targetFile.changed) {
        continue;
      }
      await writeFile(targetFile.absolutePath, targetFile.source, 'utf8');
    }
  }

  const artifact = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    contractPath: toRepoRelative(contractPath),
    sourceArtifactPath: toRepoRelative(sourceArtifactPath),
    executionMode: writeEnabled ? 'write_enabled' : String(contract.default_write_mode || 'write_requires_flag'),
    writeEnabled,
    allowWriteFlag: String(contract.allow_write_flag || '--write'),
    summary: {
      focusCandidateCount: results.length,
      readyToApplyCandidateCount: results.filter((entry) => entry.readyToApplyCount > 0).length,
      noopReadyCandidateCount: results.filter((entry) => entry.readyToApplyCount === 0 && entry.noopCount > 0).length,
      eligibleOperationCount: results.reduce((sum, entry) => sum + Number(entry.readyToApplyCount || 0), 0),
      appliedOperationCount: results.reduce((sum, entry) => sum + Number(entry.appliedCount || 0), 0),
      staleOperationCount: results.reduce((sum, entry) => sum + Number(entry.staleCount || 0), 0),
      ambiguousOperationCount: results.reduce((sum, entry) => sum + Number(entry.ambiguousCount || 0), 0),
    },
    focusComponents: [...focusComponents],
    items: results,
    rules: Array.isArray(contract.rules) ? contract.rules : [],
  };

  const artifactPath = path.join(repoRoot, String(contract.artifact_path || '').trim());
  await mkdir(latestDir, { recursive: true });
  await writeFile(artifactPath, JSON.stringify({ codemodApply: artifact }, null, 2), 'utf8');
  console.log(JSON.stringify(artifact));
  if (results.some((entry) => entry.status !== 'PASS')) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[run-ui-library-codemod-apply] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
