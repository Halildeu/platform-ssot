import React from 'react';
import { Descriptions, type DescriptionsItem } from './Descriptions';
import { JsonViewer } from './JsonViewer';
import { PageHeader } from '../layout/PageHeader';
import { SummaryStrip, type SummaryStripItem } from '../layout/SummaryStrip';
import { EntitySummaryBlock, type EntitySummaryBlockProps } from '../layout/EntitySummaryBlock';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

export interface DetailSummaryProps extends AccessControlledProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  summaryItems?: SummaryStripItem[];
  entity: EntitySummaryBlockProps;
  detailItems?: DescriptionsItem[];
  detailTitle?: React.ReactNode;
  detailDescription?: React.ReactNode;
  jsonValue?: unknown;
  jsonTitle?: React.ReactNode;
  jsonDescription?: React.ReactNode;
  className?: string;
}

export const DetailSummary: React.FC<DetailSummaryProps> = ({
  eyebrow,
  title,
  description,
  meta,
  status,
  actions,
  aside,
  summaryItems = [],
  entity,
  detailItems = [],
  detailTitle = 'Detail contract',
  detailDescription = 'Summary, entity context ve machine-readable payload ayni recipe altinda tutulur.',
  jsonValue,
  jsonTitle = 'JSON payload',
  jsonDescription = 'Denetim, debug ve support akislarinda ayni veri gorunumu tekrar kullanilir.',
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
      data-component="detail-summary"
      title={accessReason}
    >
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        meta={meta}
        status={status}
        actions={actions}
        aside={aside}
        access={access}
        accessReason={accessReason}
      />

      {summaryItems.length ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
          <SummaryStrip items={summaryItems} columns={4} access={access} accessReason={accessReason} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <EntitySummaryBlock {...entity} access={access} accessReason={accessReason} />

        <div className="space-y-4">
          {detailItems.length ? (
            <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
              <Descriptions
                title={detailTitle}
                description={detailDescription}
                items={detailItems}
                columns={2}
                access={access}
                accessReason={accessReason}
              />
            </div>
          ) : null}

          {typeof jsonValue !== 'undefined' ? (
            <div className="rounded-[28px] border border-border-subtle bg-surface-default p-5 shadow-sm">
              <JsonViewer
                value={jsonValue}
                title={jsonTitle}
                description={jsonDescription}
                access={access}
                accessReason={accessReason}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DetailSummary;
