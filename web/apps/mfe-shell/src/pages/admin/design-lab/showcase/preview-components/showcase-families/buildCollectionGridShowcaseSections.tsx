import React from 'react';
import {
  Badge,
  Descriptions,
  EntityGridTemplate,
  JsonViewer,
  List,
  SummaryStrip,
  Text,
  Tree,
} from '@mfe/design-system';
import {
  LibraryQueryProvider,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import { getDesignLabTableSimpleSectionShowcase } from '../DesignLabTableSimpleShowcase';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type GridRow = Record<string, unknown>;
type JsonViewerValue = Record<string, unknown> & { policy?: unknown };
type TableSimpleLocaleText = {
  emptyFallbackDescription: string;
};
type EntityGridTemplateShellProps = Omit<
  React.ComponentProps<typeof EntityGridTemplate<GridRow>>,
  'gridId' | 'gridSchemaVersion' | 'dataSourceMode' | 'rowData' | 'total' | 'page' | 'pageSize' | 'columnDefs' | 'createServerSideDatasource'
>;

type CollectionGridShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  descriptionsLocaleText: React.ComponentProps<typeof Descriptions>['localeText'];
  entityGridTemplateShellProps: EntityGridTemplateShellProps;
  gridRows: GridRow[];
  jsonViewerLocaleText: React.ComponentProps<typeof JsonViewer>['localeText'];
  jsonViewerValue: JsonViewerValue;
  listItems: React.ComponentProps<typeof List>['items'];
  listLocaleText: React.ComponentProps<typeof List>['localeText'];
  policyTableRows: GridRow[];
  serverGridRows: GridRow[];
  t: DesignLabTranslate;
  tableSimpleLocaleText: TableSimpleLocaleText;
  treeLocaleText: React.ComponentProps<typeof Tree>['localeText'];
  treeNodes: React.ComponentProps<typeof Tree>['nodes'];
};

export const buildCollectionGridShowcaseSections = (
  componentName: string,
  context: CollectionGridShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
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
  } = context;

  switch (componentName) {
    case 'TableSimple':
      return getDesignLabTableSimpleSectionShowcase({
        policyTableRows,
        tableSimpleLocaleText,
        t,
      });
    case 'List':
      return [
        {
          id: 'list-operational-inbox',
          eyebrow: t('designlab.showcase.component.list.sections.operationalInbox.eyebrow'),
          title: t('designlab.showcase.component.list.sections.operationalInbox.title'),
          description: t('designlab.showcase.component.list.sections.operationalInbox.description'),
          badges: [
            t('designlab.showcase.component.list.sections.operationalInbox.badge.taskList'),
            t('designlab.showcase.component.list.sections.operationalInbox.badge.selection'),
            t('designlab.showcase.component.list.sections.operationalInbox.badge.beta'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.list.sections.operationalInbox.panelQueue')}>
                <List
                  title={t('designlab.showcase.component.list.sections.operationalInbox.listTitle')}
                  description={t('designlab.showcase.component.list.sections.operationalInbox.listDescription')}
                  items={listItems}
                  selectedKey="doctor"
                  onItemSelect={() => undefined}
                  localeText={listLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.list.sections.operationalInbox.panelWhy')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.list.sections.operationalInbox.why')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'list-priority-review',
          eyebrow: t('designlab.showcase.component.list.sections.priorityReview.eyebrow'),
          title: t('designlab.showcase.component.list.sections.priorityReview.title'),
          description: t('designlab.showcase.component.list.sections.priorityReview.description'),
          badges: [
            t('designlab.showcase.component.list.sections.priorityReview.badge.compact'),
            t('designlab.showcase.component.list.sections.priorityReview.badge.priority'),
            t('designlab.showcase.component.list.sections.priorityReview.badge.tone'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.list.sections.priorityReview.panelCompact')}>
                <List
                  density="compact"
                  items={listItems}
                  selectedKey="triage"
                  onItemSelect={() => undefined}
                  localeText={listLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.list.sections.priorityReview.panelLoadingEmpty')}>
                <div className="space-y-4">
                  <List title={t('designlab.showcase.component.list.sections.priorityReview.loadingTitle')} loading items={[]} localeText={listLocaleText} />
                  <List
                    title={t('designlab.showcase.component.list.sections.priorityReview.emptyTitle')}
                    items={[]}
                    emptyStateLabel={t('designlab.showcase.component.list.sections.priorityReview.emptyState')}
                    localeText={listLocaleText}
                  />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'list-activity-feed',
          eyebrow: 'Activity & inbox',
          title: 'Aktivite beslemesi',
          description: 'Prefix, suffix, badge ve meta alanlarini ayni listede toplayan daha zengin bir feed alternatifi sunar.',
          badges: ['activity', 'rich', 'feed'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Aktivite listesi">
                <List
                  title="Son hareketler"
                  description="Adoption, review ve release olaylari."
                  selectedKey="release-block"
                  onItemSelect={() => undefined}
                  localeText={listLocaleText}
                  items={[
                    {
                      key: 'release-block',
                      title: 'Release window donduruldu',
                      description: 'Compliance lane bu hafta yalniz docs ve policy degisikligi kabul ediyor.',
                      prefix: <Badge tone="warning">warn</Badge>,
                      suffix: <SectionBadge label="2 dk once" />,
                      badges: ['release', 'policy'],
                      tone: 'warning',
                    },
                    {
                      key: 'seo-evidence',
                      title: 'SEO/GEO evidence tamamlandi',
                      description: 'Canonical URL, summary ve breadcrumb markup kaniti raporlandi.',
                      prefix: <Badge tone="success">ok</Badge>,
                      suffix: <SectionBadge label="rapor:v1" />,
                      badges: ['seo', 'geo'],
                      tone: 'success',
                    },
                    {
                      key: 'preview-sync',
                      title: 'Preview varyantlari guncellendi',
                      description: 'Detail tabs ve pagination showcase ailesi yeniden uretildi.',
                      prefix: <Badge tone="info">new</Badge>,
                      suffix: <SectionBadge label="4 item" />,
                      badges: ['preview'],
                      tone: 'info',
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Kullanim notu">
                <Text variant="secondary" className="block leading-7">
                  Rich listeler, notification drawer ve audit inbox yuzeyleri icin tabloya gore daha hafif ama kartlara gore daha yogun bir middle-ground sunar.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'JsonViewer':
      return [
        {
          id: 'json-viewer-release-payload',
          eyebrow: t('designlab.showcase.component.jsonViewer.sections.releasePayload.eyebrow'),
          title: t('designlab.showcase.component.jsonViewer.sections.releasePayload.title'),
          description: t('designlab.showcase.component.jsonViewer.sections.releasePayload.description'),
          badges: [
            t('designlab.showcase.component.jsonViewer.sections.releasePayload.badge.payload'),
            t('designlab.showcase.component.jsonViewer.sections.releasePayload.badge.audit'),
            t('designlab.showcase.component.jsonViewer.sections.releasePayload.badge.beta'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.jsonViewer.sections.releasePayload.panelPrimary')}>
                <JsonViewer
                  title={t('designlab.showcase.component.jsonViewer.sections.releasePayload.cardTitle')}
                  description={t('designlab.showcase.component.jsonViewer.sections.releasePayload.cardDescription')}
                  value={jsonViewerValue}
                  rootLabel="wave"
                  defaultExpandedDepth={2}
                  localeText={jsonViewerLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.jsonViewer.sections.releasePayload.panelUsage')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.jsonViewer.sections.releasePayload.usage')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'json-viewer-policy-config',
          eyebrow: t('designlab.showcase.component.jsonViewer.sections.policyConfig.eyebrow'),
          title: t('designlab.showcase.component.jsonViewer.sections.policyConfig.title'),
          description: t('designlab.showcase.component.jsonViewer.sections.policyConfig.description'),
          badges: [
            t('designlab.showcase.component.jsonViewer.sections.policyConfig.badge.policy'),
            t('designlab.showcase.component.jsonViewer.sections.policyConfig.badge.config'),
            t('designlab.showcase.component.jsonViewer.sections.policyConfig.badge.readonly'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.jsonViewer.sections.policyConfig.panelPolicy')}>
                <JsonViewer
                  title={t('designlab.showcase.component.jsonViewer.sections.policyConfig.policyTitle')}
                  value={jsonViewerValue.policy}
                  rootLabel="policy"
                  defaultExpandedDepth={1}
                  maxHeight={320}
                  localeText={jsonViewerLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.jsonViewer.sections.policyConfig.panelEmpty')}>
                <div className="space-y-4">
                  <JsonViewer
                    title={t('designlab.showcase.component.jsonViewer.sections.policyConfig.undefinedTitle')}
                    value={undefined}
                    emptyStateLabel={t('designlab.showcase.component.jsonViewer.sections.policyConfig.emptyState')}
                    localeText={jsonViewerLocaleText}
                  />
                  <JsonViewer
                    title={t('designlab.showcase.component.jsonViewer.sections.policyConfig.primitiveTitle')}
                    value={{ releaseWindow: 'saturday-22', rollbackReady: true }}
                    rootLabel="config"
                    localeText={jsonViewerLocaleText}
                  />
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
          eyebrow: t('designlab.showcase.component.tree.sections.releaseGovernance.eyebrow'),
          title: t('designlab.showcase.component.tree.sections.releaseGovernance.title'),
          description: t('designlab.showcase.component.tree.sections.releaseGovernance.description'),
          badges: [
            t('designlab.showcase.component.tree.sections.releaseGovernance.badge.tree'),
            t('designlab.showcase.component.tree.sections.releaseGovernance.badge.hierarchy'),
            t('designlab.showcase.component.tree.sections.releaseGovernance.badge.beta'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.tree.sections.releaseGovernance.panelHierarchy')}>
                <Tree
                  title={t('designlab.showcase.component.tree.sections.releaseGovernance.cardTitle')}
                  nodes={treeNodes}
                  defaultExpandedKeys={['release', 'doctor']}
                  selectedKey="doctor-ui-library"
                  localeText={treeLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tree.sections.releaseGovernance.panelUsage')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.tree.sections.releaseGovernance.usage')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tree-readonly-audit',
          eyebrow: t('designlab.showcase.component.tree.sections.readonlyAudit.eyebrow'),
          title: t('designlab.showcase.component.tree.sections.readonlyAudit.title'),
          description: t('designlab.showcase.component.tree.sections.readonlyAudit.description'),
          badges: [
            t('designlab.showcase.component.tree.sections.readonlyAudit.badge.readonly'),
            t('designlab.showcase.component.tree.sections.readonlyAudit.badge.compact'),
            t('designlab.showcase.component.tree.sections.readonlyAudit.badge.audit'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.tree.sections.readonlyAudit.panelReadonly')}>
                <Tree
                  density="compact"
                  nodes={treeNodes}
                  defaultExpandedKeys={['release', 'security']}
                  access="readonly"
                  selectedKey="security-residual"
                  localeText={treeLocaleText}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.tree.sections.readonlyAudit.panelLoadingEmpty')}>
                <div className="space-y-4">
                  <Tree
                    title={t('designlab.showcase.component.tree.sections.readonlyAudit.loadingTitle')}
                    loading
                    nodes={[]}
                    localeText={treeLocaleText}
                  />
                  <Tree
                    title={t('designlab.showcase.component.tree.sections.readonlyAudit.emptyTitle')}
                    nodes={[]}
                    emptyStateLabel={t('designlab.showcase.component.tree.sections.readonlyAudit.emptyState')}
                    localeText={treeLocaleText}
                  />
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tree-doc-map',
          eyebrow: 'Docs & information architecture',
          title: 'Bilgi mimarisi haritasi',
          description: 'Doc-nav, policy ve rollout klasorlerini birlikte gosteren daha zengin tree alternatifi uretir.',
          badges: ['doc-nav', 'map', 'hierarchy'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Docs tree">
                <Tree
                  title="Dokumantasyon haritasi"
                  description="Section, policy ve evidence kaynaklari tek agacta."
                  localeText={treeLocaleText}
                  defaultExpandedKeys={['docs', 'policies']}
                  selectedKey="docs-section-tabs"
                  nodes={[
                    {
                      key: 'docs',
                      label: 'Docs',
                      description: 'Detail recipe ve usage narrative',
                      badges: ['12'],
                      children: [
                        { key: 'docs-section-tabs', label: 'Section tabs', description: 'Workspace detail navigation', badges: ['new'] },
                        { key: 'docs-pagination', label: 'Pagination showcase', description: 'Extended alternatives', badges: ['5'] },
                      ],
                    },
                    {
                      key: 'policies',
                      label: 'Policies',
                      description: 'SEO/GEO, design-system ve governance',
                      badges: ['3'],
                      children: [
                        { key: 'policy-ui', label: 'UI design policy', description: 'Canonical design decisions' },
                        { key: 'policy-seo', label: 'SEO/GEO evidence', description: 'Public surface readiness', badges: ['required'] },
                      ],
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Tree, yalniz file-system gorunumu icin degil; bilgi mimarisi, rollout dependency ve docs nav map gibi alanlarda da guclu bir secenektir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'EntityGridTemplate':
      return [
        {
          id: 'entity-grid-template-client-registry',
          eyebrow: t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.eyebrow'),
          title: t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.title'),
          description: t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.description'),
          badges: [
            t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge.client'),
            t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge.stable'),
            t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge.toolbar'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.panelRegistry')}>
                <div className="h-[420px]">
                  <LibraryQueryProvider>
                    <EntityGridTemplate<GridRow>
                      gridId="design-lab-entity-grid-client"
                      gridSchemaVersion={1}
                      dataSourceMode="client"
                      rowData={gridRows}
                      total={gridRows.length}
                      page={1}
                      pageSize={25}
                      columnDefs={[
                        { field: 'name', headerName: t('designlab.showcase.component.entityGridTemplate.shared.columns.name'), flex: 1 },
                        { field: 'status', headerName: t('designlab.showcase.component.entityGridTemplate.shared.columns.status'), width: 140 },
                        { field: 'updatedAt', headerName: t('designlab.showcase.component.entityGridTemplate.shared.columns.updatedAt'), width: 140 },
                      ]}
                      {...entityGridTemplateShellProps}
                    />
                  </LibraryQueryProvider>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.panelValue')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.entityGridTemplate.sections.clientRegistry.valueNote')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'entity-grid-template-server-mode',
          eyebrow: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.eyebrow'),
          title: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.title'),
          description: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.description'),
          badges: [
            t('designlab.showcase.component.entityGridTemplate.sections.serverMode.badge.server'),
            t('designlab.showcase.component.entityGridTemplate.sections.serverMode.badge.variant'),
            t('designlab.showcase.component.entityGridTemplate.sections.serverMode.badge.modeSwitch'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.entityGridTemplate.sections.serverMode.panelServer')}>
                <div className="h-[420px]">
                  <LibraryQueryProvider>
                    <EntityGridTemplate<GridRow>
                      gridId="design-lab-entity-grid-server"
                      gridSchemaVersion={2}
                      dataSourceMode="server"
                      total={serverGridRows.length}
                      page={1}
                      pageSize={25}
                      columnDefs={[
                        { field: 'id', headerName: 'ID', width: 120 },
                        { field: 'name', headerName: t('designlab.showcase.component.entityGridTemplate.shared.columns.source'), flex: 1 },
                        { field: 'owner', headerName: t('designlab.showcase.component.entityGridTemplate.shared.columns.owner'), width: 180 },
                      ]}
                      {...entityGridTemplateShellProps}
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
              <PreviewPanel title={t('designlab.showcase.component.entityGridTemplate.sections.serverMode.panelRegression')}>
                <Descriptions
                  title={t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.title')}
                  density="compact"
                  columns={1}
                  localeText={descriptionsLocaleText}
                  items={[
                    {
                      key: 'mode',
                      label: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.mode.label'),
                      value: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.mode.value'),
                      tone: 'info',
                    },
                    {
                      key: 'toolbar',
                      label: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.toolbar.label'),
                      value: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.toolbar.value'),
                      tone: 'success',
                    },
                    {
                      key: 'datasource',
                      label: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.datasource.label'),
                      value: t('designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.datasource.value'),
                      tone: 'warning',
                    },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'entity-grid-template-bulk-review',
          eyebrow: 'Operations & review',
          title: 'Bulk review grid',
          description: 'Toolbar, state summary ve kompakt registry satirlarini tek grid recipe icinde gosteren daha operasyonel bir alternatif sunar.',
          badges: ['bulk', 'review', 'ops-grid'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <PreviewPanel title="Kompakt review grid">
                <div className="h-[420px]">
                  <LibraryQueryProvider>
                    <EntityGridTemplate<GridRow>
                      gridId="design-lab-entity-grid-review"
                      gridSchemaVersion={3}
                      dataSourceMode="client"
                      rowData={gridRows}
                      total={gridRows.length}
                      page={1}
                      pageSize={10}
                      columnDefs={[
                        { field: 'name', headerName: 'Surface', flex: 1 },
                        { field: 'status', headerName: 'State', width: 130 },
                        { field: 'updatedAt', headerName: 'Updated', width: 140 },
                      ]}
                      {...entityGridTemplateShellProps}
                    />
                  </LibraryQueryProvider>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Grid recipe">
                <SummaryStrip
                  title="Review bandi"
                  description="Grid ustundeki hizli karar cercevesi"
                  columns={2}
                  items={[
                    { key: 'selection', label: 'Selection', value: '12 row', tone: 'info', note: 'Bulk review icin secili satirlar' },
                    { key: 'gate', label: 'Gate', value: 'Ready', tone: 'success', note: 'Smoke ve visual kaniti temiz' },
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
