import type React from "react";
export type RovingDirection = "horizontal" | "vertical" | "both";
export type UseRovingTabindexOptions = {
    /** Total number of items */
    itemCount: number;
    /** Initial active index (default: 0) */
    initialIndex?: number;
    /** Arrow key direction */
    direction?: RovingDirection;
    /** Wrap around at ends */
    loop?: boolean;
    /** Called when active index changes */
    onActiveChange?: (index: number) => void;
    /** Disabled item indices */
    disabledIndices?: Set<number>;
};
export type RovingTabindexReturn = {
    /** Currently active (focused) index */
    activeIndex: number;
    /** Set active index programmatically */
    setActiveIndex: (index: number) => void;
    /** Get props for an item at the given index */
    getItemProps: (index: number) => {
        tabIndex: number;
        onKeyDown: (event: React.KeyboardEvent) => void;
        onFocus: () => void;
        "data-roving-active"?: string;
    };
    /** Move to next item */
    moveNext: () => void;
    /** Move to previous item */
    movePrev: () => void;
    /** Move to first item */
    moveFirst: () => void;
    /** Move to last item */
    moveLast: () => void;
};
/**
 * Hook implementing the roving tabindex pattern.
 *
 * @example
 * ```tsx
 * function TabList({ tabs }) {
 *   const roving = useRovingTabindex({
 *     itemCount: tabs.length,
 *     direction: "horizontal",
 *   });
 *
 *   return (
 *     <div role="tablist">
 *       {tabs.map((tab, i) => (
 *         <button key={tab.key} role="tab" {...roving.getItemProps(i)}>
 *           {tab.label}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
/** Props returned for each roving item. */
export type RovingItemProps = ReturnType<RovingTabindexReturn['getItemProps']>;
export declare function useRovingTabindex({ itemCount, initialIndex, direction, loop, onActiveChange, disabledIndices, }: UseRovingTabindexOptions): RovingTabindexReturn;
/** Props interface alias for useRovingTabindex options. */
export interface UseRovingTabindexProps extends UseRovingTabindexOptions {
}
