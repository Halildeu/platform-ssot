import type { GridVariant } from '@mfe/shared-types';
import type {
  UpdateGridVariantPayload,
  UpdateVariantPreferencePayload,
} from './variants.api';

export interface ToggleVariantDefaultDeps {
  updateVariant: (payload: UpdateGridVariantPayload) => Promise<GridVariant>;
  updatePreference: (payload: UpdateVariantPreferencePayload) => Promise<GridVariant>;
}

/**
 * Determines which persistence endpoint should be invoked when toggling a variant's default state.
 * Personal (non-global) varyants store varsayılan bilgisini kendi kayıtları üzerinde (`isDefault`),
 * bu nedenle doğrudan varyant güncelleme servisine gitmek gerekir. Global varyantlarda ise kullanıcı
 * tercihleri `preference` servisi ile tutulur.
 */
export const toggleVariantDefault = async (
  variant: GridVariant,
  makeDefault: boolean,
  { updateVariant, updatePreference }: ToggleVariantDefaultDeps,
): Promise<GridVariant> => {
  if (!variant.isGlobal) {
    return updateVariant({
      id: variant.id,
      isDefault: makeDefault,
      // `gridId` opsiyonel ancak yerel fallback senaryosunda gerekli olabiliyor.
      gridId: variant.gridId,
    });
  }

  return updatePreference({
    variantId: variant.id,
    isDefault: makeDefault,
    isSelected: makeDefault || undefined,
  });
};
