import type {
  DesignLabPageShellDetailTab,
  DesignLabPageShellLayerId,
} from './designLabPageShellLayerResolver';

export type DesignLabMetadataDescriptor = {
  label: string;
  value: string;
  compact?: boolean;
  valueClassName?: string;
  note?: string;
};

type RecipeApiPanelId = "contract" | "binding" | "usage";
type RecipeQualityPanelId = "gates" | "lifecycle";
type PageApiPanelId = "contract" | "regions" | "dependencies";
type PageQualityPanelId = "gates" | "readiness";
type ComponentApiPanelId = 'contract' | 'model' | 'props' | 'usage';
type ComponentQualityPanelId = 'gates' | 'usage';

type ResolveFoundationMetadataArgs = {
  detailTab: DesignLabPageShellDetailTab;
  activeWorkspaceLabel: string;
  primaryLensLabel: string;
  primaryLensValue: string;
  familyTitle: string | null;
  benchmark: string | null;
  trackLabel: string;
  trackValue: string | null;
  visibleCount: number;
  contractId: string | null;
  kind: string | null;
  qualityGatesCount: number;
  statusLabel: string;
  statusValueClassName: string;
  availabilityValue: string;
};

type ResolveComponentMetadataArgs = {
  detailTab: DesignLabPageShellDetailTab;
  activeComponentApiPanel: ComponentApiPanelId;
  activeComponentQualityPanel: ComponentQualityPanelId;
  primaryLensLabel: string;
  primaryLensValue: string;
  trackValue: string | null;
  groupValue: string | null;
  demoValue: string;
  usageLabel: string;
  usageCount: number;
  kind: string | null;
  contractId: string | null;
  variantAxesCount: number;
  stateModelCount: number;
  previewFocusCount: number;
  regressionCount: number;
  propsCount: number;
  requiredPropsCount: number;
  defaultsCount: number;
  usageRecipeCount: number;
  whereUsedCount: number;
  qualityGatesCount: number;
  statusLabel: string;
  statusValueClassName: string;
  availabilityValue: string;
  packageName: string;
};

type ResolveRecipeMetadataArgs = {
  detailTab: DesignLabPageShellDetailTab;
  activeRecipeApiPanel: RecipeApiPanelId;
  activeRecipeQualityPanel: RecipeQualityPanelId;
  activeWorkspaceLabel: string;
  primaryLensLabel: string;
  primaryLensValue: string;
  tracksLabel: string;
  sectionsLabel: string;
  themesLabel: string;
  selectedRecipeIdentity: string | null;
  ownerBlocksCount: number;
  selectedFamilyTracks: string[];
  selectedFamilySectionsCount: number;
  selectedFamilyThemesCount: number;
  selectedFamilyClusterTitle: string | null;
  contractId: string | null;
  qualityGatesCount: number;
  stableCount: number;
  betaCount: number;
  liveDemoCount: number;
};

type ResolvePageMetadataArgs = {
  detailTab: DesignLabPageShellDetailTab;
  activePageApiPanel: PageApiPanelId;
  activePageQualityPanel: PageQualityPanelId;
  activeWorkspaceLabel: string;
  primaryLensLabel: string;
  primaryLensValue: string;
  tracksLabel: string;
  sectionsLabel: string;
  themesLabel: string;
  selectedPageIdentity: string | null;
  selectedPageDisplayTitle: string;
  selectedPageTemplateFamilyTitle: string | null;
  selectedPageTemplateContractId: string | null;
  ownerBlocksCount: number;
  selectedPageTemplateTracks: string[];
  selectedPageTemplateSectionsCount: number;
  selectedPageTemplateThemesCount: number;
  selectedPageTemplateQualityGatesCount: number;
  stableCount: number;
  betaCount: number;
  liveDemoCount: number;
};

type ResolveReleaseMetadataArgs = {
  layerId: DesignLabPageShellLayerId;
  packageName: string;
  packageVersion: string;
  latestReleaseDate: string | null;
  readyDistributionTargetCount: number;
  distributionTargetCount: number;
  evidenceCount: number;
  familyTitle?: string | null;
  waveId?: string | null;
};

type ResolveAdoptionMetadataArgs = {
  layerId: DesignLabPageShellLayerId;
  coveragePercent: number;
  readySurfaceCount: number;
  usedByAppsCount: number;
  privateGuardStatus: string;
};

type ResolveMigrationMetadataArgs = {
  layerId: DesignLabPageShellLayerId;
  adoptedCount: number;
  consumerAppsCount: number;
  storyCoveragePercent: number;
  stableOnlyLabCount: number;
};

type ResolveLensGuideMetadataArgs = {
  layerId: DesignLabPageShellLayerId;
  activeWorkspaceLabel: string;
  activeLensLabel: string;
  activeLensTitle: string;
  activeLensNote: string;
  activeLensUseWhen: string;
  familyTitle: string | null;
  familyNote: string | null;
  benchmark: string | null;
  benchmarkNote: string | null;
  clusterTitle: string | null;
  clusterDescription: string | null;
};

const valueOrDash = (value: string | null | undefined) =>
  value && value.length > 0 ? value : '—';

const joinOrDash = (values: readonly string[]) => values.join(' / ') || '—';

export const resolveDesignLabFoundationMetadataItems = ({
  detailTab,
  activeWorkspaceLabel,
  primaryLensLabel,
  primaryLensValue,
  familyTitle,
  benchmark,
  trackLabel,
  trackValue,
  visibleCount,
  contractId,
  kind,
  qualityGatesCount,
  statusLabel,
  statusValueClassName,
  availabilityValue,
}: ResolveFoundationMetadataArgs): DesignLabMetadataDescriptor[] => {
  if (detailTab === 'general') {
    return [
      { label: primaryLensLabel, value: primaryLensValue },
      { label: 'Family', value: valueOrDash(familyTitle) },
      { label: 'Benchmark', value: valueOrDash(benchmark) },
      { label: trackLabel, value: valueOrDash(trackValue) },
      { label: 'Visible', value: String(visibleCount) },
    ];
  }

  if (detailTab === 'api') {
    return [
      { label: 'Contract', value: valueOrDash(contractId), compact: true },
      { label: 'Kind', value: valueOrDash(kind) },
      { label: 'Benchmark', value: valueOrDash(benchmark) },
      { label: trackLabel, value: valueOrDash(trackValue) },
    ];
  }

  if (detailTab === 'quality') {
    return [
      { label: 'Quality gates', value: String(qualityGatesCount) },
      {
        label: 'Status',
        value: statusLabel,
        valueClassName: statusValueClassName,
      },
      { label: 'Availability', value: availabilityValue },
      { label: 'Benchmark', value: valueOrDash(benchmark) },
    ];
  }

  return [
    { label: 'Mode', value: activeWorkspaceLabel },
    { label: primaryLensLabel, value: primaryLensValue },
    { label: 'Family', value: valueOrDash(familyTitle) },
    { label: 'Benchmark', value: valueOrDash(benchmark) },
  ];
};

export const resolveDesignLabComponentMetadataItems = ({
  detailTab,
  activeComponentApiPanel,
  activeComponentQualityPanel,
  primaryLensLabel,
  primaryLensValue,
  trackValue,
  groupValue,
  demoValue,
  usageLabel,
  usageCount,
  kind,
  contractId,
  variantAxesCount,
  stateModelCount,
  previewFocusCount,
  regressionCount,
  propsCount,
  requiredPropsCount,
  defaultsCount,
  usageRecipeCount,
  whereUsedCount,
  qualityGatesCount,
  statusLabel,
  statusValueClassName,
  availabilityValue,
  packageName,
}: ResolveComponentMetadataArgs): DesignLabMetadataDescriptor[] => {
  if (detailTab === 'general') {
    return [
      { label: primaryLensLabel, value: primaryLensValue },
      { label: 'Track', value: valueOrDash(trackValue) },
      { label: 'Group', value: valueOrDash(groupValue) },
      { label: 'Demo', value: demoValue },
      { label: usageLabel, value: String(usageCount) },
    ];
  }

  if (detailTab === 'api') {
    if (activeComponentApiPanel === 'contract') {
      return [
        { label: 'Kind', value: valueOrDash(kind) },
        { label: 'Track', value: valueOrDash(trackValue) },
        { label: 'Contract', value: valueOrDash(contractId), compact: true },
      ];
    }

    if (activeComponentApiPanel === 'model') {
      return [
        { label: 'Variant axes', value: String(variantAxesCount) },
        { label: 'State model', value: String(stateModelCount) },
        { label: 'Preview focus', value: String(previewFocusCount) },
        { label: 'Regression', value: String(regressionCount) },
      ];
    }

    if (activeComponentApiPanel === 'props') {
      return [
        { label: 'Props', value: String(propsCount) },
        { label: 'Required', value: String(requiredPropsCount) },
        { label: 'Defaults', value: String(defaultsCount) },
      ];
    }

    return [
      { label: 'Usage recipes', value: String(usageRecipeCount) },
      { label: 'Where used', value: String(whereUsedCount) },
      { label: 'Track', value: valueOrDash(trackValue) },
    ];
  }

  if (detailTab === 'quality') {
    if (activeComponentQualityPanel === 'gates') {
      return [
        { label: 'Quality gates', value: String(qualityGatesCount) },
        {
          label: 'Status',
          value: statusLabel,
          valueClassName: statusValueClassName,
        },
        { label: 'Availability', value: availabilityValue },
      ];
    }

    return [
      { label: 'Where used', value: String(whereUsedCount) },
      { label: 'Usage recipes', value: String(usageRecipeCount) },
      { label: 'Package', value: packageName },
    ];
  }

  return [
    {
      label: 'Status',
      value: statusLabel,
      valueClassName: statusValueClassName,
    },
    { label: 'Package', value: packageName },
    { label: 'Contract', value: valueOrDash(contractId), compact: true },
  ];
};

export const resolveDesignLabRecipeMetadataItems = ({
  detailTab,
  activeRecipeApiPanel,
  activeRecipeQualityPanel,
  activeWorkspaceLabel,
  primaryLensLabel,
  primaryLensValue,
  tracksLabel,
  sectionsLabel,
  themesLabel,
  selectedRecipeIdentity,
  ownerBlocksCount,
  selectedFamilyTracks,
  selectedFamilySectionsCount,
  selectedFamilyThemesCount,
  selectedFamilyClusterTitle,
  contractId,
  qualityGatesCount,
  stableCount,
  betaCount,
  liveDemoCount,
}: ResolveRecipeMetadataArgs): DesignLabMetadataDescriptor[] => {
  if (detailTab === 'general') {
    return [
      { label: 'Owner blocks', value: String(ownerBlocksCount) },
      { label: tracksLabel, value: String(selectedFamilyTracks.length) },
      { label: sectionsLabel, value: String(selectedFamilySectionsCount) },
      { label: themesLabel, value: String(selectedFamilyThemesCount) },
      { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
    ];
  }

  if (detailTab === 'api') {
    if (activeRecipeApiPanel === 'contract') {
      return [
        { label: 'Recipe ID', value: valueOrDash(selectedRecipeIdentity) },
        { label: 'Owner blocks', value: String(ownerBlocksCount) },
        { label: 'Contract', value: valueOrDash(contractId), compact: true },
        { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
      ];
    }

    if (activeRecipeApiPanel === 'binding') {
      return [
        { label: tracksLabel, value: joinOrDash(selectedFamilyTracks) },
        { label: 'Owner blocks', value: String(ownerBlocksCount) },
        { label: 'Contract', value: valueOrDash(contractId), compact: true },
        { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
      ];
    }

    return [
      { label: 'Usage patterns', value: '2' },
      { label: 'Owner blocks', value: String(ownerBlocksCount) },
      { label: tracksLabel, value: joinOrDash(selectedFamilyTracks) },
      { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
    ];
  }

  if (detailTab === 'quality') {
    if (activeRecipeQualityPanel === 'gates') {
      return [
        { label: 'Quality gates', value: String(qualityGatesCount) },
        { label: 'Owner blocks', value: String(ownerBlocksCount) },
        { label: tracksLabel, value: joinOrDash(selectedFamilyTracks) },
        { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
      ];
    }

    return [
      { label: 'Stable', value: String(stableCount) },
      { label: 'Beta', value: String(betaCount) },
      { label: 'Live demo', value: String(liveDemoCount) },
      { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
    ];
  }

  return [
    { label: 'Mode', value: activeWorkspaceLabel },
    { label: primaryLensLabel, value: primaryLensValue },
    { label: 'Contract', value: valueOrDash(contractId), compact: true },
    { label: 'Owner blocks', value: String(ownerBlocksCount) },
    { label: tracksLabel, value: joinOrDash(selectedFamilyTracks) },
    { label: 'Cluster', value: valueOrDash(selectedFamilyClusterTitle) },
  ];
};

export const resolveDesignLabPageMetadataItems = ({
  detailTab,
  activePageApiPanel,
  activePageQualityPanel,
  activeWorkspaceLabel,
  primaryLensLabel,
  primaryLensValue,
  tracksLabel,
  sectionsLabel,
  themesLabel,
  selectedPageIdentity,
  selectedPageDisplayTitle,
  selectedPageTemplateFamilyTitle,
  selectedPageTemplateContractId,
  ownerBlocksCount,
  selectedPageTemplateTracks,
  selectedPageTemplateSectionsCount,
  selectedPageTemplateThemesCount,
  selectedPageTemplateQualityGatesCount,
  stableCount,
  betaCount,
  liveDemoCount,
}: ResolvePageMetadataArgs): DesignLabMetadataDescriptor[] => {
  if (detailTab === 'general') {
    return [
      { label: primaryLensLabel, value: primaryLensValue },
      { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
      { label: 'Template', value: selectedPageDisplayTitle },
      { label: 'Building blocks', value: String(ownerBlocksCount) },
      { label: tracksLabel, value: String(selectedPageTemplateTracks.length) },
    ];
  }

  if (detailTab === 'api') {
    if (activePageApiPanel === 'contract') {
      return [
        { label: 'Template ID', value: valueOrDash(selectedPageIdentity) },
        { label: 'Contract', value: valueOrDash(selectedPageTemplateContractId), compact: true },
        { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
        { label: 'Building blocks', value: String(ownerBlocksCount) },
      ];
    }

    if (activePageApiPanel === 'regions') {
      return [
        { label: tracksLabel, value: joinOrDash(selectedPageTemplateTracks) },
        { label: sectionsLabel, value: String(selectedPageTemplateSectionsCount) },
        { label: themesLabel, value: String(selectedPageTemplateThemesCount) },
        { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
      ];
    }

    return [
      { label: 'Dependencies', value: String(ownerBlocksCount) },
      { label: tracksLabel, value: joinOrDash(selectedPageTemplateTracks) },
      { label: sectionsLabel, value: String(selectedPageTemplateSectionsCount) },
      { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
    ];
  }

  if (detailTab === 'quality') {
    if (activePageQualityPanel === 'gates') {
      return [
        { label: 'Quality gates', value: String(selectedPageTemplateQualityGatesCount) },
        { label: 'Stable', value: String(stableCount) },
        { label: 'Beta', value: String(betaCount) },
        { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
      ];
    }

    return [
      { label: 'Stable', value: String(stableCount) },
      { label: 'Beta', value: String(betaCount) },
      { label: 'Live demo', value: String(liveDemoCount) },
      { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
    ];
  }

  return [
    { label: 'Mode', value: activeWorkspaceLabel },
    { label: primaryLensLabel, value: primaryLensValue },
    { label: 'Template', value: selectedPageDisplayTitle },
    { label: 'Page family', value: valueOrDash(selectedPageTemplateFamilyTitle) },
  ];
};

export const resolveDesignLabReleaseMetadataItems = ({
  layerId,
  packageName,
  packageVersion,
  latestReleaseDate,
  readyDistributionTargetCount,
  distributionTargetCount,
  evidenceCount,
  familyTitle,
  waveId,
}: ResolveReleaseMetadataArgs): DesignLabMetadataDescriptor[] | null => {
  if (layerId !== 'components') {
    return null;
  }

  return [
    { label: 'Package', value: `${packageName}@${packageVersion}` },
    { label: 'Latest Notes', value: valueOrDash(latestReleaseDate || null) },
    {
      label: 'Targets Ready',
      value: `${readyDistributionTargetCount}/${distributionTargetCount}`,
    },
    { label: 'Evidence', value: String(evidenceCount) },
    ...(familyTitle
      ? [{ label: 'Family', value: familyTitle }]
      : []),
    ...(waveId
      ? [{ label: 'Wave', value: waveId }]
      : []),
  ];
};

export const resolveDesignLabAdoptionMetadataItems = ({
  layerId,
  coveragePercent,
  readySurfaceCount,
  usedByAppsCount,
  privateGuardStatus,
}: ResolveAdoptionMetadataArgs): DesignLabMetadataDescriptor[] | null => {
  if (layerId !== 'components') {
    return null;
  }

  const isProtected = privateGuardStatus === 'protected';

  return [
    { label: 'Coverage', value: `${coveragePercent}%` },
    { label: 'Ready Surface', value: String(readySurfaceCount) },
    { label: 'Used by apps', value: String(usedByAppsCount) },
    {
      label: 'Private guard',
      value: privateGuardStatus,
      valueClassName: isProtected ? 'text-state-success-text' : 'text-state-warning-text',
    },
  ];
};

export const resolveDesignLabMigrationMetadataItems = ({
  layerId,
  adoptedCount,
  consumerAppsCount,
  storyCoveragePercent,
  stableOnlyLabCount,
}: ResolveMigrationMetadataArgs): DesignLabMetadataDescriptor[] | null => {
  if (layerId !== 'components') {
    return null;
  }

  return [
    { label: 'Adopted', value: String(adoptedCount) },
    { label: 'Consumer apps', value: String(consumerAppsCount) },
    { label: 'Story coverage', value: `${storyCoveragePercent}%` },
    { label: 'Stable only lab', value: String(stableOnlyLabCount) },
  ];
};

export const resolveDesignLabLensGuideMetadataItems = ({
  layerId,
  activeWorkspaceLabel,
  activeLensLabel,
  activeLensTitle,
  activeLensNote,
  activeLensUseWhen,
  familyTitle,
  familyNote,
  benchmark,
  benchmarkNote,
  clusterTitle,
  clusterDescription,
}: ResolveLensGuideMetadataArgs): DesignLabMetadataDescriptor[] => {
  const items: DesignLabMetadataDescriptor[] = [
    {
      label: 'Workspace',
      value: activeWorkspaceLabel,
      note: 'Design Lab aktif calisma modu',
    },
    {
      label: 'Lens',
      value: activeLensLabel,
      note: activeLensNote,
    },
    {
      label: 'Use when',
      value: activeLensTitle,
      note: activeLensUseWhen,
    },
  ];

  if (layerId === 'components' || layerId === 'foundations') {
    if (familyTitle || familyNote) {
      items.push({
        label: 'Family',
        value: valueOrDash(familyTitle),
        note: familyNote ?? 'Active component family',
      });
    }

    if (benchmark) {
      items.push({
        label: 'Benchmark',
        value: benchmark,
        note: benchmarkNote ?? undefined,
      });
    }

    return items;
  }

  if (layerId === 'recipes' && clusterTitle) {
    items.push({
      label: 'Cluster',
      value: clusterTitle,
      note: clusterDescription ?? 'Active recipe cluster',
    });
  }

  if (layerId === 'pages' && clusterTitle) {
    items.push({
      label: 'Page family',
      value: clusterTitle,
      note: clusterDescription ?? 'Active page template family',
    });
  }

  return items;
};
