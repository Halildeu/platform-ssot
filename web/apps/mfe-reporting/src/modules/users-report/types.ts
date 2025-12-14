import type { UserSummary } from '@mfe/shared-types';

export type UsersReportFilters = {
  search: string;
  status: string;
};

export type UsersReportRow = UserSummary;
