import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 60;
const PAGE_SIZE = 6;

export const DesignLabPaginationCompactNoInfoShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage, rangeStart } = usePaginationScene(5, TOTAL_ITEMS, PAGE_SIZE);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="compact_no_info"
      insight="Bu varyant mini ve simple yaklasimini kart footer'ina tasir; gereksiz metrikleri saklayip yalnizca navigasyonu birakir."
    >
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Insight card {rangeStart + index}
              </Text>
              <Text variant="secondary" className="mt-2 block text-sm leading-6">
                Minimal footer kullanan kart akisi.
              </Text>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end border-t border-border-subtle pt-4">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            size="sm"
            compact
            mode="client"
            showPageInfo={false}
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
