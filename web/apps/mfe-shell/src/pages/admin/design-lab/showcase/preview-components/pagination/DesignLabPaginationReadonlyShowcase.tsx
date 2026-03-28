import React from 'react';
import { Descriptions, Pagination, Text } from '@mfe/design-system';
import {
  DesignLabPaginationScenarioFrame,
  type DesignLabPaginationPreviewProps,
} from './paginationShared';

export const DesignLabPaginationReadonlyShowcase: React.FC<DesignLabPaginationPreviewProps> = ({
  localeText,
}) => (
  <DesignLabPaginationScenarioFrame
    variantId="readonly"
    insight="Readonly durumunda mevcut sayfa bilgisi korunur; ancak kontrol yuzeyi governance snapshot mantigi geregi degismez."
  >
    <Descriptions
      columns={2}
      density="compact"
      items={[
        { key: 'state', label: 'State', value: 'Read-only snapshot', tone: 'warning' },
        { key: 'reason', label: 'Reason', value: 'Evidence window is locked' },
      ]}
    />
    <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text as="div" className="text-base font-semibold text-text-primary">
        Governance evidence browser
      </Text>
      <Text variant="secondary" className="mt-1 block leading-7">
        Mevcut sayfa gosterilir fakat ileri/geri ve sayfa numaralari bilincli olarak pasiflestirilir.
      </Text>
      <div className="mt-4">
        <Pagination
          totalItems={140}
          pageSize={14}
          page={3}
          mode="server"
          access="readonly"
          accessReason="Readonly governance snapshot"
          localeText={localeText}
        />
      </div>
    </div>
  </DesignLabPaginationScenarioFrame>
);
