const reports = {
  'reports.nav.users': 'Users',
  'reports.nav.access': 'Access',
  'reports.nav.audit': 'Audit',
  'reports.breadcrumb.root': 'Reports',

  'reports.toolbar.refresh': 'Refresh data',
  'reports.toolbar.exportCsv': 'Export CSV',

  'reports.filters.apply': 'Apply filters',
  'reports.filters.reset': 'Reset',
  'reports.filters.all': 'All',
  'reports.filters.search.placeholder': 'Search by name, email or ID',
  'reports.filters.status.placeholder': 'Status',
  'reports.filters.level.placeholder': 'Severity',

  'reports.status.active': 'Active',
  'reports.status.inactive': 'Inactive',
  'reports.status.invited': 'Invited',
  'reports.status.suspended': 'Suspended',

  'reports.detail.empty': 'Select a record to see its details.',

  'reports.users': 'Users Report',
  'reports.users.title': 'User activity',
  'reports.users.description': 'Track user status, last login information and assigned roles.',
  'reports.users.breadcrumb': 'Users',
  'reports.users.columns.fullName': 'Full name',
  'reports.users.columns.email': 'Email',
  'reports.users.columns.role': 'Role',
  'reports.users.columns.status': 'Status',
  'reports.users.columns.lastLoginAt': 'Last login',
  'reports.users.columns.createdAt': 'Created at',

  'reports.access': 'Access Report',
  'reports.access.title': 'Role coverage',
  'reports.access.description': 'See how many users rely on each critical role.',
  'reports.access.breadcrumb': 'Access',
  'reports.access.columns.roleName': 'Role name',
  'reports.access.columns.memberCount': 'Members',
  'reports.access.columns.moduleSummary': 'Modules',
  'reports.access.columns.updatedAt': 'Updated at',
  'reports.access.comingSoon': 'Detailed access analytics will be available soon.',

  'reports.audit': 'Audit Report',
  'reports.audit.title': 'Audit trail',
  'reports.audit.description': 'Filter audit events by service, actor and severity.',
  'reports.audit.breadcrumb': 'Audit',
  'reports.audit.columns.eventId': 'Event ID',
  'reports.audit.columns.userEmail': 'User email',
  'reports.audit.columns.service': 'Service',
  'reports.audit.columns.action': 'Action',
  'reports.audit.columns.level': 'Level',
  'reports.audit.columns.timestamp': 'Timestamp',
  'reports.audit.comingSoon': 'The audit detail panel is under construction.',
};

export default reports;
