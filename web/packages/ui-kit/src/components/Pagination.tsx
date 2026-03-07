import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PaginationSize = 'sm' | 'md';
export type PaginationMode = 'client' | 'server';

type PaginationEntry =
  | { type: 'page'; value: number }
  | { type: 'ellipsis'; key: string };

export interface PaginationProps extends AccessControlledProps {
  totalItems: number;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  size?: PaginationSize;
  mode?: PaginationMode;
  compact?: boolean;
  showPageInfo?: boolean;
  className?: string;
}

const sizeClass: Record<PaginationSize, string> = {
  sm: 'min-h-8 min-w-8 rounded-lg px-2.5 text-xs',
  md: 'min-h-10 min-w-10 rounded-xl px-3 text-sm',
};

function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(1, page), pageCount);
}

function buildEntries(pageCount: number, currentPage: number, siblingCount: number): PaginationEntry[] {
  if (pageCount <= 7 + siblingCount * 2) {
    return Array.from({ length: pageCount }, (_, index) => ({ type: 'page' as const, value: index + 1 }));
  }

  const entries: PaginationEntry[] = [{ type: 'page', value: 1 }];
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(pageCount - 1, currentPage + siblingCount);

  if (start > 2) {
    entries.push({ type: 'ellipsis', key: 'left-ellipsis' });
  }

  for (let value = start; value <= end; value += 1) {
    entries.push({ type: 'page', value });
  }

  if (end < pageCount - 1) {
    entries.push({ type: 'ellipsis', key: 'right-ellipsis' });
  }

  entries.push({ type: 'page', value: pageCount });
  return entries;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    totalItems,
    pageSize = 10,
    page,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    size = 'md',
    mode = 'server',
    compact = false,
    showPageInfo = true,
    className,
    access = 'full',
    accessReason,
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  const pageCount = Math.max(1, Math.ceil(Math.max(0, totalItems) / Math.max(1, pageSize)));
  const isControlled = typeof page === 'number';
  const [internalPage, setInternalPage] = React.useState(() => clampPage(defaultPage, pageCount));

  React.useEffect(() => {
    if (!isControlled) {
      setInternalPage((prev) => clampPage(prev, pageCount));
    }
  }, [isControlled, pageCount]);

  if (accessState.isHidden) {
    return null;
  }

  const currentPage = clampPage(isControlled ? page ?? defaultPage : internalPage, pageCount);
  const blocked = accessState.isDisabled || accessState.isReadonly;
  const interactionState: AccessLevel = blocked ? 'disabled' : accessState.state;
  const entries = buildEntries(pageCount, currentPage, siblingCount);

  const commitPage = React.useCallback(
    (nextPage: number) => {
      const normalized = clampPage(nextPage, pageCount);
      if (!isControlled) {
        setInternalPage(normalized);
      }
      onPageChange?.(normalized);
    },
    [isControlled, onPageChange, pageCount],
  );

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      title={accessReason}
      data-access-state={accessState.state}
      data-size={size}
      data-mode={mode}
      data-compact={compact ? 'true' : 'false'}
      data-page-count={String(pageCount)}
      className={cn('flex flex-col gap-3', className)}
    >
      <div className={cn('flex flex-wrap items-center gap-2', compact && 'gap-1.5')}>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center border border-border-subtle bg-surface-default font-medium text-text-secondary shadow-sm transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            sizeClass[size],
          )}
          disabled={blocked || currentPage <= 1}
          aria-label="Önceki sayfa"
          onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
            interactionState,
            () => commitPage(currentPage - 1),
            blocked || currentPage <= 1,
          )}
        >
          Önceki
        </button>

        {entries.map((entry) => {
          if (entry.type === 'ellipsis') {
            return (
              <span
                key={entry.key}
                aria-hidden="true"
                className={cn(
                  'inline-flex items-center justify-center text-text-subtle',
                  sizeClass[size],
                )}
              >
                …
              </span>
            );
          }

          const active = entry.value === currentPage;
          return (
            <button
              key={entry.value}
              type="button"
              className={cn(
                'inline-flex items-center justify-center border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                sizeClass[size],
                active
                  ? 'border-transparent bg-[var(--accent-primary)] text-text-inverse shadow-sm'
                  : 'border-border-subtle bg-surface-default text-text-secondary hover:bg-surface-muted hover:text-text-primary',
              )}
              aria-current={active ? 'page' : undefined}
              aria-label={`Sayfa ${entry.value}`}
              data-page={String(entry.value)}
              onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                interactionState,
                () => commitPage(entry.value),
                blocked,
              )}
              disabled={blocked}
            >
              {entry.value}
            </button>
          );
        })}

        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center border border-border-subtle bg-surface-default font-medium text-text-secondary shadow-sm transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            sizeClass[size],
          )}
          disabled={blocked || currentPage >= pageCount}
          aria-label="Sonraki sayfa"
          onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
            interactionState,
            () => commitPage(currentPage + 1),
            blocked || currentPage >= pageCount,
          )}
        >
          Sonraki
        </button>
      </div>

      {showPageInfo ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <span>
            Sayfa <strong className="text-text-primary">{currentPage}</strong> / {pageCount}
          </span>
          <span aria-hidden="true">•</span>
          <span>{totalItems} kayıt</span>
          <span aria-hidden="true">•</span>
          <span>{mode === 'server' ? 'Server-side' : 'Client-side'} mode</span>
        </div>
      ) : null}
    </nav>
  );
});

export default Pagination;
