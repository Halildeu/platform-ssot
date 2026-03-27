/**
 * Locks body scroll. Supports nested calls — only the first call
 * actually locks, and only the last unlock restores.
 */
export declare function lockScroll(): void;
/**
 * Unlocks body scroll. Only actually unlocks when all lock calls
 * have been balanced by unlock calls.
 */
export declare function unlockScroll(): void;
/**
 * Returns current lock count (for debugging).
 */
export declare function getScrollLockCount(): number;
/**
 * Force-resets scroll lock state. Only use in tests.
 */
export declare function resetScrollLock(): void;
/**
 * Hook that locks body scroll while active.
 *
 * @example
 * ```tsx
 * function Modal({ open }) {
 *   useScrollLock(open);
 *   return open ? <div>Modal content</div> : null;
 * }
 * ```
 */
export declare function useScrollLock(active: boolean): void;
