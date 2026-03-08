import React from 'react';
import { Empty } from './Empty';
import { List, type ListItem } from './List';
import { PageHeader } from '../layout/PageHeader';
import { FilterBar } from '../layout/FilterBar';
import { SummaryStrip, type SummaryStripItem } from '../layout/SummaryStrip';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

export interface SearchFilterListingProps extends AccessControlledProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  onReset?: () => void;
  onSaveView?: () => void;
  filterExtra?: React.ReactNode;
  summaryItems?: SummaryStripItem[];
  listTitle?: React.ReactNode;
  listDescription?: React.ReactNode;
  items?: ListItem[];
  emptyStateLabel?: React.ReactNode;
  results?: React.ReactNode;
  className?: string;
}

export const SearchFilterListing: React.FC<SearchFilterListingProps> = ({
  eyebrow,
  title,
  description,
  meta,
  status,
  actions,
  filters,
  onReset,
  onSaveView,
  filterExtra,
  summaryItems = [],
  listTitle = 'Results',
  listDescription = 'Search, filter ve result shell ayni recipe altinda toplanir.',
  items = [],
  emptyStateLabel = 'Eslesen sonuc bulunamadi.',
  results,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  return (
    <section
      className={`space-y-4 ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="search-filter-listing"
      title={accessReason}
    >
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        meta={meta}
        status={status}
        actions={actions}
        access={access}
        accessReason={accessReason}
      />

      {filters || onReset || onSaveView || filterExtra ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <FilterBar
            onReset={onReset}
            onSaveView={onSaveView}
            extra={filterExtra}
            access={access}
            accessReason={accessReason}
          >
            {filters}
          </FilterBar>
        </div>
      ) : null}

      {summaryItems.length ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <SummaryStrip items={summaryItems} columns={3} access={access} accessReason={accessReason} />
        </div>
      ) : null}

      <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
        {results ?? (
          items.length ? (
            <List
              title={listTitle}
              description={listDescription}
              items={items}
              access={access}
              accessReason={accessReason}
            />
          ) : (
            <Empty description={typeof emptyStateLabel === 'string' ? emptyStateLabel : 'Sonuc bulunamadi'} />
          )
        )}
      </div>
    </section>
  );
};

export default SearchFilterListing;
