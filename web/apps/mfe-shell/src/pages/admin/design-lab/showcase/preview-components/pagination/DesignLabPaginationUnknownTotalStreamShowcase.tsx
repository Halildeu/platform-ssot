import React from 'react';
import { SummaryStrip, Text } from '@mfe/design-system';
import {
  TablePagination,
} from './paginationInternals';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const STREAMED_TOTAL_HINT = 9_999;

export const DesignLabPaginationUnknownTotalStreamShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const [page, setPage] = React.useState(4);
  const [pageSize, setPageSize] = React.useState(40);
  const hasNextPage = page < 6;

  return (
    <DesignLabPaginationScenarioFrame
      variantId="unknown_total_stream"
      insight="MUI table pagination count=-1 modeline yakin sekilde toplam bilinmez; kullanici sadece akan veri penceresi ve daha fazlasi oldugu bilgisiyle gezinir."
    >
      <SummaryStrip
        columns={3}
        items={[
          { key: 'cursor', label: 'Cursor mode', value: 'Streaming', note: 'Unknown total from backend', tone: 'warning' },
          { key: 'page', label: 'Page', value: page, note: 'Cursor window index' },
          { key: 'hasNext', label: 'Next page', value: hasNextPage ? 'Available' : 'Exhausted', tone: hasNextPage ? 'success' : 'info' },
        ]}
      />
      <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Event stream footer
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          Toplam event sayisi bilinmez; footer yalnizca gorunen pencereyi ve sonraki cursor akisinin varligini gosterir.
        </Text>
        <div className="mt-4">
          <TablePagination
            totalItems={STREAMED_TOTAL_HINT}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[20, 40, 80]}
            totalItemsKnown={false}
            hasNextPage={hasNextPage}
            showFirstLastButtons
            localeText={{
              rowsPerPageLabel: localeText.rowsPerPageLabel,
              rangeLabel: localeText.rangeLabel,
              unknownTotalLabel: (start, end) => `${start}-${end} / daha fazlasi`,
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
