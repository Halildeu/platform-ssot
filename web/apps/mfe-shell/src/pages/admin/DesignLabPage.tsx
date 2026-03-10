import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Boxes, CircleHelp, MapIcon, Sparkles } from 'lucide-react';
import {
  AgGridServer,
  Badge,
  Button,
  DetailDrawer,
  Dropdown,
  Popover,
  ContextMenu,
  Empty,
  EntityGridTemplate,
  EntitySummaryBlock,
  FilterBar,
  FormDrawer,
  IconButton,
  LinkInline,
  Modal,
  PageHeader,
  PageLayout,
  ReportFilterPanel,
  Select,
  TextArea,
  TextInput,
  Checkbox,
  Radio,
  Switch,
  Slider,
  DatePicker,
  TimePicker,
  Upload,
  CommandPalette,
  RecommendationCard,
  ConfidenceBadge,
  ApprovalCheckpoint,
  ApprovalReview,
  AIGuidedAuthoring,
  CitationPanel,
  AIActionAuditTimeline,
  PromptComposer,
  DetailSummary,
  EmptyErrorLoading,
  TableSimple,
  Descriptions,
  List,
  JsonViewer,
  SearchFilterListing,
  Tree,
  TreeTable,
  Skeleton,
  Spinner,
  SummaryStrip,
  Pagination,
  Steps,
  Tag,
  Tabs,
  Text,
  ThemePreviewCard,
  Tooltip,
  TourCoachmarks,
  Avatar,
  ThemePresetCompare,
  ThemePresetGallery,
  AnchorToc,
  Breadcrumb,
  Divider,
} from 'mfe-ui-kit';
import {
  LibraryProductTree,
  LibraryQueryProvider,
  LibraryDocsSection,
  LibraryCodeBlock,
  LibrarySectionBadge as SectionBadge,
  LibraryDetailLabel as DetailLabel,
  LibraryPreviewPanel,
  LibraryShowcaseCard,
  LibraryMetricCard,
  LibraryDetailTabs,
  LibraryOutlinePanel,
  LibraryStatsPanel,
  LibraryMetadataPanel,
  LibraryPropsTable,
  LibraryUsageRecipesPanel,
  type LibraryProductTreeSelection,
  type LibraryProductTreeTrack,
} from '../../../../../packages/ui-kit/src/catalog/design-lab-internals';
import designLabIndexRaw from './design-lab.index.json';
import designLabTaxonomyRaw from './design-lab.taxonomy.v1.json';
import {
  designLabApiCatalogMeta,
  designLabApiItems,
  designLabIndexItems,
} from '../../../../../packages/ui-kit/src/catalog/component-docs';

type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
type DesignLabAvailability = 'exported' | 'planned';
type DesignLabDemoMode = 'live' | 'inspector' | 'planned';
type DesignLabTrack = 'new_packages' | 'current_system' | 'roadmap';
type DesignLabDetailTab = 'overview' | 'demo' | 'api' | 'ux' | 'quality';
type DesignLabWorkspaceMode = 'components' | 'recipes';
type DesignLabDemoGalleryMode = 'all' | 'live_only' | 'recipes_first';
type DemoSurfaceKind = 'live' | 'reference' | 'recipe';

type DesignLabIndexItem = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  tags?: string[];
  availability: DesignLabAvailability;
  lifecycle: DesignLabLifecycle;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  sectionIds: string[];
  qualityGates: string[];
  tags?: string[];
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
};

type DesignLabApiProp = {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
};

type DesignLabApiItem = {
  name: string;
  variantAxes: string[];
  stateModel: string[];
  props: DesignLabApiProp[];
  previewFocus: string[];
  regressionFocus: string[];
};

type DesignLabApiCatalog = {
  version: string;
  subject_id: string;
  wave_id: string;
  items: DesignLabApiItem[];
};

type DesignLabIndex = {
  version?: number;
  generatedAt?: string;
  generatedAtUtc?: string;
  summary?: {
    total: number;
    exported: number;
    planned: number;
    liveDemo: number;
    inspector: number;
  };
  release?: {
    packageName: string;
    packageVersion: string;
    packageJsonPath: string;
    contractId: string;
    contractPath: string;
    releaseNotesPath: string;
    versionScheme: string;
    requiredScripts: string[];
    stableReleaseRequires: string[];
    distributionTargets: Array<{
      targetId: string;
      channel: string;
      buildCommand: string;
      artifactCount: number;
      artifactPresentCount: number;
      artifacts: string[];
    }>;
    latestRelease: {
      version: string;
      date: string;
      changedComponents: string[];
      lifecycleChanges: string;
      breakingChanges: string;
      migrationNotes: string;
      evidenceRefs: string[];
      catalogMetrics?: {
        exported: number;
        planned: number;
        stable: number;
        beta: number;
        liveDemo: number;
        apiCatalogItems: number;
        apiCoveragePercent: number;
        wideAdoptionReady: number;
        requiredVisualHarnesses: number;
        storyCoveredComponents?: number;
        adoptedOutsideLab?: number;
        consumerAppsCount?: number;
        adoptedStoryCoveragePercent?: number;
      };
    };
    registrySummary: {
      stable: number;
      beta: number;
      apiCatalogItems: number;
    };
  };
  adoption?: {
    contractId: string;
    contractPath: string;
    previewRoute: string;
    packageImport: string;
    moduleFederation: {
      remoteName: string;
      exposes: string[];
    };
    surfaceSummary: {
      publicExports: number;
      stableExports: number;
      betaExports: number;
      liveDemoExports: number;
      consumedByAppsExports: number;
    };
    apiCoverage: {
      documentedExports: number;
      undocumentedExports: number;
      coveragePercent: number;
      liveDemoDocumentedExports: number;
    };
    releaseReadiness: {
      wideAdoptionReady: number;
      stableUndocumented: number;
      betaDocumented: number;
      betaUndocumented: number;
    };
    internalSurfaceProtection: {
      status: 'protected' | 'drifted';
      privateEntryPath: string;
      allowedConsumers: string[];
      runtimeExportsWithoutRegistry: number;
    };
    priorityBacklog: {
      usedUndocumented: string[];
      stableUndocumented: string[];
      betaUndocumented: string[];
    };
    consumerRules: string[];
    evidenceRefs: string[];
  };
  migration?: {
    contractId: string;
    upgradeContractPath?: string;
    artifactPath: string;
    summary: {
      adoptedOutsideLabComponents: number;
      stableAdoptedComponents: number;
      betaAdoptedComponents: number;
      consumerAppsCount: number;
      adoptedStoryCoveredComponents: number;
      adoptedStoryCoveragePercent: number;
      stableOnlyInDesignLab: number;
      singleAppBlastRadiusCount: number;
      crossAppReviewComponents: number;
      manualReviewRequiredComponents: number;
      codemodReadyComponents: number;
      ownerMappedAppsCount: number;
    };
    ownerResolution?: {
      contractId: string;
      contractPath: string;
      codeownersPath: string;
      defaultOwnerHandles: string[];
      ownerMappedAppsCount: number;
      unownedAppsCount: number;
      source: string;
      rules: string[];
    };
    upgradePlaybook?: {
      contractId: string;
      contractPath: string;
      defaultStrategy: string;
      codemodSupport: string;
      summary: {
        trackCount: number;
        singleAppBlastRadiusCount: number;
        crossAppReviewComponents: number;
        manualChecklistComponents: number;
        codemodReadyComponents: number;
      };
      tracks: Array<{
        track_id: string;
        label: string;
        automation: string;
        trigger: string;
      }>;
    };
    upgradeChecklist?: {
      artifactPath: string;
      generatedStrategy: string;
      summary: {
        totalItems: number;
        singleAppItems: number;
        crossAppItems: number;
        ownerMappedAppsCount: number;
      };
      items: Array<{
        checklistId: string;
        component: string;
        classId: string;
        semver: string;
        migrationTrack: string;
        ownerHandles: string[];
        consumerApps: Array<{
          appId: string;
          ownerHandles: string[];
          ownerSource: string;
        }>;
        tasks: string[];
        evidenceRefs: string[];
        codemodReady: boolean;
      }>;
    };
    semverGuidance?: {
      recommendedBump: string;
      reason: string;
      releaseNotesLabel: string;
      summary: {
        patchSafeLabOnly: number;
        minorSingleAppReview: number;
        minorBetaExternalReview: number;
        majorCrossAppReview: number;
      };
      majorComponents: string[];
      minorComponents: string[];
      patchCandidates: string[];
    };
    changeClasses?: {
      summary: {
        patchSafeLabOnly: number;
        minorSingleAppReview: number;
        minorBetaExternalReview: number;
        majorCrossAppReview: number;
        manualReviewRequired: number;
      };
      components: Array<{
        name: string;
        lifecycle: string;
        consumerApps: string[];
        consumerAppCount: number;
        classId: string;
        semver: string;
        migrationTrack: string;
        ownerHandles?: string[];
      }>;
    };
    consumerApps: Array<{
      appId: string;
      componentCount: number;
      components: string[];
      singleAppComponents?: string[];
      sharedComponents?: string[];
      highestChangeClass?: string;
      ownerHandles?: string[];
      ownerSource?: string;
    }>;
    priorityBacklog: {
      betaUsedOutsideLab: string[];
      adoptedWithoutStory: string[];
      stableOnlyInDesignLab: string[];
      singleAppBlastRadius: string[];
    };
    rules: string[];
    evidenceRefs: string[];
  };
  visualRegression?: {
    contractId: string;
    storybook: {
      configPath: string;
      previewPath: string;
      buildConfigPath: string;
      buildCommand: string;
      chromaticCommand: string;
      chromaticTriggerPath: string;
      staticOutputPath: string;
    };
    summary: {
      designLabLiveDemoExports: number;
      storybookStoryFiles: number;
      mdxDocFiles: number;
      requiredHarnessCount: number;
      requiredHarnessPresentCount: number;
      visualizableComponents: number;
      storybookCoveredComponents: number;
      mdxCoveredComponents: number;
      combinedCoveredComponents: number;
      storyCoveragePercent: number;
      releaseReadyComponents: number;
      releaseReadyStoryCoveredComponents: number;
      releaseReadyCoveragePercent: number;
      adoptedOutsideLabComponents: number;
      adoptedStoryCoveredComponents: number;
      adoptedCoveragePercent: number;
    };
    requiredHarnesses: Array<{
      path: string;
      present: boolean;
    }>;
    coverageBacklog: {
      stableWithoutStory: string[];
      adoptedWithoutStory: string[];
      liveDemoWithoutStory: string[];
    };
    rules: string[];
    evidenceRefs: string[];
  };
  themePresets?: {
    catalogId: string;
    sourceOfTruth: string;
    defaultMode: string;
    compareAxes: string[];
    presets: Array<{
      presetId: string;
      themeMode: string;
      label: string;
      appearance: string;
      density: string;
      intent: string;
      isHighContrast: boolean;
      isDefaultMode: boolean;
    }>;
    rules: string[];
    successCriteria: string[];
  };
  recipes?: {
    contractId: string;
    currentFamilies: Array<{
      recipeId: string;
      ownerBlocks: string[];
      intent: string;
    }>;
    plannedFamilies: string[];
    rules: string[];
    successCriteria: string[];
  };
  items: DesignLabIndexItem[];
};

type DesignLabTaxonomyGroup = {
  id: string;
  title: string;
  subgroups: string[];
};

type DesignLabTaxonomy = {
  version: string;
  defaults: {
    showEmptyGroups: boolean;
    showEmptySubgroups: boolean;
    defaultView: string;
    advancedToggleLabel: string;
  };
  groups: DesignLabTaxonomyGroup[];
};

const designLabIndex = {
  ...(designLabIndexRaw as DesignLabIndex),
  items: designLabIndexItems as DesignLabIndexItem[],
} as DesignLabIndex;
const designLabTaxonomy = designLabTaxonomyRaw as DesignLabTaxonomy;
const componentApiCatalog = {
  ...designLabApiCatalogMeta,
  items: designLabApiItems as DesignLabApiItem[],
} as DesignLabApiCatalog;
const avatarPreviewImageSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='32' fill='%23E38B2C'/%3E%3Ccircle cx='64' cy='50' r='24' fill='%23FFF5E8'/%3E%3Cpath d='M30 110c8-18 22-28 34-28s26 10 34 28' fill='%23FFF5E8'/%3E%3C/svg%3E";

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
};

const statusToneClass: Record<DesignLabLifecycle, string> = {
  stable: 'text-state-success-text',
  beta: 'text-state-warning-text',
  planned: 'text-state-info-text',
};

const statusLabel: Record<DesignLabLifecycle, string> = {
  stable: 'Stable',
  beta: 'Beta',
  planned: 'Planned',
};

const availabilityLabel: Record<DesignLabAvailability, string> = {
  exported: 'Exported',
  planned: 'Roadmap',
};

const demoModeLabel: Record<DesignLabDemoMode, string> = {
  live: 'Live Preview',
  inspector: 'Inspector',
  planned: 'Planned',
};

const componentApiMap = new Map(componentApiCatalog.items.map((item) => [item.name, item]));

const buildUsagePropValue = (prop: DesignLabApiProp): string => {
  if (prop.name === 'children') return '"Ornek icerik"';
  if (prop.type.includes('ReactNode')) return '"Ornek icerik"';
  if (prop.type.includes('string')) {
    if (prop.name.toLowerCase().includes('email')) return '"admin@example.com"';
    if (prop.name.toLowerCase().includes('placeholder')) return '"Deger gir..."';
    if (prop.name.toLowerCase().includes('label')) return '"Alan etiketi"';
    return '"ornek"';
  }
  if (prop.type.includes('boolean')) return 'true';
  if (prop.type.includes('number')) return '0';
  if (prop.name.toLowerCase().includes('items')) return '[/* items */]';
  if (prop.name.toLowerCase().includes('columns') || prop.name.toLowerCase().includes('defs')) return '[/* columns */]';
  if (prop.name.toLowerCase().startsWith('on')) return '() => {}';
  if (prop.type.includes('[]')) return '[/* values */]';
  return '{/* TODO */}';
};

const buildUsageRecipes = (item: DesignLabIndexItem, apiItem?: DesignLabApiItem | null) => {
  const importStatement = item.importStatement || `import { ${item.name} } from 'mfe-ui-kit';`;
  const requiredProps = (apiItem?.props ?? []).filter((prop) => prop.required);
  const exampleProps = requiredProps.slice(0, 2);
  const openTagProps = exampleProps
    .map((prop) => `  ${prop.name}=${buildUsagePropValue(prop)}`)
    .join('\n');
  const basicCode = `${importStatement}\n\nexport function Example() {\n  return (\n    <${item.name}${openTagProps ? `\n${openTagProps}` : ''}${exampleProps.some((prop) => prop.name === 'children') ? '' : ''}\n    />\n  );\n}`;

  const recipes: Array<{ title: string; description: string; code: string; badges?: React.ReactNode }> = [
    {
      title: 'Temel kullanim',
      description: 'Paket importu ve minimum API ile güvenli başlangıç reçetesi.',
      code: basicCode,
      badges: <SectionBadge label={item.lifecycle === 'stable' ? 'Stable recipe' : 'Beta recipe'} />,
    },
  ];

  const controlledProps = (apiItem?.props ?? []).filter(
    (prop) => ['value', 'checked', 'open', 'selectedId'].includes(prop.name) || prop.name.startsWith('on'),
  );
  if (controlledProps.length > 0) {
    const controlledCode = `${importStatement}\n\nexport function ControlledExample() {\n  const [state, setState] = React.useState(${controlledProps.some((prop) => prop.name === 'checked' || prop.type.includes('boolean')) ? 'false' : "''"});\n\n  return (\n    <${item.name}\n      ${controlledProps.some((prop) => prop.name === 'value') ? "value={state}\n      onChange={(event) => setState(event.target.value)}" : ''}${
        controlledProps.some((prop) => prop.name === 'checked') ? "checked={state}\n      onChange={(event) => setState(event.target.checked)}" : ''
      }${controlledProps.some((prop) => prop.name === 'open') ? "open={state}\n      onOpenChange={setState}" : ''}\n    />\n  );\n}`;
    recipes.push({
      title: 'Controlled state',
      description: 'Form veya shell state ile yönetilen kullanım kalıbı.',
      code: controlledCode.replace(/\n\s*\n\s*\n/g, '\n\n'),
      badges: <SectionBadge label="Controlled" />,
    });
  }

  recipes.push({
    title: 'Ops / quality note',
    description: 'Wave gate, browser doctor ve registry sözleşmesiyle hizalı kullanım notu.',
    code: `// Gate odaklari\n// - UX alignment: ${item.uxPrimaryThemeId ?? 'none'} / ${item.uxPrimarySubthemeId ?? 'none'}\n// - Quality gates: ${(item.qualityGates ?? []).join(', ') || 'none'}\n// - Registry track: ${trackMeta[resolveItemTrack(item)].label}\n${importStatement}`,
    badges: <SectionBadge label="Governed usage" />,
  });

  return recipes;
};

const buildReleaseFamilyContext = (
  item: DesignLabIndexItem | null,
  selectedGroupTitle: string | null,
  releaseSummary: DesignLabIndex['release'],
) => {
  if (!item || !releaseSummary) return null;
  const familyLabel = selectedGroupTitle ?? item.taxonomyGroupId;
  const subgroupLabel = item.taxonomySubgroup;
  const waveLabel = item.roadmapWaveId ?? 'legacy_surface';
  const changedTokens = new Set(
    releaseSummary.latestRelease.changedComponents.map((entry) => entry.trim().toLowerCase()),
  );
  const familyTouched =
    changedTokens.has(item.taxonomyGroupId.toLowerCase()) ||
    changedTokens.has(subgroupLabel.toLowerCase()) ||
    changedTokens.has(waveLabel.toLowerCase()) ||
    changedTokens.has(familyLabel.toLowerCase().replace(/\s+/g, '_'));

  return {
    familyLabel,
    subgroupLabel,
    waveLabel,
    familyTouched,
    note: familyTouched
      ? 'Son release notunda bu family veya wave ile ortusen bir degisim izi var.'
      : 'Son release daha cok platform ve dagitim hattina odakli; bu family icin dogrudan bir degisim etiketi yok.',
  };
};

const buildRelatedRecipes = (
  item: DesignLabIndexItem | null,
  recipeSummary: DesignLabIndex['recipes'],
) => {
  if (!item || !recipeSummary) return [];
  const recipeLikeId = item.name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  return recipeSummary.currentFamilies.filter(
    (recipe) => recipe.ownerBlocks.includes(item.name) || recipe.recipeId === recipeLikeId,
  );
};

const toTestIdSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const trackMeta: Record<DesignLabTrack, { label: string; note: string }> = {
  new_packages: {
    label: 'Yeni Paketler',
    note: 'Wave kontratıyla üretilen yeni component ailesi.',
  },
  current_system: {
    label: 'Eski Sistem',
    note: 'Repoda zaten kullanılan önceki export seti.',
  },
  roadmap: {
    label: 'Roadmap',
    note: 'Henüz export edilmemiş planlı component backlog’u.',
  },
};

const resolveItemTrack = (item: DesignLabIndexItem): DesignLabTrack => {
  if (item.availability === 'planned' || item.demoMode === 'planned') {
    return 'roadmap';
  }
  if (item.roadmapWaveId || item.acceptanceContractId) {
    return 'new_packages';
  }
  return 'current_system';
};

const trackVisualMeta: Record<
  DesignLabTrack,
  {
    accentClass: string;
    borderClass: string;
    badgeTone: 'info' | 'warning' | 'muted';
    eyebrow: string;
  }
> = {
  new_packages: {
    accentClass: 'bg-action-primary',
    borderClass: 'border-action-primary-border',
    badgeTone: 'info',
    eyebrow: 'Wave',
  },
  current_system: {
    accentClass: 'bg-border-default',
    borderClass: 'border-border-default',
    badgeTone: 'muted',
    eyebrow: 'Legacy',
  },
  roadmap: {
    accentClass: 'bg-state-warning-border',
    borderClass: 'border-state-warning-border',
    badgeTone: 'warning',
    eyebrow: 'Planned',
  },
};

const detailTabMeta: Array<{
  id: DesignLabDetailTab;
  label: string;
  description: string;
}> = [
  { id: 'overview', label: 'Overview', description: 'Kısa özet, durum ve karar çerçevesi' },
  { id: 'demo', label: 'Demo', description: 'Aşağı doğru akan çoklu varyant showcase alanı' },
  { id: 'api', label: 'API', description: 'Import, props, variant axes ve state modeli' },
  { id: 'ux', label: 'UX', description: 'UX katalog hizası ve north-star bağları' },
  { id: 'quality', label: 'Quality', description: 'Gate, regression ve kullanım kanıtları' },
];

type ComponentShowcaseSection = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: string[];
  kind?: DemoSurfaceKind;
  content: React.ReactNode;
};

type DesignLabRecipeFamily = NonNullable<NonNullable<DesignLabIndex['recipes']>['currentFamilies']>[number];

type PreviewPanelProps = React.ComponentProps<typeof LibraryPreviewPanel> & {
  kind?: DemoSurfaceKind;
};

const demoGalleryModeOptions: Array<{
  id: DesignLabDemoGalleryMode;
  label: string;
  note: string;
}> = [
  {
    id: 'all',
    label: 'Tüm yüzeyler',
    note: 'Canlı demo, referans ve tarif kartlarını birlikte gösterir.',
  },
  {
    id: 'live_only',
    label: 'Demo only',
    note: 'Not ve referans panelleri gizler; yalnız canlı yüzeyleri bırakır.',
  },
  {
    id: 'recipes_first',
    label: 'Recipes first',
    note: 'Önce tüketim tariflerini, sonra component varyantlarını gösterir.',
  },
];

const demoSurfaceMeta: Record<
  DemoSurfaceKind,
  {
    label: string;
    badgeClassName: string;
    panelClassName: string;
  }
> = {
  live: {
    label: 'LIVE',
    badgeClassName: 'border-state-success-border bg-state-success-bg text-state-success-text',
    panelClassName: 'border-state-success-border/35',
  },
  reference: {
    label: 'REFERENCE',
    badgeClassName: 'border-border-subtle bg-surface-muted text-text-secondary',
    panelClassName: 'border-border-subtle bg-surface-muted/30',
  },
  recipe: {
    label: 'RECIPE',
    badgeClassName: 'border-state-warning-border bg-state-warning-bg text-state-warning-text',
    panelClassName: 'border-state-warning-border/35',
  },
};

const DemoGalleryModeContext = React.createContext<DesignLabDemoGalleryMode>('all');

const normalizeDemoSurfaceText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const includesAnyDemoToken = (value: string, tokens: string[]) =>
  tokens.some((token) => value.includes(token));

const resolvePreviewPanelKind = (title: string, explicitKind?: DemoSurfaceKind): DemoSurfaceKind => {
  if (explicitKind) return explicitKind;

  const normalized = normalizeDemoSurfaceText(title);
  if (includesAnyDemoToken(normalized, ['recipe', 'consume contract', 'consumer handoff', 'direct recipes'])) {
    return 'recipe';
  }
  if (
    includesAnyDemoToken(normalized, [
      'guideline',
      'usage note',
      'rule of thumb',
      'contract note',
      'policy note',
      'governance note',
      'audit note',
      'reading guidance',
      'guidance',
      'interpretation',
      'why use it',
      'why this matters',
      'selected ',
      'current ',
      'summary',
      'payload summary',
      'policy snapshot',
      'contract',
      'live state',
      'panel state',
      'shared state',
      'current command state',
      'selected source',
      'selected event',
      'selected citation',
      'kullanim notu',
      'dogru kullanim notu',
    ])
  ) {
    return 'reference';
  }
  return 'live';
};

const resolveShowcaseSectionKind = (section: ComponentShowcaseSection): DemoSurfaceKind => {
  if (section.kind) return section.kind;

  const normalized = normalizeDemoSurfaceText(
    [section.id, section.title, section.description ?? '', ...(section.badges ?? [])].join(' '),
  );

  if (includesAnyDemoToken(normalized, ['recipe', 'recipes', 'consume contract', 'consumer handoff'])) {
    return 'recipe';
  }
  if (
    includesAnyDemoToken(normalized, [
      'guideline',
      'usage note',
      'rule of thumb',
      'contract note',
      'policy note',
      'governance note',
      'audit note',
      'reading guidance',
      'guidance',
      'interpretation',
      'why use it',
      'why this matters',
    ])
  ) {
    return 'reference';
  }
  return 'live';
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ title, children, className, kind }) => {
  const demoGalleryMode = React.useContext(DemoGalleryModeContext);
  const resolvedKind = resolvePreviewPanelKind(title, kind);

  if (demoGalleryMode === 'live_only' && resolvedKind !== 'live') {
    return null;
  }

  return (
    <div
      data-demo-panel-kind={resolvedKind}
      className={[
        'rounded-2xl border bg-surface-default p-4',
        demoSurfaceMeta[resolvedKind].panelClassName,
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DetailLabel className="text-xs">{title}</DetailLabel>
        <SectionBadge label={demoSurfaceMeta[resolvedKind].label} className={demoSurfaceMeta[resolvedKind].badgeClassName} />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
};

const DesignLabPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [recipeQuery, setRecipeQuery] = useState('');
  const [detailTab, setDetailTab] = useState<DesignLabDetailTab>('overview');
  const [workspaceMode, setWorkspaceMode] = useState<DesignLabWorkspaceMode>('components');
  const [treeSelection, setTreeSelection] = useState<LibraryProductTreeSelection>({
    trackId: 'new_packages',
    groupId: 'ai_helpers',
    subgroupId: 'command_palette',
    itemId: 'CommandPalette',
  });
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(designLabIndex.recipes?.currentFamilies[0]?.recipeId ?? null);
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contextMenuAction, setContextMenuAction] = useState('Henüz seçim yok');
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [readonlyFormDrawerOpen, setReadonlyFormDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('comfortable');
  const [textInputValue, setTextInputValue] = useState('Nova kullanıcı');
  const [searchInputValue, setSearchInputValue] = useState('Denetim planı');
  const [inviteInputValue, setInviteInputValue] = useState('ops@nova.io');
  const [textAreaValue, setTextAreaValue] = useState(
    'Açıklama alanı inline yardım, hata ve karakter sayacı ile birlikte form deneyimini tamamlar.',
  );
  const [commentValue, setCommentValue] = useState(
    'Bu alan yorum, not ve açıklama akışlarında otomatik yükseklik ile çalışmalı.',
  );
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [radioValue, setRadioValue] = useState<'design' | 'ops' | 'delivery'>('design');
  const [switchValue, setSwitchValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(68);
  const [dateValue, setDateValue] = useState('2026-03-21');
  const [timeValue, setTimeValue] = useState('14:30');
  const [uploadFiles, setUploadFiles] = useState([
    { name: 'policy-draft.pdf', size: 245_000, type: 'application/pdf' },
    { name: 'control-matrix.xlsx', size: 82_000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  ]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState('');
  const [lastCommandSelection, setLastCommandSelection] = useState<string | null>(null);
  const [recommendationDecision, setRecommendationDecision] = useState<'pending' | 'applied' | 'review'>('pending');
  const [approvalCheckpointState, setApprovalCheckpointState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>('policy-4-2');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>('audit-draft');
  const [promptSubject, setPromptSubject] = useState('Quarterly ethics review');
  const [promptBody, setPromptBody] = useState(
    'Prepare a concise approval-ready summary for ethics program findings. Highlight high-risk items, cite the governing policy sections and keep the tone strict but neutral.',
  );
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourStatus, setTourStatus] = useState<'idle' | 'guided' | 'finished'>('idle');
  const [promptScope, setPromptScope] = useState<'general' | 'approval' | 'policy' | 'release'>('approval');
  const [promptTone, setPromptTone] = useState<'neutral' | 'strict' | 'exploratory'>('strict');
  const policyTableRows = [
    { policy: 'Etik Politikası', owner: 'Uyum', status: 'Aktif', updatedAt: '06 Mar 2026' },
    { policy: 'Hediye & Ağırlama', owner: 'Hukuk', status: 'Taslak', updatedAt: '05 Mar 2026' },
    { policy: 'Çıkar Çatışması', owner: 'İK', status: 'Onay Bekliyor', updatedAt: '04 Mar 2026' },
  ];
  const rolloutDescriptionItems = [
    { key: 'owner', label: 'Sahip', value: 'Uyum Operasyonları', helper: 'Canary ve rollout kararını veren ekip.' },
    { key: 'scope', label: 'Kapsam', value: 'Tüm bağlı ortaklıklar', tone: 'info' as const, span: 2 as const },
    { key: 'status', label: 'Durum', value: 'Aktif', tone: 'success' as const },
    { key: 'review', label: 'Son gözden geçirme', value: '07 Mar 2026', helper: 'Change approval snapshot ile eşli.' },
  ];
  const listItems = [
    {
      key: 'triage',
      title: 'Release evidence triage',
      description: 'Security ve rollout kanıtları tamamlanmadan publish penceresi açılmıyor.',
      meta: 'P0',
      badges: ['Blocked'],
      tone: 'warning' as const,
    },
    {
      key: 'doctor',
      title: 'Frontend doctor summary',
      description: 'UI Library, shell-public ve auth route preset’leri tek raporda toplandı.',
      meta: 'PASS',
      badges: ['Doctor'],
      tone: 'success' as const,
    },
    {
      key: 'residual',
      title: 'Residual risk review',
      description: 'Jackon residual review tarihi yaklaşmadan güncelleme planı hazırlanmalı.',
      meta: 'MEDIUM',
      badges: ['Security'],
      tone: 'info' as const,
    },
  ];
  const jsonViewerValue = {
    release: {
      waveId: 'wave_4_data_display',
      focus: ['TableSimple', 'Descriptions', 'AgGridServer', 'EntityGridTemplate', 'List', 'JsonViewer'],
      evidence: {
        doctor: 'PASS',
        uiKitTests: 'PASS',
        gate: 'PASS',
      },
    },
    policy: {
      rollout: {
        mode: 'doctor-first',
        security: 'fail-closed',
      },
      owners: {
        frontend: 'platform-ui',
        governance: 'ux-catalog',
      },
    },
  };
  const treeNodes = [
    {
      key: 'release',
      label: 'Release Control Plane',
      description: 'Gate, doctor ve security kanitlarini tek hiyerarside toplar.',
      meta: 'root',
      badges: ['Stable'],
      tone: 'info' as const,
      children: [
        {
          key: 'doctor',
          label: 'Doctor evidence',
          description: 'Frontend doctor preset ciktilari.',
          meta: 'PASS',
          badges: ['ui-library'],
          tone: 'success' as const,
          children: [
            {
              key: 'doctor-ui-library',
              label: 'UI Library walkthrough',
              description: 'Console/pageerror ve click-walk sonucu temiz.',
              meta: '5 step',
            },
            {
              key: 'doctor-shell',
              label: 'Shell public preset',
              description: 'Login ve public route zinciri PASS.',
              meta: '3 route',
            },
          ],
        },
        {
          key: 'security',
          label: 'Security contract',
          description: 'Residual risk ve live provisioning kurallari.',
          meta: 'review',
          badges: ['Policy'],
          tone: 'warning' as const,
          children: [
            {
              key: 'security-residual',
              label: 'Residual review',
              description: 'Takvimli kalan riskler zorunlu review ile izlenir.',
              meta: 'Apr-15',
            },
          ],
        },
      ],
    },
  ];
  const treeTableNodes = [
    {
      key: 'platform-ui',
      label: 'Platform UI',
      description: 'Ortak tasarim sistemi owner ekibi.',
      meta: 'stable',
      badges: ['Owner'],
      tone: 'info' as const,
      data: { owner: 'Platform UI', status: 'Stable', scope: 'Global' },
      children: [
        {
          key: 'ui-library-surface',
          label: 'UI Library',
          description: 'Docs, preview ve API katalog yuzeyi.',
          meta: 'wave-4',
          badges: ['Data display'],
          tone: 'success' as const,
          data: { owner: 'Design Ops', status: 'Beta', scope: 'Docs' },
        },
        {
          key: 'delivery-gates',
          label: 'Delivery gates',
          description: 'Wave gate ve doctor evidence zinciri.',
          meta: 'doctor',
          badges: ['QA'],
          tone: 'warning' as const,
          data: { owner: 'Release Ops', status: 'PASS', scope: 'Delivery' },
        },
      ],
    },
  ];
  const [dropdownAction, setDropdownAction] = useState('Henüz seçim yok');
  const [reportStatus, setReportStatus] = useState('Filtre bekleniyor');
  const [tabsValue, setTabsValue] = useState('overview');
  const [paginationPage, setPaginationPage] = useState(6);
  const [stepsValue, setStepsValue] = useState('review');
  const [stepsStatusRichValue, setStepsStatusRichValue] = useState('preview');
  const [anchorValue, setAnchorValue] = useState('overview');
  const [demoGalleryMode, setDemoGalleryMode] = useState<DesignLabDemoGalleryMode>('all');
  const [sectionLockEnabled, setSectionLockEnabled] = useState(true);

  const activeTrack = (treeSelection.trackId as DesignLabTrack | null) ?? 'new_packages';

  const normalizedQuery = query.trim().toLowerCase();

  const itemsForTrack = useMemo(
    () => designLabIndex.items.filter((item) => resolveItemTrack(item) === activeTrack),
    [activeTrack],
  );

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return itemsForTrack;
    return itemsForTrack.filter((item) => {
      const haystack = [
        item.name,
        item.kind,
        item.lifecycle,
        item.availability,
        item.taxonomyGroupId,
        item.taxonomySubgroup,
        item.description,
        ...(item.sectionIds ?? []),
        ...(item.qualityGates ?? []),
        ...((item.tags ?? []) as string[]),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [itemsForTrack, normalizedQuery]);

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.name === treeSelection.itemId) ?? filteredItems[0] ?? null,
    [filteredItems, treeSelection.itemId],
  );

  const selectedGroup = useMemo(
    () => designLabTaxonomy.groups.find((group) => group.id === treeSelection.groupId) ?? null,
    [treeSelection.groupId],
  );

  const summary = useMemo(() => {
    const items = designLabIndex.items;
    return {
      total: items.length,
      exported: items.filter((item) => item.availability === 'exported').length,
      planned: items.filter((item) => item.availability === 'planned').length,
      stable: items.filter((item) => item.lifecycle === 'stable').length,
      beta: items.filter((item) => item.lifecycle === 'beta').length,
      liveDemo: items.filter((item) => item.demoMode === 'live').length,
    };
  }, []);

  const releaseSummary = designLabIndex.release ?? null;
  const adoptionSummary = designLabIndex.adoption ?? null;
  const migrationSummary = designLabIndex.migration ?? null;
  const visualRegressionSummary = designLabIndex.visualRegression ?? null;
  const themePresetSummary = designLabIndex.themePresets ?? null;
  const recipeSummary = designLabIndex.recipes ?? null;
  const readyDistributionTargetCount = useMemo(
    () =>
      releaseSummary?.distributionTargets.filter(
        (target) => target.artifactCount === 0 || target.artifactPresentCount === target.artifactCount,
      ).length ?? 0,
    [releaseSummary],
  );
  const relatedRecipes = useMemo(
    () => buildRelatedRecipes(selectedItem, recipeSummary),
    [recipeSummary, selectedItem],
  );
  const recipeFamilies = recipeSummary?.currentFamilies ?? [];
  const normalizedRecipeQuery = recipeQuery.trim().toLowerCase();
  const filteredRecipeFamilies = useMemo(() => {
    if (!normalizedRecipeQuery) return recipeFamilies;
    return recipeFamilies.filter((recipe) => {
      const haystack = [recipe.recipeId, recipe.intent, ...recipe.ownerBlocks].join(' ').toLowerCase();
      return haystack.includes(normalizedRecipeQuery);
    });
  }, [recipeFamilies, normalizedRecipeQuery]);
  const selectedRecipe = useMemo(
    () => filteredRecipeFamilies.find((recipe) => recipe.recipeId === selectedRecipeId)
      ?? recipeFamilies.find((recipe) => recipe.recipeId === selectedRecipeId)
      ?? filteredRecipeFamilies[0]
      ?? recipeFamilies[0]
      ?? null,
    [filteredRecipeFamilies, recipeFamilies, selectedRecipeId],
  );
  const selectedRecipeItems = useMemo(
    () =>
      (selectedRecipe?.ownerBlocks ?? [])
        .map((owner) => designLabIndex.items.find((item) => item.name === owner) ?? null)
        .filter((item): item is DesignLabIndexItem => Boolean(item)),
    [selectedRecipe],
  );
  const selectedRecipeTracks = useMemo(
    () =>
      Array.from(
        new Set(selectedRecipeItems.map((item) => trackMeta[resolveItemTrack(item)].label)),
      ),
    [selectedRecipeItems],
  );
  const selectedRecipeSections = useMemo(
    () =>
      Array.from(
        new Set(selectedRecipeItems.flatMap((item) => item.sectionIds ?? [])),
      ),
    [selectedRecipeItems],
  );
  const selectedRecipeThemes = useMemo(
    () =>
      Array.from(
        new Set(
          selectedRecipeItems.flatMap((item) =>
            [item.uxPrimaryThemeId, item.uxPrimarySubthemeId].filter(Boolean) as string[],
          ),
        ),
      ),
    [selectedRecipeItems],
  );
  const selectedRecipeQualityGates = useMemo(
    () =>
      Array.from(
        new Set(selectedRecipeItems.flatMap((item) => item.qualityGates ?? [])),
      ),
    [selectedRecipeItems],
  );
  const themePresetGalleryItems = useMemo(
    () =>
      (themePresetSummary?.presets ?? []).map((preset) => ({
        presetId: preset.presetId,
        label: preset.label,
        themeMode: preset.themeMode,
        appearance: preset.appearance,
        density: preset.density,
        intent: preset.intent,
        isHighContrast: preset.isHighContrast,
        isDefaultMode: preset.isDefaultMode,
      })),
    [themePresetSummary],
  );
  const defaultThemePreset = useMemo(
    () => themePresetGalleryItems.find((preset) => preset.isDefaultMode) ?? themePresetGalleryItems[0] ?? null,
    [themePresetGalleryItems],
  );
  const contrastThemePreset = useMemo(
    () => themePresetGalleryItems.find((preset) => preset.isHighContrast) ?? themePresetGalleryItems[1] ?? null,
    [themePresetGalleryItems],
  );
  const compactThemePreset = useMemo(
    () =>
      themePresetGalleryItems.find(
        (preset) => typeof preset.density === 'string' && preset.density.toLowerCase() === 'compact',
      ) ?? null,
    [themePresetGalleryItems],
  );

  const trackSummary = useMemo(
    () => ({
      new_packages: designLabIndex.items.filter((item) => resolveItemTrack(item) === 'new_packages').length,
      current_system: designLabIndex.items.filter((item) => resolveItemTrack(item) === 'current_system').length,
      roadmap: designLabIndex.items.filter((item) => resolveItemTrack(item) === 'roadmap').length,
    }),
    [],
  );

  const componentHeroStats = useMemo(() => {
    if (!selectedItem) {
      return [];
    }
    return [
      { label: 'Track', value: trackMeta[resolveItemTrack(selectedItem)].label, note: 'Kaynağın ait olduğu yayın hattı' },
      { label: 'Grup', value: selectedGroup?.title ?? selectedItem.taxonomyGroupId, note: 'Ana gezinim ailesi' },
      { label: 'Demo', value: demoModeLabel[selectedItem.demoMode], note: 'Preview görünüm tipi' },
      { label: 'Kullanım', value: String(selectedItem.whereUsed.length), note: 'Tespit edilen kullanım noktası' },
    ];
  }, [selectedGroup, selectedItem]);
  const recipeHeroStats = useMemo(() => {
    if (!selectedRecipe) {
      return [];
    }
    return [
      { label: 'Owner Blocks', value: String(selectedRecipe.ownerBlocks.length), note: 'Recipe içindeki canonical component sayısı' },
      { label: 'Tracks', value: String(selectedRecipeTracks.length), note: 'Tüketilen yayın hattı sayısı' },
      { label: 'Sections', value: String(selectedRecipeSections.length), note: 'North-star kapsama alanı' },
      { label: 'Themes', value: String(selectedRecipeThemes.length), note: 'Bağlı UX tema ve alt tema sayısı' },
    ];
  }, [selectedRecipe, selectedRecipeSections.length, selectedRecipeThemes.length, selectedRecipeTracks.length]);
  const heroStats = workspaceMode === 'recipes' ? recipeHeroStats : componentHeroStats;
  const activeSubjectKey = workspaceMode === 'recipes' ? selectedRecipe?.recipeId ?? null : selectedItem?.name ?? null;

  const detailSectionRefs = useRef<Record<DesignLabDetailTab, HTMLElement | null>>({
    overview: null,
    demo: null,
    api: null,
    ux: null,
    quality: null,
  });
  const previousItemNameRef = useRef<string | null>(null);
  const sectionLockEnabledRef = useRef(sectionLockEnabled);
  const detailTabRef = useRef<DesignLabDetailTab>(detailTab);

  useEffect(() => {
    sectionLockEnabledRef.current = sectionLockEnabled;
  }, [sectionLockEnabled]);

  useEffect(() => {
    detailTabRef.current = detailTab;
  }, [detailTab]);

  useEffect(() => {
    if (workspaceMode !== 'recipes') return;
    if (selectedRecipe) return;
    if (!filteredRecipeFamilies.length) return;
    setSelectedRecipeId(filteredRecipeFamilies[0].recipeId);
  }, [filteredRecipeFamilies, selectedRecipe, workspaceMode]);

  useEffect(() => {
    setModalOpen(false);
    setContextMenuAction('Henüz seçim yok');
    setFormDrawerOpen(false);
    setReadonlyFormDrawerOpen(false);
    setDetailDrawerOpen(false);
    setTourOpen(false);
    setTourStep(0);
    setTourStatus('idle');
  }, [activeSubjectKey]);

  useEffect(() => {
    const previousItemName = previousItemNameRef.current;
    const itemChanged = Boolean(previousItemName && previousItemName !== activeSubjectKey);

    if (itemChanged) {
      if (sectionLockEnabledRef.current) {
        const lockedSection = detailTabRef.current;
        window.requestAnimationFrame(() => {
          detailSectionRefs.current[lockedSection]?.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      } else {
        setDetailTab('overview');
      }
    }

    previousItemNameRef.current = activeSubjectKey;
  }, [activeSubjectKey]);

  useEffect(() => {
    if (!selectedItem) return;

    const nextTrack = resolveItemTrack(selectedItem);
    const nextGroupId = selectedItem.taxonomyGroupId;
    const nextSubgroupId = selectedItem.taxonomySubgroup;
    const nextItemId = selectedItem.name;

    setTreeSelection((current) => {
      if (
        current.trackId === nextTrack &&
        current.groupId === nextGroupId &&
        current.subgroupId === nextSubgroupId &&
        current.itemId === nextItemId
      ) {
        return current;
      }

      return {
        trackId: nextTrack,
        groupId: nextGroupId,
        subgroupId: nextSubgroupId,
        itemId: nextItemId,
      };
    });
  }, [selectedItem]);

  useEffect(() => {
    const sections = detailTabMeta
      .map((entry) => ({ id: entry.id, element: detailSectionRefs.current[entry.id] }))
      .filter((entry): entry is { id: DesignLabDetailTab; element: HTMLElement } => Boolean(entry.element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
        const next = visible[0]?.target.id.replace('design-lab-section-', '') as DesignLabDetailTab | undefined;
        if (next) {
          setDetailTab((current) => (current === next ? current : next));
        }
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.15, 0.4, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section.element));
    return () => observer.disconnect();
  }, [activeSubjectKey]);

  const scrollToDetailSection = (tabId: DesignLabDetailTab) => {
    setDetailTab(tabId);
    detailSectionRefs.current[tabId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const focusComponentFromRecipe = (item: DesignLabIndexItem) => {
    setWorkspaceMode('components');
    setTreeSelection({
      trackId: resolveItemTrack(item),
      groupId: item.taxonomyGroupId,
      subgroupId: item.taxonomySubgroup,
      itemId: item.name,
    });
  };

  const treeTracks = useMemo<LibraryProductTreeTrack[]>(() => {
    return (Object.keys(trackMeta) as DesignLabTrack[]).map((track) => {
      const trackItems = (track === activeTrack
        ? filteredItems
        : designLabIndex.items.filter((item) => resolveItemTrack(item) === track)
      ).sort((a, b) => a.name.localeCompare(b.name, 'en'));

      const groups = designLabTaxonomy.groups
        .map((group) => {
          const subgroups = group.subgroups
            .map((subgroup) => {
              const subgroupItems = trackItems
                .filter((item) => item.taxonomyGroupId === group.id && item.taxonomySubgroup === subgroup)
                .sort((a, b) => a.name.localeCompare(b.name, 'en'));
              if (!subgroupItems.length) return null;
              return {
                id: subgroup,
                label: subgroup,
                items: subgroupItems.map((item) => ({
                  id: item.name,
                  label: item.name,
                  badgeLabel: statusLabel[item.lifecycle],
                  badgeTone: item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info',
                })),
              };
            })
            .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

          if (!subgroups.length) return null;

          const count = subgroups.reduce((sum, subgroup) => sum + subgroup.items.length, 0);
          return {
            id: group.id,
            label: group.title,
            badgeLabel: String(count),
            subgroups,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

      const trackIcon =
        track === 'new_packages'
          ? <Sparkles className="h-4 w-4 text-action-primary" />
          : track === 'current_system'
            ? <Boxes className="h-4 w-4 text-text-secondary" />
            : <MapIcon className="h-4 w-4 text-state-warning-text" />;

      return {
        id: track,
        label: trackMeta[track].label,
        eyebrow: trackVisualMeta[track].eyebrow,
        icon: trackIcon,
        badgeLabel: String(track === activeTrack ? filteredItems.length : trackSummary[track]),
        accentClassName: trackVisualMeta[track].accentClass,
        selectedToneClassName: `border ${trackVisualMeta[track].borderClass} bg-surface-default`,
        groups,
      };
    });
  }, [activeTrack, filteredItems, trackSummary]);

  const handleCopy = async (value: string) => {
    const ok = await copyToClipboard(value);
    setCopied(ok ? 'ok' : 'fail');
    window.setTimeout(() => setCopied(null), 1500);
  };

  const gridRows = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }).map((_, index) => ({
      id: String(index + 1),
      name: `Kayıt ${index + 1}`,
      status: index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Pending' : 'Disabled',
      updatedAt: new Date(now.getTime() - index * 86_400_000).toISOString().slice(0, 10),
    }));
  }, []);

  const serverGridRows = useMemo(
    () => [
      { id: 'CMP-001', name: 'Companies', owner: 'core-data-service' },
      { id: 'USR-001', name: 'Users', owner: 'user-service' },
      { id: 'PRM-001', name: 'Permissions', owner: 'permission-service' },
      { id: 'VAR-001', name: 'Variants', owner: 'variant-service' },
    ],
    [],
  );

  const pageHeaderMeta = useMemo(
    () => [
      <SectionBadge key="release-window" label="Release Window · 04 Mar 2026" />,
      <SectionBadge key="owner" label="Owner · Platform UI" />,
      <SectionBadge key="coverage" label="Doctor coverage · PASS" />,
    ],
    [],
  );

  const summaryStripItems = useMemo(
    () => [
      {
        key: 'published',
        label: 'Published',
        value: '72',
        note: 'Gerçek export edilmiş block ve component seti.',
        trend: <Badge tone="success">+4 bu hafta</Badge>,
        tone: 'success' as const,
      },
      {
        key: 'planned',
        label: 'Planned',
        value: '4',
        note: 'Roadmap üzerinde kalan ürünleşme backlog’u.',
        trend: <Badge tone="warning">Wave 7</Badge>,
        tone: 'warning' as const,
      },
      {
        key: 'doctor',
        label: 'Doctor',
        value: 'PASS',
        note: 'UI Library browser diagnostics yeşil.',
        trend: <Badge tone="info">ui-library</Badge>,
        tone: 'info' as const,
      },
      {
        key: 'gate',
        label: 'Wave Gate',
        value: 'PASS',
        note: 'Tam release gate zinciri geçti.',
        trend: <Badge tone="success">latest</Badge>,
        tone: 'default' as const,
      },
    ],
    [],
  );

  const entitySummaryItems = useMemo(
    () => [
      { key: 'domain', label: 'Domain', value: 'UI Platform', tone: 'info' as const },
      { key: 'status', label: 'Status', value: 'Active', tone: 'success' as const },
      { key: 'owner', label: 'Owner', value: 'Platform Team', tone: 'info' as const },
      { key: 'lastRelease', label: 'Last Release', value: '2026-03-07', tone: 'warning' as const },
    ],
    [],
  );

  const commandPaletteItems = useMemo(
    () => [
      {
        id: 'open-ui-library-docs',
        title: 'UI Library docs',
        description: 'Komponent dokümantasyon sayfasına ve canlı örneklere dön.',
        group: 'Navigate',
        shortcut: '⌘U',
        keywords: ['docs', 'library', 'component'],
        badge: <Badge tone="info">Docs</Badge>,
      },
      {
        id: 'review-release-evidence',
        title: 'Release evidence review',
        description: 'Doctor ve gate kanıtlarını tek özetten incele.',
        group: 'Governance',
        shortcut: '⌘R',
        keywords: ['doctor', 'gate', 'evidence', 'release'],
        badge: <Badge tone="warning">Review</Badge>,
      },
      {
        id: 'open-ai-approvals',
        title: 'AI approval queue',
        description: 'İnsan onayı bekleyen AI öneri kuyruğunu aç.',
        group: 'AI Assist',
        shortcut: '⌘A',
        keywords: ['approval', 'queue', 'ai', 'human'],
        badge: <Badge tone="muted">Human</Badge>,
      },
      {
        id: 'apply-safe-rollout',
        title: 'Apply safe rollout',
        description: 'Düşük riskli rollout önerisini kontrollü olarak uygula.',
        group: 'AI Assist',
        shortcut: '↵',
        keywords: ['apply', 'rollout', 'safe', 'recommendation'],
        badge: <Badge tone="success">AI</Badge>,
      },
    ],
    [],
  );

  const approvalCheckpointSteps = useMemo(
    () => [
      {
        key: 'doctor',
        label: 'Doctor evidence temiz',
        helper: 'Browser doctor ve pageerror kaniti PASS olmali.',
        owner: 'Frontend QA',
        status: 'approved' as const,
      },
      {
        key: 'citations',
        label: 'Citation transparency',
        helper: 'Kaynak ve excerpt paneli karara baglanmali.',
        owner: 'UX / Governance',
        status: 'ready' as const,
      },
      {
        key: 'human',
        label: 'Human approval',
        helper: 'Son publish karari insan onayindan gecmeli.',
        owner: 'Release Board',
        status: approvalCheckpointState === 'approved' ? ('approved' as const) : approvalCheckpointState === 'rejected' ? ('blocked' as const) : ('todo' as const),
      },
    ],
    [approvalCheckpointState],
  );

  const citationPanelItems = useMemo(
    () => [
      {
        id: 'policy-4-2',
        title: 'Policy §4.2 Human approval',
        excerpt: 'AI tavsiyesi karar etkisi uretiyorsa nihai islemden once insan onayi zorunludur.',
        source: 'policy_work_intake.v2.json',
        locator: 'sec:4.2',
        kind: 'policy' as const,
        badges: [<Tag key="policy-critical" tone="warning">critical</Tag>],
      },
      {
        id: 'ux-ai-3',
        title: 'UX Catalog: confidence transparency',
        excerpt: 'Confidence, rationale ve source transparency ayni deneyim yuzeyinde birlikte okunur.',
        source: 'ux_katalogu.reference.v1.json',
        locator: 'ux:ai-3',
        kind: 'doc' as const,
        badges: [<Tag key="ux" tone="info">ux</Tag>],
      },
      {
        id: 'doctor-ui',
        title: 'Doctor evidence: ui-library',
        excerpt: 'doctor:frontend ui-library preset sonucu PASS; pageerror ve console error bulunmadi.',
        source: 'frontend-doctor.summary.v1.json',
        locator: 'doctor:ui-library',
        kind: 'log' as const,
        badges: [<Tag key="pass" tone="success">pass</Tag>],
      },
    ],
    [],
  );

  const auditTimelineItems = useMemo(
    () => [
      {
        id: 'audit-draft',
        actor: 'ai' as const,
        title: 'AI recommendation drafted',
        timestamp: '07 Mar 2026 18:10',
        summary: 'Forms dalgasi icin publish-ready ozet uretildi ve confidence hesaplandi.',
        status: 'drafted' as const,
        badges: [<Tag key="wave" tone="muted">wave-6</Tag>],
      },
      {
        id: 'audit-review',
        actor: 'human' as const,
        title: 'Governance review requested',
        timestamp: '07 Mar 2026 18:14',
        summary: 'Citation panel ve approval checkpoint ile birlikte ikinci goz talep edildi.',
        status: 'approved' as const,
        badges: [<Tag key="review" tone="info">review</Tag>],
      },
      {
        id: 'audit-release',
        actor: 'system' as const,
        title: 'Release note staged',
        timestamp: '07 Mar 2026 18:19',
        summary: 'Canary kontrati ve release notes draft status ile isaretlendi.',
        status: 'observed' as const,
        badges: [<Tag key="system" tone="warning">observed</Tag>],
      },
    ],
    [],
  );

  const renderRecipeComponentPreview = (recipeId: string) => {
    switch (recipeId) {
      case 'search_filter_listing':
        return (
          <SearchFilterListing
            eyebrow="Recipe"
            title="Policy inventory"
            description="Search, filter ve result shell ayni recipe kontrati altinda toplanir."
            meta={<SectionBadge label="recipe:first" />}
            status={<Badge tone="info">Live</Badge>}
            filters={(
              <>
                <TextInput
                  label="Search"
                  value={searchInputValue}
                  onValueChange={setSearchInputValue}
                  size="sm"
                  leadingVisual={<span aria-hidden="true">⌕</span>}
                />
                <Select
                  label="Density"
                  value={selectValue}
                  onValueChange={(value) => setSelectValue(String(value))}
                  size="sm"
                  options={[
                    { label: 'Comfortable', value: 'comfortable' },
                    { label: 'Compact', value: 'compact' },
                    { label: 'Readonly', value: 'readonly' },
                  ]}
                />
              </>
            )}
            onReset={() => setSearchInputValue('')}
            onSaveView={() => setDropdownAction('Saved recipe listing view')}
            summaryItems={[
              { key: 'results', label: 'Results', value: String(serverGridRows.length), note: 'Server snapshot' },
              { key: 'selection', label: 'Selection', value: dropdownAction || '—', note: 'Toolbar action state' },
              { key: 'density', label: 'Density', value: selectValue, note: 'Recipe shell density' },
            ]}
            items={serverGridRows.slice(0, 3).map((row) => ({
              key: row.id,
              title: row.name,
              description: `${row.owner} · ${row.theme}`,
              meta: row.status,
              badges: [row.track],
              tone: row.status === 'Ready' ? 'success' : 'info',
            }))}
          />
        );
      case 'detail_summary':
        return (
          <DetailSummary
            eyebrow="Recipe"
            title="Wave 11 rollout detail"
            description="Summary, entity context ve payload ayni inspector recipe ile okunur."
            meta={(
              <>
                <SectionBadge label="wave_11_recipes" />
                <SectionBadge label="stable" />
              </>
            )}
            status={<Badge tone="success">Publish-ready</Badge>}
            summaryItems={[
              { key: 'owners', label: 'Owners', value: '5', note: 'Canonical owner block count', tone: 'info' },
              { key: 'doctor', label: 'Doctor', value: 'PASS', note: 'ui-library preset', tone: 'success' },
              { key: 'adoption', label: 'Adoption', value: 'locked', note: 'Recipe-first enforcement', tone: 'warning' },
            ]}
            entity={{
              title: 'Recipe System',
              subtitle: 'Page ve panel kompozisyonlarini veri/config ile tekrar kullanir.',
              badge: <Badge tone="success">Stable</Badge>,
              avatar: { name: 'Recipe System' },
              items: [
                { key: 'contract', label: 'Contract', value: 'ui-library-recipe-system-contract-v1', tone: 'info' },
                { key: 'wave', label: 'Wave', value: 'wave_11_recipes', tone: 'success' },
                { key: 'owner', label: 'Owner', value: 'Platform UI', tone: 'info' },
                { key: 'mode', label: 'Mode', value: 'JSON-first', tone: 'warning' },
              ],
            }}
            detailItems={[
              { key: 'focus', label: 'Focus', value: 'Reusable page/panel patterns', tone: 'info' },
              { key: 'gate', label: 'Gate', value: 'doctor + wave check', tone: 'success' },
              { key: 'preview', label: 'Preview', value: '/ui-library', tone: 'warning' },
              { key: 'adoption', label: 'Rule', value: 'Recipe before page-level custom UI', tone: 'info', span: 2 },
            ]}
            jsonValue={{
              recipeId: 'detail_summary',
              ownerBlocks: ['PageHeader', 'SummaryStrip', 'EntitySummaryBlock', 'Descriptions', 'JsonViewer'],
              status: 'stable',
            }}
          />
        );
      case 'approval_review':
        return (
          <ApprovalReview
            checkpoint={{
              title: 'Publish approval',
              summary: 'Recipe publish karari citation evidence ve audit timeline ile birlikte okunur.',
              status: approvalCheckpointState,
              steps: approvalCheckpointSteps,
              evidenceItems: ['doctor:frontend', 'gate:wave_11', 'playwright:ui_library_recipe_wave_11_walk'],
              citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
              onPrimaryAction: () => setApprovalCheckpointState('approved'),
              onSecondaryAction: () => setApprovalCheckpointState('rejected'),
              footerNote: `Current state: ${approvalCheckpointState}`,
            }}
            citations={citationPanelItems}
            auditItems={auditTimelineItems}
            selectedCitationId={selectedCitationId}
            selectedAuditId={selectedAuditId}
            onCitationSelect={setSelectedCitationId}
            onAuditSelect={setSelectedAuditId}
          />
        );
      case 'empty_error_loading':
        return (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <EmptyErrorLoading mode="loading" loadingLabel="Recipe surfaces hazirlaniyor" />
            <EmptyErrorLoading mode="error" onRetry={() => setDropdownAction('Retry requested from recipe state')} />
            <EmptyErrorLoading mode="empty" />
          </div>
        );
      case 'ai_guided_authoring':
        return (
          <AIGuidedAuthoring
            confidenceLevel={recommendationDecision === 'applied' ? 'high' : recommendationDecision === 'review' ? 'medium' : 'medium'}
            confidenceScore={recommendationDecision === 'applied' ? 0.92 : 0.74}
            sourceCount={citationPanelItems.length}
            promptComposerProps={{
              subject: promptSubject,
              onSubjectChange: setPromptSubject,
              value: promptBody,
              onValueChange: setPromptBody,
              scope: promptScope,
              onScopeChange: setPromptScope,
              tone: promptTone,
              onToneChange: setPromptTone,
              citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
              guardrails: ['human-approval', 'source-transparency', 'scope-lock'],
            }}
            recommendations={[
              {
                id: 'recipe-adoption',
                title: 'Use ApprovalReview recipe',
                summary: 'Duplicate review shell yerine canonical ApprovalReview recipe kullan.',
                recommendationType: 'Recipe suggestion',
                confidenceLevel: recommendationDecision === 'applied' ? 'high' : 'medium',
                confidenceScore: recommendationDecision === 'applied' ? 0.91 : 0.76,
                citations: ['doctor:frontend', 'wave_11_recipes', 'adoption-enforcement'],
                tone: recommendationDecision === 'review' ? 'warning' : 'info',
                footerNote: `Decision: ${recommendationDecision}`,
              },
            ]}
            commandItems={commandPaletteItems}
            onApplyRecommendation={() => setRecommendationDecision('applied')}
            onReviewRecommendation={() => setRecommendationDecision('review')}
          />
        );
      default:
        return (
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
            <Text variant="secondary" className="block text-sm leading-6">
              Bu recipe icin canli kompozisyon henuz tanimli degil.
            </Text>
          </div>
        );
    }
  };

  const renderLivePreview = (item: DesignLabIndexItem) => {
    switch (item.name) {
      case 'Button':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Varyant matrisi">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Boyut ve icon slot">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" leadingVisual={<span aria-hidden="true">+</span>}>Small</Button>
                  <Button size="md" trailingVisual={<span aria-hidden="true">→</span>}>Medium</Button>
                  <Button size="lg" leadingVisual={<span aria-hidden="true">★</span>}>Large</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Durumlar">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    loading
                    loadingLabel="Kaydediliyor"
                    leadingVisual={<span aria-hidden="true">✓</span>}
                    trailingVisual={<span aria-hidden="true">→</span>}
                  >
                    Değişiklikleri kaydet
                  </Button>
                  <Button disabled variant="secondary">Disabled</Button>
                  <Button access="readonly" variant="ghost">Readonly</Button>
                </div>
                <div className="mt-4 max-w-sm">
                  <Button fullWidth variant="secondary" trailingVisual={<span aria-hidden="true">→</span>}>
                    Tam genişlik CTA
                  </Button>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Badge':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone="default">Default</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
            </div>
          </div>
        );
      case 'Tag':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Tag>Neutral</Tag>
              <Tag tone="success">Approved</Tag>
              <Tag tone="warning">Pending</Tag>
              <Tag tone="danger">Blocked</Tag>
            </div>
          </div>
        );
      case 'Text':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Semantic preset">
                <div className="flex flex-col gap-2">
                  <Text as="h2" preset="display">Display metni</Text>
                  <Text as="h3" preset="heading">Heading metni</Text>
                  <Text preset="title">Title metni</Text>
                  <Text preset="body">Body text</Text>
                  <Text preset="caption">Caption</Text>
                  <Text preset="mono">MONO-1024</Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Tone ve emphasis">
                <div className="flex flex-col gap-2">
                  <Text weight="semibold">Primary emphasis</Text>
                  <Text variant="secondary">Secondary copy</Text>
                  <Text variant="muted">Muted helper text</Text>
                  <Text variant="success">Success state</Text>
                  <Text variant="danger">Danger state</Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Clamp ve truncate">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="max-w-[240px]">
                    <Text truncate title="Bu başlık tek satırda truncate edilir ve hover ile tam hali görülebilir.">
                      Bu başlık tek satırda truncate edilir ve hover ile tam hali görülebilir.
                    </Text>
                  </div>
                  <div className="max-w-[240px]">
                    <Text clampLines={2}>
                      Uzun açıklama metni iki satıra clamp edilir; layout taşması üretmez ve typography kontratını korur.
                    </Text>
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Okunabilirlik ve numerik hizalama">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-4">
                    <Text preset="body" wrap="pretty">
                      Pretty wrap aktifken uzun paragraf daha dengeli satir dagilimi ile okunur; bu da docs ve panel yuzeylerinde
                      goz yorgunlugunu azaltir.
                    </Text>
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-surface-canvas p-4 text-right">
                    <Text preset="body-sm" align="right" tabularNums>
                      12.450,00
                    </Text>
                    <Text preset="caption" variant="secondary" className="mt-2 block">
                      Tabular nums
                    </Text>
                  </div>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'LinkInline':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Internal / external">
                <div className="flex flex-wrap items-center gap-4">
                  <LinkInline href="#users">Internal link</LinkInline>
                  <LinkInline href="https://mui.com" external>External link</LinkInline>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Current / blocked">
                <div className="flex flex-wrap items-center gap-4">
                  <LinkInline href="#current" current>Current state</LinkInline>
                  <LinkInline href="#blocked" disabled>Disabled state</LinkInline>
                  <LinkInline href="#secondary" tone="secondary" underline="always">Secondary tone</LinkInline>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'IconButton':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Intent ve size">
                <div className="flex flex-wrap items-center gap-3">
                  <IconButton icon={<span aria-hidden="true">+</span>} label="Ekle" size="sm" />
                  <IconButton icon={<span aria-hidden="true">☆</span>} label="Pinle" selected />
                  <IconButton icon={<span aria-hidden="true">×</span>} label="Sil" variant="destructive" size="lg" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Loading / disabled">
                <div className="flex flex-wrap items-center gap-3">
                  <IconButton icon={<span aria-hidden="true">⟳</span>} label="Yükleniyor" loading />
                  <IconButton icon={<span aria-hidden="true">🔒</span>} label="Kilitli" disabled />
                  <IconButton icon={<span aria-hidden="true">☰</span>} label="Menüyü aç" variant="secondary" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Skeleton':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PreviewPanel title="Text">
                <Skeleton lines={3} />
              </PreviewPanel>
              <PreviewPanel title="Avatar + text">
                <div className="flex items-center gap-3">
                  <Skeleton variant="avatar" />
                  <div className="flex-1">
                    <Skeleton lines={2} />
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Card placeholder">
                <Skeleton variant="rect" className="h-28" />
              </PreviewPanel>
              <PreviewPanel title="Table row / reduced motion">
                <div className="space-y-4">
                  <Skeleton variant="table-row" />
                  <Skeleton variant="table-row" animated={false} />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Spinner':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PreviewPanel title="Inline">
                <Spinner label="Yükleniyor" />
              </PreviewPanel>
              <PreviewPanel title="Block">
                <Spinner mode="block" label="Liste hazırlanıyor" />
              </PreviewPanel>
              <PreviewPanel title="Overlay">
                <Spinner mode="overlay" label="Bölüm yükleniyor" />
              </PreviewPanel>
              <PreviewPanel title="Tone / size">
                <div className="flex flex-wrap items-center gap-4">
                  <Spinner size="sm" tone="neutral" label="Kısa" />
                  <Spinner size="md" tone="primary" label="Orta" />
                  <div className="rounded-2xl bg-text-primary px-4 py-3">
                    <Spinner size="lg" tone="inverse" label="Inverse" />
                  </div>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Avatar':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name="Ada Lovelace" size="sm" />
                  <Avatar name="Ada Lovelace" size="md" />
                  <Avatar name="Ada Lovelace" size="lg" />
                  <Avatar name="Ada Lovelace" size="xl" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Image / privacy-safe identity">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar src={avatarPreviewImageSrc} name="Nora Stone" alt="Nora Stone" />
                  <Avatar name="Broken Image" />
                  <Avatar shape="square" src={avatarPreviewImageSrc} name="Square Identity" alt="Square Identity" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Fallback types">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name="Grace Hopper" />
                  <Avatar fallbackIcon={<span aria-hidden="true">👤</span>} />
                  <Avatar shape="square" name="Alan Turing" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Divider':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Horizontal">
                <div className="space-y-3">
                  <Text>İçerik üstü</Text>
                  <Divider />
                  <Text variant="secondary">İçerik altı</Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Label / vertical">
                <div className="flex items-center gap-4">
                  <Text>Sol</Text>
                  <Divider orientation="vertical" className="h-8" />
                  <Text>Sağ</Text>
                  <Divider label="veya" className="flex-1" />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Semantic / decorative">
                <div className="space-y-3">
                  <Divider label="Sözleşmeli ayırıcı" />
                  <Divider decorative />
                  <Text variant="secondary">Dekoratif ayırıcı rol üretmez.</Text>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Tabs':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Underline / controlled">
                <Tabs
                  value={tabsValue}
                  onValueChange={setTabsValue}
                  items={[
                    {
                      value: 'overview',
                      label: 'Overview',
                      badge: <Badge tone="info">4</Badge>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="title">Overview panel</Text>
                          <Text variant="secondary" className="mt-2 block">
                            Route-aware, keyboard navigable ve token-first sekme davranisi.
                          </Text>
                        </div>
                      ),
                    },
                    {
                      value: 'activity',
                      label: 'Activity',
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="title">Activity panel</Text>
                          <Text variant="secondary" className="mt-2 block">
                            Live preview icin controlled state ile shell tarafindan yonetiliyor.
                          </Text>
                        </div>
                      ),
                    },
                    {
                      value: 'settings',
                      label: 'Settings',
                      disabled: true,
                      content: null,
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Pill / vertical manual">
                <Tabs
                  appearance="pill"
                  orientation="vertical"
                  activationMode="manual"
                  defaultValue="tokens"
                  items={[
                    {
                      value: 'tokens',
                      label: 'Tokens',
                      icon: <span aria-hidden="true">◈</span>,
                      description: 'Tema eksenleri ve semantic token kararlarini gosteren panel.',
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">Semantic token mapping</Text>
                        </div>
                      ),
                    },
                    {
                      value: 'density',
                      label: 'Density',
                      icon: <span aria-hidden="true">≋</span>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">Comfortable, compact ve sharp density gorunumu.</Text>
                        </div>
                      ),
                    },
                    {
                      value: 'motion',
                      label: 'Motion',
                      icon: <span aria-hidden="true">↻</span>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">Transition hizlari ve focus-visible davranisi.</Text>
                        </div>
                      ),
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Breadcrumb':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Basic path">
                <Breadcrumb
                  items={[
                    { label: 'Admin', href: '#admin' },
                    { label: 'UI Kit', href: '#ui-kit' },
                    { label: 'Navigation' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Collapsed long path">
                <Breadcrumb
                  maxItems={4}
                  items={[
                    { label: 'Workspace', href: '#workspace' },
                    { label: 'Cockpit', href: '#cockpit' },
                    { label: 'Libraries', href: '#libraries' },
                    { label: 'UI System', href: '#ui-system' },
                    { label: 'Tabs' },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Pagination':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Server-side matrix">
                <Pagination
                  totalItems={248}
                  pageSize={20}
                  page={paginationPage}
                  onPageChange={setPaginationPage}
                  mode="server"
                />
              </PreviewPanel>
              <PreviewPanel title="Compact / client-side">
                <Pagination
                  totalItems={84}
                  pageSize={12}
                  defaultPage={2}
                  size="sm"
                  compact
                  mode="client"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Steps':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Interactive progress">
                <Steps
                  value={stepsValue}
                  onValueChange={setStepsValue}
                  interactive
                  items={[
                    {
                      value: 'draft',
                      title: 'Taslak',
                      description: 'İlk kural ve içerik çerçevesi hazırlanır.',
                    },
                    {
                      value: 'review',
                      title: 'İnceleme',
                      description: 'UX, API ve quality gate kanıtı birlikte doğrulanır.',
                    },
                    {
                      value: 'release',
                      title: 'Release',
                      description: 'Wave gate ve doctor evidence ile kapanış yapılır.',
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Vertical / status-rich">
                <Steps
                  value={stepsStatusRichValue}
                  onValueChange={setStepsStatusRichValue}
                  orientation="vertical"
                  interactive
                  items={[
                    {
                      value: 'scope',
                      title: 'Scope',
                      description: 'Contract ve registry eşleşmesi tamamlandı.',
                    },
                    {
                      value: 'preview',
                      title: 'Preview',
                      description: 'Live preview ve demoscope gözden geçiriliyor.',
                    },
                    {
                      value: 'security',
                      title: 'Security',
                      description: 'Doctor evidence ve release guardrail bekleniyor.',
                      optional: true,
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'AnchorToc':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
              <AnchorToc
                value={anchorValue}
                onValueChange={setAnchorValue}
                title="Policy bölümleri"
                items={[
                  { id: 'overview', label: 'Overview', meta: 'P1' },
                  { id: 'ux', label: 'UX Standardı', level: 2, meta: 'P2' },
                  { id: 'security', label: 'Security Controls', level: 2, meta: 'P3' },
                  { id: 'release', label: 'Release Evidence', level: 3, meta: 'P4' },
                ]}
              />
              <div className="space-y-4 rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
                <PreviewPanel title="Deep-link / shareable state">
                  <div className="space-y-4">
                    <section id="overview" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">Overview</Text>
                      <Text variant="secondary" className="mt-2 block">
                        AnchorToc ayni sayfa icinde paylasilabilir hash state uretir ve aktif bolumu vurgular.
                      </Text>
                    </section>
                    <section id="ux" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">UX Standardı</Text>
                      <Text variant="secondary" className="mt-2 block">
                        Bilgi kokusu, derin link ve policy okumalarinda progress kaybi olmadan gezinme saglar.
                      </Text>
                    </section>
                    <section id="security" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">Security Controls</Text>
                      <Text variant="secondary" className="mt-2 block">
                        Active heading state hem docs-site hem admin policy ekranlari icin tek primitive uzerinden gelir.
                      </Text>
                    </section>
                    <section id="release" className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                      <Text preset="title">Release Evidence</Text>
                      <Text variant="secondary" className="mt-2 block">
                        Doctor evidence ve wave gate ile birlikte kullanildiginda dokuman ve release izlerini ayni dilde toplar.
                      </Text>
                    </section>
                  </div>
                </PreviewPanel>
              </div>
            </div>
          </div>
        );
      case 'Select':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="max-w-sm">
              <Select
                value={selectValue}
                onChange={setSelectValue}
                options={[
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'compact', label: 'Compact' },
                  { value: 'sharp', label: 'Sharp' },
                ]}
              />
            </div>
            <Text variant="secondary" className="mt-3 block">Aktif değer: {selectValue}</Text>
          </div>
        );
      case 'TextInput':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Label / yardım / sayaç">
                <div className="space-y-4">
                  <TextInput
                    label="Kullanıcı adı"
                    description="Sistemde görünen kısa tanım."
                    hint="Boşluk bırakmadan en fazla 32 karakter."
                    value={textInputValue}
                    maxLength={32}
                    showCount
                    onValueChange={setTextInputValue}
                    leadingVisual={<span aria-hidden="true">@</span>}
                  />
                  <Text variant="secondary" className="block">
                    Aktif değer: {textInputValue}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Durum matrisi">
                <div className="grid grid-cols-1 gap-3">
                  <TextInput label="Doğrulanan alan" defaultValue="nova.user" trailingVisual={<span aria-hidden="true">✓</span>} />
                  <TextInput label="Hatalı alan" defaultValue="!" invalid error="En az 3 karakter girilmeli." />
                  <TextInput label="Readonly alan" defaultValue="system-generated" access="readonly" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TextArea':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Auto resize / yardım">
                <div className="space-y-4">
                  <TextArea
                    label="Açıklama"
                    description="Uzun içerik alanları için ortak metin girişi."
                    hint="Çok satırlı bilgi girişi için otomatik yükseklik ayarı."
                    value={textAreaValue}
                    rows={3}
                    maxLength={180}
                    showCount
                    resize="auto"
                    onValueChange={setTextAreaValue}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Validation / erişim">
                <div className="grid grid-cols-1 gap-3">
                  <TextArea
                    label="Validation örneği"
                    defaultValue="Eksik açıklama"
                    invalid
                    error="Bu alan en az 20 karakter olmalı."
                    rows={3}
                  />
                  <TextArea label="Readonly not" defaultValue="Sistem logu kullanıcı tarafından değiştirilemez." access="readonly" rows={3} />
                  <TextArea label="Disabled draft" defaultValue="Yayın sonrası kilitlenir." access="disabled" rows={3} />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Checkbox':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled + yardım">
                <div className="space-y-4">
                  <Checkbox
                    label="Yayın sonrası bildirim gönder"
                    description="Akış tamamlandığında paydaşlara otomatik bilgi ver."
                    hint="İşlem anında kapatılabilir."
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked)}
                  />
                  <Text variant="secondary" className="block">
                    Aktif seçim: {checkboxValue ? 'Açık' : 'Kapalı'}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Validation / erişim">
                <div className="grid grid-cols-1 gap-3">
                  <Checkbox label="Eksik onay" invalid error="Devam etmeden önce onay vermelisin." />
                  <Checkbox label="Kısmi seçim" indeterminate hint="Alt seçeneklerin bir bölümü seçili." />
                  <Checkbox label="Readonly seçim" defaultChecked access="readonly" />
                  <Checkbox label="Disabled seçim" access="disabled" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Radio':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled seçenek grubu">
                <div className="space-y-3">
                  <Radio
                    name="wave-3-radio-demo"
                    value="design"
                    label="Design odaklı"
                    description="Önce görünüm ve doküman kalitesini tamamla."
                    checked={radioValue === 'design'}
                    onCheckedChange={(checked) => {
                      if (checked) setRadioValue('design');
                    }}
                  />
                  <Radio
                    name="wave-3-radio-demo"
                    value="ops"
                    label="Ops odaklı"
                    description="Doctor ve gate kanıtı önce tamamlansın."
                    checked={radioValue === 'ops'}
                    onCheckedChange={(checked) => {
                      if (checked) setRadioValue('ops');
                    }}
                  />
                  <Radio
                    name="wave-3-radio-demo"
                    value="delivery"
                    label="Delivery odaklı"
                    description="Feature sonrası teslim artefact’larını önceliklendir."
                    checked={radioValue === 'delivery'}
                    onCheckedChange={(checked) => {
                      if (checked) setRadioValue('delivery');
                    }}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <Radio name="wave-3-radio-state" value="default" label="Varsayılan seçenek" defaultChecked />
                  <Radio
                    name="wave-3-radio-state"
                    value="invalid"
                    label="Eksik seçim"
                    invalid
                    error="En az bir dağıtım stratejisi seçilmeli."
                  />
                  <Radio name="wave-3-radio-state" value="readonly" label="Readonly seçenek" access="readonly" />
                  <Radio name="wave-3-radio-state" value="disabled" label="Disabled seçenek" access="disabled" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Switch':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled toggle">
                <div className="space-y-4">
                  <Switch
                    label="Canlı görünürlüğü aç"
                    description="Yayınlanan ekranı son kullanıcıya anında görünür yap."
                    hint="İhtiyaç halinde tekrar kapatabilirsin."
                    checked={switchValue}
                    onCheckedChange={(checked) => setSwitchValue(checked)}
                  />
                  <Text variant="secondary" className="block">
                    Aktif durum: {switchValue ? 'Açık' : 'Kapalı'}
                  </Text>
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <Switch label="Readonly toggle" defaultChecked access="readonly" />
                  <Switch label="Disabled toggle" access="disabled" />
                  <Switch label="Eksik policy onayı" invalid error="Bu geçiş için ek onay gerekiyor." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Slider':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled range">
                <div className="space-y-4">
                  <Slider
                    label="Yoğunluk"
                    description="Kart ve tablo boşluk kararını tek kaynaktan yönet."
                    hint="Daha yüksek değer daha ferah görünüm üretir."
                    min={20}
                    max={100}
                    step={4}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minLabel="Kompakt"
                    maxLabel="Rahat"
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <Slider label="Readonly slider" value={72} access="readonly" valueFormatter={(value) => `${value}%`} />
                  <Slider label="Blocked by policy" defaultValue={36} invalid error="Bu değişim için ek approval gerekiyor." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'DatePicker':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled date">
                <div className="space-y-4">
                  <DatePicker
                    label="Teslim tarihi"
                    description="Gorevin tamamlanacağı günü planla."
                    hint="Takvim seçimi ile shareable milestone üret."
                    value={dateValue}
                    min="2026-03-08"
                    max="2026-04-30"
                    onValueChange={setDateValue}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <DatePicker label="Readonly date" value="2026-03-09" access="readonly" />
                  <DatePicker label="Invalid milestone" defaultValue="2026-03-01" invalid error="Tarih mevcut release penceresinin dışında." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TimePicker':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled time">
                <div className="space-y-4">
                  <TimePicker
                    label="Kesim saati"
                    description="Release penceresindeki uygulama saatini sec."
                    hint="15 dakikalik araliklarla planla."
                    value={timeValue}
                    min="09:00"
                    max="22:00"
                    step={900}
                    onValueChange={setTimeValue}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="State matrix">
                <div className="grid grid-cols-1 gap-3">
                  <TimePicker label="Readonly time" value="18:45" access="readonly" />
                  <TimePicker label="Invalid cutover" defaultValue="23:30" invalid error="Bu saat izinli deployment penceresinin dışında." />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Upload':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Controlled file list">
                <div className="space-y-4">
                  <Upload
                    label="Kanit paketi"
                    description="Release ve approval kanitlarini ayni yerden topla."
                    hint="PDF, XLSX ve ZIP desteklenir."
                    accept=".pdf,.xlsx,.zip"
                    multiple
                    maxFiles={4}
                    files={uploadFiles}
                    onFilesChange={setUploadFiles}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Current payload">
                <LibraryMetricCard
                  label="Selected files"
                  value={`${uploadFiles.length}`}
                  note={uploadFiles.map((file) => file.name).join(', ')}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'CommandPalette':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Interactive launcher">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setCommandPaletteOpen(true)}>Komut paletini aç</Button>
                    <SectionBadge label="⌘ K" />
                    <SectionBadge label="AI-assisted" />
                  </div>
                  <CommandPalette
                    open={commandPaletteOpen}
                    title="Yonetim komut paleti"
                    subtitle="Gezinim, AI tavsiyesi ve governance aksiyonlarini tek palette topla."
                    items={commandPaletteItems}
                    query={commandPaletteQuery}
                    onQueryChange={setCommandPaletteQuery}
                    onClose={() => setCommandPaletteOpen(false)}
                    onSelect={(id, selectedItem) => {
                      setLastCommandSelection(`${selectedItem.title} · ${id}`);
                    }}
                    footer={<Text variant="secondary">Doktor, gate ve approval akislari ayni palette gorunur.</Text>}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Current command state">
                <div className="grid grid-cols-1 gap-3">
                  <LibraryMetricCard
                    label="Active query"
                    value={commandPaletteQuery || '—'}
                    note="Palette controlled query state ile calisiyor."
                  />
                  <LibraryMetricCard
                    label="Last selection"
                    value={lastCommandSelection ?? 'Henüz seçim yok'}
                    note="Secilen komut route ya da AI aksiyonunu tetikler."
                  />
                  <Descriptions
                    title="Governance"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'mode', label: 'Mode', value: 'dialog', tone: 'info' },
                      { key: 'scope', label: 'Scope', value: 'navigate / ai / review', tone: 'success' },
                      { key: 'evidence', label: 'Evidence', value: 'doctor + gate', tone: 'warning' },
                    ]}
                  />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'RecommendationCard':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Interactive governance recommendation">
                <div className="space-y-4">
                  <RecommendationCard
                    title="Security remediation wave now"
                    summary="Dependency bulgulari kapanmis durumda. UI library forms dalgasini kontrollu sekilde publish edebilirsin."
                    recommendationType="Release suggestion"
                    rationale={[
                      'doctor:frontend kaniti yeşil',
                      'wave gate PASS',
                      'Residual risk kayıt altinda',
                    ]}
                    citations={['doctor:frontend', 'wave_3_forms', 'security-guardrails']}
                    confidenceLevel="high"
                    confidenceScore={89}
                    sourceCount={4}
                    tone={recommendationDecision === 'applied' ? 'success' : recommendationDecision === 'review' ? 'warning' : 'info'}
                    primaryActionLabel={recommendationDecision === 'applied' ? 'Uygulandı' : 'Uygula'}
                    secondaryActionLabel={recommendationDecision === 'review' ? 'İncelemede' : 'İncele'}
                    onPrimaryAction={() => setRecommendationDecision('applied')}
                    onSecondaryAction={() => setRecommendationDecision('review')}
                    footerNote={`Decision: ${recommendationDecision}`}
                    badges={[
                      <Tag key="batch" tone="info">wave-6</Tag>,
                      <Tag key="contract" tone="muted">contract-bound</Tag>,
                    ]}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Readonly advisory card">
                <RecommendationCard
                  title="Human approval required"
                  summary="Bu öneri doğrudan uygulanmaz. İnsan onayı, citation panel ve audit timeline ile birlikte görünür."
                  recommendationType="Advisory"
                  rationale={[
                    'approval queue zorunlu',
                    'policy impact yüksek',
                  ]}
                  citations={['approval-checkpoint', 'audit-trace']}
                  confidenceLevel="medium"
                  confidenceScore={72}
                  sourceCount={2}
                  access="readonly"
                  compact
                  footerNote="Readonly mode"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'ConfidenceBadge':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Confidence matrix">
                <div className="flex flex-wrap gap-3">
                  <ConfidenceBadge level="low" score={41} sourceCount={1} />
                  <ConfidenceBadge level="medium" score={68} sourceCount={3} />
                  <ConfidenceBadge level="high" score={84} sourceCount={5} />
                  <ConfidenceBadge level="very-high" score={96} sourceCount={8} />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Compact + transparency">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <ConfidenceBadge level="high" score={87} compact />
                    <ConfidenceBadge level="medium" label="Manual review" compact showScore={false} />
                    <ConfidenceBadge level="low" score={29} access="readonly" />
                  </div>
                  <Text variant="secondary" className="block leading-7">
                    Confidence badge tek basina kesinlik iddiası taşımaz; skor, kaynak sayisi ve review gereksinimi birlikte okunur.
                  </Text>
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'ApprovalCheckpoint':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Interactive approval checkpoint">
                <ApprovalCheckpoint
                  title="Forms wave publish checkpoint"
                  summary="AI helper dalgasi publish edilmeden once doctor, citation ve insan onayi ayni yuzeyde gorunur."
                  status={approvalCheckpointState}
                  approverLabel="Release board"
                  dueLabel="07 Mar 2026 · 22:00"
                  evidenceItems={['doctor:frontend', 'wave gate', 'security guardrails']}
                  steps={approvalCheckpointSteps}
                  citations={citationPanelItems.map((item) => item.locator as string)}
                  onPrimaryAction={() => setApprovalCheckpointState('approved')}
                  onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                  footerNote={`Current state: ${approvalCheckpointState}`}
                  badges={[<Tag key="ai" tone="info">ai-native</Tag>]}
                />
              </PreviewPanel>
              <PreviewPanel title="Readonly checkpoint">
                <ApprovalCheckpoint
                  title="Readonly approval evidence"
                  summary="Bu varyant inceleme akisinda yalnizca okunur; aksiyon tetiklemez."
                  status="pending"
                  access="readonly"
                  steps={approvalCheckpointSteps}
                  evidenceItems={['doctor:frontend', 'ux alignment']}
                  citations={['sec:4.2', 'ux:ai-3']}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'CitationPanel':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Interactive citations">
                <CitationPanel
                  items={citationPanelItems}
                  activeCitationId={selectedCitationId}
                  onOpenCitation={(id) => setSelectedCitationId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Selected citation">
                <LibraryMetricCard
                  label="Active citation"
                  value={selectedCitationId ?? '—'}
                  note={(citationPanelItems.find((item) => item.id === selectedCitationId)?.source as string) ?? 'Kaynak secilmedi'}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'AIActionAuditTimeline':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Interactive audit timeline">
                <AIActionAuditTimeline
                  items={auditTimelineItems}
                  selectedId={selectedAuditId}
                  onSelectItem={(id) => setSelectedAuditId(id)}
                />
              </PreviewPanel>
              <PreviewPanel title="Selected event">
                <Descriptions
                  title="Audit event"
                  density="compact"
                  columns={1}
                  items={[
                    { key: 'selected', label: 'Selected', value: selectedAuditId ?? '—', tone: 'info' },
                    {
                      key: 'actor',
                      label: 'Actor',
                      value: auditTimelineItems.find((item) => item.id === selectedAuditId)?.actor ?? '—',
                      tone: 'success',
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      value: auditTimelineItems.find((item) => item.id === selectedAuditId)?.status ?? '—',
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'PromptComposer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <PreviewPanel title="Controlled prompt authoring">
                <PromptComposer
                  subject={promptSubject}
                  onSubjectChange={setPromptSubject}
                  value={promptBody}
                  onValueChange={setPromptBody}
                  scope={promptScope}
                  onScopeChange={setPromptScope}
                  tone={promptTone}
                  onToneChange={setPromptTone}
                  guardrails={['pii-safe', 'approval-bound', 'source-required']}
                  citations={citationPanelItems.map((item) => item.locator as string)}
                  footerNote="Prompt output release notuna gireceksek human approval ile birlestirilir."
                />
              </PreviewPanel>
              <PreviewPanel title="Prompt summary">
                <div className="grid grid-cols-1 gap-3">
                  <LibraryMetricCard label="Subject" value={promptSubject} note="Prompt amaci" />
                  <LibraryMetricCard label="Scope" value={promptScope} note="Execution boundary" />
                  <LibraryMetricCard label="Tone" value={promptTone} note="Message discipline" />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TableSimple':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Policy status table">
                <TableSimple
                  caption="Politika portföyü"
                  description="Görev odaklı hafif tablo görünümü."
                  columns={[
                    { key: 'policy', label: 'Politika', accessor: 'policy', emphasis: true, truncate: true },
                    { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    {
                      key: 'status',
                      label: 'Durum',
                      align: 'center',
                      render: (row) => <Badge tone={row.status === 'Aktif' ? 'success' : row.status === 'Taslak' ? 'warning' : 'info'}>{row.status}</Badge>,
                    },
                  ]}
                  rows={policyTableRows}
                  stickyHeader
                />
              </PreviewPanel>
              <PreviewPanel title="Loading + empty">
                <div className="space-y-4">
                  <TableSimple
                    caption="Yüklenen tablo"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    loading
                  />
                  <TableSimple
                    caption="Boş tablo"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    emptyStateLabel="Henüz yayınlanmış veri yok."
                    density="compact"
                  />
                </div>
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Descriptions':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Rollout summary">
                <Descriptions
                  title="Canary özeti"
                  description="Rollout owner, scope ve review snapshot tek blokta."
                  items={rolloutDescriptionItems}
                  columns={2}
                />
              </PreviewPanel>
              <PreviewPanel title="Risk / approval panel">
                <Descriptions
                  title="Risk ve onay"
                  items={[
                    { key: 'risk', label: 'Risk Seviyesi', value: 'Medium', tone: 'warning' },
                    { key: 'approval', label: 'Onay Akışı', value: '2/3 tamamlandı', helper: 'Security sign-off bekleniyor.' },
                    { key: 'ticket', label: 'Change ID', value: 'CHG-UI-204', tone: 'info' },
                  ]}
                  columns={1}
                  density="compact"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'List':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Operational inbox">
                <List
                  title="Release work queue"
                  description="Öncelikli rollout ve kanıt işleri aynı yüzeyde izlenir."
                  items={listItems}
                  selectedKey="doctor"
                />
              </PreviewPanel>
              <PreviewPanel title="Compact selectable">
                <List
                  title="Compact review"
                  density="compact"
                  items={listItems}
                  selectedKey="triage"
                  onItemSelect={() => undefined}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'JsonViewer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Release evidence payload">
                <JsonViewer
                  title="Wave summary"
                  description="Gate ve doctor kanıtını debug ekranına ihtiyaç duymadan okunur kılar."
                  value={jsonViewerValue}
                  rootLabel="wave"
                  defaultExpandedDepth={2}
                />
              </PreviewPanel>
              <PreviewPanel title="Policy snapshot">
                <JsonViewer
                  title="Policy payload"
                  description="Readonly operational contract yüzeyi."
                  value={jsonViewerValue.policy}
                  rootLabel="policy"
                  defaultExpandedDepth={1}
                  maxHeight={320}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Tree':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Operational hierarchy">
                <Tree
                  title="Delivery hierarchy"
                  description="Gate ve policy sahipligini tek hiyerarside okur."
                  nodes={treeNodes}
                  defaultExpandedKeys={['release', 'doctor']}
                  selectedKey="doctor-ui-library"
                />
              </PreviewPanel>
              <PreviewPanel title="Readonly review">
                <Tree
                  title="Readonly review"
                  density="compact"
                  nodes={treeNodes}
                  defaultExpandedKeys={['release', 'security']}
                  access="readonly"
                  selectedKey="security-residual"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TreeTable':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Ownership matrix">
                <TreeTable
                  title="Component ownership"
                  description="Owner, status ve scope bilgisi hiyerarsik satirlarla okunur."
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  columns={[
                    { key: 'owner', label: 'Owner', accessor: 'owner', emphasis: true },
                    { key: 'status', label: 'Durum', accessor: 'status', align: 'center' },
                    { key: 'scope', label: 'Scope', accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Compact review">
                <TreeTable
                  title="Compact matrix"
                  density="compact"
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  selectedKey="delivery-gates"
                  columns={[
                    { key: 'status', label: 'Durum', accessor: 'status', align: 'center', emphasis: true },
                    { key: 'scope', label: 'Scope', accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Dropdown':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Dropdown
                trigger={<span>Aksiyon Menüsü</span>}
                items={[
                  { key: 'publish', label: 'Publish' },
                  { key: 'duplicate', label: 'Duplicate' },
                  { key: 'archive', label: 'Archive' },
                ]}
                onSelect={setDropdownAction}
              />
              <Text variant="secondary">Seçim: {dropdownAction}</Text>
            </div>
          </div>
        );
      case 'Tooltip':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Tooltip text="Tooltip örneği">
              <Button variant="secondary">Hover / Focus</Button>
            </Tooltip>
          </div>
        );
      case 'Empty':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Empty description="Bu katalog grubunda henüz kayıt yok." />
          </div>
        );
      case 'Modal':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Button onClick={() => setModalOpen(true)}>Modal aç</Button>
            <Modal
              open={modalOpen}
              title="UI Kit Demo Modal"
              onClose={() => setModalOpen(false)}
              footer={(
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>İptal</Button>
                  <Button onClick={() => setModalOpen(false)}>Kaydet</Button>
                </div>
              )}
            >
              <Text variant="secondary">Token zincirine bağlı dialog preview.</Text>
            </Modal>
          </div>
        );
      case 'ThemePreviewCard':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ThemePreviewCard />
            <ThemePreviewCard selected />
            <ThemePreviewCard />
          </div>
        );
      case 'PageLayout':
        return (
          <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
            <PageLayout
              title="User Directory"
              description="Route-level layout composition example"
              breadcrumbItems={[
                { title: 'Admin', path: '#' },
                { title: 'Users' },
              ]}
              actions={<Button variant="secondary">Yeni kayıt</Button>}
              filterBar={<FilterBar onReset={() => undefined} onSaveView={() => undefined}><div className="h-10 rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Filter slot</div></FilterBar>}
              detail={<div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">Detail panel</div>}
            >
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">Main content</div>
            </PageLayout>
          </div>
        );
      case 'PageHeader':
        return (
          <PageHeader
            eyebrow="Page Shell"
            title="Component Library"
            description="Katalog, release ve kalite bilgisini tek page header shell içinde toplar."
            status={<Badge tone="success">Stable shell</Badge>}
            meta={pageHeaderMeta}
            actions={
              <>
                <Button variant="secondary">Release notes</Button>
                <Button>Publish</Button>
              </>
            }
            aside={
              <div className="rounded-2xl border border-border-subtle bg-surface-default px-4 py-3 text-sm text-text-secondary">
                Son doctor kanıtı: PASS
              </div>
            }
          />
        );
      case 'FilterBar':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <FilterBar onReset={() => undefined} onSaveView={() => undefined}>
              <div className="min-w-[220px] rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Search</div>
              <div className="min-w-[220px] rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Status</div>
            </FilterBar>
          </div>
        );
      case 'FormDrawer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Button onClick={() => setFormDrawerOpen(true)}>Drawer aç</Button>
            <FormDrawer open={formDrawerOpen} title="Yeni kayıt" onClose={() => setFormDrawerOpen(false)}>
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Field 1</div>
                <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Field 2</div>
              </div>
            </FormDrawer>
          </div>
        );
      case 'DetailDrawer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Button onClick={() => setDetailDrawerOpen(true)}>Detail aç</Button>
            <DetailDrawer
              open={detailDrawerOpen}
              title="Kayıt detay"
              onClose={() => setDetailDrawerOpen(false)}
              sections={[
                { key: 'summary', title: 'Summary', description: 'Drawer section example', content: <Text variant="secondary">Kısa detay içeriği.</Text> },
                { key: 'audit', title: 'Audit', description: 'Metadata block', content: <Text variant="secondary">Updated 2026-03-06</Text> },
              ]}
            />
          </div>
        );
      case 'Popover':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Popover
              title="Policy guidance"
              trigger={<Button variant="secondary">Popover aç</Button>}
              content={(
                <div className="space-y-3">
                  <Text variant="secondary" className="block leading-6">
                    Kısa ama zengin bağlam gerektiğinde popover kullanılır. Bu panel route değiştirmeden karar desteği verir.
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    <Tag tone="warning">Policy</Tag>
                    <Tag tone="info">Readonly</Tag>
                  </div>
                </div>
              )}
            />
          </div>
        );
      case 'ContextMenu':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Action trigger">
                <div className="flex flex-wrap items-start gap-3">
                  <ContextMenu
                    buttonLabel="Bağlam menüsü"
                    title="Release actions"
                    testIdPrefix="design-lab-contextmenu"
                    items={[
                      { key: 'approve', label: 'Onay akışını başlat', description: 'İnsan onayı ve wave gate kanıtını birlikte toplar.' },
                      { key: 'review', label: 'İnceleme kuyruğuna ekle', description: 'Readonly review ve ek kanıt talebi üretir.' },
                      { key: 'archive', label: 'Arşive taşı', description: 'Eski varyantları planlı backlog alanına taşır.', danger: true },
                    ]}
                    onSelect={(key) => setContextMenuAction(key)}
                  />
                  <div
                    className="min-w-[220px] rounded-2xl border border-border-subtle bg-surface-canvas px-4 py-4 text-sm text-text-secondary"
                    data-testid="design-lab-contextmenu-result"
                  >
                    Son seçim: <span className="font-semibold text-text-primary">{contextMenuAction}</span>
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Right-click surface">
                <ContextMenu
                  triggerMode="contextmenu"
                  title="Surface actions"
                  testIdPrefix="design-lab-contextmenu-surface"
                  items={[
                    { key: 'duplicate', label: 'Kartı çoğalt', shortcut: 'D' },
                    { key: 'pin', label: 'Bu görünümü sabitle', shortcut: 'P' },
                    { key: 'readonly', label: 'Readonly nedeni göster', description: 'Policy guard ile context menu de sınırlandırılır.' },
                  ]}
                  onSelect={(key) => setContextMenuAction(`surface:${key}`)}
                  trigger={(
                    <div className="space-y-2">
                      <Text preset="title">Sağ tıkla</Text>
                      <Text variant="secondary" className="block leading-7">
                        Context menu sağ tık yüzeyinde de aynı contract ile çalışır. Menü kısa eylem listesi olmalı; ağaç navigasyon olmamalı.
                      </Text>
                    </div>
                  )}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'TourCoachmarks':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Guided walkthrough">
                <div className="flex flex-wrap items-start gap-3">
                  <Button
                    onClick={() => {
                      setTourOpen(true);
                      setTourStep(0);
                      setTourStatus('guided');
                    }}
                    data-testid="design-lab-tour-open"
                  >
                    Turu başlat
                  </Button>
                  <SectionBadge label={tourStatus === 'finished' ? 'finished' : tourStatus === 'guided' ? 'guided' : 'idle'} />
                </div>
                <div className="mt-4">
                  <TourCoachmarks
                    open={tourOpen}
                    currentStep={tourStep}
                    onStepChange={(index) => setTourStep(index)}
                    onClose={() => {
                      setTourOpen(false);
                      setTourStatus('idle');
                    }}
                    onFinish={() => {
                      setTourStatus('finished');
                      setTourOpen(false);
                    }}
                    testIdPrefix="design-lab-tour"
                    steps={[
                      {
                        id: 'scope',
                        title: 'Scope doğrulaması',
                        description: 'Önce wave ve registry sözleşmesi netleşir; kullanıcı neyi yayınladığını görür.',
                        meta: 'contract',
                      },
                      {
                        id: 'preview',
                        title: 'Canlı demo incelemesi',
                        description: 'Preview, API ve kalite kanıtı aynı walkthrough içinde açıklanır.',
                        meta: 'preview',
                        tone: 'success',
                      },
                      {
                        id: 'release',
                        title: 'Release evidence',
                        description: 'Doctor, gate ve security guardrail kanıtı tamamlanmadan tur bitmiş sayılmaz.',
                        meta: 'release',
                        tone: 'warning',
                      },
                    ]}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Readonly compliance tour">
                <TourCoachmarks
                  defaultOpen
                  mode="readonly"
                  allowSkip={false}
                  showProgress={false}
                  access="readonly"
                  steps={[
                    {
                      id: 'policy',
                      title: 'Policy açıklaması',
                      description: 'Readonly walkthrough, kritik alanlarda kullanıcının neden-sonuç bilgisini aynı overlay içinde taşır.',
                      meta: 'readonly',
                    },
                    {
                      id: 'controls',
                      title: 'Kontrol noktaları',
                      description: 'Onay ve security kontrolleri tamamlanmadan release butonları görünür kalmaz.',
                      meta: 'controls',
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'ReportFilterPanel':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <ReportFilterPanel onSubmit={() => setReportStatus('Filtre uygulandı')} onReset={() => setReportStatus('Filtre sıfırlandı')}>
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Date range</div>
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">Owner</div>
            </ReportFilterPanel>
            <Text variant="secondary" className="mt-3 block">Durum: {reportStatus}</Text>
          </div>
        );
      case 'SummaryStrip':
        return (
          <SummaryStrip
            title="Release summary"
            description="Page üstü KPI ve durum özetini reusable strip ile verir."
            items={summaryStripItems}
          />
        );
      case 'EntitySummaryBlock':
        return (
          <EntitySummaryBlock
            title="Ethics Program"
            subtitle="Owner, lifecycle ve metadata bilgisini tek entity shell içinde toplar."
            badge={<Badge tone="info">Program</Badge>}
            avatar={{ name: 'Ethics Program' }}
            actions={<Button variant="secondary">Detayı aç</Button>}
            items={entitySummaryItems}
          />
        );
      case 'EntityGridTemplate':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
            <div className="h-[420px]">
              <LibraryQueryProvider>
                <EntityGridTemplate<Record<string, unknown>>
                  gridId="design-lab-grid"
                  gridSchemaVersion={1}
                  dataSourceMode="client"
                  rowData={gridRows}
                  total={gridRows.length}
                  page={1}
                  pageSize={25}
                  columnDefs={[
                    { field: 'name', headerName: 'İsim', flex: 1 },
                    { field: 'status', headerName: 'Durum', width: 140 },
                    { field: 'updatedAt', headerName: 'Güncelleme', width: 140 },
                  ]}
                />
              </LibraryQueryProvider>
            </div>
          </div>
        );
      case 'AgGridServer':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-sm">
            <div className="h-[360px]">
              <AgGridServer
                height={320}
                columnDefs={[
                  { field: 'id', headerName: 'ID', width: 120 },
                  { field: 'name', headerName: 'Kaynak', flex: 1 },
                  { field: 'owner', headerName: 'Owner', width: 180 },
                ]}
                getData={async () => ({ rows: serverGridRows, total: serverGridRows.length })}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Text as="div" className="font-semibold">Inspector preview</Text>
            <Text variant="secondary" className="mt-2 block">
              Bu export çalışma anında canlı UI yerine davranış ve contract seviyesinde izlenir.
            </Text>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Registry notu</DetailLabel>
              <Text variant="secondary" className="mt-2 block">{item.description}</Text>
            </div>
          </div>
        );
    }
  };

  const buildDemoShowcaseSections = (item: DesignLabIndexItem): ComponentShowcaseSection[] => {
    switch (item.name) {
      case 'TextInput':
        return [
          {
            id: 'text-input-profile',
            eyebrow: 'Alternative 01',
            title: 'Profile / account field',
            description: 'Label, açıklama, yardım ve karakter sayacı ile klasik ürün formu akışı.',
            badges: ['form', 'stable', 'count'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Filled account field">
                  <TextInput
                    label="Kullanıcı adı"
                    description="Sistemde görünen kısa tanım."
                    hint="Boşluk bırakmadan en fazla 32 karakter."
                    value={textInputValue}
                    maxLength={32}
                    showCount
                    onValueChange={setTextInputValue}
                    leadingVisual={<span aria-hidden="true">@</span>}
                  />
                </PreviewPanel>
                <PreviewPanel title="Doğru kullanım notu">
                  <Text variant="secondary" className="block leading-7">
                    Birincil form alanı için label, description ve hint aynı yüzeyde görünür. Sayaç sadece karakter
                    baskısı olan alanlarda açılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-search',
            eyebrow: 'Alternative 02',
            title: 'Search / command bar input',
            description: 'Arama ve filtre satırlarında kullanılan daha hızlı, kısa ve aksiyon odaklı varyant.',
            badges: ['search', 'compact', 'leading-icon'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Search">
                  <TextInput
                    label="Arama"
                    description="Kayıt, şirket veya kullanıcı ara."
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                    trailingVisual={<SectionBadge label="⌘K" />}
                  />
                </PreviewPanel>
                <PreviewPanel title="Filter row">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                    <TextInput
                      label="Hızlı filtre"
                      defaultValue="policy"
                      size="sm"
                      fullWidth
                      leadingVisual={<span aria-hidden="true">⌕</span>}
                    />
                    <Button variant="secondary" className="sm:self-end">Uygula</Button>
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-validation',
            eyebrow: 'Alternative 03',
            title: 'Validation / state matrix',
            description: 'Aynı primitive ile doğrulanan, hatalı ve readonly alan davranışı.',
            badges: ['validation', 'readonly', 'error'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Success-adjacent">
                  <TextInput
                    label="Doğrulanan alan"
                    defaultValue="nova.user"
                    trailingVisual={<span aria-hidden="true">✓</span>}
                  />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <TextInput label="Hatalı alan" defaultValue="!" invalid error="En az 3 karakter girilmeli." />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <TextInput label="Readonly alan" defaultValue="system-generated" access="readonly" />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-density',
            eyebrow: 'Alternative 04',
            title: 'Density / sizing matrix',
            description: 'Aynı API ile küçük, orta ve geniş hit-area seçenekleri.',
            badges: ['sm', 'md', 'lg'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Small">
                  <TextInput label="Kompakt alan" defaultValue="sm-density" size="sm" />
                </PreviewPanel>
                <PreviewPanel title="Medium">
                  <TextInput label="Varsayılan alan" defaultValue="md-density" size="md" />
                </PreviewPanel>
                <PreviewPanel title="Large">
                  <TextInput label="Vurgulu alan" defaultValue="lg-density" size="lg" trailingVisual={<span aria-hidden="true">→</span>} />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-input-invite',
            eyebrow: 'Alternative 05',
            title: 'Inline action / invite flow',
            description: 'Alan ve aksiyonu aynı blokta gösteren kısa iş akışı örneği.',
            badges: ['action-pair', 'cta', 'task-flow'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto]">
                <PreviewPanel title="Invite input">
                  <TextInput
                    label="Davet e-postası"
                    description="Yeni paydaşı ekle."
                    value={inviteInputValue}
                    onValueChange={setInviteInputValue}
                    type="email"
                    leadingVisual={<span aria-hidden="true">✉</span>}
                    trailingVisual={<Badge tone="info">Pending</Badge>}
                  />
                </PreviewPanel>
                <div className="flex items-end">
                  <Button fullWidth={false} trailingVisual={<span aria-hidden="true">→</span>}>
                    Davet gönder
                  </Button>
                </div>
              </div>
            ),
          },
          {
            id: 'text-input-access',
            eyebrow: 'Alternative 06',
            title: 'Policy / access controlled states',
            description: 'Aynı bileşenin readonly, disabled ve hidden politika modları.',
            badges: ['access', 'policy', 'governance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <TextInput
                    label="Sözleşmeli alan"
                    defaultValue="release-window"
                    access="readonly"
                    hint="Bu alan yalnız sistem tarafından değiştirilir."
                  />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <TextInput
                    label="Kilitleme sonrası"
                    defaultValue="publish-locked"
                    access="disabled"
                    hint="Yayın sonrasında düzenleme kapalı."
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Hidden state sayfada boşluk bırakmamalı; disabled ve readonly ise aynı görünmemeli. Biri pasif,
                    diğeri bilgi taşıyan kilitli durumdur.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TextArea':
        return [
          {
            id: 'text-area-authoring',
            eyebrow: 'Alternative 01',
            title: 'Authoring / note field',
            description: 'Uzun açıklama yazımı için birincil authoring yüzeyi.',
            badges: ['authoring', 'auto-resize', 'count'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Auto resize">
                  <TextArea
                    label="Açıklama"
                    description="Uzun içerik alanları için ortak metin girişi."
                    hint="Çok satırlı bilgi girişi için otomatik yükseklik ayarı."
                    value={commentValue}
                    rows={3}
                    maxLength={180}
                    showCount
                    resize="auto"
                    onValueChange={setCommentValue}
                  />
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Authoring yüzeylerinde `auto` resize daha doğal. Audit veya sabit layout alanlarında kontrollü
                    dikey resize tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-review',
            eyebrow: 'Alternative 02',
            title: 'Review / decision log',
            description: 'Karar, itiraz veya yorum kaydı için okunaklı review alanı.',
            badges: ['review', 'audit', 'multiline'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Reviewer note">
                  <TextArea
                    label="İnceleme notu"
                    defaultValue="Politika metni güncellendi; yayın öncesi hukuk ekibi son gözden geçirmeyi tamamlamalı."
                    rows={5}
                  />
                </PreviewPanel>
                <PreviewPanel title="Readonly audit">
                  <TextArea
                    label="Otomatik oluşturulan log"
                    defaultValue="2026-03-07 12:48 · system-bot -> release evidence dosyasi eklendi."
                    access="readonly"
                    rows={5}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-validation',
            eyebrow: 'Alternative 03',
            title: 'Validation / enforcement',
            description: 'Eksik açıklama, minimum içerik ve kullanıcı geri bildirimi.',
            badges: ['error', 'hint', 'count'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Invalid">
                  <TextArea
                    label="Validation örneği"
                    defaultValue="Eksik açıklama"
                    invalid
                    error="Bu alan en az 20 karakter olmalı."
                    rows={3}
                  />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <TextArea label="Readonly not" defaultValue="Sistem logu kullanıcı tarafından değiştirilemez." access="readonly" rows={3} />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <TextArea label="Disabled draft" defaultValue="Yayın sonrası kilitlenir." access="disabled" rows={3} />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-layout',
            eyebrow: 'Alternative 04',
            title: 'Panel / side-by-side layout',
            description: 'Dar yan panel ve geniş içerik paneli için aynı bileşenin iki yerleşim örneği.',
            badges: ['layout', 'panel', 'responsive'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <PreviewPanel title="Side panel">
                  <TextArea label="Kısa not" defaultValue="Kompakt panel notu." rows={3} />
                </PreviewPanel>
                <PreviewPanel title="Primary editor">
                  <TextArea
                    label="Yayın notu"
                    defaultValue="Bu sürümde navigation bileşenleri yeniden düzenlendi, forms wave açıldı ve frontend doctor kanıtı zorunlu hale getirildi."
                    rows={6}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'text-area-recipes',
            eyebrow: 'Alternative 05',
            title: 'Recipe summary',
            description: 'Hangi bağlamda hangi TextArea davranışı seçilmeli.',
            badges: ['recipes', 'selection-guide'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <LibraryMetricCard label="Comment" value="auto" note="Yorum ve tartışma akışlarında auto resize." />
                <LibraryMetricCard label="Audit" value="readonly" note="Sistem logu ve immutable kayıt yüzeyleri." />
                <LibraryMetricCard label="Policy" value="vertical" note="Uzun hukuki metinlerde kontrollü resize." />
              </div>
            ),
          },
        ];
      case 'Checkbox':
        return [
          {
            id: 'checkbox-single',
            eyebrow: 'Alternative 01',
            title: 'Single consent',
            description: 'Tek satırlı onay ve bildirim alanı.',
            badges: ['consent', 'single-choice'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled">
                  <Checkbox
                    label="Yayın sonrası bildirim gönder"
                    description="Akış tamamlandığında paydaşlara otomatik bilgi ver."
                    hint="İşlem anında kapatılabilir."
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Tek karar alanlarında checkbox, çok seçenekli ama bağımsız tercihlerde stacked checkbox listesi tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'checkbox-states',
            eyebrow: 'Alternative 02',
            title: 'State matrix',
            description: 'Eksik onay, kısmi seçim, readonly ve disabled davranışı.',
            badges: ['invalid', 'indeterminate', 'access'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <PreviewPanel title="Invalid">
                  <Checkbox label="Eksik onay" invalid error="Devam etmeden önce onay vermelisin." />
                </PreviewPanel>
                <PreviewPanel title="Indeterminate">
                  <Checkbox label="Kısmi seçim" indeterminate hint="Alt seçeneklerin bir bölümü seçili." />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <Checkbox label="Readonly seçim" defaultChecked access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Checkbox label="Disabled seçim" access="disabled" />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Radio':
        return [
          {
            id: 'radio-choice',
            eyebrow: 'Alternative 01',
            title: 'Single-choice strategy',
            description: 'Bir kararın tek seçenekle seçildiği yönlendirici form yüzeyi.',
            badges: ['single-choice', 'decision'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled group">
                  <div className="space-y-3">
                    <Radio
                      name="wave-3-radio-demo"
                      value="design"
                      label="Design odaklı"
                      description="Önce görünüm ve doküman kalitesini tamamla."
                      checked={radioValue === 'design'}
                      onCheckedChange={(checked) => checked && setRadioValue('design')}
                    />
                    <Radio
                      name="wave-3-radio-demo"
                      value="ops"
                      label="Ops odaklı"
                      description="Doctor ve gate kanıtı önce tamamlansın."
                      checked={radioValue === 'ops'}
                      onCheckedChange={(checked) => checked && setRadioValue('ops')}
                    />
                    <Radio
                      name="wave-3-radio-demo"
                      value="delivery"
                      label="Delivery odaklı"
                      description="Feature sonrası teslim artefact’larını önceliklendir."
                      checked={radioValue === 'delivery'}
                      onCheckedChange={(checked) => checked && setRadioValue('delivery')}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Selected value">
                  <LibraryMetricCard label="Current selection" value={radioValue} note="Controlled radio state shell tarafından yönetiliyor." />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'radio-states',
            eyebrow: 'Alternative 02',
            title: 'State matrix',
            description: 'Geçersiz, readonly ve disabled radyo durumları.',
            badges: ['invalid', 'readonly', 'disabled'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <PreviewPanel title="Default">
                  <Radio name="wave-3-radio-state" value="default" label="Varsayılan seçenek" defaultChecked />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <Radio
                    name="wave-3-radio-state"
                    value="invalid"
                    label="Eksik seçim"
                    invalid
                    error="En az bir dağıtım stratejisi seçilmeli."
                  />
                </PreviewPanel>
                <PreviewPanel title="Readonly">
                  <Radio name="wave-3-radio-state" value="readonly" label="Readonly seçenek" access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Radio name="wave-3-radio-state" value="disabled" label="Disabled seçenek" access="disabled" />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Switch':
        return [
          {
            id: 'switch-live-toggle',
            eyebrow: 'Alternative 01',
            title: 'Live publish switch',
            description: 'Tek toggle ile görünürlük veya rollout durumu değiştiren kontrollü kullanım.',
            badges: ['toggle', 'controlled', 'release'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled toggle">
                  <Switch
                    label="Canlı görünürlüğü aç"
                    description="Yayınlanan ekranı son kullanıcıya anında görünür yap."
                    hint="İhtiyaç halinde tekrar kapatabilirsin."
                    checked={switchValue}
                    onCheckedChange={(checked) => setSwitchValue(checked)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Current status">
                  <LibraryMetricCard
                    label="Live state"
                    value={switchValue ? 'enabled' : 'disabled'}
                    note="Switch değişikliği controlled state ile doğrudan izleniyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'switch-states',
            eyebrow: 'Alternative 02',
            title: 'State matrix',
            description: 'Readonly, disabled ve policy-blocked switch davranışları.',
            badges: ['readonly', 'disabled', 'invalid'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <Switch label="Readonly toggle" defaultChecked access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Switch label="Disabled toggle" access="disabled" />
                </PreviewPanel>
                <PreviewPanel title="Blocked by policy">
                  <Switch label="Ek onay gerekiyor" invalid error="Bu geçiş için ek onay gerekiyor." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Slider':
        return [
          {
            id: 'slider-density',
            eyebrow: 'Alternative 01',
            title: 'Density calibration',
            description: 'Alan yoğunluğu ve layout sıkılığı için kontrollü numeric seçim.',
            badges: ['range', 'controlled', 'density'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled slider">
                  <Slider
                    label="Yoğunluk"
                    description="Kart ve tablo boşluk kararını tek kaynaktan yönet."
                    hint="Daha yüksek değer daha ferah görünüm üretir."
                    min={20}
                    max={100}
                    step={4}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minLabel="Kompakt"
                    maxLabel="Rahat"
                    valueFormatter={(value) => `${value}%`}
                  />
                </PreviewPanel>
                <PreviewPanel title="Current value">
                  <LibraryMetricCard
                    label="Density"
                    value={`${sliderValue}%`}
                    note="Slider değeri controlled state ile preview ve regression yüzeyine taşınıyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'slider-states',
            eyebrow: 'Alternative 02',
            title: 'Readonly and policy states',
            description: 'Readonly ve blocked by policy senaryolarında range input davranışı.',
            badges: ['readonly', 'invalid', 'policy'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly">
                  <Slider label="Readonly slider" value={72} access="readonly" valueFormatter={(value) => `${value}%`} />
                </PreviewPanel>
                <PreviewPanel title="Policy blocked">
                  <Slider label="Blocked by policy" defaultValue={36} invalid error="Bu değişim için ek approval gerekiyor." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'DatePicker':
        return [
          {
            id: 'datepicker-milestone',
            eyebrow: 'Alternative 01',
            title: 'Milestone planner',
            description: 'Takvim bazlı teslim tarihi ve rollout günü seçimi.',
            badges: ['calendar', 'milestone', 'controlled'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled date">
                  <DatePicker
                    label="Teslim tarihi"
                    description="Görevin tamamlanacağı günü planla."
                    hint="Takvim seçimi ile shareable milestone üret."
                    value={dateValue}
                    min="2026-03-08"
                    max="2026-04-30"
                    onValueChange={setDateValue}
                  />
                </PreviewPanel>
                <PreviewPanel title="Selected date">
                  <LibraryMetricCard
                    label="Delivery date"
                    value={dateValue}
                    note="DatePicker controlled değerini release ve planning akışına taşıyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'datepicker-states',
            eyebrow: 'Alternative 02',
            title: 'Readonly and validation states',
            description: 'Readonly ve invalid tarih seçimleri için tek shell kontratı.',
            badges: ['readonly', 'invalid', 'date-entry'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly">
                  <DatePicker label="Readonly date" value="2026-03-09" access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <DatePicker label="Invalid milestone" defaultValue="2026-03-01" invalid error="Tarih mevcut release penceresinin dışında." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TimePicker':
        return [
          {
            id: 'timepicker-cutover-window',
            eyebrow: 'Alternative 01',
            title: 'Cutover window planner',
            description: 'Deployment, maintenance ve approval pencere saatlerini kontrollü şekilde yönetir.',
            badges: ['time-entry', 'controlled', 'release-window'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled time">
                  <TimePicker
                    label="Kesim saati"
                    description="Bakim penceresindeki uygulama saatini sec."
                    hint="15 dakikalik adimlarla ilerle."
                    value={timeValue}
                    min="09:00"
                    max="22:00"
                    step={900}
                    onValueChange={setTimeValue}
                  />
                </PreviewPanel>
                <PreviewPanel title="Selected time">
                  <LibraryMetricCard
                    label="Cutover time"
                    value={timeValue}
                    note="TimePicker controlled state ile rollout akisini besliyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'timepicker-state-matrix',
            eyebrow: 'Alternative 02',
            title: 'Readonly and invalid states',
            description: 'Readonly ve release-window validation senaryolari ayni shell diliyle gorulur.',
            badges: ['readonly', 'invalid', 'governed-input'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly">
                  <TimePicker label="Readonly time" value="18:45" access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <TimePicker label="Invalid cutover" defaultValue="23:30" invalid error="Bu saat izinli deployment penceresinin dışında." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Upload':
        return [
          {
            id: 'upload-evidence-pack',
            eyebrow: 'Alternative 01',
            title: 'Evidence pack uploader',
            description: 'Policy, release ve denetim kanitlarini tek alanda toplayan kontrollu upload yuzeyi.',
            badges: ['files', 'multiple', 'evidence'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Controlled upload">
                  <Upload
                    label="Kanit paketi"
                    description="Release ve approval kanitlarini ayni yerden topla."
                    hint="PDF, XLSX ve ZIP desteklenir."
                    accept=".pdf,.xlsx,.zip"
                    multiple
                    maxFiles={4}
                    files={uploadFiles}
                    onFilesChange={setUploadFiles}
                  />
                </PreviewPanel>
                <PreviewPanel title="Payload summary">
                  <LibraryMetricCard
                    label="Files"
                    value={`${uploadFiles.length}`}
                    note={uploadFiles.map((file) => file.name).join(', ')}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'upload-governed-states',
            eyebrow: 'Alternative 02',
            title: 'Validation and access states',
            description: 'Readonly, disabled ve policy-blocked upload davranislari ayri panelde gorulur.',
            badges: ['readonly', 'disabled', 'invalid'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <Upload label="Readonly upload" files={uploadFiles} access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="Disabled">
                  <Upload label="Disabled upload" access="disabled" />
                </PreviewPanel>
                <PreviewPanel title="Invalid">
                  <Upload label="Eksik kanit" invalid error="En az bir imzali PDF yuklenmeli." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'CommandPalette':
        return [
          {
            id: 'command-palette-global-launcher',
            eyebrow: 'Alternative 01',
            title: 'Global launcher / route switcher',
            description: 'Tüm route ve operasyonel aksiyonlari tek dialog içinde gezdiren ana komut paleti deneyimi.',
            badges: ['launcher', 'dialog', 'navigate'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Palette open state">
                  <div className="space-y-4">
                    <Button onClick={() => setCommandPaletteOpen(true)}>Komut paletini aç</Button>
                    <CommandPalette
                      open={commandPaletteOpen}
                      title="UI command center"
                      subtitle="Gezinim, release review ve AI destekli aksiyonlar ayni palette."
                      items={commandPaletteItems}
                      query={commandPaletteQuery}
                      onQueryChange={setCommandPaletteQuery}
                      onClose={() => setCommandPaletteOpen(false)}
                      onSelect={(id, selectedItem) => {
                        setLastCommandSelection(`${selectedItem.title} · ${id}`);
                      }}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Selected command">
                  <LibraryMetricCard
                    label="Selection"
                    value={lastCommandSelection ?? 'Henüz seçim yok'}
                    note="Palette selection route veya aksiyon state’ini besliyor."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'command-palette-readonly-browse',
            eyebrow: 'Alternative 02',
            title: 'Readonly browse mode',
            description: 'Erişim kısıtlı kullanıcılar komutları görebilir ama uygulayamaz; bu fark aynı bileşende korunur.',
            badges: ['readonly', 'governed', 'browse'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly palette contract">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <SectionBadge label="readonly" />
                      <SectionBadge label="discoverability" />
                      <SectionBadge label="no execution" />
                    </div>
                    <Text variant="secondary" className="block leading-7">
                      Readonly modda kullanıcı komut başlıklarını, group bilgisini ve shortcut bilgisini görür; aksiyon tetiklenmez.
                    </Text>
                    <List
                      items={commandPaletteItems.map((item) => ({
                        key: item.id,
                        title: String(item.title),
                        description: String(item.description ?? ''),
                        meta: item.shortcut,
                        badges: [item.group ?? 'General'],
                      }))}
                      access="readonly"
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Contract note">
                  <Descriptions
                    title="Governance contract"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'access', label: 'Access', value: 'readonly', tone: 'info' },
                      { key: 'focus', label: 'Focus', value: 'discoverability + safety', tone: 'success' },
                      { key: 'ux', label: 'UX anchor', value: 'guided_navigation_assistance', tone: 'warning' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'command-palette-approval-scope',
            eyebrow: 'Alternative 03',
            title: 'Approval-scoped command set',
            description: 'AI ve approval akışları aynı palette scope badge’leriyle gruplanır.',
            badges: ['approval', 'ai-assist', 'scope'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Scoped commands">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <SectionBadge label="AI Assist" />
                      <SectionBadge label="Governance" />
                    </div>
                    <List
                      items={commandPaletteItems
                        .filter((item) => item.group === 'AI Assist' || item.group === 'Governance')
                        .map((item) => ({
                          key: item.id,
                          title: String(item.title),
                          description: String(item.description ?? ''),
                          meta: item.shortcut,
                          badges: [item.group ?? 'General'],
                        }))}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Scope summary">
                  <div className="flex flex-wrap gap-2">
                    <SectionBadge label="AI Assist" />
                    <SectionBadge label="Governance" />
                    <SectionBadge label="approval queue" />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'RecommendationCard':
        return [
          {
            id: 'recommendation-card-rollout',
            eyebrow: 'Alternative 01',
            title: 'Rollout recommendation card',
            description: 'AI destekli rollout önerisini rationale, citation ve confidence ile birlikte gösterir.',
            badges: ['ai', 'rollout', 'confidence'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Interactive decision card">
                  <RecommendationCard
                    title="Forms wave rollout hazır"
                    summary="Gate ve doctor sonuçları forms dalgasının kontrollü şekilde publish edilebileceğini gösteriyor."
                    recommendationType="Rollout"
                    rationale={['wave gate PASS', 'doctor evidence clean', 'security residual governed']}
                    citations={['wave_3_forms', 'doctor:frontend', 'security-remediation']}
                    confidenceLevel="high"
                    confidenceScore={91}
                    sourceCount={5}
                    tone={recommendationDecision === 'applied' ? 'success' : recommendationDecision === 'review' ? 'warning' : 'info'}
                    onPrimaryAction={() => setRecommendationDecision('applied')}
                    onSecondaryAction={() => setRecommendationDecision('review')}
                    footerNote={`Decision state: ${recommendationDecision}`}
                  />
                </PreviewPanel>
                <PreviewPanel title="Decision summary">
                  <LibraryMetricCard
                    label="Current decision"
                    value={recommendationDecision}
                    note="Card state doctor ve audit timeline ile senkron tutulur."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'recommendation-card-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly governance advisory',
            description: 'İnceleme amaçlı kartta aksiyon butonları erişim moduna göre kilitlenir.',
            badges: ['readonly', 'governance', 'advisory'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly card">
                  <RecommendationCard
                    title="Manual approval required"
                    summary="Bu öneri yalnız okunur şekilde gösterilir; onay akışı ayrı yüzeyden ilerler."
                    recommendationType="Advisory"
                    rationale={['high policy impact', 'human checkpoint required']}
                    citations={['approval_checkpoint', 'policy_work_intake']}
                    confidenceLevel="medium"
                    confidenceScore={74}
                    access="readonly"
                    compact
                  />
                </PreviewPanel>
                <PreviewPanel title="Reasoning surface">
                  <Text variant="secondary" className="block leading-7">
                    Recommendation card, öneri metnini tek başına bırakmaz; gerekçe, citation ve confidence aynı yüzeyde okunur.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'recommendation-card-compact-queue',
            eyebrow: 'Alternative 03',
            title: 'Compact queue card',
            description: 'Onay kuyruğunda çoklu önerileri daha kompakt hacimde göstermeye yarar.',
            badges: ['compact', 'queue', 'triage'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {['security', 'release', 'ux'].map((scope, index) => (
                  <RecommendationCard
                    key={scope}
                    title={`${scope.toUpperCase()} recommendation`}
                    summary="Sıradaki öneri başlığını kompakt yoğunlukta göster."
                    recommendationType="Queue item"
                    confidenceLevel={index === 0 ? 'high' : index === 1 ? 'medium' : 'low'}
                    confidenceScore={index === 0 ? 88 : index === 1 ? 67 : 41}
                    compact
                    badges={[<Tag key={scope} tone="muted">{scope}</Tag>]}
                  />
                ))}
              </div>
            ),
          },
        ];
      case 'ConfidenceBadge':
        return [
          {
            id: 'confidence-badge-matrix',
            eyebrow: 'Alternative 01',
            title: 'Confidence matrix',
            description: 'Low -> very-high seviyelerini skor ve kaynak sayısı ile birlikte gösterir.',
            badges: ['matrix', 'explainability', 'score'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="All levels">
                  <div className="flex flex-wrap gap-3">
                    <ConfidenceBadge level="low" score={35} sourceCount={1} />
                    <ConfidenceBadge level="medium" score={62} sourceCount={3} />
                    <ConfidenceBadge level="high" score={84} sourceCount={5} />
                    <ConfidenceBadge level="very-high" score={97} sourceCount={9} />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Reading guidance">
                  <Text variant="secondary" className="block leading-7">
                    Confidence badge yorum desteğidir; confidence, citation ve human review gereksinimi birlikte okunmalıdır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'confidence-badge-compact',
            eyebrow: 'Alternative 02',
            title: 'Compact inline usage',
            description: 'Dense list ve action header akışlarında aynı badge daha kompakt gösterilir.',
            badges: ['compact', 'inline', 'dense-ui'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact badges">
                  <div className="flex flex-wrap gap-3">
                    <ConfidenceBadge level="high" score={86} compact />
                    <ConfidenceBadge level="medium" label="Manual review" compact showScore={false} />
                    <ConfidenceBadge level="low" score={28} compact />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Header embedding">
                  <div className="flex flex-wrap items-center gap-3">
                    <Text preset="title">AI suggestion</Text>
                    <ConfidenceBadge level="high" score={89} compact />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'confidence-badge-governed-states',
            eyebrow: 'Alternative 03',
            title: 'Access and transparency states',
            description: 'Readonly ve controlled transparency durumları aynı kontratta gösterilir.',
            badges: ['readonly', 'transparency', 'governed'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <PreviewPanel title="Readonly">
                  <ConfidenceBadge level="medium" score={70} sourceCount={2} access="readonly" />
                </PreviewPanel>
                <PreviewPanel title="No score">
                  <ConfidenceBadge level="high" showScore={false} sourceCount={4} />
                </PreviewPanel>
                <PreviewPanel title="Custom label">
                  <ConfidenceBadge level="low" label="Escalate" compact />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'ApprovalCheckpoint':
        return [
          {
            id: 'approval-checkpoint-interactive',
            eyebrow: 'Alternative 01',
            title: 'Interactive human checkpoint',
            description: 'AI tavsiyesi, kanit listesi ve human approval aksiyonlari tek kontratta birlesir.',
            badges: ['approval', 'governance', 'human-in-loop'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Controlled checkpoint">
                  <ApprovalCheckpoint
                    title="Production release approval"
                    summary="Doctor ve security kaniti PASS oldugunda son insan karari bu bloktan cikar."
                    status={approvalCheckpointState}
                    approverLabel="Platform board"
                    dueLabel="Before publish"
                    evidenceItems={['doctor:frontend', 'security-guardrails', 'release-canary']}
                    steps={approvalCheckpointSteps}
                    citations={citationPanelItems.map((item) => item.locator as string)}
                    onPrimaryAction={() => setApprovalCheckpointState('approved')}
                    onSecondaryAction={() => setApprovalCheckpointState('rejected')}
                    footerNote={`Decision: ${approvalCheckpointState}`}
                  />
                </PreviewPanel>
                <PreviewPanel title="Decision summary">
                  <LibraryMetricCard
                    label="Approval state"
                    value={approvalCheckpointState}
                    note="State audit timeline ile birlikte okunur."
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'approval-checkpoint-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly review queue',
            description: 'Onay kuyrugunda ayni bileşen yalnız okunur modda kullanilir.',
            badges: ['readonly', 'queue', 'review'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly queue item">
                  <ApprovalCheckpoint
                    title="Readonly queue card"
                    summary="Insan onayi bekleyen ama aksiyon yetkisi olmayan kullanicilar icin."
                    access="readonly"
                    evidenceItems={['doctor:frontend', 'ux alignment']}
                    steps={approvalCheckpointSteps}
                    citations={['sec:4.2', 'ux:ai-3']}
                  />
                </PreviewPanel>
                <PreviewPanel title="Governance note">
                  <Text variant="secondary" className="block leading-7">
                    Aynı primitive hem onay akışı hem de inceleme kuyruğunda kullanılır; fark erişim seviyesiyle belirlenir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'CitationPanel':
        return [
          {
            id: 'citation-panel-source-transparency',
            eyebrow: 'Alternative 01',
            title: 'Source transparency panel',
            description: 'Policy, UX ve doctor kanıtları tek panelde okunur ve seçili kaynak vurgulanır.',
            badges: ['sources', 'transparency', 'citations'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Selectable sources">
                  <CitationPanel
                    items={citationPanelItems}
                    activeCitationId={selectedCitationId}
                    onOpenCitation={(id) => setSelectedCitationId(id)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Selected source">
                  <Descriptions
                    title="Citation context"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'active', label: 'Active', value: selectedCitationId ?? '—', tone: 'info' },
                      {
                        key: 'source',
                        label: 'Source',
                        value: (citationPanelItems.find((item) => item.id === selectedCitationId)?.source as string) ?? '—',
                        tone: 'success',
                      },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'citation-panel-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly reference surface',
            description: 'Kaynak paneli aksiyon vermez ama alinti ve locator bilgisini korur.',
            badges: ['readonly', 'reference', 'governed'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly citations">
                  <CitationPanel items={citationPanelItems} access="readonly" activeCitationId="policy-4-2" />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    Citation panel, recommendation ve approval yüzeylerinde aynı primitive olarak tekrar kullanılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'AIActionAuditTimeline':
        return [
          {
            id: 'audit-timeline-interactive',
            eyebrow: 'Alternative 01',
            title: 'Interactive audit trail',
            description: 'AI aksiyonlari, insan review ve system eventleri tek timeline primitive ile okunur.',
            badges: ['audit', 'timeline', 'observability'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Selectable timeline">
                  <AIActionAuditTimeline
                    items={auditTimelineItems}
                    selectedId={selectedAuditId}
                    onSelectItem={(id) => setSelectedAuditId(id)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Selected event">
                  <LibraryMetricCard
                    label="Event"
                    value={selectedAuditId ?? '—'}
                    note={(auditTimelineItems.find((item) => item.id === selectedAuditId)?.title as string) ?? 'Kayit secilmedi'}
                  />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'audit-timeline-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly evidentiary log',
            description: 'Readonly modda timeline seçim yapmadan audit kanıtı olarak kullanılır.',
            badges: ['readonly', 'evidence', 'history'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly history">
                  <AIActionAuditTimeline items={auditTimelineItems} access="readonly" selectedId="audit-review" />
                </PreviewPanel>
                <PreviewPanel title="Audit note">
                  <Text variant="secondary" className="block leading-7">
                    Bu blok approval, recommendation ve release sayfalarında aynı davranışla tekrar kullanılabilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'PromptComposer':
        return [
          {
            id: 'prompt-composer-controlled',
            eyebrow: 'Alternative 01',
            title: 'Controlled prompt authoring',
            description: 'Prompt subject, body, scope ve tone tek composer primitive ile kontrol edilir.',
            badges: ['prompt', 'controlled', 'guardrails'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <PreviewPanel title="Interactive composer">
                  <PromptComposer
                    subject={promptSubject}
                    onSubjectChange={setPromptSubject}
                    value={promptBody}
                    onValueChange={setPromptBody}
                    scope={promptScope}
                    onScopeChange={setPromptScope}
                    tone={promptTone}
                    onToneChange={setPromptTone}
                    guardrails={['pii-safe', 'approval-bound', 'source-required']}
                    citations={citationPanelItems.map((item) => item.locator as string)}
                  />
                </PreviewPanel>
                <PreviewPanel title="Live state">
                  <LibraryMetricCard label="Scope" value={promptScope} note={`Tone: ${promptTone}`} />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'prompt-composer-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly review mode',
            description: 'Draft prompt metni aynı bileşenle gözden geçirilir ama değiştirilemez.',
            badges: ['readonly', 'review', 'prompt'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly composer">
                  <PromptComposer
                    subject={promptSubject}
                    value={promptBody}
                    scope={promptScope}
                    tone={promptTone}
                    access="readonly"
                    guardrails={['pii-safe', 'approval-bound', 'source-required']}
                    citations={citationPanelItems.map((item) => item.locator as string)}
                    footerNote="Readonly review mode"
                  />
                </PreviewPanel>
                <PreviewPanel title="Contract note">
                  <Text variant="secondary" className="block leading-7">
                    Prompt composer, free-form textarea yerine scope ve tone guardrail'leri görünür kılar.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Modal':
        return [
          {
            id: 'modal-confirm-dialog',
            eyebrow: 'Alternative 01',
            title: 'Confirm / destructive dialog',
            description: 'Yüksek riskli aksiyonlarda karar, ikincil açıklama ve footer action dilini tek overlay shell üzerinde toplar.',
            badges: ['dialog', 'stable', 'confirmation'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Interactive confirm modal">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setModalOpen(true)}>Modal aç</Button>
                    <SectionBadge label="Riskli aksiyon" />
                  </div>
                  <Modal
                    open={modalOpen}
                    title="Rollout onayı gerekiyor"
                    onClose={() => setModalOpen(false)}
                    footer={(
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Vazgeç</Button>
                        <Button variant="destructive" onClick={() => setModalOpen(false)}>Onayla</Button>
                      </div>
                    )}
                  >
                    <Text variant="secondary" className="block leading-7">
                      Bu adım yayın hattını tetikler. Kullanıcıya risk, kapsam ve dönüş etkisi aynı dialog içinde görünmelidir.
                    </Text>
                  </Modal>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Modal, sayfa içi ufak yardım için değil; karar, kesinti, onay ve form odaklı kısa görevler için kullanılmalı.
                    Overlay click ve escape davranışı task riskine göre yönetilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'modal-audit-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly / audit review dialog',
            description: 'Kilitli içerik, readonly inceleme ve kanıt gösterimi için daha sakin modal varyantı.',
            badges: ['readonly', 'audit', 'review'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Review dialog pattern">
                  <div className="rounded-3xl border border-border-subtle bg-surface-canvas p-5">
                    <Text preset="title">Kanıt özeti</Text>
                    <Text variant="secondary" className="mt-3 block leading-7">
                      Dialog içinde readonly metin, ek bilgi ve tek bir kapatma aksiyonu gösterilir. Kullanıcıdan veri
                      beklenmeyen durumlarda dialog dili daha sakin ve düşük gerilimli tutulur.
                    </Text>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="info">Readonly review</Badge>
                      <Badge tone="muted">No inline edit</Badge>
                    </div>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Aynı modal primitive hem destructive hem readonly review akışını taşıyabilir; fark, copy ve footer
                    aksiyonlarının sayısı ile tonunda yaratılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Dropdown':
        return [
          {
            id: 'dropdown-action-menu',
            eyebrow: 'Alternative 01',
            title: 'Action menu',
            description: 'Satır bazlı hızlı aksiyonlar ve overflow menu davranışı için ana kullanım kalıbı.',
            badges: ['menu', 'stable', 'actions'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Row action menu">
                  <div className="flex flex-wrap items-center gap-3">
                    <Dropdown
                      trigger={<span>Aksiyon Menüsü</span>}
                      items={[
                        { key: 'publish', label: 'Publish' },
                        { key: 'duplicate', label: 'Duplicate' },
                        { key: 'archive', label: 'Archive' },
                      ]}
                      onSelect={setDropdownAction}
                    />
                    <Text variant="secondary">Seçim: {dropdownAction}</Text>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Dropdown bir navigasyon ağacı değildir. Kısa eylem listeleri, satır bazlı işlemler ve bağlamsal hızlandırıcılar
                    için kullanılır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'dropdown-filter-density',
            eyebrow: 'Alternative 02',
            title: 'Filter / density selector',
            description: 'Aynı primitive ile görünüm yoğunluğu ve küçük ayar menülerini yönetir.',
            badges: ['filters', 'density', 'compact'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Density selector">
                  <div className="flex flex-wrap items-center gap-3">
                    <Dropdown
                      trigger={<span>Yoğunluk seç</span>}
                      align="right"
                      items={[
                        { key: 'compact', label: 'Compact' },
                        { key: 'comfortable', label: 'Comfortable' },
                        { key: 'relaxed', label: 'Relaxed' },
                      ]}
                    />
                    <SectionBadge label="right aligned" />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Policy note">
                  <Text variant="secondary" className="block leading-7">
                    Dropdown içeriği kısa kalmalı. Uzun, çok seviyeli ya da açıklama ağırlıklı içerik için popover veya drawer
                    tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Tooltip':
        return [
          {
            id: 'tooltip-inline-hint',
            eyebrow: 'Alternative 01',
            title: 'Inline hint / affordance',
            description: 'Dar alanda kısa yardımcı açıklamaları fokus ve hover ile görünür kılar.',
            badges: ['hint', 'beta', 'inline'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
                <PreviewPanel title="Inline help">
                  <div className="flex flex-wrap items-center gap-3">
                    <Tooltip text="Tooltip örneği">
                      <Button variant="secondary">Hover / Focus</Button>
                    </Tooltip>
                    <Tooltip text="Kisa yardim metni yalnizca ek baglam verir.">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-canvas text-sm font-semibold text-text-secondary">i</span>
                    </Tooltip>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Tooltip, kritik doğrulama mesajı veya uzun eğitim içeriği taşımaz. Kısa yardım, affordance açıklaması ve ikon
                    etiketleme için uygundur.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tooltip-policy-guidance',
            eyebrow: 'Alternative 02',
            title: 'Policy / readonly guidance',
            description: 'Readonly veya kontrollü yüzeylerde neden-sonuç bilgisini boğmadan gösterir.',
            badges: ['policy', 'readonly', 'guidance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly reason">
                  <div className="flex flex-wrap items-center gap-3">
                    <Tooltip text="Bu alan yayın penceresi dışında readonly duruma alınır.">
                      <Button access="readonly" variant="ghost">Readonly alan</Button>
                    </Tooltip>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Kullanıcıyı durduracak ya da karar verdirecek içerik tooltip yerine dialog, inline error veya panel yüzeyine
                    taşınmalıdır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'FormDrawer':
        return [
          {
            id: 'form-drawer-create-flow',
            eyebrow: 'Alternative 01',
            title: 'Form drawer / create flow',
            description: 'Sayfa bağlamını kaybetmeden kısa veri girişini side panel içine taşır.',
            badges: ['drawer', 'stable', 'form'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Create / edit panel">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setFormDrawerOpen(true)}>Yeni kayıt drawer</Button>
                    <SectionBadge label="slide-over" />
                  </div>
                  <FormDrawer open={formDrawerOpen} title="Yeni kayıt" onClose={() => setFormDrawerOpen(false)}>
                    <div className="flex flex-col gap-3">
                      <TextInput label="Kayıt adı" value={textInputValue} onChange={(event) => setTextInputValue(event.target.value)} />
                      <Select
                        label="Yoğunluk"
                        value={selectValue}
                        onChange={(event) => setSelectValue(event.target.value)}
                        options={[
                          { value: 'compact', label: 'Compact' },
                          { value: 'comfortable', label: 'Comfortable' },
                        ]}
                      />
                    </div>
                  </FormDrawer>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    FormDrawer, modal yerine daha uzun ama hâlâ görev odaklı form akışları için kullanılmalı. Route değişmeden veri girişi
                    yapılır; ana ekran bağlamı korunur.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'form-drawer-readonly-policy',
            eyebrow: 'Alternative 02',
            title: 'Readonly / policy constrained form drawer',
            description: 'Kaydet aksiyonunu kapatıp inceleme ve bağlamı canlı tutar.',
            badges: ['readonly', 'policy', 'drawer'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly state">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => setReadonlyFormDrawerOpen(true)}>
                      Readonly drawer
                    </Button>
                    <SectionBadge label="policy-locked" />
                  </div>
                  <FormDrawer
                    open={readonlyFormDrawerOpen}
                    title="Readonly kayıt"
                    onClose={() => setReadonlyFormDrawerOpen(false)}
                    access="readonly"
                  >
                    <div className="flex flex-col gap-3">
                      <TextInput label="Kayıt adı" value="Readonly kayıt" readOnly onChange={() => undefined} />
                      <Text variant="secondary">Kaydet aksiyonu policy gereği kapalıdır.</Text>
                    </div>
                  </FormDrawer>
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Policy nedeniyle yalnız inceleme yapılacaksa drawer açık kalabilir; submit kapanır, kapatma ve bağlam görünürlüğü devam eder.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'DetailDrawer':
        return [
          {
            id: 'detail-drawer-tabbed-review',
            eyebrow: 'Alternative 01',
            title: 'Tabbed review drawer',
            description: 'Detay, audit ve rollout özetini aynı slide-over içinde sekmeli olarak sunar.',
            badges: ['drawer', 'stable', 'review'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Detail review panel">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setDetailDrawerOpen(true)}>Detay drawer</Button>
                    <SectionBadge label="tabbed" />
                  </div>
                  <DetailDrawer
                    open={detailDrawerOpen}
                    title="Rollout detay"
                    onClose={() => setDetailDrawerOpen(false)}
                    tabs={[
                      {
                        key: 'summary',
                        label: 'Summary',
                        sections: [
                          { key: 'owner', title: 'Owner', content: <Text variant="secondary">Platform Ops</Text> },
                          { key: 'scope', title: 'Scope', content: <Text variant="secondary">TR + EU rollout</Text> },
                        ],
                      },
                      {
                        key: 'audit',
                        label: 'Audit',
                        sections: [
                          { key: 'approval', title: 'Approval', content: <Text variant="secondary">07 Mar 2026 / approved</Text> },
                          { key: 'trace', title: 'Trace', content: <Text variant="secondary">trace-id: overlay-4471</Text> },
                        ],
                      },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    DetailDrawer; detail, audit ve summary içeriğini route kırmadan sunmak için uygundur. İçerik yoğunluğu modalı geçtiğinde drawer tercih edilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'detail-drawer-readonly-evidence',
            eyebrow: 'Alternative 02',
            title: 'Readonly evidence drawer',
            description: 'Kanıt ve özet bloklarını sekmesiz ama düzenli bir inceleme yüzeyinde toplar.',
            badges: ['readonly', 'evidence', 'summary'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Evidence summary">
                  <div className="rounded-3xl border border-border-subtle bg-surface-canvas p-5">
                    <Text preset="title">Deployment kanıtı</Text>
                    <Text variant="secondary" className="mt-3 block leading-7">
                      Detail drawer tek bir summary yüzeyi olarak da kullanılabilir. Özellikle readonly kanıt ve snapshot incelemelerinde iyi çalışır.
                    </Text>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    İçerik çok uzarsa drawer içinde section/tabs kullan; kısa ve pasif inceleme gerekiyorsa sekmesiz summary da yeterlidir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Popover':
        return [
          {
            id: 'popover-rich-guidance',
            eyebrow: 'Alternative 01',
            title: 'Rich contextual guidance',
            description: 'Tooltip için uzun, drawer için kısa kalan bağlamı yerinde gösterir.',
            badges: ['popover', 'beta', 'guidance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Contextual helper">
                  <div className="flex flex-wrap items-center gap-3">
                    <Popover
                      title="Policy note"
                      trigger={<Button variant="secondary">Popover aç</Button>}
                      content={(
                        <div className="space-y-3">
                          <Text variant="secondary" className="block leading-6">
                            Bu alan yalnız yayın penceresi açıkken düzenlenebilir. Kapsam ve risk kısa panel içinde açıklanır.
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            <Tag tone="info">Contextual</Tag>
                            <Tag tone="warning">Policy</Tag>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Popover, kısa ama rich içerik için kullanılır. Menü değildir; kullanıcıya yardımcı panel, ek bağlam veya küçük action cluster gösterir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'popover-readonly-panel',
            eyebrow: 'Alternative 02',
            title: 'Readonly helper panel',
            description: 'Readonly ve disabled akışlarda neden-sonuç bilgisini tooltipten daha görünür verir.',
            badges: ['readonly', 'helper', 'panel'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly helper">
                  <Popover
                    title="Readonly reason"
                    access="readonly"
                    trigger={<Button variant="ghost">Neden kapalı?</Button>}
                    content={<Text variant="secondary">Popover readonly olduğunda açılmaz; bu durumda başka yüzey seçilmelidir.</Text>}
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Eğer kullanıcı bir şey yapamayacaksa popover’ın kendisi de policy guard ile davranmalı; tooltip ya da inline mesaj alternatifi düşünülmelidir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'ContextMenu':
        return [
          {
            id: 'context-menu-action-trigger',
            eyebrow: 'Alternative 01',
            title: 'Action menu / release shortcuts',
            description: 'Kısa aksiyon listelerini policy ve review bağlamıyla aynı overlay içinde gösterir.',
            badges: ['overlay-extension', 'beta', 'actions'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Button trigger">
                  <div className="flex flex-wrap items-start gap-3">
                    <ContextMenu
                      buttonLabel="Bağlam menüsü"
                      title="Release actions"
                      testIdPrefix="design-lab-contextmenu"
                      items={[
                        { key: 'approve', label: 'Onay akışını başlat', description: 'İnsan onayı ve wave gate kanıtını birlikte toplar.' },
                        { key: 'review', label: 'İnceleme kuyruğuna ekle', description: 'Readonly review ve ek kanıt talebi üretir.' },
                        { key: 'archive', label: 'Arşive taşı', description: 'Eski varyantları planlı backlog alanına taşır.', danger: true },
                      ]}
                      onSelect={(key) => setContextMenuAction(key)}
                    />
                    <div
                      className="min-w-[220px] rounded-2xl border border-border-subtle bg-surface-canvas px-4 py-4 text-sm text-text-secondary"
                      data-testid="design-lab-contextmenu-result"
                    >
                      Son seçim: <span className="font-semibold text-text-primary">{contextMenuAction}</span>
                    </div>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Context menu, çok seviyeli ağaç veya uzun açıklama paneli değildir. Kısa ve bağlamsal aksiyonlar için kullanılır; derin bilgi gerekiyorsa popover ya da drawer seçilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'context-menu-surface-trigger',
            eyebrow: 'Alternative 02',
            title: 'Right-click / surface menu',
            description: 'Canvas veya kart yüzeyinde sağ tık davranışı ile aynı kontratı kullanır.',
            badges: ['right-click', 'surface', 'policy'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Surface trigger">
                  <ContextMenu
                    triggerMode="contextmenu"
                    title="Surface actions"
                    items={[
                      { key: 'duplicate', label: 'Kartı çoğalt', shortcut: 'D' },
                      { key: 'pin', label: 'Görünümü sabitle', shortcut: 'P' },
                      { key: 'readonly', label: 'Readonly nedeni göster', description: 'Policy guard ile sınırlandırılır.' },
                    ]}
                    onSelect={(key) => setContextMenuAction(`surface:${key}`)}
                    trigger={(
                      <div className="space-y-2">
                        <Text preset="title">Sağ tıkla</Text>
                        <Text variant="secondary" className="block leading-7">
                          Surface menüleri satır, kart veya canvas üzerinde hızlı aksiyon verir. Gezinti ağacı için kullanılmaz.
                        </Text>
                      </div>
                    )}
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Sağ tık menüsü varsa aynı aksiyonların erişilebilir bir button trigger alternatifinin de olması gerekir. Yalnız mouse kullanıcılarına özel tasarım kabul edilmez.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TourCoachmarks':
        return [
          {
            id: 'tour-guided-walkthrough',
            eyebrow: 'Alternative 01',
            title: 'Guided onboarding / release walkthrough',
            description: 'Wave, preview ve release kanıtını adım adım açıklayan rehber yüzey.',
            badges: ['tour', 'guided', 'compliance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <PreviewPanel title="Interactive walkthrough">
                  <div className="flex flex-wrap items-start gap-3">
                    <Button
                      data-testid="design-lab-tour-open"
                      onClick={() => {
                        setTourOpen(true);
                        setTourStep(0);
                        setTourStatus('guided');
                      }}
                    >
                      Turu başlat
                    </Button>
                    <SectionBadge label={tourStatus === 'finished' ? 'finished' : tourStatus === 'guided' ? 'guided' : 'idle'} />
                  </div>
                  <div className="mt-4">
                    <TourCoachmarks
                      open={tourOpen}
                      currentStep={tourStep}
                      onStepChange={(index) => setTourStep(index)}
                      onClose={() => {
                        setTourOpen(false);
                        setTourStatus('idle');
                      }}
                      onFinish={() => {
                        setTourStatus('finished');
                        setTourOpen(false);
                      }}
                      testIdPrefix="design-lab-tour"
                      steps={[
                        {
                          id: 'scope',
                          title: 'Scope doğrulaması',
                          description: 'Önce wave ve registry sözleşmesi netleşir; kullanıcı neyi yayınladığını görür.',
                          meta: 'contract',
                        },
                        {
                          id: 'preview',
                          title: 'Canlı demo incelemesi',
                          description: 'Preview, API ve kalite kanıtı aynı walkthrough içinde açıklanır.',
                          meta: 'preview',
                          tone: 'success',
                        },
                        {
                          id: 'release',
                          title: 'Release evidence',
                          description: 'Doctor, gate ve security guardrail kanıtı tamamlanmadan tur bitmiş sayılmaz.',
                          meta: 'release',
                          tone: 'warning',
                        },
                      ]}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Tour/coachmarks yalnız onboarding için değil; kritik approval, release ve policy akışlarında adım adım bağlam gösterimi için de kullanılabilir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tour-readonly-compliance',
            eyebrow: 'Alternative 02',
            title: 'Readonly compliance walkthrough',
            description: 'Readonly policy nedenlerini ve kontrol noktalarını sakin bir anlatımla taşır.',
            badges: ['readonly', 'policy', 'walkthrough'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly tour">
                  <TourCoachmarks
                    defaultOpen
                    mode="readonly"
                    allowSkip={false}
                    showProgress={false}
                    access="readonly"
                    steps={[
                      {
                        id: 'policy',
                        title: 'Policy açıklaması',
                        description: 'Readonly walkthrough, kritik alanlarda kullanıcının neden-sonuç bilgisini aynı overlay içinde taşır.',
                        meta: 'readonly',
                      },
                      {
                        id: 'controls',
                        title: 'Kontrol noktaları',
                        description: 'Onay ve security kontrolleri tamamlanmadan release butonları görünür kalmaz.',
                        meta: 'controls',
                        tone: 'warning',
                      },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Rule of thumb">
                  <Text variant="secondary" className="block leading-7">
                    Coachmark yüzeyi çok uzun içerik taşıyacaksa docs sayfasına veya panel yapısına dönmek gerekir. Tur kısa, yönlendirici ve görev odaklı kalmalıdır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TableSimple':
        return [
          {
            id: 'table-simple-policy-list',
            eyebrow: 'Alternative 01',
            title: 'Policy / owner / status table',
            description: 'Task-critical policy listesini hafif, hızlı ve okunabilir bir tablo ile gösterir.',
            badges: ['table', 'beta', 'status'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Policy matrix">
                  <TableSimple
                    caption="Politika portföyü"
                    description="Owner ve status alanları tek tablo yüzeyinde."
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy', emphasis: true, truncate: true },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                      {
                        key: 'status',
                        label: 'Durum',
                        align: 'center',
                        render: (row) => <Badge tone={row.status === 'Aktif' ? 'success' : row.status === 'Taslak' ? 'warning' : 'info'}>{row.status}</Badge>,
                      },
                      { key: 'updatedAt', label: 'Güncelleme', accessor: 'updatedAt', align: 'right' },
                    ]}
                    rows={policyTableRows}
                    stickyHeader
                  />
                </PreviewPanel>
                <PreviewPanel title="Guidance">
                  <Text variant="secondary" className="block leading-7">
                    `TableSimple`, ağır grid altyapısına ihtiyaç olmayan görev listeleri için hızlı render, loading ve empty state
                    davranışını tek primitive ile verir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'table-simple-loading-empty',
            eyebrow: 'Alternative 02',
            title: 'Loading and empty states',
            description: 'Aynı primitive loading skeleton ve boş tablo davranışını yerel kopya olmadan sunar.',
            badges: ['loading', 'empty', 'compact'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Loading">
                  <TableSimple
                    caption="Loading tablosu"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    loading
                  />
                </PreviewPanel>
                <PreviewPanel title="Empty">
                  <TableSimple
                    caption="Boş tablo"
                    columns={[
                      { key: 'policy', label: 'Politika', accessor: 'policy' },
                      { key: 'owner', label: 'Sahip', accessor: 'owner' },
                    ]}
                    rows={[]}
                    emptyStateLabel="Henüz gösterilecek kayıt yok."
                    density="compact"
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Descriptions':
        return [
          {
            id: 'descriptions-rollout-summary',
            eyebrow: 'Alternative 01',
            title: 'Rollout / owner / scope summary',
            description: 'Owner, scope, review ve status bilgilerini hızlı okunur bir key-value yüzeyinde toplar.',
            badges: ['summary', 'beta', 'rollout'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Primary summary">
                  <Descriptions
                    title="Canary özeti"
                    description="Rollout owner, scope ve review snapshot tek blokta."
                    items={rolloutDescriptionItems}
                    columns={2}
                  />
                </PreviewPanel>
                <PreviewPanel title="Interpretation">
                  <Text variant="secondary" className="block leading-7">
                    `Descriptions`, özellikle drawer, detail panel ve approval yüzeylerinde tekrar eden label-value bloklarını
                    ortaklaştırır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'descriptions-compliance-panel',
            eyebrow: 'Alternative 02',
            title: 'Risk and approval panels',
            description: 'Risk, approval ve control snapshot’larını tone-aware bilgi kartlarıyla taşır.',
            badges: ['risk', 'approval', 'compact'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Approval">
                  <Descriptions
                    title="Risk ve onay"
                    items={[
                      { key: 'risk', label: 'Risk Seviyesi', value: 'Medium', tone: 'warning' },
                      { key: 'approval', label: 'Onay Akışı', value: '2/3 tamamlandı', helper: 'Security sign-off bekleniyor.' },
                      { key: 'ticket', label: 'Change ID', value: 'CHG-UI-204', tone: 'info' },
                    ]}
                    columns={1}
                    density="compact"
                  />
                </PreviewPanel>
                <PreviewPanel title="Ownership">
                  <Descriptions
                    title="Operasyon özeti"
                    items={[
                      { key: 'owner', label: 'Sahip', value: 'Platform UX' },
                      { key: 'window', label: 'Pencere', value: 'Cumartesi 22:00', tone: 'info' },
                      { key: 'signoff', label: 'Sign-off', value: 'Ready', tone: 'success' },
                    ]}
                    columns={1}
                    density="compact"
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'List':
        return [
          {
            id: 'list-operational-inbox',
            eyebrow: 'Alternative 01',
            title: 'Operational inbox / task list',
            description: 'Öncelik, meta ve badge kombinasyonlarını aynı liste yüzeyinde toplar.',
            badges: ['task-list', 'selection', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Review queue">
                  <List
                    title="Deployment work queue"
                    description="Security, doctor ve rollout kanıtları tek yüzeyde okunur."
                    items={listItems}
                    selectedKey="doctor"
                    onItemSelect={() => undefined}
                  />
                </PreviewPanel>
                <PreviewPanel title="Why this matters">
                  <Text variant="secondary" className="block leading-7">
                    `List`, hafif ama durum taşıyan görev akışlarında tablo açmadan seçim, badge ve meta bilgisini birlikte taşır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'list-priority-review',
            eyebrow: 'Alternative 02',
            title: 'Priority / review state matrix',
            description: 'Compact density, blocked item ve tone farklarını görünür kılar.',
            badges: ['compact', 'priority', 'tone'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact list">
                  <List
                    density="compact"
                    items={listItems}
                    selectedKey="triage"
                    onItemSelect={() => undefined}
                  />
                </PreviewPanel>
                <PreviewPanel title="Loading and empty">
                  <div className="space-y-4">
                    <List title="Loading queue" loading items={[]} />
                    <List title="Empty queue" items={[]} emptyStateLabel="Gösterilecek görev yok." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'JsonViewer':
        return [
          {
            id: 'json-viewer-release-payload',
            eyebrow: 'Alternative 01',
            title: 'Release evidence payload',
            description: 'Wave gate ve doctor özetini okunabilir katmanlı JSON ağacı olarak sunar.',
            badges: ['payload', 'audit', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Primary payload">
                  <JsonViewer
                    title="Wave summary"
                    description="Gate ve doctor kanıtı aynı payload altında izlenir."
                    value={jsonViewerValue}
                    rootLabel="wave"
                    defaultExpandedDepth={2}
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    `JsonViewer`, debug paneli gibi görünmeden kontrat, config ve kanıt payload’larını son kullanıcıya okunur hale getirir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'json-viewer-policy-config',
            eyebrow: 'Alternative 02',
            title: 'Policy / config snapshot',
            description: 'Daha dar, readonly yapılandırma snapshot’ları için kompakt gösterim.',
            badges: ['policy', 'config', 'readonly'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Policy snapshot">
                  <JsonViewer
                    title="Policy"
                    value={jsonViewerValue.policy}
                    rootLabel="policy"
                    defaultExpandedDepth={1}
                    maxHeight={320}
                  />
                </PreviewPanel>
                <PreviewPanel title="Empty / undefined">
                  <div className="space-y-4">
                    <JsonViewer title="Undefined payload" value={undefined} emptyStateLabel="Payload gelmedi." />
                    <JsonViewer title="Primitive payload" value={{ releaseWindow: 'saturday-22', rollbackReady: true }} rootLabel="config" />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'Tree':
        return [
          {
            id: 'tree-release-governance',
            eyebrow: 'Alternative 01',
            title: 'Release governance hierarchy',
            description: 'Doctor, security ve policy akislarini tek bir hiyerarsik agacta izler.',
            badges: ['tree', 'hierarchy', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Hierarchy">
                  <Tree
                    title="Release hierarchy"
                    nodes={treeNodes}
                    defaultExpandedKeys={['release', 'doctor']}
                    selectedKey="doctor-ui-library"
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    `Tree`, onay akisi, rollout ownership ve policy kırılımlarında kullanıcıya derinlik hissini bozmadan
                    hiyerarşi sunar.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tree-readonly-audit',
            eyebrow: 'Alternative 02',
            title: 'Readonly audit tree',
            description: 'Readonly state, compact density ve secili node davranisini birlikte gosterir.',
            badges: ['readonly', 'compact', 'audit'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly tree">
                  <Tree
                    density="compact"
                    nodes={treeNodes}
                    defaultExpandedKeys={['release', 'security']}
                    access="readonly"
                    selectedKey="security-residual"
                  />
                </PreviewPanel>
                <PreviewPanel title="Loading and empty">
                  <div className="space-y-4">
                    <Tree title="Loading tree" loading nodes={[]} />
                    <Tree title="Empty tree" nodes={[]} emptyStateLabel="Hiyerarsi bulunamadi." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'TreeTable':
        return [
          {
            id: 'tree-table-ownership-matrix',
            eyebrow: 'Alternative 01',
            title: 'Ownership matrix',
            description: 'TreeTable, owner / status / scope verisini hiyerarsik satirlarla birlestirir.',
            badges: ['matrix', 'hierarchy', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Ownership matrix">
                  <TreeTable
                    nodes={treeTableNodes}
                    defaultExpandedKeys={['platform-ui']}
                    columns={[
                      { key: 'owner', label: 'Owner', accessor: 'owner', emphasis: true },
                      { key: 'status', label: 'Durum', accessor: 'status', align: 'center' },
                      { key: 'scope', label: 'Scope', accessor: 'scope' },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    `TreeTable`, entity ya da ownership agacinda hiyerarsiyi kaybetmeden kolonlu karsilastirma yapar.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'tree-table-compact-review',
            eyebrow: 'Alternative 02',
            title: 'Compact review matrix',
            description: 'Compact density, selected row ve loading/empty fallback davranisini birlikte gosterir.',
            badges: ['compact', 'selected', 'fallback'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact table">
                  <TreeTable
                    density="compact"
                    nodes={treeTableNodes}
                    defaultExpandedKeys={['platform-ui']}
                    selectedKey="delivery-gates"
                    columns={[
                      { key: 'status', label: 'Durum', accessor: 'status', align: 'center', emphasis: true },
                      { key: 'scope', label: 'Scope', accessor: 'scope' },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Loading and empty">
                  <div className="space-y-4">
                    <TreeTable title="Loading matrix" loading nodes={[]} columns={[]} />
                    <TreeTable title="Empty matrix" nodes={[]} columns={[]} emptyStateLabel="Hiyerarsik tablo kaydi yok." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'AgGridServer':
        return [
          {
            id: 'ag-grid-server-ownership-list',
            eyebrow: 'Alternative 01',
            title: 'Server-backed ownership matrix',
            description: 'AgGridServer, gateway tarafindan beslenen owner/status listelerini server-side datasource kontratiyla gösterir.',
            badges: ['server-side', 'stable', 'performance'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Server ownership list">
                  <div className="h-[360px]">
                    <AgGridServer
                      height={320}
                      columnDefs={[
                        { field: 'id', headerName: 'ID', width: 120 },
                        { field: 'name', headerName: 'Kaynak', flex: 1 },
                        { field: 'owner', headerName: 'Owner', width: 180 },
                      ]}
                      getData={async () => ({ rows: serverGridRows, total: serverGridRows.length })}
                    />
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Performance contract">
                  <div className="grid grid-cols-1 gap-3">
                    <LibraryMetricCard label="Datasource" value="server" note="Grid veriyi getData kontratiyla ceker." />
                    <LibraryMetricCard label="Rows" value={`${serverGridRows.length}`} note="Batch-2 demo snapshot verisi." />
                    <LibraryMetricCard label="Surface" value="stable" note="Substrate component; performance contract zorunlu." />
                  </div>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'ag-grid-server-loading-contract',
            eyebrow: 'Alternative 02',
            title: 'Loading and fallback contract',
            description: 'Datasource, loading ve empty davranisi ayni primitive icinde kalir; ekran seviyesi kopya kod gerekmez.',
            badges: ['loading', 'empty', 'ops'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Operator guidance">
                  <Text variant="secondary" className="block leading-7">
                    `AgGridServer`, server-side pagination ve datasource baglama davranisini tek noktada toplar. Bu sayede
                    ownership listesi, audit query sonucu ve entity registry gibi yuzeyler ayni behavior contract'i kullanir.
                  </Text>
                </PreviewPanel>
                <PreviewPanel title="Evidence focus">
                  <Descriptions
                    title="Regression odagi"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'datasource', label: 'Datasource', value: "setGridOption('serverSideDatasource', datasource)", tone: 'info' },
                      { key: 'loading', label: 'Loading', value: 'Overlay + request pending', tone: 'warning' },
                      { key: 'failure', label: 'Failure', value: 'fail callback', tone: 'danger' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'EntityGridTemplate':
        return [
          {
            id: 'entity-grid-template-client-registry',
            eyebrow: 'Alternative 01',
            title: 'Client-side entity registry',
            description: 'Toolbar, variant ve sayfalama davranisini tek entity template yuzeyinde toplar.',
            badges: ['client', 'stable', 'toolbar'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Entity registry">
                  <div className="h-[420px]">
                    <LibraryQueryProvider>
                      <EntityGridTemplate<Record<string, unknown>>
                        gridId="design-lab-entity-grid-client"
                        gridSchemaVersion={1}
                        dataSourceMode="client"
                        rowData={gridRows}
                        total={gridRows.length}
                        page={1}
                        pageSize={25}
                        columnDefs={[
                          { field: 'name', headerName: 'Isim', flex: 1 },
                          { field: 'status', headerName: 'Durum', width: 140 },
                          { field: 'updatedAt', headerName: 'Guncelleme', width: 140 },
                        ]}
                      />
                    </LibraryQueryProvider>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Template value">
                  <Text variant="secondary" className="block leading-7">
                    `EntityGridTemplate`, toolbar, varyant secimi, pagination ve theme akslarini tek substrate bileşeninde
                    birlestirir. Client-side liste ekranlari icin ayrı shell kodu yazmak zorunda kalmazsin.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'entity-grid-template-server-mode',
            eyebrow: 'Alternative 02',
            title: 'Server-side toolbar and datasource mode',
            description: 'Ayni template, server mode calisirken datasource ve toolbar davranisini korur.',
            badges: ['server', 'variant', 'mode-switch'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Server mode">
                  <div className="h-[420px]">
                    <LibraryQueryProvider>
                      <EntityGridTemplate<Record<string, unknown>>
                        gridId="design-lab-entity-grid-server"
                        gridSchemaVersion={2}
                        dataSourceMode="server"
                        total={serverGridRows.length}
                        page={1}
                        pageSize={25}
                        columnDefs={[
                          { field: 'id', headerName: 'ID', width: 120 },
                          { field: 'name', headerName: 'Kaynak', flex: 1 },
                          { field: 'owner', headerName: 'Owner', width: 180 },
                        ]}
                        createServerSideDatasource={() => ({
                          getRows: async (params: {
                            success: (payload: { rowData: unknown[]; rowCount: number }) => void;
                          }) => {
                            params.success({ rowData: serverGridRows, rowCount: serverGridRows.length });
                          },
                        })}
                      />
                    </LibraryQueryProvider>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Regression contract">
                  <Descriptions
                    title="Template odagi"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'mode', label: 'Mode switch', value: 'client -> server', tone: 'info' },
                      { key: 'toolbar', label: 'Toolbar', value: 'Tema / Filtre / Varyant', tone: 'success' },
                      { key: 'datasource', label: 'Datasource', value: 'createServerSideDatasource', tone: 'warning' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'PageLayout':
        return [
          {
            id: 'page-layout-directory-shell',
            eyebrow: 'Alternative 01',
            title: 'Directory shell',
            description: 'Breadcrumb, page header, filter shell ve detail aside ayni page-level contract icinde toplanir.',
            badges: ['page-shell', 'stable', 'directory'],
            content: (
              <div className="grid grid-cols-1 gap-4">
                <PreviewPanel title="Directory shell">
                  <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                    <PageLayout
                      title="UI governance catalog"
                      description="Page shell, header ve filter davranisi tek layout contract'i ile tekrar kullanilir."
                      breadcrumbItems={[
                        { title: 'Docs', path: '#' },
                        { title: 'UI Library', path: '#' },
                        { title: 'Page Blocks' },
                      ]}
                      headerExtra={<SectionBadge label="stable substrate" />}
                      actions={
                        <>
                          <Button intent="secondary" size="sm">Export</Button>
                          <Button size="sm">Yeni blok</Button>
                        </>
                      }
                      filterBar={(
                        <FilterBar onReset={() => setSearchInputValue('')} onSaveView={() => setDropdownAction('Saved page-block view')}>
                          <TextInput
                            label="Ara"
                            value={searchInputValue}
                            onValueChange={setSearchInputValue}
                            size="sm"
                            leadingVisual={<span aria-hidden="true">⌕</span>}
                          />
                          <Select
                            label="Durum"
                            value={selectValue}
                            onValueChange={(value) => setSelectValue(String(value))}
                            size="sm"
                            options={[
                              { label: 'Comfortable', value: 'comfortable' },
                              { label: 'Compact', value: 'compact' },
                              { label: 'Readonly', value: 'readonly' },
                            ]}
                          />
                        </FilterBar>
                      )}
                      detail={(
                        <div className="space-y-3 rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
                          <Text as="div" className="font-semibold">Detail aside</Text>
                          <Text variant="secondary">Layout, detail rail ve body arasındaki oran aynı shell içinde kalır.</Text>
                          <LibraryMetricCard label="Selection" value={dropdownAction} note="Action rail state" />
                        </div>
                      )}
                    >
                      <div className="space-y-4">
                        <SummaryStrip title="Release summary" description="Page shell ile birlikte öne çıkan metrikler." items={summaryStripItems} columns={4} />
                        <Descriptions
                          title="Shell contract"
                          description="Aynı layout drawer ve detay sayfasında yeniden kullanılabilir."
                          items={rolloutDescriptionItems}
                          columns={2}
                        />
                      </div>
                    </PageLayout>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Contract note">
                  <Text variant="secondary" className="block leading-7">
                    `PageLayout`, route seviyesinde breadcrumb, action rail, filter shell ve detail aside kombinasyonunu
                    birleştirir; ekran bazlı kopya shell kodunu azaltır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'page-layout-detail-shell',
            eyebrow: 'Alternative 02',
            title: 'Detail review shell',
            description: 'Detail odaklı sayfalarda aynı layout daha yoğun aside ve footer ile kullanılabilir.',
            badges: ['detail', 'aside', 'review'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact detail">
                  <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                    <PageLayout
                      title="Change review"
                      description="Readonly review ve approve/reject aksiyonları aynı page shell içinde."
                      breadcrumbItems={[
                        { title: 'Releases', path: '#' },
                        { title: 'Wave 7', path: '#' },
                        { title: 'Review' },
                      ]}
                      actions={<Button size="sm">Approve</Button>}
                      detail={(
                        <Descriptions
                          title="Decision"
                          items={[
                            { key: 'risk', label: 'Risk', value: 'Low', tone: 'success' },
                            { key: 'owner', label: 'Owner', value: 'Platform UI', tone: 'info' },
                          ]}
                          columns={1}
                          density="compact"
                        />
                      )}
                      footer={<Text variant="secondary">Footer rail aynı shell kontratında kalır.</Text>}
                    >
                      <EntitySummaryBlock
                        title="Wave 7 page blocks"
                        subtitle="Page-level reusable shell rollout özeti."
                        badge={<Badge tone="success">Ready</Badge>}
                        items={entitySummaryItems}
                      />
                    </PageLayout>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <Text variant="secondary" className="block leading-7">
                    Aynı layout hem directory hem detail/review ekranlarında çalışır; değişen yalnız içerik ve callback'tir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'PageHeader':
        return [
          {
            id: 'page-header-release-surface',
            eyebrow: 'Alternative 01',
            title: 'Release and docs header',
            description: 'Eyebrow, title, status, meta ve quick action bloklarını tek üst yüzeyde toplar.',
            badges: ['header', 'beta', 'hero'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <PreviewPanel title="Primary header">
                  <PageHeader
                    eyebrow="UI Library"
                    title="Page block rollout"
                    description="Yeni page-level block ailesinin release ve docs yüzeyi aynı header primitive ile kurgulanır."
                    meta={pageHeaderMeta}
                    status={<Badge tone="success">Ready</Badge>}
                    actions={(
                      <>
                        <Button intent="secondary" size="sm">Share</Button>
                        <Button size="sm">Promote</Button>
                      </>
                    )}
                    aside={<LibraryMetricCard label="Doctor" value="PASS" note="ui-library preset" />}
                  />
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    `PageHeader`, route-level hero alanını tek primitive'de toplar. Meta chip, status badge ve aside
                    metrikleri için sayfa bazlı yeni header kurmaya gerek bırakmaz.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'page-header-compact-detail',
            eyebrow: 'Alternative 02',
            title: 'Compact detail header',
            description: 'Daha yoğun detail sayfalarında kompakt header kullanımı.',
            badges: ['compact', 'detail', 'meta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Compact mode">
                  <PageHeader
                    eyebrow="DETAIL"
                    title="EntitySummaryBlock"
                    description="Component detail için daha kısa header yüzeyi."
                    compact
                    meta={[
                      <SectionBadge key="family" label="page_blocks" />,
                      <SectionBadge key="wave" label="wave_7" />,
                    ]}
                    status={<Badge tone="info">Beta</Badge>}
                  />
                </PreviewPanel>
                <PreviewPanel title="Contract note">
                  <Descriptions
                    title="Header contract"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'eyebrow', label: 'Eyebrow', value: 'optional', tone: 'info' },
                      { key: 'meta', label: 'Meta', value: 'chips / tags', tone: 'success' },
                      { key: 'aside', label: 'Aside', value: 'metric or helper', tone: 'warning' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'FilterBar':
        return [
          {
            id: 'filter-bar-toolbar-shell',
            eyebrow: 'Alternative 01',
            title: 'Toolbar shell',
            description: 'Arama, filtre ve save-view aksiyonlarını ortak toolbar yüzeyinde toplar.',
            badges: ['filters', 'stable', 'toolbar'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Controlled toolbar">
                  <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
                    <FilterBar
                      onReset={() => {
                        setSearchInputValue('');
                        setCheckboxValue(false);
                      }}
                      onSaveView={() => setDropdownAction('Saved toolbar view')}
                      extra={<SectionBadge label="shared-toolbar" />}
                    >
                      <TextInput label="Arama" value={searchInputValue} onValueChange={setSearchInputValue} size="sm" />
                      <Select
                        label="Yoğunluk"
                        size="sm"
                        value={selectValue}
                        onValueChange={(value) => setSelectValue(String(value))}
                        options={[
                          { label: 'Comfortable', value: 'comfortable' },
                          { label: 'Compact', value: 'compact' },
                        ]}
                      />
                      <Checkbox label="Sadece aktifler" checked={checkboxValue} onCheckedChange={setCheckboxValue} />
                    </FilterBar>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Shared state">
                  <LibraryMetricCard label="Toolbar state" value={dropdownAction} note="Reset/save-view aksiyonları aynı shell üzerinden yönetiliyor." />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'filter-bar-readonly-shell',
            eyebrow: 'Alternative 02',
            title: 'Readonly and policy states',
            description: 'Readonly veya policy-locked toolbar durumları aynı bileşende korunur.',
            badges: ['readonly', 'policy', 'state'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly toolbar">
                  <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
                    <FilterBar access="readonly" onReset={() => undefined} onSaveView={() => undefined}>
                      <TextInput label="Readonly arama" value="ui-kit" size="sm" access="readonly" />
                      <Select
                        label="Scope"
                        size="sm"
                        value="shared"
                        options={[{ label: 'Shared', value: 'shared' }]}
                        access="readonly"
                      />
                    </FilterBar>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Filter shell, sayfa bazlı toolbar kopyalamaz; sadece alanlar ve callback'ler beslenir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'ReportFilterPanel':
        return [
          {
            id: 'report-filter-panel-submit-flow',
            eyebrow: 'Alternative 01',
            title: 'Submit flow panel',
            description: 'Rapor sayfaları için çok alanlı filtre ve aksiyon yüzeyini tek panel kontratında toplar.',
            badges: ['panel', 'submit', 'stable'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Interactive panel">
                  <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
                    <ReportFilterPanel onSubmit={() => setReportStatus('Filtre uygulandı')} onReset={() => setReportStatus('Filtre sıfırlandı')}>
                      <TextInput label="Arama" value={searchInputValue} onValueChange={setSearchInputValue} size="sm" />
                      <Select
                        label="Durum"
                        size="sm"
                        value={selectValue}
                        onValueChange={(value) => setSelectValue(String(value))}
                        options={[
                          { label: 'Comfortable', value: 'comfortable' },
                          { label: 'Compact', value: 'compact' },
                        ]}
                      />
                      <DatePicker label="Başlangıç" value={dateValue} onValueChange={setDateValue} />
                    </ReportFilterPanel>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Panel state">
                  <LibraryMetricCard label="Status" value={reportStatus} note="Submit ve reset davranışı panel üzerinden besleniyor." />
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'report-filter-panel-readonly',
            eyebrow: 'Alternative 02',
            title: 'Readonly policy panel',
            description: 'Readonly ve policy-locked senaryolarında submit aksiyonu kilitlenirken bilgi korunur.',
            badges: ['readonly', 'policy', 'governed'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Readonly panel">
                  <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
                    <ReportFilterPanel access="readonly" onSubmit={() => undefined} onReset={() => undefined}>
                      <TextInput label="Readonly arama" value="weekly review" access="readonly" />
                      <DatePicker label="Tarih" value="2026-03-07" access="readonly" />
                    </ReportFilterPanel>
                  </div>
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Descriptions
                    title="Panel rule"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'submit', label: 'Submit', value: 'full access only', tone: 'warning' },
                      { key: 'reset', label: 'Reset', value: 'readonly aware', tone: 'info' },
                      { key: 'scope', label: 'Use case', value: 'report pages', tone: 'success' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'SummaryStrip':
        return [
          {
            id: 'summary-strip-release-metrics',
            eyebrow: 'Alternative 01',
            title: 'Release metrics strip',
            description: 'Üst metrik yüzeyini kartlı ama ortak bir summary strip kontratıyla sunar.',
            badges: ['metrics', 'beta', 'summary'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Primary strip">
                  <SummaryStrip
                    title="UI Library overview"
                    description="Export, doctor ve wave gate snapshot tek strip içinde."
                    items={summaryStripItems}
                    columns={4}
                  />
                </PreviewPanel>
                <PreviewPanel title="Guideline">
                  <Text variant="secondary" className="block leading-7">
                    Summary strip, dashboard KPI bandı gibi davranmaz; sayfa header altında karar destekleyen kısa metrikleri taşır.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'summary-strip-compact-ownership',
            eyebrow: 'Alternative 02',
            title: 'Compact ownership summary',
            description: 'Daha dar sayfalarda 2 kolonlu veya 3 kolonlu özet kullanımı.',
            badges: ['compact', 'ownership', 'responsive'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Three-column strip">
                  <SummaryStrip
                    title="Delivery ownership"
                    items={[
                      { key: 'owner', label: 'Owner', value: 'Platform UI', tone: 'info', note: 'Primary maintainer' },
                      { key: 'review', label: 'Review', value: '2/3', tone: 'warning', note: 'Security sign-off bekliyor' },
                      { key: 'release', label: 'Release', value: 'Ready', tone: 'success', note: 'Doctor PASS' },
                    ]}
                    columns={3}
                  />
                </PreviewPanel>
                <PreviewPanel title="Usage note">
                  <LibraryMetricCard label="Responsive mode" value="3 columns" note="Dar yüzeyde otomatik kırılır." />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'EntitySummaryBlock':
        return [
          {
            id: 'entity-summary-block-primary',
            eyebrow: 'Alternative 01',
            title: 'Entity ownership summary',
            description: 'Entity-level özet, badge, avatar ve detail descriptions aynı blokta toplanır.',
            badges: ['entity', 'summary', 'beta'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <PreviewPanel title="Primary summary block">
                  <EntitySummaryBlock
                    title="Platform UI"
                    subtitle="Page block family owner ve release summary"
                    badge={<Badge tone="success">Active</Badge>}
                    avatar={{ name: 'Platform UI' }}
                    actions={<Button size="sm">Open details</Button>}
                    items={entitySummaryItems}
                  />
                </PreviewPanel>
                <PreviewPanel title="Why use it">
                  <Text variant="secondary" className="block leading-7">
                    `EntitySummaryBlock`, detail drawer ya da entity header yerine doğrudan okunabilir bir summary yüzeyi verir.
                  </Text>
                </PreviewPanel>
              </div>
            ),
          },
          {
            id: 'entity-summary-block-with-avatar',
            eyebrow: 'Alternative 02',
            title: 'Avatar and governance metadata',
            description: 'Avatar, badge ve descriptions kombinasyonunu daha yönetim odaklı gösterimle taşır.',
            badges: ['avatar', 'governance', 'details'],
            content: (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <PreviewPanel title="Governance summary">
                  <EntitySummaryBlock
                    title="Wave 7 rollout"
                    subtitle="Reusable page shell adoption"
                    badge={<Badge tone="warning">Beta</Badge>}
                    avatar={{ src: avatarPreviewImageSrc, alt: 'Wave 7 preview', name: 'Wave 7' }}
                    items={[
                      { key: 'wave', label: 'Wave', value: 'wave_7_page_blocks', tone: 'info' },
                      { key: 'status', label: 'Status', value: 'Completed', tone: 'success' },
                      { key: 'next', label: 'Next', value: 'SectionShell backlog', tone: 'warning' },
                      { key: 'owner', label: 'Owner', value: 'Platform Team', tone: 'info' },
                    ]}
                  />
                </PreviewPanel>
                <PreviewPanel title="Contract note">
                  <Descriptions
                    title="Summary contract"
                    density="compact"
                    columns={1}
                    items={[
                      { key: 'header', label: 'Header', value: 'title + badge + subtitle', tone: 'info' },
                      { key: 'avatar', label: 'Avatar', value: 'optional', tone: 'success' },
                      { key: 'details', label: 'Details', value: 'Descriptions grid', tone: 'warning' },
                    ]}
                  />
                </PreviewPanel>
              </div>
            ),
          },
        ];
      case 'ThemePresetGallery':
        return [
          {
            id: 'theme-preset-gallery-catalog',
            eyebrow: 'Recipe 01',
            title: 'Theme preset gallery',
            description: 'Resmi preset ailesi docs ve runtime ile ayni semantic kimliklerle ayni galeriden okunur.',
            badges: ['wave-10', 'theme-presets', 'gallery'],
            content: (
              <ThemePresetGallery
                presets={themePresetGalleryItems}
                compareAxes={themePresetSummary?.compareAxes ?? []}
              />
            ),
          },
          {
            id: 'theme-preset-gallery-compare',
            eyebrow: 'Recipe 02',
            title: 'Preset compare handoff',
            description: 'Gallery secimi ile compare matrisi ayni preset dili uzerinden okunur.',
            badges: ['compare', 'contrast', 'density'],
            content: (
              <ThemePresetCompare
                leftPreset={defaultThemePreset}
                rightPreset={contrastThemePreset ?? compactThemePreset}
              />
            ),
          },
        ];
      case 'ThemePresetCompare':
        return [
          {
            id: 'theme-preset-compare-default',
            eyebrow: 'Recipe 01',
            title: 'Theme preset compare',
            description: 'Appearance, density, contrast ve intent farklari ayni compare matrisiyle okunur.',
            badges: ['wave-10', 'theme-presets', 'compare'],
            content: (
              <ThemePresetCompare
                leftPreset={defaultThemePreset}
                rightPreset={contrastThemePreset ?? compactThemePreset}
              />
            ),
          },
        ];
      case 'SearchFilterListing':
        return [
          {
            id: 'search-filter-listing-default',
            eyebrow: 'Recipe 01',
            title: 'Search + filter listing',
            description: 'PageHeader, FilterBar, SummaryStrip ve listing shell ayni recipe ile tekrar kullanilir.',
            badges: ['wave-11', 'recipes', 'listing'],
            content: renderRecipeComponentPreview('search_filter_listing'),
          },
        ];
      case 'DetailSummary':
        return [
          {
            id: 'detail-summary-default',
            eyebrow: 'Recipe 01',
            title: 'Detail summary inspector',
            description: 'Entity detail, KPI strip ve JSON payload tek inspector recipe altinda toplanir.',
            badges: ['wave-11', 'recipes', 'detail'],
            content: renderRecipeComponentPreview('detail_summary'),
          },
        ];
      case 'ApprovalReview':
        return [
          {
            id: 'approval-review-default',
            eyebrow: 'Recipe 01',
            title: 'Approval review workflow',
            description: 'Checkpoint, evidence ve audit akisi ayni review recipe ile okunur.',
            badges: ['wave-11', 'recipes', 'approval'],
            content: renderRecipeComponentPreview('approval_review'),
          },
        ];
      case 'EmptyErrorLoading':
        return [
          {
            id: 'empty-error-loading-default',
            eyebrow: 'Recipe 01',
            title: 'State feedback recipe',
            description: 'Loading, error ve empty durumlari ayni feedback diliyle tekrar kullanilir.',
            badges: ['wave-11', 'recipes', 'feedback'],
            content: renderRecipeComponentPreview('empty_error_loading'),
          },
        ];
      case 'AIGuidedAuthoring':
        return [
          {
            id: 'ai-guided-authoring-default',
            eyebrow: 'Recipe 01',
            title: 'AI guided authoring',
            description: 'Prompt yazimi, recommendation ve command palette ayni authoring shell altinda toplanir.',
            badges: ['wave-11', 'recipes', 'ai-authoring'],
            content: renderRecipeComponentPreview('ai_guided_authoring'),
          },
        ];
      default:
        return [
          {
            id: `${toTestIdSuffix(item.name)}-default-preview`,
            eyebrow: 'Preview',
            title: `${item.name} live preview`,
            description: item.description,
            badges: [statusLabel[item.lifecycle], demoModeLabel[item.demoMode]],
            content: renderLivePreview(item),
          },
        ];
    }
  };

  const buildRecipeLensSection = (item: DesignLabIndexItem): ComponentShowcaseSection | null => {
    if (!recipeSummary) return null;

    const directRecipes = relatedRecipes.length
      ? relatedRecipes
      : recipeSummary.currentFamilies.filter((recipe) => recipe.ownerBlocks.includes(item.name));

    const recipeCandidates = directRecipes.length ? directRecipes : recipeSummary.currentFamilies.slice(0, 3);

    return {
      id: `${toTestIdSuffix(item.name)}-recipe-lens`,
      kind: 'recipe',
      eyebrow: 'Recipe Lens',
      title: 'Recipe composition lens',
      description: 'Bu component hangi ekran reçetelerinde kullanılır ve tüketici ekip nerede hazır kompozisyon almalıdır.',
      badges: ['recipe-first', 'consumer-handoff', `${recipeCandidates.length} recipe`],
      content: (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <PreviewPanel title="Direct recipes" kind="recipe">
            <div className="grid grid-cols-1 gap-3">
              {recipeCandidates.map((recipe) => (
                <div key={recipe.recipeId} className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Text as="div" className="font-semibold text-text-primary">
                        {recipe.recipeId}
                      </Text>
                      <Text variant="secondary" className="mt-1 block text-sm leading-6">
                        {recipe.intent}
                      </Text>
                    </div>
                    <Badge tone={recipe.ownerBlocks.includes(item.name) ? 'success' : 'muted'}>
                      {recipe.ownerBlocks.includes(item.name) ? 'Direct owner' : 'Related'}
                    </Badge>
                  </div>
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
              ))}
            </div>
          </PreviewPanel>
          <PreviewPanel title="Consumer handoff" kind="recipe">
            <div className="grid grid-cols-1 gap-3">
              <LibraryMetricCard
                label="Preferred source"
                value={directRecipes.length ? 'Recipe composition' : 'Primitive composition'}
                note={directRecipes.length ? 'Bu component için önce hazır recipe ailesi tüketilmeli.' : 'Hazır recipe yok; primitive doğrudan compose edilecek.'}
              />
              <LibraryMetricCard
                label="Primary track"
                value={trackMeta[resolveItemTrack(item)].label}
                note="Tüketici ekip aynı track içindeki canonical recipe ve theme presetlerini referans almalı."
              />
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Consumer rule</DetailLabel>
                <Text variant="secondary" className="mt-2 block text-sm leading-7">
                  Uygulama ekipleri yeni ekran tasarımını sayfa içinde yeniden icat etmemeli. Önce bu lens içindeki recipe aileleri
                  kontrol edilmeli; yalnız eksikse primitive seviyesinde yeni kompozisyon tasarlanmalı.
                </Text>
              </div>
            </div>
          </PreviewPanel>
        </div>
      ),
    };
  };

  const buildRecipeWorkspaceShowcaseSections = (recipe: DesignLabRecipeFamily): ComponentShowcaseSection[] => {
    const recipeItems = recipe.ownerBlocks
      .map((owner) => designLabIndex.items.find((item) => item.name === owner) ?? null)
      .filter((item): item is DesignLabIndexItem => Boolean(item));
    const missingOwners = recipe.ownerBlocks.filter((owner) => !recipeItems.some((item) => item.name === owner));
    const recipeTracks = Array.from(new Set(recipeItems.map((item) => trackMeta[resolveItemTrack(item)].label)));
    const recipeSections = Array.from(new Set(recipeItems.flatMap((item) => item.sectionIds ?? [])));
    const recipeThemes = Array.from(
      new Set(
        recipeItems.flatMap((item) => [item.uxPrimaryThemeId, item.uxPrimarySubthemeId].filter(Boolean) as string[]),
      ),
    );
    const recipeQuality = Array.from(new Set(recipeItems.flatMap((item) => item.qualityGates ?? [])));

    return [
      {
        id: `${toTestIdSuffix(recipe.recipeId)}-assembly-map`,
        kind: 'recipe',
        eyebrow: 'Recipe 01',
        title: 'Recipe surface',
        description: 'Recipe’in canlı kompozisyonu, contract bağlamı ve consumer handoff aynı kartta okunur.',
        badges: ['recipe', 'assembly', `${recipe.ownerBlocks.length} blocks`],
        content: (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <PreviewPanel title="Recipe surface" kind="recipe">
              {renderRecipeComponentPreview(recipe.recipeId)}
            </PreviewPanel>
            <PreviewPanel title="Consumer handoff" kind="recipe">
              <div className="grid grid-cols-1 gap-3">
                <LibraryMetricCard
                  label="Preferred path"
                  value="Recipe -> Screen"
                  note="Ürün ekipleri bu recipe ailelerinden başlayıp yalnız veri ve iş kuralı bağlamalı."
                />
                <LibraryMetricCard
                  label="Track spread"
                  value={recipeTracks.length ? recipeTracks.join(' / ') : '—'}
                  note="Recipe bileşenleri birden fazla track kapsıyorsa tasarım kararları bu yüzeyde kilitlenmeli."
                />
                {missingOwners.length ? (
                  <div className="rounded-2xl border border-state-warning-border bg-state-warning-bg p-4">
                    <DetailLabel>Missing owners</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {missingOwners.map((owner) => (
                        <SectionBadge key={owner} label={owner} className="border-state-warning-border bg-state-warning-bg text-state-warning-text" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                    <DetailLabel>Contract health</DetailLabel>
                    <Text variant="secondary" className="mt-2 block text-sm leading-7">
                      Tüm owner block’lar registry ile eşleşiyor. Bu recipe artık tüketici ekranları için güvenli başlangıç noktası olarak kullanılabilir.
                    </Text>
                  </div>
                )}
              </div>
            </PreviewPanel>
          </div>
        ),
      },
      {
        id: `${toTestIdSuffix(recipe.recipeId)}-building-blocks`,
        kind: 'live',
        eyebrow: 'Recipe 02',
        title: 'Primary building blocks',
        description: 'Recipe içindeki bloklardan herhangi birine geçip component seviyesinde incelemeye devam et.',
        badges: ['live', 'component-bridge', 'handoff'],
        content: (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {recipeItems.map((item) => (
              <div key={item.name} className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="div" className="font-semibold text-text-primary">
                      {item.name}
                    </Text>
                    <Text variant="secondary" className="mt-1 block text-sm leading-6">
                      {item.description}
                    </Text>
                  </div>
                  <Badge tone={item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info'}>
                    {statusLabel[item.lifecycle]}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SectionBadge label={trackMeta[resolveItemTrack(item)].label} />
                  {item.uxPrimaryThemeId ? <SectionBadge label={item.uxPrimaryThemeId} /> : null}
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => focusComponentFromRecipe(item)}
                    data-testid={`design-lab-recipe-owner-${toTestIdSuffix(recipe.recipeId)}-${toTestIdSuffix(item.name)}`}
                  >
                    Component detayına git
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: `${toTestIdSuffix(recipe.recipeId)}-quality-reference`,
        kind: 'reference',
        eyebrow: 'Recipe 03',
        title: 'Governance and quality contract',
        description: 'Recipe düzeyinde ortak quality gate, UX tema ve north-star section kapsaması.',
        badges: ['reference', 'quality', 'ux'],
        content: (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
            <PreviewPanel title="Quality gates" kind="reference">
              <div className="flex flex-wrap gap-2">
                {recipeQuality.length ? recipeQuality.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">Gate yok</Text>}
              </div>
            </PreviewPanel>
            <PreviewPanel title="UX and sections" kind="reference">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {recipeThemes.length ? recipeThemes.map((theme) => <SectionBadge key={theme} label={theme} />) : <Text variant="secondary">UX theme yok</Text>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipeSections.length ? recipeSections.map((section) => <SectionBadge key={section} label={section} />) : <Text variant="secondary">North-star section yok</Text>}
                </div>
              </div>
            </PreviewPanel>
          </div>
        ),
      },
    ];
  };

  const renderDemoSection = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">Canlı showcase için component seç.</Text>;
    }

    if (item.availability === 'planned' || item.demoMode === 'planned') {
      return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <LibraryShowcaseCard
            eyebrow="Roadmap"
            title={`${item.name} henüz release edilmedi`}
            description="Bu item planlı backlog seviyesinde. Export, live demo ve regression kanıtı tamamlanmadan canlı showcase açılmaz."
            badges={<Tag tone="info">Planned item</Tag>}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <LibraryMetricCard label="Release gate" value="blocked" note="Implementation + registry sync + preview gerektirir." />
              <LibraryMetricCard label="Wave" value={item.roadmapWaveId ?? '—'} note="Roadmap wave hizası." />
            </div>
          </LibraryShowcaseCard>
          <LibraryShowcaseCard
            eyebrow="North Star"
            title="Bu bileşen nerede kullanılacak?"
            description="Roadmap item olduğu için önce UX ve quality kontratı netleşir, sonra export edilir."
          >
            <div className="flex flex-wrap gap-2">
              {item.sectionIds.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />)}
            </div>
          </LibraryShowcaseCard>
        </div>
      );
    }

    const baseShowcaseSections = buildDemoShowcaseSections(item).map((section) => ({
      ...section,
      kind: resolveShowcaseSectionKind(section),
    }));
    const recipeLensSection = buildRecipeLensSection(item);
    const orderedShowcaseSections = demoGalleryMode === 'recipes_first'
      ? [
          ...(recipeLensSection ? [recipeLensSection] : []),
          ...baseShowcaseSections.sort((left, right) => {
            const order: Record<DemoSurfaceKind, number> = { recipe: 0, live: 1, reference: 2 };
            return order[left.kind ?? 'live'] - order[right.kind ?? 'live'];
          }),
        ]
      : baseShowcaseSections.filter((section) => demoGalleryMode !== 'live_only' || section.kind === 'live');

    return (
      <DemoGalleryModeContext.Provider value={demoGalleryMode}>
        <div className="space-y-5">
          <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {orderedShowcaseSections.map((section, index) => (
                  <SectionBadge key={section.id} label={`${String(index + 1).padStart(2, '0')} · ${section.title}`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <SectionBadge label={`Mod · ${demoGalleryModeOptions.find((entry) => entry.id === demoGalleryMode)?.label ?? 'Tüm yüzeyler'}`} />
                <SectionBadge label={sectionLockEnabled ? 'Section lock · Açık' : 'Section lock · Kapalı'} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['live', 'reference', 'recipe'] as DemoSurfaceKind[]).map((kind) => (
                <SectionBadge
                  key={kind}
                  label={demoSurfaceMeta[kind].label}
                  className={demoSurfaceMeta[kind].badgeClassName}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {orderedShowcaseSections.length ? (
              orderedShowcaseSections.map((section) => (
                <div key={section.id} data-testid={`design-lab-demo-card-${section.id}`} data-demo-section-kind={section.kind}>
                  <LibraryShowcaseCard
                    eyebrow={section.eyebrow}
                    title={section.title}
                    description={section.description}
                    badges={[
                      <SectionBadge
                        key={`${section.id}-kind`}
                        label={demoSurfaceMeta[section.kind ?? 'live'].label}
                        className={demoSurfaceMeta[section.kind ?? 'live'].badgeClassName}
                      />,
                      ...((section.badges ?? []).map((badge) => <SectionBadge key={`${section.id}-${badge}`} label={badge} />)),
                    ]}
                  >
                    {section.content}
                  </LibraryShowcaseCard>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-5 shadow-sm">
                <Text variant="secondary" className="block leading-7">
                  Seçili mod için görünür demo kalmadı. `Tüm yüzeyler` veya `Recipes first` moduna dönerek referans ve tarif bloklarını tekrar açabilirsin.
                </Text>
              </div>
            )}
          </div>
        </div>
      </DemoGalleryModeContext.Provider>
    );
  };

  const renderOverviewTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text variant="secondary">Soldan bir component seç.</Text>
        </div>
      );
    }
    const releaseFamilyContext = buildReleaseFamilyContext(item, selectedGroup?.title ?? null, releaseSummary ?? null);

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Kısa Özet</DetailLabel>
            <Text as="div" className="mt-3 text-lg font-semibold text-text-primary">
              {item.name}
            </Text>
            <Text variant="secondary" className="mt-2 block leading-7">
              {item.description}
            </Text>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>{stat.label}</DetailLabel>
                  <Text as="div" className="mt-2 text-lg font-semibold text-text-primary">
                    {stat.value}
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-xs">
                    {stat.note}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Hızlı Durum</DetailLabel>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Yayın Durumu
                </Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone={item.availability === 'exported' ? 'success' : 'info'}>{availabilityLabel[item.availability]}</Badge>
                  <Badge tone={item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info'}>
                    {statusLabel[item.lifecycle]}
                  </Badge>
                  <Badge tone={item.demoMode === 'live' ? 'success' : item.demoMode === 'planned' ? 'warning' : 'muted'}>
                    {demoModeLabel[item.demoMode]}
                  </Badge>
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Wave / Contract
                </Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.roadmapWaveId ? <SectionBadge label={item.roadmapWaveId} /> : <Text variant="secondary">Wave yok</Text>}
                  {item.acceptanceContractId ? <SectionBadge label={item.acceptanceContractId} /> : null}
                </div>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Etiketler
                </Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags?.length ? item.tags.map((tag) => <SectionBadge key={tag} label={tag} />) : <Text variant="secondary">Etiket yok</Text>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {releaseSummary ? (
          <LibraryShowcaseCard
            eyebrow="Release"
            title={`${releaseSummary.packageName}@${releaseSummary.packageVersion}`}
            description="Kütüphanenin sürüm, changelog ve dağıtım kanıtı aynı docs sayfasından görünür. Bu blok yayın mantığını component detayıyla aynı bağlamda tutar."
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
                    {releaseSummary.latestRelease.lifecycleChanges || 'Henüz lifecycle notu yok.'}
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
                      releaseSummary.latestRelease.changedComponents.map((component) => (
                        <SectionBadge key={component} label={component} />
                      ))
                    ) : (
                      <Text variant="secondary">Bileşen kaydı yok</Text>
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
                  <div className="mt-3 space-y-3">
                    {releaseSummary.distributionTargets.map((target) => {
                      const fullyReady = target.artifactCount === 0 || target.artifactPresentCount === target.artifactCount;
                      return (
                        <div key={target.targetId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Text as="div" className="font-semibold text-text-primary">
                              {target.targetId}
                            </Text>
                            <Badge tone={fullyReady ? 'success' : 'warning'}>
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
                    {releaseSummary.stableReleaseRequires.map((entry) => (
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
                      <Badge tone={releaseFamilyContext.familyTouched ? 'success' : 'info'}>
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

        {adoptionSummary ? (
          <LibraryShowcaseCard
            eyebrow="Adoption Cockpit"
            title="Consumer-ready surface"
            description="Public export yüzeyi, API coverage ve yaygın tüketim readiness aynı blokta görünür. Hedef, kütüphaneyi yeni ekranların varsayılan tüketim katmanı haline getirmek."
            badges={[
              <SectionBadge key="adoption-contract" label={adoptionSummary.contractId} />,
              <SectionBadge key="api-coverage" label={`API ${adoptionSummary.apiCoverage.coveragePercent}%`} />,
              <SectionBadge key="ready-surface" label={`${adoptionSummary.releaseReadiness.wideAdoptionReady} ready`} />,
            ]}
          >
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
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
                    note="Stable + API docs birlikte hazır olan surface"
                  />
                  <LibraryMetricCard
                    label="Used by apps"
                    value={adoptionSummary.surfaceSummary.consumedByAppsExports}
                    note={`${adoptionSummary.surfaceSummary.liveDemoExports} export canlı demo ile gösteriliyor`}
                  />
                </div>

                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Consumer rules</DetailLabel>
                  <div className="mt-3 space-y-2">
                    {adoptionSummary.consumerRules.map((rule) => (
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
                        adoptionSummary.priorityBacklog.usedUndocumented.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Backlog temiz</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Stable but undocumented</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {adoptionSummary.priorityBacklog.stableUndocumented.length ? (
                        adoptionSummary.priorityBacklog.stableUndocumented.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Stable surface temiz</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Private surface guard</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone={adoptionSummary.internalSurfaceProtection.status === 'protected' ? 'success' : 'warning'}>
                        {adoptionSummary.internalSurfaceProtection.status === 'protected' ? 'Protected' : 'Drifted'}
                      </Badge>
                      <SectionBadge label={`${adoptionSummary.internalSurfaceProtection.allowedConsumers.length} consumer`} />
                      <SectionBadge label={`${adoptionSummary.internalSurfaceProtection.runtimeExportsWithoutRegistry} drift`} />
                    </div>
                    <Text variant="secondary" className="mt-3 block text-sm leading-6">
                      Internal barrel yalnız docs/admin yüzeyi için tutulur; public package export zincirine geri sızması gate ile engellenir.
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                    {adoptionSummary.evidenceRefs.map((entry) => (
                      <SectionBadge key={entry} label={entry} />
                    ))}
                  </div>
                  <Text variant="secondary" className="mt-3 block text-sm leading-6">
                    Bu cockpit, manifest, public surface ve adoption enforcement kontratını aynı bağlamda tutar.
                  </Text>
                </div>
              </div>
            </div>
          </LibraryShowcaseCard>
        ) : null}

        {migrationSummary ? (
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
              <div className="space-y-4">
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
                        migrationSummary.priorityBacklog.betaUsedOutsideLab.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Backlog temiz</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Adopted without story</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {migrationSummary.priorityBacklog.adoptedWithoutStory.length ? (
                        migrationSummary.priorityBacklog.adoptedWithoutStory.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Story coverage hizali</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Stable only in lab</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {migrationSummary.priorityBacklog.stableOnlyInDesignLab.length ? (
                        migrationSummary.priorityBacklog.stableOnlyInDesignLab.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Adoption dengeli</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Single-app blast radius</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {migrationSummary.priorityBacklog.singleAppBlastRadius.length ? (
                        migrationSummary.priorityBacklog.singleAppBlastRadius.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="info">Yogun tekil risk yok</Badge>
                      )}
                    </div>
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
                    <div className="mt-4 space-y-2">
                      {migrationSummary.changeClasses.components.slice(0, 6).map((entry) => (
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
                            migrationSummary.semverGuidance.majorComponents.map((name) => (
                              <SectionBadge key={`major-${name}`} label={name} />
                            ))
                          ) : (
                            <Badge tone="success">Bos</Badge>
                          )}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <DetailLabel>Minor review queue</DetailLabel>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {migrationSummary.semverGuidance.minorComponents.length ? (
                            migrationSummary.semverGuidance.minorComponents.map((name) => (
                              <SectionBadge key={`minor-${name}`} label={name} />
                            ))
                          ) : (
                            <Badge tone="success">Bos</Badge>
                          )}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <DetailLabel>Patch-safe lab backlog</DetailLabel>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {migrationSummary.semverGuidance.patchCandidates.length ? (
                            migrationSummary.semverGuidance.patchCandidates.map((name) => (
                              <SectionBadge key={`patch-${name}`} label={name} />
                            ))
                          ) : (
                            <Badge tone="info">Backlog yok</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
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
                      {migrationSummary.upgradePlaybook.tracks.map((track) => (
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
                    <div className="mt-4 space-y-3">
                      {migrationSummary.upgradeChecklist.items.slice(0, 4).map((item) => (
                        <div key={item.checklistId} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Text as="div" className="text-sm font-semibold text-text-primary">
                              {item.component}
                            </Text>
                            <div className="flex flex-wrap gap-2">
                              <SectionBadge label={item.classId} />
                              <SectionBadge label={`semver ${item.semver}`} />
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.ownerHandles.length ? (
                              item.ownerHandles.map((owner) => (
                                <SectionBadge key={`${item.checklistId}-${owner}`} label={owner} />
                              ))
                            ) : (
                              <Badge tone="warning">Owner eksik</Badge>
                            )}
                          </div>
                          <div className="mt-3 space-y-2">
                            {item.tasks.map((task) => (
                              <Text key={`${item.checklistId}-${task}`} variant="secondary" className="block text-sm leading-6">
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
                      {migrationSummary.ownerResolution.defaultOwnerHandles.map((owner) => (
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
                  <div className="mt-3 space-y-3">
                    {migrationSummary.consumerApps.map((consumer) => (
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
                            {consumer.ownerHandles.map((owner) => (
                              <SectionBadge key={`${consumer.appId}-${owner}`} label={owner} />
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {consumer.components.map((name) => (
                            <SectionBadge key={`${consumer.appId}-${name}`} label={name} />
                          ))}
                        </div>
                        {(consumer.singleAppComponents?.length || consumer.sharedComponents?.length) ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {consumer.singleAppComponents?.length ? (
                              <Badge tone="warning">{`${consumer.singleAppComponents.length} single-app surface`}</Badge>
                            ) : null}
                            {consumer.sharedComponents?.length ? (
                              <Badge tone="info">{`${consumer.sharedComponents.length} shared surface`}</Badge>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Migration rules</DetailLabel>
                  <div className="mt-3 space-y-2">
                    {migrationSummary.rules.map((rule) => (
                      <Text key={rule} variant="secondary" className="block text-sm leading-6">
                        {rule}
                      </Text>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Evidence refs</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {migrationSummary.evidenceRefs.map((entry) => (
                      <SectionBadge key={entry} label={entry} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LibraryShowcaseCard>
        ) : null}

        {visualRegressionSummary ? (
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
              <div className="space-y-4">
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
                    {visualRegressionSummary.requiredHarnesses.map((harness) => (
                      <div key={harness.path} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Text as="div" className="text-sm font-semibold text-text-primary">
                            {harness.path}
                          </Text>
                          <Badge tone={harness.present ? 'success' : 'warning'}>
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
                        visualRegressionSummary.coverageBacklog.stableWithoutStory.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Backlog temiz</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Adopted without story</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {visualRegressionSummary.coverageBacklog.adoptedWithoutStory.length ? (
                        visualRegressionSummary.coverageBacklog.adoptedWithoutStory.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Adopted story coverage hazir</Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                    <DetailLabel>Live demo without story</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {visualRegressionSummary.coverageBacklog.liveDemoWithoutStory.length ? (
                        visualRegressionSummary.coverageBacklog.liveDemoWithoutStory.map((name) => (
                          <SectionBadge key={name} label={name} />
                        ))
                      ) : (
                        <Badge tone="success">Live demo ile story coverage dengeli</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <DetailLabel>Visual rules</DetailLabel>
                  <div className="mt-3 space-y-2">
                    {visualRegressionSummary.rules.map((rule) => (
                      <Text key={rule} variant="secondary" className="block text-sm leading-6">
                        {rule}
                      </Text>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                    {visualRegressionSummary.evidenceRefs.slice(0, 10).map((entry) => (
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

        {themePresetSummary ? (
          <LibraryShowcaseCard
            eyebrow="Theme Presets"
            title="Resmi preset galerisi"
            description="Theme engine üzerinde resmi olarak desteklenen preset ailesi. Docs, release ve runtime aynı preset kimliklerini kullanır."
            badges={[
              <SectionBadge key="theme-catalog" label={themePresetSummary.catalogId} />,
              <SectionBadge key="theme-count" label={`${themePresetSummary.presets.length} preset`} />,
            ]}
          >
            <div className="grid grid-cols-1 gap-4">
              <ThemePresetGallery
                presets={themePresetGalleryItems}
                compareAxes={themePresetSummary.compareAxes}
              />
              <ThemePresetCompare
                leftPreset={defaultThemePreset}
                rightPreset={contrastThemePreset ?? compactThemePreset}
              />
            </div>

            <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
              <DetailLabel>Preset kuralları</DetailLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {themePresetSummary.compareAxes.map((axis) => (
                  <SectionBadge key={axis} label={axis} />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {themePresetSummary.rules.map((rule) => (
                  <Text key={rule} variant="secondary" className="block text-sm leading-6">
                    {rule}
                  </Text>
                ))}
              </div>
            </div>
          </LibraryShowcaseCard>
        ) : null}

        {recipeSummary ? (
          <LibraryShowcaseCard
            eyebrow="Recipe System"
            title={relatedRecipes.length ? 'Seçili component ile ilişkili reçeteler' : 'Library recipe ailesi'}
            description="Tek tek component yerine ortak ekran davranışlarını reusable recipe mantığıyla yönetmek için kullanılan kontrat katmanı."
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
                  <div key={recipe.recipeId} className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm">
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
                          <Badge tone={directRecipeMatch ? 'success' : 'muted'}>
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
              }) : recipeSummary.currentFamilies.map((recipe) => (
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
                    <Badge tone="muted">Library recipe</Badge>
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
                  {recipeSummary.plannedFamilies.map((family) => (
                    <SectionBadge key={family} label={family} />
                  ))}
                </div>
              </div>
            ) : null}
          </LibraryShowcaseCard>
        ) : null}
      </div>
    );
  };

  const renderApiTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">API bilgisi için component seç.</Text>;
    }
    const apiItem = componentApiMap.get(item.name);
    const usageRecipes = buildUsageRecipes(item, apiItem);
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Import</DetailLabel>
            <LibraryCodeBlock code={item.importStatement || 'Planned item — import kapalı'} className="mt-3" />
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>API Model</DetailLabel>
            {apiItem ? (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>Variant Axes</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.variantAxes.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>State Model</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.stateModel.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>Preview Focus</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.previewFocus.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <DetailLabel>Regression Focus</DetailLabel>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiItem.regressionFocus.map((entry) => <SectionBadge key={entry} label={entry} />)}
                  </div>
                </div>
              </div>
            ) : (
              <Text variant="secondary" className="mt-3 block">
                Bu component icin henuz detayli API catalog girdisi yok.
              </Text>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <LibraryPropsTable
            rows={(apiItem?.props ?? []).map((prop) => ({
              name: prop.name,
              type: prop.type,
              defaultValue: prop.default,
              required: prop.required,
              description: prop.description,
            }))}
          />

          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Registry Alanları</DetailLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Kind</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.kind}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Taxonomy</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.taxonomyGroupId}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Subgroup</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{item.taxonomySubgroup}</Text>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                <DetailLabel>Track</DetailLabel>
                <Text as="div" className="mt-2 font-semibold text-text-primary">{trackMeta[resolveItemTrack(item)].label}</Text>
              </div>
            </div>
          </div>
        </div>

        <LibraryUsageRecipesPanel recipes={usageRecipes} />
      </div>
    );
  };

  const renderUxTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">UX eşleşmesi için component seç.</Text>;
    }
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>UX Alignment</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.uxPrimaryThemeId ? <SectionBadge label={item.uxPrimaryThemeId} /> : <Text variant="secondary">Primary theme yok</Text>}
            {item.uxPrimarySubthemeId ? <SectionBadge label={item.uxPrimarySubthemeId} /> : <Text variant="secondary">Primary subtheme yok</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>North Star Sections</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.sectionIds?.length ? item.sectionIds.map((sectionId) => <SectionBadge key={sectionId} label={sectionId} />) : <Text variant="secondary">Section yok</Text>}
          </div>
        </div>
      </div>
    );
  };

  const renderQualityTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">Kalite bilgisi için component seç.</Text>;
    }
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Quality Gates</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.qualityGates?.length ? item.qualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">Gate yok</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Where Used</DetailLabel>
          <div className="mt-4 space-y-2">
            {item.whereUsed.length > 0 ? item.whereUsed.map((filePath) => (
              <div key={filePath} className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                <div className="break-all text-xs text-text-secondary">{filePath}</div>
              </div>
            )) : <Text variant="secondary">Kullanım bulunamadı.</Text>}
          </div>
        </div>
      </div>
    );
  };

  const renderRecipeOverviewTab = (recipe: DesignLabRecipeFamily | null) => {
    if (!recipe) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text variant="secondary">Recipe Explorer için soldan bir reçete seç.</Text>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Recipe Summary</DetailLabel>
            <Text as="div" className="mt-3 text-lg font-semibold text-text-primary">
              {recipe.recipeId}
            </Text>
            <Text variant="secondary" className="mt-2 block leading-7">
              {recipe.intent}
            </Text>
            <div className="mt-5 flex flex-wrap gap-2">
              {recipe.ownerBlocks.map((owner) => (
                <SectionBadge key={owner} label={owner} />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Recipe Quick Status</DetailLabel>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <LibraryMetricCard label="Owner blocks" value={recipe.ownerBlocks.length} note="Bu recipe içindeki canonical bileşen sayısı." />
              <LibraryMetricCard label="Tracks" value={selectedRecipeTracks.length} note="Recipe’in dağıldığı yayın hattı sayısı." />
              <LibraryMetricCard label="Sections" value={selectedRecipeSections.length} note="Kapsanan north-star section sayısı." />
              <LibraryMetricCard label="Themes" value={selectedRecipeThemes.length} note="Bağlı UX tema ve alt tema yüzeyi." />
            </div>
          </div>
        </div>

        <LibraryShowcaseCard
          eyebrow="Consumer Flow"
          title="Recipe adoption contract"
          description="Uygulama ekipleri önce recipe seviyesinde karar almalı, sonra gerekli owner block detayına inmelidir."
          badges={[
            <SectionBadge key="recipe-id" label={recipe.recipeId} />,
            <SectionBadge key="recipe-owner-count" label={`${recipe.ownerBlocks.length} owner block`} />,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <LibraryMetricCard label="Step 1" value="Recipe seç" note="Ekran problemi önce hazır recipe ailesiyle eşleştirilir." />
            <LibraryMetricCard label="Step 2" value="Preset kilitle" note="Theme, density ve UX section kararları recipe katmanında sabitlenir." />
            <LibraryMetricCard label="Step 3" value="Componente in" note="Yalnız eksik blok ya da varyant ihtiyacı varsa primitive detaya inilmelidir." />
          </div>
        </LibraryShowcaseCard>
      </div>
    );
  };

  const renderRecipeDemoSection = (recipe: DesignLabRecipeFamily | null) => {
    if (!recipe) {
      return <Text variant="secondary">Demo ve kompozisyon için bir recipe seç.</Text>;
    }

    const baseShowcaseSections = buildRecipeWorkspaceShowcaseSections(recipe).map((section) => ({
      ...section,
      kind: resolveShowcaseSectionKind(section),
    }));
    const orderedShowcaseSections = demoGalleryMode === 'recipes_first'
      ? [...baseShowcaseSections].sort((left, right) => {
          const order: Record<DemoSurfaceKind, number> = { recipe: 0, live: 1, reference: 2 };
          return order[left.kind ?? 'live'] - order[right.kind ?? 'live'];
        })
      : baseShowcaseSections.filter((section) => demoGalleryMode !== 'live_only' || section.kind === 'live');

    return (
      <DemoGalleryModeContext.Provider value={demoGalleryMode}>
        <div className="space-y-5">
          <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {orderedShowcaseSections.map((section, index) => (
                  <SectionBadge key={section.id} label={`${String(index + 1).padStart(2, '0')} · ${section.title}`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <SectionBadge label={`Mod · ${demoGalleryModeOptions.find((entry) => entry.id === demoGalleryMode)?.label ?? 'Tüm yüzeyler'}`} />
                <SectionBadge label={sectionLockEnabled ? 'Section lock · Açık' : 'Section lock · Kapalı'} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {orderedShowcaseSections.length ? (
              orderedShowcaseSections.map((section) => (
                <div key={section.id} data-testid={`design-lab-recipe-demo-card-${section.id}`} data-demo-section-kind={section.kind}>
                  <LibraryShowcaseCard
                    eyebrow={section.eyebrow}
                    title={section.title}
                    description={section.description}
                    badges={[
                      <SectionBadge
                        key={`${section.id}-kind`}
                        label={demoSurfaceMeta[section.kind ?? 'live'].label}
                        className={demoSurfaceMeta[section.kind ?? 'live'].badgeClassName}
                      />,
                      ...((section.badges ?? []).map((badge) => <SectionBadge key={`${section.id}-${badge}`} label={badge} />)),
                    ]}
                  >
                    {section.content}
                  </LibraryShowcaseCard>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-border-subtle bg-surface-default p-5 shadow-sm">
                <Text variant="secondary" className="block leading-7">
                  Seçili mod için görünür recipe demosu kalmadı. `Tüm yüzeyler` veya `Recipes first` moduna dönerek kompozisyon kartlarını tekrar açabilirsin.
                </Text>
              </div>
            )}
          </div>
        </div>
      </DemoGalleryModeContext.Provider>
    );
  };

  const renderRecipeApiTab = (recipe: DesignLabRecipeFamily | null) => {
    if (!recipe) {
      return <Text variant="secondary">Consume contract için bir recipe seç.</Text>;
    }

    const composeCode = `import { ${recipe.ownerBlocks.join(', ')} } from 'mfe-ui-kit';\n\nexport function ${recipe.recipeId.replace(/[^a-zA-Z0-9]+/g, ' ')}Recipe() {\n  return (\n    <div>{/* ${recipe.intent} */}</div>\n  );\n}`;
    const usageRecipes = [
      {
        title: 'Compose recipe shell',
        description: 'Recipe owner block setini doğrudan aynı yüzeyde compose et.',
        code: composeCode,
      },
      {
        title: 'Consumer handoff',
        description: 'Uygulama ekipleri önce recipe kararını taşır, sonra gerekirse alt primitive varyantı açar.',
        code: `// Recipe intent\n// ${recipe.intent}\n// Owner blocks: ${recipe.ownerBlocks.join(', ')}\n// Contract: ${recipeSummary?.contractId ?? 'recipe-contract'}`,
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Recipe Contract</DetailLabel>
            <LibraryCodeBlock code={composeCode} className="mt-3" />
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <DetailLabel>Registry Binding</DetailLabel>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
              <LibraryMetricCard label="Recipe ID" value={recipe.recipeId} note="Design Lab içindeki canonical recipe kimliği." />
              <LibraryMetricCard label="Owner blocks" value={recipe.ownerBlocks.length} note="Tüketici ekranın compose edeceği resmi blok seti." />
              <LibraryMetricCard label="Tracks" value={selectedRecipeTracks.join(' / ') || '—'} note="Recipe içindeki yayın hatları." />
              <LibraryMetricCard label="Contract" value={recipeSummary?.contractId ?? '—'} note="Recipe sisteminin kaynak kontratı." />
            </div>
          </div>
        </div>
        <LibraryUsageRecipesPanel title="Recipe consume patterns" recipes={usageRecipes} />
      </div>
    );
  };

  const renderRecipeUxTab = (recipe: DesignLabRecipeFamily | null) => {
    if (!recipe) {
      return <Text variant="secondary">UX hizası için bir recipe seç.</Text>;
    }
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>UX Theme Coverage</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRecipeThemes.length ? selectedRecipeThemes.map((theme) => <SectionBadge key={theme} label={theme} />) : <Text variant="secondary">Theme bağı yok</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>North Star Sections</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRecipeSections.length ? selectedRecipeSections.map((section) => <SectionBadge key={section} label={section} />) : <Text variant="secondary">Section bağı yok</Text>}
          </div>
        </div>
      </div>
    );
  };

  const renderRecipeQualityTab = (recipe: DesignLabRecipeFamily | null) => {
    if (!recipe) {
      return <Text variant="secondary">Kalite bilgisi için bir recipe seç.</Text>;
    }
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Combined Quality Gates</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRecipeQualityGates.length ? selectedRecipeQualityGates.map((gate) => <SectionBadge key={gate} label={gate} />) : <Text variant="secondary">Quality gate yok</Text>}
          </div>
        </div>
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <DetailLabel>Lifecycle Mix</DetailLabel>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <LibraryMetricCard label="Stable" value={selectedRecipeItems.filter((item) => item.lifecycle === 'stable').length} note="Recipe içindeki stable blok sayısı." />
            <LibraryMetricCard label="Beta" value={selectedRecipeItems.filter((item) => item.lifecycle === 'beta').length} note="Henüz stabilize edilmemiş blok sayısı." />
            <LibraryMetricCard label="Live demo" value={selectedRecipeItems.filter((item) => item.demoMode === 'live').length} note="Canlı demoya sahip blok sayısı." />
          </div>
        </div>
      </div>
    );
  };

  const renderComponentDetailTabContent = (item: DesignLabIndexItem | null) => (
    <div className="space-y-5">
      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.overview = node;
        }}
        id="design-lab-section-overview"
        eyebrow="Section 01"
        title="Overview"
        description="Bileşenin rolü, yayın durumu ve karar çerçevesi."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="overview">{renderOverviewTab(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.demo = node;
        }}
        id="design-lab-section-demo"
        eyebrow="Section 02"
        title="Demo Gallery"
        description="Ant Design ve Material UI benzeri tek sayfa showcase akışı. Seçili component için bütün alternatifler aşağı doğru görünür."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              size="sm"
              variant={sectionLockEnabled ? 'secondary' : 'ghost'}
              onClick={() => setSectionLockEnabled((current) => !current)}
              data-testid="design-lab-section-lock-toggle"
            >
              {sectionLockEnabled ? 'Section lock açık' : 'Section lock kapalı'}
            </Button>
            {demoGalleryModeOptions.map((option) => (
              <Button
                key={option.id}
                size="sm"
                variant={demoGalleryMode === option.id ? 'secondary' : 'ghost'}
                onClick={() => setDemoGalleryMode(option.id)}
                data-testid={`design-lab-demo-mode-${option.id}`}
                title={option.note}
              >
                {option.label}
              </Button>
            ))}
            {item?.importStatement ? (
              <Button variant="secondary" size="sm" onClick={() => handleCopy(item.importStatement)}>
                Import kopyala
              </Button>
            ) : null}
          </div>
        }
        className="scroll-mt-32"
      >
        <div data-detail-section-id="demo">{renderDemoSection(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.api = node;
        }}
        id="design-lab-section-api"
        eyebrow="Section 03"
        title="API"
        description="Import, props, variant axes ve regression focus bilgisi."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="api">{renderApiTab(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.ux = node;
        }}
        id="design-lab-section-ux"
        eyebrow="Section 04"
        title="UX Alignment"
        description="UX katalog hizası ve north-star section bağları."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="ux">{renderUxTab(item)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.quality = node;
        }}
        id="design-lab-section-quality"
        eyebrow="Section 05"
        title="Quality"
        description="Gate, usage ve regression evidence katmanı."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="quality">{renderQualityTab(item)}</div>
      </LibraryDocsSection>
    </div>
  );

  const renderRecipeDetailTabContent = (recipe: DesignLabRecipeFamily | null) => (
    <div className="space-y-5">
      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.overview = node;
        }}
        id="design-lab-section-overview"
        eyebrow="Section 01"
        title="Overview"
        description="Recipe amacı, owner blokları ve tüketim karar çerçevesi."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="overview">{renderRecipeOverviewTab(recipe)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.demo = node;
        }}
        id="design-lab-section-demo"
        eyebrow="Section 02"
        title="Recipe Gallery"
        description="Recipe kompozisyonu, canlı blok köprüleri ve tüketici handoff akışı."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              size="sm"
              variant={sectionLockEnabled ? 'secondary' : 'ghost'}
              onClick={() => setSectionLockEnabled((current) => !current)}
              data-testid="design-lab-section-lock-toggle"
            >
              {sectionLockEnabled ? 'Section lock açık' : 'Section lock kapalı'}
            </Button>
            {demoGalleryModeOptions.map((option) => (
              <Button
                key={option.id}
                size="sm"
                variant={demoGalleryMode === option.id ? 'secondary' : 'ghost'}
                onClick={() => setDemoGalleryMode(option.id)}
                data-testid={`design-lab-demo-mode-${option.id}`}
                title={option.note}
              >
                {option.label}
              </Button>
            ))}
          </div>
        }
        className="scroll-mt-32"
      >
        <div data-detail-section-id="demo">{renderRecipeDemoSection(recipe)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.api = node;
        }}
        id="design-lab-section-api"
        eyebrow="Section 03"
        title="Consume Contract"
        description="Recipe import, compose ve consumer handoff reçeteleri."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="api">{renderRecipeApiTab(recipe)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.ux = node;
        }}
        id="design-lab-section-ux"
        eyebrow="Section 04"
        title="UX Alignment"
        description="Recipe düzeyinde tema, north-star ve design intent kapsaması."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="ux">{renderRecipeUxTab(recipe)}</div>
      </LibraryDocsSection>

      <LibraryDocsSection
        ref={(node) => {
          detailSectionRefs.current.quality = node;
        }}
        id="design-lab-section-quality"
        eyebrow="Section 05"
        title="Quality"
        description="Recipe içindeki blokların birleşik kalite görünümü."
        className="scroll-mt-32"
      >
        <div data-detail-section-id="quality">{renderRecipeQualityTab(recipe)}</div>
      </LibraryDocsSection>
    </div>
  );

  const sidebarSearchValue = workspaceMode === 'recipes' ? recipeQuery : query;
  const sidebarSearchPlaceholder = workspaceMode === 'recipes' ? 'Recipe ara...' : 'Component ara...';
  const sidebarHelpText = workspaceMode === 'recipes'
    ? 'Recipe ailelerini, owner block setlerini ve tüketim kontratlarını tek akışta gezmek için kullan.'
    : 'Component ailelerini, export durumunu ve canlı demoları tek bir doküman akışında gezmek için kullan.';
  const activeHeroTitle = workspaceMode === 'recipes' ? selectedRecipe?.recipeId ?? 'Recipe seç' : selectedItem?.name ?? 'Component seç';
  const activeHeroDescription = workspaceMode === 'recipes'
    ? selectedRecipe?.intent ?? 'Sol menüden bir recipe seçerek canonical ekran kompozisyonlarını inceleyebilirsin.'
    : selectedItem?.description ?? 'Sol menüden bir component seçerek canlı demo, API ve kalite detaylarını inceleyebilirsin.';
  const activeHeroLabel = workspaceMode === 'recipes' ? 'Recipe' : 'Component';
  const activeDetailContent = workspaceMode === 'recipes'
    ? renderRecipeDetailTabContent(selectedRecipe)
    : renderComponentDetailTabContent(selectedItem);
  const sidebarStats = workspaceMode === 'recipes'
    ? [
        { label: 'Recipes', value: recipeFamilies.length },
        { label: 'Filtered', value: filteredRecipeFamilies.length },
        { label: 'Owner blocks', value: recipeFamilies.reduce((sum, recipe) => sum + recipe.ownerBlocks.length, 0) },
        { label: 'Components', value: summary.total },
      ]
    : [
        { label: 'Total', value: summary.total },
        { label: 'Exported', value: summary.exported },
        { label: 'Live', value: summary.liveDemo },
        { label: 'Planned', value: summary.planned },
      ];
  const activeMetadataItems = workspaceMode === 'recipes'
    ? [
        {
          label: 'Mode',
          value: <Text as="div" className="font-semibold text-text-primary">Recipe Explorer</Text>,
        },
        {
          label: 'Contract',
          value: <Text as="div" className="break-all text-xs font-medium text-text-primary">{recipeSummary?.contractId ?? '—'}</Text>,
        },
        {
          label: 'Owner Blocks',
          value: <Text as="div" className="font-semibold text-text-primary">{String(selectedRecipe?.ownerBlocks.length ?? 0)}</Text>,
        },
        {
          label: 'Tracks',
          value: <Text as="div" className="font-semibold text-text-primary">{selectedRecipeTracks.join(' / ') || '—'}</Text>,
        },
      ]
    : [
        {
          label: 'Status',
          value: (
            <Text as="div" className={`font-semibold ${selectedItem ? statusToneClass[selectedItem.lifecycle] : 'text-text-secondary'}`}>
              {selectedItem ? statusLabel[selectedItem.lifecycle] : 'Seçim yok'}
            </Text>
          ),
        },
        {
          label: 'Package',
          value: <Text as="div" className="font-semibold text-text-primary">mfe-ui-kit</Text>,
        },
        {
          label: 'Contract',
          value: (
            <Text as="div" className="break-all text-xs font-medium text-text-primary">
              {selectedItem?.acceptanceContractId ?? '—'}
            </Text>
          ),
        },
      ];

  return (
    <div data-testid="design-lab-page" className="min-h-screen bg-surface-canvas">
      <div className="mx-auto max-w-[1880px] px-4 py-5 xl:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="font-semibold uppercase tracking-[0.18em] text-text-secondary">Docs</span>
          <span>/</span>
          <span>UI Library</span>
          <span>/</span>
          <span>{workspaceMode === 'recipes' ? 'Recipe Explorer' : selectedGroup?.title ?? trackMeta[activeTrack].label}</span>
          {workspaceMode === 'recipes' ? selectedRecipe ? (
            <>
              <span>/</span>
              <span className="font-medium text-text-primary">{selectedRecipe.recipeId}</span>
            </>
          ) : null : selectedItem ? (
            <>
              <span>/</span>
              <span className="font-medium text-text-primary">{selectedItem.name}</span>
            </>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)_260px]">
          <aside
            data-testid="design-lab-sidebar"
            className="relative z-10 sticky top-4 flex max-h-[calc(100vh-32px)] min-h-0 flex-col overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-sm"
          >
            <div className="border-b border-border-subtle px-5 py-5">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                UI Library
              </Text>
              <div className="mt-2 flex items-center justify-between gap-3">
                <Text as="div" className="text-2xl font-semibold text-text-primary">
                  {workspaceMode === 'recipes' ? 'Recipe Explorer' : 'Component Explorer'}
                </Text>
                <Tooltip text={sidebarHelpText}>
                  <span className="shrink-0">
                    <IconButton
                      icon={<CircleHelp className="h-4 w-4" />}
                      label={workspaceMode === 'recipes' ? 'Recipe Explorer yardımı' : 'Component Explorer yardımı'}
                      size="sm"
                      variant="ghost"
                    />
                  </span>
                </Tooltip>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={workspaceMode === 'components' ? 'secondary' : 'ghost'}
                  onClick={() => setWorkspaceMode('components')}
                  data-testid="design-lab-workspace-components"
                >
                  Components
                </Button>
                <Button
                  size="sm"
                  variant={workspaceMode === 'recipes' ? 'secondary' : 'ghost'}
                  onClick={() => setWorkspaceMode('recipes')}
                  data-testid="design-lab-workspace-recipes"
                >
                  Recipes
                </Button>
              </div>
              <div className="mt-3">
                <input
                  data-testid="design-lab-search"
                  value={sidebarSearchValue}
                  onChange={(event) => {
                    if (workspaceMode === 'recipes') {
                      setRecipeQuery(event.target.value);
                      return;
                    }
                    setQuery(event.target.value);
                  }}
                  placeholder={sidebarSearchPlaceholder}
                  className="h-11 w-full rounded-2xl border border-border-default bg-surface-panel px-4 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
                  aria-label="UI library arama"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-4 py-5">
              {workspaceMode === 'recipes' ? (
                <section className="rounded-[24px] border border-border-subtle bg-surface-panel p-3">
                  <div className="mb-3 flex items-center justify-between gap-2 px-2">
                    <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Recipe Explorer
                    </Text>
                    <SectionBadge label={`${filteredRecipeFamilies.length} recipe`} />
                  </div>
                  <div className="space-y-2" data-testid="design-lab-recipe-list">
                    {filteredRecipeFamilies.length ? filteredRecipeFamilies.map((recipe) => {
                      const active = selectedRecipe?.recipeId === recipe.recipeId;
                      return (
                        <button
                          key={recipe.recipeId}
                          type="button"
                          onClick={() => setSelectedRecipeId(recipe.recipeId)}
                          data-testid={`design-lab-recipe-${toTestIdSuffix(recipe.recipeId)}`}
                          className={`w-full rounded-[18px] border px-4 py-3 text-left transition ${
                            active
                              ? 'border-action-primary/30 bg-surface-default shadow-sm'
                              : 'border-border-subtle bg-surface-canvas hover:bg-surface-muted'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Text as="div" className="text-sm font-semibold text-text-primary">
                                {recipe.recipeId}
                              </Text>
                              <Text variant="secondary" className="mt-1 block text-xs leading-6">
                                {recipe.intent}
                              </Text>
                            </div>
                            <Badge tone={active ? 'info' : 'muted'}>{recipe.ownerBlocks.length}</Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {recipe.ownerBlocks.slice(0, 3).map((owner) => (
                              <SectionBadge key={owner} label={owner} />
                            ))}
                            {recipe.ownerBlocks.length > 3 ? <SectionBadge label={`+${recipe.ownerBlocks.length - 3}`} /> : null}
                          </div>
                        </button>
                      );
                    }) : (
                      <div className="rounded-[18px] border border-border-subtle bg-surface-canvas px-4 py-4">
                        <Text variant="secondary" className="block text-sm leading-7">
                          Arama kriterine uyan recipe bulunamadı.
                        </Text>
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <section className="rounded-[24px] border border-border-subtle bg-surface-panel p-3">
                  <div className="mb-3 px-2">
                    <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Ürün Ağacı
                    </Text>
                  </div>

                  <LibraryProductTree
                    tracks={treeTracks}
                    selection={treeSelection}
                    defaultSelection={treeSelection}
                    onSelectionChange={setTreeSelection}
                    testIdPrefix="design-lab"
                  />
                </section>
              )}
            </div>
          </aside>

          <main className="min-w-0 space-y-5">
            <section
              data-testid="design-lab-detail-hero"
              className="overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-sm"
            >
              <div className="border-b border-border-subtle px-6 py-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <SectionBadge label={workspaceMode === 'recipes' ? 'Recipe Explorer' : trackMeta[activeTrack].label} />
                      {workspaceMode === 'recipes'
                        ? selectedRecipe ? <SectionBadge label={`${selectedRecipe.ownerBlocks.length} owner block`} /> : null
                        : selectedGroup ? <SectionBadge label={selectedGroup.title} /> : null}
                      {releaseSummary?.packageVersion ? <SectionBadge label={`${releaseSummary.packageName}@${releaseSummary.packageVersion}`} /> : null}
                      {releaseSummary?.latestRelease.date ? <SectionBadge label={`Release · ${releaseSummary.latestRelease.date}`} /> : null}
                      {workspaceMode === 'recipes'
                        ? selectedRecipeTracks.map((track) => <SectionBadge key={track} label={track} />)
                        : selectedItem?.roadmapWaveId ? <SectionBadge label={selectedItem.roadmapWaveId} /> : null}
                      {workspaceMode === 'recipes' ? (
                        selectedRecipe ? <Badge tone="info">Recipe</Badge> : null
                      ) : selectedItem ? (
                        <Badge tone={selectedItem.lifecycle === 'stable' ? 'success' : selectedItem.lifecycle === 'beta' ? 'warning' : 'info'}>
                          {statusLabel[selectedItem.lifecycle]}
                        </Badge>
                      ) : null}
                    </div>
                    <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                      {activeHeroLabel}
                    </Text>
                    <Text as="h1" className="mt-2 text-[2.35rem] font-semibold tracking-[-0.03em] text-text-primary">
                      {activeHeroTitle}
                    </Text>
                    <Text variant="secondary" className="mt-3 block max-w-3xl text-[15px] leading-7">
                      {activeHeroDescription}
                    </Text>
                  </div>
                  <div className="grid grid-cols-2 gap-3 xl:w-[340px]">
                    {heroStats.map((stat) => (
                      <LibraryMetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 px-6 py-4">
                {workspaceMode === 'recipes' ? (
                  <>
                    <Badge tone="info">Recipe-first design</Badge>
                    {selectedRecipeThemes.slice(0, 3).map((theme) => (
                      <SectionBadge key={theme} label={theme} />
                    ))}
                    {selectedRecipeQualityGates.length ? <SectionBadge label={`${selectedRecipeQualityGates.length} quality gate`} /> : null}
                  </>
                ) : (
                  <>
                    {selectedItem ? <Badge tone={selectedItem.availability === 'exported' ? 'success' : 'info'}>{availabilityLabel[selectedItem.availability]}</Badge> : null}
                    {selectedItem ? <Badge tone={selectedItem.demoMode === 'live' ? 'success' : selectedItem.demoMode === 'planned' ? 'warning' : 'muted'}>{demoModeLabel[selectedItem.demoMode]}</Badge> : null}
                    {selectedItem?.uxPrimaryThemeId ? <SectionBadge label={selectedItem.uxPrimaryThemeId} /> : null}
                  </>
                )}
                {workspaceMode === 'components' && selectedItem?.importStatement ? (
                  <Button variant="secondary" className="ml-auto" onClick={() => handleCopy(selectedItem.importStatement)}>
                    Import kopyala
                  </Button>
                ) : null}
              </div>
              {copied === 'ok' ? <Text variant="secondary" className="px-6 pb-4">Kopyalandı</Text> : null}
              {copied === 'fail' ? <Text variant="secondary" className="px-6 pb-4">Kopyalanamadı</Text> : null}
            </section>

            <div data-testid="design-lab-detail-tabs">
              <LibraryDetailTabs
                tabs={detailTabMeta}
                activeTabId={detailTab}
                onTabChange={(tabId) => scrollToDetailSection(tabId as DesignLabDetailTab)}
                testIdPrefix="design-lab"
              />
            </div>

            <section data-testid="design-lab-detail-panel" className="min-w-0">
              {activeDetailContent}
            </section>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-4 space-y-4">
              <LibraryOutlinePanel
                items={detailTabMeta.map((tab) => ({ id: tab.id, label: tab.label }))}
                activeItemId={detailTab}
                onItemSelect={(tabId) => scrollToDetailSection(tabId as DesignLabDetailTab)}
              />

              <LibraryStatsPanel
                items={sidebarStats}
              />

              {releaseSummary ? (
                <LibraryMetadataPanel
                  title="Release"
                  items={[
                    {
                      label: 'Package',
                      value: <Text as="div" className="font-semibold text-text-primary">{`${releaseSummary.packageName}@${releaseSummary.packageVersion}`}</Text>,
                    },
                    {
                      label: 'Latest Notes',
                      value: <Text as="div" className="font-semibold text-text-primary">{releaseSummary.latestRelease.date || 'Tarih yok'}</Text>,
                    },
                    {
                      label: 'Targets Ready',
                      value: <Text as="div" className="font-semibold text-text-primary">{`${readyDistributionTargetCount}/${releaseSummary.distributionTargets.length}`}</Text>,
                    },
                    {
                      label: 'Evidence',
                      value: <Text as="div" className="font-semibold text-text-primary">{String(releaseSummary.latestRelease.evidenceRefs.length)}</Text>,
                    },
                    ...(workspaceMode === 'recipes'
                      ? [
                          {
                            label: 'Recipe',
                            value: <Text as="div" className="font-semibold text-text-primary">{selectedRecipe?.recipeId ?? '—'}</Text>,
                          },
                          {
                            label: 'Owner Blocks',
                            value: <Text as="div" className="font-semibold text-text-primary">{String(selectedRecipe?.ownerBlocks.length ?? 0)}</Text>,
                          },
                        ]
                      : selectedItem
                        ? [
                            {
                              label: 'Family',
                              value: <Text as="div" className="font-semibold text-text-primary">{selectedGroup?.title ?? selectedItem.taxonomyGroupId}</Text>,
                            },
                            {
                              label: 'Wave',
                              value: <Text as="div" className="font-semibold text-text-primary">{selectedItem.roadmapWaveId ?? 'legacy_surface'}</Text>,
                            },
                          ]
                        : []),
                  ]}
                />
              ) : null}

              {adoptionSummary ? (
                <LibraryMetadataPanel
                  title="Adoption"
                  items={[
                    {
                      label: 'Coverage',
                      value: <Text as="div" className="font-semibold text-text-primary">{`${adoptionSummary.apiCoverage.coveragePercent}%`}</Text>,
                    },
                    {
                      label: 'Ready Surface',
                      value: <Text as="div" className="font-semibold text-text-primary">{String(adoptionSummary.releaseReadiness.wideAdoptionReady)}</Text>,
                    },
                    {
                      label: 'Used by apps',
                      value: <Text as="div" className="font-semibold text-text-primary">{String(adoptionSummary.surfaceSummary.consumedByAppsExports)}</Text>,
                    },
                    {
                      label: 'Private guard',
                      value: (
                        <Text
                          as="div"
                          className={`font-semibold ${adoptionSummary.internalSurfaceProtection.status === 'protected' ? 'text-state-success-text' : 'text-state-warning-text'}`}
                        >
                          {adoptionSummary.internalSurfaceProtection.status}
                        </Text>
                      ),
                    },
                  ]}
                />
              ) : null}

              {migrationSummary ? (
                <LibraryMetadataPanel
                  title="Migration"
                  items={[
                    {
                      label: 'Adopted',
                      value: <Text as="div" className="font-semibold text-text-primary">{String(migrationSummary.summary.adoptedOutsideLabComponents)}</Text>,
                    },
                    {
                      label: 'Consumer apps',
                      value: <Text as="div" className="font-semibold text-text-primary">{String(migrationSummary.summary.consumerAppsCount)}</Text>,
                    },
                    {
                      label: 'Story coverage',
                      value: <Text as="div" className="font-semibold text-text-primary">{`${migrationSummary.summary.adoptedStoryCoveragePercent}%`}</Text>,
                    },
                    {
                      label: 'Stable only lab',
                      value: <Text as="div" className="font-semibold text-text-primary">{String(migrationSummary.summary.stableOnlyInDesignLab)}</Text>,
                    },
                  ]}
                />
              ) : null}

              <LibraryMetadataPanel items={activeMetadataItems} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DesignLabPage;
