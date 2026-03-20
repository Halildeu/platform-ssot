import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAvailableLocales, getAvailableNamespaces, getDictionary } from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');
const latestDir = join(packageRoot, '..', '..', 'test-results', 'releases', 'ui-library', 'latest');
const artifactPath = join(latestDir, 'ui-library-locale-coverage.v1.json');

type NamespaceCoverage = {
  namespace: string;
  baselineKeyCount: number;
  effectiveKeyCount: number;
  missingKeyCount: number;
  missingKeys: string[];
  effectiveCoveragePercent: number;
  translatedDeltaCount: number;
  translatedDeltaPercent: number;
  identicalToEnglishCount: number;
};

type LocaleCoverage = {
  locale: string;
  namespaceCount: number;
  baselineKeyCount: number;
  effectiveKeyCount: number;
  missingKeyCount: number;
  effectiveCoveragePercent: number;
  translatedDeltaCount: number;
  translatedDeltaPercent: number;
  namespaces: NamespaceCoverage[];
};

type LocaleBacklog = {
  locale: string;
  translatedDeltaPercent: number;
  translatedDeltaCount: number;
  missingKeyCount: number;
  topNamespaceGaps: Array<{
    namespace: string;
    translatedDeltaPercent: number;
    translatedDeltaCount: number;
    missingKeyCount: number;
  }>;
};

type NamespaceBacklog = {
  locale: string;
  namespace: string;
  translatedDeltaPercent: number;
  translatedDeltaCount: number;
  missingKeyCount: number;
  baselineKeyCount: number;
  identicalToEnglishCount: number;
};

type PriorityTranslationBacklog = {
  locale: string;
  namespace: string;
  translatedDeltaPercent: number;
  translatedDeltaCount: number;
  missingKeyCount: number;
  identicalToEnglishCount: number;
  baselineKeyCount: number;
  priorityScore: number;
  rationale: string;
};

const percent = (value: number, total: number): number =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const buildPriorityScore = (entry: NamespaceBacklog): number =>
  entry.missingKeyCount * 20 + entry.identicalToEnglishCount * 2 + Math.max(0, 100 - entry.translatedDeltaPercent);

const main = async () => {
  const locales = getAvailableLocales();
  const namespaces = getAvailableNamespaces();
  const coverageByLocale: LocaleCoverage[] = [];
  const problems: string[] = [];

  for (const locale of locales) {
    let baselineKeyCount = 0;
    let effectiveKeyCount = 0;
    let missingKeyCount = 0;
    let translatedDeltaCount = 0;
    const namespaceCoverage: NamespaceCoverage[] = [];

    for (const namespace of namespaces) {
      const english = getDictionary('en', namespace);
      const localized = getDictionary(locale, namespace);
      if (!english || !localized) {
        problems.push(`missing-dictionary:${locale}/${namespace}`);
        continue;
      }

      const englishDict = english.dictionary;
      const localizedDict = localized.dictionary;
      const baselineKeys = Object.keys(englishDict);
      const localizedKeys = Object.keys(localizedDict);
      const missingKeys = baselineKeys.filter((key) => !Object.prototype.hasOwnProperty.call(localizedDict, key));
      const translatedDelta = baselineKeys.filter((key) => localizedDict[key] !== englishDict[key]);

      baselineKeyCount += baselineKeys.length;
      effectiveKeyCount += localizedKeys.filter((key) => baselineKeys.includes(key)).length;
      missingKeyCount += missingKeys.length;
      translatedDeltaCount += translatedDelta.length;

      namespaceCoverage.push({
        namespace,
        baselineKeyCount: baselineKeys.length,
        effectiveKeyCount: localizedKeys.filter((key) => baselineKeys.includes(key)).length,
        missingKeyCount: missingKeys.length,
        missingKeys,
        effectiveCoveragePercent: percent(localizedKeys.filter((key) => baselineKeys.includes(key)).length, baselineKeys.length),
        translatedDeltaCount: translatedDelta.length,
        translatedDeltaPercent: percent(translatedDelta.length, baselineKeys.length),
        identicalToEnglishCount: baselineKeys.length - translatedDelta.length,
      });
    }

    coverageByLocale.push({
      locale,
      namespaceCount: namespaceCoverage.length,
      baselineKeyCount,
      effectiveKeyCount,
      missingKeyCount,
      effectiveCoveragePercent: percent(effectiveKeyCount, baselineKeyCount),
      translatedDeltaCount,
      translatedDeltaPercent: percent(translatedDeltaCount, baselineKeyCount),
      namespaces: namespaceCoverage,
    });
  }

  const translatedLocales = coverageByLocale.filter((entry) => !['en', 'pseudo'].includes(entry.locale));
  const highestTranslatedCoverage = translatedLocales.reduce<LocaleCoverage | null>((highest, entry) => {
    if (!highest || entry.translatedDeltaPercent > highest.translatedDeltaPercent) {
      return entry;
    }
    return highest;
  }, null);
  const lowestTranslatedCoverage = translatedLocales.reduce<LocaleCoverage | null>((lowest, entry) => {
    if (!lowest || entry.translatedDeltaPercent < lowest.translatedDeltaPercent) {
      return entry;
    }
    return lowest;
  }, null);
  const topLocaleTranslationGaps: LocaleBacklog[] = translatedLocales
    .map((entry) => ({
      locale: entry.locale,
      translatedDeltaPercent: entry.translatedDeltaPercent,
      translatedDeltaCount: entry.translatedDeltaCount,
      missingKeyCount: entry.missingKeyCount,
      topNamespaceGaps: entry.namespaces
        .filter((namespace) => namespace.translatedDeltaPercent < 100 || namespace.missingKeyCount > 0)
        .sort((left, right) => {
          if (left.translatedDeltaPercent !== right.translatedDeltaPercent) {
            return left.translatedDeltaPercent - right.translatedDeltaPercent;
          }
          if (left.missingKeyCount !== right.missingKeyCount) {
            return right.missingKeyCount - left.missingKeyCount;
          }
          return right.baselineKeyCount - left.baselineKeyCount;
        })
        .slice(0, 3)
        .map((namespace) => ({
          namespace: namespace.namespace,
          translatedDeltaPercent: namespace.translatedDeltaPercent,
          translatedDeltaCount: namespace.translatedDeltaCount,
          missingKeyCount: namespace.missingKeyCount,
        })),
    }))
    .sort((left, right) => {
      if (left.translatedDeltaPercent !== right.translatedDeltaPercent) {
        return left.translatedDeltaPercent - right.translatedDeltaPercent;
      }
      return right.translatedDeltaCount - left.translatedDeltaCount;
    });
  const topNamespaceTranslationGaps: NamespaceBacklog[] = translatedLocales
    .flatMap((entry) =>
      entry.namespaces
        .filter((namespace) => namespace.translatedDeltaPercent < 100 || namespace.missingKeyCount > 0)
        .map((namespace) => ({
          locale: entry.locale,
          namespace: namespace.namespace,
          translatedDeltaPercent: namespace.translatedDeltaPercent,
          translatedDeltaCount: namespace.translatedDeltaCount,
          missingKeyCount: namespace.missingKeyCount,
          baselineKeyCount: namespace.baselineKeyCount,
          identicalToEnglishCount: namespace.identicalToEnglishCount,
        })),
    )
    .sort((left, right) => {
      if (left.translatedDeltaPercent !== right.translatedDeltaPercent) {
        return left.translatedDeltaPercent - right.translatedDeltaPercent;
      }
      if (left.missingKeyCount !== right.missingKeyCount) {
        return right.missingKeyCount - left.missingKeyCount;
      }
      return right.baselineKeyCount - left.baselineKeyCount;
    })
    .slice(0, 10);
  const priorityTranslationBacklog: PriorityTranslationBacklog[] = translatedLocales
    .flatMap((entry) =>
      entry.namespaces
        .filter((namespace) => namespace.translatedDeltaPercent < 100 || namespace.missingKeyCount > 0)
        .map((namespace) => {
          const backlogEntry: NamespaceBacklog = {
            locale: entry.locale,
            namespace: namespace.namespace,
            translatedDeltaPercent: namespace.translatedDeltaPercent,
            translatedDeltaCount: namespace.translatedDeltaCount,
            missingKeyCount: namespace.missingKeyCount,
            baselineKeyCount: namespace.baselineKeyCount,
            identicalToEnglishCount: namespace.identicalToEnglishCount,
          };
          const priorityScore = buildPriorityScore(backlogEntry);
          const rationale =
            namespace.missingKeyCount > 0
              ? 'missing-keys'
              : namespace.identicalToEnglishCount > 0
                ? 'identical-to-english'
                : 'coverage-gap';
          return {
            ...backlogEntry,
            priorityScore,
            rationale,
          };
        }),
    )
    .sort((left, right) => {
      if (left.priorityScore !== right.priorityScore) {
        return right.priorityScore - left.priorityScore;
      }
      if (left.translatedDeltaPercent !== right.translatedDeltaPercent) {
        return left.translatedDeltaPercent - right.translatedDeltaPercent;
      }
      return right.baselineKeyCount - left.baselineKeyCount;
    })
    .slice(0, 10);

  const payload = {
    version: '1.0',
    overall_status: problems.length === 0 ? 'PASS' : 'FAIL',
    generatedAt: new Date().toISOString(),
    baselineLocale: 'en',
    locales: coverageByLocale,
    summary: {
      localeCount: coverageByLocale.length,
      translatedLocaleCount: translatedLocales.length,
      namespaceCount: namespaces.length,
      fullEffectiveCoverageLocales: coverageByLocale
        .filter((entry) => entry.missingKeyCount === 0)
        .map((entry) => entry.locale),
      highestTranslatedLocale: highestTranslatedCoverage?.locale ?? null,
      highestTranslatedCoveragePercent: highestTranslatedCoverage?.translatedDeltaPercent ?? 0,
      lowestTranslatedLocale: lowestTranslatedCoverage?.locale ?? null,
      lowestTranslatedCoveragePercent: lowestTranslatedCoverage?.translatedDeltaPercent ?? 0,
      lowestTranslatedDeltaCount: lowestTranslatedCoverage?.translatedDeltaCount ?? 0,
      localesMissingKeys: coverageByLocale.filter((entry) => entry.missingKeyCount > 0).map((entry) => entry.locale),
    },
    backlog: {
      topLocaleTranslationGaps,
      topNamespaceTranslationGaps,
      priorityTranslationBacklog,
    },
    problems,
  };

  await fs.mkdir(latestDir, { recursive: true });
  await fs.writeFile(artifactPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  if (problems.length > 0) {
    console.error('[report_locale_coverage] FAIL');
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `[report_locale_coverage] OK locales=${coverageByLocale.length} namespaces=${namespaces.length} lowestTranslated=${lowestTranslatedCoverage?.locale ?? 'n/a'}:${lowestTranslatedCoverage?.translatedDeltaPercent ?? 0}% artifact=${artifactPath}`,
  );
};

main().catch((error) => {
  console.error('[report_locale_coverage] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
