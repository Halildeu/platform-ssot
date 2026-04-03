import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { CommandPalette } from '@mfe/design-system';
import { useShellCommonI18n } from '../../i18n';
import { useGlobalSearch } from './useGlobalSearch';

/* ------------------------------------------------------------------ */
/*  GlobalSearchTrigger — Search pill + CommandPalette overlay          */
/*                                                                     */
/*  Shows recent pages immediately on open (before typing).            */
/*  Each command shows its keyboard shortcut (passive learning).       */
/* ------------------------------------------------------------------ */

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

export const GlobalSearchTrigger: React.FC = () => {
  const { t } = useShellCommonI18n();
  const { isOpen, open, close, items, query, setQuery, handleSelect } = useGlobalSearch();

  return (
    <>
      {/* Trigger pill */}
      <button
        type="button"
        onClick={open}
        className="group inline-flex h-9 w-full max-w-[240px] items-center gap-2 rounded-xl border border-border-subtle/60 bg-surface-muted/40 px-3 text-[13px] text-text-subtle transition-all duration-200 hover:border-[var(--accent-primary)]/30 hover:bg-surface-muted/60 hover:text-text-secondary hover:shadow-[0_0_0_3px_var(--accent-primary)]/5"
        aria-label={t('shell.search.trigger')}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden flex-1 truncate text-left lg:inline">
          {t('shell.search.placeholder')}
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-border-subtle/80 bg-surface-default/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-text-subtle sm:inline-block">
          {shortcutLabel}
        </kbd>
      </button>

      {/* CommandPalette overlay */}
      <CommandPalette
        open={isOpen}
        items={items}
        query={query}
        onQueryChange={setQuery}
        onSelect={(id) => handleSelect(id)}
        onClose={close}
        placeholder={t('shell.search.palettePlaceholder')}
        emptyStateLabel={t('shell.search.noResults')}
        title={t('shell.search.title')}
        footer={
          query.trim().length >= 2 ? (
            <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] text-text-subtle">
              <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" aria-hidden />
              <span>{t('shell.search.nlActive')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2 text-[10px] text-text-subtle">
              <span><kbd className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 font-mono text-[9px]">↑↓</kbd> gezin</span>
              <span><kbd className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 font-mono text-[9px]">Enter</kbd> aç</span>
              <span><kbd className="rounded border border-border-subtle bg-surface-muted px-1 py-0.5 font-mono text-[9px]">Esc</kbd> kapat</span>
            </div>
          )
        }
      />
    </>
  );
};
