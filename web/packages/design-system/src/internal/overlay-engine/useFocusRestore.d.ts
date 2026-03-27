/**
 * Saves the currently focused element when the overlay opens,
 * and restores focus to it when the overlay closes.
 *
 * @param isOpen - Whether the overlay is currently open
 *
 * @example
 * ```tsx
 * function Drawer({ open, children }) {
 *   useFocusRestore(open);
 *   return open ? <div>{children}</div> : null;
 * }
 * ```
 */
export declare function useFocusRestore(isOpen: boolean): void;
