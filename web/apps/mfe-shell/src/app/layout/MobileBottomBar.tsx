import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BarChart3, Bell, User } from 'lucide-react';
import { BottomNavigation } from '@mfe/design-system';
import { useAppSelector, useAppDispatch } from '../store/store.hooks';
import { toggleOpen } from '../../features/notifications/model/notifications.slice';
import { useShellCommonI18n } from '../i18n';
import { useGlobalSearch } from './header/useGlobalSearch';

/* ------------------------------------------------------------------ */
/*  MobileBottomBar — Fixed bottom navigation for mobile viewports     */
/*                                                                     */
/*  5 items: Home, Search, Reports, Notifications, Profile             */
/*  Only rendered when isMobile && authenticated.                      */
/* ------------------------------------------------------------------ */

export const MobileBottomBar: React.FC = () => {
  const { t } = useShellCommonI18n();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { open: openSearch } = useGlobalSearch();
  const unreadCount = useAppSelector((s) => s.notifications?.unreadCount ?? 0);

  // Derive active value from current pathname
  const activeValue = (() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/admin/reports') || pathname.startsWith('/reports')) return 'reports';
    return 'home';
  })();

  const handleChange = useCallback(
    (value: string) => {
      switch (value) {
        case 'home':
          navigate('/');
          break;
        case 'search':
          openSearch();
          break;
        case 'reports':
          navigate('/admin/reports');
          break;
        case 'notifications':
          dispatch(toggleOpen(true));
          break;
        case 'profile':
          // Future: navigate to profile page
          break;
      }
    },
    [navigate, openSearch, dispatch],
  );

  return (
    <BottomNavigation value={activeValue} onChange={handleChange}>
      <BottomNavigation.Item
        value="home"
        icon={<Home className="h-5 w-5" />}
        label={t('shell.bottomBar.home')}
      />
      <BottomNavigation.Item
        value="search"
        icon={<Search className="h-5 w-5" />}
        label={t('shell.bottomBar.search')}
      />
      <BottomNavigation.Item
        value="reports"
        icon={<BarChart3 className="h-5 w-5" />}
        label={t('shell.bottomBar.reports')}
      />
      <BottomNavigation.Item
        value="notifications"
        icon={<Bell className="h-5 w-5" />}
        label={t('shell.bottomBar.notifications')}
        badge={unreadCount > 0 ? <span>{unreadCount > 99 ? '99+' : unreadCount}</span> : undefined}
      />
      <BottomNavigation.Item
        value="profile"
        icon={<User className="h-5 w-5" />}
        label={t('shell.bottomBar.profile')}
      />
    </BottomNavigation>
  );
};
