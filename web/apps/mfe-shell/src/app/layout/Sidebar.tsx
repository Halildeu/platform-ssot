import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSharedReport } from '@platform/capabilities';
import {
  BarChart3,
  Folder,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Server,
  Settings,
  Database,
} from 'lucide-react';
import { ShellSidebar } from '@mfe/design-system';
import type { ShellSidebarNavItem, ShellSidebarFooterActionItem } from '@mfe/design-system';
import { useAppDispatch } from '../store/store.hooks';
import { pushNotification, toggleOpen } from '../../features/notifications/model/notifications.slice';
import { useAuthorization } from '../../features/auth/model/use-authorization.model';
import { PERMISSIONS } from '../../features/auth/lib/permissions.constants';
import { resolveDefaultShellPath } from '../shell-navigation';

const STORAGE_KEY = 'shell.sidebar.mode';
const defaultReportingRoute = getSharedReport('users-overview').webRoute;

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();

  /* ---- Online status ---- */
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );

  useEffect(() => {
    const update = () =>
      setIsOnline(typeof navigator === 'undefined' ? true : navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  /* ---- Navigation items ---- */
  const navItems: ShellSidebarNavItem[] = useMemo(() => {
    const canAccess = hasPermission(PERMISSIONS.ACCESS_MODULE);
    const canAudit = hasPermission(PERMISSIONS.AUDIT_MODULE);
    const canReport = hasPermission(PERMISSIONS.REPORTING_MODULE);
    const canThemeAdmin = hasPermission(PERMISSIONS.THEME_ADMIN);
    const permissions = [
      canAccess ? PERMISSIONS.ACCESS_MODULE : null,
      canAudit ? PERMISSIONS.AUDIT_MODULE : null,
      canReport ? PERMISSIONS.REPORTING_MODULE : null,
      canThemeAdmin ? PERMISSIONS.THEME_ADMIN : null,
    ].filter((p): p is NonNullable<typeof p> => p != null);
    const homePath = resolveDefaultShellPath({ permissions });

    return [
      { key: 'home', label: 'Home', href: homePath, icon: <Home aria-hidden />, dataTestId: 'nav-home' },
      { key: 'dashboard', label: 'Dashboard', href: canAudit ? '/audit/events' : undefined, icon: <LayoutDashboard aria-hidden />, dataTestId: 'nav-dashboard', disabled: !canAudit },
      { key: 'projects', label: 'Projects', href: canAccess ? '/access/roles' : undefined, icon: <Folder aria-hidden />, dataTestId: 'nav-projects', disabled: !canAccess },
      { key: 'reporting', label: 'Reporting', href: canReport ? defaultReportingRoute : undefined, icon: <BarChart3 aria-hidden />, dataTestId: 'nav-reporting', disabled: !canReport },
      { key: 'services', label: 'Services', href: canThemeAdmin ? '/admin/services' : undefined, icon: <Server aria-hidden />, dataTestId: 'nav-services', disabled: !canThemeAdmin },
      { key: 'schema-explorer', label: 'Schema Explorer', href: '/admin/schema-explorer', icon: <Database aria-hidden />, dataTestId: 'nav-schema-explorer' },
    ];
  }, [hasPermission]);

  /* ---- Active key resolution ---- */
  const homePath = navItems.find((item) => item.key === 'home')?.href;

  const activeKey = useMemo(() => {
    const p = location.pathname || '/';
    if (homePath && p === homePath) return 'home';
    if (p.startsWith('/audit')) return 'dashboard';
    if (p.startsWith('/access')) return homePath === '/access/roles' ? 'home' : 'projects';
    if (p.startsWith('/admin/reports')) return 'reporting';
    if (p.startsWith('/admin/services')) return 'services';
    if (p.startsWith('/admin/schema-explorer')) return 'schema-explorer';
    return 'home';
  }, [homePath, location.pathname]);

  /* ---- Footer actions ---- */
  const footerActions: ShellSidebarFooterActionItem[] = useMemo(
    () => [
      {
        key: 'settings',
        label: 'Settings',
        icon: <Settings aria-hidden />,
        href: hasPermission(PERMISSIONS.THEME_ADMIN) ? '/admin/themes' : undefined,
        disabled: !hasPermission(PERMISSIONS.THEME_ADMIN),
        dataTestId: 'nav-settings',
      },
      {
        key: 'support',
        label: 'Support',
        icon: <LifeBuoy aria-hidden />,
        onClick: () => {
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
        },
        dataTestId: 'nav-support',
      },
    ],
    [hasPermission, dispatch],
  );

  /* ---- Folder items ---- */
  const folderItems = useMemo(
    () => [
      { key: 'all', label: 'View all', count: 0, dataTestId: 'nav-folders-all' },
      { key: 'recent', label: 'Recent', count: 0, dataTestId: 'nav-folders-recent' },
      { key: 'favorites', label: 'Favorites', count: 0, dataTestId: 'nav-folders-favorites' },
      { key: 'shared', label: 'Shared', count: 0, dataTestId: 'nav-folders-shared' },
    ],
    [],
  );

  /* ---- Search ---- */
  const openCommandPalette = () => {
    if (location.pathname.startsWith('/admin/design-lab')) {
      window.dispatchEvent(new CustomEvent('design-lab:open-search'));
    } else {
      navigate('/admin/design-lab?search=open');
    }
  };

  return (
    <ShellSidebar
      navItems={navItems}
      activeKey={activeKey}
      onNavigate={(key, item) => {
        if (item.href && item.href !== location.pathname) {
          navigate(item.href);
        }
      }}
      brandTitle="Platform"
      brandSubtitle={location.pathname}
      onSearch={openCommandPalette}
      searchShortcut="Ctrl+K"
      folderItems={folderItems}
      footerActions={footerActions}
      statusIndicator={{ status: isOnline ? 'online' : 'offline' }}
      storageKey={STORAGE_KEY}
      defaultMode="expanded"
      cssWidthVar="--shell-sidebar-w"
      collapsedWidth={76}
      expandedWidth={280}
      className="fixed bottom-0 left-0 top-[var(--shell-header-h)] z-30 mt-4 mx-2 mb-2 !rounded-2xl !border !border-border-subtle overflow-hidden"
      dataTestId="sidebar-root"
    />
  );
};
