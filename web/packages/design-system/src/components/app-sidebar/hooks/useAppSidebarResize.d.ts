import type { SidebarResizeState } from '../types';
interface UseAppSidebarResizeOpts {
    /** Default expanded width (used as initial if nothing stored). */
    defaultWidth: number;
    minWidth?: number;
    maxWidth?: number;
    storageKey?: string;
}
interface UseAppSidebarResizeReturn {
    resizeState: SidebarResizeState;
    setWidth: (w: number) => void;
    setIsResizing: (v: boolean) => void;
}
export declare function useAppSidebarResize({ defaultWidth, minWidth, maxWidth, storageKey, }: UseAppSidebarResizeOpts): UseAppSidebarResizeReturn;
export {};
