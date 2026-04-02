import { useEffect, useRef, useState } from 'react';

/**
 * Tracks the URL search string without requiring a React Router context.
 * Works in both shell (BrowserRouter provided by shell) and standalone bootstrap.
 */
export function useWindowSearch(): string {
  const [search, setSearch] = useState(
    typeof window !== 'undefined' ? window.location.search : '',
  );
  const searchRef = useRef(search);

  useEffect(() => {
    const onPopState = () => {
      const next = window.location.search;
      if (next !== searchRef.current) {
        searchRef.current = next;
        setSearch(next);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return search;
}
