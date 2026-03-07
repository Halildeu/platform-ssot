import React from 'react';
import clsx from 'clsx';
import { Text } from './Text';

export type LibraryDetailTabOption = {
  id: string;
  label: string;
  description?: string;
};

export type LibrarySectionBadgeProps = {
  label: string;
  className?: string;
};

export const LibrarySectionBadge: React.FC<LibrarySectionBadgeProps> = ({ label, className }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-text-secondary',
      className,
    )}
  >
    {label}
  </span>
);

export type LibraryDetailLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export const LibraryDetailLabel: React.FC<LibraryDetailLabelProps> = ({ children, className }) => (
  <Text
    as="div"
    variant="secondary"
    className={clsx('text-[11px] font-semibold uppercase tracking-[0.18em]', className)}
  >
    {children}
  </Text>
);

export type LibraryPreviewPanelProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const LibraryPreviewPanel: React.FC<LibraryPreviewPanelProps> = ({ title, children, className }) => (
  <div className={clsx('rounded-2xl border border-border-subtle bg-surface-default p-4', className)}>
    <LibraryDetailLabel className="text-xs">{title}</LibraryDetailLabel>
    <div className="mt-3">{children}</div>
  </div>
);

export type LibraryDocsSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const LibraryDocsSection = React.forwardRef<HTMLElement, LibraryDocsSectionProps>(function LibraryDocsSection(
  { id, eyebrow, title, description, actions, children, className },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={clsx('scroll-mt-28 rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm', className)}
    >
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          {eyebrow ? <LibraryDetailLabel>{eyebrow}</LibraryDetailLabel> : null}
          <Text as="h2" className="mt-2 text-[1.85rem] font-semibold tracking-[-0.03em] text-text-primary">
            {title}
          </Text>
          {description ? (
            <Text variant="secondary" className="mt-2 block max-w-3xl text-sm leading-7">
              {description}
            </Text>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
});

export type LibraryShowcaseCardProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  badges?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const LibraryShowcaseCard: React.FC<LibraryShowcaseCardProps> = ({
  eyebrow,
  title,
  description,
  badges,
  children,
  className,
}) => (
  <article className={clsx('rounded-[26px] border border-border-subtle bg-surface-panel p-5 shadow-sm', className)}>
    <div className="flex flex-col gap-3 border-b border-border-subtle pb-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        {eyebrow ? <LibraryDetailLabel>{eyebrow}</LibraryDetailLabel> : null}
        <Text as="h3" className="mt-2 text-xl font-semibold text-text-primary">
          {title}
        </Text>
        {description ? (
          <Text variant="secondary" className="mt-2 block max-w-3xl text-sm leading-7">
            {description}
          </Text>
        ) : null}
      </div>
      {badges ? <div className="flex shrink-0 flex-wrap gap-2">{badges}</div> : null}
    </div>
    <div className="mt-5">{children}</div>
  </article>
);

export type LibraryMetricCardProps = {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
};

export const LibraryMetricCard: React.FC<LibraryMetricCardProps> = ({ label, value, note, className }) => (
  <div className={clsx('rounded-2xl border border-border-subtle bg-surface-panel p-4', className)}>
    <LibraryDetailLabel>{label}</LibraryDetailLabel>
    <Text as="div" className="mt-2 text-base font-semibold text-text-primary">
      {value}
    </Text>
    {note ? (
      <Text variant="secondary" className="mt-1 block text-xs leading-5">
        {note}
      </Text>
    ) : null}
  </div>
);

export type LibraryDetailTabsProps = {
  tabs: LibraryDetailTabOption[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  testIdPrefix?: string;
  className?: string;
};

export const LibraryDetailTabs: React.FC<LibraryDetailTabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  testIdPrefix,
  className,
}) => (
  <section
    className={clsx(
      'sticky top-4 z-10 rounded-[24px] border border-border-subtle bg-surface-default/95 p-2 shadow-sm backdrop-blur',
      className,
    )}
  >
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = activeTabId === tab.id;
        return (
          <button
            key={tab.id}
            data-testid={testIdPrefix ? `${testIdPrefix}-tab-${tab.id}` : undefined}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'rounded-2xl px-4 py-2.5 text-sm font-medium transition',
              active ? 'bg-surface-panel text-text-primary shadow-sm' : 'text-text-secondary hover:bg-surface-panel',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  </section>
);

export type LibraryOutlineItem = {
  id: string;
  label: string;
};

export type LibraryOutlinePanelProps = {
  title?: string;
  items: LibraryOutlineItem[];
  activeItemId: string;
  onItemSelect: (itemId: string) => void;
  className?: string;
};

export const LibraryOutlinePanel: React.FC<LibraryOutlinePanelProps> = ({
  title = 'Bu sayfada',
  items,
  activeItemId,
  onItemSelect,
  className,
}) => (
  <section className={clsx('rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm', className)}>
    <LibraryDetailLabel>{title}</LibraryDetailLabel>
    <div className="mt-3 space-y-1.5">
      {items.map((item) => {
        const active = activeItemId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemSelect(item.id)}
            className={clsx(
              'flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition',
              active ? 'bg-surface-panel shadow-sm' : 'hover:bg-surface-panel',
            )}
          >
            <span className={clsx('text-sm', active ? 'font-semibold text-text-primary' : 'text-text-secondary')}>
              {item.label}
            </span>
            {active ? <span className="h-2.5 w-2.5 rounded-full bg-action-primary" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  </section>
);

export type LibraryPanelStatItem = {
  label: string;
  value: React.ReactNode;
};

export type LibraryStatsPanelProps = {
  title?: string;
  items: LibraryPanelStatItem[];
  className?: string;
};

export const LibraryStatsPanel: React.FC<LibraryStatsPanelProps> = ({
  title = 'Library Stats',
  items,
  className,
}) => (
  <section className={clsx('rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm', className)}>
    <LibraryDetailLabel>{title}</LibraryDetailLabel>
    <div className="mt-3 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
          <LibraryDetailLabel>{item.label}</LibraryDetailLabel>
          <div className="mt-2 text-xl font-semibold text-text-primary">{item.value}</div>
        </div>
      ))}
    </div>
  </section>
);

export type LibraryMetadataItem = {
  label: string;
  value: React.ReactNode;
};

export type LibraryMetadataPanelProps = {
  title?: string;
  items: LibraryMetadataItem[];
  className?: string;
};

export const LibraryMetadataPanel: React.FC<LibraryMetadataPanelProps> = ({
  title = 'Metadata',
  items,
  className,
}) => (
  <section className={clsx('rounded-[24px] border border-border-subtle bg-surface-default p-4 shadow-sm', className)}>
    <LibraryDetailLabel>{title}</LibraryDetailLabel>
    <div className="mt-3 space-y-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
          <LibraryDetailLabel>{item.label}</LibraryDetailLabel>
          <div className="mt-2">{item.value}</div>
        </div>
      ))}
    </div>
  </section>
);
