import React, { createContext, useContext } from 'react';
import type { BlockCategory, BlockDefinition, BlockRegistry } from './types';

/* ------------------------------------------------------------------ */
/*  Factory                                                            */
/* ------------------------------------------------------------------ */

export function createBlockRegistry(): BlockRegistry {
  const blocks = new Map<string, BlockDefinition>();

  function register(block: BlockDefinition) {
    if (blocks.has(block.id)) {
      console.warn(`[BlockRegistry] Overwriting existing block "${block.id}"`);
    }
    blocks.set(block.id, block);
  }

  function get(id: string): BlockDefinition | undefined {
    return blocks.get(id);
  }

  function getByCategory(category: BlockCategory): BlockDefinition[] {
    return Array.from(blocks.values()).filter((b) => b.category === category);
  }

  function search(query: string): BlockDefinition[] {
    const q = query.toLowerCase();
    return Array.from(blocks.values()).filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return { blocks, register, get, getByCategory, search };
}

/* ------------------------------------------------------------------ */
/*  Default singleton + React context                                  */
/* ------------------------------------------------------------------ */

export const defaultRegistry = createBlockRegistry();

export const BlockRegistryContext = createContext<BlockRegistry>(defaultRegistry);

export function useBlockRegistry(): BlockRegistry {
  return useContext(BlockRegistryContext);
}
