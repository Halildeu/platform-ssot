import { GridVariant, GridVariantState } from '@mfe/shared-types';
import { registerTokenResolver as registerSharedTokenResolver } from '../auth/token-resolver';
type VariantDto = {
    id?: string | number;
    gridId?: string;
    name?: string;
    state?: unknown;
    isDefault?: boolean;
    isGlobal?: boolean;
    isGlobalDefault?: boolean;
    isUserDefault?: boolean;
    isUserSelected?: boolean;
    isCompatible?: boolean;
    sortOrder?: number;
    schemaVersion?: number;
    createdAt?: string;
    updatedAt?: string;
};
export interface CreateGridVariantPayload {
    gridId: string;
    name: string;
    isDefault: boolean;
    isGlobal: boolean;
    isGlobalDefault: boolean;
    schemaVersion: number;
    state: GridVariantState;
    isUserDefault?: boolean;
    isUserSelected?: boolean;
}
export interface UpdateGridVariantPayload {
    id: string;
    gridId?: string;
    name?: string;
    isDefault?: boolean;
    isGlobal?: boolean;
    isGlobalDefault?: boolean;
    schemaVersion?: number;
    state?: GridVariantState;
    isUserDefault?: boolean;
    isUserSelected?: boolean;
}
export interface CloneGridVariantPayload {
    variantId: string;
    name?: string;
    setDefault?: boolean;
    setSelected?: boolean;
}
export interface UpdateVariantPreferencePayload {
    variantId: string;
    gridId?: string;
    isDefault?: boolean;
    isSelected?: boolean;
}
export declare const registerGridVariantsTokenResolver: (resolver?: Parameters<typeof registerSharedTokenResolver>[0]) => void;
export declare const mapVariantDtoToGridVariant: (dto: VariantDto) => GridVariant;
export declare const compareGridVariants: (a: GridVariant, b: GridVariant) => number;
/**
 * Global cache listeners — admin global variant değiştirdiğinde diğer
 * kullanıcılara bildirim göndermek için.
 */
type GlobalChangeListener = (gridId: string, changed: GridVariant[]) => void;
/** Global variant değişiklik dinleyicisi kaydet */
export declare const onGlobalVariantChange: (listener: GlobalChangeListener) => (() => void);
export declare const fetchGridVariants: (gridId: string) => Promise<GridVariant[]>;
export declare const createGridVariant: (payload: CreateGridVariantPayload) => Promise<GridVariant>;
export declare const updateGridVariant: (payload: UpdateGridVariantPayload) => Promise<GridVariant>;
export declare const cloneGridVariant: (payload: CloneGridVariantPayload) => Promise<GridVariant>;
export declare const updateVariantPreference: (payload: UpdateVariantPreferencePayload) => Promise<GridVariant>;
export declare const deleteGridVariant: (id: string) => Promise<void>;
export {};
