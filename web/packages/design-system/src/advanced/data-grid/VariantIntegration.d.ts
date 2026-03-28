/**
 * VariantIntegration — Grid variant save/load/clone with personal/global management.
 *
 * Responsibilities:
 * - Connects to useGridVariants hook (lib/grid-variants)
 * - Collects grid column/filter/sort state via GridApi
 * - Applies saved variant state to grid
 * - Provides variant dropdown selector (optgroup: personal/global)
 * - Provides compact accordion-based variant manager panel
 * - Handles variant CRUD, promote/demote, default management
 *
 * v34 API notes:
 * - getColumnState() / applyColumnState() on GridApi (not ColumnApi)
 * - getFilterModel() / setFilterModel()
 * - getAdvancedFilterModel() / setAdvancedFilterModel()
 */
import React from "react";
import { type AccessControlledProps } from '../../internal/access-controller';
import type { GridApi } from "ag-grid-community";
export interface GridVariantState {
    columnState?: unknown[];
    filterModel?: Record<string, unknown>;
    advancedFilterModel?: unknown;
    sortModel?: unknown[];
    pivotMode?: boolean;
    quickFilterText?: string;
}
export interface GridVariant {
    id: string;
    gridId: string;
    name: string;
    state: GridVariantState;
    isDefault?: boolean;
    isGlobal?: boolean;
    isGlobalDefault?: boolean;
    isUserDefault?: boolean;
    isUserSelected?: boolean;
    isCompatible?: boolean;
    schemaVersion?: number;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}
export interface VariantIntegrationMessages {
    variantLabel?: string;
    variantPlaceholder?: string;
    variantNewButtonLabel?: string;
    variantNamePlaceholder?: string;
    variantModalTitle?: string;
    defaultVariantName?: string;
    personalVariantsTitle?: string;
    globalVariantsTitle?: string;
    personalVariantsEmptyLabel?: string;
    globalVariantsEmptyLabel?: string;
    menuSelectLabel?: string;
    menuRenameLabel?: string;
    menuSetDefaultLabel?: string;
    menuUnsetDefaultLabel?: string;
    menuSetGlobalDefaultLabel?: string;
    menuUnsetGlobalDefaultLabel?: string;
    menuMoveToGlobalLabel?: string;
    menuMoveToPersonalLabel?: string;
    menuDeleteLabel?: string;
    saveCurrentStateLabel?: string;
    saveLabel?: string;
    cancelLabel?: string;
    selectedTagLabel?: string;
    personalTagLabel?: string;
    personalDefaultTagLabel?: string;
    globalPublicTagLabel?: string;
    globalPublicDefaultTagLabel?: string;
    incompatibleTagLabel?: string;
    showDetailsLabel?: string;
    hideDetailsLabel?: string;
    variantActionsLabel?: string;
    moveToPersonalTitle?: string;
    moveToGlobalTitle?: string;
    saveCurrentLayoutTitle?: string;
    saveTitle?: string;
    variantSavedLabel?: string;
    variantSaveFailedLabel?: string;
    variantCreatedLabel?: string;
    variantCreateFailedLabel?: string;
    variantDeletedLabel?: string;
    variantDeleteFailedLabel?: string;
    variantPromotedToGlobalLabel?: string;
    variantDemotedToPersonalLabel?: string;
    variantGlobalStatusUpdateFailedLabel?: string;
    defaultViewEnabledLabel?: string;
    defaultViewDisabledLabel?: string;
    defaultStateUpdateFailedLabel?: string;
    deleteVariantConfirmationLabel?: string;
    closeVariantManagerLabel?: string;
    variantNameEmptyLabel?: string;
    variantNameUpdatedLabel?: string;
    variantNameUpdateFailedLabel?: string;
}
/** Props for the VariantIntegration component. */
export interface VariantIntegrationProps<RowData = unknown> extends AccessControlledProps {
    /** Grid ID for variant isolation */
    gridId: string;
    /** Grid schema version for compatibility check */
    gridSchemaVersion: number;
    /** Reference to current GridApi */
    gridApi: GridApi<RowData> | null;
    /** Active variant ID */
    activeVariantId?: string;
    /** Variant change callback */
    onActiveVariantChange?: (variantId: string | null) => void;
    /** i18n messages */
    messages?: VariantIntegrationMessages;
    /** Whether the current user can promote personal variants to global */
    canPromoteToGlobal?: boolean;
    /** Whether the current user can demote global variants to personal */
    canDemoteToPersonal?: boolean;
    /** Whether the current user can delete global variants */
    canDeleteGlobal?: boolean;
    /** Additional CSS class for custom styling */
    className?: string;
}
/** Grid variant manager for saving, loading, and switching named column/filter configurations.
 * @example
 * ```tsx
 * <VariantIntegration />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/variant-integration)
 */
export declare const VariantIntegration: {
    <RowData = unknown>({ gridId, gridSchemaVersion, gridApi, activeVariantId: controlledVariantId, onActiveVariantChange, messages, canPromoteToGlobal, canDemoteToPersonal, canDeleteGlobal, access, accessReason, }: VariantIntegrationProps<RowData>): React.ReactElement;
    displayName: string;
};
export default VariantIntegration;
