export interface AuditEventsManifest {
  pageId: string;
  layout: {
    title: string;
    description?: string;
    breadcrumbItems?: Array<{ title: string; path?: string }>;
  };
  filters: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
  grid: {
    columns: Array<{ key: string; headerName: string; field: string; width?: number; flex?: number }>;
  };
  drawer: {
    tabs: Array<{ key: string; label: string }>;
  };
}

export const auditEventsManifest = {
  id: 'audit-events',
  featureFlag: 'audit_feed_enabled',
  route: {
    path: '/audit/events',
    element: 'AuditApp',
  },
  page: {
    title: 'audit.layout.title',
    description: 'audit.layout.description',
    breadcrumbItems: [
      { title: 'audit.breadcrumb.observability' },
      { title: 'audit.breadcrumb.audit' },
      { title: 'audit.breadcrumb.events' }
    ]
  },
  filters: [
    { key: 'userEmail', label: 'audit.filters.user', type: 'text' },
    { key: 'service', label: 'audit.filters.service', type: 'text' },
    {
      key: 'level',
      label: 'audit.filters.level',
      type: 'select',
      options: [
        { value: '', label: 'audit.filters.level.all' },
        { value: 'INFO', label: 'audit.filters.level.info' },
        { value: 'WARN', label: 'audit.filters.level.warn' },
        { value: 'ERROR', label: 'audit.filters.level.error' }
      ]
    }
  ],
  grid: {
    columns: [
      { key: 'timestamp', headerName: 'audit.grid.timestamp', field: 'timestamp', flex: 1.4 },
      { key: 'userEmail', headerName: 'audit.grid.user', field: 'userEmail', flex: 1 },
      { key: 'service', headerName: 'audit.grid.service', field: 'service', flex: 1 },
      { key: 'action', headerName: 'audit.grid.action', field: 'action', flex: 1.2 },
      { key: 'level', headerName: 'audit.grid.level', field: 'level', width: 120 },
      { key: 'correlationId', headerName: 'audit.grid.correlation', field: 'correlationId', flex: 1 }
    ]
  },
  drawer: {
    tabs: [
      { key: 'summary', label: 'audit.drawer.summary' },
      { key: 'diff', label: 'audit.drawer.diff' },
      { key: 'raw', label: 'audit.drawer.raw' }
    ]
  }
} satisfies AuditEventsManifest;

export default auditEventsManifest;
