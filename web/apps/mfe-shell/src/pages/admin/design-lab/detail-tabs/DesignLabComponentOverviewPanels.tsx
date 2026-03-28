import React from 'react';
import { Badge, Text, ThemePresetCompare, ThemePresetGallery } from '@mfe/design-system';
import legacyReplacementMatrixRaw from '../../design-lab.legacy-replacement-matrix.v1.json';
import benchmarkParityMatrixRaw from '../../design-lab.benchmark-parity-matrix.v1.json';
type DesignLabIndexItem = {
  name: string;
  description: string;
  availability: string;
  lifecycle: string;
  demoMode: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
  tags?: string[];
};

type ReleaseFamilyContext = {
  familyLabel: string;
  subgroupLabel: string;
  waveLabel: string;
  familyTouched: boolean;
  note: string;
} | null;
type DesignLabRecipeFamily = {
  recipeId: string;
  intent: string;
  ownerBlocks: string[];
};

type DesignLabOverviewPanelId = 'release' | 'adoption' | 'migration' | 'visual' | 'theme' | 'recipes';

type LegacyReplacementStatus = 'replaceable' | 'adapter' | 'missing' | 'quarantine';

type LegacyReplacementMatrixItem = {
  legacyId: string;
  scope: string;
  legacySurface: string;
  status: LegacyReplacementStatus;
  canonicalLayer: 'foundations' | 'components' | 'recipes' | 'pages';
  canonicalTarget: string;
  migrationAction: string;
  currentPain: string;
  nextAction: string;
  evidenceRefs: string[];
};

type LegacyReplacementMatrix = {
  artifactVersion: string;
  generatedAt: string;
  artifactPath: string;
  summary: {
    totalItems: number;
    replaceable: number;
    adapter: number;
    missing: number;
    quarantine: number;
    note: string;
  };
  policy: string[];
  topPriority: string[];
  items: LegacyReplacementMatrixItem[];
};

type BenchmarkParityStatus = 'aligned' | 'partial' | 'misplaced' | 'missing';

type BenchmarkParityMatrixItem = {
  capabilityId: string;
  capability: string;
  canonicalLayer: 'foundations' | 'components' | 'recipes' | 'pages' | 'ecosystem' | 'platform_contracts';
  canonicalSurface: string;
  currentSurface: string;
  status: BenchmarkParityStatus;
  priority: 'P0' | 'P1' | 'P2';
  currentScore: number;
  antDesignReference: string;
  muiReference: string;
  whyItMatters: string;
  nextAction: string;
  evidenceRefs: string[];
};

type BenchmarkParityMatrix = {
  artifactVersion: string;
  generatedAt: string;
  artifactPath: string;
  benchmarkSources: Array<{
    id: string;
    label: string;
    url: string;
    scope: string;
  }>;
  targetModel: {
    topLevelLayers: string[];
    crossCuttingLanes: string[];
    note: string;
  };
  summary: {
    overallParityPercent: number;
    totalCapabilities: number;
    aligned: number;
    partial: number;
    misplaced: number;
    missing: number;
    note: string;
  };
  topPriority: string[];
  items: BenchmarkParityMatrixItem[];
};

type DesignLabComponentOverviewPanelsProps = {
  activePanelId: DesignLabOverviewPanelId;
  item: DesignLabIndexItem;
  releaseSummary: any;
  releaseFamilyContext: ReleaseFamilyContext;
  adoptionSummary: any;
  migrationSummary: any;
  visualRegressionSummary: any;
  themePresetSummary: any;
  themePresetGalleryItems: any[];
  defaultThemePreset: any;
  contrastThemePreset: any;
  compactThemePreset: any;
  recipeSummary: any;
  relatedRecipes: DesignLabRecipeFamily[];
  renderRecipeComponentPreview: (recipeId: string) => React.ReactNode;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
  ShowcaseCardComponent: React.ComponentType<any>;
  CodeBlockComponent: React.ComponentType<any>;
};

const legacyReplacementMatrix = legacyReplacementMatrixRaw as LegacyReplacementMatrix;
const benchmarkParityMatrix = benchmarkParityMatrixRaw as BenchmarkParityMatrix;
const legacyReplacementItemById = new Map(
  legacyReplacementMatrix.items.map((entry) => [entry.legacyId, entry] as const),
);
const benchmarkParityItemById = new Map(
  benchmarkParityMatrix.items.map((entry) => [entry.capabilityId, entry] as const),
);
const legacyReplacementStatusMeta: Record<LegacyReplacementStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' }> = {
  replaceable: { label: 'Replaceable', tone: 'success' },
  adapter: { label: 'Adapter', tone: 'info' },
  missing: { label: 'Missing', tone: 'warning' },
  quarantine: { label: 'Quarantine', tone: 'danger' },
};
const benchmarkParityStatusMeta: Record<BenchmarkParityStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' }> = {
  aligned: { label: 'Aligned', tone: 'success' },
  partial: { label: 'Partial', tone: 'info' },
  misplaced: { label: 'Misplaced', tone: 'warning' },
  missing: { label: 'Missing', tone: 'danger' },
};
export const DesignLabComponentOverviewPanels: React.FC<DesignLabComponentOverviewPanelsProps> = ({
  activePanelId,
  item,
  releaseSummary,
  releaseFamilyContext,
  adoptionSummary,
  migrationSummary,
  visualRegressionSummary,
  themePresetSummary,
  themePresetGalleryItems,
  defaultThemePreset,
  contrastThemePreset,
  compactThemePreset,
  recipeSummary,
  relatedRecipes,
  renderRecipeComponentPreview,
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
  ShowcaseCardComponent,
  CodeBlockComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const LibraryMetricCard = MetricCardComponent;
  const LibraryShowcaseCard = ShowcaseCardComponent;
  const LibraryCodeBlock = CodeBlockComponent;
  const legacyReplacementPriorityItems = legacyReplacementMatrix.topPriority
    .map((legacyId) => legacyReplacementItemById.get(legacyId) ?? null)
    .filter((entry): entry is LegacyReplacementMatrixItem => Boolean(entry));
  const benchmarkParityPriorityItems = benchmarkParityMatrix.topPriority
    .map((capabilityId) => benchmarkParityItemById.get(capabilityId) ?? null)
    .filter((entry): entry is BenchmarkParityMatrixItem => Boolean(entry));
  return (
    <>
      {activePanelId === 'release' && releaseSummary ? (
        <LibraryShowcaseCard
          eyebrow="Release"
          title={`${releaseSummary.packageName}@${releaseSummary.packageVersion}`}
          description="Kutuphanenin surum, changelog ve dagitim kaniti ayni docs sayfasindan gorunur. Bu blok yayin mantigini component detayiyle ayni baglamda tutar."
          badges={[
            <SectionBadge key="scheme" label={releaseSummary.versionScheme.toUpperCase()} />,
            <SectionBadge key="release-version" label={`Release ${releaseSummary.latestRelease.version || releaseSummary.packageVersion}`} />,
            <SectionBadge key="release-date" label={releaseSummary.latestRelease.date || 'Tarih yok'} />,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Lifecycle Changes</DetailLabel>
                <Text variant="secondary" className="mt-2 block text-sm leading-7">
                  {releaseSummary.latestRelease.lifecycleChanges || 'Henuz lifecycle notu yok.'}
                </Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Migration Notes</DetailLabel>
                <Text variant="secondary" className="mt-2 block text-sm leading-7">
                  {releaseSummary.latestRelease.migrationNotes || 'Migration notu yok.'}
                </Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Changed Components</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {releaseSummary.latestRelease.changedComponents.length ? (
                    releaseSummary.latestRelease.changedComponents.map((component: string) => (
                      <SectionBadge key={component} label={component} />
                    ))
                  ) : (
                    <Text variant="secondary">Bilesen kaydi yok</Text>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Breaking Changes</DetailLabel>
                <Text
                  variant="secondary"
                  className={`mt-2 block text-sm leading-7 ${releaseSummary.latestRelease.breakingChanges === 'none' ? 'text-state-success-text' : ''}`}
                >
                  {releaseSummary.latestRelease.breakingChanges || 'none'}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Distribution Targets</DetailLabel>
                <div className="flex flex-col mt-3 gap-3">
                  {releaseSummary.distributionTargets.map((target: any) => {
                    const fullyReady = target.artifactCount === 0 || target.artifactPresentCount === target.artifactCount;
                    return (
                      <div key={target.targetId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="font-semibold text-text-primary">
                            {target.targetId}
                          </Text>
                          <Badge variant={fullyReady ? 'success' : 'warning'}>
                            {target.artifactPresentCount}/{target.artifactCount || 0}
                          </Badge>
                        </div>
                        <Text variant="secondary" className="mt-1 block text-xs leading-5">
                          {target.channel}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Stable Release Requires</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {releaseSummary.stableReleaseRequires.map((entry: string) => (
                    <SectionBadge key={entry} label={entry} />
                  ))}
                </div>
              </div>

              {releaseFamilyContext ? (
                <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Current Family Context</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={releaseFamilyContext.familyLabel} />
                    <SectionBadge label={releaseFamilyContext.subgroupLabel} />
                    <SectionBadge label={releaseFamilyContext.waveLabel} />
                    <Badge variant={releaseFamilyContext.familyTouched ? 'success' : 'info'}>
                      {releaseFamilyContext.familyTouched ? 'Release-touchpoint var' : 'Dogrudan release-touchpoint yok'}
                    </Badge>
                  </div>
                  <Text variant="secondary" className="mt-3 block text-sm leading-6">
                    {releaseFamilyContext.note}
                  </Text>
                </div>
              ) : null}
            </div>
          </div>
        </LibraryShowcaseCard>
      ) : null}

      {activePanelId === 'adoption' && adoptionSummary ? (
        <LibraryShowcaseCard
          eyebrow="Adoption Cockpit"
          title="Consumer-ready surface"
          description="Public export yuzeyi, API coverage ve yaygin tuketim readiness ayni blokta gorunur. Hedef, kutuphaneyi yeni ekranlarin varsayilan tuketim katmani haline getirmek."
          badges={[
            <SectionBadge key="adoption-contract" label={adoptionSummary.contractId} />,
            <SectionBadge key="api-coverage" label={`API ${adoptionSummary.apiCoverage.coveragePercent}%`} />,
            <SectionBadge key="ready-surface" label={`${adoptionSummary.releaseReadiness.wideAdoptionReady} ready`} />,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <LibraryMetricCard
                  label="Public surface"
                  value={adoptionSummary.surfaceSummary.publicExports}
                  note={`${adoptionSummary.surfaceSummary.stableExports} stable / ${adoptionSummary.surfaceSummary.betaExports} beta`}
                />
                <LibraryMetricCard
                  label="API coverage"
                  value={`${adoptionSummary.apiCoverage.coveragePercent}%`}
                  note={`${adoptionSummary.apiCoverage.documentedExports} documented / ${adoptionSummary.apiCoverage.undocumentedExports} backlog`}
                />
                <LibraryMetricCard
                  label="Wide adoption ready"
                  value={adoptionSummary.releaseReadiness.wideAdoptionReady}
                  note="Stable + API docs birlikte hazir olan surface"
                />
                <LibraryMetricCard
                  label="Used by apps"
                  value={adoptionSummary.surfaceSummary.consumedByAppsExports}
                  note={`${adoptionSummary.surfaceSummary.liveDemoExports} export canli demo ile gosteriliyor`}
                />
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Consumer rules</DetailLabel>
                <div className="flex flex-col mt-3 gap-2">
                  {adoptionSummary.consumerRules.map((rule: string) => (
                    <Text key={rule} variant="secondary" className="block text-sm leading-6">
                      {rule}
                    </Text>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Used but undocumented</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {adoptionSummary.priorityBacklog.usedUndocumented.length ? (
                      adoptionSummary.priorityBacklog.usedUndocumented.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Backlog temiz</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Stable but undocumented</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {adoptionSummary.priorityBacklog.stableUndocumented.length ? (
                      adoptionSummary.priorityBacklog.stableUndocumented.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Stable surface temiz</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Private surface guard</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={adoptionSummary.internalSurfaceProtection.status === 'protected' ? 'success' : 'warning'}>
                      {adoptionSummary.internalSurfaceProtection.status === 'protected' ? 'Protected' : 'Drifted'}
                    </Badge>
                    <SectionBadge label={`${adoptionSummary.internalSurfaceProtection.allowedConsumers.length} consumer`} />
                    <SectionBadge label={`${adoptionSummary.internalSurfaceProtection.runtimeExportsWithoutRegistry} drift`} />
                  </div>
                  <Text variant="secondary" className="mt-3 block text-sm leading-6">
                    Internal barrel yalniz docs/admin yuzeyi icin tutulur; public package export zincirine geri sizmasi gate ile engellenir.
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Package import</DetailLabel>
                <LibraryCodeBlock code={adoptionSummary.packageImport} className="mt-3" />
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Module Federation contract</DetailLabel>
                <LibraryCodeBlock
                  code={[
                    `remote: '${adoptionSummary.moduleFederation.remoteName}'`,
                    `previewRoute: '${adoptionSummary.previewRoute}'`,
                    `exposes: ${JSON.stringify(adoptionSummary.moduleFederation.exposes)}`,
                  ].join('\n')}
                  languageLabel="contract"
                  className="mt-3"
                />
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Evidence refs</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {adoptionSummary.evidenceRefs.map((entry: string) => (
                    <SectionBadge key={entry} label={entry} />
                  ))}
                </div>
                <Text variant="secondary" className="mt-3 block text-sm leading-6">
                  Bu cockpit, manifest, public surface ve adoption enforcement kontratini ayni baglamda tutar.
                </Text>
              </div>
            </div>
          </div>
        </LibraryShowcaseCard>
      ) : null}

      {activePanelId === 'migration' && migrationSummary ? (
        <LibraryShowcaseCard
          eyebrow="Migration"
          title="Consumer impact ve rollout readiness"
          description="Package veya remote surface degistiginde hangi uygulamalar etkilenecek, hangi stable componentler hala yalniz Design Lab icinde ve hangi adopted surface'in story coverage eksigi var; bu kart o etkiyi ayni yerde toplar."
          badges={[
            <SectionBadge key="migration-contract" label={migrationSummary.contractId} />,
            <SectionBadge key="migration-apps" label={`${migrationSummary.summary.consumerAppsCount} consumer app`} />,
            <SectionBadge key="migration-coverage" label={`Story ${migrationSummary.summary.adoptedStoryCoveragePercent}%`} />,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <LibraryMetricCard
                  label="Adopted outside lab"
                  value={migrationSummary.summary.adoptedOutsideLabComponents}
                  note={`${migrationSummary.summary.stableAdoptedComponents} stable / ${migrationSummary.summary.betaAdoptedComponents} beta`}
                />
                <LibraryMetricCard
                  label="Consumer apps"
                  value={migrationSummary.summary.consumerAppsCount}
                  note="Public surface'i kullanan farkli uygulamalar"
                />
                <LibraryMetricCard
                  label="Adopted story coverage"
                  value={`${migrationSummary.summary.adoptedStoryCoveragePercent}%`}
                  note={`${migrationSummary.summary.adoptedStoryCoveredComponents} adopted component story ile gorunur`}
                />
                <LibraryMetricCard
                  label="Stable only in lab"
                  value={migrationSummary.summary.stableOnlyInDesignLab}
                  note="Genis rollout oncesi adoption backlog adayi"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <LibraryMetricCard
                  label="Single-app blast radius"
                  value={migrationSummary.summary.singleAppBlastRadiusCount}
                  note="Yalniz bir consumer app'e dokunan public surface"
                />
                <LibraryMetricCard
                  label="Cross-app review"
                  value={migrationSummary.summary.crossAppReviewComponents}
                  note="Birden fazla app'i etkileyen release review surface"
                />
                <LibraryMetricCard
                  label="Manual migration"
                  value={migrationSummary.summary.manualReviewRequiredComponents}
                  note={`${migrationSummary.summary.codemodReadyComponents} codemod-ready / geri kalani checklist ile ilerler`}
                />
                <LibraryMetricCard
                  label="Owner mapped apps"
                  value={`${migrationSummary.summary.ownerMappedAppsCount}/${migrationSummary.summary.consumerAppsCount}`}
                  note="Consumer app owner resolution tamamlanan uygulamalar"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Beta used outside lab</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {migrationSummary.priorityBacklog.betaUsedOutsideLab.length ? (
                      migrationSummary.priorityBacklog.betaUsedOutsideLab.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Backlog temiz</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Adopted without story</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {migrationSummary.priorityBacklog.adoptedWithoutStory.length ? (
                      migrationSummary.priorityBacklog.adoptedWithoutStory.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Story coverage hizali</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Stable only in lab</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {migrationSummary.priorityBacklog.stableOnlyInDesignLab.length ? (
                      migrationSummary.priorityBacklog.stableOnlyInDesignLab.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Adoption dengeli</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Single-app blast radius</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {migrationSummary.priorityBacklog.singleAppBlastRadius.length ? (
                      migrationSummary.priorityBacklog.singleAppBlastRadius.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="info">Yogun tekil risk yok</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Legacy replacement matrix</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="success">replaceable {legacyReplacementMatrix.summary.replaceable}</Badge>
                  <Badge variant="info">adapter {legacyReplacementMatrix.summary.adapter}</Badge>
                  <Badge variant="warning">missing {legacyReplacementMatrix.summary.missing}</Badge>
                  <Badge variant="danger">quarantine {legacyReplacementMatrix.summary.quarantine}</Badge>
                  <SectionBadge label={`total ${legacyReplacementMatrix.summary.totalItems}`} />
                </div>
                <Text variant="secondary" className="mt-3 block text-sm leading-6">
                  {legacyReplacementMatrix.summary.note}
                </Text>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {legacyReplacementPriorityItems.map((entry) => {
                    const statusMeta = legacyReplacementStatusMeta[entry.status];
                    return (
                      <div
                        key={entry.legacyId}
                        data-testid={`legacy-replacement-${entry.legacyId}`}
                        className="rounded-2xl border border-border-subtle bg-surface-panel p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {entry.legacySurface}
                          </Text>
                          <Badge variant={statusMeta.tone}>{statusMeta.label}</Badge>
                        </div>
                        <Text variant="secondary" className="mt-2 block text-sm leading-6">
                          {entry.currentPain}
                        </Text>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <SectionBadge label={`layer ${entry.canonicalLayer}`} />
                          <SectionBadge label={entry.canonicalTarget} />
                          <SectionBadge label={entry.migrationAction} />
                        </div>
                        <Text variant="secondary" className="mt-3 block text-xs leading-5">
                          Next: {entry.nextAction}
                        </Text>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-3">
                  <DetailLabel>Policy</DetailLabel>
                  <div className="flex flex-col mt-3 gap-2">
                    {legacyReplacementMatrix.policy.map((rule) => (
                      <Text key={rule} variant="secondary" className="block text-sm leading-6">
                        {rule}
                      </Text>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-3">
                  <DetailLabel>Artifact</DetailLabel>
                  <LibraryCodeBlock
                    code={[
                      `artifact: '${legacyReplacementMatrix.artifactPath}'`,
                      `generatedAt: '${legacyReplacementMatrix.generatedAt}'`,
                      `topPriority: ${JSON.stringify(legacyReplacementMatrix.topPriority)}`,
                    ].join('\n')}
                    languageLabel="matrix"
                    className="mt-3"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>AntD / MUI parity matrix</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="success">aligned {benchmarkParityMatrix.summary.aligned}</Badge>
                  <Badge variant="info">partial {benchmarkParityMatrix.summary.partial}</Badge>
                  <Badge variant="warning">misplaced {benchmarkParityMatrix.summary.misplaced}</Badge>
                  <Badge variant="danger">missing {benchmarkParityMatrix.summary.missing}</Badge>
                  <SectionBadge label={`overall ${benchmarkParityMatrix.summary.overallParityPercent}%`} />
                  <SectionBadge label={`total ${benchmarkParityMatrix.summary.totalCapabilities}`} />
                </div>
                <Text variant="secondary" className="mt-3 block text-sm leading-6">
                  {benchmarkParityMatrix.summary.note}
                </Text>

                <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-3">
                  <DetailLabel>Target model</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {benchmarkParityMatrix.targetModel.topLevelLayers.map((layer) => (
                      <SectionBadge key={`target-layer-${layer}`} label={layer} />
                    ))}
                    {benchmarkParityMatrix.targetModel.crossCuttingLanes.map((lane) => (
                      <SectionBadge key={`target-lane-${lane}`} label={lane} />
                    ))}
                  </div>
                  <Text variant="secondary" className="mt-3 block text-sm leading-6">
                    {benchmarkParityMatrix.targetModel.note}
                  </Text>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {benchmarkParityPriorityItems.map((entry) => {
                    const statusMeta = benchmarkParityStatusMeta[entry.status];
                    return (
                      <div
                        key={entry.capabilityId}
                        data-testid={`benchmark-parity-${entry.capabilityId}`}
                        className="rounded-2xl border border-border-subtle bg-surface-panel p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {entry.capability}
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={statusMeta.tone}>{statusMeta.label}</Badge>
                            <SectionBadge label={entry.priority} />
                            <SectionBadge label={`${entry.currentScore}%`} />
                          </div>
                        </div>
                        <Text variant="secondary" className="mt-2 block text-sm leading-6">
                          {entry.currentSurface}
                        </Text>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <SectionBadge label={`layer ${entry.canonicalLayer}`} />
                          <SectionBadge label={entry.canonicalSurface} />
                        </div>
                        <Text variant="secondary" className="mt-3 block text-xs leading-5">
                          Benchmark: {entry.antDesignReference} / {entry.muiReference}
                        </Text>
                        <Text variant="secondary" className="mt-2 block text-xs leading-5">
                          Next: {entry.nextAction}
                        </Text>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-3">
                  <DetailLabel>Artifact</DetailLabel>
                  <LibraryCodeBlock
                    code={[
                      `artifact: '${benchmarkParityMatrix.artifactPath}'`,
                      `generatedAt: '${benchmarkParityMatrix.generatedAt}'`,
                      `topPriority: ${JSON.stringify(benchmarkParityMatrix.topPriority)}`,
                    ].join('\n')}
                    languageLabel="benchmark"
                    className="mt-3"
                  />
                </div>
              </div>

              {migrationSummary.changeClasses ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Change classes</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={`patch-safe ${migrationSummary.changeClasses.summary.patchSafeLabOnly}`} />
                    <SectionBadge label={`single-app ${migrationSummary.changeClasses.summary.minorSingleAppReview}`} />
                    <SectionBadge label={`beta-review ${migrationSummary.changeClasses.summary.minorBetaExternalReview}`} />
                    <SectionBadge label={`cross-app ${migrationSummary.changeClasses.summary.majorCrossAppReview}`} />
                    <SectionBadge label={`manual ${migrationSummary.changeClasses.summary.manualReviewRequired}`} />
                  </div>
                  <div className="flex flex-col mt-4 gap-2">
                    {migrationSummary.changeClasses.components.slice(0, 6).map((entry: any) => (
                      <div key={`${entry.name}-${entry.classId}`} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {entry.name}
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            <SectionBadge label={entry.classId} />
                            <SectionBadge label={`semver ${entry.semver}`} />
                            <SectionBadge label={entry.migrationTrack} />
                            {entry.ownerHandles?.length ? <SectionBadge label={entry.ownerHandles.join(', ')} /> : null}
                          </div>
                        </div>
                        <Text variant="secondary" className="mt-2 block text-sm leading-6">
                          {entry.consumerAppCount
                            ? `${entry.consumerAppCount} app etkisi: ${entry.consumerApps.join(', ')}`
                            : 'Henuz Design Lab disina cikmadi; patch-safe adoption adayi.'}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {migrationSummary.semverGuidance ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Semver guidance</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={`recommended ${migrationSummary.semverGuidance.recommendedBump}`} />
                    <SectionBadge label={migrationSummary.semverGuidance.releaseNotesLabel} />
                    <SectionBadge label={`cross-app ${migrationSummary.semverGuidance.summary.majorCrossAppReview}`} />
                    <SectionBadge label={`single-app ${migrationSummary.semverGuidance.summary.minorSingleAppReview}`} />
                  </div>
                  <Text variant="secondary" className="mt-3 block text-sm leading-6">
                    {migrationSummary.semverGuidance.reason}
                  </Text>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                      <DetailLabel>Major review queue</DetailLabel>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {migrationSummary.semverGuidance.majorComponents.length ? (
                          migrationSummary.semverGuidance.majorComponents.map((name: string) => (
                            <SectionBadge key={`major-${name}`} label={name} />
                          ))
                        ) : (
                          <Badge variant="success">Bos</Badge>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                      <DetailLabel>Minor review queue</DetailLabel>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {migrationSummary.semverGuidance.minorComponents.length ? (
                          migrationSummary.semverGuidance.minorComponents.map((name: string) => (
                            <SectionBadge key={`minor-${name}`} label={name} />
                          ))
                        ) : (
                          <Badge variant="success">Bos</Badge>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                      <DetailLabel>Patch-safe lab backlog</DetailLabel>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {migrationSummary.semverGuidance.patchCandidates.length ? (
                          migrationSummary.semverGuidance.patchCandidates.map((name: string) => (
                            <SectionBadge key={`patch-${name}`} label={name} />
                          ))
                        ) : (
                          <Badge variant="info">Backlog yok</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              {migrationSummary.upgradePlaybook ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Upgrade playbook</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={migrationSummary.upgradePlaybook.contractId} />
                    <SectionBadge label={`strategy ${migrationSummary.upgradePlaybook.defaultStrategy}`} />
                    <SectionBadge label={`codemod ${migrationSummary.upgradePlaybook.codemodSupport}`} />
                    <SectionBadge label={`${migrationSummary.upgradePlaybook.summary.trackCount} track`} />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {migrationSummary.upgradePlaybook.tracks.map((track: any) => (
                      <div key={track.track_id} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {track.label}
                          </Text>
                          <SectionBadge label={track.automation} />
                        </div>
                        <Text variant="secondary" className="mt-2 block text-sm leading-6">
                          Trigger: {track.trigger}
                        </Text>
                      </div>
                    ))}
                  </div>
                  <LibraryCodeBlock
                    code={[
                      `contract: '${migrationSummary.upgradePlaybook.contractPath}'`,
                      `singleAppBlastRadius: ${migrationSummary.upgradePlaybook.summary.singleAppBlastRadiusCount}`,
                      `crossAppReview: ${migrationSummary.upgradePlaybook.summary.crossAppReviewComponents}`,
                      `manualChecklist: ${migrationSummary.upgradePlaybook.summary.manualChecklistComponents}`,
                      `codemodReady: ${migrationSummary.upgradePlaybook.summary.codemodReadyComponents}`,
                    ].join('\n')}
                    languageLabel="migration"
                    className="mt-4"
                  />
                </div>
              ) : null}

              {migrationSummary.upgradeChecklist ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Upgrade checklist</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={`items ${migrationSummary.upgradeChecklist.summary.totalItems}`} />
                    <SectionBadge label={`single-app ${migrationSummary.upgradeChecklist.summary.singleAppItems}`} />
                    <SectionBadge label={`cross-app ${migrationSummary.upgradeChecklist.summary.crossAppItems}`} />
                    <SectionBadge label={`owners ${migrationSummary.upgradeChecklist.summary.ownerMappedAppsCount}`} />
                  </div>
                  <div className="flex flex-col mt-4 gap-3">
                    {migrationSummary.upgradeChecklist.items.slice(0, 4).map((entry: any) => (
                      <div key={entry.checklistId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {entry.component}
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            <SectionBadge label={entry.classId} />
                            <SectionBadge label={`semver ${entry.semver}`} />
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.ownerHandles.length ? (
                            entry.ownerHandles.map((owner: string) => (
                              <SectionBadge key={`${entry.checklistId}-${owner}`} label={owner} />
                            ))
                          ) : (
                            <Badge variant="warning">Owner eksik</Badge>
                          )}
                        </div>
                        <div className="flex flex-col mt-3 gap-2">
                          {entry.tasks.map((task: string) => (
                            <Text key={`${entry.checklistId}-${task}`} variant="secondary" className="block text-sm leading-6">
                              {task}
                            </Text>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <LibraryCodeBlock
                    code={[
                      `artifact: '${migrationSummary.upgradeChecklist.artifactPath}'`,
                      `strategy: '${migrationSummary.upgradeChecklist.generatedStrategy}'`,
                      `totalItems: ${migrationSummary.upgradeChecklist.summary.totalItems}`,
                    ].join('\n')}
                    languageLabel="checklist"
                    className="mt-4"
                  />
                </div>
              ) : null}

              {migrationSummary.upgradeRecipes ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Upgrade recipes</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={`recipes ${migrationSummary.upgradeRecipes.summary.totalRecipes}`} />
                    <SectionBadge label={`candidates ${migrationSummary.upgradeRecipes.summary.codemodCandidateCount}`} />
                    <SectionBadge label={`dry-run ${migrationSummary.upgradeRecipes.summary.dryRunReadyCandidates}`} />
                    <SectionBadge label={migrationSummary.upgradeRecipes.candidateMode} />
                  </div>
                  <div className="flex flex-col mt-4 gap-3">
                    {migrationSummary.upgradeRecipes.items.slice(0, 4).map((entry: any) => (
                      <div key={entry.recipeId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {entry.component}
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            <SectionBadge label={entry.consumerApp} />
                            <SectionBadge label={entry.automation.strategyId} />
                            <SectionBadge label={`confidence ${entry.automation.confidence}`} />
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.ownerHandles.map((owner: string) => (
                            <SectionBadge key={`${entry.recipeId}-${owner}`} label={owner} />
                          ))}
                          {entry.apiFocusProps.map((prop: string) => (
                            <SectionBadge key={`${entry.recipeId}-${prop}`} label={prop} />
                          ))}
                        </div>
                        <div className="flex flex-col mt-3 gap-2">
                          {entry.steps.slice(0, 2).map((step: string) => (
                            <Text key={`${entry.recipeId}-${step}`} variant="secondary" className="block text-sm leading-6">
                              {step}
                            </Text>
                          ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.targetFiles.slice(0, 2).map((target: string) => (
                            <SectionBadge key={`${entry.recipeId}-${target}`} label={target} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <LibraryCodeBlock
                    code={[
                      `artifact: '${migrationSummary.upgradeRecipes.artifactPath}'`,
                      `auditArtifact: '${migrationSummary.upgradeRecipes.auditArtifactPath}'`,
                      `auditScript: '${migrationSummary.upgradeRecipes.auditScript}'`,
                      `contract: '${migrationSummary.upgradeRecipes.contractPath}'`,
                    ].join('\n')}
                    languageLabel="recipes"
                    className="mt-4"
                  />
                </div>
              ) : null}

              {migrationSummary.codemodCandidates ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Codemod candidates</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={`candidates ${migrationSummary.codemodCandidates.summary.totalCandidates}`} />
                    <SectionBadge label={`dry-run ${migrationSummary.codemodCandidates.summary.dryRunReadyCandidates}`} />
                    <SectionBadge label={`apply ${migrationSummary.codemodCandidates.summary.applyExecutorReadyCandidates}`} />
                    <SectionBadge label={`manual-review ${migrationSummary.codemodCandidates.summary.manualReviewFirstCandidates}`} />
                    <SectionBadge label={`low ${migrationSummary.codemodCandidates.summary.lowRiskCount}`} />
                    <SectionBadge label={`medium ${migrationSummary.codemodCandidates.summary.mediumRiskCount}`} />
                    <SectionBadge label={`high ${migrationSummary.codemodCandidates.summary.highRiskCount}`} />
                    <SectionBadge label={migrationSummary.codemodCandidates.transformEngine} />
                    {migrationSummary.codemodCandidates.dryRun ? (
                      <>
                        <SectionBadge label={`active ${migrationSummary.codemodCandidates.dryRun.summary.activeCandidateCount}`} />
                        <SectionBadge label={migrationSummary.codemodCandidates.dryRun.executionMode} />
                        {migrationSummary.codemodCandidates.dryRun.applyPreview ? (
                          <>
                            <SectionBadge label={`eligible ${migrationSummary.codemodCandidates.dryRun.applyPreview.summary.exactEligibleCandidateCount}`} />
                            <SectionBadge label={`noop ${migrationSummary.codemodCandidates.dryRun.applyPreview.summary.noopReadyCandidateCount}`} />
                            <SectionBadge label={migrationSummary.codemodCandidates.dryRun.applyPreview.defaultWriteMode} />
                          </>
                        ) : null}
                      </>
                    ) : null}
                    {migrationSummary.codemodCandidates.applyExecutor ? (
                      <>
                        <SectionBadge label={`ready ${migrationSummary.codemodCandidates.applyExecutor.summary.readyToApplyCandidateCount}`} />
                        <SectionBadge label={migrationSummary.codemodCandidates.applyExecutor.defaultWriteMode} />
                      </>
                    ) : null}
                    {migrationSummary.codemodCandidates.manualReview ? (
                      <>
                        <SectionBadge label={`review ${migrationSummary.codemodCandidates.manualReview.summary.readyPacketCount}`} />
                        <SectionBadge label={`decision ${migrationSummary.codemodCandidates.manualReview.summary.readyForDecisionCount}`} />
                        <SectionBadge label={`pending ${migrationSummary.codemodCandidates.manualReview.summary.pendingDecisionCount}`} />
                        <SectionBadge label={`single-owner ${migrationSummary.codemodCandidates.manualReview.summary.singleOwnerApprovalCount}`} />
                        <SectionBadge label={`checklist ${migrationSummary.codemodCandidates.manualReview.summary.generatedChecklistItemCount}`} />
                        <SectionBadge label={migrationSummary.codemodCandidates.manualReview.reviewMode} />
                        <SectionBadge label={migrationSummary.codemodCandidates.manualReview.approvalModel} />
                        {migrationSummary.codemodCandidates.manualReview.decisions ? (
                          <>
                            <SectionBadge label={`approved ${migrationSummary.codemodCandidates.manualReview.decisions.summary.approvedForApplyPreviewCount}`} />
                            <SectionBadge label={`deferred ${migrationSummary.codemodCandidates.manualReview.decisions.summary.deferredUntilVisualReviewCount}`} />
                            <SectionBadge label={`review-only ${migrationSummary.codemodCandidates.manualReview.decisions.summary.reviewOnlyManualRefactorCount}`} />
                            <SectionBadge label={`decision-pending ${migrationSummary.codemodCandidates.manualReview.decisions.summary.pendingDecisionCount}`} />
                            <SectionBadge label={migrationSummary.codemodCandidates.manualReview.decisions.decisionMode} />
                          </>
                        ) : null}
                      </>
                    ) : null}
                    {migrationSummary.codemodCandidates.prototypes ? (
                      <>
                        <SectionBadge label={`prototype ${migrationSummary.codemodCandidates.prototypes.summary.readyCount}/${migrationSummary.codemodCandidates.prototypes.summary.prototypeCount}`} />
                        <SectionBadge label={`illustrative ${migrationSummary.codemodCandidates.prototypes.summary.illustrativePreviewCount}`} />
                      </>
                    ) : null}
                  </div>
                  <div className="flex flex-col mt-4 gap-3">
                    {migrationSummary.codemodCandidates.items.slice(0, 4).map((entry: any) => (
                      <div key={entry.candidateId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {entry.component}
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            <SectionBadge label={entry.consumerApp} />
                            <SectionBadge label={entry.transformKind} />
                            <SectionBadge label={`risk ${entry.riskLevel}`} />
                            <SectionBadge label={`touch ${entry.estimatedTouchPoints}`} />
                            <SectionBadge label={`prototype ${entry.prototypeStatus}`} />
                            {entry.dryRunIncluded ? <SectionBadge label="active dry-run" /> : null}
                            {entry.applyExecutorIncluded ? <SectionBadge label="apply executor" /> : null}
                            {entry.manualReviewIncluded ? <SectionBadge label="manual review" /> : null}
                            {entry.manualReviewDecisionIncluded && entry.manualReviewDecisionState ? (
                              <SectionBadge label={entry.manualReviewDecisionState} />
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.ownerHandles.map((owner: string) => (
                            <SectionBadge key={`${entry.candidateId}-${owner}`} label={owner} />
                          ))}
                          {entry.dryRunScope.requiredAnySignals.map((signal: string) => (
                            <SectionBadge key={`${entry.candidateId}-${signal}`} label={signal} />
                          ))}
                        </div>
                        <div className="flex flex-col mt-3 gap-2">
                          {entry.rewriteRule ? (
                            <Text variant="secondary" className="block text-sm leading-6">
                              rule: {entry.rewriteRule}
                            </Text>
                          ) : null}
                          {entry.steps.slice(0, 2).map((step: string) => (
                            <Text key={`${entry.candidateId}-${step}`} variant="secondary" className="block text-sm leading-6">
                              {step}
                            </Text>
                          ))}
                          {entry.blockers.slice(0, 2).map((blocker: string) => (
                            <Text key={`${entry.candidateId}-${blocker}`} variant="secondary" className="block text-sm leading-6">
                              blocker: {blocker}
                            </Text>
                          ))}
                          {entry.manualReviewDecisionRationale ? (
                            <Text variant="secondary" className="block text-sm leading-6">
                              decision: {entry.manualReviewDecisionRationale}
                            </Text>
                          ) : null}
                          {entry.manualReviewDecisionNextStep ? (
                            <Text variant="secondary" className="block text-sm leading-6">
                              next: {entry.manualReviewDecisionNextStep}
                            </Text>
                          ) : null}
                          {entry.manualValidation.storybook.length ? (
                            <Text variant="secondary" className="block text-sm leading-6">
                              validation: {entry.manualValidation.storybook.slice(0, 2).join(', ')}
                            </Text>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                  <LibraryCodeBlock
                    code={[
                      `artifact: '${migrationSummary.codemodCandidates.artifactPath}'`,
                      `auditArtifact: '${migrationSummary.codemodCandidates.auditArtifactPath}'`,
                      `auditScript: '${migrationSummary.codemodCandidates.auditScript}'`,
                      `applyPolicy: '${migrationSummary.codemodCandidates.applyPolicy}'`,
                      ...(migrationSummary.codemodCandidates.dryRun
                        ? [
                            `dryRunArtifact: '${migrationSummary.codemodCandidates.dryRun.artifactPath}'`,
                            `dryRunAudit: '${migrationSummary.codemodCandidates.dryRun.auditArtifactPath}'`,
                            `dryRunScript: '${migrationSummary.codemodCandidates.dryRun.runScript}'`,
                            ...(migrationSummary.codemodCandidates.dryRun.applyPreview
                              ? [
                                  `applyPreviewArtifact: '${migrationSummary.codemodCandidates.dryRun.applyPreview.artifactPath}'`,
                                  `applyPreviewAudit: '${migrationSummary.codemodCandidates.dryRun.applyPreview.auditArtifactPath}'`,
                                  `applyPreviewScript: '${migrationSummary.codemodCandidates.dryRun.applyPreview.runScript}'`,
                                ]
                              : []),
                          ]
                        : []),
                      ...(migrationSummary.codemodCandidates.applyExecutor
                        ? [
                            `applyArtifact: '${migrationSummary.codemodCandidates.applyExecutor.artifactPath}'`,
                            `applyAudit: '${migrationSummary.codemodCandidates.applyExecutor.auditArtifactPath}'`,
                            `applyScript: '${migrationSummary.codemodCandidates.applyExecutor.runScript}'`,
                          ]
                        : []),
                      ...(migrationSummary.codemodCandidates.manualReview
                        ? [
                            `manualReviewArtifact: '${migrationSummary.codemodCandidates.manualReview.artifactPath}'`,
                            `manualReviewAudit: '${migrationSummary.codemodCandidates.manualReview.auditArtifactPath}'`,
                            `manualReviewScript: '${migrationSummary.codemodCandidates.manualReview.runScript}'`,
                            `approvalModel: '${migrationSummary.codemodCandidates.manualReview.approvalModel}'`,
                            `decisionState: '${migrationSummary.codemodCandidates.manualReview.decisionStateDefault}'`,
                            ...(migrationSummary.codemodCandidates.manualReview.decisions
                              ? [
                                  `manualDecisionArtifact: '${migrationSummary.codemodCandidates.manualReview.decisions.artifactPath}'`,
                                  `manualDecisionAudit: '${migrationSummary.codemodCandidates.manualReview.decisions.auditArtifactPath}'`,
                                  `manualDecisionScript: '${migrationSummary.codemodCandidates.manualReview.decisions.runScript}'`,
                                  `manualDecisionMode: '${migrationSummary.codemodCandidates.manualReview.decisions.decisionMode}'`,
                                ]
                              : []),
                          ]
                        : []),
                      ...(migrationSummary.codemodCandidates.prototypes
                        ? [
                            `prototypeArtifact: '${migrationSummary.codemodCandidates.prototypes.artifactPath}'`,
                            `prototypeAudit: '${migrationSummary.codemodCandidates.prototypes.auditArtifactPath}'`,
                            `prototypeSourceDir: '${migrationSummary.codemodCandidates.prototypes.sourceDir}'`,
                          ]
                        : []),
                    ].join('\n')}
                    languageLabel="codemods"
                    className="mt-4"
                  />
                </div>
              ) : null}

              {migrationSummary.ownerResolution ? (
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Owner registry</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SectionBadge label={migrationSummary.ownerResolution.contractId} />
                    <SectionBadge label={`mapped ${migrationSummary.ownerResolution.ownerMappedAppsCount}`} />
                    <SectionBadge label={`unowned ${migrationSummary.ownerResolution.unownedAppsCount}`} />
                    <SectionBadge label={migrationSummary.ownerResolution.source} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {migrationSummary.ownerResolution.defaultOwnerHandles.map((owner: string) => (
                      <SectionBadge key={`default-owner-${owner}`} label={owner} />
                    ))}
                  </div>
                  <LibraryCodeBlock
                    code={[
                      `contract: '${migrationSummary.ownerResolution.contractPath}'`,
                      `codeowners: '${migrationSummary.ownerResolution.codeownersPath}'`,
                    ].join('\n')}
                    languageLabel="owners"
                    className="mt-4"
                  />
                </div>
              ) : null}

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Consumer apps</DetailLabel>
                <div className="flex flex-col mt-3 gap-3">
                  {migrationSummary.consumerApps.map((consumer: any) => (
                    <div key={consumer.appId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Text as="div" className="text-sm font-semibold text-text-primary">
                          {consumer.appId}
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          <SectionBadge label={`${consumer.componentCount} component`} />
                          {consumer.highestChangeClass ? <SectionBadge label={consumer.highestChangeClass} /> : null}
                          {consumer.ownerSource ? <SectionBadge label={consumer.ownerSource} /> : null}
                        </div>
                      </div>
                      {consumer.ownerHandles?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {consumer.ownerHandles.map((owner: string) => (
                            <SectionBadge key={`${consumer.appId}-${owner}`} label={owner} />
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {consumer.components.map((name: string) => (
                          <SectionBadge key={`${consumer.appId}-${name}`} label={name} />
                        ))}
                      </div>
                      {(consumer.singleAppComponents?.length || consumer.sharedComponents?.length) ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {consumer.singleAppComponents?.length ? (
                            <Badge variant="warning">{`${consumer.singleAppComponents.length} single-app surface`}</Badge>
                          ) : null}
                          {consumer.sharedComponents?.length ? (
                            <Badge variant="info">{`${consumer.sharedComponents.length} shared surface`}</Badge>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Migration rules</DetailLabel>
                <div className="flex flex-col mt-3 gap-2">
                  {migrationSummary.rules.map((rule: string) => (
                    <Text key={rule} variant="secondary" className="block text-sm leading-6">
                      {rule}
                    </Text>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Evidence refs</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {migrationSummary.evidenceRefs.map((entry: string) => (
                    <SectionBadge key={entry} label={entry} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LibraryShowcaseCard>
      ) : null}

      {activePanelId === 'visual' && visualRegressionSummary ? (
        <LibraryShowcaseCard
          eyebrow="Visual Contract"
          title="Storybook ve regression harness"
          description="Release-grade tasarim kutuphanesi icin sadece API coverage yetmez; gorsel harness, docs matrix ve static Storybook contract'i da ayni yerde izlenir."
          badges={[
            <SectionBadge key="visual-contract" label={visualRegressionSummary.contractId} />,
            <SectionBadge
              key="visual-harness"
              label={`${visualRegressionSummary.summary.requiredHarnessPresentCount}/${visualRegressionSummary.summary.requiredHarnessCount} harness`}
            />,
            <SectionBadge key="visual-live" label={`${visualRegressionSummary.summary.designLabLiveDemoExports} live demo`} />,
            <SectionBadge key="visual-story" label={`Story ${visualRegressionSummary.summary.storyCoveragePercent}%`} />,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <LibraryMetricCard
                  label="Story files"
                  value={visualRegressionSummary.summary.storybookStoryFiles}
                  note="Core visual harness story dosya sayisi"
                />
                <LibraryMetricCard
                  label="MDX docs"
                  value={visualRegressionSummary.summary.mdxDocFiles}
                  note="Theme/docs anlatim yuzeyi"
                />
                <LibraryMetricCard
                  label="Story coverage"
                  value={`${visualRegressionSummary.summary.storyCoveragePercent}%`}
                  note={`${visualRegressionSummary.summary.storybookCoveredComponents}/${visualRegressionSummary.summary.visualizableComponents} component story ile gorunur`}
                />
                <LibraryMetricCard
                  label="Release-ready story"
                  value={`${visualRegressionSummary.summary.releaseReadyCoveragePercent}%`}
                  note={`${visualRegressionSummary.summary.releaseReadyStoryCoveredComponents}/${visualRegressionSummary.summary.releaseReadyComponents} stable component coverage`}
                />
                <LibraryMetricCard
                  label="Adopted story"
                  value={`${visualRegressionSummary.summary.adoptedCoveragePercent}%`}
                  note={`${visualRegressionSummary.summary.adoptedStoryCoveredComponents}/${visualRegressionSummary.summary.adoptedOutsideLabComponents} adopted component story coverage`}
                />
                <LibraryMetricCard
                  label="Required harness"
                  value={`${visualRegressionSummary.summary.requiredHarnessPresentCount}/${visualRegressionSummary.summary.requiredHarnessCount}`}
                  note="Release gate oncesi zorunlu visual yuzeyler"
                />
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Required harnesses</DetailLabel>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {visualRegressionSummary.requiredHarnesses.map((harness: any) => (
                    <div key={harness.path} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Text as="div" className="text-sm font-semibold text-text-primary">
                          {harness.path}
                        </Text>
                        <Badge variant={harness.present ? 'success' : 'warning'}>
                          {harness.present ? 'Present' : 'Missing'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Stable without story</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visualRegressionSummary.coverageBacklog.stableWithoutStory.length ? (
                      visualRegressionSummary.coverageBacklog.stableWithoutStory.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Backlog temiz</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Adopted without story</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visualRegressionSummary.coverageBacklog.adoptedWithoutStory.length ? (
                      visualRegressionSummary.coverageBacklog.adoptedWithoutStory.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Adopted story coverage hazir</Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Live demo without story</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visualRegressionSummary.coverageBacklog.liveDemoWithoutStory.length ? (
                      visualRegressionSummary.coverageBacklog.liveDemoWithoutStory.map((name: string) => (
                        <SectionBadge key={name} label={name} />
                      ))
                    ) : (
                      <Badge variant="success">Live demo ile story coverage dengeli</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Visual rules</DetailLabel>
                <div className="flex flex-col mt-3 gap-2">
                  {visualRegressionSummary.rules.map((rule: string) => (
                    <Text key={rule} variant="secondary" className="block text-sm leading-6">
                      {rule}
                    </Text>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Storybook contract</DetailLabel>
                <LibraryCodeBlock
                  code={[
                    `build: ${visualRegressionSummary.storybook.buildCommand}`,
                    `chromatic: ${visualRegressionSummary.storybook.chromaticCommand}`,
                    `config: ${visualRegressionSummary.storybook.configPath}`,
                    `preview: ${visualRegressionSummary.storybook.previewPath}`,
                    `static: ${visualRegressionSummary.storybook.staticOutputPath}`,
                  ].join('\n')}
                  languageLabel="visual"
                  className="mt-3"
                />
              </div>

              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <DetailLabel>Evidence refs</DetailLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {visualRegressionSummary.evidenceRefs.slice(0, 10).map((entry: string) => (
                    <SectionBadge key={entry} label={entry} />
                  ))}
                </div>
                <Text variant="secondary" className="mt-3 block text-sm leading-6">
                  Storybook, docs ve chromatic trigger zinciri release visual contract icin ayni kaynaktan okunur.
                </Text>
              </div>
            </div>
          </div>
        </LibraryShowcaseCard>
      ) : null}

      {activePanelId === 'theme' && themePresetSummary ? (
        <LibraryShowcaseCard
          eyebrow="Theme Presets"
          title="Resmi preset galerisi"
          description="Theme engine uzerinde resmi olarak desteklenen preset ailesi. Docs, release ve runtime ayni preset kimliklerini kullanir."
          badges={[
            <SectionBadge key="theme-catalog" label={themePresetSummary.catalogId} />,
            <SectionBadge key="theme-count" label={`${themePresetSummary.presets.length} preset`} />,
          ]}
        >
          <div className="grid grid-cols-1 gap-4">
            <ThemePresetGallery presets={themePresetGalleryItems} compareAxes={themePresetSummary.compareAxes} />
            <ThemePresetCompare leftPreset={defaultThemePreset} rightPreset={contrastThemePreset ?? compactThemePreset} />
          </div>

          <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
            <DetailLabel>Preset kurallari</DetailLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {themePresetSummary.compareAxes.map((axis: string) => (
                <SectionBadge key={axis} label={axis} />
              ))}
            </div>
            <div className="flex flex-col mt-4 gap-2">
              {themePresetSummary.rules.map((rule: string) => (
                <Text key={rule} variant="secondary" className="block text-sm leading-6">
                  {rule}
                </Text>
              ))}
            </div>
          </div>
        </LibraryShowcaseCard>
      ) : null}

      {activePanelId === 'recipes' && recipeSummary ? (
        <LibraryShowcaseCard
          eyebrow="Recipe System"
          title={relatedRecipes.length ? 'Secili component ile iliskili receteler' : 'Library recipe ailesi'}
          description="Tek tek component yerine ortak ekran davranislarini reusable recipe mantigiyla yonetmek icin kullanilan kontrat katmani."
          badges={[
            <SectionBadge key="recipe-contract" label={recipeSummary.contractId} />,
            <SectionBadge key="recipe-count" label={`${recipeSummary.currentFamilies.length} current`} />,
            recipeSummary.plannedFamilies.length ? (
              <SectionBadge key="recipe-planned" label={`${recipeSummary.plannedFamilies.length} planned`} />
            ) : null,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {relatedRecipes.length ? relatedRecipes.map((recipe) => {
              const directRecipeMatch =
                recipe.ownerBlocks.includes(item.name)
                || recipe.recipeId === item.name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

              return (
                <div key={recipe.recipeId} className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-xs">
                  <div className="grid grid-cols-1 gap-4">
                    {renderRecipeComponentPreview(recipe.recipeId)}
                    <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Text as="div" className="font-semibold text-text-primary">
                            {recipe.recipeId}
                          </Text>
                          <Text variant="secondary" className="mt-1 block text-sm leading-6">
                            {recipe.intent}
                          </Text>
                        </div>
                        <Badge variant={directRecipeMatch ? 'success' : 'muted'}>
                          {directRecipeMatch ? 'Direct recipe' : 'Library recipe'}
                        </Badge>
                      </div>

                      <div className="mt-4">
                        <DetailLabel>Owner blocks</DetailLabel>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {recipe.ownerBlocks.map((owner) => (
                            <SectionBadge
                              key={owner}
                              label={owner}
                              className={owner === item.name ? 'border-state-success-border bg-state-success-bg text-state-success-text' : undefined}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : recipeSummary.currentFamilies.map((recipe: DesignLabRecipeFamily) => (
              <div key={recipe.recipeId} className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="div" className="font-semibold text-text-primary">
                      {recipe.recipeId}
                    </Text>
                    <Text variant="secondary" className="mt-1 block text-sm leading-6">
                      {recipe.intent}
                    </Text>
                  </div>
                  <Badge variant="muted">Library recipe</Badge>
                </div>

                <div className="mt-4">
                  <DetailLabel>Owner blocks</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recipe.ownerBlocks.map((owner) => (
                      <SectionBadge key={owner} label={owner} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recipeSummary.plannedFamilies.length ? (
            <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Planned recipes</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {recipeSummary.plannedFamilies.map((family: string) => (
                  <SectionBadge key={family} label={family} />
                ))}
              </div>
            </div>
          ) : null}
        </LibraryShowcaseCard>
      ) : null}
    </>
  );
};
