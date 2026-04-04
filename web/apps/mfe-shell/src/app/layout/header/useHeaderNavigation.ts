import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '@mfe/auth';
import { useAppSelector } from '../../store/store.hooks';
import {
  isSuggestionsRemoteEnabled,
  isEthicRemoteEnabled,
} from '../../shell-navigation';
import { useShellCommonI18n } from '../../i18n';
import type { NavGroup, NavGroupItem } from './header-navigation.config';
import { NAV_GROUPS } from './header-navigation.config';

/* ------------------------------------------------------------------ */
/*  Resolved types (labels translated, items filtered)                 */
/* ------------------------------------------------------------------ */

export interface ResolvedNavItem {
  key: string;
  label: string;
  description?: string;
  path: string;
  icon: NavGroupItem['icon'];
}

export interface ResolvedNavGroup {
  key: string;
  label: string;
  icon: NavGroup['icon'];
  items?: ResolvedNavItem[];
  directPath?: string;
}

export interface HeaderNavigationState {
  groups: ResolvedNavGroup[];
  activeGroupKey: string | null;
  activeItemKey: string | null;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useHeaderNavigation(): HeaderNavigationState {
  const { pathname } = useLocation();
  const { hasModule, isSuperAdmin } = usePermissions();
  const hasPermission = (perm: string | undefined) => {
    if (!perm || perm === 'any-child') return true;
    if (isSuperAdmin()) return true;
    return hasModule(perm);
  };
  const { initialized } = useAppSelector((s) => s.auth);
  const { t } = useShellCommonI18n();

  const suggestionsEnabled = isSuggestionsRemoteEnabled();
  const ethicEnabled = isEthicRemoteEnabled();

  const groups = useMemo<ResolvedNavGroup[]>(() => {
    if (!initialized) return [];

    return NAV_GROUPS.reduce<ResolvedNavGroup[]>((acc, group) => {
      // Direct path group — check single permission
      if (group.directPath) {
        if (group.permission && group.permission !== 'any-child' && !hasPermission(group.permission)) {
          return acc;
        }
        acc.push({
          key: group.key,
          label: t(group.labelKey),
          icon: group.icon,
          directPath: group.directPath,
        });
        return acc;
      }

      // Group with items — filter items by permission + remote flags
      const filteredItems = (group.items ?? []).reduce<ResolvedNavItem[]>((items, item) => {
        if (item.remoteFlag === 'suggestions' && !suggestionsEnabled) return items;
        if (item.remoteFlag === 'ethic' && !ethicEnabled) return items;
        if (item.permission && !hasPermission(item.permission)) return items;
        items.push({
          key: item.key,
          label: t(item.labelKey),
          description: item.descriptionKey ? t(item.descriptionKey) : undefined,
          path: item.path,
          icon: item.icon,
        });
        return items;
      }, []);

      // 'any-child': show group only if at least one item is visible
      if (group.permission === 'any-child' && filteredItems.length === 0) return acc;

      acc.push({
        key: group.key,
        label: t(group.labelKey),
        icon: group.icon,
        items: filteredItems,
      });
      return acc;
    }, []);
  }, [initialized, hasPermission, suggestionsEnabled, ethicEnabled, t]);

  // Resolve active group and item from current path (longest prefix match)
  const { activeGroupKey, activeItemKey } = useMemo(() => {
    let bestGroupKey: string | null = null;
    let bestItemKey: string | null = null;
    let bestLen = 0;

    for (const group of groups) {
      if (group.directPath) {
        const len = group.directPath.length;
        if (pathname.startsWith(group.directPath) && len > bestLen) {
          bestGroupKey = group.key;
          bestItemKey = null;
          bestLen = len;
        }
        continue;
      }
      for (const item of group.items ?? []) {
        const len = item.path.length;
        if (item.path === '/') {
          if (pathname === '/' && len >= bestLen) {
            bestGroupKey = group.key;
            bestItemKey = item.key;
            bestLen = len;
          }
        } else if (pathname.startsWith(item.path) && len > bestLen) {
          bestGroupKey = group.key;
          bestItemKey = item.key;
          bestLen = len;
        }
      }
    }
    return { activeGroupKey: bestGroupKey, activeItemKey: bestItemKey };
  }, [groups, pathname]);

  return { groups, activeGroupKey, activeItemKey };
}
