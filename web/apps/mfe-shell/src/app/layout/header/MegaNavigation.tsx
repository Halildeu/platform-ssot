import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { Drawer } from '@mfe/design-system';
import { Transition } from '@mfe/design-system/motion';
import { useShellCommonI18n } from '../../i18n';
import { useHeaderNavigation, type ResolvedNavGroup } from './useHeaderNavigation';
import { MegaMenuPanel } from './MegaMenuPanel';

/* ------------------------------------------------------------------ */
/*  MegaNavigation — Desktop: grouped triggers + popover dropdowns     */
/*                   Mobile:  hamburger button + slide-out Drawer       */
/* ------------------------------------------------------------------ */

const HOVER_OPEN_DELAY = 150;
const HOVER_CLOSE_DELAY = 200;

interface MegaNavigationProps {
  mobile?: boolean;
}

export const MegaNavigation: React.FC<MegaNavigationProps> = ({ mobile }) => {
  const { groups, activeGroupKey, activeItemKey } = useHeaderNavigation();
  const navigate = useNavigate();
  const { t } = useShellCommonI18n();
  const [openGroupKey, setOpenGroupKey] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedDrawerGroup, setExpandedDrawerGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
  }, []);

  const handleMouseEnterGroup = useCallback((groupKey: string, hasItems: boolean) => {
    if (!hasItems) return;
    clearTimers();
    openTimer.current = setTimeout(() => setOpenGroupKey(groupKey), HOVER_OPEN_DELAY);
  }, [clearTimers]);

  const handleMouseLeaveGroup = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenGroupKey(null), HOVER_CLOSE_DELAY);
  }, [clearTimers]);

  const handleMouseEnterPanel = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleMouseLeavePanel = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenGroupKey(null), HOVER_CLOSE_DELAY);
  }, [clearTimers]);

  const handleClickGroup = useCallback((group: ResolvedNavGroup) => {
    if (group.directPath) {
      navigate(group.directPath);
      setOpenGroupKey(null);
      return;
    }
    setOpenGroupKey((prev) => (prev === group.key ? null : group.key));
  }, [navigate]);

  const handleClosePanel = useCallback(() => {
    setOpenGroupKey(null);
  }, []);

  // Close on Escape (desktop popover)
  useEffect(() => {
    if (!openGroupKey) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenGroupKey(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openGroupKey]);

  // Close on outside click (desktop popover)
  useEffect(() => {
    if (!openGroupKey) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenGroupKey(null);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [openGroupKey]);

  /* ---- Mobile: hamburger + Drawer ---- */
  if (mobile) {
    const handleDrawerNav = (path: string) => {
      navigate(path);
      setDrawerOpen(false);
      setExpandedDrawerGroup(null);
    };

    return (
      <>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
          aria-label={t('shell.header.menuOpen')}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>

        <Drawer
          open={drawerOpen}
          onClose={() => { setDrawerOpen(false); setExpandedDrawerGroup(null); }}
          placement="left"
          size="sm"
          title={t('shell.header.navigation')}
        >
          <nav className="flex flex-col gap-1 py-2" aria-label="Ana gezinme">
            {groups.map((group) => {
              const Icon = group.icon;
              const isActive = group.key === activeGroupKey;
              const hasItems = Boolean(group.items?.length);
              const isExpanded = expandedDrawerGroup === group.key;

              return (
                <div key={group.key}>
                  <button
                    type="button"
                    onClick={() => {
                      if (group.directPath) {
                        handleDrawerNav(group.directPath);
                        return;
                      }
                      setExpandedDrawerGroup(isExpanded ? null : group.key);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium transition-colors duration-100 ${
                      isActive
                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                        : 'text-text-primary hover:bg-surface-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    <span className="flex-1">{group.label}</span>
                    {hasItems && (
                      <ChevronRight
                        className={`h-4 w-4 text-text-subtle transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
                        aria-hidden
                      />
                    )}
                  </button>

                  {/* Expanded sub-items */}
                  {hasItems && isExpanded && (
                    <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border-subtle/50 pl-3">
                      {group.items!.map((item) => {
                        const ItemIcon = item.icon;
                        const isItemActive = item.key === activeItemKey;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleDrawerNav(item.path)}
                            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors duration-100 ${
                              isItemActive
                                ? 'bg-[var(--accent-primary)]/8 font-medium text-[var(--accent-primary)]'
                                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                            }`}
                          >
                            <ItemIcon className="h-4 w-4 shrink-0" aria-hidden />
                            <div className="min-w-0">
                              <div className="leading-tight">{item.label}</div>
                              {item.description && (
                                <div className="mt-0.5 text-[11px] leading-tight text-text-subtle">{item.description}</div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </Drawer>
      </>
    );
  }

  /* ---- Desktop: inline nav triggers + popover panels ---- */
  return (
    <nav ref={containerRef} className="flex items-center gap-0.5" aria-label="Ana gezinme">
      {groups.map((group) => {
        const Icon = group.icon;
        const isActive = group.key === activeGroupKey;
        const isOpen = group.key === openGroupKey;
        const hasItems = Boolean(group.items?.length);

        return (
          <div key={group.key} className="relative">
            <button
              type="button"
              onClick={() => handleClickGroup(group)}
              onMouseEnter={() => handleMouseEnterGroup(group.key, hasItems)}
              onMouseLeave={handleMouseLeaveGroup}
              aria-haspopup={hasItems ? 'true' : undefined}
              aria-expanded={hasItems ? isOpen : undefined}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className="hidden lg:inline">{group.label}</span>
              {hasItems && (
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              )}
            </button>

            {/* Mega menu dropdown */}
            {hasItems && (
              <div
                className="absolute left-0 top-full z-50 pt-1"
                onMouseEnter={handleMouseEnterPanel}
                onMouseLeave={handleMouseLeavePanel}
              >
                <Transition show={isOpen} preset="slideUp">
                  <div className="rounded-xl border border-border-subtle bg-surface-panel shadow-lg">
                    <MegaMenuPanel
                      items={group.items!}
                      activeItemKey={activeItemKey}
                      onClose={handleClosePanel}
                    />
                  </div>
                </Transition>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
