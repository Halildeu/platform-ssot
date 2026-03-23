import React from 'react';
import clsx from 'clsx';
import { Text } from '../primitives/text';
import { CodeBlock } from './CodeBlock';
import {
  DetailSectionTabs,
  type DetailSectionTabItem,
  type DetailSectionTabsProps,
} from '../components/detail-section-tabs';
import {
  NavigationRail,
  createNavigationDestinationItems,
} from '../components/navigation-rail';

const libraryElevatedSurfaceClass =
  'relative overflow-hidden border border-border-subtle bg-surface-default ring-1 ring-[var(--border-subtle)]/20 shadow-[0_24px_56px_-30px_var(--shadow-color,rgba(24,18,68,0.32))]';

const libraryPanelSurfaceClass =
  'relative overflow-hidden border border-border-subtle bg-surface-panel ring-1 ring-[var(--border-subtle)]/18 shadow-[0_18px_42px_-28px_var(--shadow-color,rgba(24,18,68,0.24))]';

const LibrarySurfaceAccent: React.FC<{
  compact?: boolean;
}> = ({ compact = false }) => (
  <>
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-x-5 top-0 rounded-b-[32px] bg-gradient-to-b from-[var(--surface-card)] via-[var(--surface-card)] to-transparent',
        compact ? 'h-12 opacity-80' : 'h-16 opacity-90',
      )}
    />
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute -right-8 top-4 rounded-full bg-[var(--surface-card)] blur-3xl',
        compact ? 'h-16 w-16' : 'h-24 w-24',
      )}
    />
  </>
);

export type LibraryDetailTabOption = DetailSectionTabItem;

export type LibrarySectionBadgeProps = {
  label: string;
  className?: string;
};

export const LibrarySectionBadge: React.FC<LibrarySectionBadgeProps> = ({ label, className }) => (
  <span
    className={clsx(
      'inline-flex min-h-[28px] items-center rounded-full border border-[var(--border-subtle)]/20 bg-[var(--surface-card)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary shadow-[0_12px_24px_-20px_var(--shadow-color,rgba(24,18,68,0.34))] backdrop-blur-sm',
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
    className={clsx('text-[10px] font-semibold uppercase tracking-[0.22em]', className)}
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
  <div className={clsx(libraryPanelSurfaceClass, 'rounded-[24px] p-4', className)}>
    <LibrarySurfaceAccent compact />
    <div className="relative z-[1]">
      <LibraryDetailLabel className="text-[11px]">{title}</LibraryDetailLabel>
      <div className="mt-2 h-px w-14 bg-gradient-to-r from-text-primary/20 via-text-primary/10 to-transparent" />
      <div className="mt-3">{children}</div>
    </div>
  </div>
);

export type LibraryCodeBlockProps = {
  code: string;
  languageLabel?: string;
  className?: string;
};

export const LibraryCodeBlock: React.FC<LibraryCodeBlockProps> = ({
  code,
  languageLabel = 'tsx',
  className,
}) => (
  <div className={clsx(libraryPanelSurfaceClass, 'rounded-[24px]', className)}>
    <LibrarySurfaceAccent compact />
    <div className="relative z-[1] overflow-hidden">
      <CodeBlock
        code={code}
        language={languageLabel}
        variant="light"
        label={languageLabel}
        className="!rounded-none !border-0 !shadow-none !ring-0"
      />
    </div>
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
      className={clsx(libraryElevatedSurfaceClass, 'scroll-mt-28 rounded-[30px] p-6', className)}
    >
      <LibrarySurfaceAccent />
      <div className="relative z-[1]">
        <div className="flex flex-wrap gap-4 border-b border-border-subtle/80 pb-5" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <div className="min-w-0">
            {eyebrow ? <LibraryDetailLabel>{eyebrow}</LibraryDetailLabel> : null}
            <Text as="h2" className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-text-primary">
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
      </div>
    </section>
  );
});

LibraryDocsSection.displayName = 'LibraryDocsSection';

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
  <article className={clsx(libraryElevatedSurfaceClass, 'rounded-[28px] p-5', className)}>
    <LibrarySurfaceAccent />
    <div className="relative z-[1]">
      <div className="flex flex-wrap gap-3 border-b border-border-subtle/80 pb-4" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="min-w-0">
          {eyebrow ? <LibraryDetailLabel>{eyebrow}</LibraryDetailLabel> : null}
          <Text as="h3" className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-text-primary">
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
    </div>
  </article>
);

export type LibraryPropsTableRow = {
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
  description: string;
};

export type LibraryPropsTableProps = {
  title?: string;
  rows: LibraryPropsTableRow[];
  emptyText?: string;
  className?: string;
};

export const LibraryPropsTable: React.FC<LibraryPropsTableProps> = ({
  title = 'Primary Props',
  rows,
  emptyText = 'Props tablosu henuz tanimlanmadi.',
  className,
}) => (
  <div className={clsx(libraryElevatedSurfaceClass, 'rounded-[30px] p-5', className)}>
    <LibrarySurfaceAccent />
    <div className="relative z-[1]">
      <LibraryDetailLabel>{title}</LibraryDetailLabel>
      {rows.length ? (
        <div className="mt-4 overflow-hidden rounded-[26px] border border-border-subtle bg-surface-panel/95">
        <div className="grid grid-cols-[1.05fr_1.15fr_0.8fr] gap-3 border-b border-border-subtle px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
          <span>Prop</span>
          <span>Type</span>
          <span>Default</span>
        </div>
        <div className="divide-y divide-border-subtle">
          {rows.map((prop) => (
            <div key={prop.name} className="grid gap-2 px-4 py-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))" }}>
              <div>
                <Text as="div" className="font-semibold text-text-primary">
                  {prop.name}
                </Text>
                <Text variant="secondary" className="mt-1 block text-xs leading-5">
                  {prop.description}
                </Text>
              </div>
              <LibraryCodeBlock code={prop.type} languageLabel="type" className="self-start" />
              <div className="flex items-start gap-2">
                <LibraryCodeBlock code={prop.defaultValue} languageLabel="default" className="min-w-0 flex-1 self-start" />
                {prop.required ? <LibrarySectionBadge label="Required" className="border-state-warning-border bg-state-warning-bg text-state-warning-text" /> : null}
              </div>
            </div>
          ))}
        </div>
        </div>
      ) : (
        <Text variant="secondary" className="mt-3 block">
          {emptyText}
        </Text>
      )}
    </div>
  </div>
);

export type LibraryUsageRecipe = {
  title: string;
  description?: React.ReactNode;
  code: string;
  badges?: React.ReactNode;
};

export type LibraryUsageRecipesPanelProps = {
  title?: string;
  recipes: LibraryUsageRecipe[];
  emptyText?: string;
  className?: string;
};

export const LibraryUsageRecipesPanel: React.FC<LibraryUsageRecipesPanelProps> = ({
  title = 'Usage Recipes',
  recipes,
  emptyText = 'Usage recipe henuz tanimlanmadi.',
  className,
}) => (
  <div className={clsx(libraryElevatedSurfaceClass, 'rounded-[30px] p-5', className)}>
    <LibrarySurfaceAccent />
    <div className="relative z-[1]">
      <LibraryDetailLabel>{title}</LibraryDetailLabel>
      {recipes.length ? (
        <div className="mt-4 space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.title} className={clsx(libraryPanelSurfaceClass, 'rounded-[24px] p-4')}>
            <LibrarySurfaceAccent compact />
            <div className="relative z-[1]">
              <div className="flex flex-wrap gap-3 border-b border-border-subtle/80 pb-3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
              <div className="min-w-0">
                <Text as="h3" className="text-base font-semibold text-text-primary">
                  {recipe.title}
                </Text>
                {recipe.description ? (
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    {recipe.description}
                  </Text>
                ) : null}
              </div>
              {recipe.badges ? <div className="flex flex-wrap gap-2">{recipe.badges}</div> : null}
              </div>
              <LibraryCodeBlock code={recipe.code} className="mt-4" />
            </div>
          </div>
        ))}
        </div>
      ) : (
        <Text variant="secondary" className="mt-3 block">
          {emptyText}
        </Text>
      )}
    </div>
  </div>
);

export type LibraryMetricCardProps = {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
};

export const LibraryMetricCard: React.FC<LibraryMetricCardProps> = ({ label, value, note, className }) => (
  <div className={clsx(libraryPanelSurfaceClass, 'rounded-[22px] p-4', className)}>
    <LibrarySurfaceAccent compact />
    <div className="relative z-[1]">
      <LibraryDetailLabel>{label}</LibraryDetailLabel>
      <Text as="div" className="mt-2 text-base font-semibold tracking-[-0.02em] text-text-primary">
        {value}
      </Text>
      {note ? (
        <Text variant="secondary" className="mt-1 block text-xs leading-5">
          {note}
        </Text>
      ) : null}
    </div>
  </div>
);

export type LibraryDetailTabsProps = DetailSectionTabsProps;

export const LibraryDetailTabs = DetailSectionTabs;

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
}) => {
  const railItems = React.useMemo(
    () => createNavigationDestinationItems(
      items.map((item) => ({
        value: item.id,
        label: item.label,
        current: item.id === activeItemId,
      })),
      { currentValue: activeItemId },
    ),
    [activeItemId, items],
  );

  return (
    <section className={clsx(libraryElevatedSurfaceClass, 'rounded-[26px] p-4', className)}>
      <LibrarySurfaceAccent compact />
      <div className="relative z-[1]">
        <LibraryDetailLabel>{title}</LibraryDetailLabel>
        <NavigationRail
        items={railItems}
        value={activeItemId}
        onValueChange={onItemSelect}
        ariaLabel={title}
        size="sm"
        appearance="ghost"
        labelVisibility="always"
        className="mt-3 w-full rounded-[20px] bg-transparent p-0"
        classes={{
          root: 'border-transparent bg-transparent p-0 shadow-none',
          list: 'gap-1.5',
          item: 'rounded-2xl px-3 py-2',
          activeItem: 'bg-[var(--surface-card)] shadow-[0_14px_28px_-20px_var(--shadow-color,rgba(24,18,68,0.32))] ring-1 ring-[var(--border-subtle)]/20',
          label: 'text-sm',
        }}
        />
      </div>
    </section>
  );
};

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
  <section className={clsx(libraryElevatedSurfaceClass, 'rounded-[26px] p-4', className)}>
    <LibrarySurfaceAccent compact />
    <div className="relative z-[1]">
      <LibraryDetailLabel>{title}</LibraryDetailLabel>
      <div className="mt-3 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className={clsx(libraryPanelSurfaceClass, 'rounded-[20px] p-3')}>
          <LibrarySurfaceAccent compact />
          <div className="relative z-[1]">
          <LibraryDetailLabel>{item.label}</LibraryDetailLabel>
          <div className="mt-2 text-xl font-semibold text-text-primary">{item.value}</div>
          </div>
        </div>
      ))}
      </div>
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
  <section className={clsx(libraryElevatedSurfaceClass, 'rounded-[26px] p-4', className)}>
    <LibrarySurfaceAccent compact />
    <div className="relative z-[1]">
      <LibraryDetailLabel>{title}</LibraryDetailLabel>
      <div className="mt-3 space-y-3">
      {items.map((item) => (
        <div key={item.label} className={clsx(libraryPanelSurfaceClass, 'rounded-[20px] p-3')}>
          <LibrarySurfaceAccent compact />
          <div className="relative z-[1]">
          <LibraryDetailLabel>{item.label}</LibraryDetailLabel>
          <div className="mt-2">{item.value}</div>
          </div>
        </div>
      ))}
      </div>
    </div>
  </section>
);
