/**
 * Roving-tabindex keyboard navigation for sidebar items.
 *
 * Attach `containerRef` to the `<nav>` element. The hook listens for
 * ArrowUp/Down (or j/k), Home/End, Enter/Space and manages focus.
 */
export declare function useAppSidebarKeyboard(enabled: boolean): {
    containerRef: import("react").RefObject<HTMLElement>;
};
