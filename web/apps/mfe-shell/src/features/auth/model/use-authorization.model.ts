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
      set.add('USER-READ');
      set.add('USER-CREATE');
      set.add('USER-UPDATE');
      set.add('USER-DELETE');
    }
    if (set.has('EDIT_USERS')) {
      set.add('VIEW_USERS');
      set.add('USER-READ');
      set.add('USER-UPDATE');
    }
    if (set.has('VIEW_USERS')) {
      set.add('USER-READ');
    }

    // Yeni granular kullanıcı izinleri → eski eşleşme
    if (set.has('USER-CREATE') || set.has('USER-UPDATE') || set.has('USER-DELETE')) {
      set.add('USER-READ');
      set.add('VIEW_USERS');
    }
    if (set.has('USER-READ')) {
      set.add('VIEW_USERS');
    }

    // Reporting izin eşleştirmesi
    if (set.has('REPORT_VIEW')) {
      set.add('VIEW_REPORTS');
    }

    // OpenFGA module → legacy permission mapping
    if (set.has('USER_MANAGEMENT')) {
      set.add('USER-READ');
      set.add('USER-CREATE');
      set.add('USER-UPDATE');
      set.add('USER-DELETE');
      set.add('VIEW_USERS');
      set.add('MANAGE_USERS');
    }
    if (set.has('ACCESS')) {
      set.add('ACCESS-READ');
      set.add('ACCESS-WRITE');
      set.add('VIEW_ACCESS');
    }
    if (set.has('AUDIT')) {
      set.add('AUDIT-READ');
      set.add('AUDIT-WRITE');
      set.add('VIEW_AUDIT');
    }
    if (set.has('REPORT')) {
      set.add('VIEW_REPORTS');
      set.add('REPORT_VIEW');
      set.add('REPORT_EXPORT');
      set.add('REPORT_MANAGE');
    }
    if (set.has('THEME')) {
      set.add('THEME_ADMIN');
    }
    if (set.has('WAREHOUSE')) {
      set.add('VIEW_VARIANTS');
      set.add('MANAGE_VARIANTS');
      set.add('VARIANTS_READ');
      set.add('VARIANTS_WRITE');
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
