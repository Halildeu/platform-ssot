import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import TablePagination, {
  type TablePaginationActionsProps,
} from '../packages/design-system/src/components/TablePagination';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof TablePagination> = {
  title: 'UI Kit/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof TablePagination>;

export const UnknownTotalAuditFeed: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <TablePagination
          totalItems={60}
          page={3}
          pageSize={20}
          totalItemsKnown={false}
          hasNextPage
          showFirstLastButtons
          localeText={{
            rowsPerPageLabel: 'Satir',
            unknownTotalLabel: (start, end, page, pageSize) => `Akis ${start}-${end} · Sayfa ${page} · ${pageSize}/sayfa`,
          }}
        />
        <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            Server-side feed veya stream tabanli gridlerde toplam kayit bilinmese bile footer kontrolu bozulmadan devam eder.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const CustomActionsFooter: Story = {
  render: () => {
    const CustomActions: React.FC<TablePaginationActionsProps> = ({
      page,
      onPrevPage,
      onNextPage,
      className,
    }) => (
      <div className={className}>
        <button type="button" onClick={() => onPrevPage()} className="rounded-full border border-border-subtle px-3 py-1.5 text-xs">
          Geri
        </button>
        <span className="rounded-full border border-border-subtle px-3 py-1.5 text-xs">Sayfa {page}</span>
        <button type="button" onClick={() => onNextPage()} className="rounded-full border border-border-subtle px-3 py-1.5 text-xs">
          Ileri
        </button>
      </div>
    );

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <TablePagination
            totalItems={120}
            defaultPage={2}
            defaultPageSize={20}
            ActionsComponent={CustomActions}
            slotProps={{
              actions: {
                className: 'flex items-center gap-2 rounded-full border border-border-subtle/70 bg-white/74 px-2 py-1 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.2)]',
              },
            }}
          />
          <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-6">
            <Text variant="secondary">
              TablePagination artik footer aksiyon grubunu tam override ederek farkli tablo recipe’lerine uyum saglayabiliyor.
            </Text>
          </div>
        </div>
      </div>
    );
  },
};

export const RichPageSizePolicy: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <TablePagination
          totalItems={240}
          defaultPage={1}
          defaultPageSize={20}
          pageSizeOptions={[
            { value: 10, label: '10 satir' },
            { value: 20, label: '20 satir' },
            { value: 50, label: '50 satir' },
            { value: 999, label: 'Tum kayitlar', disabled: true },
          ]}
          showFirstLastButtons
          localeText={{
            rowsPerPageLabel: 'Satir yogunlugu',
          }}
        />
        <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            Rich page size option modeli, buyuk gridlerde policy tabanli secenekler ve disabled mass-export limitleri icin daha net bir footer dili saglar.
          </Text>
        </div>
      </div>
    </div>
  ),
};
