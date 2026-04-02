import type { UserSummary } from '@mfe/shared-types';

export type MonthlyLoginFilters = {
  search: string;
  month: string;
};

export type MonthlyLoginRow = UserSummary;
