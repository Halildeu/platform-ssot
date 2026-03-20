import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Pagination } from '../packages/design-system/src/components/Pagination';
import { TablePagination } from '../packages/design-system/src/components/TablePagination';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof Pagination> = {
  title: 'UI Kit/Pagination',
  component: Pagination,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const BuiltInControls: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Built-in size changer and quick jumper
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          Pagination artik size changer ve quick jumper alanlarini dogrudan primitive icinde tasiyor. Bu sayede Design Lab ve urun ekranlari ayni state modelini recipe disina cikmadan tuketebiliyor.
        </Text>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Pagination
            totalItems={420}
            defaultPage={8}
            defaultPageSize={20}
            mode="server"
            showPageInfo={false}
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100]}
            showQuickJumper={{
              inputAriaLabel: 'Hedef sayfa',
            }}
          />
        </div>
      </div>
    </div>
  ),
};

export const RouterFirst: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Router-first page items
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          `getItemLinkProps` ile page itemlari ve prev-next kontrolleri button yerine link olarak render edilebilir. Bu sayfa-durumu ve SEO odakli listelerde daha canonical bir kullanim verir.
        </Text>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Pagination
            totalItems={240}
            pageSize={20}
            page={4}
            mode="server"
            getItemLinkProps={({ page }) => (page ? { href: `/catalog?page=${page}` } : undefined)}
          />
        </div>
      </div>
    </div>
  ),
};

export const UnknownTotalFooter: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Unknown total table footer
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          TablePagination hala ayri footer primitive olarak korunuyor; fakat actions override ve unknown-total semantics ile daha extension-friendly hale geldi.
        </Text>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <TablePagination
            totalItems={160}
            page={3}
            pageSize={40}
            totalItemsKnown={false}
            hasNextPage
            showFirstLastButtons
          />
        </div>
      </div>
    </div>
  ),
};
