#!/usr/bin/env node
/**
 * @mfe/ds CLI — Block scaffold and management tool
 *
 * Usage:
 *   npx @mfe/ds add <block-name>     Add a block to your project
 *   npx @mfe/ds list [--category]    List available blocks
 *   npx @mfe/ds search <query>       Search blocks
 */

export { generateBlockCode } from './commands/add';
export type { AddResult } from './commands/add';

export { listBlocks } from './commands/list';
export type { ListResult } from './commands/list';

export { searchBlocksCLI } from './commands/search';
export type { SearchResult } from './commands/search';
