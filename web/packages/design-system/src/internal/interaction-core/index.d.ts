/**
 * @unstable These exports are NOT covered by semver guarantees.
 * They may change or be removed in any minor/patch release.
 * Prefer `@mfe/design-system/headless` for stable alternatives.
 *
 * Import path: `@mfe/design-system/unstable/interaction-core`
 */
export { stateAttrs, stateSelector, type StateAttributeOptions, type StateAttributes, type ComponentState, type ComponentStatus, } from "./state-attributes";
export { focusRingClass, focusRingClassWithColor, defaultFocusStrategy, isKeyboardInteraction, FOCUS_TRAP_ATTR, type FocusStrategy, } from "./focus-policy";
export { Keys, KEYBOARD_CONTRACTS, createKeyHandler, describeKeyboardContract, type KeyConstant, type KeyboardAction, type KeyBinding, type ComponentKeyboardContract, } from "./keyboard-contract";
export { evaluateGuard, guardEvent, guardStyles, guardAria, type EventGuardOptions, type EventGuardResult, } from "./event-guard";
export { resolveKeyboardIntent, resolveClickIntent, type SemanticIntent, type NavigationDirection, type ResolvedIntent, } from "./semantic-intent";
export { resolveAccessState, shouldBlockInteraction, withAccessGuard, accessStyles, type AccessLevel, type AccessControlledProps, type AccessResolution, } from "../access-controller";
