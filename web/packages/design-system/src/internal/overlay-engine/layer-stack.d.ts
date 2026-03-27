export declare const Z_INDEX_BASE: {
    /** Page content */
    readonly content: 0;
    /** Sticky headers, floating action buttons */
    readonly sticky: 100;
    /** Dropdown menus, popovers, tooltips */
    readonly dropdown: 200;
    /** Modal overlays, drawers */
    readonly modal: 300;
    /** Toast notifications */
    readonly toast: 400;
    /** Top-most: spotlight, coachmarks */
    readonly spotlight: 500;
};
export type ZIndexLayer = keyof typeof Z_INDEX_BASE;
type LayerEntry = {
    id: string;
    layer: ZIndexLayer;
    zIndex: number;
    timestamp: number;
};
/**
 * Registers a new overlay layer and returns its z-index.
 * Later registrations within the same layer get higher z-indices.
 *
 * @example
 * ```ts
 * const zIndex = registerLayer("my-modal", "modal");
 * // → 301 (first modal), 302 (second modal), etc.
 * ```
 */
export declare function registerLayer(id: string, layer?: ZIndexLayer): number;
/**
 * Unregisters a layer from the stack.
 */
export declare function unregisterLayer(id: string): void;
/**
 * Returns the current top-most z-index across all layers.
 * Useful for ensuring a new overlay appears above everything.
 */
export declare function getTopZIndex(): number;
/**
 * Returns whether the given layer id is the top-most in the stack.
 * Useful for determining which overlay should handle ESC key.
 */
export declare function isTopLayer(id: string): boolean;
/**
 * Returns the current stack for debugging purposes.
 */
export declare function getLayerStack(): readonly LayerEntry[];
/**
 * Resets the layer stack. Only use in tests.
 */
export declare function resetLayerStack(): void;
export {};
