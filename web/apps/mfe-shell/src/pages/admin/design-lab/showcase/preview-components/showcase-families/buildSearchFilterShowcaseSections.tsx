import React from 'react';
import {
  Badge,
  Button,
  CommandPalette,
  DatePicker,
  Descriptions,
  List,
  ReportFilterPanel,
  SearchFilterListing,
  Select,
  SummaryStrip,
  Text,
  TextInput,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type CommandPaletteItem = {
  id: string;
  title: string;
  description?: string;
  shortcut?: string;
  group?: string;
};

type SearchFilterListingRow = {
  id: string;
  name: string;
  owner: string;
  theme: string;
  status: string;
  track: string;
};

type SearchFilterShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
  commandPaletteItems: CommandPaletteItem[];
  commandPaletteOpen: boolean;
  commandPaletteQuery: string;
  dateValue: string;
  datePickerMessages: Record<string, string>;
  descriptionsLocaleText: Record<string, unknown>;
  dropdownAction: string;
  lastCommandSelection: string | null;
  listLocaleText: Record<string, unknown>;
  reportStatus: string;
  searchInputValue: string;
  selectValue: string;
  serverGridRows: SearchFilterListingRow[];
  setCommandPaletteOpen: (nextValue: boolean) => void;
  setCommandPaletteQuery: (nextValue: string) => void;
  setDateValue: (nextValue: string) => void;
  setDropdownAction: (nextValue: string) => void;
  setLastCommandSelection: (nextValue: string | null) => void;
  setReportStatus: (nextValue: string) => void;
  setSearchInputValue: (nextValue: string) => void;
  setSelectValue: (nextValue: string) => void;
  renderRecipeComponentPreview: (recipeId: string) => React.ReactNode;
};

export const buildSearchFilterShowcaseSections = (
  componentName: string,
  context: SearchFilterShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
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
  } = context;

  switch (componentName) {
    case 'CommandPalette':
      return [
        {
          id: 'command-palette-global-launcher',
          eyebrow: t('designlab.showcase.component.commandPalette.sections.launcher.eyebrow'),
          title: t('designlab.showcase.component.commandPalette.sections.launcher.title'),
          description: t('designlab.showcase.component.commandPalette.sections.launcher.description'),
          badges: [
            t('designlab.showcase.component.commandPalette.sections.launcher.badge.launcher'),
            t('designlab.showcase.component.commandPalette.sections.launcher.badge.dialog'),
            t('designlab.showcase.component.commandPalette.sections.launcher.badge.navigate'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.sections.launcher.panelOpenState')}>
                <div className="flex flex-col gap-4">
                  <Button onClick={() => setCommandPaletteOpen(true)}>
                    {t('designlab.showcase.component.commandPalette.sections.launcher.openButton')}
                  </Button>
                  <CommandPalette
                    open={commandPaletteOpen}
                    title={t('designlab.showcase.component.commandPalette.sections.launcher.paletteTitle')}
                    subtitle={t('designlab.showcase.component.commandPalette.sections.launcher.paletteSubtitle')}
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
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.sections.launcher.panelSelected')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.commandPalette.sections.launcher.selected.label')}
                  value={lastCommandSelection ?? t('designlab.showcase.component.commandPalette.sections.launcher.selected.empty')}
                  note={t('designlab.showcase.component.commandPalette.sections.launcher.selected.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'command-palette-readonly-browse',
          eyebrow: t('designlab.showcase.component.commandPalette.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.commandPalette.sections.readonly.title'),
          description: t('designlab.showcase.component.commandPalette.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.commandPalette.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.commandPalette.sections.readonly.badge.governed'),
            t('designlab.showcase.component.commandPalette.sections.readonly.badge.browse'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.sections.readonly.panelContract')}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.readonly.chipReadonly')} />
                    <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.readonly.chipDiscoverability')} />
                    <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.readonly.chipNoExecution')} />
                  </div>
                  <Text variant="secondary" className="block leading-7">
                    {t('designlab.showcase.component.commandPalette.sections.readonly.body')}
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
                    localeText={listLocaleText}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.sections.readonly.panelNote')}>
                <Descriptions
                  title={t('designlab.showcase.component.commandPalette.sections.readonly.noteTitle')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'access',
                      label: t('designlab.showcase.component.commandPalette.sections.readonly.note.accessLabel'),
                      value: t('designlab.showcase.component.commandPalette.sections.readonly.note.accessValue'),
                      tone: 'info',
                    },
                    {
                      key: 'focus',
                      label: t('designlab.showcase.component.commandPalette.sections.readonly.note.focusLabel'),
                      value: t('designlab.showcase.component.commandPalette.sections.readonly.note.focusValue'),
                      tone: 'success',
                    },
                    {
                      key: 'ux',
                      label: t('designlab.showcase.component.commandPalette.sections.readonly.note.uxLabel'),
                      value: t('designlab.showcase.component.commandPalette.sections.readonly.note.uxValue'),
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'command-palette-approval-scope',
          eyebrow: t('designlab.showcase.component.commandPalette.sections.scope.eyebrow'),
          title: t('designlab.showcase.component.commandPalette.sections.scope.title'),
          description: t('designlab.showcase.component.commandPalette.sections.scope.description'),
          badges: [
            t('designlab.showcase.component.commandPalette.sections.scope.badge.approval'),
            t('designlab.showcase.component.commandPalette.sections.scope.badge.aiAssist'),
            t('designlab.showcase.component.commandPalette.sections.scope.badge.scope'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.sections.scope.panelCommands')}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.scope.chipAiAssist')} />
                    <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.scope.chipGovernance')} />
                  </div>
                  <List
                    items={commandPaletteItems
                      .filter((item) => item.group === 'AI Assist' || item.group === 'Governance')
                      .map((item) => ({
                        key: item.id,
                        title: String(item.title),
                        description: String(item.description ?? ''),
                        meta: item.shortcut,
                        badges: [item.group ?? t('designlab.showcase.component.commandPalette.sections.scope.generalGroup')],
                      }))}
                    localeText={listLocaleText}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.commandPalette.sections.scope.panelSummary')}>
                <div className="flex flex-wrap gap-2">
                  <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.scope.chipAiAssist')} />
                  <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.scope.chipGovernance')} />
                  <SectionBadge label={t('designlab.showcase.component.commandPalette.sections.scope.chipApprovalQueue')} />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'command-palette-ops-launcher-board',
          eyebrow: 'Operations launcher',
          title: 'Operasyon komut merkezi',
          description: 'Kisa yol, durum etiketi ve son secim geri bildirimi ile daha operasyonel bir command palette modeli sunar.',
          badges: ['ops', 'launcher', 'dense'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Komut merkezi">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <SectionBadge label="release ops" />
                    <SectionBadge label="approval queue" />
                    <SectionBadge label="ai assist" />
                  </div>
                  <Button onClick={() => setCommandPaletteOpen(true)}>
                    Operasyon panelini ac
                  </Button>
                  <CommandPalette
                    open={commandPaletteOpen}
                    title="Ops command center"
                    subtitle="Release, approval ve evidence akislarini tek arama kutusunda topla."
                    items={commandPaletteItems}
                    query={commandPaletteQuery}
                    onQueryChange={setCommandPaletteQuery}
                    onClose={() => setCommandPaletteOpen(false)}
                    onSelect={(id, selectedItem) => {
                      setLastCommandSelection(`${selectedItem.title} · ${id}`);
                    }}
                    footer={(
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="muted">Cmd+K</Badge>
                        <Text variant="secondary">Global navigation, AI assist ve governance aksiyonlari tek kanalda.</Text>
                      </div>
                    )}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Son secim">
                <LibraryMetricCard
                  label="Son komut"
                  value={lastCommandSelection ?? '—'}
                  note="Seçilen komut burada ozetlenir."
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'command-palette-empty-guidance',
          eyebrow: 'Guided search',
          title: 'Bos sonuc ve guidance',
          description: 'Arama kutusu sonuc bulamadiginda bile hizli yonlendirme veren daha coaching odakli bir varyant sunar.',
          badges: ['empty', 'guidance', 'search'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Guided palette">
                <CommandPalette
                  open
                  title="Guided command search"
                  subtitle="Komut, route veya policy cue ile ara."
                  items={commandPaletteItems}
                  query="nonexistent"
                  onQueryChange={() => undefined}
                  onClose={() => undefined}
                  emptyStateLabel="Eslesen komut yok. Approval, release veya docs anahtar kelimeleri ile tekrar dene."
                  footer={(
                    <div className="flex flex-wrap gap-2">
                      <SectionBadge label="approval" />
                      <SectionBadge label="release" />
                      <SectionBadge label="docs" />
                    </div>
                  )}
                />
              </PreviewPanel>
              <PreviewPanel title="Bos sonuc notu">
                <Text variant="secondary" className="block leading-7">
                  Empty-state guidance, komut paletini yalniz power-user araci olmaktan cikarip daha ogrenilebilir bir arayuze donusturur.
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
          eyebrow: t('designlab.showcase.component.reportFilterPanel.sections.submit.eyebrow'),
          title: t('designlab.showcase.component.reportFilterPanel.sections.submit.title'),
          description: t('designlab.showcase.component.reportFilterPanel.sections.submit.description'),
          badges: [
            t('designlab.showcase.component.reportFilterPanel.sections.submit.badge.panel'),
            t('designlab.showcase.component.reportFilterPanel.sections.submit.badge.submit'),
            t('designlab.showcase.component.reportFilterPanel.sections.submit.badge.stable'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.reportFilterPanel.sections.submit.panelInteractive')}>
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <ReportFilterPanel
                    onSubmit={() => setReportStatus(t('designlab.seed.reportStatus.applied'))}
                    onReset={() => setReportStatus(t('designlab.seed.reportStatus.reset'))}
                  >
                    <TextInput
                      label={t('designlab.showcase.component.reportFilterPanel.sections.submit.fields.search')}
                      value={searchInputValue}
                      onValueChange={setSearchInputValue}
                      size="sm"
                    />
                    <Select
                      label={t('designlab.showcase.component.reportFilterPanel.sections.submit.fields.status')}
                      size="sm"
                      value={selectValue}
                      onValueChange={(value) => setSelectValue(String(value))}
                      options={[
                        { label: t('designlab.showcase.component.reportFilterPanel.sections.submit.options.comfortable'), value: 'comfortable' },
                        { label: t('designlab.showcase.component.reportFilterPanel.sections.submit.options.compact'), value: 'compact' },
                      ]}
                    />
                    <DatePicker
                      label={t('designlab.showcase.component.reportFilterPanel.sections.submit.fields.startDate')}
                      value={dateValue}
                      onValueChange={setDateValue}
                      messages={datePickerMessages}
                    />
                  </ReportFilterPanel>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.reportFilterPanel.sections.submit.panelState')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.reportFilterPanel.sections.submit.metric.label')}
                  value={reportStatus}
                  note={t('designlab.showcase.component.reportFilterPanel.sections.submit.metric.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'report-filter-panel-readonly',
          eyebrow: t('designlab.showcase.component.reportFilterPanel.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.reportFilterPanel.sections.readonly.title'),
          description: t('designlab.showcase.component.reportFilterPanel.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.reportFilterPanel.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.reportFilterPanel.sections.readonly.badge.policy'),
            t('designlab.showcase.component.reportFilterPanel.sections.readonly.badge.governed'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.reportFilterPanel.sections.readonly.panelReadonly')}>
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <ReportFilterPanel access="readonly" onSubmit={() => undefined} onReset={() => undefined}>
                    <TextInput
                      label={t('designlab.showcase.component.reportFilterPanel.sections.readonly.fields.search')}
                      value={t('designlab.showcase.component.reportFilterPanel.sections.readonly.fields.searchValue')}
                      access="readonly"
                    />
                    <DatePicker
                      label={t('designlab.showcase.component.reportFilterPanel.sections.readonly.fields.date')}
                      value="2026-03-07"
                      access="readonly"
                      messages={datePickerMessages}
                    />
                  </ReportFilterPanel>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.reportFilterPanel.sections.readonly.panelGuideline')}>
                <Descriptions
                  title={t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.title')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'submit',
                      label: t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.submit.label'),
                      value: t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.submit.value'),
                      tone: 'warning',
                    },
                    {
                      key: 'reset',
                      label: t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.reset.label'),
                      value: t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.reset.value'),
                      tone: 'info',
                    },
                    {
                      key: 'scope',
                      label: t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.scope.label'),
                      value: t('designlab.showcase.component.reportFilterPanel.sections.readonly.rule.scope.value'),
                      tone: 'success',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'report-filter-panel-time-window',
          eyebrow: 'Analytics filters',
          title: 'Time-window analytics panel',
          description: 'Arama, durum ve tarih filtresini rapor odakli bir analytics panelinde daha yogun hale getirir.',
          badges: ['analytics', 'time-window', 'dense'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Analytics panel">
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <ReportFilterPanel
                    onSubmit={() => setReportStatus('Analytics filter applied')}
                    onReset={() => setReportStatus('Analytics filter reset')}
                  >
                    <TextInput
                      label="Arama"
                      value={searchInputValue}
                      onValueChange={setSearchInputValue}
                      size="sm"
                    />
                    <Select
                      label="Yoğunluk"
                      size="sm"
                      value={selectValue}
                      onValueChange={(value) => setSelectValue(String(value))}
                      options={[
                        { label: 'Comfortable', value: 'comfortable' },
                        { label: 'Compact', value: 'compact' },
                        { label: 'Readonly', value: 'readonly' },
                      ]}
                    />
                    <DatePicker
                      label="Başlangıç tarihi"
                      value={dateValue}
                      onValueChange={setDateValue}
                      messages={datePickerMessages}
                    />
                  </ReportFilterPanel>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Analytics state">
                <SummaryStrip
                  title="Filter state"
                  description="Panel durumu ve son uygulanan context"
                  columns={2}
                  items={[
                    { key: 'state', label: 'Status', value: reportStatus, tone: 'info', note: 'Son submit/reset sonucu' },
                    { key: 'query', label: 'Query', value: searchInputValue || '—', tone: 'warning', note: 'Aktif arama metni' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'SearchFilterListing':
      return [
        {
          id: 'search-filter-listing-default',
          eyebrow: t('designlab.showcase.recipe.searchFilterListing.eyebrow'),
          title: t('designlab.showcase.recipe.searchFilterListing.title'),
          description: t('designlab.showcase.recipe.searchFilterListing.description'),
          badges: ['wave-11', 'recipes', 'listing'],
          content: renderRecipeComponentPreview('search_filter_listing'),
        },
        {
          id: 'search-filter-listing-ops-triage',
          eyebrow: 'Recipe 02',
          title: 'Ops triage listing',
          description: 'Arama, save-view ve result shell birlikteligini operasyonel queue baglaminda gosterir.',
          badges: ['ops', 'triage', 'search'],
          content: (
            <SearchFilterListing
              eyebrow="Ops search"
              title="Incident ve release queue"
              description="Filter shell, summary strip ve sonuc listesi ayni karar akisinda birlikte calisir."
              meta={<SectionBadge label="ops-search" />}
              status={<Badge variant="warning">Review</Badge>}
              actions={<Button size="sm">Saved view olustur</Button>}
              filters={(
                <>
                  <TextInput
                    label="Arama"
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                  />
                  <Select
                    label="Surface"
                    value={selectValue}
                    onValueChange={(value) => setSelectValue(String(value))}
                    size="sm"
                    options={[
                      { label: 'All', value: 'all' },
                      { label: 'Components', value: 'components' },
                      { label: 'Recipes', value: 'recipes' },
                    ]}
                  />
                </>
              )}
              onReset={() => setSearchInputValue('')}
              onSaveView={() => setDropdownAction('Ops triage view kaydedildi')}
              summaryItems={[
                { key: 'open', label: 'Open queue', value: '18', note: 'Degerlendirilecek item', tone: 'warning' },
                { key: 'focus', label: 'Focus', value: selectValue || 'all', note: 'Aktif scope', tone: 'info' },
                { key: 'saved', label: 'Saved state', value: dropdownAction || '—', note: 'Son save-view sonucu', tone: 'success' },
              ]}
              items={serverGridRows.slice(0, 4).map((row) => (
                <div key={row.id} className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
                  <div>
                    <Text className="font-medium">{row.name}</Text>
                    <Text variant="secondary" className="block text-sm">{row.owner} · {row.theme}</Text>
                  </div>
                  <Badge variant={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge>
                </div>
              ))}
            />
          ),
        },
        {
          id: 'search-filter-listing-empty-query',
          eyebrow: 'Recipe 03',
          title: 'Empty query fallback',
          description: 'Filter shell ayni kalirken sonuc alanini bos durumla kullanan daha sakin bir katalog varyanti sunar.',
          badges: ['empty', 'fallback', 'catalog'],
          content: (
            <SearchFilterListing
              eyebrow="Library search"
              title="Bos sonuc state"
              description="Arama shellini koruyup sonuc alani bos durumda da ayni ritimle kullanir."
              filters={(
                <>
                  <TextInput
                    label="Arama"
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                  />
                  <Select
                    label="Lane"
                    value={selectValue}
                    onValueChange={(value) => setSelectValue(String(value))}
                    size="sm"
                    options={[
                      { label: 'Stable', value: 'stable' },
                      { label: 'Beta', value: 'beta' },
                      { label: 'Wave', value: 'wave' },
                    ]}
                  />
                </>
              )}
              onReset={() => setSearchInputValue('')}
              summaryItems={[
                { key: 'hits', label: 'Result', value: '0', note: 'Eslesen sonuc yok', tone: 'warning' },
                { key: 'mode', label: 'Mode', value: 'Catalog', note: 'Fallback state aktif', tone: 'info' },
              ]}
              items={[]}
              emptyStateLabel="Bu filtre kombinasyonu icin sonuc bulunamadi."
            />
          ),
        },
        {
          id: 'search-filter-listing-review-handshake',
          eyebrow: 'Recipe 04',
          title: 'Review handshake queue',
          description: 'Owner, lane ve handoff bilgisini arama shell ile birlikte review odakli bir kuyrukta toplar.',
          badges: ['review', 'handoff', 'queue'],
          content: (
            <SearchFilterListing
              eyebrow="Review queue"
              title="Owner handoff listing"
              description="Search shell, review kuyruğu ve kısa karar özeti aynı yüzeyde birleşir."
              meta={<SectionBadge label="handoff-queue" />}
              status={<Badge variant="warning">Pending</Badge>}
              actions={<Button size="sm">Queue export</Button>}
              filters={(
                <>
                  <TextInput
                    label="Arama"
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                  />
                  <Select
                    label="Owner lane"
                    value={selectValue}
                    onValueChange={(value) => setSelectValue(String(value))}
                    size="sm"
                    options={[
                      { label: 'All lanes', value: 'all' },
                      { label: 'Governance', value: 'governance' },
                      { label: 'Platform', value: 'platform' },
                      { label: 'Content', value: 'content' },
                    ]}
                  />
                </>
              )}
              onReset={() => {
                setSearchInputValue('');
                setSelectValue('all');
              }}
              onSaveView={() => setDropdownAction('Review handoff gorunumu kaydedildi')}
              filterExtra={<Badge variant="info">Escalation aware</Badge>}
              summaryItems={[
                { key: 'pending', label: 'Pending', value: '14', note: 'Degerlenecek handoff', tone: 'warning' },
                { key: 'lane', label: 'Lane', value: selectValue || 'all', note: 'Aktif owner lane', tone: 'info' },
                { key: 'saved', label: 'Saved view', value: dropdownAction || '—', note: 'Son gorunum kaydi', tone: 'success' },
              ]}
              items={serverGridRows.slice(0, 5).map((row) => (
                <div key={row.id} className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
                  <div>
                    <Text className="font-medium">{row.name}</Text>
                    <Text variant="secondary" className="block text-sm">{row.owner} · {row.track}</Text>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge>
                    <Badge variant="info">{row.track}</Badge>
                  </div>
                </div>
              ))}
            />
          ),
        },
        {
          id: 'search-filter-listing-saved-view-library',
          eyebrow: 'Recipe 05',
          title: 'Saved view library',
          description: 'Kaydedilmis filtre kombinasyonlarini ve sonuclarini katalog benzeri bir listing shell ile gosterir.',
          badges: ['saved-view', 'library', 'filters'],
          content: (
            <SearchFilterListing
              eyebrow="Saved views"
              title="Reusable filter library"
              description="Sık kullanılan filter/query kombinasyonları ve sonuç özetleri tek recipe altında tutulur."
              meta={<SectionBadge label="saved-views" />}
              status={<Badge variant="info">Managed</Badge>}
              actions={<Button size="sm">Yeni görünüm</Button>}
              filters={(
                <>
                  <TextInput
                    label="View ara"
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                  />
                  <Select
                    label="Tip"
                    value={selectValue}
                    onValueChange={(value) => setSelectValue(String(value))}
                    size="sm"
                    options={[
                      { label: 'All', value: 'all' },
                      { label: 'Ops', value: 'ops' },
                      { label: 'Governance', value: 'governance' },
                      { label: 'Analytics', value: 'analytics' },
                    ]}
                  />
                </>
              )}
              onReset={() => {
                setSearchInputValue('');
                setSelectValue('all');
              }}
              onSaveView={() => setDropdownAction('Saved view kutuphanesi guncellendi')}
              summaryItems={[
                { key: 'views', label: 'Views', value: '9', note: 'Aktif reusable shell', tone: 'info' },
                { key: 'hits', label: 'Hits', value: '42', note: 'Secili görünümdeki item', tone: 'success' },
                { key: 'scope', label: 'Scope', value: selectValue || 'all', note: 'Kütüphane filtresi', tone: 'warning' },
              ]}
              listTitle="Saved filter views"
              listDescription="Filter shell, governance ve analytics lane görünüm kombinasyonlarını tekrar kullanılabilir hale getirir."
              items={[
                <div key="ops-review" className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
                  <div>
                    <Text className="font-medium">Ops review queue</Text>
                    <Text variant="secondary" className="block text-sm">Release ve incident kuyruğunu tek görünümde toplar.</Text>
                  </div>
                  <Badge variant="warning">12 result</Badge>
                </div>,
                <div key="governance-ready" className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
                  <div>
                    <Text className="font-medium">Governance readiness</Text>
                    <Text variant="secondary" className="block text-sm">SEO/GEO ve approval evidence yüzeylerini filtreler.</Text>
                  </div>
                  <Badge variant="success">7 result</Badge>
                </div>,
                <div key="analytics-window" className="flex items-center justify-between rounded-lg border border-border-subtle p-3">
                  <div>
                    <Text className="font-medium">Analytics window</Text>
                    <Text variant="secondary" className="block text-sm">Time-window ve owner lensleriyle rapor sonuçlarını izler.</Text>
                  </div>
                  <Badge variant="info">23 result</Badge>
                </div>,
              ]}
            />
          ),
        },
      ];
    default:
      return null;
  }
};
