import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 480;
const PAGE_SIZE = 20;

export const DesignLabPaginationSimplePillShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage } = usePaginationScene(8, TOTAL_ITEMS, PAGE_SIZE);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="simple_pill"
      insight="Ant Design simple mode mantigini daha sakin pill yuzeyiyle birlestirir; mobil toolbar ve narrow shell use-case'leri icin iyi bir taban verir."
    >
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Minimal command footer
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          Sayfa sayisi buyuk olsa bile yalniz prev-next ve basit durum gostergesi gorunur; odak dagitmadan hizli gecis verir.
        </Text>
        <div className="mt-4 border-t border-border-subtle pt-4">
          <Pagination
            totalItems={TOTAL_ITEMS}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
            mode="server"
            simple
            shape="pill"
            appearance="ghost"
            align="center"
            localeText={localeText}
          />
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
