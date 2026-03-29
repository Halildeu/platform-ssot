// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  resolveDesignLabComponentMetadataItems,
  resolveDesignLabFoundationMetadataItems,
  resolveDesignLabAdoptionMetadataItems,
  resolveDesignLabLensGuideMetadataItems,
  resolveDesignLabMigrationMetadataItems,
  resolveDesignLabPageMetadataItems,
  resolveDesignLabReleaseMetadataItems,
  resolveDesignLabRecipeMetadataItems,
} from './designLabPageShellMetadataResolver';

describe('designLabPageShellMetadataResolver', () => {
  it('recipe api contract metadatasini recipe-first sekilde uretir', () => {
    expect(
      resolveDesignLabRecipeMetadataItems({
        detailTab: 'api',
        activeRecipeApiPanel: 'contract',
        activeRecipeQualityPanel: 'gates',
        activeWorkspaceLabel: 'Recipes workspace',
        primaryLensLabel: 'Primary Lens',
        primaryLensValue: 'Recipes',
        tracksLabel: 'Tracks',
        sectionsLabel: 'Sections',
        themesLabel: 'Themes',
        selectedRecipeIdentity: 'detail_summary',
        ownerBlocksCount: 4,
        selectedFamilyTracks: ['Wave', 'Current'],
        selectedFamilySectionsCount: 2,
        selectedFamilyThemesCount: 3,
        selectedFamilyClusterTitle: 'Detail flows',
        contractId: 'recipe.contract.v1',
        qualityGatesCount: 2,
        stableCount: 2,
        betaCount: 1,
        liveDemoCount: 1,
      }),
    ).toEqual([
      { label: 'Recipe ID', value: 'detail_summary' },
      { label: 'Owner blocks', value: '4' },
      { label: 'Contract', value: 'recipe.contract.v1', compact: true },
      { label: 'Cluster', value: 'Detail flows' },
    ]);
  });

  it('recipe general branchinde verilen label anahtarlarini korur', () => {
    expect(
      resolveDesignLabRecipeMetadataItems({
        detailTab: 'general',
        activeRecipeApiPanel: 'usage',
        activeRecipeQualityPanel: 'lifecycle',
        activeWorkspaceLabel: 'Recipes workspace',
        primaryLensLabel: 'Primary Lens',
        primaryLensValue: 'Recipes',
        tracksLabel: 'Tracks TR',
        sectionsLabel: 'Sections TR',
        themesLabel: 'Themes TR',
        selectedRecipeIdentity: 'detail_summary',
        ownerBlocksCount: 4,
        selectedFamilyTracks: ['Wave', 'Current'],
        selectedFamilySectionsCount: 2,
        selectedFamilyThemesCount: 3,
        selectedFamilyClusterTitle: 'Detail flows',
        contractId: 'recipe.contract.v1',
        qualityGatesCount: 2,
        stableCount: 2,
        betaCount: 1,
        liveDemoCount: 1,
      }),
    ).toEqual([
      { label: 'Owner blocks', value: '4' },
      { label: 'Tracks TR', value: '2' },
      { label: 'Sections TR', value: '2' },
      { label: 'Themes TR', value: '3' },
      { label: 'Cluster', value: 'Detail flows' },
    ]);
  });

  it('page quality gates metadatasini page-first sekilde uretir', () => {
    expect(
      resolveDesignLabPageMetadataItems({
        detailTab: 'quality',
        activePageApiPanel: 'contract',
        activePageQualityPanel: 'gates',
        activeWorkspaceLabel: 'Pages workspace',
        primaryLensLabel: 'Primary Lens',
        primaryLensValue: 'Pages',
        tracksLabel: 'Tracks',
        sectionsLabel: 'Sections',
        themesLabel: 'Themes',
        selectedPageIdentity: 'dashboard_template',
        selectedPageDisplayTitle: 'Dashboard Template',
        selectedPageTemplateFamilyTitle: 'Dashboard family',
        selectedPageTemplateContractId: 'page.contract.v1',
        ownerBlocksCount: 6,
        selectedPageTemplateTracks: ['Wave'],
        selectedPageTemplateSectionsCount: 3,
        selectedPageTemplateThemesCount: 2,
        selectedPageTemplateQualityGatesCount: 4,
        stableCount: 5,
        betaCount: 1,
        liveDemoCount: 1,
      }),
    ).toEqual([
      { label: 'Quality gates', value: '4' },
      { label: 'Stable', value: '5' },
      { label: 'Beta', value: '1' },
      { label: 'Page family', value: 'Dashboard family' },
    ]);
  });

  it('page default metadata branchinde template display title ve primary lensi korur', () => {
    expect(
      resolveDesignLabPageMetadataItems({
        detailTab: 'overview',
        activePageApiPanel: 'dependencies',
        activePageQualityPanel: 'readiness',
        activeWorkspaceLabel: 'Pages workspace',
        primaryLensLabel: 'Primary Lens',
        primaryLensValue: 'Pages',
        tracksLabel: 'Tracks',
        sectionsLabel: 'Sections',
        themesLabel: 'Themes',
        selectedPageIdentity: 'dashboard_template',
        selectedPageDisplayTitle: 'Dashboard Template',
        selectedPageTemplateFamilyTitle: null,
        selectedPageTemplateContractId: null,
        ownerBlocksCount: 6,
        selectedPageTemplateTracks: ['Wave'],
        selectedPageTemplateSectionsCount: 3,
        selectedPageTemplateThemesCount: 2,
        selectedPageTemplateQualityGatesCount: 4,
        stableCount: 5,
        betaCount: 1,
        liveDemoCount: 1,
      }),
    ).toEqual([
      { label: 'Mode', value: 'Pages workspace' },
      { label: 'Primary Lens', value: 'Pages' },
      { label: 'Template', value: 'Dashboard Template' },
      { label: 'Page family', value: '—' },
    ]);
  });

  it('release metadata itemlarini sadece component katmaninda uretir', () => {
    expect(
      resolveDesignLabReleaseMetadataItems({
        layerId: 'components',
        packageName: '@mfe/design-system',
        packageVersion: '3.4.0',
        latestReleaseDate: '2026-03-15',
        readyDistributionTargetCount: 3,
        distributionTargetCount: 4,
        evidenceCount: 7,
        familyTitle: 'Navigation & Wayfinding',
        waveId: 'wave_3',
      }),
    ).toEqual([
      { label: 'Package', value: '@mfe/design-system@3.4.0' },
      { label: 'Latest Notes', value: '2026-03-15' },
      { label: 'Targets Ready', value: '3/4' },
      { label: 'Evidence', value: '7' },
      { label: 'Family', value: 'Navigation & Wayfinding' },
      { label: 'Wave', value: 'wave_3' },
    ]);

    expect(
      resolveDesignLabReleaseMetadataItems({
        layerId: 'recipes',
        packageName: '@mfe/design-system',
        packageVersion: '3.4.0',
        latestReleaseDate: '2026-03-15',
        readyDistributionTargetCount: 3,
        distributionTargetCount: 4,
        evidenceCount: 7,
      }),
    ).toBeNull();
  });

  it('adoption metadata private guard tonalitesini descriptor uzerinden tasir', () => {
    expect(
      resolveDesignLabAdoptionMetadataItems({
        layerId: 'components',
        coveragePercent: 84,
        readySurfaceCount: 12,
        usedByAppsCount: 5,
        privateGuardStatus: 'protected',
      }),
    ).toEqual([
      { label: 'Coverage', value: '84%' },
      { label: 'Ready Surface', value: '12' },
      { label: 'Used by apps', value: '5' },
      {
        label: 'Private guard',
        value: 'protected',
        valueClassName: 'text-state-success-text',
      },
    ]);
  });

  it('migration metadata itemlarini sayisal ozet olarak uretir', () => {
    expect(
      resolveDesignLabMigrationMetadataItems({
        layerId: 'components',
        adoptedCount: 18,
        consumerAppsCount: 6,
        storyCoveragePercent: 92,
        stableOnlyLabCount: 4,
      }),
    ).toEqual([
      { label: 'Adopted', value: '18' },
      { label: 'Consumer apps', value: '6' },
      { label: 'Story coverage', value: '92%' },
      { label: 'Stable only lab', value: '4' },
    ]);
  });

  it('foundation quality branchinde status tonalitesini descriptor olarak tasir', () => {
    expect(
      resolveDesignLabFoundationMetadataItems({
        detailTab: 'quality',
        activeWorkspaceLabel: 'Foundations workspace',
        primaryLensLabel: 'Primary Lens',
        primaryLensValue: 'Foundations',
        familyTitle: 'Theme, Tokens & Appearance',
        benchmark: 'Ant Design / Material UI',
        trackLabel: 'Track',
        trackValue: 'Wave',
        visibleCount: 6,
        contractId: 'foundation.contract.v1',
        kind: 'registry',
        qualityGatesCount: 3,
        statusLabel: 'Stable',
        statusValueClassName: 'text-state-success-text',
        availabilityValue: 'Exported',
      }),
    ).toEqual([
      { label: 'Quality gates', value: '3' },
      {
        label: 'Status',
        value: 'Stable',
        valueClassName: 'text-state-success-text',
      },
      { label: 'Availability', value: 'Exported' },
      { label: 'Benchmark', value: 'Ant Design / Material UI' },
    ]);
  });

  it('component api props branchinde sayisal ozetleri korur', () => {
    expect(
      resolveDesignLabComponentMetadataItems({
        detailTab: 'api',
        activeComponentApiPanel: 'props',
        activeComponentQualityPanel: 'gates',
        primaryLensLabel: 'Primary Lens',
        primaryLensValue: 'Components',
        trackValue: 'Wave',
        groupValue: 'Navigation & Wayfinding',
        demoValue: 'Live',
        usageLabel: 'Usage',
        usageCount: 6,
        kind: 'primitive',
        contractId: 'component.contract.v1',
        variantAxesCount: 4,
        stateModelCount: 2,
        previewFocusCount: 3,
        regressionCount: 5,
        propsCount: 12,
        requiredPropsCount: 4,
        defaultsCount: 7,
        usageRecipeCount: 3,
        whereUsedCount: 6,
        qualityGatesCount: 2,
        statusLabel: 'Stable',
        statusValueClassName: 'text-state-success-text',
        availabilityValue: 'Exported',
        packageName: '@mfe/design-system',
      }),
    ).toEqual([
      { label: 'Props', value: '12' },
      { label: 'Required', value: '4' },
      { label: 'Defaults', value: '7' },
    ]);
  });

  it('lens guide component benzeri katmanda family ve benchmark alanlarini korur', () => {
    expect(
      resolveDesignLabLensGuideMetadataItems({
        layerId: 'foundations',
        activeWorkspaceLabel: 'Foundations workspace',
        activeLensLabel: 'Foundations',
        activeLensTitle: 'Theme, Tokens & Appearance',
        activeLensNote: 'Core system layer',
        activeLensUseWhen: 'Token governance and appearance decisions',
        familyTitle: 'Theme, Tokens & Appearance',
        familyNote: 'Ant Design / Material UI parity',
        benchmark: 'Ant Design / Material UI',
        benchmarkNote: 'Foundation benchmark line',
        clusterTitle: null,
        clusterDescription: null,
      }),
    ).toEqual([
      {
        label: 'Workspace',
        value: 'Foundations workspace',
        note: 'Design Lab aktif calisma modu',
      },
      {
        label: 'Lens',
        value: 'Foundations',
        note: 'Core system layer',
      },
      {
        label: 'Use when',
        value: 'Theme, Tokens & Appearance',
        note: 'Token governance and appearance decisions',
      },
      {
        label: 'Family',
        value: 'Theme, Tokens & Appearance',
        note: 'Ant Design / Material UI parity',
      },
      {
        label: 'Benchmark',
        value: 'Ant Design / Material UI',
        note: 'Foundation benchmark line',
      },
    ]);
  });

  it('lens guide page katmaninda page family bilgisini page-first dondurur', () => {
    expect(
      resolveDesignLabLensGuideMetadataItems({
        layerId: 'pages',
        activeWorkspaceLabel: 'Pages workspace',
        activeLensLabel: 'Pages',
        activeLensTitle: 'Dashboard Template',
        activeLensNote: 'Page shell catalog',
        activeLensUseWhen: 'Compose reusable page templates',
        familyTitle: null,
        familyNote: null,
        benchmark: null,
        benchmarkNote: null,
        clusterTitle: 'Dashboard templates',
        clusterDescription: 'Operational dashboards and shell layouts',
      }),
    ).toEqual([
      {
        label: 'Workspace',
        value: 'Pages workspace',
        note: 'Design Lab aktif calisma modu',
      },
      {
        label: 'Lens',
        value: 'Pages',
        note: 'Page shell catalog',
      },
      {
        label: 'Use when',
        value: 'Dashboard Template',
        note: 'Compose reusable page templates',
      },
      {
        label: 'Page family',
        value: 'Dashboard templates',
        note: 'Operational dashboards and shell layouts',
      },
    ]);
  });
});
