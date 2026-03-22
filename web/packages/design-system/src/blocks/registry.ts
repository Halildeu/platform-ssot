import type { BlockMeta, BlockRegistry } from './types';

export const blockRegistry: BlockRegistry = {
  version: '1.0.0',
  blocks: [
    // Dashboard blocks
    { id: 'metric-card', name: 'MetricCard', category: 'dashboard', description: 'KPI metric card with trend indicator and sparkline', components: ['Card', 'Text', 'Badge'], tags: ['kpi', 'metric', 'dashboard', 'stat'] },
    { id: 'chart-panel', name: 'ChartPanel', category: 'dashboard', description: 'Chart container with title, toolbar, and responsive resize', components: ['Card', 'BarChart', 'LineChart'], tags: ['chart', 'graph', 'dashboard', 'analytics'] },
    { id: 'activity-feed', name: 'ActivityFeed', category: 'dashboard', description: 'Chronological activity list with avatar, timestamp, and action badges', components: ['Avatar', 'Text', 'Badge', 'Timeline'], tags: ['activity', 'feed', 'timeline', 'log'] },
    { id: 'kpi-grid', name: 'KPIGrid', category: 'dashboard', description: 'Responsive grid of KPI metric cards', components: ['Card', 'Text', 'Badge', 'Stack'], tags: ['kpi', 'grid', 'metrics', 'overview'] },
    { id: 'stat-widget', name: 'StatWidget', category: 'dashboard', description: 'Compact stat widget with icon, value, and change percentage', components: ['Card', 'Text', 'IconButton'], tags: ['stat', 'widget', 'number', 'compact'] },
    { id: 'overview-header', name: 'OverviewHeader', category: 'dashboard', description: 'Dashboard header with title, date range, and action buttons', components: ['PageHeader', 'Button', 'Select'], tags: ['header', 'dashboard', 'toolbar'] },

    // CRUD blocks
    { id: 'data-list', name: 'DataList', category: 'crud', description: 'Filterable data list with search, pagination, and row actions', components: ['Input', 'Select', 'Pagination', 'Button'], tags: ['list', 'data', 'search', 'pagination'] },
    { id: 'filter-panel', name: 'FilterPanel', category: 'crud', description: 'Side or top filter panel with multiple filter types', components: ['FilterBar', 'Input', 'Select', 'Checkbox', 'DatePicker', 'Button'], tags: ['filter', 'search', 'panel', 'sidebar'] },
    { id: 'detail-view', name: 'DetailView', category: 'crud', description: 'Entity detail view with sections, metadata, and action bar', components: ['DetailDrawer', 'Descriptions', 'Badge', 'Button', 'Tabs'], tags: ['detail', 'view', 'entity', 'info'] },
    { id: 'create-edit-form', name: 'CreateEditForm', category: 'crud', description: 'Create/edit form with validation, sections, and submit', components: ['FormDrawer', 'Input', 'Select', 'DatePicker', 'Button'], tags: ['form', 'create', 'edit', 'crud'] },
    { id: 'entity-table', name: 'EntityTable', category: 'crud', description: 'Full-featured data table with sort, filter, and export', components: ['EntityGridTemplate', 'FilterBar', 'Button'], tags: ['table', 'grid', 'data', 'sort', 'export'] },
    { id: 'bulk-action-bar', name: 'BulkActionBar', category: 'crud', description: 'Selection bar with count and bulk action buttons', components: ['Badge', 'Button', 'Stack'], tags: ['bulk', 'action', 'selection', 'toolbar'] },

    // Admin blocks
    { id: 'settings-panel', name: 'SettingsPanel', category: 'admin', description: 'Settings page with grouped switches and inputs', components: ['Card', 'Switch', 'Input', 'Select', 'Button'], tags: ['settings', 'config', 'preferences', 'admin'] },
    { id: 'user-management', name: 'UserManagement', category: 'admin', description: 'User list with search, role badges, and invite button', components: ['Input', 'Avatar', 'Badge', 'Button', 'Pagination'], tags: ['user', 'management', 'admin', 'roles'] },
    { id: 'role-matrix', name: 'RoleMatrix', category: 'admin', description: 'Permission matrix with role columns and feature rows', components: ['Checkbox', 'Text', 'Badge'], tags: ['role', 'permission', 'matrix', 'access'] },
    { id: 'notification-center', name: 'NotificationCenter', category: 'admin', description: 'Notification list with mark-read, filter, and clear all', components: ['Badge', 'Button', 'Tabs', 'Stack'], tags: ['notification', 'alert', 'inbox', 'admin'] },
    { id: 'audit-log', name: 'AuditLog', category: 'admin', description: 'Searchable audit log with actor, action, timestamp columns', components: ['Input', 'Select', 'Pagination', 'Badge'], tags: ['audit', 'log', 'history', 'admin'] },
    { id: 'system-health', name: 'SystemHealth', category: 'admin', description: 'System health dashboard with status indicators', components: ['Card', 'Badge', 'Text', 'Stack'], tags: ['health', 'status', 'monitoring', 'system'] },

    // Review blocks
    { id: 'approval-flow', name: 'ApprovalFlow', category: 'review', description: 'Multi-step approval workflow with status and actions', components: ['Steps', 'Badge', 'Button', 'Card'], tags: ['approval', 'workflow', 'review', 'steps'] },
    { id: 'audit-timeline', name: 'AuditTimeline', category: 'review', description: 'Audit trail timeline with actor, action, and timestamp', components: ['Timeline', 'Avatar', 'Badge', 'Text'], tags: ['audit', 'timeline', 'history', 'review'] },
    { id: 'comparison-view', name: 'ComparisonView', category: 'review', description: 'Side-by-side comparison with diff highlights', components: ['Card', 'Text', 'Badge', 'Tabs'], tags: ['compare', 'diff', 'review', 'side-by-side'] },
    { id: 'feedback-form', name: 'FeedbackForm', category: 'review', description: 'Feedback submission with rating, comment, and submit', components: ['Rating', 'Input', 'Button', 'Card'], tags: ['feedback', 'rating', 'review', 'comment'] },
    { id: 'review-checklist', name: 'ReviewChecklist', category: 'review', description: 'Checklist with progress tracking and sign-off', components: ['Checkbox', 'Badge', 'Button', 'Stack'], tags: ['checklist', 'review', 'progress', 'sign-off'] },
    { id: 'version-history', name: 'VersionHistory', category: 'review', description: 'Version list with rollback and comparison actions', components: ['Timeline', 'Badge', 'Button', 'Text'], tags: ['version', 'history', 'rollback', 'compare'] },

    // Form blocks
    { id: 'login-form', name: 'LoginForm', category: 'form', description: 'Login form with email, password, remember me, and SSO', components: ['Input', 'Checkbox', 'Button', 'Card'], tags: ['login', 'auth', 'form', 'signin'] },
    { id: 'registration-form', name: 'RegistrationForm', category: 'form', description: 'Registration form with validation and terms acceptance', components: ['Input', 'Select', 'Checkbox', 'Button'], tags: ['register', 'signup', 'form', 'onboard'] },
    { id: 'profile-form', name: 'ProfileForm', category: 'form', description: 'User profile edit form with avatar upload', components: ['Input', 'Select', 'Upload', 'Avatar', 'Button'], tags: ['profile', 'user', 'edit', 'form'] },
    { id: 'wizard-form', name: 'WizardForm', category: 'form', description: 'Multi-step form wizard with progress indicator', components: ['Steps', 'Input', 'Select', 'Button'], tags: ['wizard', 'stepper', 'multi-step', 'form'] },
    { id: 'search-form', name: 'SearchForm', category: 'form', description: 'Advanced search form with collapsible filters', components: ['SearchInput', 'Select', 'DatePicker', 'Button', 'Accordion'], tags: ['search', 'filter', 'advanced', 'form'] },

    // Layout blocks
    { id: 'sidebar-layout', name: 'SidebarLayout', category: 'layout', description: 'App shell with sidebar navigation and main content', components: ['PageLayout', 'NavigationRail', 'PageHeader'], tags: ['sidebar', 'layout', 'navigation', 'shell'] },
    { id: 'dashboard-layout', name: 'DashboardLayout', category: 'layout', description: 'Dashboard grid layout with responsive columns', components: ['PageLayout', 'PageHeader', 'Stack'], tags: ['dashboard', 'grid', 'layout', 'responsive'] },
    { id: 'master-detail-layout', name: 'MasterDetailLayout', category: 'layout', description: 'Master list with detail panel layout', components: ['MasterDetail', 'FilterBar', 'DetailDrawer'], tags: ['master', 'detail', 'layout', 'split'] },
  ],
};

/** Get all blocks */
export function getAllBlocks(): BlockMeta[] {
  return blockRegistry.blocks;
}

/** Get blocks by category */
export function getBlocksByCategory(category: BlockMeta['category']): BlockMeta[] {
  return blockRegistry.blocks.filter(b => b.category === category);
}

/** Search blocks by query */
export function searchBlocks(query: string): BlockMeta[] {
  const lower = query.toLowerCase();
  return blockRegistry.blocks.filter(b =>
    b.name.toLowerCase().includes(lower) ||
    b.description.toLowerCase().includes(lower) ||
    b.tags.some(t => t.includes(lower))
  ).slice(0, 10);
}

/** Get block by id */
export function getBlock(id: string): BlockMeta | undefined {
  return blockRegistry.blocks.find(b => b.id === id);
}
