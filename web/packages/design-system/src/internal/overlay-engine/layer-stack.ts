/* ------------------------------------------------------------------ */
/*  Layer Stack — z-index management for overlays                      */
/*                                                                     */
/*  Manages a stack of overlay layers to ensure proper z-index         */
/*  ordering without hardcoded z-index values. Each new overlay        */
/*  registers itself and gets an auto-incremented z-index.             */
/*                                                                     */
/*  Faz 2.1 — Layer Stack                                              */
/* ------------------------------------------------------------------ */

/* ---- Z-Index Scale ---- */

export const Z_INDEX_BASE = {
  /** Page content */
  content: 0,
  /** Sticky headers, floating action buttons */
  sticky: 100,
  /** Dropdown menus, popovers, tooltips */
  dropdown: 200,
  /** Modal overlays, drawers */
  modal: 300,
  /** Toast notifications */
  toast: 400,
  /** Top-most: spotlight, coachmarks */
  spotlight: 500,
} as const;

export type ZIndexLayer = keyof typeof Z_INDEX_BASE;

/* ---- Layer Stack Manager ---- */

type LayerEntry = {
  id: string;
  layer: ZIndexLayer;
  zIndex: number;
  timestamp: number;
};

let stack: LayerEntry[] = [];
let counter = 0;

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
export function registerLayer(id: string, layer: ZIndexLayer = "dropdown"): number {
  // Remove existing entry with same id (re-registration)
  stack = stack.filter((entry) => entry.id !== id);

  counter += 1;
  const base = Z_INDEX_BASE[layer];
  const zIndex = base + counter;

  stack.push({ id, layer, zIndex, timestamp: Date.now() });
  return zIndex;
}

/**
 * Unregisters a layer from the stack.
 */
export function unregisterLayer(id: string): void {
  stack = stack.filter((entry) => entry.id !== id);
}

/**
 * Returns the current top-most z-index across all layers.
 * Useful for ensuring a new overlay appears above everything.
 */
export function getTopZIndex(): number {
  if (stack.length === 0) return Z_INDEX_BASE.content;
  return Math.max(...stack.map((entry) => entry.zIndex));
}

/**
 * Returns whether the given layer id is the top-most in the stack.
 * Useful for determining which overlay should handle ESC key.
 */
export function isTopLayer(id: string): boolean {
  if (stack.length === 0) return false;
  const topEntry = stack.reduce((top, entry) =>
    entry.zIndex > top.zIndex ? entry : top,
  );
  return topEntry.id === id;
}

/**
 * Returns the current stack for debugging purposes.
 */
export function getLayerStack(): readonly LayerEntry[] {
  return [...stack];
}

/**
 * Resets the layer stack. Only use in tests.
 */
export function resetLayerStack(): void {
  stack = [];
  counter = 0;
}
