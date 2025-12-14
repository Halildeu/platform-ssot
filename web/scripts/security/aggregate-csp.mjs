#!/usr/bin/env node
/**
 * CSP report-only loglarını özetler.
 *
 * Örnek:
 *   node scripts/security/aggregate-csp.mjs --output security-reports/csp/summary.json
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const reportsDir = path.join(repoRoot, 'security', 'csp', 'reports');
const policyPath = path.join(repoRoot, 'security', 'csp', 'report-only-policy.json');

const args = process.argv.slice(2);
const outputIdx = args.findIndex((arg) => arg === '--output');
const outputPath = outputIdx >= 0 ? path.resolve(process.cwd(), args[outputIdx + 1]) : path.join(repoRoot, 'security-reports', 'csp', 'summary.json');

const safeParseJson = (raw, fallback = null) => {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const normaliseViolations = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.flatMap(normaliseViolations);
  }
  if (typeof payload === 'object' && payload !== null) {
    if (Array.isArray(payload["csp-report"])) {
      return payload["csp-report"].flatMap(normaliseViolations);
    }
    if (payload["csp-report"]) {
      return [payload["csp-report"]];
    }
    return [payload];
  }
  return [];
};

const readPolicyEndpoint = async () => {
  try {
    const rawPolicy = await readFile(policyPath, 'utf8');
    const policy = JSON.parse(rawPolicy);
    const reportDirective = policy?.directives?.['report-uri'];
    if (Array.isArray(reportDirective) && reportDirective.length > 0) {
      return reportDirective[0];
    }
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      console.warn(`⚠️  CSP policy okunamadı (${policyPath}): ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return null;
};

const main = async () => {
  const envEndpoint = process.env.CSP_REPORT_ENDPOINT || null;
  const policyEndpoint = await readPolicyEndpoint();
  const reportEndpoint = envEndpoint || policyEndpoint || null;

  let files = [];
  try {
    files = await readdir(reportsDir);
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    source: path.relative(repoRoot, reportsDir),
    expectedReportEndpoint: reportEndpoint,
    policyReportEndpoint: policyEndpoint,
    envReportEndpoint: envEndpoint,
    totalReports: 0,
    directives: {},
    samples: [],
  };

  for (const file of files) {
    if (!file.endsWith('.json') && !file.endsWith('.ndjson')) {
      continue;
    }
    const fullPath = path.join(reportsDir, file);
    const raw = await readFile(fullPath, 'utf8');
    const parsed = file.endsWith('.ndjson')
      ? raw
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => safeParseJson(line))
          .filter(Boolean)
      : normaliseViolations(safeParseJson(raw));

    for (const violation of parsed) {
      const directive = violation['effective-directive'] || violation['violated-directive'] || 'unknown';
      summary.totalReports += 1;
      summary.directives[directive] = (summary.directives[directive] || 0) + 1;
      if (summary.samples.length < 5) {
        summary.samples.push({
          source: violation['blocked-uri'] || violation['document-uri'] || 'n/a',
          directive,
          disposition: violation.disposition,
          referrer: violation.referrer,
        });
      }
    }
  }

  const dirName = path.dirname(outputPath);
  await mkdir(dirName, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  console.log(`📊 CSP rapor özeti üretildi: ${outputPath}`);
  if (!reportEndpoint) {
    console.warn('⚠️  CSP report endpoint belirlenemedi. `security/csp/report-only-policy.json` içindeki `report-uri` alanını ve `CSP_REPORT_ENDPOINT` secret’ını kontrol edin.');
  } else if (!envEndpoint && policyEndpoint) {
    console.info(`ℹ️  CSP_REPORT_ENDPOINT tanımlı olmadığı için policy’deki endpoint kullanıldı: ${policyEndpoint}`);
  } else if (envEndpoint && policyEndpoint && envEndpoint !== policyEndpoint) {
    console.warn(`⚠️  CSP_REPORT_ENDPOINT (${envEndpoint}) policy’deki endpoint ile eşleşmiyor (${policyEndpoint}).`);
  }
};

main().catch((error) => {
  console.error(`CSP raporu oluşturulamadı:\n${error instanceof Error ? error.stack || error.message : String(error)}`);
  process.exit(1);
});
