import { UserAccountStatus, UserSummary, UserDetail, UserModuleAccessLevel } from '@mfe/shared-types';

export interface UsersQueryParams {
  search?: string;
  // Advanced Filter modelini backend'e iletmek için JSON string (url-encoded önerilir)
  advancedFilter?: string;
  // Çoklu sıralama: field,dir;field2,dir2
  sort?: string;
  status?: UserAccountStatus | 'ALL';
  role?: string | 'ALL';
  moduleKey?: string;
  moduleLevel?: UserModuleAccessLevel | 'ALL';
  page?: number;
  pageSize?: number;
}

export interface UsersFilters {
  search: string;
  status: UsersQueryParams['status'];
  role: UsersQueryParams['role'];
  moduleKey: string;
  moduleLevel: UsersQueryParams['moduleLevel'];
}

export interface UsersQueryResult {
  users: UserSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export type UserWithDetail = UserDetail;
