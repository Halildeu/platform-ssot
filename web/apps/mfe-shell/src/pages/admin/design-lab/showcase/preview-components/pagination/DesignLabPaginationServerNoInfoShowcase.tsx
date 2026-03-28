import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 160;
const PAGE_SIZE = 20;

export const DesignLabPaginationServerNoInfoShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage, pageCount } = usePaginationScene(3, TOTAL_ITEMS, PAGE_SIZE);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="server_no_info"
      insight="Simple toolbar deseni, Ant Design'in sade inline hissine benzer sekilde bilgi satirini disarida tutup yalnizca kontrolleri gosterir."
    >
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Text as="div" className="text-base font-semibold text-text-primary">
              Users toolbar footer
            </Text>
            <Text variant="secondary" className="mt-1 block leading-7">
              Page {page} / {pageCount} dis bilgi satirinda kalir; toolbar yalnizca navigasyonu tasir.
            </Text>
          </div>
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            mode="server"
            showPageInfo={false}
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
