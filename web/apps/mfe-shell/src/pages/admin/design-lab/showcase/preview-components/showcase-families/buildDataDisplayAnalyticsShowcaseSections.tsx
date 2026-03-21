import React from 'react';
import {
  AgGridServer,
  Badge,
  Descriptions,
  DetailSummary,
  SummaryStrip,
  Text,
  TreeTable,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type { DescriptionsItem } from '@mfe/design-system';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type ServerGridRow = {
  id: string;
  name: string;
  owner: string;
  status: string;
};

type DataDisplayAnalyticsShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
  agGridServerMessages: Record<string, string>;
  descriptionsLocaleText: Record<string, unknown>;
  rolloutDescriptionItems: DescriptionsItem[];
  serverGridRows: ServerGridRow[];
  treeTableLocaleText: Record<string, unknown>;
  treeTableNodes: React.ComponentProps<typeof TreeTable>['nodes'];
  renderRecipeComponentPreview: (recipeId: string) => React.ReactNode;
};

export const buildDataDisplayAnalyticsShowcaseSections = (
  componentName: string,
  context: DataDisplayAnalyticsShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    t,
    agGridServerMessages,
    descriptionsLocaleText,
    rolloutDescriptionItems,
    serverGridRows,
    treeTableLocaleText,
    treeTableNodes,
    renderRecipeComponentPreview,
  } = context;

  switch (componentName) {
    case 'Descriptions':
      return [
        {
          id: 'descriptions-rollout-summary',
          eyebrow: t('designlab.showcase.component.descriptions.sections.rolloutSummary.eyebrow'),
          title: t('designlab.showcase.component.descriptions.sections.rolloutSummary.title'),
          description: t('designlab.showcase.component.descriptions.sections.rolloutSummary.description'),
          badges: [
            t('designlab.showcase.component.descriptions.sections.rolloutSummary.badge.summary'),
            t('designlab.showcase.component.descriptions.sections.rolloutSummary.badge.beta'),
            t('designlab.showcase.component.descriptions.sections.rolloutSummary.badge.rollout'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.descriptions.sections.rolloutSummary.panelPrimary')}>
                <Descriptions
                  title={t('designlab.showcase.component.descriptions.sections.rolloutSummary.cardTitle')}
                  description={t('designlab.showcase.component.descriptions.sections.rolloutSummary.cardDescription')}
                  items={rolloutDescriptionItems}
                  columns={2}
                  localeText={descriptionsLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.descriptions.sections.rolloutSummary.panelInterpretation')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.descriptions.sections.rolloutSummary.interpretation')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'descriptions-compliance-panel',
          eyebrow: t('designlab.showcase.component.descriptions.sections.compliancePanel.eyebrow'),
          title: t('designlab.showcase.component.descriptions.sections.compliancePanel.title'),
          description: t('designlab.showcase.component.descriptions.sections.compliancePanel.description'),
          badges: [
            t('designlab.showcase.component.descriptions.sections.compliancePanel.badge.risk'),
            t('designlab.showcase.component.descriptions.sections.compliancePanel.badge.approval'),
            t('designlab.showcase.component.descriptions.sections.compliancePanel.badge.compact'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.descriptions.sections.compliancePanel.panelApproval')}>
                <Descriptions
                  title={t('designlab.showcase.component.descriptions.sections.compliancePanel.approvalTitle')}
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
                  localeText={descriptionsLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.descriptions.sections.compliancePanel.panelOwnership')}>
                <Descriptions
                  title={t('designlab.showcase.component.descriptions.sections.compliancePanel.ownershipTitle')}
                  items={[
                    {
                      key: 'owner',
                      label: t('designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.owner.label'),
                      value: t('designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.owner.value'),
                    },
                    {
                      key: 'window',
                      label: t('designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.window.label'),
                      value: t('designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.window.value'),
                      tone: 'info',
                    },
                    {
                      key: 'signoff',
                      label: t('designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.signoff.label'),
                      value: t('designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.signoff.value'),
                      tone: 'success',
                    },
                  ]}
                  columns={1}
                  density="compact"
                  localeText={descriptionsLocaleText}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'descriptions-entity-readiness',
          eyebrow: 'Readiness matrix',
          title: 'Entity readiness matrisi',
          description: 'Owner, evidence ve release readiness bilgisini tek ve daha sakin bir descriptions panelinde toplar.',
          badges: ['readiness', 'entity', 'matrix'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Readiness paneli">
                <Descriptions
                  title="Release readiness"
                  description="Surface owner, evidence ve son approval bilgisi."
                  density="compact"
                  columns={2}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'owner', label: 'Owner', value: 'Platform UI', tone: 'info' },
                    { key: 'surface', label: 'Surface', value: 'Design Lab', tone: 'success' },
                    { key: 'seo', label: 'SEO/GEO', value: 'Ready', tone: 'success' },
                    { key: 'approval', label: 'Approval', value: '2 open review', tone: 'warning' },
                    { key: 'window', label: 'Release window', value: '14 Mar 2026', tone: 'info' },
                    { key: 'evidence', label: 'Evidence', value: 'Smoke + storybook + metadata', tone: 'success', span: 2 },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Kullanim notu">
                <Text variant="secondary" className="block leading-7">
                  Descriptions, detay karti ile tablo arasinda kalan alanlarda teknik ama hizli okunur karar verisi sunmak icin idealdir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'descriptions-handoff-contract',
          eyebrow: 'Contract handoff',
          title: 'Handoff contract paneli',
          description: 'Ekipler arasi teslim noktalarinda tek kolon descriptions kullanarak daha dikey ama net bir handoff akisi kurar.',
          badges: ['handoff', 'contract', 'ops'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Tek kolon contract">
                <Descriptions
                  title="Delivery handoff"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'lane', label: 'Lane', value: 'module-delivery', tone: 'info' },
                    { key: 'contract', label: 'Contract', value: 'feature execution + SEO/GEO evidence', tone: 'warning' },
                    { key: 'owner', label: 'Owner', value: 'Frontend platform', tone: 'success' },
                    { key: 'next', label: 'Next step', value: 'Approval review paneline aktar', tone: 'info' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Neden bu model">
                <Text variant="secondary" className="block leading-7">
                  Handoff panelleri, uzun prose yerine kisa alan adlariyla teslim sorumlulugunu ve sonraki adimi sabitlemek icin gucludur.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'TreeTable':
      return [
        {
          id: 'tree-table-ownership-matrix',
          eyebrow: t('designlab.showcase.component.treeTable.sections.ownershipMatrix.eyebrow'),
          title: t('designlab.showcase.component.treeTable.sections.ownershipMatrix.title'),
          description: t('designlab.showcase.component.treeTable.sections.ownershipMatrix.description'),
          badges: [
            t('designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.matrix'),
            t('designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.hierarchy'),
            t('designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.beta'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.treeTable.sections.ownershipMatrix.panelMatrix')}>
                <TreeTable
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  localeText={treeTableLocaleText}
                  columns={[
                    { key: 'owner', label: t('designlab.showcase.component.treeTable.shared.columns.owner'), accessor: 'owner', emphasis: true },
                    { key: 'status', label: t('designlab.showcase.component.treeTable.shared.columns.status'), accessor: 'status', align: 'center' },
                    { key: 'scope', label: t('designlab.showcase.component.treeTable.shared.columns.scope'), accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.treeTable.sections.ownershipMatrix.panelUsage')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.treeTable.sections.ownershipMatrix.usage')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tree-table-compact-review',
          eyebrow: t('designlab.showcase.component.treeTable.sections.compactReview.eyebrow'),
          title: t('designlab.showcase.component.treeTable.sections.compactReview.title'),
          description: t('designlab.showcase.component.treeTable.sections.compactReview.description'),
          badges: [
            t('designlab.showcase.component.treeTable.sections.compactReview.badge.compact'),
            t('designlab.showcase.component.treeTable.sections.compactReview.badge.selected'),
            t('designlab.showcase.component.treeTable.sections.compactReview.badge.fallback'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.treeTable.sections.compactReview.panelCompact')}>
                <TreeTable
                  density="compact"
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  selectedKey="delivery-gates"
                  localeText={treeTableLocaleText}
                  columns={[
                    { key: 'status', label: t('designlab.showcase.component.treeTable.shared.columns.status'), accessor: 'status', align: 'center', emphasis: true },
                    { key: 'scope', label: t('designlab.showcase.component.treeTable.shared.columns.scope'), accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.treeTable.sections.compactReview.panelLoadingEmpty')}>
                <div className="space-y-4">
                  <TreeTable
                    title={t('designlab.showcase.component.treeTable.sections.compactReview.loadingTitle')}
                    loading
                    nodes={[]}
                    columns={[]}
                    localeText={treeTableLocaleText}
                  />
                  <TreeTable
                    title={t('designlab.showcase.component.treeTable.sections.compactReview.emptyTitle')}
                    nodes={[]}
                    columns={[]}
                    emptyStateLabel={t('designlab.showcase.component.treeTable.sections.compactReview.emptyState')}
                    localeText={treeTableLocaleText}
                  />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tree-table-release-dependency-map',
          eyebrow: 'Dependency review',
          title: 'Release dependency map',
          description: 'Hierarchical dependency ve ownership bilgisini ayni tablo agacinda toplayan daha release-odakli bir alternatif sunar.',
          badges: ['dependency', 'release', 'ownership'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Dependency tree-table">
                <TreeTable
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  selectedKey="delivery-gates"
                  localeText={treeTableLocaleText}
                  columns={[
                    { key: 'owner', label: 'Owner', accessor: 'owner', emphasis: true },
                    { key: 'status', label: 'State', accessor: 'status', align: 'center' },
                    { key: 'scope', label: 'Dependency', accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Review note">
                <Text variant="secondary" className="block leading-7">
                  TreeTable, düz tabloya gore parent-child baglarini kaybetmeden dependency ve ownership bilgisini ayni anda gosterir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tree-table-readonly-audit-contract',
          eyebrow: 'Readonly audit',
          title: 'Readonly audit tree-table',
          description: 'Secim ve hierarchy bilgisini korurken paneli audit ve support gorunumu olarak daha pasif kullanir.',
          badges: ['readonly', 'audit', 'support'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Readonly tree-table">
                <TreeTable
                  density="compact"
                  access="readonly"
                  nodes={treeTableNodes}
                  defaultExpandedKeys={['platform-ui']}
                  selectedKey="delivery-gates"
                  localeText={treeTableLocaleText}
                  columns={[
                    { key: 'status', label: 'Status', accessor: 'status', align: 'center', emphasis: true },
                    { key: 'scope', label: 'Audit scope', accessor: 'scope' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Support notu">
                <Descriptions
                  title="Audit notes"
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    { key: 'mode', label: 'Mode', value: 'Readonly support', tone: 'info' },
                    { key: 'focus', label: 'Focus', value: 'Dependency ve state takibi', tone: 'warning' },
                    { key: 'handoff', label: 'Handoff', value: 'Support -> governance', tone: 'success' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'AgGridServer':
      return [
        {
          id: 'ag-grid-server-ownership-list',
          eyebrow: t('designlab.showcase.component.agGridServer.sections.ownershipList.eyebrow'),
          title: t('designlab.showcase.component.agGridServer.sections.ownershipList.title'),
          description: t('designlab.showcase.component.agGridServer.sections.ownershipList.description'),
          badges: [
            t('designlab.showcase.component.agGridServer.sections.ownershipList.badge.serverSide'),
            t('designlab.showcase.component.agGridServer.sections.ownershipList.badge.stable'),
            t('designlab.showcase.component.agGridServer.sections.ownershipList.badge.performance'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.agGridServer.sections.ownershipList.panelList')}>
                <div className="h-[360px]">
                  <AgGridServer
                    height={320}
                    messages={agGridServerMessages}
                    columnDefs={[
                      { field: 'id', headerName: 'ID', width: 120 },
                      { field: 'name', headerName: t('designlab.showcase.component.agGridServer.shared.columns.source'), flex: 1 },
                      { field: 'owner', headerName: t('designlab.showcase.component.agGridServer.shared.columns.owner'), width: 180 },
                    ]}
                    getData={async () => ({ rows: serverGridRows, total: serverGridRows.length })}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.agGridServer.sections.ownershipList.panelContract')}>
                <div className="grid grid-cols-1 gap-3">
                  <LibraryMetricCard
                    label={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.datasource.label')}
                    value={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.datasource.value')}
                    note={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.datasource.note')}
                  />
                  <LibraryMetricCard
                    label={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.rows.label')}
                    value={`${serverGridRows.length}`}
                    note={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.rows.note')}
                  />
                  <LibraryMetricCard
                    label={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.surface.label')}
                    value={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.surface.value')}
                    note={t('designlab.showcase.component.agGridServer.sections.ownershipList.metrics.surface.note')}
                  />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'ag-grid-server-loading-contract',
          eyebrow: t('designlab.showcase.component.agGridServer.sections.loadingContract.eyebrow'),
          title: t('designlab.showcase.component.agGridServer.sections.loadingContract.title'),
          description: t('designlab.showcase.component.agGridServer.sections.loadingContract.description'),
          badges: [
            t('designlab.showcase.component.agGridServer.sections.loadingContract.badge.loading'),
            t('designlab.showcase.component.agGridServer.sections.loadingContract.badge.empty'),
            t('designlab.showcase.component.agGridServer.sections.loadingContract.badge.ops'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.agGridServer.sections.loadingContract.panelGuidance')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.agGridServer.sections.loadingContract.guidance')}
                </Text>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.agGridServer.sections.loadingContract.panelEvidence')}>
                <Descriptions
                  title={t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.title')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'datasource',
                      label: t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.datasource.label'),
                      value: t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.datasource.value'),
                      tone: 'info',
                    },
                    {
                      key: 'loading',
                      label: t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.loading.label'),
                      value: t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.loading.value'),
                      tone: 'warning',
                    },
                    {
                      key: 'failure',
                      label: t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.failure.label'),
                      value: t('designlab.showcase.component.agGridServer.sections.loadingContract.evidence.failure.value'),
                      tone: 'danger',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'ag-grid-server-release-queue',
          eyebrow: 'Release queue',
          title: 'Server-side release queue',
          description: 'Server-side grid davranisini release queue baglaminda daha operasyonel bir listeleme modeliyle gosterir.',
          badges: ['server', 'queue', 'release'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Release queue grid">
                <div className="h-[360px]">
                  <AgGridServer
                    height={320}
                    messages={agGridServerMessages}
                    columnDefs={[
                      { field: 'id', headerName: 'ID', width: 120 },
                      { field: 'name', headerName: 'Surface', flex: 1 },
                      { field: 'status', headerName: 'State', width: 140 },
                      { field: 'owner', headerName: 'Owner', width: 180 },
                    ]}
                    getData={async () => ({ rows: serverGridRows, total: serverGridRows.length })}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Queue state">
                <SummaryStrip
                  title="Server queue"
                  description="Release ve review kuyruğu için hızlı özet."
                  columns={2}
                  items={[
                    { key: 'rows', label: 'Rows', value: `${serverGridRows.length}`, tone: 'info', note: 'Server-side satir sayisi' },
                    { key: 'mode', label: 'Mode', value: 'Server', tone: 'success', note: 'Datasource aktif' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'DetailSummary':
      return [
        {
          id: 'detail-summary-default',
          eyebrow: t('designlab.showcase.recipe.detailSummary.eyebrow'),
          title: t('designlab.showcase.recipe.detailSummary.title'),
          description: t('designlab.showcase.recipe.detailSummary.description'),
          badges: ['wave-11', 'recipes', 'detail'],
          content: renderRecipeComponentPreview('detail_summary'),
        },
        {
          id: 'detail-summary-release-handoff',
          eyebrow: 'Recipe 02',
          title: 'Release handoff summary',
          description: 'Entity context, ozet metrikler ve debug payload ayni release handoff yuzeyinde okunur.',
          badges: ['release', 'handoff', 'json'],
          content: (
            <DetailSummary
              eyebrow="Release summary"
              title="Wave 12 delivery pack"
              description="Release hazirligi, owner ve machine-readable payload ayni detail shell altinda toplanir."
              meta={<SectionBadge label="delivery-pack" />}
              status={<Badge variant="success">Ready</Badge>}
              summaryItems={[
                { key: 'lane', label: 'Lane', value: 'delivery', note: 'Aktif publish lane', tone: 'info' },
                { key: 'seo', label: 'SEO/GEO', value: 'Ready', note: 'Evidence paketi tamam', tone: 'success' },
                { key: 'review', label: 'Review', value: '2 open', note: 'Son approval turu', tone: 'warning' },
              ]}
              entity={{
                title: 'Design system release',
                subtitle: 'Wave 12 package overview',
                badge: <Badge variant="success">Stable</Badge>,
                avatar: { name: 'Design system release' },
                items: [
                  { key: 'owner', label: 'Owner', value: 'Platform UI', tone: 'info' },
                  { key: 'track', label: 'Track', value: 'Release operations', tone: 'success' },
                  { key: 'window', label: 'Window', value: '14 Mar 2026', tone: 'warning' },
                ],
              }}
              detailItems={[
                { key: 'focus', label: 'Focus', value: 'Packaging, smoke ve metadata handoff', tone: 'info' },
                { key: 'contract', label: 'Contract', value: 'release_delivery_surface_v1', tone: 'success' },
                { key: 'risk', label: 'Risk', value: 'Low', tone: 'warning' },
                { key: 'scope', label: 'Scope', value: 'Docs, shell, access, reporting', tone: 'info', span: 2 },
              ]}
              jsonValue={{
                packageId: 'wave-12-release-pack',
                evidence: ['seo-geo-evidence', 'playwright-shell', 'module-delivery-lane'],
                owner: 'platform-ui',
                state: 'ready',
              }}
            />
          ),
        },
        {
          id: 'detail-summary-readonly-contract',
          eyebrow: 'Recipe 03',
          title: 'Readonly contract summary',
          description: 'Ayni detail shell okunur ama aksiyon yerine sabit contract ve payload gosterir.',
          badges: ['readonly', 'contract', 'audit'],
          content: (
            <DetailSummary
              eyebrow="Readonly detail"
              title="Governed component contract"
              description="Karar verilmis bir surface icin degistirilemeyen contract ozeti sunar."
              status={<Badge variant="info">Locked</Badge>}
              access="readonly"
              summaryItems={[
                { key: 'mode', label: 'Mode', value: 'Readonly', note: 'No edit surface', tone: 'info' },
                { key: 'policy', label: 'Policy', value: 'Managed', note: 'SSOT ile kilitli', tone: 'success' },
              ]}
              entity={{
                title: 'Approval review',
                subtitle: 'Managed contract snapshot',
                avatar: { name: 'Approval review' },
                items: [
                  { key: 'owner', label: 'Owner', value: 'Design governance', tone: 'info' },
                  { key: 'state', label: 'State', value: 'Approved', tone: 'success' },
                ],
              }}
              detailItems={[
                { key: 'rule', label: 'Rule', value: 'Canonical UI contract', tone: 'warning' },
                { key: 'evidence', label: 'Evidence', value: 'Timeline + citation', tone: 'info' },
              ]}
              jsonValue={{ mode: 'readonly', lockedBy: 'policy_ui_design_system', state: 'approved' }}
            />
          ),
        },
        {
          id: 'detail-summary-incident-triage',
          eyebrow: 'Recipe 04',
          title: 'Incident triage summary',
          description: 'Hizli karar metrikleri, owner bilgisi ve machine-readable payload ayni support summary ritminde birlesir.',
          badges: ['incident', 'triage', 'support'],
          content: (
            <DetailSummary
              eyebrow="Support summary"
              title="Runtime incident triage"
              description="Escalation owner, impact ve remediation baglami tek detail shell ile okunur."
              meta={<SectionBadge label="incident-runtime" />}
              status={<Badge variant="warning">Investigating</Badge>}
              summaryItems={[
                { key: 'impact', label: 'Impact', value: 'Medium', note: 'Kullanici akisinda kismi etki', tone: 'warning' },
                { key: 'owner', label: 'Owner', value: 'Platform shell', note: 'Aktif owner lane', tone: 'info' },
                { key: 'eta', label: 'ETA', value: '45m', note: 'Tahmini cozum suresi', tone: 'success' },
              ]}
              entity={{
                title: 'Session audit deeplink',
                subtitle: 'Runtime regression summary',
                badge: <Badge variant="warning">Investigating</Badge>,
                avatar: { name: 'Session audit deeplink' },
                items: [
                  { key: 'surface', label: 'Surface', value: 'mfe-shell', tone: 'info' },
                  { key: 'severity', label: 'Severity', value: 'P2', tone: 'warning' },
                  { key: 'channel', label: 'Channel', value: 'Support escalation', tone: 'success' },
                ],
              }}
              detailItems={[
                { key: 'symptom', label: 'Symptom', value: 'Deeplink state mismatch', tone: 'warning' },
                { key: 'scope', label: 'Scope', value: 'Session audit panel', tone: 'info' },
                { key: 'next', label: 'Next step', value: 'Guard + route sync patch', tone: 'success', span: 2 },
              ]}
              jsonValue={{
                incidentId: 'shell-session-audit',
                severity: 'p2',
                owner: 'platform-shell',
                nextAction: 'route_sync_patch',
              }}
            />
          ),
        },
        {
          id: 'detail-summary-adoption-readiness',
          eyebrow: 'Recipe 05',
          title: 'Adoption readiness summary',
          description: 'Component adoption, SEO/GEO readiness ve quality evidence ayni detail summary panelinde toplanir.',
          badges: ['adoption', 'readiness', 'evidence'],
          content: (
            <DetailSummary
              eyebrow="Adoption board"
              title="Component adoption readiness"
              description="Yeni component ailesinin katalog, docs, tests ve SEO/GEO readiness durumunu tek özet yüzeyde sunar."
              meta={<SectionBadge label="adoption-board" />}
              status={<Badge variant="success">Ready</Badge>}
              summaryItems={[
                { key: 'docs', label: 'Docs', value: 'Ready', note: 'Catalog + story tamam', tone: 'success' },
                { key: 'seo', label: 'SEO/GEO', value: 'Aligned', note: 'Evidence kuralı bağlı', tone: 'info' },
                { key: 'tests', label: 'Tests', value: 'Green', note: 'UI + shell hatlari gecti', tone: 'success' },
              ]}
              entity={{
                title: 'DetailSectionTabs',
                subtitle: 'Recipe-level detail navigation surface',
                badge: <Badge variant="success">Adopted</Badge>,
                avatar: { name: 'DetailSectionTabs' },
                items: [
                  { key: 'family', label: 'Family', value: 'Navigation & workspace', tone: 'info' },
                  { key: 'consumer', label: 'Consumer', value: 'Design Lab', tone: 'success' },
                  { key: 'stage', label: 'Stage', value: 'Recipe complete', tone: 'warning' },
                ],
              }}
              detailItems={[
                { key: 'reason', label: 'Why', value: 'Raw primitive tekrarini azaltmak', tone: 'info' },
                { key: 'benefit', label: 'Benefit', value: 'Tutarlilik + daha dusuk bakım maliyeti', tone: 'success' },
                { key: 'followup', label: 'Follow-up', value: 'Baska detail workspace sayfalarina adoption', tone: 'warning', span: 2 },
              ]}
              jsonValue={{
                component: 'DetailSectionTabs',
                consumers: ['design-lab'],
                seoGeoReady: true,
                tests: ['ui-kit', 'shell'],
              }}
            />
          ),
        },
      ];
    default:
      return null;
  }
};
