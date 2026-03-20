import React from 'react';
import { Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  usePaginationScene,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

const TOTAL_ITEMS = 96;
const PAGE_SIZE = 8;

export const DesignLabPaginationGhostMobileShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => {
  const { page, setPage } = usePaginationScene(4, TOTAL_ITEMS, PAGE_SIZE);

  return (
    <DesignLabPaginationScenarioFrame
      variantId="ghost_mobile"
      insight="Dar ekran veya alt sabit toolbar gibi yuzeylerde ghost + pill kombinasyonu dikkat dagitmayan ama dokunmatik hedefleri koruyan bir model verir."
    >
      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-4">
        <Text as="div" className="text-base font-semibold text-text-primary">
          Mobile footer rail
        </Text>
        <Text variant="secondary" className="mt-1 block leading-7">
          Minimal metin, pill hit target ve ghost gorunum; mobil drawer veya alt toolbar kullanimina daha uygun.
        </Text>
        <div className="mt-4 flex justify-center">
          <div className="w-full max-w-[360px] rounded-[24px] border border-border-subtle bg-surface-canvas p-3">
            <Pagination
              totalItems={TOTAL_ITEMS}
              pageSize={PAGE_SIZE}
              page={page}
              onPageChange={setPage}
              mode="client"
              size="sm"
              compact
              showPageInfo={false}
              align="center"
              appearance="ghost"
              shape="pill"
              localeText={localeText}
            />
          </div>
        </div>
      </div>
    </DesignLabPaginationScenarioFrame>
  );
};
