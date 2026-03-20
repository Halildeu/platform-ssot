import type { PageBreadcrumbItem } from '@mfe/design-system';

export interface AccessPageManifest {
  pageId: string;
  layout: {
    title: string;
    description?: string;
    breadcrumbItems?: PageBreadcrumbItem[];
  };
  actions?: Array<{
    key: string;
    label: string;
    intent?: 'primary' | 'default' | 'ghost';
    requiresSelection?: 'none' | 'single' | 'multi';
    isComingSoon?: boolean;
    tooltip?: string;
  }>;
  grid: {
    columns: Array<{
      key: string;
      headerName: string;
      field: string;
      flex?: number;
      width?: number;
    }>;
  };
}

export const accessRolesPageManifest: AccessPageManifest = {
  pageId: 'access.roles',
  layout: {
    title: 'access.layout.title',
    description: 'access.layout.description',
    breadcrumbItems: [
      { title: 'access.breadcrumb.management' },
      { title: 'access.breadcrumb.access' },
      { title: 'access.breadcrumb.roles' }
    ]
  },
  actions: [
    {
      key: 'create-role',
      label: 'access.actions.create',
      intent: 'primary',
      isComingSoon: true,
      tooltip: 'access.actions.create.tooltip'
    },
    {
      key: 'clone-role',
      label: 'access.actions.clone',
      requiresSelection: 'single',
      tooltip: 'access.actions.clone.tooltip'
    },
    {
      key: 'bulk-permission',
      label: 'access.actions.bulk',
      requiresSelection: 'multi',
      tooltip: 'access.actions.bulk.tooltip'
    }
  ],
  grid: {
    columns: [
      {
        key: 'name',
        headerName: 'access.grid.columns.name',
        field: 'name',
        flex: 1.2
      },
      {
        key: 'memberCount',
        headerName: 'access.grid.columns.memberCount',
        field: 'memberCount',
        width: 140
      },
      {
        key: 'moduleSummary',
        headerName: 'access.grid.columns.moduleSummary',
        field: 'moduleSummary',
        flex: 1.6
      },
      {
        key: 'displayLastModified',
        headerName: 'access.grid.columns.lastModified',
        field: 'displayLastModified',
        flex: 1.3
      }
    ]
  }
};

export default accessRolesPageManifest;
