/* ------------------------------------------------------------------ */
/*  Lib — Utility modules (auth, grid-variants, AG Grid license)       */
/* ------------------------------------------------------------------ */

export { setupAgGridLicense } from "./ag-grid-license";

export {
  getResolvedToken,
  registerTokenResolver,
  resetTokenResolver,
  buildAuthHeaders,
} from "./auth";
export type { TokenResolver } from "./auth";

export {
  registerGridVariantsTokenResolver,
  compareGridVariants,
  fetchGridVariants,
  createGridVariant,
  updateGridVariant,
  cloneGridVariant,
  updateVariantPreference,
  deleteGridVariant,
} from "./grid-variants";
export type {
  CreateGridVariantPayload,
  UpdateGridVariantPayload,
  CloneGridVariantPayload,
  UpdateVariantPreferencePayload,
} from "./grid-variants";
