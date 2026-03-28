import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 420;
export const DesignLabPaginationEllipsisTightShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(18);
  const rangeStart = TOTAL_ITEMS <= 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = TOTAL_ITEMS <= 0 ? 0 : Math.min(TOTAL_ITEMS, page * pageSize);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="ellipsis_tight"
      insight="Bu varyant artik built-in `showSizeChanger` ve `showQuickJumper` API'lerini birlikte kullanir; uzun dataset gezintisi tek primitive ile kurulur."
    >
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Inline quick jumper
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          {rangeStart}-{rangeEnd} araligi acik. Uzun datasetlerde dar ellipsis penceresi ve dogrudan atlama birlikte kullanilir.
        </Text>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={pageSize}
            page={page}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            siblingCount={1}
            mode="server"
            showPageInfo={false}
            showSizeChanger
            pageSizeOptions={[10, 20, 50]}
            showQuickJumper={{
              inputAriaLabel: 'Hedef sayfa',
            }}
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
