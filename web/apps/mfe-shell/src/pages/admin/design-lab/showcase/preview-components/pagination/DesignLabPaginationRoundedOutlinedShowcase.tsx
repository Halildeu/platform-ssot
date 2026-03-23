import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 220;
const PAGE_SIZE = 10;

export const DesignLabPaginationRoundedOutlinedShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage } = usePaginationScene(7, TOTAL_ITEMS, PAGE_SIZE);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="rounded_outlined"
      insight="MUI benzeri outlined + rounded-sm gorunumu, dashboard ve filter-toolbar alanlarinda daha hafif ama hala belirgin bir sayfalama dili verir."
    >
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Text as="div" className="text-base font-semibold text-text-primary">
              Balanced dashboard pager
            </Text>
            <Text variant="secondary" className="mt-1 block leading-7">
              Outlined sayfa chip'leri merkezde toplanir; aktif sayfa vurgu alir ama toolbar genel olarak sakin kalir.
            </Text>
          </div>
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            mode="client"
            align="center"
            appearance="outline"
            shape="rounded"
            boundaryCount={2}
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
