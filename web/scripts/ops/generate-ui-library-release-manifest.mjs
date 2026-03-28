#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..', '..');
const uiKitPackagePath = path.join(webRoot, 'packages', 'design-system', 'package.json');
const componentManifestPath = path.join(webRoot, 'packages', 'design-system', 'src', 'catalog', 'component-manifest.v1.json');
const designLabIndexPath = path.join(webRoot, 'apps', 'mfe-shell', 'src', 'pages', 'admin', 'design-lab.index.json');
const reviewContractPath = path.join(webRoot, '..', 'docs', '02-architecture', 'context', 'ui-library-visual-review.contract.v1.json');
const manifestPath = path.join(webRoot, 'dist', 'design-system', 'ui-library-release-manifest.v1.json');
const latestDir = path.join(webRoot, 'test-results', 'releases', 'ui-library', 'latest');
const latestManifestPath = path.join(latestDir, 'ui-library-release-manifest.v1.json');
const consumerImpactPath = path.join(latestDir, 'ui-library-consumer-impact.v1.json');
const upgradeChecklistPath = path.join(latestDir, 'ui-library-upgrade-checklist.v1.json');
const upgradeRecipesPath = path.join(latestDir, 'ui-library-upgrade-recipes.v1.json');
const upgradeRecipesAuditPath = path.join(latestDir, 'ui-library-upgrade-recipes.audit.v1.json');
const codemodCandidatesPath = path.join(latestDir, 'ui-library-codemod-candidates.v1.json');
const codemodCandidatesAuditPath = path.join(latestDir, 'ui-library-codemod-candidates.audit.v1.json');
const codemodDryRunPath = path.join(latestDir, 'ui-library-codemod-dry-run.v1.json');
const codemodDryRunAuditPath = path.join(latestDir, 'ui-library-codemod-dry-run.audit.v1.json');
const codemodApplyPath = path.join(latestDir, 'ui-library-codemod-apply.v1.json');
const codemodApplyAuditPath = path.join(latestDir, 'ui-library-codemod-apply.audit.v1.json');
const codemodApplyPreviewPath = path.join(latestDir, 'ui-library-codemod-apply-preview.v1.json');
const codemodApplyPreviewAuditPath = path.join(latestDir, 'ui-library-codemod-apply-preview.audit.v1.json');
const codemodManualReviewPath = path.join(latestDir, 'ui-library-codemod-manual-review.v1.json');
const codemodManualReviewAuditPath = path.join(latestDir, 'ui-library-codemod-manual-review.audit.v1.json');
const codemodManualDecisionPath = path.join(latestDir, 'ui-library-codemod-manual-review-decisions.v1.json');
const codemodManualDecisionAuditPath = path.join(latestDir, 'ui-library-codemod-manual-review-decisions.audit.v1.json');
const codemodPrototypesPath = path.join(latestDir, 'ui-library-codemod-prototypes.v1.json');
const codemodPrototypesAuditPath = path.join(latestDir, 'ui-library-codemod-prototypes.audit.v1.json');
const releaseNotesArtifactPath = path.join(latestDir, 'ui-library-release-notes.v1.md');
const changelogArtifactPath = path.join(latestDir, 'ui-library-changelog.v1.md');
const i18nCoverageArtifactPath = path.join(latestDir, 'ui-library-locale-coverage.v1.json');
const i18nPseudoSmokeArtifactPath = path.join(latestDir, 'ui-library-pseudolocale-smoke.v1.json');
const i18nSurfaceArtifactPath = path.join(latestDir, 'ui-library-i18n-surface.v1.json');

const artifactPaths = [
  'packages/dist/design-system/remoteEntry.js',
  'dist/design-system/remoteEntry.js',
];
const storybookArtifactPath = 'storybook-static/index.html';

const toRepoRelative = (absolutePath) => path.relative(path.join(webRoot, '..'), absolutePath).replaceAll(path.sep, '/');
const loadJsonIfExists = async (absolutePath) => (existsSync(absolutePath) ? JSON.parse(await readFile(absolutePath, 'utf8')) : null);
const resolveJsonAuthorities = async (payload) => {
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    return payload;
  }
  const source = payload.source;
  if (!source || typeof source !== 'object') {
    return payload;
  }
  if (typeof source.generatedMetaAuthority === 'string' && source.generatedMetaAuthority.trim()) {
    const generatedMetaPath = path.join(webRoot, source.generatedMetaAuthority);
    if (existsSync(generatedMetaPath)) {
      const generatedMeta = JSON.parse(await readFile(generatedMetaPath, 'utf8'));
      for (const [key, value] of Object.entries(generatedMeta)) {
        if (key === 'source') {
          payload.source = { ...(value ?? {}), ...(payload.source ?? {}) };
        } else if (!(key in payload)) {
          payload[key] = value;
        }
      }
    }
  }
  if (typeof source.itemsAuthority === 'string' && source.itemsAuthority.trim() && !Array.isArray(payload.items)) {
    const itemsPath = path.join(webRoot, source.itemsAuthority);
    if (existsSync(itemsPath)) {
      const itemsPayload = JSON.parse(await readFile(itemsPath, 'utf8'));
      payload.items = Array.isArray(itemsPayload) ? itemsPayload : Array.isArray(itemsPayload?.items) ? itemsPayload.items : [];
    }
  }
  return payload;
};

const renderReleaseNotes = ({ packageName, packageVersion, previewRoute, migration, visualContract, upgradeRecipesAudit }) => {
  const semverGuidance = migration?.semverGuidance ?? {};
  const ownerResolution = migration?.ownerResolution ?? {};
  const checklist = migration?.upgradeChecklist ?? {};
  const recipes = migration?.upgradeRecipes ?? {};
  const codemods = migration?.codemodCandidates ?? {};
  const dryRun = codemods?.dryRun ?? {};
  const applyExecutor = codemods?.applyExecutor ?? {};
  const applyPreview = dryRun?.applyPreview ?? {};
  const manualReview = codemods?.manualReview ?? {};
  const manualReviewDecisions = manualReview?.decisions ?? {};
  const prototypes = codemods?.prototypes ?? {};
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
    `- Apply executor ready: \`${applyExecutor.latestAudit?.readyToApplyCandidateCount ?? applyExecutor.summary?.readyToApplyCandidateCount ?? 0}/${applyExecutor.latestAudit?.candidateCount ?? applyExecutor.summary?.focusCount ?? 0}\``,
    `- Manual review packets: \`${manualReview.latestAudit?.passCount ?? 0}/${manualReview.latestAudit?.candidateCount ?? manualReview.summary?.focusCount ?? 0}\``,
    `- Manual review approval queue: \`${manualReview.latestAudit?.pendingDecisionCount ?? manualReview.summary?.pendingDecisionCount ?? 0}\` pending`,
    `- Manual review decisions: \`${manualReviewDecisions.latestAudit?.approvedForApplyPreviewCount ?? manualReviewDecisions.summary?.approvedForApplyPreviewCount ?? 0}\` approved / \`${manualReviewDecisions.latestAudit?.deferredUntilVisualReviewCount ?? manualReviewDecisions.summary?.deferredUntilVisualReviewCount ?? 0}\` deferred / \`${manualReviewDecisions.latestAudit?.reviewOnlyManualRefactorCount ?? manualReviewDecisions.summary?.reviewOnlyManualRefactorCount ?? 0}\` review-only`,
    `- Active codemod wave: \`${dryRun.latestAudit?.passCount ?? 0}/${dryRun.latestAudit?.candidateCount ?? dryRun.summary?.activeCandidateCount ?? 0}\``,
    `- Apply preview exact-eligible: \`${applyPreview.latestAudit?.exactEligibleCandidateCount ?? applyPreview.summary?.exactEligibleCandidateCount ?? 0}/${applyPreview.latestAudit?.candidateCount ?? applyPreview.summary?.focusCount ?? 0}\``,
    `- Codemod prototypes: \`${prototypes.summary?.readyCount ?? 0}/${prototypes.summary?.prototypeCount ?? 0}\``,
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
    `- Codemod dry-run: \`${dryRun.artifactPath ?? toRepoRelative(codemodDryRunPath)}\``,
    `- Codemod dry-run audit: \`${dryRun.auditArtifactPath ?? toRepoRelative(codemodDryRunAuditPath)}\``,
    `- Codemod apply executor: \`${applyExecutor.artifactPath ?? toRepoRelative(codemodApplyPath)}\``,
    `- Codemod apply executor audit: \`${applyExecutor.auditArtifactPath ?? toRepoRelative(codemodApplyAuditPath)}\``,
    `- Codemod manual review: \`${manualReview.artifactPath ?? toRepoRelative(codemodManualReviewPath)}\``,
    `- Codemod manual review audit: \`${manualReview.auditArtifactPath ?? toRepoRelative(codemodManualReviewAuditPath)}\``,
    `- Codemod manual review decisions: \`${manualReviewDecisions.artifactPath ?? toRepoRelative(codemodManualDecisionPath)}\``,
    `- Codemod manual review decisions audit: \`${manualReviewDecisions.auditArtifactPath ?? toRepoRelative(codemodManualDecisionAuditPath)}\``,
    `- Codemod apply preview: \`${applyPreview.artifactPath ?? toRepoRelative(codemodApplyPreviewPath)}\``,
    `- Codemod apply preview audit: \`${applyPreview.auditArtifactPath ?? toRepoRelative(codemodApplyPreviewAuditPath)}\``,
    `- Codemod prototypes: \`${prototypes.artifactPath ?? toRepoRelative(codemodPrototypesPath)}\``,
    `- Codemod prototype audit: \`${prototypes.auditArtifactPath ?? toRepoRelative(codemodPrototypesAuditPath)}\``,
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
  const componentManifest = await resolveJsonAuthorities(JSON.parse(await readFile(componentManifestPath, 'utf8')));
  const designLabIndex = await resolveJsonAuthorities(JSON.parse(await readFile(designLabIndexPath, 'utf8')));
  const adoptionSummary = designLabIndex.adoption ?? componentManifest.adoption ?? null;
  const migration = designLabIndex.migration ?? componentManifest.migration ?? null;
  const visualContract = designLabIndex.visualRegression ?? componentManifest.visualRegression ?? null;
  const upgradeRecipesAudit = await loadJsonIfExists(upgradeRecipesAuditPath);
  const codemodCandidatesAudit = await loadJsonIfExists(codemodCandidatesAuditPath);
  const codemodDryRunAudit = await loadJsonIfExists(codemodDryRunAuditPath);
  const codemodApplyAudit = await loadJsonIfExists(codemodApplyAuditPath);
  const codemodApplyPreviewAudit = await loadJsonIfExists(codemodApplyPreviewAuditPath);
  const codemodManualReviewAudit = await loadJsonIfExists(codemodManualReviewAuditPath);
  const codemodManualDecisionAudit = await loadJsonIfExists(codemodManualDecisionAuditPath);
  const codemodPrototypesAudit = await loadJsonIfExists(codemodPrototypesAuditPath);
  const i18nCoverageArtifact = await loadJsonIfExists(i18nCoverageArtifactPath);
  const i18nPseudoSmokeArtifact = await loadJsonIfExists(i18nPseudoSmokeArtifactPath);
  const i18nSurfaceArtifact = await loadJsonIfExists(i18nSurfaceArtifactPath);
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
              dryRun: migration?.codemodCandidates?.dryRun
                ? {
                    ...migration.codemodCandidates.dryRun,
                    auditArtifactPath:
                      migration.codemodCandidates.dryRun.auditArtifactPath ??
                      'web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.audit.v1.json',
                    latestAudit: codemodDryRunAudit
                      ? {
                          generatedAt: codemodDryRunAudit.generatedAt ?? null,
                          candidateCount: Number(codemodDryRunAudit.candidateCount ?? 0),
                          passCount: Number(codemodDryRunAudit.passCount ?? 0),
                          failCount: Number(codemodDryRunAudit.failCount ?? 0),
                          proposalCount: Number(codemodDryRunAudit.proposalCount ?? 0),
                          alreadyNormalizedCount: Number(codemodDryRunAudit.alreadyNormalizedCount ?? 0),
                        }
                      : null,
                    applyPreview: migration?.codemodCandidates?.dryRun?.applyPreview
                      ? {
                          ...migration.codemodCandidates.dryRun.applyPreview,
                          auditArtifactPath:
                            migration.codemodCandidates.dryRun.applyPreview.auditArtifactPath ??
                            'web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.audit.v1.json',
                          latestAudit: codemodApplyPreviewAudit
                            ? {
                                generatedAt: codemodApplyPreviewAudit.generatedAt ?? null,
                                candidateCount: Number(codemodApplyPreviewAudit.candidateCount ?? 0),
                                passCount: Number(codemodApplyPreviewAudit.passCount ?? 0),
                                failCount: Number(codemodApplyPreviewAudit.failCount ?? 0),
                                exactEligibleCandidateCount: Number(codemodApplyPreviewAudit.exactEligibleCandidateCount ?? 0),
                                noopReadyCandidateCount: Number(codemodApplyPreviewAudit.noopReadyCandidateCount ?? 0),
                                appliedCount: Number(codemodApplyPreviewAudit.appliedCount ?? 0),
                              }
                            : null,
                        }
                      : null,
                  }
                : null,
              applyExecutor: migration?.codemodCandidates?.applyExecutor
                ? {
                    ...migration.codemodCandidates.applyExecutor,
                    auditArtifactPath:
                      migration.codemodCandidates.applyExecutor.auditArtifactPath ??
                      'web/test-results/releases/ui-library/latest/ui-library-codemod-apply.audit.v1.json',
                    latestAudit: codemodApplyAudit
                      ? {
                          generatedAt: codemodApplyAudit.generatedAt ?? null,
                          candidateCount: Number(codemodApplyAudit.candidateCount ?? 0),
                          passCount: Number(codemodApplyAudit.passCount ?? 0),
                          failCount: Number(codemodApplyAudit.failCount ?? 0),
                          readyToApplyCandidateCount: Number(codemodApplyAudit.readyToApplyCandidateCount ?? 0),
                          noopReadyCandidateCount: Number(codemodApplyAudit.noopReadyCandidateCount ?? 0),
                          appliedCount: Number(codemodApplyAudit.appliedCount ?? 0),
                        }
                      : null,
                  }
                : null,
              manualReview: migration?.codemodCandidates?.manualReview
                ? {
                    ...migration.codemodCandidates.manualReview,
                    approvalModel:
                      migration.codemodCandidates.manualReview.approvalModel ??
                      'single-owner-direct-approval',
                    decisionStateDefault:
                      migration.codemodCandidates.manualReview.decisionStateDefault ??
                      'owner_review_pending',
                    summary: {
                      ...(migration.codemodCandidates.manualReview.summary ?? {}),
                      readyForDecisionCount:
                        migration.codemodCandidates.manualReview.summary?.readyForDecisionCount ??
                        Number(codemodManualReviewAudit?.readyForDecisionCount ?? 0),
                      pendingDecisionCount:
                        migration.codemodCandidates.manualReview.summary?.pendingDecisionCount ??
                        Number(codemodManualReviewAudit?.pendingDecisionCount ?? 0),
                      singleOwnerApprovalCount:
                        migration.codemodCandidates.manualReview.summary?.singleOwnerApprovalCount ??
                        Number(codemodManualReviewAudit?.singleOwnerApprovalCount ?? 0),
                      generatedChecklistItemCount:
                        migration.codemodCandidates.manualReview.summary?.generatedChecklistItemCount ??
                        Number(codemodManualReviewAudit?.generatedChecklistItemCount ?? 0),
                    },
                    auditArtifactPath:
                      migration.codemodCandidates.manualReview.auditArtifactPath ??
                      'web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.audit.v1.json',
                    latestAudit: codemodManualReviewAudit
                      ? {
                          generatedAt: codemodManualReviewAudit.generatedAt ?? null,
                          candidateCount: Number(codemodManualReviewAudit.candidateCount ?? 0),
                          passCount: Number(codemodManualReviewAudit.passCount ?? 0),
                          failCount: Number(codemodManualReviewAudit.failCount ?? 0),
                          mediumRiskCount: Number(codemodManualReviewAudit.mediumRiskCount ?? 0),
                          highRiskCount: Number(codemodManualReviewAudit.highRiskCount ?? 0),
                          readyForDecisionCount: Number(codemodManualReviewAudit.readyForDecisionCount ?? 0),
                          pendingDecisionCount: Number(codemodManualReviewAudit.pendingDecisionCount ?? 0),
                          singleOwnerApprovalCount: Number(codemodManualReviewAudit.singleOwnerApprovalCount ?? 0),
                          generatedChecklistItemCount: Number(codemodManualReviewAudit.generatedChecklistItemCount ?? 0),
                        }
                      : null,
                    decisions: migration?.codemodCandidates?.manualReview?.decisions
                      ? {
                          ...migration.codemodCandidates.manualReview.decisions,
                          auditArtifactPath:
                            migration.codemodCandidates.manualReview.decisions.auditArtifactPath ??
                            'web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.audit.v1.json',
                          latestAudit: codemodManualDecisionAudit
                            ? {
                                generatedAt: codemodManualDecisionAudit.generatedAt ?? null,
                                candidateCount: Number(codemodManualDecisionAudit.candidateCount ?? 0),
                                passCount: Number(codemodManualDecisionAudit.passCount ?? 0),
                                failCount: Number(codemodManualDecisionAudit.failCount ?? 0),
                                approvedForApplyPreviewCount: Number(codemodManualDecisionAudit.approvedForApplyPreviewCount ?? 0),
                                deferredUntilVisualReviewCount: Number(codemodManualDecisionAudit.deferredUntilVisualReviewCount ?? 0),
                                reviewOnlyManualRefactorCount: Number(codemodManualDecisionAudit.reviewOnlyManualRefactorCount ?? 0),
                                rejectedForAutoApplyCount: Number(codemodManualDecisionAudit.rejectedForAutoApplyCount ?? 0),
                                pendingDecisionCount: Number(codemodManualDecisionAudit.pendingDecisionCount ?? 0),
                              }
                            : null,
                        }
                      : null,
                  }
                : null,
              prototypes: migration?.codemodCandidates?.prototypes
                ? {
                    ...migration.codemodCandidates.prototypes,
                    auditArtifactPath:
                      migration.codemodCandidates.prototypes.auditArtifactPath ??
                      'web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.audit.v1.json',
                    latestAudit: codemodPrototypesAudit
                      ? {
                          generatedAt: codemodPrototypesAudit.generatedAt ?? null,
                          prototypeCount: Number(codemodPrototypesAudit.prototypeCount ?? 0),
                          passCount: Number(codemodPrototypesAudit.passCount ?? 0),
                          failCount: Number(codemodPrototypesAudit.failCount ?? 0),
                        }
                      : null,
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
      packageJsonPath: 'web/packages/design-system/package.json',
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
    codemodDryRunArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.v1.json',
    codemodDryRunAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.audit.v1.json',
    codemodApplyArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-apply.v1.json',
    codemodApplyAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-apply.audit.v1.json',
    codemodManualReviewArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.v1.json',
    codemodManualReviewAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.audit.v1.json',
    codemodManualDecisionArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.v1.json',
    codemodManualDecisionAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.audit.v1.json',
    codemodApplyPreviewArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.v1.json',
    codemodApplyPreviewAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.audit.v1.json',
    codemodPrototypesArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.v1.json',
    codemodPrototypesAuditArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.audit.v1.json',
    i18nCoverageArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-locale-coverage.v1.json',
    i18nPseudoSmokeArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-pseudolocale-smoke.v1.json',
    i18nSurfaceArtifactPath: 'web/test-results/releases/ui-library/latest/ui-library-i18n-surface.v1.json',
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
    i18n: {
      coverage: i18nCoverageArtifact
        ? {
            artifactPath: 'web/test-results/releases/ui-library/latest/ui-library-locale-coverage.v1.json',
            overallStatus: i18nCoverageArtifact.overall_status ?? null,
            baselineLocale: i18nCoverageArtifact.baselineLocale ?? 'en',
            localeCount: Number(i18nCoverageArtifact.summary?.localeCount ?? 0),
            translatedLocaleCount: Number(i18nCoverageArtifact.summary?.translatedLocaleCount ?? 0),
            namespaceCount: Number(i18nCoverageArtifact.summary?.namespaceCount ?? 0),
            fullEffectiveCoverageLocales: Array.isArray(i18nCoverageArtifact.summary?.fullEffectiveCoverageLocales)
              ? i18nCoverageArtifact.summary.fullEffectiveCoverageLocales
              : [],
            highestTranslatedLocale: i18nCoverageArtifact.summary?.highestTranslatedLocale ?? null,
            highestTranslatedCoveragePercent: Number(i18nCoverageArtifact.summary?.highestTranslatedCoveragePercent ?? 0),
            lowestTranslatedLocale: i18nCoverageArtifact.summary?.lowestTranslatedLocale ?? null,
            lowestTranslatedCoveragePercent: Number(i18nCoverageArtifact.summary?.lowestTranslatedCoveragePercent ?? 0),
            backlog: {
              topLocaleTranslationGaps: Array.isArray(i18nCoverageArtifact.backlog?.topLocaleTranslationGaps)
                ? i18nCoverageArtifact.backlog.topLocaleTranslationGaps
                : [],
              topNamespaceTranslationGaps: Array.isArray(i18nCoverageArtifact.backlog?.topNamespaceTranslationGaps)
                ? i18nCoverageArtifact.backlog.topNamespaceTranslationGaps
                : [],
              priorityTranslationBacklog: Array.isArray(i18nCoverageArtifact.backlog?.priorityTranslationBacklog)
                ? i18nCoverageArtifact.backlog.priorityTranslationBacklog
                : [],
            },
          }
        : null,
      pseudoSmoke: i18nPseudoSmokeArtifact
        ? {
            artifactPath: 'web/test-results/releases/ui-library/latest/ui-library-pseudolocale-smoke.v1.json',
            overallStatus: i18nPseudoSmokeArtifact.overall_status ?? null,
            baselineLocale: i18nPseudoSmokeArtifact.baselineLocale ?? 'en',
            pseudoLocale: i18nPseudoSmokeArtifact.pseudoLocale ?? 'pseudo',
            namespaceCount: Number(i18nPseudoSmokeArtifact.summary?.namespaceCount ?? 0),
            totalEligibleStringCount: Number(i18nPseudoSmokeArtifact.summary?.totalEligibleStringCount ?? 0),
            changedEligibleStringCount: Number(i18nPseudoSmokeArtifact.summary?.changedEligibleStringCount ?? 0),
            unchangedEligibleStringCount: Number(i18nPseudoSmokeArtifact.summary?.unchangedEligibleStringCount ?? 0),
            pseudolocalizedPercent: Number(i18nPseudoSmokeArtifact.summary?.pseudolocalizedPercent ?? 0),
          }
        : null,
      surfaceGuard: i18nSurfaceArtifact
        ? {
            artifactPath: 'web/test-results/releases/ui-library/latest/ui-library-i18n-surface.v1.json',
            overallStatus: i18nSurfaceArtifact.overall_status ?? null,
            blockingFileCount: Number(i18nSurfaceArtifact.summary?.blockingFileCount ?? 0),
            reportOnlyFileCount: Number(i18nSurfaceArtifact.summary?.reportOnlyFileCount ?? 0),
            totalScannedFiles: Number(i18nSurfaceArtifact.summary?.totalScannedFiles ?? 0),
            blockingFindingCount: Number(i18nSurfaceArtifact.summary?.blockingFindingCount ?? 0),
            reportOnlyFindingCount: Number(i18nSurfaceArtifact.summary?.reportOnlyFindingCount ?? 0),
          }
        : null,
    },
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
    codemodPrototypesPath,
    JSON.stringify(
      {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        packageName: packageJson.name,
        packageVersion: packageJson.version,
        previewRoute,
        codemodPrototypes: migrationWithArtifacts?.codemodCandidates?.prototypes ?? null,
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
