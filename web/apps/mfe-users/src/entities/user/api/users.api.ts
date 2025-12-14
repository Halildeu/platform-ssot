import { AxiosError, isAxiosError } from 'axios';
import { api, getGatewayBaseUrl } from '@mfe/shared-http';
import type { ApiInstance } from '@mfe/shared-http';
import { PaginatedResponse, UserDetail, UserSummary } from '@mfe/shared-types';
import type { UserModuleAccessLevel, UserModulePermission } from '@mfe/shared-types';
import { UsersQueryParams } from '../../../features/user-management/model/user-management.types';
import {
  registerTokenResolver as registerSharedTokenResolver,
} from '../lib/token-resolver.lib';
import { getShellServices } from '../../../app/services/shell-services';

const API_BASE_URL = getGatewayBaseUrl();
const USERS_BASE_URL = `${API_BASE_URL}/v1/users`;
const AUTH_BASE_URL = `${API_BASE_URL}/v1/auth`;
const PERMISSIONS_BASE_URL = `${API_BASE_URL}/v1/permissions`;
const UNAUTHORIZED_STATUS = new Set([401, 403]);

const getFetchBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost';
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

type ErrorResponseWire = {
  error?: unknown;
  message?: unknown;
  fieldErrors?: Record<string, string[]>;
  meta?: { traceId?: string };
};

type ParsedError = {
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
};

export type UserMutationAck = {
  status?: string;
  auditId?: string;
};

const KNOWN_MODULES: Array<{ key: string; label: string }> = [
  { key: 'USER_MANAGEMENT', label: 'Kullanıcı Modülü' },
  { key: 'PURCHASE', label: 'Satın Alma Modülü' },
  { key: 'WAREHOUSE', label: 'Depo Modülü' },
];

const MODULE_LEVEL_ROLE_MAP: Record<string, Partial<Record<UserModuleAccessLevel, string>>> = {
  USER_MANAGEMENT: {
    VIEW: 'USER_VIEWER',
    EDIT: 'USER_MANAGER',
    MANAGE: 'USER_MANAGER',
  },
  PURCHASE: {
    VIEW: 'PURCHASE_MANAGER',
    MANAGE: 'PURCHASE_MANAGER',
  },
  WAREHOUSE: {
    VIEW: 'WAREHOUSE_OPERATOR',
    MANAGE: 'WAREHOUSE_OPERATOR',
  },
};

export interface UsersApiResponse extends PaginatedResponse<UserSummary> {
  meta?: {
    reason: 'success' | 'unauthorized' | 'network-error';
  };
}

type UsersResponseWire = {
  items?: unknown;
  total?: unknown;
  page?: unknown;
  pageSize?: unknown;
};

type UserSummaryWire = {
  id?: unknown;
  email?: unknown;
  fullName?: unknown;
  name?: unknown;
  modulePermissions?: unknown;
  enabled?: unknown;
  role?: unknown;
  lastLogin?: unknown;
  lastLoginAt?: unknown;
  createDate?: unknown;
  createdAt?: unknown;
  sessionTimeoutMinutes?: unknown;
};

type PermissionWire = Partial<UserModulePermission> & {
  key?: unknown;
  module?: unknown;
  label?: unknown;
  moduleName?: unknown;
  permissionModules?: Record<string, string>;
};

type AssignmentWire = PermissionWire & { active?: boolean };

type UserDetailWire = UserSummaryWire & {
  phoneNumber?: unknown;
  title?: unknown;
  locale?: unknown;
  timezone?: unknown;
  notes?: unknown;
  status?: unknown;
  firstName?: unknown;
  lastName?: unknown;
};

const isPermissionWire = (value: unknown): value is PermissionWire =>
  typeof value === 'object' && value !== null;

const toStringOrFallback = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
};

const buildEmptyUsersResponse = (params: UsersQueryParams = {}): PaginatedResponse<UserSummary> => ({
  items: [],
  total: 0,
  page: params.page ?? 1,
  pageSize: params.pageSize ?? 25,
});

const buildFallbackUserDetail = (
  user: { id: string; email: string },
): UserDetail => ({
  id: user.id,
  email: user.email,
  fullName: user.email,
  role: 'USER',
  status: 'ACTIVE',
  lastLoginAt: null,
  createdAt: null,
  modulePermissions: ensureAdminUserModulePermission([], null),
  phoneNumber: undefined,
  title: undefined,
  locale: undefined,
  timezone: undefined,
  notes: undefined,
  sessionTimeoutMinutes: 15,
});

export interface RequestScope {
  companyId?: string | number;
  projectId?: string | number;
  warehouseId?: string | number;
}

const SCOPE_STORAGE_KEY = 'halo.scope';

export const registerTokenResolver = (resolver?: Parameters<typeof registerSharedTokenResolver>[0]) => {
  registerSharedTokenResolver(resolver);
};

const getStoredScope = (): RequestScope => {
  try {
    const raw = localStorage.getItem(SCOPE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }
    return parsed as RequestScope;
  } catch (error) {
    console.warn('Scope bilgisi çözümlenemedi', error);
    return {};
  }
};

const buildScopeHeaders = (scope?: RequestScope) => {
  const ctx = scope ?? getStoredScope();
  const headers: Record<string, string> = {};
  if (ctx.companyId !== undefined && ctx.companyId !== null) {
    headers['X-Company-Id'] = String(ctx.companyId);
  }
  if (ctx.projectId !== undefined && ctx.projectId !== null) {
    headers['X-Project-Id'] = String(ctx.projectId);
  }
  if (ctx.warehouseId !== undefined && ctx.warehouseId !== null) {
    headers['X-Warehouse-Id'] = String(ctx.warehouseId);
  }
  return headers;
};

const parseErrorResponse = async (
  source: Response | AxiosError<ErrorResponseWire> | undefined,
): Promise<ParsedError> => {
  if (source && typeof Response !== 'undefined' && source instanceof Response) {
    try {
      const payload = (await source.json()) as ErrorResponseWire;
      const message =
        typeof payload.message === 'string'
          ? payload.message
          : typeof payload.error === 'string'
            ? payload.error
            : `İstek başarısız (${source.status})`;
      return {
        message,
        fieldErrors: payload.fieldErrors,
        traceId: payload.meta?.traceId,
      };
    } catch {
      return { message: `İstek başarısız (${source.status})` };
    }
  }

  if (source && isAxiosError<ErrorResponseWire>(source)) {
    const payload = source.response?.data;
    const message =
      (payload?.message as string) ??
      (payload?.error as string) ??
      `İstek başarısız (${source.response?.status ?? '??'})`;
    return {
      message,
      fieldErrors: payload?.fieldErrors,
      traceId: payload?.meta?.traceId,
    };
  }

  return { message: 'İstek başarısız oldu.' };
};

const reportError = (context: string, parsed: ParsedError) => {
  const traceInfo = parsed.traceId ? ` traceId=${parsed.traceId}` : '';
  console.warn(`[usersApi] ${context} hata: ${parsed.message}${traceInfo}`, parsed.fieldErrors);
};

const buildQueryString = (params: UsersQueryParams) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.advancedFilter) qs.set('advancedFilter', params.advancedFilter);
  if (params.sort) qs.set('sort', params.sort);
  if (params.status && params.status !== 'ALL') qs.set('status', params.status);
  if (params.role && params.role !== 'ALL') qs.set('role', params.role);
  if (params.page) qs.set('page', params.page.toString());
  if (params.pageSize != null) qs.set('pageSize', params.pageSize.toString());
  const queryString = qs.toString();
  return queryString ? `?${queryString}` : '';
};

const mergeHeaders = (scope?: RequestScope) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...buildScopeHeaders(scope),
  };
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const internalApiKey = window.localStorage.getItem('internalApiKey');
      if (internalApiKey) {
        headers['X-Internal-Api-Key'] = internalApiKey;
      }
      const token = window.localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.warn('Internal API anahtarı okunamadı', error);
  }
  return headers;
};

const normalizeAccessLevel = (value: unknown): UserModuleAccessLevel => {
  if (typeof value === 'string') {
    const normalized = value.toUpperCase();
    if (normalized === 'OWNER' || normalized === 'MANAGE') {
      return 'MANAGE';
    }
    if (normalized === 'EDITOR' || normalized === 'EDIT') {
      return 'EDIT';
    }
    if (normalized === 'VIEW') {
      return 'VIEW';
    }
  }
  return 'NONE';
};

const normalizeUsersResponse = (
  payload: UsersResponseWire,
  params: UsersQueryParams,
): UsersApiResponse => {
  const items = Array.isArray(payload.items)
    ? payload.items.map((userItem) => {
        const user = userItem as UserSummaryWire;
        const role = typeof user.role === 'string' ? user.role : 'USER';
        const rawModulePermissions = Array.isArray(user.modulePermissions)
          ? user.modulePermissions
          : [];

        const normalizedModulePermissions: UserModulePermission[] = rawModulePermissions
          .filter(isPermissionWire)
          .map((permission) => {
            const moduleKey = toStringOrFallback(
              permission.moduleKey ?? permission.key ?? permission.module ?? '',
            );
            const rawPermissions = Array.isArray(permission.permissions)
              ? permission.permissions.map((code) => toStringOrFallback(code, '').toUpperCase())
              : [];
            let level = normalizeAccessLevel(permission.level);

            if (level === 'NONE') {
              if (rawPermissions.includes('MANAGE_USERS')) {
                level = 'MANAGE';
              } else if (rawPermissions.includes('EDIT_USERS')) {
                level = 'EDIT';
              } else if (rawPermissions.includes('VIEW_USERS')) {
                level = 'VIEW';
              } else if (typeof permission.roleName === 'string') {
                const normalizedRole = permission.roleName.toUpperCase();
                if (['USER_MANAGER', 'ADMIN', 'OWNER'].includes(normalizedRole)) {
                  level = 'MANAGE';
                } else if (['USER_EDITOR', 'EDITOR'].includes(normalizedRole)) {
                  level = 'EDIT';
                } else if (['USER_VIEWER', 'VIEWER'].includes(normalizedRole)) {
                  level = 'VIEW';
                }
              }
            }

            return {
              moduleKey,
              moduleLabel: toStringOrFallback(permission.moduleLabel, moduleKey),
              permissions: rawPermissions,
              level,
              roleName: toStringOrFallback(permission.roleName, role),
              companyId: permission.companyId ?? null,
            };
          });

        return {
          id: user.id ?? '',
          email: toStringOrFallback(user.email, ''),
          fullName: toStringOrFallback(user.fullName ?? user.name, user.email ?? ''),
          role,
          status: typeof user.status === 'string' ? user.status.toUpperCase() : 'ACTIVE',
          modulePermissions: normalizedModulePermissions,
          companyId: user.companyId ?? null,
        };
      })
    : [];

  return {
    items,
    total: typeof payload.total === 'number' ? payload.total : items.length,
    page: typeof payload.page === 'number' ? payload.page : params.page ?? 1,
    pageSize: typeof payload.pageSize === 'number' ? payload.pageSize : params.pageSize ?? items.length,
    meta: { reason: 'success' },
  };
};

const normalizeUserDetail = (
  userData: UserDetailWire,
  assignments: AssignmentWire[],
  user: { id: string; email: string },
): UserDetail => {
  const deriveName = () => {
    if (typeof userData.fullName === 'string' && userData.fullName.trim().length > 0) {
      return userData.fullName;
    }
    if (typeof userData.name === 'string' && userData.name.trim().length > 0) {
      return userData.name;
    }
    const firstName = typeof userData.firstName === 'string' ? userData.firstName : '';
    const lastName = typeof userData.lastName === 'string' ? userData.lastName : '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return user.email;
  };

  const status = userData.status
    ? String(userData.status).toUpperCase()
    : userData.enabled === false
      ? 'INACTIVE'
      : 'ACTIVE';

  const activeAssignments = assignments.filter((assignment) => assignment?.active !== false);

  const assignmentMap = new Map<string, UserModulePermission & { moduleMetadata?: Record<string, string> }>();

  activeAssignments.forEach((assignment) => {
    const moduleKeyRaw = toStringOrFallback(assignment.moduleKey ?? assignment.key ?? assignment.module, '').trim();
    const moduleKey = moduleKeyRaw ? moduleKeyRaw.toUpperCase() : undefined;

    const permissions: string[] = Array.isArray(assignment.permissions)
      ? assignment.permissions
          .filter((code: unknown) => typeof code === 'string' && code.length > 0)
          .map((code: string) => code.toUpperCase())
      : [];

    const permissionLevel = deriveModuleLevelFromPermissions(moduleKey, permissions, assignment.roleName);

    if (!moduleKey) {
      return;
    }

    const moduleLabel = assignment.moduleLabel ?? assignment.label ?? assignment.moduleName ?? moduleKey;

    assignmentMap.set(moduleKey, {
      moduleKey,
      moduleLabel,
      level: permissionLevel,
      assignmentId: assignment.assignmentId ? String(assignment.assignmentId) : undefined,
      roleName: assignment.roleName,
      permissions,
      companyId: assignment.companyId ? String(assignment.companyId) : undefined,
      moduleMetadata: assignment.permissionModules ?? undefined,
    });
  });

  KNOWN_MODULES.forEach((module) => {
    if (!assignmentMap.has(module.key)) {
      assignmentMap.set(module.key, {
        moduleKey: module.key,
        moduleLabel: module.label,
        level: 'NONE',
        assignmentId: undefined,
        roleName: undefined,
        permissions: [],
        companyId: undefined,
      });
    }
  });

  const modulePermissions = Array.from(assignmentMap.values()).sort((a, b) => {
    const aIndex = KNOWN_MODULES.findIndex((item) => item.key === a.moduleKey);
    const bIndex = KNOWN_MODULES.findIndex((item) => item.key === b.moduleKey);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) {
      return -1;
    }
    if (bIndex !== -1) {
      return 1;
    }
    return a.moduleKey.localeCompare(b.moduleKey);
  });

  return {
    id: String(user.id ?? ''),
    fullName: deriveName(),
    email: toStringOrFallback(userData.email ?? user.email, ''),
    role: typeof userData.role === 'string' ? userData.role.toUpperCase() : 'USER',
    status,
    lastLoginAt: (userData.lastLogin ?? userData.lastLoginAt ?? null) as string | null,
    createdAt: (userData.createDate ?? userData.createdAt ?? null) as string | null,
    sessionTimeoutMinutes:
      typeof userData.sessionTimeoutMinutes === 'number'
        ? userData.sessionTimeoutMinutes
        : 15,
    modulePermissions: ensureAdminUserModulePermission(modulePermissions, userData.role),
  };
};

const ensureAdminUserModulePermission = (
  modulePermissions: UserModulePermission[],
  role?: string | null,
): UserModulePermission[] => {
  if (!role || role.toUpperCase() !== 'ADMIN') {
    return modulePermissions;
  }

  const permissions = [...modulePermissions];
  const targetKey = 'USER_MANAGEMENT';

  const existingIndex = permissions.findIndex(
    (permission) => permission.moduleKey === targetKey,
  );

  if (existingIndex >= 0) {
    const existing = permissions[existingIndex];
    permissions[existingIndex] = {
      ...existing,
      moduleLabel: existing.moduleLabel ?? 'Kullanıcı Modülü',
    };
  } else {
    permissions.push({
      moduleKey: targetKey,
      moduleLabel: 'Kullanıcı Modülü',
      level: 'MANAGE',
      permissions: ['VIEW_USERS', 'EDIT_USERS', 'MANAGE_USERS'],
    });
  }

  return permissions;
};

const deriveModuleLevelFromPermissions = (
  moduleKey: string | undefined,
  permissions: string[],
  roleName?: string,
): UserModuleAccessLevel => {
  const normalizedPermissions = permissions.map((code) => code.toUpperCase());
  const normalizedRole = roleName?.toUpperCase();

  if (moduleKey && normalizedRole) {
    const roles = MODULE_LEVEL_ROLE_MAP[moduleKey];
    if (roles) {
      const levelPriority: UserModuleAccessLevel[] = ['MANAGE', 'EDIT', 'VIEW'];
      for (const level of levelPriority) {
        const mappedRole = roles[level];
        if (mappedRole && normalizedRole === mappedRole.toUpperCase()) {
          return level;
        }
      }
    }
  }

  if (normalizedPermissions.some((code) => code.startsWith('MANAGE_') || code.startsWith('APPROVE_'))) {
    return 'MANAGE';
  }
  if (normalizedPermissions.some((code) => code.startsWith('EDIT_'))) {
    return 'EDIT';
  }
  if (normalizedPermissions.some((code) => code.startsWith('VIEW_'))) {
    return 'VIEW';
  }

  if (normalizedRole) {
    if (normalizedRole.includes('MANAGER') || normalizedRole.includes('OPERATOR') || normalizedRole.includes('ADMIN')) {
      return 'MANAGE';
    }
    if (normalizedRole.includes('EDITOR')) {
      return 'EDIT';
    }
    if (normalizedRole.includes('VIEW')) {
      return 'VIEW';
    }
  }

  return 'NONE';
};

export const fetchUsers = async (
  params: UsersQueryParams,
  scope?: RequestScope,
): Promise<UsersApiResponse> => {
  let payload: UsersResponseWire;

  // Eğer global fetch stub'ı varsa (test ortamları), axios yerine doğrudan fetch kullan
  if (typeof fetch === 'function') {
    const headers = mergeHeaders(scope) as Record<string, string>;
    const fetchBase = getFetchBaseUrl();
    try {
      const response = await fetch(`${fetchBase}/api/v1/users${buildQueryString(params)}`, {
        headers,
      });
      if (!response.ok) {
        if (UNAUTHORIZED_STATUS.has(response.status)) {
          return Object.assign(buildEmptyUsersResponse(params), {
            meta: { reason: 'unauthorized' as const },
          });
        }
        return Object.assign(buildEmptyUsersResponse(params), {
          meta: { reason: 'network-error' as const },
        });
      }
      payload = ((await response.json()) ?? {}) as UsersResponseWire;
    } catch {
      return Object.assign(buildEmptyUsersResponse(params), {
        meta: { reason: 'network-error' as const },
      });
    }
    return normalizeUsersResponse(payload, params);
  }

  try {
    const client = resolveHttpClient();
    const response = await client.get<UsersResponseWire>(
      `${USERS_BASE_URL}${buildQueryString(params)}`,
      { headers: mergeHeaders(scope) },
    );
    payload = response.data ?? {};
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      if (!error.response) {
        console.warn('[usersApi] Kullanıcı listesi alınamadı, bağlantı hatası.', error);
        return Object.assign(buildEmptyUsersResponse(params), {
          meta: { reason: 'network-error' as const },
        });
      }
      if (UNAUTHORIZED_STATUS.has(status)) {
        console.warn(
          '[usersApi] Kullanıcı listesi yetkisiz döndü. Boş sonuç ile devam ediliyor.',
        );
        return Object.assign(buildEmptyUsersResponse(params), {
          meta: { reason: 'unauthorized' as const },
        });
      }
      const parsed = await parseErrorResponse(error);
      reportError('Kullanıcı listesi', parsed);
      throw new Error(parsed.message);
    }
    console.warn('[usersApi] Kullanıcı listesi alınamadı, bilinmeyen hata.', error);
    return Object.assign(buildEmptyUsersResponse(params), {
      meta: { reason: 'network-error' as const },
    });
  }

  const items = Array.isArray(payload.items)
    ? payload.items.map((userItem) => {
        const user = userItem as UserSummaryWire;
        const role = typeof user.role === 'string' ? user.role : 'USER';
        const rawModulePermissions = Array.isArray(user.modulePermissions)
          ? user.modulePermissions
          : [];

        const normalizedModulePermissions: UserModulePermission[] = rawModulePermissions
          .filter(isPermissionWire)
          .map((permission) => {
            const moduleKey = toStringOrFallback(
              permission.moduleKey ?? permission.key ?? permission.module ?? '',
            );
            const rawPermissions = Array.isArray(permission.permissions)
              ? permission.permissions.map((code) => toStringOrFallback(code, '').toUpperCase())
              : [];
            let level = normalizeAccessLevel(permission.level);

            if (level === 'NONE') {
              if (rawPermissions.includes('MANAGE_USERS')) {
                level = 'MANAGE';
              } else if (rawPermissions.includes('EDIT_USERS')) {
                level = 'EDIT';
              } else if (rawPermissions.includes('VIEW_USERS')) {
                level = 'VIEW';
              } else if (typeof permission.roleName === 'string') {
                const normalizedRole = permission.roleName.toUpperCase();
                if (['USER_MANAGER', 'ADMIN', 'OWNER'].includes(normalizedRole)) {
                  level = 'MANAGE';
                } else if (['USER_EDITOR', 'EDITOR'].includes(normalizedRole)) {
                  level = 'EDIT';
                } else if (['USER_VIEWER', 'VIEWER'].includes(normalizedRole)) {
                  level = 'VIEW';
                }
              }
            }

            return {
              moduleKey,
              moduleLabel: permission.moduleLabel ?? permission.label ?? permission.moduleName,
              level,
              assignmentId: permission.assignmentId ? String(permission.assignmentId) : undefined,
              roleName: permission.roleName,
              permissions: rawPermissions,
              companyId: permission.companyId ? String(permission.companyId) : undefined,
            };
          })
          .filter((permission: UserModulePermission) => permission.moduleKey.length > 0);

        const modulePermissions = ensureAdminUserModulePermission(
          normalizedModulePermissions,
          role,
        );

        return {
          id: String(user.id ?? ''),
          fullName: toStringOrFallback(user.name ?? user.fullName ?? user.email, 'Bilinmeyen Kullanıcı'),
          email: toStringOrFallback(user.email, ''),
          role,
          status: user.enabled === false ? 'INACTIVE' : 'ACTIVE',
          lastLoginAt: (user.lastLogin ?? user.lastLoginAt ?? null) as string | null,
          createdAt: (user.createDate ?? user.createdAt ?? null) as string | null,
          sessionTimeoutMinutes: typeof user.sessionTimeoutMinutes === 'number'
            ? user.sessionTimeoutMinutes
            : 15,
          modulePermissions,
        };
      })
    : [];

  return {
    items,
    total: typeof payload.total === 'number' ? payload.total : items.length,
    page: typeof payload.page === 'number' ? payload.page : params.page ?? 1,
    pageSize: typeof payload.pageSize === 'number' ? payload.pageSize : params.pageSize ?? items.length,
    meta: { reason: 'success' },
  };
};

export const fetchUserDetail = async (
  user: { id: string; email: string },
  scope?: RequestScope,
): Promise<UserDetail> => {
  const headers = mergeHeaders(scope);

  if (typeof fetch === 'function') {
    const fetchBase = getFetchBaseUrl();
    try {
      const userResponse = await fetch(
        `${fetchBase}/api/v1/users/by-email?email=${encodeURIComponent(user.email)}`,
        { headers: headers as Record<string, string> },
      );
      if (!userResponse.ok) {
        if (UNAUTHORIZED_STATUS.has(userResponse.status)) {
          return buildFallbackUserDetail(user);
        }
        return buildFallbackUserDetail(user);
      }
      const userData = (await userResponse.json()) as UserDetailWire;
      let assignments: AssignmentWire[] = [];
      try {
        const permResponse = await fetch(
          `${fetchBase}/api/v1/permissions/assignments?userId=${encodeURIComponent(user.id)}`,
          { headers: headers as Record<string, string> },
        );
        if (permResponse.ok) {
          const assignmentPayload = await permResponse.json();
          assignments = Array.isArray(assignmentPayload)
            ? assignmentPayload.filter(isPermissionWire).map((item) => item as AssignmentWire)
            : [];
        }
      } catch {
        // ignore; fallback handled below
      }
      return normalizeUserDetail(userData, assignments, user);
    } catch {
      return buildFallbackUserDetail(user);
    }
  }

  let userData: UserDetailWire;
  try {
    const client = resolveHttpClient();
    const response = await client.get<UserDetailWire>(
      `${USERS_BASE_URL}/by-email?email=${encodeURIComponent(user.email)}`,
      { headers },
    );
    userData = response.data as UserDetailWire;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      if (!error.response || UNAUTHORIZED_STATUS.has(status)) {
        console.warn('[usersApi] Kullanıcı detayı alınamadı, demo veri döndürülüyor.', error);
        return buildFallbackUserDetail(user);
      }
      const parsed = await parseErrorResponse(error);
      reportError('Kullanıcı bilgisi', parsed);
      throw new Error(parsed.message);
    }
    return buildFallbackUserDetail(user);
  }

  let assignments: AssignmentWire[] = [];
  try {
    const client = resolveHttpClient();
    const response = await client.get<unknown>(
      `${PERMISSIONS_BASE_URL}/assignments?userId=${encodeURIComponent(user.id)}`,
      { headers },
    );
    const assignmentPayload = response.data;
    assignments = Array.isArray(assignmentPayload)
      ? assignmentPayload.filter(isPermissionWire).map((item) => item as AssignmentWire)
      : [];
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      if (!UNAUTHORIZED_STATUS.has(status)) {
        console.warn('[usersApi] Yetki listesi alınamadı, boş devam ediliyor.', error);
      }
    } else {
      console.warn('[usersApi] Yetki listesi alınamadı, boş devam ediliyor.', error);
    }
  }

  return normalizeUserDetail(userData, assignments, user);
};

type UpdateUserPayload = {
  role?: string;
  enabled?: boolean;
  sessionTimeoutMinutes?: number;
};

export const updateUser = async (
  args: { userId: string; payload: UpdateUserPayload; scope?: RequestScope },
) => {
  try {
    const client = resolveHttpClient();
    const response = await client.put(
      `${USERS_BASE_URL}/${encodeURIComponent(args.userId)}`,
      args.payload,
      { headers: mergeHeaders(args.scope) },
    );
    return response.data;
  } catch (error) {
    const parsed = await parseErrorResponse(isAxiosError(error) ? error : undefined);
    reportError('Kullanıcı bilgisi güncelleme', parsed);
    throw new Error(parsed.message);
  }
};

export const updateUserRole = async (
  args: { userId: string; role: string; scope?: RequestScope },
) => updateUser({ userId: args.userId, payload: { role: args.role }, scope: args.scope });

const mapLevelToRole = (moduleKey: string, level: UserModuleAccessLevel): string => {
  const moduleRoles = MODULE_LEVEL_ROLE_MAP[moduleKey] ?? MODULE_LEVEL_ROLE_MAP.USER_MANAGEMENT;
  const roleName = moduleRoles[level];
  if (!roleName) {
    throw new Error('Bu modül için seçilen yetki seviyesi desteklenmiyor.');
  }
  return roleName;
};

export const updateUserModuleAccess = async (
  args: { userId: string; moduleKey: string; level: UserModuleAccessLevel; performedBy?: string; companyId?: string; allowGlobalScope?: boolean; scope?: RequestScope },
) => {
  const contextScope = args.scope ?? getStoredScope();
  const targetCompanyId = args.companyId;
  const payload: Record<string, unknown> = {
    userId: args.userId,
    companyId: targetCompanyId ?? undefined,
    projectId: contextScope.projectId,
    warehouseId: contextScope.warehouseId,
    roleName: mapLevelToRole(args.moduleKey, args.level),
  };
  if (args.performedBy !== undefined && args.performedBy !== null) {
    const numericPerformer = Number(args.performedBy);
    payload.performedBy = Number.isFinite(numericPerformer) ? numericPerformer : args.performedBy;
  }
  try {
    const client = resolveHttpClient();
    const response = await client.post(`${PERMISSIONS_BASE_URL}/assignments/update`, payload, {
      headers: mergeHeaders(args.scope),
    });
    return response.data;
  } catch (error) {
    const parsed = await parseErrorResponse(isAxiosError(error) ? error : undefined);
    reportError('Modül yetkisi güncelleme', parsed);
    throw new Error(parsed.message);
  }
};

export const revokeUserModuleAccess = async (
  args: { assignmentId: string; performedBy?: string; scope?: RequestScope },
) => {
  if (!args.assignmentId) {
    throw new Error('Atama bilgisi bulunamadı.');
  }
  const query = args.performedBy ? `?performedBy=${encodeURIComponent(args.performedBy)}` : '';
  try {
    const client = resolveHttpClient();
    await client.delete(
      `${PERMISSIONS_BASE_URL}/assignments/${encodeURIComponent(args.assignmentId)}${query}`,
      { headers: mergeHeaders(args.scope) },
    );
  } catch (error) {
    const parsed = await parseErrorResponse(isAxiosError(error) ? error : undefined);
    reportError('Modül yetkisi kaldırma', parsed);
    throw new Error(parsed.message);
  }
};

export const toggleUserStatus = async (
  args: { userId: string; enabled: boolean; scope?: RequestScope },
): Promise<UserMutationAck> => {
  try {
    const client = resolveHttpClient();
    const response = await client.put(
      `${USERS_BASE_URL}/${encodeURIComponent(args.userId)}/activation`,
      { active: args.enabled },
      { headers: mergeHeaders(args.scope) },
    );
    return response.data as UserMutationAck;
  } catch (error) {
    const parsed = await parseErrorResponse(isAxiosError(error) ? error : undefined);
    reportError('Kullanıcı durumu', parsed);
    throw new Error(parsed.message);
  }
};

export const triggerPasswordReset = async (
  args: { email: string },
) => {
  try {
    const client = resolveHttpClient();
    const response = await client.post(
      `${AUTH_BASE_URL}/password-resets`,
      { email: args.email },
      { headers: mergeHeaders() },
    );
    return response.data;
  } catch (error) {
    const parsed = await parseErrorResponse(isAxiosError(error) ? error : undefined);
    reportError('Parola sıfırlama', parsed);
    throw new Error(parsed.message);
  }
};
