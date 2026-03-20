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
    throw new Error(`dry-run artifact bulunamadi: ${toRepoRelative(sourceArtifactPath)}`);
  }
  const payload = JSON.parse(await readFile(sourceArtifactPath, 'utf8'));
  const dryRun = payload.codemodDryRun ?? {};
  const items = Array.isArray(dryRun.items) ? dryRun.items : [];
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
    for (const fileEntry of Array.isArray(item.files) ? item.files : []) {
      const relativePath = String(fileEntry.path || '').trim();
      if (!relativePath) {
        continue;
      }
      const targetFile = await loadFile(relativePath);
      for (const record of Array.isArray(fileEntry.records) ? fileEntry.records : []) {
        const kind = String(record.kind || '').trim();
        const before = String(record.before || '');
        const after = String(record.after || '');
        const matchCount = before ? countOccurrences(targetFile.source, before) : 0;
        let status = 'skipped';
        let applied = false;

        if (kind === 'already_normalized') {
          status = 'noop_already_normalized';
        } else if (kind === 'proposed') {
          if (matchCount === 1) {
            status = writeEnabled ? 'applied' : 'write_eligible_preview';
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
        }

        operations.push({
          path: relativePath,
          line: Number(record.line || 0),
          kind,
          status,
          reason: String(record.reason || '').trim(),
          before,
          after,
          exactMatchCount: matchCount,
          writeEligible: status === 'write_eligible_preview' || status === 'applied',
          applied,
        });
      }
    }

    const exactEligibleCount = operations.filter((entry) => entry.writeEligible).length;
    const appliedCount = operations.filter((entry) => entry.applied).length;
    const noopCount = operations.filter((entry) => entry.status === 'noop_already_normalized').length;
    const staleCount = operations.filter((entry) => entry.status === 'stale_source').length;
    const ambiguousCount = operations.filter((entry) => entry.status === 'ambiguous_multiple_matches').length;
    const status = staleCount === 0 && ambiguousCount === 0 ? 'PASS' : 'FAIL';

    results.push({
      candidateId: String(item.candidateId || '').trim(),
      component,
      consumerApp: String(item.consumerApp || '').trim(),
      executionMode: writeEnabled ? 'write_enabled' : String(contract.default_write_mode || 'preview_only'),
      prototypeStatus: String(item.prototypeStatus || '').trim(),
      operations,
      exactEligibleCount,
      appliedCount,
      noopCount,
      staleCount,
      ambiguousCount,
      status,
    });
  }

  if (writeEnabled) {
    for (const [relativePath, targetFile] of fileCache.entries()) {
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
    executionMode: writeEnabled ? 'write_enabled' : String(contract.default_write_mode || 'preview_only'),
    writeEnabled,
    allowWriteFlag: String(contract.allow_write_flag || '--write'),
    summary: {
      focusCandidateCount: results.length,
      exactEligibleCandidateCount: results.filter((entry) => entry.exactEligibleCount > 0).length,
      noopReadyCandidateCount: results.filter((entry) => entry.exactEligibleCount === 0 && entry.noopCount > 0).length,
      proposedOperationCount: results.reduce((sum, entry) => sum + Number(entry.exactEligibleCount || 0), 0),
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
  await writeFile(artifactPath, JSON.stringify({ codemodApplyPreview: artifact }, null, 2), 'utf8');
  console.log(JSON.stringify(artifact));
  if (results.some((entry) => entry.status !== 'PASS')) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[run-ui-library-codemod-apply-preview] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
