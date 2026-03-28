import React from "react";
export type UseFocusTrapOptions = {
    /** Whether the trap is active */
    active: boolean;
    /** Auto-focus first focusable element on activation */
    autoFocus?: boolean;
    /** Restore focus to previously focused element on deactivation */
    restoreFocus?: boolean;
    /** Ref to the element that should receive initial focus */
    initialFocusRef?: React.RefObject<HTMLElement>;
};
/**
 * Focus trap hook for overlay components.
 *
 * @public Exported for consumer use in custom overlay implementations.
 *
 * @note Built-in overlay components (Dialog, Modal) use native `<dialog>`
 * focus trapping. DetailDrawer and FormDrawer use panel tabIndex for focus
 * containment. This hook is available for consumers building custom overlays
 * that need programmatic focus trapping.
 *
 * @example
 * ```tsx
 * function CustomOverlay({ isOpen, children }) {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(containerRef, isOpen);
 *   return <div ref={containerRef}>{children}</div>;
 * }
 * ```
 */
export declare function useFocusTrap({ active, autoFocus, restoreFocus, initialFocusRef, }: UseFocusTrapOptions): React.RefObject<HTMLDivElement | null>;
/** Props for the FocusTrap component. */
export interface FocusTrapProps {
    /** Whether the trap is active */
    active: boolean;
    /** Auto-focus first element */
    autoFocus?: boolean;
    /** Restore focus on deactivation */
    restoreFocus?: boolean;
    /** Initial focus target */
    initialFocusRef?: React.RefObject<HTMLElement>;
    /** Container className */
    className?: string;
    children: React.ReactNode;
}
/**
 * Component wrapper for focus trap.
 *
 * @example
 * ```tsx
 * <FocusTrap active={isOpen}>
 *   <div>Dialog content with trapped focus</div>
 * </FocusTrap>
 * ```
 */
export declare const FocusTrap: React.FC<FocusTrapProps>;
