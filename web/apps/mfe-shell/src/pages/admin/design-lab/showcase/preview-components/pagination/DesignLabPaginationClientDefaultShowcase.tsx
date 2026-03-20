import React from 'react';
import { Descriptions, Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 320;

export const DesignLabPaginationClientDefaultShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const [pageSize, setPageSize] = React.useState(20);
  const [page, setPage] = React.useState(1);
  const pageCount = Math.max(1, Math.ceil(TOTAL_ITEMS / pageSize));
  const rangeStart = TOTAL_ITEMS <= 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = TOTAL_ITEMS <= 0 ? 0 : Math.min(TOTAL_ITEMS, page * pageSize);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="client_default"
      insight="Bu varyant artik built-in `showSizeChanger` API'sini kullanir; pagination ve boyut secimi tek primitive kontrati icinde akar."
    >
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Inline page-size changer
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          {rangeStart}-{rangeEnd} araligi acik. Boyut secimi degistiginde toplam sayfa yeniden hesaplanir ama gorsel dil sabit kalir.
        </Text>
        <div className="mt-4 flex flex-wrap items-center gap-4 xl:justify-between">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={pageSize}
            page={page}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            mode="client"
            showPageInfo={false}
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100]}
            localeText={localeText}
          />
        </div>
        <Descriptions
          columns={3}
          density="compact"
          items={[
            { key: 'range', label: 'Range', value: `${rangeStart}-${rangeEnd}`, tone: 'info' },
            { key: 'pages', label: 'Page count', value: pageCount },
            { key: 'total', label: 'Total rows', value: TOTAL_ITEMS },
          ]}
        />
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
