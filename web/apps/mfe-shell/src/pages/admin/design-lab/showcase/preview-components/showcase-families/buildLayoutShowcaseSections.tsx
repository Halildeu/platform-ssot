import React from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  createPageHeaderStatItems,
  createPageHeaderTagItems,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
  Descriptions,
  EntitySummaryBlock,
  FilterBar,
  PageHeader,
  PageLayout,
  Select,
  SummaryStrip,
  TableSimple,
  Tabs,
  Text,
  TextInput,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  DescriptionsItem,
  SummaryStripItem,
} from '@mfe/design-system';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type LayoutShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
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

type TemplateProfile = {
  clusterLabel: string;
  primaryBenchmark: string;
  secondaryBenchmark: string;
  toneClassName: string;
  accentClassName: string;
  experienceLabel: string;
  signatureBlocks: string[];
  silhouette: 'dashboard' | 'list' | 'detail' | 'workspace' | 'settings';
};

export const buildLayoutShowcaseSections = (
  componentName: string,
  context: LayoutShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
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
  } = context;

  const templateTableRows = [
    { id: 'row-1', record: 'USR-104', owner: 'Platform UI', status: 'Ready', updated: '2 dk once' },
    { id: 'row-2', record: 'USR-118', owner: 'Identity', status: 'Review', updated: '15 dk once' },
    { id: 'row-3', record: 'USR-126', owner: 'Audit', status: 'Blocked', updated: '38 dk once' },
  ];

  const templateTableColumns = [
    { key: 'record', label: 'Kayit', accessor: 'record' as const, emphasis: true },
    { key: 'owner', label: 'Owner', accessor: 'owner' as const },
    {
      key: 'status',
      label: 'Durum',
      render: (row: (typeof templateTableRows)[number]) => (
        <Badge variant={row.status === 'Ready' ? 'success' : row.status === 'Review' ? 'warning' : 'danger'}>{row.status}</Badge>
      ),
    },
    { key: 'updated', label: 'Guncelleme', accessor: 'updated' as const, align: 'right' as const },
  ];
  const templateProfiles: Record<string, TemplateProfile> = {
    'Dashboard Template': {
      clusterLabel: 'Analytics Pages',
      primaryBenchmark: 'MUI Dashboard Template',
      secondaryBenchmark: 'Ant Design ProLayout',
      toneClassName: 'border-state-info-border bg-state-info-surface',
      accentClassName: 'bg-state-info-border',
      experienceLabel: 'Executive KPI shell',
      signatureBlocks: ['Summary strip', 'Decision notes', 'Secondary nav'],
      silhouette: 'dashboard',
    },
    'CRUD Template': {
      clusterLabel: 'Operational Pages',
      primaryBenchmark: 'Ant Design PageContainer',
      secondaryBenchmark: 'MUI CRUD Dashboard',
      toneClassName: 'border-state-success-border bg-state-success-surface',
      accentClassName: 'bg-state-success-border',
      experienceLabel: 'Filter + table shell',
      signatureBlocks: ['Filter bar', 'Quick context', 'Data table'],
      silhouette: 'list',
    },
    'Detail Template': {
      clusterLabel: 'Operational Pages',
      primaryBenchmark: 'Ant Design Detail Page',
      secondaryBenchmark: 'MUI Page Container',
      toneClassName: 'border-state-warning-border bg-state-warning-surface',
      accentClassName: 'bg-state-warning-border',
      experienceLabel: 'Inspector-first detail',
      signatureBlocks: ['Entity summary', 'Context inspector', 'Contract details'],
      silhouette: 'detail',
    },
    'Command Workspace': {
      clusterLabel: 'Operational Pages',
      primaryBenchmark: 'MUI App Bar + Search',
      secondaryBenchmark: 'Ant Design Pro shell',
      toneClassName: 'border-border-default bg-surface-panel',
      accentClassName: 'bg-action-primary',
      experienceLabel: 'Search-first workspace',
      signatureBlocks: ['Search handoff', 'Recent queue', 'Command results'],
      silhouette: 'workspace',
    },
    'Settings Template': {
      clusterLabel: 'Configuration Pages',
      primaryBenchmark: 'MUI Settings shell',
      secondaryBenchmark: 'Ant Design Form Layout',
      toneClassName: 'border-state-info-border bg-surface-default',
      accentClassName: 'bg-state-info-border',
      experienceLabel: 'Sectioned settings shell',
      signatureBlocks: ['Section tabs', 'Guardrails', 'Settings summary'],
      silhouette: 'settings',
    },
  };
  const renderTemplateSilhouette = (variant: TemplateProfile['silhouette']) => {
    switch (variant) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-1.5" aria-hidden>
            <div className="space-y-1.5">
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.9))]" />
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-8 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
                <div className="h-8 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.76))]" />
                <div className="h-8 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.72))]" />
              </div>
              <div className="h-14 rounded-2xl bg-[var(--surface-card,rgba(255,255,255,0.74))]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.74))]" />
              <div className="h-9 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.68))]" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="space-y-1.5" aria-hidden>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.88))]" />
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.72))]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.75))]" />
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.7))]" />
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.66))]" />
            </div>
          </div>
        );
      case 'detail':
        return (
          <div className="grid grid-cols-[1fr_0.55fr] gap-1.5" aria-hidden>
            <div className="space-y-1.5">
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.88))]" />
              <div className="h-12 rounded-2xl bg-[var(--surface-card,rgba(255,255,255,0.78))]" />
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.72))]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
              <div className="h-10 rounded-2xl bg-[var(--surface-card,rgba(255,255,255,0.68))]" />
            </div>
          </div>
        );
      case 'workspace':
        return (
          <div className="space-y-1.5" aria-hidden>
            <div className="h-4 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.88))]" />
            <div className="grid grid-cols-[0.7fr_1.3fr] gap-1.5">
              <div className="space-y-1.5">
                <div className="h-6 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.78))]" />
                <div className="h-6 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.7))]" />
              </div>
              <div className="space-y-1.5">
                <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.76))]" />
                <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.68))]" />
                <div className="h-5 rounded-lg bg-[var(--surface-card,rgba(255,255,255,0.64))]" />
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="grid grid-cols-[0.6fr_1fr] gap-1.5" aria-hidden>
            <div className="space-y-1.5">
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.88))]" />
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
              <div className="h-3 rounded-full bg-[var(--surface-card,rgba(255,255,255,0.72))]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.8))]" />
              <div className="h-6 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.72))]" />
              <div className="h-6 rounded-xl bg-[var(--surface-card,rgba(255,255,255,0.66))]" />
            </div>
          </div>
        );
    }
  };
  const renderTemplateLead = (
    title: string,
    description: string,
    badges: string[],
    profile: TemplateProfile,
  ) => (
    <div className={`relative mb-3 overflow-hidden rounded-[22px] border px-4 py-4 shadow-sm ${profile.toneClassName}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${profile.accentClassName}`} aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Text as="div" variant="secondary" className="text-[11px] font-semibold tracking-[0.08em]">
            Template profile
          </Text>
          <Text as="div" className="mt-2 text-base font-semibold text-text-primary">
            {title}
          </Text>
          <Text variant="secondary" className="mt-1 block text-sm leading-6">
            {description}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => <SectionBadge key={badge} label={badge} />)}
          <SectionBadge label={profile.experienceLabel} />
        </div>
      </div>
      <div className="mt-3 rounded-[18px] border border-[var(--border-subtle)]/20 bg-[var(--surface-card,rgba(255,255,255,0.35))] px-3 py-3 backdrop-blur-sm">
        {renderTemplateSilhouette(profile.silhouette)}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2">
          <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
            Cluster
          </Text>
          <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
            {profile.clusterLabel}
          </Text>
        </div>
        <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2">
          <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
            Primary benchmark
          </Text>
          <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
            {profile.primaryBenchmark}
          </Text>
        </div>
        <div className="rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-2">
          <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
            Secondary reference
          </Text>
          <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
            {profile.secondaryBenchmark}
          </Text>
        </div>
      </div>
      <div className="mt-3 rounded-[18px] border border-border-subtle bg-surface-default/80 px-3 py-3">
        <Text as="div" variant="secondary" className="text-[10px] font-semibold tracking-[0.06em]">
          Signature blocks
        </Text>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {profile.signatureBlocks.map((block) => (
            <SectionBadge key={`${title}-${block}`} label={block} />
          ))}
        </div>
      </div>
    </div>
  );

  switch (componentName) {
    case 'Dashboard Template':
      return [
        {
          id: 'dashboard-template-shell',
          eyebrow: 'Page template',
          title: 'Executive dashboard template',
          description: 'Karar veren ekiplerin KPI, release signal ve ozet bloklari ayni sayfa kabugunda toplamasini saglayan executive template.',
          badges: ['dashboard', 'metrics', 'executive'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.18fr_0.82fr]">
              <PreviewPanel title="Dashboard shell">
                {renderTemplateLead(
                  'Executive dashboard',
                  'KPI-first shell, release signal ve karar bloklarini tek bir page masthead ile aciyor.',
                  ['Executive', 'KPI-first', 'MUI dashboard'],
                  templateProfiles['Dashboard Template'],
                )}
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'ops-workspace', stickyHeader: false })}
                    title="Executive operations dashboard"
                    description="Cross-suite KPI, release velocity ve approval signal ayni shell icinde toplanir."
                    breadcrumbItems={createPageLayoutBreadcrumbItems(['Admin', 'Portfolio', 'Executive dashboard'])}
                    headerExtra={<SectionBadge label="Q1 / Stable" />}
                    actions={
                      <>
                        <Button variant="secondary" size="sm">Paylas</Button>
                        <Button size="sm">Rapor olustur</Button>
                      </>
                    }
                    secondaryNav={(
                      <Tabs
                        variant="pill"
                        activeKey="overview"

                        items={[
                          { key: 'overview', label: 'Overview' , content: null },
                          { key: 'capacity', label: 'Capacity' , content: null },
                          { key: 'risk', label: 'Risk' , content: null },
                        ]}
                      />
                    )}
                  >
                    <div className="space-y-4 p-1">
                      <SummaryStrip
                        title="Release cadence"
                        description="Executive takibin ilk satiri: build, adoption, incidents ve open actions."
                        items={summaryStripItems}
                        columns={4}
                      />
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <Descriptions
                          title="Portfolio signals"
                          localeText={descriptionsLocaleText}
                          items={rolloutDescriptionItems.slice(0, 4)}
                          columns={1}
                          density="compact"
                        />
                        <Descriptions
                          title="Decision notes"
                          localeText={descriptionsLocaleText}
                          items={[
                            { key: 'owner', label: 'Escalation owner', value: 'Platform Ops', tone: 'info' },
                            { key: 'window', label: 'Release window', value: '14 Mart 2026 / 18:00', tone: 'success' },
                            { key: 'risk', label: 'Global risk', value: 'Low', tone: 'success' },
                          ]}
                          columns={1}
                          density="compact"
                        />
                      </div>
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Benchmark notu">
                <Text variant="secondary" className="block leading-7">
                  Ant Design tarafinda bu his daha cok `Layout + PageContainer` ile kuruluyor; MUI tarafinda ise `Dashboard template + Toolpad layout` daha dogrudan tam sayfa iskeleti sunuyor.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'CRUD Template':
      return [
        {
          id: 'crud-template-shell',
          eyebrow: 'Page template',
          title: 'CRUD management template',
          description: 'Listeleme, filtreleme ve hizli aksiyon ritmini yonetim ekranlari icin sakin bir operasyon shelline cevirir.',
          badges: ['crud', 'table', 'filters'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <PreviewPanel title="CRUD shell">
                {renderTemplateLead(
                  'CRUD management',
                  'Filter bar, action cluster ve canonical table ritmini yonetim sayfasina cevirir.',
                  ['CRUD', 'Filters', 'Admin table'],
                  templateProfiles['CRUD Template'],
                )}
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'ops-workspace', stickyHeader: false })}
                    title="User administration"
                    description="Listeleme, filtreleme ve hızlı aksiyonlar tek bir yonetim shellinde toplanir."
                    breadcrumbItems={createPageLayoutBreadcrumbItems(['Admin', 'Users', 'Directory'])}
                    actions={
                      <>
                        <Button variant="secondary" size="sm">Export</Button>
                        <Button size="sm">Yeni kayit</Button>
                      </>
                    }
                    filterBar={(
                      <FilterBar>
                        <TextInput
                          label="Arama"
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
                            { label: 'Ready', value: 'ready' },
                            { label: 'Review', value: 'review' },
                            { label: 'Blocked', value: 'blocked' },
                          ]}
                        />
                      </FilterBar>
                    )}
                    detail={(
                      <Descriptions
                        title="Quick context"
                        localeText={descriptionsLocaleText}
                        items={[
                          { key: 'selection', label: 'Selection', value: '12 kayit', tone: 'info' },
                          { key: 'view', label: 'View', value: dropdownAction || 'Default', tone: 'warning' },
                        ]}
                        columns={1}
                        density="compact"
                      />
                    )}
                  >
                    <div className="space-y-4 p-1">
                      <SummaryStrip
                        title="Directory metrics"
                        description="Sayfaya girmeden once liste sagligi, secim ve action signal gorunur."
                        items={summaryStripItems}
                        columns={4}
                      />
                      <TableSimple
                        caption="Current records"
                        description="CRUD template icindeki canonical data table alani."
                        columns={templateTableColumns}
                        rows={templateTableRows}
                        density="compact"
                        stickyHeader
                        fullWidth
                      />
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Neden bu template">
                <Text variant="secondary" className="block leading-7">
                  Ant Design tarafinda bu kalip genelde `PageContainer + Table + Form filters` ile gorunur; MUI ise `CRUD dashboard` ve `data table + app shell` kombinasyonunu one cikarir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Detail Template':
      return [
        {
          id: 'detail-template-shell',
          eyebrow: 'Page template',
          title: 'Detail review template',
          description: 'Kayit ve karar inceleme ekranlarinda ana icerik ile inspector baglamini dengeli tutan summary-first detail template.',
          badges: ['detail', 'inspector', 'review'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.18fr_0.82fr]">
              <PreviewPanel title="Detail shell">
                {renderTemplateLead(
                  'Detail review',
                  'Inspector rail, karar badge’i ve summary-first detay akisini ayri bir page ritmine tasir.',
                  ['Inspector', 'Review', 'Decision detail'],
                  templateProfiles['Detail Template'],
                )}
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'detail-sidebar', stickyHeader: false })}
                    title="Access decision detail"
                    description="Entity summary, contract notes ve inspector rail ayni detail page icinde calisir."
                    breadcrumbItems={createPageLayoutBreadcrumbItems(['Admin', 'Access', 'Decision detail'])}
                    actions={<Button size="sm">Approve</Button>}
                    detail={(
                      <Descriptions
                        title="Inspector rail"
                        localeText={descriptionsLocaleText}
                        items={[
                          { key: 'severity', label: 'Severity', value: 'P2', tone: 'warning' },
                          { key: 'owner', label: 'Owner', value: 'Security council', tone: 'info' },
                          { key: 'status', label: 'Status', value: 'Pending review', tone: 'warning' },
                        ]}
                        columns={1}
                        density="compact"
                      />
                    )}
                    footer={<Text variant="secondary">Footer contract strip burada policy ve rollout notlarini tasir.</Text>}
                  >
                    <div className="space-y-4 p-1">
                      <EntitySummaryBlock
                        title="Decision package"
                        subtitle="Wave 5 access review"
                        badge={<Badge variant="warning">Pending</Badge>}
                        items={entitySummaryItems}
                      />
                      <Descriptions
                        title="Contract details"
                        localeText={descriptionsLocaleText}
                        items={rolloutDescriptionItems}
                        columns={2}
                      />
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Template karakteri">
                <Text variant="secondary" className="block leading-7">
                  Ant Design Pro detail sayfalari `PageContainer` ustune inspector mantigi ekler; MUI tarafinda ise `Page container + side context` daha serbest ama ayni karar okunurlugunu hedefler.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Command Workspace':
      return [
        {
          id: 'command-workspace-shell',
          eyebrow: 'Page template',
          title: 'Command workspace template',
          description: 'Arama, son kullanilanlar ve command-ready sonuc aksiyonlarini tek bir calisma alaninda birlestiren search-first template.',
          badges: ['command', 'search-first', 'workspace'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.22fr_0.78fr]">
              <PreviewPanel title="Command shell">
                {renderTemplateLead(
                  'Command workspace',
                  'Search handoff, recent queue ve command-ready result yapisini tek bir workspace ustunde birlestirir.',
                  ['Search-first', 'Command', 'Workspace'],
                  templateProfiles['Command Workspace'],
                )}
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'ops-workspace', stickyHeader: false })}
                    title="Command workspace"
                    description="Route, command ve recent task akisini ayni page shell icinde birlestirir."
                    breadcrumbItems={createPageLayoutBreadcrumbItems(['Admin', 'Ops', 'Command workspace'])}
                    secondaryNav={(
                      <Tabs
                        variant="pill"
                        activeKey="commands"

                        items={[
                          { key: 'commands', label: 'Commands' , content: null },
                          { key: 'queue', label: 'Queue' , content: null },
                          { key: 'history', label: 'History' , content: null },
                        ]}
                      />
                    )}
                    filterBar={(
                      <FilterBar>
                        <TextInput
                          label="Komut veya rota ara"
                          value={searchInputValue}
                          onValueChange={setSearchInputValue}
                          size="sm"
                          leadingVisual={<span aria-hidden="true">⌕</span>}
                        />
                        <Select
                          label="Lane"
                          value={selectValue}
                          onValueChange={(value) => setSelectValue(String(value))}
                          size="sm"
                          options={[
                            { label: 'Runtime', value: 'runtime' },
                            { label: 'Release', value: 'release' },
                            { label: 'Governance', value: 'governance' },
                          ]}
                        />
                      </FilterBar>
                    )}
                    detail={(
                      <Descriptions
                        title="Quick command context"
                        localeText={descriptionsLocaleText}
                        items={[
                          { key: 'recent', label: 'Recent roots', value: 'Audit / Users / Release', tone: 'info' },
                          { key: 'favorite', label: 'Pinned', value: '3', tone: 'success' },
                        ]}
                        columns={1}
                        density="compact"
                      />
                    )}
                  >
                    <div className="space-y-4 p-1">
                      <SummaryStrip
                        title="Recent queue"
                        description="Kullanicinin en son dondugu alanlar ve action-ready command seti."
                        items={summaryStripItems}
                        columns={4}
                      />
                      <TableSimple
                        caption="Command-ready results"
                        description="Search handoff sonrasi hizli aksiyon alinacak sonuclar."
                        columns={templateTableColumns}
                        rows={templateTableRows}
                        density="compact"
                        fullWidth
                      />
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Benchmark notu">
                <Text variant="secondary" className="block leading-7">
                  MUI bu tarafi daha cok `App Bar + search + drawer/template` ile gosteriyor; Ant Design cekirdekte daha az command-first ama Pro shell mantigi ile ayni workspace hiyerarsisi kurulabiliyor.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Settings Template':
      return [
        {
          id: 'settings-template-shell',
          eyebrow: 'Page template',
          title: 'Settings template',
          description: 'Ayar ekranlarinda section tabs, guardrails ve ozet bloklari sakin bir yonetim ritminde bir araya getiren template.',
          badges: ['settings', 'tabs', 'guardrails'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.18fr_0.82fr]">
              <PreviewPanel title="Settings shell">
                {renderTemplateLead(
                  'Settings template',
                  'Section tabs, guardrails ve configuration summary bloklarini sakin bir ayar sayfasi shellinde toplar.',
                  ['Settings', 'Tabs', 'Guardrails'],
                  templateProfiles['Settings Template'],
                )}
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'detail-sidebar', stickyHeader: false })}
                    title="Workspace settings"
                    description="Section-based settings screens icin ikincil nav, summary ve rollout context ayni shell icinde tutulur."
                    breadcrumbItems={createPageLayoutBreadcrumbItems(['Admin', 'Workspace', 'Settings'])}
                    detail={(
                      <Descriptions
                        title="Guardrails"
                        localeText={descriptionsLocaleText}
                        items={[
                          { key: 'policy', label: 'Policy mode', value: 'Strict', tone: 'warning' },
                          { key: 'release', label: 'Release impact', value: 'Cross-suite', tone: 'info' },
                        ]}
                        columns={1}
                        density="compact"
                      />
                    )}
                  >
                    <div className="space-y-4 p-1">
                      <Tabs
                        variant="pill"
                        activeKey="security"

                        items={[
                          { key: 'security', label: 'Security' , content: null },
                          { key: 'notifications', label: 'Notifications' , content: null },
                          { key: 'integrations', label: 'Integrations' , content: null },
                        ]}
                      />
                      <Descriptions
                        title="Configuration summary"
                        localeText={descriptionsLocaleText}
                        items={[
                          { key: 'mfa', label: 'MFA enforcement', value: 'Enabled', tone: 'success' },
                          { key: 'session', label: 'Session timeout', value: '30 minutes', tone: 'info' },
                          { key: 'digest', label: 'Digest delivery', value: 'Daily', tone: 'info' },
                          { key: 'audit', label: 'Audit export', value: 'Restricted', tone: 'warning' },
                        ]}
                        columns={2}
                      />
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Neden bu shell">
                <Text variant="secondary" className="block leading-7">
                  MUI template tarafinda ayarlar sayfalari daha cok drawer/app-shell icinde sekmeli bolumlerle kurulur; Ant Design ise form ve page container kompozisyonu ile ayni netligi saglar.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'PageLayout':
      return [
        {
          id: 'page-layout-directory-shell',
          eyebrow: t('designlab.showcase.component.pageLayout.sections.directory.eyebrow'),
          title: t('designlab.showcase.component.pageLayout.sections.directory.title'),
          description: t('designlab.showcase.component.pageLayout.sections.directory.description'),
          badges: [
            t('designlab.showcase.component.pageLayout.sections.directory.badge.pageShell'),
            t('designlab.showcase.component.pageLayout.sections.directory.badge.stable'),
            t('designlab.showcase.component.pageLayout.sections.directory.badge.directory'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4">
              <PreviewPanel title={t('designlab.showcase.component.pageLayout.sections.directory.panelDirectory')}>
                <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'ops-workspace', stickyHeader: false })}
                    title={t('designlab.showcase.component.pageLayout.sections.directory.shell.title')}
                    description={t('designlab.showcase.component.pageLayout.sections.directory.shell.description')}
                    breadcrumbItems={createPageLayoutBreadcrumbItems([
                      { title: t('designlab.showcase.component.pageLayout.sections.directory.breadcrumb.docs'), path: '#' },
                      { title: t('designlab.showcase.component.pageLayout.sections.directory.breadcrumb.library'), path: '#' },
                      { title: t('designlab.showcase.component.pageLayout.sections.directory.breadcrumb.pageBlocks') },
                    ])}
                    headerExtra={<SectionBadge label={t('designlab.showcase.component.pageLayout.sections.directory.headerExtra')} />}
                    actions={
                      <>
                        <Button variant="secondary" size="sm">
                          {t('designlab.showcase.component.pageLayout.sections.directory.actions.export')}
                        </Button>
                        <Button size="sm">{t('designlab.showcase.component.pageLayout.sections.directory.actions.newBlock')}</Button>
                      </>
                    }
                    filterBar={(
                      <FilterBar>
                        <TextInput
                          label={t('designlab.showcase.component.pageLayout.sections.directory.filter.search')}
                          value={searchInputValue}
                          onValueChange={setSearchInputValue}
                          size="sm"
                          leadingVisual={<span aria-hidden="true">⌕</span>}
                        />
                        <Select
                          label={t('designlab.showcase.component.pageLayout.sections.directory.filter.status')}
                          value={selectValue}
                          onValueChange={(value) => setSelectValue(String(value))}
                          size="sm"
                          options={[
                            { label: t('designlab.showcase.component.pageLayout.sections.directory.options.comfortable'), value: 'comfortable' },
                            { label: t('designlab.showcase.component.pageLayout.sections.directory.options.compact'), value: 'compact' },
                            { label: t('designlab.showcase.component.pageLayout.sections.directory.options.readonly'), value: 'readonly' },
                          ]}
                        />
                      </FilterBar>
                    )}
                    detail={(
                      <div className="space-y-3 rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-sm">
                        <Text as="div" className="font-semibold">
                          {t('designlab.showcase.component.pageLayout.sections.directory.detail.title')}
                        </Text>
                        <Text variant="secondary">
                          {t('designlab.showcase.component.pageLayout.sections.directory.detail.description')}
                        </Text>
                        <LibraryMetricCard
                          label={t('designlab.showcase.component.pageLayout.sections.directory.detail.metric.label')}
                          value={dropdownAction}
                          note={t('designlab.showcase.component.pageLayout.sections.directory.detail.metric.note')}
                        />
                      </div>
                    )}
                  >
                    <div className="space-y-4">
                      <SummaryStrip
                        title={t('designlab.showcase.component.pageLayout.sections.directory.summary.title')}
                        description={t('designlab.showcase.component.pageLayout.sections.directory.summary.description')}
                        items={summaryStripItems}
                        columns={4}
                      />
                      <Descriptions
                        title={t('designlab.showcase.component.pageLayout.sections.directory.contract.title')}
                        description={t('designlab.showcase.component.pageLayout.sections.directory.contract.description')}
                        items={rolloutDescriptionItems}
                        columns={2}
                        localeText={descriptionsLocaleText}
                      />
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.pageLayout.sections.directory.panelContract')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.pageLayout.sections.directory.contractNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'page-layout-detail-shell',
          eyebrow: t('designlab.showcase.component.pageLayout.sections.detail.eyebrow'),
          title: t('designlab.showcase.component.pageLayout.sections.detail.title'),
          description: t('designlab.showcase.component.pageLayout.sections.detail.description'),
          badges: [
            t('designlab.showcase.component.pageLayout.sections.detail.badge.detail'),
            t('designlab.showcase.component.pageLayout.sections.detail.badge.aside'),
            t('designlab.showcase.component.pageLayout.sections.detail.badge.review'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.pageLayout.sections.detail.panelCompact')}>
                <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4 shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'detail-sidebar', stickyHeader: false })}
                    title={t('designlab.showcase.component.pageLayout.sections.detail.shell.title')}
                    description={t('designlab.showcase.component.pageLayout.sections.detail.shell.description')}
                    breadcrumbItems={createPageLayoutBreadcrumbItems([
                      { title: t('designlab.showcase.component.pageLayout.sections.detail.breadcrumb.releases'), path: '#' },
                      { title: t('designlab.showcase.component.pageLayout.sections.detail.breadcrumb.wave'), path: '#' },
                      { title: t('designlab.showcase.component.pageLayout.sections.detail.breadcrumb.review') },
                    ])}
                    actions={<Button size="sm">{t('designlab.showcase.component.pageLayout.sections.detail.actions.approve')}</Button>}
                    detail={(
                      <Descriptions
                        title={t('designlab.showcase.component.pageLayout.sections.detail.decision.title')}
                        localeText={descriptionsLocaleText}
                        items={[
                          {
                            key: 'risk',
                            label: t('designlab.showcase.component.pageLayout.sections.detail.decision.risk.label'),
                            value: t('designlab.showcase.component.pageLayout.sections.detail.decision.risk.value'),
                            tone: 'success',
                          },
                          {
                            key: 'owner',
                            label: t('designlab.showcase.component.pageLayout.sections.detail.decision.owner.label'),
                            value: t('designlab.showcase.component.pageLayout.sections.detail.decision.owner.value'),
                            tone: 'info',
                          },
                        ]}
                        columns={1}
                        density="compact"
                      />
                    )}
                    footer={(
                      <Text variant="secondary">
                        {t('designlab.showcase.component.pageLayout.sections.detail.footer')}
                      </Text>
                    )}
                  >
                    <EntitySummaryBlock
                      title={t('designlab.showcase.component.pageLayout.sections.detail.entity.title')}
                      subtitle={t('designlab.showcase.component.pageLayout.sections.detail.entity.subtitle')}
                      badge={<Badge variant="success">{t('designlab.showcase.component.pageLayout.sections.detail.entity.badge')}</Badge>}
                      items={entitySummaryItems}
                    />
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.pageLayout.sections.detail.panelUsage')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.pageLayout.sections.detail.usageNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'page-layout-ops-workspace',
          eyebrow: 'Workspace shells',
          title: 'Ops workspace preset',
          description: 'Secondary nav, toolbar ve footer birlikte kullanilan daha operasyonel bir page layout alternatifi uretir.',
          badges: ['ops', 'workspace', 'secondary-nav'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Ops shell">
                <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-panel shadow-sm">
                  <PageLayout
                    {...createPageLayoutPreset({ preset: 'ops-workspace', stickyHeader: false })}
                    title="Release cockpit"
                    description="Policy, evidence ve rollout kararlari tek shell icinde toplanir."
                    breadcrumbItems={createPageLayoutBreadcrumbItems(['Admin', 'Releases', 'Wave 3'])}
                    secondaryNav={(
                      <Tabs
                        variant="pill"
                        activeKey="overview"

                        items={[
                          { key: 'overview', label: 'Overview' , content: null },
                          { key: 'policy', label: 'Policy' , content: null },
                          { key: 'evidence', label: 'Evidence' , content: null },
                        ]}
                      />
                    )}
                    actions={<Button>Freeze window</Button>}
                    contentToolbar={<SectionBadge label="2 active checks" />}
                    footer={<Text variant="secondary">Workspace footer: release owner, evidence packet ve review due date.</Text>}
                  >
                    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4 text-sm text-text-secondary">
                      Karar gunlugu, rollout owner ve acik review adimlari bu yuzeyde toplanir.
                    </div>
                  </PageLayout>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Kullanim notu">
                <Text variant="secondary" className="block leading-7">
                  Detail-sidebar presetine gore ops-workspace varyanti, toolbar ve footer agirlikli ekranlarda daha dogal bir shell ritmi sunar.
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
          eyebrow: t('designlab.showcase.component.pageHeader.sections.release.eyebrow'),
          title: t('designlab.showcase.component.pageHeader.sections.release.title'),
          description: t('designlab.showcase.component.pageHeader.sections.release.description'),
          badges: [
            t('designlab.showcase.component.pageHeader.sections.release.badge.header'),
            t('designlab.showcase.component.pageHeader.sections.release.badge.beta'),
            t('designlab.showcase.component.pageHeader.sections.release.badge.hero'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.pageHeader.sections.release.panelPrimary')}>
                <PageHeader
                  title={t('designlab.showcase.component.pageHeader.sections.release.header.title')}
                  subtitle={t('designlab.showcase.component.pageHeader.sections.release.header.description')}
                  tags={<Badge variant="success">{t('designlab.showcase.component.pageHeader.sections.release.header.status')}</Badge>}
                  actions={(
                    <>
                      <Button variant="secondary" size="sm">{t('designlab.showcase.component.pageHeader.sections.release.header.action.share')}</Button>
                      <Button size="sm">{t('designlab.showcase.component.pageHeader.sections.release.header.action.promote')}</Button>
                    </>
                  )}
                  extra={(
                    <LibraryMetricCard
                      label={t('designlab.showcase.component.pageHeader.sections.release.header.aside.label')}
                      value={t('designlab.showcase.component.pageHeader.sections.release.header.aside.value')}
                      note={t('designlab.showcase.component.pageHeader.sections.release.header.aside.note')}
                    />
                  )}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.pageHeader.sections.release.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.pageHeader.sections.release.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'page-header-compact-detail',
          eyebrow: t('designlab.showcase.component.pageHeader.sections.compact.eyebrow'),
          title: t('designlab.showcase.component.pageHeader.sections.compact.title'),
          description: t('designlab.showcase.component.pageHeader.sections.compact.description'),
          badges: [
            t('designlab.showcase.component.pageHeader.sections.compact.badge.compact'),
            t('designlab.showcase.component.pageHeader.sections.compact.badge.detail'),
            t('designlab.showcase.component.pageHeader.sections.compact.badge.meta'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.pageHeader.sections.compact.panelMode')}>
                <PageHeader
                  title={t('designlab.showcase.component.pageHeader.sections.compact.header.title')}
                  subtitle={t('designlab.showcase.component.pageHeader.sections.compact.header.description')}
                  tags={<Badge variant="info">{t('designlab.showcase.component.pageHeader.sections.compact.header.status')}</Badge>}
                  extra={
                    <div className="flex gap-2">
                      <SectionBadge label="page_blocks" />
                      <SectionBadge label="wave_7" />
                    </div>
                  }
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.pageHeader.sections.compact.panelContract')}>
                <Descriptions
                  title={t('designlab.showcase.component.pageHeader.sections.compact.contract.title')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'eyebrow',
                      label: t('designlab.showcase.component.pageHeader.sections.compact.contract.eyebrow.label'),
                      value: t('designlab.showcase.component.pageHeader.sections.compact.contract.eyebrow.value'),
                      tone: 'info',
                    },
                    {
                      key: 'meta',
                      label: t('designlab.showcase.component.pageHeader.sections.compact.contract.meta.label'),
                      value: t('designlab.showcase.component.pageHeader.sections.compact.contract.meta.value'),
                      tone: 'success',
                    },
                    {
                      key: 'aside',
                      label: t('designlab.showcase.component.pageHeader.sections.compact.contract.aside.label'),
                      value: t('designlab.showcase.component.pageHeader.sections.compact.contract.aside.value'),
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'page-header-nav-metrics',
          eyebrow: 'Header recipes',
          title: 'Nav ve metrikli header',
          description: 'Secondary nav, tag ve stat helper alanlarini ayni header recipe icinde gosteren daha zengin bir alternatif sunar.',
          badges: ['nav', 'metrics', 'header'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Workspace header">
                <PageHeader
                  title="Wave 3 rollout"
                  subtitle="Consumer adoption, policy lock ve evidence packet"
                  breadcrumb={<Breadcrumb items={[{ label: 'Admin', href: '#' }, { label: 'Rollout', href: '#' }, { label: 'Wave 3' }]} />}
                  tags={<Badge variant="success">Ready</Badge>}
                  actions={<Button variant="secondary">Evidence packet</Button>}
                  footer={(
                    <Tabs
                      variant="pill"
                      activeKey="overview"
                      items={[
                        { key: 'overview', label: 'Overview' , content: null },
                        { key: 'preview', label: 'Preview' , content: null },
                        { key: 'api', label: 'API' , content: null },
                      ]}
                    />
                  )}
                />
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Tag ve stat helper’lari, sayfa ustundeki karar yogunlugunu arttirmadan metrik gorunurlugunu one cikarir; ikinci nav ise detail sekmeleri icin dogal bir ara katman olur.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'SummaryStrip':
      return [
        {
          id: 'summary-strip-release-metrics',
          eyebrow: t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.eyebrow'),
          title: t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.title'),
          description: t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.description'),
          badges: [
            t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge.metrics'),
            t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge.beta'),
            t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge.summary'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.panelPrimary')}>
                <SummaryStrip
                  title={t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.stripTitle')}
                  description={t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.stripDescription')}
                  items={summaryStripItems}
                  columns={4}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.summaryStrip.sections.releaseMetrics.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'summary-strip-compact-ownership',
          eyebrow: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.eyebrow'),
          title: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.title'),
          description: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.description'),
          badges: [
            t('designlab.showcase.component.summaryStrip.sections.compactOwnership.badge.compact'),
            t('designlab.showcase.component.summaryStrip.sections.compactOwnership.badge.ownership'),
            t('designlab.showcase.component.summaryStrip.sections.compactOwnership.badge.responsive'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.summaryStrip.sections.compactOwnership.panelThreeColumn')}>
                <SummaryStrip
                  title={t('designlab.showcase.component.summaryStrip.sections.compactOwnership.stripTitle')}
                  items={[
                    {
                      key: 'owner',
                      label: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.owner.label'),
                      value: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.owner.value'),
                      tone: 'info',
                      note: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.owner.note'),
                    },
                    {
                      key: 'review',
                      label: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.review.label'),
                      value: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.review.value'),
                      tone: 'warning',
                      note: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.review.note'),
                    },
                    {
                      key: 'release',
                      label: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.release.label'),
                      value: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.release.value'),
                      tone: 'success',
                      note: t('designlab.showcase.component.summaryStrip.sections.compactOwnership.items.release.note'),
                    },
                  ]}
                  columns={3}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.summaryStrip.sections.compactOwnership.panelUsage')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.summaryStrip.sections.compactOwnership.metric.label')}
                  value={t('designlab.showcase.component.summaryStrip.sections.compactOwnership.metric.value')}
                  note={t('designlab.showcase.component.summaryStrip.sections.compactOwnership.metric.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'summary-strip-risk-bands',
          eyebrow: 'Decision support',
          title: 'Risk ve readiness bandi',
          description: 'Warning, info ve success tonlarini ayni stripte toplayan daha karar odakli bir summary alternatifi uretir.',
          badges: ['risk', 'readiness', 'decision'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Karar bandi">
                <SummaryStrip
                  title="Release readiness"
                  description="Owner, risk ve kanit durumunu tek bakista ozetler."
                  columns={4}
                  items={[
                    { key: 'owner', label: 'Owner', value: 'Design system', tone: 'info', note: 'Primary maintainer' },
                    { key: 'risk', label: 'Risk', value: 'Low', tone: 'success', note: 'Open blocker yok' },
                    { key: 'seo', label: 'SEO/GEO', value: 'Ready', tone: 'success', note: 'Evidence packet tamam' },
                    { key: 'review', label: 'Review', value: '2 open', tone: 'warning', note: 'Son approval turu bekleniyor' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Kullanim notu">
                <Text variant="secondary" className="block leading-7">
                  Summary strip, dashboard kartlari kadar agir olmadan sayfa ustu karar ritmini hizli kurar; bu yuzden header alti veya grid ustu alanlarda cok verimlidir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'EntitySummaryBlock':
      return [
        {
          id: 'entity-summary-block-primary',
          eyebrow: t('designlab.showcase.component.entitySummaryBlock.sections.primary.eyebrow'),
          title: t('designlab.showcase.component.entitySummaryBlock.sections.primary.title'),
          description: t('designlab.showcase.component.entitySummaryBlock.sections.primary.description'),
          badges: [
            t('designlab.showcase.component.entitySummaryBlock.sections.primary.badge.entity'),
            t('designlab.showcase.component.entitySummaryBlock.sections.primary.badge.summary'),
            t('designlab.showcase.component.entitySummaryBlock.sections.primary.badge.beta'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.entitySummaryBlock.sections.primary.panelPrimary')}>
                <EntitySummaryBlock
                  title={t('designlab.showcase.component.entitySummaryBlock.sections.primary.card.title')}
                  subtitle={t('designlab.showcase.component.entitySummaryBlock.sections.primary.card.subtitle')}
                  badge={<Badge variant="success">{t('designlab.showcase.component.entitySummaryBlock.sections.primary.card.badge')}</Badge>}
                  avatar={{ name: t('designlab.showcase.component.entitySummaryBlock.sections.primary.card.title') }}
                  actions={<Button size="sm">{t('designlab.showcase.component.entitySummaryBlock.sections.primary.card.action')}</Button>}
                  items={entitySummaryItems}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.entitySummaryBlock.sections.primary.panelWhy')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.entitySummaryBlock.sections.primary.whyUse')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'entity-summary-block-with-avatar',
          eyebrow: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.eyebrow'),
          title: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.title'),
          description: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.description'),
          badges: [
            t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge.avatar'),
            t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge.governance'),
            t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge.details'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.panelGovernance')}>
                <EntitySummaryBlock
                  title={t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.title')}
                  subtitle={t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.subtitle')}
                  badge={<Badge variant="warning">{t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.badge')}</Badge>}
                  avatar={{
                    src: avatarPreviewImageSrc,
                    alt: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.avatarAlt'),
                    name: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.title'),
                  }}
                  items={[
                    {
                      key: 'wave',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.wave.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.wave.value'),
                      tone: 'info',
                    },
                    {
                      key: 'status',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.status.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.status.value'),
                      tone: 'success',
                    },
                    {
                      key: 'next',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.next.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.next.value'),
                      tone: 'warning',
                    },
                    {
                      key: 'owner',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.owner.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.owner.value'),
                      tone: 'info',
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.panelContract')}>
                <Descriptions
                  title={t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.title')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'header',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.header.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.header.value'),
                      tone: 'info',
                    },
                    {
                      key: 'avatar',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.avatar.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.avatar.value'),
                      tone: 'success',
                    },
                    {
                      key: 'details',
                      label: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.details.label'),
                      value: t('designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.details.value'),
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    default:
      return null;
  }
};
