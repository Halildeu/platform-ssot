import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import { SidebarContext } from './useSidebar';
import { AppSidebarHeader } from './AppSidebarHeader';
import { AppSidebarNav } from './AppSidebarNav';
import { AppSidebarNavItem } from './AppSidebarNavItem';
import { AppSidebarSection } from './AppSidebarSection';
import { AppSidebarGroup } from './AppSidebarGroup';
import { AppSidebarFooter } from './AppSidebarFooter';
import { AppSidebarSearch } from './AppSidebarSearch';
import { AppSidebarTrigger } from './AppSidebarTrigger';
import { AppSidebarResizer } from './AppSidebarResizer';
import { AppSidebarSeparator } from './AppSidebarSeparator';
import { useAppSidebarResize } from './hooks/useAppSidebarResize';
import type { AppSidebarProps, SidebarMode } from './types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MOBILE_BREAKPOINT = 768;

function readStoredMode(key: string | undefined): SidebarMode | null {
  if (!key) return null;
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (raw === 'expanded' || raw === 'collapsed') return raw;
  } catch {
    /* SSR or restricted storage — ignore */
  }
  return null;
}

function writeStoredMode(key: string | undefined, mode: SidebarMode): void {
  if (!key) return;
  try {
    globalThis.localStorage?.setItem(key, mode);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/*  AppSidebar root                                                    */
/* ------------------------------------------------------------------ */

const AppSidebarRoot: React.FC<AppSidebarProps> = ({
  defaultMode = 'expanded',
  storageKey,
  collapsedWidth = 56,
  expandedWidth = 260,
  resizable = false,
  resizeStorageKey = 'sidebar-width',
  minWidth = 200,
  maxWidth = 500,
  className,
  children,
}) => {
  const [mode, setMode] = useState<SidebarMode>(
    () => readStoredMode(storageKey) ?? defaultMode,
  );

  /* Resize --------------------------------------------------------- */
  const {
    resizeState,
    setWidth,
    setIsResizing,
  } = useAppSidebarResize({
    defaultWidth: expandedWidth,
    minWidth,
    maxWidth,
    storageKey: resizeStorageKey,
  });

  /* Persist -------------------------------------------------------- */
  useEffect(() => {
    writeStoredMode(storageKey, mode);
  }, [storageKey, mode]);

  /* Responsive auto-collapse --------------------------------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setMode('collapsed');
    };

    // Check initial state
    handler(mql);

    mql.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
    return () =>
      mql.removeEventListener('change', handler as (e: MediaQueryListEvent) => void);
  }, []);

  /* Keyboard — Escape to collapse ---------------------------------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'expanded') {
        setMode('collapsed');
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mode]);

  /* Context value -------------------------------------------------- */
  const toggle = useCallback(
    () =>
      setMode((prev) => {
        const next = prev === 'expanded' ? 'collapsed' : 'expanded';
        writeStoredMode(storageKey, next);
        return next;
      }),
    [storageKey],
  );
  const expand = useCallback(() => setMode('expanded'), []);
  const collapse = useCallback(() => setMode('collapsed'), []);

  const ctx = useMemo(
    () => ({
      mode,
      toggle,
      expand,
      collapse,
      isCollapsed: mode === 'collapsed',
      resize: resizable ? resizeState : null,
      setWidth,
      setIsResizing,
    }),
    [mode, toggle, expand, collapse, resizable, resizeState, setWidth, setIsResizing],
  );

  /* Compute width -------------------------------------------------- */
  const width =
    mode === 'collapsed'
      ? collapsedWidth
      : resizable
        ? resizeState.width
        : expandedWidth;

  return (
    <SidebarContext.Provider value={ctx}>
      <aside
        data-sidebar=""
        data-state={mode}
        aria-label="Sidebar"
        style={{ width, position: 'relative' }}
        className={cn(
          'flex h-full flex-col',
          'bg-[var(--surface-default)] border-r border-[var(--border-subtle)]',
          resizeState.isResizing ? '' : 'transition-all duration-200',
          className,
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
};

AppSidebarRoot.displayName = 'AppSidebar';

/* ------------------------------------------------------------------ */
/*  Compound component assembly                                        */
/* ------------------------------------------------------------------ */

type CompoundSidebar = typeof AppSidebarRoot & {
  Header: typeof AppSidebarHeader;
  Nav: typeof AppSidebarNav;
  NavItem: typeof AppSidebarNavItem;
  Section: typeof AppSidebarSection;
  Group: typeof AppSidebarGroup;
  Footer: typeof AppSidebarFooter;
  Search: typeof AppSidebarSearch;
  Trigger: typeof AppSidebarTrigger;
  Resizer: typeof AppSidebarResizer;
  Separator: typeof AppSidebarSeparator;
};

export const AppSidebar = AppSidebarRoot as CompoundSidebar;
AppSidebar.Header = AppSidebarHeader;
AppSidebar.Nav = AppSidebarNav;
AppSidebar.NavItem = AppSidebarNavItem;
AppSidebar.Section = AppSidebarSection;
AppSidebar.Group = AppSidebarGroup;
AppSidebar.Footer = AppSidebarFooter;
AppSidebar.Search = AppSidebarSearch;
AppSidebar.Trigger = AppSidebarTrigger;
AppSidebar.Resizer = AppSidebarResizer;
AppSidebar.Separator = AppSidebarSeparator;
