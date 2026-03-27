import type React from "react";
export type UseOutsideClickOptions = {
    /** Whether the listener is active */
    active: boolean;
    /** Callback when click outside is detected */
    onOutsideClick: (event: MouseEvent | TouchEvent) => void;
    /** Additional refs to exclude from "outside" detection */
    excludeRefs?: React.RefObject<HTMLElement | null>[];
};
/**
 * Hook that detects clicks outside a referenced element.
 *
 * @example
 * ```tsx
 * function Dropdown({ onClose }) {
 *   const ref = useOutsideClick({
 *     active: true,
 *     onOutsideClick: () => onClose(),
 *   });
 *   return <div ref={ref}>Dropdown content</div>;
 * }
 * ```
 */
export declare function useOutsideClick({ active, onOutsideClick, excludeRefs, }: UseOutsideClickOptions): React.RefObject<HTMLDivElement | null>;
/**
 * Hook for ESC key dismissal. Often used alongside outside-click.
 *
 * @example
 * ```tsx
 * useEscapeKey(isOpen, () => setIsOpen(false));
 * ```
 */
export declare function useEscapeKey(active: boolean, onEscape: () => void): void;
