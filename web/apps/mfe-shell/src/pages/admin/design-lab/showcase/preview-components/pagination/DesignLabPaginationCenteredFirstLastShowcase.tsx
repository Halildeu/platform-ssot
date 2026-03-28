import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 540;
const PAGE_SIZE = 15;

export const DesignLabPaginationCenteredFirstLastShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage, pageCount } = usePaginationScene(9, TOTAL_ITEMS, PAGE_SIZE);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="centered_first_last"
      insight="First-last butonlari ve daha genis pencere, desktop agirlikli raporlama ekranlarinda uzun dataset gezinimini daha hizli hale getirir."
    >
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Report console navigation
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          {`Uzun rapor akisinda sayfa ${page} / ${pageCount}. First-last aksiyonu sayesinde bas ve sona hizli sicrama yapilir.`}
        </Text>
        <div className="mt-4 border-t border-border-subtle pt-4">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            mode="server"
            align="center"
            showFirstLastButtons
            boundaryCount={2}
            siblingCount={1}
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
