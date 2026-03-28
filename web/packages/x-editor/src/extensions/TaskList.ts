/**
 * Task list extension -- checkbox items in editor
 * Wraps @tiptap/extension-task-list + @tiptap/extension-task-item
 *
 * These are optional peer dependencies. Use the loader functions below
 * so that tree-shaking works and consumers without the packages installed
 * are not affected at build time.
 */

export type TaskListExtension = typeof import('@tiptap/extension-task-list').default;
export type TaskItemExtension = typeof import('@tiptap/extension-task-item').default;

/**
 * Dynamically load @tiptap/extension-task-list.
 * Returns `null` if the package is not installed.
 */
export async function loadTaskList(): Promise<TaskListExtension | null> {
  try {
    const mod = await import('@tiptap/extension-task-list');
    return (mod.default ?? mod) as TaskListExtension;
  } catch {
    return null;
  }
}

/**
 * Dynamically load @tiptap/extension-task-item.
 * Returns `null` if the package is not installed.
 */
export async function loadTaskItem(): Promise<TaskItemExtension | null> {
  try {
    const mod = await import('@tiptap/extension-task-item');
    return (mod.default ?? mod) as TaskItemExtension;
  } catch {
    return null;
  }
}
