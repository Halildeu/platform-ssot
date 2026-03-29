import React from 'react';
import { buildActionDataEntryShowcaseSections } from './preview-components/showcase-families/buildActionDataEntryShowcaseSections';
import { buildAdvancedInputShowcaseSections } from './preview-components/showcase-families/buildAdvancedInputShowcaseSections';
import { buildAiGovernanceShowcaseSections } from './preview-components/showcase-families/buildAiGovernanceShowcaseSections';
import { buildCollectionGridShowcaseSections } from './preview-components/showcase-families/buildCollectionGridShowcaseSections';
import { buildConfidencePromptShowcaseSections } from './preview-components/showcase-families/buildConfidencePromptShowcaseSections';
import { buildDataDisplayAnalyticsShowcaseSections } from './preview-components/showcase-families/buildDataDisplayAnalyticsShowcaseSections';
import { buildFormControlShowcaseSections } from './preview-components/showcase-families/buildFormControlShowcaseSections';
import { buildLayoutShowcaseSections } from './preview-components/showcase-families/buildLayoutShowcaseSections';
import { buildLinkInlineShowcaseSections } from './preview-components/link-inline';
import { buildNavigationRailShowcaseSections } from './preview-components/navigation-rail';
import { buildOverlayShowcaseSections } from './preview-components/showcase-families/buildOverlayShowcaseSections';
import { buildSearchFilterShowcaseSections } from './preview-components/showcase-families/buildSearchFilterShowcaseSections';
import { buildTabsFeedbackShowcaseSections } from './preview-components/showcase-families/buildTabsFeedbackShowcaseSections';
import { buildThemeRecipeShowcaseSections } from './preview-components/showcase-families/buildThemeRecipeShowcaseSections';
import { buildMenuBarShowcaseSections, isMenuBarShowcaseItemName } from './preview-components/menu-bar';
import { buildPaginationShowcaseSections } from './preview-components/pagination';
import type { ComponentShowcaseSection, DesignLabIndexItem } from './showcaseTypes';
import { PreviewPanel } from './showcaseHelpers';

/**
 * Builds the showcase sections array for a given component item.
 * Extracted from DesignLabShowcaseContent to reduce file size.
 *
 * The `scope` parameter provides all state values, setters, locale text,
 * and helper functions from the parent component closure.
 */
 
export function buildDemoShowcaseSections(item: DesignLabIndexItem, scope: Record<string, any>): ComponentShowcaseSection[] {
  const {
    PreviewPanel: _PreviewPanel,
    t, checkboxValue, dropdownAction, inviteInputValue, searchInputValue,
    selectValue, textInputValue, setCheckboxValue, setDropdownAction,
    setInviteInputValue, setSearchInputValue, setSelectValue, setTextInputValue,
    commentValue, radioValue, setCommentValue, setRadioValue, setSwitchValue,
    switchValue, setTextAreaValue, textAreaValue,
    contextMenuAction, contextMenuMessages, detailDrawerOpen, formDrawerOpen,
    modalOpen, setContextMenuAction, setDetailDrawerOpen,
    setFormDrawerOpen, setModalOpen, setTourOpen, setTourStatus, setTourStep,
    tourCoachmarksLocaleText, tourOpen, tourStatus, tourStep,
    readonlyFormDrawerOpen, setReadonlyFormDrawerOpen,
    agGridServerMessages, entityGridTemplateShellProps, gridRows, jsonViewerLocaleText,
    jsonViewerValue, listItems, listLocaleText, policyTableRows, serverGridRows,
    tableSimpleLocaleText, treeLocaleText, treeNodes, treeTableLocaleText, treeTableNodes,
    datePickerMessages, dateValue, setDateValue, setSliderValue, setTimeValue,
    setUploadFiles, sliderValue, timePickerMessages, timeValue, uploadFiles,
    approvalCheckpointState, approvalCheckpointSteps, approvalCheckpointStateLabels,
    auditTimelineItems, auditActorLabels, auditStatusLabels, citationPanelItems,
    selectedAuditId, selectedCitationId, setApprovalCheckpointState,
    setSelectedAuditId, setSelectedCitationId,
    promptBody, promptScope, promptSubject, promptTone, setPromptBody,
    setPromptScope, setPromptSubject, setPromptTone,
    recommendationDecision, recommendationDecisionLabels, setRecommendationDecision,
    avatarPreviewImageSrc, descriptionsLocaleText, entitySummaryItems,
    pageHeaderMeta, rolloutDescriptionItems, summaryStripItems,
    commandPaletteItems, commandPaletteOpen, commandPaletteQuery,
    setCommandPaletteOpen, setCommandPaletteQuery, setLastCommandSelection,
    lastCommandSelection, reportStatus, setReportStatus,
    renderRecipeComponentPreview, renderComponentLivePreview,
    locale, paginationLocaleText, linkInlineLocaleText,
    themePresetSummary, themePresetGalleryItems,
    defaultThemePreset, contrastThemePreset, compactThemePreset,
    anchorTocLocaleText, anchorValue, emptyMessages, setAnchorValue,
    setStepsStatusRichValue, setStepsValue, stepsStatusRichValue, stepsValue,
    themePreviewCardLocaleText,
  } = scope;

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
}

 
export function buildFamilyWorkspaceShowcaseSections(family: { recipeId: string; title?: string; clusterTitle?: string; clusterDescription?: string; intent: string; ownerBlocks: string[] }, scope: Record<string, any>): ComponentShowcaseSection[] {
  const { renderRecipeComponentPreview, t } = scope;

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
              <div key={item.name} className="rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="div" className="font-semibold text-text-primary">
                      {item.name}
                    </Text>
                    <Text variant="secondary" className="mt-1 block text-sm leading-6">
                      {item.description}
                    </Text>
                  </div>
                  <Badge variant={item.lifecycle === 'stable' ? 'success' : item.lifecycle === 'beta' ? 'warning' : 'info'}>
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
              <div className="flex flex-col gap-3">
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
}
