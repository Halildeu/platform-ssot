import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AccessFilters, AccessLevel, AccessModulePolicy, AccessRole } from './access.types';
import {
  getRoles,
  getRole,
  updateRole,
  UpdateRoleRequestDto,
  createRole as createRoleApi,
  cloneRole as cloneRoleApi,
  deleteRole as deleteRoleApi,
  updateRolePermissions,
} from '../../../entities/roles/api/roles.api';

const normalise = (value: string) => value.trim().toLowerCase();
const CURRENT_ACTOR = 'shell.user';

const createAuditId = (prefix: string) => {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
};

const clonePolicy = (policy: AccessModulePolicy, actor: string, timestamp: string): AccessModulePolicy => ({
  ...policy,
  lastUpdatedAt: timestamp,
  updatedBy: actor
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32);

export interface CloneRolePayload {
  sourceRoleId: string;
  name: string;
  description?: string;
  copyMemberCount?: boolean;
}

export interface BulkUpdatePayload {
  roleIds: string[];
  moduleKey: string;
  moduleLabel: string;
  level: AccessLevel;
}

export interface CloneRoleResult {
  role: AccessRole;
  auditId: string;
}

export interface BulkUpdateResult {
  updatedRoleIds: string[];
  auditId: string;
}

export const useAccessRoles = (filters: AccessFilters) => {
  const [data, setData] = React.useState<AccessRole[]>([]);
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 30_000,
  });

  React.useEffect(() => {
    if (Array.isArray(rolesQuery.data?.items) && rolesQuery.data.items.length > 0) {
      setData(rolesQuery.data.items);
      return;
    }
    if (rolesQuery.status === 'error') {
      if (process.env.NODE_ENV !== 'production') console.warn('[useAccessRoles] Role listesi alınamadı.', rolesQuery.error);
      /* Error state — let component render error UI instead of silent mock */
    }
  }, [rolesQuery.data, rolesQuery.error, rolesQuery.status]);

  const fetchRoleDetail = React.useCallback(
    async (id: string) => {
      try {
        return await queryClient.ensureQueryData(['role', id], () => getRole(id));
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== 'production') console.warn('[useAccessRoles] Role detayı alınamadı.', error);
        throw error; /* Propagate to React Query error state */
      }
    },
    [queryClient],
  );

  const roleUpdateMutation = useMutation({
    mutationFn: (vars: { id: string; payload: UpdateRoleRequestDto }) => updateRole(vars.id, vars.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      await queryClient.invalidateQueries({ queryKey: ['role'] });
    },
    onError: (error) => {
      console.warn('[useAccessRoles] Role güncelleme başarısız, mock veri tutuluyor.', error);
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string }) => createRoleApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.warn('[useAccessRoles] Role oluşturma başarısız.', error);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: string) => deleteRoleApi(roleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.warn('[useAccessRoles] Role silme başarısız.', error);
    },
  });

  const roleCloneMutation = useMutation({
    mutationFn: (payload: CloneRolePayload) => cloneRoleApi(payload.sourceRoleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.warn('[useAccessRoles] Role klonlama başarısız.', error);
    },
  });

  const roles = React.useMemo(() => {
    return data.filter((role) => {
      const matchesSearch =
        filters.search.length === 0 ||
        normalise(role.name).includes(normalise(filters.search)) ||
        normalise(role.description ?? '').includes(normalise(filters.search));

      const matchesModule =
        filters.moduleKey === 'ALL' ||
        role.policies.some((policy) => policy.moduleKey === filters.moduleKey);

      const matchesLevel =
        filters.level === 'ALL' ||
        role.policies.some((policy) => policy.level === filters.level);

      return matchesSearch && matchesModule && matchesLevel;
    });
  }, [data, filters.level, filters.moduleKey, filters.search]);

  const modules = React.useMemo(() => {
    const entries = new Map<string, string>();
    data.forEach((role) => {
      role.policies.forEach((policy) => {
        if (!entries.has(policy.moduleKey)) {
          entries.set(policy.moduleKey, policy.moduleLabel);
        }
      });
    });
    return entries;
  }, [data]);

  const cloneRole = React.useCallback(
    async (payload: CloneRolePayload): Promise<CloneRoleResult> => {
      const cloned = await roleCloneMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      return { role: cloned.role, auditId: cloned.auditId ?? cloned.role.id };
    },
    [queryClient, roleCloneMutation]
  );

  const bulkUpdateRoles = React.useCallback(
    async (payload: BulkUpdatePayload): Promise<BulkUpdateResult> => {
      const targetSet = new Set(payload.roleIds);
      if (targetSet.size === 0) {
        return { updatedRoleIds: [], auditId: createAuditId('audit-bulk-skip') };
      }

      const auditId = createAuditId('audit-bulk');
      const results = await Promise.allSettled(
        payload.roleIds.map(async (roleId) => {
          const role = data.find((r) => r.id === roleId);
          if (!role) return null;
          const existingPermIds = role.policies
            .filter((p) => p.moduleKey !== payload.moduleKey)
            .flatMap((p) => [p.moduleKey]);
          const newPermIds = payload.level !== 'NONE'
            ? [...existingPermIds, `${payload.moduleKey}:${payload.level}`]
            : existingPermIds;
          await updateRolePermissions(roleId, { permissionIds: newPermIds });
          return roleId;
        })
      );

      const updatedRoleIds = results
        .filter((r): r is PromiseFulfilledResult<string | null> => r.status === 'fulfilled' && r.value != null)
        .map((r) => r.value!);

      const failedCount = results.filter((r) => r.status === 'rejected').length;
      if (failedCount > 0) {
        console.warn(`[useAccessRoles] Bulk update: ${failedCount}/${payload.roleIds.length} failed`);
      }

      await queryClient.invalidateQueries({ queryKey: ['roles'] });

      return { updatedRoleIds, auditId };
    },
    [data, queryClient]
  );

  return {
    roles,
    total: roles.length,
    modules,
    cloneRole,
    bulkUpdateRoles,
    fetchRoleDetail,
    roleUpdateMutation,
    createRoleMutation,
    deleteRoleMutation,
    roleCloneMutation,
    updateRolePermissionsMutation: useMutation({
      mutationFn: (vars: { id: string; permissionIds: string[] }) =>
        updateRolePermissions(vars.id, { permissionIds: vars.permissionIds }),
      onSuccess: async (_data, vars) => {
        await queryClient.invalidateQueries({ queryKey: ['roles'] });
        await queryClient.invalidateQueries({ queryKey: ['role', vars.id] });
      },
      onError: (error) => {
        console.warn('[useAccessRoles] Role permission update failed.', error);
      },
    }),
  };
};
