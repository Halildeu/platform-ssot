import React from 'react';
import {
  ApprovalCheckpoint,
  ApprovalReview,
  AIGuidedAuthoring,
  CitationPanel,
  AIActionAuditTimeline,
  DetailSummary,
  Descriptions,
  SearchFilterListing,
  Skeleton,
  SummaryStrip,
  Text,
  Tooltip,
  Avatar,
} from '@mfe/design-system';
import {
  LibraryDetailLabel as DetailLabel,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import { useDesignLabI18n } from '../useDesignLabI18n';
import { buildLayoutShowcaseSections } from './preview-components/showcase-families/buildLayoutShowcaseSections';
import type {
  ComponentShowcaseSection,
  DemoSurfaceKind,
  DesignLabRecipeComponentPreviewProps,
} from './showcaseTypes';

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
          status={<Badge variant="info">Live</Badge>}
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
                size="sm"
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
              <Badge variant={row.status === 'Ready' ? 'success' : 'info'}>{String(row.status)}</Badge>
              <Badge variant="muted">{String(row.track)}</Badge>
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
          status={<Badge variant="success">{t('designlab.showcase.recipe.detailSummary.status')}</Badge>}
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
            badge: <Badge variant="success">Stable</Badge>,
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
