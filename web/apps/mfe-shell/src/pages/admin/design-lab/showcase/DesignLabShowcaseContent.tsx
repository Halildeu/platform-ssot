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
import { DesignLabMenuBarShowcase } from './preview-components/DesignLabMenuBarShowcase';
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
  ShowcaseState,
  DesignLabIndexItem,
  DesignLabShowcaseFamily,
  DesignLabIndex,
  DesignLabShowcaseContentProps,
  DesignLabLifecycle,
  DesignLabDemoMode,
} from './showcaseTypes';

/* ---- Extracted modules ---- */
export { designLabPreviewPanelIds, getDesignLabPreviewPanelItems, filterDesignLabShowcaseSectionsForMode } from './showcaseHelpers';
export { DesignLabRecipeComponentPreview } from './DesignLabRecipePreview';
import { DesignLabRecipeComponentPreview } from './DesignLabRecipePreview';
import { resolveShowcaseSectionKind, PreviewPanel, PreviewWorkspace } from './showcaseHelpers';
import { renderLivePreview } from './showcaseLivePreview';
import { buildDemoShowcaseSections as _buildDemoShowcaseSections, buildFamilyWorkspaceShowcaseSections as _buildFamilyWorkspaceShowcaseSections } from './showcaseSectionBuilder';

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

  const _scope = {
    PreviewPanel, t, locale,
    anchorTocLocaleText, anchorValue, emptyMessages, setAnchorValue,
    setStepsStatusRichValue, setStepsValue, stepsStatusRichValue, stepsValue,
    contextMenuAction, contextMenuMessages, detailDrawerOpen, dropdownAction,
    formDrawerOpen, modalOpen, setContextMenuAction, setDetailDrawerOpen,
    setDropdownAction, setFormDrawerOpen, setModalOpen, setTourOpen,
    setTourStatus, setTourStep, tourCoachmarksLocaleText, tourOpen, tourStatus, tourStep,
    readonlyFormDrawerOpen, setReadonlyFormDrawerOpen,
    agGridServerMessages, entityGridTemplateShellProps, gridRows, jsonViewerLocaleText,
    jsonViewerValue, listItems, listLocaleText, policyTableRows, serverGridRows,
    tableSimpleLocaleText, treeLocaleText, treeNodes, treeTableLocaleText, treeTableNodes,
    checkboxValue, radioValue, setCheckboxValue, setRadioValue, setSwitchValue,
    setTextAreaValue, switchValue, textAreaValue, commentValue, setCommentValue,
    datePickerMessages, dateValue, setDateValue, setSliderValue, setTimeValue,
    setUploadFiles, sliderValue, timePickerMessages, timeValue, uploadFiles,
    citationPanelItems, promptBody, promptScope, promptSubject, promptTone,
    setPromptBody, setPromptScope, setPromptSubject, setPromptTone,
    tabsValue, setTabsValue, commandPaletteOpen, commandPaletteItems,
    commandPaletteQuery, setCommandPaletteOpen, setCommandPaletteQuery,
    setLastCommandSelection, lastCommandSelection, descriptionsLocaleText,
    rolloutDescriptionItems, themePreviewCardLocaleText, entitySummaryItems,
    summaryStripItems, reportStatus, setReportStatus, searchInputValue, pageHeaderMeta,
    approvalCheckpointState, approvalCheckpointSteps, approvalCheckpointStateLabels,
    auditTimelineItems, auditActorLabels, auditStatusLabels,
    selectedAuditId, selectedCitationId, setApprovalCheckpointState,
    setSelectedAuditId, setSelectedCitationId,
    recommendationDecision, recommendationDecisionLabels, setRecommendationDecision,
    avatarPreviewImageSrc, inviteInputValue, setInviteInputValue, selectValue, setSelectValue,
    textInputValue, setTextInputValue,
    paginationLocaleText, linkInlineLocaleText,
    themePresetSummary, themePresetGalleryItems,
    defaultThemePreset, contrastThemePreset, compactThemePreset,
    renderRecipeComponentPreview: (recipeId: string) => renderRecipeComponentPreview(recipeId),
    renderComponentLivePreview: (componentItem: DesignLabIndexItem) => renderLivePreview(componentItem, _scope),
  };

  const buildDemoShowcaseSections = (componentItem: DesignLabIndexItem): ComponentShowcaseSection[] =>
    _buildDemoShowcaseSections(componentItem, _scope);

  const buildFamilyWorkspaceShowcaseSections = (family: DesignLabShowcaseFamily): ComponentShowcaseSection[] =>
    _buildFamilyWorkspaceShowcaseSections(family, _scope);

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
            badges={<Tag variant="info">{t('designlab.showcase.component.planned.badge')}</Tag>}
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
