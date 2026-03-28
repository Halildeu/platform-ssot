/**
 * Highlight extension -- text background color marking
 * Wraps @tiptap/extension-highlight
 *
 * Optional peer dependency. Use the loader function below.
 */

export type HighlightExtension = typeof import('@tiptap/extension-highlight').default;

/**
 * Dynamically load @tiptap/extension-highlight.
 * Returns `null` if the package is not installed.
 */
export async function loadHighlight(): Promise<HighlightExtension | null> {
  try {
    const mod = await import('@tiptap/extension-highlight');
    return (mod.default ?? mod) as HighlightExtension;
  } catch {
    return null;
  }
}
