import React from 'react';
import {
  Alert,
  Badge,
  Button,
  DetailDrawer,
  Dropdown,
  Popover,
  ContextMenu,
  EntitySummaryBlock,
  FilterBar,
  FormDrawer,
  IconButton,
  LinkInline,
  Modal,
  PageHeader,
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
  ReportFilterPanel,
  Select,
  Segmented,
  TextInput,
  CommandPalette,
  RecommendationCard,
  ApprovalCheckpoint,
  ApprovalReview,
  AIGuidedAuthoring,
  CitationPanel,
  AIActionAuditTimeline,
  DetailSummary,
  EmptyErrorLoading,
  Descriptions,
  SearchFilterListing,
  Skeleton,
  Spinner,
  SummaryStrip,
  Tag,
  Tabs,
  Text,
  ThemePreviewCard,
  Tooltip,
  TourCoachmarks,
  Avatar,
  ThemePresetCompare,
  ThemePresetGallery,
  Divider,
} from '@mfe/design-system';
import {
  LibraryQueryProvider,
  LibraryDetailLabel as DetailLabel,
  LibraryMetricCard,
  LibraryPreviewPanel,
  LibrarySectionBadge as SectionBadge,
  LibraryShowcaseCard,
} from '../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import { useDesignLabI18n } from '../useDesignLabI18n';
import { buildActionDataEntryShowcaseSections } from './preview-components/showcase-families/buildActionDataEntryShowcaseSections';
import { buildAdvancedInputLivePreview } from './preview-components/showcase-families/buildAdvancedInputLivePreview';
import { buildAdvancedInputShowcaseSections } from './preview-components/showcase-families/buildAdvancedInputShowcaseSections';
import { buildAiGovernanceShowcaseSections } from './preview-components/showcase-families/buildAiGovernanceShowcaseSections';
import { buildCollectionGridLivePreview } from './preview-components/showcase-families/buildCollectionGridLivePreview';
import { buildCollectionGridShowcaseSections } from './preview-components/showcase-families/buildCollectionGridShowcaseSections';
import { buildConfidencePromptLivePreview } from './preview-components/showcase-families/buildConfidencePromptLivePreview';
import { buildConfidencePromptShowcaseSections } from './preview-components/showcase-families/buildConfidencePromptShowcaseSections';
import { buildDataDisplayAnalyticsShowcaseSections } from './preview-components/showcase-families/buildDataDisplayAnalyticsShowcaseSections';
import { buildFormControlLivePreview } from './preview-components/showcase-families/buildFormControlLivePreview';
import { buildFormControlShowcaseSections } from './preview-components/showcase-families/buildFormControlShowcaseSections';
import { buildLayoutShowcaseSections } from './preview-components/showcase-families/buildLayoutShowcaseSections';
import { buildLinkInlineLivePreview, buildLinkInlineShowcaseSections } from './preview-components/link-inline';
import { buildNavigationRailLivePreview, buildNavigationRailShowcaseSections } from './preview-components/navigation-rail';
import { buildNavigationUtilityLivePreview } from './preview-components/showcase-families/buildNavigationUtilityLivePreview';
import { buildOverlayLivePreview } from './preview-components/showcase-families/buildOverlayLivePreview';
import { buildOverlayShowcaseSections } from './preview-components/showcase-families/buildOverlayShowcaseSections';
import { buildSearchFilterShowcaseSections } from './preview-components/showcase-families/buildSearchFilterShowcaseSections';
import { buildTabsFeedbackShowcaseSections } from './preview-components/showcase-families/buildTabsFeedbackShowcaseSections';
import { buildThemeRecipeShowcaseSections } from './preview-components/showcase-families/buildThemeRecipeShowcaseSections';
import { buildMenuBarShowcaseSections } from './preview-components/menu-bar';
import { isMenuBarShowcaseItemName } from './preview-components/menu-bar';
import { DesignLabMenuBarShowcase } from './preview-components/DesignLabMenuBarShowcase';
import { buildPaginationShowcaseSections } from './preview-components/pagination';
import type {
  AIActionAuditTimelineItem,
  ApprovalCheckpointItem,
  CitationPanelItem,
  DescriptionsItem,
  ListItem,
  PromptComposerScope,
  PromptComposerTone,
  SummaryStripItem,
  ThemePresetGalleryItem,
  TreeNode,
  UploadFileItem,
} from '@mfe/design-system';
import type {
  ComponentShowcaseSection,
  DemoSurfaceKind,
  DesignLabPreviewPanelId,
  DesignLabTranslate,
} from './showcaseTypes';

type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
type DesignLabDemoMode = 'live' | 'inspector' | 'planned';

/** Typed shape of the showcase state bag (avoids `unknown` from Record<string, unknown>). */
type ShowcaseState = {
  anchorValue: string;
  approvalCheckpointState: 'pending' | 'approved' | 'rejected';
  approvalCheckpointSteps: ApprovalCheckpointItem[];
  auditTimelineItems: AIActionAuditTimelineItem[];
  avatarPreviewImageSrc: string;
  checkboxValue: boolean;
  citationPanelItems: CitationPanelItem[];
  commandPaletteItems: Array<{ id: string; title: string; description?: string; shortcut?: string; group?: string }>;
  commandPaletteOpen: boolean;
  commandPaletteQuery: string;
  commentValue: string;
  contextMenuAction: string;
  dateValue: string;
  detailDrawerOpen: boolean;
  dropdownAction: string;
  entitySummaryItems: DescriptionsItem[];
  formDrawerOpen: boolean;
  gridRows: Record<string, unknown>[];
  inviteInputValue: string;
  jsonViewerValue: Record<string, unknown> & { policy?: unknown };
  lastCommandSelection: string;
  listItems: ListItem[];
  modalOpen: boolean;
  pageHeaderMeta: React.ReactNode;
  policyTableRows: Record<string, unknown>[];
  promptBody: string;
  promptScope: PromptComposerScope;
  promptSubject: string;
  promptTone: PromptComposerTone;
  radioValue: string;
  readonlyFormDrawerOpen: boolean;
  recommendationDecision: 'pending' | 'applied' | 'review';
  reportStatus: string;
  rolloutDescriptionItems: DescriptionsItem[];
  searchInputValue: string;
  selectedAuditId: string | null;
  selectedCitationId: string | null;
  selectValue: string;
  serverGridRows: Array<{ id: string; name: string; owner: string; theme: string; status: string; track: string }>;
  sliderValue: number;
  stepsStatusRichValue: string;
  stepsValue: string;
  summaryStripItems: SummaryStripItem[];
  switchValue: boolean;
  tabsValue: string;
  textAreaValue: string;
  textInputValue: string;
  timeValue: string;
  tourOpen: boolean;
  tourStatus: string;
  tourStep: number;
  treeNodes: TreeNode[];
  treeTableNodes: React.ComponentProps<typeof import('@mfe/design-system').TreeTable>['nodes'];
  uploadFiles: UploadFileItem[];
  setAnchorValue: (nextValue: string) => void;
  setApprovalCheckpointState: (nextValue: 'pending' | 'approved' | 'rejected') => void;
  setCheckboxValue: (nextValue: boolean) => void;
  setCommandPaletteOpen: (nextValue: boolean) => void;
  setCommandPaletteQuery: (nextValue: string) => void;
  setCommentValue: (nextValue: string) => void;
  setContextMenuAction: (nextValue: string) => void;
  setDateValue: (nextValue: string) => void;
  setDetailDrawerOpen: (nextValue: boolean) => void;
  setDropdownAction: (nextValue: string) => void;
  setFormDrawerOpen: (nextValue: boolean) => void;
  setInviteInputValue: (nextValue: string) => void;
  setLastCommandSelection: (nextValue: string | null) => void;
  setModalOpen: (nextValue: boolean) => void;
  setPromptBody: (nextValue: string) => void;
  setPromptScope: (nextValue: PromptComposerScope) => void;
  setPromptSubject: (nextValue: string) => void;
  setPromptTone: (nextValue: PromptComposerTone) => void;
  setRadioValue: (nextValue: string) => void;
  setReadonlyFormDrawerOpen: (nextValue: boolean) => void;
  setRecommendationDecision: (nextValue: 'pending' | 'applied' | 'review') => void;
  setReportStatus: (nextValue: string) => void;
  setSearchInputValue: (nextValue: string) => void;
  setSelectedAuditId: (nextValue: string | null) => void;
  setSelectedCitationId: (nextValue: string | null) => void;
  setSelectValue: (nextValue: string) => void;
  setSliderValue: (nextValue: number) => void;
  setStepsStatusRichValue: (nextValue: string) => void;
  setStepsValue: (nextValue: string) => void;
  setSwitchValue: (nextValue: boolean) => void;
  setTabsValue: (nextValue: string) => void;
  setTextAreaValue: (nextValue: string) => void;
  setTextInputValue: (nextValue: string) => void;
  setTimeValue: (nextValue: string) => void;
  setTourOpen: (nextValue: boolean) => void;
  setTourStatus: (nextValue: string) => void;
  setTourStep: (nextValue: number) => void;
  setUploadFiles: (nextValue: UploadFileItem[]) => void;
  themePresetSummary: { compareAxes?: React.ReactNode[] } | null;
  themePresetGalleryItems: ThemePresetGalleryItem[];
  defaultThemePreset: ThemePresetGalleryItem | null;
  contrastThemePreset: ThemePresetGalleryItem | null;
  compactThemePreset: ThemePresetGalleryItem | null;
  descriptionsLocaleText: Record<string, unknown>;
  approvalCheckpointStateLabels: Record<string, string>;
  [key: string]: unknown;
};

type DesignLabIndexItem = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  tags?: string[];
  availability: 'exported' | 'planned';
  lifecycle: DesignLabLifecycle;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  sectionIds: string[];
  qualityGates: string[];
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
};

type DesignLabShowcaseFamily = {
  recipeId: string;
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
};

type DesignLabIndex = {
  items: DesignLabIndexItem[];
  recipes?: {
    currentFamilies: DesignLabShowcaseFamily[];
  };
};

type DesignLabShowcaseContentProps = {
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem';
  item: DesignLabIndexItem | null;
  family: DesignLabShowcaseFamily | null;
  designLabIndex: DesignLabIndex;
  activePreviewPanel: DesignLabPreviewPanelId;
  onPreviewPanelChange: (panelId: DesignLabPreviewPanelId) => void;
  statusLabel: Record<DesignLabLifecycle, string>;
  demoModeLabel: Record<DesignLabDemoMode, string>;
  trackMeta: Record<string, { label: string; note: string }>;
  resolveItemTrack: (item: DesignLabIndexItem) => string;
  toTestIdSuffix: (value: string) => string;
  onFocusComponentFromFamily: (item: DesignLabIndexItem) => void;
  showcaseState: Record<string, unknown>;
};

type DesignLabRecipeComponentPreviewProps = {
  recipeId: string;
  showcaseState: Record<string, unknown>;
  layoutRecipeContext?: {
    avatarPreviewImageSrc: string;
    descriptionsLocaleText: Record<string, unknown>;
    dropdownAction: string;
    entitySummaryItems: DescriptionsItem[];
    pageHeaderMeta: React.ReactNode;
    rolloutDescriptionItems: DescriptionsItem[];
    searchInputValue: string;
    selectValue: string;
    summaryStripItems: SummaryStripItem[];
    setDropdownAction: (nextValue: string) => void;
    setSearchInputValue: (nextValue: string) => void;
    setSelectValue: (nextValue: string) => void;
  };
};

type PreviewPanelProps = React.ComponentProps<typeof LibraryPreviewPanel> & {
  kind?: DemoSurfaceKind;
};

export const designLabPreviewPanelIds: DesignLabPreviewPanelId[] = ['live', 'reference', 'recipe'];

export const getDesignLabPreviewPanelItems = (
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem',
  t: DesignLabTranslate,
): Array<{
  id: DesignLabPreviewPanelId;
  label: string;
  note: string;
}> => {
  const sharedPanels = [
    {
      id: 'live',
      label: t('designlab.showcase.previewPanels.live.label'),
      note: t('designlab.showcase.previewPanels.live.note'),
    },
    {
      id: 'reference',
      label: t('designlab.showcase.previewPanels.reference.label'),
      note: t('designlab.showcase.previewPanels.reference.note'),
    },
  ] satisfies Array<{
    id: Exclude<DesignLabPreviewPanelId, 'recipe'>;
    label: string;
    note: string;
  }>;

  return mode === 'components' || mode === 'foundations'
    ? sharedPanels
    : [
        ...sharedPanels,
        {
          id: 'recipe',
          label: mode === 'pages' ? 'Template' : mode === 'ecosystem' ? 'Extension' : t('designlab.showcase.previewPanels.recipe.label'),
          note: mode === 'pages' ? 'Page template handoff surface' : mode === 'ecosystem' ? 'Enterprise extension preview' : t('designlab.showcase.previewPanels.recipe.note'),
        },
      ];
};

export const filterDesignLabShowcaseSectionsForMode = (
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem',
  sections: ComponentShowcaseSection[],
): ComponentShowcaseSection[] =>
  mode === 'components' || mode === 'foundations'
    ? sections.filter((section) => (section.kind ?? 'live') !== 'recipe')
    : sections;

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
    badgeClassName:
      'border-state-success-border/60 bg-[var(--surface-card,rgba(255,255,255,0.85))] text-state-success-text ring-1 ring-[var(--border-subtle)]/20 shadow-[0_14px_28px_-22px_var(--shadow-color,rgba(24,18,68,0.34))]',
    panelClassName:
      'border-state-success-border/30 bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,253,247,0.92)))] shadow-[0_20px_42px_-28px_var(--shadow-color,rgba(24,18,68,0.24))] ring-1 ring-[var(--border-subtle)]/20',
  },
  reference: {
    label: 'REFERENCE',
    badgeClassName:
      'border-border-subtle bg-[var(--surface-card,rgba(255,255,255,0.82))] text-text-secondary ring-1 ring-[var(--border-subtle)]/20 shadow-[0_14px_28px_-22px_var(--shadow-color,rgba(24,18,68,0.24))]',
    panelClassName:
      'border-border-subtle bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,243,250,0.9)))] shadow-[0_20px_42px_-28px_var(--shadow-color,rgba(24,18,68,0.2))] ring-1 ring-[var(--border-subtle)]/20',
  },
  recipe: {
    label: 'RECIPE',
    badgeClassName:
      'border-state-warning-border/60 bg-[var(--surface-card,rgba(255,255,255,0.85))] text-state-warning-text ring-1 ring-[var(--border-subtle)]/20 shadow-[0_14px_28px_-22px_var(--shadow-color,rgba(24,18,68,0.34))]',
    panelClassName:
      'border-state-warning-border/30 bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,239,0.92)))] shadow-[0_20px_42px_-28px_var(--shadow-color,rgba(24,18,68,0.24))] ring-1 ring-[var(--border-subtle)]/20',
  },
};

export const DesignLabRecipeComponentPreview: React.FC<DesignLabRecipeComponentPreviewProps> = ({
  recipeId,
  showcaseState,
  layoutRecipeContext,
}) => {
  const { t } = useDesignLabI18n();
  const {
    approvalCheckpointState,
    approvalCheckpointSteps,
    auditTimelineItems,
    citationPanelItems,
    commandPaletteItems,
    dropdownAction,
    promptBody,
    promptScope,
    promptSubject,
    promptTone,
    recommendationDecision,
    searchInputValue,
    selectedAuditId,
    selectedCitationId,
    selectValue,
    serverGridRows,
    setApprovalCheckpointState,
    setDropdownAction,
    setPromptBody,
    setPromptScope,
    setPromptSubject,
    setPromptTone,
    setRecommendationDecision,
    setSearchInputValue,
    setSelectedAuditId,
    setSelectedCitationId,
    setSelectValue,
  } = showcaseState as ShowcaseState;
  const layoutRecipeComponentName = {
    dashboard_template: 'Dashboard Template',
    crud_template: 'CRUD Template',
    detail_template: 'Detail Template',
    command_workspace: 'Command Workspace',
    settings_template: 'Settings Template',
  }[recipeId];

  if (layoutRecipeComponentName && layoutRecipeContext) {
    const sections = buildLayoutShowcaseSections(layoutRecipeComponentName, {
      PreviewPanel,
      t,
      avatarPreviewImageSrc: layoutRecipeContext.avatarPreviewImageSrc,
      descriptionsLocaleText: layoutRecipeContext.descriptionsLocaleText,
      dropdownAction: layoutRecipeContext.dropdownAction,
      entitySummaryItems: layoutRecipeContext.entitySummaryItems,
      pageHeaderMeta: layoutRecipeContext.pageHeaderMeta,
      rolloutDescriptionItems: layoutRecipeContext.rolloutDescriptionItems,
      searchInputValue: layoutRecipeContext.searchInputValue,
      selectValue: layoutRecipeContext.selectValue,
      summaryStripItems: layoutRecipeContext.summaryStripItems,
      setDropdownAction: layoutRecipeContext.setDropdownAction,
      setSearchInputValue: layoutRecipeContext.setSearchInputValue,
      setSelectValue: layoutRecipeContext.setSelectValue,
    });

    if (sections?.[0]?.content) {
      return <>{sections[0].content}</>;
    }
  }

  switch (recipeId) {
    case 'search_filter_listing':
      return (
        <SearchFilterListing
          eyebrow={t('designlab.showcase.recipe.searchFilterListing.eyebrow')}
          title={t('designlab.showcase.recipe.searchFilterListing.title')}
          description={t('designlab.showcase.recipe.searchFilterListing.description')}
          meta={<SectionBadge label="recipe:first" />}
          status={<Badge tone="info">Live</Badge>}
          filters={(
            <>
              <TextInput
                label={t('designlab.showcase.recipe.searchFilterListing.searchLabel')}
                value={searchInputValue}
                onValueChange={setSearchInputValue}
                size="sm"
                leadingVisual={<span aria-hidden="true">⌕</span>}
              />
              <Select
                label={t('designlab.showcase.recipe.searchFilterListing.densityLabel')}
                value={selectValue}
                onValueChange={(value) => setSelectValue(String(value))}
                selectSize="sm"
                options={[
                  { label: t('designlab.showcase.recipe.searchFilterListing.density.comfortable'), value: 'comfortable' },
                  { label: t('designlab.showcase.recipe.searchFilterListing.density.compact'), value: 'compact' },
                  { label: t('designlab.showcase.recipe.searchFilterListing.density.readonly'), value: 'readonly' },
                ]}
              />
            </>
          )}
          onReset={() => setSearchInputValue('')}
          onSaveView={() => setDropdownAction(t('designlab.showcase.recipe.searchFilterListing.savedView'))}
          summaryItems={[
            {
              key: 'results',
              label: t('designlab.showcase.recipe.searchFilterListing.summary.results.label'),
              value: String(serverGridRows.length),
              note: t('designlab.showcase.recipe.searchFilterListing.summary.results.note'),
            },
            {
              key: 'selection',
              label: t('designlab.showcase.recipe.searchFilterListing.summary.selection.label'),
              value: dropdownAction || '—',
              note: t('designlab.showcase.recipe.searchFilterListing.summary.selection.note'),
            },
            {
              key: 'density',
              label: t('designlab.showcase.recipe.searchFilterListing.summary.density.label'),
              value: selectValue,
              note: t('designlab.showcase.recipe.searchFilterListing.summary.density.note'),
            },
          ]}
          items={serverGridRows.slice(0, 3).map((row) => (
            <div key={String(row.id)}>
              <Text preset="body" weight="medium">{String(row.name)}</Text>
              <Text variant="secondary" preset="caption">{`${String(row.owner)} · ${String(row.theme)}`}</Text>
              <Badge tone={row.status === 'Ready' ? 'success' : 'info'}>{String(row.status)}</Badge>
              <Badge tone="muted">{String(row.track)}</Badge>
            </div>
          ))}
        />
      );
    case 'detail_summary':
      return (
        <DetailSummary
          eyebrow={t('designlab.showcase.recipe.detailSummary.eyebrow')}
          title={t('designlab.showcase.recipe.detailSummary.title')}
          description={t('designlab.showcase.recipe.detailSummary.description')}
          meta={(
            <>
              <SectionBadge label="wave_11_recipes" />
              <SectionBadge label="stable" />
            </>
          )}
          status={<Badge tone="success">{t('designlab.showcase.recipe.detailSummary.status')}</Badge>}
          summaryItems={[
            { key: 'owners', label: 'Owners', value: '5', note: t('designlab.showcase.recipe.detailSummary.summary.owners.note'), tone: 'info' },
            { key: 'doctor', label: 'Doctor', value: 'PASS', note: t('designlab.showcase.recipe.detailSummary.summary.doctor.note'), tone: 'success' },
            {
              key: 'adoption',
              label: t('designlab.showcase.recipe.detailSummary.summary.adoption.label'),
              value: 'locked',
              note: t('designlab.showcase.recipe.detailSummary.summary.adoption.note'),
              tone: 'warning',
            },
          ]}
          entity={{
            title: 'Recipe System',
            subtitle: t('designlab.showcase.recipe.detailSummary.entity.subtitle'),
            badge: <Badge tone="success">Stable</Badge>,
            avatar: { name: 'Recipe System' },
            items: [
              { key: 'contract', label: 'Contract', value: 'ui-library-recipe-system-contract-v1', tone: 'info' },
              { key: 'wave', label: 'Wave', value: 'wave_11_recipes', tone: 'success' },
              { key: 'owner', label: t('designlab.showcase.recipe.detailSummary.entity.owner'), value: 'Platform UI', tone: 'info' },
              { key: 'mode', label: 'Mode', value: 'JSON-first', tone: 'warning' },
            ],
          }}
          detailItems={[
            { key: 'focus', label: 'Focus', value: t('designlab.showcase.recipe.detailSummary.detail.focus.value'), tone: 'info' },
            { key: 'gate', label: 'Gate', value: t('designlab.showcase.recipe.detailSummary.detail.gate.value'), tone: 'success' },
            { key: 'preview', label: 'Preview', value: t('designlab.showcase.recipe.detailSummary.detail.preview.value'), tone: 'warning' },
            { key: 'adoption', label: 'Rule', value: t('designlab.showcase.recipe.detailSummary.detail.rule.value'), tone: 'info', span: 2 },
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
            title: t('designlab.showcase.recipe.approvalReview.title'),
            summary: t('designlab.showcase.recipe.approvalReview.summary'),
            status: approvalCheckpointState,
            steps: approvalCheckpointSteps,
            evidenceItems: ['doctor:frontend', 'gate:wave_11', 'playwright:ui_library_recipe_wave_11_walk'],
            citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
            onPrimaryAction: () => setApprovalCheckpointState('approved'),
            onSecondaryAction: () => setApprovalCheckpointState('rejected'),
            footerNote: t('designlab.showcase.recipe.approvalReview.state', { state: approvalCheckpointState }),
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
          <EmptyErrorLoading mode="loading" loadingLabel={t('designlab.showcase.recipe.emptyErrorLoading.loadingLabel')} />
          <EmptyErrorLoading mode="error" onRetry={() => setDropdownAction(t('designlab.showcase.recipe.emptyErrorLoading.retry'))} />
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
              title: t('designlab.showcase.recipe.aiGuidedAuthoring.title'),
              summary: t('designlab.showcase.recipe.aiGuidedAuthoring.summary'),
              recommendationType: t('designlab.showcase.recipe.aiGuidedAuthoring.type'),
              confidenceLevel: recommendationDecision === 'applied' ? 'high' : 'medium',
              confidenceScore: recommendationDecision === 'applied' ? 0.91 : 0.76,
              citations: ['doctor:frontend', 'wave_11_recipes', 'adoption-enforcement'],
              tone: recommendationDecision === 'review' ? 'warning' : 'info',
              footerNote: t('designlab.showcase.recipe.aiGuidedAuthoring.decision', { decision: recommendationDecision }),
            },
          ]}
          commandItems={commandPaletteItems}
          onApplyRecommendation={() => setRecommendationDecision('applied')}
          onReviewRecommendation={() => setRecommendationDecision('review')}
        />
      );
    case 'app_header':
      return <DesignLabMenuBarShowcase itemName="App Header" />;
    case 'navigation_menu':
      return <DesignLabMenuBarShowcase itemName="Navigation Menu" />;
    case 'search_command_header':
      return <DesignLabMenuBarShowcase itemName="Search / Command Header" />;
    case 'action_header':
      return <DesignLabMenuBarShowcase itemName="Action Header" />;
    case 'desktop_menubar':
      return <DesignLabMenuBarShowcase itemName="Desktop Menubar" />;
    default:
      return (
        <div className="rounded-[24px] border border-dashed border-border-subtle bg-surface-panel p-5">
          <Text variant="secondary" className="block leading-7">
            {t('designlab.showcase.preview.undefinedRecipePreview')}
          </Text>
        </div>
      );
  }
};

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
  const { t } = useDesignLabI18n();
  const resolvedKind = resolvePreviewPanelKind(title, kind);
  const previewSurfaceLabels = {
    live: t('designlab.showcase.previewSurface.live'),
    reference: t('designlab.showcase.previewSurface.reference'),
    recipe: t('designlab.showcase.previewSurface.recipe'),
  } satisfies Record<DemoSurfaceKind, string>;

  return (
    <div
      data-demo-panel-kind={resolvedKind}
      className={[
        'rounded-[24px] border p-4 backdrop-blur-sm',
        demoSurfaceMeta[resolvedKind].panelClassName,
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DetailLabel className="text-xs">{title}</DetailLabel>
        <SectionBadge label={previewSurfaceLabels[resolvedKind]} className={demoSurfaceMeta[resolvedKind].badgeClassName} />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
};

const PreviewWorkspace: React.FC<{
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem';
  sections: ComponentShowcaseSection[];
  activePreviewPanel: DesignLabPreviewPanelId;
  onPreviewPanelChange: (panelId: DesignLabPreviewPanelId) => void;
  testIdPrefix: string;
  emptyMessage: string;
}> = ({
  mode,
  sections,
  activePreviewPanel,
  onPreviewPanelChange,
  testIdPrefix,
  emptyMessage,
}) => {
  const { t } = useDesignLabI18n();
  const visibleSections = React.useMemo(
    () => filterDesignLabShowcaseSectionsForMode(mode, sections),
    [mode, sections],
  );
  const previewPanelItems = React.useMemo(() => getDesignLabPreviewPanelItems(mode, t), [mode, t]);
  const sectionCountByKind = React.useMemo(
    () =>
      visibleSections.reduce<Record<DesignLabPreviewPanelId, number>>(
        (accumulator, section) => {
          const kind = section.kind ?? 'live';
          accumulator[kind] += 1;
          return accumulator;
        },
        { live: 0, reference: 0, recipe: 0 },
      ),
    [visibleSections],
  );

  const firstAvailablePreviewPanel = React.useMemo(
    () => previewPanelItems.find((panel) => sectionCountByKind[panel.id] > 0)?.id ?? null,
    [previewPanelItems, sectionCountByKind],
  );

  const effectivePreviewPanel =
    sectionCountByKind[activePreviewPanel] > 0
      ? activePreviewPanel
      : firstAvailablePreviewPanel ?? activePreviewPanel;

  React.useEffect(() => {
    if (
      sectionCountByKind[activePreviewPanel] === 0 &&
      firstAvailablePreviewPanel &&
      firstAvailablePreviewPanel !== activePreviewPanel
    ) {
      onPreviewPanelChange(firstAvailablePreviewPanel);
    }
  }, [activePreviewPanel, firstAvailablePreviewPanel, onPreviewPanelChange, sectionCountByKind]);

  const renderPanelContent = (panelId: DesignLabPreviewPanelId) => {
    const panelSections = visibleSections.filter((section) => (section.kind ?? 'live') === panelId);

    return (
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-[26px] border border-border-subtle bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,244,252,0.92)))] p-4 shadow-[0_22px_48px_-30px_var(--shadow-color,rgba(24,18,68,0.24))] ring-1 ring-[var(--border-subtle)]/20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-12 rounded-b-[28px] bg-gradient-to-b from-[var(--surface-card,rgba(255,255,255,0.9))] to-transparent" />
          <div className="relative z-[1] flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {panelSections.map((section, index) => (
                <SectionBadge key={`${section.id}-header-${index}`} label={`${String(index + 1).padStart(2, '0')} · ${section.title}`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <SectionBadge
                label={`${previewPanelItems.find((entry) => entry.id === panelId)?.label ?? panelId} · ${panelSections.length}`}
                className={demoSurfaceMeta[panelId].badgeClassName}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {panelSections.length ? (
            panelSections.map((section, index) => (
              <div key={`${section.id}-section-${index}`} data-testid={`${testIdPrefix}-${section.id}`} data-demo-section-kind={section.kind}>
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
                    ...((section.badges ?? []).map((badge, badgeIndex) => (
                      <SectionBadge key={`${section.id}-badge-${badgeIndex}`} label={badge} />
                    ))),
                  ]}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- cross-package ReactNode compat */}
                  {section.content as any}
                </LibraryShowcaseCard>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border-subtle bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,243,250,0.92)))] p-5 shadow-[0_18px_40px_-28px_var(--shadow-color,rgba(24,18,68,0.22))] ring-1 ring-[var(--border-subtle)]/20">
              <Text variant="secondary" className="block leading-7">
                {emptyMessage}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-border-subtle bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,242,250,0.92)))] p-5 shadow-[0_28px_64px_-34px_var(--shadow-color,rgba(24,18,68,0.3))] ring-1 ring-[var(--border-subtle)]/20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-16 rounded-b-[34px] bg-gradient-to-b from-[var(--surface-card,rgba(255,255,255,0.9))] via-[var(--surface-card,rgba(255,255,255,0.4))] to-transparent" />
      <div className="relative z-[1] flex flex-col gap-4 border-b border-border-subtle/80 pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.showcase.preview.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {mode === 'components' || mode === 'foundations'
              ? t('designlab.showcase.preview.workspace.description.components')
              : mode === 'pages'
                ? t('designlab.tabs.demo.description.pages')
                : mode === 'ecosystem'
                  ? 'Enterprise extension ve data surface preview workspace'
                  : t('designlab.showcase.preview.workspace.description.recipes')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">Tabbed</Badge>
          <SectionBadge label={t('designlab.showcase.preview.workspace.showcaseCount', { count: visibleSections.length })} />
        </div>
      </div>

      <Tabs
        activeKey={effectivePreviewPanel}
        onChange={(value) => onPreviewPanelChange(value as DesignLabPreviewPanelId)}
        variant="pill"
        className="mt-5"
        items={previewPanelItems.map((panel) => ({
          key: panel.id,
          label: panel.label,
          disabled: sectionCountByKind[panel.id] === 0,
          badge: <Badge tone={panel.id === 'live' ? 'success' : panel.id === 'recipe' ? 'warning' : 'muted'}>{sectionCountByKind[panel.id]}</Badge>,
          content: renderPanelContent(panel.id),
        }))}
      />
    </div>
  );
};


export const DesignLabShowcaseContent: React.FC<DesignLabShowcaseContentProps> = ({
  mode,
  item,
  family,
  designLabIndex,
  activePreviewPanel,
  onPreviewPanelChange,
  statusLabel,
  demoModeLabel,
  trackMeta,
  resolveItemTrack,
  toTestIdSuffix,
  onFocusComponentFromFamily,
  showcaseState,
}) => {
  void onFocusComponentFromFamily;
  const { t, locale } = useDesignLabI18n();
  const {
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
    listItems = [],
    themePresetSummary = null,
    themePresetGalleryItems = [],
    defaultThemePreset = null,
    contrastThemePreset = null,
    compactThemePreset = null,
  } = showcaseState as ShowcaseState;

  const recommendationDecisionLabels: Record<'pending' | 'applied' | 'review', string> = {
    pending: t('designlab.state.recommendation.pending'),
    applied: t('designlab.state.recommendation.applied'),
    review: t('designlab.state.recommendation.review'),
  };
  const approvalCheckpointStateLabels: Record<'pending' | 'approved' | 'rejected', string> = {
    pending: t('designlab.state.approval.pending'),
    approved: t('designlab.state.approval.approved'),
    rejected: t('designlab.state.approval.rejected'),
  };
  const auditActorLabels: Record<'ai' | 'human' | 'system', string> = {
    ai: t('designlab.state.auditActor.ai'),
    human: t('designlab.state.auditActor.human'),
    system: t('designlab.state.auditActor.system'),
  };
  const auditStatusLabels: Record<'drafted' | 'approved' | 'observed', string> = {
    drafted: t('designlab.state.auditStatus.drafted'),
    approved: t('designlab.state.auditStatus.approved'),
    observed: t('designlab.state.auditStatus.observed'),
  };
  const paginationLocaleText = {
    navigationLabel: t('designlab.componentContracts.pagination.navigationLabel'),
    previousButtonLabel: t('designlab.componentContracts.pagination.previousButtonLabel'),
    nextButtonLabel: t('designlab.componentContracts.pagination.nextButtonLabel'),
    previousPageAriaLabel: t('designlab.componentContracts.pagination.previousPageAriaLabel'),
    nextPageAriaLabel: t('designlab.componentContracts.pagination.nextPageAriaLabel'),
    pageAriaLabel: (page: number) => t('designlab.componentContracts.pagination.pageAriaLabel', { page }),
    pageIndicatorLabel: (currentPage: number, pageCount: number) =>
      t('designlab.componentContracts.pagination.pageIndicatorLabel', { currentPage, pageCount }),
    simpleIndicatorLabel: (currentPage: number, pageCount: number) =>
      t('designlab.componentContracts.pagination.pageIndicatorLabel', { currentPage, pageCount }),
    totalItemsLabel: (count: number) => t('designlab.componentContracts.pagination.totalItemsLabel', { count }),
    modeLabel: (mode: 'client' | 'server') =>
      t(mode === 'server' ? 'designlab.componentContracts.pagination.mode.server' : 'designlab.componentContracts.pagination.mode.client'),
    rowsPerPageLabel: t('designlab.componentContracts.entityGridTemplate.pageSizeLabel'),
    rangeLabel: (start: number, end: number, total: number) =>
      t('designlab.componentContracts.entityGridTemplate.recordCountLabel', { start, end, total }),
    firstButtonLabel: t('designlab.componentContracts.entityGridTemplate.firstPageLabel'),
    lastButtonLabel: t('designlab.componentContracts.entityGridTemplate.lastPageLabel'),
  };
  const datePickerMessages = {
    emptyValueLabel: t('designlab.componentContracts.datePicker.emptyValueLabel'),
  };
  const timePickerMessages = {
    emptyValueLabel: t('designlab.componentContracts.timePicker.emptyValueLabel'),
  };
  const emptyMessages = {
    description: t('designlab.componentContracts.empty.description'),
  };
  const jsonViewerLocaleText = {
    emptyFallbackDescription: t('designlab.componentContracts.jsonViewer.emptyFallbackDescription'),
    emptyNodeDescription: t('designlab.componentContracts.jsonViewer.emptyNodeDescription'),
  };
  const anchorTocLocaleText = {
    title: t('designlab.componentContracts.anchorToc.title'),
    navigationLabel: t('designlab.componentContracts.anchorToc.navigationLabel'),
  };
  const descriptionsLocaleText = {
    emptyFallbackDescription: t('designlab.componentContracts.descriptions.emptyFallbackDescription'),
  };
  const listLocaleText = {
    emptyFallbackDescription: t('designlab.componentContracts.list.emptyFallbackDescription'),
  };
  const linkInlineLocaleText = {
    externalScreenReaderLabel: t('designlab.componentContracts.linkInline.externalScreenReaderLabel'),
  };
  const tourCoachmarksLocaleText = {
    title: t('designlab.componentContracts.tourCoachmarks.title'),
    skipLabel: t('designlab.componentContracts.tourCoachmarks.skipLabel'),
    closeLabel: t('designlab.componentContracts.tourCoachmarks.closeLabel'),
    previousLabel: t('designlab.componentContracts.tourCoachmarks.previousLabel'),
    nextStepLabel: t('designlab.componentContracts.tourCoachmarks.nextStepLabel'),
    finishLabel: t('designlab.componentContracts.tourCoachmarks.finishLabel'),
    readonlyFinishLabel: t('designlab.componentContracts.tourCoachmarks.readonlyFinishLabel'),
  };
  const themePreviewCardLocaleText = {
    titleText: t('designlab.componentContracts.themePreviewCard.titleText'),
    secondaryText: t('designlab.componentContracts.themePreviewCard.secondaryText'),
    saveLabel: t('designlab.componentContracts.themePreviewCard.saveLabel'),
    selectedLabel: t('designlab.componentContracts.themePreviewCard.selectedLabel'),
  };
  const tableSimpleLocaleText = {
    emptyFallbackDescription: t('designlab.componentContracts.tableSimple.emptyFallbackDescription'),
  };
  const treeLocaleText = {
    emptyFallbackDescription: t('designlab.componentContracts.tree.emptyFallbackDescription'),
    expandNodeAriaLabel: t('designlab.componentContracts.tree.expandNodeAriaLabel'),
    collapseNodeAriaLabel: t('designlab.componentContracts.tree.collapseNodeAriaLabel'),
  };
  const treeTableLocaleText = {
    treeColumnLabel: t('designlab.componentContracts.treeTable.treeColumnLabel'),
    emptyFallbackDescription: t('designlab.componentContracts.treeTable.emptyFallbackDescription'),
    expandNodeAriaLabel: t('designlab.componentContracts.treeTable.expandNodeAriaLabel'),
    collapseNodeAriaLabel: t('designlab.componentContracts.treeTable.collapseNodeAriaLabel'),
  };
  const contextMenuMessages = {
    buttonLabel: t('designlab.componentContracts.contextMenu.buttonLabel'),
    contextTriggerHint: t('designlab.componentContracts.contextMenu.contextTriggerHint'),
    menuAriaLabel: t('designlab.componentContracts.contextMenu.menuAriaLabel'),
  };
  const agGridServerMessages = {
    loadingLabel: t('designlab.componentContracts.agGridServer.loadingLabel'),
  };
  const entityGridTemplateMessages = {
    defaultVariantName: t('designlab.componentContracts.entityGridTemplate.defaultVariantName'),
    overlayLoadingLabel: t('designlab.componentContracts.entityGridTemplate.overlayLoadingLabel'),
    overlayNoRowsLabel: t('designlab.componentContracts.entityGridTemplate.overlayNoRowsLabel'),
    densityStatusUsingGlobal: t('designlab.componentContracts.entityGridTemplate.densityStatusUsingGlobal'),
    densityStatusOverride: t('designlab.componentContracts.entityGridTemplate.densityStatusOverride'),
    gridNotReadyLabel: t('designlab.componentContracts.entityGridTemplate.gridNotReadyLabel'),
    resetFiltersSuccessLabel: t('designlab.componentContracts.entityGridTemplate.resetFiltersSuccessLabel'),
    pageSizeLabel: t('designlab.componentContracts.entityGridTemplate.pageSizeLabel'),
    recordCountLabel: t('designlab.componentContracts.entityGridTemplate.recordCountLabel'),
    pageIndicatorLabel: t('designlab.componentContracts.entityGridTemplate.pageIndicatorLabel'),
    firstPageLabel: t('designlab.componentContracts.entityGridTemplate.firstPageLabel'),
    previousPageLabel: t('designlab.componentContracts.entityGridTemplate.previousPageLabel'),
    nextPageLabel: t('designlab.componentContracts.entityGridTemplate.nextPageLabel'),
    lastPageLabel: t('designlab.componentContracts.entityGridTemplate.lastPageLabel'),
    variantsLoadingOptionLabel: t('designlab.componentContracts.entityGridTemplate.variantsLoadingOptionLabel'),
    variantSelectOptionLabel: t('designlab.componentContracts.entityGridTemplate.variantSelectOptionLabel'),
    clearVariantSelectionLabel: t('designlab.componentContracts.entityGridTemplate.clearVariantSelectionLabel'),
    manageVariantsLabel: t('designlab.componentContracts.entityGridTemplate.manageVariantsLabel'),
    closeVariantManagerLabel: t('designlab.componentContracts.entityGridTemplate.closeVariantManagerLabel'),
    personalVariantsTitle: t('designlab.componentContracts.entityGridTemplate.personalVariantsTitle'),
    personalVariantsEmptyLabel: t('designlab.componentContracts.entityGridTemplate.personalVariantsEmptyLabel'),
    globalVariantsTitle: t('designlab.componentContracts.entityGridTemplate.globalVariantsTitle'),
    globalVariantsEmptyLabel: t('designlab.componentContracts.entityGridTemplate.globalVariantsEmptyLabel'),
    dismissToastLabel: t('designlab.componentContracts.entityGridTemplate.dismissToastLabel'),
    variantOptionGlobalLabel: t('designlab.componentContracts.entityGridTemplate.variantOptionGlobalLabel'),
    variantOptionGlobalDefaultLabel: t('designlab.componentContracts.entityGridTemplate.variantOptionGlobalDefaultLabel'),
    variantOptionDefaultLabel: t('designlab.componentContracts.entityGridTemplate.variantOptionDefaultLabel'),
    variantOptionIncompatibleLabel: t('designlab.componentContracts.entityGridTemplate.variantOptionIncompatibleLabel'),
    selectedVariantNotFoundLabel: t('designlab.componentContracts.entityGridTemplate.selectedVariantNotFoundLabel'),
    selectedVariantIncompatibleLabel: t('designlab.componentContracts.entityGridTemplate.selectedVariantIncompatibleLabel'),
    variantSaveBlockedLabel: t('designlab.componentContracts.entityGridTemplate.variantSaveBlockedLabel'),
    variantSavedLabel: t('designlab.componentContracts.entityGridTemplate.variantSavedLabel'),
    variantSaveFailedLabel: t('designlab.componentContracts.entityGridTemplate.variantSaveFailedLabel'),
    variantNameEmptyLabel: t('designlab.componentContracts.entityGridTemplate.variantNameEmptyLabel'),
    variantNameUpdatedLabel: t('designlab.componentContracts.entityGridTemplate.variantNameUpdatedLabel'),
    variantNameUpdateFailedLabel: t('designlab.componentContracts.entityGridTemplate.variantNameUpdateFailedLabel'),
    variantPromotedToGlobalLabel: t('designlab.componentContracts.entityGridTemplate.variantPromotedToGlobalLabel'),
    variantDemotedToPersonalLabel: t('designlab.componentContracts.entityGridTemplate.variantDemotedToPersonalLabel'),
    variantGlobalStatusUpdateFailedLabel: t('designlab.componentContracts.entityGridTemplate.variantGlobalStatusUpdateFailedLabel'),
    globalDefaultEnabledLabel: t('designlab.componentContracts.entityGridTemplate.globalDefaultEnabledLabel'),
    globalDefaultDisabledLabel: t('designlab.componentContracts.entityGridTemplate.globalDefaultDisabledLabel'),
    globalDefaultUpdateFailedLabel: t('designlab.componentContracts.entityGridTemplate.globalDefaultUpdateFailedLabel'),
    newVariantNameEmptyLabel: t('designlab.componentContracts.entityGridTemplate.newVariantNameEmptyLabel'),
    variantCreatedLabel: t('designlab.componentContracts.entityGridTemplate.variantCreatedLabel'),
    variantCreateFailedLabel: t('designlab.componentContracts.entityGridTemplate.variantCreateFailedLabel'),
    defaultViewEnabledLabel: t('designlab.componentContracts.entityGridTemplate.defaultViewEnabledLabel'),
    defaultViewDisabledLabel: t('designlab.componentContracts.entityGridTemplate.defaultViewDisabledLabel'),
    defaultStateUpdateFailedLabel: t('designlab.componentContracts.entityGridTemplate.defaultStateUpdateFailedLabel'),
    globalVariantUserDefaultEnabledLabel: t('designlab.componentContracts.entityGridTemplate.globalVariantUserDefaultEnabledLabel'),
    globalVariantUserDefaultDisabledLabel: t('designlab.componentContracts.entityGridTemplate.globalVariantUserDefaultDisabledLabel'),
    variantPreferenceUpdateFailedLabel: t('designlab.componentContracts.entityGridTemplate.variantPreferenceUpdateFailedLabel'),
    variantCorruptedStateLabel: t('designlab.componentContracts.entityGridTemplate.variantCorruptedStateLabel'),
    deleteVariantConfirmationLabel: t('designlab.componentContracts.entityGridTemplate.deleteVariantConfirmationLabel'),
    variantDeletedLabel: t('designlab.componentContracts.entityGridTemplate.variantDeletedLabel'),
    variantDeleteFailedLabel: t('designlab.componentContracts.entityGridTemplate.variantDeleteFailedLabel'),
    menuSelectLabel: t('designlab.componentContracts.entityGridTemplate.menuSelectLabel'),
    menuRenameLabel: t('designlab.componentContracts.entityGridTemplate.menuRenameLabel'),
    menuUnsetDefaultLabel: t('designlab.componentContracts.entityGridTemplate.menuUnsetDefaultLabel'),
    menuSetDefaultLabel: t('designlab.componentContracts.entityGridTemplate.menuSetDefaultLabel'),
    menuUnsetGlobalDefaultLabel: t('designlab.componentContracts.entityGridTemplate.menuUnsetGlobalDefaultLabel'),
    menuSetGlobalDefaultLabel: t('designlab.componentContracts.entityGridTemplate.menuSetGlobalDefaultLabel'),
    menuMoveToPersonalLabel: t('designlab.componentContracts.entityGridTemplate.menuMoveToPersonalLabel'),
    menuMoveToGlobalLabel: t('designlab.componentContracts.entityGridTemplate.menuMoveToGlobalLabel'),
    menuDeleteLabel: t('designlab.componentContracts.entityGridTemplate.menuDeleteLabel'),
    saveLabel: t('designlab.componentContracts.entityGridTemplate.saveLabel'),
    cancelLabel: t('designlab.componentContracts.entityGridTemplate.cancelLabel'),
    selectedTagLabel: t('designlab.componentContracts.entityGridTemplate.selectedTagLabel'),
    globalPublicDefaultTagLabel: t('designlab.componentContracts.entityGridTemplate.globalPublicDefaultTagLabel'),
    globalPublicTagLabel: t('designlab.componentContracts.entityGridTemplate.globalPublicTagLabel'),
    personalTagLabel: t('designlab.componentContracts.entityGridTemplate.personalTagLabel'),
    personalDefaultTagLabel: t('designlab.componentContracts.entityGridTemplate.personalDefaultTagLabel'),
    recentlyUsedTagLabel: t('designlab.componentContracts.entityGridTemplate.recentlyUsedTagLabel'),
    incompatibleTagLabel: t('designlab.componentContracts.entityGridTemplate.incompatibleTagLabel'),
    hideDetailsLabel: t('designlab.componentContracts.entityGridTemplate.hideDetailsLabel'),
    showDetailsLabel: t('designlab.componentContracts.entityGridTemplate.showDetailsLabel'),
    variantActionsLabel: t('designlab.componentContracts.entityGridTemplate.variantActionsLabel'),
    moveToPersonalTitle: t('designlab.componentContracts.entityGridTemplate.moveToPersonalTitle'),
    moveToGlobalTitle: t('designlab.componentContracts.entityGridTemplate.moveToGlobalTitle'),
    saveCurrentLayoutTitle: t('designlab.componentContracts.entityGridTemplate.saveCurrentLayoutTitle'),
    saveCurrentStateLabel: t('designlab.componentContracts.entityGridTemplate.saveCurrentStateLabel'),
    personalDefaultSwitchLabel: t('designlab.componentContracts.entityGridTemplate.personalDefaultSwitchLabel'),
    globalDefaultSwitchLabel: t('designlab.componentContracts.entityGridTemplate.globalDefaultSwitchLabel'),
    newVariantToPersonalTitle: t('designlab.componentContracts.entityGridTemplate.newVariantToPersonalTitle'),
    newVariantToGlobalTitle: t('designlab.componentContracts.entityGridTemplate.newVariantToGlobalTitle'),
    newVariantUnsetGlobalDefaultTitle: t('designlab.componentContracts.entityGridTemplate.newVariantUnsetGlobalDefaultTitle'),
    newVariantSetGlobalDefaultTitle: t('designlab.componentContracts.entityGridTemplate.newVariantSetGlobalDefaultTitle'),
    newVariantUnsetPersonalDefaultTitle: t('designlab.componentContracts.entityGridTemplate.newVariantUnsetPersonalDefaultTitle'),
    newVariantSetPersonalDefaultTitle: t('designlab.componentContracts.entityGridTemplate.newVariantSetPersonalDefaultTitle'),
    saveTitle: t('designlab.componentContracts.entityGridTemplate.saveTitle'),
  };
  const entityGridTemplateLocaleText = {
    selectAll: t('designlab.componentContracts.entityGridTemplate.localeText.selectAll'),
    searchOoo: t('designlab.componentContracts.entityGridTemplate.localeText.searchOoo'),
    filterOoo: t('designlab.componentContracts.entityGridTemplate.localeText.filterOoo'),
    blanks: t('designlab.componentContracts.entityGridTemplate.localeText.blanks'),
    noRowsToShow: entityGridTemplateMessages.overlayNoRowsLabel,
    loadingOoo: entityGridTemplateMessages.overlayLoadingLabel,
    page: t('designlab.componentContracts.entityGridTemplate.localeText.page'),
    more: t('designlab.componentContracts.entityGridTemplate.localeText.more'),
    to: t('designlab.componentContracts.entityGridTemplate.localeText.to'),
    of: t('designlab.componentContracts.entityGridTemplate.localeText.of'),
    next: t('designlab.componentContracts.entityGridTemplate.localeText.next'),
    last: t('designlab.componentContracts.entityGridTemplate.localeText.last'),
    first: t('designlab.componentContracts.entityGridTemplate.localeText.first'),
    previous: t('designlab.componentContracts.entityGridTemplate.localeText.previous'),
    columns: t('designlab.componentContracts.entityGridTemplate.localeText.columns'),
    filters: t('designlab.componentContracts.entityGridTemplate.localeText.filters'),
    collapseAll: t('designlab.componentContracts.entityGridTemplate.localeText.collapseAll'),
    expandAll: t('designlab.componentContracts.entityGridTemplate.localeText.expandAll'),
    pinColumn: t('designlab.componentContracts.entityGridTemplate.localeText.pinColumn'),
    autosizeThiscolumn: t('designlab.componentContracts.entityGridTemplate.localeText.autosizeThisColumn'),
    autosizeAllColumns: t('designlab.componentContracts.entityGridTemplate.localeText.autosizeAllColumns'),
    groupBy: t('designlab.componentContracts.entityGridTemplate.localeText.groupBy'),
    resetColumns: t('designlab.componentContracts.entityGridTemplate.localeText.resetColumns'),
    resetFilters: t('designlab.componentContracts.entityGridTemplate.localeText.resetFilters'),
    toolPanelButton: t('designlab.componentContracts.entityGridTemplate.localeText.toolPanelButton'),
    columnMenuPin: t('designlab.componentContracts.entityGridTemplate.localeText.columnMenuPin'),
    columnMenuValue: t('designlab.componentContracts.entityGridTemplate.localeText.columnMenuValue'),
    columnMenuGroup: t('designlab.componentContracts.entityGridTemplate.localeText.columnMenuGroup'),
    columnMenuSort: t('designlab.componentContracts.entityGridTemplate.localeText.columnMenuSort'),
    columnMenuFilter: t('designlab.componentContracts.entityGridTemplate.localeText.columnMenuFilter'),
    applyFilter: t('designlab.componentContracts.entityGridTemplate.localeText.applyFilter'),
    clearFilter: t('designlab.componentContracts.entityGridTemplate.localeText.clearFilter'),
    clearFilters: t('designlab.componentContracts.entityGridTemplate.localeText.clearFilters'),
    equals: t('designlab.componentContracts.entityGridTemplate.localeText.equals'),
    notEqual: t('designlab.componentContracts.entityGridTemplate.localeText.notEqual'),
    lessThan: t('designlab.componentContracts.entityGridTemplate.localeText.lessThan'),
    lessThanOrEqual: t('designlab.componentContracts.entityGridTemplate.localeText.lessThanOrEqual'),
    greaterThan: t('designlab.componentContracts.entityGridTemplate.localeText.greaterThan'),
    greaterThanOrEqual: t('designlab.componentContracts.entityGridTemplate.localeText.greaterThanOrEqual'),
    inRange: t('designlab.componentContracts.entityGridTemplate.localeText.inRange'),
    contains: t('designlab.componentContracts.entityGridTemplate.localeText.contains'),
    notContains: t('designlab.componentContracts.entityGridTemplate.localeText.notContains'),
    startsWith: t('designlab.componentContracts.entityGridTemplate.localeText.startsWith'),
    endsWith: t('designlab.componentContracts.entityGridTemplate.localeText.endsWith'),
    blank: t('designlab.componentContracts.entityGridTemplate.localeText.blank'),
    notBlank: t('designlab.componentContracts.entityGridTemplate.localeText.notBlank'),
    andCondition: t('designlab.componentContracts.entityGridTemplate.localeText.andCondition'),
    orCondition: t('designlab.componentContracts.entityGridTemplate.localeText.orCondition'),
    rowGroupPanel: t('designlab.componentContracts.entityGridTemplate.localeText.rowGroupPanel'),
    dropZoneColumnGroup: t('designlab.componentContracts.entityGridTemplate.localeText.dropZoneColumnGroup'),
    rowGroupColumnsEmptyMessage: t('designlab.componentContracts.entityGridTemplate.localeText.rowGroupColumnsEmptyMessage'),
    dragHereToSetColumnRowGroup: t('designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetColumnRowGroup'),
    dragHereToSetRowGroup: t('designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetRowGroup'),
    dragHereToSetColumnValues: t('designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetColumnValues'),
    dropZoneColumnValue: t('designlab.componentContracts.entityGridTemplate.localeText.dropZoneColumnValue'),
    advancedFilter: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilter'),
    advancedFilterBuilder: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilder'),
    advancedFilterButtonTooltip: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterButtonTooltip'),
    advancedFilterBuilderAdd: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilderAdd'),
    advancedFilterBuilderRemove: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilderRemove'),
    advancedFilterJoinOperator: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterJoinOperator'),
    advancedFilterAnd: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterAnd'),
    advancedFilterOr: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterOr'),
    advancedFilterValidationMissingColumn: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingColumn'),
    advancedFilterValidationMissingOption: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingOption'),
    advancedFilterValidationMissingValue: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingValue'),
    advancedFilterApply: t('designlab.componentContracts.entityGridTemplate.localeText.advancedFilterApply'),
  };
  const entityGridTemplateShellProps = {
    quickFilterPlaceholder: t('designlab.componentContracts.entityGridTemplate.quickFilterPlaceholder'),
    themeLabel: t('designlab.componentContracts.entityGridTemplate.themeLabel'),
    quickFilterLabel: t('designlab.componentContracts.entityGridTemplate.quickFilterLabel'),
    variantLabel: t('designlab.componentContracts.entityGridTemplate.variantLabel'),
    densityToggleLabel: t('designlab.componentContracts.entityGridTemplate.densityToggleLabel'),
    comfortableDensityLabel: t('designlab.componentContracts.entityGridTemplate.comfortableDensityLabel'),
    compactDensityLabel: t('designlab.componentContracts.entityGridTemplate.compactDensityLabel'),
    densityResetLabel: t('designlab.componentContracts.entityGridTemplate.densityResetLabel'),
    fullscreenTooltip: t('designlab.componentContracts.entityGridTemplate.fullscreenTooltip'),
    resetFiltersLabel: t('designlab.componentContracts.entityGridTemplate.resetFiltersLabel'),
    excelVisibleLabel: t('designlab.componentContracts.entityGridTemplate.excelVisibleLabel'),
    excelAllLabel: t('designlab.componentContracts.entityGridTemplate.excelAllLabel'),
    csvVisibleLabel: t('designlab.componentContracts.entityGridTemplate.csvVisibleLabel'),
    csvAllLabel: t('designlab.componentContracts.entityGridTemplate.csvAllLabel'),
    exportFileBaseName: t('designlab.componentContracts.entityGridTemplate.exportFileBaseName'),
    exportSheetName: t('designlab.componentContracts.entityGridTemplate.exportSheetName'),
    variantModalTitle: t('designlab.componentContracts.entityGridTemplate.variantModalTitle'),
    variantNewButtonLabel: t('designlab.componentContracts.entityGridTemplate.variantNewButtonLabel'),
    variantNamePlaceholder: t('designlab.componentContracts.entityGridTemplate.variantNamePlaceholder'),
    localeText: entityGridTemplateLocaleText,
    messages: entityGridTemplateMessages,
  };

  const renderRecipeComponentPreview = (recipeId: string) => (
    <DesignLabRecipeComponentPreview
      recipeId={recipeId}
      showcaseState={showcaseState}
      layoutRecipeContext={{
        avatarPreviewImageSrc,
        descriptionsLocaleText,
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

  const renderLivePreview = (item: DesignLabIndexItem) => {
    const navigationUtilityLivePreview = buildNavigationUtilityLivePreview(item.name, {
      PreviewPanel,
      anchorTocLocaleText,
      anchorValue,
      emptyMessages,
      setAnchorValue,
      setStepsStatusRichValue,
      setStepsValue,
      stepsStatusRichValue,
      stepsValue,
      t,
    });
    if (navigationUtilityLivePreview) {
      return navigationUtilityLivePreview;
    }

    const overlayLivePreview = buildOverlayLivePreview(item.name, {
      PreviewPanel,
      contextMenuAction,
      contextMenuMessages,
      detailDrawerOpen,
      dropdownAction,
      formDrawerOpen,
      modalOpen,
      setContextMenuAction,
      setDetailDrawerOpen,
      setDropdownAction,
      setFormDrawerOpen,
      setModalOpen,
      setTourOpen,
      setTourStatus,
      setTourStep,
      t,
      tourCoachmarksLocaleText,
      tourOpen,
      tourStatus,
      tourStep,
    });
    if (overlayLivePreview) {
      return overlayLivePreview;
    }

    const collectionGridLivePreview = buildCollectionGridLivePreview(item.name, {
      PreviewPanel,
      agGridServerMessages,
      entityGridTemplateShellProps,
      gridRows,
      jsonViewerLocaleText,
      jsonViewerValue,
      listItems,
      listLocaleText,
      policyTableRows,
      serverGridRows,
      t,
      tableSimpleLocaleText,
      treeLocaleText,
      treeNodes,
      treeTableLocaleText,
      treeTableNodes,
    });
    if (collectionGridLivePreview) {
      return collectionGridLivePreview;
    }

    const formControlLivePreview = buildFormControlLivePreview(item.name, {
      PreviewPanel,
      checkboxValue,
      radioValue,
      setCheckboxValue,
      setRadioValue,
      setSwitchValue,
      setTextAreaValue,
      switchValue,
      t,
      textAreaValue,
    });
    if (formControlLivePreview) {
      return formControlLivePreview;
    }

    const advancedInputLivePreview = buildAdvancedInputLivePreview(item.name, {
      PreviewPanel,
      datePickerMessages,
      dateValue,
      setDateValue,
      setSliderValue,
      setTimeValue,
      setUploadFiles,
      sliderValue,
      t,
      timePickerMessages,
      timeValue,
      uploadFiles,
    });
    if (advancedInputLivePreview) {
      return advancedInputLivePreview;
    }

    const confidencePromptLivePreview = buildConfidencePromptLivePreview(item.name, {
      PreviewPanel,
      citationPanelItems,
      promptBody,
      promptScope,
      promptSubject,
      promptTone,
      setPromptBody,
      setPromptScope,
      setPromptSubject,
      setPromptTone,
      t,
    });
    if (confidencePromptLivePreview) {
      return confidencePromptLivePreview;
    }

    const linkInlineLivePreview = buildLinkInlineLivePreview(item.name, {
      PreviewPanel,
    });
    if (linkInlineLivePreview) {
      return linkInlineLivePreview;
    }

    const navigationRailLivePreview = buildNavigationRailLivePreview(item.name, {
      PreviewPanel,
    });
    if (navigationRailLivePreview) {
      return navigationRailLivePreview;
    }

    switch (item.name) {
       case 'Tabs':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.tabs.controlled.title')}>
                <Tabs
                  value={tabsValue}
                  onValueChange={setTabsValue}
                  items={[
                    {
                      value: 'overview',
                      label: t('designlab.showcase.component.tabs.controlled.overview.label'),
                      badge: <Badge tone="info">4</Badge>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="title">{t('designlab.showcase.component.tabs.controlled.overview.title')}</Text>
                          <Text variant="secondary" className="mt-2 block">
                            {t('designlab.showcase.component.tabs.controlled.overview.description')}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      value: 'activity',
                      label: t('designlab.showcase.component.tabs.controlled.activity.label'),
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="title">{t('designlab.showcase.component.tabs.controlled.activity.title')}</Text>
                          <Text variant="secondary" className="mt-2 block">
                            {t('designlab.showcase.component.tabs.controlled.activity.description')}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      value: 'settings',
                      label: t('designlab.showcase.component.tabs.controlled.settings.label'),
                      disabled: true,
                      content: null,
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tabs.manual.title')}>
                <Tabs
                  variant="pill"
                  defaultActiveKey="tokens"
                  items={[
                    {
                      key: 'tokens',
                      label: t('designlab.showcase.component.tabs.manual.tokens.label'),
                      icon: <span aria-hidden="true">◈</span>,
                      description: t('designlab.showcase.component.tabs.manual.tokens.description'),
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">{t('designlab.showcase.component.tabs.manual.tokens.content')}</Text>
                        </div>
                      ),
                    },
                    {
                      key: 'density',
                      label: t('designlab.showcase.component.tabs.manual.density.label'),
                      icon: <span aria-hidden="true">≋</span>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">{t('designlab.showcase.component.tabs.manual.density.content')}</Text>
                        </div>
                      ),
                    },
                    {
                      key: 'motion',
                      label: t('designlab.showcase.component.tabs.manual.motion.label'),
                      icon: <span aria-hidden="true">↻</span>,
                      content: (
                        <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
                          <Text preset="body">{t('designlab.showcase.component.tabs.manual.motion.content')}</Text>
                        </div>
                      ),
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'CommandPalette':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.live.launcher.panel')}>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setCommandPaletteOpen(true)}>
                      {t('designlab.showcase.component.commandPalette.live.launcher.open')}
                    </Button>
                    <SectionBadge label="⌘ K" />
                    <SectionBadge label={t('designlab.showcase.component.commandPalette.live.launcher.badge')} />
                  </div>
                  <CommandPalette
                    open={commandPaletteOpen}
                    title={t('designlab.showcase.component.commandPalette.live.launcher.title')}
                    subtitle={t('designlab.showcase.component.commandPalette.live.launcher.subtitle')}
                    items={commandPaletteItems}
                    query={commandPaletteQuery}
                    onQueryChange={setCommandPaletteQuery}
                    onClose={() => setCommandPaletteOpen(false)}
                    onSelect={(id, selectedItem) => {
                      setLastCommandSelection(`${selectedItem.title} · ${id}`);
                    }}
                    footer={<Text variant="secondary">{t('designlab.showcase.component.commandPalette.live.launcher.footer')}</Text>}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.live.state.panel')}>
                <div className="grid grid-cols-1 gap-3">
                  <LibraryMetricCard
                    label={t('designlab.showcase.component.commandPalette.live.state.query.label')}
                    value={commandPaletteQuery || '—'}
                    note={t('designlab.showcase.component.commandPalette.live.state.query.note')}
                  />
                  <LibraryMetricCard
                    label={t('designlab.showcase.component.commandPalette.live.state.selection.label')}
                    value={lastCommandSelection ?? t('designlab.showcase.component.commandPalette.live.state.selection.empty')}
                    note={t('designlab.showcase.component.commandPalette.live.state.selection.note')}
                  />
                  <Descriptions
                    title={t('designlab.showcase.component.commandPalette.live.state.details.title')}
                    density="compact"
                    columns={1}
                    localeText={descriptionsLocaleText}
                    items={[
                      {
                        key: 'mode',
                        label: t('designlab.showcase.component.commandPalette.live.state.details.mode.label'),
                        value: t('designlab.showcase.component.commandPalette.live.state.details.mode.value'),
                        tone: 'info',
                      },
                      {
                        key: 'scope',
                        label: t('designlab.showcase.component.commandPalette.live.state.details.scope.label'),
                        value: t('designlab.showcase.component.commandPalette.live.state.details.scope.value'),
                        tone: 'success',
                      },
                      {
                        key: 'evidence',
                        label: t('designlab.showcase.component.commandPalette.live.state.details.evidence.label'),
                        value: t('designlab.showcase.component.commandPalette.live.state.details.evidence.value'),
                        tone: 'warning',
                      },
                    ]}
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
              <PreviewPanel title={t('designlab.showcase.component.descriptions.live.rolloutSummary.panel')}>
                <Descriptions
                  title={t('designlab.showcase.component.descriptions.live.rolloutSummary.title')}
                  description={t('designlab.showcase.component.descriptions.live.rolloutSummary.description')}
                  items={rolloutDescriptionItems}
                  columns={2}
                  localeText={descriptionsLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.descriptions.live.riskApproval.panel')}>
                <Descriptions
                  title={t('designlab.showcase.component.descriptions.live.riskApproval.title')}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'risk',
                      label: t('designlab.showcase.component.descriptions.live.riskApproval.items.risk.label'),
                      value: t('designlab.showcase.component.descriptions.live.riskApproval.items.risk.value'),
                      tone: 'warning',
                    },
                    {
                      key: 'approval',
                      label: t('designlab.showcase.component.descriptions.live.riskApproval.items.approval.label'),
                      value: t('designlab.showcase.component.descriptions.live.riskApproval.items.approval.value'),
                      helper: t('designlab.showcase.component.descriptions.live.riskApproval.items.approval.helper'),
                    },
                    {
                      key: 'ticket',
                      label: t('designlab.showcase.component.descriptions.shared.ticketLabel'),
                      value: 'CHG-UI-204',
                      tone: 'info',
                    },
                  ]}
                  columns={1}
                  density="compact"
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'Alert':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Banner duyuru">
                <Alert
                  severity="info"
                  banner
                  title="Yeni kategori paketi"
                  description="Alternatif aileleri Design Lab uzerinden asamali olarak genisletiyoruz."
                />
              </PreviewPanel>
              <PreviewPanel title="Aksiyonlu durum">
                <Alert
                  severity="warning"
                  title="Yayin oncesi kontrol gerekli"
                  description="SEO ve GEO metadata alanlari tamamlanmadan sayfa public yuzeye alinmamali."
                  action={<Button size="sm">Kontrol listesi</Button>}
                />
              </PreviewPanel>
              <PreviewPanel title="Kapatilabilir uyarı">
                <Alert
                  severity="success"
                  title="Regresyon temiz"
                  description="Bu aile icin hedefli smoke ve component testleri gecti."
                  closable
                />
              </PreviewPanel>
            </div>
          </div>
        );
      case 'ThemePreviewCard':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ThemePreviewCard localeText={themePreviewCardLocaleText} />
            <ThemePreviewCard selected localeText={themePreviewCardLocaleText} />
            <ThemePreviewCard localeText={themePreviewCardLocaleText} />
          </div>
        );
      case 'PageLayout':
        return (
          <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
            <PageLayout
              {...createPageLayoutPreset({ preset: 'detail-sidebar', stickyHeader: false })}
              title={t('designlab.showcase.component.pageLayout.live.title')}
              description={t('designlab.showcase.component.pageLayout.live.description')}
              breadcrumbItems={createPageLayoutBreadcrumbItems([
                { title: t('designlab.showcase.component.pageLayout.live.breadcrumb.admin'), path: '#' },
                { title: t('designlab.showcase.component.pageLayout.live.breadcrumb.users') },
              ])}
              secondaryNav={(
                <Tabs
                  items={[
                    { key: 'overview', label: t('designlab.showcase.component.pageLayout.live.action'), content: null },
                    { key: 'detail', label: t('designlab.showcase.component.pageLayout.live.detail'), content: null },
                  ]}
                />
              )}
              actions={<Button variant="secondary">{t('designlab.showcase.component.pageLayout.live.action')}</Button>}
              filterBar={(
                <FilterBar>
                  <div className="h-10 rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">
                    {t('designlab.showcase.component.pageLayout.live.filterSlot')}
                  </div>
                </FilterBar>
              )}
              detail={(
                <div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">
                  {t('designlab.showcase.component.pageLayout.live.detail')}
                </div>
              )}
            >
              <div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">
                {t('designlab.showcase.component.pageLayout.live.content')}
              </div>
            </PageLayout>
          </div>
        );
      case 'PageHeader':
        return (
          <PageHeader
            title={t('designlab.showcase.component.pageHeader.live.title')}
            subtitle={t('designlab.showcase.component.pageHeader.live.description')}
            tags={<Badge tone="success">{t('designlab.showcase.component.pageHeader.live.status')}</Badge>}
            actions={
              <>
                <Button variant="secondary">{t('designlab.showcase.component.pageHeader.live.action.notes')}</Button>
                <Button>{t('designlab.showcase.component.pageHeader.live.action.publish')}</Button>
              </>
            }
            extra={
              <div className="rounded-2xl border border-border-subtle bg-surface-default px-4 py-3 text-sm text-text-secondary">
                {t('designlab.showcase.component.pageHeader.live.aside')}
              </div>
            }
          />
        );
      case 'ReportFilterPanel':
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <ReportFilterPanel
              onSubmit={() => setReportStatus(t('designlab.seed.reportStatus.applied'))}
              onReset={() => setReportStatus(t('designlab.seed.reportStatus.reset'))}
            >
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">
                {t('designlab.showcase.component.reportFilterPanel.live.dateRange')}
              </div>
              <div className="rounded-xl border border-border-default bg-surface-default px-3 py-2 text-sm text-text-secondary">
                {t('designlab.showcase.component.reportFilterPanel.live.owner')}
              </div>
            </ReportFilterPanel>
            <Text variant="secondary" className="mt-3 block">
              {t('designlab.showcase.component.reportFilterPanel.live.statusLabel', { value: reportStatus })}
            </Text>
          </div>
        );
      case 'SummaryStrip':
        return (
          <SummaryStrip
            title={t('designlab.showcase.component.summaryStrip.live.title')}
            description={t('designlab.showcase.component.summaryStrip.live.description')}
            items={summaryStripItems}
          />
        );
      case 'EntitySummaryBlock':
        return (
          <EntitySummaryBlock
            title={t('designlab.showcase.component.entitySummaryBlock.live.title')}
            subtitle={t('designlab.showcase.component.entitySummaryBlock.live.subtitle')}
            badge={<Badge tone="info">{t('designlab.showcase.component.entitySummaryBlock.live.badge')}</Badge>}
            avatar={{ name: t('designlab.showcase.component.entitySummaryBlock.live.title') }}
            actions={<Button variant="secondary">{t('designlab.showcase.component.entitySummaryBlock.live.action')}</Button>}
            items={entitySummaryItems}
          />
        );
      default:
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
            <Text as="div" className="font-semibold">{t('designlab.showcase.component.inspectorPreview.title')}</Text>
            <Text variant="secondary" className="mt-2 block">
              {t('designlab.showcase.component.inspectorPreview.description')}
            </Text>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
              <DetailLabel>{t('designlab.showcase.component.inspectorPreview.registryNote')}</DetailLabel>
              <Text variant="secondary" className="mt-2 block">{item.description}</Text>
            </div>
          </div>
        );
    }
  };

  const buildDemoShowcaseSections = (item: DesignLabIndexItem): ComponentShowcaseSection[] => {
    const actionDataEntrySections = buildActionDataEntryShowcaseSections(item.name, {
      PreviewPanel,
      t,
      checkboxValue,
      dropdownAction,
      inviteInputValue,
      searchInputValue,
      selectValue,
      textInputValue,
      setCheckboxValue,
      setDropdownAction,
      setInviteInputValue,
      setSearchInputValue,
      setSelectValue,
      setTextInputValue,
    });
    if (actionDataEntrySections) {
      return actionDataEntrySections;
    }

    const formControlSections = buildFormControlShowcaseSections(item.name, {
      commentValue,
      PreviewPanel,
      checkboxValue,
      radioValue,
      setCommentValue,
      setCheckboxValue,
      setRadioValue,
      setSwitchValue,
      setTextAreaValue,
      switchValue,
      t,
      textAreaValue,
    });
    if (formControlSections) {
      return formControlSections;
    }

    const advancedInputSections = buildAdvancedInputShowcaseSections(item.name, {
      PreviewPanel,
      datePickerMessages,
      dateValue,
      setDateValue,
      setSliderValue,
      setTimeValue,
      setUploadFiles,
      sliderValue,
      t,
      timePickerMessages,
      timeValue,
      uploadFiles,
    });
    if (advancedInputSections) {
      return advancedInputSections;
    }

    const confidencePromptSections = buildConfidencePromptShowcaseSections(item.name, {
      PreviewPanel,
      citationPanelItems,
      promptBody,
      promptScope,
      promptSubject,
      promptTone,
      setPromptBody,
      setPromptScope,
      setPromptSubject,
      setPromptTone,
      t,
    });
    if (confidencePromptSections) {
      return confidencePromptSections;
    }

    const aiGovernanceSections = buildAiGovernanceShowcaseSections(item.name, {
      PreviewPanel,
      t,
      approvalCheckpointState,
      approvalCheckpointSteps,
      auditTimelineItems,
      citationPanelItems,
      descriptionsLocaleText,
      recommendationDecision,
      recommendationDecisionLabels,
      selectedAuditId,
      selectedCitationId,
      setApprovalCheckpointState,
      setRecommendationDecision,
      setSelectedAuditId,
      setSelectedCitationId,
    });
    if (aiGovernanceSections) {
      return aiGovernanceSections;
    }

    const searchFilterSections = buildSearchFilterShowcaseSections(item.name, {
      PreviewPanel,
      t,
      commandPaletteItems,
      commandPaletteOpen,
      commandPaletteQuery,
      dateValue,
      datePickerMessages,
      descriptionsLocaleText,
      dropdownAction,
      lastCommandSelection,
      listLocaleText,
      reportStatus,
      searchInputValue,
      selectValue,
      serverGridRows,
      setCommandPaletteOpen,
      setCommandPaletteQuery,
      setDateValue,
      setDropdownAction,
      setLastCommandSelection,
      setReportStatus,
      setSearchInputValue,
      setSelectValue,
      renderRecipeComponentPreview,
    });
    if (searchFilterSections) {
      return searchFilterSections;
    }

    const dataDisplayAnalyticsSections = buildDataDisplayAnalyticsShowcaseSections(item.name, {
      PreviewPanel,
      t,
      agGridServerMessages,
      descriptionsLocaleText,
      rolloutDescriptionItems,
      serverGridRows,
      treeTableLocaleText,
      treeTableNodes,
      renderRecipeComponentPreview,
    });
    if (dataDisplayAnalyticsSections) {
      return dataDisplayAnalyticsSections;
    }

    const layoutSections = buildLayoutShowcaseSections(item.name, {
      PreviewPanel,
      t,
      avatarPreviewImageSrc,
      descriptionsLocaleText,
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
    });
    if (layoutSections) {
      return layoutSections;
    }

    const themeRecipeSections = buildThemeRecipeShowcaseSections(item.name, {
      PreviewPanel,
      t,
      approvalCheckpointState,
      approvalCheckpointStateLabels,
      approvalCheckpointSteps,
      auditTimelineItems,
      citationPanelItems,
      compactThemePreset,
      contrastThemePreset,
      defaultThemePreset,
      renderRecipeComponentPreview,
      selectedAuditId,
      selectedCitationId,
      setApprovalCheckpointState,
      setSelectedAuditId,
      setSelectedCitationId,
      themePresetGalleryItems,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- cross-package ReactNode compat (React 19 vs 18 types)
      themePresetSummary: themePresetSummary as any,
    });
    if (themeRecipeSections) {
      return themeRecipeSections;
    }

    const tabsFeedbackSections = buildTabsFeedbackShowcaseSections(item.name, {
      PreviewPanel,
      t,
      dropdownAction,
      setDropdownAction,
      setTabsValue,
      tabsValue,
    });
    if (tabsFeedbackSections) {
      return tabsFeedbackSections;
    }

    const overlaySections = buildOverlayShowcaseSections(item.name, {
      PreviewPanel,
      contextMenuAction,
      contextMenuMessages,
      detailDrawerOpen,
      dropdownAction,
      formDrawerOpen,
      modalOpen,
      readonlyFormDrawerOpen,
      selectValue,
      setContextMenuAction,
      setDetailDrawerOpen,
      setDropdownAction,
      setFormDrawerOpen,
      setModalOpen,
      setReadonlyFormDrawerOpen,
      setSelectValue,
      setTextInputValue,
      setTourOpen,
      setTourStatus,
      setTourStep,
      t,
      textInputValue,
      tourCoachmarksLocaleText,
      tourOpen,
      tourStatus,
      tourStep,
    });
    if (overlaySections) {
      return overlaySections;
    }

    const collectionGridSections = buildCollectionGridShowcaseSections(item.name, {
      PreviewPanel,
      descriptionsLocaleText,
      entityGridTemplateShellProps,
      gridRows,
      jsonViewerLocaleText,
      jsonViewerValue,
      listItems,
      listLocaleText,
      policyTableRows,
      serverGridRows,
      t,
      tableSimpleLocaleText,
      treeLocaleText,
      treeNodes,
    });
    if (collectionGridSections) {
      return collectionGridSections;
    }

    const linkInlineSections = buildLinkInlineShowcaseSections(item.name, {
      PreviewPanel,
    });
    if (linkInlineSections) {
      return linkInlineSections;
    }

    const navigationRailSections = buildNavigationRailShowcaseSections(item.name, {
      PreviewPanel,
    });
    if (navigationRailSections) {
      return navigationRailSections;
    }

    if (isMenuBarShowcaseItemName(item.name)) {
        return buildMenuBarShowcaseSections({
          ariaLabel: t('designlab.showcase.component.menuBar.aria'),
          locale,
          itemName: item.name,
        });
    }

    switch (item.name) {
      case 'Pagination':
        return buildPaginationShowcaseSections({
          localeText: paginationLocaleText,
        });
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

  const buildFamilyWorkspaceShowcaseSections = (family: DesignLabShowcaseFamily): ComponentShowcaseSection[] => {
    const familyItems = family.ownerBlocks
      .map((owner) => designLabIndex.items.find((item) => item.name === owner) ?? null)
      .filter((item): item is DesignLabIndexItem => Boolean(item));
    const missingOwners = family.ownerBlocks.filter((owner) => !familyItems.some((item) => item.name === owner));
    const familyTracks = Array.from(new Set(familyItems.map((item) => trackMeta[resolveItemTrack(item)].label)));
    const familySections = Array.from(new Set(familyItems.flatMap((item) => item.sectionIds ?? [])));
    const familyThemes = Array.from(
      new Set(
        familyItems.flatMap((item) => [item.uxPrimaryThemeId, item.uxPrimarySubthemeId].filter(Boolean) as string[]),
      ),
    );
    const familyQuality = Array.from(new Set(familyItems.flatMap((item) => item.qualityGates ?? [])));

    return [
      {
        id: `${toTestIdSuffix(family.recipeId)}-assembly-map`,
        kind: 'recipe',
        eyebrow: 'Recipe 01',
        title: t('designlab.showcase.recipe.workspace.surface.title'),
        description: t('designlab.showcase.recipe.workspace.surface.description'),
        badges: ['recipe', 'assembly', `${family.ownerBlocks.length} blocks`],
        content: (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <PreviewPanel title={t('designlab.showcase.recipe.workspace.surface.title')} kind="recipe">
              {renderRecipeComponentPreview(family.recipeId)}
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.recipeLens.consumerHandoff')} kind="recipe">
              <div className="grid grid-cols-1 gap-3">
                <LibraryMetricCard
                  label={t('designlab.showcase.recipe.workspace.handoff.preferredPath')}
                  value={t('designlab.showcase.recipe.workspace.handoff.preferredPath.value')}
                  note={t('designlab.showcase.recipe.workspace.handoff.preferredPath.note')}
                />
                <LibraryMetricCard
                  label={t('designlab.showcase.recipe.workspace.handoff.trackSpread')}
                  value={familyTracks.length ? familyTracks.join(' / ') : '—'}
                  note={t('designlab.showcase.recipe.workspace.handoff.trackSpread.note')}
                />
                {missingOwners.length ? (
                  <div className="rounded-2xl border border-state-warning-border bg-state-warning-bg p-4">
                    <DetailLabel>{t('designlab.showcase.recipe.workspace.handoff.missingOwners')}</DetailLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {missingOwners.map((owner) => (
                        <SectionBadge key={owner} label={owner} className="border-state-warning-border bg-state-warning-bg text-state-warning-text" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                    <DetailLabel>{t('designlab.showcase.recipe.workspace.handoff.contractHealth')}</DetailLabel>
                    <Text variant="secondary" className="mt-2 block text-sm leading-7">
                      {t('designlab.showcase.recipe.workspace.handoff.contractHealth.description')}
                    </Text>
                  </div>
                )}
              </div>
            </PreviewPanel>
          </div>
        ),
      },
      {
        id: `${toTestIdSuffix(family.recipeId)}-building-blocks`,
        kind: 'live',
        eyebrow: 'Recipe 02',
        title: t('designlab.showcase.recipe.workspace.buildingBlocks.title'),
        description: t('designlab.showcase.recipe.workspace.buildingBlocks.description'),
        badges: ['live', 'component-bridge', 'handoff'],
        content: (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {familyItems.map((item) => (
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
                    onClick={() => onFocusComponentFromFamily(item)}
                    data-testid={`design-lab-recipe-owner-${toTestIdSuffix(family.recipeId)}-${toTestIdSuffix(item.name)}`}
                  >
                    {t('designlab.showcase.recipe.workspace.buildingBlocks.action')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: `${toTestIdSuffix(family.recipeId)}-quality-reference`,
        kind: 'reference',
        eyebrow: 'Recipe 03',
        title: t('designlab.showcase.recipe.workspace.quality.title'),
        description: t('designlab.showcase.recipe.workspace.quality.description'),
        badges: ['reference', 'quality', 'ux'],
        content: (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
            <PreviewPanel title={t('designlab.showcase.recipe.workspace.quality.gates')} kind="reference">
              <div className="flex flex-wrap gap-2">
                {familyQuality.length
                  ? familyQuality.map((gate) => <SectionBadge key={gate} label={gate} />)
                  : <Text variant="secondary">{t('designlab.showcase.recipe.workspace.quality.noGate')}</Text>}
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.recipe.workspace.quality.uxAndSections')} kind="reference">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {familyThemes.length
                    ? familyThemes.map((theme) => <SectionBadge key={theme} label={theme} />)
                    : <Text variant="secondary">{t('designlab.showcase.recipe.workspace.quality.noTheme')}</Text>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {familySections.length
                    ? familySections.map((section) => <SectionBadge key={section} label={section} />)
                    : <Text variant="secondary">{t('designlab.showcase.recipe.workspace.quality.noSection')}</Text>}
                </div>
              </div>
            </PreviewPanel>
          </div>
        ),
      },
    ];
  };

  const renderFamilyDemoSection = (family: DesignLabShowcaseFamily | null) => {
    if (!family) {
      return <Text variant="secondary">{t('designlab.showcase.preview.selectRecipe')}</Text>;
    }

    const showcaseSections = buildFamilyWorkspaceShowcaseSections(family).map((section) => ({
      ...section,
      kind: resolveShowcaseSectionKind(section),
    }));
    return (
      <PreviewWorkspace
        mode="recipes"
        sections={showcaseSections}
        activePreviewPanel={activePreviewPanel}
        onPreviewPanelChange={onPreviewPanelChange}
        testIdPrefix="design-lab-recipe-demo-card"
        emptyMessage={t('designlab.showcase.preview.empty.recipe')}
      />
    );
  };

  const renderDemoSection = (item: DesignLabIndexItem | null) => {
    if (!item) {
      return <Text variant="secondary">{t('designlab.showcase.preview.selectComponent')}</Text>;
    }

    if (item.availability === 'planned' || item.demoMode === 'planned') {
      return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <LibraryShowcaseCard
            eyebrow={t('designlab.showcase.component.planned.roadmap')}
            title={t('designlab.showcase.component.planned.title', { name: item.name })}
            description={t('designlab.showcase.component.planned.description')}
            badges={<Tag tone="info">{t('designlab.showcase.component.planned.badge')}</Tag>}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <LibraryMetricCard
                label={t('designlab.showcase.component.planned.releaseGate')}
                value={t('designlab.showcase.component.planned.releaseGate.value')}
                note={t('designlab.showcase.component.planned.releaseGate.note')}
              />
              <LibraryMetricCard
                label={t('designlab.showcase.component.planned.wave')}
                value={item.roadmapWaveId ?? '—'}
                note={t('designlab.showcase.component.planned.wave.note')}
              />
            </div>
          </LibraryShowcaseCard>
          <LibraryShowcaseCard
            eyebrow={t('designlab.showcase.component.planned.northStar')}
            title={t('designlab.showcase.component.planned.northStar.title')}
            description={t('designlab.showcase.component.planned.northStar.description')}
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

    return (
      <PreviewWorkspace
        mode="components"
        sections={baseShowcaseSections}
        activePreviewPanel={activePreviewPanel}
        onPreviewPanelChange={onPreviewPanelChange}
        testIdPrefix="design-lab-demo-card"
        emptyMessage={t('designlab.showcase.preview.empty.component')}
      />
    );
  };


  return mode === 'components' || mode === 'foundations' ? renderDemoSection(item) : renderFamilyDemoSection(family);
};
