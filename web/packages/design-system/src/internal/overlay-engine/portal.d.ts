import React from "react";
/**
 * Hook that creates and manages a portal container div.
 * Appends to the target (defaults to document.body) on mount,
 * removes on unmount.
 *
 * @example
 * ```tsx
 * function Overlay({ children }) {
 *   const container = usePortal();
 *   if (!container) return null;
 *   return ReactDOM.createPortal(children, container);
 * }
 * ```
 */
export declare function usePortal(target?: HTMLElement): HTMLElement | null;
/** Props for the Portal component. */
export interface PortalProps {
    /** Content to render inside the portal container. */
    children: React.ReactNode;
    /** Target container element. Defaults to document.body. */
    container?: HTMLElement;
    /** Unique key for the portal instance. */
    key?: string;
    /** Whether the portal is enabled. When false, renders children inline. */
    disabled?: boolean;
    /** Callback fired when the portal container is mounted. */
    onMount?: () => void;
    /** Callback fired when the portal container is unmounted. */
    onUnmount?: () => void;
}
/**
 * Renders children into a portal container outside the parent DOM hierarchy.
 *
 * @example
 * ```tsx
 * <Portal>
 *   <div className="modal-overlay">Modal content</div>
 * </Portal>
 * ```
 */
export declare const Portal: React.FC<PortalProps>;
/** Type alias for Portal ref. */
export type PortalRef = React.Ref<HTMLElement>;
/** Type alias for Portal element. */
export type PortalElement = HTMLElement;
/** Type alias for Portal cssproperties. */
export type PortalCSSProperties = React.CSSProperties;
