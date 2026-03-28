import React from 'react';
import { Descriptions, Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 420;
const PAGE_SIZE = 10;

export const DesignLabPaginationEllipsisWideShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage, pageCount, rangeStart, rangeEnd } = usePaginationScene(21, TOTAL_ITEMS, PAGE_SIZE);
  const windowStart = Math.max(1, page - 2);
  const windowEnd = Math.min(pageCount, page + 2);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="ellipsis_wide"
      insight="Bu varyant Ant Design more-pages davranisina benzer sekilde mevcut sayfanin cevresinde daha genis bir pencere ve ellipsis dengesi sunar."
    >
      <Descriptions
        columns={3}
        density="compact"
        items={[
          { key: 'range', label: 'Visible records', value: `${rangeStart}-${rangeEnd}`, tone: 'info' },
          { key: 'window', label: 'Context window', value: `${windowStart}-${windowEnd}` },
          { key: 'pages', label: 'Total pages', value: pageCount },
        ]}
      />
      <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Analytics result navigator
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          Mevcut sayfanin iki yaninda daha fazla baglam tutar; kullanici onceki ve sonraki bloklari daha rahat okur.
        </Text>
        <div className="mt-4">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            siblingCount={2}
            mode="server"
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
