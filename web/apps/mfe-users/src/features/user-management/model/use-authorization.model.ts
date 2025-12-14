import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

type AuthorizationState = {
  auth?: {
    user?: {
      permissions?: string[];
      role?: string | null;
      id?: string;
    };
  };
};

const selectAuth = (state: AuthorizationState) => state?.auth ?? {};

export const useAuthorization = () => {
  const { user } = useSelector(selectAuth) as { user?: { permissions?: string[]; role?: string | null; id?: string } };

  const permissionsSet = useMemo(() => {
    const raw = (user?.permissions ?? []).map((perm) => perm?.toUpperCase?.() ?? String(perm).toUpperCase());
    const set = new Set(raw);

    if (set.has('MANAGE_USERS')) {
      set.add('EDIT_USERS');
      set.add('VIEW_USERS');
    }
    if (set.has('EDIT_USERS')) {
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
    userId: user?.id ?? null,
  };
};
