import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAvailableNamespaces, getDictionary } from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');
const latestDir = join(packageRoot, '..', '..', 'test-results', 'releases', 'ui-library', 'latest');
const artifactPath = join(latestDir, 'ui-library-pseudolocale-smoke.v1.json');
const PSEUDO_ELIGIBLE_PATTERN = /[aeiouAEIOUcnCN]/;
const PSEUDO_OUTPUT_PATTERN = /[áéíóúÁÉÍÓÚçÇñÑ]/;

const main = async () => {
  const namespaces = getAvailableNamespaces();
  const namespaceResults: Array<{
    namespace: string;
    baselineKeyCount: number;
    pseudoKeyCount: number;
    eligibleStringCount: number;
    changedEligibleCount: number;
    unchangedEligibleKeys: string[];
    pseudoMarkedCount: number;
    missingKeys: string[];
    unexpectedKeys: string[];
  }> = [];
  const problems: string[] = [];

  for (const namespace of namespaces) {
    const english = getDictionary('en', namespace);
    const pseudo = getDictionary('pseudo', namespace);
    if (!english || !pseudo) {
      problems.push(`missing-dictionary:${namespace}`);
      continue;
    }

    const englishDict = english.dictionary;
    const pseudoDict = pseudo.dictionary;
    const baselineKeys = Object.keys(englishDict);
    const pseudoKeys = Object.keys(pseudoDict);
    const missingKeys = baselineKeys.filter((key) => !Object.prototype.hasOwnProperty.call(pseudoDict, key));
    const unexpectedKeys = pseudoKeys.filter((key) => !Object.prototype.hasOwnProperty.call(englishDict, key));
    const eligibleKeys = baselineKeys.filter((key) => PSEUDO_ELIGIBLE_PATTERN.test(englishDict[key] ?? ''));
    const unchangedEligibleKeys = eligibleKeys.filter((key) => pseudoDict[key] === englishDict[key]);
    const changedEligibleCount = eligibleKeys.length - unchangedEligibleKeys.length;
    const pseudoMarkedCount = eligibleKeys.filter((key) => PSEUDO_OUTPUT_PATTERN.test(pseudoDict[key] ?? '')).length;

    if (missingKeys.length > 0) {
      problems.push(`missing-keys:${namespace}:${missingKeys.slice(0, 10).join(',')}`);
    }
    if (unexpectedKeys.length > 0) {
      problems.push(`unexpected-keys:${namespace}:${unexpectedKeys.slice(0, 10).join(',')}`);
    }
    if (unchangedEligibleKeys.length > 0) {
      problems.push(`unchanged-pseudo:${namespace}:${unchangedEligibleKeys.slice(0, 10).join(',')}`);
    }

    namespaceResults.push({
      namespace,
      baselineKeyCount: baselineKeys.length,
      pseudoKeyCount: pseudoKeys.length,
      eligibleStringCount: eligibleKeys.length,
      changedEligibleCount,
      unchangedEligibleKeys,
      pseudoMarkedCount,
      missingKeys,
      unexpectedKeys,
    });
  }

  const totalEligible = namespaceResults.reduce((sum, entry) => sum + entry.eligibleStringCount, 0);
  const totalChanged = namespaceResults.reduce((sum, entry) => sum + entry.changedEligibleCount, 0);

  const payload = {
    version: '1.0',
    overall_status: problems.length === 0 ? 'PASS' : 'FAIL',
    generatedAt: new Date().toISOString(),
    baselineLocale: 'en',
    pseudoLocale: 'pseudo',
    namespaces: namespaceResults,
    summary: {
      namespaceCount: namespaceResults.length,
      totalEligibleStringCount: totalEligible,
      changedEligibleStringCount: totalChanged,
      unchangedEligibleStringCount: totalEligible - totalChanged,
      pseudolocalizedPercent: totalEligible > 0 ? Math.round((totalChanged / totalEligible) * 100) : 0,
    },
    problems,
  };

  await fs.mkdir(latestDir, { recursive: true });
  await fs.writeFile(artifactPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  if (problems.length > 0) {
    console.error('[check_pseudolocale_smoke] FAIL');
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[check_pseudolocale_smoke] OK namespaces=${namespaceResults.length} eligible=${totalEligible} changed=${totalChanged} artifact=${artifactPath}`,
  );
};

main().catch((error) => {
  console.error('[check_pseudolocale_smoke] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
