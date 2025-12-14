import { useMemo, useCallback } from 'react';
import { useAppSelector } from '../../../app/store/store.hooks';

export const useAuthorization = () => {
  const { user } = useAppSelector((state) => state.auth);

  const permissionsSet = useMemo(() => {
    const raw = (user?.permissions ?? []).map((perm) => perm?.toUpperCase?.() ?? String(perm).toUpperCase());
    const set = new Set(raw);

    const email = user?.email?.toLowerCase?.() ?? '';
    if (email === 'admin@example.com' || email === 'admin1@example.com') {
      set.add('THEME_ADMIN');
    }

    // Legacy → yeni isim eşleştirmeleri (access/audit)
    if (set.has('VIEW_ACCESS')) {
      set.add('ACCESS-READ');
    }
    if (set.has('VIEW_AUDIT')) {
      set.add('AUDIT-READ');
    }

    if (set.has('MANAGE_USERS')) {
      set.add('EDIT_USERS');
      set.add('VIEW_USERS');
    }
    if (set.has('EDIT_USERS')) {
      set.add('VIEW_USERS');
    }

    // Yeni granular kullanıcı izinleri → eski eşleşme
    if (set.has('USER-CREATE') || set.has('USER-UPDATE') || set.has('USER-DELETE')) {
      set.add('USER-READ');
      set.add('VIEW_USERS');
    }
    if (set.has('USER-READ')) {
      set.add('VIEW_USERS');
    }

    return set;
  }, [user?.permissions]);

  const normalizedPermissions = useMemo(() => Array.from(permissionsSet), [permissionsSet]);
  const role = user?.role ?? null;

  const hasPermission = useCallback(
    (required: string | string[] | undefined): boolean => {
      if (!required) return true;
      const requiredList = (Array.isArray(required) ? required : [required]).map((item) => item.toUpperCase());
      if (requiredList.length === 0) return true;
      if (role && role.toUpperCase() === 'ADMIN') {
        return true;
      }
      if (permissionsSet.size === 0) return false;
      return requiredList.every((item) => permissionsSet.has(item));
    },
    [permissionsSet, role],
  );

  return {
    hasPermission,
    permissions: normalizedPermissions,
    role,
    user,
  };
};
