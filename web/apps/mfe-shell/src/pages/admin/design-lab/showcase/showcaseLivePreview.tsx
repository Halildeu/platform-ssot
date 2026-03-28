import React from 'react';
import {
  Badge,
  Button,
  CommandPalette,
  Descriptions,
  EntitySummaryBlock,
  FilterBar,
  PageHeader,
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
  ReportFilterPanel,
  SummaryStrip,
  Tabs,
  Text,
  ThemePreviewCard,
} from '@mfe/design-system';
import {
  LibraryDetailLabel as DetailLabel,
  LibraryMetricCard,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import { buildNavigationUtilityLivePreview } from './preview-components/showcase-families/buildNavigationUtilityLivePreview';
import { buildOverlayLivePreview } from './preview-components/showcase-families/buildOverlayLivePreview';
import { buildCollectionGridLivePreview } from './preview-components/showcase-families/buildCollectionGridLivePreview';
import { buildFormControlLivePreview } from './preview-components/showcase-families/buildFormControlLivePreview';
import { buildAdvancedInputLivePreview } from './preview-components/showcase-families/buildAdvancedInputLivePreview';
import { buildConfidencePromptLivePreview } from './preview-components/showcase-families/buildConfidencePromptLivePreview';
import { buildLinkInlineLivePreview } from './preview-components/link-inline';
import { buildNavigationRailLivePreview } from './preview-components/navigation-rail';
import type { DesignLabIndexItem } from './showcaseTypes';
import { PreviewPanel } from './showcaseHelpers';

/**
 * Renders the live interactive preview for a given component.
 * Extracted from DesignLabShowcaseContent to reduce file size.
 * 
 * The `ctx` parameter is a Record containing all the state values,
 * setters, and locale text objects from the parent component scope.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderLivePreview = (item: DesignLabIndexItem, ctx: Record<string, any>): React.ReactNode => {
  const {
    t, anchorTocLocaleText, anchorValue, emptyMessages, setAnchorValue,
    setStepsStatusRichValue, setStepsValue, stepsStatusRichValue, stepsValue,
    contextMenuAction, contextMenuMessages, detailDrawerOpen, dropdownAction,
    formDrawerOpen, modalOpen, setContextMenuAction, setDetailDrawerOpen,
    setDropdownAction, setFormDrawerOpen, setModalOpen, setTourOpen,
    setTourStatus, setTourStep, tourCoachmarksLocaleText, tourOpen, tourStatus, tourStep,
    agGridServerMessages, entityGridTemplateShellProps, gridRows, jsonViewerLocaleText,
    jsonViewerValue, listItems, listLocaleText, policyTableRows, serverGridRows,
    tableSimpleLocaleText, treeLocaleText, treeNodes, treeTableLocaleText, treeTableNodes,
    checkboxValue, radioValue, setCheckboxValue, setRadioValue, setSwitchValue,
    setTextAreaValue, switchValue, textAreaValue,
    datePickerMessages, dateValue, setDateValue, setSliderValue, setTimeValue,
    setUploadFiles, sliderValue, timePickerMessages, timeValue, uploadFiles,
    citationPanelItems, promptBody, promptScope, promptSubject, promptTone,
    setPromptBody, setPromptScope, setPromptSubject, setPromptTone,
    tabsValue, setTabsValue, commandPaletteOpen, commandPaletteItems,
    commandPaletteQuery, setCommandPaletteOpen, setCommandPaletteQuery,
    setLastCommandSelection, lastCommandSelection, descriptionsLocaleText,
    rolloutDescriptionItems, themePreviewCardLocaleText, entitySummaryItems,
    summaryStripItems, reportStatus, setReportStatus, searchInputValue, pageHeaderMeta,
  } = ctx;

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
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.tabs.controlled.title')}>
                <Tabs
                  value={tabsValue}
                  onValueChange={setTabsValue}
                  items={[
                    {
                      value: 'overview',
                      label: t('designlab.showcase.component.tabs.controlled.overview.label'),
                      badge: <Badge variant="info">4</Badge>,
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
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.live.launcher.panel')}>
                <div className="flex flex-col gap-4">
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
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
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
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
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
          <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-xs">
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
            tags={<Badge variant="success">{t('designlab.showcase.component.pageHeader.live.status')}</Badge>}
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
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
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
            badge={<Badge variant="info">{t('designlab.showcase.component.entitySummaryBlock.live.badge')}</Badge>}
            avatar={{ name: t('designlab.showcase.component.entitySummaryBlock.live.title') }}
            actions={<Button variant="secondary">{t('designlab.showcase.component.entitySummaryBlock.live.action')}</Button>}
            items={entitySummaryItems}
          />
        );
      default:
        return (
          <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
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
};
