// @ts-nocheck — design-lab showcase, component API alignment pending
import React, { useEffect, useMemo, useState } from 'react';
import { Boxes, CircleHelp, MapIcon, Sparkles } from 'lucide-react';
import {
  AgGridServer,
  Badge,
  Button,
  DetailDrawer,
  DetailSectionTabs,
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
} from '@mfe/design-system';
import {
  LibraryProductTree,
  LibraryQueryProvider,
  LibraryDocsSection,
  LibraryCodeBlock,
  LibrarySectionBadge as SectionBadge,
  LibraryDetailLabel as DetailLabel,
  LibraryShowcaseCard,
  LibraryMetricCard,
  LibraryOutlinePanel,
  LibraryStatsPanel,
  LibraryMetadataPanel,
  LibraryPropsTable,
  LibraryUsageRecipesPanel,
  type LibraryProductTreeSelection,
  type LibraryProductTreeTrack,
} from '../../../../../packages/design-system/src/catalog/design-lab-internals';
import designLabIndexRaw from './design-lab.index.json';
import designLabGeneratedMetaRaw from './design-lab.generated-meta.v1.json';
import designLabTaxonomyRaw from './design-lab.taxonomy.v1.json';
import {
  designLabApiCatalogMeta,
  designLabApiItems,
  designLabIndexItems,
} from '../../../../../packages/design-system/src/catalog/component-docs';
import { DesignLabComponentOverviewPanels } from './design-lab/detail-tabs/DesignLabComponentOverviewPanels';
import {
  DesignLabComponentDetailSections,
  type DesignLabComponentApiPanelId,
  type DesignLabComponentQualityPanelId,
} from './design-lab/detail-tabs/DesignLabComponentDetailSections';
import {
  DesignLabRecipeDetailSections,
  type DesignLabRecipeApiPanelId,
  type DesignLabRecipeQualityPanelId,
  type DesignLabRecipeOverviewPanelId,
} from './design-lab/detail-tabs/DesignLabRecipeDetailSections';
import {
  DesignLabPageDetailSections,
  type DesignLabPageApiPanelId,
  type DesignLabPageOverviewPanelId,
  type DesignLabPageQualityPanelId,
} from './design-lab/detail-tabs/DesignLabPageDetailSections';
import {
  DesignLabFoundationDetailSections,
  type DesignLabFoundationOverviewPanelId,
  type DesignLabFoundationApiPanelId,
  type DesignLabFoundationQualityPanelId,
} from './design-lab/detail-tabs/DesignLabFoundationDetailSections';
import {
  DesignLabEcosystemDetailSections,
  type DesignLabEcosystemOverviewPanelId,
  type DesignLabEcosystemApiPanelId,
  type DesignLabEcosystemQualityPanelId,
} from './design-lab/detail-tabs/DesignLabEcosystemDetailSections';
import { DesignLabHero } from './design-lab/page-shell/DesignLabHero';
import { DesignLabDetailPanel } from './design-lab/page-shell/DesignLabDetailPanel';
import { DesignLabRightRail } from './design-lab/page-shell/DesignLabRightRail';
import { DesignLabSidebar } from './design-lab/page-shell/DesignLabSidebar';
import { resolveLegacyAdapterNoticeAction } from './design-lab/page-shell/designLabLegacyAdapterNotice';
import { recordDesignLabLegacyAliasTelemetry } from './design-lab/page-shell/designLabLegacyAliasTelemetry';
import {
  resolveDesignLabPageShellDetailContentKind,
  resolveDesignLabPageShellOverviewSupplementalMetadataKind,
} from './design-lab/page-shell/designLabPageShellContentResolver';
import {
  resolveDesignLabPageShellDetailTabs,
  resolveDesignLabPageShellHeroCopy,
  resolveDesignLabPageShellLayerId,
  resolveDesignLabPageShellWorkspaceLabel,
} from './design-lab/page-shell/designLabPageShellLayerResolver';
import {
  resolveDesignLabPageShellRightRailActiveId,
  resolveDesignLabPageShellRightRailSelectionKind,
  resolveDesignLabPageShellRightRailTabs,
  resolveDesignLabPageShellSidebarStats,
} from './design-lab/page-shell/designLabPageShellRightRailResolver';
import {
  resolveDesignLabComponentMetadataItems,
  resolveDesignLabFoundationMetadataItems,
  resolveDesignLabAdoptionMetadataItems,
  resolveDesignLabLensGuideMetadataItems,
  resolveDesignLabMigrationMetadataItems,
  resolveDesignLabPageMetadataItems,
  resolveDesignLabReleaseMetadataItems,
  resolveDesignLabRecipeMetadataItems,
  type DesignLabMetadataDescriptor,
} from './design-lab/page-shell/designLabPageShellMetadataResolver';
import {
  applyFamilySelection,
  readFamilySelectionUrlParams,
  readLayerPanelUrlParams,
  resolveActiveFamilySelectionIdFromState,
  resolveFallbackFamilySelection,
  resolveHydratedFamilySelection,
  resolvePreferredSectionId,
  resolveSectionChangeFamilySelection,
  resolveSidebarFamilySelection,
  resolveWorkspaceModeForSection,
  syncFamilySelectionUrlParams,
  syncLayerPanelUrlParams,
  stripInactiveLayerParams,
  type DesignLabFamilySelectionState,
  type DesignLabWorkspaceMode as DesignLabWorkspaceModeState,
} from './design-lab/page-shell/designLabWorkspaceState';
import { toDesignLabFamilyIdentity } from './design-lab/page-shell/designLabFamilyModel';
import {
  isAdapterLegacyDesignLabSectionId,
  resolveLegacySectionComponentFallbackGroupId,
  normalizeDesignLabSectionId,
  resolveLegacySectionRecipeFallbackId,
} from './design-lab/page-shell/designLabSectionRouting';
import {
  isDesignLabUrlTokenFlexibleMatch,
  isDesignLabUrlTokenMatch,
} from './design-lab/designLabUrlMatch';
import { useDesignLabTaxonomyNavigatorModel } from './design-lab/page-shell/useDesignLabTaxonomyNavigatorModel';
import { useDesignLabI18n } from './design-lab/useDesignLabI18n';
import {
  DesignLabRecipeComponentPreview,
  DesignLabShowcaseContent,
  designLabPreviewPanelIds,
  getDesignLabPreviewPanelItems,
} from './design-lab/showcase/DesignLabShowcaseContent';
import type { DesignLabPreviewPanelId } from './design-lab/showcase/showcaseTypes';
import { useLocation, useNavigate } from 'react-router-dom';

type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
type DesignLabAvailability = 'exported' | 'planned';
type DesignLabDemoMode = 'live' | 'inspector' | 'planned';
type DesignLabTrack = 'new_packages' | 'current_system' | 'roadmap';
type DesignLabDetailTab = 'general' | 'overview' | 'demo' | 'api' | 'ux' | 'quality';
type DesignLabWorkspaceMode = DesignLabWorkspaceModeState;
type DesignLabOverviewPanelId = 'release' | 'adoption' | 'migration' | 'visual' | 'theme' | 'recipes';
type DesignLabTranslate = (key: string, variables?: Record<string, string | number>) => string;

const designLabWorkspaceModes: DesignLabWorkspaceMode[] = ['foundations', 'components', 'recipes', 'pages', 'ecosystem'];
const designLabDetailTabIds: DesignLabDetailTab[] = ['general', 'demo', 'overview', 'api', 'ux', 'quality'];
const designLabTrackIds: DesignLabTrack[] = ['new_packages', 'current_system', 'roadmap'];
const designLabOverviewPanelIds: DesignLabOverviewPanelId[] = ['release', 'adoption', 'migration', 'visual', 'theme', 'recipes'];
const designLabRecipeOverviewPanelIds: DesignLabRecipeOverviewPanelId[] = ['summary', 'coverage', 'flow', 'dependencies'];
const designLabPageOverviewPanelIds: DesignLabPageOverviewPanelId[] = ['summary', 'regions', 'adoption', 'gallery'];
const designLabComponentApiPanelIds: DesignLabComponentApiPanelId[] = ['contract', 'model', 'props', 'usage'];
const designLabRecipeApiPanelIds: DesignLabRecipeApiPanelId[] = ['contract', 'binding', 'usage'];
const designLabPageApiPanelIds: DesignLabPageApiPanelId[] = ['contract', 'regions', 'dependencies'];
const designLabComponentQualityPanelIds: DesignLabComponentQualityPanelId[] = ['gates', 'usage', 'governance', 'benchmark', 'contracts'];
const designLabRecipeQualityPanelIds: DesignLabRecipeQualityPanelId[] = ['gates', 'lifecycle', 'governance', 'benchmark', 'contracts'];
const designLabPageQualityPanelIds: DesignLabPageQualityPanelId[] = ['gates', 'readiness', 'governance', 'benchmark', 'contracts'];
const designLabFoundationOverviewPanelIds: DesignLabFoundationOverviewPanelId[] = ['summary', 'tokens', 'contracts'];
const designLabFoundationApiPanelIds: DesignLabFoundationApiPanelId[] = ['runtime', 'schema', 'consumption'];
const designLabFoundationQualityPanelIds: DesignLabFoundationQualityPanelId[] = ['gates', 'coverage', 'a11y', 'governance', 'benchmark', 'contracts'];
const designLabEcosystemOverviewPanelIds: DesignLabEcosystemOverviewPanelId[] = ['summary', 'surfaces', 'tiers'];
const designLabEcosystemApiPanelIds: DesignLabEcosystemApiPanelId[] = ['contract', 'integration', 'usage'];
const designLabEcosystemQualityPanelIds: DesignLabEcosystemQualityPanelId[] = ['gates', 'enterprise_readiness', 'governance', 'benchmark', 'contracts'];
const isSameTreeSelection = (
  left: LibraryProductTreeSelection | null | undefined,
  right: LibraryProductTreeSelection | null | undefined,
) =>
  (left?.trackId ?? null) === (right?.trackId ?? null) &&
  (left?.groupId ?? null) === (right?.groupId ?? null) &&
  (left?.subgroupId ?? null) === (right?.subgroupId ?? null) &&
  (left?.itemId ?? null) === (right?.itemId ?? null);

const isOneOf = <T extends string>(value: string | null, candidates: readonly T[]): value is T =>
  Boolean(value && candidates.includes(value as T));

const resolveTrackId = (trackId: string | null | undefined, fallback: DesignLabTrack): DesignLabTrack =>
  isOneOf(trackId ?? null, designLabTrackIds) ? (trackId as DesignLabTrack) : fallback;

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
    upgradeRecipes?: {
      contractId: string;
      contractPath: string;
      artifactPath: string;
      auditArtifactPath: string;
      candidateMode: string;
      auditScript: string;
      summary: {
        totalRecipes: number;
        singleAppRecipes: number;
        codemodCandidateCount: number;
        dryRunReadyCandidates: number;
        manualOnlyRecipes: number;
      };
      items: Array<{
        recipeId: string;
        component: string;
        consumerApp: string;
        classId: string;
        semver: string;
        ownerHandles: string[];
        targetFiles: string[];
        importStatement: string;
        apiFocusProps: string[];
        previewFocus: string[];
        regressionFocus: string[];
        automation: {
          mode: string;
          status: string;
          strategyId: string;
          auditScript: string;
          candidateScriptPath: string;
          targetFileCount: number;
          autoApplyReady: boolean;
          confidence: string;
        };
        steps: string[];
        manualChecklistRef: string;
        evidenceRefs: string[];
      }>;
      rules: string[];
      evidenceRefs: string[];
    };
    codemodCandidates?: {
      contractId: string;
      contractPath: string;
      artifactPath: string;
      auditArtifactPath: string;
      auditScript: string;
      transformEngine: string;
      applyPolicy: string;
      summary: {
        totalCandidates: number;
        dryRunReadyCandidates: number;
        applyExecutorReadyCandidates: number;
        manualReviewFirstCandidates: number;
        autoApplyReadyCandidates: number;
        lowRiskCount: number;
        mediumRiskCount: number;
        highRiskCount: number;
      };
      dryRun?: {
        contractId: string;
        contractPath: string;
        artifactPath: string;
        auditArtifactPath: string;
        runScript: string;
        auditScript: string;
        executionMode: string;
        summary: {
          focusCount: number;
          lowRiskFocusCount: number;
          prototypeReadyFocusCount: number;
          activeCandidateCount: number;
        };
        focusComponents: string[];
        rules: string[];
        evidenceRefs: string[];
        applyPreview?: {
          contractId: string;
          contractPath: string;
          artifactPath: string;
          auditArtifactPath: string;
          runScript: string;
          auditScript: string;
          defaultWriteMode: string;
          allowWriteFlag: string;
          summary: {
            focusCount: number;
            exactEligibleCandidateCount: number;
            noopReadyCandidateCount: number;
            writeEnabledByDefault: boolean;
          };
          focusComponents: string[];
          rules: string[];
          evidenceRefs: string[];
        };
      };
      applyExecutor?: {
        contractId: string;
        contractPath: string;
        artifactPath: string;
        auditArtifactPath: string;
        runScript: string;
        auditScript: string;
        defaultWriteMode: string;
        allowWriteFlag: string;
        summary: {
          focusCount: number;
          readyToApplyCandidateCount: number;
          noopReadyCandidateCount: number;
          writeEnabledByDefault: boolean;
        };
        focusComponents: string[];
        rules: string[];
        evidenceRefs: string[];
      };
      manualReview?: {
        contractId: string;
        contractPath: string;
        artifactPath: string;
        auditArtifactPath: string;
        runScript: string;
        auditScript: string;
        reviewMode: string;
        reviewWriteEnabled: boolean;
        approvalModel: string;
        decisionStateDefault: string;
        summary: {
          focusCount: number;
          mediumRiskFocusCount: number;
          highRiskFocusCount: number;
          readyPacketCount: number;
          readyForDecisionCount: number;
          pendingDecisionCount: number;
          singleOwnerApprovalCount: number;
          generatedChecklistItemCount: number;
        };
        focusComponents: string[];
        decisions?: {
          contractId: string;
          contractPath: string;
          artifactPath: string;
          auditArtifactPath: string;
          runScript: string;
          auditScript: string;
          decisionMode: string;
          allowedDecisions: string[];
          summary: {
            focusCount: number;
            recordedDecisionCount: number;
            approvedForApplyPreviewCount: number;
            deferredUntilVisualReviewCount: number;
            reviewOnlyManualRefactorCount: number;
            rejectedForAutoApplyCount: number;
            pendingDecisionCount: number;
          };
          focusComponents: string[];
          rules: string[];
          evidenceRefs: string[];
        };
        rules: string[];
        evidenceRefs: string[];
      };
      prototypes?: {
        contractId: string;
        contractPath: string;
        sourceDir: string;
        artifactPath: string;
        auditArtifactPath: string;
        auditScript: string;
        summary: {
          prototypeCount: number;
          readyCount: number;
          missingCount: number;
          illustrativePreviewCount: number;
        };
        items: Array<{
          candidateId: string;
          component: string;
          consumerApp: string;
          transformKind: string;
          riskLevel: string;
          prototypeStatus: string;
          prototypeReviewMode: string;
          prototypePath: string;
          prototypeSourcePath: string;
          rewriteRule: string;
        }>;
        rules: string[];
        evidenceRefs: string[];
      };
      items: Array<{
        candidateId: string;
        component: string;
        consumerApp: string;
        classId: string;
        semver: string;
        ownerHandles: string[];
        transformEngine: string;
        transformKind: string;
        strategyId: string;
        riskLevel: string;
        riskReasons: string[];
        blockers: string[];
        targetFiles: string[];
        estimatedTouchPoints: number;
        dryRunCommand: string;
        candidateScriptPath: string;
        dryRunIncluded?: boolean;
        applyExecutorIncluded?: boolean;
        applyExecutorCommand?: string;
        manualReviewIncluded?: boolean;
        manualReviewCommand?: string;
        manualReviewDecisionIncluded?: boolean;
        manualReviewDecisionCommand?: string;
        manualReviewDecisionState?: string;
        manualReviewDecisionRationale?: string;
        manualReviewDecisionNextStep?: string;
        dryRunScope: {
          targetFileCount: number;
          requiredAnySignals: string[];
          optionalSignals: string[];
          minRequiredMatches: number;
          ownerMapped: boolean;
        };
        matchSelectors: string[];
        apiFocusProps: string[];
        previewFocus: string[];
        regressionFocus: string[];
        steps: string[];
        manualChecklistRef: string;
        upgradeRecipeRef: string;
        applyReady: boolean;
        confidence: string;
        prototypePath: string;
        prototypeSourcePath: string;
        prototypeStatus: string;
        prototypeReviewMode: string;
        rewriteRule: string;
        rewritePreview: {
          kind: string;
          before: string;
          after: string;
        };
        matchStrategy: {
          requiredSelectors: string[];
          dryRunSignals: string[];
          astTargets: string[];
          stopConditions: string[];
        };
        manualValidation: {
          storybook: string[];
          designLab: string[];
          smoke: string[];
        };
        rollbackPlan: string[];
        prototypeNotes: string[];
        evidenceRefs: string[];
      }>;
      rules: string[];
      evidenceRefs: string[];
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
      title?: string;
      clusterTitle?: string;
      clusterDescription?: string;
      ownerBlocks: string[];
      intent: string;
    }>;
    plannedFamilies: string[];
    rules: string[];
    successCriteria: string[];
  };
  items: DesignLabIndexItem[];
};

type DesignLabRecipeFamily = NonNullable<DesignLabIndex['recipes']>['currentFamilies'][number];

type DesignLabTaxonomyGroup = {
  id: string;
  title: string;
  subgroups: string[];
};

type DesignLabTaxonomySection = {
  id: string;
  title: string;
  description?: string;
  groupIds: string[];
};

type DesignLabTaxonomy = {
  version: string;
  defaults: {
    showEmptyGroups: boolean;
    showEmptySubgroups: boolean;
    defaultView: string;
    defaultSection?: string;
    advancedToggleLabel: string;
  };
  sections: DesignLabTaxonomySection[];
  groups: DesignLabTaxonomyGroup[];
};

const designLabIndex = {
  ...(designLabGeneratedMetaRaw as Partial<DesignLabIndex>),
  ...(designLabIndexRaw as DesignLabIndex),
  items: designLabIndexItems as DesignLabIndexItem[],
} as DesignLabIndex;
const designLabTaxonomy = designLabTaxonomyRaw as DesignLabTaxonomy;
const designLabTaxonomySectionIds = designLabTaxonomy.sections.map((section) => section.id);
const designLabTaxonomySectionMap = new Map(designLabTaxonomy.sections.map((section) => [section.id, section] as const));
const designLabTaxonomyGroupMap = new Map(designLabTaxonomy.groups.map((group) => [group.id, group] as const));
const designLabTaxonomyGroupSectionMap = new Map(
  designLabTaxonomy.sections.flatMap((section) =>
    section.groupIds.map((groupId) => [groupId, section.id] as const),
  ),
);
const designLabRecipePrimarySectionById: Record<string, DesignLabTaxonomySection['id']> = {
  search_filter_listing: 'recipes',
  detail_summary: 'recipes',
  dashboard_template: 'pages',
  crud_template: 'pages',
  detail_template: 'pages',
  approval_review: 'recipes',
  empty_error_loading: 'recipes',
  ai_guided_authoring: 'recipes',
  command_workspace: 'pages',
  settings_template: 'pages',
  app_header: 'recipes',
  navigation_menu: 'recipes',
  search_command_header: 'recipes',
  action_header: 'recipes',
  desktop_menubar: 'recipes',
};
type DesignLabFoundationFamilyProfile = {
  title: string;
  description: string;
  benchmark: string;
  badges: string[];
};

const buildFoundationFamilyProfiles = (
  t: DesignLabTranslate,
): Record<string, DesignLabFoundationFamilyProfile> => ({
  theme_tokens: {
    title: t('designlab.foundationFamily.theme_tokens.title'),
    description: t('designlab.foundationFamily.theme_tokens.description'),
    benchmark: t('designlab.foundationFamily.theme_tokens.benchmark'),
    badges: [
      t('designlab.foundationFamily.theme_tokens.badges.theme'),
      t('designlab.foundationFamily.theme_tokens.badges.tokens'),
      t('designlab.foundationFamily.theme_tokens.badges.appearance'),
    ],
  },
  a11y_i18n: {
    title: t('designlab.foundationFamily.a11y_i18n.title'),
    description: t('designlab.foundationFamily.a11y_i18n.description'),
    benchmark: t('designlab.foundationFamily.a11y_i18n.benchmark'),
    badges: [
      t('designlab.foundationFamily.a11y_i18n.badges.a11y'),
      t('designlab.foundationFamily.a11y_i18n.badges.i18n'),
      t('designlab.foundationFamily.a11y_i18n.badges.locale'),
    ],
  },
  dev_diagnostics: {
    title: t('designlab.foundationFamily.dev_diagnostics.title'),
    description: t('designlab.foundationFamily.dev_diagnostics.description'),
    benchmark: t('designlab.foundationFamily.dev_diagnostics.benchmark'),
    badges: [
      t('designlab.foundationFamily.dev_diagnostics.badges.qa'),
      t('designlab.foundationFamily.dev_diagnostics.badges.diagnostics'),
      t('designlab.foundationFamily.dev_diagnostics.badges.release'),
    ],
  },
  runtime_utilities: {
    title: t('designlab.foundationFamily.runtime_utilities.title'),
    description: t('designlab.foundationFamily.runtime_utilities.description'),
    benchmark: t('designlab.foundationFamily.runtime_utilities.benchmark'),
    badges: [
      t('designlab.foundationFamily.runtime_utilities.badges.hooks'),
      t('designlab.foundationFamily.runtime_utilities.badges.utilities'),
      t('designlab.foundationFamily.runtime_utilities.badges.runtime'),
    ],
  },
});
const designLabIndexItemMap = new Map(designLabIndex.items.map((item) => [item.name, item] as const));
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

const buildUsageRecipes = (
  item: DesignLabIndexItem,
  apiItem: DesignLabApiItem | null | undefined,
  t: DesignLabTranslate,
  trackMeta: Record<DesignLabTrack, { label: string; note: string }>,
) => {
  const importStatement = item.importStatement || `import { ${item.name} } from '@mfe/design-system';`;
  const requiredProps = (apiItem?.props ?? []).filter((prop) => prop.required);
  const exampleProps = requiredProps.slice(0, 2);
  const openTagProps = exampleProps
    .map((prop) => `  ${prop.name}=${buildUsagePropValue(prop)}`)
    .join('\n');
  const basicCode = `${importStatement}\n\nexport function Example() {\n  return (\n    <${item.name}${openTagProps ? `\n${openTagProps}` : ''}${exampleProps.some((prop) => prop.name === 'children') ? '' : ''}\n    />\n  );\n}`;

  const recipes: Array<{ title: string; description: string; code: string; badges?: React.ReactNode }> = [
    {
      title: t('designlab.usageRecipes.basic.title'),
      description: t('designlab.usageRecipes.basic.description'),
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
      title: t('designlab.usageRecipes.controlled.title'),
      description: t('designlab.usageRecipes.controlled.description'),
      code: controlledCode.replace(/\n\s*\n\s*\n/g, '\n\n'),
      badges: <SectionBadge label="Controlled" />,
    });
  }

  recipes.push({
    title: t('designlab.usageRecipes.governed.title'),
    description: t('designlab.usageRecipes.governed.description'),
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
    (family) => family.ownerBlocks.includes(item.name) || family.recipeId === recipeLikeId,
  );
};

const toTestIdSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const buildTrackMeta = (t: DesignLabTranslate): Record<DesignLabTrack, { label: string; note: string }> => ({
  new_packages: {
    label: t('designlab.track.newPackages.label'),
    note: t('designlab.track.newPackages.note'),
  },
  current_system: {
    label: t('designlab.track.currentSystem.label'),
    note: t('designlab.track.currentSystem.note'),
  },
  roadmap: {
    label: t('designlab.track.roadmap.label'),
    note: t('designlab.track.roadmap.note'),
  },
});

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

const lensSurfaceMeta: Record<
  'foundations' | 'components' | 'recipes' | 'pages',
  {
    accentClass: string;
    borderClass: string;
    surfaceClass: string;
    glowClass: string;
  }
> = {
  foundations: {
    accentClass: 'bg-state-warning-border',
    borderClass: 'border-state-warning-border',
    surfaceClass: 'bg-state-warning-surface',
    glowClass: 'shadow-[0_12px_32px_rgba(174,124,0,0.12)]',
  },
  components: {
    accentClass: 'bg-action-primary',
    borderClass: 'border-action-primary-border',
    surfaceClass: 'bg-surface-panel',
    glowClass: 'shadow-[0_12px_32px_rgba(33,79,255,0.10)]',
  },
  recipes: {
    accentClass: 'bg-state-success-border',
    borderClass: 'border-state-success-border',
    surfaceClass: 'bg-state-success-surface',
    glowClass: 'shadow-[0_12px_32px_rgba(31,138,74,0.10)]',
  },
  pages: {
    accentClass: 'bg-state-info-border',
    borderClass: 'border-state-info-border',
    surfaceClass: 'bg-state-info-surface',
    glowClass: 'shadow-[0_12px_32px_rgba(44,112,214,0.10)]',
  },
};

const isMissingTranslationValue = (value: string | null | undefined): boolean =>
  typeof value === 'string' && value.startsWith('designlab.taxonomy.sections.');

const getRecipeClusterReason = (
  clusterTitle: string,
  clusterDescription?: string,
): string => {
  const normalized = clusterTitle.toLowerCase();
  if (normalized.includes('search')) {
    return 'Arama, filtre ve listeleme kaliplarini tek bir workflow ailesinde toplar.';
  }
  if (normalized.includes('review') || normalized.includes('approval')) {
    return 'Inceleme, karar ve onay ritmini ayni ekip diliyle tekrar kullanilabilir hale getirir.';
  }
  if (normalized.includes('state') || normalized.includes('feedback')) {
    return 'Bos, yukleniyor, hata ve basari gibi durum yuzeylerini ortak bir deneyim diline baglar.';
  }
  if (normalized.includes('ai')) {
    return 'AI destekli akislar icin prompt, sonuc ve kontrol yuzeylerini tek yerde toplar.';
  }
  if (normalized.includes('analytics')) {
    return 'Analitik agirlikli sayfa iskeletlerini hizli secmek icin template gruplarini ayirir.';
  }
  if (normalized.includes('operational')) {
    return 'Gunluk operasyon ekranlarini ayni shell karar seti etrafinda toplar.';
  }
  if (normalized.includes('configuration')) {
    return 'Ayar, guardrail ve policy sayfalarini daha sakin bir template ailesine toplar.';
  }
  return clusterDescription ?? 'Tekrarlanan urun akislarini secilebilir bir recipe ailesine cevirir.';
};

const getRecipeProblemSignal = (
  clusterTitle: string,
  isPageCluster = false,
): string => {
  const normalized = clusterTitle.toLowerCase();
  if (normalized.includes('search')) {
    return 'Ara, filtrele, karsilastir';
  }
  if (normalized.includes('review') || normalized.includes('approval')) {
    return 'Incele, karar ver, onayla';
  }
  if (normalized.includes('state') || normalized.includes('feedback')) {
    return 'Durumu acik ve sakin aktar';
  }
  if (normalized.includes('ai')) {
    return 'Yonlendir, dogrula, eyleme gec';
  }
  if (normalized.includes('analytics')) {
    return 'Sagligi oku, hizlica aksiyon al';
  }
  if (normalized.includes('operational')) {
    return isPageCluster ? 'Calis, incele, sonucu bagla' : 'Gunluk operasyonu tek ritimde yonet';
  }
  if (normalized.includes('configuration') || normalized.includes('settings')) {
    return 'Ayarla, koru, gozden gecir';
  }
  return isPageCluster ? 'Dogru sayfa iskeletini hizlica sec' : 'Tekrarlanan urun problemini recipe ile coz';
};

const getRecipeFamilySignal = (
  recipe: Pick<DesignLabRecipeFamily, 'recipeId' | 'title' | 'clusterTitle'>,
): string => {
  const normalized = `${recipe.recipeId} ${recipe.title ?? ''} ${recipe.clusterTitle ?? ''}`.toLowerCase();
  if (normalized.includes('dashboard')) {
    return 'KPI ve karar ritmi';
  }
  if (normalized.includes('crud')) {
    return 'Listele, filtrele, guncelle';
  }
  if (normalized.includes('detail')) {
    return 'Detayi ac, baglami topla';
  }
  if (normalized.includes('command') || normalized.includes('workspace')) {
    return 'Ara, calistir, sonucu bagla';
  }
  if (normalized.includes('settings') || normalized.includes('configuration')) {
    return 'Ayar ve guardrail akisi';
  }
  if (normalized.includes('search')) {
    return 'Ara ve listele';
  }
  if (normalized.includes('approval') || normalized.includes('review')) {
    return 'Incele ve karar ver';
  }
  if (normalized.includes('empty') || normalized.includes('error') || normalized.includes('loading')) {
    return 'Durum dilini standardize et';
  }
  if (normalized.includes('ai')) {
    return 'Yaz, yonlendir, dogrula';
  }
  return getRecipeProblemSignal(recipe.clusterTitle ?? recipe.title ?? recipe.recipeId);
};

const getRecipeOutcomeSignal = (
  clusterTitle: string,
  isPageCluster = false,
): string => {
  const normalized = clusterTitle.toLowerCase();
  if (normalized.includes('search')) {
    return 'Arama ve filtreleme karar yukunu azaltir.';
  }
  if (normalized.includes('review') || normalized.includes('approval')) {
    return 'Inceleme ve onay hizi tek bir ekip ritmine oturur.';
  }
  if (normalized.includes('state') || normalized.includes('feedback')) {
    return 'Bos, hata ve loading dili daha sakin ve tutarli kalir.';
  }
  if (normalized.includes('ai')) {
    return 'AI yardimli akislarda handoff ve guven sinyali netlesir.';
  }
  if (normalized.includes('analytics')) {
    return 'Dashboard ekipleri ayni KPI iskeletiyle daha hizli baslar.';
  }
  if (normalized.includes('operational')) {
    return isPageCluster
      ? 'Operasyon ekipleri dogru page shell ile daha hizli ilerler.'
      : 'Gunluk operasyon akislari ayni shell kararlarini tekrar kullanir.';
  }
  if (normalized.includes('configuration') || normalized.includes('settings')) {
    return 'Ayar ve policy ekranlari daha guvenli bir ritimde kalir.';
  }
  return isPageCluster
    ? 'Sayfa ekipleri uygun template ile daha hizli baslangic alir.'
    : 'Recipe ailesi ayni urun problemini tekrar cozmeyi kolaylastirir.';
};

const getRecipeUseWhen = (
  clusterTitle: string,
): string => {
  const normalized = clusterTitle.toLowerCase();
  if (normalized.includes('search')) {
    return 'Arama, filtre ve listing ayni sayfada toplaniyorsa.';
  }
  if (normalized.includes('review') || normalized.includes('approval')) {
    return 'Karar, onay ve inspector ritmi agirlikli akislarda.';
  }
  if (normalized.includes('state') || normalized.includes('feedback')) {
    return 'Bos, hata veya loading dili urun genelinde tutarli kalacaksa.';
  }
  if (normalized.includes('ai')) {
    return 'Prompt, sonuc ve guven sinyali ayni akis icinde kurulacaksa.';
  }
  return 'Ayni urun problemi birden fazla ekipte tekrar ediyorsa.';
};

const getRecipeAvoidWhen = (
  clusterTitle: string,
): string => {
  const normalized = clusterTitle.toLowerCase();
  if (normalized.includes('search')) {
    return 'Tek adimli, filtre gerektirmeyen kucuk yuzeylerde.';
  }
  if (normalized.includes('review') || normalized.includes('approval')) {
    return 'Yalniz bilgi gosteren, karar almayan detay ekranlarinda.';
  }
  if (normalized.includes('state') || normalized.includes('feedback')) {
    return 'Tek bir local state icin agir workflow kabugu gerekmiyorsa.';
  }
  if (normalized.includes('ai')) {
    return 'AI yardimi olmayan basit form veya tablo yuzeylerinde.';
  }
  return 'Tek seferlik, tekrar etmeyecek ozel ekranlarda.';
};

const getRecipeFamilyOutcome = (
  recipe: Pick<DesignLabRecipeFamily, 'recipeId' | 'title' | 'clusterTitle'>,
): string => {
  const normalized = `${recipe.recipeId} ${recipe.title ?? ''} ${recipe.clusterTitle ?? ''}`.toLowerCase();
  if (normalized.includes('dashboard')) {
    return 'Karar panelleri ayni KPI omurgasina oturur.';
  }
  if (normalized.includes('crud')) {
    return 'Listeleme ve aksiyon sayfalari daha hizli kurulur.';
  }
  if (normalized.includes('detail')) {
    return 'Detay ve inspector kurgusu daha hizli tekrar edilir.';
  }
  if (normalized.includes('command') || normalized.includes('workspace')) {
    return 'Search-first operasyon yuzeyi tek template ile kurulur.';
  }
  if (normalized.includes('settings') || normalized.includes('configuration')) {
    return 'Ayar ekranlari guardrail odakli bir kabukla gelir.';
  }
  return getRecipeOutcomeSignal(recipe.clusterTitle ?? recipe.title ?? recipe.recipeId, true);
};

const getLensOverviewSilhouette = (key: string) => {
  const normalized = key.toLowerCase();
  if (normalized.includes('analytics') || normalized.includes('dashboard')) {
    return 'dashboard';
  }
  if (normalized.includes('operational') || normalized.includes('listing') || normalized.includes('search')) {
    return 'list';
  }
  if (normalized.includes('configuration') || normalized.includes('settings')) {
    return 'settings';
  }
  if (normalized.includes('command') || normalized.includes('workspace') || normalized.includes('ai')) {
    return 'workspace';
  }
  if (normalized.includes('detail') || normalized.includes('review')) {
    return 'detail';
  }
  return 'catalog';
};

const getFamilyRailMarkerVariant = (key: string) => {
  const normalized = key.toLowerCase();
  if (normalized.includes('navigation') || normalized.includes('menu') || normalized.includes('rail')) {
    return 'navigation';
  }
  if (normalized.includes('action') || normalized.includes('button') || normalized.includes('trigger')) {
    return 'actions';
  }
  if (normalized.includes('data') || normalized.includes('table') || normalized.includes('grid')) {
    return 'data';
  }
  if (normalized.includes('feedback') || normalized.includes('status') || normalized.includes('toast')) {
    return 'feedback';
  }
  if (normalized.includes('input') || normalized.includes('select') || normalized.includes('form')) {
    return 'forms';
  }
  return 'catalog';
};

const getFamilyRailMarkerLabel = (variant: string) => {
  switch (variant) {
    case 'navigation':
      return 'Nav';
    case 'actions':
      return 'Act';
    case 'data':
      return 'Data';
    case 'feedback':
      return 'UX';
    case 'forms':
      return 'Form';
    default:
      return 'Core';
  }
};

const getWhyThisFamilyCopy = (key: string) => {
  const normalized = key.toLowerCase();
  if (normalized.includes('navigation') || normalized.includes('menu') || normalized.includes('rail')) {
    return 'Navigasyon odakli akislarda rota tutarliligi, sayfa baglamini kaybetmeden yonetimi hizlandirir.';
  }
  if (normalized.includes('action') || normalized.includes('button') || normalized.includes('trigger')) {
    return 'Eylem odaikli ekranlarda karar noktalarini birikimli sunumla hizli yakalamak icin uygun.';
  }
  if (normalized.includes('data') || normalized.includes('table') || normalized.includes('grid')) {
    return 'Veri odakli akislarda gozden gecirme maliyetini azaltan liste ve satir patternleri toplar.';
  }
  if (normalized.includes('feedback') || normalized.includes('status') || normalized.includes('toast')) {
    return 'Durum, uyari ve geri bildirim patternlerini standart bir tonla birlikte yönetir.';
  }
  if (normalized.includes('input') || normalized.includes('select') || normalized.includes('form')) {
    return 'Form ve veri alma akislari icin formik/validation davranislariyla birlikte hizli tasnif saglar.';
  }
  return 'Bu aile, benzer urun kararlarını ortak bir davranis diliyle birlestirerek daha hizli ilerlemeye yardim eder.';
};

const getTemplateSwitchReason = (
  recipe: Pick<DesignLabRecipeFamily, 'recipeId' | 'title' | 'clusterTitle'>,
): string => {
  const normalized = `${recipe.recipeId} ${recipe.title ?? ''} ${recipe.clusterTitle ?? ''}`.toLowerCase();
  if (normalized.includes('dashboard')) {
    return 'KPI ve karar ritmini one cikarir.';
  }
  if (normalized.includes('crud')) {
    return 'Liste, filtre ve satir aksiyonlarini agirliklandirir.';
  }
  if (normalized.includes('detail')) {
    return 'Detay, inspector ve baglam toplama ritmine gecer.';
  }
  if (normalized.includes('command') || normalized.includes('workspace')) {
    return 'Search-first calisma yuzeyini one alir.';
  }
  if (normalized.includes('settings') || normalized.includes('configuration')) {
    return 'Guardrail ve ayar denetimini sakinlestirir.';
  }
  if (normalized.includes('analytics')) {
    return 'Analitik okumayi ve KPI taramasini hizlandirir.';
  }
  if (normalized.includes('operational')) {
    return 'Gunluk operasyon akisini daha net bir shell ile toplar.';
  }
  return 'Ayni cluster icinde farkli bir sayfa ritmine gecis saglar.';
};

const getTemplateTransitionTags = (recipe: Pick<DesignLabRecipeFamily, 'recipeId' | 'title' | 'clusterTitle'>) => {
  const normalized = `${recipe.recipeId} ${recipe.title ?? ''} ${recipe.clusterTitle ?? ''}`.toLowerCase();
  const tags = new Set<string>(['lighter']);

  if (normalized.includes('table') || normalized.includes('grid') || normalized.includes('listing') || normalized.includes('catalog')) {
    tags.delete('lighter');
    tags.add('denser');
  }
  if (normalized.includes('search') || normalized.includes('filter') || normalized.includes('lookup')) {
    tags.add('search-first');
  }
  if (normalized.includes('review') || normalized.includes('approval') || normalized.includes('decision') || normalized.includes('workflow')) {
    tags.add('review-first');
  }

  const ordered = ['lighter', 'denser', 'search-first', 'review-first'];
  return ordered.filter((tag) => tags.has(tag));
};

const DesignLabPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, formatDate, formatNumber } = useDesignLabI18n();
  const trackMeta = useMemo(() => buildTrackMeta(t), [t]);
  const componentPreviewPanelItems = useMemo(
    () => getDesignLabPreviewPanelItems('components', t),
    [t],
  );
  const recipePreviewPanelItems = useMemo(
    () => getDesignLabPreviewPanelItems('recipes', t),
    [t],
  );
  const foundationFamilyProfiles = useMemo(
    () => buildFoundationFamilyProfiles(t),
    [t],
  );
  const taxonomySectionPresentationMap = useMemo(
    () =>
      new Map(
        designLabTaxonomy.sections.map((section) => [
          section.id,
          {
            title: t(`designlab.taxonomy.sections.${section.id}.title`),
            description: t(`designlab.taxonomy.sections.${section.id}.description`),
          },
        ]),
      ),
    [t],
  );
  const getTaxonomySectionTitle = React.useCallback(
    (sectionId: string, fallbackTitle: string) =>
      isMissingTranslationValue(taxonomySectionPresentationMap.get(sectionId)?.title)
        ? fallbackTitle
        : taxonomySectionPresentationMap.get(sectionId)?.title
          ?? fallbackTitle,
    [taxonomySectionPresentationMap],
  );
  const getTaxonomySectionDescription = React.useCallback(
    (sectionId: string, fallbackDescription?: string | null) =>
      isMissingTranslationValue(taxonomySectionPresentationMap.get(sectionId)?.description)
        ? fallbackDescription ?? null
        : taxonomySectionPresentationMap.get(sectionId)?.description
          ?? fallbackDescription
          ?? null,
    [taxonomySectionPresentationMap],
  );
  const [query, setQuery] = useState('');
  const [familyQuery, setFamilyQuery] = useState('');
  const [detailTab, setDetailTab] = useState<DesignLabDetailTab>('demo');
  const [activeOverviewPanel, setActiveOverviewPanel] = useState<DesignLabOverviewPanelId>('release');
  const [activeRecipeOverviewPanel, setActiveRecipeOverviewPanel] = useState<DesignLabRecipeOverviewPanelId>('summary');
  const [activePageOverviewPanel, setActivePageOverviewPanel] = useState<DesignLabPageOverviewPanelId>('summary');
  const [activeComponentApiPanel, setActiveComponentApiPanel] = useState<DesignLabComponentApiPanelId>('contract');
  const [activeRecipeApiPanel, setActiveRecipeApiPanel] = useState<DesignLabRecipeApiPanelId>('contract');
  const [activePageApiPanel, setActivePageApiPanel] = useState<DesignLabPageApiPanelId>('contract');
  const [activeComponentQualityPanel, setActiveComponentQualityPanel] = useState<DesignLabComponentQualityPanelId>('gates');
  const [activeRecipeQualityPanel, setActiveRecipeQualityPanel] = useState<DesignLabRecipeQualityPanelId>('gates');
  const [activePageQualityPanel, setActivePageQualityPanel] = useState<DesignLabPageQualityPanelId>('gates');
  const [activeFoundationOverviewPanel, setActiveFoundationOverviewPanel] = useState<DesignLabFoundationOverviewPanelId>('summary');
  const [activeFoundationApiPanel, setActiveFoundationApiPanel] = useState<DesignLabFoundationApiPanelId>('runtime');
  const [activeFoundationQualityPanel, setActiveFoundationQualityPanel] = useState<DesignLabFoundationQualityPanelId>('gates');
  const [activeEcosystemOverviewPanel, setActiveEcosystemOverviewPanel] = useState<DesignLabEcosystemOverviewPanelId>('summary');
  const [activeEcosystemApiPanel, setActiveEcosystemApiPanel] = useState<DesignLabEcosystemApiPanelId>('contract');
  const [activeEcosystemQualityPanel, setActiveEcosystemQualityPanel] = useState<DesignLabEcosystemQualityPanelId>('gates');
  const [activeComponentPreviewPanel, setActiveComponentPreviewPanel] = useState<DesignLabPreviewPanelId>('live');
  const [activeRecipePreviewPanel, setActiveRecipePreviewPanel] = useState<DesignLabPreviewPanelId>('live');
  const [activePagePreviewPanel, setActivePagePreviewPanel] = useState<DesignLabPreviewPanelId>('live');
  const defaultTaxonomySectionId =
    designLabTaxonomy.defaults.defaultSection ?? designLabTaxonomy.sections[0]?.id ?? 'components';
  const [workspaceModeState, setWorkspaceMode] = useState<DesignLabWorkspaceMode>(
    resolveWorkspaceModeForSection(defaultTaxonomySectionId),
  );
  const [activeTaxonomySectionId, setActiveTaxonomySectionId] = useState<string>(defaultTaxonomySectionId);
  const [legacyAdapterOriginSectionId, setLegacyAdapterOriginSectionId] = useState<string | null>(null);
  const legacyAliasTelemetryFingerprintRef = React.useRef<string | null>(null);
  const [urlStateHydrated, setUrlStateHydrated] = useState(false);
  const [treeSelection, setTreeSelection] = useState<LibraryProductTreeSelection>({
    trackId: 'new_packages',
    groupId: 'navigation',
    subgroupId: 'Anchor / Table of contents',
    itemId: 'AnchorToc',
  });
  const [familySelectionState, setFamilySelectionState] = useState<DesignLabFamilySelectionState>({
    recipes: designLabIndex.recipes?.currentFamilies[0]?.recipeId ?? null,
    pages: null,
  });
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [readonlyFormDrawerOpen, setReadonlyFormDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const formFieldSeed = useMemo(
    () => ({
      textInput: t('designlab.seed.formField.textInput'),
      searchInput: t('designlab.seed.formField.searchInput'),
      textArea: t('designlab.seed.formField.textArea'),
      comment: t('designlab.seed.formField.comment'),
    }),
    [t],
  );
  const [selectValue, setSelectValue] = useState('comfortable');
  const [textInputValue, setTextInputValue] = useState(formFieldSeed.textInput);
  const [searchInputValue, setSearchInputValue] = useState(formFieldSeed.searchInput);
  const [inviteInputValue, setInviteInputValue] = useState('ops@nova.io');
  const [textAreaValue, setTextAreaValue] = useState(formFieldSeed.textArea);
  const [commentValue, setCommentValue] = useState(formFieldSeed.comment);
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
  const promptSeed = useMemo(
    () => ({
      subject: t('designlab.seed.prompt.subject'),
      body: t('designlab.seed.prompt.body'),
    }),
    [t],
  );
  const setRecipeSelectionId = React.useCallback((selectionId: string | null) => {
    setFamilySelectionState((current) =>
      applyFamilySelection(current, {
        selectionKind: 'recipes',
        selectionId,
      }),
    );
  }, []);
  const setPageSelectionId = React.useCallback((selectionId: string | null) => {
    setFamilySelectionState((current) =>
      applyFamilySelection(current, {
        selectionKind: 'pages',
        selectionId,
      }),
    );
  }, []);
  const reportStatusSeed = useMemo(
    () => ({
      idle: t('designlab.seed.reportStatus.idle'),
      applied: t('designlab.seed.reportStatus.applied'),
      reset: t('designlab.seed.reportStatus.reset'),
    }),
    [t],
  );
  const dropdownActionSeed = useMemo(() => t('designlab.seed.dropdownAction.empty'), [t]);
  const contextMenuActionSeed = useMemo(() => t('designlab.seed.contextMenuAction.empty'), [t]);
  const [promptSubject, setPromptSubject] = useState(promptSeed.subject);
  const [promptBody, setPromptBody] = useState(promptSeed.body);
  const [contextMenuAction, setContextMenuAction] = useState(contextMenuActionSeed);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const activePageShellLayerId = useMemo(
    () => resolveDesignLabPageShellLayerId(activeTaxonomySectionId),
    [activeTaxonomySectionId],
  );
  const detailTabMeta = useMemo<Array<{ id: DesignLabDetailTab; label: string; description: string }>>(
    () => resolveDesignLabPageShellDetailTabs(activePageShellLayerId, t),
    [activePageShellLayerId, t],
  );
  const [tourStatus, setTourStatus] = useState<'idle' | 'guided' | 'finished'>('idle');
  const [promptScope, setPromptScope] = useState<'general' | 'approval' | 'policy' | 'release'>('approval');
  const [promptTone, setPromptTone] = useState<'neutral' | 'strict' | 'exploratory'>('strict');
  const legacyAdapterCanonicalizationPendingRef = React.useRef(false);
  const previousPromptSeed = React.useRef(promptSeed);
  const previousReportStatusSeed = React.useRef(reportStatusSeed);
  const previousDropdownActionSeed = React.useRef(dropdownActionSeed);
  const previousContextMenuActionSeed = React.useRef(contextMenuActionSeed);
  const previousFormFieldSeed = React.useRef(formFieldSeed);
  const policyTableRows = useMemo(
    () => [
      {
        policy: t('designlab.showcase.component.tableSimple.live.rows.ethics.policy'),
        owner: t('designlab.showcase.component.tableSimple.live.rows.ethics.owner'),
        status: t('designlab.showcase.component.tableSimple.live.rows.ethics.status'),
        statusTone: 'success' as const,
        updatedAt: '06 Mar 2026',
      },
      {
        policy: t('designlab.showcase.component.tableSimple.live.rows.gifts.policy'),
        owner: t('designlab.showcase.component.tableSimple.live.rows.gifts.owner'),
        status: t('designlab.showcase.component.tableSimple.live.rows.gifts.status'),
        statusTone: 'warning' as const,
        updatedAt: '05 Mar 2026',
      },
      {
        policy: t('designlab.showcase.component.tableSimple.live.rows.conflict.policy'),
        owner: t('designlab.showcase.component.tableSimple.live.rows.conflict.owner'),
        status: t('designlab.showcase.component.tableSimple.live.rows.conflict.status'),
        statusTone: 'info' as const,
        updatedAt: '04 Mar 2026',
      },
    ],
    [t],
  );
  const rolloutDescriptionItems = useMemo(
    () => [
      {
        key: 'owner',
        label: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.label'),
        value: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.value'),
        helper: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.helper'),
      },
      {
        key: 'scope',
        label: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.scope.label'),
        value: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.scope.value'),
        tone: 'info' as const,
        span: 2 as const,
      },
      {
        key: 'status',
        label: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.status.label'),
        value: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.status.value'),
        tone: 'success' as const,
      },
      {
        key: 'review',
        label: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.review.label'),
        value: '07 Mar 2026',
        helper: t('designlab.showcase.component.descriptions.live.rolloutSummary.items.review.helper'),
      },
    ],
    [t],
  );
  const listItems = useMemo(
    () => [
      {
        key: 'triage',
        title: t('designlab.showcase.component.list.live.queue.items.triage.title'),
        description: t('designlab.showcase.component.list.live.queue.items.triage.description'),
        meta: 'P0',
        badges: [t('designlab.showcase.component.list.live.queue.items.triage.badge')],
        tone: 'warning' as const,
      },
      {
        key: 'doctor',
        title: t('designlab.showcase.component.list.live.queue.items.doctor.title'),
        description: t('designlab.showcase.component.list.live.queue.items.doctor.description'),
        meta: 'PASS',
        badges: [t('designlab.showcase.component.list.live.queue.items.doctor.badge')],
        tone: 'success' as const,
      },
      {
        key: 'residual',
        title: t('designlab.showcase.component.list.live.queue.items.residual.title'),
        description: t('designlab.showcase.component.list.live.queue.items.residual.description'),
        meta: 'MEDIUM',
        badges: [t('designlab.showcase.component.list.live.queue.items.residual.badge')],
        tone: 'info' as const,
      },
    ],
    [t],
  );
  const jsonViewerValue = useMemo(
    () => ({
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
          mode: t('designlab.showcase.component.jsonViewer.live.policy.rollout.mode'),
          security: t('designlab.showcase.component.jsonViewer.live.policy.rollout.security'),
        },
        owners: {
          frontend: t('designlab.showcase.component.jsonViewer.live.policy.owners.frontend'),
          governance: t('designlab.showcase.component.jsonViewer.live.policy.owners.governance'),
        },
      },
    }),
    [t],
  );
  const treeNodes = useMemo(
    () => [
      {
        key: 'release',
        label: t('designlab.showcase.component.tree.live.release.label'),
        description: t('designlab.showcase.component.tree.live.release.description'),
        meta: t('designlab.showcase.component.tree.live.release.meta'),
        badges: [t('designlab.showcase.component.tree.live.release.badge')],
        tone: 'info' as const,
        children: [
          {
            key: 'doctor',
            label: t('designlab.showcase.component.tree.live.doctor.label'),
            description: t('designlab.showcase.component.tree.live.doctor.description'),
            meta: 'PASS',
            badges: ['ui-library'],
            tone: 'success' as const,
            children: [
              {
                key: 'doctor-ui-library',
                label: t('designlab.showcase.component.tree.live.doctorUiLibrary.label'),
                description: t('designlab.showcase.component.tree.live.doctorUiLibrary.description'),
                meta: t('designlab.showcase.component.tree.live.doctorUiLibrary.meta'),
              },
              {
                key: 'doctor-shell',
                label: t('designlab.showcase.component.tree.live.doctorShell.label'),
                description: t('designlab.showcase.component.tree.live.doctorShell.description'),
                meta: t('designlab.showcase.component.tree.live.doctorShell.meta'),
              },
            ],
          },
          {
            key: 'security',
            label: t('designlab.showcase.component.tree.live.security.label'),
            description: t('designlab.showcase.component.tree.live.security.description'),
            meta: t('designlab.showcase.component.tree.live.security.meta'),
            badges: [t('designlab.showcase.component.tree.live.security.badge')],
            tone: 'warning' as const,
            children: [
              {
                key: 'security-residual',
                label: t('designlab.showcase.component.tree.live.securityResidual.label'),
                description: t('designlab.showcase.component.tree.live.securityResidual.description'),
                meta: 'Apr-15',
              },
            ],
          },
        ],
      },
    ],
    [t],
  );
  const treeTableNodes = useMemo(
    () => [
      {
        key: 'platform-ui',
        label: t('designlab.showcase.component.treeTable.live.platformUi.label'),
        description: t('designlab.showcase.component.treeTable.live.platformUi.description'),
        meta: t('designlab.showcase.component.treeTable.live.platformUi.meta'),
        badges: [t('designlab.showcase.component.treeTable.live.platformUi.badge')],
        tone: 'info' as const,
        data: {
          owner: t('designlab.showcase.component.treeTable.live.platformUi.data.owner'),
          status: t('designlab.showcase.component.treeTable.live.platformUi.data.status'),
          scope: t('designlab.showcase.component.treeTable.live.platformUi.data.scope'),
        },
        children: [
          {
            key: 'ui-library-surface',
            label: t('designlab.showcase.component.treeTable.live.uiLibrarySurface.label'),
            description: t('designlab.showcase.component.treeTable.live.uiLibrarySurface.description'),
            meta: 'wave-4',
            badges: [t('designlab.showcase.component.treeTable.live.uiLibrarySurface.badge')],
            tone: 'success' as const,
            data: {
              owner: t('designlab.showcase.component.treeTable.live.uiLibrarySurface.data.owner'),
              status: t('designlab.showcase.component.treeTable.live.uiLibrarySurface.data.status'),
              scope: t('designlab.showcase.component.treeTable.live.uiLibrarySurface.data.scope'),
            },
          },
          {
            key: 'delivery-gates',
            label: t('designlab.showcase.component.treeTable.live.deliveryGates.label'),
            description: t('designlab.showcase.component.treeTable.live.deliveryGates.description'),
            meta: 'doctor',
            badges: [t('designlab.showcase.component.treeTable.live.deliveryGates.badge')],
            tone: 'warning' as const,
            data: {
              owner: t('designlab.showcase.component.treeTable.live.deliveryGates.data.owner'),
              status: 'PASS',
              scope: t('designlab.showcase.component.treeTable.live.deliveryGates.data.scope'),
            },
          },
        ],
      },
    ],
    [t],
  );
  const [dropdownAction, setDropdownAction] = useState(dropdownActionSeed);
  const [reportStatus, setReportStatus] = useState(reportStatusSeed.idle);
  const [tabsValue, setTabsValue] = useState('overview');
  const [paginationPage, setPaginationPage] = useState(6);
  const [stepsValue, setStepsValue] = useState('review');
  const [stepsStatusRichValue, setStepsStatusRichValue] = useState('preview');
  const [anchorValue, setAnchorValue] = useState('overview');
  const [rightRailOpen, setRightRailOpen] = useState(false);

  const activeTrack = resolveTrackId(treeSelection.trackId, 'new_packages');

  const normalizedQuery = query.trim().toLowerCase();
  const selectedGroup = useMemo(
    () => designLabTaxonomy.groups.find((group) => group.id === treeSelection.groupId) ?? null,
    [treeSelection.groupId],
  );
  const selectedTaxonomySection = useMemo(
    () => designLabTaxonomySectionMap.get(activeTaxonomySectionId) ?? designLabTaxonomy.sections[0] ?? null,
    [activeTaxonomySectionId],
  );
  const activeSectionWorkspaceMode = useMemo(
    () => resolveWorkspaceModeForSection(activeTaxonomySectionId),
    [activeTaxonomySectionId],
  );
  const workspaceMode = activeSectionWorkspaceMode;
  const isFoundationLayer = activePageShellLayerId === 'foundations';
  const isRecipeLayer = activePageShellLayerId === 'recipes';
  const isPageLayer = activePageShellLayerId === 'pages';
  const isRecipeLikeLayer = isRecipeLayer || isPageLayer;
  const isTreeBasedLayer = isFoundationLayer || activePageShellLayerId === 'components';
  const resolveTaxonomySectionForGroup = React.useCallback(
    (groupId: string | null | undefined) => {
      if (!groupId) return null;
      return designLabTaxonomyGroupSectionMap.get(groupId) ?? null;
    },
    [],
  );
  const activeSectionGroupIds = useMemo(
    () => new Set(selectedTaxonomySection?.groupIds ?? designLabTaxonomy.groups.map((group) => group.id)),
    [selectedTaxonomySection],
  );

  const activeTrackItems = useMemo(
    () => designLabIndex.items.filter((item) => resolveItemTrack(item) === activeTrack),
    [activeTrack],
  );

  const filteredTrackItems = useMemo(() => {
    if (!normalizedQuery) return activeTrackItems;
    return activeTrackItems.filter((item) => {
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
  }, [activeTrackItems, normalizedQuery]);

  const itemsForTrack = useMemo(
    () => activeTrackItems.filter((item) => activeSectionGroupIds.has(item.taxonomyGroupId)),
    [activeSectionGroupIds, activeTrackItems],
  );

  const filteredItems = useMemo(
    () => filteredTrackItems.filter((item) => activeSectionGroupIds.has(item.taxonomyGroupId)),
    [activeSectionGroupIds, filteredTrackItems],
  );

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.name === treeSelection.itemId) ?? filteredItems[0] ?? null,
    [filteredItems, treeSelection.itemId],
  );
  const selectedComponentFamilyItems = useMemo(
    () => (selectedGroup ? itemsForTrack.filter((item) => item.taxonomyGroupId === selectedGroup.id) : []),
    [itemsForTrack, selectedGroup],
  );
  const selectedFoundationProfile = useMemo(
    () => (
      selectedTaxonomySection?.id === 'foundations' && selectedGroup
        ? foundationFamilyProfiles[selectedGroup.id] ?? null
        : null
    ),
    [selectedGroup, selectedTaxonomySection?.id],
  );
  const selectedComponentPrimarySectionId = useMemo(
    () => (selectedItem ? resolveTaxonomySectionForGroup(selectedItem.taxonomyGroupId) : null),
    [resolveTaxonomySectionForGroup, selectedItem],
  );
  const selectedComponentPrimarySectionTitle = useMemo(
    () =>
      selectedComponentPrimarySectionId
        ? designLabTaxonomySectionMap.get(selectedComponentPrimarySectionId)?.title ?? null
        : null,
    [selectedComponentPrimarySectionId],
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
  const familySummary = designLabIndex.recipes ?? null;
  const readyDistributionTargetCount = useMemo(
    () =>
      releaseSummary?.distributionTargets.filter(
        (target) => target.artifactCount === 0 || target.artifactPresentCount === target.artifactCount,
      ).length ?? 0,
    [releaseSummary],
  );
  const relatedRecipes = useMemo(
    () => buildRelatedRecipes(selectedItem, familySummary ?? undefined),
    [familySummary, selectedItem],
  );
  const overviewPanelItems = useMemo<Array<{
    id: DesignLabOverviewPanelId;
    label: string;
    badge: React.ReactNode;
  }>>(() => {
    const items: Array<{
      id: DesignLabOverviewPanelId;
      label: string;
      badge: React.ReactNode;
    }> = [];

    if (releaseSummary) {
      items.push({
        id: 'release',
        label: 'Release',
        badge: <Badge variant="info">{releaseSummary.packageVersion}</Badge>,
      });
    }

    if (adoptionSummary) {
      items.push({
        id: 'adoption',
        label: 'Adoption',
        badge: <Badge variant="info">{`${adoptionSummary.apiCoverage.coveragePercent}%`}</Badge>,
      });
    }

    if (migrationSummary) {
      items.push({
        id: 'migration',
        label: 'Migration',
        badge: <Badge variant="warning">{`${migrationSummary.summary.consumerAppsCount} app`}</Badge>,
      });
    }

    if (visualRegressionSummary) {
      items.push({
        id: 'visual',
        label: 'Visual',
        badge: <Badge variant="success">{`${visualRegressionSummary.summary.storyCoveragePercent}%`}</Badge>,
      });
    }

    if (themePresetSummary) {
      items.push({
        id: 'theme',
        label: 'Theme',
        badge: <Badge variant="muted">{themePresetSummary.presets.length}</Badge>,
      });
    }

    if (familySummary) {
      items.push({
        id: 'recipes',
        label: 'Recipes',
        badge: <Badge variant="muted">{relatedRecipes.length || familySummary.currentFamilies.length}</Badge>,
      });
    }

    return items;
  }, [adoptionSummary, migrationSummary, familySummary, relatedRecipes.length, releaseSummary, themePresetSummary, visualRegressionSummary]);
  const effectiveOverviewPanel = overviewPanelItems.some((item) => item.id === activeOverviewPanel)
    ? activeOverviewPanel
    : overviewPanelItems[0]?.id ?? 'release';
  const recipeOverviewPanelItems = useMemo<Array<{
    id: DesignLabRecipeOverviewPanelId;
    label: string;
  }>>(
    () => [
      { id: 'summary', label: 'Summary' },
      { id: 'coverage', label: 'Coverage' },
      { id: 'flow', label: 'Flow' },
    ],
    [],
  );
  const pageOverviewPanelItems = useMemo<Array<{
    id: DesignLabPageOverviewPanelId;
    label: string;
  }>>(
    () => [
      { id: 'summary', label: 'Summary' },
      { id: 'regions', label: 'Regions' },
      { id: 'adoption', label: 'Adoption' },
    ],
    [],
  );
  const componentApiPanelItems = useMemo<Array<{
    id: DesignLabComponentApiPanelId;
    label: string;
  }>>(
    () => [
      { id: 'contract', label: 'Contract' },
      { id: 'model', label: 'Model' },
      { id: 'props', label: 'Props' },
      { id: 'usage', label: 'Usage' },
    ],
    [],
  );
  const recipeApiPanelItems = useMemo<Array<{
    id: DesignLabRecipeApiPanelId;
    label: string;
  }>>(
    () => [
      { id: 'contract', label: 'Contract' },
      { id: 'binding', label: 'Binding' },
      { id: 'usage', label: 'Usage' },
    ],
    [],
  );
  const pageApiPanelItems = useMemo<Array<{
    id: DesignLabPageApiPanelId;
    label: string;
  }>>(
    () => [
      { id: 'contract', label: 'Contract' },
      { id: 'regions', label: 'Regions' },
      { id: 'dependencies', label: 'Dependencies' },
    ],
    [],
  );
  const componentQualityPanelItems = useMemo<Array<{
    id: DesignLabComponentQualityPanelId;
    label: string;
  }>>(
    () => [
      { id: 'gates', label: 'Gates' },
      { id: 'usage', label: 'Usage' },
    ],
    [],
  );
  const recipeQualityPanelItems = useMemo<Array<{
    id: DesignLabRecipeQualityPanelId;
    label: string;
  }>>(
    () => [
      { id: 'gates', label: 'Gates' },
      { id: 'lifecycle', label: 'Lifecycle' },
    ],
    [],
  );
  const pageQualityPanelItems = useMemo<Array<{
    id: DesignLabPageQualityPanelId;
    label: string;
  }>>(
    () => [
      { id: 'gates', label: 'Gates' },
      { id: 'readiness', label: 'Readiness' },
    ],
    [],
  );
  const pagePreviewPanelItems = useMemo<Array<{
    id: DesignLabPreviewPanelId;
    label: string;
  }>>(
    () => [
      { id: 'live', label: 'Live' },
      { id: 'reference', label: 'Reference' },
      { id: 'recipe', label: 'Template' },
    ],
    [],
  );
  const familyCatalogItems = familySummary?.currentFamilies ?? [];
  const normalizedFamilyQuery = familyQuery.trim().toLowerCase();
  const resolveFamilySemanticSectionIds = React.useCallback((family: DesignLabRecipeFamily) => {
    const haystack = `${family.recipeId} ${family.title ?? ''} ${family.intent}`.toLowerCase();
    const sectionIds = new Set<DesignLabTaxonomySection['id']>();
    const explicitSectionId = designLabRecipePrimarySectionById[family.recipeId];

    if (explicitSectionId) {
      sectionIds.add(explicitSectionId);
    }

    if (
      haystack.includes('ai') ||
      haystack.includes('authoring') ||
      haystack.includes('liste') ||
      haystack.includes('filtre') ||
      haystack.includes('pattern') ||
      haystack.includes('bos') ||
      haystack.includes('hata') ||
      haystack.includes('yukleniyor') ||
      haystack.includes('onay') ||
      haystack.includes('audit') ||
      haystack.includes('karar') ||
      haystack.includes('governance')
    ) {
      sectionIds.add('recipes');
    }

    if (
      haystack.includes('detay') ||
      haystack.includes('summary') ||
      haystack.includes('ozet') ||
      haystack.includes('template') ||
      haystack.includes('dashboard') ||
      haystack.includes('workspace settings') ||
      haystack.includes('settings') ||
      haystack.includes('crud') ||
      haystack.includes('workspace')
    ) {
      sectionIds.add('pages');
    }

    return Array.from(sectionIds);
  }, []);
  const getFamilySectionIdsFallback = React.useCallback(
    (family: DesignLabRecipeFamily) =>
      Array.from(
        new Set(
          family.ownerBlocks
            .map((owner) => designLabIndexItemMap.get(owner)?.taxonomyGroupId ?? null)
            .map((groupId) => resolveTaxonomySectionForGroup(groupId))
            .filter((sectionId): sectionId is string => Boolean(sectionId)),
        ),
      )[0] ?? null,
    [resolveTaxonomySectionForGroup],
  );
  const getFamilyPrimarySectionId = React.useCallback(
    (family: DesignLabRecipeFamily) => {
      const semanticSectionIds = resolveFamilySemanticSectionIds(family);
      return semanticSectionIds[0]
        ?? getFamilySectionIdsFallback(family)
        ?? null;
    },
    [getFamilySectionIdsFallback, resolveFamilySemanticSectionIds],
  );
  const getFamilySectionIds = React.useCallback(
    (family: DesignLabRecipeFamily) => {
      const ownerBlockSectionIds = Array.from(
        new Set(
          family.ownerBlocks
            .map((owner) => designLabIndexItemMap.get(owner)?.taxonomyGroupId ?? null)
            .map((groupId) => resolveTaxonomySectionForGroup(groupId))
            .filter((sectionId): sectionId is string => Boolean(sectionId)),
        ),
      );
      const sectionIds = Array.from(
        new Set([
          ...resolveFamilySemanticSectionIds(family),
          ...ownerBlockSectionIds,
        ]),
      );

      return sectionIds.some((sectionId) => sectionId !== 'components')
        ? sectionIds.filter((sectionId) => sectionId !== 'components')
        : sectionIds;
    },
    [resolveFamilySemanticSectionIds, resolveTaxonomySectionForGroup],
  );
  const familyItemsMatchingQuery = useMemo(() => {
    if (!normalizedFamilyQuery) return familyCatalogItems;
    return familyCatalogItems.filter((family) => {
      const haystack = [family.recipeId, family.title ?? '', family.intent, ...family.ownerBlocks].join(' ').toLowerCase();
      return haystack.includes(normalizedFamilyQuery);
    });
  }, [familyCatalogItems, normalizedFamilyQuery]);
  const familyItemsForRecipes = useMemo(
    () =>
      familyItemsMatchingQuery.filter((family) => {
        const familySectionIds = getFamilySectionIds(family);
        return !familySectionIds.length || familySectionIds.includes('recipes');
      }),
    [getFamilySectionIds, familyItemsMatchingQuery],
  );
  const familyItemsForPages = useMemo(
    () =>
      familyItemsMatchingQuery.filter((family) => {
        const familySectionIds = getFamilySectionIds(family);
        return !familySectionIds.length || familySectionIds.includes('pages');
      }),
    [getFamilySectionIds, familyItemsMatchingQuery],
  );
  const filteredFamilyItems = useMemo(
    () =>
      activePageShellLayerId === 'pages'
        ? familyItemsForPages
        : activePageShellLayerId === 'recipes'
          ? familyItemsForRecipes
          : [],
    [activePageShellLayerId, familyItemsForPages, familyItemsForRecipes],
  );
  const presenterFamilyItems = useMemo(
    () => familyItemsMatchingQuery.map((family) => toDesignLabFamilyIdentity(family)),
    [familyItemsMatchingQuery],
  );
  const sidebarFamilyItems = useMemo(
    () =>
      filteredFamilyItems.map((family) => {
        const primarySectionId = getFamilyPrimarySectionId(family);
        return toDesignLabFamilyIdentity({
          ...family,
          primarySectionTitle: primarySectionId
            ? getTaxonomySectionTitle(
                primarySectionId,
                designLabTaxonomySectionMap.get(primarySectionId)?.title ?? primarySectionId,
              )
            : null,
        });
      }),
    [filteredFamilyItems, getFamilyPrimarySectionId, getTaxonomySectionTitle],
  );
  const activeFamilySelectionId = resolveActiveFamilySelectionIdFromState({
    layerId: activePageShellLayerId,
    selectionState: familySelectionState,
  });
  const selectedFamily = useMemo(
    () =>
      activeFamilySelectionId
        ? filteredFamilyItems.find((family) => family.recipeId === activeFamilySelectionId) ?? null
        : null,
    [activeFamilySelectionId, filteredFamilyItems],
  );
  const selectedFamilyClusterTitle = selectedFamily?.clusterTitle ?? null;
  const selectedFamilyClusterDescription = selectedFamily?.clusterDescription ?? null;
  const selectedFamilyItems = useMemo(
    () =>
      (selectedFamily?.ownerBlocks ?? [])
        .map((owner) => designLabIndexItemMap.get(owner) ?? null)
        .filter((item): item is DesignLabIndexItem => Boolean(item)),
    [selectedFamily],
  );
  const selectedFamilyTracks = useMemo(
    () =>
      Array.from(
        new Set(selectedFamilyItems.map((item) => trackMeta[resolveItemTrack(item)].label)),
      ),
    [selectedFamilyItems],
  );
  const selectedFamilySections = useMemo(
    () =>
      Array.from(
        new Set(selectedFamilyItems.flatMap((item) => item.sectionIds ?? [])),
      ),
    [selectedFamilyItems],
  );
  const selectedFamilyThemes = useMemo(
    () =>
      Array.from(
        new Set(
          selectedFamilyItems.flatMap((item) =>
            [item.uxPrimaryThemeId, item.uxPrimarySubthemeId].filter(Boolean) as string[],
          ),
        ),
      ),
    [selectedFamilyItems],
  );
  const selectedFamilyQualityGates = useMemo(
    () =>
      Array.from(
        new Set(selectedFamilyItems.flatMap((item) => item.qualityGates ?? [])),
      ),
    [selectedFamilyItems],
  );
  const selectedFamilyPrimarySectionId = useMemo(
    () => (selectedFamily ? getFamilyPrimarySectionId(selectedFamily) : null),
    [getFamilyPrimarySectionId, selectedFamily],
  );
  const selectedFamilyPrimarySectionTitle = useMemo(
    () =>
      selectedFamilyPrimarySectionId
        ? designLabTaxonomySectionMap.get(selectedFamilyPrimarySectionId)?.title ?? null
        : null,
    [selectedFamilyPrimarySectionId],
  );
  const selectedPageTemplate = isPageLayer ? selectedFamily : null;
  const selectedPageTemplateFamilyTitle = isPageLayer ? selectedFamilyClusterTitle : null;
  const selectedPageTemplateItems = isPageLayer ? selectedFamilyItems : [];
  const selectedPageTemplateTracks = isPageLayer ? selectedFamilyTracks : [];
  const selectedPageTemplateSections = isPageLayer ? selectedFamilySections : [];
  const selectedPageTemplateThemes = isPageLayer ? selectedFamilyThemes : [];
  const selectedPageTemplateQualityGates = isPageLayer ? selectedFamilyQualityGates : [];
  const selectedPageTemplateContractId = isPageLayer ? familySummary?.contractId ?? null : null;
  const selectedRecipeIdentity = familySelectionState.recipes;
  const selectedPageIdentity = familySelectionState.pages;
  const selectedRecipeDisplayTitle = selectedFamily?.title ?? selectedRecipeIdentity ?? '—';
  const selectedPageDisplayTitle = selectedPageTemplate?.title ?? selectedPageIdentity ?? '—';
  const {
    taxonomySectionItems,
  } = useDesignLabTaxonomyNavigatorModel({
    sections: designLabTaxonomy.sections,
    workspaceMode,
    setActiveTaxonomySectionId,
    filteredTrackItems,
    itemsForTrack,
    allItems: designLabIndex.items,
    activeTrack,
    resolveItemTrack,
    setTreeSelection,
    sectionMap: designLabTaxonomySectionMap,
    resolveTaxonomySectionForGroup,
    getTaxonomySectionTitle,
    getTaxonomySectionDescription,
    familyItemsMatchingQuery: presenterFamilyItems,
    getFamilySectionIds: getFamilySectionIds,
    setSelectedFamilyId: setRecipeSelectionId,
  });

  const resolveComponentSelectionForSection = React.useCallback(
    (sectionId: string, preferredTrackId?: string | null) => {
      const section = designLabTaxonomySectionMap.get(sectionId);
      if (!section) {
        return null;
      }

      const preferredTrack = resolveTrackId(preferredTrackId, activeTrack);
      const groupIds = new Set(section.groupIds);
      const nextItem =
        filteredTrackItems.find((item) => groupIds.has(item.taxonomyGroupId)) ??
        itemsForTrack.find((item) => groupIds.has(item.taxonomyGroupId)) ??
        designLabIndex.items.find(
          (item) => resolveItemTrack(item) === preferredTrack && groupIds.has(item.taxonomyGroupId),
        ) ??
        designLabIndex.items.find((item) => groupIds.has(item.taxonomyGroupId)) ??
        null;

      if (!nextItem) {
        return null;
      }

      return {
        trackId: resolveItemTrack(nextItem),
        groupId: nextItem.taxonomyGroupId,
        subgroupId: nextItem.taxonomySubgroup,
        itemId: nextItem.name,
      };
    },
    [activeTrack, filteredTrackItems, itemsForTrack, resolveItemTrack],
  );

  const resolveComponentSelectionFromUrl = React.useCallback(
    (
      itemParam: string | null,
      groupParam: string | null,
      subgroupParam: string | null,
      preferredTrackId?: string | null,
    ) => {
      if (!itemParam) {
        return null;
      }

      const preferredTrack = resolveTrackId(preferredTrackId, activeTrack);

      const candidateItems = designLabIndex.items.filter((item) =>
        isDesignLabUrlTokenFlexibleMatch(item.name, itemParam),
      );

      const trackItems = candidateItems.filter((item) => resolveItemTrack(item) === preferredTrack);
      const findByTrack = (items: typeof candidateItems, itemPredicate: (item: DesignLabIndexItem) => boolean) =>
        items.find(itemPredicate) ?? null;

      const matchesGroup = (item: DesignLabIndexItem) => {
        const group = designLabTaxonomyGroupMap.get(item.taxonomyGroupId);
        const candidateGroupTokens = [
          item.taxonomyGroupId,
          item.group,
          group?.label,
          group?.id,
        ].filter(Boolean) as string[];

        return (
          groupParam &&
          candidateGroupTokens.some((candidate) =>
            isDesignLabUrlTokenFlexibleMatch(candidate, groupParam),
          )
        );
      };

      const matchesSubgroup = (item: DesignLabIndexItem) => {
        if (!subgroupParam) {
          return false;
        }

        const group = designLabTaxonomyGroupMap.get(item.taxonomyGroupId);
        const candidateSubgroupTokens = [
          item.taxonomySubgroup,
          item.subgroup,
          item.name,
          ...(group?.subgroups ?? []),
        ].filter(Boolean) as string[];

        return candidateSubgroupTokens.some((candidate) =>
          isDesignLabUrlTokenFlexibleMatch(candidate, subgroupParam),
        );
      };

      const exactTrackMatch =
        findByTrack(trackItems, (item) => matchesGroup(item) && matchesSubgroup(item))
        ?? findByTrack(trackItems, (item) => matchesSubgroup(item))
        ?? findByTrack(trackItems, (item) => matchesGroup(item))
        ?? findByTrack(trackItems, () => true);

      if (exactTrackMatch) {
        return {
          trackId: resolveItemTrack(exactTrackMatch),
          groupId: exactTrackMatch.taxonomyGroupId,
          subgroupId: exactTrackMatch.taxonomySubgroup,
          itemId: exactTrackMatch.name,
        };
      }

      const anyTrackMatch =
        findByTrack(candidateItems, (item) => matchesSubgroup(item))
        ?? findByTrack(candidateItems, (item) => matchesGroup(item))
        ?? candidateItems[0]
        ?? null;

      if (!anyTrackMatch) {
        return null;
      }

      return {
        trackId: resolveItemTrack(anyTrackMatch),
        groupId: anyTrackMatch.taxonomyGroupId,
        subgroupId: anyTrackMatch.taxonomySubgroup,
        itemId: anyTrackMatch.name,
      };
    },
    [activeTrack, resolveItemTrack],
  );
  const resolveComponentSelectionForGroup = React.useCallback(
    (groupId: string, preferredTrackId?: string | null) => {
      const preferredTrack = resolveTrackId(preferredTrackId, activeTrack);
      const nextItem =
        filteredTrackItems.find((item) => item.taxonomyGroupId === groupId) ??
        itemsForTrack.find((item) => item.taxonomyGroupId === groupId) ??
        designLabIndex.items.find(
          (item) => resolveItemTrack(item) === preferredTrack && item.taxonomyGroupId === groupId,
        ) ??
        designLabIndex.items.find((item) => item.taxonomyGroupId === groupId) ??
        null;

      if (!nextItem) {
        return null;
      }

      return {
        trackId: resolveItemTrack(nextItem),
        groupId: nextItem.taxonomyGroupId,
        subgroupId: nextItem.taxonomySubgroup,
        itemId: nextItem.name,
      };
    },
    [activeTrack, filteredTrackItems, itemsForTrack, resolveItemTrack],
  );

  const resolveFamilySelectionForSection = React.useCallback(
    (sectionId: string) => {
      const nextFamily =
        familyItemsMatchingQuery.find((family) => {
          const familySectionIds = getFamilySectionIds(family);
          return !familySectionIds.length || familySectionIds.includes(sectionId);
        }) ?? null;

      return nextFamily?.recipeId ?? null;
    },
    [getFamilySectionIds, familyItemsMatchingQuery],
  );

  const resolveSidebarFamilySectionId = React.useCallback(
    (preferredSectionId: string) =>
      resolvePreferredSectionId(
        designLabTaxonomySectionIds,
        preferredSectionId,
        (sectionId) => Boolean(resolveFamilySelectionForSection(sectionId)),
      ),
    [resolveFamilySelectionForSection],
  );

  const resolveSidebarComponentSectionId = React.useCallback(
    (preferredSectionId: string, preferredTrackId?: string | null) =>
      resolvePreferredSectionId(
        designLabTaxonomySectionIds,
        preferredSectionId,
        (sectionId) => Boolean(resolveComponentSelectionForSection(sectionId, preferredTrackId)),
      ),
    [resolveComponentSelectionForSection],
  );

  const syncUrlStateToView = React.useCallback((searchValue: string) => {
    const search = new URLSearchParams(searchValue);
    const modeParam = search.get('dl_mode');
    const tabParam = search.get('dl_tab');
    const panelUrlState = readLayerPanelUrlParams(search);
    const { recipeParam, templateParam } = readFamilySelectionUrlParams(search);
    const sectionParam = search.get('dl_section');
    const trackParam = search.get('dl_track');
    const groupParam = search.get('dl_group');
    const subgroupParam = search.get('dl_subgroup');
    const itemParam = search.get('dl_item');
    const normalizedSectionParam = normalizeDesignLabSectionId(sectionParam);
    if (isAdapterLegacyDesignLabSectionId(sectionParam)) {
      legacyAdapterCanonicalizationPendingRef.current = true;
      setLegacyAdapterOriginSectionId(sectionParam);
      const telemetryFingerprint = `${sectionParam}|${searchValue}`;
      if (
        normalizedSectionParam
        && legacyAliasTelemetryFingerprintRef.current !== telemetryFingerprint
      ) {
        recordDesignLabLegacyAliasTelemetry({
          aliasSectionId: sectionParam,
          canonicalSectionId: normalizedSectionParam,
          source: 'url_alias',
        });
        legacyAliasTelemetryFingerprintRef.current = telemetryFingerprint;
      }
    } else {
      legacyAliasTelemetryFingerprintRef.current = null;
    }
    const legacyComponentFallbackGroupId = resolveLegacySectionComponentFallbackGroupId({
      sectionId: sectionParam,
      groupParam,
      subgroupParam,
      itemParam,
    });
    const legacyRecipeFallbackId = resolveLegacySectionRecipeFallbackId({
      sectionId: sectionParam,
      recipeParam,
    });
    const requestedSectionId = isOneOf(normalizedSectionParam, designLabTaxonomySectionIds)
      ? normalizedSectionParam
      : activeTaxonomySectionId;
    const nextWorkspaceMode = normalizedSectionParam
      ? resolveWorkspaceModeForSection(requestedSectionId)
      : isOneOf(modeParam, designLabWorkspaceModes)
        ? modeParam
        : resolveWorkspaceModeForSection(activeTaxonomySectionId);
    const requestedTrackId = resolveTrackId(trackParam, activeTrack);
    const nextSectionId = nextWorkspaceMode === 'components' || nextWorkspaceMode === 'foundations'
      ? resolveSidebarComponentSectionId(requestedSectionId, requestedTrackId)
      : resolveSidebarFamilySectionId(requestedSectionId);
    const nextLayerId = resolveDesignLabPageShellLayerId(nextSectionId);

    if (nextWorkspaceMode !== workspaceModeState) {
      setWorkspaceMode(nextWorkspaceMode);
    }
    if (isOneOf(tabParam, designLabDetailTabIds)) {
      setDetailTab(tabParam);
    }
    if (nextLayerId === 'components' && isOneOf(panelUrlState.components.overview, designLabOverviewPanelIds)) {
      setActiveOverviewPanel(panelUrlState.components.overview);
    }
    if (nextLayerId === 'recipes' && isOneOf(panelUrlState.recipes.overview, designLabRecipeOverviewPanelIds)) {
      setActiveRecipeOverviewPanel(panelUrlState.recipes.overview);
    }
    if (nextLayerId === 'pages' && isOneOf(panelUrlState.pages.overview, designLabPageOverviewPanelIds)) {
      setActivePageOverviewPanel(panelUrlState.pages.overview);
    }
    if (nextLayerId === 'components' && isOneOf(panelUrlState.components.api, designLabComponentApiPanelIds)) {
      setActiveComponentApiPanel(panelUrlState.components.api);
    }
    if (nextLayerId === 'recipes' && isOneOf(panelUrlState.recipes.api, designLabRecipeApiPanelIds)) {
      setActiveRecipeApiPanel(panelUrlState.recipes.api);
    }
    if (nextLayerId === 'pages' && isOneOf(panelUrlState.pages.api, designLabPageApiPanelIds)) {
      setActivePageApiPanel(panelUrlState.pages.api);
    }
    if (nextLayerId === 'components' && isOneOf(panelUrlState.components.quality, designLabComponentQualityPanelIds)) {
      setActiveComponentQualityPanel(panelUrlState.components.quality);
    }
    if (nextLayerId === 'recipes' && isOneOf(panelUrlState.recipes.quality, designLabRecipeQualityPanelIds)) {
      setActiveRecipeQualityPanel(panelUrlState.recipes.quality);
    }
    if (nextLayerId === 'pages' && isOneOf(panelUrlState.pages.quality, designLabPageQualityPanelIds)) {
      setActivePageQualityPanel(panelUrlState.pages.quality);
    }
    if (nextLayerId === 'components' && isOneOf(panelUrlState.components.preview, designLabPreviewPanelIds)) {
      setActiveComponentPreviewPanel(panelUrlState.components.preview);
    }
    if (nextLayerId === 'recipes' && isOneOf(panelUrlState.recipes.preview, designLabPreviewPanelIds)) {
      setActiveRecipePreviewPanel(panelUrlState.recipes.preview);
    }
    if (nextLayerId === 'pages' && isOneOf(panelUrlState.pages.preview, designLabPreviewPanelIds)) {
      setActivePagePreviewPanel(panelUrlState.pages.preview);
    }
    if (nextSectionId) {
      setActiveTaxonomySectionId(nextSectionId);
    }
    if (
      nextWorkspaceMode === 'components'
      && trackParam
      && groupParam
      && subgroupParam
      && itemParam
    ) {
      const nextSelection = resolveComponentSelectionFromUrl(
        itemParam,
        groupParam,
        subgroupParam,
        requestedTrackId,
      );

      if (nextSelection) {
        const nextGroupSectionId = resolveTaxonomySectionForGroup(nextSelection.groupId);
        if (nextGroupSectionId) {
          setActiveTaxonomySectionId(nextGroupSectionId);
        }
        setTreeSelection((current) => (isSameTreeSelection(current, nextSelection) ? current : nextSelection));
      } else {
        const nextSelection = resolveComponentSelectionForSection(nextSectionId, requestedTrackId);
        if (nextSelection) {
          setTreeSelection((current) => (isSameTreeSelection(current, nextSelection) ? current : nextSelection));
        }
      }
    } else {
      const nextFamilySelection = resolveHydratedFamilySelection({
        workspaceMode: nextWorkspaceMode,
        layerId: nextLayerId,
        templateParam,
        recipeParam,
        legacyRecipeFallbackId,
        sectionId: nextSectionId,
        resolveFamilySelectionForSection,
      });

      if (nextFamilySelection) {
        setFamilySelectionState((current) => applyFamilySelection(current, nextFamilySelection));
      } else {
        const nextSelection =
          legacyComponentFallbackGroupId
            ? resolveComponentSelectionForGroup(legacyComponentFallbackGroupId, requestedTrackId)
              ?? resolveComponentSelectionForSection(nextSectionId, requestedTrackId)
            : resolveComponentSelectionForSection(nextSectionId, requestedTrackId);
        if (nextSelection) {
          setTreeSelection((current) => (isSameTreeSelection(current, nextSelection) ? current : nextSelection));
        }
      }
    }

    setUrlStateHydrated(true);
  }, [
    activeTaxonomySectionId,
    activeTrack,
    resolveComponentSelectionFromUrl,
    resolveComponentSelectionForSection,
    resolveComponentSelectionForGroup,
    resolveFamilySelectionForSection,
    resolveSidebarComponentSectionId,
    resolveSidebarFamilySectionId,
    resolveTaxonomySectionForGroup,
    workspaceModeState,
  ]);

  React.useLayoutEffect(() => {
    syncUrlStateToView(location.search);
  }, [location.search, syncUrlStateToView]);

  useEffect(() => {
    if (!legacyAdapterOriginSectionId) {
      return;
    }

    const rawSectionParam = new URLSearchParams(location.search).get('dl_section');
    const normalizedRawSectionId = normalizeDesignLabSectionId(rawSectionParam);
    const normalizedLegacySectionId = normalizeDesignLabSectionId(legacyAdapterOriginSectionId);

    if (
      legacyAdapterCanonicalizationPendingRef.current
      && normalizedRawSectionId
      && normalizedRawSectionId === normalizedLegacySectionId
    ) {
      legacyAdapterCanonicalizationPendingRef.current = false;
      return;
    }

    if (rawSectionParam && rawSectionParam !== legacyAdapterOriginSectionId) {
      setLegacyAdapterOriginSectionId(null);
      legacyAdapterCanonicalizationPendingRef.current = false;
    }
  }, [legacyAdapterOriginSectionId, location.search]);

  useEffect(() => {
    setWorkspaceMode((current) => (
      current === activeSectionWorkspaceMode ? current : activeSectionWorkspaceMode
    ));
  }, [activeSectionWorkspaceMode]);

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
      new_packages: designLabIndex.items.filter(
        (item) => resolveItemTrack(item) === 'new_packages' && activeSectionGroupIds.has(item.taxonomyGroupId),
      ).length,
      current_system: designLabIndex.items.filter(
        (item) => resolveItemTrack(item) === 'current_system' && activeSectionGroupIds.has(item.taxonomyGroupId),
      ).length,
      roadmap: designLabIndex.items.filter(
        (item) => resolveItemTrack(item) === 'roadmap' && activeSectionGroupIds.has(item.taxonomyGroupId),
      ).length,
    }),
    [activeSectionGroupIds],
  );

  const componentHeroStats = useMemo(() => {
    if (!selectedItem) {
      return [];
    }
    return [
      {
        label: t('designlab.metadata.primaryLens'),
        value: selectedComponentPrimarySectionTitle ?? 'Components',
        note: t('designlab.general.component.primaryLens.note'),
      },
      { label: t('designlab.metadata.track'), value: trackMeta[resolveItemTrack(selectedItem)].label, note: 'Track / release stream' },
      { label: t('designlab.metadata.group'), value: selectedGroup?.title ?? selectedItem.taxonomyGroupId, note: 'Navigation family' },
      { label: t('designlab.metadata.demo'), value: demoModeLabel[selectedItem.demoMode], note: 'Preview surface type' },
      { label: t('designlab.metadata.usage'), value: String(selectedItem.whereUsed.length), note: 'Detected usage locations' },
    ];
  }, [selectedComponentPrimarySectionTitle, selectedGroup, selectedItem, t]);
  const recipeHeroStats = useMemo(() => {
    if (!selectedFamily) {
      return [];
    }
    return [
      {
        label: t('designlab.metadata.primaryLens'),
        value: selectedFamilyPrimarySectionTitle ?? 'Recipes',
        note: t('designlab.general.recipe.primaryLens.note'),
      },
      { label: t('designlab.metadata.ownerBlocks'), value: String(selectedFamily.ownerBlocks.length), note: 'Canonical blocks in recipe' },
      { label: t('designlab.metadata.tracks'), value: String(selectedFamilyTracks.length), note: 'Consumed release tracks' },
      { label: t('designlab.metadata.sections'), value: String(selectedFamilySections.length), note: 'North-star coverage' },
      { label: t('designlab.metadata.themes'), value: String(selectedFamilyThemes.length), note: 'Bound UX themes' },
    ];
  }, [selectedFamily, selectedFamilyPrimarySectionTitle, selectedFamilySections.length, selectedFamilyThemes.length, selectedFamilyTracks.length, t]);
  const pageHeroStats = useMemo(() => {
    if (!selectedPageTemplate) {
      return [];
    }
    return [
      {
        label: t('designlab.metadata.primaryLens'),
        value: selectedTaxonomySection?.title ?? 'Pages',
        note: t('designlab.tabs.general.description.pages'),
      },
      { label: 'Page family', value: selectedPageTemplateFamilyTitle ?? '—', note: 'Template family context' },
      { label: 'Building blocks', value: String(selectedPageTemplate.ownerBlocks.length), note: 'Shell-level composition size' },
      { label: t('designlab.metadata.tracks'), value: String(selectedPageTemplateTracks.length), note: 'Consumed release tracks' },
      { label: t('designlab.metadata.themes'), value: String(selectedPageTemplateThemes.length), note: 'Bound UX themes' },
    ];
  }, [
    selectedPageTemplate,
    selectedPageTemplateFamilyTitle,
    selectedPageTemplateThemes.length,
    selectedPageTemplateTracks.length,
    selectedTaxonomySection?.title,
    t,
  ]);
  const heroStats =
    isPageLayer
      ? pageHeroStats
      : isRecipeLayer
        ? recipeHeroStats
        : componentHeroStats;
  const activeSubjectKey = isPageLayer
    ? selectedPageIdentity
    : isRecipeLayer
      ? selectedRecipeIdentity
      : selectedItem?.name ?? null;

  useEffect(() => {
    const nextFamilySelection = resolveFallbackFamilySelection({
      layerId: activePageShellLayerId,
      selectedFamilyId: activeFamilySelectionId,
      familyItems: filteredFamilyItems,
    });

    if (!nextFamilySelection) {
      return;
    }

    setFamilySelectionState((current) => applyFamilySelection(current, nextFamilySelection));
  }, [activeFamilySelectionId, activePageShellLayerId, filteredFamilyItems]);

  useEffect(() => {
    if (!overviewPanelItems.length) return;
    if (activeOverviewPanel === effectiveOverviewPanel) return;
    setActiveOverviewPanel(effectiveOverviewPanel);
  }, [activeOverviewPanel, effectiveOverviewPanel, overviewPanelItems.length]);

  useEffect(() => {
    setModalOpen(false);
    setContextMenuAction(contextMenuActionSeed);
    setFormDrawerOpen(false);
    setReadonlyFormDrawerOpen(false);
    setDetailDrawerOpen(false);
    setTourOpen(false);
    setTourStep(0);
    setTourStatus('idle');
  }, [activeSubjectKey, contextMenuActionSeed]);

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
    if (!urlStateHydrated) return;

    const search = new URLSearchParams(location.search);
    const canonicalActiveTaxonomySectionId = normalizeDesignLabSectionId(activeTaxonomySectionId) ?? activeTaxonomySectionId;
    search.set('dl_mode', activeSectionWorkspaceMode);
    search.set('dl_tab', detailTab);
    search.set('dl_section', canonicalActiveTaxonomySectionId);

    if (activePageShellLayerId === 'foundations') {
      search.set('dl_foundation_overview', activeFoundationOverviewPanel);
      search.set('dl_foundation_api', activeFoundationApiPanel);
      search.set('dl_foundation_quality', activeFoundationQualityPanel);
      search.set('dl_foundation_preview', activeComponentPreviewPanel);
    }

    if (activePageShellLayerId === 'components') {
      search.set('dl_overview', activeOverviewPanel);
      search.set('dl_component_api', activeComponentApiPanel);
      search.set('dl_component_quality', activeComponentQualityPanel);
      search.set('dl_component_preview', activeComponentPreviewPanel);
    }

    if (activePageShellLayerId === 'recipes') {
      search.set('dl_recipe_overview', activeRecipeOverviewPanel);
      search.set('dl_recipe_api', activeRecipeApiPanel);
      search.set('dl_recipe_quality', activeRecipeQualityPanel);
      search.set('dl_recipe_preview', activeRecipePreviewPanel);
    }

    if (activePageShellLayerId === 'pages') {
      search.set('dl_template_overview', activePageOverviewPanel);
      search.set('dl_template_api', activePageApiPanel);
      search.set('dl_template_quality', activePageQualityPanel);
      search.set('dl_template_preview', activePagePreviewPanel);
    }

    if (activePageShellLayerId === 'ecosystem') {
      search.set('dl_ecosystem_overview', activeEcosystemOverviewPanel);
      search.set('dl_ecosystem_api', activeEcosystemApiPanel);
      search.set('dl_ecosystem_quality', activeEcosystemQualityPanel);
      search.set('dl_ecosystem_preview', activeRecipePreviewPanel);
    }

    stripInactiveLayerParams(search, activePageShellLayerId);
    syncLayerPanelUrlParams({
      search,
      layerId: activePageShellLayerId,
      panelState: {
        foundations: {
          overview: activeFoundationOverviewPanel,
          api: activeFoundationApiPanel,
          quality: activeFoundationQualityPanel,
          preview: activeComponentPreviewPanel,
        },
        components: {
          overview: activeOverviewPanel,
          api: activeComponentApiPanel,
          quality: activeComponentQualityPanel,
          preview: activeComponentPreviewPanel,
        },
        recipes: {
          overview: activeRecipeOverviewPanel,
          api: activeRecipeApiPanel,
          quality: activeRecipeQualityPanel,
          preview: activeRecipePreviewPanel,
        },
        pages: {
          overview: activePageOverviewPanel,
          api: activePageApiPanel,
          quality: activePageQualityPanel,
          preview: activePagePreviewPanel,
        },
        ecosystem: {
          overview: activeEcosystemOverviewPanel,
          api: activeEcosystemApiPanel,
          quality: activeEcosystemQualityPanel,
          preview: activeRecipePreviewPanel,
        },
      },
    });

    syncFamilySelectionUrlParams({
      search,
      layerId: activePageShellLayerId,
      selectionState: familySelectionState,
    });

    if (activePageShellLayerId === 'foundations' && treeSelection.trackId && treeSelection.groupId) {
      search.set('dl_foundation_track', activeTrack);
      search.set('dl_foundation_group', treeSelection.groupId);
      if (treeSelection.subgroupId) search.set('dl_foundation_subgroup', treeSelection.subgroupId);
      if (treeSelection.itemId) search.set('dl_foundation_item', treeSelection.itemId);
    } else if (activePageShellLayerId === 'foundations') {
      search.delete('dl_foundation_track');
      search.delete('dl_foundation_group');
      search.delete('dl_foundation_subgroup');
      search.delete('dl_foundation_item');
    }

    if (activePageShellLayerId === 'components' && treeSelection.trackId && treeSelection.groupId && treeSelection.subgroupId && treeSelection.itemId) {
      search.set('dl_track', activeTrack);
      search.set('dl_group', treeSelection.groupId);
      search.set('dl_subgroup', treeSelection.subgroupId);
      search.set('dl_item', treeSelection.itemId);
    } else if (activePageShellLayerId === 'components') {
      search.delete('dl_track');
      search.delete('dl_group');
      search.delete('dl_subgroup');
      search.delete('dl_item');
    }

    const nextSearch = search.toString();
    const currentSearch = location.search.startsWith('?')
      ? location.search.slice(1)
      : location.search;

    if (nextSearch !== currentSearch) {
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
          hash: location.hash,
        },
        { replace: true },
      );
    }
  }, [
    activeComponentApiPanel,
    activeComponentPreviewPanel,
    activeComponentQualityPanel,
    activeEcosystemOverviewPanel,
    activeEcosystemApiPanel,
    activeEcosystemQualityPanel,
    activeFoundationOverviewPanel,
    activeFoundationApiPanel,
    activeFoundationQualityPanel,
    activePageApiPanel,
    activePageOverviewPanel,
    activePagePreviewPanel,
    activePageQualityPanel,
    activeSectionWorkspaceMode,
    activeTaxonomySectionId,
    activeOverviewPanel,
    activeRecipeApiPanel,
    activeRecipeOverviewPanel,
    activeRecipePreviewPanel,
    activeRecipeQualityPanel,
    detailTab,
    familySelectionState.pages,
    familySelectionState.recipes,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    treeSelection.groupId,
    treeSelection.itemId,
    treeSelection.subgroupId,
    treeSelection.trackId,
    urlStateHydrated,
  ]);


  const focusComponentFromFamily = (item: DesignLabIndexItem) => {
    setWorkspaceMode('components');
    setActiveTaxonomySectionId(resolveTaxonomySectionForGroup(item.taxonomyGroupId) ?? activeTaxonomySectionId);
    setTreeSelection({
      trackId: resolveItemTrack(item),
      groupId: item.taxonomyGroupId,
      subgroupId: item.taxonomySubgroup,
      itemId: item.name,
    });
  };

  const handleTreeSelectionChange = React.useCallback((nextSelection: LibraryProductTreeSelection) => {
    const nextSectionId = resolveTaxonomySectionForGroup(nextSelection.groupId);
    if (nextSectionId) {
      setActiveTaxonomySectionId((current) => (current === nextSectionId ? current : nextSectionId));
    }
    setTreeSelection((current) => (isSameTreeSelection(current, nextSelection) ? current : nextSelection));
  }, [resolveTaxonomySectionForGroup]);

  const handleSidebarFamilySelect = React.useCallback((familyId: string) => {
    setLegacyAdapterOriginSectionId(null);
    legacyAdapterCanonicalizationPendingRef.current = false;

    const foundInSidebar = sidebarFamilyItems.find((family) => family.familyId === familyId);
    const nextFamily =
      foundInSidebar
      ?? presenterFamilyItems.find((family) => family.familyId === familyId)
      ?? null;
    // When a family is clicked from the current sidebar (foundInSidebar), keep
    // the current section to avoid jarring cross-section navigation.  Families
    // can belong to multiple sections (e.g. both 'recipes' and 'pages') and
    // their primary section may differ from the section they are displayed in.
    const nextSectionId = nextFamily
      ? (foundInSidebar
          ? activeTaxonomySectionId
          : getFamilyPrimarySectionId(nextFamily) ?? activeTaxonomySectionId)
      : activeTaxonomySectionId;
    const nextFamilySelection = resolveSidebarFamilySelection({
      familyId,
      familySectionId: nextSectionId,
      fallbackSectionId: activeTaxonomySectionId,
    });

    setWorkspaceMode(nextFamilySelection.workspaceMode);
    if (nextFamilySelection.sectionId) {
      setActiveTaxonomySectionId((current) => (
        current === nextFamilySelection.sectionId ? current : nextFamilySelection.sectionId
      ));
    }
    setFamilySelectionState((current) => applyFamilySelection(current, nextFamilySelection));
  }, [
    activeTaxonomySectionId,
    getFamilyPrimarySectionId,
    presenterFamilyItems,
    sidebarFamilyItems,
  ]);

  const handleSidebarTreeSelectionChange = React.useCallback((nextSelection: LibraryProductTreeSelection) => {
    setWorkspaceMode('components');
    setLegacyAdapterOriginSectionId(null);
    legacyAdapterCanonicalizationPendingRef.current = false;
    handleTreeSelectionChange(nextSelection);
  }, [handleTreeSelectionChange]);
  const handleTaxonomySectionChange = React.useCallback((sectionId: string) => {
    setWorkspaceMode(resolveWorkspaceModeForSection(sectionId));
    setLegacyAdapterOriginSectionId(null);
    legacyAdapterCanonicalizationPendingRef.current = false;
    setActiveTaxonomySectionId(sectionId);

    const layerId = resolveDesignLabPageShellLayerId(sectionId);

    const nextFamilySelection = resolveSectionChangeFamilySelection({
      layerId,
      selectedRecipeId: familySelectionState.recipes,
      selectedPageTemplateId: familySelectionState.pages,
      resolveFamilySelectionForSection: (targetSectionId) => resolveFamilySelectionForSection(targetSectionId),
    });

    if (nextFamilySelection) {
      setFamilySelectionState((current) => applyFamilySelection(current, nextFamilySelection));
      return;
    }

    const nextSelection = resolveComponentSelectionForSection(sectionId, treeSelection.trackId);
    if (nextSelection) {
      setTreeSelection((current) => (isSameTreeSelection(current, nextSelection) ? current : nextSelection));
    }
  }, [
    familySelectionState.pages,
    familySelectionState.recipes,
    resolveComponentSelectionForSection,
    resolveFamilySelectionForSection,
    treeSelection.trackId,
  ]);
  const handleOverviewFamilySelect = React.useCallback((groupId: string) => {
    setWorkspaceMode('components');
    setLegacyAdapterOriginSectionId(null);
    legacyAdapterCanonicalizationPendingRef.current = false;
    const nextSectionId = resolveTaxonomySectionForGroup(groupId) ?? activeTaxonomySectionId;
    if (nextSectionId && nextSectionId !== activeTaxonomySectionId) {
      setActiveTaxonomySectionId(nextSectionId);
    }
    const nextSelection = resolveComponentSelectionForGroup(groupId, treeSelection.trackId);
    if (nextSelection) {
      setTreeSelection((current) => (isSameTreeSelection(current, nextSelection) ? current : nextSelection));
    }
  }, [
    activeTaxonomySectionId,
    resolveComponentSelectionForGroup,
    resolveTaxonomySectionForGroup,
    treeSelection.trackId,
  ]);

  const treeTracks = useMemo<LibraryProductTreeTrack[]>(() => {
    return (Object.keys(trackMeta) as DesignLabTrack[]).map((track) => {
      const trackItems = (track === activeTrack
        ? filteredItems
        : designLabIndex.items.filter((item) => resolveItemTrack(item) === track)
      ).sort((a, b) => a.name.localeCompare(b.name, 'en'));

      const groups = designLabTaxonomy.groups
        .filter((group) => activeSectionGroupIds.has(group.id))
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
  }, [activeSectionGroupIds, activeTrack, filteredItems, trackSummary]);

  const handleCopy = async (value: string) => {
    const ok = await copyToClipboard(value);
    setCopied(ok ? 'ok' : 'fail');
    window.setTimeout(() => setCopied(null), 1500);
  };

  const gridRows = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }).map((_, index) => ({
      id: String(index + 1),
      name: t('designlab.seed.gridRows.record', { index: index + 1 }),
      status:
        index % 3 === 0
          ? t('designlab.seed.gridRows.status.active')
          : index % 3 === 1
            ? t('designlab.seed.gridRows.status.pending')
            : t('designlab.seed.gridRows.status.disabled'),
      updatedAt: new Date(now.getTime() - index * 86_400_000).toISOString().slice(0, 10),
    }));
  }, [t]);

  const serverGridRows = useMemo(
    () => [
      { id: 'CMP-001', name: t('designlab.seed.serverGridRows.companies.name'), owner: 'core-data-service' },
      { id: 'USR-001', name: t('designlab.seed.serverGridRows.users.name'), owner: 'user-service' },
      { id: 'PRM-001', name: t('designlab.seed.serverGridRows.permissions.name'), owner: 'permission-service' },
      { id: 'VAR-001', name: t('designlab.seed.serverGridRows.variants.name'), owner: 'variant-service' },
    ],
    [t],
  );

  const pageHeaderMeta = useMemo(
    () => [
      (
        <SectionBadge
          key="release-window"
          label={t('designlab.seed.pageHeader.meta.releaseWindow', {
            date: formatDate(new Date(2026, 2, 4), { day: '2-digit', month: 'short', year: 'numeric' }),
          })}
        />
      ),
      <SectionBadge key="owner" label={t('designlab.seed.pageHeader.meta.owner')} />,
      <SectionBadge key="coverage" label={t('designlab.seed.pageHeader.meta.coverage')} />,
    ],
    [formatDate, t],
  );

  const summaryStripItems = useMemo(
    () => [
      {
        key: 'published',
        label: t('designlab.seed.summaryStrip.published.label'),
        value: formatNumber(72),
        note: t('designlab.seed.summaryStrip.published.note'),
        trend: <Badge variant="success">{t('designlab.seed.summaryStrip.published.trend')}</Badge>,
        tone: 'success' as const,
      },
      {
        key: 'planned',
        label: t('designlab.seed.summaryStrip.planned.label'),
        value: formatNumber(4),
        note: t('designlab.seed.summaryStrip.planned.note'),
        trend: <Badge variant="warning">{t('designlab.seed.summaryStrip.planned.trend')}</Badge>,
        tone: 'warning' as const,
      },
      {
        key: 'doctor',
        label: t('designlab.seed.summaryStrip.doctor.label'),
        value: 'PASS',
        note: t('designlab.seed.summaryStrip.doctor.note'),
        trend: <Badge variant="info">{t('designlab.seed.summaryStrip.doctor.trend')}</Badge>,
        tone: 'info' as const,
      },
      {
        key: 'gate',
        label: t('designlab.seed.summaryStrip.gate.label'),
        value: 'PASS',
        note: t('designlab.seed.summaryStrip.gate.note'),
        trend: <Badge variant="success">{t('designlab.seed.summaryStrip.gate.trend')}</Badge>,
        tone: 'default' as const,
      },
    ],
    [formatNumber, t],
  );

  const entitySummaryItems = useMemo(
    () => [
      {
        key: 'domain',
        label: t('designlab.seed.entitySummary.domain.label'),
        value: t('designlab.seed.entitySummary.domain.value'),
        tone: 'info' as const,
      },
      {
        key: 'status',
        label: t('designlab.seed.entitySummary.status.label'),
        value: t('designlab.seed.entitySummary.status.value'),
        tone: 'success' as const,
      },
      {
        key: 'owner',
        label: t('designlab.seed.entitySummary.owner.label'),
        value: t('designlab.seed.entitySummary.owner.value'),
        tone: 'info' as const,
      },
      {
        key: 'lastRelease',
        label: t('designlab.seed.entitySummary.lastRelease.label'),
        value: formatDate(new Date(2026, 2, 7), { day: '2-digit', month: 'short', year: 'numeric' }),
        tone: 'warning' as const,
      },
    ],
    [formatDate, t],
  );

  const commandPaletteItems = useMemo(
    () => [
      {
        id: 'open-ui-library-docs',
        title: t('designlab.seed.commandPalette.items.docs.title'),
        description: t('designlab.seed.commandPalette.items.docs.description'),
        group: t('designlab.seed.commandPalette.group.navigate'),
        shortcut: '⌘U',
        keywords: ['docs', 'library', 'component'],
        badge: <Badge variant="info">{t('designlab.seed.commandPalette.items.docs.badge')}</Badge>,
      },
      {
        id: 'review-release-evidence',
        title: t('designlab.seed.commandPalette.items.review.title'),
        description: t('designlab.seed.commandPalette.items.review.description'),
        group: t('designlab.seed.commandPalette.group.governance'),
        shortcut: '⌘R',
        keywords: ['doctor', 'gate', 'evidence', 'release'],
        badge: <Badge variant="warning">{t('designlab.seed.commandPalette.items.review.badge')}</Badge>,
      },
      {
        id: 'open-ai-approvals',
        title: t('designlab.seed.commandPalette.items.aiQueue.title'),
        description: t('designlab.seed.commandPalette.items.aiQueue.description'),
        group: t('designlab.seed.commandPalette.group.aiAssist'),
        shortcut: '⌘A',
        keywords: ['approval', 'queue', 'ai', 'human'],
        badge: <Badge variant="muted">{t('designlab.seed.commandPalette.items.aiQueue.badge')}</Badge>,
      },
      {
        id: 'apply-safe-rollout',
        title: t('designlab.seed.commandPalette.items.applyRollout.title'),
        description: t('designlab.seed.commandPalette.items.applyRollout.description'),
        group: t('designlab.seed.commandPalette.group.aiAssist'),
        shortcut: '↵',
        keywords: ['apply', 'rollout', 'safe', 'recommendation'],
        badge: <Badge variant="success">{t('designlab.seed.commandPalette.items.applyRollout.badge')}</Badge>,
      },
    ],
    [t],
  );

  const approvalCheckpointSteps = useMemo(
    () => [
      {
        key: 'doctor',
        label: t('designlab.seed.approvalStep.doctor.label'),
        helper: t('designlab.seed.approvalStep.doctor.helper'),
        owner: t('designlab.seed.approvalStep.doctor.owner'),
        status: 'approved' as const,
      },
      {
        key: 'citations',
        label: t('designlab.seed.approvalStep.citations.label'),
        helper: t('designlab.seed.approvalStep.citations.helper'),
        owner: t('designlab.seed.approvalStep.citations.owner'),
        status: 'ready' as const,
      },
      {
        key: 'human',
        label: t('designlab.seed.approvalStep.human.label'),
        helper: t('designlab.seed.approvalStep.human.helper'),
        owner: t('designlab.seed.approvalStep.human.owner'),
        status: approvalCheckpointState === 'approved' ? ('approved' as const) : approvalCheckpointState === 'rejected' ? ('blocked' as const) : ('todo' as const),
      },
    ],
    [approvalCheckpointState, t],
  );

  const citationPanelItems = useMemo(
    () => [
      {
        id: 'policy-4-2',
        title: t('designlab.seed.citation.policy.title'),
        excerpt: t('designlab.seed.citation.policy.excerpt'),
        source: 'policy_work_intake.v2.json',
        locator: 'sec:4.2',
        kind: 'policy' as const,
        badges: [<Tag key="policy-critical" variant="warning">{t('designlab.seed.citation.policy.badge')}</Tag>],
      },
      {
        id: 'ux-ai-3',
        title: t('designlab.seed.citation.ux.title'),
        excerpt: t('designlab.seed.citation.ux.excerpt'),
        source: 'ux_katalogu.reference.v1.json',
        locator: 'ux:ai-3',
        kind: 'doc' as const,
        badges: [<Tag key="ux" variant="info">{t('designlab.seed.citation.ux.badge')}</Tag>],
      },
      {
        id: 'doctor-ui',
        title: t('designlab.seed.citation.doctor.title'),
        excerpt: t('designlab.seed.citation.doctor.excerpt'),
        source: 'frontend-doctor.summary.v1.json',
        locator: 'doctor:ui-library',
        kind: 'log' as const,
        badges: [<Tag key="pass" variant="success">{t('designlab.seed.citation.doctor.badge')}</Tag>],
      },
    ],
    [t],
  );

  const auditTimelineItems = useMemo(
    () => [
      {
        id: 'audit-draft',
        actor: 'ai' as const,
        title: t('designlab.seed.audit.draft.title'),
        timestamp: '07 Mar 2026 18:10',
        summary: t('designlab.seed.audit.draft.summary'),
        status: 'drafted' as const,
        badges: [<Tag key="wave" variant="muted">{t('designlab.seed.audit.draft.badge')}</Tag>],
      },
      {
        id: 'audit-review',
        actor: 'human' as const,
        title: t('designlab.seed.audit.review.title'),
        timestamp: '07 Mar 2026 18:14',
        summary: t('designlab.seed.audit.review.summary'),
        status: 'approved' as const,
        badges: [<Tag key="review" variant="info">{t('designlab.seed.audit.review.badge')}</Tag>],
      },
      {
        id: 'audit-release',
        actor: 'system' as const,
        title: t('designlab.seed.audit.release.title'),
        timestamp: '07 Mar 2026 18:19',
        summary: t('designlab.seed.audit.release.summary'),
        status: 'observed' as const,
        badges: [<Tag key="system" variant="warning">{t('designlab.seed.audit.release.badge')}</Tag>],
      },
    ],
    [t],
  );

  useEffect(() => {
    setTextInputValue((current) => (
      current === previousFormFieldSeed.current.textInput ? formFieldSeed.textInput : current
    ));
    setSearchInputValue((current) => (
      current === previousFormFieldSeed.current.searchInput ? formFieldSeed.searchInput : current
    ));
    setTextAreaValue((current) => (
      current === previousFormFieldSeed.current.textArea ? formFieldSeed.textArea : current
    ));
    setCommentValue((current) => (
      current === previousFormFieldSeed.current.comment ? formFieldSeed.comment : current
    ));
    previousFormFieldSeed.current = formFieldSeed;
  }, [formFieldSeed]);

  useEffect(() => {
    setPromptSubject((current) => (
      current === previousPromptSeed.current.subject ? promptSeed.subject : current
    ));
    setPromptBody((current) => (
      current === previousPromptSeed.current.body ? promptSeed.body : current
    ));
    previousPromptSeed.current = promptSeed;
  }, [promptSeed]);

  useEffect(() => {
    setReportStatus((current) => {
      if (current === previousReportStatusSeed.current.idle) {
        return reportStatusSeed.idle;
      }
      if (current === previousReportStatusSeed.current.applied) {
        return reportStatusSeed.applied;
      }
      if (current === previousReportStatusSeed.current.reset) {
        return reportStatusSeed.reset;
      }
      return current;
    });
    previousReportStatusSeed.current = reportStatusSeed;
  }, [reportStatusSeed]);

  useEffect(() => {
    setDropdownAction((current) => (
      current === previousDropdownActionSeed.current ? dropdownActionSeed : current
    ));
    previousDropdownActionSeed.current = dropdownActionSeed;
  }, [dropdownActionSeed]);

  useEffect(() => {
    setContextMenuAction((current) => (
      current === previousContextMenuActionSeed.current ? contextMenuActionSeed : current
    ));
    previousContextMenuActionSeed.current = contextMenuActionSeed;
  }, [contextMenuActionSeed]);

  const renderOverviewTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-xs">
          <Text variant="secondary">{t('designlab.overview.empty')}</Text>
        </div>
      );
    }
    const releaseFamilyContext = buildReleaseFamilyContext(item, selectedGroup?.title ?? null, releaseSummary ?? null);
    const renderOverviewPanelContent = (activePanelId: DesignLabOverviewPanelId) => (
      <DesignLabComponentOverviewPanels
        activePanelId={activePanelId}
        item={item}
        releaseSummary={releaseSummary}
        releaseFamilyContext={releaseFamilyContext}
        adoptionSummary={adoptionSummary}
        migrationSummary={migrationSummary}
        visualRegressionSummary={visualRegressionSummary}
        themePresetSummary={themePresetSummary}
        themePresetGalleryItems={themePresetGalleryItems}
        defaultThemePreset={defaultThemePreset}
        contrastThemePreset={contrastThemePreset}
        compactThemePreset={compactThemePreset}
        recipeSummary={familySummary}
        relatedRecipes={relatedRecipes}
        renderRecipeComponentPreview={renderRecipeComponentPreview}
        DetailLabelComponent={DetailLabel}
        SectionBadgeComponent={SectionBadge}
        MetricCardComponent={LibraryMetricCard}
        ShowcaseCardComponent={LibraryShowcaseCard}
        CodeBlockComponent={LibraryCodeBlock}
      />
    );

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <DetailLabel>{t('designlab.overview.workspace.title')}</DetailLabel>
              <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
                {t('designlab.overview.workspace.description')}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
              <SectionBadge label={t('designlab.common.panelCountPlural', { count: overviewPanelItems.length })} />
            </div>
          </div>

          {overviewPanelItems.length ? (
            <Tabs
              value={effectiveOverviewPanel}
              onValueChange={(value) => setActiveOverviewPanel(value as DesignLabOverviewPanelId)}
              appearance="pill"
              listLabel="Overview workspace panels"
              className="mt-5"
              items={overviewPanelItems.map((panel) => ({
                value: panel.id,
                label: panel.label,
                badge: panel.badge,
                content: renderOverviewPanelContent(panel.id),
              }))}
            />
          ) : (
            <div className="mt-5 rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Text variant="secondary" className="block leading-7">
                {t('designlab.overview.workspace.noPanels')}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderComponentGeneralTab = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-xs">
          <Text variant="secondary">{t('designlab.general.component.empty')}</Text>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <DetailLabel>{t('designlab.general.component.title')}</DetailLabel>
              <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
                {t('designlab.general.component.description')}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{t('designlab.common.tabbed')}</Badge>
              <SectionBadge label={t('designlab.general.component.primarySummary')} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {componentHeroStats.map((stat) => (
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

          {item.importStatement ? (
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <DetailLabel>{t('designlab.general.component.import.label')}</DetailLabel>
                  <Text as="div" className="mt-2 break-all text-xs font-medium text-text-primary">
                    {item.importStatement}
                  </Text>
                </div>
                <Button variant="secondary" size="sm" onClick={() => handleCopy(item.importStatement)}>
                  {t('designlab.general.component.import.action')}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.general.component.releaseIdentity')}</DetailLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant={item.availability === 'exported' ? 'success' : 'info'}>{availabilityLabel[item.availability]}</Badge>
            <Badge variant={item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info'}>
              {statusLabel[item.lifecycle]}
            </Badge>
            <Badge variant={item.demoMode === 'live' ? 'success' : item.demoMode === 'planned' ? 'warning' : 'muted'}>
              {demoModeLabel[item.demoMode]}
            </Badge>
            {item.roadmapWaveId ? <SectionBadge label={item.roadmapWaveId} /> : null}
            {item.uxPrimaryThemeId ? <SectionBadge label={item.uxPrimaryThemeId} /> : null}
          </div>

          <div className="flex flex-col mt-4 gap-3">
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.metadata.primaryLens')}
              </Text>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="info">{selectedComponentPrimarySectionTitle ?? 'Components'}</Badge>
                <Text variant="secondary" className="text-xs">
                  {t('designlab.general.component.primaryLens.note')}
                </Text>
              </div>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.general.component.package')}
              </Text>
              <Text as="div" className="mt-2 font-semibold text-text-primary">
                {releaseSummary ? `${releaseSummary.packageName}@${releaseSummary.packageVersion}` : '@mfe/design-system'}
              </Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.general.component.release')}
              </Text>
              <Text as="div" className="mt-2 font-semibold text-text-primary">
                {releaseSummary?.latestRelease.date ?? 'Release bilgisi yok'}
              </Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.general.component.contractTags')}
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.acceptanceContractId ? <SectionBadge label={item.acceptanceContractId} /> : null}
                {item.tags?.length ? item.tags.map((tag) => <SectionBadge key={tag} label={tag} />) : <Text variant="secondary">{t('designlab.general.component.noTags')}</Text>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecipeGeneralTab = () => {
    if (!selectedFamily) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-xs">
          <Text variant="secondary">{t('designlab.general.recipe.empty')}</Text>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <DetailLabel>{t('designlab.general.recipe.title')}</DetailLabel>
              <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
                {t('designlab.general.recipe.description')}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">Recipe</Badge>
              <SectionBadge label={`${selectedFamily.ownerBlocks.length} owner block`} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {recipeHeroStats.map((stat) => (
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

        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.general.recipe.identity')}</DetailLabel>
          <div className="flex flex-col mt-4 gap-3">
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Contract
              </Text>
              <Text as="div" className="mt-2 break-all font-semibold text-text-primary">
                {familySummary?.contractId ?? '—'}
              </Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.metadata.primaryLens')}
              </Text>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="info">{selectedFamilyPrimarySectionTitle ?? 'Recipes'}</Badge>
                <Text variant="secondary" className="text-xs">
                  {t('designlab.general.recipe.primaryLens.note')}
                </Text>
              </div>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.general.recipe.tracksThemes')}
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFamilyTracks.map((track) => <SectionBadge key={track} label={track} />)}
                {selectedFamilyThemes.map((theme) => <SectionBadge key={theme} label={theme} />)}
                {!selectedFamilyTracks.length && !selectedFamilyThemes.length ? <Text variant="secondary">{t('designlab.general.recipe.noBindings')}</Text> : null}
              </div>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {t('designlab.general.recipe.sectionsGates')}
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFamilySections.map((section) => <SectionBadge key={section} label={section} />)}
                {selectedFamilyQualityGates.map((gate) => <SectionBadge key={gate} label={gate} />)}
                {!selectedFamilySections.length && !selectedFamilyQualityGates.length ? <Text variant="secondary">{t('designlab.general.recipe.noBindings')}</Text> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPageGeneralTab = () => {
    if (!selectedPageTemplate) {
      return (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-xs">
          <Text variant="secondary">{t('designlab.hero.placeholder.page')}</Text>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <div className="flex flex-col gap-4 border-b border-border-subtle pb-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <DetailLabel>{t('designlab.lens.pages.title')}</DetailLabel>
              <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
                {t('designlab.tabs.general.description.pages')}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Template</Badge>
              <SectionBadge label={`${selectedPageTemplate.ownerBlocks.length} building block`} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {pageHeroStats.map((stat) => (
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

        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs">
          <DetailLabel>{t('designlab.tabs.general.label')}</DetailLabel>
          <div className="flex flex-col mt-4 gap-3">
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Template ID
              </Text>
              <Text as="div" className="mt-2 break-all font-semibold text-text-primary">
                {selectedPageTemplate.recipeId}
              </Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Page family
              </Text>
              <Text as="div" className="mt-2 font-semibold text-text-primary">
                {selectedPageTemplateFamilyTitle ?? '—'}
              </Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Contract
              </Text>
              <Text as="div" className="mt-2 break-all font-semibold text-text-primary">
                {selectedPageTemplateContractId ?? '—'}
              </Text>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Layout intent
              </Text>
              <Text as="div" className="mt-2 font-semibold text-text-primary">
                {selectedPageTemplate.intent}
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const designLabShowcaseState = {
    anchorValue,
    approvalCheckpointState,
    approvalCheckpointSteps,
    auditTimelineItems,
    avatarPreviewImageSrc,
    checkboxValue,
    citationPanelItems,
    commandPaletteItems,
    commandPaletteOpen,
    commandPaletteQuery,
    commentValue,
    contextMenuAction,
    dateValue,
    detailDrawerOpen,
    dropdownAction,
    entitySummaryItems,
    formDrawerOpen,
    gridRows,
    inviteInputValue,
    jsonViewerValue,
    lastCommandSelection,
    modalOpen,
    pageHeaderMeta,
    paginationPage,
    policyTableRows,
    promptBody,
    promptScope,
    promptSubject,
    promptTone,
    radioValue,
    readonlyFormDrawerOpen,
    recommendationDecision,
    reportStatus,
    searchInputValue,
    selectedAuditId,
    selectedCitationId,
    selectValue,
    serverGridRows,
    sliderValue,
    stepsStatusRichValue,
    stepsValue,
    summaryStripItems,
    switchValue,
    tabsValue,
    textAreaValue,
    textInputValue,
    timeValue,
    tourOpen,
    tourStatus,
    tourStep,
    treeNodes,
    treeTableNodes,
    uploadFiles,
    setAnchorValue,
    setApprovalCheckpointState,
    setCheckboxValue,
    setCommandPaletteOpen,
    setCommandPaletteQuery,
    setCommentValue,
    setContextMenuAction,
    setDateValue,
    setDetailDrawerOpen,
    setDropdownAction,
    setFormDrawerOpen,
    setInviteInputValue,
    setLastCommandSelection,
    setModalOpen,
    setPaginationPage,
    setPromptBody,
    setPromptScope,
    setPromptSubject,
    setPromptTone,
    setRadioValue,
    setReadonlyFormDrawerOpen,
    setRecommendationDecision,
    setReportStatus,
    setSearchInputValue,
    setSelectedAuditId,
    setSelectedCitationId,
    setSelectValue,
    setSliderValue,
    setStepsStatusRichValue,
    setStepsValue,
    setSwitchValue,
    setTabsValue,
    setTextAreaValue,
    setTextInputValue,
    setTimeValue,
    setTourOpen,
    setTourStatus,
    setTourStep,
    setUploadFiles,
    rolloutDescriptionItems,
    listItems,
    themePresetSummary,
    themePresetGalleryItems,
    defaultThemePreset,
    contrastThemePreset,
    compactThemePreset,
  };

  const renderRecipeComponentPreview = (recipeId: string) => (
    <DesignLabRecipeComponentPreview
      recipeId={recipeId}
      showcaseState={designLabShowcaseState}
      layoutRecipeContext={{
        avatarPreviewImageSrc,
        descriptionsLocaleText: { emptyFallbackDescription: t('designlab.componentContracts.descriptions.emptyFallbackDescription') },
        dropdownAction,
        entitySummaryItems,
        pageHeaderMeta,
        rolloutDescriptionItems,
        searchInputValue,
        selectValue,
        summaryStripItems,
        setDropdownAction,
        setSearchInputValue,
        setSelectValue,
      }}
    />
  );

  const componentDemoContent = (
    <DesignLabShowcaseContent
      mode="components"
      item={selectedItem}
      family={null}
      designLabIndex={designLabIndex}
      activePreviewPanel={activeComponentPreviewPanel}
      onPreviewPanelChange={setActiveComponentPreviewPanel}
      statusLabel={statusLabel}
      demoModeLabel={demoModeLabel}
      trackMeta={trackMeta}
      resolveItemTrack={resolveItemTrack}
      toTestIdSuffix={toTestIdSuffix}
      onFocusComponentFromFamily={focusComponentFromFamily}
      showcaseState={designLabShowcaseState}
    />
  );

  const recipeDemoContent = (
    <DesignLabShowcaseContent
      mode="recipes"
      item={selectedItem}
      family={selectedFamily}
      designLabIndex={designLabIndex}
      activePreviewPanel={activeRecipePreviewPanel}
      onPreviewPanelChange={setActiveRecipePreviewPanel}
      statusLabel={statusLabel}
      demoModeLabel={demoModeLabel}
      trackMeta={trackMeta}
      resolveItemTrack={resolveItemTrack}
      toTestIdSuffix={toTestIdSuffix}
      onFocusComponentFromFamily={focusComponentFromFamily}
      showcaseState={designLabShowcaseState}
    />
  );

  const pageDemoContent = (
    <DesignLabShowcaseContent
      mode="pages"
      item={selectedItem}
      family={selectedPageTemplate}
      designLabIndex={designLabIndex}
      activePreviewPanel={activePagePreviewPanel}
      onPreviewPanelChange={setActivePagePreviewPanel}
      statusLabel={statusLabel}
      demoModeLabel={demoModeLabel}
      trackMeta={trackMeta}
      resolveItemTrack={resolveItemTrack}
      toTestIdSuffix={toTestIdSuffix}
      onFocusComponentFromFamily={focusComponentFromFamily}
      showcaseState={designLabShowcaseState}
    />
  );

  const foundationDemoContent = (
    <DesignLabShowcaseContent
      mode="foundations"
      item={selectedItem}
      family={null}
      designLabIndex={designLabIndex}
      activePreviewPanel={activeComponentPreviewPanel}
      onPreviewPanelChange={setActiveComponentPreviewPanel}
      statusLabel={statusLabel}
      demoModeLabel={demoModeLabel}
      trackMeta={trackMeta}
      resolveItemTrack={resolveItemTrack}
      toTestIdSuffix={toTestIdSuffix}
      onFocusComponentFromFamily={focusComponentFromFamily}
      showcaseState={designLabShowcaseState}
    />
  );

  const ecosystemDemoContent = (
    <DesignLabShowcaseContent
      mode="ecosystem"
      item={selectedItem}
      family={selectedFamily}
      designLabIndex={designLabIndex}
      activePreviewPanel={activeRecipePreviewPanel}
      onPreviewPanelChange={setActiveRecipePreviewPanel}
      statusLabel={statusLabel}
      demoModeLabel={demoModeLabel}
      trackMeta={trackMeta}
      resolveItemTrack={resolveItemTrack}
      toTestIdSuffix={toTestIdSuffix}
      onFocusComponentFromFamily={focusComponentFromFamily}
      showcaseState={designLabShowcaseState}
    />
  );

  const selectedFoundationTokens = useMemo(
    () =>
      selectedComponentFamilyItems
        .filter((item) => item.taxonomyGroupId?.includes('token') || item.taxonomyGroupId?.includes('theme') || item.taxonomySubgroup?.includes('token'))
        .map((item) => item.name),
    [selectedComponentFamilyItems],
  );

  const selectedFoundationThemes = useMemo(
    () =>
      selectedComponentFamilyItems
        .filter((item) => item.taxonomyGroupId?.includes('theme') || item.taxonomySubgroup?.includes('theme'))
        .map((item) => item.name),
    [selectedComponentFamilyItems],
  );

  const selectedFoundationA11yGates = useMemo(
    () =>
      selectedComponentFamilyItems
        .flatMap((item) => item.qualityGates ?? [])
        .filter((gate) => gate.includes('a11y') || gate.includes('accessibility')),
    [selectedComponentFamilyItems],
  );

  const selectedFoundationItems = useMemo(
    () =>
      selectedComponentFamilyItems.map((item) => ({
        lifecycle: item.lifecycle,
        tokenCount: 1,
        contractStatus: (item.lifecycle === 'stable' ? 'active' : item.lifecycle === 'beta' ? 'draft' : 'deprecated') as 'active' | 'draft' | 'deprecated',
      })),
    [selectedComponentFamilyItems],
  );

  const selectedFoundationFamily = useMemo(
    () =>
      selectedFoundationProfile
        ? {
            foundationId: selectedGroup?.id ?? 'unknown',
            title: selectedFoundationProfile.title ?? undefined,
            groupTitle: selectedGroup?.title ?? undefined,
            groupDescription: selectedFoundationProfile.description ?? undefined,
            intent: selectedFoundationProfile.description ?? 'Foundation family',
            governanceBadges: selectedFoundationProfile.badges ?? [],
          }
        : null,
    [selectedFoundationProfile, selectedGroup],
  );

  const selectedEcosystemExtension = useMemo(
    () =>
      selectedFamily
        ? {
            extensionId: selectedFamily.recipeId ?? 'unknown',
            title: selectedFamily.title ?? undefined,
            clusterTitle: selectedFamily.clusterTitle ?? undefined,
            clusterDescription: selectedFamily.clusterDescription ?? undefined,
            intent: selectedFamily.intent ?? 'Enterprise extension',
            ownerBlocks: selectedFamily.ownerBlocks ?? [],
            tier: 'pro' as const,
          }
        : null,
    [selectedFamily],
  );

  const selectedEcosystemSurfaces = useMemo(
    () => selectedFamily?.ownerBlocks ?? [],
    [selectedFamily],
  );

  const selectedEcosystemTiers = useMemo(
    () => ['pro', 'enterprise', 'community'].filter(
      (tier) => filteredFamilyItems.some((f) => f.recipeId.includes(tier)),
    ),
    [filteredFamilyItems],
  );

  const selectedEcosystemQualityGates = useMemo(
    () =>
      filteredFamilyItems
        .flatMap((f) => f.ownerBlocks)
        .filter((block) => block.includes('gate') || block.includes('quality') || block.includes('a11y'))
        .filter((v, i, a) => a.indexOf(v) === i),
    [filteredFamilyItems],
  );

  const selectedEcosystemItems = useMemo(
    () =>
      filteredFamilyItems.map((f) => ({
        lifecycle: f.ownerBlocks.length > 3 ? 'stable' : 'beta',
        demoMode: f.ownerBlocks.length > 2 ? 'live' : 'planned',
        tier: (f.recipeId.includes('enterprise') || f.recipeId.includes('admin')
          ? 'enterprise'
          : f.recipeId.includes('pro') || f.recipeId.includes('grid')
            ? 'pro'
            : 'community') as 'pro' | 'enterprise' | 'community',
      })),
    [filteredFamilyItems],
  );

  const usesFamilySearch = activeSectionWorkspaceMode === 'recipes' || activeSectionWorkspaceMode === 'pages' || activeSectionWorkspaceMode === 'ecosystem';
  const sidebarSearchValue = usesFamilySearch ? familyQuery : query;
  const sidebarSearchPlaceholder = activeSectionWorkspaceMode === 'pages'
    ? 'Page template ara...'
    : activeSectionWorkspaceMode === 'ecosystem'
      ? 'Enterprise extension ara...'
      : activeSectionWorkspaceMode === 'recipes'
        ? t('designlab.sidebar.search.recipes.placeholder')
        : t('designlab.sidebar.search.components.placeholder');
  const sidebarHelpText = activeSectionWorkspaceMode === 'pages'
    ? 'Page template ailelerini ve shell varyantlarini arama ile filtreleyin.'
    : activeSectionWorkspaceMode === 'ecosystem'
      ? 'Enterprise extension, pro surface ve data grid ailelerini filtreleyin.'
      : activeSectionWorkspaceMode === 'recipes'
        ? t('designlab.sidebar.help.recipes')
        : t('designlab.sidebar.help.components');
  const activeLensProfile = {
    foundations: {
      label: t('designlab.taxonomy.sections.foundations.title'),
      badge: t('designlab.lens.foundations.badge'),
      title: t('designlab.lens.foundations.title'),
      note: t('designlab.lens.foundations.note'),
      useWhen: t('designlab.lens.foundations.useWhen'),
    },
    components: {
      label: t('designlab.taxonomy.sections.components.title'),
      badge: t('designlab.lens.components.badge'),
      title: t('designlab.lens.components.title'),
      note: t('designlab.lens.components.note'),
      useWhen: t('designlab.lens.components.useWhen'),
    },
    recipes: {
      label: t('designlab.taxonomy.sections.recipes.title'),
      badge: t('designlab.lens.recipes.badge'),
      title: t('designlab.lens.recipes.title'),
      note: t('designlab.lens.recipes.note'),
      useWhen: t('designlab.lens.recipes.useWhen'),
    },
    pages: {
      label: t('designlab.taxonomy.sections.pages.title'),
      badge: t('designlab.lens.pages.badge'),
      title: t('designlab.lens.pages.title'),
      note: t('designlab.lens.pages.note'),
      useWhen: t('designlab.lens.pages.useWhen'),
    },
    ecosystem: {
      label: t('designlab.taxonomy.sections.ecosystem.title'),
      badge: t('designlab.lens.ecosystem.badge'),
      title: t('designlab.lens.ecosystem.title'),
      note: t('designlab.lens.ecosystem.note'),
      useWhen: t('designlab.lens.ecosystem.useWhen'),
    },
  } satisfies Record<string, { label: string; badge: string; title: string; note: string; useWhen: string }>;
  const activeLens = activeLensProfile[activeTaxonomySectionId] ?? activeLensProfile.components;
  const activeWorkspaceLabel = resolveDesignLabPageShellWorkspaceLabel(
    activePageShellLayerId,
    t,
  );
  const showCatalogLandingContext = detailTab === 'overview';
  const activeHeroCopy = useMemo(
    () =>
      resolveDesignLabPageShellHeroCopy(
        {
          layerId: activePageShellLayerId,
          lensLabel: activeLens.label,
          foundationTitle: selectedFoundationProfile?.title ?? selectedTaxonomySection?.title ?? null,
          foundationDescription: selectedFoundationProfile?.description ?? activeLens.useWhen,
          componentName: selectedItem?.name ?? null,
          componentDescription: selectedItem?.description ?? null,
          familyTitle: selectedFamily?.title ?? null,
          familyId: activeFamilySelectionId,
          familyIntent: selectedFamily?.intent ?? null,
        },
        t,
      ),
    [
      activeLens.label,
      activeLens.useWhen,
      activePageShellLayerId,
      selectedFoundationProfile?.description,
      selectedFoundationProfile?.title,
      activeFamilySelectionId,
      selectedItem?.description,
      selectedItem?.name,
      selectedFamily?.intent,
      selectedFamily?.title,
      selectedTaxonomySection?.title,
      t,
    ],
  );
  const activeHeroTitle = activeHeroCopy.title;
  const activeHeroDescription = activeHeroCopy.description;
  const activeHeroLabel = activeHeroCopy.label;
  const getClusterVisualMeta = React.useCallback((key: string) => {
    const normalized = key.toLowerCase();
    if (normalized.includes('analytics') || normalized.includes('search')) {
      return lensSurfaceMeta.pages;
    }
    if (normalized.includes('review') || normalized.includes('approval') || normalized.includes('configuration')) {
      return lensSurfaceMeta.foundations;
    }
    if (normalized.includes('state') || normalized.includes('operational')) {
      return lensSurfaceMeta.recipes;
    }
    if (normalized.includes('ai') || normalized.includes('runtime')) {
      return lensSurfaceMeta.components;
    }
    return lensSurfaceMeta.components;
  }, []);
  const lensEntryHighlights = {
    foundations: ['Theme tokens', 'Accessibility', 'Diagnostics'],
    components: ['Button', 'Select', 'MenuBar'],
    recipes: ['Search & Listing', 'Review & Approval', 'State & Feedback'],
    pages: ['Dashboard', 'CRUD', 'Settings'],
  } satisfies Record<string, string[]>;
  const lensEntryCards = (
    <div className="rounded-[22px] border border-border-subtle bg-surface-panel p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            Lens guide
          </Text>
          <Text as="div" className="mt-2 font-semibold text-text-primary">
            Design Lab katmanlari
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            Ilk ekranda hangi lensin hangi soruya cevap verdigini hizlica ayirt etmek icin 4 ana giris burada duruyor.
          </Text>
        </div>
        <SectionBadge label={`${taxonomySectionItems.length} lens`} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {taxonomySectionItems.map((section) => {
          const lensMeta = activeLensProfile[section.id] ?? activeLensProfile.components;
          const lensVisual = lensSurfaceMeta[section.id as keyof typeof lensSurfaceMeta] ?? lensSurfaceMeta.components;
          const active = activeTaxonomySectionId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleTaxonomySectionChange(section.id)}
              data-testid={`design-lab-lens-entry-${section.id}`}
              className={`relative flex h-full flex-col overflow-hidden rounded-[20px] border px-3.5 py-3 text-left transition ${
                active
                  ? `${lensVisual.borderClass} ${lensVisual.surfaceClass} ${lensVisual.glowClass}`
                  : 'border-border-subtle bg-surface-canvas hover:bg-surface-muted'
              }`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${lensVisual.accentClass}`} aria-hidden />
              <div className="flex items-start justify-between gap-2">
                <Text as="div" className="text-sm font-semibold text-text-primary">
                  {section.title}
                </Text>
                <SectionBadge label={String(section.count)} />
              </div>
              <Text variant="secondary" className="mt-2 block text-xs leading-5">
                {section.description ?? lensMeta.note}
              </Text>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(lensEntryHighlights[section.id as keyof typeof lensEntryHighlights] ?? []).map((highlight) => (
                  <SectionBadge key={`${section.id}-${highlight}`} label={highlight} />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-[16px] border border-border-subtle bg-surface-default/80 px-3 py-2">
                  <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                    Focus
                  </Text>
                  <Text as="div" className="mt-1 text-xs font-semibold text-text-primary">
                    {lensMeta.badge}
                  </Text>
                </div>
                <div className="rounded-[16px] border border-border-subtle bg-surface-default/80 px-3 py-2">
                  <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                    Use when
                  </Text>
                  <Text as="div" className="mt-1 text-xs font-semibold leading-5 text-text-primary">
                    {lensMeta.useWhen}
                  </Text>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <SectionBadge label={lensMeta.badge} />
                <SectionBadge label={lensMeta.title} />
                {active ? <SectionBadge label="Active lens" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
  const heroSupportingContent = showCatalogLandingContext ? (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[22px] border border-border-subtle bg-surface-panel px-4 py-3">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            Lens intent
          </Text>
          <Text as="div" className="mt-2 font-semibold text-text-primary">
            {activeLens.title}
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            {activeLens.note}
          </Text>
        </div>
        <div className="rounded-[22px] border border-border-subtle bg-surface-panel px-4 py-3">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            {isPageLayer ? 'Page family' : isRecipeLayer ? 'Recipe cluster' : 'Catalog family'}
          </Text>
          <Text as="div" className="mt-2 font-semibold text-text-primary">
            {isPageLayer
              ? selectedFamilyClusterTitle ?? activeLens.title
              : isRecipeLayer
                ? selectedFamilyClusterTitle ?? activeLens.title
                : selectedFoundationProfile?.title ?? selectedGroup?.title ?? activeLens.useWhen}
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            {isPageLayer
              ? selectedFamilyClusterDescription ?? activeWorkspaceLabel
              : isRecipeLayer
                ? selectedFamilyClusterDescription ?? activeWorkspaceLabel
                : selectedFoundationProfile?.description ?? selectedItem?.taxonomySubgroup ?? activeWorkspaceLabel}
          </Text>
        </div>
      </div>
      {lensEntryCards}
    </div>
  ) : null;
  const lensGuideMetadataItems = renderMetadataDescriptorItems(
    resolveDesignLabLensGuideMetadataItems({
      layerId: activePageShellLayerId,
      activeWorkspaceLabel,
      activeLensLabel: activeLens.label,
      activeLensTitle: activeLens.title,
      activeLensNote: activeLens.note,
      activeLensUseWhen: activeLens.useWhen,
      familyTitle: selectedFoundationProfile?.title ?? selectedGroup?.title ?? selectedItem?.taxonomyGroupId ?? null,
      familyNote: selectedFoundationProfile?.benchmark ?? selectedItem?.taxonomySubgroup ?? null,
      benchmark: selectedFoundationProfile?.benchmark ?? null,
      benchmarkNote: selectedFoundationProfile?.description ?? null,
      clusterTitle: selectedFamilyClusterTitle,
      clusterDescription: selectedFamilyClusterDescription ?? null,
    }),
  );
  const lensOverviewCards = useMemo(() => {
    if (isRecipeLikeLayer) {
      const clusters = new Map<string, {
        title: string;
        description?: string;
        items: DesignLabRecipeFamily[];
      }>();

      filteredFamilyItems.forEach((family) => {
        const clusterTitle = family.clusterTitle ?? (isPageLayer ? 'Page templates' : 'General recipes');
        const current = clusters.get(clusterTitle);
        if (current) {
          current.items.push(family);
          return;
        }
        clusters.set(clusterTitle, {
          title: clusterTitle,
          description: family.clusterDescription,
          items: [family],
        });
      });

      return Array.from(clusters.values()).map((cluster) => {
        const visual = getClusterVisualMeta(cluster.title);
        const isPageCluster = isPageLayer || selectedTaxonomySection?.id === 'pages';
        const productProblem = getRecipeProblemSignal(cluster.title, isPageCluster);
        return {
          key: cluster.title,
          eyebrow: isPageCluster ? 'Template cluster' : 'Workflow cluster',
          title: cluster.title,
          description: getRecipeClusterReason(cluster.title, cluster.description),
          primaryMetricLabel: isPageCluster ? 'Template count' : 'Recipe count',
          primaryMetric: `${cluster.items.length} ${isPageCluster ? 'template' : 'recipe'}`,
          secondaryMetricLabel: isPageCluster ? 'Page rhythm' : 'Product problem',
          secondaryMetric: productProblem,
          badges: [selectedTaxonomySection?.title ?? activeLens.label, cluster.title],
          highlightLabel: isPageCluster ? 'Template examples' : 'Representative recipes',
          outcomeLabel: 'Success outcome',
          outcome: getRecipeOutcomeSignal(cluster.title, isPageCluster),
          useWhen: isPageCluster ? null : getRecipeUseWhen(cluster.title),
          avoidWhen: isPageCluster ? null : getRecipeAvoidWhen(cluster.title),
          highlights: cluster.items
            .map((item) => item.title ?? item.recipeId)
            .filter(Boolean)
            .slice(0, 3),
          silhouette: getLensOverviewSilhouette(cluster.title),
          visual,
        };
      });
    }

    return (selectedTaxonomySection?.groupIds ?? []).map((groupId) => {
      const group = designLabTaxonomyGroupMap.get(groupId);
      const sectionItems = itemsForTrack.filter((item) => item.taxonomyGroupId === groupId);
      const visibleItems = filteredItems.filter((item) => item.taxonomyGroupId === groupId);
      const profile = selectedTaxonomySection?.id === 'foundations' ? foundationFamilyProfiles[groupId] ?? null : null;
      const subgroupCount = new Set(sectionItems.map((item) => item.taxonomySubgroup)).size;
      const visual = selectedTaxonomySection?.id === 'foundations'
        ? getClusterVisualMeta(groupId)
        : lensSurfaceMeta.components;
      const highlights = selectedTaxonomySection?.id === 'foundations'
        ? (profile?.badges.slice(0, 3) ?? group?.subgroups.slice(0, 3) ?? [])
        : visibleItems.slice(0, 3).map((item) => item.name);

      return {
        key: groupId,
        eyebrow: selectedTaxonomySection?.id === 'foundations' ? 'Foundation family' : 'Catalog family',
        title: profile?.title ?? group?.title ?? groupId,
        description: selectedTaxonomySection?.id === 'foundations'
          ? profile?.description ?? group?.subgroups.slice(0, 2).join(' / ') ?? 'Active family overview'
          : 'Bu aile, ayni nav agaci altinda toplanan componentlerin katalog girisini verir.',
        primaryMetricLabel: 'Catalog items',
        primaryMetric: `${visibleItems.length || sectionItems.length} item`,
        secondaryMetricLabel: selectedTaxonomySection?.id === 'foundations' ? 'Benchmark' : 'Subgroups',
        secondaryMetric: profile?.benchmark ?? `${subgroupCount} subgroup`,
        badges: profile?.badges.slice(0, 2) ?? [selectedTaxonomySection?.title ?? activeLens.label, group?.title ?? groupId],
        highlightLabel: selectedTaxonomySection?.id === 'foundations' ? 'Signals' : 'Catalog preview',
        highlights,
        groupId,
        silhouette: selectedTaxonomySection?.id === 'foundations' ? 'detail' : 'catalog',
        visual,
      };
    });
  }, [
    activeLens.label,
    isPageLayer,
    isRecipeLikeLayer,
    filteredItems,
    filteredFamilyItems,
    getClusterVisualMeta,
    itemsForTrack,
    selectedTaxonomySection?.groupIds,
    selectedTaxonomySection?.id,
    selectedTaxonomySection?.title,
  ]);
  const sortedComponentOverviewCards = useMemo(() => {
    if (workspaceMode === 'components' && selectedTaxonomySection?.id === 'components') {
      return [...lensOverviewCards].sort((left, right) => {
        const leftCount = Number.parseInt(String(left.primaryMetric), 10);
        const rightCount = Number.parseInt(String(right.primaryMetric), 10);
        return rightCount - leftCount;
      });
    }
    return lensOverviewCards;
  }, [lensOverviewCards, selectedTaxonomySection?.id, workspaceMode]);
  const limitedLensOverviewCards = useMemo(() => {
    if (workspaceMode === 'components' && selectedTaxonomySection?.id === 'components') {
      return sortedComponentOverviewCards.slice(0, 6);
    }
    return sortedComponentOverviewCards;
  }, [selectedTaxonomySection?.id, sortedComponentOverviewCards, workspaceMode]);
  const overflowLensOverviewCards = useMemo(() => {
    if (workspaceMode === 'components' && selectedTaxonomySection?.id === 'components') {
      return sortedComponentOverviewCards.slice(6);
    }
    return [];
  }, [selectedTaxonomySection?.id, sortedComponentOverviewCards, workspaceMode]);
  const hiddenLensOverviewCount = overflowLensOverviewCards.length;
  const activeFamilyOverviewCard = useMemo(() => {
    if (!selectedGroup?.id) {
      return null;
    }
    return lensOverviewCards.find((card) => card.groupId === selectedGroup.id) ?? null;
  }, [lensOverviewCards, selectedGroup?.id]);
  const pageTemplateLandingCards = useMemo(() => {
    if (!isPageLayer) {
      return [];
    }
    return [...filteredFamilyItems]
      .filter((family) => designLabRecipePrimarySectionById[family.recipeId] === 'pages')
      .map((family) => {
        const title = family.title ?? family.recipeId;
        const clusterTitle = family.clusterTitle ?? 'Page Templates';
        return {
          recipeId: family.recipeId,
          title,
          description: family.intent,
          clusterTitle,
          signal: getRecipeFamilySignal(family),
          highlightLabel: 'Signature blocks',
          highlights: family.ownerBlocks.slice(0, 4),
          primaryMetricLabel: 'Primary surface',
          primaryMetric: family.ownerBlocks[0] ?? 'Page shell',
          secondaryMetric: `${family.ownerBlocks.length} block`,
          silhouette: getLensOverviewSilhouette(`${title} ${family.recipeId}`),
          visual: getClusterVisualMeta(clusterTitle),
          transitionTags: getTemplateTransitionTags(family),
        };
      })
      .sort((left, right) => left.title.localeCompare(right.title, 'tr'));
  }, [filteredFamilyItems, getClusterVisualMeta, isPageLayer]);
  const pageTemplateLandingClusters = useMemo(() => {
    const clusters = new Map<string, {
      title: string;
      description: string;
      cards: typeof pageTemplateLandingCards;
    }>();
    pageTemplateLandingCards.forEach((card) => {
      const current = clusters.get(card.clusterTitle);
      if (current) {
        current.cards.push(card);
        return;
      }
      clusters.set(card.clusterTitle, {
        title: card.clusterTitle,
        description: getRecipeClusterReason(card.clusterTitle),
        cards: [card],
      });
    });
    return Array.from(clusters.values());
  }, [pageTemplateLandingCards]);
  const renderOverviewSilhouette = (variant: string | undefined) => {
    switch (variant) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-[1.3fr_0.7fr] gap-1" aria-hidden>
            <div className="flex flex-col gap-1">
              <div className="h-3 rounded-full bg-white/90" />
              <div className="grid grid-cols-3 gap-1">
                <div className="h-7 rounded-lg bg-white/80" />
                <div className="h-7 rounded-lg bg-white/75" />
                <div className="h-7 rounded-lg bg-white/70" />
              </div>
              <div className="h-12 rounded-xl bg-white/75" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-5 rounded-lg bg-white/80" />
              <div className="h-5 rounded-lg bg-white/70" />
              <div className="h-7 rounded-lg bg-white/65" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex flex-col gap-1" aria-hidden>
            <div className="grid grid-cols-3 gap-1">
              <div className="h-3 rounded-full bg-white/90" />
              <div className="h-3 rounded-full bg-white/80" />
              <div className="h-3 rounded-full bg-white/70" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-4 rounded-lg bg-white/80" />
              <div className="h-4 rounded-lg bg-white/75" />
              <div className="h-4 rounded-lg bg-white/70" />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="grid grid-cols-[0.55fr_1fr] gap-1" aria-hidden>
            <div className="flex flex-col gap-1">
              <div className="h-3 rounded-full bg-white/90" />
              <div className="h-3 rounded-full bg-white/80" />
              <div className="h-3 rounded-full bg-white/75" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-5 rounded-lg bg-white/80" />
              <div className="h-5 rounded-lg bg-white/72" />
              <div className="h-5 rounded-lg bg-white/68" />
            </div>
          </div>
        );
      case 'detail':
        return (
          <div className="grid grid-cols-[1fr_0.5fr] gap-1" aria-hidden>
            <div className="flex flex-col gap-1">
              <div className="h-3 rounded-full bg-white/90" />
              <div className="h-9 rounded-xl bg-white/78" />
              <div className="h-4 rounded-lg bg-white/72" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-4 rounded-lg bg-white/80" />
              <div className="h-8 rounded-xl bg-white/68" />
            </div>
          </div>
        );
      case 'workspace':
        return (
          <div className="flex flex-col gap-1" aria-hidden>
            <div className="h-3 rounded-full bg-white/90" />
            <div className="grid grid-cols-[0.7fr_1.3fr] gap-1">
              <div className="flex flex-col gap-1">
                <div className="h-6 rounded-xl bg-white/78" />
                <div className="h-6 rounded-xl bg-white/70" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-4 rounded-lg bg-white/76" />
                <div className="h-4 rounded-lg bg-white/68" />
                <div className="h-4 rounded-lg bg-white/64" />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 gap-1" aria-hidden>
            <div className="flex flex-col gap-1">
              <div className="h-3 rounded-full bg-white/90" />
              <div className="h-6 rounded-lg bg-white/78" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-3 rounded-full bg-white/82" />
              <div className="h-6 rounded-lg bg-white/70" />
            </div>
          </div>
        );
    }
  };
  const renderFamilyRailMarker = (variant: string, accentClass: string) => {
    switch (variant) {
      case 'navigation':
        return (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-border-subtle bg-surface-default/80">
            <span className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />
            <span className="flex w-2 flex-col gap-[2px]">
              <span className="h-[2px] rounded-full bg-text-primary/70" />
              <span className="h-[2px] rounded-full bg-text-primary/55" />
            </span>
          </span>
        );
      case 'actions':
        return (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-border-subtle bg-surface-default/80">
            <span className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
            <span className="grid grid-cols-2 gap-[2px]">
              <span className="h-[3px] w-[3px] rounded-full bg-text-primary/70" />
              <span className="h-[3px] w-[3px] rounded-full bg-text-primary/45" />
              <span className="h-[3px] w-[3px] rounded-full bg-text-primary/45" />
              <span className="h-[3px] w-[3px] rounded-full bg-text-primary/70" />
            </span>
          </span>
        );
      case 'data':
        return (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-border-subtle bg-surface-default/80">
            <span className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
            <span className="grid grid-cols-2 gap-[2px]">
              <span className="h-[3px] rounded-[2px] bg-text-primary/65" />
              <span className="h-[3px] rounded-[2px] bg-text-primary/45" />
              <span className="h-[3px] rounded-[2px] bg-text-primary/45" />
              <span className="h-[3px] rounded-[2px] bg-text-primary/65" />
            </span>
          </span>
        );
      case 'feedback':
        return (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-border-subtle bg-surface-default/80">
            <span className={`absolute inset-0 opacity-80 ${accentClass}`} />
            <span className="relative h-[6px] w-[6px] rounded-full border border-white/80 bg-white/60" />
          </span>
        );
      case 'forms':
        return (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-border-subtle bg-surface-default/80">
            <span className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />
            <span className="relative flex w-[8px] flex-col gap-[2px]">
              <span className="h-[2px] rounded-full bg-text-primary/70" />
              <span className="h-[4px] rounded-[3px] border border-text-primary/35 bg-transparent" />
            </span>
          </span>
        );
      default:
        return (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-border-subtle bg-surface-default/80">
            <span className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
            <span className="grid grid-cols-2 gap-[2px]">
              <span className="h-[3px] rounded-[2px] bg-text-primary/65" />
              <span className="h-[3px] rounded-[2px] bg-text-primary/45" />
              <span className="h-[3px] rounded-[2px] bg-text-primary/45" />
              <span className="h-[3px] rounded-[2px] bg-text-primary/65" />
            </span>
          </span>
        );
    }
  };
  const lensOverviewPanel = lensOverviewCards.length ? (
    <section
      data-testid="design-lab-lens-overview"
      className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            Overview landing
          </Text>
          <Text as="div" className="mt-2 text-lg font-semibold text-text-primary">
            {isRecipeLikeLayer
              ? isPageLayer
                ? 'Page template clusters'
                : 'Workflow recipe clusters'
              : selectedTaxonomySection?.id === 'foundations'
                ? 'Foundation family grid'
                : 'Component catalog families'}
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            {isRecipeLikeLayer
              ? isPageLayer
                ? 'Template clusterlari, ekiplerin hangi tam sayfa shell ile baslayacagini hizli secmesi icin burada gorunur.'
                : 'Workflow clusterlari, tekrarlanan urun akislarini ilk bakista secilebilir hale getirmek icin burada listelenir.'
              : selectedTaxonomySection?.id === 'foundations'
                ? 'Tema, accessibility, diagnostics ve runtime aileleri benchmark referanslariyla birlikte gorunur.'
              : 'Secili component lensindeki aileler katalog girisi, item yogunlugu ve preview sinyalleriyle birlikte gorunur.'}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          {hiddenLensOverviewCount > 0 ? <SectionBadge label={`Featured ${limitedLensOverviewCards.length}`} /> : null}
          <SectionBadge label={`${lensOverviewCards.length} ${isRecipeLayer ? 'cluster' : 'family'}`} />
        </div>
      </div>
      {hiddenLensOverviewCount > 0 ? (
        <div className="mt-4 rounded-[20px] border border-border-subtle bg-surface-panel px-4 py-3">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            Featured families
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            Ilk ekranda yalniz en yogun 6 component ailesi gosteriliyor. Diger aileler urun agacinda ayni sekilde erisilebilir durumda.
          </Text>
          <div
            data-testid="design-lab-all-families-strip"
            className="mt-3 rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                All families
              </Text>
              <SectionBadge label={`${overflowLensOverviewCards.length} more`} />
            </div>
            <Text variant="secondary" className="mt-1 block text-xs leading-5">
              Featured gridden sonra kalan aileler burada kisa bir serit olarak gorunur; tam katalog sol taraftaki product tree icinde kalir.
            </Text>
            <div className="mt-2.5 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-1.5">
                {overflowLensOverviewCards.map((card) => {
                  const markerVariant = getFamilyRailMarkerVariant(card.groupId ?? card.key);
                  const markerLabel = getFamilyRailMarkerLabel(markerVariant);

                  return (
                    <button
                      key={`all-family-${card.key}`}
                      type="button"
                      onClick={() => card.groupId ? handleOverviewFamilySelect(card.groupId) : undefined}
                      data-testid={`design-lab-all-family-${toTestIdSuffix(card.key)}`}
                      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        card.groupId && selectedGroup?.id === card.groupId
                          ? 'border-action-primary/40 bg-surface-default text-text-primary shadow-xs'
                          : 'border-border-subtle bg-surface-canvas text-text-secondary hover:bg-surface-muted'
                      }`}
                    >
                      {renderFamilyRailMarker(markerVariant, card.visual.accentClass)}
                      <span className="rounded-full border border-border-subtle bg-surface-panel px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                        {markerLabel}
                      </span>
                      {`${card.title} / ${card.primaryMetric}`}
                    </button>
                  );
                })}
              </div>
            </div>
            {activeFamilyOverviewCard ? (
              (() => {
                const familyMarkerVariant = getFamilyRailMarkerVariant(activeFamilyOverviewCard.groupId ?? activeFamilyOverviewCard.key);
                const familyMarkerLabel = getFamilyRailMarkerLabel(familyMarkerVariant);
                const whyThisFamilyCopy = getWhyThisFamilyCopy(activeFamilyOverviewCard.groupId ?? activeFamilyOverviewCard.key);
                return (
                  <div className="mt-3 rounded-[18px] border border-border-subtle bg-surface-panel px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                        Active family
                      </Text>
                      <SectionBadge label={familyMarkerLabel} />
                      <SectionBadge label={activeFamilyOverviewCard.primaryMetric} />
                    </div>
                    <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                      {activeFamilyOverviewCard.title}
                    </Text>
                    <Text variant="secondary" className="mt-1 block text-xs leading-5">
                      {activeFamilyOverviewCard.description}
                    </Text>
                    <Text as="div" className="mt-2 text-[11px] font-semibold tracking-[0.06em] text-text-primary">
                      Why this family
                    </Text>
                    <Text variant="secondary" className="mt-1 block text-xs leading-5">
                      {whyThisFamilyCopy}
                    </Text>
                    {activeFamilyOverviewCard.outcome ? (
                      <Text variant="secondary" className="mt-1 block text-xs leading-5">
                        {activeFamilyOverviewCard.outcome}
                      </Text>
                    ) : null}
                  </div>
                );
              })()
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
        {limitedLensOverviewCards.map((card) => (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-[22px] border px-4 py-4 ${card.visual.borderClass} ${card.visual.surfaceClass} ${card.visual.glowClass}`}
            data-testid={`design-lab-lens-overview-card-${toTestIdSuffix(card.key)}`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${card.visual.accentClass}`} aria-hidden />
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                  {card.eyebrow}
                </Text>
                <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                  {card.title}
                </Text>
              </div>
              <SectionBadge label={card.primaryMetric} />
            </div>
            <div className="mt-3 rounded-[18px] border border-white/70 bg-white/35 px-3 py-3 backdrop-blur-xs">
              {renderOverviewSilhouette(card.silhouette)}
            </div>
            <Text variant="secondary" className="mt-2 block text-xs leading-5">
              {card.description}
            </Text>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2.5">
                <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                  {card.primaryMetricLabel ?? 'Coverage'}
                </Text>
                <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
                  {card.primaryMetric}
                </Text>
              </div>
              <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2.5">
                <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                  {card.secondaryMetricLabel ?? 'Signal'}
                </Text>
                <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
                  {card.secondaryMetric}
                </Text>
              </div>
            </div>
            {card.outcome ? (
              <div className="mt-3 rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
                <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                  {card.outcomeLabel ?? 'Outcome'}
                </Text>
                <Text as="div" className="mt-1 text-sm font-semibold leading-6 text-text-primary">
                  {card.outcome}
                </Text>
              </div>
            ) : null}
            {card.useWhen || card.avoidWhen ? (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
                  <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                    When to use
                  </Text>
                  <Text as="div" className="mt-1 text-sm font-semibold leading-6 text-text-primary">
                    {card.useWhen ?? '—'}
                  </Text>
                </div>
                <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
                  <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                    When not to use
                  </Text>
                  <Text as="div" className="mt-1 text-sm font-semibold leading-6 text-text-primary">
                    {card.avoidWhen ?? '—'}
                  </Text>
                </div>
              </div>
            ) : null}
            {card.highlights?.length ? (
              <div className="mt-3 rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
                <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                  {card.highlightLabel ?? 'Highlights'}
                </Text>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {card.highlights.map((highlight: string) => (
                    <SectionBadge key={`${card.key}-${highlight}`} label={highlight} />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.badges.map((badge) => (
                <SectionBadge key={`${card.key}-${badge}`} label={badge} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  ) : null;
  const pageTemplateLandingPanel = pageTemplateLandingCards.length ? (
    <section
      data-testid="design-lab-page-template-overview"
      className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-xs"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            Template entries
          </Text>
          <Text as="div" className="mt-2 text-lg font-semibold text-text-primary">
            Cluster seciminden sayfa iskeletine in
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            Cluster katmani genis resmi verir; bu ikinci seviye grid ise ekiplerin dogrudan hangi page shell ile baslayacagini secmesine yardim eder.
          </Text>
        </div>
        <SectionBadge label={`${pageTemplateLandingCards.length} templates`} />
      </div>
      <div className="flex flex-col mt-4 gap-4">
        {pageTemplateLandingClusters.map((cluster) => (
          <section
            key={cluster.title}
            data-testid={`design-lab-page-template-cluster-${toTestIdSuffix(cluster.title)}`}
            className="rounded-[22px] border border-border-subtle bg-surface-panel p-4"
          >
            {(() => {
              const activeCard = cluster.cards.find((card) => card.recipeId === familySelectionState.pages) ?? null;
              if (!activeCard) {
                return null;
              }
              return (
                <div
                  data-testid={`design-lab-page-template-current-${toTestIdSuffix(cluster.title)}`}
                  className={`mb-4 rounded-[20px] border px-4 py-4 ${activeCard.visual.borderClass} ${activeCard.visual.surfaceClass}`}
                >
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="min-w-0">
                      <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                        Current entry
                      </Text>
                      <Text as="div" className="mt-2 text-base font-semibold text-text-primary">
                        {activeCard.title}
                      </Text>
                      <Text variant="secondary" className="mt-1 block text-sm leading-6">
                        {getRecipeFamilyOutcome({
                          recipeId: activeCard.recipeId,
                          title: activeCard.title,
                          clusterTitle: activeCard.clusterTitle,
                        })}
                      </Text>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <SectionBadge label={activeCard.signal} />
                        <SectionBadge label={activeCard.primaryMetric} />
                        {activeCard.transitionTags?.map((tag) => (
                          <SectionBadge key={`${activeCard.recipeId}-${tag}`} label={tag} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[18px] border border-border-subtle bg-surface-default/75 px-3 py-3">
                      <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                        Related templates
                      </Text>
                      <Text variant="secondary" className="mt-1 block text-xs leading-5">
                        Ayni cluster icinde farkli bir sayfa ritmine gecmek icin yakin alternatifler.
                      </Text>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {cluster.cards
                          .filter((card) => card.recipeId !== activeCard.recipeId)
                          .slice(0, 3)
                          .map((card) => (
                            <button
                              key={`related-template-${card.recipeId}`}
                              type="button"
                              onClick={() => setPageSelectionId(card.recipeId)}
                              className="rounded-[16px] border border-border-subtle bg-surface-panel px-3 py-2 text-left transition hover:bg-surface-muted"
                            >
                              <Text as="div" className="text-xs font-semibold text-text-primary">
                                {card.title}
                              </Text>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                <SectionBadge label={card.signal} />
                                <SectionBadge label={card.primaryMetric} />
                                {card.transitionTags?.map((tag) => (
                                  <SectionBadge key={`related-${card.recipeId}-${tag}`} label={tag} />
                                ))}
                              </div>
                              <Text variant="secondary" className="mt-1 block text-[11px] leading-5">
                                {getTemplateSwitchReason({
                                  recipeId: card.recipeId,
                                  title: card.title,
                                  clusterTitle: card.clusterTitle,
                                })}
                              </Text>
                            </button>
                          ))}
                        {cluster.cards.filter((card) => card.recipeId !== activeCard.recipeId).length === 0 ? (
                          <Text variant="secondary" className="block text-xs leading-5">
                            Bu cluster icinde secili giris tek template olarak duruyor.
                          </Text>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                  Template cluster
                </Text>
                <Text as="div" className="mt-2 text-base font-semibold text-text-primary">
                  {cluster.title}
                </Text>
                <Text variant="secondary" className="mt-1 block text-sm leading-6">
                  {cluster.description}
                </Text>
              </div>
              <SectionBadge label={`${cluster.cards.length} templates`} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {cluster.cards.map((card) => {
                const active = familySelectionState.pages === card.recipeId;
                return (
                  <button
                    key={card.recipeId}
                    type="button"
                    onClick={() => setPageSelectionId(card.recipeId)}
                    data-testid={`design-lab-page-template-card-${toTestIdSuffix(card.recipeId)}`}
                    className={`relative overflow-hidden rounded-[22px] border px-4 py-4 text-left transition ${
                      active
                        ? `${card.visual.borderClass} ${card.visual.surfaceClass} ${card.visual.glowClass}`
                        : 'border-border-subtle bg-surface-default hover:bg-surface-muted'
                    }`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 ${card.visual.accentClass}`} aria-hidden />
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                          {card.clusterTitle}
                        </Text>
                        <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                          {card.title}
                        </Text>
                      </div>
                      <SectionBadge label={active ? 'Active template' : 'Open template'} />
                    </div>
                    <div className="mt-3 rounded-[18px] border border-white/70 bg-white/35 px-3 py-3 backdrop-blur-xs">
                      {renderOverviewSilhouette(card.silhouette)}
                    </div>
                    <Text variant="secondary" className="mt-2 block text-xs leading-5">
                      {card.description}
                    </Text>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2.5">
                        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                          Product problem
                        </Text>
                        <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
                          {card.signal}
                        </Text>
                      </div>
                      <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2.5">
                        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                          {card.primaryMetricLabel}
                        </Text>
                        <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
                          {card.primaryMetric}
                        </Text>
                      </div>
                    </div>
                    <div className="mt-3 rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
                      <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                        Success outcome
                      </Text>
                      <Text as="div" className="mt-1 text-sm font-semibold leading-6 text-text-primary">
                        {getRecipeFamilyOutcome({
                          recipeId: card.recipeId,
                          title: card.title,
                          clusterTitle: card.clusterTitle,
                        })}
                      </Text>
                    </div>
                    <div className="mt-3 rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
                      <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
                        {card.highlightLabel}
                      </Text>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {card.highlights.map((highlight) => (
                          <SectionBadge key={`${card.recipeId}-${highlight}`} label={highlight} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <SectionBadge label={card.clusterTitle} />
                      <SectionBadge label={card.secondaryMetric} />
                      {card.transitionTags?.map((tag) => (
                        <SectionBadge key={`card-${card.recipeId}-${tag}`} label={tag} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  ) : null;
  const selectedApiItem = selectedItem ? componentApiMap.get(selectedItem.name) ?? null : null;
  const selectedUsageRecipes = selectedItem ? buildUsageRecipes(selectedItem, selectedApiItem ?? undefined, t, trackMeta) : [];
  const selectedTrackLabel = selectedItem ? trackMeta[resolveItemTrack(selectedItem)].label : null;
  const renderComponentDetailContent = () => (
    <DesignLabComponentDetailSections
      activeTab={detailTab}
      activeApiPanel={activeComponentApiPanel}
      activeQualityPanel={activeComponentQualityPanel}
      item={selectedItem}
      generalContent={renderComponentGeneralTab(selectedItem)}
      overviewContent={renderOverviewTab(selectedItem)}
      demoContent={componentDemoContent}
      apiItem={selectedApiItem}
      usageRecipes={selectedUsageRecipes}
      trackLabel={selectedTrackLabel}
      onApiPanelChange={setActiveComponentApiPanel}
      onQualityPanelChange={setActiveComponentQualityPanel}
      onCopyImport={() => {
        if (selectedItem?.importStatement) {
          handleCopy(selectedItem.importStatement);
        }
      }}
      DocsSectionComponent={LibraryDocsSection}
      DetailLabelComponent={DetailLabel}
      SectionBadgeComponent={SectionBadge}
      MetricCardComponent={LibraryMetricCard}
      CodeBlockComponent={LibraryCodeBlock}
      PropsTableComponent={LibraryPropsTable}
      UsageRecipesPanelComponent={LibraryUsageRecipesPanel}
    />
  );
  const renderRecipeDetailContent = () => (
    <DesignLabRecipeDetailSections
      activeTab={detailTab}
      activeOverviewPanel={activeRecipeOverviewPanel}
      activeApiPanel={activeRecipeApiPanel}
      activeQualityPanel={activeRecipeQualityPanel}
      recipe={selectedFamily}
      generalContent={renderRecipeGeneralTab()}
      demoContent={recipeDemoContent}
      recipeContractId={familySummary?.contractId ?? null}
      selectedRecipeTracks={selectedFamilyTracks}
      selectedRecipeSections={selectedFamilySections}
      selectedRecipeThemes={selectedFamilyThemes}
      selectedRecipeQualityGates={selectedFamilyQualityGates}
      selectedRecipeItems={selectedFamilyItems}
      onApiPanelChange={setActiveRecipeApiPanel}
      onQualityPanelChange={setActiveRecipeQualityPanel}
      onOverviewPanelChange={setActiveRecipeOverviewPanel}
      DocsSectionComponent={LibraryDocsSection}
      DetailLabelComponent={DetailLabel}
      SectionBadgeComponent={SectionBadge}
      MetricCardComponent={LibraryMetricCard}
      ShowcaseCardComponent={LibraryShowcaseCard}
      CodeBlockComponent={LibraryCodeBlock}
      UsageRecipesPanelComponent={LibraryUsageRecipesPanel}
    />
  );
  const renderPageDetailContent = () => (
    <DesignLabPageDetailSections
      activeTab={detailTab}
      activeOverviewPanel={activePageOverviewPanel}
      activeApiPanel={activePageApiPanel}
      activeQualityPanel={activePageQualityPanel}
      template={selectedPageTemplate}
      generalContent={renderPageGeneralTab()}
      demoContent={pageDemoContent}
      templateContractId={selectedPageTemplateContractId}
      selectedTemplateTracks={selectedPageTemplateTracks}
      selectedTemplateSections={selectedPageTemplateSections}
      selectedTemplateThemes={selectedPageTemplateThemes}
      selectedTemplateQualityGates={selectedPageTemplateQualityGates}
      selectedTemplateItems={selectedPageTemplateItems}
      onApiPanelChange={setActivePageApiPanel}
      onQualityPanelChange={setActivePageQualityPanel}
      onOverviewPanelChange={setActivePageOverviewPanel}
      DocsSectionComponent={LibraryDocsSection}
      DetailLabelComponent={DetailLabel}
      SectionBadgeComponent={SectionBadge}
      MetricCardComponent={LibraryMetricCard}
      ShowcaseCardComponent={LibraryShowcaseCard}
      CodeBlockComponent={LibraryCodeBlock}
      UsageRecipesPanelComponent={LibraryUsageRecipesPanel}
    />
  );
  const renderFoundationDetailContent = () => (
    <DesignLabFoundationDetailSections
      activeTab={detailTab as 'overview' | 'demo' | 'api' | 'quality'}
      activeOverviewPanel={activeFoundationOverviewPanel}
      activeApiPanel={activeFoundationApiPanel}
      activeQualityPanel={activeFoundationQualityPanel}
      foundation={selectedFoundationFamily}
      demoContent={foundationDemoContent}
      foundationContractId={selectedItem?.acceptanceContractId ?? null}
      selectedFoundationTokens={selectedFoundationTokens}
      selectedFoundationThemes={selectedFoundationThemes}
      selectedFoundationA11yGates={selectedFoundationA11yGates}
      selectedFoundationItems={selectedFoundationItems}
      onApiPanelChange={setActiveFoundationApiPanel}
      onQualityPanelChange={setActiveFoundationQualityPanel}
      onOverviewPanelChange={setActiveFoundationOverviewPanel}
      DocsSectionComponent={LibraryDocsSection}
      DetailLabelComponent={DetailLabel}
      SectionBadgeComponent={SectionBadge}
      MetricCardComponent={LibraryMetricCard}
      ShowcaseCardComponent={LibraryShowcaseCard}
      CodeBlockComponent={LibraryCodeBlock}
    />
  );
  const detailContentKind = resolveDesignLabPageShellDetailContentKind(
    activePageShellLayerId,
  );
  const foundationDetailContent = renderFoundationDetailContent();
  const componentDetailContent = renderComponentDetailContent();
  const recipeDetailContent = renderRecipeDetailContent();
  const pageDetailContent = renderPageDetailContent();
  const renderEcosystemDetailContent = () => (
    <DesignLabEcosystemDetailSections
      activeTab={detailTab}
      activeOverviewPanel={activeEcosystemOverviewPanel}
      activeApiPanel={activeEcosystemApiPanel}
      activeQualityPanel={activeEcosystemQualityPanel}
      extension={selectedEcosystemExtension}
      generalContent={renderRecipeGeneralTab()}
      demoContent={ecosystemDemoContent}
      extensionContractId={familySummary?.contractId ?? null}
      selectedExtensionSurfaces={selectedEcosystemSurfaces}
      selectedExtensionTiers={selectedEcosystemTiers}
      selectedExtensionQualityGates={selectedEcosystemQualityGates}
      selectedExtensionItems={selectedEcosystemItems}
      onApiPanelChange={setActiveEcosystemApiPanel}
      onQualityPanelChange={setActiveEcosystemQualityPanel}
      onOverviewPanelChange={setActiveEcosystemOverviewPanel}
      DocsSectionComponent={LibraryDocsSection}
      DetailLabelComponent={DetailLabel}
      SectionBadgeComponent={SectionBadge}
      MetricCardComponent={LibraryMetricCard}
      ShowcaseCardComponent={LibraryShowcaseCard}
      CodeBlockComponent={LibraryCodeBlock}
    />
  );
  const ecosystemDetailContent = renderEcosystemDetailContent();
  const activeDetailContent =
    detailContentKind === 'foundations'
      ? foundationDetailContent
      : detailContentKind === 'pages'
        ? pageDetailContent
        : detailContentKind === 'recipes'
          ? recipeDetailContent
          : detailContentKind === 'ecosystem'
            ? ecosystemDetailContent
            : componentDetailContent;
  const layerSidebarStats = resolveDesignLabPageShellSidebarStats({
    layerId: activePageShellLayerId,
    activeWorkspaceLabel,
    activeLensLabel: activeLens.label,
    selectedTaxonomySectionTitle: selectedTaxonomySection?.title ?? null,
    foundationFamilyTitle: selectedFoundationProfile?.title ?? selectedGroup?.title ?? null,
    pageFamilyTitle: selectedPageTemplateFamilyTitle,
    familyClusterTitle: selectedFamilyClusterTitle,
    componentVisibleCount: itemsForTrack.length,
    componentFilteredCount: filteredItems.length,
    componentStableCount: itemsForTrack.filter((item) => item.lifecycle === 'stable').length,
    visibleFamilyCount: filteredFamilyItems.length,
    totalFamilyCount: familyCatalogItems.length,
    ownerBlocksCount: filteredFamilyItems.reduce((sum, family) => sum + family.ownerBlocks.length, 0),
    boundComponentsCount: Array.from(new Set(filteredFamilyItems.flatMap((family) => family.ownerBlocks))).length,
  });
  const sidebarStats = layerSidebarStats.map((item) => ({
    label: item.label,
    value: item.value,
  }));
  function renderMetadataDescriptorItems(items: DesignLabMetadataDescriptor[]) {
    return items.map((item) => ({
      label: item.label,
      value: (
        <Text
          as="div"
          className={`${item.compact ? 'break-all text-xs font-medium' : 'font-semibold'} ${item.valueClassName ?? 'text-text-primary'}`}
        >
          {item.value}
        </Text>
      ),
      note: item.note,
    }));
  }
  const foundationActiveMetadataItems = renderMetadataDescriptorItems(
    resolveDesignLabFoundationMetadataItems({
      detailTab,
      activeWorkspaceLabel,
      primaryLensLabel: t('designlab.metadata.primaryLens'),
      primaryLensValue: selectedTaxonomySection?.title ?? activeLens.label,
      familyTitle: selectedFoundationProfile?.title ?? selectedGroup?.title ?? null,
      benchmark: selectedFoundationProfile?.benchmark ?? null,
      trackLabel: t('designlab.metadata.track'),
      trackValue: selectedTrackLabel,
      visibleCount: selectedComponentFamilyItems.length || filteredItems.length,
      contractId: selectedItem?.acceptanceContractId ?? null,
      kind: selectedItem?.kind ?? null,
      qualityGatesCount: selectedItem?.qualityGates?.length ?? 0,
      statusLabel: selectedItem ? statusLabel[selectedItem.lifecycle] : t('designlab.metadata.mode.noSelection'),
      statusValueClassName: selectedItem ? statusToneClass[selectedItem.lifecycle] : 'text-text-secondary',
      availabilityValue: selectedItem ? availabilityLabel[selectedItem.availability] : '—',
    }),
  );
  const componentActiveMetadataItems = renderMetadataDescriptorItems(
    resolveDesignLabComponentMetadataItems({
      detailTab,
      activeComponentApiPanel,
      activeComponentQualityPanel,
      primaryLensLabel: 'Primary Lens',
      primaryLensValue: selectedComponentPrimarySectionTitle ?? 'Components',
      trackValue: selectedTrackLabel,
      groupValue: selectedGroup?.title ?? selectedItem?.taxonomyGroupId ?? null,
      demoValue: selectedItem ? demoModeLabel[selectedItem.demoMode] : '—',
      usageLabel: t('designlab.metadata.usage'),
      usageCount: selectedItem?.whereUsed.length ?? 0,
      kind: selectedItem?.kind ?? null,
      contractId: selectedItem?.acceptanceContractId ?? null,
      variantAxesCount: selectedApiItem?.variantAxes.length ?? 0,
      stateModelCount: selectedApiItem?.stateModel.length ?? 0,
      previewFocusCount: selectedApiItem?.previewFocus.length ?? 0,
      regressionCount: selectedApiItem?.regressionFocus.length ?? 0,
      propsCount: selectedApiItem?.props.length ?? 0,
      requiredPropsCount: selectedApiItem?.props.filter((prop) => prop.required).length ?? 0,
      defaultsCount: selectedApiItem?.props.filter((prop) => prop.default && prop.default !== '—').length ?? 0,
      usageRecipeCount: selectedUsageRecipes.length,
      whereUsedCount: selectedItem?.whereUsed.length ?? 0,
      qualityGatesCount: selectedItem?.qualityGates?.length ?? 0,
      statusLabel: selectedItem ? statusLabel[selectedItem.lifecycle] : t('designlab.metadata.mode.noSelection'),
      statusValueClassName: selectedItem ? statusToneClass[selectedItem.lifecycle] : 'text-text-secondary',
      availabilityValue: selectedItem ? availabilityLabel[selectedItem.availability] : '—',
      packageName: '@mfe/design-system',
    }),
  );
  const recipeActiveMetadataItems = renderMetadataDescriptorItems(
    resolveDesignLabRecipeMetadataItems({
      detailTab,
      activeRecipeApiPanel,
      activeRecipeQualityPanel,
      activeWorkspaceLabel,
      primaryLensLabel: 'Primary Lens',
      primaryLensValue: selectedFamilyPrimarySectionTitle ?? 'Recipes',
      tracksLabel: t('designlab.metadata.tracks'),
      sectionsLabel: t('designlab.metadata.sections'),
      themesLabel: t('designlab.metadata.themes'),
      selectedRecipeIdentity,
      ownerBlocksCount: selectedFamily?.ownerBlocks.length ?? 0,
      selectedFamilyTracks,
      selectedFamilySectionsCount: selectedFamilySections.length,
      selectedFamilyThemesCount: selectedFamilyThemes.length,
      selectedFamilyClusterTitle,
      contractId: familySummary?.contractId ?? null,
      qualityGatesCount: selectedFamilyQualityGates.length,
      stableCount: selectedFamilyItems.filter((item) => item.lifecycle === 'stable').length,
      betaCount: selectedFamilyItems.filter((item) => item.lifecycle === 'beta').length,
      liveDemoCount: selectedFamilyItems.filter((item) => item.demoMode === 'live').length,
    }),
  );
  const pageActiveMetadataItems = renderMetadataDescriptorItems(
    resolveDesignLabPageMetadataItems({
      detailTab,
      activePageApiPanel,
      activePageQualityPanel,
      activeWorkspaceLabel,
      primaryLensLabel: t('designlab.metadata.primaryLens'),
      primaryLensValue: selectedTaxonomySection?.title ?? activeLens.label,
      tracksLabel: t('designlab.metadata.tracks'),
      sectionsLabel: t('designlab.metadata.sections'),
      themesLabel: t('designlab.metadata.themes'),
      selectedPageIdentity,
      selectedPageDisplayTitle,
      selectedPageTemplateFamilyTitle,
      selectedPageTemplateContractId,
      ownerBlocksCount: selectedPageTemplate?.ownerBlocks.length ?? 0,
      selectedPageTemplateTracks,
      selectedPageTemplateSectionsCount: selectedPageTemplateSections.length,
      selectedPageTemplateThemesCount: selectedPageTemplateThemes.length,
      selectedPageTemplateQualityGatesCount: selectedPageTemplateQualityGates.length,
      stableCount: selectedPageTemplateItems.filter((item) => item.lifecycle === 'stable').length,
      betaCount: selectedPageTemplateItems.filter((item) => item.lifecycle === 'beta').length,
      liveDemoCount: selectedPageTemplateItems.filter((item) => item.demoMode === 'live').length,
    }),
  );
  const activeMetadataItems =
    activePageShellLayerId === 'foundations'
      ? foundationActiveMetadataItems
      : activePageShellLayerId === 'pages'
        ? pageActiveMetadataItems
        : activePageShellLayerId === 'recipes'
          ? recipeActiveMetadataItems
          : componentActiveMetadataItems;
  const legacyAdapterOriginSectionTitle = useMemo(
    () =>
      legacyAdapterOriginSectionId
        ? t(`designlab.taxonomy.sections.${legacyAdapterOriginSectionId}.title`)
        : null,
    [legacyAdapterOriginSectionId, t],
  );
  const legacyAdapterTargetSectionTitle = useMemo(
    () => {
      if (!legacyAdapterOriginSectionId) {
        return null;
      }

      const canonicalSectionId = normalizeDesignLabSectionId(legacyAdapterOriginSectionId);
      return canonicalSectionId
        ? t(`designlab.taxonomy.sections.${canonicalSectionId}.title`)
        : null;
    },
    [legacyAdapterOriginSectionId, t],
  );
  const legacyAdapterNoticeAction = useMemo(
    () => resolveLegacyAdapterNoticeAction(legacyAdapterOriginSectionId),
    [legacyAdapterOriginSectionId],
  );
  const handleLegacyAdapterNoticeAction = React.useCallback(() => {
    if (!legacyAdapterNoticeAction || !legacyAdapterOriginSectionId) {
      return;
    }

    const canonicalSectionId = normalizeDesignLabSectionId(legacyAdapterOriginSectionId);
    if (canonicalSectionId) {
      recordDesignLabLegacyAliasTelemetry({
        aliasSectionId: legacyAdapterOriginSectionId,
        canonicalSectionId,
        source: 'notice_cta',
        targetId: legacyAdapterNoticeAction.targetId,
      });
    }

    setLegacyAdapterOriginSectionId(null);
    legacyAdapterCanonicalizationPendingRef.current = false;

    if (legacyAdapterNoticeAction.kind === 'component-family') {
      handleOverviewFamilySelect(legacyAdapterNoticeAction.targetId);
      return;
    }

    handleSidebarFamilySelect(legacyAdapterNoticeAction.targetId);
  }, [
    handleOverviewFamilySelect,
    handleSidebarFamilySelect,
    legacyAdapterNoticeAction,
    legacyAdapterOriginSectionId,
  ]);
  const legacyAdapterNotice = legacyAdapterOriginSectionId && legacyAdapterOriginSectionTitle && legacyAdapterTargetSectionTitle ? (
    <div
      data-testid="design-lab-legacy-adapter-notice"
      className="rounded-[20px] border border-state-warning-border/50 bg-[linear-gradient(180deg,rgba(255,248,229,0.9),rgba(255,250,238,0.96))] px-4 py-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="warning">{t('designlab.taxonomy.badges.adapter')}</Badge>
        <SectionBadge label={legacyAdapterOriginSectionTitle} />
        <SectionBadge label={`→ ${legacyAdapterTargetSectionTitle}`} />
      </div>
      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
        {t('designlab.taxonomy.adapterNotice.title')}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {t('designlab.taxonomy.adapterNotice.description', {
          source: legacyAdapterOriginSectionTitle,
          target: legacyAdapterTargetSectionTitle,
        })}
      </Text>
      {legacyAdapterNoticeAction ? (
        <div className="mt-3">
          <Button
            variant="secondary"
            size="sm"
            data-testid={legacyAdapterNoticeAction.testId}
            onClick={handleLegacyAdapterNoticeAction}
          >
            {t(legacyAdapterNoticeAction.translationKey)}
          </Button>
        </div>
      ) : null}
    </div>
  ) : null;
  const breadcrumbs = (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
      <span className="font-semibold uppercase tracking-[0.18em] text-text-secondary">{t('designlab.breadcrumb.docs')}</span>
      <span>/</span>
      <span>{t('designlab.breadcrumb.library')}</span>
      <span>/</span>
      <span>
        {isRecipeLikeLayer
          ? selectedTaxonomySection?.title ?? activeLens.label
          : selectedTaxonomySection?.title ?? selectedGroup?.title ?? trackMeta[activeTrack].label}
      </span>
      {isTreeBasedLayer && selectedGroup ? (
        <>
          <span>/</span>
          <span>{selectedGroup.title}</span>
        </>
      ) : null}
      {isRecipeLikeLayer ? (isPageLayer ? selectedPageTemplate : selectedFamily) ? (
        <>
          <span>/</span>
          <span className="font-medium text-text-primary">
            {isPageLayer ? selectedPageDisplayTitle : selectedRecipeDisplayTitle}
          </span>
        </>
      ) : null : selectedItem ? (
        <>
          <span>/</span>
          <span className="font-medium text-text-primary">{selectedItem.name}</span>
        </>
      ) : null}
    </div>
  );
  const heroTopBadges = (
    <>
      <SectionBadge label={activeWorkspaceLabel} />
      {selectedTaxonomySection ? <SectionBadge label={selectedTaxonomySection.title} /> : null}
      {legacyAdapterOriginSectionTitle ? <Badge variant="warning">{t('designlab.taxonomy.badges.adapter')}</Badge> : null}
      {legacyAdapterOriginSectionTitle ? <SectionBadge label={legacyAdapterOriginSectionTitle} /> : null}
      {isRecipeLikeLayer ? (
        (isPageLayer ? selectedPageTemplate : selectedFamily) ? (
          <>
            <Badge variant={activeTaxonomySectionId === 'pages' ? 'success' : 'info'}>{activeLens.badge}</Badge>
            {(isPageLayer ? selectedPageTemplateFamilyTitle : selectedFamilyClusterTitle)
              ? (
                <SectionBadge
                  label={(isPageLayer ? selectedPageTemplateFamilyTitle : selectedFamilyClusterTitle) ?? ''}
                />
              )
              : null}
          </>
        ) : null
      ) : selectedItem ? (
        <Badge variant={selectedItem.lifecycle === 'stable' ? 'success' : selectedItem.lifecycle === 'beta' ? 'warning' : 'info'}>
          {statusLabel[selectedItem.lifecycle]}
        </Badge>
      ) : null}
    </>
  );
  const effectiveHeroSupportingContent = legacyAdapterNotice && heroSupportingContent
    ? <div className="flex flex-col gap-4">{legacyAdapterNotice}{heroSupportingContent}</div>
    : legacyAdapterNotice ?? heroSupportingContent;
  const heroAction = activeSectionWorkspaceMode === 'components' && selectedItem?.importStatement ? (
    <Button variant="secondary" className="ml-auto" onClick={() => handleCopy(selectedItem.importStatement)}>
      Import kopyala
    </Button>
  ) : null;
  const copiedMessage = copied === 'ok'
    ? t('designlab.copy.success')
    : copied === 'fail'
      ? t('designlab.copy.failure')
      : null;
  const detailPanelResetKey = `${activePageShellLayerId}:${activeTaxonomySectionId}`;
  const handleDetailViewReset = React.useCallback(() => {
    setAnchorValue('overview');
    setActiveOverviewPanel('release');
    setActiveRecipeOverviewPanel('summary');
    setActivePageOverviewPanel('summary');
    setActiveComponentApiPanel('contract');
    setActiveRecipeApiPanel('contract');
    setActivePageApiPanel('contract');
    setActiveComponentQualityPanel('gates');
    setActiveRecipeQualityPanel('gates');
    setActivePageQualityPanel('gates');
    setActiveComponentPreviewPanel('live');
    setActiveRecipePreviewPanel('live');
    setActivePagePreviewPanel('live');
  }, []);
  const releaseMetadataDescriptors = releaseSummary
    ? resolveDesignLabReleaseMetadataItems({
        layerId: activePageShellLayerId,
        packageName: releaseSummary.packageName,
        packageVersion: releaseSummary.packageVersion,
        latestReleaseDate: releaseSummary.latestRelease.date || null,
        readyDistributionTargetCount,
        distributionTargetCount: releaseSummary.distributionTargets.length,
        evidenceCount: releaseSummary.latestRelease.evidenceRefs.length,
        familyTitle: selectedItem ? selectedGroup?.title ?? selectedItem.taxonomyGroupId : null,
        waveId: selectedItem ? selectedItem.roadmapWaveId ?? 'legacy_surface' : null,
      })
    : null;
  const releaseMetadataItems = releaseMetadataDescriptors
    ? renderMetadataDescriptorItems(releaseMetadataDescriptors)
    : null;
  const adoptionMetadataDescriptors = adoptionSummary
    ? resolveDesignLabAdoptionMetadataItems({
        layerId: activePageShellLayerId,
        coveragePercent: adoptionSummary.apiCoverage.coveragePercent,
        readySurfaceCount: adoptionSummary.releaseReadiness.wideAdoptionReady,
        usedByAppsCount: adoptionSummary.surfaceSummary.consumedByAppsExports,
        privateGuardStatus: adoptionSummary.internalSurfaceProtection.status,
      })
    : null;
  const adoptionMetadataItems = adoptionMetadataDescriptors
    ? renderMetadataDescriptorItems(adoptionMetadataDescriptors)
    : null;
  const migrationMetadataDescriptors = migrationSummary
    ? resolveDesignLabMigrationMetadataItems({
        layerId: activePageShellLayerId,
        adoptedCount: migrationSummary.summary.adoptedOutsideLabComponents,
        consumerAppsCount: migrationSummary.summary.consumerAppsCount,
        storyCoveragePercent: migrationSummary.summary.adoptedStoryCoveragePercent,
        stableOnlyLabCount: migrationSummary.summary.stableOnlyInDesignLab,
      })
    : null;
  const migrationMetadataItems = migrationMetadataDescriptors
    ? renderMetadataDescriptorItems(migrationMetadataDescriptors)
    : null;
  const overviewSupplementalMetadataKind =
    resolveDesignLabPageShellOverviewSupplementalMetadataKind({
      layerId: activePageShellLayerId,
      detailTab,
      activeOverviewPanel: effectiveOverviewPanel,
    });
  const rightRailReleaseMetadataItems =
    overviewSupplementalMetadataKind === 'release'
      ? releaseMetadataItems
      : null;
  const rightRailAdoptionMetadataItems =
    overviewSupplementalMetadataKind === 'adoption'
      ? adoptionMetadataItems
      : null;
  const rightRailMigrationMetadataItems =
    overviewSupplementalMetadataKind === 'migration'
      ? migrationMetadataItems
      : null;
  const rightRailDetailTabs = resolveDesignLabPageShellRightRailTabs({
    layerId: activePageShellLayerId,
    detailTab,
    detailTabMeta: detailTabMeta.map((tab) => ({ id: tab.id, label: tab.label })),
    overviewPanelItems: overviewPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    recipeOverviewPanelItems: recipeOverviewPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    pageOverviewPanelItems: pageOverviewPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    componentApiPanelItems: componentApiPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    recipeApiPanelItems: recipeApiPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    pageApiPanelItems: pageApiPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    componentQualityPanelItems: componentQualityPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    recipeQualityPanelItems: recipeQualityPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    pageQualityPanelItems: pageQualityPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    componentPreviewPanelItems: componentPreviewPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    recipePreviewPanelItems: recipePreviewPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
    pagePreviewPanelItems: pagePreviewPanelItems.map((panel) => ({ id: panel.id, label: panel.label })),
  });
  const rightRailActiveId = resolveDesignLabPageShellRightRailActiveId({
    layerId: activePageShellLayerId,
    detailTab,
    effectiveOverviewPanel,
    activeRecipeOverviewPanel,
    activePageOverviewPanel,
    activeComponentPreviewPanel,
    activeRecipePreviewPanel,
    activePagePreviewPanel,
    activeComponentApiPanel,
    activeRecipeApiPanel,
    activePageApiPanel,
    activeComponentQualityPanel,
    activeRecipeQualityPanel,
    activePageQualityPanel,
    overviewPanelItemsLength: overviewPanelItems.length,
  });
  const rightRailHasContent = rightRailDetailTabs.length > 0
    || sidebarStats.length > 0
    || Boolean(rightRailReleaseMetadataItems?.length)
    || Boolean(rightRailAdoptionMetadataItems?.length)
    || Boolean(rightRailMigrationMetadataItems?.length)
    || activeMetadataItems.length > 0;
  const pageGridClassName = `grid grid-cols-1 gap-6 ${
    rightRailHasContent
      ? rightRailOpen
        ? 'xl:grid-cols-[300px_minmax(0,1fr)_260px]'
        : 'xl:grid-cols-[300px_minmax(0,1fr)_52px]'
      : 'xl:grid-cols-[300px_minmax(0,1fr)]'
  }`;
  const handleRightRailSelect = (tabId: string) => {
    const selectionKind = resolveDesignLabPageShellRightRailSelectionKind({
      layerId: activePageShellLayerId,
      detailTab,
      overviewPanelItemsLength: overviewPanelItems.length,
    });

    if (selectionKind === 'component-overview') {
      setActiveOverviewPanel(tabId as DesignLabOverviewPanelId);
      return;
    }

    if (selectionKind === 'recipe-overview') {
      setActiveRecipeOverviewPanel(tabId as DesignLabRecipeOverviewPanelId);
      return;
    }

    if (selectionKind === 'page-overview') {
      setActivePageOverviewPanel(tabId as DesignLabPageOverviewPanelId);
      return;
    }

    if (selectionKind === 'component-preview') {
      setActiveComponentPreviewPanel(tabId as DesignLabPreviewPanelId);
      return;
    }

    if (selectionKind === 'recipe-preview') {
      setActiveRecipePreviewPanel(tabId as DesignLabPreviewPanelId);
      return;
    }

    if (selectionKind === 'page-preview') {
      setActivePagePreviewPanel(tabId as DesignLabPreviewPanelId);
      return;
    }

    if (selectionKind === 'component-api') {
      setActiveComponentApiPanel(tabId as DesignLabComponentApiPanelId);
      return;
    }

    if (selectionKind === 'recipe-api') {
      setActiveRecipeApiPanel(tabId as DesignLabRecipeApiPanelId);
      return;
    }

    if (selectionKind === 'page-api') {
      setActivePageApiPanel(tabId as DesignLabPageApiPanelId);
      return;
    }

    if (selectionKind === 'component-quality') {
      setActiveComponentQualityPanel(tabId as DesignLabComponentQualityPanelId);
      return;
    }

    if (selectionKind === 'recipe-quality') {
      setActiveRecipeQualityPanel(tabId as DesignLabRecipeQualityPanelId);
      return;
    }

    if (selectionKind === 'page-quality') {
      setActivePageQualityPanel(tabId as DesignLabPageQualityPanelId);
      return;
    }

    setDetailTab(tabId as DesignLabDetailTab);
  };

  return (
    <div data-testid="design-lab-page" className="min-h-screen bg-surface-canvas">
      <div className="mx-auto max-w-[1880px] px-4 py-5 xl:px-6">
        <div className={pageGridClassName}>
          <DesignLabSidebar
            activeLayerId={activeTaxonomySectionId}
            sidebarHelpText={sidebarHelpText}
            sidebarSearchValue={sidebarSearchValue}
            sidebarSearchPlaceholder={sidebarSearchPlaceholder}
            activeTaxonomySectionTitle={selectedTaxonomySection?.title ?? null}
            foundationFamilyTitle={isFoundationLayer
              ? selectedFoundationProfile?.title ?? selectedGroup?.title ?? selectedTaxonomySection?.title ?? activeLens.label
              : null}
            foundationFamilyDescription={isFoundationLayer
              ? selectedFoundationProfile?.description ?? activeLens.useWhen
              : null}
            foundationFamilyBadges={isFoundationLayer
              ? [
                  ...(selectedFoundationProfile?.badges ?? [selectedTaxonomySection?.title ?? activeLens.label]),
                  `${filteredItems.length} item`,
                ]
              : []}
            componentFamilyTitle={activeSectionWorkspaceMode === 'components'
              ? selectedGroup?.title ?? selectedTaxonomySection?.title ?? activeLens.label
              : null}
            componentFamilyDescription={activeSectionWorkspaceMode === 'components'
              ? selectedItem?.taxonomySubgroup ?? activeLens.useWhen
              : null}
            componentFamilyBadges={activeSectionWorkspaceMode === 'components'
              ? [
                  ...(selectedTaxonomySection?.title ? [selectedTaxonomySection.title] : [activeLens.label]),
                  ...(selectedItem?.taxonomySubgroup ? [selectedItem.taxonomySubgroup] : []),
                  `${selectedComponentFamilyItems.length || filteredItems.length} item`,
                ]
              : []}
            familyItems={sidebarFamilyItems}
            selectedFamilyId={activeFamilySelectionId}
            onFamilySelect={handleSidebarFamilySelect}
            onSearchChange={(value) => {
              if (activeSectionWorkspaceMode === 'recipes' || activeSectionWorkspaceMode === 'pages') {
                setFamilyQuery(value);
                return;
              }
              setQuery(value);
            }}
            treeTracks={treeTracks}
            treeSelection={treeSelection}
            onTreeSelectionChange={handleSidebarTreeSelectionChange}
            ProductTreeComponent={LibraryProductTree}
            SectionBadgeComponent={SectionBadge}
          />

          <main className="flex flex-col min-w-0 gap-5">
            <DesignLabHero
              breadcrumbs={breadcrumbs}
              topBadges={heroTopBadges}
              activeHeroLabel={activeHeroLabel}
              activeHeroTitle={activeHeroTitle}
              activeHeroDescription={activeHeroDescription}
              supportingContent={effectiveHeroSupportingContent}
              action={heroAction}
              copiedMessage={copiedMessage}
            />

            {showCatalogLandingContext ? lensOverviewPanel : null}
            {showCatalogLandingContext ? pageTemplateLandingPanel : null}

            <div data-testid="design-lab-detail-tabs">
              <DetailSectionTabs
                tabs={detailTabMeta.map((tab) => ({
                  id: tab.id,
                  label: tab.label,
                  description: tab.description,
                  dataTestId: `design-lab-tab-${tab.id}`,
                }))}
                activeTabId={detailTab}
                onTabChange={(tabId) => setDetailTab(tabId as DesignLabDetailTab)}
                autoWrapBreakpoint="xl"
              />
            </div>

            <DesignLabDetailPanel resetKey={detailPanelResetKey} onResetView={handleDetailViewReset}>
              {activeDetailContent}
            </DesignLabDetailPanel>
          </main>
          <DesignLabRightRail
            isOpen={rightRailOpen}
            onToggle={() => setRightRailOpen((current) => !current)}
            openLabel={t('designlab.rightRail.open')}
            closeLabel={t('designlab.rightRail.close')}
            detailTabs={rightRailDetailTabs}
            activeDetailTabId={rightRailActiveId}
            onOutlineSelect={handleRightRailSelect}
            sidebarStats={sidebarStats}
            contextMetadataTitle="Lens guide"
            contextMetadataItems={lensGuideMetadataItems}
            releaseMetadataItems={rightRailReleaseMetadataItems}
            adoptionMetadataItems={rightRailAdoptionMetadataItems}
            migrationMetadataItems={rightRailMigrationMetadataItems}
            activeMetadataItems={activeMetadataItems}
            OutlinePanelComponent={LibraryOutlinePanel}
            StatsPanelComponent={LibraryStatsPanel}
            MetadataPanelComponent={LibraryMetadataPanel}
          />
        </div>
      </div>
    </div>
  );
};

export default DesignLabPage;
