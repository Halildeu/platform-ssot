#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const candidatesArtifactPath = path.join(latestDir, 'ui-library-codemod-candidates.v1.json');
const auditArtifactPath = path.join(latestDir, 'ui-library-codemod-candidates.audit.v1.json');
const RETRY_ATTEMPTS = 8;
const RETRY_DELAY_MS = 500;

const countMatches = (text, pattern) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadCandidatesArtifact = async () => {
  let lastError = null;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    try {
      if (!existsSync(candidatesArtifactPath)) {
        throw new Error(`codemod candidates artifact bulunamadi: ${candidatesArtifactPath}`);
      }
      const artifact = JSON.parse(await readFile(candidatesArtifactPath, 'utf8'));
      const items = Array.isArray(artifact.codemodCandidates?.items) ? artifact.codemodCandidates.items : [];
      if (!artifact.codemodCandidates || items.length === 0) {
        throw new Error(`codemod candidates artifact hazir degil: ${candidatesArtifactPath}`);
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

const main = async () => {
  const artifact = await loadCandidatesArtifact();
  const candidates = Array.isArray(artifact.codemodCandidates?.items) ? artifact.codemodCandidates.items : [];
  const results = [];

  for (const candidate of candidates) {
    const component = String(candidate.component || '').trim();
    const targetFiles = Array.isArray(candidate.targetFiles)
      ? candidate.targetFiles.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [];
    const requiredSignals = Array.isArray(candidate.dryRunScope?.requiredAnySignals)
      ? candidate.dryRunScope.requiredAnySignals.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [];
    const optionalSignals = Array.isArray(candidate.dryRunScope?.optionalSignals)
      ? candidate.dryRunScope.optionalSignals.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [];
    const minRequiredMatches = Number(candidate.dryRunScope?.minRequiredMatches ?? (requiredSignals.length ? 1 : 0));
    let totalRequiredMatches = 0;
    let totalOptionalMatches = 0;
    const fileChecks = [];

    for (const relativePath of targetFiles) {
      const absolutePath = path.join(repoRoot, relativePath);
      const exists = existsSync(absolutePath);
      let importFound = false;
      let usageCount = 0;
      const requiredSignalCounts = {};
      const optionalSignalCounts = {};
      if (exists) {
        const source = await readFile(absolutePath, 'utf8');
        importFound = new RegExp(`import\\s*\\{[^}]*\\b${component}\\b[^}]*\\}\\s*from\\s*['"]mfe-ui-kit['"]`, 'm').test(source);
        usageCount = countMatches(source, new RegExp(`(?<![A-Za-z0-9_])${component}(?![A-Za-z0-9_])`, 'g'));
        for (const signal of requiredSignals) {
          const matchCount = countMatches(source, new RegExp(`(?<![A-Za-z0-9_])${signal}(?![A-Za-z0-9_])`, 'g'));
          requiredSignalCounts[signal] = matchCount;
          totalRequiredMatches += matchCount;
        }
        for (const signal of optionalSignals) {
          const matchCount = countMatches(source, new RegExp(`(?<![A-Za-z0-9_])${signal}(?![A-Za-z0-9_])`, 'g'));
          optionalSignalCounts[signal] = matchCount;
          totalOptionalMatches += matchCount;
        }
      }
      fileChecks.push({
        path: relativePath,
        exists,
        importFound,
        usageCount,
        requiredSignalCounts,
        optionalSignalCounts,
        status: exists && importFound && usageCount > 0 ? 'PASS' : 'FAIL',
      });
    }

    const status =
      fileChecks.every((entry) => entry.status === 'PASS') &&
      totalRequiredMatches >= minRequiredMatches &&
      String(candidate.dryRunCommand || '').trim().length > 0 &&
      String(candidate.candidateScriptPath || '').trim().length > 0
        ? 'PASS'
        : 'FAIL';

    results.push({
      candidateId: candidate.candidateId,
      component,
      consumerApp: candidate.consumerApp,
      riskLevel: candidate.riskLevel,
      status,
      targetFileCount: fileChecks.length,
      passingFileCount: fileChecks.filter((entry) => entry.status === 'PASS').length,
      totalRequiredMatches,
      totalOptionalMatches,
      dryRunCommand: candidate.dryRunCommand,
      fileChecks,
    });
  }

  const summary = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    sourceArtifactPath: path.relative(repoRoot, candidatesArtifactPath).replaceAll(path.sep, '/'),
    candidateCount: results.length,
    passCount: results.filter((entry) => entry.status === 'PASS').length,
    failCount: results.filter((entry) => entry.status === 'FAIL').length,
    lowRiskCount: results.filter((entry) => entry.riskLevel === 'low').length,
    mediumRiskCount: results.filter((entry) => entry.riskLevel === 'medium').length,
    highRiskCount: results.filter((entry) => entry.riskLevel === 'high').length,
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
  console.error('[audit-ui-library-codemod-candidates] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
