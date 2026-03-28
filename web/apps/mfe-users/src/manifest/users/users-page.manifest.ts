import type { PageBreadcrumbItem, PageLayoutProps } from '@mfe/design-system';

export interface UsersPageManifest {
  pageId: string;
  routePath: string;
  requiredPermissions: string[];
  layout: Pick<PageLayoutProps, 'title' | 'description' | 'breadcrumbItems'>;
  widgets: {
    primary: 'UsersModule';
  };
}

export const usersPageManifest: UsersPageManifest = {
  pageId: 'users.management',
  routePath: '/users',
  requiredPermissions: ['VIEW_USERS'],
  layout: {
    title: 'users.layout.title',
    description: 'users.layout.description',
    breadcrumbItems: [
      { title: 'users.breadcrumb.management' } as PageBreadcrumbItem,
      { title: 'users.breadcrumb.users' } as PageBreadcrumbItem,
    ],
  },
  widgets: {
    primary: 'UsersModule',
  },
};

export default usersPageManifest;
