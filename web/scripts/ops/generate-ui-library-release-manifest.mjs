#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const uiKitPackagePath = path.join(webRoot, 'packages', 'ui-kit', 'package.json');
const componentManifestPath = path.join(webRoot, 'packages', 'ui-kit', 'src', 'catalog', 'component-manifest.v1.json');
const designLabIndexPath = path.join(webRoot, 'apps', 'mfe-shell', 'src', 'pages', 'admin', 'design-lab.index.json');
const reviewContractPath = path.join(webRoot, '..', 'docs', '02-architecture', 'context', 'ui-library-visual-review.contract.v1.json');
const manifestPath = path.join(webRoot, 'dist', 'ui-kit', 'ui-library-release-manifest.v1.json');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const latestManifestPath = path.join(latestDir, 'ui-library-release-manifest.v1.json');
const consumerImpactPath = path.join(latestDir, 'ui-library-consumer-impact.v1.json');
const upgradeChecklistPath = path.join(latestDir, 'ui-library-upgrade-checklist.v1.json');
const upgradeRecipesPath = path.join(latestDir, 'ui-library-upgrade-recipes.v1.json');
const upgradeRecipesAuditPath = path.join(latestDir, 'ui-library-upgrade-recipes.audit.v1.json');
const codemodCandidatesPath = path.join(latestDir, 'ui-library-codemod-candidates.v1.json');
const codemodCandidatesAuditPath = path.join(latestDir, 'ui-library-codemod-candidates.audit.v1.json');
const releaseNotesArtifactPath = path.join(latestDir, 'ui-library-release-notes.v1.md');
const changelogArtifactPath = path.join(latestDir, 'ui-library-changelog.v1.md');

const artifactPaths = [
  'packages/dist/ui-kit/remoteEntry.js',
  'dist/ui-kit/remoteEntry.js',
];
const storybookArtifactPath = 'storybook-static/index.html';

const toRepoRelative = (absolutePath) => path.relative(path.join(webRoot, '..'), absolutePath).replaceAll(path.sep, '/');
const loadJsonIfExists = async (absolutePath) => (existsSync(absolutePath) ? JSON.parse(await readFile(absolutePath, 'utf8')) : null);

const renderReleaseNotes = ({ packageName, packageVersion, previewRoute, migration, visualContract, upgradeRecipesAudit }) => {
  const semverGuidance = migration?.semverGuidance ?? {};
  const ownerResolution = migration?.ownerResolution ?? {};
  const checklist = migration?.upgradeChecklist ?? {};
  const recipes = migration?.upgradeRecipes ?? {};
  const codemods = migration?.codemodCandidates ?? {};
  const summary = migration?.summary ?? {};
  const visualSummary = visualContract?.summary ?? {};
  const auditSummary = upgradeRecipesAudit ?? {};
  const consumerApps = Array.isArray(migration?.consumerApps) ? migration.consumerApps : [];
  const consumerLines = consumerApps.length
    ? consumerApps
        .map((app) => {
          const owners = Array.isArray(app.ownerHandles) && app.ownerHandles.length ? app.ownerHandles.join(', ') : 'owner-missing';
          return `- ${app.appId}: ${owners} (${app.componentCount} component, ${app.highestChangeClass ?? 'patch-safe-lab-only'})`;
        })
        .join('\n')
    : '- consumer app bulunmadi';
  return [
    '# UI Library Release Notes',
    '',
    `- Package: \`${packageName}\``,
    `- Version: \`${packageVersion}\``,
    `- Generated at: \`${new Date().toISOString()}\``,
    `- Preview route: \`${previewRoute}\``,
    '',
    '## Semver Guidance',
    '',
    `- Recommended bump: \`${semverGuidance.recommendedBump ?? 'patch'}\``,
    `- Label: \`${semverGuidance.releaseNotesLabel ?? 'patch-review'}\``,
    `- Reason: ${semverGuidance.reason ?? 'Semver guidance bulunamadi.'}`,
    '',
    '## Migration Summary',
    '',
    `- Adopted outside lab: \`${summary.adoptedOutsideLabComponents ?? 0}\``,
    `- Single-app blast radius: \`${summary.singleAppBlastRadiusCount ?? 0}\``,
    `- Cross-app review: \`${summary.crossAppReviewComponents ?? 0}\``,
    `- Manual migration: \`${summary.manualReviewRequiredComponents ?? 0}\``,
    `- Owner mapped apps: \`${summary.ownerMappedAppsCount ?? 0}/${summary.consumerAppsCount ?? 0}\``,
    `- Recipe audit: \`${auditSummary.passCount ?? 0}/${auditSummary.recipeCount ?? 0}\` pass`,
    `- Codemod dry-run ready: \`${codemods.summary?.dryRunReadyCandidates ?? 0}/${codemods.summary?.totalCandidates ?? 0}\``,
    '',
    '## Consumer Owners',
    '',
    consumerLines,
    '',
    '## Visual Readiness',
    '',
    `- Story coverage: \`${visualSummary.storyCoveragePercent ?? 0}%\``,
    `- Release-ready coverage: \`${visualSummary.releaseReadyCoveragePercent ?? 0}%\``,
    `- Adopted coverage: \`${visualSummary.adoptedCoveragePercent ?? 0}%\``,
    '',
    '## Generated Artifacts',
    '',
    `- Upgrade checklist: \`${checklist.artifactPath ?? toRepoRelative(upgradeChecklistPath)}\``,
    `- Upgrade recipes: \`${recipes.artifactPath ?? toRepoRelative(upgradeRecipesPath)}\``,
    `- Upgrade recipe audit: \`${recipes.auditArtifactPath ?? toRepoRelative(upgradeRecipesAuditPath)}\``,
    `- Codemod candidates: \`${codemods.artifactPath ?? toRepoRelative(codemodCandidatesPath)}\``,
    `- Codemod audit: \`${codemods.auditArtifactPath ?? toRepoRelative(codemodCandidatesAuditPath)}\``,
    `- Consumer impact: \`web/test-results/releases/ui-library/latest/ui-library-consumer-impact.v1.json\``,
    `- Release manifest: \`web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json\``,
    `- Changelog: \`${toRepoRelative(changelogArtifactPath)}\``,
    `- Owner registry: \`${ownerResolution.contractPath ?? 'docs/02-architecture/context/ui-library-consumer-owner-registry.v1.json'}\``,
    '',
  ].join('\n');
};

const renderChangelog = ({ packageVersion, migration }) => {
  const semverGuidance = migration?.semverGuidance ?? {};
  const majorComponents = Array.isArray(semverGuidance.majorComponents) ? semverGuidance.majorComponents : [];
  const minorComponents = Array.isArray(semverGuidance.minorComponents) ? semverGuidance.minorComponents : [];
  const patchCandidates = Array.isArray(semverGuidance.patchCandidates) ? semverGuidance.patchCandidates : [];
  return [
    '# UI Library Changelog',
    '',
    `## ${packageVersion}`,
    '',
    `- Recommended bump: \`${semverGuidance.recommendedBump ?? 'patch'}\``,
    `- Reason: ${semverGuidance.reason ?? 'Semver guidance bulunamadi.'}`,
    '',
    '### Major Review Components',
    ...(majorComponents.length ? majorComponents.map((name) => `- ${name}`) : ['- yok']),
    '',
    '### Minor Review Components',
    ...(minorComponents.length ? minorComponents.map((name) => `- ${name}`) : ['- yok']),
    '',
    '### Patch-safe Lab Backlog',
    ...(patchCandidates.length ? patchCandidates.map((name) => `- ${name}`) : ['- yok']),
    '',
  ].join('\n');
};

const main = async () => {
  const packageJson = JSON.parse(await readFile(uiKitPackagePath, 'utf8'));
  const componentManifest = JSON.parse(await readFile(componentManifestPath, 'utf8'));
  const designLabIndex = JSON.parse(await readFile(designLabIndexPath, 'utf8'));
  const adoptionSummary = designLabIndex.adoption ?? componentManifest.adoption ?? null;
  const migration = designLabIndex.migration ?? componentManifest.migration ?? null;
  const visualContract = designLabIndex.visualRegression ?? componentManifest.visualRegression ?? null;
  const upgradeRecipesAudit = await loadJsonIfExists(upgradeRecipesAuditPath);
  const codemodCandidatesAudit = await loadJsonIfExists(codemodCandidatesAuditPath);
  const reviewContract = existsSync(reviewContractPath)
    ? JSON.parse(await readFile(reviewContractPath, 'utf8'))
    : null;
  const previewRoute = adoptionSummary?.previewRoute ?? '/admin/design-lab';
  const remoteName = adoptionSummary?.moduleFederation?.remoteName ?? 'mfe_ui_kit';
  const exposes = adoptionSummary?.moduleFederation?.exposes ?? ['./library', './Button'];
  const reviewSecretEnvVar = reviewContract?.secret_env_var ?? visualContract?.reviewChannel?.secretEnvVar ?? 'CHROMATIC_PROJECT_TOKEN';
  const reviewSecretReady = Boolean(process.env[reviewSecretEnvVar]);
  const reviewMode = reviewSecretReady
    ? (reviewContract?.review_mode_when_secret_present ?? visualContract?.reviewChannel?.reviewMode ?? 'hosted_review')
    : (reviewContract?.review_mode_when_secret_missing ?? visualContract?.reviewChannel?.fallbackMode ?? 'artifact_only');
  const migrationWithArtifacts = migration
    ? {
        ...migration,
        upgradeRecipes: migration?.upgradeRecipes
          ? {
              ...migration.upgradeRecipes,
              auditArtifactPath:
                migration.upgradeRecipes.auditArtifactPath ??
                'web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.audit.v1.json',
              latestAudit: upgradeRecipesAudit
                ? {
                    generatedAt: upgradeRecipesAudit.generatedAt ?? null,
                    recipeCount: Number(upgradeRecipesAudit.recipeCount ?? 0),
                    passCount: Number(upgradeRecipesAudit.passCount ?? 0),
                    failCount: Number(upgradeRecipesAudit.failCount ?? 0),
                  }
                : null,
            }
          : null,
        codemodCandidates: migration?.codemodCandidates
          ? {
              ...migration.codemodCandidates,
              auditArtifactPath:
                migration.codemodCandidates.auditArtifactPath ??
                'web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.audit.v1.json',
              latestAudit: codemodCandidatesAudit
                ? {
                    generatedAt: codemodCandidatesAudit.generatedAt ?? null,
                    candidateCount: Number(codemodCandidatesAudit.candidateCount ?? 0),
                    passCount: Number(codemodCandidatesAudit.passCount ?? 0),
                    failCount: Number(codemodCandidatesAudit.failCount ?? 0),
                  }
                : null,
            }
          : null,
      }
    : null;
  const manifest = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    previewRoute,
    remoteName,
    exposes,
    catalogSummary: designLabIndex.summary ?? componentManifest.summary ?? null,
    latestRelease: designLabIndex.release?.latestRelease ?? null,
    distributionTargets: designLabIndex.release?.distributionTargets ?? [],
    consumerContract: {
      packageImport: adoptionSummary?.packageImport ?? `import { Button } from '${packageJson.name}';`,
      previewRoute,
      moduleFederation: {
        remoteName,
        exposes,
      },
      packageJsonPath: 'web/packages/ui-kit/package.json',
      contractPath: designLabIndex.release?.contractPath ?? null,
    },
    adoptionSummary,
    migration: migrationWithArtifacts,
    consumerImpactArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-consumer-impact.v1.json',
    upgradeChecklistArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-upgrade-checklist.v1.json',
    upgradeRecipesArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.v1.json',
    upgradeRecipesAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.audit.v1.json',
    codemodCandidatesArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.v1.json',
    codemodCandidatesAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.audit.v1.json',
    releaseNotesArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-release-notes.v1.md',
    changelogArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-changelog.v1.md',
    visualContract: visualContract
      ? {
          ...visualContract,
          storybook: {
            ...(visualContract.storybook ?? {}),
            artifactPresent: existsSync(path.join(webRoot, storybookArtifactPath)),
          },
          reviewChannel: {
            ...(visualContract.reviewChannel ?? {}),
            configured: Boolean(reviewContract ?? visualContract.reviewChannel),
            contractPath: visualContract.reviewChannel?.contractPath ?? 'docs/02-architecture/context/ui-library-visual-review.contract.v1.json',
            secretEnvVar: reviewSecretEnvVar,
            secretReady: reviewSecretReady,
            reviewMode,
          },
          chromaticConfigured: Boolean(reviewContract ?? visualContract.reviewChannel),
          chromaticSecretReady: reviewSecretReady,
        }
      : null,
    artifacts: artifactPaths.map((relativePath) => ({
      path: `web/${relativePath}`,
      exists: existsSync(path.join(webRoot, relativePath)),
    })),
  };

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await mkdir(latestDir, { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  await writeFile(latestManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  await writeFile(
    consumerImpactPath,
    JSON.stringify(
      {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        packageName: packageJson.name,
        packageVersion: packageJson.version,
        previewRoute,
        adoptionSummary,
        migration: migrationWithArtifacts,
        visualContract,
      },
      null,
      2,
    ),
    'utf8',
  );
  await writeFile(
    upgradeChecklistPath,
    JSON.stringify(
      {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        packageName: packageJson.name,
        packageVersion: packageJson.version,
        previewRoute,
        ownerResolution: migrationWithArtifacts?.ownerResolution ?? null,
        upgradeChecklist: migrationWithArtifacts?.upgradeChecklist ?? null,
        semverGuidance: migrationWithArtifacts?.semverGuidance ?? null,
      },
      null,
      2,
    ),
    'utf8',
  );
  await writeFile(
    upgradeRecipesPath,
    JSON.stringify(
      {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        packageName: packageJson.name,
        packageVersion: packageJson.version,
        previewRoute,
        upgradeRecipes: migrationWithArtifacts?.upgradeRecipes ?? null,
        semverGuidance: migrationWithArtifacts?.semverGuidance ?? null,
        ownerResolution: migrationWithArtifacts?.ownerResolution ?? null,
      },
      null,
      2,
    ),
    'utf8',
  );
  await writeFile(
    codemodCandidatesPath,
    JSON.stringify(
      {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        packageName: packageJson.name,
        packageVersion: packageJson.version,
        previewRoute,
        codemodCandidates: migrationWithArtifacts?.codemodCandidates ?? null,
        semverGuidance: migrationWithArtifacts?.semverGuidance ?? null,
        ownerResolution: migrationWithArtifacts?.ownerResolution ?? null,
      },
      null,
      2,
    ),
    'utf8',
  );
  await writeFile(
    releaseNotesArtifactPath,
    renderReleaseNotes({
      packageName: packageJson.name,
      packageVersion: packageJson.version,
      previewRoute,
      migration: migrationWithArtifacts,
      visualContract,
      upgradeRecipesAudit,
    }),
    'utf8',
  );
  await writeFile(
    changelogArtifactPath,
    renderChangelog({
      packageVersion: packageJson.version,
      migration: migrationWithArtifacts,
    }),
    'utf8',
  );
  console.log(JSON.stringify(manifest));
};

main().catch((error) => {
  console.error('[generate-ui-library-release-manifest] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
