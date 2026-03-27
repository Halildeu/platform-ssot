/**
 * @unstable These exports are NOT covered by semver guarantees.
 * They may change or be removed in any minor/patch release.
 * Prefer `@mfe/design-system/headless` for stable alternatives.
 *
 * Import path: `@mfe/design-system/unstable/overlay-engine`
 */

if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[@mfe/design-system] You are importing from an unstable module ' +
    '(@mfe/design-system/unstable/overlay-engine). This API is NOT ' +
    'covered by semver guarantees and may change without notice. ' +
    'Prefer @mfe/design-system/headless for stable alternatives.'
  );
}

/* ------------------------------------------------------------------ */
/*  Overlay Engine — Centralized overlay infrastructure                */
/*                                                                     */
/*  Provides all the building blocks for overlay-based components:     */
/*  portals, focus trapping, scroll locking, z-index management,       */
/*  outside click detection, positioning, a11y, and motion.            */
/*                                                                     */
/*  Faz 2 — Overlay & Focus Engine                                     */
/* ------------------------------------------------------------------ */

// Existing modules (pre-Faz 2)
export {
  resolveOverlayPosition,
  resolveOverlayArrowPositionClassName,
  type OverlaySide,
  type OverlayAlign,
  type OverlayPosition,
} from "../OverlayPositioning";

export {
  OverlaySurface,
  premiumOverlayPanelClassName,
  premiumOverlayCloseButtonClassName,
  type OverlayCloseReason,
} from "../OverlaySurface";

// Layer Stack — z-index management
export {
  registerLayer,
  unregisterLayer,
  getTopZIndex,
  isTopLayer,
  getLayerStack,
  resetLayerStack,
  Z_INDEX_BASE,
  type ZIndexLayer,
} from "./layer-stack";

// Focus Trap — keyboard focus containment
export {
  useFocusTrap,
  FocusTrap,
  type UseFocusTrapOptions,
  type FocusTrapProps,
} from "./focus-trap";

// Scroll Lock — body scroll prevention
export {
  useScrollLock,
  lockScroll,
  unlockScroll,
  getScrollLockCount,
  resetScrollLock,
} from "./scroll-lock";

// Outside Click — click-away detection
export {
  useOutsideClick,
  useEscapeKey,
  type UseOutsideClickOptions,
} from "./outside-click";

// ARIA Live — screen reader announcements
export {
  announce,
  useAnnounce,
  AriaLiveRegion,
  type AriaLivePoliteness,
} from "./aria-live";

// Roving Tabindex — keyboard navigation in groups
export {
  useRovingTabindex,
  type UseRovingTabindexOptions,
  type RovingTabindexReturn,
  type RovingDirection,
} from "./roving-tabindex";

// Portal — React portal wrapper (legacy)
export {
  Portal,
  usePortal as useLegacyPortal,
  type PortalProps,
} from "./portal";

// Portal — Standardized portal hook (new)
export {
  usePortal,
  type UsePortalOptions,
} from "./usePortal";

// Portal Provider — Global portal configuration
export {
  PortalProvider,
  usePortalConfig,
} from "./PortalProvider";

// Focus Restore — save/restore focus for overlays
export { useFocusRestore } from "./useFocusRestore";

// Reduced Motion — motion preference
export {
  useReducedMotion,
  prefersReducedMotion,
  motionDuration,
  REDUCED_MOTION_CLASS,
} from "./reduced-motion";
