import { getAllBlocks, getBlocksByCategory } from '../../blocks/registry';
import type { BlockMeta } from '../../blocks/types';

export interface ListResult {
  blocks: BlockMeta[];
  total: number;
}

export function listBlocks(category?: string): ListResult {
  const blocks = category
    ? getBlocksByCategory(category as BlockMeta['category'])
    : getAllBlocks();
  return { blocks, total: blocks.length };
}
