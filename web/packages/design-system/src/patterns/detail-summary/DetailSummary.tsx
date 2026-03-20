import React from "react";
import { cn } from "../../utils/cn";
import {
  Descriptions,
  type DescriptionsItem,
} from "../../components/descriptions/Descriptions";
import { PageHeader } from "../page-header/PageHeader";
import {
  SummaryStrip,
  type SummaryStripItem,
} from "../summary-strip/SummaryStrip";
import {
  EntitySummaryBlock,
  type EntitySummaryBlockProps,
} from "../entity-summary-block/EntitySummaryBlock";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  DetailSummary — Full detail page combining header, summary,       */
/*  entity block, descriptions and optional JSON viewer               */
/* ------------------------------------------------------------------ */

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

const detailSummaryPanelClassName =
  "relative overflow-hidden rounded-[28px] border border-[var(--border-subtle)]/80 bg-[var(--surface-card,var(--surface-default))] p-5 shadow-[0_22px_48px_-34px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--surface-card,var(--surface-default))] before:to-transparent";

/* ---- Inline JSON viewer (no external dependency) ---- */

interface InlineJsonViewerProps {
  value: unknown;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const InlineJsonViewer: React.FC<InlineJsonViewerProps> = ({
  value,
  title,
  description,
}) => (
  <div>
    {(title || description) && (
      <div className="mb-3">
        {title && (
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </h4>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>
    )}
    <pre className="overflow-auto rounded-lg bg-[var(--surface-muted)] p-4 text-xs leading-relaxed text-[var(--text-primary)]">
      {JSON.stringify(value, null, 2)}
    </pre>
  </div>
);

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
  detailTitle = "Detail contract",
  detailDescription = "Summary, entity context ve machine-readable payload ayni recipe altinda tutulur.",
  jsonValue,
  jsonTitle = "JSON payload",
  jsonDescription = "Denetim, debug ve support akislarinda ayni veri gorunumu tekrar kullanilir.",
  className = "",
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  /* Map ui-kit PageHeader props to design-system PageHeader props */
  const headerExtra =
    meta || status ? (
      <div className="flex items-center gap-3">
        {status}
        {meta}
      </div>
    ) : undefined;

  return (
    <section
      className={cn("space-y-4", className)}
      data-access-state={accessState.state}
      data-component="detail-summary"
      data-surface-appearance="premium"
      title={accessReason}
    >
      <PageHeader
        breadcrumb={eyebrow}
        title={title}
        subtitle={description}
        extra={
          headerExtra || aside ? (
            <div className="flex items-center justify-between gap-3">
              {headerExtra}
              {aside}
            </div>
          ) : undefined
        }
        actions={actions}
      />

      {summaryItems.length ? (
        <div className={detailSummaryPanelClassName}>
          <SummaryStrip
            items={summaryItems}
            columns={4}
          />
        </div>
      ) : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))" }}>
        <EntitySummaryBlock
          className="min-w-0"
          {...entity}
          access={access}
          accessReason={accessReason}
        />

        <div className="min-w-0 space-y-4">
          {detailItems.length ? (
            <div className={detailSummaryPanelClassName}>
              <Descriptions
                title={detailTitle}
                description={detailDescription}
                items={detailItems}
                columns={2}
              />
            </div>
          ) : null}

          {typeof jsonValue !== "undefined" ? (
            <div className={detailSummaryPanelClassName}>
              <InlineJsonViewer
                value={jsonValue}
                title={jsonTitle}
                description={jsonDescription}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

DetailSummary.displayName = 'DetailSummary';

export default DetailSummary;
