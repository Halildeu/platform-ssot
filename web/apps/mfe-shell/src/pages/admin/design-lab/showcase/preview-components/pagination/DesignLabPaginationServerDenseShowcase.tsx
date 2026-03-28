import React from 'react';
import { Descriptions, IconButton, Text } from '@mfe/design-system';
import {
  PaginationStateProvider,
  usePaginationContext,
} from './paginationInternals';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 180;
const PAGE_SIZE = 15;

const DenseSideRailController: React.FC<{
  localeText: DesignLabPaginationPreviewProps['localeText'];
}> = ({ localeText }) => {
  const pagination = usePaginationContext();

  return (
    <div className="max-w-sm rounded-[28px] border border-border-subtle bg-surface-default p-4">
      <Text
        as="div"
        preset="body-sm"
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary"
      >
        Context controller
      </Text>
      <Text as="div" preset="body-sm" className="mt-2 text-lg font-semibold text-text-primary">
        Headless navigation rail
      </Text>
      <Descriptions
        columns={1}
        density="compact"
        items={[
          {
            key: 'window',
            label: 'Visible rows',
            value: `${pagination.pageRange.start}-${pagination.pageRange.end}`,
            tone: 'info',
          },
          { key: 'pages', label: 'Total pages', value: pagination.totalPages },
          { key: 'page', label: 'Current page', value: pagination.page },
        ]}
      />
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <div className="flex items-center gap-2">
          <IconButton
            icon={<span aria-hidden="true">«</span>}
            label={localeText.firstButtonLabel ?? 'First page'}
            size="sm"
            variant="ghost"
            onClick={() => pagination.goToFirstPage()}
            disabled={!pagination.canGoToPrevPage}
          />
          <IconButton
            icon={<span aria-hidden="true">‹</span>}
            label={localeText.previousButtonLabel}
            size="sm"
            variant="ghost"
            onClick={() => pagination.goToPrevPage()}
            disabled={!pagination.canGoToPrevPage}
          />
        </div>
        <Text className="text-center text-text-primary">
          {localeText.pageIndicatorLabel(pagination.page, pagination.totalPages)}
        </Text>
        <div className="flex items-center gap-2">
          <IconButton
            icon={<span aria-hidden="true">›</span>}
            label={localeText.nextButtonLabel}
            size="sm"
            variant="ghost"
            onClick={() => pagination.goToNextPage()}
            disabled={!pagination.canGoToNextPage}
          />
          <IconButton
            icon={<span aria-hidden="true">»</span>}
            label={localeText.lastButtonLabel ?? 'Last page'}
            size="sm"
            variant="ghost"
            onClick={() => pagination.goToLastPage()}
            disabled={!pagination.canGoToNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export const DesignLabPaginationServerDenseShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => (
  <DesignLabPaginationScenarioFrame
    variantId="server_dense"
    insight="Buradaki box gercek `PaginationContext/usePaginationContext` desenini kullaniyor; sayfa durumu disari acildigi icin rail, toolbar veya custom footer'larda ayni kaynaktan kontrol kurulabiliyor."
  >
    <PaginationStateProvider totalItems={TOTAL_ITEMS} defaultPage={4} defaultPageSize={PAGE_SIZE}>
      <DenseSideRailController localeText={localeText} />
    </PaginationStateProvider>
  </DesignLabPaginationScenarioFrame>
);
