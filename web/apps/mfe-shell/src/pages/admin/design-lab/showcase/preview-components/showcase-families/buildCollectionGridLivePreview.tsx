import React from 'react';
import {
  AgGridServer,
  EntityGridTemplate,
  JsonViewer,
  List,
  _Text,
  Tree,
  TreeTable,
} from '@mfe/design-system';
import {
  LibraryQueryProvider,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import { DesignLabTableSimpleShowcase } from '../DesignLabTableSimpleShowcase';
import type {
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

type CollectionGridLivePreviewContext = {
  PreviewPanel: PreviewPanelComponent;
  agGridServerMessages: React.ComponentProps<typeof AgGridServer>['messages'];
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
  treeTableLocaleText: React.ComponentProps<typeof TreeTable>['localeText'];
  treeTableNodes: React.ComponentProps<typeof TreeTable>['nodes'];
};

export const buildCollectionGridLivePreview = (
  componentName: string,
  context: CollectionGridLivePreviewContext,
): React.ReactNode | null => {
  const {
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
  } = context;

  switch (componentName) {
    case 'TableSimple':
      return (
        <DesignLabTableSimpleShowcase
          policyTableRows={policyTableRows}
          tableSimpleLocaleText={tableSimpleLocaleText}
        />
      );
    case 'List':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.list.live.inbox.panel')}>
              <List
                title={t('designlab.showcase.component.list.live.inbox.title')}
                description={t('designlab.showcase.component.list.live.inbox.description')}
                items={listItems}
                selectedKey="doctor"
                localeText={listLocaleText}
              />
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.list.live.compact.panel')}>
              <List
                title={t('designlab.showcase.component.list.live.compact.title')}
                density="compact"
                items={listItems}
                selectedKey="triage"
                onItemSelect={() => undefined}
                localeText={listLocaleText}
              />
            </PreviewPanel>
          </div>
        </div>
      );
    case 'JsonViewer':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.jsonViewer.live.releasePayload.panel')}>
              <JsonViewer
                title={t('designlab.showcase.component.jsonViewer.live.releasePayload.title')}
                description={t('designlab.showcase.component.jsonViewer.live.releasePayload.description')}
                value={jsonViewerValue}
                rootLabel="wave"
                defaultExpandedDepth={2}
                localeText={jsonViewerLocaleText}
              />
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.jsonViewer.live.policySnapshot.panel')}>
              <JsonViewer
                title={t('designlab.showcase.component.jsonViewer.live.policySnapshot.title')}
                description={t('designlab.showcase.component.jsonViewer.live.policySnapshot.description')}
                value={jsonViewerValue.policy}
                rootLabel="policy"
                defaultExpandedDepth={1}
                maxHeight={320}
                localeText={jsonViewerLocaleText}
              />
            </PreviewPanel>
          </div>
        </div>
      );
    case 'Tree':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.tree.live.hierarchy.panel')}>
              <Tree
                title={t('designlab.showcase.component.tree.live.hierarchy.title')}
                description={t('designlab.showcase.component.tree.live.hierarchy.description')}
                nodes={treeNodes}
                defaultExpandedKeys={['release', 'doctor']}
                selectedKey="doctor-ui-library"
                localeText={treeLocaleText}
              />
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.tree.live.readonly.panel')}>
              <Tree
                title={t('designlab.showcase.component.tree.live.readonly.title')}
                density="compact"
                nodes={treeNodes}
                defaultExpandedKeys={['release', 'security']}
                access="readonly"
                selectedKey="security-residual"
                localeText={treeLocaleText}
              />
            </PreviewPanel>
          </div>
        </div>
      );
    case 'TreeTable':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.treeTable.live.ownershipMatrix.panel')}>
              <TreeTable
                title={t('designlab.showcase.component.treeTable.live.ownershipMatrix.title')}
                description={t('designlab.showcase.component.treeTable.live.ownershipMatrix.description')}
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
            <PreviewPanel title={t('designlab.showcase.component.treeTable.live.compactReview.panel')}>
              <TreeTable
                title={t('designlab.showcase.component.treeTable.live.compactReview.title')}
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
          </div>
        </div>
      );
    case 'EntityGridTemplate':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-xs">
          <div className="h-[420px]">
            <LibraryQueryProvider>
              <EntityGridTemplate<GridRow>
                gridId="design-lab-grid"
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
        </div>
      );
    case 'AgGridServer':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-4 shadow-xs">
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
        </div>
      );
    default:
      return null;
  }
};
