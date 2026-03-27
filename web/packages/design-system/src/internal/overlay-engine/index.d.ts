/**
 * @unstable These exports are NOT covered by semver guarantees.
 * They may change or be removed in any minor/patch release.
 * Prefer `@mfe/design-system/headless` for stable alternatives.
 *
 * Import path: `@mfe/design-system/unstable/overlay-engine`
 */
export { resolveOverlayPosition, resolveOverlayArrowPositionClassName, type OverlaySide, type OverlayAlign, type OverlayPosition, } from "../OverlayPositioning";
export { OverlaySurface, premiumOverlayPanelClassName, premiumOverlayCloseButtonClassName, type OverlayCloseReason, } from "../OverlaySurface";
export { registerLayer, unregisterLayer, getTopZIndex, isTopLayer, getLayerStack, resetLayerStack, Z_INDEX_BASE, type ZIndexLayer, } from "./layer-stack";
export { useFocusTrap, FocusTrap, type UseFocusTrapOptions, type FocusTrapProps, } from "./focus-trap";
export { useScrollLock, lockScroll, unlockScroll, getScrollLockCount, resetScrollLock, } from "./scroll-lock";
export { useOutsideClick, useEscapeKey, type UseOutsideClickOptions, } from "./outside-click";
export { announce, useAnnounce, AriaLiveRegion, type AriaLivePoliteness, } from "./aria-live";
export { useRovingTabindex, type UseRovingTabindexOptions, type RovingTabindexReturn, type RovingDirection, } from "./roving-tabindex";
export { Portal, usePortal as useLegacyPortal, type PortalProps, } from "./portal";
export { usePortal, type UsePortalOptions, } from "./usePortal";
export { PortalProvider, usePortalConfig, } from "./PortalProvider";
export { useFocusRestore } from "./useFocusRestore";
export { useReducedMotion, prefersReducedMotion, motionDuration, REDUCED_MOTION_CLASS, } from "./reduced-motion";
