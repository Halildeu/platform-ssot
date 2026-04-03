/**
 * Design System Core
 *
 * Internal foundation layer — used by all primitives, components, and patterns.
 * NOT part of public API (consumers use typed component props instead).
 */

// Variant engine
export {
  variants,
  slotVariants,
  type VariantProps,
  type VariantConfig,
  type VariantFn,
} from "./variants";

// Composition utilities
export {
  composeRefs,
  composeEventHandlers,
  mergeProps,
  setDisplayName,
  type AsChildProps,
  type PolymorphicProps,
} from "./compose";

// Data attribute helpers (re-export from interaction-core)
export { stateAttrs, stateSelector } from "../internal/interaction-core/state-attributes";
export { resolveAccessState, shouldBlockInteraction, withAccessGuard, accessStyles } from "../internal/access-controller";
export type { AccessLevel, AccessControlledProps, AccessResolution } from "../internal/access-controller";
