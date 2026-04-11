/**
 * Maps Zanzibar authorization results to Design System AccessLevel.
 *
 * Auth domain:  'NONE' | 'VIEW' | 'MANAGE' + allowed/denied
 * UI domain:    'full' | 'readonly' | 'disabled' | 'hidden'
 *
 * Design-system components are authz-agnostic — they only consume
 * access/accessReason props. This adapter bridges the gap.
 *
 * D-007 compliance: UI only controls visibility/affordance.
 * Data filtering/enforcement stays in backend/OpenFGA.
 */

/** Result of a Zanzibar access check. */
export type ZanzibarAccessResult = {
  /** Whether the relation check was allowed. */
  allowed: boolean;
  /** The highest relation the user has (if allowed). */
  relation: 'can_manage' | 'can_view' | 'can_edit' | null;
  /** Whether the check is still loading. */
  loading: boolean;
  /** Error message if check failed. */
  error: string | null;
};

/** Design-system compatible access level. */
export type UIAccessLevel = 'full' | 'readonly' | 'disabled' | 'hidden';

export interface ZanzibarAccessProps {
  access: UIAccessLevel;
  accessReason?: string;
}

/**
 * Resolve a Zanzibar check result into Design System AccessControlledProps.
 *
 * Mapping:
 * - loading → 'disabled' (prevent interaction while checking)
 * - error → 'disabled' with error reason
 * - allowed + can_manage → 'full'
 * - allowed + can_edit → 'full'
 * - allowed + can_view → 'readonly'
 * - allowed + no specific relation → 'readonly' (safe default)
 * - denied → 'hidden' (don't show what user can't access)
 */
export function resolveZanzibarAccessProps(
  result: ZanzibarAccessResult,
  options?: {
    /** Override: show disabled instead of hidden for denied. */
    showDisabledOnDeny?: boolean;
    /** Custom reason text for denied state. */
    denyReason?: string;
    /** Custom reason text for loading state. */
    loadingReason?: string;
  },
): ZanzibarAccessProps {
  const {
    showDisabledOnDeny = false,
    denyReason = 'Bu kaynağa erişim yetkiniz yok.',
    loadingReason = 'Yetki kontrol ediliyor...',
  } = options ?? {};

  if (result.loading) {
    return { access: 'disabled', accessReason: loadingReason };
  }

  if (result.error) {
    return { access: 'disabled', accessReason: result.error };
  }

  if (!result.allowed) {
    return {
      access: showDisabledOnDeny ? 'disabled' : 'hidden',
      accessReason: denyReason,
    };
  }

  // Allowed — determine level
  switch (result.relation) {
    case 'can_manage':
    case 'can_edit':
      return { access: 'full' };
    case 'can_view':
      return { access: 'readonly', accessReason: 'Görüntüleme yetkisi — düzenleme için yönetici yetkisi gerekli.' };
    default:
      // Allowed but no specific relation — safe default
      return { access: 'readonly' };
  }
}
