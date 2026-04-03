import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Home } from 'lucide-react';
import { Transition } from '@mfe/design-system/motion';
import { useBreadcrumb, type BreadcrumbEntry } from './useBreadcrumb';

/* ------------------------------------------------------------------ */
/*  BreadcrumbStrip — Interactive breadcrumb bar below the header      */
/*                                                                     */
/*  Each level shows a dropdown on hover/click for sibling navigation  */
/*  (Notion-style quick switching between peer pages).                 */
/* ------------------------------------------------------------------ */

interface BreadcrumbItemProps {
  entry: BreadcrumbEntry;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ entry, isLast }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasSiblings = Boolean(entry.siblings?.length);

  const handleMouseEnter = useCallback(() => {
    if (hasSiblings) setDropdownOpen(true);
  }, [hasSiblings]);

  const handleMouseLeave = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={isLast ? undefined : entry.onClick}
        className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[12px] transition-colors duration-100 ${
          isLast
            ? 'cursor-default font-semibold text-text-primary'
            : 'font-medium text-text-subtle hover:bg-surface-muted hover:text-text-secondary'
        }`}
        aria-current={isLast ? 'page' : undefined}
      >
        <span>{entry.label}</span>
        {hasSiblings && !isLast && (
          <ChevronDown className="h-3 w-3 text-text-subtle opacity-0 transition-opacity group-hover:opacity-100" style={{ opacity: dropdownOpen ? 1 : undefined }} aria-hidden />
        )}
      </button>

      {/* Siblings dropdown */}
      {hasSiblings && (
        <div className="absolute left-0 top-full z-40 pt-0.5">
          <Transition show={dropdownOpen} preset="fadeIn">
            <div className="min-w-[160px] rounded-lg border border-border-subtle bg-surface-panel p-1 shadow-md">
              {entry.siblings!.map((sib) => (
                <button
                  key={sib.path}
                  type="button"
                  onClick={() => {
                    sib.onClick();
                    setDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                >
                  {sib.label}
                </button>
              ))}
            </div>
          </Transition>
        </div>
      )}
    </div>
  );
};

interface BreadcrumbStripProps {
  showSidebar?: boolean;
  maxItems?: number;
}

export const BreadcrumbStrip: React.FC<BreadcrumbStripProps> = ({ showSidebar, maxItems }) => {
  const { items, hasContent } = useBreadcrumb();

  if (!hasContent) return null;

  // Truncate middle items when maxItems is set and there are more items
  // Always keep: home (first), last item, and (maxItems - 2) middle items
  const visibleItems = (() => {
    const tail = items.slice(1);
    if (!maxItems || tail.length <= maxItems) return { items: tail, truncated: false };
    // Keep first (maxItems - 1) items and always the last item
    const keep = maxItems - 1;
    if (keep <= 0) return { items: [tail[tail.length - 1]], truncated: tail.length > 1 };
    return {
      items: [...tail.slice(0, keep), tail[tail.length - 1]],
      truncated: true,
    };
  })();

  return (
    <div
      className="flex h-8 items-center border-b border-border-subtle/30 bg-surface-header/60 px-4"
      style={{ paddingLeft: showSidebar ? 'calc(var(--shell-sidebar-w, 0px) + 1rem)' : undefined }}
      aria-label="Breadcrumb"
    >
      {/* Home icon */}
      <button
        type="button"
        onClick={items[0]?.onClick}
        className="mr-1 inline-flex items-center justify-center rounded-md p-0.5 text-text-subtle transition-colors hover:text-text-secondary"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
      </button>

      {visibleItems.items.map((entry, i) => (
        <React.Fragment key={entry.path}>
          <ChevronRight className="mx-0.5 h-3 w-3 text-text-subtle/50" aria-hidden />
          {/* Ellipsis before last item when truncated */}
          {visibleItems.truncated && i === visibleItems.items.length - 1 && visibleItems.items.length > 1 && (
            <>
              <span className="px-1 text-[12px] text-text-subtle" aria-hidden>...</span>
              <ChevronRight className="mx-0.5 h-3 w-3 text-text-subtle/50" aria-hidden />
            </>
          )}
          <BreadcrumbItem entry={entry} isLast={i === visibleItems.items.length - 1} />
        </React.Fragment>
      ))}
    </div>
  );
};
