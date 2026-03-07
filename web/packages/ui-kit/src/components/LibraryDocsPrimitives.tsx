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

