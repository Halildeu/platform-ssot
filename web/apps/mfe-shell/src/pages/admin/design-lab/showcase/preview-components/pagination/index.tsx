import React from 'react';
import { DesignLabPaginationClientCompactShowcase } from './DesignLabPaginationClientCompactShowcase';
import { DesignLabPaginationClientDefaultShowcase } from './DesignLabPaginationClientDefaultShowcase';
import { DesignLabPaginationCenteredFirstLastShowcase } from './DesignLabPaginationCenteredFirstLastShowcase';
import { DesignLabPaginationCompactNoInfoShowcase } from './DesignLabPaginationCompactNoInfoShowcase';
import { DesignLabPaginationDisabledShowcase } from './DesignLabPaginationDisabledShowcase';
import { DesignLabPaginationEllipsisTightShowcase } from './DesignLabPaginationEllipsisTightShowcase';
import { DesignLabPaginationEllipsisWideShowcase } from './DesignLabPaginationEllipsisWideShowcase';
import { DesignLabPaginationGhostMobileShowcase } from './DesignLabPaginationGhostMobileShowcase';
import { DesignLabPaginationReadonlyShowcase } from './DesignLabPaginationReadonlyShowcase';
import { DesignLabPaginationRoundedOutlinedShowcase } from './DesignLabPaginationRoundedOutlinedShowcase';
import { DesignLabPaginationSimplePillShowcase } from './DesignLabPaginationSimplePillShowcase';
import { DesignLabPaginationServerDefaultShowcase } from './DesignLabPaginationServerDefaultShowcase';
import { DesignLabPaginationServerDenseShowcase } from './DesignLabPaginationServerDenseShowcase';
import { DesignLabPaginationServerNoInfoShowcase } from './DesignLabPaginationServerNoInfoShowcase';
import { DesignLabPaginationUnknownTotalStreamShowcase } from './DesignLabPaginationUnknownTotalStreamShowcase';
import {
  getPaginationVariantDescriptor,
  type PaginationVariantId,
} from '../../../../../../../../../packages/design-system/src/catalog/pagination-variant-catalog';
import type { DesignLabPaginationPreviewProps } from './paginationShared';

export type PaginationShowcaseSectionConfig = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  content: React.ReactNode;
};

const paginationPreviewMap: Record<PaginationVariantId, React.FC<DesignLabPaginationPreviewProps>> = {
  server_default: DesignLabPaginationServerDefaultShowcase,
  client_compact: DesignLabPaginationClientCompactShowcase,
  server_dense: DesignLabPaginationServerDenseShowcase,
  client_default: DesignLabPaginationClientDefaultShowcase,
  simple_pill: DesignLabPaginationSimplePillShowcase,
  rounded_outlined: DesignLabPaginationRoundedOutlinedShowcase,
  centered_first_last: DesignLabPaginationCenteredFirstLastShowcase,
  unknown_total_stream: DesignLabPaginationUnknownTotalStreamShowcase,
  ghost_mobile: DesignLabPaginationGhostMobileShowcase,
  ellipsis_tight: DesignLabPaginationEllipsisTightShowcase,
  ellipsis_wide: DesignLabPaginationEllipsisWideShowcase,
  server_no_info: DesignLabPaginationServerNoInfoShowcase,
  compact_no_info: DesignLabPaginationCompactNoInfoShowcase,
  readonly: DesignLabPaginationReadonlyShowcase,
  disabled: DesignLabPaginationDisabledShowcase,
};

const paginationSectionOrder: PaginationVariantId[] = [
  'server_default',
  'client_compact',
  'server_dense',
  'client_default',
  'simple_pill',
  'rounded_outlined',
  'centered_first_last',
  'unknown_total_stream',
  'ghost_mobile',
  'ellipsis_tight',
  'ellipsis_wide',
  'server_no_info',
  'compact_no_info',
  'readonly',
  'disabled',
];

export const buildPaginationShowcaseSections = (
  props: DesignLabPaginationPreviewProps,
): PaginationShowcaseSectionConfig[] =>
  paginationSectionOrder.map((variantId, index) => {
    const variant = getPaginationVariantDescriptor(variantId);
    const Preview = paginationPreviewMap[variantId];

    return {
      id: `pagination-${variantId.replace(/_/g, '-')}`,
      eyebrow: `Pattern ${String(index + 1).padStart(2, '0')}`,
      title: variant.name,
      description: variant.description,
      badges: variant.badges,
      content: <Preview {...props} />,
    };
  });
