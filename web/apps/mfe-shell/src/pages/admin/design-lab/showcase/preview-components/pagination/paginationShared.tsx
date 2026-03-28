import React from 'react';
import { Text } from '@mfe/design-system';
import {
  clampPaginationPage,
  getPaginationPageCount,
  getPaginationPageRange,
  usePaginationState,
} from './paginationInternals';
import {
  getPaginationVariantDescriptor,
  type PaginationVariantId,
} from '../../../../../../../../../packages/design-system/src/catalog/pagination-variant-catalog';

export type DesignLabPaginationLocaleText = {
  navigationLabel: string;
  previousButtonLabel: string;
  nextButtonLabel: string;
  previousPageAriaLabel: string;
  nextPageAriaLabel: string;
  pageAriaLabel: (page: number) => string;
  pageIndicatorLabel: (currentPage: number, pageCount: number) => string;
  simpleIndicatorLabel?: (currentPage: number, pageCount: number) => string;
  totalItemsLabel: (count: number) => string;
  modeLabel: (mode: 'client' | 'server') => string;
  rowsPerPageLabel?: string;
  rangeLabel?: (start: number, end: number, totalItems: number) => string;
  firstButtonLabel?: string;
  lastButtonLabel?: string;
};

export type DesignLabPaginationPreviewProps = {
  localeText: DesignLabPaginationLocaleText;
};

type DesignLabPaginationScenarioFrameProps = {
  variantId: PaginationVariantId;
  children: React.ReactNode;
  insight?: React.ReactNode;
};

const DesignLabPaginationMetaBlock: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
    <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
      {label}
    </Text>
    <div className="mt-3">{children}</div>
  </div>
);

export const getPaginationWindow = (currentPage: number, pageSize: number, totalItems: number) => {
  const pageCount = getPaginationPageCount(totalItems, pageSize);
  const safePage = clampPaginationPage(currentPage, pageCount);
  const pageRange = getPaginationPageRange(safePage, totalItems, pageSize);

  return {
    pageCount,
    page: safePage,
    rangeStart: pageRange.start,
    rangeEnd: pageRange.end,
  };
};

export const usePaginationScene = (initialPage: number, totalItems: number, pageSize: number) => {
  const paginationState = usePaginationState({
    totalItems,
    defaultPage: initialPage,
    pageSize,
    resetPageOnPageSizeChange: false,
  });

  return {
    page: paginationState.page,
    pageCount: paginationState.totalPages,
    rangeStart: paginationState.pageRange.start,
    rangeEnd: paginationState.pageRange.end,
    setPage: paginationState.setPage,
  };
};

export const DesignLabPaginationScenarioFrame: React.FC<DesignLabPaginationScenarioFrameProps> = ({
  variantId,
  children,
  insight,
}) => {
  const variant = getPaginationVariantDescriptor(variantId);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
      <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-5 shadow-xs">
        {children}
      </div>
      <div className="flex flex-col gap-4">
        <DesignLabPaginationMetaBlock label="Pattern badges">
          <div className="flex flex-wrap gap-2">
            {variant.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary"
              >
                {badge}
              </span>
            ))}
          </div>
        </DesignLabPaginationMetaBlock>
        <DesignLabPaginationMetaBlock label="Preview focus">
          <Text preset="body" className="leading-7 text-text-primary">
            {variant.previewFocus.join(' | ')}
          </Text>
        </DesignLabPaginationMetaBlock>
        <DesignLabPaginationMetaBlock label="Regression focus">
          <Text preset="body" className="leading-7 text-text-primary">
            {variant.regressionFocus.join(' | ')}
          </Text>
        </DesignLabPaginationMetaBlock>
        {insight ? (
          <DesignLabPaginationMetaBlock label="Usage note">
            <Text preset="body" className="leading-7 text-text-primary">
              {insight as string}
            </Text>
          </DesignLabPaginationMetaBlock>
        ) : null}
      </div>
    </div>
  );
};
