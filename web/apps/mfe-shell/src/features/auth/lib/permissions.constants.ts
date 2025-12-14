export const PERMISSIONS = {
  USER_MANAGEMENT_MODULE: 'user-read',
  USER_MANAGEMENT_EDIT: 'user-update',
  USER_MANAGEMENT_RESET_PASSWORD: 'user-update',
  USER_MANAGEMENT_TOGGLE_STATUS: 'user-update',
  ACCESS_MODULE: 'access-read',
  AUDIT_MODULE: 'audit-read',
  REPORTING_MODULE: 'VIEW_REPORTS',
  THEME_ADMIN: 'THEME_ADMIN',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
