export interface UsePortalOptions {
    /** Whether to use a portal. @default true */
    enabled?: boolean;
    /** Custom container element. @default document.body */
    container?: HTMLElement | null;
    /** HTML id attribute for the portal container div. */
    id?: string;
    /** CSS class name applied to the portal container div. */
    className?: string;
    /** Callback fired when the portal container is attached to the DOM. */
    onReady?: (container: HTMLDivElement) => void;
    /** Whether to remove the container from the DOM on cleanup. @default true */
    autoCleanup?: boolean;
}
/**
 * Standardized portal behavior for overlay components.
 * Creates a dedicated container div and cleans up on unmount.
 *
 * @example
 * ```tsx
 * function Overlay({ children }) {
 *   const { Portal } = usePortal();
 *   return (
 *     <Portal>
 *       <div className="overlay">{children}</div>
 *     </Portal>
 *   );
 * }
 *
 * // Render inline (no portal)
 * function InlineOverlay({ children }) {
 *   const { Portal } = usePortal({ enabled: false });
 *   return <Portal>{children}</Portal>;
 * }
 * ```
 */
export declare function usePortal(options?: UsePortalOptions): {
    Portal: import("node_modules/@types/react").FC<{
        children: React.ReactNode;
    }>;
    portalElement: import("react").MutableRefObject<HTMLDivElement | null>;
};
/** Return type of the usePortal hook. */
export type UsePortalReturn = ReturnType<typeof usePortal>;
/** Props interface alias for usePortal options. */
export interface UsePortalProps extends UsePortalOptions {
}
/** Portal container element type. */
export type PortalContainerElement = HTMLDivElement;
