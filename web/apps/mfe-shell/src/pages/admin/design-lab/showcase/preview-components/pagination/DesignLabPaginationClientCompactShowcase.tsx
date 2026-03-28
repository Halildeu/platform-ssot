import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 84;
export const DesignLabPaginationClientCompactShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(2);
  const rangeStart = TOTAL_ITEMS <= 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = TOTAL_ITEMS <= 0 ? 0 : Math.min(TOTAL_ITEMS, page * pageSize);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="client_compact"
      insight="Mini varyantta da page-size secimi artik built-in primitive icinde; dar satir duzeni tek `Pagination` yuzeyinde korunur."
    >
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Mini listing footer
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          {rangeStart}-{rangeEnd} / {TOTAL_ITEMS} kayit gorunuyor. Kontroller tek satirda daha hafif gorunsun diye mini boyutta tutulur.
        </Text>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={pageSize}
            page={page}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            size="sm"
            compact
            mode="client"
            showPageInfo={false}
            showSizeChanger
            pageSizeOptions={[10, 20, 40]}
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
