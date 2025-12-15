import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Folder,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings,
} from 'lucide-react';
import { useAppDispatch } from '../../../app/store/store.hooks';
import { pushNotification, toggleOpen } from '../../../features/notifications/model/notifications.slice';
import { useAuthorization } from '../../../features/auth/model/use-authorization.model';
import { PERMISSIONS } from '../../../features/auth/lib/permissions.constants';

type SidebarMode = 'expanded' | 'collapsed';

type SidebarNavItem = {
  key: string;
  label: string;
  to?: string;
  icon: React.ReactNode;
  dataTestId: string;
  badge?: number;
  disabled?: boolean;
};

type FoldersSubItem = {
  key: string;
  label: string;
  count: number;
  dataTestId: string;
};

const STORAGE_KEY = 'shell.sidebar.mode';

const readStoredSidebarMode = (): SidebarMode => {
  if (typeof window === 'undefined') return 'expanded';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === 'collapsed' ? 'collapsed' : 'expanded';
  } catch {
    return 'expanded';
  }
};

const writeStoredSidebarMode = (mode: SidebarMode) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
};

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { hasPermission } = useAuthorization();

  const [mode, setMode] = useState<SidebarMode>(() => readStoredSidebarMode());
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator === 'undefined' ? true : navigator.onLine));

  useEffect(() => {
    writeStoredSidebarMode(mode);
  }, [mode]);

  useEffect(() => {
    const update = () => setIsOnline(typeof navigator === 'undefined' ? true : navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const isCollapsed = mode === 'collapsed';

  const navItems: SidebarNavItem[] = useMemo(() => {
    const canAccess = hasPermission(PERMISSIONS.ACCESS_MODULE);
    const canAudit = hasPermission(PERMISSIONS.AUDIT_MODULE);
    const canReport = hasPermission(PERMISSIONS.REPORTING_MODULE);

    return [
      {
        key: 'home',
        label: 'Home',
        to: '/suggestions',
        icon: <Home className="h-4 w-4" aria-hidden />,
        dataTestId: 'nav-home',
      },
      {
        key: 'dashboard',
        label: 'Dashboard',
        to: canAudit ? '/audit/events' : undefined,
        icon: <LayoutDashboard className="h-4 w-4" aria-hidden />,
        dataTestId: 'nav-dashboard',
        disabled: !canAudit,
      },
      {
        key: 'projects',
        label: 'Projects',
        to: canAccess ? '/access/roles' : undefined,
        icon: <Folder className="h-4 w-4" aria-hidden />,
        dataTestId: 'nav-projects',
        disabled: !canAccess,
      },
      {
        key: 'reporting',
        label: 'Reporting',
        to: canReport ? '/admin/reports/users' : undefined,
        icon: <BarChart3 className="h-4 w-4" aria-hidden />,
        dataTestId: 'nav-reporting',
        disabled: !canReport,
      },
    ];
  }, [hasPermission]);

  const folderItems: FoldersSubItem[] = useMemo(() => [
    { key: 'all', label: 'View all', count: 0, dataTestId: 'nav-folders-all' },
    { key: 'recent', label: 'Recent', count: 0, dataTestId: 'nav-folders-recent' },
    { key: 'favorites', label: 'Favorites', count: 0, dataTestId: 'nav-folders-favorites' },
    { key: 'shared', label: 'Shared', count: 0, dataTestId: 'nav-folders-shared' },
  ], []);

  const openCommandPalette = () => {
    dispatch(
      pushNotification({
        id: 'sidebar-cmd',
        message: 'Komut paleti hazırlanıyor',
        description: 'Ctrl+K ile açılacak komut paleti yakında aktif edilecek.',
        type: 'info',
        meta: { source: 'sidebar', open: true },
      }),
    );
    dispatch(toggleOpen(true));
  };

  const handleToggleFolders = () => {
    if (isCollapsed) {
      setMode('expanded');
      setFoldersOpen(true);
      return;
    }
    setFoldersOpen((prev) => !prev);
  };

  const linkBaseClass = (active: boolean) => (
    `group flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ` +
    (active
      ? 'border-border-default bg-surface-muted text-text-primary shadow-sm'
      : 'border-transparent bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary')
  );

  return (
    <aside
      data-testid="sidebar-root"
      className={`flex min-h-0 flex-col border-r border-border-subtle bg-surface-panel shadow-sm ${
        isCollapsed ? 'w-[76px]' : 'w-[280px]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border-subtle bg-surface-default text-text-primary shadow-sm">
            <span aria-hidden>⬛</span>
          </div>
          {!isCollapsed ? (
            <div className="flex flex-col leading-tight">
              <div className="text-sm font-semibold text-text-primary">Platform</div>
              <div className="text-[11px] text-text-subtle">{location.pathname}</div>
            </div>
          ) : null}
        </div>
        {!isCollapsed ? (
          <button
            type="button"
            onClick={() => setMode('collapsed')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border-subtle bg-surface-default text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            title="Collapse"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setMode('expanded')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border-subtle bg-surface-default text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            title="Expand"
          >
            <ChevronLeftIcon />
          </button>
        ) : null}
      </div>

      <div className="px-3">
        <button
          type="button"
          data-testid="sidebar-search"
          onClick={openCommandPalette}
          className={`flex w-full items-center gap-2 rounded-2xl border border-border-subtle bg-surface-default px-3 py-2 text-left text-sm text-text-secondary shadow-sm hover:bg-surface-muted hover:text-text-primary ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Search (Ctrl+K)"
        >
          <Search className="h-4 w-4" aria-hidden />
          {!isCollapsed ? (
            <span className="flex-1">Search…</span>
          ) : null}
          {!isCollapsed ? (
            <span className="rounded-lg border border-border-subtle bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-subtle">
              Ctrl+K
            </span>
          ) : null}
        </button>
      </div>

      <nav className="mt-3 flex-1 overflow-auto px-3 pb-3">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            if (!item.to) {
              return (
                <button
                  key={item.key}
                  type="button"
                  data-testid={item.dataTestId}
                  disabled
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-text-subtle opacity-70 ${
                    isCollapsed ? 'justify-center px-0' : ''
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  {!isCollapsed ? <span className="flex-1">{item.label}</span> : null}
                </button>
              );
            }

            return (
              <NavLink
                key={item.key}
                to={item.to}
                data-testid={item.dataTestId}
                className={({ isActive }) => linkBaseClass(isActive)}
                title={item.label}
                style={
                  isCollapsed
                    ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 }
                    : undefined
                }
              >
                {item.icon}
                {!isCollapsed ? (
                  <span className="flex-1">{item.label}</span>
                ) : null}
                {!isCollapsed && typeof item.badge === 'number' ? (
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}

          <div className="mt-2">
            <button
              type="button"
              data-testid="nav-folders"
              onClick={handleToggleFolders}
              className={`flex w-full items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-left text-sm font-semibold text-text-primary shadow-sm hover:bg-surface-muted ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Folders"
            >
              <Folder className="h-4 w-4" aria-hidden />
              {!isCollapsed ? (
                <>
                  <span className="flex-1">Folders</span>
                  {foldersOpen ? <ChevronDown className="h-4 w-4" aria-hidden /> : <ChevronRight className="h-4 w-4" aria-hidden />}
                </>
              ) : null}
            </button>

            {foldersOpen && !isCollapsed ? (
              <div className="mt-2 flex flex-col gap-1 pl-2">
                {folderItems.map((subItem) => (
                  <div key={subItem.key} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-muted">
                    <span data-testid={subItem.dataTestId}>{subItem.label}</span>
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                      {subItem.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      <div className="border-t border-border-subtle px-3 py-3">
        <div className="flex flex-col gap-2">
          {hasPermission(PERMISSIONS.THEME_ADMIN) ? (
            <NavLink
              to="/admin/themes"
              data-testid="nav-settings"
              className={({ isActive }) => linkBaseClass(isActive)}
              title="Settings"
              style={
                isCollapsed
                  ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 }
                  : undefined
              }
            >
              <Settings className="h-4 w-4" aria-hidden />
              {!isCollapsed ? <span className="flex-1">Settings</span> : null}
            </NavLink>
          ) : (
            <button
              type="button"
              data-testid="nav-settings"
              disabled
              className={`flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-subtle opacity-70 ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Settings"
            >
              <Settings className="h-4 w-4" aria-hidden />
              {!isCollapsed ? <span className="flex-1">Settings</span> : null}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              dispatch(
                pushNotification({
                  id: 'sidebar-support',
                  message: 'Destek yakında',
                  description: 'Destek merkezi bağlantısı bir sonraki iterasyonda eklenecek.',
                  type: 'info',
                  meta: { source: 'sidebar', open: true },
                }),
              );
              dispatch(toggleOpen(true));
            }}
            className={`flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Support"
          >
            <LifeBuoy className="h-4 w-4" aria-hidden />
            {!isCollapsed ? <span className="flex-1">Support</span> : null}
          </button>

          <button
            type="button"
            onClick={() => {
              try {
                window.open(window.location.href, '_blank', 'noopener,noreferrer');
              } catch {
                // ignore
              }
            }}
            className={`flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {!isCollapsed ? <span className="flex-1">Open in browser</span> : null}
          </button>

          <div className={`flex items-center justify-between rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-xs font-semibold text-text-secondary ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}>
            {!isCollapsed ? <span>Online</span> : null}
            <span className={`inline-flex items-center gap-2 ${isCollapsed ? '' : ''}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-accent-primary' : 'bg-border-subtle'}`} aria-hidden />
              {!isCollapsed ? <span>{isOnline ? 'Online' : 'Offline'}</span> : null}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const ChevronLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
