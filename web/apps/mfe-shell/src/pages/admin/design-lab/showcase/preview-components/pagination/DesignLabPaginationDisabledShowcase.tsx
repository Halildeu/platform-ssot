import React from 'react';
import { Pagination, Skeleton, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

export const DesignLabPaginationDisabledShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => (
  <DesignLabPaginationScenarioFrame
    variantId="disabled"
    insight="Bu kutu ekran goruntusundeki enabled ve disabled jumper karsilastirmasina benzer; ayni kompozisyonun kilitli halini de gosterir."
  >
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text as="div" className="text-base font-semibold text-text-primary">
        Enabled vs disabled jumper
      </Text>
      <Text variant="secondary" className="mt-1 block leading-7">
        Ust satir aktif, alt satir kilitli. Boyut secici ve quick jumper artik primitive icindeki built-in alanlar olarak ayni state kontratini paylasir.
      </Text>
      <div className="mt-5 space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <Pagination
            totalItems={500}
            pageSize={10}
            page={2}
            siblingCount={1}
            mode="server"
            showPageInfo={false}
            showSizeChanger
            pageSizeOptions={[10]}
            showQuickJumper={{
              inputAriaLabel: 'Aktif hedef sayfa',
            }}
            localeText={localeText}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 opacity-55">
          <Pagination
            totalItems={500}
            pageSize={10}
            page={2}
            siblingCount={1}
            mode="server"
            access="disabled"
            accessReason="Loading transition lock"
            showPageInfo={false}
            showSizeChanger
            pageSizeOptions={[10]}
            showQuickJumper={{
              inputAriaLabel: 'Kilitli hedef sayfa',
            }}
            localeText={localeText}
          />
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
          <Text variant="secondary" className="block leading-7">
            Navigation kilitli; sorgu tamamlanmadan yeni sayfa istekleri alinmaz.
          </Text>
          <div className="mt-4 space-y-3">
            <Skeleton variant="table-row" />
            <Skeleton variant="table-row" />
          </div>
        </div>
      </div>
    </div>
  </DesignLabPaginationScenarioFrame>
);
