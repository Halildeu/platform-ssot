import { searchBlocks } from '../../blocks/registry';
import type { BlockMeta } from '../../blocks/types';

export interface SearchResult {
  blocks: BlockMeta[];
  query: string;
}

export function searchBlocksCLI(query: string): SearchResult {
  return { blocks: searchBlocks(query), query };
}
