import type { SidebarFilterResult } from '../types';
/**
 * Search / filter logic for sidebar items.
 *
 * - Debounces input by 300ms
 * - Provides a `match()` helper that returns character-index ranges for highlighting
 * - Clears on Escape
 */
export declare function useAppSidebarFilter(): SidebarFilterResult;
