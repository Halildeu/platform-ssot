import { useCallback, useEffect, useRef } from "react";

/**
 * Type-ahead character search for sidebar navigation.
 * When user types characters while sidebar is focused (not in search input),
 * auto-scrolls to and highlights the first matching item.
 */
export function useTypeAhead(
  containerRef: React.RefObject<HTMLElement | null>,
  onMatch: (query: string) => void,
) {
  const bufferRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Only handle printable single characters
      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;

      e.preventDefault();
      bufferRef.current += e.key;
      onMatch(bufferRef.current);

      // Clear buffer after 500ms of inactivity
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, 500);
    },
    [onMatch],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [containerRef, handleKeyDown]);
}
