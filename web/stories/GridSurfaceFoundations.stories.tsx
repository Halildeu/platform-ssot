import '../packages/ui-kit/src';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { ColDef } from 'ag-grid-community';
import type { GridVariant } from '../packages/shared-types/src';
import { Badge } from '../packages/ui-kit/src/components/Badge';
import { Text } from '../packages/ui-kit/src/components/Text';
import { EntityGridTemplate } from '../packages/ui-kit/src/components/entity-grid/EntityGridTemplate';
import { AgGridServer } from '../packages/ui-kit/src/layout/AgGridServer';

const meta: Meta = {
  title: 'UI Kit/GridSurfaceFoundations',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type GridRow = {
  id: number;
  name: string;
  status: string;
  owner: string;
  updatedAt: string;
};

const clientRows: GridRow[] = [
  { id: 1, name: 'Design Lab registry', status: 'Stable', owner: 'Platform UI', updatedAt: '2026-03-10' },
  { id: 2, name: 'Release cockpit', status: 'Shipping', owner: 'Ops', updatedAt: '2026-03-09' },
  { id: 3, name: 'Migration dashboard', status: 'Tracked', owner: 'Reporting', updatedAt: '2026-03-08' },
];

const serverRows = [
  { id: 201, name: 'Theme preset evidence', owner: 'Platform UI' },
  { id: 202, name: 'Consumer impact report', owner: 'Ops' },
  { id: 203, name: 'Wave recipe snapshot', owner: 'Reporting' },
];

const columnDefs: ColDef<GridRow>[] = [
  { field: 'name', headerName: 'Kaynak', flex: 1, minWidth: 220 },
  { field: 'status', headerName: 'Durum', width: 140 },
  { field: 'owner', headerName: 'Owner', width: 160 },
  { field: 'updatedAt', headerName: 'Guncelleme', width: 140 },
];

const createQueryClient = () => {
  const queryClient = new QueryClient();
  const variants: GridVariant[] = [
    {
      id: 'storybook-default',
      gridId: 'storybook-entity-grid',
      name: 'Varsayilan gorunum',
      isDefault: true,
      isGlobal: false,
      isGlobalDefault: false,
      isUserDefault: true,
      isUserSelected: true,
      state: {
        columnState: [],
        filterModel: null,
        advancedFilterModel: null,
        sortModel: [],
        pivotMode: false,
        quickFilterText: '',
        sideBar: null,
      },
      schemaVersion: 1,
      isCompatible: true,
      sortOrder: 1,
      createdAt: '2026-03-10T10:00:00.000Z',
      updatedAt: '2026-03-10T10:00:00.000Z',
    },
  ];
  queryClient.setQueryData(['grid-variants', 'storybook-entity-grid'], variants);
  return queryClient;
};

const StoryQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = React.useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const GridSurfaceCanvas = () => {
  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
        <div className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Grid foundations
          </Text>
          <Text as="h2" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
            AgGridServer ve EntityGridTemplate ayni data contract hattinda dogrulaniyor
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Text as="div" className="text-lg font-semibold text-text-primary">
                Server datasource
              </Text>
              <Badge tone="info">AgGridServer</Badge>
            </div>
            <Text variant="secondary" className="mt-2 block text-sm leading-6">
              Ownership ve release evidence listeleri server-side datasource kontrati ile tek primitive icinde gosterilir.
            </Text>
            <div className="mt-4 h-[360px]">
              <AgGridServer
                height={320}
                columnDefs={[
                  { field: 'id', headerName: 'ID', width: 120 },
                  { field: 'name', headerName: 'Kaynak', flex: 1 },
                  { field: 'owner', headerName: 'Owner', width: 180 },
                ]}
                getData={async () => ({ rows: serverRows, total: serverRows.length })}
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Text as="div" className="text-lg font-semibold text-text-primary">
                Entity grid template
              </Text>
              <Badge tone="success">EntityGridTemplate</Badge>
            </div>
            <Text variant="secondary" className="mt-2 block text-sm leading-6">
              Toolbar, variant secimi ve istemci tarafli listeleme ayni reusable template ustunde calisir.
            </Text>
            <div className="mt-4 h-[480px]">
              <StoryQueryProvider>
                <EntityGridTemplate<GridRow>
                  gridId="storybook-entity-grid"
                  gridSchemaVersion={1}
                  dataSourceMode="client"
                  rowData={clientRows}
                  total={clientRows.length}
                  page={1}
                  pageSize={25}
                  columnDefs={columnDefs}
                />
              </StoryQueryProvider>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const GridFoundations: Story = {
  render: () => <GridSurfaceCanvas />,
};
