/**
 * Tiptap extension re-exports
 *
 * Each file wraps a single @tiptap/extension-* package so consumers
 * can import directly from @mfe/x-editor without knowing the
 * underlying Tiptap package names.
 *
 * All extensions use dynamic imports to support optional peer deps.
 */
export { loadTaskList, loadTaskItem } from './TaskList';
export type { TaskListExtension, TaskItemExtension } from './TaskList';

export { loadHighlight } from './Highlight';
export type { HighlightExtension } from './Highlight';

export { loadTextAlign } from './TextAlign';
export type { TextAlignExtension } from './TextAlign';
