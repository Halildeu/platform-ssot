/**
 * Backward-compat re-export. P1.9 moved the implementation to `@mfe/auth` so
 * both mfe-access (RoleDrawer per-permission "Why?" buttons) and mfe-shell
 * (UnauthorizedPage "Why can't I access?" — AC-0320 Senaryo 4) can share the
 * same modal, including the scope picker, without duplicating logic.
 *
 * New code should import directly from `@mfe/auth`.
 */
export { ExplainPermissionModal, ExplainPermissionModal as default } from '@mfe/auth';
export type { ExplainPermissionModalProps } from '@mfe/auth';
