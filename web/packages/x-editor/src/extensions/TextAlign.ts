/**
 * Text align extension -- paragraph and heading alignment
 * Wraps @tiptap/extension-text-align
 *
 * Optional peer dependency. Use the loader function below.
 */

export type TextAlignExtension = typeof import('@tiptap/extension-text-align').default;

/**
 * Dynamically load @tiptap/extension-text-align.
 * Returns `null` if the package is not installed.
 */
export async function loadTextAlign(): Promise<TextAlignExtension | null> {
  try {
    const mod = await import('@tiptap/extension-text-align');
    return (mod.default ?? mod) as TextAlignExtension;
  } catch {
    return null;
  }
}
