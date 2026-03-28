import React from 'react';
import { SummaryStrip, Text } from '@mfe/design-system';
import {
  TablePagination,
  usePaginationState,
} from './paginationInternals';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 248;
const PAGE_SIZE = 20;

export const DesignLabPaginationServerDefaultShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const pagination = usePaginationState({
    totalItems: TOTAL_ITEMS,
    defaultPage: 6,
    defaultPageSize: PAGE_SIZE,
  });

  return (
    <DesignLabPaginationScenarioFrame
      variantId="server_default"
      insight="Bu varyant yalniz demo degil; `TablePagination` gercek reusable footer olarak paket icinde export ediliyor ve tablo/grid ekranlarinda dogrudan kullanilabiliyor."
    >
      <SummaryStrip
        columns={4}
        items={[
          { key: 'range', label: 'Showing', value: `${pagination.pageRange.start}-${pagination.pageRange.end}`, note: 'Visible record window', tone: 'info' },
          { key: 'total', label: 'Total', value: TOTAL_ITEMS, note: 'Server sourced rows' },
          { key: 'pages', label: 'Pages', value: pagination.totalPages, note: 'Calculated from page size' },
          { key: 'latency', label: 'Latency', value: '180ms', note: 'Last fetch snapshot', tone: 'success' },
        ]}
      />
      <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Release candidate users
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          Server footer toplam pencereyi gorunur tutar; paging degisince sadece veri istegi ve alt toolbar senkronize olur.
        </Text>
        <div className="mt-4">
          <TablePagination
            totalItems={TOTAL_ITEMS}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            pageSizeOptions={[10, 20, 50]}
            localeText={{
              rowsPerPageLabel: localeText.rowsPerPageLabel,
              rangeLabel: localeText.rangeLabel,
              previousButtonLabel: localeText.previousButtonLabel,
              nextButtonLabel: localeText.nextButtonLabel,
              firstButtonLabel: localeText.firstButtonLabel,
              lastButtonLabel: localeText.lastButtonLabel,
            }}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
