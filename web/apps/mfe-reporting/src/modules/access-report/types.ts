export type AccessFilters = {
  search: string;
};

export type AccessRow = {
  id: string;
  roleName: string;
  description: string | null;
  memberCount: number;
  permissionCount: number;
  moduleSummary: string;
  updatedAt: string;
};
