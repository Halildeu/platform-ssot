import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserDetail, UserModuleAccessLevel } from '@mfe/shared-types';
import {
  fetchUsers,
  fetchUserDetail,
  triggerPasswordReset,
  toggleUserStatus,
  updateUserModuleAccess,
  updateUserRole,
  updateUser,
  revokeUserModuleAccess,
  RequestScope,
  UsersApiResponse,
  UserMutationAck,
} from '../../../entities/user/api/users.api';
import { UsersFilters, UsersQueryParams } from './user-management.types';

const USERS_QUERY_KEY = 'users';

const normalizeParams = (filters: UsersFilters): UsersQueryParams => ({
  search: filters.search.trim() || undefined,
  status: filters.status,
  role: filters.role,
  moduleKey: filters.moduleKey || undefined,
  moduleLevel: filters.moduleLevel,
});

export const useUsersQuery = (
  filters: UsersFilters,
  pagination: { page: number; pageSize: number },
  scope?: RequestScope,
  options?: { enabled?: boolean },
) => {
  return useQuery<UsersApiResponse>({
    queryKey: [USERS_QUERY_KEY, filters, pagination, scope],
    queryFn: () =>
      fetchUsers(
        {
          ...normalizeParams(filters),
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
        scope,
      ),
    keepPreviousData: true,
    enabled: options?.enabled ?? true,
  });
};

export const useUserDetailQuery = (
  user: { id: string; email: string } | null,
  scope?: RequestScope,
) => {
  return useQuery<UserDetail>({
    queryKey: [USERS_QUERY_KEY, 'detail', user?.id, scope],
    queryFn: () => {
      if (!user) {
        return Promise.reject(new Error('Kullanıcı seçilmedi'));
      }
      return fetchUserDetail(user, scope);
    },
    enabled: Boolean(user),
  });
};

export const useUserMutations = (scope?: RequestScope) => {
  const queryClient = useQueryClient();

  const invalidateUsers = () => queryClient.invalidateQueries({
    predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === USERS_QUERY_KEY,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole({ userId, role, scope }),
    onSuccess: () => invalidateUsers(),
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ userId, moduleKey, level, performedBy, companyId, allowGlobalScope }: { userId: string; moduleKey: string; level: UserModuleAccessLevel; performedBy?: string; companyId?: string; allowGlobalScope?: boolean }) =>
      updateUserModuleAccess({ userId, moduleKey, level, performedBy, companyId, allowGlobalScope, scope }),
    onSuccess: () => invalidateUsers(),
  });

  const revokeModuleMutation = useMutation({
    mutationFn: ({ assignmentId, performedBy }: { assignmentId: string; performedBy?: string }) =>
      revokeUserModuleAccess({ assignmentId, performedBy, scope }),
    onSuccess: () => invalidateUsers(),
  });

  const toggleStatusMutation = useMutation<UserMutationAck, Error, { userId: string; enabled: boolean }>({
    mutationFn: ({ userId, enabled }: { userId: string; enabled: boolean }) =>
      toggleUserStatus({ userId, enabled, scope }),
    onSuccess: () => invalidateUsers(),
  });

  const updateSessionTimeoutMutation = useMutation({
    mutationFn: ({ userId, sessionTimeoutMinutes }: { userId: string; sessionTimeoutMinutes: number }) =>
      updateUser({ userId, payload: { sessionTimeoutMinutes }, scope }),
    onSuccess: () => invalidateUsers(),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => triggerPasswordReset({ email }),
  });

  return {
    updateRoleMutation,
    updateModuleMutation,
    revokeModuleMutation,
    toggleStatusMutation,
    updateSessionTimeoutMutation,
    resetPasswordMutation,
  };
};
